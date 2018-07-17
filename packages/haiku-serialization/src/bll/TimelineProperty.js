const {getFallback} = require('@haiku/core/lib/HaikuComponent')
const logger = require('haiku-serialization/src/utils/LoggerInstance')

const TimelineProperty = {}

TimelineProperty.getSelectorForComponentId = (componentId) => {
  return 'haiku:' + componentId
}

TimelineProperty.addProperty = (
  timelinesObject,
  timelineName,
  componentId,
  elementName,
  outputName,
  startTime,
  startValue,
  curve,
  endTime,
  endValue
) => {
  const segmentsBase = TimelineProperty.findOrCreatePropertySegmentsBase(timelinesObject, timelineName, componentId, outputName)

  if (!segmentsBase[0] || segmentsBase[0].value === undefined) {
    segmentsBase[0] = {}
    segmentsBase[0].value = TimelineProperty.getFallbackValue(elementName, outputName, startValue)
  }

  const st = parseInt(startTime, 10)
  const startSeg = segmentsBase[st] || {}

  startSeg.value = startValue
  if (curve) startSeg.curve = curve
  startSeg.edited = true // Assigning edited ensures that auto-merged design updates don't clobber values changed by a human
  segmentsBase[st] = startSeg

  if (endTime) {
    const et = parseInt(endTime, 10)
    const endSeg = segmentsBase[et] || {}

    endSeg.value = endValue
    endSeg.edited = true
    segmentsBase[et] = endSeg
  }

  return [startValue, endValue]
}

TimelineProperty.getFallbackValue = (
  elementName,
  outputName,
  valueAssignedInThisOperation
) => {
  if (typeof elementName === 'object') {
    if (outputName in elementName.states) {
      return elementName.states[outputName].value
    }

    elementName = 'div' // otherwise try to fallback
  }

  const fallback = getFallback(elementName, outputName)

  if (fallback !== undefined) {
    return fallback
  }

  return valueAssignedInThisOperation
}

// The purpose of this is to get the value BEFORE the current keyframe.
// I.e. a value to transition FROM THE PREVIOUS to the CURRENT time.
// So let's say you ask for the baseline of 100. There is a keyframe at 100.
// Does it return the value at 100? NO. It returns the one BEFORE that.
// #FIXME -MT
TimelineProperty.getBaselineValue = (
  componentId,
  elementName,
  propertyName,
  timelineName,
  timelineTime,
  fallbackValue,
  bytecode,
  hostInstance
) => {
  const ms = TimelineProperty.getBaselineKeyframeStart(componentId, elementName, timelineName, propertyName, timelineTime, bytecode)
  return TimelineProperty.getComputedValue(componentId, elementName, propertyName, timelineName, ms, fallbackValue, bytecode, hostInstance)
}

TimelineProperty.getBaselineCurve = (
  componentId,
  elementName,
  propertyName,
  timelineName,
  timelineTime,
  fallbackValue,
  bytecode,
  hostInstance,
  states
) => {
  const ms = TimelineProperty.getAssignedBaselineKeyframeStart(componentId, elementName, timelineName, propertyName, timelineTime, bytecode)
  return TimelineProperty.getComputedCurve(componentId, elementName, propertyName, timelineName, ms, fallbackValue, bytecode, hostInstance, states)
}

TimelineProperty.getComputedCurve = (
  componentId,
  elementName,
  propertyName,
  timelineName,
  timelineTime,
  fallbackValue,
  bytecode,
  hostInstance,
  states
) => {
  if (!bytecode) return
  if (!bytecode.timelines) return
  return TimelineProperty.getPropertyCurveAtTime(bytecode.timelines, timelineName, componentId, elementName, propertyName, timelineTime, hostInstance, states)
}

TimelineProperty.getPropertyCurveAtTime = (
  timelinesObject,
  timelineName,
  componentId,
  elementName,
  outputName,
  time,
  hostInstance,
  states
) => {
  const propertiesGroup = TimelineProperty.getPropertiesBase(timelinesObject, timelineName, componentId)
  if (!propertiesGroup) return
  if (!propertiesGroup[outputName]) return
  if (!propertiesGroup[outputName][time]) return
  return propertiesGroup[outputName][time].curve
}

TimelineProperty.getComputedValue = (
  componentId,
  elementName,
  propertyName,
  timelineName,
  timelineTime,
  fallbackValue,
  bytecode,
  hostInstance
) => {
  if (!bytecode) return fallbackValue
  if (!bytecode.timelines) return fallbackValue
  const value = TimelineProperty.getPropertyValueAtTime(bytecode.timelines, timelineName, componentId, elementName, propertyName, timelineTime, hostInstance)
  return (value === undefined) ? fallbackValue : value
}

