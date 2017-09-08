var test = require('tape')
var path = require('path')
var merge = require('lodash.merge')
var Websocket = require('ws')
var tmp = require('tmp')
var fse = require('haiku-fs-extra')
var randomAlphabetical = require('./../lib/randomAlphabetical').default
var Plumbing = require('./../lib/Plumbing').default

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

function setup(ready) {
  return setTimeout(() => { // HACK: always wait for teardown of previous test #RC-test
    return tmpdir((folder, cleanup) => {
      var plumbing = new Plumbing()
      plumbing.launch({ mode: 'headless' }, (err, host, port) => {
        if (err) throw err
        const creator = websocket(host, port, folder, 'creator', 'commander')
        const glass = websocket(host, port, folder, 'glass', 'controllee')
        const timeline = websocket(host, port, folder, 'timeline', 'controllee')
        function teardown() {
          cleanup()
          plumbing.teardown()
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
  }, 5000)
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
  setup: setup
}
