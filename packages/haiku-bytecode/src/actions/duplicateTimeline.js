var clone = require('lodash.clone')
var ensureTimeline = require('./ensureTimeline')
var createTimeline = require('./createTimeline')

module.exports = function duplicateTimeline (bytecode, timelineName) {
  var timeline = ensureTimeline(bytecode, timelineName)
  var duplicate = clone(timeline)
  var newName = timelineName + ' copy'
  createTimeline(bytecode, newName, duplicate) // This does 'unserValue' for us
  return newName
}
