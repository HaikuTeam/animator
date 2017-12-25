var jsdom = require('jsdom')
var async = require('async')
var Config = require('../lib/Config').default
var HaikuDOMAdapter = require('../lib/adapters/dom').default
var HaikuDOMRenderer = require('../lib/renderers/dom').default
var HaikuContext = require('../lib/HaikuContext').default
var HaikuGlobal = require('../lib/HaikuGlobal').default

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
  mount.width = 800
  mount.height = 600
  // Trick jsdom into giving us proper layout on mounts so we can write sizing tests.
  Object.defineProperties(win.HTMLElement.prototype, {
    offsetWidth: {
      get: function() { return mount.width }
    },
    offsetHeight: {
      get: function() { return mount.height }
    }
  })
  global.window.document.body.appendChild(mount)
  return cb(null, win, mount, HaikuGlobal)
}

function createRenderTest (template, timelines, baseConfig, cb) {
  return createDOM(function _createDOM (err, window, mount) {
    if (err) throw err
    var config = Config.build(baseConfig, { options: { cache: {}, seed: Config.seed() } })
    var renderer = new HaikuDOMRenderer(config)
    var context = new HaikuContext(mount, renderer, {}, { timelines, template }, config)
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

function getBytecode (projectName) {
  return require(`../demo/projects/${projectName}/code/main/code.js`)
}

TestHelpers.createDOM = createDOM
TestHelpers.createRenderTest = createRenderTest
TestHelpers.createComponent = createComponent
TestHelpers.getBytecode = getBytecode
TestHelpers.simulateEvent = simulateEvent
TestHelpers.timeBracket = timeBracket

module.exports = TestHelpers
