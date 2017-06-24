var ValueBuilder = require('./ValueBuilder')
var vanityHandlers = require('./properties/dom/vanities')
var queryTree = require('./helpers/cssQueryTree')
var Layout3D = require('./Layout3D')
var scopifyElements = require('./helpers/scopifyElements')
var xmlToMana = require('./helpers/xmlToMana')
var assign = require('./helpers/assign')
var SimpleEventEmitter = require('./helpers/SimpleEventEmitter')
var initializeTreeAttributes = require('./helpers/initializeTreeAttributes')
var HaikuTimeline = require('./HaikuTimeline')

var PLAYER_VERSION = require('./../package.json').version

var FUNCTION_TYPE = 'function'
var STRING_TYPE = 'string'
var OBJECT_TYPE = 'object'

var IDENTITY_MATRIX = Layout3D.createMatrix()

var HAIKU_ID_ATTRIBUTE = 'haiku-id'

var DEFAULT_TIMELINE_NAME = 'Default'

var DEFAULT_OPTIONS = {

}

function HaikuComponent (bytecode, context, options) {
  if (!(this instanceof HaikuComponent)) return new HaikuComponent(bytecode, context, options)

  if (!bytecode) {
    throw new Error('Empty bytecode not allowed')
  }

  if (!bytecode.timelines) {
    throw new Error('Bytecode must define timelines')
  }

  if (!bytecode.template) {
    throw new Error('Bytecode must define template')
  }

  this.PLAYER_VERSION = PLAYER_VERSION

  SimpleEventEmitter.create(this)

  this.assignOptions(options)

  this._bytecode = bytecode
  this._context = context
  this._timelines = {}
  this._builder = new ValueBuilder(this)

  // The full version of the template gets mutated in-place by the rendering algorithm
  this._template = _fetchTemplate(this._bytecode.template)

  this._inputValues = {} // Storage for getter/setter actions in userland logic
  this._inputChanges = {}
  this._anyInputChange = false
  _defineInputs(this._inputValues, this)

  this._eventsFired = {}
  this._anyEventChange = false
  _bindEventHandlers(this)

  // Flag used internally to determine whether we need to re-render the full tree or can survive by just patching
  this._needsFullFlush = false

  // A list of any event handlers assigned to us via the optional controller instance that may have been used [#LEGACY?]
  this._controllerEventHandlers = []

  // The last output of a full re-render - I don't think this is important any more, except maybe for debugging [#LEGACY?]
  this._lastTemplateExpansion = null

  // Similar to above, except the last individual (patch) changes - may not be important anymore. [#LEGACY?]
  this._lastDeltaPatches = null

  // As a performance optimization, keep track of elements we've located as key/value (selector/element) pairs
  this._matchedElementCache = {}

  // A sort of cache with a mapping of elements to the scope in which they belong (div, svg, etc)
  this._renderScopes = {}
}

HaikuComponent.prototype._clearCaches = function _clearCaches () {
  this._inputValues = {}
  this._inputChanges = {}
  this._anyInputChange = false
  this._eventsFired = {}
  this._anyEventChange = false
  this._needsFullFlush = false
  this._controllerEventHandlers = []
  this._lastTemplateExpansion = null
  this._lastDeltaPatches = null
  this._matchedElementCache = {}
  this._renderScopes = {}
  this._clearDetectedEventsFired()
  this._clearDetectedInputChanges()
  this._builder._clearCaches()
}

HaikuComponent.prototype.assignOptions = function assignOptions (options) {
  this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {})

  for (var timelineName in this._timelines) {
    var timelineInstance = this._timelines[timelineName]
    timelineInstance.assignOptions(this.options)
  }

  return this
}

HaikuComponent.prototype.setOption = function setOption (key, value) {
  this.getOptions()[key] = value
  return this
}

HaikuComponent.prototype.getOption = function getOption (key) {
  return this.getOptions()[key]
}

HaikuComponent.prototype.getOptions = function getOptions () {
  return this.options
}

