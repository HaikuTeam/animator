var xmlToMana = require('haiku-bytecode/src/xmlToMana')
var eachProperty = require('haiku-bytecode/src/eachProperty')

var STRING_TYPE = 'string'
var OBJECT_TYPE = 'object'

function Bytecode (bytecode) {
  if (!bytecode) throw new Error('Empty bytecode not allowed')
  this.bytecode = bytecode
}

Bytecode.prototype.getObject = function getObject () {
  return this.bytecode
}

Bytecode.prototype.getTemplate = function getTemplate () {
  if (!this.bytecode.template) throw new Error('Empty bytecode template not allowed')
  if (typeof this.bytecode.template === OBJECT_TYPE) {
    if (!this.bytecode.template.elementName) {
      console.warn('Warning: Saw unexpected bytecode template format')
      console.log('Template:', this.bytecode.template)
    }
    return this.bytecode.template
  }
  if (typeof this.bytecode.template === STRING_TYPE) {
    return xmlToMana(this.bytecode.template)
  }
  throw new Error('Unknown bytecode template format')
}

Bytecode.prototype.bindEventHandlers = function _bindEventHandlers (instance) {
  if (!this.bytecode.eventHandlers) return void (0)
  for (var i = 0; i < this.bytecode.eventHandlers.length; i++) {
    var descriptor = this.bytecode.eventHandlers[i]
    descriptor.handler = descriptor.handler.bind(instance)
  }
}

function typecheckInput (type, name, value) {
  if (type === 'any' || type === '*') {
    return void (0)
  }
  if (type === 'event' || type === 'listener') {
    if (typeof value !== 'function' && value !== null && value !== undefined) {
      throw new Error('Property value `' + name + '` must be an event listener function')
    }
    return void (0)
  }
  if (typeof value !== type) {
    throw new Error('Property value `' + name + '` must be a `' + type + '`')
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
          storage[name] = setter.call(instance, input)
        } else {
          storage[name] = input
        }
        return storage[name]
      }
    })
  })
}

module.exports = Bytecode
