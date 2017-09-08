var ensureTimelineProperty = require('./ensureTimelineProperty')

// Basically add a keyframe in the midst of a segment, but copy the previous one at the given position
// to the new one. Effectively a way to add a keyframe in the middle of a transition segment.

module.exports = function sliceSegment (bytecode, componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs) {
  var property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)
  var old = property[keyframeMs]
  property[sliceMs] = {
    curve: old.curve,
    value: old.value,
    edited: true
  }
  return property
}