HaikuComponent.prototype.setOptions = function setOptions (incoming) {
  var options = this.getOptions()
  for (var key in incoming) options[key] = incoming[key]
  return this
}

HaikuComponent.prototype.getClock = function getClock () {
  return this._context.getClock()
}

HaikuComponent.prototype.getTimelines = function getTimelines () {
  return this._fetchTimelines()
}

HaikuComponent.prototype._fetchTimelines = function _fetchTimelines () {
  var names = Object.keys(this._bytecode.timelines)

  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (!name) continue

    var descriptor = this._getTimelineDescriptor(name)
    var existing = this._timelines[name]

    if (!existing) {
      this._timelines[name] = new HaikuTimeline(this, name, descriptor, this.options)
    }
  }

  return this._timelines
}

HaikuComponent.prototype.getTimeline = function getTimeline (name) {
  return this.getTimelines()[name]
}

HaikuComponent.prototype.getDefaultTimeline = function getDefaultTimeline () {
  var timelines = this.getTimelines()
  return timelines[DEFAULT_TIMELINE_NAME]
}

HaikuComponent.prototype.getActiveTimelines = function getActiveTimelines () {
  var activeTimelines = {}

  var timelines = this.getTimelines()

  for (var timelineName in timelines) {
    var timelineInstance = timelines[timelineName]
    if (timelineInstance.isActive()) {
      activeTimelines[timelineName] = timelineInstance
    }
  }

  return activeTimelines
}

HaikuComponent.prototype.stopAllTimelines = function stopAllTimelines () {
  for (var timelineName in this._timelines) {
    this.stopTimeline(timelineName)
  }
}

HaikuComponent.prototype.startAllTimelines = function startAllTimelines () {
  for (var timelineName in this._timelines) {
    this.startTimeline(timelineName)
  }
}

HaikuComponent.prototype.startTimeline = function startTimeline (timelineName) {
  var time = this._context.clock.getExplicitTime()
  var descriptor = this._getTimelineDescriptor(timelineName)
  var existing = this._timelines[timelineName]
  if (existing) {
    existing.start(time, descriptor)
  } else {
    // As a convenience we auto-initialize timeline if the user is trying to start one that hasn't initialized yet
    var fresh = new HaikuTimeline(this, timelineName, descriptor, this.options)
    fresh.start(time, descriptor) // Initialization alone doesn't start the timeline, so we start it explicitly
    this._timelines[timelineName] = fresh // Don't forget to add it to our collection
  }
}

HaikuComponent.prototype.stopTimeline = function startTimeline (timelineName) {
  var time = this._context.clock.getExplicitTime()
  var descriptor = this._getTimelineDescriptor(timelineName)
  var existing = this._timelines[timelineName]
  if (existing) {
    existing.stop(time, descriptor)
  }
}

HaikuComponent.prototype._getTimelineDescriptor = function _getTimelineDescriptor (timelineName) {
  return this._bytecode.timelines[timelineName]
}

HaikuComponent.prototype.getBytecode = function getBytecode () {
  return this._bytecode
}

HaikuComponent.prototype._getRenderScopes = function _getRenderScopes () {
  return this._renderScopes
}

/**
 * TODO:
 * Implement the methods commented out below
 */

// HaikuComponent.prototype.getFps = function getFps () {
// }

// HaikuComponent.prototype.setFps = function setFps (fps) {
// }

// HaikuComponent.prototype.getTimeUnits = function getTimeUnits () {
// }

// HaikuComponent.prototype.setTimeUnits = function setTimeUnits () {
// }

// Template.prototype.getTree = function getTree () {
//   return this.template
// }

/**
 **
 ** BELOW BE DRAGONS
 **
 **/

function _fetchTemplate (template) {
  if (!template) {
    throw new Error('Empty template not allowed')
  }

  if (typeof template === OBJECT_TYPE) {
    if (!template.elementName) {
      console.warn('[haiku player] warning: saw unexpected bytecode template format')
      console.log('[haiku player] template:', template)
    }
    return template
  }

  if (typeof template === STRING_TYPE) {
    return xmlToMana(template)
  }

  throw new Error('Unknown bytecode template format')
}

