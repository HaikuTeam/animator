var jsdom = require('jsdom')
var async = require('async')
var HaikuDOMAdapter = require('./../src/adapters/dom')

var TestHelpers = {}

function createDOM (cb) {
  var html = '<!doctype html><html><body><div id="mount"></div></body></html>'
  var doc = jsdom.jsdom(html)
  var win = doc.defaultView
  global.document = doc
  global.window = win
  for (var key in win) {
    if (!win.hasOwnProperty(key)) continue
    if (key in global) continue
    global[key] = window[key]
  }
  return cb(null, win)
}

function createComponent (bytecode, options, cb) {
  return createDOM(function _createDOM (err, window) {
    if (err) throw err
    var runner = HaikuDOMAdapter(bytecode, options, window)
    var mount = window.document.createElement('div')
    mount.style.width = '800px'
    mount.style.height = '600px'
    window.document.body.appendChild(mount)
    var component = runner(mount, options)
    // If rafs and timers aren't cancelled, the tests never finish due to leaked handles
    function teardown () {
      component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
      return void 0
    }
    return cb(component, teardown, mount)
  })
}

function simulateEvent (element, name) {
  var document = element.ownerDocument
  var event = document.createEvent('HTMLEvents')
  event.initEvent(name, false, true)
  element.dispatchEvent(event)
  return event
}

function timeBracket (steps, cb) {
  var delta = 0
  return async.eachOfSeries(steps, function (step, key, next) {
    var start = Date.now()
    return step(function () {
      var end = Date.now()
      delta = end - start
      return next()
    }, delta)
  }, cb)
}

TestHelpers.createDOM = createDOM
TestHelpers.createComponent = createComponent
TestHelpers.simulateEvent = simulateEvent
TestHelpers.timeBracket = timeBracket

module.exports = TestHelpers
