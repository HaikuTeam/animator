/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Transitions = require('./Transitions')
var BasicUtils = require('./helpers/BasicUtils')
var ColorUtils = require('./helpers/ColorUtils')
var SVGPoints = require('./helpers/SVGPoints')
var functionToRFO = require('./reflection/functionToRFO')
var DOMProperties = require('./properties/dom/properties')
var assign = require('./vendor/assign')

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

var INJECTABLES = {}

if (typeof window !== 'undefined') {
  INJECTABLES['$window'] = {
    schema: {
      width: 'number',
      height: 'number',
      screen: {
        availHeight: 'number',
        availLeft: 'number',
        availWidth: 'number',
        colorDepth: 'number',
        height: 'number',
        pixelDepth: 'number',
        width: 'number',
        orientation: {
          angle: 'number',
          type: 'string'
        }
      },
      navigator: {
        userAgent: 'string',
        appCodeName: 'string',
        appName: 'string',
        appVersion: 'string',
        cookieEnabled: 'boolean',
        doNotTrack: 'boolean',
        language: 'string',
        maxTouchPoints: 'number',
        onLine: 'boolean',
        platform: 'string',
        product: 'string',
        vendor: 'string'
      },
      document: {
        charset: 'string',
        compatMode: 'string',
        contentType: 'string',
        cookie: 'string',
        documentURI: 'string',
        fullscreen: 'boolean',
        readyState: 'number',
        referrer: 'string',
        title: 'string'
      },
      location: {
        hash: 'string',
        host: 'string',
        hostname: 'string',
        href: 'string',
        pathname: 'string',
        protocol: 'string',
        search: 'string'
      }
    },
    summon: function (out, summonSpec) {
      out.width = window.innerWidth
      out.height = window.innerHeight
      if (window.screen) {
        if (!out.screen) out.screen = {}
        out.screen.availHeight = window.screen.availHeight
        out.screen.availLeft = window.screen.availLeft
        out.screen.availWidth = window.screen.availWidth
        out.screen.colorDepth = window.screen.colorDepth
        out.screen.height = window.screen.height
        out.screen.pixelDepth = window.screen.pixelDepth
        out.screen.width = window.screen.width
        if (window.screen.orientation) {
          if (!out.screen.orientation) out.screen.orientation = {}
          out.screen.orientation.angle = window.screen.orientation.angle
          out.screen.orientation.type = window.screen.orientation.type
        }
      }
      if (typeof navigator !== 'undefined') {
        if (!out.navigator) out.navigator = {}
        out.navigator.userAgent = navigator.userAgent
        out.navigator.appCodeName = navigator.appCodeName
        out.navigator.appName = navigator.appName
        out.navigator.appVersion = navigator.appVersion
        out.navigator.cookieEnabled = navigator.cookieEnabled
        out.navigator.doNotTrack = navigator.doNotTrack
        out.navigator.language = navigator.language
        out.navigator.maxTouchPoints = navigator.maxTouchPoints
        out.navigator.onLine = navigator.onLine
        out.navigator.platform = navigator.platform
        out.navigator.product = navigator.product
        out.navigator.userAgent = navigator.userAgent
        out.navigator.vendor = navigator.vendor
      }
      if (window.document) {
        if (!out.document) out.document = {}
        out.document.charset = window.document.charset
        out.document.compatMode = window.document.compatMode
        out.document.contenttype = window.document.contentType
        out.document.cookie = window.document.cookie
        out.document.documentURI = window.document.documentURI
        out.document.fullscreen = window.document.fullscreen
        out.document.readyState = window.document.readyState
        out.document.referrer = window.document.referrer
        out.document.title = window.document.title
      }
      if (window.location) {
        if (!out.location) out.location = {}
        out.location.hash = window.location.hash
        out.location.host = window.location.host
        out.location.hostname = window.location.hostname
        out.location.href = window.location.href
        out.location.pathname = window.location.pathname
        out.location.protocol = window.location.protocol
        out.location.search = window.location.search
      }
    }
  }
}

