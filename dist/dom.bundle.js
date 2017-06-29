(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HaikuDOMPlayer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(_dereq_,module,exports){
module.exports={
  "name": "@haiku/player",
  "version": "2.1.9",
  "description": "Haiku Player is a JavaScript library for building user interfaces",
  "homepage": "https://haiku.ai",
  "keywords": [
    "animation",
    "motion",
    "component",
    "web",
    "browser",
    "svg",
    "rendering",
    "engine"
  ],
  "repository": "https://github.com/HaikuTeam/player",
  "main": "index.js",
  "scripts": {
    "test": "npm run test:unit",
    "test:unit": "tape \"test/unit/**/*.test.js\" | tap-spec || true",
    "lint": "standard \"src/**/*.js\" --fix --verbose | snazzy || true",
    "prettify": "prettier-standard \"{,!(node_modules|dist)/**/}*.js\"",
    "footprint": "./footprint.sh",
    "demo": "nodemon ./test/demo/server.js",
    "start": "npm run demo"
  },
  "authors": [
    "Matthew Trost <matthew@haiku.ai>",
    "Zack Brown <zack@haiku.ai>",
    "Taylor Poe <taylor@haiku.ai>"
  ],
  "license": "LicenseRef-LICENSE",
  "devDependencies": {
    "browserify": "^14.1.0",
    "browserify-transform-tools": "^1.7.0",
    "express": "4.14.1",
    "filesize": "3.5.10",
    "fs-extra": "2.0.0",
    "handlebars": "4.0.6",
    "jsdom": "9.11.0",
    "nodemon": "1.11.0",
    "prettier-standard": "^5.1.0",
    "react-dom": "15.4.2",
    "react-router-dom": "^4.1.1",
    "rollup": "^0.43.0",
    "snazzy": "6.0.0",
    "standard": "8.6.0",
    "tap-spec": "4.1.1",
    "tape": "4.6.3",
    "uglify-js": "^2.7.5"
  },
  "dependencies": {
    "lodash.merge": "4.6.0",
    "react-test-renderer": "15.4.2"
  },
  "peerDependencies": {
    "react": "15.4.2",
    "react-dom": "15.4.2"
  }
}

},{}],3:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var raf = _dereq_('./vendor/raf')
var assign = _dereq_('./vendor/assign')
var SimpleEventEmitter = _dereq_('./helpers/SimpleEventEmitter')

var NUMBER = 'number'

var DEFAULT_OPTIONS = {
  // frameDuration: Number
  // Time to elapse per frame (ms)
  frameDuration: 16.666,

  // frameDelay: Number
  // How long to wait between each tick (ms)
  frameDelay: 16.666,

  // marginOfErrorForDelta: Number
  // A bit of grace when calculating whether a new frame should be run
  marginOfErrorForDelta: 1.0
}

function HaikuClock (tickables, component, options) {
  if (!(this instanceof HaikuClock)) return new HaikuClock(component)

  SimpleEventEmitter.create(this)

  this._tickables = tickables
  this._component = component

  this.assignOptions(options)

  this._isRunning = false
  this._reinitialize()

  this._raf = null // We'll create our raf function on our first run of our loop
  this.run = this.run.bind(this) // Bind to avoid `this`-detachment when called by raf
}

HaikuClock.prototype._reinitialize = function _reinitialize () {
  this._numLoopsRun = 0
  this._localFramesElapsed = 0
  this._localTimeElapsed = 0
  this._deltaSinceLastTick = 0
  this._localExplicitlySetTime = null
  return this
}

HaikuClock.prototype.addTickable = function addTickable (tickable) {
  this._tickables.push(tickable)
  return this
}

HaikuClock.prototype.assignOptions = function assignOptions (options) {
  this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {})
  return this
}

HaikuClock.prototype.run = function run () {
  if (this.isRunning()) {
    // If time is "controlled" we are locked to an explicitly set local time, so no math i sneeded
    if (this._isTimeControlled()) {
      this.tick()
    } else {
      // If we got here, we need to evaluate the time elapsed, and determine if we've waited long enough for a frame
      this._numLoopsRun++

      var prevTime = this._localTimeElapsed
      var nextTime = prevTime + this.options.frameDuration
      var deltaSinceLastTick = nextTime - prevTime + this._deltaSinceLastTick

      if (
        deltaSinceLastTick >=
        this.options.frameDelay - this.options.marginOfErrorForDelta
      ) {
        this.tick()

        this._localFramesElapsed++
        this._localTimeElapsed = nextTime
        this._deltaSinceLastTick = 0 // Must reset delta when frame has been completed
      } else {
        // If we got here, this loop is faster than the desired speed; wait till next call
        this._deltaSinceLastTick = deltaSinceLastTick
      }
    }
  }

  // Queue up the next animation frame loop
  this._raf = raf(this.run)
  return this
}

HaikuClock.prototype._cancelRaf = function _cancelRaf () {
  if (this._raf) raf.cancel(this._raf)
  return this
}

HaikuClock.prototype.tick = function tick () {
  for (var i = 0; i < this._tickables.length; i++) {
    this._tickables[i].performTick()
  }
  return this
}

HaikuClock.prototype.getTime = function getTime () {
  return this.getExplicitTime()
}

HaikuClock.prototype.setTime = function setTime (time) {
  this._localExplicitlySetTime = parseInt(time || 0, 10)
  return this
}

/**
 * @method getExplicitTime
 * @description Return either the running time or the controlled time, depending on whether this
 * clock is in control mode or not.
 */
HaikuClock.prototype.getExplicitTime = function getExplicitTime () {
  if (this._isTimeControlled()) return this.getControlledTime()
  return this.getRunningTime()
}

/**
 * @method getControlledTime
 * @description Return the value of time that has been explicitly controlled.
 */
HaikuClock.prototype.getControlledTime = function getControlledTime () {
  return this._localExplicitlySetTime
}

HaikuClock.prototype._isTimeControlled = function _isTimeControlled () {
  return typeof this._localExplicitlySetTime === NUMBER
}

/**
 * @method getRunningTime
 * @description Return the running time, which is the value of time that has elapsed whether or
 * not time has been 'controlled' in control mode.
 */
HaikuClock.prototype.getRunningTime = function getRunningTime () {
  return this._localTimeElapsed
}

HaikuClock.prototype.isRunning = function isRunning () {
  return this._isRunning
}

HaikuClock.prototype.start = function start () {
  this._isRunning = true
  return this
}

HaikuClock.prototype.stop = function stop () {
  this._isRunning = false
  return this
}

HaikuClock.prototype.getFrameDuration = function getFrameDuration () {
  return this.options.frameDuration
}

/**
 * TODO:
 * Implement the below:
 */

// HaikuClock.prototype.getFps = function getFps () {
// }

// HaikuClock.prototype.setFps = function setFps () {
// }

module.exports = HaikuClock

},{"./helpers/SimpleEventEmitter":15,"./vendor/assign":75,"./vendor/raf":128}],4:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var ValueBuilder = _dereq_('./ValueBuilder')
var vanityHandlers = _dereq_('./properties/dom/vanities')
var queryTree = _dereq_('./helpers/cssQueryTree')
var Layout3D = _dereq_('./Layout3D')
var scopifyElements = _dereq_('./helpers/scopifyElements')
var xmlToMana = _dereq_('./helpers/xmlToMana')
var assign = _dereq_('./vendor/assign')
var SimpleEventEmitter = _dereq_('./helpers/SimpleEventEmitter')
var HaikuTimeline = _dereq_('./HaikuTimeline')

var PLAYER_VERSION = _dereq_('./../package.json').version

var FUNCTION_TYPE = 'function'
var STRING_TYPE = 'string'
var OBJECT_TYPE = 'object'

var IDENTITY_MATRIX = Layout3D.createMatrix()

var HAIKU_ID_ATTRIBUTE = 'haiku-id'

var DEFAULT_TIMELINE_NAME = 'Default'

var DEFAULT_OPTIONS = {}

function HaikuComponent (bytecode, context, options) {
  if (!(this instanceof HaikuComponent)) {
    return new HaikuComponent(bytecode, context, options)
  }

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
  for (var key in incoming) {
    options[key] = incoming[key]
  }
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
      this._timelines[name] = new HaikuTimeline(
        this,
        name,
        descriptor,
        this.options
      )
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

HaikuComponent.prototype._getTimelineDescriptor = function _getTimelineDescriptor (
  timelineName
) {
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
      console.warn(
        '[haiku player] warning: saw unexpected bytecode template format'
      )
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
    return void 0
  }

  for (var i = 0; i < component._bytecode.eventHandlers.length; i++) {
    var eventHandlerDescriptor = component._bytecode.eventHandlers[i]
    var originalHandlerFn = eventHandlerDescriptor.handler

    _bindEventHandler(component, eventHandlerDescriptor, originalHandlerFn)
  }
}

function _bindEventHandler (
  component,
  eventHandlerDescriptor,
  originalHandlerFn
) {
  eventHandlerDescriptor.handler = function _wrappedEventHandler (
    event,
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k
  ) {
    component._anyEventChange = true
    var selector = eventHandlerDescriptor.selector

    if (!component._eventsFired[selector]) {
      component._eventsFired[selector] = {}
    }

    component._eventsFired[selector][eventHandlerDescriptor.name] =
      event || true

    originalHandlerFn.call(component, event, a, b, c, d, e, f, g, h, i, j, k)
  }
}

function _typecheckInputProperty (property) {
  if (
    property.type === 'any' ||
    property.type === '*' ||
    property.type === undefined ||
    property.type === null
  ) {
    return void 0
  }

  if (property.type === 'event' || property.type === 'listener') {
    if (
      typeof property.value !== 'function' &&
      property.value !== null &&
      property.value !== undefined
    ) {
      throw new Error(
        'Property value `' +
          property.name +
          '` must be an event listener function'
      )
    }
    return void 0
  }

  if (typeof property.value !== property.type) {
    throw new Error(
      'Property value `' + property.name + '` must be a `' + property.type + '`'
    )
  }
}

function _defineInputs (inputValuesObject, component) {
  if (!component._bytecode.properties) {
    return void 0
  }

  for (var i = 0; i < component._bytecode.properties.length; i++) {
    var property = component._bytecode.properties[i]

    // 'null' is the signal for an empty prop, not undefined.
    if (property.value === undefined) {
      throw new Error(
        'Property `' +
          property.name +
          '` cannot be undefined; use null for empty properties'
      )
    }

    // Don't allow the player's own API to be clobbered; TODO: How to handle this gracefully?
    // Note that the properties aren't actually stored on the player itself, but we still prevent the naming collision
    if (component[property.name] !== undefined) {
      throw new Error(
        'Property `' +
          property.name +
          '` is a keyword or property reserved by the component instance'
      )
    }

    // Don't allow duplicate properties to be declared (the property is an array so we have to check)
    if (inputValuesObject[property.name] !== undefined) {
      throw new Error(
        'Property `' +
          property.name +
          '` was already declared in the input values object'
      )
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
        inputValuesObject[property.name] = property.setter.call(
          component,
          inputValue
        )
      } else {
        inputValuesObject[property.name] = inputValue
      }

      return inputValuesObject[property.name]
    }
  })
}

HaikuComponent.prototype._markForFullFlush = function _markForFullFlush (
  doMark
) {
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

  this._lastDeltaPatches = _gatherDeltaPatches(
    this,
    this._template,
    container,
    this._context,
    this._inputValues,
    timelinesRunning,
    eventsFired,
    inputsChanged,
    patchOptions || {}
  )

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
  _applyContextChanges(
    this,
    this._inputValues,
    this._template,
    container,
    this._context,
    renderOptions || {}
  )

  // 2. Given the above updates, 'expand' the tree to its final form (which gets flushed out to the mount element)
  this._lastTemplateExpansion = _expandTreeElement(
    this._template,
    this._context
  )

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
  if (
    component._controllerEventHandlers &&
    component._controllerEventHandlers.length > 0
  ) {
    for (var l = 0; l < component._controllerEventHandlers.length; l++) {
      var customHandler = component._controllerEventHandlers[l]
      if (!out[customHandler.selector]) out[customHandler.selector] = {}
      out[customHandler.selector][customHandler.event] = customHandler.handler
    }
  }
}

function _applyAccumulatedResults (
  results,
  deltas,
  component,
  template,
  context
) {
  for (var selector in results) {
    var matches = _findMatchingElementsByCssSelector(
      selector,
      template,
      component._matchedElementCache
    )

    if (!matches || matches.length < 1) {
      continue
    }

    var group = results[selector]

    for (var j = 0; j < matches.length; j++) {
      var match = matches[j]

      var domId = match && match.attributes && match.attributes.id
      var haikuId =
        match && match.attributes && match.attributes[HAIKU_ID_ATTRIBUTE]
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

function _gatherDeltaPatches (
  component,
  template,
  container,
  context,
  inputValues,
  timelinesRunning,
  eventsFired,
  inputsChanged,
  patchOptions
) {
  var deltas = {} // This is what we're going to return - a dictionary of ids to elements

  var results = {} // This is where we'll accumulate changes - to apply to elements before returning the dictionary

  var bytecode = component._bytecode

  for (var i = 0; i < timelinesRunning.length; i++) {
    var timeline = timelinesRunning[i]
    var time = timeline.getBoundedTime()

    component._builder.build(
      results,
      timeline.getName(),
      time,
      bytecode.timelines,
      true,
      inputValues,
      eventsFired,
      inputsChanged
    )
  }

  Layout3D.initializeTreeAttributes(template, container) // handlers/vanities depend on attributes objects existing in the first place

  _applyAccumulatedResults(results, deltas, component, template, context)

  if (patchOptions.sizing) {
    _computeAndApplyPresetSizing(
      template,
      container,
      patchOptions.sizing,
      deltas
    )
  }

  // TODO: Calculating the tree layout should be skipped for already visited node
  // that we have already calculated among the descendants of the changed one
  for (var flexId in deltas) {
    var changedNode = deltas[flexId]
    _computeAndApplyTreeLayouts(changedNode, changedNode.__parent, patchOptions)
  }

  return deltas
}

function _applyContextChanges (
  component,
  inputs,
  template,
  container,
  context,
  renderOptions
) {
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

      component._builder.build(
        results,
        timelineName,
        time,
        bytecode.timelines,
        false,
        inputs
      )
    }
  }

  Layout3D.initializeTreeAttributes(template, container) // handlers/vanities depend on attributes objects existing

  scopifyElements(template) // I think this only needs to happen once when we build the full tree

  _applyAccumulatedResults(
    results,
    null,
    component,
    template,
    context,
    component
  )

  if (renderOptions.sizing) {
    _computeAndApplyPresetSizing(template, container, renderOptions.sizing)
  }

  _computeAndApplyTreeLayouts(template, container, renderOptions)

  return template
}

function _expandTreeElement (element, context) {
  if (typeof element.elementName === FUNCTION_TYPE) {
    if (!element.__instance) {
      element.__instance = _instantiateElement(element, context)
    }

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
  var something = element.elementName(
    element.attributes,
    element.children,
    context
  )

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
  if (!tree || typeof tree === 'string') return void 0

  _computeAndApplyNodeLayout(tree, container, options)

  if (!tree.children) return void 0
  if (tree.children.length < 1) return void 0

  for (var i = 0; i < tree.children.length; i++) {
    _computeAndApplyTreeLayouts(tree.children[i], tree, options)
  }
}

function _computeAndApplyNodeLayout (element, parent, options) {
  if (parent) {
    var parentSize = parent.layout.computed.size
    var computedLayout = Layout3D.computeLayout(
      {},
      element.layout,
      element.layout.matrix,
      IDENTITY_MATRIX,
      parentSize
    )

    if (computedLayout === false) {
      // False indicates 'don't show
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
  if (
    vanityHandlers[element.elementName] &&
    vanityHandlers[element.elementName][name]
  ) {
    vanityHandlers[element.elementName][name](
      name,
      element,
      value,
      context,
      component
    )
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
      if (
        ~~(scaleDiffX * elementWidth) <= containerWidth &&
        ~~(scaleDiffX * elementHeight) <= containerHeight
      ) {
        containScaleToUse = scaleDiffX
      }
      if (
        ~~(scaleDiffY * elementWidth) <= containerWidth &&
        ~~(scaleDiffY * elementHeight) <= containerHeight
      ) {
        if (containScaleToUse === null) {
          containScaleToUse = scaleDiffY
        } else {
          if (scaleDiffY >= containScaleToUse) {
            containScaleToUse = scaleDiffY
          }
        }
      }

      if (element.layout.scale.x !== containScaleToUse) {
        changed = true
        element.layout.scale.x = containScaleToUse
      }
      if (element.layout.scale.y !== containScaleToUse) {
        changed = true
        element.layout.scale.y = containScaleToUse
      }

      // Offset the translation so that the element remains centered within the letterboxing
      var containTranslationOffsetX = -(containScaleToUse * elementWidth - containerWidth) / 2
      var containTranslationOffsetY = -(containScaleToUse * elementHeight - containerHeight) / 2
      if (element.layout.translation.x !== containTranslationOffsetX) {
        changed = true
        element.layout.translation.x = containTranslationOffsetX
      }
      if (element.layout.translation.y !== containTranslationOffsetY) {
        changed = true
        element.layout.translation.y = containTranslationOffsetY
      }

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
      if (
        ~~(scaleDiffX * elementWidth) >= containerWidth &&
        ~~(scaleDiffX * elementHeight) >= containerHeight
      ) {
        coverScaleToUse = scaleDiffX
      }
      if (
        ~~(scaleDiffY * elementWidth) >= containerWidth &&
        ~~(scaleDiffY * elementHeight) >= containerHeight
      ) {
        if (coverScaleToUse === null) {
          coverScaleToUse = scaleDiffY
        } else {
          if (scaleDiffY <= coverScaleToUse) {
            coverScaleToUse = scaleDiffY
          }
        }
      }

      if (element.layout.scale.x !== coverScaleToUse) {
        changed = true
        element.layout.scale.x = coverScaleToUse
      }
      if (element.layout.scale.y !== coverScaleToUse) {
        changed = true
        element.layout.scale.y = coverScaleToUse
      }

      // Offset the translation so that the element remains centered despite clipping
      var coverTranslationOffsetX = -(coverScaleToUse * elementWidth - containerWidth) / 2
      var coverTranslationOffsetY = -(coverScaleToUse * elementHeight - containerHeight) / 2
      if (element.layout.translation.x !== coverTranslationOffsetX) {
        changed = true
        element.layout.translation.x = coverTranslationOffsetX
      }
      if (element.layout.translation.y !== coverTranslationOffsetY) {
        changed = true
        element.layout.translation.y = coverTranslationOffsetY
      }

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

},{"./../package.json":2,"./HaikuTimeline":6,"./Layout3D":7,"./ValueBuilder":9,"./helpers/SimpleEventEmitter":15,"./helpers/cssQueryTree":25,"./helpers/scopifyElements":30,"./helpers/xmlToMana":31,"./properties/dom/vanities":41,"./vendor/assign":75}],5:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var SimpleEventEmitter = _dereq_('./helpers/SimpleEventEmitter')
var assign = _dereq_('./vendor/assign')
var HaikuClock = _dereq_('./HaikuClock')
var HaikuComponent = _dereq_('./HaikuComponent')

// Starting prefix to use for element locators, e.g. 0.1.2.3.4
var COMPONENT_GRAPH_ADDRESS_PREFIX = ''

var DEFAULT_TIMELINE_NAME = 'Default'

var DEFAULT_OPTIONS = {
  // automount: Boolean
  // Whether we should mount the given context to the mount element automatically
  automount: true,

  // autoplay: Boolean
  // Whether we should begin playing the context's animation automatically
  autoplay: true,

  // forceFlush: Boolean
  // Whether to fully flush the component on every single frame (warning: this can severely deoptimize animation)
  forceFlush: false,

  // freeze: Boolean
  // Whether we should freeze timelines and not update per global timeline; useful in headless
  freeze: false,

  // loop: Boolean
  // Whether we should loop the animation, i.e. restart from the first frame after reaching the last
  loop: false,

  // frame: Function|null
  // Optional function that we will call on every frame, provided for developer convenience
  frame: null,

  // controller: EventEmitter|null
  // Optional hook into events and programmatic interface into the player's internals, for developer usage
  controller: null,

  // onHaikuComponentWillInitialize: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentWillInitialize: null,

  // onHaikuComponentDidMount: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentDidMount: null,

  // onHaikuComponentDidInitialize: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentDidInitialize: null,

  // onHaikuComponentWillUnMount: Function|null
  // Optional lifecycle event hook (see below)
  onHaikuComponentWillUnmount: null,

  // clock: Object|null
  // Configuration options that will be passed to the HaikuClock instance. See HaikuClock.js for info.
  clock: {},

  // sizing: String|null
  // Configures the sizing mode of the component; may be 'normal', 'stretch', 'contain', or 'cover'. See HaikuComponent.js for info.
  sizing: null,

  // preserve3d: String
  // Placeholder for an option to control whether to enable preserve-3d mode in DOM environments. [UNUSED]
  preserve3d: 'auto',

  // contextMenu: String
  // Whether or not the Haiku context menu should display when the component is right-clicked; may be 'enabled' or 'disabled'.
  contextMenu: 'enabled',

  // position: String
  // CSS position setting for the root of the component in DOM; recommended to keep as 'relative'.
  position: 'relative',

  // overflowX: String|null
  // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without needing a wrapper element.
  overflowX: null,

  // overflowY: String|null
  // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without needing a wrapper element.
  overflowY: null,

  // mixpanel: String|null
  // If provided, a Mixpanel tracking instance will be created using this string as the API token. The default token is Haiku's production token.
  mixpanel: '6f31d4f99cf71024ce27c3e404a79a61'
}

/**
 * @class HaikuContext
 * @description Represents the root of a Haiku component tree within an application.
 * A Haiku component tree may contain many components, but there is only one context.
 * The context is where information shared by all components in the tree should go, e.g. clock time.
 */
function HaikuContext (bytecode, options) {
  if (!(this instanceof HaikuContext)) {
    return new HaikuContext(bytecode, options)
  }

  this.assignOptions(options || {})

  // List of tickable objects managed by this context. These are invoked on every clock tick.
  this._tickables = []

  if (this.options.frame) {
    this._tickables.push({ performTick: this.options.frame })
  }

  this.clock = new HaikuClock(this._tickables, this.options.clock || {})

  // We need to start the loop even if we aren't autoplaying, because we still need time to be calculated even if we don't 'tick'.
  this.clock.run()

  this.component = new HaikuComponent(bytecode, this, options)
  this.component.startTimeline(DEFAULT_TIMELINE_NAME)
}

// Keep track of all instantiated contexts; this is mainly exposed for convenience when debugging the engine,
// as well as to help provide a unique root graph address prefix for subtrees (e.g. 0.2.3.4.5)
HaikuContext.contexts = []

/**
 * @method getRootComponent
 * @description Return the root component associated with this context (of which there is only one).
 */
HaikuContext.prototype.getRootComponent = function getRootComponent () {
  return this.component
}

/**
 * @method getClock
 * @description Return the clock instance associated with this context
 */
HaikuContext.prototype.getClock = function getClock () {
  return this.clock
}

/**
 * @method addTickable
 * @description Add a tickable object to the list of those that will be called on every clock tick.
 */
HaikuContext.prototype.addTickable = function addTickable (tickable) {
  this._tickables.push(tickable)
  return this
}

/**
 * @method assignOptions
 * @description Update our internal options settings with those passed in, using the assign algorithm.
 * This also updates the internal options for the clock instance and root component instance.
 */
HaikuContext.prototype.assignOptions = function assignOptions (options) {
  this.options = assign({}, options)

  // HACK: Since we run this method before the clock is initialized sometimes, we have to check whether the clock exists before assigning sub-options to it.
  if (this.clock) {
    this.clock.assignOptions(this.options.clock)
  }

  // HACK: Since we run this method before the component is initialized sometimes, we have to check whether the component exists before assigning options to it.
  if (this.component) {
    this.component.assignOptions(options)
  }

  return this
}

/**
 * @function createComponentFactory
 * @description Returns a factory function that can create a HaikuComponent and run it upon a mount.
 * The created player runs using the passed-in renderer, bytecode, options, and platform.
 */
HaikuContext.createComponentFactory = function createComponentFactory (
  renderer,
  bytecode,
  optionsA,
  platform
) {
  if (!renderer) {
    throw new Error('A runtime `renderer` object is required')
  }

  if (!bytecode) {
    throw new Error('A runtime `bytecode` object is required')
  }

  // Only warn on this in case we're running in headless/server/test mode
  if (!platform) {
    console.warn('[haiku player] no runtime `platform` object was provided')
  }

  // Note that options may be passed at this level, or below at the factory invocation level.
  var options = assign({}, DEFAULT_OPTIONS, optionsA)

  var context = new HaikuContext(bytecode, options)
  var index = HaikuContext.contexts.push(context) - 1
  var address = COMPONENT_GRAPH_ADDRESS_PREFIX + index

  // The HaikuComponent is really the linchpin of the user's application, handling all the interesting stuff.
  var component = context.getRootComponent()

  /**
   * @function HaikuComponentFactory
   * @description Creates a new HaikuComponent instance.
   * The (renderer, bytecode) pair are bootstrapped into the given mount element, and played.
   */
  function HaikuComponentFactory (mount, optionsB) {
    // Make some Haiku internals available on the mount object for hot editing hooks, or for debugging convenience.
    if (!mount.haiku) mount.haiku = { context: context }

    // Note that options may be passed at this leve, or above at the factory creation level.
    options = assign(options, optionsB)

    // Reassign options on the context since they may have changed when this function was run.
    context.assignOptions(options)

    // If configured, bootstrap the Haiku right-click context menu
    if (renderer.menuize && options.contextMenu !== 'disabled') {
      renderer.menuize(mount, component)
    }

    // Don't set up mixpanel if we're running on localhost since we don't want test data to be tracked
    // TODO: What other heuristics should we use to decide whether to use mixpanel or not?
    if (
      platform &&
      platform.location &&
      platform.location.hostname !== 'localhost' &&
      platform.location.hostname !== '0.0.0.0'
    ) {
      // If configured, initialize Mixpanel with the given API token
      if (renderer.mixpanel && options.mixpanel) {
        renderer.mixpanel(mount, options.mixpanel, component)
      }
    }

    // The 'controller' is one possible programmatic interface into the player; the only law is that it
    // should conform to basic EventEmitter spec, e.g. .on, .emit. If none is provided, we make a fake one.
    var controller
    if (options && options.controller) {
      controller = options.controller
    } else {
      controller = SimpleEventEmitter.create({})
    }

    // Notify anybody who cares that we've successfully initialized their component in memory (but not rendered yet)
    controller.emit('haikuComponentWillInitialize', component)
    component.emit('haikuComponentWillInitialize', component)
    if (options.onHaikuComponentWillInitialize) {
      options.onHaikuComponentWillInitialize(component)
    }

    // If the component needs to remount itself for some reason, make sure we fire the right events
    component.callRemount = function _callRemount (incomingOptions, skipMarkForFullFlush) {
      if (incomingOptions) {
        component.assignContextOptions(incomingOptions)
      }

      if (!skipMarkForFullFlush) {
        component._markForFullFlush(true)
      }

      component._clearCaches()

      // If autoplay is not wanted, stop the all timelines immediately after we've mounted
      // (We have to mount first so that the component displays, but then pause it at that state.)
      // If you don't want the component to show up at all, use options.automount=false.
      var timelineInstances = component.getTimelines()
      for (var timelineName in timelineInstances) {
        var timelineInstance = timelineInstances[timelineName]
        if (options.autoplay) {
          if (timelineName === DEFAULT_TIMELINE_NAME) {
            // Assume we want to start the timeline from the beginning upon remount
            timelineInstance.play()
          }
        } else {
          timelineInstance.pause()
        }
      }

      controller.emit('haikuComponentDidMount', component)
      component.emit('haikuComponentDidMount', component)
      if (options.onHaikuComponentDidMount) {
        options.onHaikuComponentDidMount(component)
      }
    }

    // If the component needs to unmount itself for some reason, make sure we fire the right events
    // This is primarily used in the React Adapter, but there might be other uses for it?
    component.callUnmount = function _callUnmount (incomingOptions) {
      if (incomingOptions) {
        component.assignContextOptions(incomingOptions)
      }

      // Since we're unmounting, pause all animations to avoid unnecessary calc while detached
      var timelineInstances = component.getTimelines()
      for (var timelineName in timelineInstances) {
        var timelineInstance = timelineInstances[timelineName]
        timelineInstance.pause()
      }

      controller.emit('haikuComponentWillUnmount', component)
      component.emit('haikuComponentWillUnmount', component)
      if (options.onHaikuComponentWillUnmount) {
        options.onHaikuComponentWillUnmount(component)
      }
    }

    // Hack, but we may need to allow the user to override options in this scope instead of the component's
    component.assignContextOptions = function _assignContextOptions (incoming) {
      options = assign(options, incoming)
      context.assignOptions(options) // Don't forget to update the ones the context has!
    }

    var hash = {} // Dictionary of ids-to-elements, for quick lookups (#UNUSED?)

    // Call to completely update the entire component tree - as though it were the first time
    function performFullFlushRender () {
      var container = renderer.createContainer(mount)
      var tree = component.render(container, options)
      renderer.render(
        mount,
        container,
        tree,
        address,
        hash,
        options,
        component._getRenderScopes()
      )
    }

    // Call to update elements of the component tree - but only those that we detect have changed
    function performPatchRender () {
      var container = renderer.createContainer(mount)
      var patches = component.patch(container, options)
      renderer.patch(
        mount,
        container,
        patches,
        address,
        hash,
        options,
        component._getRenderScopes()
      )
    }

    // Called on every frame, this function updates the mount+root elements to ensure their style settings are in accordance
    // with any passed-in options that may affect it, e.g. CSS overflow or positioning settings
    function updateMountRootStyles () {
      // We can assume the mount has only one child since we only mount one component into it (#?)
      var mountRoot = mount && mount.children[0]
      if (mountRoot) {
        if (options.position && mountRoot.style.position !== options.position) {
          mountRoot.style.position = options.position
        }
        if (
          options.overflowX &&
          mountRoot.style.overflowX !== options.overflowX
        ) {
          mountRoot.style.overflowX = options.overflowX
        }
        if (
          options.overflowY &&
          mountRoot.style.overflowY !== options.overflowY
        ) {
          mountRoot.style.overflowY = options.overflowY
        }
      }
      if (
        mount &&
        options.sizing === 'cover' &&
        mount.style.overflow !== 'hidden'
      ) {
        mount.style.overflow = 'hidden'
      }
    }

    // Just a counter for the number of clock ticks that have occurred; used to determine first-frame for mounting
    var ticks = 0

    function tick () {
      updateMountRootStyles()

      var flushed = false

      // After we've hydrated the tree the first time, we can proceed with patches --
      // unless the component indicates it wants a full flush per its internal settings.
      if (component._shouldPerformFullFlush() || options.forceFlush || ticks < 1) {
        performFullFlushRender()
        flushed = true
      } else {
        performPatchRender()
      }

      // Do any initialization that may need to occur if we happen to be on the very first tick
      if (ticks < 1) {
        // If this is the 0th (first) tick, notify anybody listening that we've mounted
        // If we've already flushed, _don't_ request to trigger a re-flush (second arg)
        component.callRemount(null, flushed)
      }

      ticks++
    }

    context.addTickable({
      performTick: tick
    })

    // Assuming the user wants the app to mount immediately (the default), let's do the mount.
    if (options.automount) {
      // Starting the clock has the effect of doing a render at time 0, a.k.a., mounting!
      component.getClock().start()
    }

    // Notify anybody who cares that we've completed the initialization sequence
    controller.emit('haikuComponentDidInitialize', component)
    component.emit('haikuComponentDidInitialize', component)
    if (options.onHaikuComponentDidInitialize) {
      options.onHaikuComponentDidInitialize(component)
    }

    // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
    // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
    HaikuComponentFactory.controller = controller
    HaikuComponentFactory.mount = mount
    HaikuComponentFactory.tick = tick

    // Finally, return the HaikuComponent instance which can also be used for programmatic behavior
    return component
  }

  // These properties are added for convenience as hot editing hooks inside Haiku Desktop (and elsewhere?).
  // It's a bit hacky to just expose these in this way, but it proves pretty convenient downstream.
  HaikuComponentFactory.component = component
  HaikuComponentFactory.context = context
  HaikuComponentFactory.bytecode = bytecode
  HaikuComponentFactory.renderer = renderer

  return HaikuComponentFactory
}

module.exports = HaikuContext

},{"./HaikuClock":3,"./HaikuComponent":4,"./helpers/SimpleEventEmitter":15,"./vendor/assign":75}],6:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var _getMaxTimeFromDescriptor = _dereq_('./helpers/getTimelineMaxTime')
var SimpleEventEmitter = _dereq_('./helpers/SimpleEventEmitter')
var assign = _dereq_('./vendor/assign')

var NUMBER = 'number'

var DEFAULT_OPTIONS = {
  // loop: Boolean
  // Determines whether this timeline should loop (start at its beginning when finished)
  loop: true
}

function HaikuTimeline (component, name, descriptor, options) {
  if (!(this instanceof HaikuTimeline)) {
    return new HaikuTimeline(component, name, descriptor, options)
  }

  SimpleEventEmitter.create(this)

  this._component = component
  this._name = name
  this._descriptor = descriptor

  this.assignOptions(options || {})

  this._globalClockTime = 0
  this._localElapsedTime = 0
  this._localExplicitlySetTime = null // Only set this to a number if time is 'controlled'
  this._maxExplicitlyDefinedTime = _getMaxTimeFromDescriptor(descriptor)

  this._isActive = false
  this._isPlaying = false
}

HaikuTimeline.prototype.assignOptions = function assignOptions (options) {
  this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {})
  return this
}

HaikuTimeline.prototype._ensureClockIsRunning = function _ensureClockIsRunning () {
  var clock = this._component.getClock()
  if (!clock.isRunning()) clock.start()
  return this
}

HaikuTimeline.prototype._updateInternalProperties = function _updateInternalProperties (
  updatedGlobalClockTime
) {
  var previousGlobalClockTime = this._globalClockTime
  var deltaGlobalClockTime = updatedGlobalClockTime - previousGlobalClockTime

  this._globalClockTime = updatedGlobalClockTime

  if (this._isTimeControlled()) {
    this._localElapsedTime = this._localExplicitlySetTime
  } else {
    // If we are a looping timeline, reset to zero once we've gone past our max
    if (
      this.options.loop &&
      this._localElapsedTime > this._maxExplicitlyDefinedTime
    ) {
      this._localElapsedTime =
        0 + this._maxExplicitlyDefinedTime - this._localElapsedTime
    }
    this._localElapsedTime += deltaGlobalClockTime
  }

  if (this.isFinished()) {
    this._isPlaying = false
  }
}

HaikuTimeline.prototype._doUpdateWithGlobalClockTime = function _doUpdateWithGlobalClockTime (
  globalClockTime
) {
  if (this.isFrozen()) {
    this._updateInternalProperties(this._globalClockTime)
  } else {
    this._updateInternalProperties(globalClockTime)
  }

  var frame = this.getFrame()
  var time = Math.round(this.getTime())

  if (this.isActive() && this.isPlaying()) {
    this.emit('tick', frame, time)
  }

  this.emit('update', frame, time)

  return this
}

HaikuTimeline.prototype._resetMaxDefinedTimeFromDescriptor = function _resetMaxDefinedTimeFromDescriptor (
  descriptor
) {
  this._maxExplicitlyDefinedTime = _getMaxTimeFromDescriptor(descriptor)
  return this
}

HaikuTimeline.prototype._isTimeControlled = function _isTimeControlled () {
  return typeof this.getControlledTime() === NUMBER
}

HaikuTimeline.prototype._controlTime = function _controlTime (
  controlledTimeToSet,
  updatedGlobalClockTime
) {
  this._localExplicitlySetTime = parseInt(controlledTimeToSet || 0, 10)
  // Need to update the properties so that accessors like .getFrame() work after this update.
  this._updateInternalProperties(updatedGlobalClockTime)
  return this
}

/**
 * @method getName
 * @description Return the name of this timeline
 */
HaikuTimeline.prototype.getName = function getName () {
  return this._name
}

/**
 * @method getMaxTime
 * @description Return the maximum time that this timeline will reach, in ms.
 */
HaikuTimeline.prototype.getMaxTime = function getMaxTime () {
  return this._maxExplicitlyDefinedTime
}

/**
 * @method getClockTime
 * @description Return the global clock time that this timeline is at, in ms,
 * whether or not our local time matches it or it has exceede dour max.
 8 This value is ultimately managed by the clock and passed in.
 */
HaikuTimeline.prototype.getClockTime = function getClockTime () {
  return this._globalClockTime
}

/**
 * @method getElapsedTime
 * @description Return the amount of time that has elapsed on this timeline since
 * it started updating, up to the most recent time update it received from the clock.
 * Note that for inactive timelines, this value will cease increasing as of the last update.
 */
HaikuTimeline.prototype.getElapsedTime = function getElapsedTime () {
  return this._localElapsedTime
}

/**
 * @method getControlledTime
 * @description If time has been explicitly set here via time control, this value will
 * be the number of that setting.
 */
HaikuTimeline.prototype.getControlledTime = function getControlledTime () {
  return this._localExplicitlySetTime
}

/**
 * @method getBoundedTime
 * @description Return the locally elapsed time, or the maximum time of this timeline,
 * whichever is smaller. Useful if you want to know what the "effective" time of this
 * timeline is, not necessarily how much has elapsed in an absolute sense. This is used
 * in the renderer to determine what value to calculate "now" deterministically.
 */
HaikuTimeline.prototype.getBoundedTime = function getBoundedTime () {
  var max = this.getMaxTime()
  var elapsed = this.getElapsedTime()
  if (elapsed > max) return max
  return elapsed
}

/**
 * @method getTime
 * @description Convenience wrapper. Currently returns the bounded time. There's an argument
 * that this should return the elapsed time, though. #TODO
 */
HaikuTimeline.prototype.getTime = function getTime () {
  return this.getBoundedTime()
}

/**
 * @method getBoundedFrame
 * @description Return the current frame up to the maximum frame available for this timeline's duration.
 */
HaikuTimeline.prototype.getBoundedFrame = function getBoundedFrame () {
  var time = this.getBoundedTime()
  var timeStep = this._component.getClock().getFrameDuration()
  return Math.round(time / timeStep)
}

/**
 * @method getUnboundedFrame
 * @description Return the current frame, even if it is above the maximum frame.
 */
HaikuTimeline.prototype.getUnboundedFrame = function getUnboundedFrame () {
  var time = this.getElapsedTime() // The elapsed time can go larger than the max time; see timeline.js
  var timeStep = this._component.getClock().getFrameDuration()
  return Math.round(time / timeStep)
}

/**
 * @method getFrame
 * @description Return the bounded frame.
 * There's an argument that this should return the absolute frame. #TODO
 */
HaikuTimeline.prototype.getFrame = function getFrame () {
  return this.getBoundedFrame()
}

/**
 * @method isPlaying
 * @description Returns T/F if the timeline is playing
 */
HaikuTimeline.prototype.isPlaying = function isPlaying () {
  return !!this._isPlaying
}

/**
 * @method isActive
 * @description Returns T/F if the timeline is active
 */
HaikuTimeline.prototype.isActive = function isActive () {
  return !!this._isActive
}

/**
 * @method isFrozen
 * @description Returns T/F if the timeline is frozen
 */
HaikuTimeline.prototype.isFrozen = function isFrozen () {
  return !!this.options.freeze
}

/**
 * @method isFinished
 * @description Returns T/F if the timeline is finished.
 * If this timeline is set to loop, it is never "finished".
 */
HaikuTimeline.prototype.isFinished = function () {
  if (this.options.loop) return false
  return ~~this.getElapsedTime() > this.getMaxTime()
}

HaikuTimeline.prototype.duration = function duration () {
  return this.getMaxTime() || 0
}

HaikuTimeline.prototype.getDuration = function getDuration () {
  return this.duration()
}

HaikuTimeline.prototype.setRepeat = function setRepeat (bool) {
  this.options.loop = bool
  return this
}

HaikuTimeline.prototype.getRepeat = function getRepeat () {
  return !!this.options.loop
}

HaikuTimeline.prototype.freeze = function freeze () {
  this.options.freeze = true
  return this
}

HaikuTimeline.prototype.unfreeze = function freeze () {
  this.options.freeze = false
  return this
}

HaikuTimeline.prototype.start = function start (
  maybeGlobalClockTime,
  descriptor
) {
  this._localElapsedTime = 0
  this._isActive = true
  this._isPlaying = true
  this._globalClockTime = maybeGlobalClockTime || 0
  this._maxExplicitlyDefinedTime = _getMaxTimeFromDescriptor(descriptor)
  return this
}

HaikuTimeline.prototype.stop = function stop (maybeGlobalClockTime, descriptor) {
  this._isActive = false
  this._isPlaying = false
  this._maxExplicitlyDefinedTime = _getMaxTimeFromDescriptor(descriptor)
  return this
}

HaikuTimeline.prototype.pause = function pause () {
  var time = this._component.getClock().getTime()
  var descriptor = this._component._getTimelineDescriptor(this._name)
  this.stop(time, descriptor)
  return this
}

HaikuTimeline.prototype.play = function play () {
  this._ensureClockIsRunning()

  var time = this._component.getClock().getTime()
  var descriptor = this._component._getTimelineDescriptor(this._name)
  var local = this._localElapsedTime

  this.start(time, descriptor)

  if (this._localExplicitlySetTime !== null) {
    this._localElapsedTime = this._localExplicitlySetTime
    this._localExplicitlySetTime = null
  } else {
    this._localElapsedTime = local
  }

  this._component._markForFullFlush(true)

  return this
}

HaikuTimeline.prototype.seek = function seek (ms) {
  this._ensureClockIsRunning()
  var clockTime = this._component.getClock().getTime()
  this._controlTime(ms, clockTime)
  var descriptor = this._component._getTimelineDescriptor(this._name)
  this.start(clockTime, descriptor)
  this._component._markForFullFlush(true)
  return this
}

HaikuTimeline.prototype.gotoAndPlay = function gotoAndPlay (ms) {
  this._ensureClockIsRunning()
  this.seek(ms)
  this.play()
  return this
}

HaikuTimeline.prototype.gotoAndStop = function gotoAndStop (ms) {
  this._ensureClockIsRunning()
  this.seek(ms)
  return this
}

/**
 * TODO:
 * Implement the methods below.
 */

// HaikuTimeline.prototype.seekMs = function seekMs () {
// }

// HaikuTimeline.prototype.seekFrame = function seekFrame () {
// }

// HaikuTimeline.prototype.seekPercent = function seekPercent () {
// }

// HaikuTimeline.prototype.reverse = function reverse () {
// }

// HaikuTimeline.prototype.gotoAndReverse = function gotoAndReverse () {
// }

// HaikuTimeline.prototype.playUntil = function playUntil () {
// }

// HaikuTimeline.prototype.reverseUntil = function reverseUntil () {
// }

// HaikuTimeline.prototype.setPosts = function setPosts () {
// }

// HaikuTimeline.prototype.clearPosts = function clearPosts () {
// }

// HaikuTimeline.prototype.getPosts = function getPosts () {
// }

module.exports = HaikuTimeline

},{"./helpers/SimpleEventEmitter":15,"./helpers/getTimelineMaxTime":26,"./vendor/assign":75}],7:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var computeMatrix = _dereq_('./layout/computeMatrix')
var computeRotationFlexibly = _dereq_('./layout/computeRotationFlexibly')
var computeSize = _dereq_('./layout/computeSize')

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

