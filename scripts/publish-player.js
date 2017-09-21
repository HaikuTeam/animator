var path = require('path')
var cp = require('child_process')
var lodash = require('lodash')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')

var PLAYER_PATH = groups['haiku-player'].abspath

log.hat('publishing @haiku/player to the npm registry')

// Have to set this because when we run via yarn, yarn sets this var and we want npm's registry.
process.env.npm_config_registry = 'https://registry.npmjs.org'

cp.execSync(`npm publish --verbose --access public`, { cwd: path.join(PLAYER_PATH), stdio: 'inherit' })
