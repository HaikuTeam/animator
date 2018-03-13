const unserValue = require('./unserValue')
const ensureTimelineProperty = require('./ensureTimelineProperty')

// I.e., make a curve out of two separate keyframes
module.exports = function joinKeyframes (bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve) {
  const property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  // May not be here due to a race condition with large projects
  if (property[keyframeMsLeft]) {
    property[keyframeMsLeft].curve = unserValue(newCurve)
    property[keyframeMsLeft].edited = true
  }

  return property
}
