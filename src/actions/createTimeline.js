var unserValue = require('./unserValue')
var ensureTimeline = require('./ensureTimeline')
var merge = require('lodash.merge')

module.exports = function createTimeline (bytecode, timelineName, timelineDescriptor) {
  var timeline = ensureTimeline(bytecode, timelineName)
  if (timelineDescriptor) merge(timeline, unserValue(timelineDescriptor))
  return timeline
}
