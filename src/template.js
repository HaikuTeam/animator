var vanityHandlers = require('haiku-bytecode/src/properties/dom/vanities')
var queryTree = require('haiku-bytecode/src/cssQueryTree')
var Layout3D = require('haiku-bytecode/src/Layout3D')
var ValueBuilder = require('haiku-bytecode/src/ValueBuilder')

var Component = require('./component')
var Timeline = require('./timeline')

var IDENTITY_MATRIX = Layout3D.createMatrix()
var HAIKU_ID_ATTRIBUTE = 'haiku-id'
var CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children'
}
var FUNCTION_TYPE = 'function'
var STRING_TYPE = 'string'

function Template (template, component) {
  this.template = template
  this.component = component
  this.builder = new ValueBuilder(component, template)
  this._matches = {}
  this._controllerEventHandlers = []
}

Template.prototype.getTree = function getTree () {
  return this.template
}

Template.prototype.expand = function _expand (context, component, container, inputs) {
  applyContextChanges(component, inputs, this.template, container, this)
  var tree = expandElement(this.template, context)
  return tree
}

Template.prototype.eventListenerDeltas = function _eventListenerDeltas (context, component, container, inputs, timelinesRunning, eventsFired, inputsChanged) {
  var deltas = gatherEventListenerDeltas(this, this.template, container, context, component, inputs, timelinesRunning, eventsFired, inputsChanged)
  return deltas
}

Template.prototype.deltas = function _deltas (context, component, container, inputs, timelinesRunning, eventsFired, inputsChanged) {
  var deltas = gatherDeltas(this, this.template, container, context, component, inputs, timelinesRunning, eventsFired, inputsChanged)
  return deltas
}

function accumulateEventHandlers (out, component) {
  var bytecode = component.bytecode.bytecode
  if (bytecode.eventHandlers) {
    for (var j = 0; j < bytecode.eventHandlers.length; j++) {
      var eventHandler = bytecode.eventHandlers[j]
      var eventSelector = eventHandler.selector
      var eventName = eventHandler.name
      var handler = eventHandler.handler
      if (!out[eventSelector]) out[eventSelector] = {}
      handler.__handler = true
      out[eventSelector][eventName] = handler
    }
  }
}

function accumulateControllerEventListeners (out, me) {
  if (me._controllerEventHandlers && me._controllerEventHandlers.length > 0) {
    for (var l = 0; l < me._controllerEventHandlers.length; l++) {
      var customHandler = me._controllerEventHandlers[l]
      if (!out[customHandler.selector]) out[customHandler.selector] = {}
      out[customHandler.selector][customHandler.event] = customHandler.handler
    }
  }
}

function applyAccumulatedResults (results, deltas, me, template) {
  for (var selector in results) {
    var matches = findMatchingElements(selector, template, me._matches)
    if (!matches || matches.length < 1) continue
    var group = results[selector]
    for (var j = 0; j < matches.length; j++) {
      var match = matches[j]
      var domId = match && match.attributes && match.attributes.id
      var haikuId = match && match.attributes && match.attributes[HAIKU_ID_ATTRIBUTE]
      var flexibleId = haikuId || domId
      if (deltas && flexibleId) deltas[flexibleId] = match
      if (group.transform) match.__transformed = true
      for (var key in group) {
        var value = group[key]
        if (value.__handler) applyHandlerToElement(match, key, value)
        else applyPropertyToElement(match, key, value)
      }
    }
  }
}

function gatherEventListenerDeltas (me, template, container, context, component, inputs, timelinesRunning, eventsFired, inputsChanged) {
  var deltas = {}
  var results = {}
  accumulateEventHandlers(results, component)
  accumulateControllerEventListeners(results, me)
  applyAccumulatedResults(results, deltas, me, template)
  return deltas
}

function gatherDeltas (me, template, container, context, component, inputs, timelinesRunning, eventsFired, inputsChanged) {
  var deltas = {}
  var results = {}
  var bytecode = component.bytecode.bytecode
  for (var i = 0; i < timelinesRunning.length; i++) {
    var timeline = timelinesRunning[i]
    me.builder.build(results, timeline.name, timeline.local, bytecode.timelines, true, inputs, eventsFired, inputsChanged)
  }
  applyAccumulatedResults(results, deltas, me, template)
  for (var flexId in deltas) {
    var changedNode = deltas[flexId]
    calculateTreeLayouts(changedNode, changedNode.__parent)
  }
  return deltas
}

function applyContextChanges (component, inputs, template, container, me) {
  var results = {}
  accumulateEventHandlers(results, component)
  accumulateControllerEventListeners(results, me)
  var bytecode = component.bytecode.bytecode
  if (bytecode.timelines) {
    for (var timelineName in bytecode.timelines) {
      var timeline = component.store.get('timelines')[timelineName]
      if (!timeline) continue
      // No need to run properties on timelines that aren't active
      if (!timeline.isActive()) continue
      if (timeline.isFinished()) {
        // For any timeline other than the default, shut it down if it has gone past
        // its final keyframe. The default timeline is a special case which provides
        // fallbacks/behavior that is essentially true throughout the lifespan of the component
        if (timelineName !== Timeline.DEFAULT_NAME) {
          continue
        }
      }
      me.builder.build(results, timelineName, timeline.local, bytecode.timelines, false, inputs)
    }
  }
  initializeTreeAttributes(template, container) // handlers/vanities depend on attributes objects existing
  applyAccumulatedResults(results, null, me, template)
  calculateTreeLayouts(template, container)
  return template
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
    var copy = shallowClone(element)
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
  clone.__transformed = element.__transformed // ditto
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

function findMatchingElements (selector, template, cache) {
  if (cache[selector]) return cache[selector]
  var matches = queryTree([], template, selector, CSS_QUERY_MAPPING)
  cache[selector] = matches
  return matches
}

function initializeTreeAttributes (tree, container) {
  if (!tree || typeof tree === 'string') return
  initializeNodeAttributes(tree, container)
  tree.__parent = container
  if (!tree.children) return
  if (tree.children.length < 1) return
  for (var i = 0; i < tree.children.length; i++) initializeTreeAttributes(tree.children[i], tree)
}

function calculateTreeLayouts (tree, container) {
  if (!tree || typeof tree === 'string') return
  calculateNodeLayout(tree, container)
  if (!tree.children) return
  if (tree.children.length < 1) return
  for (var i = 0; i < tree.children.length; i++) calculateTreeLayouts(tree.children[i], tree)
}

function calculateNodeLayout (element, parent) {
  if (parent) {
    var parentSize = parent.layout.computed.size
    var computedLayout = Layout3D.computeLayout({}, element.layout, element.layout.matrix, IDENTITY_MATRIX, parentSize)
    element.layout.computed = computedLayout || { size: parentSize } // Need to pass some size to children, so if this element doesn't have one, use the parent's
  }
}

var ELEMENTS_2D = {
  circle: true,
  ellipse: true,
  foreignObject: true,
  g: true,
  image: true,
  line: true,
  mesh: true,
  path: true,
  polygon: true,
  polyline: true,
  rect: true,
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  unknown: true,
  use: true
}

function initializeNodeAttributes (element, parent) {
  if (!element.attributes) element.attributes = {}
  if (!element.attributes.style) element.attributes.style = {}
  if (!element.layout) {
    element.layout = Layout3D.createLayoutSpec()
    element.layout.matrix = Layout3D.createMatrix()
    element.layout.format = (ELEMENTS_2D[element.elementName]) ? Layout3D.FORMATS.TWO : Layout3D.FORMATS.THREE
  }
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
