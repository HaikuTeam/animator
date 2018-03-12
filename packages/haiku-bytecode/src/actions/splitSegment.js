const ensureTimelineProperty = require('./ensureTimelineProperty')

// aka remove curve
module.exports = function splitSegment (bytecode, componentId, timelineName, elementName, propertyName, keyframeMs) {
  const property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  if (property[keyframeMs]) {
    const orig = property[keyframeMs]
    property[keyframeMs] = { value: orig.value }
    if (orig.edited) property[keyframeMs].edited = true
  }

  return property
}