// Coordinate (0, 0, 0) is the top left of the screen

var SIZE_PROPORTIONAL = 0 // A percentage of the parent
var SIZE_ABSOLUTE = 1 // A fixed size in screen pixels
var DEFAULT_DEPTH = 0
var IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

// Used for rendering downstream
var FORMATS = {
  THREE: 3,
  TWO: 2
}

function initializeNodeAttributes (element, parent) {
  if (!element.attributes) element.attributes = {}
  if (!element.attributes.style) element.attributes.style = {}
  if (!element.layout) {
    element.layout = createLayoutSpec()
    element.layout.matrix = createMatrix()
    element.layout.format = ELEMENTS_2D[element.elementName]
      ? FORMATS.TWO
      : FORMATS.THREE
  }
  return element
}

function initializeTreeAttributes (tree, container) {
  if (!tree || typeof tree === 'string') return
  initializeNodeAttributes(tree, container)
  tree.__parent = container
  if (!tree.children) return
  if (tree.children.length < 1) return
  for (var i = 0; i < tree.children.length; i++) {
    initializeTreeAttributes(tree.children[i], tree)
  }
}

// The layout specification naming in createLayoutSpec is derived in part from https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
// The MIT License (MIT)
// Copyright (c) 2015 Famous Industries Inc.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
function createLayoutSpec (ax, ay, az) {
  return {
    shown: true,
    opacity: 1.0,
    mount: { x: ax || 0, y: ay || 0, z: az || 0 }, // anchor in self
    align: { x: ax || 0, y: ay || 0, z: az || 0 }, // anchor in context
    origin: { x: ax || 0, y: ay || 0, z: az || 0 }, // transform origin
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 0 },
    scale: { x: 1, y: 1, z: 1 },
    sizeMode: {
      x: SIZE_PROPORTIONAL,
      y: SIZE_PROPORTIONAL,
      z: SIZE_PROPORTIONAL
    },
    sizeProportional: { x: 1, y: 1, z: 1 },
    sizeDifferential: { x: 0, y: 0, z: 0 },
    sizeAbsolute: { x: 0, y: 0, z: 0 }
  }
}

function createMatrix () {
  return copyMatrix([], IDENTITY)
}

function copyMatrix (out, m) {
  out[0] = m[0]
  out[1] = m[1]
  out[2] = m[2]
  out[3] = m[3]
  out[4] = m[4]
  out[5] = m[5]
  out[6] = m[6]
  out[7] = m[7]
  out[8] = m[8]
  out[9] = m[9]
  out[10] = m[10]
  out[11] = m[11]
  out[12] = m[12]
  out[13] = m[13]
  out[14] = m[14]
  out[15] = m[15]
  return out
}

function multiplyMatrices (out, a, b) {
  out[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12]
  out[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13]
  out[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14]
  out[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15]
  out[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12]
  out[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13]
  out[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14]
  out[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15]
  out[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12]
  out[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13]
  out[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14]
  out[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15]
  out[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12]
  out[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13]
  out[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14]
  out[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
  return out
}

function transposeMatrix (out, a) {
  out[0] = a[0]
  out[1] = a[4]
  out[2] = a[8]
  out[3] = a[12]
  out[4] = a[1]
  out[5] = a[5]
  out[6] = a[9]
  out[7] = a[13]
  out[8] = a[2]
  out[9] = a[6]
  out[10] = a[10]
  out[11] = a[14]
  out[12] = a[3]
  out[13] = a[7]
  out[14] = a[11]
  out[15] = a[15]
  return out
}

function multiplyArrayOfMatrices (arrayOfMatrices) {
  var product = createMatrix()
  for (var i = 0; i < arrayOfMatrices.length; i++) {
    product = multiplyMatrices([], product, arrayOfMatrices[i])
  }
  return product
}

function isZero (num) {
  return num > -0.000001 && num < 0.000001
}

function createBaseComputedLayout (x, y, z) {
  if (!x) x = 0
  if (!y) y = 0
  if (!z) z = 0
  return {
    size: { x: x, y: y, z: z },
    matrix: createMatrix(),
    shown: true,
    opacity: 1.0
  }
}

function computeLayout (
  out,
  layoutSpec,
  currentMatrix,
  parentMatrix,
  parentsizeAbsolute
) {
  if (!parentsizeAbsolute) parentsizeAbsolute = { x: 0, y: 0, z: 0 }

  if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
    parentsizeAbsolute.z = DEFAULT_DEPTH
  }

  var size = computeSize(
    {},
    layoutSpec,
    layoutSpec.sizeMode,
    parentsizeAbsolute
  )

  var matrix = computeMatrix(
    [],
    out,
    layoutSpec,
    currentMatrix,
    size,
    parentMatrix,
    parentsizeAbsolute
  )

  out.size = size
  out.matrix = matrix
  out.shown = layoutSpec.shown
  out.opacity = layoutSpec.opacity

  return out
}

module.exports = {
  computeMatrix: computeMatrix,
  multiplyArrayOfMatrices: multiplyArrayOfMatrices,
  computeLayout: computeLayout,
  createLayoutSpec: createLayoutSpec,
  createBaseComputedLayout: createBaseComputedLayout,
  computeRotationFlexibly: computeRotationFlexibly,
  createMatrix: createMatrix,
  FORMATS: FORMATS,
  SIZE_ABSOLUTE: SIZE_ABSOLUTE,
  SIZE_PROPORTIONAL: SIZE_PROPORTIONAL,
  ATTRIBUTES: createLayoutSpec(),
  multiplyMatrices: multiplyMatrices,
  transposeMatrix: transposeMatrix,
  copyMatrix: copyMatrix,
  initializeTreeAttributes: initializeTreeAttributes,
  initializeNodeAttributes: initializeNodeAttributes,
  isZero: isZero
}

},{"./layout/computeMatrix":34,"./layout/computeRotationFlexibly":35,"./layout/computeSize":36}],8:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Curves = _dereq_('./vendor/just-curves')

var CENT = 1.0
var OBJECT = 'object'
var NUMBER = 'number'
var KEYFRAME_ZERO = 0
var KEYFRAME_MARGIN = 16.666
var STRING = 'string'

function percentOfTime (t0, t1, tnow) {
  var span = t1 - t0
  if (span === 0) return CENT // No divide-by-zero
  var remaining = t1 - tnow
  var percent = CENT - remaining / span
  return percent
}

function valueAtPercent (v0, v1, pc) {
  var span = v1 - v0
  var gain = span * pc
  var value = v0 + gain
  return value
}

function valueAtTime (v0, v1, t0, t1, tnow) {
  var pc = percentOfTime(t0, t1, tnow)
  var value = valueAtPercent(v0, v1, pc)
  return value
}

function interpolateValue (v0, v1, t0, t1, tnow, curve) {
  var pc = percentOfTime(t0, t1, tnow)
  if (pc > CENT) pc = CENT
  if (curve) pc = curve(pc)
  var value = valueAtPercent(v0, v1, pc)
  return value
}

function interpolate (now, curve, started, ends, origin, destination) {
  if (Array.isArray(origin)) {
    var arrayOutput = []
    for (var i = 0; i < origin.length; i++) {
      arrayOutput[i] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[i],
        destination[i]
      )
    }
    return arrayOutput
  } else if (typeof origin === OBJECT) {
    var objectOutput = {}
    for (var key in origin) {
      objectOutput[key] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[key],
        destination[key]
      )
    }
    return objectOutput
  } else if (typeof origin === NUMBER) {
    return interpolateValue(origin, destination, started, ends, now, curve)
  } else {
    return origin
  }
}

function ascendingSort (a, b) {
  return a - b
}

function numberize (n) {
  return parseInt(n, 10)
}

function sortedKeyframes (keyframeGroup) {
  var keys = Object.keys(keyframeGroup)
  var sorted = keys.sort(ascendingSort).map(numberize)
  return sorted
}

// 0:    { value: { ... } }
// 2500: { value: { ... } }
// 5000: { value: { ... } }
function getKeyframesList (keyframeGroup, nowValue) {
  var sorted = sortedKeyframes(keyframeGroup)
  for (var i = 0; i < sorted.length; i++) {
    var j = i + 1
    var current = sorted[i]
    var next = sorted[j]
    if (current <= nowValue) {
      if (next > nowValue) return [current, next]
      if (j >= sorted.length) return [current]
    }
  }
}

function calculateValue (keyframeGroup, nowValue) {
  // HACK: Add a 0th keyframe automatically and set its value to the next one.
  // This is a convenience so the data model/UI doesn't have to remember to set this.
  // But this is probably going to bite somebody later. :/
  // See the 'getKeyframesList' function for an additional part of this hack.
  if (!keyframeGroup[KEYFRAME_ZERO]) {
    keyframeGroup[KEYFRAME_ZERO] = {}
  }
  var keyframesList = getKeyframesList(keyframeGroup, nowValue)
  if (!keyframesList || keyframesList.length < 1) return
  var currentKeyframe = keyframesList[0]
  var currentTransition = keyframeGroup[currentKeyframe]
  var nextKeyframe = keyframesList[1]
  var nextTransition = keyframeGroup[nextKeyframe]
  var finalValue = getTransitionValue(
    currentKeyframe,
    currentTransition,
    nextKeyframe,
    nextTransition,
    nowValue
  )
  return finalValue
}

function calculateValueAndReturnUndefinedIfNotWorthwhile (
  keyframeGroup,
  nowValue
) {
  if (!keyframeGroup[KEYFRAME_ZERO]) keyframeGroup[KEYFRAME_ZERO] = {} // HACK: See above
  var keyframesList = getKeyframesList(keyframeGroup, nowValue)
  if (!keyframesList || keyframesList.length < 1) return void 0

  var currentKeyframe = keyframesList[0]
  var nextKeyframe = keyframesList[1]
  var currentTransition = keyframeGroup[currentKeyframe]
  var nextTransition = keyframeGroup[nextKeyframe]

  // If either this or the next transition came from a "machine" (function), we must recalc, since they may be time-dependant
  if (
    (currentTransition && currentTransition.machine) ||
    (nextTransition && nextTransition.machine)
  ) {
    return getTransitionValue(
      currentKeyframe,
      currentTransition,
      nextKeyframe,
      nextTransition,
      nowValue
    )
  }

  // If no preceding keyframe, check if we need to calculate any values past the initial one
  if (nextKeyframe === undefined) {
    if (nowValue <= currentKeyframe + KEYFRAME_MARGIN) {
      return getTransitionValue(
        currentKeyframe,
        currentTransition,
        nextKeyframe,
        nextTransition,
        nowValue
      )
    }
    return void 0
  }

  // If there is a next one, check to see if our current time has already exceeded it, and skip if so
  if (nowValue <= nextKeyframe + KEYFRAME_MARGIN) {
    return getTransitionValue(
      currentKeyframe,
      currentTransition,
      nextKeyframe,
      nextTransition,
      nowValue
    )
  }

  return void 0
}

function getTransitionValue (
  currentKeyframe,
  currentTransition,
  nextKeyframe,
  nextTransition,
  nowValue
) {
  var currentValue = currentTransition.value

  if (!currentTransition.curve) return currentValue // No curve indicates immediate transition
  if (!nextTransition) return currentValue // We have gone past the final transition

  var currentCurve = currentTransition.curve
  if (typeof currentCurve === STRING) currentCurve = Curves[currentCurve]
  var nextValue = nextTransition.value

  var finalValue = interpolate(
    nowValue,
    currentCurve,
    currentKeyframe,
    nextKeyframe,
    currentValue,
    nextValue
  )
  return finalValue
}

module.exports = {
  percentOfTime: percentOfTime,
  valueAtPercent: valueAtPercent,
  valueAtTime: valueAtTime,
  interpolateValue: interpolateValue,
  interpolate: interpolate,
  calculateValue: calculateValue,
  sortedKeyframes: sortedKeyframes,
  calculateValueAndReturnUndefinedIfNotWorthwhile: calculateValueAndReturnUndefinedIfNotWorthwhile
}

},{"./vendor/just-curves":116}],9:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Transitions = _dereq_('./Transitions')
var BasicUtils = _dereq_('./helpers/BasicUtils')
var ColorUtils = _dereq_('./helpers/ColorUtils')
var SVGPoints = _dereq_('./helpers/SVGPoints')
var functionToRFO = _dereq_('./reflection/functionToRFO')

var FUNCTION = 'function'
var OBJECT = 'object'

function isFunction (value) {
  return typeof value === FUNCTION
}

var PARSERS = {}
PARSERS['d'] = function _parseD (value) {
  // in case of d="" for any reason, don't try to expand this otherwise this will choke
  // #TODO: arguably we should preprocess SVGs before things get this far; try svgo?
  if (!value) return []
  return SVGPoints.pathToPoints(value)
}
PARSERS['color'] = function _parseColor (value) {
  return ColorUtils.parseString(value)
}
PARSERS['stroke'] = PARSERS['color']
PARSERS['fill'] = PARSERS['color']
PARSERS['floodColor'] = PARSERS['color']
PARSERS['lightingColor'] = PARSERS['color']
PARSERS['stopColor'] = PARSERS['color']
PARSERS['backgroundColor'] = PARSERS['color']
PARSERS['animateColor'] = PARSERS['color']
PARSERS['feColor'] = PARSERS['color']
PARSERS['flood-color'] = PARSERS['color']
PARSERS['lighting-color'] = PARSERS['color']
PARSERS['stop-color'] = PARSERS['color']
PARSERS['background-color'] = PARSERS['color']
PARSERS['animate-color'] = PARSERS['color']
PARSERS['fe-color'] = PARSERS['color']
PARSERS['style.stroke'] = PARSERS['color']
PARSERS['style.fill'] = PARSERS['color']
PARSERS['style.backgroundColor'] = PARSERS['color']
PARSERS['style.borderBottomColor'] = PARSERS['color']
PARSERS['style.borderColor'] = PARSERS['color']
PARSERS['style.borderLeftColor'] = PARSERS['color']
PARSERS['style.borderRightColor'] = PARSERS['color']
PARSERS['style.borderTopColor'] = PARSERS['color']
PARSERS['style.floodColor'] = PARSERS['color']
PARSERS['style.lightingColor'] = PARSERS['color']
PARSERS['style.stopColor'] = PARSERS['color']
PARSERS['points'] = function _parsePoints (value) {
  return SVGPoints.polyPointsStringToPoints(value)
}

var GENERATORS = {}
GENERATORS['d'] = function _genD (value) {
  return SVGPoints.pointsToPath(value)
}
GENERATORS['color'] = function _genColor (value) {
  return ColorUtils.generateString(value)
}
GENERATORS['stroke'] = GENERATORS['color']
GENERATORS['fill'] = GENERATORS['color']
GENERATORS['floodColor'] = GENERATORS['color']
GENERATORS['lightingColor'] = GENERATORS['color']
GENERATORS['stopColor'] = GENERATORS['color']
GENERATORS['backgroundColor'] = GENERATORS['color']
GENERATORS['animateColor'] = GENERATORS['color']
GENERATORS['feColor'] = GENERATORS['color']
GENERATORS['flood-color'] = GENERATORS['color']
GENERATORS['lighting-color'] = GENERATORS['color']
GENERATORS['stop-color'] = GENERATORS['color']
GENERATORS['background-color'] = GENERATORS['color']
GENERATORS['animate-color'] = GENERATORS['color']
GENERATORS['fe-color'] = GENERATORS['color']
GENERATORS['style.stroke'] = GENERATORS['color']
GENERATORS['style.fill'] = GENERATORS['color']
GENERATORS['style.backgroundColor'] = GENERATORS['color']
GENERATORS['style.borderBottomColor'] = GENERATORS['color']
GENERATORS['style.borderColor'] = GENERATORS['color']
GENERATORS['style.borderLeftColor'] = GENERATORS['color']
GENERATORS['style.borderRightColor'] = GENERATORS['color']
GENERATORS['style.borderTopColor'] = GENERATORS['color']
GENERATORS['style.floodColor'] = GENERATORS['color']
GENERATORS['style.lightingColor'] = GENERATORS['color']
GENERATORS['style.stopColor'] = GENERATORS['color']
GENERATORS['points'] = function _genPoints (value) {
  return SVGPoints.pointsToPolyString(value)
}

var SUMMONABLES = {}
SUMMONABLES['$timeline_name'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    return timelineName
  }
}
SUMMONABLES['$property_name'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    return propertyName
  }
}
SUMMONABLES['$selector'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    return selector
  }
}
SUMMONABLES['$keyframe'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    return parseInt(keyframeMs, 10)
  }
}
SUMMONABLES['$frame'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    var timeline =
      hostInstance.getTimeline && hostInstance.getTimeline(timelineName)
    if (!timeline) return void 0 // No frame available if no timeline
    return ~~timeline.getBoundedFrame()
  }
}
SUMMONABLES['$frame_unbounded'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    var timeline =
      hostInstance.getTimeline && hostInstance.getTimeline(timelineName)
    if (!timeline) return void 0 // No frame available if no timeline
    return ~~timeline.getUnboundedFrame()
  }
}
SUMMONABLES['$time'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    var timeline =
      hostInstance.getTimeline && hostInstance.getTimeline(timelineName)
    if (!timeline) return void 0 // No frame available if no timeline
    return ~~timeline.getTime()
  }
}
SUMMONABLES['$time_elapsed'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    var timeline =
      hostInstance.getTimeline && hostInstance.getTimeline(timelineName)
    if (!timeline) return void 0 // No frame available if no timeline
    return ~~timeline.getElapsedTime()
  }
}
SUMMONABLES['$time_clock'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    var timeline =
      hostInstance.getTimeline && hostInstance.getTimeline(timelineName)
    if (!timeline) return void 0 // No frame available if no timeline
    return ~~timeline.getClockTime()
  }
}
SUMMONABLES['$time_max'] = {
  summon: function (
    timelineName,
    selector,
    propertyName,
    keyframeMs,
    keyframeCluster,
    hostInstance,
    inputValues,
    eventsFired
  ) {
    var timeline =
      hostInstance.getTimeline && hostInstance.getTimeline(timelineName)
    if (!timeline) return void 0 // No frame available if no timeline
    return ~~timeline.getMaxTime()
  }
}

function ValueBuilder (component) {
  this._component = component // ::HaikuComponent
  this._parsees = {}
  this._changes = {}
}

ValueBuilder.prototype._clearCaches = function _clearCaches () {
  this._parsees = {}
  this._changes = {}
  return this
}

ValueBuilder.prototype._clearCachedClusters = function _clearCachedClusters (
  timelineName,
  selector
) {
  if (this._parsees[timelineName]) this._parsees[timelineName][selector] = {}
  return this
}

ValueBuilder.prototype.evaluate = function _evaluate (
  fn,
  timelineName,
  selector,
  propertyName,
  keyframeMs,
  keyframeCluster,
  hostInstance,
  inputValues,
  eventsFired,
  inputsChanged
) {
  if (!fn.specification) {
    var rfo = functionToRFO(fn)
    if (rfo && rfo.__function) {
      // Cache this so we don't expensively parse each time
      fn.specification = rfo.__function
    } else {
      // Signal that this function is of an unknown kind/ don't try to parse again
      fn.specification = true
    }
  }

  // We'll store the result of this evaluation in this variable (so we can cache it in case unexpected subsequent calls)
  var evaluation = void 0

  if (fn.specification === true) {
    // This function is of an unknown kind, so just evaluate it normally without magic dependency injection
    evaluation = fn.call(hostInstance, inputValues)
  } else if (!Array.isArray(fn.specification.params)) {
    // If for some reason we got a non-array params, just evaluate
    evaluation = fn.call(hostInstance, inputValues)
  } else if (fn.specification.params.length < 1) {
    // If for some reason we got 0 params, just evaluate it
    evaluation = fn.call(hostInstance, inputValues)
  } else {
    var summons = fn.specification.params[0] // For now, ignore all subsequent arguments

    if (!summons || typeof summons !== 'object') {
      // If the summon isn't in the destructured object format, just evaluate it
      evaluation = fn.call(hostInstance, inputValues)
    } else {
      var summonees = this.summonSummonables(
        summons,
        timelineName,
        selector,
        propertyName,
        keyframeMs,
        keyframeCluster,
        hostInstance,
        inputValues,
        eventsFired,
        inputsChanged
      )

      if (_areSummoneesDifferent(fn.specification.summonees, summonees)) {
        // If the summonees are different, evaluate it and cache the newcomers
        fn.specification.summonees = summonees
        evaluation = fn.call(hostInstance, summonees)
      } else {
        // Since nothing is different, return the previous evaluation
        evaluation = fn.specification.evaluation
      }
    }
  }

  // Store the result so we can return it on the next run without re-eval
  if (fn.specification && fn.specification !== true) {
    fn.specification.evaluation = evaluation
  }

  return evaluation
}

