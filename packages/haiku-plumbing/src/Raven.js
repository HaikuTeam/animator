const Raven = require('raven')
const {sentryCallback} = require('haiku-serialization/src/utils/carbonite')

const NOTIFIABLE_ENVS = {
  production: true,
  staging: true
  // development: true
}

Raven.config('https://4dfb3b0e4ae2479b8340019bcd1fd423:c9d508bea6294acdb97fe499dd98eab7@sentry.io/226390', {
  release: process.env.HAIKU_RELEASE_VERSION,
  environment: process.env.NODE_ENV || 'development',
  sampleRate: (NOTIFIABLE_ENVS[process.env.NODE_ENV]) ? 1 : 0,
  dataCallback: sentryCallback
}).install()

module.exports = Raven
