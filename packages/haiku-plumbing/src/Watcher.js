import chokidar from 'chokidar'
import { EventEmitter } from 'events'

export default class Watcher extends EventEmitter {
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

    this.watcher.on('add', this.emit.bind(this, 'add'))
    this.watcher.on('change', (path, maybeStats) => {
      this.emit('change', path, maybeStats)
    })
    this.watcher.on('unlink', this.emit.bind(this, 'remove'))
    this.watcher.on('error', this.emit.bind(this, 'error'))
  }

  stop () {
    this.watcher.close()
  }
}