function _bindEventHandlers (component) {
  if (!component._bytecode.eventHandlers) {
    return void (0)
  }

  for (var i = 0; i < component._bytecode.eventHandlers.length; i++) {
    var eventHandlerDescriptor = component._bytecode.eventHandlers[i]
    var originalHandlerFn = eventHandlerDescriptor.handler

    _bindEventHandler(component, eventHandlerDescriptor, originalHandlerFn)
  }
}

function _bindEventHandler (component, eventHandlerDescriptor, originalHandlerFn) {
  eventHandlerDescriptor.handler = function _wrappedEventHandler (event, a, b, c, d, e, f, g, h, i, j, k) {
    component._anyEventChange = true

    if (!component._eventsFired[eventHandlerDescriptor.selector]) {
      component._eventsFired[eventHandlerDescriptor.selector] = {}
    }

    component._eventsFired[eventHandlerDescriptor.selector][eventHandlerDescriptor.name] = event || true

    originalHandlerFn.call(component, event, a, b, c, d, e, f, g, h, i, j, k)
  }
}

function _typecheckInputProperty (property) {
  if (property.type === 'any' || property.type === '*' || property.type === undefined || property.type === null) {
    return void (0)
  }

  if (property.type === 'event' || property.type === 'listener') {
    if (typeof property.value !== 'function' && property.value !== null && property.value !== undefined) {
      throw new Error('Property value `' + property.name + '` must be an event listener function')
    }
    return void (0)
  }

  if (typeof property.value !== property.type) {
    throw new Error('Property value `' + property.name + '` must be a `' + property.type + '`')
  }
}

function _defineInputs (inputValuesObject, component) {
  if (!component._bytecode.properties) {
    return void (0)
  }

  for (var i = 0; i < component._bytecode.properties.length; i++) {
    var property = component._bytecode.properties[i]

    // 'null' is the signal for an empty prop, not undefined.
    if (property.value === undefined) {
      throw new Error('Property `' + property.name + '` cannot be undefined; use null for empty properties')
    }

    // Don't allow the player's own API to be clobbered; TODO: How to handle this gracefully?
    // Note that the properties aren't actually stored on the player itself, but we still prevent the naming collision
    if (component[property.name] !== undefined) {
      throw new Error('Property `' + property.name + '` is a keyword or property reserved by the component instance')
    }

    // Don't allow duplicate properties to be declared (the property is an array so we have to check)
    if (inputValuesObject[property.name] !== undefined) {
      throw new Error('Property `' + property.name + '` was already declared in the input values object')
    }

    _typecheckInputProperty(property)

    inputValuesObject[property.name] = property.value

    _defineInput(component, inputValuesObject, property)
  }
}

function _defineInput (component, inputValuesObject, property) {
  // Note: We define the getter/setter on the object itself, but the storage occurs on the pass-in inputValuesObject
  Object.defineProperty(component, property.name, {
    get: function get () {
      return inputValuesObject[property.name]
    },

    set: function set (inputValue) {
      // For optimization downstream, we track whether & which input values changed since a previous setter call
      component._inputChanges[property.name] = inputValue
      component._anyInputChange = true

      if (property.setter) {
        // Important: We call the setter with a binding of the component, so it can access methods on `this`
        inputValuesObject[property.name] = property.setter.call(component, inputValue)
      } else {
        inputValuesObject[property.name] = inputValue
      }

      return inputValuesObject[property.name]
    }
  })
}

HaikuComponent.prototype._markForFullFlush = function _markForFullFlush (doMark) {
  this._needsFullFlush = true
  return this
}

HaikuComponent.prototype._shouldPerformFullFlush = function _shouldPerformFullFlush () {
  return this._needsFullFlush
}

HaikuComponent.prototype._getEventsFired = function _getEventsFired () {
  return this._anyEventChange && this._eventsFired
}

HaikuComponent.prototype._getInputsChanged = function _getInputsChanged () {
  return this._anyInputChange && this._inputChanges
}

