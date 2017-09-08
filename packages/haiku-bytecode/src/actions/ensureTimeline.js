module.exports = function ensureTimeline (bytecode, timelineName) {
  if (!bytecode.timelines) {
    bytecode.timelines = {}
  }
  if (!bytecode.timelines[timelineName]) {
    bytecode.timelines[timelineName] = {}
  }
  return bytecode.timelines[timelineName]
}
