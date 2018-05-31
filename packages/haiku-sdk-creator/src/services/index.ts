export const SERVICES_CHANNEL = 'services';

export interface ImportSpec {
  url: string;
  path: string;
}

export interface TokenExchange {
  code: string;
  state: number;
  stateCheck: string;
}

export type MaybeAsync<T> = T | Promise<T>;

export * from './ServicesHandler';
