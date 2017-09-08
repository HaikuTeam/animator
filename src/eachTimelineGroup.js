function eachTimelineGroup (bytecodeObject, iteratee) {
  for (var timelineName in bytecodeObject.timelines) {
    var timelineGroup = bytecodeObject.timelines[timelineName]
    for (var selector in timelineGroup) {
      iteratee(timelineGroup, selector)
    }
  }
}

module.exports = eachTimelineGroup
