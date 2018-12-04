const {EventEmitter} = require('events');

const ACTIVE_LOCKS = {};

const LOCKS = {
  ActiveComponentWork: 'ActiveComponentWork',
  ActiveComponentReload: 'ActiveComponentReload',
  FilePerformComponentWork: 'FilePerformComponentWork',
  FileReadWrite: (abspath) => {
    return `FileReadWrite:${abspath}`;
  },
  ProjectMethodHandler: 'ProjectMethodHandler',
  ActionStackUndoRedo: 'ActionStackUndoRedo',
  SetCurrentActiveComponent: 'SetCurrentActiveComponent',
};

const emitter = new EventEmitter();

const request = (key, emit, cb) => {
  if (!key) {
    throw new Error('Lock key must be truthy');
  }

  if (ACTIVE_LOCKS[key]) {
    // Push to the end of the stack
    return setTimeout(() => request(key, emit, cb), 0);
  }

  ACTIVE_LOCKS[key] = true;
  if (emit) {
    emitter.emit('lock-on', key);
  }

  const release = () => {
    if (emit) {
      emitter.emit('lock-off', key);
    }
    ACTIVE_LOCKS[key] = false;
  };

  return cb(release);
};

const awaitFree = (keys, cb) => {
  let anyLocked = false;

  keys.forEach((key) => {
    if (ACTIVE_LOCKS[key]) {
      anyLocked = true;
    }
  });

  if (anyLocked) {
    return setTimeout(() => awaitFree(keys, cb), 100);
  }

  return cb();
};

const awaitAllLocksFree = (cb) => awaitFree(Object.keys(ACTIVE_LOCKS), cb);

const awaitAllLocksFreeExcept = (keys, cb) => {
  const allKeys = Object.keys(ACTIVE_LOCKS).filter((key) => keys.indexOf(key) === -1);
  return awaitFree(allKeys, cb);
};

module.exports = {
  request,
  emitter,
  awaitFree,
  awaitAllLocksFree,
  awaitAllLocksFreeExcept,
  LOCKS,
  ACTIVE_LOCKS,
};
