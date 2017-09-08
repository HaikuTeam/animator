var unserValue = require('./unserValue')
var ensureTimelineProperty = require('./ensureTimelineProperty')

// Unlike 'moveSegmentEndpoints' which treats the input as a UI movement command, this function is less forgiving
// and assumes that the change has already occurred and that the data is ready to be mutated in place.

// This clears off all old properties and basically replaces them with the keyframe moves object.
// Really this method is best used in tandem with a method like 'moveSegmentEndpoints' which will
// RETURN a keyframeMoves object that could be fed into this method!

module.exports = function moveKeyframes (bytecode, componentId, timelineName, propertyName, keyframeMoves, frameInfo) {
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
