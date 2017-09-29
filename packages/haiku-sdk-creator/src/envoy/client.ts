import {
    Datagram,
    DatagramIntent,
    DEFAULT_ENVOY_OPTIONS,
    DEFAULT_REQUEST_OPTIONS,
    EnvoyEvent,
    EnvoyOptions,
    RequestOptions,
    Schema,
} from "."

import EnvoyLogger from "./logger"

import generateUUIDv4 from "./../utils/generateUUIDv4"

import * as Promise from "bluebird"

const AWAIT_READY_TIMEOUT = 100

export default class EnvoyClient<T> {

    private options: EnvoyOptions
    private datagramQueue: Datagram[]
    private channel: string
    private isConnected: boolean
    private outstandingRequests: Map<string, Promise<void>>
    private socket: WebSocket
    private connectingPromise: Promise<any>
    private eventHandlers: Map<string, Function[]>
    private WebSocket
    private logger: Console

    constructor(options?: EnvoyOptions) {
        this.options = Object.assign({}, DEFAULT_ENVOY_OPTIONS, options)
        this.isConnected = false
        this.WebSocket = this.options.WebSocket
        this.datagramQueue = []
        this.outstandingRequests = new Map<string, Promise<void>>()
        this.eventHandlers = new Map<string, Function[]>()
        this.logger = this.options.logger || new EnvoyLogger("warn", this.options.logger)
        this.connect(this.options)
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
            let mockMe = <T> {}
            mockMe = this.addEventLogic(mockMe) // Only adds an 'on' method
            return Promise.resolve(mockMe)
        }

