const unserValue = require('./unserValue')
const ensureTimelineProperty = require('./ensureTimelineProperty')
const TimelineProperty = require('./../TimelineProperty')

function isEmpty (val) {
  return val === undefined || val === null
}

module.exports = function createKeyframe (bytecode, componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValueGiven, keyframeCurve, keyframeEndMs, keyframeEndValue, hostInstance, inputValues) {
  const property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  // These are the *calculated* forms of the value
  const precedingValue = TimelineProperty.getPropertyValueAtTime(bytecode.timelines, timelineName, componentId, elementName, propertyName, keyframeStartMs - 1, hostInstance, inputValues)
  const currentValue = TimelineProperty.getPropertyValueAtTime(bytecode.timelines, timelineName, componentId, elementName, propertyName, keyframeStartMs, hostInstance, inputValues)

  // This is the actually assigned value specification object; we need this in case we have a function
  const precedingAssignedValueObject = TimelineProperty.getAssignedBaselineValueObject(componentId, elementName, propertyName, timelineName, keyframeStartMs - 1, bytecode)
  const precedingAssignedValue = precedingAssignedValueObject && precedingAssignedValueObject.value
  const currentAssignedValueObject = TimelineProperty.getAssignedBaselineValueObject(componentId, elementName, propertyName, timelineName, keyframeStartMs, bytecode)
  const currentAssignedValue = currentAssignedValueObject && currentAssignedValueObject.value

  // This is actually an upsert of sorts
  if (!property[keyframeStartMs]) property[keyframeStartMs] = {}

  let keyframeValue = keyframeValueGiven // <~ Can be (and usually is) undefined, in which case we use a fallback preceding/current

  // Successively attempt to populate the keyframe with various possibilities if the previous ones don't work
  if (isEmpty(keyframeValue)) {
    keyframeValue = currentAssignedValue
  }
  if (isEmpty(keyframeValue)) {
    keyframeValue = precedingAssignedValue
  }
  if (isEmpty(keyframeValue)) {
    keyframeValue = currentValue
  }
  if (isEmpty(keyframeValue)) {
    keyframeValue = precedingValue
  }

  // Don't forget this in case we got a function e.g. __function: {....} !
  keyframeValue = unserValue(keyframeValue)

  property[keyframeStartMs].value = keyframeValue

  if (keyframeCurve !== undefined && keyframeCurve !== null) {
    property[keyframeStartMs].curve = unserValue(keyframeCurve)
  }

  property[keyframeStartMs].edited = true

  if (keyframeEndMs !== undefined && keyframeEndMs !== null) {
    // This is actually an upsert of sorts
    if (!property[keyframeEndMs]) property[keyframeEndMs] = {}

    property[keyframeEndMs].value = unserValue(keyframeEndValue || keyframeValue)
    property[keyframeEndMs].edited = true
  }

  return property[keyframeStartMs]
}
