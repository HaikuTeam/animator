"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const logger_1 = require("./logger");
const generateUUIDv4_1 = require("./../utils/generateUUIDv4");
const Promise = require("bluebird");
const AWAIT_READY_TIMEOUT = 100;
class EnvoyClient {
    constructor(options) {
        this.options = Object.assign({}, _1.DEFAULT_ENVOY_OPTIONS, options);
        this.isConnected = false;
        this.WebSocket = this.options.WebSocket;
        this.datagramQueue = [];
        this.outstandingRequests = new Map();
        this.eventHandlers = new Map();
        this.logger = this.options.logger || new logger_1.default("warn", this.options.logger);
        this.connect(this.options);
    }
    get(channel) {
        if (this.isInMockMode()) {
            let mockMe = {};
            mockMe = this.addEventLogic(mockMe);
            return Promise.resolve(mockMe);
        }
        return this.getRemoteSchema(channel).then((schema) => {
            let returnMe = {};
            for (const key in schema) {
                const property = key;
                if (schema[key] === "function") {
                    returnMe[property] = ((prop) => {
                        return (...args) => {
                            const datagram = {
                                channel,
                                intent: _1.DatagramIntent.REQUEST,
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
    getOption(key) {
        return this.options[key];
    }
    closeConnection() {
        return this.socket.close();
    }
    isInMockMode() {
        return this.getOption("mock");
    }
    addEventLogic(subject) {
        subject["on"] = (eventName, handler) => {
            const handlers = this.eventHandlers.get(eventName) || [];
            handlers.push(handler);
            this.eventHandlers.set(eventName, handlers);
        };
        return subject;
    }
    ready() {
        return new Promise(function executor(resolve) {
            if (this.isInMockMode() || this.isConnected)
                resolve(this);
            else
                setTimeout(executor.bind(this, resolve), AWAIT_READY_TIMEOUT);
        }.bind(this));
    }
    connect(options) {
        this.options = options;
        if (this.isInMockMode())
            return Promise.resolve();
        if (this.isConnected)
            return Promise.resolve();
        if (this.connectingPromise) {
            return this.connectingPromise;
        }
        else {
            const url = options.protocol + "://" + options.host + ":" + options.port + options.path;
            this.logger.info("[haiku envoy client] connecting to websocket server %s", url);
            this.connectingPromise = new Promise((accept, reject) => {
                this.socket = new this.WebSocket(url);
                this.socket.addEventListener("open", () => {
                    this.isConnected = true;
                    this.connectingPromise = null;
                    this.logger.info("[haiku envoy client] websocket connection opened");
                    accept();
                });
                this.socket.addEventListener("message", (evt) => {
                    this.handleRawReceivedData(evt.data);
                });
                this.socket.addEventListener("close", () => {
                    this.isConnected = false;
                    this.logger.info("[haiku envoy client] websocket connection closed");
                });
            });
            return this.connectingPromise;
        }
    }
    handleRawReceivedData(data) {
        const datagram = JSON.parse(data);
        if (datagram.intent === _1.DatagramIntent.RESPONSE && this.outstandingRequests.get(datagram.id)) {
            this.logger.info("[haiku envoy client] received data", datagram.data);
            this.outstandingRequests.get(datagram.id)(datagram.data);
            this.outstandingRequests.delete(datagram.id);
        }
        else if (datagram.intent === _1.DatagramIntent.EVENT) {
            const event = JSON.parse(datagram.data);
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
    flushQueue() {
        return this.connect(this.options).then(() => {
            this.logger.info("[haiku envoy client] flushing queue");
            while (this.datagramQueue.length) {
                this.rawTransmit(this.datagramQueue.shift());
            }
        });
    }
    rawTransmit(datagram) {
        this.logger.info("[haiku envoy client] transmitting data", datagram);
        this.socket.send(JSON.stringify(datagram));
    }
    generateTimeoutPromise(duration) {
        return new Promise((accept, reject) => {
            setTimeout(reject.bind(this, new Error("[haiku envoy client] connection timed out")), duration);
        });
    }
    send(datagram, requestOptions) {
        return new Promise((accept, reject) => {
            const mergedOptions = Object.assign({}, _1.DEFAULT_REQUEST_OPTIONS, requestOptions);
            const requestId = generateUUIDv4_1.default();
            datagram.id = requestId;
            this.datagramQueue.push(datagram);
            this.flushQueue();
            if (datagram.intent === _1.DatagramIntent.REQUEST || datagram.intent === _1.DatagramIntent.SCHEMA_REQUEST) {
                const timeout = this.generateTimeoutPromise(mergedOptions.timeout);
                const success = new Promise((acceptInner) => {
                    this.outstandingRequests.set(datagram.id, acceptInner);
                });
                return Promise
                    .race([timeout, success])
                    .then((data) => {
                    accept(data);
                }, () => {
                    this.logger.warn("[haiku envoy client] response timed out [configured @ " + mergedOptions.timeout + "ms]");
                    this.outstandingRequests.delete(requestId);
                });
            }
            else {
                accept();
            }
        });
    }
    getRemoteSchema(channel) {
        return this.send({
            channel,
            id: generateUUIDv4_1.default(),
            intent: _1.DatagramIntent.SCHEMA_REQUEST,
            method: "",
            params: [],
        }).then((data) => {
            return JSON.parse(data);
        });
    }
}
exports.default = EnvoyClient;
//# sourceMappingURL=client.js.map