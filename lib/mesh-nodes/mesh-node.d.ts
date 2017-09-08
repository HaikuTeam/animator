export declare enum DatagramIntent {
    REQUEST = 0,
    RESPONSE = 1,
    SCHEMA = 2,
}
export interface Datagram {
    id: string;
    intent: DatagramIntent;
    channel: string;
    method: string;
    params: string[];
}
export declare class MeshNode<T> {
    private handlerRegistry;
    private requestRegistry;
    private peer;
    private peers;
    private connection;
    constructor(initiator: boolean);
    bindHandler(path: string, handler: T): void;
    getClient(path: string): Promise<T>;
    private generateUUIDv4();
    private getRemoteSchema(path);
    private broadcast(intent, path, methodName, params, options?);
    private ensureConnection();
    private getMergedQueryOptions(options);
    private handleData(rawData);
    private discoverSchemaOfHandler(handler);
}
