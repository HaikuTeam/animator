var xmlToMana = require('haiku-bytecode/src/xmlToMana')
var eachProperty = require('haiku-bytecode/src/eachProperty')
var eachEventHandler = require('haiku-bytecode/src/eachEventHandler')
var eachTimeline = require('haiku-bytecode/src/eachTimeline')

function Bytecode (bytecode) {
  this.bytecode = bytecode
}

Bytecode.prototype.getObject = function getObject () {
  return this.bytecode
}

Bytecode.prototype.getTemplate = function getTemplate () {
  return xmlToMana(this.bytecode.template)
}

Bytecode.prototype.eachEventHandler = function _eachEventHandler (iteratee, binding) {
  return eachEventHandler(this.bytecode, iteratee, binding)
}

Bytecode.prototype.eachTimeline = function _eachTimeline (iteratee, binding) {
  return eachTimeline(this.bytecode, iteratee, binding)
}

function typecheckInput (type, name, value) {
  if (typeof value !== type) {
    throw new Error('Property `' + name + '` must be a `' + type + '`')
  }
}

Bytecode.prototype.defineInputs = function defineInputs (storage, instance) {
  eachProperty(this.bytecode, function _eachProperty (type, name, defval, privacy, setter) {
    if (defval === undefined) throw new Error('Property `' + name + '` cannot be undefined; use null for empty properties')
    if (instance[name] !== undefined) throw new Error('Property `' + name + '` is a reserved keyword')
    if (storage[name] !== undefined) throw new Error('Property `' + name + '` was already declared')

    typecheckInput(type, name, defval)
    storage[name] = defval

    Object.defineProperty(instance, name, {
      get: function get () {
        return storage[name]
      },

      set: function set (input) {
        typecheckInput(type, name, input)
        if (setter) {
          storage[name] = setter(input)
        } else {
          storage[name] = input
        }
        return storage[name]
      }
    })
  })
}

module.exports = Bytecode
