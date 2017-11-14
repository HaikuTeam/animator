var cp = require('child_process')
var lodash = require('lodash')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var argv = require('yargs').argv

var groups = lodash.keyBy(allPackages, 'name')

var pkg = argv.package
if (!pkg) {
  throw new Error('a --package argument is required')
}

var PACKAGE_PATH = groups[pkg] && groups[pkg].abspath
if (!PACKAGE_PATH) {
  throw new Error(`cannot find package ${pkg}`)
}

log.hat(`compiling ${pkg}`)

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development'
}

cp.execSync('yarn run compile', { cwd: PACKAGE_PATH, stdio: 'inherit' })