HaikuComponent.prototype._clearDetectedEventsFired = function _clearDetectedEventsFired () {
  this._anyEventChange = false
  this._eventsFired = {}
  return this
}

HaikuComponent.prototype._clearDetectedInputChanges = function _clearDetectedInputChanges () {
  this._anyInputChange = false
  this._inputChanges = {}
  return this
}

HaikuComponent.prototype.patch = function patch (container, patchOptions) {
  var time = this._context.clock.getExplicitTime()

  var timelinesRunning = []
  for (var timelineName in this._timelines) {
    var timeline = this._timelines[timelineName]
    if (timeline.isActive()) {
      timeline._doUpdateWithGlobalClockTime(time)

      // The default timeline is always considered to be running
      if (timelineName === 'Default' || !timeline.isFinished()) {
        timelinesRunning.push(timeline)
      }
    }
  }

  var eventsFired = this._getEventsFired()
  var inputsChanged = this._getInputsChanged()

  this._lastDeltaPatches = _gatherDeltaPatches(this, this._template, container, this._context, this._inputValues, timelinesRunning, eventsFired, inputsChanged, patchOptions || {})

  this._clearDetectedEventsFired()
  this._clearDetectedInputChanges()

  return this._lastDeltaPatches
}

HaikuComponent.prototype.render = function render (container, renderOptions) {
  var time = this._context.clock.getExplicitTime()

  for (var timelineName in this._timelines) {
    var timeline = this._timelines[timelineName]

    // QUESTION: What differentiates an active timeline from a playing one?
    if (timeline.isActive()) {
      timeline._doUpdateWithGlobalClockTime(time)
    }
  }

  // 1. Update the tree in place using all of the applied values we got from the timelines
  _applyContextChanges(this, this._inputValues, this._template, container, this._context, renderOptions || {})

  // 2. Given the above updates, 'expand' the tree to its final form (which gets flushed out to the mount element)
  this._lastTemplateExpansion = _expandTreeElement(this._template, this._context)

  this._needsFullFlush = false

  return this._lastTemplateExpansion
}

function _accumulateEventHandlers (out, component) {
  if (component._bytecode.eventHandlers) {
    for (var j = 0; j < component._bytecode.eventHandlers.length; j++) {
      var eventHandler = component._bytecode.eventHandlers[j]
      var eventSelector = eventHandler.selector
      var eventName = eventHandler.name

      if (!out[eventSelector]) out[eventSelector] = {}

      eventHandler.handler.__handler = true
      out[eventSelector][eventName] = eventHandler.handler
    }
  }
}

function _accumulateControllerEventListeners (out, component) {
  if (component._controllerEventHandlers && component._controllerEventHandlers.length > 0) {
    for (var l = 0; l < component._controllerEventHandlers.length; l++) {
      var customHandler = component._controllerEventHandlers[l]
      if (!out[customHandler.selector]) out[customHandler.selector] = {}
      out[customHandler.selector][customHandler.event] = customHandler.handler
    }
  }
}

function _applyAccumulatedResults (results, deltas, component, template, context) {
  for (var selector in results) {
    var matches = _findMatchingElementsByCssSelector(selector, template, component._matchedElementCache)

    if (!matches || matches.length < 1) {
      continue
    }

    var group = results[selector]

    for (var j = 0; j < matches.length; j++) {
      var match = matches[j]

      var domId = match && match.attributes && match.attributes.id
      var haikuId = match && match.attributes && match.attributes[HAIKU_ID_ATTRIBUTE]
      var flexibleId = haikuId || domId

      if (deltas && flexibleId) {
        deltas[flexibleId] = match
      }

      // [#LEGACY?]
      if (group.transform) {
        match.__transformed = true
      }

      for (var key in group) {
        var value = group[key]
        // The value may either be a handler (event handler) function, or just a normal value
        if (value && value.__handler) {
          _applyHandlerToElement(match, key, value, context, component)
        } else {
          _applyPropertyToElement(match, key, value, context, component)
        }
      }
    }
  }
}

