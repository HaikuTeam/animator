const { EventEmitter } = require('events')

const ACTIVE_LOCKS = {}

const LOCKS = {
  ActiveComponentWork: 'ActiveComponentWork',
  ActiveComponentReload: (hard) => `ActiveComponent${hard ? 'Hard' : 'Soft'}Reload`,
  FilePerformComponentWork: 'FilePerformComponentWork',
  FileReadWrite: (abspath) => `FileReadWrite:${abspath}`,
  ProjectMethodHandler: 'ProjectMethodHandler',
  ActionStackUndoRedo: 'ActionStackUndoRedo'
}

const emitter = new EventEmitter()

const request = (key, emit, cb) => {
  if (!key) {
    throw new Error('Lock key must be truthy')
  }

  if (ACTIVE_LOCKS[key]) {
    // Push to the end of the stack
    return ACTIVE_LOCKS[key].push(setTimeout(() => request(key, emit, cb), 0))
  }

  ACTIVE_LOCKS[key] = [-1]
  if (emit) {
    emitter.emit('lock-on', key)
  }

  const release = () => {
    ACTIVE_LOCKS[key].shift()
    if (ACTIVE_LOCKS[key].length === 0) {
      ACTIVE_LOCKS[key] = undefined
    }
    if (emit) {
      emitter.emit('lock-off', key)
    }
  }

  return cb(release)
}

const clearAll = () => {
  for (const key in ACTIVE_LOCKS) {
    while (ACTIVE_LOCKS[key].length > 0) {
      clearTimeout(ACTIVE_LOCKS[key].shift())
    }
    ACTIVE_LOCKS[key] = undefined
  }
}

const getQueueDepth = (key) => ACTIVE_LOCKS[key] ? ACTIVE_LOCKS[key].length : 0

const hasPendingRequest = (key) => getQueueDepth(key) > 1

module.exports = {
  request,
  emitter,
  clearAll,
  hasPendingRequest,
  LOCKS,
  ACTIVE_LOCKS
}
