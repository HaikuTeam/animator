import {EnvoyEvent} from '.';
import {EnvoyClientEventHandler} from './EnvoyClient';
import EnvoyServer from './EnvoyServer';

export default class EnvoyHandler {
  constructor (protected readonly server: EnvoyServer) {}

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
}
