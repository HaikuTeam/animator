// @ts-ignore
import * as qs from 'qs';
import * as WebSocket from 'ws';

import {
  Datagram,
  DatagramIntent,
  DEFAULT_ENVOY_OPTIONS,
  EnvoyEvent,
  EnvoyOptions,
} from '.';
import EnvoyHandler from './EnvoyHandler';

import findOpenPort from './../utils/findOpenPort';
import generateUUIDv4 from './../utils/generateUUIDv4';

import EnvoyLogger from './EnvoyLogger';

type IdentifiableWebSocket = WebSocket & {
  id: string,
};

interface HandlerTuple {
  instance: EnvoyHandler;
  proto: any;
}

const AWAIT_READY_TIMEOUT = 100;
const WS_POLICY_VIOLATION_CODE = 1008;

export default class EnvoyServer {
  host: string;
  port: number;

  private server: WebSocket.Server;
  private isServerReady: boolean;
  private handlerRegistry: Map<string, HandlerTuple>;
  private clientRegistry: Map<string, IdentifiableWebSocket>;
  logger: Console;

  constructor (options?: EnvoyOptions) {
    const mergedOptions = Object.assign({}, DEFAULT_ENVOY_OPTIONS, options);

    this.port = null;
    this.host = null;

    this.isServerReady = false;
    this.handlerRegistry = new Map<string, any>();
    this.clientRegistry = new Map<string, IdentifiableWebSocket>();
    this.logger = mergedOptions.logger || new EnvoyLogger('info', mergedOptions.logger);

    // If present, the passed-in port will be checked for availability, otherwise one will be chosen for us
    findOpenPort(mergedOptions.port, mergedOptions.host, (portErr: Error, host: string, port: number) => {
      if (portErr) {
        throw portErr;
      }

      this.logger.info(`[haiku envoy server] found open port ${port}; establishing on ${mergedOptions.host}`);

      this.server = new WebSocket.Server(
        {
          host,
          port,
        },
        () => {
          this.isServerReady = true;
          this.host = host;
          this.port = port;

          this.logger.info(`[haiku envoy server] ready and listening on port ${this.port} on ${this.host}`);
        },
      );

      this.server.on('error', (err) => {
        // Event emitted right before closing.
        this.logger.warn(`[haiku envoy server] caught error: ${err}`);
      });

      this.server.on('connection', (client: IdentifiableWebSocket, request: any) => {
        const params = getWebsocketConnectionRequestParams(client, request);

        if (mergedOptions.token && params.token !== mergedOptions.token) {
          this.logger.info(`[haiku envoy server] websocket connected with bad token ${params.token}`);
          client.close(WS_POLICY_VIOLATION_CODE, 'forbidden');
          return;
        }

        this.logger.info(`[haiku envoy server] client connected`);

        client.id = generateUUIDv4();
        this.clientRegistry.set(client.id, client);

        client.on('message', (data) => {
          this.logger.info('[haiku envoy server] client sent message: %s', data);
          this.handleRawData(data.toString());
        });

        client.on('close', () => {
          this.logger.info('[haiku envoy server] client connection closed', client);
          this.clientRegistry.delete(client.id);
        });

        client.on('error', (err) => {
          this.logger.info(`[haiku envoy server] error on client ${client.id}, connection closed`, err);
          this.clientRegistry.delete(client.id);
        });
      });
    });
  }

  /**
   * @method close
   * @description Close the server.
   */
  close (): void {
    this.server.close();
  }

  /**
   * @method ready
   * @description Returns a promise that resolves when the server is established
   * and ready to accept connections from websocket clients.
   */
  ready (): Promise<EnvoyServer> {
    const executor = (accept: ((value?: EnvoyServer) => void)) => {
      if (this.server && this.isServerReady) {
        accept(this);
      } else {
        setTimeout(() => executor(accept), AWAIT_READY_TIMEOUT);
      }
    };
    return new Promise(executor);
  }

  emit (channel: string, event: EnvoyEvent) {
    this.broadcast({
      channel,
      data: JSON.stringify(event),
      id: generateUUIDv4(),
      intent: DatagramIntent.EVENT,
    });

    const handler = this.handlerRegistry.get(channel);
    if (handler && handler.instance.handleEventDirectly) {
      handler.instance.handleEventDirectly(event);
    }
  }

  /**
   * Binds the provided Handler object to this channel. Akin to binding a handler to a URI
   * path with an HTTP server—will use this handler to respond to requests at this channel.
   * @param channel the address to bind to, a unique string a la a URI
   * @param handlerClass the CLASS DEFINITION (not instance) of the handler
   * @param handlerInstance optional - if not provided, bindHandler will instantiate an instance of handlerClass
   *   automatically with empty params.
   * @example
   * // will bind sparkleHandler to the channel "Sparkles".
   * // Incoming requests will trigger methods on sparkleHandler
   * myEnvoyServer.bindHandler("Sparkles", sparkleHandler)
   */
  bindHandler (channel: string, handlerClass: any, handlerInstance?: any) {
    // TODO: support spawning a new process/worker for this handler.
    const instance = handlerInstance || new handlerClass();
    this.handlerRegistry.set(channel, {
      instance,
      proto: handlerClass.prototype,
    });
  }