if (typeof global !== 'undefined') {
  INJECTABLES['$global'] = {
    schema: {
      process: {
        pid: 'number',
        arch: 'string',
        platform: 'string',
        argv: ['string'],
        title: 'string',
        version: 'string',
        env: {} // Worth explicitly numerating these? #QUESTION
      }
    },
    summon: function (out, summonSpec) {
      if (typeof process !== 'undefined') {
        if (!out.process) out.process = {}
        out.process.pid = process.pid
        out.process.arch = process.arch
        out.process.platform = process.platform
        out.process.argv = process.argv
        out.process.title = process.title
        out.process.version = process.version
        out.process.env = process.env
      }
    }
  }
}

INJECTABLES['$player'] = {
  schema: {
    version: 'string',
    options: {
      seed: 'string',
      loop: 'boolean',
      sizing: 'string',
      preserve3d: 'boolean',
      position: 'string',
      overflowX: 'string',
      overflowY: 'string'
    },
    timeline: {
      name: 'string',
      duration: 'number',
      repeat: 'boolean',
      time: {
        apparent: 'number',
        elapsed: 'number',
        max: 'number'
      },
      frame: {
        apparent: 'number',
        elapsed: 'number'
      }
    },
    clock: {
      frameDuration: 'number',
      frameDelay: 'number',
      time: {
        apparent: 'number',
        elapsed: 'number'
      }
    }
  },
  summon: function (out, summonSpec, hostInstance, matchingElement, timelineName) {
    out.version = hostInstance._context.PLAYER_VERSION
    var options = hostInstance._context.config.options
    if (options) {
      if (!out.options) out.options = {}
      out.options.seed = options.seed
      out.options.loop = options.loop
      out.options.sizing = options.sizing
      out.options.preserve3d = options.preserve3d
      out.options.position = options.position
      out.options.overflowX = options.overflowX
      out.options.overflowY = options.overflowY
    }
    var timelineInstance = hostInstance.getTimeline(timelineName)
    if (timelineInstance) {
      if (!out.timeline) out.timeline = {}
      out.timeline.name = timelineName
      out.timeline.duration = timelineInstance.getDuration()
      out.timeline.repeat = timelineInstance.getRepeat()
      if (!out.timeline.time) out.timeline.time = {}
      out.timeline.apparent = timelineInstance.getTime()
      out.timeline.elapsed = timelineInstance.getElapsedTime()
      out.timeline.max = timelineInstance.getMaxTime()
      if (!out.timeline.frame) out.timeline.frame = {}
      out.timeline.frame.apparent = timelineInstance.getFrame()
      out.timeline.frame.elapsed = timelineInstance.getUnboundedFrame()
    }
    var clockInstance = hostInstance.getClock()
    if (clockInstance) {
      if (!out.clock) out.clock = {}
      out.clock.frameDuration = clockInstance.options.frameDuration
      out.clock.frameDelay = clockInstance.options.frameDelay
      if (!out.clock.time) out.clock.time = {}
      out.clock.time.apparent = clockInstance.getExplicitTime()
      out.clock.time.elapsed = clockInstance.getRunningTime()
    }
  }
}

var EVENT_SCHEMA = {
  mouse: {
    x: 'number',
    y: 'number',
    isDown: 'boolean'
  },
  touches: [{
    x: 'number',
    y: 'number'
  }],
  mouches: [{
    x: 'number',
    y: 'number'
  }],
  keys: [{
    which: 'number',
    code: 'number' // alias for 'which'
  }]
  // TODO:
  // accelerometer
  // compass
  // mic
  // camera
}

var ELEMENT_SCHEMA = {
  // A function in the schema indicates that schema is dynamic, dependent on some external information
  properties: function (element) {
    var defined = DOMProperties[element.elementName]
    if (!defined) {
      console.warn('[haiku player] element ' + element.elementName + ' has no properties defined')
      return {}
    }
    if (!defined.addressableProperties) {
      console.warn('[haiku player] element ' + element.elementName + ' has no addressable properties defined')
      return {}
    }
    var addressables = defined.addressableProperties
    var properties = {}
    for (var key in addressables) {
      // Right now the addressable.typedefs known in the addressables file are either number, string, or any.
      // I.e. No 'object' or 'array' types but we may find them in the future and need to conver them into [], {}
      properties[key] = addressables[key].typedef
    }
    return properties
  },
  bbox: {
    x: 'number',
    y: 'number',
    width: 'number',
    height: 'number'
  },
  rect: {
    left: 'number',
    right: 'number',
    top: 'number',
    bottom: 'number',
    width: 'number',
    height: 'number'
  },
  events: EVENT_SCHEMA
}

