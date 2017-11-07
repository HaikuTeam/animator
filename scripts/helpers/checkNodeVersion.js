const cp = require('child_process')

const log = require('./log')

const NODE_VERSION = 'v8.4.0'

module.exports = () => {
  const nodeVersion = cp.execSync('node --version').toString().trim()
  if (nodeVersion !== NODE_VERSION) {
    log.warn(`WARNING: you are using node version ${nodeVersion}. We recommend version ${NODE_VERSION}.`)
    log.warn('Get it via:')
    log.warn(`  curl -0 https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}.pkg > /tmp/node-${NODE_VERSION}.pkg && sudo installer -target / -pkg /tmp/node-${NODE_VERSION}`)
    log.warn('You have been warned!\n')
  }
}
