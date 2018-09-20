const { EventEmitter } = require('events')
const lodash = require('lodash')
const Cache = require('./Cache')
const CryptoUtils = require('./../utils/CryptoUtils')
const EmitterManager = require('./../utils/EmitterManager')

/**
 * @class BaseModel
 * @description
 *.  Base model class from which all entities in haiku-serialization/src/bll inherit.
 *.  (Note: This author does not care if we call these models "BLL" entities or not;
 *.  the point is that these are extremely useful; call them 'Snogglegorks' if you want.)
 *.
 *.  Here's what BaseModel provides:
 *.    - Upsert functionality (reuse objects with the same uid)
 *     - Event emitter API for cross-entity communication
 *.    - Model collection querying (Model.where, Model.find, etc.)
 *.    - Built-in caching API
 *.    - Handles object creation/destruction and updating the collection
 *
 *.  Every instance of a subclass of BaseModel has a uid which is used to determine whether
 *.  to create a new instance or return an existing instance when MyClass.upsert({}) is called.
 *.  It's up to the caller to provide a uid appropriate to the model.
 *
 *.  Author's note:
 *
 *.  This collection of models has begun with some mixed responsibilities, including:
 *.    - Dealing with view-related logic (view-model layer)
 *.    - Serialization and writing to disk (DAL)
 *.    - Communication transport app views (transport layer)
 *.    - App business logic (BLL)
 *
 *.  But keep in mind we can refactor these models to fit those divisions as we go. #TODO
 *.  (Keep in mind that ALL of this logic used to live buried deep in a quagmire
 *.  of tangled React-specific UI logic that had become almost impossible to work with.)
 */
