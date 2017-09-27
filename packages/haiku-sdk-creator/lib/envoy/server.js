"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const WebSocket = require("ws");
const _1 = require(".");
const findOpenPort_1 = require("./../utils/findOpenPort");
const generateUUIDv4_1 = require("./../utils/generateUUIDv4");
const logger_1 = require("./logger");
const AWAIT_READY_TIMEOUT = 100;
class EnvoyServer {
    constructor(options) {
        const mergedOptions = Object.assign({}, _1.DEFAULT_ENVOY_OPTIONS, options);
        this.port = null;
        this.host = null;
        this.isServerReady = false;
        this.handlerRegistry = new Map();
        this.clientRegistry = new Map();
        this.logger = mergedOptions.logger || new logger_1.default("info", mergedOptions.logger);
        findOpenPort_1.default(mergedOptions.port, mergedOptions.host, (portErr, port) => {
            if (portErr) {
                throw portErr;
            }
            this.logger.info(`[haiku envoy server] found open port ${port}; establishing on ${mergedOptions.host}`);
            this.server = new WebSocket.Server({ host: mergedOptions.host, port }, (serverErr) => {
                if (serverErr) {
                    throw serverErr;
                }
                this.isServerReady = true;
                this.host = mergedOptions.host;
                this.port = port;
                this.logger.info(`[haiku envoy server] ready and listening on port ${this.port} on ${this.host}`);
            });
            this.server.on("connection", (client) => {
                this.logger.info(`[haiku envoy server] client connected`);
                client.id = generateUUIDv4_1.default();
                this.clientRegistry.set(client.id, client);
                client.on("message", (data) => {
                    this.logger.info("[haiku envoy server] client sent message: %s", data);
                    this.handleRawData(data.toString());
                });
                client.on("close", () => {
                    this.logger.info("[haiku envoy server] client connection closed", client);
                    this.clientRegistry.delete(client.id);
                });
                client.on("error", (err) => {
                    console.log(`[haiku envoy server] error on client ${client.id}, connection closed`, err);
                    this.clientRegistry.delete(client.id);
                });
            });
        });
    }
    close() {
        this.server.close();
    }
    ready() {
        return new Promise(function executor(resolve) {
            if (this.server && this.isServerReady)
                resolve(this);
            else
                setTimeout(executor.bind(this, resolve), AWAIT_READY_TIMEOUT);
        }.bind(this));
    }
    emit(channel, event) {
        this.broadcast({
            channel,
            data: JSON.stringify(event),
            id: generateUUIDv4_1.default(),
            intent: _1.DatagramIntent.EVENT,
        });
    }
    bindHandler(channel, handlerClass, handlerInstance) {
        const instance = handlerInstance || new handlerClass();
        this.handlerRegistry.set(channel, { instance, proto: handlerClass.prototype });
    }
    handleRawData(rawData) {
        const data = JSON.parse(rawData);
        if (data.intent === _1.DatagramIntent.REQUEST) {
            const handler = this.handlerRegistry.get(data.channel);
            if (handler) {
                const method = handler.instance[data.method];
                if (method && typeof method === "function") {
                    const returnValue = method.apply(handler.instance, data.params);
                    const response = {
                        channel: data.channel,
                        data: returnValue,
                        id: data.id,
                        intent: _1.DatagramIntent.RESPONSE,
                    };
                    this.broadcast(response);
                }
                else {
                    this.logger.warn("Not Found", `Method ${method} not found at ${data.channel}`);
                }
            }
        }
        else if (data.intent === _1.DatagramIntent.SCHEMA_REQUEST) {
            const handler = this.handlerRegistry.get(data.channel);
            if (handler) {
                const schema = this.discoverSchemaOfHandlerPrototype(handler);
                const response = {
                    channel: data.channel,
                    data: JSON.stringify(schema),
                    id: data.id,
                    intent: _1.DatagramIntent.RESPONSE,
                };
                this.broadcast(response);
            }
        }
        else if (data.intent === _1.DatagramIntent.RESPONSE) {
        }
    }
    broadcast(datagram) {
        for (const [id, client] of this.clientRegistry) {
            this.logger.info("[haiku envoy server] sending message to client id:" + client.id, datagram);
            this.rawTransmitToClient(datagram, client);
        }
    }
    rawTransmitToClient(datagram, client) {
        client.send(JSON.stringify(datagram));
    }
    discoverSchemaOfHandlerPrototype(handlerTuple) {
        const ret = {};
        const proto = handlerTuple.proto;
        const instance = handlerTuple.instance;
        Object.getOwnPropertyNames(proto).forEach((name) => {
            if (typeof instance[name] === "function") {
                ret[name] = "function";
            }
        });
        return ret;
    }
}
exports.default = EnvoyServer;
//# sourceMappingURL=server.js.map