var DOMSchema = require('@haiku/player/lib/properties/dom/schema')
var DOMFallbacks = require('@haiku/player/lib/properties/dom/fallbacks')
var computeNumericDelta = require('./computeNumericDelta')

// This module also "sort of" depends on @haiku/player/ValueBuilder even though the instance of that
// module is dependency injected as part of the getPropertyValueAtTime operation

function getSelectorForComponentId (componentId) {
  return 'haiku:' + componentId
}

function addProperty (timelinesObject, timelineName, componentId, elementName, outputName, startTime, startValue, curve, endTime, endValue) {
  var segmentsBase = findOrCreatePropertySegmentsBase(timelinesObject, timelineName, componentId, outputName)

  if (!segmentsBase[0] || segmentsBase[0].value === undefined) {
    segmentsBase[0] = {}
    segmentsBase[0].value = getFallbackValue(componentId, elementName, outputName, startValue)
  }

  var st = parseInt(startTime, 10)
  var startSeg = segmentsBase[st] || {}
  startSeg.value = startValue
  if (curve) startSeg.curve = curve
  startSeg.edited = true // Assigning edited ensures that auto-merged design updates don't clobber values changed by a human
  segmentsBase[st] = startSeg

  if (endTime) {
    var et = parseInt(endTime, 10)
    var endSeg = segmentsBase[et] || {}
    endSeg.value = endValue
    endSeg.edited = true
    segmentsBase[et] = endSeg
  }

  return [startValue, endValue]
}

function getFallbackValue (componentId, elementName, outputName, valueAssignedInThisOperation) {
  if (typeof elementName === 'object') {
    if (outputName in elementName.states) return elementName.states[outputName].value
    elementName = 'div' // otherwise try to fallback
  }

  var schema = DOMSchema[elementName]

  if (!schema) {
    // If we don't have a value at 0, and if we are lacking an element spec, use whatever value
    // is assigned for the next keyframe (i.e. a constant segment)
    console.warn('[bytecode] element missing fallback specification; using assignment value')
    return valueAssignedInThisOperation
  }

  var fallback = DOMFallbacks[elementName]

  // If no property by this name, no choice but undefined
  if (!fallback) {
    console.warn('[bytecode] element fallback missing for element ' + elementName)
    return void (0)
  }

  return fallback[outputName]
}

function addPropertyDelta (timelinesObject, timelineName, componentId, elementName, outputName, startTime, deltaValue, hostInstance, states) {
  var currentValue = getPropertyValueAtTime(timelinesObject, timelineName, componentId, elementName, outputName, startTime, hostInstance, states)
  var updatedValue = computeNumericDelta(currentValue, deltaValue, function (prev, next) { return prev + next })
  return addProperty(timelinesObject, timelineName, componentId, elementName, outputName, startTime, updatedValue, undefined, undefined, undefined)
}

function addPropertyGroupDelta (timelinesObject, timelineName, componentId, elementName, deltaGroup, startTime, hostInstance, states) {
  for (var outputName in deltaGroup) {
    var outputVal = deltaGroup[outputName]
    addPropertyDelta(timelinesObject, timelineName, componentId, elementName, outputName, startTime, outputVal, hostInstance, states)
  }
  return timelinesObject
}

// The purpose of this is to get the value BEFORE the current keyframe.
// I.e. a value to transition FROM THE PREVIOUS to the CURRENT time.
// So let's say you ask for the baseline of 100. There is a keyframe at 100.
// Does it return the value at 100? NO. It returns the one BEFORE that.
// #FIXME -MT
function getBaselineValue (componentId, elementName, propertyName, timelineName, timelineTime, fallbackValue, bytecode, hostInstance, states) {
  var ms = getBaselineKeyframeStart(componentId, elementName, timelineName, propertyName, timelineTime, bytecode)
  return getComputedValue(componentId, elementName, propertyName, timelineName, ms, fallbackValue, bytecode, hostInstance, states)
}

function getComputedValue (componentId, elementName, propertyName, timelineName, timelineTime, fallbackValue, bytecode, hostInstance, states) {
  if (!bytecode) return fallbackValue
  if (!bytecode.timelines) return fallbackValue
  var value = getPropertyValueAtTime(bytecode.timelines, timelineName, componentId, elementName, propertyName, timelineTime, hostInstance, states)
  return (value === undefined) ? fallbackValue : value
}

function getPropertyValueAtTime (timelinesObject, timelineName, componentId, elementName, outputName, time, hostInstance, states) {
  var propertiesGroup = getPropertiesBase(timelinesObject, timelineName, componentId)

  if (propertiesGroup) {
    try {
      // The hostInstance, which should be a HaikuPlayer, should have a 'ValueBuilder' attached to it under the property name 'builder'
      // This instance is responsible for dependency injection, caching, and recalc of transitioning values on the fly. (Pardon the dumb name.)
      if (hostInstance && hostInstance._builder) {
        var computedValue = hostInstance._builder.grabValue(
          timelineName,
          componentId,
          hostInstance._findElementsByHaikuId(componentId)[0],
          outputName, // propertyName
          propertiesGroup,
          time,
          hostInstance, // haikuComponent
          false, // isPatchOperation
          true, // skipCache,
          true // clearSortedKeyframesCache
        )

        if (computedValue !== undefined && computedValue !== null) {
          return computedValue
        }
        // Fall through to fallback if no computed value
      } else {
        console.warn('[bytecode] host instance and value builder may be required to compute a value for ' + outputName)
      }
    } catch (exception) {
      // console.error(exception)
      console.warn('[bytecode] unable to compute dynamic value for ' + timelineName + ' ' + componentId + ' ' + outputName + ' ' + time + ' [' + exception.message + ']')
    }
  }

  return getFallbackValue(componentId, elementName, outputName)
}

