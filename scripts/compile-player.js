var cp = require('child_process')
var lodash = require('lodash')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var PLAYER_PATH = groups['haiku-player'].abspath

log.hat('compiling player typescript')

cp.execSync('yarn run compile', { cwd: PLAYER_PATH, stdio: 'inherit' })
