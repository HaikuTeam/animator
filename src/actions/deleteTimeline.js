module.exports = function deleteTimeline (bytecode, timelineName) {
  if (bytecode.timelines) delete bytecode.timelines[timelineName]
  return bytecode.timelines
}
