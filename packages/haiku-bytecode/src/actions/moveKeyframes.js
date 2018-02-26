var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')

// This clears off all old properties and basically replaces them with the keyframe moves object.

module.exports = function moveKeyframes (bytecode, componentId, timelineName, propertyName, keyframeMoves) {
  let property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)

  for (var oldMs in property) {
    delete property[oldMs]
  }

  // We might have received this over the wire, so we need to create reified functions out of serialized ones
  keyframeMoves = unserValue(keyframeMoves)

  for (var newMs in keyframeMoves) {
    property[newMs] = keyframeMoves[newMs]
  }

  return property
}
