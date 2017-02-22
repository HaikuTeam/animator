var async = require('async')
var lodash = require('lodash')
var cp = require('child_process')
var path = require('path')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')

var plumbingPackage = groups['haiku-plumbing']
var testProject = path.join(plumbingPackage.abspath, 'test/fixtures/projects/test-project')

var instructions = [
  ['haiku-plumbing', ['npm', 'run', 'watch'], null, 10000],
  ['haiku-plumbing', ['node', './HaikuHelper.js', '--mode=headless', '--folder=' + testProject], null, 5000],
  ['haiku-creator', ['npm', 'run', 'develop'], { HAIKU_PLUMBING_PORT: 1024, FOLDER: testProject }]
]

var cancelled = false

async.eachSeries(instructions, function (instruction, next) {
  if (cancelled) return next()

  var pack = groups[instruction[0]]
  var exec = instruction[1]
  var env = instruction[2] || {}
  var wait = instruction[3] || 5000
  var cmd = exec[0]

  var args = exec.slice(1)

  var child = cp.spawn(cmd, args, { cwd: pack.abspath, env: lodash.assign(process.env, env) })
  child.stdout.setEncoding('utf8')
  child.stdout.on('data', function (data) {
    log.log(data)
  })
  child.stderr.on('data', function (data) {
    log.err(data)
  })
  child.on('close', function (code) {
    cancelled = true
    log.log('closed!')
  })

  return setTimeout(next, wait)
})
