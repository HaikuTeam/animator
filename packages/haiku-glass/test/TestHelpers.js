process.env.NODE_ENV = 'test'
require('babel-register')({
  presets: ['babel-preset-react-app'].map(require.resolve)
})
var path = require('path')
var JSDOM = require('jsdom').JSDOM
var React = require('react')
var ReactDOM = require('react-dom')

var TestHelpers = {}

function createDOM (folder, cb) {
  var html = `
    <!doctype html>
    <html style="width: 100%; height: 100%;">
      <body style="width: 100%; height: 100%;">
        <!-- This needs to match what we have in index.html -->
        <div id="root" style="width: 100%; height: 100%;"></div>
      </body>
    </html>`
  var dom = new JSDOM(html, {
    url: 'http://localhost:3000?folder=' + folder
  })
  var win = dom.window
  global.window = win
  global.document = win.document
  for (let key in win) {
    if (!win.hasOwnProperty(key)) continue
    if (key in global) continue
    global[key] = window[key]
  }
  win.requestAnimationFrame = function requestAnimationFrame (fn) {
    return setTimeout(fn, 32)
  }
  function teardown () {
    win.requestAnimationFrame = function () {}
    // Must call this or else we'll get leaked handles and the test won't finish
    window.haiku.HaikuGlobalAnimationHarness.cancel()
  }
  return cb(null, win, teardown)
}

function createApp (folder, cb) {
  return createDOM(folder, function (err, win, _teardown) {
    if (err) throw err
    var Glass = require('./../lib/react/Glass').Glass
    const userconfig = require(path.join(folder, 'haiku.js'))
    const websocket = { on: () => {}, send: () => {}, method: () => {}, request: () => {}, action: () => {} }
    ReactDOM.render(
      React.createElement(Glass ,{
        userconfig: userconfig,
        websocket: websocket,
        folder: folder,
        projectName: userconfig.name || 'untitled',
        envoy: { mock: true }
      }),
      document.getElementById('root')
    )
    function teardown () {
      _teardown()
    }
    window.glass._component.on('update', (what) => {
      if (what === 'application-mounted') {
        return cb(window.glass, window.glass._component, window, teardown)
      }
    })
  })
}

TestHelpers.createDOM = createDOM
TestHelpers.createApp = createApp

module.exports = TestHelpers
