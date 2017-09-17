var test = require('tape')
var path = require('path')
var merge = require('lodash.merge')
var Websocket = require('ws')
var tmp = require('tmp')
var fse = require('haiku-fs-extra')
var randomAlphabetical = require('./../lib/randomAlphabetical').default
var Plumbing = require('./../lib/Plumbing').default
var Watcher = require('./../lib/Watcher')

function websocket(host, port, folder, alias, type) {
  const websocket = new Websocket(`ws://${host}:${port}/?folder=${folder}&alias=${alias}&type=${type}`)
  var requests = {}
  websocket.message = function (message) {
    var data = JSON.stringify(message)
    websocket.send(data)
  }
  websocket.request = function (method, params, cb, type) {
    var id = Math.random() + ''
    var message = { id: id, method: method, params: params, type: type }
    requests[id] = cb
    return websocket.message(message)
  }
  websocket.action = function (method, params, cb) {
    return websocket.request(method, params, cb, 'action')
  }
  websocket.on('message', (resp) => {
    var reply = JSON.parse(resp)
    var cb = requests[reply.id]
    if (cb) return cb(reply.error, reply.result)
    return websocket.emit('meow', reply)
  })
  return websocket
}

function before(cb) {
  process.env.HAIKU_SKIP_NPM_INSTALL = '1'
  // process.env.HAIKU_SKIP_NPM_LINK = '1' // enabled so that @haiku/player exists in component code.js
  return setTimeout(cb, 2500) // HACK: always wait for teardown of previous test #RC-test
}

function launch(ready) {
  return before(() => {
    return plumb((plumbing) => {
      function teardown() {
        plumbing.teardown()
        if (global.haiku) global.haiku.HaikuGlobalAnimationHarness.cancel()
      }
      return ready(plumbing, teardown)
    })
  })
}

function plumb(cb) {
  var plumbing = new Plumbing()
  return plumbing.launch({ mode: 'headless' }, (err, host, port, server, spawned, envoy) => {
    if (err) throw err
    process.env.HAIKU_PLUMBING_HOST = host
    process.env.HAIKU_PLUMBING_PORT = port
    process.env.ENVOY_HOST = envoy.host
    process.env.ENVOY_PORT = envoy.port
    return cb(plumbing, host, port, envoy)
  })
}

function setup(ready) {
  return before(() => {
    return tmpdir((folder, cleanup) => {
      process.env.HAIKU_PROJECT_FOLDER = folder
      return plumb((plumbing, host, port, envoy) => {
        const creator = websocket(host, port, folder, 'creator', 'commander')
        const glass = websocket(host, port, folder, 'glass', 'controllee')
        const timeline = websocket(host, port, folder, 'timeline', 'controllee')
        glass.on('meow', (message) => { if (message.type !== 'broadcast') return glass.message(message) }) // Auto-respond as mock
        timeline.on('meow', (message) => { if (message.type !== 'broadcast') return timeline.message(message) }) // Auto-respond as mock
        function teardown() {
          cleanup()
          plumbing.teardown()
          if (global.haiku) global.haiku.HaikuGlobalAnimationHarness.cancel()
        }
        creator.on('open', () => {
          plumbing.getCurrentOrganizationName((err, organizationName) => {
            if (err) throw err
            var metadata = {
              organizationName
            }
            return ready(folder, creator, glass, timeline, metadata, teardown)
          })
        })
      })
    })
  })
}

function tmpdir(cb) {
  return tmp.dir({ unsafeCleanup: true }, function(err, dir, cleanup) {
    if (err) throw err
    var folder = path.join(dir, '.haiku', randomAlphabetical())
    fse.mkdirpSync(folder)
    console.log('[test] created temp folder', folder)
    return cb(folder, cleanup)
  })
}

const gitcfg = {
  repoGitUrl: 'https://github.com/HaikuTeam/git-testing.git',
  testUsername: 'haiku-test-user',
  testPassword: 'Snappy#-Citizen156!)',
  testEmail: 'matthew+github-haiku-test-user@haiku.ai',
}

module.exports = {
  tmpdir: tmpdir,
  gitcfg: gitcfg,
  setup: setup,
  launch: launch
}
