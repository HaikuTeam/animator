var eachTimelineGroup = require('./eachTimelineGroup')

function eachKeyframeSegment (bytecodeObject, iteratee) {
  eachTimelineGroup(bytecodeObject, function (timelineGroup, selector) {
    var timelineOutputs = timelineGroup[selector]
    for (var outputName in timelineOutputs) {
      var keyframeGroup = timelineOutputs[outputName]
      for (var keyframeKey in keyframeGroup) {
        var keyframeSegment = keyframeGroup[keyframeKey]
        iteratee(keyframeSegment)
      }
    }
  })
}

module.exports = eachKeyframeSegment
