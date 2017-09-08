require('leaked-handles')

var originalSetTimeout = global.setTimeout

global.setTimeout = function _setTimeoutWrapped (fn, ms) {
  console.log('setTimeout', fn.toString())
  return originalSetTimeout(fn, ms)
}

var originalSetInterval = global.setInterval

global.setInterval = function _setIntervalWrapped (fn, ms) {
  console.log('setInterval', fn.toString())
  return originalSetInterval(fn, ms)
}
