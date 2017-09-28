import { EnvoyOptions } from ".";
import * as Promise from "bluebird";
export default class EnvoyClient<T> {
    private options;
    private datagramQueue;
    private channel;
    private isConnected;
    private outstandingRequests;
    private socket;
    private connectingPromise;
    private eventHandlers;
    private WebSocket;
    private logger;
    private schemaCache;
    constructor(options?: EnvoyOptions);
    get(channel: string): Promise<T>;
    getOption(key: string): any;
    closeConnection(): void;
    isInMockMode(): boolean;
    private addEventLogic(subject);
    ready(): Promise<void>;
    private connect(options);
    private handleRawReceivedData(data);
    private flushQueue();
    private rawTransmit(datagram);
    private generateTimeoutPromise(duration);
    private send(datagram, requestOptions?);
    private getRemoteSchema(channel);
}
