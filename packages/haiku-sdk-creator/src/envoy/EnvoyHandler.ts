import {EnvoyEvent} from '.';
import {Registry} from '../dal/Registry';
import {obfuscate, Obfuscation, unobfuscate} from '../utils/crypto';
import {EnvoyClientEventHandler} from './EnvoyClient';
import EnvoyServer from './EnvoyServer';

export default class EnvoyHandler {
  constructor (protected readonly server: EnvoyServer) {}

  protected registry?: Registry;

  private eventHandlers = new Map<string, EnvoyClientEventHandler[]>();

  handleEventDirectly (event: EnvoyEvent) {
    const handlers = this.eventHandlers.get(event.name);
    if (handlers) {
      for (const handler of handlers) {
        handler(event.payload);
      }
    }
  }

  on (eventName: string, handler: EnvoyClientEventHandler) {
    const handlers = this.eventHandlers.get(eventName as string) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventName, handlers);
  }

  off (eventName: string, handler: EnvoyClientEventHandler) {
    const handlers = this.eventHandlers.get(eventName as string) || [];
    const idx = handlers.indexOf(handler);
    if (idx !== -1) {
      handlers.splice(idx, 1);
    }
  }

  setConfig<T> (key: string, value: T) {
    if (this.registry) {
      this.registry.setConfig<T>(key, value);
    }
  }

  getConfig<T> (key: string): T {
    if (this.registry) {
      return this.registry.getConfig<T>(key);
    }
  }

  deleteConfig (key: string) {
    if (this.registry) {
      this.registry.deleteConfig(key);
    }
  }

  setConfigObfuscated<T> (key: string, value: T) {
    this.setConfig<Obfuscation>(key, obfuscate(value));
  }

  getConfigObfuscated<T> (key: string): T {
    return unobfuscate(this.getConfig<Obfuscation>(key));
  }
}