// (top-level Element of a given component, (i.e. tranverse tree upward past groups but
// stop at first component definition))
INJECTABLES['$component'] = {
  schema: ELEMENT_SCHEMA,
  summon: function (out, summonSpec, hostInstance, matchingElement) {

  }
}

// absolute root of component tree (but does not traverse host codebase DOM)
// i.e. if Haiku components are nested. Until we support nested components,
// $root will be the same as $component
INJECTABLES['$root'] = {
  schema: ELEMENT_SCHEMA,
  summon: function (out, summonSpec, hostInstance, matchingElement) {

  }
}

INJECTABLES['$tree'] = {
  schema: {
    parent: ELEMENT_SCHEMA,
    children: [ELEMENT_SCHEMA],
    siblings: [ELEMENT_SCHEMA],
    component: ELEMENT_SCHEMA,
    root: ELEMENT_SCHEMA, // root at runtime
    element: ELEMENT_SCHEMA // same as $element
  },
  summon: function (out, summonSpec, hostInstance, matchingElement) {

  }
}

INJECTABLES['$element'] = {
  schema: ELEMENT_SCHEMA,
  summon: function (out, summonSpec, hostInstance, matchingElement) {

  }
}

INJECTABLES['$flow'] = {
  schema: {
    repeat: {
      list: ['any'],
      index: 'number',
      value: 'any',
      data: 'any', // alias for value
      payload: 'any' // alias for payload
    },
    'if': {
      value: 'any',
      data: 'any', // alias for value
      payload: 'any' // alias for payload
    },
    'yield': {
      value: 'any',
      data: 'any', // alias for value
      payload: 'any' // alias for payload
    },
    placeholder: {
      node: 'any' // The injected element?
    },
    insert: {
      node: 'any' // The injected element?
    }
  },
  summon: function (out, summonSpec, hostInstance, matchingElement) {

  }
}

INJECTABLES['$user'] = {
  schema: assign({}, EVENT_SCHEMA, {
    idle: 'number' // time without any new event
  }),
  summon: function (out, summonSpec, hostInstance, matchingElement) {

  }
}

// * **$helpers**
//     * _ (side-effect-free lodash subset)
//     * **random** (can init/config w/ seed)
//     * **time** (alias date, alias datetime — probably use momentjs or similar for API niceness)
//         * now
//         * today
//     * [FUTURE:  'registerHelper” from lifecycle events]
// INJECTABLES['$helpers'] = {
//   summon: function (out, summonSpec, hostInstance, matchingElement) {

//   }
// }

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
  flexId
) {
  if (this._parsees[timelineName]) this._parsees[timelineName][flexId] = {}
  return this
}

