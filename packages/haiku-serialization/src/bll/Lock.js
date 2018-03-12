const ACTIVE_LOCKS = {}

const LOCKS = {
  ActiveComponentWork: 'ActiveComponentWork',
  ActiveComponentReload: 'ActiveComponentReload',
  FilePerformComponentWork: 'FilePerformComponentWork',
  FileReadWrite: (abspath) => { return `FileReadWrite:${abspath}` },
  ProjectMethodHandler: 'ProjectMethodHandler',
  ActionStackUndoRedo: 'ActionStackUndoRedo'
}

const request = (key, cb) => {
  if (!key) {
    throw new Error('Lock key must be truthy')
  }

  if (ACTIVE_LOCKS[key]) {
    // Push to the end of the stack
    return setTimeout(() => request(key, cb), 0)
  }

  ACTIVE_LOCKS[key] = true

  const release = () => {
    ACTIVE_LOCKS[key] = false
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
  clearAll,
  LOCKS,
  ACTIVE_LOCKS
}
