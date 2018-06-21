import {EnvoyClientEventHandler} from './EnvoyClient';
import EnvoyServer from './EnvoyServer';

export default class EnvoyHandler {
  constructor (protected readonly server: EnvoyServer) {}
  on: (eventName: string, handler: EnvoyClientEventHandler) => void;
  off: (eventName: string, handler: EnvoyClientEventHandler) => void;
}