function addPropertyGroup (timelinesObject, timelineName, componentId, elementName, deltaGroup, startTime) {
  for (var outputName in deltaGroup) {
    var outputVal = deltaGroup[outputName]
    addProperty(timelinesObject, timelineName, componentId, elementName, outputName, startTime, outputVal)
  }
  return timelinesObject
}

/**
 * @function getPropertySegmentsBase
 * @description Return an object that contains all values for the given property output name.
 * e.g. { 0: { ... }, 100: { ... } }
 */
function getPropertySegmentsBase (timelinesObject, timelineName, componentId, outputName) {
  const selector = getSelectorForComponentId(componentId)
  if (!timelinesObject[timelineName]) return null
  if (!timelinesObject[timelineName][selector]) return null
  return timelinesObject[timelineName][selector][outputName]
}

/**
 * @function getPropertiesBase
 * @description Return an object that contains all values for the given property output name.
 * e.g. { position.x: { ... }, position.y: { ... } }
 */
function getPropertiesBase (timelinesObject, timelineName, componentId) {
  const selector = getSelectorForComponentId(componentId)
  if (!timelinesObject[timelineName]) return null
  return timelinesObject[timelineName][selector]
}

function findOrCreatePropertySegmentsBase (timelinesObject, timelineName, componentId, outputName) {
  const selector = getSelectorForComponentId(componentId)
  if (!timelinesObject[timelineName]) timelinesObject[timelineName] = {}
  if (!timelinesObject[timelineName][selector]) timelinesObject[timelineName][selector] = {}
  if (!timelinesObject[timelineName][selector][outputName]) timelinesObject[timelineName][selector][outputName] = {}
  return timelinesObject[timelineName][selector][outputName]
}

function getValueGroup (componentId, timelineName, propertyName, bytecode) {
  const selector = getSelectorForComponentId(componentId)
  if (!bytecode) return null
  if (!bytecode.timelines) return null
  if (!bytecode.timelines[timelineName]) return null
  if (!bytecode.timelines[timelineName][selector]) return null
  return bytecode.timelines[timelineName][selector][propertyName]
}

function mergeProperties (oldGroup, newGroup) {
  // New group gets precedence over the old
  for (var newPropName in newGroup) {
    var newProp = newGroup[newPropName]
    oldGroup[newPropName] = newProp
  }
}

function getBaselineKeyframeStart (componentId, elementName, timelineName, propertyName, timelineTime, bytecode) {
  let keyframeStart = 0
  const valueGroup = getValueGroup(componentId, timelineName, propertyName, bytecode)
  if (!valueGroup) return keyframeStart
  var mss = Object.keys(valueGroup).map((ms) => {
    return parseInt(ms, 10)
  })
  mss.forEach((ms, index) => {
    if (ms < timelineTime && ms > keyframeStart) {
      keyframeStart = ms
    }
  })
  return keyframeStart
}

// The only difference between this and the above is the <= instead of the <.
// This is really just a custom value provider for the getAssignedBaselineValueObject method.
// #LEGACY / #FIXME
function getAssignedBaselineKeyframeStart (componentId, elementName, timelineName, propertyName, timelineTime, bytecode) {
  let keyframeStart = 0
  const valueGroup = getValueGroup(componentId, timelineName, propertyName, bytecode)
  if (!valueGroup) return keyframeStart
  var mss = Object.keys(valueGroup).map((ms) => {
    return parseInt(ms, 10)
  })
  mss.forEach((ms, index) => {
    if (ms <= timelineTime && ms > keyframeStart) {
      keyframeStart = ms
    }
  })
  return keyframeStart
}

// This is specifically used in the Timeline for retrieving the expression forumla object
// Note that it uses a different method to figure out the keyframe start point than the
// other methods in this file. #FIXME
function getAssignedBaselineValueObject (componentId, elementName, propertyName, timelineName, timelineTime, bytecode) {
  var ms = getAssignedBaselineKeyframeStart(componentId, elementName, timelineName, propertyName, timelineTime, bytecode)
  var keyframeGroup = getPropertySegmentsBase(bytecode.timelines, timelineName, componentId, propertyName)
  return keyframeGroup && keyframeGroup[ms]
}

function getAssignedValueObject (componentId, elementName, propertyName, timelineName, timelineTime, bytecode) {
  var keyframeGroup = getPropertySegmentsBase(bytecode.timelines, timelineName, componentId, propertyName)
  return keyframeGroup && keyframeGroup[timelineTime]
}

module.exports = {
  addProperty: addProperty, // none needed
  addPropertyGroup: addPropertyGroup, // none needed

  findOrCreatePropertySegmentsBase: findOrCreatePropertySegmentsBase, // none needed
  mergeProperties: mergeProperties, // none needed

  getAssignedValueObject: getAssignedValueObject, // none needed
  getAssignedBaselineValueObject: getAssignedBaselineValueObject, // none needed
  getBaselineKeyframeStart: getBaselineKeyframeStart, // none needed
  getAssignedBaselineKeyframeStart: getAssignedBaselineKeyframeStart, // none needed
  getPropertySegmentsBase: getPropertySegmentsBase, // none needed
  getValueGroup: getValueGroup, // none needed

  addPropertyDelta: addPropertyDelta, // may require a hostInstance, states
  addPropertyGroupDelta: addPropertyGroupDelta, // may require a hostInstance, states

  getBaselineValue: getBaselineValue, // may require a hostInstance, states
  getComputedValue: getComputedValue, // may require a hostInstance, states
  getPropertyValueAtTime: getPropertyValueAtTime // may require a hostInstance, states
}