ValueBuilder.prototype.summonSummonables = function _summonSummonables (
  summons,
  timelineName,
  selector,
  propertyName,
  keyframeMs,
  keyframeCluster,
  hostInstance,
  inputValues,
  eventsFired,
  inputsChanged
) {
  var summonables = {}

  for (var key in summons) {
    // If the summons structure has a falsy, just skip it - I don't see why how this could happen, but just in case
    if (!summons[key]) continue

    // If a special summonable has been defined, then call its summoner function
    // Note the lower-case - allow lo-coders to comfortably call say $FRAME and $frame and get the same thing back
    if (SUMMONABLES[key.toLowerCase()]) {
      // But don't lowercase the assignment - otherwise the object destructuring won't work!!
      summonables[key] = SUMMONABLES[key].summon(
        timelineName,
        selector,
        propertyName,
        keyframeMs,
        keyframeCluster,
        hostInstance,
        inputValues,
        eventsFired,
        inputsChanged
      )
      continue
    }

    // Otherwise, assume the user wants to access one of the properties of the component instance
    // Note that the 'properties' defined in the component's bytecode should have been set up upstream by the
    // player initialization process. hostInstance is a HaikuPlayer which has a series of getter/setter props
    // set up corresponding to whatever the 'properties' were set to
    summonables[key] = hostInstance[key]
  }

  return summonables
}

function _areSummoneesDifferent (previous, incoming) {
  // First check if either is an array, and do an el-by-el comparison
  if (Array.isArray(previous) && Array.isArray(incoming)) {
    // A good quick check is just to compare the lengths
    if (previous.length !== incoming.length) {
      return true
    } else {
      // Do an element-by-element comparison; if any fail, it all fails
      for (var i = 0; i < incoming.length; i++) {
        if (_areSummoneesDifferent(previous[i], incoming[i])) {
          return true
        }
      }
      // If we checked all elements, assume the arrays are the same
      return false
    }
  } else if (typeof previous === OBJECT && typeof incoming === OBJECT) {
    // Sub-objects detected; recurse and ask the same question
    if (previous !== null && incoming !== null) {
      for (var key in incoming) {
        // console.log(key, previous[key], incoming[key])
        if (_areSummoneesDifferent(previous[key], incoming[key])) {
          return true
        }
      }
      // If we checked all properties, assume the objects are the same
      return false
    } else if (previous === null) {
      return true
    } else if (incoming === null) {
      return true
    }
    return false
  }
  return previous !== incoming
}

ValueBuilder.prototype.fetchParsedValueCluster = function _fetchParsedValueCluster (
  timelineName,
  selector,
  outputName,
  cluster,
  hostInstance,
  inputValues,
  eventsFired,
  inputsChanged,
  isPatchOperation,
  skipCache
) {
  // Establish the cache objects for this properties group within this timeline
  if (!this._parsees[timelineName]) this._parsees[timelineName] = {}
  if (!this._parsees[timelineName][selector]) {
    this._parsees[timelineName][selector] = {}
  }
  if (!this._parsees[timelineName][selector][outputName]) {
    this._parsees[timelineName][selector][outputName] = {}
  }

  var parsee = this._parsees[timelineName][selector][outputName]

  for (var ms in cluster) {
    var descriptor = cluster[ms]

    // Important: The ActiveComponent depends on the ability to be able to get fresh values via this option
    if (skipCache) {
      // Easiest way to skip the cache is just to make the destination object falsy
      parsee[ms] = null
    }

    // In case of a function, we can't cache - we have to recalc, and thus re-parse also
    if (isFunction(descriptor.value)) {
      // We have to recreate this cache object every time due to the need for function recalc
      parsee[ms] = {}
      if (descriptor.curve) {
        parsee[ms].curve = descriptor.curve
      }

      // Indicate to the downstream transition cache that this value came from a function and cannot be cached there.
      // See Transitions.js for info on how this gets handled
      parsee[ms].machine = true

      // Note that evaluate doesn't necessarily call the function - it may itself return a cached value
      var functionReturnValue = this.evaluate(
        descriptor.value,
        timelineName,
        selector,
        outputName,
        ms,
        cluster,
        hostInstance,
        inputValues,
        eventsFired,
        inputsChanged
      )

      // The function's return value is expected to be in the *raw* format - we parse to allow for interpolation
      if (PARSERS[outputName]) {
        var parser = PARSERS[outputName]
        parsee[ms].value = parser(functionReturnValue)
      } else {
        parsee[ms].value = functionReturnValue
      }
    } else {
      // In case of static values, we can cache - no need to re-parse static values if we already parsed them
      if (parsee[ms]) {
        continue
      }

      // If nothing in the cache, create the base cache object...
      parsee[ms] = {}
      if (descriptor.curve) {
        parsee[ms].curve = descriptor.curve
      }

      if (PARSERS[outputName]) {
        parsee[ms].value = PARSERS[outputName](descriptor.value)
      } else {
        parsee[ms].value = descriptor.value
      }
    }
  }

  // Return the entire cached object - interpolation is done downstream
  return parsee
}

ValueBuilder.prototype.generateFinalValueFromParsedValue = function _generateFinalValueFromParsedValue (
  timelineName,
  selector,
  outputName,
  computedValue
) {
  if (GENERATORS[outputName]) {
    return GENERATORS[outputName](computedValue)
  } else {
    return computedValue
  }
}

ValueBuilder.prototype.didChangeValue = function _didChangeValue (
  timelineName,
  selector,
  outputName,
  outputValue
) {
  var answer = false
  if (!this._changes[timelineName]) {
    this._changes[timelineName] = {}
    answer = true
  }
  if (!this._changes[timelineName][selector]) {
    this._changes[timelineName][selector] = {}
    answer = true
  }
  if (
    this._changes[timelineName][selector][outputName] === undefined ||
    this._changes[timelineName][selector][outputName] !== outputValue
  ) {
    this._changes[timelineName][selector][outputName] = outputValue
    answer = true
  }
  return answer
}

/**
 * @method build
 * @description Given an 'out' object, accumulate values into that object based on the current timeline, time, and instance state.
 */
ValueBuilder.prototype.build = function _build (
  out,
  timelineName,
  timelineTime,
  timelinesObject,
  isPatchOperation,
  inputValues,
  eventsFired,
  inputsChanged
) {
  var overrides = timelinesObject[timelineName]

  for (var selector in overrides) {
    var propertiesGroup = overrides[selector]
    for (var propertyName in propertiesGroup) {
      var haikuComponent = this._component // ::HaikuPlayer

      var finalValue = this.grabValue(
        timelineName,
        selector,
        propertyName,
        propertiesGroup,
        timelineTime,
        haikuComponent,
        inputValues,
        eventsFired,
        inputsChanged,
        isPatchOperation
      )

      // We use undefined as a signal that it's not worthwhile to put this value in the list of updates.
      // null should be used in the case that we want to explicitly set an empty value
      if (finalValue === undefined) {
        continue
      }

      // If this is _not_ a patch operation, we have to set the value because downstream, the player will strip
      // off old attributes present on the dom nodes.
      if (
        !isPatchOperation ||
        this.didChangeValue(timelineName, selector, propertyName, finalValue)
      ) {
        if (!out[selector]) out[selector] = {}
        if (out[selector][propertyName] === undefined) {
          out[selector][propertyName] = finalValue
        } else {
          out[selector][propertyName] = BasicUtils.mergeValue(
            out[selector][propertyName],
            finalValue
          )
        }
      }
    }
  }
  return out
}

/**
 * @method grabValue
 * @description Given a timeline and some current state information, return a computed value for the given property name.
 *
 * NOTE: The 'build' method above interprets a return value of 'undefined' to mean "no change" so bear that in mind...
 *
 * @param timelineName {String} Name of the timeline we're using
 * @param selector {String} CSS selector within the timeline
 * @param propertyName {String} Name of the property being grabbed, e.g. position.x
 * @param propertiesGroup {Object} The full timeline properties group, e.g. { position.x: ..., position.y: ... }
 * @param timelineTime {Number} The current time (in ms) that the given timeline is at
 * @param haikuPlayer {Object} Instance of HaikuPlayer
 * @param inputValues {Object} Input values stored by the player instance
 * @param eventsFired {Array} Events fired within the tick
 * @param inputsChanged {Object} List of inputs detected to have changed since last input
 */
ValueBuilder.prototype.grabValue = function _grabValue (
  timelineName,
  selector,
  propertyName,
  propertiesGroup,
  timelineTime,
  haikuPlayer,
  inputValues,
  eventsFired,
  inputsChanged,
  isPatchOperation,
  skipCache
) {
  var parsedValueCluster = this.fetchParsedValueCluster(
    timelineName,
    selector,
    propertyName,
    propertiesGroup[propertyName],
    haikuPlayer,
    inputValues,
    eventsFired,
    inputsChanged,
    isPatchOperation,
    skipCache
  )

  // If there is no property of that name, we would have gotten nothing back, so we can't forward this to Transitions
  // since it expects to receive a populated cluster object
  if (!parsedValueCluster) {
    return undefined
  }

  var computedValueForTime

  // Important: The ActiveComponent depends on the ability to be able to get fresh values via the skipCache optino
  if (isPatchOperation && !skipCache) {
    computedValueForTime = Transitions.calculateValueAndReturnUndefinedIfNotWorthwhile(
      parsedValueCluster,
      timelineTime
    )
  } else {
    computedValueForTime = Transitions.calculateValue(
      parsedValueCluster,
      timelineTime
    )
  }

  if (computedValueForTime === undefined) {
    return undefined
  }

  var finalValue = this.generateFinalValueFromParsedValue(
    timelineName,
    selector,
    propertyName,
    computedValueForTime
  )

  return finalValue
}

module.exports = ValueBuilder

},{"./Transitions":8,"./helpers/BasicUtils":12,"./helpers/ColorUtils":13,"./helpers/SVGPoints":14,"./reflection/functionToRFO":42}],10:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var HaikuContext = _dereq_('./../../HaikuContext')
var HaikuDOMRenderer = _dereq_('./../../renderers/dom')
var PLAYER_VERSION = _dereq_('./../../../package.json').version

/**
 * Example ways this gets invoked:
 *
 * // via embed snippet
 * window.HaikuPlayer['2.0.125'](require('./bytecode.js'))
 *
 * // via module require
 * var HaikuCreation = require('@haiku/player/dom')
 * module.exports = HaikuCreation(require('./bytecode.js'))
 */

var IS_WINDOW_DEFINED = typeof window !== 'undefined'

/**
 * @function HaikuDOMAdapter
 * @description Given a bytecode object, return a factory function which can create a DOM-playable component.
 */
function HaikuDOMAdapter (bytecode, options, _window) {
  if (!options) options = {}

  if (!_window) {
    if (IS_WINDOW_DEFINED) {
      _window = window
    }
  }

  if (options.useWebkitPrefix === undefined) {
    // Allow headless mode, e.g. in server-side rendering or in Node.js unit tests
    if (_window && _window.document) {
      var isWebKit =
        'WebkitAppearance' in _window.document.documentElement.style
      options.useWebkitPrefix = !!isWebKit
    }
  }

  return HaikuContext.createComponentFactory(
    HaikuDOMRenderer,
    bytecode,
    options,
    _window
  )
}

// Allow multiple players of different versions to exist on the same page
if (IS_WINDOW_DEFINED) {
  if (!window.HaikuPlayer) {
    window.HaikuPlayer = {}
  }

  window.HaikuPlayer[PLAYER_VERSION] = HaikuDOMAdapter
}

module.exports = HaikuDOMAdapter

},{"./../../../package.json":2,"./../../HaikuContext":5,"./../../renderers/dom":58}],11:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = _dereq_('./HaikuDOMAdapter')

},{"./HaikuDOMAdapter":10}],12:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var uniq = _dereq_('./../vendor/array-unique').immutable

var OBJECT = 'object'
var FUNCTION = 'function'

function isObject (value) {
  return value !== null && typeof value === OBJECT && !Array.isArray(value)
}

function isFunction (value) {
  return typeof value === FUNCTION
}

function isEmpty (value) {
  return value === undefined
}

function mergeIncoming (previous, incoming) {
  for (var key in incoming) {
    // Skip if there's no incoming property
    if (isEmpty(incoming[key])) continue
    // Deep merge if we have two objects
    if (isObject(previous[key]) && isObject(incoming[key])) {
      previous[key] = mergeIncoming(previous[key], incoming[key])
      continue
    }
    // In the default case, we just overwrite
    previous[key] = incoming[key]
  }
  return previous
}

function mergeValue (previous, incoming) {
  if (isFunction(previous) || isFunction(incoming)) {
    return incoming
  }
  if (isObject(previous) && isObject(incoming)) {
    return mergeIncoming(previous, incoming)
  }
  return incoming
}

module.exports = {
  isObject: isObject,
  isFunction: isFunction,
  isEmpty: isEmpty,
  mergeIncoming: mergeIncoming,
  mergeValue: mergeValue,
  uniq: uniq
}

},{"./../vendor/array-unique":74}],13:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var cs = _dereq_('./../vendor/color-string')

var STRING = 'string'
var OBJECT = 'object'

function parseString (str) {
  if (!str) return null
  if (typeof str === OBJECT) return str
  if (str.trim().slice(0, 3) === 'url') return str
  var desc = cs.get(str)
  return desc
}

function generateString (desc) {
  if (typeof desc === STRING) return desc
  if (!desc) return 'none'
  var str = cs.to[desc.model](desc.value)
  return str
}

module.exports = {
  parseString: parseString,
  generateString: generateString
}

},{"./../vendor/color-string":77}],14:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var SVGPoints = _dereq_('./../vendor/svg-points')
var parseCssValueString = _dereq_('./parseCssValueString')

var SVG_TYPES = {
  g: true,
  rect: true,
  polyline: true,
  polygon: true,
  path: true,
  line: true,
  ellipse: true,
  circle: true
}

var SVG_POINT_NUMERIC_FIELDS = {
  cx: true,
  cy: true,
  r: true,
  rx: true,
  ry: true,
  x1: true,
  x2: true,
  x: true,
  y: true
}

var SVG_POINT_COMMAND_FIELDS = {
  d: true,
  points: true
}

var SVG_COMMAND_TYPES = {
  path: true,
  polyline: true,
  polygon: true
}

function polyPointsStringToPoints (pointsString) {
  if (!pointsString) return []
  if (Array.isArray(pointsString)) return pointsString
  var points = []
  var couples = pointsString.split(/\s+/)
  for (var i = 0; i < couples.length; i++) {
    var pair = couples[i]
    var segs = pair.split(/,\s*/)
    var coord = []
    if (segs[0]) coord[0] = Number(segs[0])
    if (segs[1]) coord[1] = Number(segs[1])
    points.push(coord)
  }
  return points
}

function pointsToPolyString (points) {
  if (!points) return ''
  if (typeof points === 'string') return points
  var arr = []
  for (var i = 0; i < points.length; i++) {
    var point = points[i]
    var seg = point.join(',')
    arr.push(seg)
  }
  return arr.join(' ')
}

function pathToPoints (pathString) {
  var shape = { type: 'path', d: pathString }
  return SVGPoints.toPoints(shape)
}

function pointsToPath (pointsArray) {
  return SVGPoints.toPath(pointsArray)
}

function manaToPoints (mana) {
  if (
    SVG_TYPES[mana.elementName] &&
    mana.elementName !== 'rect' &&
    mana.elementName !== 'g'
  ) {
    var shape = { type: mana.elementName }
    if (SVG_COMMAND_TYPES[shape.type]) {
      for (var f2 in SVG_POINT_COMMAND_FIELDS) {
        if (mana.attributes[f2]) {
          shape[f2] = mana.attributes[f2]
        }
      }
    } else {
      for (var f1 in SVG_POINT_NUMERIC_FIELDS) {
        if (mana.attributes[f1]) {
          shape[f1] = Number(mana.attributes[f1])
        }
      }
    }
    return SVGPoints.toPoints(shape)
  } else {
    // div, rect, svg ...
    var width = parseCssValueString(
      (mana.layout &&
        mana.layout.computed &&
        mana.layout.computed.size &&
        mana.layout.computed.size.x) ||
        (mana.rect && mana.rect.width) ||
        (mana.attributes &&
          mana.attributes.style &&
          mana.attributes.style.width) ||
        (mana.attributes && mana.attributes.width) ||
        (mana.attributes && mana.attributes.x) ||
        0
    ).value
    var height = parseCssValueString(
      (mana.layout &&
        mana.layout.computed &&
        mana.layout.computed.size &&
        mana.layout.computed.size.y) ||
        (mana.rect && mana.rect.height) ||
        (mana.attributes &&
          mana.attributes.style &&
          mana.attributes.style.height) ||
        (mana.attributes && mana.attributes.height) ||
        (mana.attributes && mana.attributes.y) ||
        0
    ).value
    var left = parseCssValueString(
      (mana.rect && mana.rect.left) ||
        (mana.attributes.style && mana.attributes.style.left) ||
        mana.attributes.x ||
        0
    ).value
    var top = parseCssValueString(
      (mana.rect && mana.rect.top) ||
        (mana.attributes.style && mana.attributes.style.top) ||
        mana.attributes.y ||
        0
    ).value
    return SVGPoints.toPoints({
      type: 'rect',
      width: width,
      height: height,
      x: left,
      y: top
    })
  }
}

module.exports = {
  pathToPoints: pathToPoints,
  pointsToPath: pointsToPath,
  polyPointsStringToPoints: polyPointsStringToPoints,
  pointsToPolyString: pointsToPolyString,
  manaToPoints: manaToPoints
}

},{"./../vendor/svg-points":129,"./parseCssValueString":29}],15:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var SimpleEventEmitter = {}

function create (instance) {
  var registry = {}
  var eavesdroppers = []

  instance.on = function on (key, fn) {
    if (!registry[key]) registry[key] = []
    // Check for dupes and ignore if this is one
    for (var i = 0; i < registry[key].length; i++) {
      if (registry[key][i] === fn) return this
    }
    registry[key].push(fn)
    return this
  }

  instance.off = function off (key, fn) {
    var listeners = registry[key]
    if (!listeners || listeners.length < 1) return this
    for (var i = 0; i < listeners.length; i++) {
      if (fn && listeners[i] === fn) listeners.splice(i, 1)
      else listeners.splice(i, 1)
    }
    return this
  }

  instance.emit = function emit (
    key,
    msg,
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    t,
    u,
    v,
    w,
    x,
    y,
    z
  ) {
    var listeners = registry[key]
    if (listeners && listeners.length > 0) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](
          msg,
          a,
          b,
          c,
          d,
          e,
          f,
          g,
          h,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z
        )
      }
    }
    if (eavesdroppers.length > 0) {
      for (var j = 0; j < eavesdroppers.length; j++) {
        eavesdroppers[j](
          key,
          msg,
          a,
          b,
          c,
          d,
          e,
          f,
          g,
          h,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z
        )
      }
    }
    return this
  }

  instance.hear = function hear (fn) {
    eavesdroppers.push(fn)
  }

  instance._registry = registry
  instance._eavesdroppers = eavesdroppers

  return instance
}

SimpleEventEmitter.create = create

module.exports = SimpleEventEmitter

},{}],16:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var allSvgElementNames = [
  'a',
  'altGlyph',
  'altGlyphDef',
  'altGlyphItem',
  'animate',
  'animateColor',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'color-profile',
  'cursor',
  'defs',
  'desc',
  'discard',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'font',
  'font-face',
  'font-face-format',
  'font-face-name',
  'font-face-src',
  'font-face-uri',
  'foreignObject',
  'g',
  'glyph',
  'glyphRef',
  'hkern',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'missing-glyph',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'script',
  'set',
  'stop',
  'style',
  'svg',
  'switch',
  'symbol',
  'text',
  'textPath',
  'title',
  'tref',
  'tspan',
  'use',
  'view',
  'vkern'
]

module.exports = allSvgElementNames

},{}],17:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var ATTR_EXEC_RE = /\[([a-zA-Z0-9]+)([$|^~])?(=)?"?(.+?)?"?( i)?]/

function attrSelectorParser (selector) {
  var matches = ATTR_EXEC_RE.exec(selector)
  if (!matches) return null
  return {
    key: matches[1],
    operator: matches[3] && (matches[2] || '') + matches[3],
    value: matches[4],
    insensitive: !!matches[5]
  }
}

module.exports = attrSelectorParser

},{}],18:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = _dereq_('./objectPath')

function matchByAttribute (
  node,
  attrKeyToMatch,
  attrOperator,
  attrValueToMatch,
  options
) {
  var attributes = objectPath(node, options.attributes)
  if (attributes) {
    var attrValue = attributes[attrKeyToMatch]
    // If no operator, do a simple presence check ([foo])
    if (!attrOperator) return !!attrValue
    switch (attrOperator) {
      case '=':
        return attrValueToMatch === attrValue
      // case '~=':
      // case '|=':
      // case '^=':
      // case '$=':
      // case '*=':
      default:
        console.warn('Operator `' + attrOperator + '` not supported yet')
        return false
    }
  }
}

module.exports = matchByAttribute

},{"./objectPath":28}],19:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = _dereq_('./objectPath')

var CLASS_NAME_ATTR = 'class'
var ALT_CLASS_NAME_ATTR = 'className' // Ease of React integration
var SPACE = ' '

function matchByClass (node, className, options) {
  var attributes = objectPath(node, options.attributes)
  if (attributes) {
    var foundClassName = attributes[CLASS_NAME_ATTR]
    if (!foundClassName) foundClassName = attributes[ALT_CLASS_NAME_ATTR]
    if (foundClassName) {
      var classPieces = foundClassName.split(SPACE)
      if (classPieces.indexOf(className) !== -1) {
        return true
      }
    }
  }
}

module.exports = matchByClass

},{"./objectPath":28}],20:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = _dereq_('./objectPath')

var HAIKU_ID_ATTRIBUTE = 'haiku-id'

function matchByHaiku (node, haikuString, options) {
  var attributes = objectPath(node, options.attributes)
  if (!attributes) return false
  if (!attributes[HAIKU_ID_ATTRIBUTE]) return false
  return attributes[HAIKU_ID_ATTRIBUTE] === haikuString
}

module.exports = matchByHaiku

},{"./objectPath":28}],21:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = _dereq_('./objectPath')

function matchById (node, id, options) {
  var attributes = objectPath(node, options.attributes)
  if (attributes) {
    if (attributes.id === id) {
      return true
    }
  }
}

module.exports = matchById

},{"./objectPath":28}],22:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = _dereq_('./objectPath')

var STRING = 'string'
var OBJECT = 'object'
var FUNCTION = 'function'

// Quick and dirty (not AST-based) way to get the name of a function at runtime
function _getFnName (fn) {
  if (fn.name) {
    return fn.name
  }

  var str = fn.toString()

  //                | | <-- this space is always here via toString()
  var reg = /function ([^(]*)/
  var ex = reg.exec(str)
  return ex && ex[1]
}

function matchByTagName (node, tagName, options) {
  var val = objectPath(node, options.name)
  if (val) {
    if (typeof val === STRING && val === tagName) {
      return true
    } else if (typeof val === FUNCTION) {
      // Allow function constructors to act as the tag name
      if (_getFnName(val) === tagName) {
        return true
      }
    } else if (typeof val === OBJECT) {
      // Allow for things like instances to act as the tag name
      if (val.name === tagName || val.tagName === tagName) {
        return true
      }
    }
  }
}

module.exports = matchByTagName

},{"./objectPath":28}],23:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var matchById = _dereq_('./cssMatchById')
var matchByClass = _dereq_('./cssMatchByClass')
var matchByTagName = _dereq_('./cssMatchByTagName')
var matchByAttribute = _dereq_('./cssMatchByAttribute')
var matchByHaiku = _dereq_('./cssMatchByHaiku')
var attrSelectorParser = _dereq_('./attrSelectorParser')

var ID_PREFIX = '#'
var CLASS_PREFIX = '.'
var ATTR_PREFIX = '['
var HAIKU_PREFIX = 'haiku:'

function matchOne (node, piece, options) {
  if (piece.slice(0, 6) === HAIKU_PREFIX) {
    return matchByHaiku(node, piece.slice(6), options)
  }

  if (piece[0] === ID_PREFIX) {
    return matchById(node, piece.slice(1, piece.length), options)
  }

  if (piece[0] === CLASS_PREFIX) {
    return matchByClass(node, piece.slice(1, piece.length), options)
  }

  if (piece[0] === ATTR_PREFIX) {
    var parsedAttr = attrSelectorParser(piece)
    if (!parsedAttr) return false
    return matchByAttribute(
      node,
      parsedAttr.key,
      parsedAttr.operator,
      parsedAttr.value,
      options
    )
  }

  return matchByTagName(node, piece, options)
}

module.exports = matchOne

},{"./attrSelectorParser":17,"./cssMatchByAttribute":18,"./cssMatchByClass":19,"./cssMatchByHaiku":20,"./cssMatchById":21,"./cssMatchByTagName":22}],24:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var matchOne = _dereq_('./cssMatchOne')

var PIECE_SEPARATOR = ','

function queryList (matches, list, query, options) {
  var maxdepth = options.maxdepth !== undefined
    ? parseInt(options.maxdepth, 10)
    : Infinity
  var pieces = query.split(PIECE_SEPARATOR)
  for (var i = 0; i < pieces.length; i++) {
    var piece = pieces[i].trim()
    for (var j = 0; j < list.length; j++) {
      var node = list[j]
      if (node.__depth <= maxdepth) {
        if (matchOne(node, piece, options)) {
          matches.push(node)
        }
      }
    }
  }
}

module.exports = queryList

},{"./cssMatchOne":23}],25:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var BasicUtils = _dereq_('./BasicUtils')
var flattenTree = _dereq_('./manaFlattenTree')
var queryList = _dereq_('./cssQueryList')

var OBJECT = 'object'

function queryTree (matches, node, query, options) {
  if (!node || typeof node !== OBJECT) return matches
  var list = BasicUtils.uniq(flattenTree([], node, options, 0, 0))
  queryList(matches, list, query, options)
  return matches
}

module.exports = queryTree

},{"./BasicUtils":12,"./cssQueryList":24,"./manaFlattenTree":27}],26:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function getTimelineMaxTime (descriptor) {
  var max = 0
  for (var selector in descriptor) {
    var group = descriptor[selector]
    for (var output in group) {
      var keyframes = group[output]
      var keys = Object.keys(keyframes)
      for (var i = 0; i < keys.length; i++) {
        var key = parseInt(keys[i], 10)
        if (key > max) max = key
      }
    }
  }
  return max
}

module.exports = getTimelineMaxTime

},{}],27:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = _dereq_('./objectPath')

function flattenTree (list, node, options, depth, index) {
  if (!depth) depth = 0
  if (!index) index = 0

  list.push(node)

  if (typeof node !== 'string') {
    node.__depth = depth
    node.__index = index
  }

  var children = objectPath(node, options.children)
  if (!children || children.length < 1) return list
  if (typeof children === 'string') return list
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      flattenTree(list, children[i], options, depth + 1, i)
    }
  } else if (typeof children === 'object') {
    children.__depth = depth + 1
    children.__index = 0

    list.push(children)
    return list
  }
  return list
}

module.exports = flattenTree

},{"./objectPath":28}],28:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var STRING = 'string'

function objectPath (obj, key) {
  if (typeof key === STRING) return obj[key]
  var base = obj
  for (var i = 0; i < key.length; i++) {
    var name = key[i]
    base = base[name]
  }
  return base
}

module.exports = objectPath

},{}],29:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function parseCssValueString (str, optionalPropertyHint) {
  if (typeof str === 'number') {
    return {
      value: str,
      unit: null
    }
  }

  if (str === null || str === undefined) {
    return {
      value: null,
      unit: null
    }
  }

  var num
  var nmatch = str.match(/([+-]?[\d|.]+)/)

  if (nmatch) num = Number(nmatch[0])
  else num = 0

  var unit
  var smatch = str.match(/(em|px|%|turn|deg|in)/)
  if (smatch) {
    unit = smatch[0]
  } else {
    if (optionalPropertyHint && optionalPropertyHint.match(/rotate/)) {
      unit = 'deg'
    } else {
      unit = null
    }
  }
  return {
    value: num,
    unit: unit
  }
}

module.exports = parseCssValueString

},{}],30:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var DEFAULT_SCOPE = 'div'

var SCOPE_STRATA = {
  div: 'div',
  svg: 'svg'
  // canvas: 'canvas'
}

var STRING = 'string'

function scopifyElements (mana, parent, scope) {
  if (!mana) return mana
  if (typeof mana === STRING) return mana

  // We'll need the ancestry present if we need to trace back up to the scope
  if (parent && !mana.__parent) {
    mana.__parent = parent
  }

  mana.__scope = scope || DEFAULT_SCOPE

  // If the current element defines a new strata, make that a new scope
  // and pass it down to the children
  if (SCOPE_STRATA[mana.elementName]) {
    scope = SCOPE_STRATA[mana.elementName]
  }

  if (mana.children) {
    for (var i = 0; i < mana.children.length; i++) {
      var child = mana.children[i]
      scopifyElements(child, mana, scope)
    }
  }
}

module.exports = scopifyElements

},{}],31:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var parseXmlNonCompliantly = _dereq_('./../vendor/xml-parser')
var styleStringToObject = _dereq_('./../vendor/to-style').object

function fixChildren (kids) {
  if (Array.isArray(kids)) return kids.map(fixNode)
  return fixNode(kids)
}

function fixAttributes (attributes) {
  if (attributes.style) {
    if (typeof attributes.style === 'string') {
      attributes.style = styleStringToObject(attributes.style)
    }
  }
  return attributes
}

function fixNode (obj) {
  if (!obj) return obj
  if (typeof obj === 'string') return obj
  var children = obj.children
  if (obj.content) children = [obj.content]
  return {
    elementName: obj.name,
    attributes: fixAttributes(obj.attributes || {}),
    children: fixChildren(children)
  }
}

function xmlToMana (xml) {
  var obj = parseXmlNonCompliantly(xml).root
  return fixNode(obj)
}

module.exports = xmlToMana

},{"./../vendor/to-style":136,"./../vendor/xml-parser":149}],32:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var setStyleMatrix = _dereq_('./setStyleMatrix')
var formatTransform = _dereq_('./formatTransform')
var isEqualTransformString = _dereq_('./isEqualTransformString')
var scopeOfElement = _dereq_('./scopeOfElement')

var SVG = 'svg'

function hasExplicitStyle (domElement, key) {
  if (!domElement.__haikuExplicitStyles) return false
  return !!domElement.__haikuExplicitStyles[key]
}

