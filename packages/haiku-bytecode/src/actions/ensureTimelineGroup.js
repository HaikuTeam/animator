var ensureTimeline = require('./ensureTimeline')
var componentIdToSelector = require('./componentIdToSelector')

module.exports = function ensureTimelineGroup (bytecode, timelineName, componentId) {
  var timeline = ensureTimeline(bytecode, timelineName)
  var selector = componentIdToSelector(componentId)
  if (!timeline[selector]) {
    timeline[selector] = {}
  }
  return timeline[selector]
}
