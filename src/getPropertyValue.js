module.exports = function getPropertyValue (bytecode, componentId, timelineName, timelineTime, propertyName) {
  if (!bytecode) return void (0)
  if (!bytecode.timelines) return void (0)
  if (!bytecode.timelines[timelineName]) return void (0)
  if (!bytecode.timelines[timelineName][`haiku:${componentId}`]) return void (0)
  if (!bytecode.timelines[timelineName][`haiku:${componentId}`][propertyName]) return void (0)
  if (!bytecode.timelines[timelineName][`haiku:${componentId}`][propertyName][timelineTime]) return void (0)
  return bytecode.timelines[timelineName][`haiku:${componentId}`][propertyName][timelineTime].value
}
