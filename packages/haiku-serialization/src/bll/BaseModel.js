const { EventEmitter } = require('events')
const EmitterManager = require('./../utils/EmitterManager')
const lodash = require('lodash')

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
        if (props[requirement] === undefined || props[requirement] === null) {
          throw new Error(`Property '${requirement}' is required`)
        }
      }
    }

    const emit = this.emit
    this.emit = (a, b, c, d, e, f, g, h, i) => {
      emit.call(this, a, b, c, d, e, f, g, h, i)
      this.constructor.emit(a, this, b, c, d, e, f, g, h, i)
    }

    this.assign(props)

    if (!this.getPrimaryKey()) {
      this.setPrimaryKey(this.generateUniqueId())
    }

    this.constructor.add(this)

    // Generic cache object that can store 'anything' that model instances want.
    this.__cache = {}

    // Tracking when we were last updated can be used to optimize UI updates
    this.__updated = Date.now()
    this.__checked = Date.now() - 1

    // When a model instance is destroyed, it is kept in the collection but not included in queries.
    this.__destroyed = null

    if (this.afterInitialize) this.afterInitialize()
  }

  generateUniqueId () {
    return lodash.uniqueId(this.constructor.name)
  }

  forceUpdate () {
    this.setUpdate()
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

  getUpdateTimestamp () {
    return this.__updated
  }

  didUpdateSince (time) {
    return time <= this.__updated
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

  setPrimaryKey (value) {
    this[this.constructor.config.primaryKey] = value
    return this
  }

  getOptions () {
    return this.options
  }

  setOptions (opts) {
    lodash.assign(this.options, this.constructor.DEFAULT_OPTIONS, opts)
    return this
  }

  getOption (key) {
    return this.options[key]
  }

  setOption (key, value) {
    this.options[key] = value
    return this
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
    if (this.beforeDestroy) this.beforeDestroy()
    this.constructor.remove(this)
    this.constructor.clearCaches()
    this.setPrimaryKey(undefined)
    this.__destroyed = Date.now()
    if (this.afterDestroy) this.afterDestroy()
    return this
  }

  destroyedAt () {
    return this.__destroyed
  }

  isDestroyed () {
    return !!this.__destroyed
  }

  sameAs (other) {
    if (!other) return false
    if (this === other) return true
    return false
  }

  hasAll (criteria) {
    let match = true
    for (const key in criteria) {
      if (criteria[key] !== this[key]) {
        match = false
      }
    }
    return match
  }

  hasAny (criteria) {
    let match = false
    for (const key in criteria) {
      if (criteria[key] === this[key]) {
        match = true
      }
    }
    return match
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
    createCollection(klass, [], opts)

    klass.emitter = new EventEmitter()
    klass.emit = klass.emitter.emit.bind(klass.emitter)
    klass.on = klass.emitter.on.bind(klass.emitter)

    lodash.defaults(klass.DEFAULT_OPTIONS, BaseModel.DEFAULT_OPTIONS)

    klass.extended = true
  }
}

function createCollection (klass, collection, opts) {
  klass.config = lodash.assign({
    primaryKey: 'uid'
  }, opts)

  klass.configure = (config) => {
    lodash.assign(klass.config, config)
  }

  klass.idx = (instance) => {
    for (let i = 0; i < collection.length; i++) {
      if (collection[i].sameAs(instance)) return i
    }
    return -1
  }

  klass.get = (instance) => {
    const idx = klass.idx(instance)
    if (idx === -1) return null
    return collection[idx]
  }

  klass.has = (instance) => {
    return !!klass.get(instance)
  }

  klass.add = (instance) => {
    if (!klass.has(instance)) collection.push(instance)
    return collection
  }

  klass.remove = (instance) => {
    const idx = klass.idx(instance)
    if (idx === -1) return null
    collection.splice(idx, 1)
    return collection
  }

  klass.all = () => {
    return collection.filter((item) => {
      return !item.isDestroyed()
    })
  }

  klass.collection = () => {
    return collection
  }

  klass.count = () => {
    return klass.all().length
  }

  klass.filter = (iteratee) => {
    return klass.all().filter(iteratee)
  }

  klass.where = (criteria) => {
    if (!criteria) return klass.all()
    if (Object.keys(criteria).length < 0) return klass.all()
    return klass.filter((instance) => {
      return instance.hasAll(criteria)
    })
  }

  klass.any = (criteria) => {
    return klass.filter((instance) => {
      return instance.hasAny(criteria)
    })
  }

  klass.find = (criteria) => {
    const found = klass.where(criteria)
    return found && found[0]
  }

  // HACK:  this logic that searched by id was broken, as uids are in the format '/Users/zack/.haiku/projects/zack3/Romp::main::e4a9e4d8baa7' instead of 'e4a9e4d8baa7'
  //       Rather than combing for the unknowable pathways where this logic is get/set (wistful sigh: types) I've hacked the findById logic to search using regex.
  //       Should be drop-in compatible with exact id matching as well.
  klass.findById = (id) => {
    return klass.all().find((elem) => elem[klass.config.primaryKey].endsWith(id))
  }

  klass.create = (props, opts) => {
    return new klass(props, opts) // eslint-disable-line
  }

  klass.upsert = (props, opts) => {
    klass.clearCaches()
    const pkey = props[klass.config.primaryKey]
    const found = klass.findById(pkey) // Criteria in case of id collisions :/
    if (found) {
      found.assign(props)
      found.setOptions(opts)
      if (found.afterInitialize) found.afterInitialize()
      return found
    }
    const created = klass.create(props, opts)
    return created
  }

  klass.clearCaches = () => {
    collection.forEach((item) => {
      item.cacheClear()
    })
  }
}

module.exports = BaseModel
