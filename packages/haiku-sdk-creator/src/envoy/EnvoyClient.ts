import * as Promise from 'bluebird';
import {
  Datagram,
  DatagramIntent,
  DEFAULT_ENVOY_OPTIONS,
  DEFAULT_REQUEST_OPTIONS,
  EnvoyEvent,
  EnvoyOptions,
  RequestOptions,
  Schema,
} from '.';

import EnvoyLogger from './EnvoyLogger';

import generateUUIDv4 from '../utils/generateUUIDv4';

const AWAIT_READY_TIMEOUT = 100;

export default class EnvoyClient<T> {

  private options: EnvoyOptions;
  private datagramQueue: Datagram[];
  private channel: string;
  private isConnected: boolean;
  private outstandingRequests: Map<string, Promise<void>>;
  private socket: WebSocket;
  private connectingPromise: Promise<any>;
  private eventHandlers: Map<string, Function[]>;
  private websocket;
  private logger: Console;
  private schemaCache: Map<string, Schema>;

  constructor(options?: EnvoyOptions) {
    this.options = Object.assign({}, DEFAULT_ENVOY_OPTIONS, options);
    this.schemaCache = new Map<string, Schema>();
    this.isConnected = false;
    this.websocket = this.options.WebSocket;
    this.datagramQueue = [];
    this.outstandingRequests = new Map<string, Promise<void>>();
    this.eventHandlers = new Map<string, Function[]>();
    this.logger = this.options.logger || new EnvoyLogger('warn', this.options.logger);
    this.connect(this.options);
  }

  /**
   * Retrieves a client bound to the handler at specified channel on remote server
   * @param channel unique string representing the channel of the handler
   * that this client should be bound to
   */
  get(channel: string): Promise<T> {
    // Since mock mode skips the connection, there's nothing to retrieve, and
    // we will just go ahead and return ourselves early instead of schema discovery
    if (this.isInMockMode()) {
      let mockMe = <T>{};
      mockMe = this.addEventLogic(mockMe); // Only adds an 'on' method
      return Promise.resolve(mockMe);
    }

    return this.getRemoteSchema(channel).then((schema: Schema) => {
      let returnMe = <T>{};

      for (const key in schema) {
        const property = <string>key;
        // TODO:  if we want to support other topologies (vs. only-top-level-functions,) we
        // can implement deserialization/handling logic here
        if (schema[key] === 'function') {

          // Set the new function behavior.
          returnMe[property] = ((prop) => {
            return (...args) => {

              // Ask server for a response.
              // For now, return only first response received.
              const datagram = <Datagram>{
                channel,
                intent: DatagramIntent.REQUEST,
                method: prop,
                params: args,
              };

              return this.send(datagram);
            };
          })(property);
        }
      }

      returnMe = this.addEventLogic(returnMe);

      return returnMe;
    });
  }

  /**
   * @method getOption
   * @description Returns the option of the given key
   */
  getOption(key: string): any {
    return this.options[key];
  }

  /**
   * @method closeConnection
   * @description Close the websocket connection
   */
  closeConnection() {
    return this.socket.close();
  }

  /**
   * @method isInMockMode
   * @description Returns true/false whether we are in mock mode.
   * Used in dev/testing when we don't have a real socket connection.
   * Be aware that changing this will impact unit tests and dev tools.
   */
  isInMockMode(): boolean {
    return this.getOption('mock');
  }

  /**
   * Adds the `.on` method to a generated client, so consumers can subscribe to events
   * @param subject
   */
  private addEventLogic(subject: T): T {
    subject['on'] = (eventName: string, handler: Function) => {
      const handlers = this.eventHandlers.get(eventName) || [];
      handlers.push(handler);
      this.eventHandlers.set(eventName, handlers);
    };

    subject['off'] = (eventName: string, handler: Function) => {
      const handlers = this.eventHandlers.get(eventName) || [];
      const idx = handlers.indexOf(handler);
      if (idx !== -1) {
        handlers.splice(idx, 1);
        this.eventHandlers.set(eventName, handlers);
      }
    };

    return subject;
  }

  /**
   * @method ready
   * @description Returns a promise that resolves when the client has connected to the server
   */
  ready(): Promise<void> {
    return new Promise(function executor(resolve) {
      if (this.isInMockMode() || this.isConnected) {
        resolve(this);
      } else {
        setTimeout(executor.bind(this, resolve), AWAIT_READY_TIMEOUT);
      }
    }.bind(this));
  }

