module.exports = function upsertPropertyValue (bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy) {
  if (!strategy) strategy = 'merge'

  var haikuSelector = 'haiku:' + componentId

  if (!bytecode.timelines[timelineName][haikuSelector]) bytecode.timelines[timelineName][haikuSelector] = {}

  var defaultTimeline = bytecode.timelines[timelineName][haikuSelector]

  for (var propName in propertiesToMerge) {
    if (!defaultTimeline[propName]) defaultTimeline[propName] = {}
    if (!defaultTimeline[propName][timelineTime]) defaultTimeline[propName][timelineTime] = {}

    switch (strategy) {
      case 'merge':
        defaultTimeline[propName][timelineTime].value = propertiesToMerge[propName]
        break
      case 'assign':
        if (defaultTimeline[propName][timelineTime].value === undefined) defaultTimeline[propName][timelineTime].value = propertiesToMerge[propName]
        break
    }
  }
}
