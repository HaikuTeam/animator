import HaikuGlobal from './HaikuGlobal';

export const GLOBAL_LISTENER_KEY = '*';
export const GENERIC_EVENT_KEY = 'event';

const upperCaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const camelize = (str: string): string => {
  return str.replace(/\W+/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return (index === 0) ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
};

const upsertInstanceRegistry = (className: string) => {
  if (!HaikuGlobal.models[className]) {
    HaikuGlobal.models[className] = [];
  }
  return HaikuGlobal.models[className];
};

const getInstanceRegistry = (instance: HaikuBase): HaikuBase[] => {
  const className = instance.getClassName();
  return upsertInstanceRegistry(className);
};

const addInstanceToGlobalModelRegistry = (instance: HaikuBase): number => {
  getInstanceRegistry(instance).push(instance);
  return ++HaikuGlobal.idCounter;
};

const removeInstanceFromGlobalModelRegistry = (instance: HaikuBase): number => {
  const registry = getInstanceRegistry(instance);
  for (let i = 0; i < registry.length; i++) {
    if (registry[i] === instance) {
      registry.splice(i, 1);
      return;
    }
  }
};

const addValueToGlobalCache = (key: string, value: any) => {
  HaikuGlobal.cache[key] = value;
};

const retrieveValueFromGlobalCache = (key: string) => {
  return HaikuGlobal.cache[key];
};

const clearMatchingPropertiesInGlobalCache = (matcher: string) => {
  for (const key in HaikuGlobal.cache) {
    if (key.indexOf(matcher) !== -1) {
      delete HaikuGlobal.cache[key];
    }
  }
};

export default class HaikuBase {
  private listeners;

  $id: number;
  config; // Implemented by subclass
  parent; // Implemented by subclass

  constructor () {
    this.$id = addInstanceToGlobalModelRegistry(this);
    this.listeners = {};
  }

  getId (): number {
    return this.$id;
  }

  getPrimaryKey (): string {
    return `${this.getClassName()}:${this.getId()}`;
  }

  getClassName (): string {
    return (this.constructor as any).__name__;
  }

  buildQualifiedCacheKey (key: string) {
    return `${this.getPrimaryKey()}:${key}`;
  }

  cacheSet (key: string, value: any) {
    addValueToGlobalCache(this.buildQualifiedCacheKey(key), value);
  }

  cacheGet (key: string) {
    return retrieveValueFromGlobalCache(this.buildQualifiedCacheKey(key));
  }

  cacheFetch<T> (key: string, provider: () => T): T {
    const valueExisting = this.cacheGet(key);

    if (valueExisting !== undefined) {
      return valueExisting;
    }

    const valueProvided = provider();
    this.cacheSet(key, valueProvided);

    return valueProvided;
  }

  cacheUnset (key: string) {
    addValueToGlobalCache(this.buildQualifiedCacheKey(key), undefined);
  }

  cacheClear () {
    clearMatchingPropertiesInGlobalCache(this.getPrimaryKey());
  }

  subcacheGet (key: string) {
    return this.cacheGet(key);
  }

  subcacheEnsure (key: string) {
    if (!this.cacheGet(key)) {
      this.cacheSet(key, {});
    }
  }

  subcacheClear (key: string) {
    this.cacheSet(key, {});
  }

  on (key: string, listener: Function) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    this.listeners[key].push(listener);
  }

  addEventListener (key: string, listener: Function) {
    this.on(key, listener);
  }

  off (key: string, listener: Function) {
    if (!this.listeners[key]) {
      return;
    }

    for (let i = this.listeners[key].length - 1; i >= 0; i--) {
      if (this.listeners[key][i] === listener) {
        this.listeners[key].splice(i, 1);
      }
    }
  }

  removeEventListener (key: string, listener: Function) {
    this.off(key, listener);
  }

  removeListener (key: string, listener: Function) {
    this.off(key, listener);
  }

  emitToListeners (key: string, args) {
    if (this.listeners[key]) {
      for (let i = 0; i < this.listeners[key].length; i++) {
        this.listeners[key][i].apply(null, args);
      }
    }
  }

  emitToGenericListeners (key: string, args) {
    if (this.listeners[GLOBAL_LISTENER_KEY]) {
      for (let i = 0; i < this.listeners[GLOBAL_LISTENER_KEY].length; i++) {
        this.listeners[GLOBAL_LISTENER_KEY][i].apply(null, [key].concat(args));
      }
    }
  }

  emitToAncestors (key: string, ...args) {
    return; // no-op; Implemented by subclass
  }

  emit (key: string, ...args) {
    // Specific direct listeners (this.on('foo:bar'))
    this.emitToListeners(key, args);

    // Specific config object listeners (`onHaikuEventFooBar`)
    this.emitToConfigHandlers(key, args);

    // Generic direct listeners (this.on('*'))
    this.emitToGenericListeners(key, args);

    // Emit up the chain
    this.emitToAncestors(key, ...args);

    const allArgs = [key].concat(args);

    // Generic config object listeners ('event', 'onEvent', 'onHaikuEvent')
    // for when the subscription name isn't known in advance, e.g. custom events
    this.emitToConfigHandlers(GENERIC_EVENT_KEY, allArgs);
  }

  emitToConfigHandlers (key: string, args) {
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

  matchesCriteria (criteria): boolean {
    if (!criteria) {
      return false;
    }

    let answer = true;

    for (const key in criteria) {
      if (this[key] !== criteria[key]) {
        answer = false;
      }
    }

    return answer;
  }

  destroy () {
    removeInstanceFromGlobalModelRegistry(this);
  }

  static getRegistryForClass = (klass) => {
    return upsertInstanceRegistry(klass.__name__);
  };
}
