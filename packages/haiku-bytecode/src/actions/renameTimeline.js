const ensureTimeline = require('./ensureTimeline')

module.exports = function renameTimeline (bytecode, timelineNameOld, timelineNameNew) {
  const old = ensureTimeline(bytecode, timelineNameOld)
  if (timelineNameOld === timelineNameNew) return old
  if (bytecode.timelines[timelineNameNew]) return old
  bytecode.timelines[timelineNameNew] = old
  delete bytecode.timelines[timelineNameOld]
  return old
}