function applyCssLayout (
  domElement,
  virtualElement,
  nodeLayout,
  computedLayout,
  pixelRatio,
  rendererOptions,
  rendererScopes
) {
  // No point continuing if there's no computedLayout contents
  if (
    !computedLayout.opacity &&
    !computedLayout.size &&
    !computedLayout.matrix
  ) {
    return
  }

  var elementScope = scopeOfElement(virtualElement)

  if (nodeLayout.shown === false) {
    if (domElement.style.visibility !== 'hidden') {
      domElement.style.visibility = 'hidden'
    }
  } else if (nodeLayout.shown === true) {
    if (domElement.style.visibility !== 'visible') {
      domElement.style.visibility = 'visible'
    }
  }

  if (!hasExplicitStyle(domElement, 'opacity')) {
    if (computedLayout.opacity) {
      // A lack of an opacity setting means 100% opacity, so unset any existing
      // value if we happen to get an opacity approaching 1.
      if (computedLayout.opacity > 0.999) {
        if (domElement.style.opacity) domElement.style.opacity = void 0
      } else {
        var opacityString = '' + computedLayout.opacity
        if (domElement.style.opacity !== opacityString) {
          domElement.style.opacity = opacityString
        }
      }
    }
  }

  if (!hasExplicitStyle(domElement, 'width')) {
    if (computedLayout.size.x !== undefined) {
      var sizeXString = parseFloat(computedLayout.size.x.toFixed(2)) + 'px'
      if (domElement.style.width !== sizeXString) {
        domElement.style.width = sizeXString
      }
      // If we're inside an SVG, we also have to assign the width/height attributes or Firefox will complain
      if (elementScope === SVG) {
        if (domElement.getAttribute('width') !== sizeXString) {
          domElement.setAttribute('width', sizeXString)
        }
      }
    }
  }

  if (!hasExplicitStyle(domElement, 'height')) {
    if (computedLayout.size.y !== undefined) {
      var sizeYString = parseFloat(computedLayout.size.y.toFixed(2)) + 'px'
      if (domElement.style.height !== sizeYString) {
        domElement.style.height = sizeYString
      }
      // If we're inside an SVG, we also have to assign the width/height attributes or Firefox will complain
      if (elementScope === SVG) {
        if (domElement.getAttribute('height') !== sizeYString) {
          domElement.setAttribute('height', sizeYString)
        }
      }
    }
  }

  if (computedLayout.matrix) {
    var attributeTransform = domElement.getAttribute('transform')
    // IE doesn't support using transform on the CSS style in SVG elements, so if we are in SVG,
    // and if we are inside an IE context, use the transform attribute itself
    if (rendererOptions.platform.isIE) {
      if (elementScope === SVG) {
        var matrixString = formatTransform(
          computedLayout.matrix,
          nodeLayout.format,
          pixelRatio
        )
        if (!isEqualTransformString(attributeTransform, matrixString)) {
          domElement.setAttribute('transform', matrixString)
        }
      } else {
        setStyleMatrix(
          domElement.style,
          nodeLayout.format,
          computedLayout.matrix,
          rendererOptions && rendererOptions.useWebkitPrefix,
          pixelRatio,
          rendererOptions,
          rendererScopes
        )
      }
    } else {
      // An domElement might have an explicit transform override set, in which case, don't
      // attach the style transform to this node, because we will likely clobber what they've set
      if (!hasExplicitStyle(domElement, 'transform')) {
        if (
          !attributeTransform ||
          attributeTransform === '' ||
          virtualElement.__transformed
        ) {
          setStyleMatrix(
            domElement.style,
            nodeLayout.format,
            computedLayout.matrix,
            rendererOptions && rendererOptions.useWebkitPrefix,
            pixelRatio,
            rendererOptions,
            rendererScopes
          )
        }
      }
    }
  }

  return domElement.style
}

module.exports = applyCssLayout

},{"./formatTransform":37,"./isEqualTransformString":38,"./scopeOfElement":39,"./setStyleMatrix":40}],33:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var C1 = ', '
var C2 = ','

function compactTransform (t1) {
  return t1.split(C1).join(C2)
}

module.exports = compactTransform

},{}],34:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function computeMatrix (
  outputMatrix,
  outputNodepad,
  layoutSpec,
  currentMatrix,
  currentsizeAbsolute,
  parentMatrix,
  parentsizeAbsolute
) {
  var translationX = layoutSpec.translation.x
  var translationY = layoutSpec.translation.y
  var translationZ = layoutSpec.translation.z
  var rotationX = layoutSpec.rotation.x
  var rotationY = layoutSpec.rotation.y
  var rotationZ = layoutSpec.rotation.z
  var rotationW = layoutSpec.rotation.w
  var scaleX = layoutSpec.scale.x
  var scaleY = layoutSpec.scale.y
  var scaleZ = layoutSpec.scale.z
  var alignX = layoutSpec.align.x * parentsizeAbsolute.x
  var alignY = layoutSpec.align.y * parentsizeAbsolute.y
  var alignZ = layoutSpec.align.z * parentsizeAbsolute.z
  var mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x
  var mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y
  var mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z
  var originX = layoutSpec.origin.x * currentsizeAbsolute.x
  var originY = layoutSpec.origin.y * currentsizeAbsolute.y
  var originZ = layoutSpec.origin.z * currentsizeAbsolute.z

  var wx = rotationW * rotationX
  var wy = rotationW * rotationY
  var wz = rotationW * rotationZ
  var xx = rotationX * rotationX
  var yy = rotationY * rotationY
  var zz = rotationZ * rotationZ
  var xy = rotationX * rotationY
  var xz = rotationX * rotationZ
  var yz = rotationY * rotationZ

  var rs0 = (1 - 2 * (yy + zz)) * scaleX
  var rs1 = 2 * (xy + wz) * scaleX
  var rs2 = 2 * (xz - wy) * scaleX
  var rs3 = 2 * (xy - wz) * scaleY
  var rs4 = (1 - 2 * (xx + zz)) * scaleY
  var rs5 = 2 * (yz + wx) * scaleY
  var rs6 = 2 * (xz + wy) * scaleZ
  var rs7 = 2 * (yz - wx) * scaleZ
  var rs8 = (1 - 2 * (xx + yy)) * scaleZ

  var tx =
    alignX +
    translationX -
    mountPointX +
    originX -
    (rs0 * originX + rs3 * originY + rs6 * originZ)
  var ty =
    alignY +
    translationY -
    mountPointY +
    originY -
    (rs1 * originX + rs4 * originY + rs7 * originZ)
  var tz =
    alignZ +
    translationZ -
    mountPointZ +
    originZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ)

  outputNodepad.align = { x: alignX, y: alignY, z: alignZ }
  outputNodepad.mount = { x: mountPointX, y: mountPointY, z: mountPointZ }
  outputNodepad.origin = { x: originX, y: originY, z: originZ }
  outputNodepad.offset = { x: tx, y: ty, z: tz }

  outputMatrix[0] =
    parentMatrix[0] * rs0 + parentMatrix[4] * rs1 + parentMatrix[8] * rs2
  outputMatrix[1] =
    parentMatrix[1] * rs0 + parentMatrix[5] * rs1 + parentMatrix[9] * rs2
  outputMatrix[2] =
    parentMatrix[2] * rs0 + parentMatrix[6] * rs1 + parentMatrix[10] * rs2
  outputMatrix[3] = 0
  outputMatrix[4] =
    parentMatrix[0] * rs3 + parentMatrix[4] * rs4 + parentMatrix[8] * rs5
  outputMatrix[5] =
    parentMatrix[1] * rs3 + parentMatrix[5] * rs4 + parentMatrix[9] * rs5
  outputMatrix[6] =
    parentMatrix[2] * rs3 + parentMatrix[6] * rs4 + parentMatrix[10] * rs5
  outputMatrix[7] = 0
  outputMatrix[8] =
    parentMatrix[0] * rs6 + parentMatrix[4] * rs7 + parentMatrix[8] * rs8
  outputMatrix[9] =
    parentMatrix[1] * rs6 + parentMatrix[5] * rs7 + parentMatrix[9] * rs8
  outputMatrix[10] =
    parentMatrix[2] * rs6 + parentMatrix[6] * rs7 + parentMatrix[10] * rs8
  outputMatrix[11] = 0
  outputMatrix[12] =
    parentMatrix[0] * tx + parentMatrix[4] * ty + parentMatrix[8] * tz
  outputMatrix[13] =
    parentMatrix[1] * tx + parentMatrix[5] * ty + parentMatrix[9] * tz
  outputMatrix[14] =
    parentMatrix[2] * tx + parentMatrix[6] * ty + parentMatrix[10] * tz
  outputMatrix[15] = 1

  return outputMatrix
}

module.exports = computeMatrix

},{}],35:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function computeRotationFlexibly (x, y, z, w, quat) {
  // If w-component was given, we are dealing with someone who is quaternion-savvy,
  // and who we assume wants to compute a rotation exactly, so we'll just return the vector
  // if (w != null) {
  //   return { x: x, y: y, z: z, w: w }
  // }

  // Otherwise, the expectation is that somebody is going to pass the previous
  // quaternion so we can adjust it relative to where it had been before,
  // that is, by passing in Euler angles. Therefore, if the given quaternion
  // isn't an array, we can't continue.
  if (
    !quat ||
    (quat.x == null || quat.y == null || quat.z == null || quat.w == null)
  ) {
    throw new Error('No w-component nor quaternion provided!')
  }

  // If we got here, we are going to return a new quaternion to describe the
  // rotation as an adjustment based around the values passed in.
  // Before we move on to the actual calculations, we're going to handle the
  // case that any of the other values was omitted, which we will interpret
  // to mean we want to use the value given by the passed quaternion
  if (x == null || y == null || z == null) {
    var sp = -2 * (quat.y * quat.z - quat.w * quat.x)

    if (Math.abs(sp) > 0.99999) {
      y = y == null ? Math.PI * 0.5 * sp : y
      x = x == null
        ? Math.atan2(
            -quat.x * quat.z + quat.w * quat.y,
            0.5 - quat.y * quat.y - quat.z * quat.z
          )
        : x
      z = z == null ? 0 : z
    } else {
      y = y == null ? Math.asin(sp) : y
      x = x == null
        ? Math.atan2(
            quat.x * quat.z + quat.w * quat.y,
            0.5 - quat.x * quat.x - quat.y * quat.y
          )
        : x
      z = z == null
        ? Math.atan2(
            quat.x * quat.y + quat.w * quat.z,
            0.5 - quat.x * quat.x - quat.z * quat.z
          )
        : z
    }
  }

  var hx = x * 0.5
  var hy = y * 0.5
  var hz = z * 0.5

  var sx = Math.sin(hx)
  var sy = Math.sin(hy)
  var sz = Math.sin(hz)
  var cx = Math.cos(hx)
  var cy = Math.cos(hy)
  var cz = Math.cos(hz)

  var sysz = sy * sz
  var cysz = cy * sz
  var sycz = sy * cz
  var cycz = cy * cz

  var qx = sx * cycz + cx * sysz
  var qy = cx * sycz - sx * cysz
  var qz = cx * cysz + sx * sycz
  var qw = cx * cycz - sx * sysz

  return { x: qx, y: qy, z: qz, w: qw }
}

module.exports = computeRotationFlexibly

},{}],36:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var SIZE_PROPORTIONAL = 0 // A percentage of the parent
var SIZE_ABSOLUTE = 1 // A fixed size in screen pixels

var SIZING_COMPONENTS = ['x', 'y', 'z']

function computeSize (
  outputSize,
  layoutSpec,
  sizeModeArray,
  parentsizeAbsolute
) {
  for (var i = 0; i < SIZING_COMPONENTS.length; i++) {
    var component = SIZING_COMPONENTS[i]
    switch (sizeModeArray[component]) {
      case SIZE_PROPORTIONAL:
        var sizeProportional = layoutSpec.sizeProportional[component]
        var sizeDifferential = layoutSpec.sizeDifferential[component]
        outputSize[component] =
          parentsizeAbsolute[component] * sizeProportional + sizeDifferential
        break
      case SIZE_ABSOLUTE:
        outputSize[component] = layoutSpec.sizeAbsolute[component]
        break
    }
  }
  return outputSize
}

module.exports = computeSize

},{}],37:[function(_dereq_,module,exports){
/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var TRANSFORM_SUFFIX = ')'
var TRANSFORM_ZERO = '0'
var TRANSFORM_COMMA = ','
var TRANSFORM_ZILCH = TRANSFORM_ZERO + TRANSFORM_COMMA
var TWO = 2
var THREE = 3

function formatTransform (transform, format, devicePixelRatio) {
  transform[12] =
    Math.round(transform[12] * devicePixelRatio) / devicePixelRatio
  transform[13] =
    Math.round(transform[13] * devicePixelRatio) / devicePixelRatio
  var prefix
  var last
  if (format === TWO) {
    // Example: matrix(1,0,0,0,0,1)
    // 2d matrix is: matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
    // Modify via: matrix(a,b,c,d,tx,ty) <= matrix3d(a,b,0,0,c,d,0,0,0,0,1,0,tx,ty,0,1)
    var two = [
      transform[0],
      transform[1],
      transform[4],
      transform[5],
      transform[12],
      transform[13]
    ]
    transform = two
    prefix = 'matrix('
    last = 5
  } else if (format === THREE) {
    // Example: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
    prefix = 'matrix3d('
    last = 15
  }
  for (var i = 0; i < last; i++) {
    prefix += transform[i] < 0.000001 && transform[i] > -0.000001
      ? TRANSFORM_ZILCH
      : transform[i] + TRANSFORM_COMMA
  }
  prefix += transform[last] + TRANSFORM_SUFFIX
  return prefix
}

module.exports = formatTransform

},{}],38:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var compactTransform = _dereq_('./compactTransform')

// var CIDENT = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'

function isEqualTransformString (t1, t2) {
  if (t1 === t2) return true
  if (!t1) return false
  var c1 = compactTransform(t1)
  var c2 = compactTransform(t2)
  if (c1 === c2) return true
  // if (t2 === CIDENT) return true // Historic hack that causes module replacement update issues as of Dec 7 2016
  return false
}

module.exports = isEqualTransformString

},{"./compactTransform":33}],39:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = function scopeOfElement (mana) {
  if (mana.__scope) return mana.__scope

  if (mana.__parent) {
    return scopeOfElement(mana.__parent)
  }

  return null
}

},{}],40:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var formatTransform = _dereq_('./formatTransform')
var isEqualTransformString = _dereq_('./isEqualTransformString')

function setStyleMatrix (
  styleObject,
  format,
  matrix,
  usePrefix,
  devicePixelRatio,
  rendererScopes
) {
  var matrixString = formatTransform(matrix, format, devicePixelRatio)
  if (usePrefix) {
    if (!isEqualTransformString(styleObject.webkitTransform, matrixString)) {
      styleObject.webkitTransform = matrixString
    }
  } else {
    if (!isEqualTransformString(styleObject.transform, matrixString)) {
      styleObject.transform = matrixString
    }
  }
  return styleObject
}

module.exports = setStyleMatrix

},{"./formatTransform":37,"./isEqualTransformString":38}],41:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Layout3D = _dereq_('./../../Layout3D')

/**
 * 'Vanities' are functions that provide special handling for applied properties.
 * So for example, if a component wants to apply 'foo.bar'=3 to a <div> in its template,
 * the player/interpreter will look in the vanities dictionary to see if there is a
 * vanity under vanities['div']['foo.bar'], and if so, pass the value 3 into that function.
 * The function, in turn, knows how to apply that value to the virtual element passed into
 * it. In the future these will be defined by components themselves as inputs; for now,
 * we are keeping a whitelist of possible vanity handlers which the renderer directly
 * loads and calls.
 * {
 *   div: {
 *     'foo.bar': function()...
 *   }
 * }
 */

// Just a utility function for populating these objects
function has () {
  var obj = {}
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i]
    for (var name in arg) {
      var fn = arg[name]
      obj[name] = fn
    }
  }
  return obj
}

var LAYOUT_3D_VANITIES = {
  // Layout has a couple of special values that relate to display
  // but not to position:

  shown: function (name, element, value) {
    element.layout.shown = value
  },
  opacity: function (name, element, value) {
    element.layout.opacity = value
  },

  // Rotation is a special snowflake since it needs to account for
  // the w-component of the quaternion and carry it

  'rotation.x': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = value
    var y = rotation.y
    var z = rotation.z
    var w = rotation.w
    element.layout.rotation = Layout3D.computeRotationFlexibly(
      x,
      y,
      z,
      w,
      rotation
    )
  },
  'rotation.y': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = rotation.x
    var y = value
    var z = rotation.z
    var w = rotation.w
    element.layout.rotation = Layout3D.computeRotationFlexibly(
      x,
      y,
      z,
      w,
      rotation
    )
  },
  'rotation.z': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = rotation.x
    var y = rotation.y
    var z = value
    var w = rotation.w
    element.layout.rotation = Layout3D.computeRotationFlexibly(
      x,
      y,
      z,
      w,
      rotation
    )
  },
  'rotation.w': function (name, element, value) {
    var rotation = element.layout.rotation
    var x = rotation.x
    var y = rotation.y
    var z = rotation.z
    var w = value
    element.layout.rotation = Layout3D.computeRotationFlexibly(
      x,
      y,
      z,
      w,
      rotation
    )
  },

  // If you really want to set what we call 'position' then
  // we do so on the element's attributes; this is mainly to
  // enable the x/y positioning system for SVG elements

  'position.x': function (name, element, value) {
    element.attributes.x = value
  },
  'position.y': function (name, element, value) {
    element.attributes.y = value
  },

  // Everything that follows is a standard 3-coord component
  // relating to the element's position in space

  'align.x': function (name, element, value) {
    element.layout.align.x = value
  },
  'align.y': function (name, element, value) {
    element.layout.align.y = value
  },
  'align.z': function (name, element, value) {
    element.layout.align.z = value
  },
  'mount.x': function (name, element, value) {
    element.layout.mount.x = value
  },
  'mount.y': function (name, element, value) {
    element.layout.mount.y = value
  },
  'mount.z': function (name, element, value) {
    element.layout.mount.z = value
  },
  'origin.x': function (name, element, value) {
    element.layout.origin.x = value
  },
  'origin.y': function (name, element, value) {
    element.layout.origin.y = value
  },
  'origin.z': function (name, element, value) {
    element.layout.origin.z = value
  },
  'scale.x': function (name, element, value) {
    element.layout.scale.x = value
  },
  'scale.y': function (name, element, value) {
    element.layout.scale.y = value
  },
  'scale.z': function (name, element, value) {
    element.layout.scale.z = value
  },
  'sizeAbsolute.x': function (name, element, value) {
    element.layout.sizeAbsolute.x = value
  },
  'sizeAbsolute.y': function (name, element, value) {
    element.layout.sizeAbsolute.y = value
  },
  'sizeAbsolute.z': function (name, element, value) {
    element.layout.sizeAbsolute.z = value
  },
  'sizeDifferential.x': function (name, element, value) {
    element.layout.sizeDifferential.x = value
  },
  'sizeDifferential.y': function (name, element, value) {
    element.layout.sizeDifferential.y = value
  },
  'sizeDifferential.z': function (name, element, value) {
    element.layout.sizeDifferential.z = value
  },
  'sizeMode.x': function (name, element, value) {
    element.layout.sizeMode.x = value
  },
  'sizeMode.y': function (name, element, value) {
    element.layout.sizeMode.y = value
  },
  'sizeMode.z': function (name, element, value) {
    element.layout.sizeMode.z = value
  },
  'sizeProportional.x': function (name, element, value) {
    element.layout.sizeProportional.x = value
  },
  'sizeProportional.y': function (name, element, value) {
    element.layout.sizeProportional.y = value
  },
  'sizeProportional.z': function (name, element, value) {
    element.layout.sizeProportional.z = value
  },
  'translation.x': function (name, element, value) {
    element.layout.translation.x = value
  },
  'translation.y': function (name, element, value) {
    element.layout.translation.y = value
  },
  'translation.z': function (name, element, value) {
    element.layout.translation.z = value
  }
}

function _clone (obj) {
  var out = {}
  for (var key in obj) {
    out[key] = obj[key]
  }
  return out
}

var LAYOUT_2D_VANITIES = _clone(LAYOUT_3D_VANITIES)

function styleSetter (prop) {
  return function (name, element, value) {
    element.attributes.style[prop] = value
  }
}

