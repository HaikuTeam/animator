const ensureTimeline = require('./ensureTimeline')
const componentIdToSelector = require('./componentIdToSelector')

module.exports = function ensureTimelineGroup (bytecode, timelineName, componentId) {
  const timeline = ensureTimeline(bytecode, timelineName)
  const selector = componentIdToSelector(componentId)

  if (!timeline[selector]) {
    timeline[selector] = {}
  }

  return timeline[selector]
}
