module.exports = function changePlaybackSpeed (bytecode, framesPerSecond) {
  if (!bytecode.options) bytecode.options = {}
  bytecode.options.fps = Math.round(parseInt(framesPerSecond, 10))
  if (bytecode.options.fps > 60) bytecode.options.fps = 60
}
