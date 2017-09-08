var ensureTimeline = require('./ensureTimeline')

module.exports = function renameTimeline (bytecode, timelineNameOld, timelineNameNew) {
  var old = ensureTimeline(bytecode, timelineNameOld)
  if (timelineNameOld === timelineNameNew) return old
  if (bytecode.timelines[timelineNameNew]) return old
  bytecode.timelines[timelineNameNew] = old
  delete bytecode.timelines[timelineNameOld]
  return old
}
