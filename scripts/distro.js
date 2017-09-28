var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var moment = require('moment')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var ROOT = path.join(__dirname, '..')

var RELEASE_LOG = fse.readJsonSync(path.join(ROOT, 'releases.json'))

function prependReleaseToReleaseLog (inputs) {
  RELEASE_LOG.unshift({
    branch: inputs.branch,
    version: inputs.version,
    environment: inputs.environment,
    started: moment().format('YYYYMMDDHHmmss'),
    uglified: inputs.uglify,
    uploaded: null,
    finished: null,
    success: null
  })
  fse.writeJsonSync(path.join(ROOT, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function addInfoToMostRecentReleaseLogEntry (info) {
  lodash.assign(RELEASE_LOG[0], info)
  fse.writeJsonSync(path.join(ROOT, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function finalizeReleaseLog () {
  addInfoToMostRecentReleaseLogEntry({
    finished: moment().format('YYYYMMDDHHmmss'),
    uploaded: false,
    success: true
  })
}

function runit (inputs) {
  prependReleaseToReleaseLog(inputs)
  return runScript('distro-configure', (err) => {
    if (err) throw err
    return runScript('distro-prepare', (err) => {
      if (err) throw err
      return runScript('distro-electron-rebuild', (err) => {
        if (err) throw err
        return runScript('distro-uglify-sources', (err) => {
          if (err) throw err
          return runScript('distro-build', (err) => {
            if (err) throw err
            if (inputs.upload) {
              return runScript('distro-upload', (err) => {
                if (err) throw err
                finalizeReleaseLog()
                log.hat('success! built release and uploaded')
              })
            } else {
              finalizeReleaseLog()
              log.hat('success! built release (but did not upload)')
            }
          })
        })
      })
    })
  })
}

runit(require('./../config'))
