import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import path from 'path'
import qs from 'qs'
import Websocket from 'haiku-serialization/src/ws/Websocket'
import Timeline from './components/Timeline'
import {sentryCallback} from 'haiku-serialization/src/utils/carbonite'

if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
  window.Raven.config('https://d045653ab5d44c808480fa6c3fa8e87c@sentry.io/226387', {
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

function _traceKitFormatErrorStack (error) {
  if (!error) return null
  if (typeof error.stack !== 'string') return null
  error.stack = error.stack.split('\n').map((line) => {
    return line.split(/ at\s+\//).join(' at (/')
  }).join('\n')
  return error
}

window.onerror = function (msg, url, line, col, error) {
  if (process.env.HAIKU_RELEASE_ENVIRONMENT === 'production' || process.env.HAIKU_RELEASE_ENVIRONMENT === 'staging') {
    _traceKitFormatErrorStack(error)
    window.Raven.captureException(error)
  }
}

function go () {
  // We are in a webview; use query string parameters for boot-up configuration
  const search = (window.location.search || '').split('?')[1] || ''
  const params = qs.parse(search, { plainObjects: true })
  const config = lodash.assign({}, params)
  if (!config.folder) throw new Error('A folder (the absolute path to the user project) is required')
  function _fixPlumbingUrl (url) { return url.replace(/^http/, 'ws') }

  const userconfig = require(path.join(config.folder, 'haiku.js'))

  const websocket = (config.plumbing)
    ? new Websocket(_fixPlumbingUrl(config.plumbing), config.folder, 'controllee', 'timeline')
    : { on: () => {}, send: () => {}, method: () => {}, request: () => {}, sendIfConnected: () => {}, action: () => {} }

  // Add extra context to Sentry reports, this info is also used
  // by carbonite.
  const folderHelper = config.folder.split('/').reverse()
  window.Raven.setExtraContext({
    organizationName: folderHelper[1],
    projectName: folderHelper[0],
    projectPath: config.folder
  })
  window.Raven.setUserContext({
    email: config.email
  })

  ReactDOM.render(
    <Timeline
      envoy={config.envoy}
      userconfig={userconfig}
      websocket={websocket}
      folder={config.folder}
      />,
    document.getElementById('root')
  )
}
