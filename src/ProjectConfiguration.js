import path from 'path'
import assign from 'lodash.assign'
import safeRequire from './safeRequire'
import StateObject from 'haiku-state-object'

const CONFIGURATION_PATH = 'haiku.js'
const DEFAULTS = {} // ?

export default class ProjectConfiguration extends StateObject {
  load (folder, cb) {
    const abspath = path.join(folder, CONFIGURATION_PATH)
    return safeRequire(abspath, (err, loaded) => {
      if (err) return cb(err)
      if (!loaded) return cb(new Error('Cannot find project configuration'))
      const config = assign({}, DEFAULTS, loaded)

      // Object.defineProperty(this, 'config', { value: config })
      this.set('config', config)

      return cb(null, this)
    })
  }
}