  /**
   * Returns a promise that will be resolved when the connection to the remote server succeeds
   * @param options
   */
  private connect(options: EnvoyOptions): Promise<void> {
    this.options = options;
    if (this.isInMockMode() || this.isConnected) {
      return Promise.resolve();
    }

    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    const url = `${options.protocol}://${options.host}:${options.port}${options.path}?token=${options.token}`;

    this.logger.info('[haiku envoy client] connecting to websocket server %s', url);

    this.connectingPromise = new Promise((accept, _) => {
      this.socket = new this.websocket(url);

      this.socket.addEventListener('open', () => {
        this.isConnected = true;
        this.connectingPromise = null;
        this.logger.info('[haiku envoy client] websocket connection opened');
        accept();
      });

      this.socket.addEventListener('message', (evt) => {
        this.handleRawReceivedData(evt.data);
      });

      this.socket.addEventListener('close', () => {
        this.isConnected = false;
        this.logger.info('[haiku envoy client] websocket connection closed');
      });
    });

    return this.connectingPromise;
  }

  /**
   * For a given string message received from remote, parses it
   * and responds to it if needed
   * @param data
   */
  private handleRawReceivedData(data: string) {
    // If this is a response & the request id is in outstanding requests, resolve the stored promise w/ data.
    const datagram = <Datagram>JSON.parse(data);
    if (datagram.intent === DatagramIntent.RESPONSE && this.outstandingRequests.get(datagram.id)) {
      // this.logger.info('[haiku envoy client] received data', datagram.data);

      //parse this for the client if it's JSON
      // let payload = undefined;
      // try {
      //   payload = JSON.parse(datagram.data);
      // } catch (e) {
      //   payload = datagram.data;
      // }

      // TODO: Fix Bluebird typing error by removing any
      (this.outstandingRequests.get(datagram.id) as any)(datagram.data);
      this.outstandingRequests.delete(datagram.id);
    } else if (datagram.intent === DatagramIntent.EVENT) {
      const event = <EnvoyEvent>JSON.parse(datagram.data);
      const handlers = this.eventHandlers.get(event.name);

      if (handlers && handlers.length) {
        for (let i = 0; i < handlers.length; i++) {
          ((handler) => {
            handler(event.payload);
          })(handlers[i]);
        }
      }

    }

  }

  /**
   * Ensures connection once, then loops through queue and transmits
   * each datagram in the order enqueued
   */
  private flushQueue() {
    return new Promise((accept) => {
      // this.logger.info('[haiku envoy client] flushing queue');
      while (this.datagramQueue.length) {
        const datagram = this.datagramQueue.shift();
        this.connect(this.options).then(() => {
          this.rawTransmit(datagram);
        });
      }
      accept();
    });
  }

  /**
   * Perform transmission of given datagram.  Will not check for connectivity, thus
   * will error if connection is broken
   * @param datagram
   */
  private rawTransmit(datagram: Datagram) {
    // this.logger.info('[haiku envoy client] transmitting data', datagram);
    this.socket.send(JSON.stringify(datagram));
  }

  /**
   * Convenience method returning a promise that will reject in `duration` ms
   * @param duration time in ms before the generated promise should be rejected
   */
  private generateTimeoutPromise(duration: number) {
    return new Promise<void>((accept, reject) => {
      setTimeout(reject.bind(this, new Error('[haiku envoy client] connection timed out')), duration);
    });
  }

  /**
   * Sends datagram, returning a promise that will resolve with the response (if requested)
   * or immediately if not a request
   * @param datagram
   * @param requestOptions
   */
  private send(datagram: Datagram, requestOptions?: RequestOptions): Promise<any> {
    return new Promise<any>((accept, _) => {
      const mergedOptions = Object.assign({}, DEFAULT_REQUEST_OPTIONS, requestOptions);

      const requestId = generateUUIDv4();
      datagram.id = requestId;
      this.datagramQueue.push(datagram);
      this.flushQueue();
      if (datagram.intent === DatagramIntent.REQUEST || datagram.intent === DatagramIntent.SCHEMA_REQUEST) {
        // Await a response (or timeout, whichever comes first).
        const timeout = this.generateTimeoutPromise(mergedOptions.timeout);

        // TODO: Fix Bluebird typing error by removing any
        const success = new Promise<any>((acceptInner: any) => {
          this.outstandingRequests.set(datagram.id, acceptInner);
        });

        return Promise
          .race([timeout, success])
          .then(
          (data) => {
            // SUCCESS
            accept(data);
          },
          () => {
            // TIMEOUT
            this.logger.warn(
              '[haiku envoy client] response timed out [configured @ ' + mergedOptions.timeout + 'ms]');
            this.outstandingRequests.delete(requestId);
          },
        );
      }

      accept();
    });
  }

  /**
   * Convenience wrapper around querying peers for a SCHEMA at a given channel
   */
  private getRemoteSchema(channel: string): Promise<Schema> {
    const foundSchema = this.schemaCache.get(channel);
    if (foundSchema) {
      return Promise.resolve(foundSchema);
    }

    return this.send(<Datagram>{
      channel,
      id: generateUUIDv4(),
      intent: DatagramIntent.SCHEMA_REQUEST,
      method: '',
      params: [],
    }).then((data) => {
      const loadedSchema = <Schema>JSON.parse(data);
      if (loadedSchema) {
        this.schemaCache.set(channel, loadedSchema);
      }
      return loadedSchema;
    });
  }

}
