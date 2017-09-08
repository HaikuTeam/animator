var async = require('async')
var lodash = require('lodash')
var EventEmitter = require('events').EventEmitter

const db = {}
const dicts = {}

function define (name, config = {}) {
  if (db[name]) throw new Error('Model `' + name + '` already defined')
  const table = db[name] = []
  const dict = dicts[name] = {}

  class Model extends EventEmitter {
    constructor (attrs) {
      super()
      this.attrs = {}
      this.id = 0
      this.edit(lodash.assign({}, config.defaults || {}, attrs))
      this.assert()
      this.callInitialize()
    }

    assert () {
      if (config.unique && !this.get(config.unique)) {
        throw new Error('Unique attribute `' + config.unique + '` required')
      }
    }

    uid () {
      if (!config.unique) return null
      return this.get(config.unique)
    }

    index () {
      return this.id - 1
    }

    set (key, value) {
      if (this.beforeSetSync) this.beforeSetSync(key, value)
      lodash.set(this.attrs, key, value)
      if (this.afterSetSync) this.afterSetSync(key, value)
      return this
    }

    get (key) {
      return lodash.get(this.attrs, key)
    }

    edit (attrs) {
      if (this.beforeEditSync) this.beforeEditSync(attrs)
      for (let key in attrs) {
        let value = attrs[key]
        if (value !== undefined) {
          this.set(key, value)
        }
      }
      if (this.afterEditSync) this.afterEditSync()
    }

    update (attrs, cb) {
      if (this.shouldUpdate && !this.shouldUpdate(attrs)) {
        return cb(null, this)
      }
      return this.callBeforeUpdate(attrs, (err, fixedAttrs) => {
        if (err) return cb(err)
        this.edit(fixedAttrs || attrs)
        return this.callAfterUpdate(this.attrs, (err) => {
          if (err) return cb(err)
          return cb(null, this)
        })
      })
    }

    destroy (cb) {
      return this.callBeforeDestroy((err) => {
        if (err) return cb(err)
        this.destroyRecord()
        return this.callAfterDestroy((err) => {
          if (err) return cb(err)
          return cb(null, this)
        })
      })
    }

    blend (other, cb) {
      // Copy our 'newer' data to theirs
      return other.update(this.attrs, (err) => {
        if (err) return cb(err)
        // And pull any missing data into ours
        this.edit(other.attrs)
        if (err) return cb(err)
        Object.defineProperty(this, 'id', { value: other.id })
        return cb(null, this)
      })
    }

    save (cb) {
      throw new Error('Save is not implemented on the `' + name + '` model!')
    }

    callInitialize () {
      if (this.initialize) return this.initialize()
      return this
    }

    callValidate () {
      if (!this.validate) return null
      return this.validate()
    }

    callLoad (cb) {
      if (!this.load) return cb()
      return this.load(cb)
    }

    callAfterCreate (cb) {
      if (!this.afterCreate) return cb()
      return this.afterCreate(cb)
    }

    callBeforeUpdate (attrs, cb) {
      if (!this.beforeUpdate) return cb()
      return this.beforeUpdate(attrs, cb)
    }

    callAfterUpdate (attrs, cb) {
      if (!this.afterUpdate) return cb()
      return this.afterUpdate(attrs, cb)
    }

    callBeforeDestroy (cb) {
      if (!this.beforeDestroy) return cb()
      return this.beforeDestroy(cb)
    }

    callAfterDestroy (cb) {
      if (!this.afterDestroy) return cb()
      return this.afterDestroy(cb)
    }

    destroyRecord () {
      const uid = this.uid()
      if (uid) delete dict[uid]
      table.splice(this.index(), 1)
      Object.defineProperty(this, 'id', { value: 0 })
      return this
    }
  }

  Model.table = table

  Model.all = function all (cb) {
    return cb(null, table)
  }

  Model.allSync = function allSync () {
    return table
  }

  Model.create = function create (attrs, cb) {
    const instance = new Model(attrs)

    const validationErr = instance.callValidate()
    if (validationErr) return cb(validationErr)

    return instance.callLoad((loadErr) => {
      if (loadErr) return cb(loadErr)
      return Model.upsert(instance, (err) => {
        if (err) return cb(err)
        return instance.callAfterCreate((err) => {
          if (err) return cb(err)
          return cb(null, instance)
        })
      })
    })
  }

  Model.upsert = function upsert (instance, cb) {
    const uid = instance.uid()
    if (uid) {
      const existing = dict[uid]
      if (existing) return instance.blend(existing, cb)
    }

    const length = table.push(instance)
    Object.defineProperty(instance, 'id', { value: length })
    if (uid) dict[uid] = instance
    return cb(null, instance)
  }

  Model.findOrCreate = function findOrCreate (attrs, cb) {
    if (!config.unique) {
      return Model.create(attrs, cb)
    }

    const uid = attrs[config.unique]
    const existing = dict[uid]
    if (existing) return existing.update(attrs, cb)

    return Model.create(attrs, cb)
  }

  Model.byUid = function byUid (uid) {
    return dict[uid]
  }

  Model.first = function first (query, cb) {
    return cb(null, Model.firstSync(query))
  }

  Model.firstSync = function first (query, cb) {
    return lodash.find(table, { attrs: query })
  }

  Model.where = function where (query, cb) {
    return cb(null, Model.whereSync(query))
  }

  Model.whereSync = function whereSync (query) {
    return lodash.filter(table, { attrs: query })
  }

  Model.whereWithSync = function whereWithSync (fn) {
    const out = []
    Model.eachSync((entry) => {
      if (fn(entry)) out.push(entry)
    })
    return out
  }

  Model.destroyWhere = function destroyWhere (query, cb) {
    return Model.where(query, function _where (err, results) {
      if (err) return cb(err)
      return async.each(results, function _each (model, next) {
        return model.destroy(next)
      }, cb)
    })
  }

  Model.destroyAll = function destroyAll (cb) {
    return async.each(table, function _each (model, next) {
      return model.destroy(next)
    }, cb)
  }

  Model.eachSync = function eachSync (iterator) {
    const all = Model.allSync()
    return all.forEach(iterator)
  }

  return Model
}

module.exports = {
  define: define
}
