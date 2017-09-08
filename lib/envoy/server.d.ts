import * as Promise from "bluebird";
import { EnvoyEvent, EnvoyOptions } from ".";
export default class EnvoyServer {
    host: string;
    port: number;
    private server;
    private isServerReady;
    private handlerRegistry;
    private clientRegistry;
    private logger;
    constructor(options?: EnvoyOptions);
    close(): void;
    ready(): Promise<void>;
    emit(channel: string, event: EnvoyEvent): void;
    bindHandler(channel: string, handlerClass: any, handlerInstance?: any): void;
    private handleRawData(rawData);
    private broadcast(datagram);
    private rawTransmitToClient(datagram, client);
    private discoverSchemaOfHandlerPrototype(handlerTuple);
}
