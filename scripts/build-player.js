var path = require('path')
var fse = require('fs-extra')
var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var nowVersion = require('./helpers/nowVersion')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')

var ROOT = path.join(__dirname, '..')
var PLAYER_PATH = groups['haiku-player'].abspath
var REACT_VERSION = require(path.join(PLAYER_PATH, 'package.json')).peerDependencies.react

log.hat(`note that the current version is ${nowVersion()}`)

log.hat('creating distribution builds of our player and adapters')

function monobin (name) {
  return path.join(ROOT, 'node_modules', '.bin', name)
}

// Clear out the dist folder
fse.removeSync(path.join(PLAYER_PATH, 'dist'))
fse.mkdirpSync(path.join(PLAYER_PATH, 'dist'))

runScript('compile-player', [], (err) => {
  if (err) throw err

  cp.execSync(`yarn add react@${REACT_VERSION}`, { cwd: PLAYER_PATH, stdio: 'inherit' })

  log.log('browserifying player packages and adapters')

  log.log(cp.execSync(`${monobin('browserify')} ${JSON.stringify(path.join(PLAYER_PATH, 'lib', 'adapters', 'dom', 'index.js'))} --standalone HaikuDOMPlayer | ${monobin('derequire')} > ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'))}`).toString())
  log.log(cp.execSync(`${monobin('browserify')} ${JSON.stringify(path.join(PLAYER_PATH, 'lib', 'adapters', 'react-dom', 'index.js'))} --standalone HaikuReactAdapter --external react --external react-test-renderer --external lodash.merge | ${monobin('derequire')} > ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))} && sed -i '' -E -e "s/_dereq_[(]'(react|react-test-renderer|lodash\\.merge)'[)]/require('\\1')/g" ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))}`).toString())

  log.log('creating minified bundles for the cdn')

  cp.execSync(`${monobin('uglifyjs')} ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.min.js'))}`)
  cp.execSync(`${monobin('uglifyjs')} ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.min.js'))}`)
})
