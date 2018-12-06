const {EventEmitter} = require('events');
const lodash = require('lodash');
const Cache = require('./Cache');
const MemoryStorage = require('./storage/MemoryStorage');
const DiskStorage = require('./storage/DiskStorage');
const CryptoUtils = require('./../utils/CryptoUtils');
const EmitterManager = require('./../utils/EmitterManager');
const logger = require('./../utils/LoggerInstance');
const expressionToRO = require('@haiku/core/lib/reflection/expressionToRO').default;
const reifyRO = require('@haiku/core/lib/reflection/reifyRO').default;

const SYNC_DEBOUNCE_TIME = 100; // ms

/**
 * @class BaseModel
 * @description
 *  Base model class from which all entities in haiku-serialization/src/bll inherit.
 *  (Note: This author does not care if we call these models "BLL" entities or not;
 *  the point is that these are extremely useful; call them 'Snogglegorks' if you want.)
 *
 *  Here's what BaseModel provides:
 *    - Upsert functionality (reuse objects with the same uid)
 *     - Event emitter API for cross-entity communication
 *    - Model collection querying (Model.where, Model.find, etc.)
 *    - Built-in caching API
 *    - Handles object creation/destruction and updating the collection
 *
 *  Every instance of a subclass of BaseModel has a uid which is used to determine whether
 *  to create a new instance or return an existing instance when MyClass.upsert({}) is called.
 *  It's up to the caller to provide a uid appropriate to the model.
 *
 *  Author's note:
 *
 *  This collection of models has begun with some mixed responsibilities, including:
 *    - Dealing with view-related logic (view-model layer)
 *    - Serialization and writing to disk (DAL)
 *    - Communication transport app views (transport layer)
 *    - App business logic (BLL)
 *
 *  But keep in mind we can refactor these models to fit those divisions as we go. #TODO
 *  (Keep in mind that ALL of this logic used to live buried deep in a quagmire
 *  of tangled React-specific UI logic that had become almost impossible to work with.)
 */
class BaseModel extends EventEmitter {
  constructor (props, opts) {
    super();

    EmitterManager.extend(this);

    if (!this.constructor.extended) {
      throw new Error(`You must call BaseModel.extend(${this.constructor.name})`);
    }

    if (!this.options) {
      this.options = {};
    }

    this.setOptions(opts);

    // If validation is off, we know what we're doing and will add required props later
    if (!this.options.validationOff) {
      if (this.options.required) {
        for (const requirement in this.options.required) {
          if (props[requirement] === undefined) {
            throw new Error(`Property '${requirement}' is required`);
          }
        }
      }
    }

    // Whether or not we should actively sync to remote instances of this model
    this.__sync = false;

    // Allow us to freely call sync on any update without backing up websockets
    this.syncDebounced = lodash.debounce(() => {
      this.sync();
    }, SYNC_DEBOUNCE_TIME);

    // Enough models have this relationship that we provide it from BaseModel;
    // we set this before .assign() though in case they were provided in the constructor
    this.parent = null;
    this.children = [];

    // Generic cache object that can store 'anything' that model instances want.
    this.cache = new Cache();

    // Assign initial attributes. Note that __sync is falsy until later
    this.assign(props);

    if (!this.getPrimaryKey()) {
      this.setPrimaryKey(this.generateUniqueId());
    }

    this.__storage = 'mem';

    // Tracking when we were last updated can be used to optimize UI updates
    this.__updated = Date.now();
    this.__checked = Date.now() - 1;

    // Fresh objects are not candidates for sweep
    this.__initialized = Date.now();
    this.__marked = false;

    // When a model instance is destroyed, it may not be immediately garbage collected.
    this.__destroyed = null;
    this._updateReceivers = {};

    if (this.afterInitialize) {
      this.afterInitialize();
    }

    // Now that we're done constructing, assume we're ready to send syncs
    this.__sync = true;

    this.constructor.add(this);
  }

  /**
   * This method returns a teardown function that decommissions the update receiver provided in its second argument as
   * a callback.
   *
   * IMPORTANT: Always call the teardown function when the entity is expected not to go out of scope but the update
   * receiver is.
   *
   * @param source
   * @param cb
   * @returns {function()}
   */
  registerUpdateReceiver (source, cb) {
    if (typeof cb !== 'function') {
      return () => {};
    }
    this._updateReceivers[source] = cb;
    return () => {
      delete this._updateReceivers[source];
    };
  }

  notifyUpdateReceivers (what) {
    Object.keys(this._updateReceivers).forEach((receiver) => {
      this._updateReceivers[receiver](what);
    });
  }

  emit (...args) {
    super.emit.call(this, ...args);
    this.constructor.emit(args[0], this, ...args.slice(1));
  }

  mark () {
    // This gets set to `false` whenever we are upserted (constructed or initialized)
    this.__marked = true;
    return true;
  }

