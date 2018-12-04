const Mixpanel = require('mixpanel');
const os = require('os');
const logger = require('./LoggerInstance');

const tokens = {
  development: '53f3639f564804dcb710fd18511d1c0b',
  production: '6f31d4f99cf71024ce27c3e404a79a61',
};

const token = (process.env.NODE_ENV === 'production') ? tokens.production : tokens.development;

const mixpanel = Mixpanel.init(token, {
  protocol: 'https',
});

// Just in case somebody downstream wants to read/log this value
mixpanel.token = token;

const defaultPayload = {
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
  distinct_id: void (0), // Assign to email address when available
};

mixpanel.mergeToPayload = function mergeToPayload (keepPayload) {
  return Object.assign(defaultPayload, keepPayload);
};

function _getPayload (eventName, eventPayload) {
  return Object.assign({}, defaultPayload, eventPayload);
}

function _safeStringify (obj) {
  try {
    return JSON.stringify(obj);
  } catch (exception) {
    return null;
  }
}

mixpanel.haikuTrack = function haikuTrack (eventName, eventPayload) {
  const finalPayload = _getPayload(eventName, eventPayload);
  logger.info('[mixpanel]', eventName);
  return mixpanel.track(eventName, finalPayload);
};

const trackedEvents = {};

mixpanel.haikuTrackOnce = function haikuTrackOnce (eventName, eventPayload) {
  const candidatePayload = _getPayload(eventName, eventPayload);
  const payloadString = _safeStringify(candidatePayload);
  if (payloadString) {
    if (!trackedEvents[payloadString]) {
      trackedEvents[payloadString] = true;
      mixpanel.haikuTrack(eventName, eventPayload);
    }
  }
};

module.exports = mixpanel;
