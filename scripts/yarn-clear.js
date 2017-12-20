const async = require('async')
const cp = require('child_process')
const log = require('./helpers/log')
const allPackages = require('./helpers/allPackages')()

async.each(allPackages, (pack, next) => {
  log.log('yarn clear for ' + pack.name)
  cp.execSync('rm -rf node_modules', { cwd: pack.abspath, stdio: 'inherit' })
}, (err) => {
  if (err) {
    throw err
  }
  log.log('yarn clear complete')
})