function _gatherDeltaPatches (component, template, container, context, inputValues, timelinesRunning, eventsFired, inputsChanged, patchOptions) {
  var deltas = {} // This is what we're going to return - a dictionary of ids to elements

  var results = {} // This is where we'll accumulate changes - to apply to elements before returning the dictionary

  var bytecode = component._bytecode

  for (var i = 0; i < timelinesRunning.length; i++) {
    var timeline = timelinesRunning[i]
    var time = timeline.getBoundedTime()

    component._builder.build(results, timeline.getName(), time, bytecode.timelines, true, inputValues, eventsFired, inputsChanged)
  }

  initializeTreeAttributes(template, container) // handlers/vanities depend on attributes objects existing in the first place

  _applyAccumulatedResults(results, deltas, component, template, context)

  if (patchOptions.sizing) {
    _computeAndApplyPresetSizing(template, container, patchOptions.sizing, deltas)
  }

  // TODO: Calculating the tree layout should be skipped for already visited node
  // that we have already calculated among the descendants of the changed one
  for (var flexId in deltas) {
    var changedNode = deltas[flexId]
    _computeAndApplyTreeLayouts(changedNode, changedNode.__parent, patchOptions)
  }

  return deltas
}

function _applyContextChanges (component, inputs, template, container, context, renderOptions) {
  var results = {} // We'll accumulate changes in this object and apply them to the tree

  _accumulateEventHandlers(results, component)
  _accumulateControllerEventListeners(results, component)

  var bytecode = component._bytecode

  if (bytecode.timelines) {
    for (var timelineName in bytecode.timelines) {
      var timeline = component.getTimeline(timelineName)
      if (!timeline) continue

      // No need to run properties on timelines that aren't active
      if (!timeline.isActive()) continue

      if (timeline.isFinished()) {
        // For any timeline other than the default, shut it down if it has gone past
        // its final keyframe. The default timeline is a special case which provides
        // fallbacks/behavior that is essentially true throughout the lifespan of the component
        if (timelineName !== DEFAULT_TIMELINE_NAME) {
          continue
        }
      }

      var time = timeline.getBoundedTime()

      component._builder.build(results, timelineName, time, bytecode.timelines, false, inputs)
    }
  }

  initializeTreeAttributes(template, container) // handlers/vanities depend on attributes objects existing

  scopifyElements(template) // I think this only needs to happen once when we build the full tree

  _applyAccumulatedResults(results, null, component, template, context, component)

  if (renderOptions.sizing) {
    _computeAndApplyPresetSizing(template, container, renderOptions.sizing)
  }

  _computeAndApplyTreeLayouts(template, container, renderOptions)

  return template
}

function _expandTreeElement (element, context) {
  if (typeof element.elementName === FUNCTION_TYPE) {
    if (!element.__instance) element.__instance = _instantiateElement(element, context)

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

    // Call render on the interior element to get its full subtree, and recurse
    var interior = element.__instance.render()

    return _expandTreeElement(interior, context)
  }

  if (typeof element.elementName === STRING_TYPE) {
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

    var copy = _shallowCloneComponentTreeElement(element)

    if (element.children && element.children.length > 0) {
      for (var i = 0; i < element.children.length; i++) {
        var child = element.children[i]
        copy.children[i] = _expandTreeElement(child, context)
      }
    }

    return copy
  }

  // If we got here, we've either completed recursion or there's nothing special to do - so just return the element itself
  return element
}

function _instantiateElement (element, context) {
  // Similar to React, if the element name is a function, invoke it to get its renderable
  var something = element.elementName(element.attributes, element.children, context)

  var instance

  // The thing returned can either be raw bytecode, or a component instance.
  // We do our best to detect this, and proceed with a HaikuComponent instance.
  if (_isBytecode(something)) {
    instance = new HaikuComponent(something, context, context.options)
  } else if (_isComponent(something)) {
    instance = something
  }

  return instance
}

