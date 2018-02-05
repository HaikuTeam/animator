const ACTIVE_LOCKS = {}

const LOCKS = {
  ActiveComponentReload: 'ActiveComponentReload',
  FilePerformComponentWork: 'FilePerformComponentWork',
  FileReadWrite: (abspath) => {
    return `FileReadWrite:${abspath}`
  },
  ProjectMethodHandler: 'ProjectMethodHandler'
}

const request = (key, cb) => {
  if (!key) {
    throw new Error('Lock key must be truthy')
  }

  if (ACTIVE_LOCKS[key]) {
    // Push to the end of the stack
    return setTimeout(() => request(key, cb))
  }

  ACTIVE_LOCKS[key] = true

  const release = () => {
    ACTIVE_LOCKS[key] = false
  }

  return cb(release)
}

module.exports = {
  request,
  LOCKS,
  ACTIVE_LOCKS
}
