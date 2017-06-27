/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Transitions = require('./Transitions')
var BasicUtils = require('./helpers/BasicUtils')
var ColorUtils = require('./helpers/ColorUtils')
var SVGPoints = require('./helpers/SVGPoints')
var functionToRFO = require('./reflection/functionToRFO')

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

  for (var ms in cluster) {
    var descriptor = cluster[ms]

    // Important: The ActiveComponent depends on the ability to be able to get fresh values via this option
    if (skipCache) {
      // Easiest way to skip the cache is just to make the destination object falsy
      this._parsees[timelineName][selector][outputName][ms] = null
    }

    // In case of a function, we can't cache - we have to recalc, and thus re-parse also
    if (isFunction(descriptor.value)) {
      // We have to recreate this cache object every time due to the need for function recalc
      this._parsees[timelineName][selector][outputName][ms] = {}
      if (descriptor.curve) {
        this._parsees[timelineName][selector][outputName][ms].curve =
          descriptor.curve
      }

      // Indicate to the downstream transition cache that this value came from a function and cannot be cached there.
      // See Transitions.js for info on how this gets handled
      this._parsees[timelineName][selector][outputName][ms].machine = true

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
        this._parsees[timelineName][selector][outputName][ms].value = PARSERS[
          outputName
        ](functionReturnValue)
      } else {
        this._parsees[timelineName][selector][outputName][
          ms
        ].value = functionReturnValue
      }
    } else {
      // In case of static values, we can cache - no need to re-parse static values if we already parsed them
      if (this._parsees[timelineName][selector][outputName][ms]) {
        continue
      }

      // If nothing in the cache, create the base cache object...
      this._parsees[timelineName][selector][outputName][ms] = {}
      if (descriptor.curve) {
        this._parsees[timelineName][selector][outputName][ms].curve =
          descriptor.curve
      }

      if (PARSERS[outputName]) {
        this._parsees[timelineName][selector][outputName][ms].value = PARSERS[
          outputName
        ](descriptor.value)
      } else {
        this._parsees[timelineName][selector][outputName][ms].value =
          descriptor.value
      }
    }
  }

  // Return the entire cached object - interpolation is done downstream
  return this._parsees[timelineName][selector][outputName]
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
