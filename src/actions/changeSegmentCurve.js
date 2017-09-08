var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')

module.exports = function changeSegmentCurve (bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)
  property[keyframeMs].curve = unserValue(newCurve) // Curves are usually strings, but can be functions
  property[keyframeMs].edited = true
  return property
}
