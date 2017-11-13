import {sentryCallback} from 'haiku-serialization/src/utils/carbonite'

(function () {
  if (process.env.NODE_ENV === 'production') {
    window.Raven.config('https://07b703c10ea14681a29a1a870c28e84a@sentry.io/226383', {
      environment: process.env.NODE_ENV || 'development',
      release: process.env.HAIKU_RELEASE_VERSION,
      dataCallback: sentryCallback
    }).install()
    window.Raven.context(function () {
      go()
    })
  } else {
    go()
  }

  function _traceKitFormatErrorStack (error) {
    if (!error) return null
    if (typeof error.stack !== 'string') return null
    error.stack = error.stack.split('\n').map((line) => {
      return line.split(/ at\s+\//).join(' at (/')
    }).join('\n')
    return error
  }

  window.onerror = function (msg, url, line, col, error) {
    if (process.env.NODE_ENV === 'production') {
      _traceKitFormatErrorStack(error)
      window.Raven.captureException(error)
    }
  }

  function go () {
    var electron = require('electron')
    var setup = require('./dom').default
    electron.ipcRenderer.on('haiku', (event, haiku) => {
      return setup('creator', haiku)
    })
  }
}())
