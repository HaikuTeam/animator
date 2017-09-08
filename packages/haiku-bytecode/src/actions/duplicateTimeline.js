var clone = require('lodash.clone')
var ensureTimeline = require('./ensureTimeline')
var createTimeline = require('./createTimeline')

module.exports = function duplicateTimeline (bytecode, timelineName) {
  var timeline = ensureTimeline(bytecode, timelineName)
  var duplicate = clone(timeline)
  return createTimeline(bytecode, timelineName + ' copy', duplicate) // This does 'unserValue' for us
}
