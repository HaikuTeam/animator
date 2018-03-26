import HaikuGlobal from './HaikuGlobal';

export const GLOBAL_LISTENER_KEY = '*';
export const GENERIC_EVENT_KEY = 'event';

const addClassToGlobalRegistry = (klass: any) => {
  HaikuGlobal[klass.name] = klass;
};

const addClassOfInstanceToGlobalRegistry = (instance: any) => {
  addClassToGlobalRegistry(instance.constructor);
};

const upperCaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelize = (str: string): string => {
  return str.replace(/\W+/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return (index === 0) ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
};

export default class HaikuBase {
  private listeners;

  config; // Implemented by subclass
  parent; // Implemented by subclass

  constructor() {
    this.listeners = {};
    addClassOfInstanceToGlobalRegistry(this);
  }

  on(key: string, listener: Function) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    this.listeners[key].push(listener);
  }

  addEventListener(key: string, listener: Function) {
    this.on(key, listener);
  }

  off(key: string, listener: Function) {
    if (!this.listeners[key]) {
      return;
    }

    for (let i = this.listeners[key].length - 1; i >= 0; i--) {
      if (this.listeners[key][i] === listener) {
        this.listeners[key].splice(i, 1);
      }
    }
  }

  removeEventListener(key: string, listener: Function) {
    this.off(key, listener);
  }

  removeListener(key: string, listener: Function) {
    this.off(key, listener);
  }

  emitToListeners(key: string, args) {
    if (this.listeners[key]) {
      for (let i = 0; i < this.listeners[key].length; i++) {
        this.listeners[key][i].apply(null, args);
      }
    }    
  }

  emitToGenericListeners(key: string, args) {
    if (this.listeners[GLOBAL_LISTENER_KEY]) {
      for (let i = 0; i < this.listeners[GLOBAL_LISTENER_KEY].length; i++) {
        this.listeners[GLOBAL_LISTENER_KEY][i].apply(null, [key].concat(args));
      }
    }
  }

  emit(key: string, ...args) {
    // Specific direct listeners (this.on('foo:bar'))
    this.emitToListeners(key, args);

    // Specific config object listeners (`onHaikuEventFooBar`)
    this.emitToConfigHandlers(key, args);

    // Generic direct listeners (this.on('*'))
    this.emitToGenericListeners(key, args);

    const allArgs = [key].concat(args);

    // Generic config object listeners ('event', 'onEvent', 'onHaikuEvent')
    // for when the subscription name isn't known in advance, e.g. custom events
    this.emitToConfigHandlers(GENERIC_EVENT_KEY, allArgs);
  }

  emitToConfigHandlers(key: string, args) {
    if (!this.config) {
      return;
    }

    // 'somebody:Did-Thing' -> 'somebodyDidThing'
    const keyCamelCase = upperCaseFirstLetter(camelize(key));

    // 'somebodyDidThing' -> 'onSomebodyDidThing'
    const keyCamelCaseWithOnPrefix = `on${keyCamelCase}`;

    if (typeof this.config[keyCamelCaseWithOnPrefix] === 'function') {
      this.config[keyCamelCaseWithOnPrefix].apply(null, args);
    }

    // 'somebodyDidThing' -> 'onHaikuSomebodyDidThing' (legacy)
    const keyCamelCaseWithOnHaikuPrefix = `onHaiku${keyCamelCase}`;

    if (typeof this.config[keyCamelCaseWithOnHaikuPrefix] === 'function') {
      this.config[keyCamelCaseWithOnHaikuPrefix].apply(null, args);
    }
  }
}
