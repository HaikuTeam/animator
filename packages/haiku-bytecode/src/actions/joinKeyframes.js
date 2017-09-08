var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')

// I.e., make a curve out of two separate keyframes
module.exports = function joinKeyframes (bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)
  property[keyframeMsLeft].curve = unserValue(newCurve)
  return property
}
