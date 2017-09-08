export * from "./client";
export * from "./handler";
export declare enum DatagramIntent {
    REQUEST = 0,
    RESPONSE = 1,
    SCHEMA_REQUEST = 2,
    EVENT = 3,
    ID_REQUEST = 4,
}
export interface Datagram {
    id: string;
    intent: DatagramIntent;
    channel: string;
    method?: string;
    params?: string[];
    data?: string;
}
export interface EnvoyOptions {
    port?: number;
    host?: string;
    protocol?: string;
    path?: string;
    WebSocket?: any;
    logger?: any;
    mock?: boolean;
}
export declare const DEFAULT_ENVOY_OPTIONS: EnvoyOptions;
export interface EnvoyEvent {
    name: string;
    payload: any;
}
export interface RequestOptions {
    timeout: number;
}
export declare const DEFAULT_REQUEST_OPTIONS: RequestOptions;
export interface Schema {
}
export declare type MaybeAsync<T> = (T | Promise<T>);
