var path = require('path')
var fse = require('fs-extra')
var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var nowVersion = require('./helpers/nowVersion')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')

var PLAYER_PATH = groups['haiku-player'].abspath
var REACT_VERSION = require(path.join(PLAYER_PATH, 'package.json')).peerDependencies.react

log.hat(`note that the current version is ${nowVersion()}`)

log.hat('creating distribution builds of our player and adapters')

// Clear out the dist folder
fse.removeSync(path.join(PLAYER_PATH, 'dist'))
fse.mkdirpSync(path.join(PLAYER_PATH, 'dist'))

// Compile Typescript to Javascript just to be sure
cp.execSync('yarn run compile', { cwd: PLAYER_PATH, stdio: 'inherit' })

cp.execSync(`yarn add react@${REACT_VERSION}`, { cwd: PLAYER_PATH, stdio: 'inherit' })

log.log('browserifying player packages and adapters')

cp.execSync(`browserify ${JSON.stringify(path.join(PLAYER_PATH, 'lib', 'adapters', 'dom', 'index.js'))} --standalone HaikuDOMPlayer | derequire > ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'))}`, { stdio: 'inherit' })
cp.execSync(`browserify ${JSON.stringify(path.join(PLAYER_PATH, 'lib', 'adapters', 'react-dom', 'index.js'))} --standalone HaikuReactAdapter --external react --external react-test-renderer --external lodash.merge | derequire > ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))} && sed -i '' -E -e "s/_dereq_[(]'(react|react-test-renderer|lodash\\.merge)'[)]/require('\\1')/g" ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))}`, { stdio: 'inherit' })

log.log('creating minified bundles for the cdn')

cp.execSync(`uglifyjs ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.min.js'))}`)
cp.execSync(`uglifyjs ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.min.js'))}`)
