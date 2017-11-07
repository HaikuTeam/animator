const lodash = require('lodash')
const cp = require('child_process')

var EXEC_OPTIONS = {
  maxBuffer: 1024 * 1024 // bytes
}

module.exports = function yarnInstall (pack, cb) {
  // TODO: Why does asynchronous execution crash a Macbook Pro?
  cp.execSync(
    `yarn install --mutex file:/tmp/.yarn_mono_lock --cache-folder="/tmp/.yarn_mono_cache" --ignore-engines \
        --frozen-lockfile --non-interactive`,
    lodash.merge(EXEC_OPTIONS, { cwd: pack.abspath, stdio: 'inherit' })
  )
  cb()
}
