const unserValue = require('./unserValue')
const ensureTimelineProperty = require('./ensureTimelineProperty')

module.exports = function changeSegmentCurve (bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve) {
  const property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)
  if (!property[keyframeMs]) property[keyframeMs] = {}
  property[keyframeMs].curve = unserValue(newCurve) // Curves are usually strings, but can be functions
  property[keyframeMs].edited = true
  return property
}
