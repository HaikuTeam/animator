const { EventEmitter } = require('events')
const lodash = require('lodash')

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

    if (this.options.required) {
      for (let requirement in this.options.required) {
        if (props[requirement] === undefined) {
          throw new Error(`Property '${requirement}' is required`)
        }
      }
    }

    this.assign(props)

    if (!this.getPrimaryKey()) {
      this.setPrimaryKey(this.generateUniqueId())
    }

    // Generic cache object that can store 'anything' that model instances want.
    this.__cache = {}

    // Tracking when we were last updated can be used to optimize UI updates
    this.__updated = Date.now()
    this.__checked = Date.now() - 1

    // Fresh objects are not candidates for sweep
    this.__initialized = Date.now()
    this.__marked = false

    // When a model instance is destroyed, it may not be immediately garbage collected.
    this.__destroyed = null

    if (this.afterInitialize) this.afterInitialize()

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

  emit (...args) {
    super.emit.call(this.__proxy, ...args)
    this.constructor.emit(args[0], this.__proxy, ...args.slice(1))
  }

  getEchoInfo () {
    return `${this.getClassName()}[${this.getPrimaryKey()}](${(this.dump && this.dump()) || '#'})`
  }

  echoInfo () {
    console.info(this.getEchoInfo())
  }

  mark () {
    // This gets set to `false` whenever we are upserted (constructed or initialized)
    this.__marked = true
  }

  sweep () {
    if (this.__marked) {
      this.destroy()
      // This is safe to call even if the entity doesn't have a `.parent`
      this.removeFromParent()
    }
  }

  generateUniqueId () {
    return lodash.uniqueId(this.constructor.name)
  }

  forceUpdate () {
    this.setUpdateTimestamp()
    this.cacheClear()
    return this
  }

  cacheClear () {
    this.__cache = {}
    return this
  }

  cacheGet (key) {
    return lodash.get(this.__cache, key)
  }

  cacheSet (key, value) {
    this.setUpdateTimestamp()
    return lodash.set(this.__cache, key, value)
  }

  cacheFetch (key, provider) {
    const found = this.cacheGet(key)
    if (found !== undefined) return found
    const given = provider()
    this.cacheSet(key, given)
    return given
  }

  cacheUnset (key) {
    return lodash.set(this.__cache, key, undefined)
  }

  setUpdateTimestamp () {
    this.__updated = Date.now()
    return this
  }

  didUpdateSinceLastCheck () {
    const answer = this.__checked < this.__updated
    this.__checked = Date.now()
    return answer
  }

  getClassName () {
    return this.constructor.name
  }

  getPrimaryKey () {
    return this[this.constructor.config.primaryKey]
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
          this[key] = props[key]
        }
      }
    }
    this.cacheClear()
    this.setUpdateTimestamp()
    return this
  }

  destroy () {
    this.constructor.remove(this)
    this.constructor.clearCaches()
    this.__destroyed = Date.now()
    return this
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
    if (!this.children) {
      this.children = []
    }

    let found = false

    this.children.forEach((child) => {
      if (child === entity) {
        found = true
      }
    })

    if (!found) {
      this.children.push(entity)
    }
  }

  removeChild (entity) {
    if (!this.children) {
      return
    }

    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i] === entity) {
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

BaseModel.extend = function extend (klass, opts) {
  if (!klass.extended) {
    createCollection(klass, opts)

    klass.emitter = new EventEmitter()
    klass.emit = klass.emitter.emit.bind(klass.emitter)
    klass.on = klass.emitter.on.bind(klass.emitter)

    lodash.defaults(klass.DEFAULT_OPTIONS, BaseModel.DEFAULT_OPTIONS)

    klass.extended = true
  }
}

const getStableCacheKey = (prefix, criteria) => {
  if (typeof criteria !== 'object') {
    return false
  }

  const cacheKeyComponents = [prefix]
  for (const key in criteria) {
    cacheKeyComponents.push(key, criteria[key].toString())
  }

  return cacheKeyComponents.join('|')
}

const createCollection = (klass, opts) => {
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
    if (klass.has(instance)) {
      clearQueryCache()
      const idx = klass.idx(instance)
      arrayCollection.splice(idx, 1)
      delete hashmapCollection[instance.getPrimaryKey()]
    }
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
    const pkey = props[klass.config.primaryKey]
    const found = klass.findById(pkey) // Criteria in case of id collisions :/
    if (found) {
      found.assign(props)
      found.setOptions(opts)

      // The object is fresh again and no longer a candidate for sweep
      found.__initialized = Date.now()
      found.__marked = false

      if (found.afterInitialize) found.afterInitialize()
      return found
    }
    return klass.create(props, opts)
  }

  klass.clearCaches = () => {
    arrayCollection.forEach((item) => {
      item.cacheClear()
    })
  }
}

module.exports = BaseModel