ValueBuilder.prototype.evaluate = function _evaluate (
  fn,
  timelineName,
  flexId,
  matchingElement,
  propertyName,
  keyframeMs,
  keyframeCluster,
  hostInstance
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
    evaluation = fn.call(hostInstance, hostInstance._states)
  } else if (!Array.isArray(fn.specification.params)) {
    // If for some reason we got a non-array params, just evaluate
    evaluation = fn.call(hostInstance, hostInstance._states)
  } else if (fn.specification.params.length < 1) {
    // If for some reason we got 0 params, just evaluate it
    evaluation = fn.call(hostInstance, hostInstance._states)
  } else {
    var summons = fn.specification.params[0] // For now, ignore all subsequent arguments

    if (!summons || typeof summons !== 'object') {
      // If the summon isn't in the destructured object format, just evaluate it
      evaluation = fn.call(hostInstance, hostInstance._states)
    } else {
      var summonees = this.summonSummonables(
        summons,
        timelineName,
        flexId,
        matchingElement,
        propertyName,
        keyframeMs,
        keyframeCluster,
        hostInstance
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
  flexId,
  matchingElement,
  propertyName,
  keyframeMs,
  keyframeCluster,
  hostInstance
) {
  var summonables = {}

  for (var key in summons) {
    // If the summons structure has a falsy, just skip it - I don't see why how this could happen, but just in case
    if (!summons[key]) continue

    // If a special summonable has been defined, then call its summoner function
    // Note the lower-case - allow lo-coders to comfortably call say $FRAME and $frame and get the same thing back
    if (INJECTABLES[key.toLowerCase()]) {
      // We'll create the object to be populated. This is to make a future optimization easier for avoiding garbage.
      if (!summonables[key]) summonables[key] = {}

      // But don't lowercase the assignment - otherwise the object destructuring won't work!!!
      INJECTABLES[key].summon(
        summonables[key], // <~ This arg is populated with the data; it is the var 'out' in the summon function
        summons[key],
        hostInstance,
        matchingElement,
        timelineName
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

ValueBuilder.prototype._getSummonablesSchema = function _getSummonablesSchema () {
  var schema = {}
  for (var key in INJECTABLES) {
    schema[key] = INJECTABLES[key].schema
  }
  return schema
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
  flexId,
  matchingElement,
  outputName,
  cluster,
  hostInstance,
  isPatchOperation,
  skipCache
) {
  // Establish the cache objects for this properties group within this timeline
  if (!this._parsees[timelineName]) this._parsees[timelineName] = {}
  if (!this._parsees[timelineName][flexId]) {
    this._parsees[timelineName][flexId] = {}
  }
  if (!this._parsees[timelineName][flexId][outputName]) {
    this._parsees[timelineName][flexId][outputName] = {}
  }

  var parsee = this._parsees[timelineName][flexId][outputName]

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
        flexId,
        matchingElement,
        outputName,
        ms,
        cluster,
        hostInstance
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
  flexId,
  matchingElement,
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
  flexId,
  matchingElement,
  outputName,
  outputValue
) {
  var answer = false
  if (!this._changes[timelineName]) {
    this._changes[timelineName] = {}
    answer = true
  }
  if (!this._changes[timelineName][flexId]) {
    this._changes[timelineName][flexId] = {}
    answer = true
  }
  if (
    this._changes[timelineName][flexId][outputName] === undefined ||
    this._changes[timelineName][flexId][outputName] !== outputValue
  ) {
    this._changes[timelineName][flexId][outputName] = outputValue
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
  flexId,
  matchingElement,
  propertiesGroup,
  isPatchOperation,
  haikuComponent
) {
  for (var propertyName in propertiesGroup) {
    var finalValue = this.grabValue(
      timelineName,
      flexId,
      matchingElement,
      propertyName,
      propertiesGroup,
      timelineTime,
      haikuComponent,
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
      this.didChangeValue(timelineName, flexId, matchingElement, propertyName, finalValue)
    ) {
      if (out[propertyName] === undefined) {
        out[propertyName] = finalValue
      } else {
        out[propertyName] = BasicUtils.mergeValue(
          out[propertyName],
          finalValue
        )
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
 * @param flexId {String} Identifier of the matching element
 * @param matchingElement {Object} The matching element
 * @param propertyName {String} Name of the property being grabbed, e.g. position.x
 * @param propertiesGroup {Object} The full timeline properties group, e.g. { position.x: ..., position.y: ... }
 * @param timelineTime {Number} The current time (in ms) that the given timeline is at
 * @param haikuComponent {Object} Instance of HaikuPlayer
 * @param isPatchOperation {Boolean} Is this a patch?
 * @param skipCache {Boolean} Skip caching?
 */
ValueBuilder.prototype.grabValue = function _grabValue (
  timelineName,
  flexId,
  matchingElement,
  propertyName,
  propertiesGroup,
  timelineTime,
  haikuComponent,
  isPatchOperation,
  skipCache
) {
  var parsedValueCluster = this.fetchParsedValueCluster(
    timelineName,
    flexId,
    matchingElement,
    propertyName,
    propertiesGroup[propertyName],
    haikuComponent,
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
    flexId,
    matchingElement,
    propertyName,
    computedValueForTime
  )

  return finalValue
}

ValueBuilder.INJECTABLES = INJECTABLES
ValueBuilder.PARSERS = PARSERS
ValueBuilder.GENERATORS = GENERATORS

module.exports = ValueBuilder
