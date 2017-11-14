const path = require('path')
const fse = require('fs-extra')
const lodash = require('lodash')
const cp = require('child_process')
const log = require('./helpers/log')
const runScript = require('./helpers/runScript')
const nowVersion = require('./helpers/nowVersion')
const allPackages = require('./helpers/allPackages')()
const groups = lodash.keyBy(allPackages, 'name')

const ROOT = path.join(__dirname, '..')
const PLAYER_PATH = groups['haiku-player'].abspath
const REACT_VERSION = require(path.join(PLAYER_PATH, 'package.json')).peerDependencies.react

log.hat(`note that the current version is ${nowVersion()}`)

log.hat('creating distribution builds of our player and adapters')

function monobin (name) {
  return path.join(ROOT, 'node_modules', '.bin', name)
}

// Clear out the dist folder
fse.removeSync(path.join(PLAYER_PATH, 'dist'))
fse.mkdirpSync(path.join(PLAYER_PATH, 'dist'))

cp.execSync(`yarn add react@${REACT_VERSION} --peer`, { cwd: PLAYER_PATH, stdio: 'inherit' })

runScript('compile-package', ['--package=haiku-player'], (err) => {
  if (err) throw err

  log.log('browserifying player packages and adapters')

  log.log(cp.execSync(`${monobin('browserify')} ${JSON.stringify(path.join(PLAYER_PATH, 'lib', 'adapters', 'dom', 'index.js'))} --standalone HaikuDOMPlayer | ${monobin('derequire')} > ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'))}`).toString())
  log.log(cp.execSync(`${monobin('browserify')} ${JSON.stringify(path.join(PLAYER_PATH, 'lib', 'adapters', 'react-dom', 'index.js'))} --standalone HaikuReactAdapter --external react --external react-test-renderer --external lodash.merge | ${monobin('derequire')} > ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))} && sed -i '' -E -e "s/_dereq_[(]'(react|react-test-renderer|lodash\\.merge)'[)]/require('\\1')/g" ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))}`).toString())

  log.log('creating minified bundles for the cdn')

  cp.execSync(`${monobin('uglifyjs')} ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'dom.bundle.min.js'))}`)
  cp.execSync(`${monobin('uglifyjs')} ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(PLAYER_PATH, 'dist', 'react-dom.bundle.min.js'))}`)
})
