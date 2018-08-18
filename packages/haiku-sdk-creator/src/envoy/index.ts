export * from './EnvoyClient';
export * from './EnvoyLogger';
export * from './EnvoyServer';

export enum DatagramIntent {
  REQUEST,
  RESPONSE,
  SCHEMA_REQUEST,
  EVENT,
}

export type EnvoySerializable = any;

export type ClientRequestCallback = (data: EnvoySerializable) => void;

export interface Datagram {
  id: string;
  intent: DatagramIntent;
  channel: string;
  method?: string;
  params?: string[];
  data?: EnvoySerializable;
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
  host: global.process.env.HAIKU_PLUMBING_HOST || '127.0.0.1',
  logger: null, // By default we use the centralized logging instance
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
  timeout: 60000,
};

export type MaybeAsync<T> = (T | Promise<T>);