  sweep () {
    if (this.__marked) {
      this.destroy();
      return true;
    }
    return false;
  }

  generateUniqueId () {
    return lodash.uniqueId(this.constructor.name);
  }

  forceUpdate () {
    this.setUpdateTimestamp();
    this.cache.clear();
    return this;
  }

  setUpdateTimestamp () {
    this.__updated = Date.now();
    return this;
  }

  getUpdateTimestamp () {
    return this.__updated;
  }

  getClassName () {
    return this.constructor.name;
  }

  getPrimaryKeyShort () {
    const key = this.getPrimaryKey();
    const parts = key.split(':');
    return parts[parts.length - 1];
  }

  getPrimaryKey () {
    return this[this.constructor.config.primaryKey];
  }

  getKeySHA () {
    return CryptoUtils.sha256(`${this.getClassName()}-${this.getPrimaryKey()}`);
  }

  toString () {
    return this.getPrimaryKey();
  }

  setPrimaryKey (value) {
    this[this.constructor.config.primaryKey] = value;
    return this;
  }

  setOptions (opts) {
    Object.assign(this.options, this.constructor.DEFAULT_OPTIONS, opts);
  }

  assign (props) {
    if (props) {
      for (const key in props) {
        if (props[key] !== undefined) {
          this.set(key, props[key]);
        }
      }
    }
    this.cache.clear();
    this.setUpdateTimestamp();
    return this;
  }

  set (key, value) {
    this[key] = value;
    this.syncDebounced();
  }

  destroy () {
    this.removeFromParent();
    this.constructor.remove(this);
    this.constructor.clearCaches();
    this.__destroyed = Date.now();
    this.syncDebounced();
  }

  isDestroyed () {
    return !!this.__destroyed;
  }

  hasAll (criteria) {
    if (!criteria) {
      return true;
    }

    for (const key in criteria) {
      if (criteria[key] !== this[key]) {
        return false;
      }
    }
    return true;
  }

  hasAny (criteria) {
    for (const key in criteria) {
      if (criteria[key] === this[key]) {
        return true;
      }
    }
    return false;
  }

  insertChild (entity) {
    const found = [];

    this.children.forEach((child, index) => {
      if (
        child && (
          child === entity ||
          child.getPrimaryKey() === entity.getPrimaryKey()
        )
      ) {
        found.push({child, index});
      }
    });

    if (found.length > 0) {
      found.forEach(({child, index}) => {
        // Replace the existing one with the new one, in the same slot
        this.children.splice(index, 1, entity);
        // If the child entity is garbage, collect it
        if (child !== entity) {
          child.destroy();
        }
      });
    } else {
      // But if we didn't find any copy, just insert at the end of the list
      this.children.push(entity);
    }

    // Important; some dependencies downstream need this
    entity.parent = this;
  }

  removeChild (entity) {
    if (!this.children) {
      return;
    }

    for (let i = this.children.length - 1; i >= 0; i--) {
      if (
        this.children[i] === entity ||
        this.children[i].getPrimaryKey() === entity.getPrimaryKey()
      ) {
        this.children.splice(i, 1);
      }
    }
  }

