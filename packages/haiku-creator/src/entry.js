import {sentryCallback} from 'haiku-serialization/src/utils/carbonite'

(function () {
  if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
    window.Raven.config('https://07b703c10ea14681a29a1a870c28e84a@sentry.io/226383', {
      environment: process.env.HAIKU_RELEASE_ENVIRONMENT || 'development',
      release: process.env.HAIKU_RELEASE_VERSION,
      dataCallback: sentryCallback
    }).install()
    window.Raven.context(function () {
      go()
    })
  } else {
    go()
  }

  function go () {
    var electron = require('electron')
    var setup = require('./dom').default
    electron.ipcRenderer.on('haiku', (event, haiku) => {
      return setup('creator', haiku)
    })
  }
}())
