const async = require('async')
const log = require('./helpers/log')
const allPackages = require('./helpers/allPackages')()
const yarnInstall = require('./helpers/yarnInstall')

async.each(allPackages, (pack, next) => {
  log.log('yarn install for ' + pack.name)
  yarnInstall(pack, next)
}, (err) => {
  if (err) {
    throw err
  }

  log.log('yarn install complete')
})
