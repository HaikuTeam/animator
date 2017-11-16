var jsdom = require('jsdom')
var async = require('async')
var HaikuDOMAdapter = require('./../lib/adapters/dom').default
var HaikuDOMRenderer = require('./../lib/renderers/dom').default
var HaikuContext = require('./../lib/HaikuContext').default
var HaikuGlobal = require('./../lib/HaikuGlobal').default

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
  var mount = global.window.document.createElement('div')
  mount.style.width = '800px'
  mount.style.height = '600px'
  global.window.document.body.appendChild(mount)
  return cb(null, win, mount, HaikuGlobal)
}

function createRenderTest (template, cb) {
  return createDOM(function _createDOM (err, window, mount) {
    if (err) throw err
    var renderer = new HaikuDOMRenderer()
    var context = new HaikuContext(null, renderer, {}, { timelines: {}, template: template }, { options: { cache: {}, seed: 'abcde' + Math.random() } })
    var component = context.component
    var container = renderer.createContainer(mount)
    var tree = component.render(container, context.config.options)
    renderer.render(mount, container, tree, component, false)
    function teardown () {
      component._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
      return void 0
    }
    return cb(null, mount, renderer, context, component, teardown)
  })
}

function createComponent (bytecode, options, cb) {
  return createDOM(function _createDOM (err, window, mount) {
    if (err) throw err
    var runner = HaikuDOMAdapter(bytecode, options, window)
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
TestHelpers.createRenderTest = createRenderTest
TestHelpers.createComponent = createComponent
TestHelpers.simulateEvent = simulateEvent
TestHelpers.timeBracket = timeBracket

module.exports = TestHelpers
