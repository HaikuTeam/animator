const { EventEmitter } = require('events')

const ACTIVE_LOCKS = {}

const LOCKS = {
  ActiveComponentWork: 'ActiveComponentWork',
  ActiveComponentReload: 'ActiveComponentReload',
  FilePerformComponentWork: 'FilePerformComponentWork',
  FileReadWrite: (abspath) => { return `FileReadWrite:${abspath}` },
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
    return setTimeout(() => request(key, emit, cb), 0)
  }

  ACTIVE_LOCKS[key] = true
  if (emit) {
    emitter.emit('lock-on', key)
  }

  const release = () => {
    ACTIVE_LOCKS[key] = false
    if (emit) {
      emitter.emit('lock-off', key)
    }
  }

  return cb(release)
}

const clearAll = () => {
  for (const key in ACTIVE_LOCKS) {
    delete ACTIVE_LOCKS[key]
  }
}

module.exports = {
  request,
  emitter,
  clearAll,
  LOCKS,
  ACTIVE_LOCKS
}
