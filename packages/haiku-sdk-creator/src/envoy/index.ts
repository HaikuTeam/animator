export * from './EnvoyClient';
export * from './EnvoyHandler';
export * from './EnvoyLogger';
export * from './EnvoyServer';

export enum DatagramIntent {
    REQUEST,
    RESPONSE,
    SCHEMA_REQUEST,
    EVENT,
    ID_REQUEST,
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
  token?: string; // Access/authentication token
}

export const DEFAULT_ENVOY_OPTIONS: EnvoyOptions = {
  host: '0.0.0.0',
  logger: console,
  mock: false, // In mock mode, clients don't try to connect to the server
  path: '/',
  port: null, // We choose a port automatically if none passed explicitly
  protocol: 'ws',
};

export interface EnvoyEvent {
  name: string;
  payload: any;
}

export interface RequestOptions {
  timeout: number;
}

export const DEFAULT_REQUEST_OPTIONS: RequestOptions = {
  timeout: 5000,
};

/**
 * Simple key-value pair object that describes the topology of a server-side handler
 * @example
 * {
 *   doFoo: "function",
 *   doBar: "function"
 * }
 */
export interface Schema {}

export type MaybeAsync<T> = (T | Promise<T>);