  /**
   * Handle raw datagram data, including deciding whether the datagram
   * is a request or a response and determining how/if to fire a handler
   * @param rawData the datagram object (request or response JSON blob)
   */
  private handleRawData (rawData: string) {
    const data: Datagram = JSON.parse(rawData);
    if (data.intent === DatagramIntent.REQUEST) {
      const handler = this.handlerRegistry.get(data.channel);
      if (handler) {
        const method = handler.instance[data.method];
        if (method && typeof method === 'function') {
          const returnValue = method.apply(handler.instance, data.params);

          if (returnValue && returnValue.then) {
            // Assume this is a promise, and unwrap it before sending response.
            returnValue.then((unwrapped: any) => {
              const response = {
                channel: data.channel,
                data: unwrapped,
                id: data.id,
                intent: DatagramIntent.RESPONSE,
              } as Datagram;
              // TODO: could reply directly to the client that requested instead of broadcasting to all
              //       would require identifying the client (via datagram) & then tracking clientId in future datagrams
              this.broadcast(response);
            })
            .catch((error: Error) => {
              const response = {
                channel: data.channel,
                data: {error: error instanceof Error ? {message: error.message} : error},
                id: data.id,
                intent: DatagramIntent.RESPONSE,
              } as Datagram;
              // TODO: could reply directly to the client that requested instead of broadcasting to all
              //       would require identifying the client (via datagram) & then tracking clientId in future datagrams
              this.broadcast(response);
            });

          } else {
            const response = {
              channel: data.channel,
              data: returnValue,
              id: data.id,
              intent: DatagramIntent.RESPONSE,

            } as Datagram;
            // TODO: could reply directly to the client that requested instead of broadcasting to all
            //       would require identifying the client (via datagram) & then tracking clientId in future datagrams
            this.broadcast(response);
          }

        } else {
          this.logger.warn('Not Found', `Method ${method} not found at ${data.channel}`);
        }
      }
    } else if (data.intent === DatagramIntent.SCHEMA_REQUEST) {
      const handler = this.handlerRegistry.get(data.channel);
      if (handler) {
        const schema = this.discoverSchemaOfHandlerPrototype(handler);
        const response = {
          channel: data.channel,
          data: JSON.stringify(schema),
          id: data.id,
          intent: DatagramIntent.RESPONSE,
        } as Datagram;
        // TODO:  could reply directly to the client that requested instead of broadcasting to all
        //        would require identifying the client (via datagram) & then tracking clientId in future datagrams
        this.broadcast(response);
      }
    } else if (data.intent === DatagramIntent.RESPONSE) {
      // Currently we can ignore on the server.
    }
  }

  /**
   * Sends provided datagram to all connected clients
   * @param datagram
   */
  private broadcast (datagram: Datagram) {
    // TODO:  could detect which channel a client is bound to, then broadcast a given datagram only to the relevant
    // clients. For now, every client gets every response.
    for (const [_, client] of this.clientRegistry) {
      if (client.readyState === 1) {
        // Only update clients with live connections.
        this.logger.info('[haiku envoy server] sending message to client id:' + client.id, datagram);
        this.rawTransmitToClient(datagram, client);
      } else {
        this.logger.info('[haiku envoy server] client is disconnected, id:' + client.id, datagram);
      }
    }
  }

  /**
   * Transmits data to client.  Does not ensure connection first, so will error if connection is broken/missing
   * @param datagram
   * @param client
   */
  private rawTransmitToClient (datagram: Datagram, client: IdentifiableWebSocket) {
    client.send(JSON.stringify(datagram));
  }

  /**
   * Loops across top-level members of handler and finds all functions, which it
   * populates into a schema object.
   */
  private discoverSchemaOfHandlerPrototype (handlerTuple: HandlerTuple): {} {
    const ret = {};
    const proto = handlerTuple.proto;
    const instance = handlerTuple.instance;
    // Note how we append getConfig and setConfig from the parent.
    Object.getOwnPropertyNames(proto).concat(['getConfig', 'setConfig']).forEach((name) => {
      // TODO: handle nested objects & non-method members?
      if (typeof instance[name] === 'function') {
        ret[name] = 'function';
      }
    });
    return ret;
  }
}

function getWebsocketConnectionRequestParams (client: IdentifiableWebSocket, request: any) {
  const url = request.url || '';
  const query = url.split('?')[1] || '';
  const params = qs.parse(query);
  params.url = url;
  return params;
}
