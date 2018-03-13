const clone = require('lodash.clone')
const ensureTimeline = require('./ensureTimeline')
const createTimeline = require('./createTimeline')

module.exports = function duplicateTimeline (bytecode, timelineName) {
  const timeline = ensureTimeline(bytecode, timelineName)
  const duplicate = clone(timeline)
  const newName = timelineName + ' copy'
  createTimeline(bytecode, newName, duplicate) // This does 'unserValue' for us
  return newName
}
