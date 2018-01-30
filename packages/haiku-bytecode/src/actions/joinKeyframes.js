var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')

// I.e., make a curve out of two separate keyframes
module.exports = function joinKeyframes (bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  // May not be here due to a race condition with large projects
  if (property[keyframeMsLeft]) {
    property[keyframeMsLeft].curve = unserValue(newCurve)
  }

  return property
}