function _shallowCloneComponentTreeElement (element) {
  var clone = {}

  clone.__instance = element.__instance // Cache the instance

  clone.__handlers = element.__handlers // Transfer active event handlers

  clone.__transformed = element.__transformed // Transfer flag detecting whether a transform has occurred [#LEGACY?]

  clone.__parent = element.__parent // Make sure it doesn't get detached from its ancestors

  clone.__scope = element.__scope // It still has the same scope (svg, div, etc)

  clone.layout = element.layout // Allow its layout, which we update in-place, to remain a pointer

  // Simply copy over the other standard parts of the node...
  clone.elementName = element.elementName
  clone.attributes = {}
  for (var key in element.attributes) {
    clone.attributes[key] = element.attributes[key]
  }

  // But as for children, these get assigned downstream after each gets expanded
  clone.children = []

  return clone
}

var CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children'
}

function _findMatchingElementsByCssSelector (selector, template, cache) {
  if (cache[selector]) return cache[selector]
  var matches = queryTree([], template, selector, CSS_QUERY_MAPPING)
  cache[selector] = matches
  return matches
}

function _computeAndApplyTreeLayouts (tree, container, options) {
  if (!tree || typeof tree === 'string') return void (0)

  _computeAndApplyNodeLayout(tree, container, options)

  if (!tree.children) return void (0)
  if (tree.children.length < 1) return void (0)

  for (var i = 0; i < tree.children.length; i++) {
    _computeAndApplyTreeLayouts(tree.children[i], tree, options)
  }
}

function _computeAndApplyNodeLayout (element, parent, options) {
  if (parent) {
    var parentSize = parent.layout.computed.size
    var computedLayout = Layout3D.computeLayout({}, element.layout, element.layout.matrix, IDENTITY_MATRIX, parentSize)

    if (computedLayout === false) { // False indicates 'don't show
      element.layout.computed = {
        invisible: true,
        size: parentSize || { x: 0, y: 0, z: 0 }
      }
    } else {
      element.layout.computed = computedLayout || { size: parentSize } // Need to pass some size to children, so if this element doesn't have one, use the parent's
    }
  }
}

function _applyPropertyToElement (element, name, value, context, component) {
  if (vanityHandlers[element.elementName] && vanityHandlers[element.elementName][name]) {
    vanityHandlers[element.elementName][name](name, element, value, context, component)
  } else {
    element.attributes[name] = value
  }
}

function _applyHandlerToElement (match, name, fn, context, component) {
  if (!match.__handlers) match.__handlers = {}
  match.__handlers[name] = fn
  return match
}

