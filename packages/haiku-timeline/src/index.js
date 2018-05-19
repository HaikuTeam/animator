import {ipcRenderer} from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import lodash from 'lodash'
import qs from 'qs'
import Websocket from 'haiku-serialization/src/ws/Websocket'
import MockWebsocket from 'haiku-serialization/src/ws/MockWebsocket'
import Project from 'haiku-serialization/src/bll/Project'
import Timeline from './components/Timeline'
import {sentryCallback} from 'haiku-serialization/src/utils/carbonite'

const mixpanel = require('haiku-serialization/src/utils/Mixpanel')

if (process.env.NODE_ENV === 'production') {
  window.Raven.config('https://d045653ab5d44c808480fa6c3fa8e87c@sentry.io/226387', {
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

const heardErrors = {}

window.onerror = function (msg, url, line, col, error) {
  if (heardErrors[msg]) {
    return false
  }

  heardErrors[msg] = true

  if (process.env.NODE_ENV === 'production') {
    _traceKitFormatErrorStack(error)
    window.Raven.captureException(error)
  }

  // Give Raven some time to transmit an error report before we crash
  setTimeout(() => {
    throw error
  }, 500)
}

function go () {
  // We are in a webview; use query string parameters for boot-up configuration
  const search = (window.location.search || '').split('?')[1] || ''
  const params = qs.parse(search, { plainObjects: true })
  const config = lodash.assign({}, params)

  if (!config.folder) throw new Error('A folder (the absolute path to the user project) is required')
  function _fixPlumbingUrl (url) { return url.replace(/^http/, 'ws') }

  return Project.fetchProjectConfigInfo(config.folder, (err, userconfig) => {
    if (err) {
      throw err
    }

    const websocket = (config.plumbing)
      ? new Websocket(_fixPlumbingUrl(config.plumbing), config.folder, 'controllee', 'timeline', null, config.socket.token)
      : new MockWebsocket(ipcRenderer)

    // Add extra context to Sentry reports, this info is also used by carbonite.
    const folderHelper = config.folder.split('/').reverse()
    window.Raven.setExtraContext({
      organizationName: folderHelper[1] || 'unknown',
      projectName: folderHelper[0] || 'unknown',
      projectPath: config.folder
    })
    window.Raven.setUserContext({
      email: config.email
    })

    mixpanel.mergeToPayload({
      distinct_id: config.email
    })

    window.isWebview = config.webview

    ReactDOM.render(
      <Timeline
        mixpanel={mixpanel}
        envoy={config.envoy}
        userconfig={userconfig}
        websocket={websocket}
        folder={config.folder}
        />,
      document.getElementById('root')
    )
  })
}
