var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')

module.exports = function changeKeyframeValue (bytecode, componentId, timelineName, propertyName, keyframeMs, newValue) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)
  property[keyframeMs].value = unserValue(newValue)
  property[keyframeMs].edited = true
  return property
}
