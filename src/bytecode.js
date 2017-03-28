var xmlToMana = require('haiku-bytecode/src/xmlToMana')
var eachProperty = require('haiku-bytecode/src/eachProperty')

var STRING_TYPE = 'string'
var OBJECT_TYPE = 'object'

function Bytecode (bytecode) {
  if (!bytecode) throw new Error('Empty bytecode not allowed')
  this.bytecode = bytecode
  this._anyEventChange = false
  this._eventsFired = {}
  this._anyInputChange = false
  this._inputChanges = {}
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
  var self = this
  for (var i = 0; i < this.bytecode.eventHandlers.length; i++) {
    var descriptor = this.bytecode.eventHandlers[i]
    var handler = descriptor.handler
    descriptor.handler = function (event, a, b, c, d, e, f, g, h, i, j, k) {
      self._anyEventChange = true
      if (!self._eventsFired[descriptor.selector]) self._eventsFired[descriptor.selector] = {}
      self._eventsFired[descriptor.selector][descriptor.name] = event || true
      handler.call(instance, event, a, b, c, d, e, f, g, h, i, j, k)
    }
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

Bytecode.prototype.getEventsFired = function getEventsFired () {
  return this._anyEventChange && this._eventsFired
}

Bytecode.prototype.getInputsChanged = function getInputsChanged () {
  return this._anyInputChange && this._inputChanges
}

Bytecode.prototype.clearDetectedEventsFired = function clearDetectedEventsFired () {
  this._anyEventChange = false
  this._eventsFired = {}
}

Bytecode.prototype.clearDetectedInputChanges = function clearDetectedInputChanges () {
  this._anyInputChange = false
  this._inputChanges = {}
}

Bytecode.prototype.defineInputs = function defineInputs (storage, instance) {
  var self = this
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
        self._inputChanges[name] = input
        self._anyInputChange = true
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