TimelineProperty.getPropertyValueAtTime = (
  timelinesObject,
  timelineName,
  componentId,
  elementName,
  outputName,
  time,
  hostInstance
) => {
  const propertiesGroup = TimelineProperty.getPropertiesBase(
    timelinesObject,
    timelineName,
    componentId
  )

  if (propertiesGroup) {
    try {
      if (hostInstance) {
        const computedValue = hostInstance.grabValue(
          timelineName,
          componentId,
          hostInstance.findElementsByHaikuId(componentId)[0],
          outputName, // propertyName
          propertiesGroup[outputName], // propertyValue
          time,
          !hostInstance.shouldPerformFullFlush(), // isPatchOperation
          true, // skipCache
        )

        if (computedValue !== undefined && computedValue !== null) {
          return computedValue
        }
        // Fall through to fallback if no computed value
      } else {
        logger.warn('[timeline property] host instance and value builder may be required to compute a value for ' + outputName)
      }
    } catch (exception) {
      logger.warn('[timeline property] unable to compute dynamic value for ' + timelineName + ' ' + componentId + ' ' + outputName + ' ' + time + ' [' + exception.message + ']')
    }
  }

  return TimelineProperty.getFallbackValue(elementName, outputName)
}

TimelineProperty.addPropertyGroup = (
  timelinesObject,
  timelineName,
  componentId,
  elementName,
  deltaGroup,
  startTime
) => {
  for (const outputName in deltaGroup) {
    const outputVal = deltaGroup[outputName]
    TimelineProperty.addProperty(timelinesObject, timelineName, componentId, elementName, outputName, startTime, outputVal)
  }
  return timelinesObject
}

/**
 * @function getPropertySegmentsBase
 * @description Return an object that contains all values for the given property output name.
 * e.g. { 0: { ... }, 100: { ... } }
 */
TimelineProperty.getPropertySegmentsBase = (
  timelinesObject,
  timelineName,
  componentId,
  outputName
) => {
  const selector = TimelineProperty.getSelectorForComponentId(componentId)
  if (!timelinesObject) return null
  if (!timelinesObject[timelineName]) return null
  if (!timelinesObject[timelineName][selector]) return null
  return timelinesObject[timelineName][selector][outputName]
}

/**
 * @function getPropertiesBase
 * @description Return an object that contains all values for the given property output name.
 * e.g. { position.x: { ... }, position.y: { ... } }
 */
TimelineProperty.getPropertiesBase = (timelinesObject, timelineName, componentId) => {
  const selector = TimelineProperty.getSelectorForComponentId(componentId)
  if (!timelinesObject) return null
  if (!timelinesObject[timelineName]) return null
  return timelinesObject[timelineName][selector]
}

TimelineProperty.findOrCreatePropertySegmentsBase = (timelinesObject, timelineName, componentId, outputName) => {
  const selector = TimelineProperty.getSelectorForComponentId(componentId)
  if (!timelinesObject[timelineName]) timelinesObject[timelineName] = {}
  if (!timelinesObject[timelineName][selector]) timelinesObject[timelineName][selector] = {}
  if (!timelinesObject[timelineName][selector][outputName]) timelinesObject[timelineName][selector][outputName] = {}
  return timelinesObject[timelineName][selector][outputName]
}

TimelineProperty.getValueGroup = (componentId, timelineName, propertyName, bytecode) => {
  const selector = TimelineProperty.getSelectorForComponentId(componentId)
  if (!bytecode) return null
  if (!bytecode.timelines) return null
  if (!bytecode.timelines[timelineName]) return null
  if (!bytecode.timelines[timelineName][selector]) return null
  return bytecode.timelines[timelineName][selector][propertyName]
}

TimelineProperty.mergeProperties = (oldGroup, newGroup) => {
  // New group gets precedence over the old
  for (const newPropName in newGroup) {
    const newProp = newGroup[newPropName]
    oldGroup[newPropName] = newProp
  }
}

TimelineProperty.getBaselineKeyframeStart = (
  componentId,
  elementName,
  timelineName,
  propertyName,
  timelineTime,
  bytecode
) => {
  let keyframeStart = 0

  const valueGroup = TimelineProperty.getValueGroup(componentId, timelineName, propertyName, bytecode)

  if (!valueGroup) return keyframeStart

  const mss = Object.keys(valueGroup).map((ms) => {
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
TimelineProperty.getAssignedBaselineKeyframeStart = (
  componentId,
  elementName,
  timelineName,
  propertyName,
  timelineTime,
  bytecode
) => {
  let keyframeStart = 0

  const valueGroup = TimelineProperty.getValueGroup(componentId, timelineName, propertyName, bytecode)

  if (!valueGroup) return keyframeStart

  const mss = Object.keys(valueGroup).map((ms) => {
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
TimelineProperty.getAssignedBaselineValueObject = (
  componentId,
  elementName,
  propertyName,
  timelineName,
  timelineTime,
  bytecode
) => {
  const ms = TimelineProperty.getAssignedBaselineKeyframeStart(componentId, elementName, timelineName, propertyName, timelineTime, bytecode)
  const keyframeGroup = TimelineProperty.getPropertySegmentsBase(bytecode.timelines, timelineName, componentId, propertyName)
  return keyframeGroup && keyframeGroup[ms]
}

TimelineProperty.getAssignedValueObject = (
  componentId,
  elementName,
  propertyName,
  timelineName,
  timelineTime,
  bytecode
) => {
  const keyframeGroup = TimelineProperty.getPropertySegmentsBase(bytecode.timelines, timelineName, componentId, propertyName)
  return keyframeGroup && keyframeGroup[timelineTime]
}

module.exports = TimelineProperty
