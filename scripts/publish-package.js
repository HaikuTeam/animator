var cp = require('child_process')
var lodash = require('lodash')
var log = require('./helpers/log')
var allPackages = require('./helpers/packages')()
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

log.hat(`publishing ${pkg} to the npm registry`)

// Have to set this because when we run via yarn, yarn sets this var and we want npm's registry.
process.env.npm_config_registry = 'https://registry.npmjs.org'

cp.execSync(`npm publish --verbose --access public`, { cwd: PACKAGE_PATH, stdio: 'inherit' })
