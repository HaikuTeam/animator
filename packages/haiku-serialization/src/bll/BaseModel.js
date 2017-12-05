const EventEmitter = require('events').EventEmitter
const lodash = require('lodash')

// Prevent trigger-happy MaxListenersExceededWarning
if (process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'production') {
  EventEmitter.prototype._maxListeners = Infinity
} else {
  EventEmitter.prototype._maxListeners = 500
}

class BaseModel extends EventEmitter {
  constructor (props, opts) {
    super()

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

    patchEmitter(this, (args) => {
      this.constructor.emit(args[0], this, args[1], args[2], args[3])
    })

    this.assign(props)

    if (!this.getPrimaryKey()) {
      this.setPrimaryKey(lodash.uniqueId(this.constructor.name))
    }

    this.constructor.add(this)

    this.__cache = {}
    this.__updated = Date.now()
    this.__checked = Date.now() - 1
    this.__destroyed = null

    if (this.afterInitialize) this.afterInitialize()
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
        this[key] = props[key]
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
    if (this.getPrimaryKey() === other.getPrimaryKey()) return true
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

  klass.findById = (id) => {
    const criteria = {}
    criteria[klass.config.primaryKey] = id
    return klass.find(criteria)
  }

  klass.create = (props, opts) => {
    return new klass(props, opts) // eslint-disable-line
  }

  klass.upsert = (props, opts) => {
    klass.clearCaches()
    const pkey = props[klass.config.primaryKey]
    const found = klass.findById(pkey)
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

function patchEmitter (emitter, other) {
  const old = emitter.emit
  emitter.emit = function emit () {
    old.apply(emitter, arguments)
    other(arguments)
  }
}

module.exports = BaseModel
