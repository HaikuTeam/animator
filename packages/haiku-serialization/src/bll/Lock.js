const { EventEmitter } = require('events')

const ACTIVE_LOCKS = {}

const LOCKS = {
  ActiveComponentWork: 'ActiveComponentWork',
  ActiveComponentReload: 'ActiveComponentReload',
  FilePerformComponentWork: 'FilePerformComponentWork',
  FileReadWrite: (abspath) => { return `FileReadWrite:${abspath}` },
  ProjectMethodHandler: 'ProjectMethodHandler',
  ActionStackUndoRedo: 'ActionStackUndoRedo',
  SetCurrentActiveCompnent: 'SetCurrentActiveCompnent'
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
    if (emit) {
      emitter.emit('lock-off', key)
    }
    ACTIVE_LOCKS[key] = false
  }

  return cb(release)
}

const clearAll = () => {
  for (const key in ACTIVE_LOCKS) {
    delete ACTIVE_LOCKS[key]
  }
}

const awaitFree = (keys, cb) => {
  let anyLocked = false

  keys.forEach((key) => {
    if (ACTIVE_LOCKS[key]) {
      anyLocked = true
    }
  })

  if (anyLocked) {
    return setTimeout(() => awaitFree(keys, cb), 100)
  }

  return cb()
}

module.exports = {
  request,
  emitter,
  clearAll,
  awaitFree,
  LOCKS,
  ACTIVE_LOCKS
}
