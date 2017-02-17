var vanityHandlers = require('haiku-bytecode/src/properties/dom/vanities')
var ensureStyleProps = require('haiku-bytecode/src/properties/dom/ensureStyleProps')
var ensureLayoutProps = require('haiku-bytecode/src/properties/dom/ensureLayoutProps')
var queryTree = require('haiku-bytecode/src/cssQueryTree')
var Transitions = require('haiku-bytecode/src/Transitions')
var Utils = require('haiku-bytecode/src/Utils')
var Component = require('./component')
var Timeline = require('./timeline')

var CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children'
}

var FUNCTION_TYPE = 'function'
var STRING_TYPE = 'string'

function Template (template) {
  this.template = template
}

Template.prototype.getTree = function getTree () {
  return this.template
}

Template.prototype.expand = function _expand (context, component, inputs) {
  applyContextChanges(component, inputs, this.template)
  var tree = expandElement(this.template, context)
  return tree
}

function expandElement (element, context) {
  if (typeof element.elementName === FUNCTION_TYPE) {
    if (!element.__instance) element.__instance = instantiateElement(element, context)
    // Handlers attach first since they may want to respond to an immediate property setter
    if (element.__handlers) {
      for (var key in element.__handlers) {
        var handler = element.__handlers[key]
        if (!handler.__subscribed) {
          // We might have a component from a system that doesn't adhere to our own internal API
          if (element.__instance.instance) {
            element.__instance.instance.on(key, handler)
          }
          handler.__subscribed = true
        }
      }
    }
    // Cache previous messages and don't repeat any that have the same value as last time
    if (!element.previous) element.previous = {}
    for (var name in element.attributes) {
      if (element.previous[name] === element.attributes[name]) continue
      element.previous[name] = element.attributes[name]
      // We might have a component from a system that doesn't adhere to our own internal API
      if (element.__instance.instance) {
        element.__instance.instance[name] = element.attributes[name] // Apply top-down behavior
      }
    }
    var interior = element.__instance.render()
    return expandElement(interior, context)
  } else if (typeof element.elementName === STRING_TYPE) {
    var copy = shallowClone(element)
    // Handlers attach first since they may want to respond to an immediate property setter
    if (element.__handlers) {
      for (var nativekey in element.__handlers) {
        var nativehandler = element.__handlers[nativekey]
        if (!nativehandler.__subscribed) {
          element.attributes[nativekey] = nativehandler
          nativehandler.__subscribed = true
        }
      }
    }
    if (element.children && element.children.length > 0) {
      for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i]
        copy.children[i] = expandElement(child, context)
      }
    }
    return copy
  }
  return element
}

function shallowClone (element) {
  var clone = {}
  clone.__instance = element.__instance // Hack: Important to cache instance
  clone.__handlers = element.__handlers // Hack: Important to transfer event handlers
  clone.layout = element.layout
  clone.elementName = element.elementName
  clone.attributes = {}
  for (var key in element.attributes) clone.attributes[key] = element.attributes[key]
  clone.children = [] // Assigned downstream
  return clone
}

function instantiateElement (element, context) {
  var something = element.elementName(element.attributes, element.children, context)
  var instance
  if (Component.isBytecode(something)) instance = new Component(something)
  if (Component.isComponent(something)) instance = something
  instance.attributes = instance.props = element.attributes
  instance.children = instance.surrogates = element.children
  instance.context = context // Hack: Important
  instance.startTimeline(Timeline.DEFAULT_NAME) // Ensure we cue up timelines
  return instance
}

function applyContextChanges (component, inputs, template) {
  var results = {}

  component.eachEventHandler(function _eachEventHandler (handler, selector, eventname) {
    if (!results[selector]) results[selector] = {}
    handler.__handler = true
    results[selector][eventname] = handler
  })

  component.eachActiveTimeline(function _eachActiveTimeline (timeline, timelinename, cluster, now, selector, outputname) {
    if (!results[selector]) results[selector] = {}
    var finalValue = Transitions.calculateValue(cluster, now, component, inputs)
    if (Utils.isEmpty(finalValue)) return
    if (Utils.isEmpty(results[selector][outputname])) results[selector][outputname] = finalValue
    else results[selector][outputname] = Utils.mergeValue(results[selector][outputname], finalValue)
  })

  for (var selector in results) {
    var matches = findMatchingElements(selector, template)
    if (!matches || matches.length < 1) continue
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i]
      fixAttributes(match)
      var group = results[selector]
      for (var name in group) {
        var value = group[name]
        if (value.__handler) applyHandlerToElement(match, name, value)
        else applyPropertyToElement(match, name, value)
      }
    }
  }

  return template
}

function findMatchingElements (selector, template) {
  return queryTree([], template, selector, CSS_QUERY_MAPPING)
}

function fixAttributes (element) {
  ensureStyleProps(element)
  ensureLayoutProps(element)
  return element
}

function applyPropertyToElement (element, name, value) {
  if (vanityHandlers[element.elementName] && vanityHandlers[element.elementName][name]) {
    vanityHandlers[element.elementName][name](name, element, value)
  } else {
    element.attributes[name] = value
  }
}

function applyHandlerToElement (match, name, fn) {
  if (!match.__handlers) match.__handlers = {}
  match.__handlers[name] = fn
  return match
}

module.exports = Template
