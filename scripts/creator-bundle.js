var cp = require('child_process')
var lodash = require('lodash')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var creatorPack = groups['haiku-creator']

var DEFAULT_ORIGIN = 'master'
var origin = argv.origin || DEFAULT_ORIGIN

log.log('bundling creator (please wait...)')
log.log(cp.execSync('npm run build', { cwd: creatorPack.abspath }))
log.log(cp.execSync('git add public', { cwd: creatorPack.abspath }))
log.log(cp.execSync('git commit -m "auto: Rebundle"', { cwd: creatorPack.abspath }))

// log.log('git pushing creator')
// cp.execSync('git push origin ' + origin, { cwd: creatorPack.abspath })
