const unserValue = require('./unserValue')
const ensureTimeline = require('./ensureTimeline')
const merge = require('lodash.merge')

module.exports = function createTimeline (bytecode, timelineName, timelineDescriptor) {
  const timeline = ensureTimeline(bytecode, timelineName)
  if (timelineDescriptor) merge(timeline, unserValue(timelineDescriptor))
  return timeline
}
