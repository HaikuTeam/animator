var path = require('path')
var assert = require('assert')
var test = require('tape')
var cp = require('child_process')
var Application = require('spectron').Application

var ROOT_PATH = path.join(__dirname, '..', '..')
var APP_PATH = path.join(ROOT_PATH, 'dist', 'mac', 'Haiku.app', 'Contents', 'MacOS', 'Haiku')

test('index.spectron', (t) => {
  t.plan(1)

  cp.execSync('haiku logout', { cwd: ROOT_PATH, stdio: 'inherit' })

  var app = new Application({
    path: APP_PATH
  })

  app.start().then(() => {
    return app.browserWindow.isVisible()
  }).then((isVisible) => {
    assert.equal(isVisible, true)
  }).then(() => {
    t.ok(true) // Final assertion
    return app.stop()
  }).catch((exception) => {
    t.error(exception, 'no exception')
  })
})
