export declare enum DatagramDirection {
    REQUEST = 0,
    RESPONSE = 1,
}
export interface Datagram {
    type: DatagramDirection;
    path: string;
    method: string;
    params: string[];
}
export declare class MeshNode<T> {
    private handlerRegistry;
    private requestRegistry;
    private peer;
    constructor(channel: string, options: any);
    bindHandler(path: string, handler: T): void;
    bindClient(path: string, clientTemplate: T): T;
    private queryPeers(path, methodName, params, options?);
    private handleData(data);
}
