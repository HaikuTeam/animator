const log = require('./helpers/log')
const allPackages = require('./helpers/allPackages')()
const {unlinkDeps} = require('./helpers/yarnUnlink')

log.hat(`it is ok if any 'yarn unlink' step fails with 'no registered module'`)

unlinkDeps(allPackages, () => {
  log.log('yarn unlink complete')
})
