import chokidar from 'chokidar'
import { EventEmitter } from 'events'
import { LOCKS, emitter } from 'haiku-serialization/src/bll/Lock'

const WRITE_WAIT_DELAY = 1000

export default class Watcher extends EventEmitter {
  constructor () {
    super()
    this.boundBlacklister = (key) => {
      this.blacklistKey(key)
    }
    this.boundUnblacklister = (key) => {
      this.unblacklistKey(key)
    }
    this.blacklist = {}
    this.blacklistTimeouts = {}
  }

  blacklistKey (fileReadWriteLockKey) {
    this.blacklist[fileReadWriteLockKey] = true
    if (!this.blacklistTimeouts[fileReadWriteLockKey]) {
      this.blacklistTimeouts[fileReadWriteLockKey] = []
    }
    // Cancel any pending unblacklists for this key.
    while (this.blacklistTimeouts[fileReadWriteLockKey].length > 0) {
      clearTimeout(this.blacklistTimeouts[fileReadWriteLockKey].shift())
    }
  }

  unblacklistKey (fileReadWriteLockKey) {
    this.blacklistTimeouts[fileReadWriteLockKey].push(setTimeout(() => {
      this.blacklist[fileReadWriteLockKey] = false
    }, WRITE_WAIT_DELAY))
  }

  isBlacklisted (abspath) {
    return this.blacklist[LOCKS.FileReadWrite(abspath)]
  }

  watch (entry) {
    this.watcher = chokidar.watch(entry, {
      // - Avoid any git blobs (there are tons of these)
      // - Avoid any sketch tempfiles (these are ephemeral and not needed)
      ignored: /(node_modules|bower_components|jspm_modules|\.git|~\.sketch)/,
      ignoreInitial: true,
      persistent: true,
      usePolling: true,
      // awaitWriteFinish: true, // Truthy delays emissions for larger files
      alwaysStat: true
    })
    emitter.on('lock-on', this.boundBlacklister)
    emitter.on('lock-off', this.boundUnblacklister)

    this.watcher.on('ready', this.emit.bind(this, 'ready'))
    this.watcher.on('add', this.emit.bind(this, 'add'))
    this.watcher.on('change', (path, maybeStats) => {
      !this.isBlacklisted(path) && this.emit('change', path, maybeStats)
    })
    this.watcher.on('unlink', this.emit.bind(this, 'remove'))
    this.watcher.on('error', this.emit.bind(this, 'error'))
  }

  stop () {
    this.watcher.close()
    emitter.removeListener('lock-on', this.boundBlacklister)
    emitter.removeListener('lock-off', this.boundUnblacklister)
  }
}
