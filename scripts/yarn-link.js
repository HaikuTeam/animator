const allPackages = require('./helpers/allPackages')()
const log = require('./helpers/log')
const {linkAllPackages, linkDeps} = require('./helpers/yarnLink')

linkAllPackages(() => {
  linkDeps(allPackages, () => {
    log.log('yarn link complete')
  })
})