        return this.getRemoteSchema(channel).then((schema: Schema) => {
            let returnMe = <T> {}

            for (const key in schema) {
                const property = <string> key
                //TODO:  if we want to support other topologies (vs. only-top-level-functions,) we
                //       can implement deserialization/handling logic here
                if (schema[key] === "function") {

                    //set the new function behavior
                    returnMe[property] = ((prop) => {
                        return (...args) => {

                            //Ask server for a response.
                            //For now, return only first response received.
                            const datagram = <Datagram> {
                                channel,
                                intent: DatagramIntent.REQUEST,
                                method: prop,
                                params: args,
                            }

                            return this.send(datagram)
                        }
                    })(property)
                }
            }

            returnMe = this.addEventLogic(returnMe)

            return returnMe
        })
    }

    /**
     * @method getOption
     * @description Returns the option of the given key
     */
    getOption(key: string): any {
        return this.options[key]
    }

    /**
     * @method closeConnection
     * @description Close the websocket connection
     */
    closeConnection() {
        return this.socket.close()
    }

    /**
     * @method isInMockMode
     * @description Returns true/false whether we are in mock mode.
     * Used in dev/testing when we don't have a real socket connection.
     * Be aware that changing this will impact unit tests and dev tools.
     */
    isInMockMode(): boolean {
        return this.getOption("mock")
    }

    /**
     * Adds the `.on` method to a generated client, so consumers can subscribe to events
     * @param subject
     */
    private addEventLogic(subject: T): T {
        subject["on"] = (eventName: string, handler: Function) => {
            const handlers = this.eventHandlers.get(eventName) || []
            handlers.push(handler)
            this.eventHandlers.set(eventName, handlers)
        }

        subject["off"] = (eventName: string, handler: Function) => {
            const handlers = this.eventHandlers.get(eventName) || []
            const idx = handlers.indexOf(handler)
            handlers.splice(idx, 1)
            this.eventHandlers.set(eventName, handlers)
        }

        return subject
    }

    /**
     * @method ready
     * @description Returns a promise that resolves when the client has connected to the server
     */
    ready(): Promise<void> {
          return new Promise(function executor(resolve) {
                if (this.isInMockMode() || this.isConnected) resolve(this)
                else setTimeout(executor.bind(this, resolve), AWAIT_READY_TIMEOUT)
          }.bind(this))
    }

    /**
     * Returns a promise that will be resolved when the connection to the remote server succeeds
     * @param options
     */
    private connect(options: EnvoyOptions): Promise<void> {
        this.options = options
        if (this.isInMockMode()) return Promise.resolve()
        if (this.isConnected) return Promise.resolve()
        if (this.connectingPromise) {
            return this.connectingPromise
        } else {
            const url = options.protocol + "://" + options.host + ":" + options.port + options.path
            this.logger.info("[haiku envoy client] connecting to websocket server %s", url)

            this.connectingPromise = new Promise((accept, reject) => {
                this.socket = new this.WebSocket(url)

                this.socket.addEventListener("open", () => {
                    this.isConnected = true
                    this.connectingPromise = null
                    this.logger.info("[haiku envoy client] websocket connection opened")
                    accept()
                })

                this.socket.addEventListener("message", (evt) => {
                    this.handleRawReceivedData(evt.data)
                })

                this.socket.addEventListener("close", () => {
                    this.isConnected = false
                    this.logger.info("[haiku envoy client] websocket connection closed")
                })
            })
            return this.connectingPromise
        }
    }

    /**
     * For a given string message received from remote, parses it
     * and responds to it if needed
     * @param data
     */
    private handleRawReceivedData(data: string) {
        //if this is a response & the request id is in outstanding requests, resolve the stored promise w/ data
        const datagram = <Datagram> JSON.parse(data)
        if (datagram.intent === DatagramIntent.RESPONSE && this.outstandingRequests.get(datagram.id)) {
            this.logger.info("[haiku envoy client] received data", datagram.data)
            this.outstandingRequests.get(datagram.id)(datagram.data)
            this.outstandingRequests.delete(datagram.id)
        } else if (datagram.intent === DatagramIntent.EVENT) {
            const event = <EnvoyEvent> JSON.parse(datagram.data)
            const handlers = this.eventHandlers.get(event.name)
            if (handlers && handlers.length) {
                for (let i = 0; i < handlers.length; i++) {
                    ((handler) => {
                        handler(event.payload)
                    })(handlers[i])
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
            this.logger.info("[haiku envoy client] flushing queue")
            while (this.datagramQueue.length) {
                const datagram = this.datagramQueue.shift()
                this.connect(this.options).then(() => {
                    this.rawTransmit(datagram)
                })
            }
            accept()
        })
    }

    /**
     * Perform transmission of given datagram.  Will not check for connectivity, thus
     * will error if connection is broken
     * @param datagram
     */
    private rawTransmit(datagram: Datagram) {
        this.logger.info("[haiku envoy client] transmitting data", datagram)
        this.socket.send(JSON.stringify(datagram))
    }

    /**
     * Convenience method returning a promise that will reject in `duration` ms
     * @param duration time in ms before the generated promise should be rejected
     */
    private generateTimeoutPromise(duration: number) {
        return new Promise<void>((accept, reject) => {
            setTimeout(reject.bind(this, new Error("[haiku envoy client] connection timed out")), duration)
        })
    }

    /**
     * Sends datagram, returning a promise that will resolve with the response (if requested)
     * or immediately if not a request
     * @param datagram
     * @param requestOptions
     */
    private send(datagram: Datagram, requestOptions?: RequestOptions): Promise<any> {
        return new Promise<any>((accept, reject) => {
            const mergedOptions = Object.assign({}, DEFAULT_REQUEST_OPTIONS, requestOptions)

            const requestId = generateUUIDv4()
            datagram.id = requestId
            this.datagramQueue.push(datagram)
            this.flushQueue()
            if (datagram.intent === DatagramIntent.REQUEST || datagram.intent === DatagramIntent.SCHEMA_REQUEST) {
                //await a response (or timeout, whichever comes first)
                const timeout = this.generateTimeoutPromise(mergedOptions.timeout)

                const success = new Promise<any>((acceptInner) => {
                    this.outstandingRequests.set(datagram.id, acceptInner)
                })

                return Promise
                    .race([timeout, success])
                    .then((data) => {
                        //SUCCESS
                        accept(data)
                    }, () => {
                        //TIMEOUT
                        this.logger.warn("[haiku envoy client] response timed out [configured @ " + mergedOptions.timeout + "ms]")
                        this.outstandingRequests.delete(requestId)
                    })
            } else {
                accept()
            }
        })
    }

    /**
     * Convenience wrapper around querying peers for a SCHEMA at a given channel
     * @param path
     */
    private getRemoteSchema(channel: string): Promise<Schema> {
        return this.send(<Datagram> {
            channel,
            id: generateUUIDv4(),
            intent: DatagramIntent.SCHEMA_REQUEST,
            method: "",
            params: [],
        }).then((data) => {
            return <Schema> JSON.parse(data)
        })
    }

}
