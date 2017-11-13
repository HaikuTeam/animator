var Mixpanel = require('mixpanel')
var assign = require('lodash.assign')
var os = require('os')

var tokens = {
  development: '53f3639f564804dcb710fd18511d1c0b',
  production: '6f31d4f99cf71024ce27c3e404a79a61'
}

var token = (process.env.NODE_ENV === 'production') ? tokens.production : tokens.development

var mixpanel = Mixpanel.init(token, {
  protocol: 'https'
})

// Just in case somebody downstream wants to read/log this value
mixpanel.token = token

var defaultPayload = {
  app: 'haiku',
  arch: os.arch(),
  platform: os.platform(),
  type: os.type(),
  process: (typeof window === 'undefined') ? 'renderer' : 'main',
  node_env: process.env.NODE_ENV,
  release_environment: process.env.NODE_ENV,
  release_branch: process.env.HAIKU_RELEASE_BRANCH,
  release_platform: process.env.HAIKU_RELEASE_PLATFORM,
  release_version: process.env.HAIKU_RELEASE_VERSION,
  distinct_id: void (0) // Assign to email address when available
}

mixpanel.mergeToPayload = function mergeToPayload (keepPayload) {
  return assign(defaultPayload, keepPayload)
}

function _getPayload (eventName, eventPayload) {
  return assign({}, defaultPayload, eventPayload)
}

function _safeStringify (obj) {
  try {
    return JSON.stringify(obj)
  } catch (exception) {
    return null
  }
}

mixpanel.haikuTrack = function haikuTrack (eventName, eventPayload) {
  var finalPayload = _getPayload(eventName, eventPayload)
  console.info('[mixpanel]', eventName, finalPayload)
  return mixpanel.track(eventName, finalPayload)
}

var trackedEvents = {}

mixpanel.haikuTrackOnce = function haikuTrackOnce (eventName, eventPayload) {
  var candidatePayload = _getPayload(eventName, eventPayload)
  var payloadString = _safeStringify(candidatePayload)
  if (payloadString) {
    if (!trackedEvents[payloadString]) {
      trackedEvents[payloadString] = true
      mixpanel.haikuTrack(eventName, eventPayload)
    }
  }
}

module.exports = mixpanel