var STYLE_VANITIES = {
  'style.alignContent': styleSetter('alignContent'),
  'style.alignItems': styleSetter('alignItems'),
  'style.alignmentBaseline': styleSetter('alignmentBaseline'),
  'style.alignSelf': styleSetter('alignSelf'),
  'style.all': styleSetter('all'),
  'style.animation': styleSetter('animation'),
  'style.animationDelay': styleSetter('animationDelay'),
  'style.animationDirection': styleSetter('animationDirection'),
  'style.animationDuration': styleSetter('animationDuration'),
  'style.animationFillMode': styleSetter('animationFillMode'),
  'style.animationIterationCount': styleSetter('animationIterationCount'),
  'style.animationName': styleSetter('animationName'),
  'style.animationPlayState': styleSetter('animationPlayState'),
  'style.animationTimingFunction': styleSetter('animationTimingFunction'),
  'style.appearance': styleSetter('appearance'),
  'style.azimuth': styleSetter('azimuth'),
  'style.backfaceVisibility': styleSetter('backfaceVisibility'),
  'style.background': styleSetter('background'),
  'style.backgroundAttachment': styleSetter('backgroundAttachment'),
  'style.backgroundBlendMode': styleSetter('backgroundBlendMode'),
  'style.backgroundClip': styleSetter('backgroundClip'),
  'style.backgroundColor': styleSetter('backgroundColor'),
  'style.backgroundimage': styleSetter('backgroundimage'),
  'style.backgroundorigin': styleSetter('backgroundorigin'),
  'style.backgroundposition': styleSetter('backgroundposition'),
  'style.backgroundRepeat': styleSetter('backgroundRepeat'),
  'style.backgroundSize': styleSetter('backgroundSize'),
  'style.baselineShift': styleSetter('baselineShift'),
  'style.bookmarkLabel': styleSetter('bookmarkLabel'),
  'style.bookmarkLevel': styleSetter('bookmarkLevel'),
  'style.bookmarkState': styleSetter('bookmarkState'),
  'style.border': styleSetter('border'),
  'style.borderBottom': styleSetter('borderBottom'),
  'style.borderBottomColor': styleSetter('borderBottomColor'),
  'style.borderBottomLeftRadius': styleSetter('borderBottomLeftRadius'),
  'style.borderBottomRightRadius': styleSetter('borderBottomRightRadius'),
  'style.borderBottomStyle': styleSetter('borderBottomStyle'),
  'style.borderBottomWidth': styleSetter('borderBottomWidth'),
  'style.borderBoundary': styleSetter('borderBoundary'),
  'style.borderCollapse': styleSetter('borderCollapse'),
  'style.borderColor': styleSetter('borderColor'),
  'style.borderImage': styleSetter('borderImage'),
  'style.borderImageOutset': styleSetter('borderImageOutset'),
  'style.borderImageRepeat': styleSetter('borderImageRepeat'),
  'style.borderImageSlice': styleSetter('borderImageSlice'),
  'style.borderImageSource': styleSetter('borderImageSource'),
  'style.borderImageWidth': styleSetter('borderImageWidth'),
  'style.borderLeft': styleSetter('borderLeft'),
  'style.borderLeftColor': styleSetter('borderLeftColor'),
  'style.borderLeftStyle': styleSetter('borderLeftStyle'),
  'style.borderLeftWidth': styleSetter('borderLeftWidth'),
  'style.borderRadius': styleSetter('borderRadius'),
  'style.borderRight': styleSetter('borderRight'),
  'style.borderRightColor': styleSetter('borderRightColor'),
  'style.borderRightStyle': styleSetter('borderRightStyle'),
  'style.borderRightWidth': styleSetter('borderRightWidth'),
  'style.borderSpacing': styleSetter('borderSpacing'),
  'style.borderStyle': styleSetter('borderStyle'),
  'style.borderTop': styleSetter('borderTop'),
  'style.borderTopColor': styleSetter('borderTopColor'),
  'style.borderTopLeftRadius': styleSetter('borderTopLeftRadius'),
  'style.borderTopRightRadius': styleSetter('borderTopRightRadius'),
  'style.borderTopStyle': styleSetter('borderTopStyle'),
  'style.borderTopWidth': styleSetter('borderTopWidth'),
  'style.borderWidth': styleSetter('borderWidth'),
  'style.bottom': styleSetter('bottom'),
  'style.boxDecorationBreak': styleSetter('boxDecorationBreak'),
  'style.boxShadow': styleSetter('boxShadow'),
  'style.boxSizing': styleSetter('boxSizing'),
  'style.boxSnap': styleSetter('boxSnap'),
  'style.boxSuppress': styleSetter('boxSuppress'),
  'style.breakAfter': styleSetter('breakAfter'),
  'style.breakBefore': styleSetter('breakBefore'),
  'style.breakInside': styleSetter('breakInside'),
  'style.captionSide': styleSetter('captionSide'),
  'style.caret': styleSetter('caret'),
  'style.caretAnimation': styleSetter('caretAnimation'),
  'style.caretColor': styleSetter('caretColor'),
  'style.caretShape': styleSetter('caretShape'),
  'style.chains': styleSetter('chains'),
  'style.clear': styleSetter('clear'),
  'style.clip': styleSetter('clip'),
  'style.clipPath': styleSetter('clipPath'),
  'style.clipRule': styleSetter('clipRule'),
  'style.color': styleSetter('color'),
  'style.colorAdjust': styleSetter('colorAdjust'),
  'style.colorInterpolation': styleSetter('colorInterpolation'),
  'style.colorInterpolationFilters': styleSetter('colorInterpolationFilters'),
  'style.colorProfile': styleSetter('colorProfile'),
  'style.colorRendering': styleSetter('colorRendering'),
  'style.columnCount': styleSetter('columnCount'),
  'style.columnFill': styleSetter('columnFill'),
  'style.columnGap': styleSetter('columnGap'),
  'style.columnRule': styleSetter('columnRule'),
  'style.columnRuleColor': styleSetter('columnRuleColor'),
  'style.columnRuleStyle': styleSetter('columnRuleStyle'),
  'style.columnRuleWidth': styleSetter('columnRuleWidth'),
  'style.columns': styleSetter('columns'),
  'style.columnSpan': styleSetter('columnSpan'),
  'style.columnWidth': styleSetter('columnWidth'),
  'style.content': styleSetter('content'),
  'style.continue': styleSetter('continue'),
  'style.counterIncrement': styleSetter('counterIncrement'),
  'style.counterReset': styleSetter('counterReset'),
  'style.counterSet': styleSetter('counterSet'),
  'style.cue': styleSetter('cue'),
  'style.cueAfter': styleSetter('cueAfter'),
  'style.cueBefore': styleSetter('cueBefore'),
  'style.cursor': styleSetter('cursor'),
  'style.direction': styleSetter('direction'),
  'style.display': styleSetter('display'),
  'style.dominantBaseline': styleSetter('dominantBaseline'),
  'style.elevation': styleSetter('elevation'),
  'style.emptyCells': styleSetter('emptyCells'),
  'style.enableBackground': styleSetter('enableBackground'),
  'style.fill': styleSetter('fill'),
  'style.fillOpacity': styleSetter('fillOpacity'),
  'style.fillRule': styleSetter('fillRule'),
  'style.filter': styleSetter('filter'),
  'style.flex': styleSetter('flex'),
  'style.flexBasis': styleSetter('flexBasis'),
  'style.flexDirection': styleSetter('flexDirection'),
  'style.flexFlow': styleSetter('flexFlow'),
  'style.flexGrow': styleSetter('flexGrow'),
  'style.flexShrink': styleSetter('flexShrink'),
  'style.flexWrap': styleSetter('flexWrap'),
  'style.float': styleSetter('float'),
  'style.floatDefer': styleSetter('floatDefer'),
  'style.floatOffset': styleSetter('floatOffset'),
  'style.floatReference': styleSetter('floatReference'),
  'style.floodColor': styleSetter('floodColor'),
  'style.floodOpacity': styleSetter('floodOpacity'),
  'style.flow': styleSetter('flow'),
  'style.flowFrom': styleSetter('flowFrom'),
  'style.flowInto': styleSetter('flowInto'),
  'style.font': styleSetter('font'),
  'style.fontFamily': styleSetter('fontFamily'),
  'style.fontFeatureSettings': styleSetter('fontFeatureSettings'),
  'style.fontKerning': styleSetter('fontKerning'),
  'style.fontLanguageOverride': styleSetter('fontLanguageOverride'),
  'style.fontSize': styleSetter('fontSize'),
  'style.fontSizeAdjust': styleSetter('fontSizeAdjust'),
  'style.fontStretch': styleSetter('fontStretch'),
  'style.fontStyle': styleSetter('fontStyle'),
  'style.fontSynthesis': styleSetter('fontSynthesis'),
  'style.fontVariant': styleSetter('fontVariant'),
  'style.fontVariantAlternates': styleSetter('fontVariantAlternates'),
  'style.fontVariantCaps': styleSetter('fontVariantCaps'),
  'style.fontVariantEastAsian': styleSetter('fontVariantEastAsian'),
  'style.fontVariantLigatures': styleSetter('fontVariantLigatures'),
  'style.fontVariantNumeric': styleSetter('fontVariantNumeric'),
  'style.fontVariantPosition': styleSetter('fontVariantPosition'),
  'style.fontWeight': styleSetter('fontWeight'),
  'style.footnoteDisplay': styleSetter('footnoteDisplay'),
  'style.footnotePolicy': styleSetter('footnotePolicy'),
  'style.glyphOrientationHorizontal': styleSetter('glyphOrientationHorizontal'),
  'style.glyphOrientationVertical': styleSetter('glyphOrientationVertical'),
  'style.grid': styleSetter('grid'),
  'style.gridArea': styleSetter('gridArea'),
  'style.gridAutoColumns': styleSetter('gridAutoColumns'),
  'style.gridAutoFlow': styleSetter('gridAutoFlow'),
  'style.gridAutoRows': styleSetter('gridAutoRows'),
  'style.gridColumn': styleSetter('gridColumn'),
  'style.gridColumnEnd': styleSetter('gridColumnEnd'),
  'style.gridColumnGap': styleSetter('gridColumnGap'),
  'style.gridColumnStart': styleSetter('gridColumnStart'),
  'style.gridGap': styleSetter('gridGap'),
  'style.gridRow': styleSetter('gridRow'),
  'style.gridRowEnd': styleSetter('gridRowEnd'),
  'style.gridRowGap': styleSetter('gridRowGap'),
  'style.gridRowStart': styleSetter('gridRowStart'),
  'style.gridTemplate': styleSetter('gridTemplate'),
  'style.gridTemplateAreas': styleSetter('gridTemplateAreas'),
  'style.gridTemplateColumns': styleSetter('gridTemplateColumns'),
  'style.gridTemplateRows': styleSetter('gridTemplateRows'),
  'style.hangingPunctuation': styleSetter('hangingPunctuation'),
  'style.height': styleSetter('height'),
  'style.hyphenateCharacter': styleSetter('hyphenateCharacter'),
  'style.hyphenateLimitChars': styleSetter('hyphenateLimitChars'),
  'style.hyphenateLimitLast': styleSetter('hyphenateLimitLast'),
  'style.hyphenateLimitLines': styleSetter('hyphenateLimitLines'),
  'style.hyphenateLimitZone': styleSetter('hyphenateLimitZone'),
  'style.hyphens': styleSetter('hyphens'),
  'style.imageOrientation': styleSetter('imageOrientation'),
  'style.imageRendering': styleSetter('imageRendering'),
  'style.imageResolution': styleSetter('imageResolution'),
  'style.initialLetter': styleSetter('initialLetter'),
  'style.initialLetterAlign': styleSetter('initialLetterAlign'),
  'style.initialLetterWrap': styleSetter('initialLetterWrap'),
  'style.isolation': styleSetter('isolation'),
  'style.justifyContent': styleSetter('justifyContent'),
  'style.justifyItems': styleSetter('justifyItems'),
  'style.justifySelf': styleSetter('justifySelf'),
  'style.kerning': styleSetter('kerning'),
  'style.left': styleSetter('left'),
  'style.letterSpacing': styleSetter('letterSpacing'),
  'style.lightingColor': styleSetter('lightingColor'),
  'style.lineBreak': styleSetter('lineBreak'),
  'style.lineGrid': styleSetter('lineGrid'),
  'style.lineHeight': styleSetter('lineHeight'),
  'style.lineSnap': styleSetter('lineSnap'),
  'style.listStyle': styleSetter('listStyle'),
  'style.listStyleImage': styleSetter('listStyleImage'),
  'style.listStylePosition': styleSetter('listStylePosition'),
  'style.listStyleType': styleSetter('listStyleType'),
  'style.margin': styleSetter('margin'),
  'style.marginBottom': styleSetter('marginBottom'),
  'style.marginLeft': styleSetter('marginLeft'),
  'style.marginRight': styleSetter('marginRight'),
  'style.marginTop': styleSetter('marginTop'),
  'style.marker': styleSetter('marker'),
  'style.markerEnd': styleSetter('markerEnd'),
  'style.markerKnockoutLeft': styleSetter('markerKnockoutLeft'),
  'style.markerKnockoutRight': styleSetter('markerKnockoutRight'),
  'style.markerMid': styleSetter('markerMid'),
  'style.markerPattern': styleSetter('markerPattern'),
  'style.markerSegment': styleSetter('markerSegment'),
  'style.markerSide': styleSetter('markerSide'),
  'style.markerStart': styleSetter('markerStart'),
  'style.marqueeDirection': styleSetter('marqueeDirection'),
  'style.marqueeLoop': styleSetter('marqueeLoop'),
  'style.marqueeSpeed': styleSetter('marqueeSpeed'),
  'style.marqueeStyle': styleSetter('marqueeStyle'),
  'style.mask': styleSetter('mask'),
  'style.maskBorder': styleSetter('maskBorder'),
  'style.maskBorderMode': styleSetter('maskBorderMode'),
  'style.maskBorderOutset': styleSetter('maskBorderOutset'),
  'style.maskBorderRepeat': styleSetter('maskBorderRepeat'),
  'style.maskBorderSlice': styleSetter('maskBorderSlice'),
  'style.maskBorderSource': styleSetter('maskBorderSource'),
  'style.maskBorderWidth': styleSetter('maskBorderWidth'),
  'style.maskClip': styleSetter('maskClip'),
  'style.maskComposite': styleSetter('maskComposite'),
  'style.maskImage': styleSetter('maskImage'),
  'style.maskMode': styleSetter('maskMode'),
  'style.maskOrigin': styleSetter('maskOrigin'),
  'style.maskPosition': styleSetter('maskPosition'),
  'style.maskRepeat': styleSetter('maskRepeat'),
  'style.maskSize': styleSetter('maskSize'),
  'style.maskType': styleSetter('maskType'),
  'style.maxHeight': styleSetter('maxHeight'),
  'style.maxLines': styleSetter('maxLines'),
  'style.maxWidth': styleSetter('maxWidth'),
  'style.minHeight': styleSetter('minHeight'),
  'style.minWidth': styleSetter('minWidth'),
  'style.mixBlendMode': styleSetter('mixBlendMode'),
  'style.motion': styleSetter('motion'),
  'style.motionOffset': styleSetter('motionOffset'),
  'style.motionPath': styleSetter('motionPath'),
  'style.motionRotation': styleSetter('motionRotation'),
  'style.navDown': styleSetter('navDown'),
  'style.navLeft': styleSetter('navLeft'),
  'style.navRight': styleSetter('navRight'),
  'style.navUp': styleSetter('navUp'),
  'style.objectFit': styleSetter('objectFit'),
  'style.objectPosition': styleSetter('objectPosition'),
  'style.offset': styleSetter('offset'),
  'style.offsetAfter': styleSetter('offsetAfter'),
  'style.offsetAnchor': styleSetter('offsetAnchor'),
  'style.offsetBefore': styleSetter('offsetBefore'),
  'style.offsetDistance': styleSetter('offsetDistance'),
  'style.offsetEnd': styleSetter('offsetEnd'),
  'style.offsetPath': styleSetter('offsetPath'),
  'style.offsetPosition': styleSetter('offsetPosition'),
  'style.offsetRotate': styleSetter('offsetRotate'),
  'style.offsetStart': styleSetter('offsetStart'),
  'style.opacity': styleSetter('opacity'),
  'style.order': styleSetter('order'),
  'style.orphans': styleSetter('orphans'),
  'style.outline': styleSetter('outline'),
  'style.outlineColor': styleSetter('outlineColor'),
  'style.outlineOffset': styleSetter('outlineOffset'),
  'style.outlineStyle': styleSetter('outlineStyle'),
  'style.outlineWidth': styleSetter('outlineWidth'),
  'style.overflow': styleSetter('overflow'),
  'style.overflowStyle': styleSetter('overflowStyle'),
  'style.overflowWrap': styleSetter('overflowWrap'),
  'style.overflowX': styleSetter('overflowX'),
  'style.overflowY': styleSetter('overflowY'),
  'style.padding': styleSetter('padding'),
  'style.paddingBottom': styleSetter('paddingBottom'),
  'style.paddingLeft': styleSetter('paddingLeft'),
  'style.paddingRight': styleSetter('paddingRight'),
  'style.paddingTop': styleSetter('paddingTop'),
  'style.page': styleSetter('page'),
  'style.pageBreakAfter': styleSetter('pageBreakAfter'),
  'style.pageBreakBefore': styleSetter('pageBreakBefore'),
  'style.pageBreakInside': styleSetter('pageBreakInside'),
  'style.pause': styleSetter('pause'),
  'style.pauseAfter': styleSetter('pauseAfter'),
  'style.pauseBefore': styleSetter('pauseBefore'),
  'style.perspective': styleSetter('perspective'),
  'style.perspectiveOrigin': styleSetter('perspectiveOrigin'),
  'style.pitch': styleSetter('pitch'),
  'style.pitchRange': styleSetter('pitchRange'),
  'style.placeContent': styleSetter('placeContent'),
  'style.placeItems': styleSetter('placeItems'),
  'style.placeSelf': styleSetter('placeSelf'),
  'style.playDuring': styleSetter('playDuring'),
  'style.pointerEvents': styleSetter('pointerEvents'),
  'style.polarAnchor': styleSetter('polarAnchor'),
  'style.polarAngle': styleSetter('polarAngle'),
  'style.polarDistance': styleSetter('polarDistance'),
  'style.polarOrigin': styleSetter('polarOrigin'),
  'style.position': styleSetter('position'),
  'style.presentationLevel': styleSetter('presentationLevel'),
  'style.quotes': styleSetter('quotes'),
  'style.regionFragment': styleSetter('regionFragment'),
  'style.resize': styleSetter('resize'),
  'style.rest': styleSetter('rest'),
  'style.restAfter': styleSetter('restAfter'),
  'style.restBefore': styleSetter('restBefore'),
  'style.richness': styleSetter('richness'),
  'style.right': styleSetter('right'),
  'style.rotation': styleSetter('rotation'),
  'style.rotationPoint': styleSetter('rotationPoint'),
  'style.rubyAlign': styleSetter('rubyAlign'),
  'style.rubyMerge': styleSetter('rubyMerge'),
  'style.rubyPosition': styleSetter('rubyPosition'),
  'style.running': styleSetter('running'),
  'style.scrollBehavior': styleSetter('scrollBehavior'),
  'style.scrollPadding': styleSetter('scrollPadding'),
  'style.scrollPaddingBlock': styleSetter('scrollPaddingBlock'),
  'style.scrollPaddingBlockEnd': styleSetter('scrollPaddingBlockEnd'),
  'style.scrollPaddingBlockStart': styleSetter('scrollPaddingBlockStart'),
  'style.scrollPaddingBottom': styleSetter('scrollPaddingBottom'),
  'style.scrollPaddingInline': styleSetter('scrollPaddingInline'),
  'style.scrollPaddingInlineEnd': styleSetter('scrollPaddingInlineEnd'),
  'style.scrollPaddingInlineStart': styleSetter('scrollPaddingInlineStart'),
  'style.scrollPaddingLeft': styleSetter('scrollPaddingLeft'),
  'style.scrollPaddingRight': styleSetter('scrollPaddingRight'),
  'style.scrollPaddingTop': styleSetter('scrollPaddingTop'),
  'style.scrollSnapAlign': styleSetter('scrollSnapAlign'),
  'style.scrollSnapMargin': styleSetter('scrollSnapMargin'),
  'style.scrollSnapMarginBlock': styleSetter('scrollSnapMarginBlock'),
  'style.scrollSnapMarginBlockEnd': styleSetter('scrollSnapMarginBlockEnd'),
  'style.scrollSnapMarginBlockStart': styleSetter('scrollSnapMarginBlockStart'),
  'style.scrollSnapMarginBottom': styleSetter('scrollSnapMarginBottom'),
  'style.scrollSnapMarginInline': styleSetter('scrollSnapMarginInline'),
  'style.scrollSnapMarginInlineEnd': styleSetter('scrollSnapMarginInlineEnd'),
  'style.scrollSnapMarginInlineStart': styleSetter(
    'scrollSnapMarginInlineStart'
  ),
  'style.scrollSnapMarginLeft': styleSetter('scrollSnapMarginLeft'),
  'style.scrollSnapMarginRight': styleSetter('scrollSnapMarginRight'),
  'style.scrollSnapMarginTop': styleSetter('scrollSnapMarginTop'),
  'style.scrollSnapStop': styleSetter('scrollSnapStop'),
  'style.scrollSnapType': styleSetter('scrollSnapType'),
  'style.shapeImageThreshold': styleSetter('shapeImageThreshold'),
  'style.shapeInside': styleSetter('shapeInside'),
  'style.shapeMargin': styleSetter('shapeMargin'),
  'style.shapeOutside': styleSetter('shapeOutside'),
  'style.shapeRendering': styleSetter('shapeRendering'),
  'style.size': styleSetter('size'),
  'style.speak': styleSetter('speak'),
  'style.speakAs': styleSetter('speakAs'),
  'style.speakHeader': styleSetter('speakHeader'),
  'style.speakNumeral': styleSetter('speakNumeral'),
  'style.speakPunctuation': styleSetter('speakPunctuation'),
  'style.speechRate': styleSetter('speechRate'),
  'style.stopColor': styleSetter('stopColor'),
  'style.stopOpacity': styleSetter('stopOpacity'),
  'style.stress': styleSetter('stress'),
  'style.stringSet': styleSetter('stringSet'),
  'style.stroke': styleSetter('stroke'),
  'style.strokeAlignment': styleSetter('strokeAlignment'),
  'style.strokeDashadjust': styleSetter('strokeDashadjust'),
  'style.strokeDasharray': styleSetter('strokeDasharray'),
  'style.strokeDashcorner': styleSetter('strokeDashcorner'),
  'style.strokeDashoffset': styleSetter('strokeDashoffset'),
  'style.strokeLinecap': styleSetter('strokeLinecap'),
  'style.strokeLinejoin': styleSetter('strokeLinejoin'),
  'style.strokeMiterlimit': styleSetter('strokeMiterlimit'),
  'style.strokeOpacity': styleSetter('strokeOpacity'),
  'style.strokeWidth': styleSetter('strokeWidth'),
  'style.tableLayout': styleSetter('tableLayout'),
  'style.tabSize': styleSetter('tabSize'),
  'style.textAlign': styleSetter('textAlign'),
  'style.textAlignAll': styleSetter('textAlignAll'),
  'style.textAlignLast': styleSetter('textAlignLast'),
  'style.textAnchor': styleSetter('textAnchor'),
  'style.textCombineUpright': styleSetter('textCombineUpright'),
  'style.textDecoration': styleSetter('textDecoration'),
  'style.textDecorationColor': styleSetter('textDecorationColor'),
  'style.textDecorationLine': styleSetter('textDecorationLine'),
  'style.textDecorationSkip': styleSetter('textDecorationSkip'),
  'style.textDecorationStyle': styleSetter('textDecorationStyle'),
  'style.textEmphasis': styleSetter('textEmphasis'),
  'style.textEmphasisColor': styleSetter('textEmphasisColor'),
  'style.textEmphasisPosition': styleSetter('textEmphasisPosition'),
  'style.textEmphasisStyle': styleSetter('textEmphasisStyle'),
  'style.textIndent': styleSetter('textIndent'),
  'style.textJustify': styleSetter('textJustify'),
  'style.textOrientation': styleSetter('textOrientation'),
  'style.textOverflow': styleSetter('textOverflow'),
  'style.textRendering': styleSetter('textRendering'),
  'style.textShadow': styleSetter('textShadow'),
  'style.textSpaceCollapse': styleSetter('textSpaceCollapse'),
  'style.textSpaceTrim': styleSetter('textSpaceTrim'),
  'style.textSpacing': styleSetter('textSpacing'),
  'style.textTransform': styleSetter('textTransform'),
  'style.textUnderlinePosition': styleSetter('textUnderlinePosition'),
  'style.textWrap': styleSetter('textWrap'),
  'style.top': styleSetter('top'),
  'style.transform': styleSetter('transform'),
  'style.transformBox': styleSetter('transformBox'),
  'style.transformOrigin': styleSetter('transformOrigin'),
  'style.transformStyle': styleSetter('transformStyle'),
  'style.transition': styleSetter('transition'),
  'style.transitionDelay': styleSetter('transitionDelay'),
  'style.transitionDuration': styleSetter('transitionDuration'),
  'style.transitionProperty': styleSetter('transitionProperty'),
  'style.transitionTimingFunction': styleSetter('transitionTimingFunction'),
  'style.unicodeBidi': styleSetter('unicodeBidi'),
  'style.userSelect': styleSetter('userSelect'),
  'style.verticalAlign': styleSetter('verticalAlign'),
  'style.visibility': styleSetter('visibility'),
  'style.voiceBalance': styleSetter('voiceBalance'),
  'style.voiceDuration': styleSetter('voiceDuration'),
  'style.voiceFamily': styleSetter('voiceFamily'),
  'style.voicePitch': styleSetter('voicePitch'),
  'style.voiceRange': styleSetter('voiceRange'),
  'style.voiceRate': styleSetter('voiceRate'),
  'style.voiceStress': styleSetter('voiceStress'),
  'style.voiceVolume': styleSetter('voiceVolume'),
  'style.volume': styleSetter('volume'),
  'style.whiteSpace': styleSetter('whiteSpace'),
  'style.widows': styleSetter('widows'),
  'style.width': styleSetter('width'),
  'style.willChange': styleSetter('willChange'),
  'style.wordBreak': styleSetter('wordBreak'),
  'style.wordSpacing': styleSetter('wordSpacing'),
  'style.wordWrap': styleSetter('wordWrap'),
  'style.wrapAfter': styleSetter('wrapAfter'),
  'style.wrapBefore': styleSetter('wrapBefore'),
  'style.wrapFlow': styleSetter('wrapFlow'),
  'style.wrapInside': styleSetter('wrapInside'),
  'style.wrapThrough': styleSetter('wrapThrough'),
  'style.writingMode': styleSetter('writingMode'),
  'style.zIndex': styleSetter('zIndex'),
  'style.WebkitTapHighlightColor': function (name, element, value) {
    element.attributes.style.webkitTapHighlightColor = value
  }
}

var TEXT_CONTENT_VANITIES = {
  content: function (name, element, value) {
    element.children = [value + '']
  }
}

function attributeSetter (prop) {
  return function (name, element, value) {
    element.attributes[prop] = value
  }
}

var PRESENTATION_VANITIES = {
  alignmentBaseline: attributeSetter('alignmentBaseline'),
  baselineShift: attributeSetter('baselineShift'),
  clipPath: attributeSetter('clipPath'),
  clipRule: attributeSetter('clipRule'),
  clip: attributeSetter('clip'),
  colorInterpolationFilters: attributeSetter('colorInterpolationFilters'),
  colorInterpolation: attributeSetter('colorInterpolation'),
  colorProfile: attributeSetter('colorProfile'),
  colorRendering: attributeSetter('colorRendering'),
  color: attributeSetter('color'),
  cursor: attributeSetter('cursor'),
  direction: attributeSetter('direction'),
  display: attributeSetter('display'),
  dominantBaseline: attributeSetter('dominantBaseline'),
  enableBackground: attributeSetter('enableBackground'),
  fillOpacity: attributeSetter('fillOpacity'),
  fillRule: attributeSetter('fillRule'),
  fill: attributeSetter('fill'),
  filter: attributeSetter('filter'),
  floodColor: attributeSetter('floodColor'),
  floodOpacity: attributeSetter('floodOpacity'),
  fontFamily: attributeSetter('fontFamily'),
  fontSizeAdjust: attributeSetter('fontSizeAdjust'),
  fontSize: attributeSetter('fontSize'),
  fontStretch: attributeSetter('fontStretch'),
  fontStyle: attributeSetter('fontStyle'),
  fontVariant: attributeSetter('fontVariant'),
  fontWeight: attributeSetter('fontWeight'),
  glyphOrientationHorizontal: attributeSetter('glyphOrientationHorizontal'),
  glyphOrientationVertical: attributeSetter('glyphOrientationVertical'),
  imageRendering: attributeSetter('imageRendering'),
  kerning: attributeSetter('kerning'),
  letterSpacing: attributeSetter('letterSpacing'),
  lightingColor: attributeSetter('lightingColor'),
  markerEnd: attributeSetter('markerEnd'),
  markerMid: attributeSetter('markerMid'),
  markerStart: attributeSetter('markerStart'),
  mask: attributeSetter('mask'),
  opacity: attributeSetter('opacity'),
  overflow: attributeSetter('overflow'),
  pointerEvents: attributeSetter('pointerEvents'),
  shapeRendering: attributeSetter('shapeRendering'),
  stopColor: attributeSetter('stopColor'),
  stopOpacity: attributeSetter('stopOpacity'),
  strokeDasharray: attributeSetter('strokeDasharray'),
  strokeDashoffset: attributeSetter('strokeDashoffset'),
  strokeLinecap: attributeSetter('strokeLinecap'),
  strokeLinejoin: attributeSetter('strokeLinejoin'),
  strokeMiterlimit: attributeSetter('strokeMiterlimit'),
  strokeOpacity: attributeSetter('strokeOpacity'),
  strokeWidth: attributeSetter('strokeWidth'),
  stroke: attributeSetter('stroke'),
  textAnchor: attributeSetter('textAnchor'),
  textDecoration: attributeSetter('textDecoration'),
  textRendering: attributeSetter('textRendering'),
  unicodeBidi: attributeSetter('unicodeBidi'),
  visibility: attributeSetter('visibility'),
  wordSpacing: attributeSetter('wordSpacing'),
  writingMode: attributeSetter('writingMode')
}

var HTML_STYLE_SHORTHAND_VANITIES = {
  backgroundColor: function (name, element, value) {
    element.attributes.style.backgroundColor = value
  },
  zIndex: function (name, element, value) {
    element.attributes.style.zIndex = value
  }
}

var CONTROL_FLOW_VANITIES = {
  // 'controlFlow.if': function (name, element, value) {
  //   // TODO
  // },
  // 'controlFlow.repeat': function (name, element, value) {
  //   // TODO
  // },
  // 'controlFlow.yield': function (name, element, value) {
  //   // TODO
  // },
  'controlFlow.insert': function (name, element, value, context, component) {
    if (value === null || value === undefined) return void 0
    if (typeof value !== 'number') {
      throw new Error('controlFlow.insert expects null or number')
    }
    if (!context.options.children) return void 0
    var children = Array.isArray(context.options.children)
      ? context.options.children
      : [context.options.children]
    var surrogate = children[value]
    if (surrogate === null || surrogate === undefined) return void 0
    // If we are running via a framework adapter, allow that framework to provide its own insert mechanism.
    // This is necessary e.g. in React where their element format needs to be converted into our 'mana' format
    if (context.options.vanities['controlFlow.insert']) {
      context.options.vanities['controlFlow.insert'](
        element,
        surrogate,
        context,
        component,
        controlFlowInsertImpl
      )
    } else {
      controlFlowInsertImpl(element, surrogate, context, component)
    }
  },
  'controlFlow.placeholder': function (
    name,
    element,
    value,
    context,
    component
  ) {
    if (value === null || value === undefined) return void 0
    if (typeof value !== 'number') {
      throw new Error('controlFlow.placeholder expects null or number')
    }
    if (!context.options.children) return void 0
    var children = Array.isArray(context.options.children)
      ? context.options.children
      : [context.options.children]
    var surrogate = children[value]
    if (surrogate === null || surrogate === undefined) return void 0
    // If we are running via a framework adapter, allow that framework to provide its own placeholder mechanism.
    // This is necessary e.g. in React where their element format needs to be converted into our 'mana' format
    if (context.options.vanities['controlFlow.placeholder']) {
      context.options.vanities['controlFlow.placeholder'](
        element,
        surrogate,
        context,
        component,
        controlFlowPlaceholderImpl
      )
    } else {
      controlFlowPlaceholderImpl(element, surrogate, context, component)
    }
  }
}

function controlFlowPlaceholderImpl (element, surrogate, context, component) {
  element.elementName = surrogate.elementName
  element.children = surrogate.children || []
  if (surrogate.attributes) {
    if (!element.attributes) element.attributes = {}
    for (var key in surrogate.attributes) {
      if (key === 'haiku-id') continue
      element.attributes[key] = surrogate.attributes[key]
    }
  }
}

function controlFlowInsertImpl (element, surrogate, context, component) {
  element.children = [surrogate]
}

module.exports = {
  'missing-glyph': has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  a: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES,
    STYLE_VANITIES
  ),
  abbr: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  acronym: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  address: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  altGlyph: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  altGlyphDef: has(),
  altGlyphItem: has(),
  animate: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  animateColor: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  animateMotion: has(),
  animateTransform: has(),
  applet: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  area: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  article: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  aside: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  audio: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  b: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  base: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  basefont: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  bdi: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  bdo: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  big: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  blockquote: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  body: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  br: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  button: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  canvas: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  caption: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  center: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  circle: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  cite: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  clipPath: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  code: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  col: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  colgroup: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  'color-profile': has(),
  command: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  cursor: has(),
  datalist: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dd: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  defs: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  del: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  desc: has(),
  details: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dfn: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  dir: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  discard: has(),
  div: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  dl: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  dt: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  ellipse: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  em: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  embed: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  feBlend: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feColorMatrix: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feComponentTransfer: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feComposite: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feConvolveMatrix: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feDiffuseLighting: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feDisplacementMap: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feDistantLight: has(),
  feDropShadow: has(),
  feFlood: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feFuncA: has(),
  feFuncB: has(),
  feFuncG: has(),
  feFuncR: has(),
  feGaussianBlur: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feImage: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feMerge: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feMergeNode: has(),
  feMorphology: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feOffset: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  fePointLight: has(),
  feSpecularLighting: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  feTile: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  feTurbulence: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  fieldset: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  figcaption: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  figure: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  filter: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  'font-face': has(),
  'font-face-format': has(),
  'font-face-name': has(),
  'font-face-src': has(),
  'font-face-uri': has(),
  font: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES,
    STYLE_VANITIES
  ),
  footer: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  foreignObject: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES
  ),
  form: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  frame: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  frameset: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  g: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  glyph: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  glyphRef: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  h1: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  h2: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  h3: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  h4: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  h5: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  h6: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  hatch: has(),
  hatchpath: has(),
  head: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  header: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  hgroup: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  hkern: has(),
  hr: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  html: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  i: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  iframe: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  image: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  img: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  input: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  ins: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  kbd: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  keygen: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  label: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  legend: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  li: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  line: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  linearGradient: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  link: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  map: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  mark: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  marker: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  mask: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  menu: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  mesh: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  meshgradient: has(),
  meshpatch: has(),
  meshrow: has(),
  meta: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  metadata: has(),
  meter: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  mpath: has(),
  nav: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  noframes: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  noscript: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  object: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ol: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  optgroup: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  option: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  output: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  p: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  param: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  path: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  pattern: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  polygon: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES
  ),
  polyline: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES
  ),
  pre: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  progress: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  q: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  radialGradient: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    PRESENTATION_VANITIES
  ),
  rect: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  rp: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  rt: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  ruby: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  s: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  samp: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  script: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  section: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  select: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  set: has(),
  small: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  solidcolor: has(),
  source: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  span: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  stop: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  strike: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  strong: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  style: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  sub: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  summary: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  sup: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  svg: has(
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES,
    STYLE_VANITIES,
    HTML_STYLE_SHORTHAND_VANITIES
  ),
  switch: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  symbol: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
  table: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  tbody: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  td: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  text: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES
  ),
  textarea: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  textPath: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES
  ),
  tfoot: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  th: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  thead: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  time: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  title: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  tr: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  track: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  tref: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  tspan: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_2D_VANITIES,
    PRESENTATION_VANITIES
  ),
  tt: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  u: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    TEXT_CONTENT_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  ul: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  unknown: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  us: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
  use: has(CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
  var: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
  video: has(
    HTML_STYLE_SHORTHAND_VANITIES,
    CONTROL_FLOW_VANITIES,
    LAYOUT_3D_VANITIES,
    STYLE_VANITIES
  ),
  view: has(),
  vker: has(),
  wb: has(CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES)
}

},{"./../../Layout3D":7}],42:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// Order matters
var REGEXPS = [
  { type: 'whitespace', re: /^[\s]+/ },
  { type: 'paren_open', re: /^\(/ },
  { type: 'paren_close', re: /^\)/ },
  { type: 'square_open', re: /^\[/ },
  { type: 'square_close', re: /^]/ },
  { type: 'curly_open', re: /^\{/ },
  { type: 'curly_close', re: /^\}/ },
  { type: 'rest', re: /^\.\.\./ },
  { type: 'colon', re: /^:/ },
  { type: 'comma', re: /^,/ },
  { type: 'identifier', re: /^[a-zA-Z0-9_$]+/ } // TODO: Include unicode chars
]

function nth (n, type, arr) {
  var none = { value: null, type: 'void' }
  if (arr.length < 1) return none
  if (n > arr.length) return none
  var f = 0
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].type === type) {
      f += 1
    }
    if (f === n) {
      return arr[i]
    }
  }
  return none
}

function tokenize (source) {
  var tokens = []
  var chunk = source
  var total = chunk.length
  var iterations = 0
  while (chunk.length > 0) {
    for (var i = 0; i < REGEXPS.length; i++) {
      var regexp = REGEXPS[i]
      var match = regexp.re.exec(chunk)
      if (match) {
        var value = match[0]
        tokens.push({ type: regexp.type, value: value })
        // Need to slice the chunk at the value match length
        chunk = chunk.slice(match[0].length, chunk.length)
        break
      }
    }
    // We've probably failed to parse correctly if we get here
    if (iterations++ > total) {
      throw new Error('Unable to tokenize expression')
    }
  }
  return tokens
}

function tokensToParams (tokens) {
  if (tokens.length < 1) return []

  // HACK: Rather than property ast-ize this, we're just going to go through it linearly and make JSON.
  var json = ''
  var frag = ''
  var next
  var token = tokens.shift()
  var scopes = []

  while (token) {
    switch (token.type) {
      case 'whitespace':
        frag = ' '
        break
      case 'comma':
        frag = ','
        break
      case 'colon':
        frag = ':'
        break

      // Treat parens as an 'array' scope, e.g. at top level of function signature arguments
      case 'paren_open':
        frag = '['
        scopes.push('square')
        break
      case 'paren_close':
        frag = ']'
        scopes.pop()
        break

      case 'square_open':
        frag = '['
        scopes.push('square')
        break
      case 'square_close':
        frag = ']'
        scopes.pop()
        break

      case 'curly_open':
        frag = '{'
        scopes.push('curly')
        break
      case 'curly_close':
        frag = '}'
        scopes.pop()
        break

      case 'rest':
        next = tokens.shift()
        frag = JSON.stringify({ __rest: next.value })
        break

      case 'identifier':
        frag = '"' + token.value + '"'
        // If the next token is a comma, we are a self-referential property
        if (
          tokens[0] &&
          (tokens[0].type === 'comma' ||
            tokens[0].type === 'square_close' ||
            tokens[0].type === 'curly_close')
        ) {
          // Handle differently inside array vs object, e.g.:
          // { a: a, b: b } vs [ a, b, c ]
          var scope = scopes[scopes.length - 1]
          if (scope === 'square') {
            frag += ''
          } else {
            frag += ':"' + token.value + '"'
          }
        }
        break

      default:
        frag = ''
    }

    json += frag

    token = tokens.shift()
  }

  return JSON.parse(json)
}

function signatureToParams (signature) {
  var tokens = tokenize(signature)
  var clean = []
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'whitespace') {
      clean.push(tokens[i])
    }
  }
  return tokensToParams(clean)
}

function functionToRFO (fn) {
  var str = fn.toString()

  // HACK: Remove paren wrapping if any was provided
  if (str[str.length - 1] === ')') {
    if (str[0] === '(') {
      str = str.slice(1)
    }
  }

  var pidx1 = str.indexOf('(')
  var pidx2 = str.indexOf(')')
  var prefix = str.slice(0, pidx1)
  var signature = str.slice(pidx1, pidx2 + 1)
  var suffix = str.slice(pidx2 + 1, str.length)
  var body = suffix.slice(suffix.indexOf('{') + 1, suffix.length - 1).trim() // Don't include braces or padding
  var type = suffix.match(/^\s*=>\s*{/)
    ? 'ArrowFunctionExpression'
    : 'FunctionExpression'
  var name = nth(2, 'identifier', tokenize(prefix)).value
  var params = signatureToParams(signature)

  var spec = {
    type: type,
    name: name,
    params: params,
    body: body
  }

  return {
    __function: spec
  }
}

module.exports = functionToRFO

},{}],43:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var getElementSize = _dereq_('./getElementSize')
var createRightClickMenu = _dereq_('./createRightClickMenu')
var createMixpanel = _dereq_('./createMixpanel')
var _render = _dereq_('./render')
var _patch = _dereq_('./patch')

var HaikuDOMRenderer = {}

function render (
  domElement,
  virtualContainer,
  virtualTree,
  locator,
  hash,
  options,
  scopes
) {
  return _render(
    domElement,
    virtualContainer,
    virtualTree,
    locator,
    hash,
    options,
    scopes
  )
}

function patch (
  domElement,
  virtualContainer,
  patchesDict,
  locator,
  hash,
  options,
  scopes
) {
  return _patch(
    domElement,
    virtualContainer,
    patchesDict,
    locator,
    hash,
    options,
    scopes
  )
}

function menuize (domElement, playerInstance) {
  createRightClickMenu(domElement, playerInstance)
}

function mixpanel (domElement, mixpanelToken, playerInstance) {
  createMixpanel(domElement, mixpanelToken, playerInstance)
}

function createContainer (domElement) {
  return {
    isContainer: true,
    layout: {
      computed: {
        size: getElementSize(domElement)
      }
    }
  }
}

HaikuDOMRenderer.render = render
HaikuDOMRenderer.patch = patch
HaikuDOMRenderer.menuize = menuize
HaikuDOMRenderer.mixpanel = mixpanel
HaikuDOMRenderer.createContainer = createContainer

module.exports = HaikuDOMRenderer

},{"./createMixpanel":51,"./createRightClickMenu":52,"./getElementSize":56,"./patch":66,"./render":68}],44:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var createTextNode = _dereq_('./createTextNode')
var createTagNode = _dereq_('./createTagNode')
var applyLayout = _dereq_('./applyLayout')
var isTextNode = _dereq_('./isTextNode')

function appendChild (
  alreadyChildElement,
  virtualElement,
  parentDomElement,
  parentVirtualElement,
  locator,
  hash,
  options,
  scopes
) {
  var domElementToInsert
  if (isTextNode(virtualElement, scopes)) {
    domElementToInsert = createTextNode(
      parentDomElement,
      virtualElement,
      options,
      scopes
    )
  } else {
    domElementToInsert = createTagNode(
      parentDomElement,
      virtualElement,
      parentVirtualElement,
      locator,
      hash,
      options,
      scopes
    )
  }

  applyLayout(
    domElementToInsert,
    virtualElement,
    parentDomElement,
    parentVirtualElement,
    options,
    scopes
  )

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild

},{"./applyLayout":45,"./createTagNode":54,"./createTextNode":55,"./isTextNode":63}],45:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var isTextNode = _dereq_('./isTextNode')
var isIE = _dereq_('./isIE')
var isMobile = _dereq_('./isMobile')
var applyCssLayout = _dereq_('./../../layout/applyCssLayout')
var scopeOfElement = _dereq_('./../../layout/scopeOfElement')
var hasPreserve3d = _dereq_('./../../vendor/modernizr').hasPreserve3d

