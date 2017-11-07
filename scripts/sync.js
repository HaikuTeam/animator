const async = require('async')
const lodash = require('lodash')
const cp = require('child_process')
const log = require('./helpers/log')
const fs = require('fs')
const path = require('path')

const checkYarnVersion = require('./helpers/checkYarnVersion')
const checkNodeVersion = require('./helpers/checkNodeVersion')
const allPackages = require('./helpers/allPackages')
const yarnInstall = require('./helpers/yarnInstall')
const {linkAllPackages, linkDeps} = require('./helpers/yarnLink')
const {unlinkDeps} = require('./helpers/yarnUnlink')

checkYarnVersion()
checkNodeVersion()

const lastSyncFilename = path.join(global.process.cwd(), '.last-sync')
let afterFilter = ''
if (fs.existsSync(lastSyncFilename)) {
  afterFilter = `--after='${require(lastSyncFilename).lastSyncDate}'`
}

const INSTALL_ATTEMPTS = 10
const lastSyncDate = cp.execSync('date').toString().trim()

const packageNamesRequiringSync = lodash.uniq(
  cp.execSync(
    `git whatchanged ${afterFilter} --pretty=format:"" --name-only packages/*/yarn.lock \
       | sed '/^\\s*$/d' | sed 's/packages\\///g' | sed 's/\\/yarn.lock//g'`
  )
    .toString()
    .split('\n')
    .filter((v) => !!v)
)

const packagesRequiringSync = allPackages(packageNamesRequiringSync)

const tryYarnInstall = (pack, cb) => {
  log.log(`yarn install for ${pack.shortname}`)
  let remainingTries = INSTALL_ATTEMPTS
  while (remainingTries > 0) {
    try {
      yarnInstall(pack, cb)
      break
    } catch (e) {
      log.err(`Encountered error during yarn install for ${pack.shortname}. Retrying....`)
      remainingTries--
    }
  }

  if (remainingTries === 0) {
    throw new Error(`Unable to yarn install ${pack.shortname} after ${INSTALL_ATTEMPTS} attempts`)
  }
}

if (packagesRequiringSync.length === 0) {
  log.hat('nothing to sync!')
  global.process.exit(0)
}

async.each(packagesRequiringSync, (pack, next) => {
  if (!fs.existsSync(pack.abspath, 'yarn.lock')) {
    // Don't e.g. sync modules that have since been removed.
    next()
    return
  }

  tryYarnInstall(pack, next)
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
          fs.writeFile(lastSyncFilename, `module.exports = ${JSON.stringify({lastSyncDate})};`, done)
        })
      })
    }
  ])
})
