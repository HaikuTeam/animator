process.env.NODE_ENV = 'test'
require('babel-register')({
  presets: ['babel-preset-react-app'].map(require.resolve)
})
const path = require('path')
const JSDOM = require('jsdom').JSDOM
const React = require('react')
const ReactDOM = require('react-dom')
const {fetchProjectConfigInfo} = require ('@haiku/sdk-client/lib/ProjectDefinitions');

const TestHelpers = {}

function awaitElementById (window, id, cb) {
  const found = window.document.getElementById(id)
  if (found) return cb(null, found)
  return setTimeout(() => awaitElementById(window, id, cb), 1000)
}

function createDOM (folder, cb) {
  const html = `
    <!doctype html>
    <html style="width: 100%; height: 100%;">
      <body style="width: 100%; height: 100%;">
        <!-- This needs to match what we have in index.html -->
        <div id="root" style="width: 100%; height: 100%;"></div>
      </body>
    </html>`
  const dom = new JSDOM(html, {
    url: 'http://localhost:3000?folder=' + folder
  })
  const win = dom.window
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
    const Timeline = require('./../lib/components/Timeline').default
    return fetchProjectConfigInfo(folder, (err, userconfig) => {
      if (err) throw err
      const websocket = { on: () => {}, send: () => {}, method: () => {}, request: () => {}, action: () => {}, connect: () => {} }
      ReactDOM.render(
        React.createElement(Timeline, {
          userconfig: userconfig,
          websocket: websocket,
          folder: folder,
          envoy: { mock: true }
        }),
        document.getElementById('root')
      )
      function teardown () {
        _teardown()
      }
      return cb(window.timeline, window, teardown)
    })
  })
}

TestHelpers.createDOM = createDOM
TestHelpers.createApp = createApp
TestHelpers.awaitElementById = awaitElementById

module.exports = TestHelpers