var _window = typeof window !== 'undefined' && window
var PLATFORM_INFO = {
  hasWindow: !!_window,
  isMobile: isMobile(_window), // Dumb navigator check
  isIE: isIE(_window), // Dumb navigator check - use feature detection instead?
  hasPreserve3d: hasPreserve3d(_window) // I dunno if we actually need this
}

console.info('[haiku player] platform info:', JSON.stringify(PLATFORM_INFO))

var DEFAULT_PIXEL_RATIO = 1.0
var SVG = 'svg'
var SVG_RENDERABLES = {
  a: true,
  audio: true,
  canvas: true,
  circle: true,
  ellipse: true,
  foreignObject: true,
  g: true,
  iframe: true,
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
  use: true,
  video: true
}

function applyLayout (
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  options,
  scopes,
  isPatchOperation,
  isKeyDifferent
) {
  if (isTextNode(virtualElement)) return domElement

  if (virtualElement.layout) {
    // Don't assign layout to things that never need it like <desc>, <title>, etc.
    // Check if we're inside an <svg> context *and* one of the actually renderable svg-type els
    if (
      scopeOfElement(virtualElement) === SVG &&
      !SVG_RENDERABLES[virtualElement.elementName]
    ) {
      return domElement
    }

    if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
      _warnOnce(
        'Cannot compute layout without parent computed size (child: <' +
          virtualElement.elementName +
          '>; parent: <' +
          parentVirtualElement.elementName +
          '>)'
      )
      return domElement
    }

    var devicePixelRatio =
      (options && options.devicePixelRatio) || DEFAULT_PIXEL_RATIO
    var computedLayout = virtualElement.layout.computed

    // No computed layout means the el is not shown
    if (!computedLayout || computedLayout.invisible) {
      if (domElement.style.display !== 'none') {
        domElement.style.display = 'none'
      }
    } else {
      if (domElement.style.display !== 'block') {
        domElement.style.display = 'block'
      }
      options.platform = PLATFORM_INFO
      applyCssLayout(
        domElement,
        virtualElement,
        virtualElement.layout,
        computedLayout,
        devicePixelRatio,
        options,
        scopes
      )
    }
  }

  return domElement
}

var warnings = {}

function _warnOnce (warning) {
  if (warnings[warning]) return void 0
  warnings[warning] = true
  console.warn('[haiku player] warning:', warning)
}

module.exports = applyLayout

},{"./../../layout/applyCssLayout":32,"./../../layout/scopeOfElement":39,"./../../vendor/modernizr":126,"./isIE":60,"./isMobile":61,"./isTextNode":63}],46:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var assignStyle = _dereq_('./assignStyle')
var assignClass = _dereq_('./assignClass')
var assignEvent = _dereq_('./assignEvent')

var STYLE = 'style'
var OBJECT = 'object'
var FUNCTION = 'function'
var CLASS = 'class'
var CLASS_NAME = 'className'

var XLINK_XMLNS = 'http://www.w3.org/1999/xlink'

function setAttribute (el, key, val, options, scopes) {
  if (key.slice(0, 5) === 'xlink') {
    var ns = XLINK_XMLNS
    var p0 = el.getAttributeNS(ns, key)
    if (p0 !== val) el.setAttributeNS(ns, key, val)
  } else {
    var p1 = el.getAttribute(key)
    if (p1 !== val) el.setAttribute(key, val)
  }
}

function assignAttributes (
  domElement,
  attributes,
  options,
  scopes,
  isPatchOperation,
  isKeyDifferent
) {
  if (!isPatchOperation) {
    // Remove any attributes from the previous run that aren't present this time around
    if (domElement.haiku && domElement.haiku.element) {
      for (var oldKey in domElement.haiku.element.attributes) {
        var oldValue = domElement.haiku.element.attributes[oldKey]
        var newValue = attributes[oldKey]
        if (oldKey !== STYLE) {
          // Removal of old styles is handled downstream; see assignStyle()
          if (
            newValue === null ||
            newValue === undefined ||
            oldValue !== newValue
          ) {
            domElement.removeAttribute(oldKey)
          }
        }
      }
    }
  }

  for (var key in attributes) {
    var anotherNewValue = attributes[key]

    if (key === STYLE && anotherNewValue && typeof anotherNewValue === OBJECT) {
      assignStyle(
        domElement,
        anotherNewValue,
        options,
        scopes,
        isPatchOperation
      )
      continue
    }

    if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
      assignClass(domElement, anotherNewValue, options, scopes)
      continue
    }

    var lower = key.toLowerCase()
    // 'onclick', etc
    if (
      lower[0] === 'o' &&
      lower[1] === 'n' &&
      typeof anotherNewValue === FUNCTION
    ) {
      assignEvent(domElement, lower, anotherNewValue, options, scopes)
      continue
    }

    setAttribute(domElement, key, anotherNewValue, options, scopes)
  }
  return domElement
}

module.exports = assignAttributes

},{"./assignClass":47,"./assignEvent":48,"./assignStyle":49}],47:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function assignClass (domElement, className, options, scopes) {
  if (domElement.className !== className) {
    domElement.className = className
  }
  return domElement
}

module.exports = assignClass

},{}],48:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var attachEventListener = _dereq_('./attachEventListener')

function assignEvent (
  domElement,
  lowerCaseName,
  listenerFunction,
  options,
  scopes
) {
  if (!domElement.haiku) {
    domElement.haiku = {}
  }
  if (!domElement.haiku.listeners) {
    domElement.haiku.listeners = {}
  }
  if (!domElement.haiku.listeners[lowerCaseName]) {
    domElement.haiku.listeners[lowerCaseName] = []
  }

  var already = false
  for (var i = 0; i < domElement.haiku.listeners[lowerCaseName].length; i++) {
    var existing = domElement.haiku.listeners[lowerCaseName][i]
    if (existing._haikuListenerId === listenerFunction._haikuListenerId) {
      already = true
      break
    }
  }

  if (!already) {
    listenerFunction._haikuListenerId = Math.random() + ''
    domElement.haiku.listeners[lowerCaseName].push(listenerFunction)
    attachEventListener(
      domElement,
      lowerCaseName,
      listenerFunction,
      options,
      scopes
    )
  }
}

module.exports = assignEvent

},{"./attachEventListener":50}],49:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function assignStyle (domElement, style, options, scopes, isPatchOperation) {
  if (!domElement.__haikuExplicitStyles) domElement.__haikuExplicitStyles = {}

  if (!isPatchOperation) {
    // If we have an element from a previous run, remove any old styles that aren't part of the new one
    if (
      domElement.haiku &&
      domElement.haiku.element &&
      domElement.haiku.element.attributes &&
      domElement.haiku.element.attributes.style
    ) {
      for (var oldStyleKey in domElement.haiku.element.attributes.style) {
        var newStyleValue = style[oldStyleKey]
        if (newStyleValue === null || newStyleValue === undefined) {
          domElement.style[oldStyleKey] = null
        }
      }
    }
  }

  for (var key in style) {
    var newProp = style[key]
    var previousProp = domElement.style[key]
    if (previousProp !== newProp) {
      domElement.__haikuExplicitStyles[key] = true
      domElement.style[key] = style[key]
    }
  }
  return domElement
}

module.exports = assignStyle

},{}],50:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = function attachEventListener (
  domElement,
  lowercaseName,
  listener,
  options,
  scopes
) {
  var eventName = lowercaseName.slice(2) // Assumes 'on*' prefix

  // FF doesn't like it if this isn't a function... this can happen if bad props are passed upstream
  if (typeof listener === 'function') {
    domElement.addEventListener(eventName, listener)
  }
}

},{}],51:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var assign = _dereq_('./../../vendor/assign')
var Mixpanel = _dereq_('./../../vendor/mixpanel-browser/tiny')

module.exports = function createMixpanel (domElement, mixpanelToken, component) {
  var mixpanel = Mixpanel()

  if (!mixpanel) {
    console.warn('[haiku player] mixpanel could not be initialized')
  }

  mixpanel.init(mixpanelToken, domElement)

  // Why not expose this so others, e.g. the share page, can hook into it?
  component.mixpanel = {
    // A little wrapper that makes sure the bytecode's metadata passes through with whatever else we passed
    track: function track (eventName, eventProperties) {
      var metadata = (component._bytecode && component._bytecode.metadata) || {}
      mixpanel.track(
        eventName,
        assign(
          {
            platform: 'dom'
          },
          metadata,
          eventProperties
        )
      )
    }
  }

  component.on('haikuComponentDidInitialize', function () {
    component.mixpanel.track('component:initialize')
  })
}

},{"./../../vendor/assign":75,"./../../vendor/mixpanel-browser/tiny":125}],52:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var MENU_GLOBAL_ID = 'haiku-right-click-menu'
var WIDTH = 167
var HEIGHT = 44

var haikuIcon =
  '' +
  '<svg style="transform:translateY(3px);margin-right:3px;" width="13px" height="13px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
  '    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
  '        <g id="menu" transform="translate(-9.000000, -50.000000)" fill-rule="nonzero" fill="#899497">' +
  '            <g id="favicon" transform="translate(9.000000, 50.000000)">' +
  '                <path d="M5.74649098,4.70558699 L5.74649098,5.7788098 C5.74649098,5.91256161 5.63820821,6.02098888 5.50463465,6.02098888 C5.46594093,6.02098888 5.42936949,6.0118902 5.39693775,5.99571295 C5.39186133,5.99396865 5.38680829,5.99204493 5.38178599,5.98993877 L2.13374851,4.62783436 C2.06585827,4.62681598 2.00074372,4.59703732 1.95556434,4.54557114 C1.89645814,4.50141795 1.85818531,4.43085101 1.85818531,4.35133305 L1.85818531,1.57454768 C1.85079926,1.56515108 1.8440022,1.55516354 1.83787126,1.54461783 L1.68370002,1.48221012 L0.983781643,1.19888682 L0.983781643,7.82711613 L1.85818531,8.18107016 L1.85818531,5.95344076 C1.85818531,5.94997543 1.858258,5.94652709 1.85840193,5.9430972 C1.85672094,5.90820764 1.86258618,5.87240498 1.87695925,5.83803981 C1.92855792,5.7146704 2.07026431,5.65654454 2.19346932,5.70821207 L5.45803735,7.07733924 L5.52116709,7.10578612 C5.64702981,7.11429403 5.74649098,7.21922045 5.74649098,7.34740828 L5.74649098,7.82711613 L6.61247795,8.17766313 L6.62089465,8.18107016 L6.62089465,4.31849373 L5.74649098,4.70558699 Z M5.26277832,4.81941585 L3.49887951,4.07970322 L2.78717926,4.37673832 L5.26277832,5.41491119 L5.26277832,4.81941585 Z M2.34189798,6.29557771 L2.34189798,8.21792436 L3.21630165,7.86397033 L3.21630165,6.66226962 L2.34189798,6.29557771 Z M2.10489107,8.84091277 C2.10327842,8.84094453 2.10166189,8.84096049 2.10004164,8.84096049 C2.03531005,8.84096049 1.97651801,8.81549628 1.93311099,8.77402594 L1.68370002,8.67306569 L0.701593132,8.27551396 C0.587217854,8.25628853 0.500068976,8.15667879 0.500068976,8.03668718 L0.500068976,8.02395302 C0.499977217,8.01997372 0.499976799,8.01598483 0.500068976,8.01198924 L0.500068976,0.83309739 C0.499984517,0.829434725 0.499977444,0.825763881 0.500048734,0.822087163 C0.499977444,0.818410445 0.499984517,0.814739601 0.500068976,0.811076936 L0.500068976,0.808477267 C0.500068976,0.734695385 0.533019284,0.66861973 0.584988773,0.624200019 C0.607223642,0.603893466 0.633376716,0.587129584 0.662911804,0.575173935 L2.00126808,0.0334143141 C2.06884262,-0.00448997495 2.15253254,-0.011953956 2.22949057,0.0203769852 L3.48533098,0.547969766 C3.4886593,0.547833737 3.49200497,0.54776506 3.49536665,0.54776506 C3.62894021,0.54776506 3.73722298,0.656192325 3.73722298,0.789944134 L3.73722298,0.821385651 C3.73731302,0.82532856 3.73731342,0.829280598 3.73722298,0.833238872 L3.73722298,2.40767185 L5.26277832,1.79239207 L5.26277832,0.83309739 C5.26269386,0.829434725 5.26268678,0.825763881 5.26275807,0.822087163 C5.26268678,0.818410445 5.26269386,0.814739601 5.26277832,0.811076936 L5.26277832,0.789944134 C5.26277832,0.660231597 5.36461961,0.55433711 5.49260447,0.548059437 L6.76397742,0.0334143141 C6.83155196,-0.00448997495 6.91524188,-0.011953956 6.99219991,0.0203769852 L8.30051205,0.570013732 C8.41385044,0.590099999 8.49993232,0.689222468 8.49993232,0.808477267 L8.49993232,0.821385589 C8.50002236,0.825328562 8.50002276,0.829280602 8.49993232,0.833238878 L8.49993232,8.03668718 C8.49993232,8.12601922 8.45162927,8.20405443 8.37974945,8.24603352 C8.3570412,8.26726508 8.33012837,8.28475773 8.2996029,8.29711428 L6.99757749,8.82416735 C6.91291064,8.85844005 6.82080599,8.84496071 6.75103698,8.79637735 L6.41724228,8.661259 L5.42562114,8.25985596 C5.34756383,8.22825877 5.29312904,8.1630773 5.27221467,8.08767347 C5.26662904,8.06827265 5.26340051,8.04787145 5.26285962,8.02680084 C5.26269203,8.02187767 5.26266414,8.01693859 5.26277832,8.01198924 L5.26277832,7.52049562 L5.25953529,7.51903428 L5.26277832,7.51181809 L5.26277832,7.52048475 L3.70001431,6.86512047 L3.70001431,8.03470119 C3.70001431,8.04191065 3.69969971,8.04904653 3.6990835,8.05609582 C3.69873979,8.1589341 3.63726868,8.25619133 3.53617314,8.29711428 L2.23486815,8.82387573 C2.19216118,8.84116329 2.14756179,8.84630123 2.10489107,8.84091277 Z M7.10460732,8.21821598 L8.01621965,7.84920008 L8.01621965,1.21243815 L7.10460732,1.58145405 L7.10460732,2.39098426 C7.10460732,2.46741667 7.06924708,2.53557924 7.0140137,2.5799642 C6.98940081,2.61105066 6.95679973,2.63650623 6.91764171,2.65284921 L4.12647169,3.81777145 L5.37396115,4.34092148 L6.74176427,3.73540324 C6.86393122,3.68132067 7.00675126,3.73664611 7.06076176,3.85897608 C7.06205348,3.86190175 7.06328271,3.86483924 7.06445002,3.86778706 C7.08982637,3.90609857 7.10460732,3.95205809 7.10460732,4.00147448 L7.10460732,8.21821598 Z M6.62089465,1.57454768 C6.6135086,1.56515108 6.60671153,1.55516354 6.6005806,1.54461783 L6.44640936,1.48221012 L5.74649098,1.19888682 L5.74649098,1.76114471 L6.62089465,2.11509874 L6.62089465,1.57454768 Z M2.34189798,4.03783399 L3.25351031,3.65736362 L3.25351031,1.21243815 L2.34189798,1.58145405 L2.34189798,4.03783399 Z M3.73722298,2.92984272 L3.73722298,3.45548138 L6.10302085,2.46809239 L5.50003848,2.22400828 C5.49794123,2.22315933 5.49586104,2.22228613 5.49379809,2.22138914 L3.73722298,2.92984272 Z M6.20555471,0.822087163 L6.64164504,0.998614246 L6.89809383,1.10242338 L7.57200867,0.829626174 L6.89232837,0.544084781 L6.20555471,0.822087163 Z M1.44284537,0.822087163 L1.8789357,0.998614246 L2.13538449,1.10242338 L2.80929933,0.829626174 L2.12961903,0.544084781 L1.44284537,0.822087163 Z" id="Combined-Shape"></path>' +
  '            </g>' +
  '        </g>' +
  '    </g>' +
  '</svg>'

var sharePageIcon =
  '' +
  '<svg style="transform:translate(-1px, 3px);margin-right:3px;" width="14px" height="14px" viewBox="0 0 11 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
  '  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
  '      <g id="menu" transform="translate(-8.000000, -32.000000)">' +
  '          <g id="0884-focus" transform="translate(8.500000, 32.000000)">' +
  '              <rect id="Rectangle-3" fill="#899497" x="4.72222222" y="0" width="1" height="1.66666667" rx="0.5"></rect>' +
  '              <rect id="Rectangle-3-Copy" fill="#899497" x="4.72222222" y="8.33333333" width="1" height="1.66666667" rx="0.5"></rect>' +
  '              <g id="Group" transform="translate(5.000000, 5.555556) rotate(90.000000) translate(-5.000000, -5.555556) translate(3.888889, 0.555556)" fill="#899497">' +
  '                  <rect id="Rectangle-3-Copy-3" x="0.277777778" y="0" width="1" height="1.66666667" rx="0.5"></rect>' +
  '                  <rect id="Rectangle-3-Copy-2" x="0.277777778" y="8.33333333" width="1" height="1.66666667" rx="0.5"></rect>' +
  '              </g>' +
  '              <circle id="Oval" stroke="#899497" stroke-width="0.66" cx="5" cy="5" r="3.33333333"></circle>' +
  '              <circle id="Oval-2" fill="#899497" cx="5" cy="5" r="1.11111111"></circle>' +
  '          </g>' +
  '      </g>' +
  '  </g>' +
  '</svg>'

// Haiku servers will substitute the _actual_ full string in any js file,
// so it's split into pieces here to avoid that build step
var SUBSTITUTION_STRING = 'HAIKU' + '_' + 'SHARE' + '_' + 'UUID'

function setBoxShadow (el, color) {
  el.style['-webkit-box-shadow'] = '0 1px 4px 0 ' + color
  el.style['-moz-box-shadow'] = '0 1px 4px 0 ' + color
  el.style['box-shadow'] = '0 1px 4px 0 ' + color
}

function px (num) {
  return num + 'px'
}

function findOrCreateMenuElement (doc) {
  var menu = doc.getElementById(MENU_GLOBAL_ID)
  if (menu) return menu
  menu = doc.createElement('div')
  menu.setAttribute('id', MENU_GLOBAL_ID)
  menu.style.position = 'absolute'
  menu.style.zIndex = 2147483647
  setBoxShadow(menu, 'rgba(10,2,21,0.25)')
  menu.style.borderRadius = px(3)
  menu.style.display = 'none'
  menu.style.backgroundColor = 'rgba(255,255,255,0.95)'
  menu.style.overflow = 'hidden'
  menu.style.cursor = 'default'
  menu.style.fontFamily = 'Helvetica, Arial, sans-serif'
  menu.style.fontWeight = 'Bold'
  menu.style.fontSize = px(10)
  menu.style.padding = '0 0 7px'
  menu.style.color = 'black'
  menu.style.margin = '0'
  menu.style.boxSizing = 'content-box'
  menu.style.textDecoration = 'none'
  menu.style.fontStyle = 'none'
  doc.body.appendChild(menu)
  return menu
}

function truncate (str, len) {
  if (str.length > len) {
    return str.slice(0, len - 3) + '...'
  }
  return str
}

module.exports = function createRightClickMenu (domElement, component) {
  var doc = domElement.ownerDocument
  var menu = findOrCreateMenuElement(doc)

  var escaper = doc.createElement('textarea')
  function escapeHTML (html) {
    escaper.textContent = html
    return escaper.innerHTML.replace(/[><,{}[\]"']/gi, '')
  }

  // revealMenu(100,100) // Uncomment me to render the menu while testing

  function revealMenu (mx, my) {
    var lines = []
    var titleLine = null

    var metadata = component._bytecode && component._bytecode.metadata

    if (metadata && metadata.project) {
      var who = truncate(escapeHTML(metadata.project), 25)
      var org = ''
      if (metadata.organization) {
        org = truncate(escapeHTML(metadata.organization), 11)
        who = '"' + who + '" <span style="font-weight:normal;">by</span> ' + org
      }
      var byline = who
      titleLine =
        '<p style="margin:0;margin-bottom:4px;padding:12px 0 7px;line-height:12px;text-align:center;border-bottom:1px solid rgba(140,140,140,.14);">' +
        byline +
        '</p>'
    }
    if (metadata && metadata.uuid && metadata.uuid !== SUBSTITUTION_STRING) {
      lines.push(
        '<a onMouseOver="this.style.backgroundColor=\'rgba(140,140,140,.07)\'" onMouseOut="this.style.backgroundColor=\'transparent\'" style="display:block;color:black;text-decoration:none;padding: 5px 13px;line-height:12px;" href="https://share.haiku.ai/' +
          escapeHTML(metadata.uuid) +
          '" target="_blank">' +
          sharePageIcon +
          '  View Component</a>'
      )
    }
    lines.push(
      '<a onMouseOver="this.style.backgroundColor=\'rgba(140,140,140,.07)\'" onMouseOut="this.style.backgroundColor=\'transparent\'" style="display:block;color:black;text-decoration:none;padding: 5px 13px;line-height:12px;" href="https://www.haiku.ai" target="_blank">' +
        haikuIcon +
        '  Crafted in Haiku</a>'
    )

    if (lines.length < 1) return void ''

    HEIGHT = lines.length > 1 ? 88 : 61
    HEIGHT = titleLine ? HEIGHT : 22

    menu.style.width = px(WIDTH)
    menu.style.height = px(HEIGHT)
    menu.style.top = px(my)
    menu.style.left = px(mx)
    menu.style.pointerEvents = 'auto'
    menu.style.display = 'block'
    menu.innerHTML = titleLine ? titleLine + lines.join('\n') : lines.join('\n')
  }

  function hideMenu () {
    menu.style.width = px(0)
    menu.style.height = px(0)
    menu.style.top = px(0)
    menu.style.left = px(0)
    menu.style.pointerEvents = 'none'
    menu.style.display = 'none'
  }

  domElement.addEventListener('contextmenu', function (contextmenuEvent) {
    contextmenuEvent.preventDefault()

    var mx = contextmenuEvent.pageX
    var my = contextmenuEvent.pageY

    if (component.mixpanel) {
      component.mixpanel.track('component:contextmenu')
    }

    revealMenu(mx, my)
  })

  doc.addEventListener('click', hideMenu)
}

},{}],53:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function createSvgElement (domElement, tagName, options, scopes) {
  return domElement.ownerDocument.createElementNS(SVG_NAMESPACE, tagName)
}

module.exports = createSvgElement

},{}],54:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var normalizeName = _dereq_('./normalizeName')
var isSvgElementName = _dereq_('./isSvgElementName')
var getTypeAsString = _dereq_('./getTypeAsString')

function createTagNode (
  domElement,
  virtualElement,
  parentVirtualElement,
  locator,
  hash,
  options,
  scopes
) {
  var tagName = normalizeName(getTypeAsString(virtualElement))
  var newDomElement
  if (isSvgElementName(tagName, scopes)) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName, options, scopes)
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName)
  }

  newDomElement.haiku = {}

  var incomingKey =
    virtualElement.key ||
    (virtualElement.attributes && virtualElement.attributes.key)
  if (incomingKey !== undefined && incomingKey !== null) {
    newDomElement.haiku.key = incomingKey
  }

  updateElement(
    newDomElement,
    virtualElement,
    domElement,
    parentVirtualElement,
    locator,
    hash,
    options,
    scopes
  )
  return newDomElement
}

module.exports = createTagNode

var createSvgElement = _dereq_('./createSvgElement')
var updateElement = _dereq_('./updateElement')

},{"./createSvgElement":53,"./getTypeAsString":57,"./isSvgElementName":62,"./normalizeName":65,"./updateElement":72}],55:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function createTextNode (domElement, textContent, options, scopes) {
  return domElement.ownerDocument.createTextNode(textContent)
}

module.exports = createTextNode

},{}],56:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function getElementSize (domElement) {
  var x
  var y
  if (domElement.offsetWidth === undefined) {
    var rect = domElement.getBoundingClientRect()
    x = rect.width
    y = rect.height
  } else {
    x = domElement.offsetWidth
    y = domElement.offsetHeight
  }
  return {
    x: x,
    y: y
  }
}

module.exports = getElementSize

},{}],57:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var STRING = 'string'
var FUNCTION = 'function'

function getType (virtualElement) {
  var typeValue = virtualElement.elementName
  if (typeValue && typeValue.default) return typeValue.default
  return typeValue
}

function thingToTagName (thing) {
  if (typeof thing === STRING && thing.length > 0) return thing
  if (typeof thing === FUNCTION) return fnToTagName(thing)
  _warnOnce('Got blank/malformed virtual element object; falling back to <div>')
  return 'div'
}

function fnToTagName (fn) {
  if (fn.name) return fn.name
  if (fn.displayName) return fn.displayName
  if (fn.constructor) {
    if (fn.constructor.name !== 'Function') {
      return fn.constructor.name
    }
  }
}

function getTypeAsString (virtualElement) {
  var typeValue = getType(virtualElement)
  typeValue = thingToTagName(typeValue)
  if (!typeValue) throw new Error('Node has no discernable name')
  return typeValue
}

var warnings = {}
function _warnOnce (warning) {
  if (warnings[warning]) return void 0
  warnings[warning] = true
  console.warn('[haiku player] warning:', warning)
}

module.exports = getTypeAsString

},{}],58:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = _dereq_('./HaikuDOMRenderer')

},{"./HaikuDOMRenderer":43}],59:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function isBlankString (thing) {
  return thing === ''
}

module.exports = isBlankString

},{}],60:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = function isIE (window) {
  if (!window) return false
  if (!window.navigator) return false
  if (!window.navigator.userAgent) return false
  return (
    window.navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident') > 0
  )
}

},{}],61:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

module.exports = function isMobile (window) {
  if (!window) return false
  if (!window.navigator) return false
  if (!window.navigator.userAgent) return false
  return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
}

},{}],62:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var svgElementNames = _dereq_('./../../helpers/allSvgElementNames')

function isSvgElementName (tagName, scopes) {
  return svgElementNames.indexOf(tagName) !== -1
}

module.exports = isSvgElementName

},{"./../../helpers/allSvgElementNames":16}],63:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function isTextNode (virtualElement, scopes) {
  return typeof virtualElement === 'string'
}

module.exports = isTextNode

},{}],64:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function locatorBump (locator, index) {
  return locator + '.' + index
}

module.exports = locatorBump

},{}],65:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function normalizeName (tagName) {
  if (tagName[0] === tagName[0].toUpperCase()) tagName = tagName + '-component'
  return tagName
}

module.exports = normalizeName

},{}],66:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var updateElement = _dereq_('./updateElement')

function getElementByFlexId (topLevelDomElement, flexId, scopes) {
  if (!scopes.elementCache) scopes.elementCache = {}
  if (scopes.elementCache[flexId]) return scopes.elementCache[flexId]
  var attrSelector = '[haiku-id="' + flexId + '"]'
  var elByHaikuId = topLevelDomElement.ownerDocument.querySelector(attrSelector)
  if (elByHaikuId) {
    scopes.elementCache[flexId] = elByHaikuId
    return scopes.elementCache[flexId]
  }
  var elById = topLevelDomElement.ownerDocument.getElementById(flexId)
  if (elById) {
    scopes.elementCache[flexId] = elById
    return scopes.elementCache[flexId]
  }
}

function patch (
  topLevelDomElement,
  virtualContainer,
  patchesDict,
  locator,
  hash,
  options,
  scopes
) {
  if (Object.keys(patchesDict) < 1) {
    return topLevelDomElement
  }

  for (var flexId in patchesDict) {
    var virtualElement = patchesDict[flexId]

    if (virtualElement && options.modifier) {
      var virtualReplacement = options.modifier(virtualElement)
      if (virtualReplacement !== undefined) {
        virtualElement = virtualReplacement
      }
    }

    var domElement = getElementByFlexId(topLevelDomElement, flexId, scopes)
    if (domElement) {
      updateElement(
        domElement,
        virtualElement,
        domElement.parentNode,
        virtualElement.__parent,
        domElement.haiku.locator,
        hash,
        options,
        scopes,
        true
      )
    }
  }
}

module.exports = patch

},{"./updateElement":72}],67:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function removeElement (domElement, hash, options, scopes) {
  domElement.parentNode.removeChild(domElement)
  return domElement
}

module.exports = removeElement

},{}],68:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var renderTree = _dereq_('./renderTree')

function render (
  domElement,
  virtualContainer,
  virtualTree,
  locator,
  hash,
  options,
  scopes
) {
  return renderTree(
    domElement,
    virtualContainer,
    [virtualTree],
    locator,
    hash,
    options,
    scopes
  )
}

module.exports = render

},{"./renderTree":69}],69:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var isBlankString = _dereq_('./isBlankString')
var removeElement = _dereq_('./removeElement')
var locatorBump = _dereq_('./locatorBump')

function _cloneVirtualElement (virtualElement) {
  return {
    elementName: virtualElement.elementName,
    attributes: _cloneAttributes(virtualElement.attributes),
    children: virtualElement.children
  }
}

function _cloneAttributes (attributes) {
  if (!attributes) return {}
  var clone = {}
  for (var key in attributes) {
    clone[key] = attributes[key]
  }
  return clone
}

function renderTree (
  domElement,
  virtualElement,
  virtualChildren,
  locator,
  hash,
  options,
  scopes,
  isPatchOperation
) {
  hash[locator] = domElement

  if (!domElement.haiku) domElement.haiku = {}
  domElement.haiku.locator = locator

  // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
  domElement.haiku.element = _cloneVirtualElement(virtualElement)

  if (!Array.isArray(virtualChildren)) {
    return domElement
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift()
  }

  var max = virtualChildren.length
  if (max < domElement.childNodes.length) max = domElement.childNodes.length

  for (var i = 0; i < max; i++) {
    var virtualChild = virtualChildren[i]
    var domChild = domElement.childNodes[i]
    var sublocator = locatorBump(locator, i)

    if (virtualChild && options.modifier) {
      var virtualReplacement = options.modifier(virtualChild)
      if (virtualReplacement !== undefined) {
        virtualChild = virtualReplacement
      }
    }

    if (!virtualChild && !domChild) {
      continue
    } else if (!virtualChild && domChild) {
      removeElement(domChild, hash, options, scopes)
      delete hash[sublocator]
    } else if (virtualChild && !domChild) {
      var insertedElement = appendChild(
        null,
        virtualChild,
        domElement,
        virtualElement,
        sublocator,
        hash,
        options,
        scopes
      )
      hash[sublocator] = insertedElement
    } else {
      if (!domChild.haiku) domChild.haiku = {}
      domChild.haiku.locator = sublocator

      if (!domChild.haiku.element) {
        // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
        domChild.haiku.element = _cloneVirtualElement(virtualChild)
      }

      updateElement(
        domChild,
        virtualChild,
        domElement,
        virtualElement,
        sublocator,
        hash,
        options,
        scopes,
        isPatchOperation
      )
    }
  }

  return domElement
}

module.exports = renderTree

var appendChild = _dereq_('./appendChild')
var updateElement = _dereq_('./updateElement')

},{"./appendChild":44,"./isBlankString":59,"./locatorBump":64,"./removeElement":67,"./updateElement":72}],70:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyLayout = _dereq_('./applyLayout')
var isTextNode = _dereq_('./isTextNode')

function replaceElement (
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  locator,
  hash,
  options,
  scopes
) {
  var newElement
  if (isTextNode(virtualElement)) {
    newElement = createTextNode(domElement, virtualElement, options, scopes)
  } else {
    newElement = createTagNode(
      domElement,
      virtualElement,
      parentVirtualElement,
      locator,
      hash,
      options,
      scopes
    )
  }

  applyLayout(
    newElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    options,
    scopes
  )

  parentDomNode.replaceChild(newElement, domElement)
  return newElement
}

module.exports = replaceElement