class BaseModel extends EventEmitter {
  constructor (props, opts) {
    super()

    EmitterManager.extend(this)

    if (!this.constructor.extended) {
      throw new Error(`You must call BaseModel.extend(${this.constructor.name})`)
    }

    if (!this.options) this.options = {}

    this.setOptions(opts)

    // If validation is off, we know what we're doing and will add required props later
    if (!this.options.validationOff) {
      if (this.options.required) {
        for (let requirement in this.options.required) {
          if (props[requirement] === undefined) {
            throw new Error(`Property '${requirement}' is required`)
          }
        }
      }
    }

    // Enough models have this relationship that we provide it from BaseModel;
    // we set this before .assign() though in case they were provided in the constructor
    this.parent = null
    this.children = []

    // Generic cache object that can store 'anything' that model instances want.
    this.cache = new Cache()

    // Assign initial attributes.
    this.assign(props)

    if (!this.getPrimaryKey()) {
      this.setPrimaryKey(this.generateUniqueId())
    }

    // Tracking when we were last updated can be used to optimize UI updates
    this.__updated = Date.now()
    this.__checked = Date.now() - 1

    // Fresh objects are not candidates for sweep
    this.__initialized = Date.now()
    this.__marked = false

    // When a model instance is destroyed, it may not be immediately garbage collected.
    this.__destroyed = null
    this._updateReceivers = {}

    if (this.afterInitialize) {
      this.afterInitialize()
    }

    if (this.constructor.config.useQueryCache) {
      this.__proxy = new Proxy(this, {
        set: (object, property, value) => {
          this.constructor.dirtyQueryCacheKeys.add(property)
          object[property] = value
          return true
        }
      })
    } else {
      this.__proxy = this
    }

    this.constructor.add(this.__proxy)
    return this.__proxy
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
      return () => {}
    }
    this._updateReceivers[source] = cb
    return () => {
      delete this._updateReceivers[source]
    }
  }

  notifyUpdateReceivers (what) {
    Object.keys(this._updateReceivers).forEach((receiver) => {
      this._updateReceivers[receiver](what)
    })
  }

  emit (...args) {
    super.emit.call(this.__proxy, ...args)
    this.constructor.emit(args[0], this.__proxy, ...args.slice(1))
  }

  mark () {
    // This gets set to `false` whenever we are upserted (constructed or initialized)
    this.__marked = true
    return true
  }

  sweep () {
    if (this.__marked) {
      this.destroy()
      return true
    }
    return false
  }

  generateUniqueId () {
    return lodash.uniqueId(this.constructor.name)
  }

  forceUpdate () {
    this.setUpdateTimestamp()
    this.cache.clear()
    return this
  }

  setUpdateTimestamp () {
    this.__updated = Date.now()
    return this
  }

  getUpdateTimestamp () {
    return this.__updated
  }

  getClassName () {
    return this.constructor.name
  }

  getPrimaryKeyShort () {
    const key = this.getPrimaryKey()
    const parts = key.split(':')
    return parts[parts.length - 1]
  }

  getPrimaryKey () {
    return this[this.constructor.config.primaryKey]
  }

  getKeySHA () {
    return CryptoUtils.sha256(`${this.getClassName()}-${this.getPrimaryKey()}`)
  }

  toString () {
    return this.getPrimaryKey()
  }

  setPrimaryKey (value) {
    this[this.constructor.config.primaryKey] = value
    return this
  }

  setOptions (opts) {
    Object.assign(this.options, this.constructor.DEFAULT_OPTIONS, opts)
  }

  assign (props) {
    if (props) {
      for (const key in props) {
        if (props[key] !== undefined) {
          this.set(key, props[key])
        }
      }
    }
    this.cache.clear()
    this.setUpdateTimestamp()
    return this
  }

  set (key, value) {
    this[key] = value
  }

  destroy () {
    this.removeFromParent()
    this.constructor.remove(this)
    this.constructor.clearCaches()
    this.__destroyed = Date.now()
  }

  isDestroyed () {
    return !!this.__destroyed
  }

  hasAll (criteria) {
    if (!criteria) {
      return true
    }

    for (const key in criteria) {
      if (criteria[key] !== this[key]) {
        return false
      }
    }
    return true
  }

  hasAny (criteria) {
    for (const key in criteria) {
      if (criteria[key] === this[key]) {
        return true
      }
    }
    return false
  }

  insertChild (entity) {
    const found = []

    this.children.forEach((child, index) => {
      if (
        child && (
          child === entity ||
          child.getPrimaryKey() === entity.getPrimaryKey()
        )
      ) {
        found.push({child, index})
      }
    })

    if (found.length > 0) {
      found.forEach(({child, index}) => {
        // Replace the existing one with the new one, in the same slot
        this.children.splice(index, 1, entity)
        // If the child entity is garbage, collect it
        if (child !== entity) {
          child.destroy()
        }
      })
    } else {
      // But if we didn't find any copy, just insert at the end of the list
      this.children.push(entity)
    }

    // Important; some dependencies downstream need this
    entity.parent = this
  }

  removeChild (entity) {
    if (!this.children) {
      return
    }

    for (let i = this.children.length - 1; i >= 0; i--) {
      if (
        this.children[i] === entity ||
        this.children[i].getPrimaryKey() === entity.getPrimaryKey()
      ) {
        this.children.splice(i, 1)
      }
    }
  }

  removeFromParent () {
    if (this.parent) {
      this.parent.removeChild(this)
    }
  }

  /**
   * @method off
   * @description Synonymous with removeListener; removes an event listener
   * @param channel {String} Channel to subscribe to
   * @param fn {Function} Handler function to remove
   */
  off (channel, fn) {
    return this.removeListener(channel, fn)
  }
}

BaseModel.DEFAULT_OPTIONS = {}

BaseModel.extensions = []

BaseModel.extend = function extend (klass, opts) {
  if (!klass.extended) {
    createCollection(klass, opts)

    klass.emitter = new EventEmitter()
    klass.emit = klass.emitter.emit.bind(klass.emitter)
    klass.on = klass.emitter.on.bind(klass.emitter)

    lodash.defaults(klass.DEFAULT_OPTIONS, BaseModel.DEFAULT_OPTIONS)

    klass.extended = true
    BaseModel.extensions.push(klass)
  }
}

const getStableCacheKey = (prefix, criteria) => {
  if (typeof criteria !== 'object') {
    return false
  }

  const cacheKeyComponents = [prefix]
  for (const key in criteria) {
    const value = (criteria[key] && criteria[key].toString()) || criteria[key] + ''
    cacheKeyComponents.push(key, value)
  }

  return cacheKeyComponents.join('|')
}

const KNOWN_MODEL_CLASSES = {}

BaseModel.getModelClassByClassName = (className) => {
  return KNOWN_MODEL_CLASSES[className]
}

