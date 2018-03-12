const unserValue = require('./unserValue')
const ensureTimelineProperty = require('./ensureTimelineProperty')

module.exports = function moveKeyframes (bytecode, keyframeMoves) {
  for (const timelineName in keyframeMoves) {
    for (const componentId in keyframeMoves[timelineName]) {
      for (const propertyName in keyframeMoves[timelineName][componentId]) {
        // We might have received this over the wire, so we need to create reified functions out of serialized ones
        const keyframeMove = unserValue(keyframeMoves[timelineName][componentId][propertyName])

        const propertyObject = ensureTimelineProperty(
          bytecode,
          timelineName,
          componentId,
          propertyName
        )

        for (const oldMs in propertyObject) {
          delete propertyObject[oldMs]
        }

        for (const newMs in keyframeMove) {
          propertyObject[newMs] = keyframeMove[newMs]
          propertyObject[newMs].edited = true
        }
      }
    }
  }
}