var createTextNode = _dereq_('./createTextNode')
var createTagNode = _dereq_('./createTagNode')

},{"./applyLayout":45,"./createTagNode":54,"./createTextNode":55,"./isTextNode":63}],71:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var createTextNode = _dereq_('./createTextNode')

function replaceElementWithText (domElement, textContent, options, scopes) {
  if (domElement) {
    if (domElement.textContent !== textContent) {
      var parentNode = domElement.parentNode
      var textNode = createTextNode(domElement, textContent, options, scopes)
      parentNode.replaceChild(textNode, domElement)
    }
  }
  return domElement
}

module.exports = replaceElementWithText

},{"./createTextNode":55}],72:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyLayout = _dereq_('./applyLayout')
var assignAttributes = _dereq_('./assignAttributes')
var isSvgElementName = _dereq_('./isSvgElementName')
var getTypeAsString = _dereq_('./getTypeAsString')

var OBJECT = 'object'

function updateElement (
  domElement,
  virtualElement,
  parentNode,
  parentVirtualElement,
  locator,
  hash,
  options,
  scopes,
  isPatchOperation
) {
  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement, scopes)) {
    replaceElementWithText(domElement, virtualElement, options, scopes)
    return virtualElement
  }

  if (!domElement.haiku) domElement.haiku = {}

  var domTagName = domElement.tagName.toLowerCase().trim()
  var elName = normalizeName(getTypeAsString(virtualElement))
  var virtualElementTagName = elName.toLowerCase().trim()
  var incomingKey =
    virtualElement.key ||
    (virtualElement.attributes && virtualElement.attributes.key)
  var existingKey = domElement.haiku && domElement.haiku.key
  var isKeyDifferent =
    incomingKey !== null &&
    incomingKey !== undefined &&
    incomingKey !== existingKey

  if (domTagName !== virtualElementTagName) {
    return replaceElement(
      domElement,
      virtualElement,
      parentNode,
      parentVirtualElement,
      locator,
      hash,
      options,
      scopes
    )
  }

  if (isKeyDifferent) {
    return replaceElement(
      domElement,
      virtualElement,
      parentNode,
      parentVirtualElement,
      locator,
      hash,
      options,
      scopes
    )
  }

  if (isSvgElementName(elName, scopes)) {
    updateSvgElement(
      domElement,
      elName,
      virtualElement.attributes,
      virtualElement.children,
      virtualElement,
      parentNode,
      parentVirtualElement,
      locator,
      hash,
      options,
      scopes,
      isPatchOperation,
      isKeyDifferent
    )
    if (incomingKey !== undefined && incomingKey !== null) {
      domElement.haiku.key = incomingKey
    }
    return domElement
  }

  if (
    virtualElement.attributes &&
    typeof virtualElement.attributes === OBJECT
  ) {
    assignAttributes(
      domElement,
      virtualElement.attributes,
      options,
      scopes,
      isPatchOperation,
      isKeyDifferent
    )
  }
  applyLayout(
    domElement,
    virtualElement,
    parentNode,
    parentVirtualElement,
    options,
    scopes,
    isPatchOperation,
    isKeyDifferent
  )
  if (incomingKey !== undefined && incomingKey !== null) {
    domElement.haiku.key = incomingKey
  }

  if (Array.isArray(virtualElement.children)) {
    renderTree(
      domElement,
      virtualElement,
      virtualElement.children,
      locator,
      hash,
      options,
      scopes,
      isPatchOperation
    )
  } else if (!virtualElement.children) {
    // In case of falsy virtual children, we still need to remove elements that were already there
    renderTree(
      domElement,
      virtualElement,
      [],
      locator,
      hash,
      options,
      scopes,
      isPatchOperation
    )
  }

  return domElement
}

module.exports = updateElement

var renderTree = _dereq_('./renderTree')
var updateSvgElement = _dereq_('./updateSvgElement')
var replaceElementWithText = _dereq_('./replaceElementWithText')
var replaceElement = _dereq_('./replaceElement')
var normalizeName = _dereq_('./normalizeName')
var isTextNode = _dereq_('./isTextNode')

},{"./applyLayout":45,"./assignAttributes":46,"./getTypeAsString":57,"./isSvgElementName":62,"./isTextNode":63,"./normalizeName":65,"./renderTree":69,"./replaceElement":70,"./replaceElementWithText":71,"./updateSvgElement":73}],73:[function(_dereq_,module,exports){
/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyLayout = _dereq_('./applyLayout')
var assignAttributes = _dereq_('./assignAttributes')

var OBJECT = 'object'

function updateSvgElement (
  svgDomElement,
  elementName,
  attributes,
  virtualChildren,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  locator,
  hash,
  options,
  scopes,
  isPatchOperation,
  isKeyDifferent
) {
  if (attributes && typeof attributes === OBJECT) {
    assignAttributes(
      svgDomElement,
      attributes,
      options,
      scopes,
      isPatchOperation,
      isKeyDifferent
    )
  }
  applyLayout(
    svgDomElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    options,
    scopes,
    isPatchOperation,
    isKeyDifferent
  )
  if (Array.isArray(virtualChildren)) {
    renderTree(
      svgDomElement,
      virtualElement,
      virtualChildren,
      locator,
      hash,
      options,
      scopes,
      isPatchOperation
    )
  }
}

module.exports = updateSvgElement

var renderTree = _dereq_('./renderTree')

},{"./applyLayout":45,"./assignAttributes":46,"./renderTree":69}],74:[function(_dereq_,module,exports){
function uniq (arr) {
  var len = arr.length
  var i = -1
  while (i++ < len) {
    var j = i + 1
    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice(j--, 1)
      }
    }
  }
  return arr
}

function immutable (arr) {
  var arrayLength = arr.length
  var newArray = new Array(arrayLength)
  for (var i = 0; i < arrayLength; i++) {
    newArray[i] = arr[i]
  }
  return uniq(newArray)
}

module.exports = {
  uniq: uniq,
  immutable: immutable
}

},{}],75:[function(_dereq_,module,exports){
module.exports = function assign (t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i]
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p)) {
        t[p] = s[p]
      }
    }
  }
  return t
}

},{}],76:[function(_dereq_,module,exports){
module.exports = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
}

},{}],77:[function(_dereq_,module,exports){
var ColorNames = _dereq_('./../color-names')

var reverseNames = {}

// create a list of reverse color names
for (var name in ColorNames) {
  if (ColorNames.hasOwnProperty(name)) {
    reverseNames[ColorNames[name]] = name
  }
}

var cs = (module.exports = {
  to: {}
})

cs.get = function (string) {
  var prefix = string.substring(0, 3).toLowerCase()
  var val
  var model
  switch (prefix) {
    case 'hsl':
      val = cs.get.hsl(string)
      model = 'hsl'
      break
    case 'hwb':
      val = cs.get.hwb(string)
      model = 'hwb'
      break
    default:
      val = cs.get.rgb(string)
      model = 'rgb'
      break
  }

  if (!val) {
    return null
  }

  return { model: model, value: val }
}

cs.get.rgb = function (string) {
  if (!string) {
    return null
  }

  var abbr = /^#([a-f0-9]{3,4})$/i
  var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i
  var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/
  var per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/
  var keyword = /(\D+)/

  var rgb = [0, 0, 0, 1]
  var match
  var i
  var hexAlpha

  var hexMatch = string.match(hex)
  var abbrMatch = string.match(abbr)
  var rgbaMatch = string.match(rgba)
  var perMatch = string.match(per)
  var keywordMatch = string.match(keyword)

  if (hexMatch) {
    match = hexMatch
    hexAlpha = match[2]
    match = match[1]

    for (i = 0; i < 3; i++) {
      // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
      var i2 = i * 2
      rgb[i] = parseInt(match.slice(i2, i2 + 2), 16)
    }

    if (hexAlpha) {
      rgb[3] = Math.round(parseInt(hexAlpha, 16) / 255 * 100) / 100
    }
  } else if (abbrMatch) {
    match = abbrMatch
    match = match[1]
    hexAlpha = match[3]

    for (i = 0; i < 3; i++) {
      rgb[i] = parseInt(match[i] + match[i], 16)
    }

    if (hexAlpha) {
      rgb[3] = Math.round(parseInt(hexAlpha + hexAlpha, 16) / 255 * 100) / 100
    }
  } else if (rgbaMatch) {
    match = rgbaMatch
    for (i = 0; i < 3; i++) {
      rgb[i] = parseInt(match[i + 1], 0)
    }

    if (match[4]) {
      rgb[3] = parseFloat(match[4])
    }
  } else if (perMatch) {
    match = perMatch
    for (i = 0; i < 3; i++) {
      rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55)
    }

    if (match[4]) {
      rgb[3] = parseFloat(match[4])
    }
  } else if (keywordMatch) {
    match = keywordMatch
    if (match[1] === 'transparent') {
      return [0, 0, 0, 0]
    }

    rgb = ColorNames[match[1]]

    if (!rgb) {
      return null
    }

    rgb[3] = 1

    return rgb
  } else {
    return null
  }

  for (i = 0; i < 3; i++) {
    rgb[i] = clamp(rgb[i], 0, 255)
  }
  rgb[3] = clamp(rgb[3], 0, 1)

  return rgb
}

cs.get.hsl = function (string) {
  if (!string) {
    return null
  }

  var hsl = /^hsla?\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/
  var match = string.match(hsl)

  if (match) {
    var alpha = parseFloat(match[4])
    var h = (parseFloat(match[1]) % 360 + 360) % 360
    var s = clamp(parseFloat(match[2]), 0, 100)
    var l = clamp(parseFloat(match[3]), 0, 100)
    var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1)

    return [h, s, l, a]
  }

  return null
}

cs.get.hwb = function (string) {
  if (!string) {
    return null
  }

  var hwb = /^hwb\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/
  var match = string.match(hwb)

  if (match) {
    var alpha = parseFloat(match[4])
    var h = (parseFloat(match[1]) % 360 + 360) % 360
    var w = clamp(parseFloat(match[2]), 0, 100)
    var b = clamp(parseFloat(match[3]), 0, 100)
    var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1)
    return [h, w, b, a]
  }

  return null
}

cs.to.hex = function (rgba) {
  return (
    '#' +
    hexDouble(rgba[0]) +
    hexDouble(rgba[1]) +
    hexDouble(rgba[2]) +
    (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : '')
  )
}

cs.to.rgb = function (rgba) {
  return rgba.length < 4 || rgba[3] === 1
    ? 'rgb(' +
        Math.round(rgba[0]) +
        ', ' +
        Math.round(rgba[1]) +
        ', ' +
        Math.round(rgba[2]) +
        ')'
    : 'rgba(' +
        Math.round(rgba[0]) +
        ', ' +
        Math.round(rgba[1]) +
        ', ' +
        Math.round(rgba[2]) +
        ', ' +
        rgba[3] +
        ')'
}

cs.to.rgb.percent = function (rgba) {
  var r = Math.round(rgba[0] / 255 * 100)
  var g = Math.round(rgba[1] / 255 * 100)
  var b = Math.round(rgba[2] / 255 * 100)

  return rgba.length < 4 || rgba[3] === 1
    ? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
    : 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')'
}

