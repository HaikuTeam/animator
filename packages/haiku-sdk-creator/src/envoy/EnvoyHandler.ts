import {EventEmitter} from 'events';
import {EnvoyClientEventHandler} from './EnvoyClient';
import EnvoyServer from './EnvoyServer';

export default class EnvoyHandler extends EventEmitter {
  constructor (protected readonly server: EnvoyServer) {
    super();
  }
  off: (eventName: string, handler: EnvoyClientEventHandler) => void;
}