  removeFromParent () {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

  /**
   * @method off
   * @description Synonymous with removeListener; removes an event listener
   * @param channel {String} Channel to subscribe to
   * @param fn {Function} Handler function to remove
   */
  off (channel, fn) {
    return this.removeListener(channel, fn);
  }

  assertStorable () {
    if (!this.constructor.toPOJO) {
      throw new Error(`BaseModel subclass must implement 'toPOJO'`);
    }

    if (!this.constructor.fromPOJO) {
      throw new Error(`BaseModel subclass must implement 'fromPOJO'`);
    }

    if (!BaseModel.storage) {
      throw new Error(`BaseModel has no 'storage' configured`);
    }

    if (!this.getStorage()) {
      throw new Error(`BaseModel has no '${this.getStorageType()} storage' configured`);
    }
  }

  getStorageType () {
    return this.__storage;
  }

  setStorageType (type) {
    if (!BaseModel.storage[type]) {
      throw new Error(`BaseModel has no storage module '${type}'`);
    }
    this.__storage = type;
  }

  getStorageModule () {
    return BaseModel.storage[this.getStorageType()];
  }

  store () {
    this.assertStorable();
    const pojo = this.constructor.toPOJO(this);
    const key = `${this.getClassName()}-${this.getKeySHA()}`;
    const storage = this.getStorageModule();
    return storage.store(key, pojo);
  }

  unstore () {
    this.assertStorable();
    const key = `${this.getClassName()}-${this.getKeySHA()}`;
    const storage = this.getStorageModule();
    const pojo = storage.unstore(key);
    if (pojo) {
      this.constructor.fromPOJO(pojo);
    }
  }

  sync () {
    if (
      // Don't send syncs until we're globally ready to do so
      !BaseModel.__sync ||
      // Don't actually transmit if we aren't sync-ready yet
      !this.__sync ||
      // Don't try to transmit if we have no synchronize capability
      !this.synchronize
    ) {
      return;
    }

    this.synchronize(Object.assign(
      this.getWireReadyPayload(),
      {
        name: 'remote-model:receive-sync',
        syncIntent: (this.isDestroyed())
          ? BaseModel.SYNC_INTENTS.destroy
          : BaseModel.SYNC_INTENTS.upsert,
      },
    ));
  }

  getWireReadyPayload () {
    return {
      className: this.getClassName(),
      primaryKey: this.getPrimaryKey(),
      objectAttributes: this.getWireReadyObjectAttributes(),
    };
  }

  getWireReadyObjectAttributes () {
    return BaseModel.getWireReadyObjectAttributes(this, true, true);
  }
}

BaseModel.SYNC_INTENTS = {
  upsert: 'upsert',
  destroy: 'destroy',
};

// Use this to toggle whether any model can send/receive syncs or not
BaseModel.__sync = false; // Caution: singleton

BaseModel.receiveSync = ({syncIntent, className, primaryKey, objectAttributes}) => {
  // Don't try to receive any syncs if we aren't ready at all yet
  if (!BaseModel.__sync) {
    logger.warn(`BaseModel sync not ready to ${syncIntent} ${className} ${primaryKey}`);
    return;
  }

  if (!BaseModel.SYNC_INTENTS[syncIntent]) {
    throw new Error(`BaseModel sync intent invalid; cannot receive`);
  }

  let instance;

  switch (syncIntent) {
    case BaseModel.SYNC_INTENTS.upsert:
      instance = BaseModel.upsertFromWireObjectAttributes({className, primaryKey, objectAttributes});
      if (instance) {
        instance.emit('local-model:handle-sync', {syncIntent});
      } else {
        logger.warn(`BaseModel sync could not ${syncIntent} ${className} ${primaryKey}`);
      }
      break;

    case BaseModel.SYNC_INTENTS.destroy:
      instance = BaseModel.instanceFromModelSpec({className, primaryKey});
      if (instance) {
        instance.destroy();
        instance.emit('local-model:handle-sync', {syncIntent});
      } else {
        logger.warn(`BaseModel sync could not ${syncIntent} ${className} ${primaryKey}`);
      }
      break;
  }
};

BaseModel.upsertFromWireObjectAttributes = ({className, primaryKey, objectAttributes}) => {
  const klass = BaseModel.getModelClassByClassName(className);

  if (!klass) {
    // We may not have a class yet if we're not fully bootstrapped (race condition)
    return;
  }

  const upsertSpec = {};

  for (const attrKey in objectAttributes) {
    const attrVal = objectAttributes[attrKey];

    // Transform a reference to an instance into the instance itself
    if (attrVal && attrVal.__model) {
      upsertSpec[attrKey] = BaseModel.instanceFromModelSpec(attrVal.__model);
      continue;
    }

    upsertSpec[attrKey] = reifyRO(attrVal);
  }

  // Must set the primary key as part of the upsertSpec for the lookup to work
  upsertSpec[klass.config.primaryKey] = primaryKey;

  return klass.upsert(upsertSpec, {validationOff: true});
};

BaseModel.instanceFromModelSpec = ({className, primaryKey}) => {
  const klass = BaseModel.getModelClassByClassName(className);
  // In case we receive a sync before bootstrapped, don't assume we have a class
  const instance = klass && klass.findById(primaryKey);
  return instance; // This may be undefined in race condition cases
};

BaseModel.getWireReadyObjectAttributes = (obj, isBase = false, goDeep = false) => {
  if (
    typeof obj === 'boolean' ||
    typeof obj === 'number' ||
    typeof obj === 'string' ||
    typeof obj === 'function' ||
    !obj
  ) {
    return expressionToRO(obj);
  }

  if (goDeep) {
    if (Array.isArray(obj)) {
      return obj.map(BaseModel.getWireReadyObjectAttributes);
    }

    const out = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          // Exclude any property blacklisted as reserved
          !RESERVED_PROPERTY_KEYS[key] &&
          // Exclude any property that matches our primary key name
          obj.constructor.config.primaryKey !== key
        ) {
          const result = BaseModel.getWireReadyObjectAttributes(obj[key], false, false);

          // Undefined indicates no change when upserting, to we just exclude these
          if (result !== undefined) {
            out[key] = result;
          }
        }
      }
    }

    return out;
  }

  if (obj instanceof BaseModel && !goDeep) {
    return {
      __model: {
        className: obj.getClassName(),
        primaryKey: obj.getPrimaryKey(),
      },
    };
  }
};

