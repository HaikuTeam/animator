const async = require('async')
const lodash = require('lodash')
const cp = require('child_process')
const log = require('./helpers/log')
const fs = require('fs')
const path = require('path')

const checkYarnVersion = require('./helpers/checkYarnVersion')
const checkNodeVersion = require('./helpers/checkNodeVersion')
const allPackages = require('./helpers/allPackages')
const runFlakyCommand = require('./helpers/runFlakyCommand')
const yarnInstall = require('./helpers/yarnInstall')
const {linkAllPackages, linkDeps} = require('./helpers/yarnLink')
const {unlinkDeps} = require('./helpers/yarnUnlink')

checkYarnVersion()
checkNodeVersion()

const lastSyncFilename = path.join(global.process.cwd(), '.last-sync')
let sinceFilter = ''
if (fs.existsSync(lastSyncFilename)) {
  const lastSync = require(lastSyncFilename)
  if (lastSync.hasOwnProperty('lastSyncCommit')) {
    sinceFilter = `${lastSync.lastSyncCommit}..`
  }
}

const INSTALL_ATTEMPTS = 10
const lastSyncCommit = cp.execSync('git rev-parse HEAD').toString().trim()

const packageNamesRequiringSync = lodash.uniq(
  cp.execSync(
    `git whatchanged ${sinceFilter} --pretty=format:"" --name-only packages/*/yarn.lock \
       | sed '/^\\s*$/d' | sed 's/packages\\///g' | sed 's/\\/yarn.lock//g'`
  )
    .toString()
    .split('\n')
    .filter((v) => !!v)
)

const packagesRequiringSync = allPackages(packageNamesRequiringSync)

if (packagesRequiringSync.length === 0) {
  cp.execSync('say "nothing to sync"')
  log.hat('nothing to sync!')
  global.process.exit(0)
}

async.each(packagesRequiringSync, (pack, next) => {
  if (!fs.existsSync(pack.abspath, 'yarn.lock')) {
    // Don't e.g. sync modules that have since been removed.
    next()
    return
  }

  log.log(`yarn install for ${pack.shortname}`)
  runFlakyCommand(() => { yarnInstall(pack, next) }, `yarn install for ${pack.shortname}`, INSTALL_ATTEMPTS)
}, (err) => {
  if (err) {
    log.err(err)
  }

  async.series([
    (done) => {
      unlinkDeps(packagesRequiringSync, done)
    },
    (done) => {
      linkAllPackages(() => {
        linkDeps(packagesRequiringSync, (err) => {
          if (err) {
            throw err
          }

          log.hat('sync complete!')
          cp.execSync('say "sync complete"')
          fs.writeFile(lastSyncFilename, `module.exports = ${JSON.stringify({lastSyncCommit})};`, done)
        })
      })
    }
  ])
})