const createCollection = (klass, opts) => {
  KNOWN_MODEL_CLASSES[klass.name] = klass

  klass.config = {
    primaryKey: 'uid'
  }

  Object.assign(klass.config, opts)

  // Use two internal representations of the full table: an array collection for querying where order matters, and a
  // hashmap collection for fast primary key lookups.
  const arrayCollection = []
  const hashmapCollection = {}

  let queryCache = {}
  klass.dirtyQueryCacheKeys = new Set()

  const purgeDirtyQueryCacheKeys = (keys) => {
    keys.forEach((dirtyKey) => {
      if (klass.dirtyQueryCacheKeys.has(dirtyKey)) {
        klass.dirtyQueryCacheKeys.delete(dirtyKey)
        Object.keys(queryCache).filter((name) => name.includes(dirtyKey)).forEach((dirtyCacheKey) => {
          delete queryCache[dirtyCacheKey]
        })
      }
    })
  }

  const cachedQuery = (prefix, criteria, iteratee) => {
    const cacheKey = getStableCacheKey(prefix, criteria)
    if (cacheKey === false) {
      return klass.filter(iteratee)
    }

    purgeDirtyQueryCacheKeys(Object.keys(criteria))
    if (!queryCache[cacheKey]) {
      queryCache[cacheKey] = klass.filter(iteratee)
    }

    return queryCache[cacheKey]
  }

  const clearQueryCache = () => {
    if (klass.config.useQueryCache) {
      queryCache = {}
      klass.dirtyQueryCacheKeys.clear()
    }
  }

  klass.idx = (instance) => {
    for (let i = 0; i < arrayCollection.length; i++) {
      if (arrayCollection[i] === instance) return i
    }
    return -1
  }

  klass.setInstancePrimaryKey = (instance, primaryKey) => {
    if (klass.has(instance)) {
      delete hashmapCollection[instance.getPrimaryKey()]
      instance.setPrimaryKey(primaryKey)
      hashmapCollection[instance.getPrimaryKey()] = instance
    }
  }

  klass.get = (instance) => {
    return hashmapCollection[instance.getPrimaryKey()] || null
  }

  klass.has = (instance) => hashmapCollection[instance.getPrimaryKey()] !== undefined

  klass.add = (instance) => {
    if (!klass.has(instance)) {
      clearQueryCache()
      arrayCollection.push(instance)
      hashmapCollection[instance.getPrimaryKey()] = instance
    }
  }

  klass.remove = (instance) => {
    // Note: We previously only did this work if klass.has() evaluated to true,
    // but this caused issues where models weren't removed correctly if we ended
    // up adding multiple elements to the collection with the same id, which occurred
    // due to an implementation detail in Keyframe when dragging to 0
    const idx = klass.idx(instance)
    if (idx !== -1) {
      arrayCollection.splice(idx, 1)
    }
    delete hashmapCollection[instance.getPrimaryKey()]
    clearQueryCache()
  }

  klass.all = () => arrayCollection

  klass.count = () => klass.all().length

  klass.filter = (iteratee) => klass.all().filter(iteratee)

  klass.where = (criteria) => {
    if (klass.config.useQueryCache) {
      return cachedQuery('where', criteria, (instance) => instance.hasAll(criteria))
    }

    return klass.filter((instance) => instance.hasAll(criteria))
  }

  klass.any = (criteria) => {
    if (klass.config.useQueryCache) {
      cachedQuery('any', criteria, (instance) => instance.hasAny(criteria))
    }

    return klass.filter((instance) => instance.hasAll(criteria))
  }

  klass.find = (criteria) => {
    const found = klass.where(criteria)
    return found && found[0]
  }

  klass.findById = (id) => hashmapCollection[id]

  // eslint-disable-next-line
  klass.create = (props, opts) => new klass(props, opts)

  klass.upsert = (props, opts) => {
    klass.clearCaches()

    const primaryKey = props[klass.config.primaryKey]

    const found = klass.findById(primaryKey) // Criteria in case of id collisions :/

    if (found) {
      found.assign(props)
      found.setOptions(opts)

      // The object is fresh again and no longer a candidate for sweep
      found.__initialized = Date.now()
      found.__marked = false

      if (found.afterInitialize) {
        found.afterInitialize()
      }

      return found
    }

    return klass.create(props, opts)
  }

  klass.clearCaches = () => {
    arrayCollection.forEach((item) => {
      item.cache.clear()
    })
  }

  klass.sweep = () => {
    arrayCollection.forEach((item) => {
      item.sweep()
    })
  }

  klass.purge = () => {
    while (arrayCollection.length > 0) {
      arrayCollection[0].destroy()
    }
  }
}

module.exports = BaseModel