cs.to.hsl = function (hsla) {
  return hsla.length < 4 || hsla[3] === 1
    ? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
    : 'hsla(' +
        hsla[0] +
        ', ' +
        hsla[1] +
        '%, ' +
        hsla[2] +
        '%, ' +
        hsla[3] +
        ')'
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function (hwba) {
  var a = ''
  if (hwba.length >= 4 && hwba[3] !== 1) {
    a = ', ' + hwba[3]
  }

  return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')'
}

cs.to.keyword = function (rgb) {
  return reverseNames[rgb.slice(0, 3)]
}

// helpers
function clamp (num, min, max) {
  return Math.min(Math.max(min, num), max)
}

function hexDouble (num) {
  var str = num.toString(16).toUpperCase()
  return str.length < 2 ? '0' + str : str
}

},{"./../color-names":76}],78:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.ease = internal1.cubicBezier(0.25, 0.1, 0.25, 0.1)

},{"../internal":122}],79:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeIn = internal1.cubicBezier(0.42, 0, 1, 1)

},{"../internal":122}],80:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInBack = function (x) {
  return internal1.c3 * x * x * x - internal1.c1 * x * x
}

},{"../internal":122}],81:[function(_dereq_,module,exports){
var index1 = _dereq_('./index')
exports.easeInBounce = function (x) {
  return 1 - index1.easeOutBounce(1 - x)
}

},{"./index":112}],82:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInCirc = function (x) {
  return 1 - internal1.sqrt(1 - x * x)
}

},{"../internal":122}],83:[function(_dereq_,module,exports){
exports.easeInCubic = function (x) {
  return x * x * x
}

},{}],84:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInElastic = function (n) {
  return !n || n === 1
    ? n
    : -1 *
        internal1.sin((n - 1.1) * internal1.tau * 2.5) *
        internal1.pow(2, 10 * (n - 1))
}

},{"../internal":122}],85:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInExpo = function (x) {
  return x === 0 ? 0 : internal1.pow(2, 10 * x - 10)
}

},{"../internal":122}],86:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOut = internal1.cubicBezier(0.42, 0, 0.58, 1)

},{"../internal":122}],87:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutBack = function (x) {
  return x < 0.5
    ? internal1.pow(2 * x, 2) * ((internal1.c2 + 1) * 2 * x - internal1.c2) / 2
    : (internal1.pow(2 * x - 2, 2) *
        ((internal1.c2 + 1) * (x * 2 - 2) + internal1.c2) +
        2) /
        2
}

},{"../internal":122}],88:[function(_dereq_,module,exports){
var index1 = _dereq_('./index')
exports.easeInOutBounce = function (x) {
  return x < 0.5
    ? (1 - index1.easeOutBounce(1 - 2 * x)) / 2
    : (1 + index1.easeOutBounce(2 * x - 1)) / 2
}

},{"./index":112}],89:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutCirc = function (x) {
  return x < 0.5
    ? (1 - internal1.sqrt(1 - internal1.pow(2 * x, 2))) / 2
    : (internal1.sqrt(1 - internal1.pow(-2 * x + 2, 2)) + 1) / 2
}

},{"../internal":122}],90:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutCubic = function (x) {
  return x < 0.5 ? 4 * x * x * x : 1 - internal1.pow(-2 * x + 2, 3) / 2
}

},{"../internal":122}],91:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutElastic = function (n) {
  if (!n || n === 1) return n
  n *= 2
  if (n < 1) {
    return (
      -0.5 *
      (internal1.pow(2, 10 * (n - 1)) *
        internal1.sin((n - 1.1) * internal1.tau / 0.4))
    )
  }
  return (
    internal1.pow(2, -10 * (n - 1)) *
      internal1.sin((n - 1.1) * internal1.tau / 0.4) *
      0.5 +
    1
  )
}

},{"../internal":122}],92:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutExpo = function (x) {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? internal1.pow(2, 20 * x - 10) / 2
        : (2 - internal1.pow(2, -20 * x + 10)) / 2
}

},{"../internal":122}],93:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutQuad = function (x) {
  return x < 0.5 ? 2 * x * x : 1 - internal1.pow(-2 * x + 2, 2) / 2
}

},{"../internal":122}],94:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutQuart = function (x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - internal1.pow(-2 * x + 2, 4) / 2
}

},{"../internal":122}],95:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutQuint = function (x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - internal1.pow(-2 * x + 2, 5) / 2
}

},{"../internal":122}],96:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInOutSine = function (x) {
  return -(internal1.cos(internal1.pi * x) - 1) / 2
}

},{"../internal":122}],97:[function(_dereq_,module,exports){
exports.easeInQuad = function (x) {
  return x * x
}

},{}],98:[function(_dereq_,module,exports){
exports.easeInQuart = function (x) {
  return x * x * x * x
}

},{}],99:[function(_dereq_,module,exports){
exports.easeInQuint = function (x) {
  return x * x * x * x * x
}

},{}],100:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeInSine = function (x) {
  return 1 - internal1.cos(x * internal1.pi / 2)
}

},{"../internal":122}],101:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOut = internal1.cubicBezier(0, 0, 0.58, 1)

},{"../internal":122}],102:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutBack = function (x) {
  return (
    1 +
    internal1.c3 * internal1.pow(x - 1, 3) +
    internal1.c1 * internal1.pow(x - 1, 2)
  )
}

},{"../internal":122}],103:[function(_dereq_,module,exports){
exports.easeOutBounce = function (x) {
  var n1 = 7.5625
  var d1 = 2.75
  return x < 1 / d1
    ? n1 * x * x
    : x < 2 / d1
      ? n1 * (x -= 1.5 / d1) * x + 0.75
      : x < 2.5 / d1
        ? n1 * (x -= 2.25 / d1) * x + 0.9375
        : n1 * (x -= 2.625 / d1) * x + 0.984375
}

},{}],104:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutCirc = function (x) {
  return internal1.sqrt(1 - (x - 1) * (x - 1))
}

},{"../internal":122}],105:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutCubic = function (x) {
  return 1 - internal1.pow(1 - x, 3)
}

},{"../internal":122}],106:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutElastic = function (n) {
  if (!n || n === 1) return n
  var s
  var a = 0.1
  var p = 0.4
  if (!a || a < 1) {
    a = 1
    s = p / 4
  } else s = p * Math.asin(1 / a) / internal1.tau
  return (
    a * internal1.pow(2, -10 * n) * internal1.sin((n - s) * internal1.tau / p) +
    1
  )
}

},{"../internal":122}],107:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutExpo = function (x) {
  return x === 1 ? 1 : 1 - internal1.pow(2, -10 * x)
}

},{"../internal":122}],108:[function(_dereq_,module,exports){
exports.easeOutQuad = function (x) {
  return 1 - (1 - x) * (1 - x)
}

},{}],109:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutQuart = function (x) {
  return 1 - internal1.pow(1 - x, 4)
}

},{"../internal":122}],110:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutQuint = function (x) {
  return 1 - internal1.pow(1 - x, 5)
}

},{"../internal":122}],111:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.easeOutSine = function (x) {
  return internal1.sin(x * internal1.pi / 2)
}

},{"../internal":122}],112:[function(_dereq_,module,exports){
function __export (m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p]
}
__export(_dereq_('./ease'))
__export(_dereq_('./easeIn'))
__export(_dereq_('./easeInBack'))
__export(_dereq_('./easeInBounce'))
__export(_dereq_('./easeInCirc'))
__export(_dereq_('./easeInCubic'))
__export(_dereq_('./easeInElastic'))
__export(_dereq_('./easeInExpo'))
__export(_dereq_('./easeInOut'))
__export(_dereq_('./easeInOutBack'))
__export(_dereq_('./easeInOutBounce'))
__export(_dereq_('./easeInOutCirc'))
__export(_dereq_('./easeInOutCubic'))
__export(_dereq_('./easeInOutElastic'))
__export(_dereq_('./easeInOutExpo'))
__export(_dereq_('./easeInOutQuad'))
__export(_dereq_('./easeInOutQuart'))
__export(_dereq_('./easeInOutQuint'))
__export(_dereq_('./easeInOutSine'))
__export(_dereq_('./easeInQuad'))
__export(_dereq_('./easeInQuart'))
__export(_dereq_('./easeInQuint'))
__export(_dereq_('./easeInSine'))
__export(_dereq_('./easeOut'))
__export(_dereq_('./easeOutBack'))
__export(_dereq_('./easeOutBounce'))
__export(_dereq_('./easeOutCirc'))
__export(_dereq_('./easeOutCubic'))
__export(_dereq_('./easeOutElastic'))
__export(_dereq_('./easeOutExpo'))
__export(_dereq_('./easeOutQuad'))
__export(_dereq_('./easeOutQuart'))
__export(_dereq_('./easeOutQuint'))
__export(_dereq_('./easeOutSine'))
__export(_dereq_('./linear'))
__export(_dereq_('./stepEnd'))
__export(_dereq_('./stepStart'))

},{"./ease":78,"./easeIn":79,"./easeInBack":80,"./easeInBounce":81,"./easeInCirc":82,"./easeInCubic":83,"./easeInElastic":84,"./easeInExpo":85,"./easeInOut":86,"./easeInOutBack":87,"./easeInOutBounce":88,"./easeInOutCirc":89,"./easeInOutCubic":90,"./easeInOutElastic":91,"./easeInOutExpo":92,"./easeInOutQuad":93,"./easeInOutQuart":94,"./easeInOutQuint":95,"./easeInOutSine":96,"./easeInQuad":97,"./easeInQuart":98,"./easeInQuint":99,"./easeInSine":100,"./easeOut":101,"./easeOutBack":102,"./easeOutBounce":103,"./easeOutCirc":104,"./easeOutCubic":105,"./easeOutElastic":106,"./easeOutExpo":107,"./easeOutQuad":108,"./easeOutQuart":109,"./easeOutQuint":110,"./easeOutSine":111,"./linear":113,"./stepEnd":114,"./stepStart":115}],113:[function(_dereq_,module,exports){
exports.linear = function (x) {
  return x
}

},{}],114:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.stepEnd = internal1.steps(1, 0)

},{"../internal":122}],115:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.stepStart = internal1.steps(1, 1)

},{"../internal":122}],116:[function(_dereq_,module,exports){
function __export (m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p]
}
var internal1 = _dereq_('./internal')
exports.cssFunction = internal1.cssFunction
exports.cubicBezier = internal1.cubicBezier
exports.frames = internal1.frames
exports.steps = internal1.steps
__export(_dereq_('./curves'))
var css = _dereq_('./internal/cssEasings')
exports.css = css

},{"./curves":112,"./internal":122,"./internal/cssEasings":118}],117:[function(_dereq_,module,exports){
exports.pi = Math.PI
exports.tau = 2 * exports.pi
exports.epsilon = 0.0001
exports.c1 = 1.70158
exports.c2 = exports.c1 * 1.525
exports.c3 = exports.c1 + 1
exports.c4 = exports.tau / 3
exports.c5 = exports.tau / 4.5

},{}],118:[function(_dereq_,module,exports){
var c = 'cubic-bezier'
var s = 'steps'
exports.ease = c + '(.25,.1,.25,1)'
exports.easeIn = c + '(.42,0,1,1)'
exports.easeInBack = c + '(.6,-.28,.735,.045)'
exports.easeInCirc = c + '(.6,.04,.98,.335)'
exports.easeInCubic = c + '(.55,.055,.675,.19)'
exports.easeInExpo = c + '(.95,.05,.795,.035)'
exports.easeInOut = c + '(.42,0,.58,1)'
exports.easeInOutBack = c + '(.68,-.55,.265,1.55)'
exports.easeInOutCirc = c + '(.785,.135,.15,.86)'
exports.easeInOutCubic = c + '(.645,.045,.355,1)'
exports.easeInOutExpo = c + '(1,0,0,1)'
exports.easeInOutQuad = c + '(.455,.03,.515,.955)'
exports.easeInOutQuart = c + '(.77,0,.175,1)'
exports.easeInOutQuint = c + '(.86,0,.07,1)'
exports.easeInOutSine = c + '(.445,.05,.55,.95)'
exports.easeInQuad = c + '(.55,.085,.68,.53)'
exports.easeInQuart = c + '(.895,.03,.685,.22)'
exports.easeInQuint = c + '(.755,.05,.855,.06)'
exports.easeInSine = c + '(.47,0,.745,.715)'
exports.easeOut = c + '(0,0,.58,1)'
exports.easeOutBack = c + '(.175,.885,.32,1.275)'
exports.easeOutCirc = c + '(.075,.82,.165,1)'
exports.easeOutCubic = c + '(.215,.61,.355,1)'
exports.easeOutExpo = c + '(.19,1,.22,1)'
exports.easeOutQuad = c + '(.25,.46,.45,.94)'
exports.easeOutQuart = c + '(.165,.84,.44,1)'
exports.easeOutQuint = c + '(.23,1,.32,1)'
exports.easeOutSine = c + '(.39,.575,.565,1)'
exports.elegantSlowStartEnd = c + '(.175,.885,.32,1.275)'
exports.linear = c + '(0,0,1,1)'
exports.stepEnd = s + '(1,0)'
exports.stepStart = s + '(1,1)'

},{}],119:[function(_dereq_,module,exports){
var index1 = _dereq_('./index')
var camelCaseRegex = /([a-z])[- ]([a-z])/gi
var cssFunctionRegex = /^([a-z-]+)\(([^)]+)\)$/i
var cssEasings = {
  ease: index1.ease,
  easeIn: index1.easeIn,
  easeOut: index1.easeOut,
  easeInOut: index1.easeInOut,
  stepStart: index1.stepStart,
  stepEnd: index1.stepEnd,
  linear: index1.linear
}
var camelCaseMatcher = function (match, p1, p2) {
  return p1 + p2.toUpperCase()
}
var toCamelCase = function (value) {
  return typeof value === 'string'
    ? value.replace(camelCaseRegex, camelCaseMatcher)
    : ''
}
var find = function (nameOrCssFunction) {
  // search for a compatible known easing
  var easingName = toCamelCase(nameOrCssFunction)
  var easing = cssEasings[easingName] || nameOrCssFunction
  var matches = cssFunctionRegex.exec(easing)
  if (!matches) {
    throw new Error('could not parse css function')
  }
  return [matches[1]].concat(matches[2].split(','))
}
exports.cssFunction = function (easingString) {
  var p = find(easingString)
  var fnName = p[0]
  if (fnName === 'steps') {
    return index1.steps(+p[1], p[2])
  }
  if (fnName === 'cubic-bezier') {
    return index1.cubicBezier(+p[1], +p[2], +p[3], +p[4])
  }
  if (fnName === 'frames') {
    return index1.frames(+p[1])
  }
  throw new Error('unknown css function')
}

},{"./index":122}],120:[function(_dereq_,module,exports){
var index1 = _dereq_('./index')
var bezier = function (n1, n2, t) {
  return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t
}
exports.cubicBezier = function (p0, p1, p2, p3) {
  if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
    return function (x) {
      return x
    }
  }
  return function (x) {
    if (x === 0 || x === 1) {
      return x
    }
    var start = 0
    var end = 1
    var limit = 19
    do {
      var mid = (start + end) * 0.5
      var xEst = bezier(p0, p2, mid)
      if (index1.abs(x - xEst) < index1.epsilon) {
        return bezier(p1, p3, mid)
      }
      if (xEst < x) {
        start = mid
      } else {
        end = mid
      }
    } while (--limit)
    // limit is reached
    return x
  }
}

},{"./index":122}],121:[function(_dereq_,module,exports){
var internal1 = _dereq_('../internal')
exports.frames = function (n) {
  var q = 1 / (n - 1)
  return function (x) {
    var o = internal1.floor(x * n) * q
    return x >= 0 && o < 0 ? 0 : x <= 1 && o > 1 ? 1 : o
  }
}

},{"../internal":122}],122:[function(_dereq_,module,exports){
function __export (m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p]
}
__export(_dereq_('./constants'))
__export(_dereq_('./cssEasings'))
__export(_dereq_('./cssFunction'))
__export(_dereq_('./cubicBezier'))
__export(_dereq_('./frames'))
__export(_dereq_('./math'))
__export(_dereq_('./steps'))

},{"./constants":117,"./cssEasings":118,"./cssFunction":119,"./cubicBezier":120,"./frames":121,"./math":123,"./steps":124}],123:[function(_dereq_,module,exports){
exports.abs = Math.abs
exports.asin = Math.asin
exports.floor = Math.floor
exports.cos = Math.cos
exports.pow = Math.pow
exports.sin = Math.sin
exports.sqrt = Math.sqrt

},{}],124:[function(_dereq_,module,exports){
exports.steps = function (count, pos) {
  var q = count / 1
  var p = pos === 'end' ? 0 : pos === 'start' ? 1 : pos || 0
  return function (x) {
    return x >= 1 ? 1 : p * q + x - (p * q + x) % q
  }
}

},{}],125:[function(_dereq_,module,exports){
/* eslint-disable */

module.exports = function _mixpanelTiny() {
  if (typeof window === 'undefined') {
    return null
  }
  if (typeof document === 'undefined') {
    return null
  }

  function setup(e, a) {
    if (!a.__SV) {
      var b = window
      try {
        var c,
          l,
          i,
          j = b.location,
          g = j.hash
        c = function(a, b) {
          return (l = a.match(RegExp(b + '=([^&]*)'))) ? l[1] : null
        }
        g &&
          c(g, 'state') &&
          (
            (i = JSON.parse(decodeURIComponent(c(g, 'state')))),
            'mpeditor' === i.action &&
              (
                b.sessionStorage.setItem('_mpcehash', g),
                history.replaceState(
                  i.desiredHash || '',
                  e.title,
                  j.pathname + j.search
                )
              )
          )
      } catch (m) {}
      var k, h
      window.mixpanel = a
      a._i = []
      a.init = function(b, c, f) {
        function e(b, a) {
          var c = a.split('.')
          2 == c.length && ((b = b[c[0]]), (a = c[1]))
          b[a] = function() {
            b.push([a].concat(Array.prototype.slice.call(arguments, 0)))
          }
        }
        var d = a
        'undefined' !== typeof f ? (d = a[f] = []) : (f = 'mixpanel')
        d.people = d.people || []
        d.toString = function(b) {
          var a = 'mixpanel'
          'mixpanel' !== f && (a += '.' + f)
          b || (a += ' (stub)')
          return a
        }
        d.people.toString = function() {
          return d.toString(1) + '.people (stub)'
        }
        k = 'disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user'.split(
          ' '
        )
        for (h = 0; h < k.length; h++) e(d, k[h])
        a._i.push([b, c, f])
      }
      a.__SV = 1.2
      b = e.createElement('script')
      b.type = 'text/javascript'
      b.async = !0
      b.src = 'undefined' !== typeof MIXPANEL_CUSTOM_LIB_URL
        ? MIXPANEL_CUSTOM_LIB_URL
        : 'file:' === e.location.protocol &&
            '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//)
          ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
          : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
      if (c && c.parentNode) {
        c.parentNode.insertBefore(b, c)
      }
    }
    return a
  }

  return setup(document, window.mixpanel || [])
}

},{}],126:[function(_dereq_,module,exports){
function hasPreserve3d (window) {
  if (!window) return false
  if (!window.document) return false
  var outerAnchor
  var innerAnchor
  var CSS = window.CSS
  var result = false
  if (CSS && CSS.supports && CSS.supports('(transform-style: preserve-3d)')) {
    return true
  }
  outerAnchor = window.document.createElement('a')
  innerAnchor = window.document.createElement('a')
  outerAnchor.style.cssText =
    'display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);'
  innerAnchor.style.cssText =
    'display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);'
  outerAnchor.appendChild(innerAnchor)
  window.document.documentElement.appendChild(outerAnchor)
  result = innerAnchor.getBoundingClientRect()
  window.document.documentElement.removeChild(outerAnchor)
  result = result.width && result.width < 4
  return result
}

module.exports = {
  hasPreserve3d: hasPreserve3d
}

},{}],127:[function(_dereq_,module,exports){
(function (process){
/* eslint-disable */
// Generated by CoffeeScript 1.7.1
;(function() {
  var getNanoSeconds, hrtime, loadTime

  if (
    typeof performance !== 'undefined' &&
    performance !== null &&
    performance.now
  ) {
    module.exports = function() {
      return performance.now()
    }
  } else if (
    typeof process !== 'undefined' &&
    process !== null &&
    process.hrtime
  ) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6
    }
    hrtime = process.hrtime
    getNanoSeconds = function() {
      var hr
      hr = hrtime()
      return hr[0] * 1e9 + hr[1]
    }
    loadTime = getNanoSeconds()
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime
    }
    loadTime = Date.now()
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime
    }
    loadTime = new Date().getTime()
  }
}.call(this))

}).call(this,_dereq_('_process'))
},{"_process":1}],128:[function(_dereq_,module,exports){
(function (global){
/* eslint-disable */

var now = _dereq_('./../performance-now')

var root = typeof window === 'undefined' ? global : window
var vendors = ['moz', 'webkit']
var suffix = 'AnimationFrame'
var raf = root['request' + suffix]
var caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for (var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf =
    root[vendors[i] + 'Cancel' + suffix] ||
    root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if (!raf || !caf) {
  var last = 0,
    id = 0,
    queue = [],
    frameDuration = 1000 / 60

  raf = function(callback) {
    if (queue.length === 0) {
      var _now = now(),
        next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for (var i = 0; i < cp.length; i++) {
          if (!cp[i].cancelled) {
            try {
              cp[i].callback(last)
            } catch (e) {
              setTimeout(function() {
                throw e
              }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function() {
  root.requestAnimationFrame = raf
  root.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../performance-now":127}],129:[function(_dereq_,module,exports){
'use strict'

exports.__esModule = true
exports.valid = exports.toPoints = exports.toPath = undefined

var _toPath = _dereq_('./toPath')

var _toPath2 = _interopRequireDefault(_toPath)

var _toPoints = _dereq_('./toPoints')

var _toPoints2 = _interopRequireDefault(_toPoints)

var _valid = _dereq_('./valid')

var _valid2 = _interopRequireDefault(_valid)

function _interopRequireDefault (obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.toPath = _toPath2.default
exports.toPoints = _toPoints2.default
exports.valid = _valid2.default

},{"./toPath":130,"./toPoints":131,"./valid":132}],130:[function(_dereq_,module,exports){
/* eslint-disable */

'use strict'

exports.__esModule = true

var _toPoints = _dereq_('./toPoints')

var _toPoints2 = _interopRequireDefault(_toPoints)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var pointsToD = function(p) {
  var d = ''
  var i = 0
  var firstPoint = void 0

  for (
    var _iterator = p,
      _isArray = Array.isArray(_iterator),
      _i = 0,
      _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
    ;

  ) {
    var _ref

    if (_isArray) {
      if (_i >= _iterator.length) break
      _ref = _iterator[_i++]
    } else {
      _i = _iterator.next()
      if (_i.done) break
      _ref = _i.value
    }

    var point = _ref
    var _point$curve = point.curve,
      curve = _point$curve === undefined ? false : _point$curve,
      moveTo = point.moveTo,
      x = point.x,
      y = point.y

    var isFirstPoint = i === 0 || moveTo
    var isLastPoint = i === p.length - 1 || p[i + 1].moveTo
    var prevPoint = i === 0 ? null : p[i - 1]

    if (isFirstPoint) {
      firstPoint = point

      if (!isLastPoint) {
        d += 'M' + x + ',' + y
      }
    } else if (curve) {
      switch (curve.type) {
        case 'arc':
          var _point$curve2 = point.curve,
            _point$curve2$largeAr = _point$curve2.largeArcFlag,
            largeArcFlag = _point$curve2$largeAr === undefined
              ? 0
              : _point$curve2$largeAr,
            rx = _point$curve2.rx,
            ry = _point$curve2.ry,
            _point$curve2$sweepFl = _point$curve2.sweepFlag,
            sweepFlag = _point$curve2$sweepFl === undefined
              ? 0
              : _point$curve2$sweepFl,
            _point$curve2$xAxisRo = _point$curve2.xAxisRotation,
            xAxisRotation = _point$curve2$xAxisRo === undefined
              ? 0
              : _point$curve2$xAxisRo

          d +=
            'A' +
            rx +
            ',' +
            ry +
            ',' +
            xAxisRotation +
            ',' +
            largeArcFlag +
            ',' +
            sweepFlag +
            ',' +
            x +
            ',' +
            y
          break
        case 'cubic':
          var _point$curve3 = point.curve,
            cx1 = _point$curve3.x1,
            cy1 = _point$curve3.y1,
            cx2 = _point$curve3.x2,
            cy2 = _point$curve3.y2

          d += 'C' + cx1 + ',' + cy1 + ',' + cx2 + ',' + cy2 + ',' + x + ',' + y
          break
        case 'quadratic':
          var _point$curve4 = point.curve,
            qx1 = _point$curve4.x1,
            qy1 = _point$curve4.y1

          d += 'Q' + qx1 + ',' + qy1 + ',' + x + ',' + y
          break
      }

      if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
        d += 'Z'
      }
    } else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
      d += 'Z'
    } else if (x !== prevPoint.x && y !== prevPoint.y) {
      d += 'L' + x + ',' + y
    } else if (x !== prevPoint.x) {
      d += 'H' + x
    } else if (y !== prevPoint.y) {
      d += 'V' + y
    }

    i++
  }

  return d
}

var toPath = function(s) {
  var isPoints = Array.isArray(s)
  var isGroup = isPoints ? Array.isArray(s[0]) : s.type === 'g'
  var points = isPoints
    ? s
    : isGroup
      ? s.shapes.map(function(shp) {
          return (0, _toPoints2.default)(shp)
        })
      : (0, _toPoints2.default)(s)

  if (isGroup) {
    return points.map(function(p) {
      return pointsToD(p)
    })
  }

  return pointsToD(points)
}

exports.default = toPath

},{"./toPoints":131}],131:[function(_dereq_,module,exports){
/* eslint-disable */

'use strict'

exports.__esModule = true

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

function _objectWithoutProperties(obj, keys) {
  var target = {}
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }
  return target
}

var toPoints = function(_ref) {
  var type = _ref.type,
    props = _objectWithoutProperties(_ref, ['type'])

  switch (type) {
    case 'circle':
      return getPointsFromCircle(props)
    case 'ellipse':
      return getPointsFromEllipse(props)
    case 'line':
      return getPointsFromLine(props)
    case 'path':
      return getPointsFromPath(props)
    case 'polygon':
      return getPointsFromPolygon(props)
    case 'polyline':
      return getPointsFromPolyline(props)
    case 'rect':
      return getPointsFromRect(props)
    case 'g':
      return getPointsFromG(props)
    default:
      throw new Error('Not a valid shape type')
  }
}

var getPointsFromCircle = function(_ref2) {
  var cx = _ref2.cx,
    cy = _ref2.cy,
    r = _ref2.r

  return [
    { x: cx, y: cy - r, moveTo: true },
    { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } },
    { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }
  ]
}

var getPointsFromEllipse = function(_ref3) {
  var cx = _ref3.cx,
    cy = _ref3.cy,
    rx = _ref3.rx,
    ry = _ref3.ry

  return [
    { x: cx, y: cy - ry, moveTo: true },
    { x: cx, y: cy + ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } },
    { x: cx, y: cy - ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }
  ]
}

var getPointsFromLine = function(_ref4) {
  var x1 = _ref4.x1,
    x2 = _ref4.x2,
    y1 = _ref4.y1,
    y2 = _ref4.y2

  return [{ x: x1, y: y1, moveTo: true }, { x: x2, y: y2 }]
}

var validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g

var commandLengths = {
  A: 7,
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  S: 4,
  T: 2,
  V: 1,
  Z: 0
}

var relativeCommands = ['a', 'c', 'h', 'l', 'm', 'q', 's', 't', 'v']

var isRelative = function(command) {
  return relativeCommands.indexOf(command) !== -1
}

var optionalArcKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag']

var getCommands = function(d) {
  return d.match(validCommands)
}

var getParams = function(d) {
  return d
    .split(validCommands)
    .map(function(v) {
      return v.replace(/[0-9]+-/g, function(m) {
        return m.slice(0, -1) + ' -'
      })
    })
    .map(function(v) {
      return v.replace(/\.[0-9]+/g, function(m) {
        return m + ' '
      })
    })
    .map(function(v) {
      return v.trim()
    })
    .filter(function(v) {
      return v.length > 0
    })
    .map(function(v) {
      return v.split(/[ ,]+/).map(parseFloat).filter(function(n) {
        return !isNaN(n)
      })
    })
}

var getPointsFromPath = function(_ref5) {
  var d = _ref5.d

  var commands = getCommands(d)
  var params = getParams(d)

  var points = []

  var moveTo = void 0

  for (var i = 0, l = commands.length; i < l; i++) {
    var command = commands[i]
    var upperCaseCommand = command.toUpperCase()
    var commandLength = commandLengths[upperCaseCommand]
    var relative = isRelative(command)
    var prevPoint = i === 0 ? null : points[points.length - 1]

    if (commandLength > 0) {
      var commandParams = params.shift()
      var iterations = commandParams.length / commandLength

      for (var j = 0; j < iterations; j++) {
        switch (upperCaseCommand) {
          case 'M':
            var x =
              (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift()
            var y =
              (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift()

            moveTo = { x: x, y: y }

            points.push({ x: x, y: y, moveTo: true })

            break

          case 'L':
            points.push({
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'H':
            points.push({
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: prevPoint.y
            })

            break

          case 'V':
            points.push({
              x: prevPoint.x,
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'A':
            points.push({
              curve: {
                type: 'arc',
                rx: commandParams.shift(),
                ry: commandParams.shift(),
                xAxisRotation: commandParams.shift(),
                largeArcFlag: commandParams.shift(),
                sweepFlag: commandParams.shift()
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            for (
              var _iterator = optionalArcKeys,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref6

              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref6 = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref6 = _i.value
              }

              var k = _ref6

              if (points[points.length - 1]['curve'][k] === 0) {
                delete points[points.length - 1]['curve'][k]
              }
            }

            break

          case 'C':
            points.push({
              curve: {
                type: 'cubic',
                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y2: (relative ? prevPoint.y : 0) + commandParams.shift()
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'S':
            var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift()
            var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift()
            var sx = (relative ? prevPoint.x : 0) + commandParams.shift()
            var sy = (relative ? prevPoint.y : 0) + commandParams.shift()

            var diff = {}

            var sx1 = void 0
            var sy1 = void 0

            if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
              diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2)
              diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2)
              sx1 = prevPoint.x < prevPoint.curve.x2
                ? prevPoint.x - diff.x
                : prevPoint.x + diff.x
              sy1 = prevPoint.y < prevPoint.curve.y2
                ? prevPoint.y - diff.y
                : prevPoint.y + diff.y
            } else {
              diff.x = Math.abs(sx - sx2)
              diff.y = Math.abs(sy - sy2)
              sx1 = prevPoint.x
              sy1 = prevPoint.y
            }

            points.push({
              curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 },
              x: sx,
              y: sy
            })

            break

          case 'Q':
            points.push({
              curve: {
                type: 'quadratic',
                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                y1: (relative ? prevPoint.y : 0) + commandParams.shift()
              },
              x: (relative ? prevPoint.x : 0) + commandParams.shift(),
              y: (relative ? prevPoint.y : 0) + commandParams.shift()
            })

            break

          case 'T':
            var tx = (relative ? prevPoint.x : 0) + commandParams.shift()
            var ty = (relative ? prevPoint.y : 0) + commandParams.shift()

            var tx1 = void 0
            var ty1 = void 0

            if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
              var _diff = {
                x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                y: Math.abs(prevPoint.y - prevPoint.curve.y1)
              }

              tx1 = prevPoint.x < prevPoint.curve.x1
                ? prevPoint.x - _diff.x
                : prevPoint.x + _diff.x
              ty1 = prevPoint.y < prevPoint.curve.y1
                ? prevPoint.y - _diff.y
                : prevPoint.y + _diff.y
            } else {
              tx1 = prevPoint.x
              ty1 = prevPoint.y
            }

            points.push({
              curve: { type: 'quadratic', x1: tx1, y1: ty1 },
              x: tx,
              y: ty
            })

            break
        }
      }
    } else {
      if (prevPoint.x !== moveTo.x || prevPoint.y !== moveTo.y) {
        points.push({ x: moveTo.x, y: moveTo.y })
      }
    }
  }

  return points
}

var getPointsFromPolygon = function(_ref7) {
  var points = _ref7.points

  return getPointsFromPoints({ closed: true, points: points })
}

var getPointsFromPolyline = function(_ref8) {
  var points = _ref8.points

  return getPointsFromPoints({ closed: false, points: points })
}

var getPointsFromPoints = function(_ref9) {
  var closed = _ref9.closed,
    points = _ref9.points

  var numbers = points.split(/[\s,]+/).map(function(n) {
    return parseFloat(n)
  })

  var p = numbers.reduce(function(arr, point, i) {
    if (i % 2 === 0) {
      arr.push({ x: point })
    } else {
      arr[(i - 1) / 2].y = point
    }

    return arr
  }, [])

  if (closed) {
    p.push(_extends({}, p[0]))
  }

  p[0].moveTo = true

  return p
}

var getPointsFromRect = function(_ref10) {
  var height = _ref10.height,
    rx = _ref10.rx,
    ry = _ref10.ry,
    width = _ref10.width,
    x = _ref10.x,
    y = _ref10.y

  if (rx || ry) {
    return getPointsFromRectWithCornerRadius({
      height: height,
      rx: rx || ry,
      ry: ry || rx,
      width: width,
      x: x,
      y: y
    })
  }

  return getPointsFromBasicRect({ height: height, width: width, x: x, y: y })
}

var getPointsFromBasicRect = function(_ref11) {
  var height = _ref11.height,
    width = _ref11.width,
    x = _ref11.x,
    y = _ref11.y

  return [
    { x: x, y: y, moveTo: true },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
    { x: x, y: y }
  ]
}

var getPointsFromRectWithCornerRadius = function(_ref12) {
  var height = _ref12.height,
    rx = _ref12.rx,
    ry = _ref12.ry,
    width = _ref12.width,
    x = _ref12.x,
    y = _ref12.y

  var curve = { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 }

  return [
    { x: x + rx, y: y, moveTo: true },
    { x: x + width - rx, y: y },
    { x: x + width, y: y + ry, curve: curve },
    { x: x + width, y: y + height - ry },
    { x: x + width - rx, y: y + height, curve: curve },
    { x: x + rx, y: y + height },
    { x: x, y: y + height - ry, curve: curve },
    { x: x, y: y + ry },
    { x: x + rx, y: y, curve: curve }
  ]
}

var getPointsFromG = function(_ref13) {
  var shapes = _ref13.shapes
  return shapes.map(function(s) {
    return toPoints(s)
  })
}

exports.default = toPoints

},{}],132:[function(_dereq_,module,exports){
/* eslint-disable */

'use strict'

exports.__esModule = true
var getErrors = function(shape) {
  var rules = getRules(shape)
  var errors = []

  rules.map(function(_ref) {
    var match = _ref.match,
      prop = _ref.prop,
      required = _ref.required,
      type = _ref.type

    if (typeof shape[prop] === 'undefined') {
      if (required) {
        errors.push(
          prop +
            ' prop is required' +
            (prop === 'type' ? '' : ' on a ' + shape.type)
        )
      }
    } else {
      if (typeof type !== 'undefined') {
        if (type === 'array') {
          if (!Array.isArray(shape[prop])) {
            errors.push(prop + ' prop must be of type array')
          }
        } else if (typeof shape[prop] !== type) {
          errors.push(prop + ' prop must be of type ' + type)
        }
      }

      if (Array.isArray(match)) {
        if (match.indexOf(shape[prop]) === -1) {
          errors.push(prop + ' prop must be one of ' + match.join(', '))
        }
      }
    }
  })

  if (shape.type === 'g' && Array.isArray(shape.shapes)) {
    var childErrors = shape.shapes.map(function(s) {
      return getErrors(s)
    })
    return [].concat.apply(errors, childErrors)
  }

  return errors
}

var getRules = function(shape) {
  var rules = [
    {
      match: [
        'circle',
        'ellipse',
        'line',
        'path',
        'polygon',
        'polyline',
        'rect',
        'g'
      ],
      prop: 'type',
      required: true,
      type: 'string'
    }
  ]

  switch (shape.type) {
    case 'circle':
      rules.push({ prop: 'cx', required: true, type: 'number' })
      rules.push({ prop: 'cy', required: true, type: 'number' })
      rules.push({ prop: 'r', required: true, type: 'number' })
      break

    case 'ellipse':
      rules.push({ prop: 'cx', required: true, type: 'number' })
      rules.push({ prop: 'cy', required: true, type: 'number' })
      rules.push({ prop: 'rx', required: true, type: 'number' })
      rules.push({ prop: 'ry', required: true, type: 'number' })
      break

    case 'line':
      rules.push({ prop: 'x1', required: true, type: 'number' })
      rules.push({ prop: 'x2', required: true, type: 'number' })
      rules.push({ prop: 'y1', required: true, type: 'number' })
      rules.push({ prop: 'y2', required: true, type: 'number' })
      break

    case 'path':
      rules.push({ prop: 'd', required: true, type: 'string' })
      break

    case 'polygon':
    case 'polyline':
      rules.push({ prop: 'points', required: true, type: 'string' })
      break

    case 'rect':
      rules.push({ prop: 'height', required: true, type: 'number' })
      rules.push({ prop: 'rx', type: 'number' })
      rules.push({ prop: 'ry', type: 'number' })
      rules.push({ prop: 'width', required: true, type: 'number' })
      rules.push({ prop: 'x', required: true, type: 'number' })
      rules.push({ prop: 'y', required: true, type: 'number' })
      break

    case 'g':
      rules.push({ prop: 'shapes', required: true, type: 'array' })
      break
  }

  return rules
}

var valid = function(shape) {
  var errors = getErrors(shape)

  return {
    errors: errors,
    valid: errors.length === 0
  }
}

exports.default = valid

},{}],133:[function(_dereq_,module,exports){
module.exports = _dereq_('./prefixer')()

},{"./prefixer":141}],134:[function(_dereq_,module,exports){
module.exports = {
  animation: 1,
  'column-count': 1,
  columns: 1,
  'font-weight': 1,
  opacity: 1,
  order: 1,
  'z-index': 1,
  zoom: 1,
  flex: 1,
  'box-flex': 1,
  transform: 1,
  perspective: 1,
  'box-pack': 1,
  'box-align': 1,
  colspan: 1,
  rowspan: 1
}

},{}],135:[function(_dereq_,module,exports){
var objectHasOwn = Object.prototype.hasOwnProperty

module.exports = function (object, propertyName) {
  return objectHasOwn.call(object, propertyName)
}

},{}],136:[function(_dereq_,module,exports){
module.exports = {
  object: _dereq_('./toStyleObject')
}

},{"./toStyleObject":148}],137:[function(_dereq_,module,exports){
var objectToString = Object.prototype.toString

module.exports = function (v) {
  return objectToString.apply(v) === '[object Function]'
}

},{}],138:[function(_dereq_,module,exports){
var objectToString = Object.prototype.toString

module.exports = function (v) {
  return !!v && objectToString.call(v) === '[object Object]'
}

},{}],139:[function(_dereq_,module,exports){
var toUpperFirst = _dereq_('./stringUtils/toUpperFirst')

var re = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/

var docStyle = typeof document === 'undefined'
  ? {}
  : document.documentElement.style

var prefixInfo = (function () {
  var prefix = (function () {
    for (var prop in docStyle) {
      if (re.test(prop)) {
        // test is faster than match, so it's better to perform
        // that on the lot and match only when necessary
        return prop.match(re)[0]
      }
    }

    // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
    // However (prop in style) returns the correct value, so we'll have to test for
    // the precence of a specific property
    if ('WebkitOpacity' in docStyle) {
      return 'Webkit'
    }

    if ('KhtmlOpacity' in docStyle) {
      return 'Khtml'
    }

    return ''
  })()

  var lower = prefix.toLowerCase()

  return {
    style: prefix,
    css: '-' + lower + '-',
    dom:
      {
        Webkit: 'WebKit',
        ms: 'MS',
        o: 'WebKit'
      }[prefix] || toUpperFirst(prefix)
  }
})()

module.exports = prefixInfo

},{"./stringUtils/toUpperFirst":147}],140:[function(_dereq_,module,exports){
module.exports = {
  'border-radius': 1,
  'border-top-left-radius': 1,
  'border-top-right-radius': 1,
  'border-bottom-left-radius': 1,
  'border-bottom-right-radius': 1,
  'box-shadow': 1,
  order: 1,
  flex: function (name, prefix) {
    return [prefix + 'box-flex']
  },
  'box-flex': 1,
  'box-align': 1,
  animation: 1,
  'animation-duration': 1,
  'animation-name': 1,
  transition: 1,
  'transition-duration': 1,
  transform: 1,
  'transform-style': 1,
  'transform-origin': 1,
  'backface-visibility': 1,
  perspective: 1,
  'box-pack': 1
}

},{}],141:[function(_dereq_,module,exports){
var camelize = _dereq_('./stringUtils/camelize')
var hyphenate = _dereq_('./stringUtils/hyphenate')
var toLowerFirst = _dereq_('./stringUtils/toLowerFirst')
var toUpperFirst = _dereq_('./stringUtils/toUpperFirst')

var prefixInfo = _dereq_('./prefixInfo')
var prefixProperties = _dereq_('./prefixProperties')

var docStyle = typeof document === 'undefined'
  ? {}
  : document.documentElement.style

module.exports = function (asStylePrefix) {
  return function (name, config) {
    config = config || {}

    var styleName = toLowerFirst(camelize(name))

    var cssName = hyphenate(name)

    var theName = asStylePrefix ? styleName : cssName

    var thePrefix = prefixInfo.style
      ? asStylePrefix ? prefixInfo.style : prefixInfo.css
      : ''

    if (styleName in docStyle) {
      return config.asString ? theName : [theName]
    }

    // not a valid style name, so we'll return the value with a prefix

    var upperCased = theName
    var prefixProperty = prefixProperties[cssName]
    var result = []

    if (asStylePrefix) {
      upperCased = toUpperFirst(theName)
    }

    if (typeof prefixProperty === 'function') {
      var prefixedCss = prefixProperty(theName, thePrefix) || []
      if (prefixedCss && !Array.isArray(prefixedCss)) {
        prefixedCss = [prefixedCss]
      }

      if (prefixedCss.length) {
        prefixedCss = prefixedCss.map(function (property) {
          return asStylePrefix
            ? toLowerFirst(camelize(property))
            : hyphenate(property)
        })
      }

      result = result.concat(prefixedCss)
    }

    if (thePrefix) {
      result.push(thePrefix + upperCased)
    }

    result.push(theName)

    if (config.asString || result.length === 1) {
      return result[0]
    }

    return result
  }
}

},{"./prefixInfo":139,"./prefixProperties":140,"./stringUtils/camelize":142,"./stringUtils/hyphenate":144,"./stringUtils/toLowerFirst":146,"./stringUtils/toUpperFirst":147}],142:[function(_dereq_,module,exports){
var toCamelFn = function (str, letter) {
  return letter ? letter.toUpperCase() : ''
}

var hyphenRe = _dereq_('./hyphenRe')

module.exports = function (str) {
  return str ? str.replace(hyphenRe, toCamelFn) : ''
}

},{"./hyphenRe":143}],143:[function(_dereq_,module,exports){
module.exports = /[-\s]+(.)?/g

},{}],144:[function(_dereq_,module,exports){
var separate = _dereq_('./separate')

module.exports = function (name) {
  return separate(name).toLowerCase()
}

},{"./separate":145}],145:[function(_dereq_,module,exports){
var doubleColonRe = /::/g
var upperToLowerRe = /([A-Z]+)([A-Z][a-z])/g
var lowerToUpperRe = /([a-z\d])([A-Z])/g
var underscoreToDashRe = /_/g

module.exports = function (name, separator) {
  return name
    ? name
        .replace(doubleColonRe, '/')
        .replace(upperToLowerRe, '$1_$2')
        .replace(lowerToUpperRe, '$1_$2')
        .replace(underscoreToDashRe, separator || '-')
    : ''
}

},{}],146:[function(_dereq_,module,exports){
module.exports = function (value) {
  return value.length
    ? value.charAt(0).toLowerCase() + value.substring(1)
    : value
}

},{}],147:[function(_dereq_,module,exports){
module.exports = function (value) {
  return value.length
    ? value.charAt(0).toUpperCase() + value.substring(1)
    : value
}

},{}],148:[function(_dereq_,module,exports){
var cssPrefixFn = _dereq_('./cssPrefix')

var HYPHENATE = _dereq_('./stringUtils/hyphenate')
var CAMELIZE = _dereq_('./stringUtils/camelize')
var HAS_OWN = _dereq_('./hasOwn')
var IS_OBJECT = _dereq_('./isObject')
var IS_FUNCTION = _dereq_('./isFunction')

var applyPrefix = function (target, property, value, normalizeFn) {
  cssPrefixFn(property).forEach(function (p) {
    target[normalizeFn ? normalizeFn(p) : p] = value
  })
}

var toObject = function (str) {
  str = (str || '').split(';')

  var result = {}

  str.forEach(function (item) {
    var split = item.split(':')

    if (split.length === 2) {
      result[split[0].trim()] = split[1].trim()
    }
  })

  return result
}

var CONFIG = {
  cssUnitless: _dereq_('./cssUnitless')
}

function _notUndef (thing) {
  return thing !== null && thing !== undefined
}

/**
 * @ignore
 * @method toStyleObject
 * @param  {Object} styles The object to convert to a style object.
 * @param  {Object} [config]
 * @param  {Boolean} [config.addUnits=true] True if you want to add units when numerical values are encountered.
 * @param  {Object}  config.cssUnitless An object whose keys represent css numerical property names that will not be appended with units.
 * @param  {Object}  config.prefixProperties An object whose keys represent css property names that should be prefixed
 * @param  {String}  config.cssUnit='px' The css unit to append to numerical values. Defaults to 'px'
 * @param  {String}  config.normalizeName A function that normalizes a name to a valid css property name
 * @param  {String}  config.scope
 * @return {Object} The object, normalized with css style names
 */
var TO_STYLE_OBJECT = function (styles, config, prepend, result) {
  if (typeof styles === 'string') {
    styles = toObject(styles)
  }

  config = config || CONFIG

  config.cssUnitless = config.cssUnitless || CONFIG.cssUnitless

  result = result || {}

  var scope = config.scope || {}

  var addUnits = _notUndef(config.addUnits)
    ? config.addUnits
    : scope && _notUndef(scope.addUnits) ? scope.addUnits : true

  var cssUnitless =
    (_notUndef(config.cssUnitless)
      ? config.cssUnitless
      : scope ? scope.cssUnitless : null) || {}

  var cssUnit = (config.cssUnit || scope ? scope.cssUnit : null) || 'px'

  var prefixProperties =
    config.prefixProperties || (scope ? scope.prefixProperties : null) || {}

  var camelize = config.camelize

  var normalizeFn = camelize ? CAMELIZE : HYPHENATE

  var processed,
    styleName,
    propName,
    propValue,
    propType,
    propIsNumber,
    fnPropValue,
    prefix

  for (propName in styles) {
    if (HAS_OWN(styles, propName)) {
      propValue = styles[propName]

      // the hyphenated style name (css property name)
      styleName = HYPHENATE(prepend ? prepend + propName : propName)

      processed = false
      prefix = false

      if (IS_FUNCTION(propValue)) {
        // a function can either return a css value
        // or an object with { value, prefix, name }
        fnPropValue = propValue.call(
          scope || styles,
          propValue,
          propName,
          styleName,
          styles
        )

        if (IS_OBJECT(fnPropValue) && fnPropValue.value != null) {
          propValue = fnPropValue.value
          prefix = fnPropValue.prefix
          styleName = fnPropValue.name ? HYPHENATE(fnPropValue.name) : styleName
        } else {
          propValue = fnPropValue
        }
      }

      propType = typeof propValue
      propIsNumber =
        propType === 'number' ||
        (propType === 'string' &&
          propValue !== '' &&
          propValue * 1 === propValue)

      if (
        propValue === null ||
        propValue === undefined ||
        styleName === null ||
        styleName === undefined ||
        styleName === ''
      ) {
        continue
      }

      if (propIsNumber || propType === 'string') {
        processed = true
      }

      if (!processed && _notUndef(propValue.value) && propValue.prefix) {
        processed = true
        prefix = propValue.prefix
        propValue = propValue.value
      }

      // hyphenStyleName = camelize? HYPHENATE(styleName): styleName

      if (processed) {
        prefix = prefix || !!prefixProperties[styleName]

        if (propIsNumber) {
          propValue = addUnits && !(styleName in cssUnitless)
            ? propValue + cssUnit
            : propValue + '' // change it to a string, so that jquery does not append px or other units
        }

        // special border treatment
        if (
          (styleName === 'border' ||
            (!styleName.indexOf('border') &&
              !~styleName.indexOf('radius') &&
              !~styleName.indexOf('width'))) &&
          propIsNumber
        ) {
          styleName = styleName + '-width'
        }

        // special border radius treatment
        if (!styleName.indexOf('border-radius-')) {
          styleName.replace(/border(-radius)(-(.*))/, function (
            str,
            radius,
            theRest
          ) {
            var positions = {
              '-top': ['-top-left', '-top-right'],
              '-left': ['-top-left', '-bottom-left'],
              '-right': ['-top-right', '-bottom-right'],
              '-bottom': ['-bottom-left', '-bottom-right']
            }

            if (theRest in positions) {
              styleName = []

              positions[theRest].forEach(function (pos) {
                styleName.push('border' + pos + radius)
              })
            } else {
              styleName = 'border' + theRest + radius
            }
          })

          if (Array.isArray(styleName)) {
            styleName.forEach(function (styleName) {
              if (prefix) {
                applyPrefix(result, styleName, propValue, normalizeFn)
              } else {
                result[normalizeFn(styleName)] = propValue
              }
            })

            continue
          }
        }

        if (prefix) {
          applyPrefix(result, styleName, propValue, normalizeFn)
        } else {
          result[normalizeFn(styleName)] = propValue
        }
      } else {
        // the propValue must be an object, so go down the hierarchy
        TO_STYLE_OBJECT(propValue, config, styleName + '-', result)
      }
    }
  }

  return result
}

module.exports = TO_STYLE_OBJECT

},{"./cssPrefix":133,"./cssUnitless":134,"./hasOwn":135,"./isFunction":137,"./isObject":138,"./stringUtils/camelize":142,"./stringUtils/hyphenate":144}],149:[function(_dereq_,module,exports){
module.exports = parse

/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */

function parse (xml) {
  xml = xml.trim()

  // strip comments
  xml = xml.replace(/<!--[\s\S]*?-->/g, '')

  return document()

  /**
   * XML document.
   */

  function document () {
    return {
      declaration: declaration(),
      root: tag()
    }
  }

  /**
   * Declaration.
   */

  function declaration () {
    var m = match(/^<\?xml\s*/)
    if (!m) return

    // tag
    var node = {
      attributes: {}
    }

    // attributes
    while (!(eos() || is('?>'))) {
      var attr = attribute()
      if (!attr) return node
      node.attributes[attr.name] = attr.value
    }

    match(/\?>\s*/)

    return node
  }

  /**
   * Tag.
   */

  function tag () {
    var m = match(/^<([\w-:.]+)\s*/)
    if (!m) return

    // name
    var node = {
      name: m[1],
      attributes: {},
      children: []
    }

    // attributes
    while (!(eos() || is('>') || is('?>') || is('/>'))) {
      var attr = attribute()
      if (!attr) return node
      node.attributes[attr.name] = attr.value
    }

    // self closing tag
    if (match(/^\s*\/>\s*/)) {
      return node
    }

    match(/\??>\s*/)

    // content
    node.content = content()

    // children
    var child = tag()
    while (child) {
      node.children.push(child)
      child = tag()
    }

    // closing
    match(/^<\/[\w-:.]+>\s*/)

    return node
  }

  /**
   * Text content.
   */

  function content () {
    var m = match(/^([^<]*)/)
    if (m) return m[1]
    return ''
  }

  /**
   * Attribute.
   */

  function attribute () {
    var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/)
    if (!m) return
    return { name: m[1], value: strip(m[2]) }
  }

  /**
   * Strip quotes from `val`.
   */

  function strip (val) {
    return val.replace(/^['"]|['"]$/g, '')
  }

  /**
   * Match `re` and advance the string.
   */

  function match (re) {
    var m = xml.match(re)
    if (!m) return
    xml = xml.slice(m[0].length)
    return m
  }

  /**
   * End-of-source.
   */

  function eos () {
    return xml.length === 0
  }

  /**
   * Check for `prefix`.
   */

  function is (prefix) {
    return xml.indexOf(prefix) === 0
  }
}

},{}]},{},[11])(11)
});