function _computeAndApplyPresetSizing (element, container, mode, deltas) {
  if (mode === true) {
    mode = 'contain'
  }

  var elementWidth = element.layout.sizeAbsolute.x
  var elementHeight = element.layout.sizeAbsolute.y

  var containerWidth = container.layout.computed.size.x
  var containerHeight = container.layout.computed.size.y

  // I.e., the amount by which we'd have to multiply the element's scale to make it
  // exactly the same size as its container (without going above it)
  var scaleDiffX = containerWidth / elementWidth
  var scaleDiffY = containerHeight / elementHeight

  // This makes sure that the sizing occurs with respect to a correct and consistent origin point,
  // but only if the user didn't happen to explicitly set this value (we allow their override).
  if (!element.attributes.style['transform-origin']) {
    element.attributes.style['transform-origin'] = 'top left'
  }

  // IMPORTANT: If any value has been changed on the element, you must set this to true.
  // Otherwise the changed object won't go into the deltas dictionary, and the element won't update.
  var changed = false

  switch (mode) {
    // Make the base element its default scale, which is just a multiplier of one. This is the default.
    case 'normal':
      if (element.layout.scale.x !== 1.0) {
        changed = true
        element.layout.scale.x = 1.0
      }
      if (element.layout.scale.y !== 1.0) {
        changed = true
        element.layout.scale.y = 1.0
      }
      break

    // Stretch the element to fit the container on both x and y dimensions (distortion allowed)
    case 'stretch':
      if (scaleDiffX !== element.layout.scale.x) {
        changed = true
        element.layout.scale.x = scaleDiffX
      }
      if (scaleDiffY !== element.layout.scale.y) {
        changed = true
        element.layout.scale.y = scaleDiffY
      }
      break

    // CONTAIN algorithm
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size?v=example
    // A keyword that scales the image as large as possible and maintains image aspect ratio
    // (image doesn't get squished). Image is letterboxed within the container.
    // When the image and container have different dimensions, the empty areas (either top/bottom of left/right)
    // are filled with the background-color.
    case 'contain':
      var containScaleToUse = null

      // We're looking for the larger of the two scales that still allows both dimensions to fit in the box
      // The rounding is necessary to avoid precision issues, where we end up comparing e.g. 2.0000000000001 to 2
      if (~~(scaleDiffX * elementWidth) <= containerWidth && ~~(scaleDiffX * elementHeight) <= containerHeight) {
        containScaleToUse = scaleDiffX
      }
      if (~~(scaleDiffY * elementWidth) <= containerWidth && ~~(scaleDiffY * elementHeight) <= containerHeight) {
        if (containScaleToUse === null) {
          containScaleToUse = scaleDiffY
        } else {
          if (scaleDiffY >= containScaleToUse) {
            containScaleToUse = scaleDiffY
          }
        }
      }

      // We shouldn't ever be null here, but in case of a defect, show this warning
      if (containScaleToUse === null) {
        console.warn('[haiku player] unable to compute scale for contain sizing algorithm')
        return void (0)
      }

      changed = true // HACK: Unless we assume we changed, there seems to be an off-by-a-frame issue

      element.layout.scale.x = containScaleToUse
      element.layout.scale.y = containScaleToUse

      // Offset the translation so that the element remains centered within the letterboxing
      element.layout.translation.x = -((containScaleToUse * elementWidth) - containerWidth) / 2
      element.layout.translation.y = -((containScaleToUse * elementHeight) - containerHeight) / 2

      break

    // COVER algorithm (inverse of CONTAIN)
    // see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size?v=example
    // A keyword that is the inverse of contain. Scales the image as large as possible and maintains
    // image aspect ratio (image doesn't get squished). The image "covers" the entire width or height
    // of the container. When the image and container have different dimensions, the image is clipped
    // either left/right or top/bottom.
    case 'cover':
      var coverScaleToUse = null

      // We're looking for the smaller of two scales that ensures the entire box is covered.
      // The rounding is necessary to avoid precision issues, where we end up comparing e.g. 2.0000000000001 to 2
      if (~~(scaleDiffX * elementWidth) >= containerWidth && ~~(scaleDiffX * elementHeight) >= containerHeight) {
        coverScaleToUse = scaleDiffX
      }
      if (~~(scaleDiffY * elementWidth) >= containerWidth && ~~(scaleDiffY * elementHeight) >= containerHeight) {
        if (coverScaleToUse === null) {
          coverScaleToUse = scaleDiffY
        } else {
          if (scaleDiffY <= coverScaleToUse) {
            coverScaleToUse = scaleDiffY
          }
        }
      }

      changed = true // HACK: Unless we assume we changed, there seems to be an off-by-a-frame issue

      element.layout.scale.x = coverScaleToUse
      element.layout.scale.y = coverScaleToUse

      // Offset the translation so that the element remains centered within the letterboxing
      element.layout.translation.x = -((coverScaleToUse * elementWidth) - containerWidth) / 2
      element.layout.translation.y = -((coverScaleToUse * elementHeight) - containerHeight) / 2

      break
  }

  if (changed && deltas) {
    // Part of the render/update system involves populating a dictionary of per-element updates,
    // which explains why instead of returning a value here, we assign the updated element.
    // The 'deltas' dictionary is passed to us from the render functions upstream of here.
    deltas[element.attributes[HAIKU_ID_ATTRIBUTE]] = element
  }
}

function _isBytecode (thing) {
  return thing && typeof thing === OBJECT_TYPE && thing.template
}

function _isComponent (thing) {
  return thing && typeof thing.render === FUNCTION_TYPE
}

module.exports = HaikuComponent
