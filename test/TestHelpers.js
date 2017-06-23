var jsdom = require('jsdom')
var HaikuDOMAdapter = require('./../src/adapters/dom')

var TestHelpers = {}

function createDOM (cb) {
  var html = '<!doctype html><html><body><div id="mount"></div></body></html>'
  var doc = jsdom.jsdom(html)
  var win = doc.defaultView
  global.document = doc
  global.window = win
  for (let key in win) {
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
      component._context.clock._cancelRaf()
      return void (0)
    }
    return cb(component, teardown)
  })
}

function simulateEvent (element, name) {
  var document = element.ownerDocument
  var event = document.createEvent('HTMLEvents')
  event.initEvent(name, false, true)
  element.dispatchEvent(event)
  return event
}

TestHelpers.createDOM = createDOM
TestHelpers.createComponent = createComponent
TestHelpers.simulateEvent = simulateEvent

module.exports = TestHelpers
