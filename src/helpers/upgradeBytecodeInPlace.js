var xmlToMana = require('./xmlToMana')
var visitManaTree = require('./visitManaTree')

var STRING_TYPE = 'string'

/**
 * @method upgradeBytecodeInPlace
 * @description Mechanism to modify our bytecode from legacy format to the current format.
 * Think of this like a migration that always runs in production components just in case we
 * get something that happens to be legacy.
 */
function upgradeBytecodeInPlace (_bytecode, options) {
  if (!_bytecode.states) {
    _bytecode.states = {}
  }

  // Convert the properties array to the states dictionary
  if (_bytecode.properties) {
    console.info('[haiku player] auto-upgrading code properties array to states object (2.1.14+)')
    var properties = _bytecode.properties
    delete _bytecode.properties
    for (var i = 0; i < properties.length; i++) {
      var propertySpec = properties[i]
      var updatedSpec = {}
      if (propertySpec.value !== undefined) updatedSpec.value = propertySpec.value
      if (propertySpec.type !== undefined) updatedSpec.type = propertySpec.type
      if (propertySpec.setter !== undefined) updatedSpec.set = propertySpec.setter
      if (propertySpec.getter !== undefined) updatedSpec.get = propertySpec.getter
      if (propertySpec.set !== undefined) updatedSpec.set = propertySpec.set
      if (propertySpec.get !== undefined) updatedSpec.get = propertySpec.get
      _bytecode.states[propertySpec.name] = updatedSpec
    }
  }

  // Convert the eventHandlers array into a dictionary
  // [{selector:'foo',name:'onclick',handler:function}] => {'foo':{'onclick':{handler:function}}}
  if (Array.isArray(_bytecode.eventHandlers)) {
    console.info('[haiku player] auto-upgrading code event handlers to object format (2.1.14+)')
    var eventHandlers = _bytecode.eventHandlers
    delete _bytecode.eventHandlers
    _bytecode.eventHandlers = {}
    for (var j = 0; j < eventHandlers.length; j++) {
      var eventHandlerSpec = eventHandlers[j]
      if (!_bytecode.eventHandlers[eventHandlerSpec.selector]) _bytecode.eventHandlers[eventHandlerSpec.selector] = {}
      _bytecode.eventHandlers[eventHandlerSpec.selector][eventHandlerSpec.name] = {
        handler: eventHandlerSpec.handler
      }
    }
  }

  // Convert a string template into our internal object format
  if (typeof _bytecode.template === STRING_TYPE) {
    console.info('[haiku player] auto-upgrading template string to object format (2.0.0+)')
    _bytecode.template = xmlToMana(_bytecode.template)
  }

  // If specified, make sure that internal URL references, e.g. url(#my-filter), are unique
  // per each component instance, otherwise we will get filter collisions and weirdness on the page
  if (options && options.referenceUniqueness) {
    var referencesToUpdate = {}
    var alreadyUpdatedReferences = {}
    if (_bytecode.template) {
      visitManaTree('0', _bytecode.template, function _visitor (elementName, attributes, children, node) {
        if (elementName === 'filter') {
          if (attributes.id && !alreadyUpdatedReferences[attributes.id]) {
            var prev = attributes.id
            var next = prev + '-' + options.referenceUniqueness
            attributes.id = next
            referencesToUpdate['url(#' + prev + ')'] = 'url(#' + next + ')'
            alreadyUpdatedReferences[attributes.id] = true
          }
        }
      }, null, 0)
    }
    if (_bytecode.timelines) {
      for (var timelineName in _bytecode.timelines) {
        for (var selector in _bytecode.timelines[timelineName]) {
          for (var propertyName in _bytecode.timelines[timelineName][selector]) {
            // Don't proceed if we aren't dealing with a filter attribute
            if (propertyName !== 'filter') {
              continue
            }
            for (var keyframeMs in _bytecode.timelines[timelineName][selector][propertyName]) {
              var keyframeDesc = _bytecode.timelines[timelineName][selector][propertyName][keyframeMs]
              if (keyframeDesc && referencesToUpdate[keyframeDesc.value]) {
                console.info('[haiku player] changing filter url reference ' + keyframeDesc.value + ' to ' + referencesToUpdate[keyframeDesc.value])
                keyframeDesc.value = referencesToUpdate[keyframeDesc.value]
              }
            }
          }
        }
      }
    }
  }

  // What else?
}

module.exports = upgradeBytecodeInPlace