// HACK: I want to blacklist all methods properties that belong to BaseModel,
// but I can't figure out how to do it. klass.prototype[] didn't work?
const RESERVED_PROPERTY_KEYS = {
  __checked: true,
  __destroyed: true,
  __initialized: true,
  __marked: true,
  __proxy: true,
  __storage: true,
  __sync: true,
  __updated: true,
  _events: true,
  _eventsCount: true,
  _maxListeners: true,
  _updateReceivers: true,
  addEmitterListener: true,
  addEmitterListenerIfNotAlreadyRegistered: true,
  cache: true,
  children: true,
  options: true,
  parent: true,
  removeEmitterListeners: true,
  synchronize: true,
  sync: true,
  syncDebounced: true,
  uid: true,
};

BaseModel.DEFAULT_OPTIONS = {};

BaseModel.storage = {
  mem: new MemoryStorage(),
  disk: new DiskStorage(),
};

BaseModel.extensions = [];

BaseModel.extend = function extend (klass, opts) {
  if (!klass.extended) {
    createCollection(klass, opts);

    klass.emitter = new EventEmitter();
    klass.emit = klass.emitter.emit.bind(klass.emitter);
    klass.on = klass.emitter.on.bind(klass.emitter);

    lodash.defaults(klass.DEFAULT_OPTIONS, BaseModel.DEFAULT_OPTIONS);

    klass.extended = true;
    BaseModel.extensions.push(klass);
  }
};

const KNOWN_MODEL_CLASSES = {};

BaseModel.getModelClassByClassName = (className) => {
  return KNOWN_MODEL_CLASSES[className];
};

const createCollection = (klass, opts) => {
  KNOWN_MODEL_CLASSES[klass.name] = klass;

  klass.config = {
    primaryKey: 'uid',
  };

  Object.assign(klass.config, opts);

  // Use two internal representations of the full table: an array collection for querying where order matters, and a
  // hashmap collection for fast primary key lookups.
  const arrayCollection = [];
  const hashmapCollection = {};

  klass.idx = (instance) => {
    for (let i = 0; i < arrayCollection.length; i++) {
      if (arrayCollection[i] === instance) {
        return i;
      }
    }
    return -1;
  };

  klass.setInstancePrimaryKey = (instance, primaryKey) => {
    if (klass.has(instance)) {
      delete hashmapCollection[instance.getPrimaryKey()];
      instance.setPrimaryKey(primaryKey);
      hashmapCollection[instance.getPrimaryKey()] = instance;
    }
  };

  klass.get = (instance) => {
    return hashmapCollection[instance.getPrimaryKey()] || null;
  };

  klass.has = (instance) => hashmapCollection[instance.getPrimaryKey()] !== undefined;

  klass.add = (instance) => {
    if (!klass.has(instance)) {
      arrayCollection.push(instance);
      hashmapCollection[instance.getPrimaryKey()] = instance;
    }
  };

  klass.remove = (instance) => {
    // Note: We previously only did this work if klass.has() evaluated to true,
    // but this caused issues where models weren't removed correctly if we ended
    // up adding multiple elements to the collection with the same id, which occurred
    // due to an implementation detail in Keyframe when dragging to 0
    const idx = klass.idx(instance);
    if (idx !== -1) {
      arrayCollection.splice(idx, 1);
    }
    delete hashmapCollection[instance.getPrimaryKey()];
  };

  klass.all = () => arrayCollection;

  klass.count = () => klass.all().length;

  klass.filter = (iteratee) => klass.all().filter(iteratee);

  klass.where = (criteria) => {
    return klass.filter((instance) => instance.hasAll(criteria));
  };

  klass.any = (criteria) => {
    return klass.filter((instance) => instance.hasAll(criteria));
  };

  klass.find = (criteria) => {
    const found = klass.where(criteria);
    return found && found[0];
  };

  klass.findById = (id) => hashmapCollection[id];

  // eslint-disable-next-line
  klass.create = (props, opts) => new klass(props, opts);

  klass.upsert = (props, opts) => {
    klass.clearCaches();

    const primaryKey = props[klass.config.primaryKey];

    const found = klass.findById(primaryKey); // Criteria in case of id collisions :/

    if (found) {
      found.assign(props);
      found.setOptions(opts);

      // The object is fresh again and no longer a candidate for sweep
      found.__initialized = Date.now();
      found.__marked = false;

      if (found.afterInitialize) {
        found.afterInitialize();
      }

      return found;
    }

    return klass.create(props, opts);
  };

  klass.clearCaches = () => {
    arrayCollection.forEach((item) => {
      item.cache.clear();
    });
  };

  klass.sweep = () => {
    arrayCollection.forEach((item) => {
      item.sweep();
    });
  };

  klass.purge = () => {
    while (arrayCollection.length > 0) {
      arrayCollection[0].destroy();
    }
  };
};

module.exports = BaseModel;
