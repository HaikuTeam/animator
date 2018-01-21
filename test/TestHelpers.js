const cp = require('child_process')
const path = require('path')
const fse = require('fs-extra')
const lodash = require('lodash')
const async = require('async')
const haikuInfo = require('../packages/haiku-plumbing/lib/haikuInfo').default()
const Plumbing = require('../packages/haiku-plumbing/lib/Plumbing').default

process.env.HAIKU_SKIP_AUTOUPDATE = '1' // Skip autoupdate
process.env.DEV = '1' // Force dev tools open

const MONO_ROOT_DIR = path.join(__dirname, '..')

const HAIKU_HELPER_PATH = path.join(
  MONO_ROOT_DIR,
  'packages/haiku-plumbing',
  'HaikuHelper.js'
)

const BLANK_PROJECT_PATH = path.join(
  MONO_ROOT_DIR,
  'packages/haiku-plumbing',
  'test/fixtures/projects/blank-project/'
)

const AWAIT_TIMEOUT = 1000
const MAX_READY_ATTEMPTS = 30

const awaitReady = (attempts, folder, plumbing, cb) => {
  if (attempts > MAX_READY_ATTEMPTS) throw new Error('Gave up waiting')
  setTimeout(() => {
    if (plumbing.clients.length < 3) return awaitReady(attempts + 1, folder, plumbing, cb)
    if (!plumbing.masters[folder]) return awaitReady(attempts + 1, folder, plumbing, cb)
    if (!plumbing.masters[folder].project) return awaitReady(attempts + 1, folder, plumbing, cb)
    if (!plumbing.masters[folder].project.getCurrentActiveComponent()) return awaitReady(attempts + 1, folder, plumbing, cb)
    return cb()
  }, AWAIT_TIMEOUT)
}

const startHaiku = (folder, cb) => {
  const haiku = lodash.assign({}, haikuInfo, { folder, mode: 'creator' })

  const plumbing = new Plumbing()

  plumbing.launch(haiku, (err) => {
    if (err) throw err

    awaitReady(0, folder, plumbing, () => {
      plumbing.method = (method, params, done) => {
        params.unshift(folder)
        return plumbing.handleClientAction(
          'controller',
          'plumbing',
          folder,
          method,
          params,
          done
        )
      }

      cb(null, plumbing)
    })
  })
}

const e2e = (worker) => {
  fse.removeSync(BLANK_PROJECT_PATH)
  fse.mkdirpSync(BLANK_PROJECT_PATH)

  startHaiku(BLANK_PROJECT_PATH, (err, plumbing) => {
    if (err) throw err

    const master = plumbing.masters[BLANK_PROJECT_PATH]
    const project = master.project
    const ac = project.getCurrentActiveComponent()

    worker({
      plumbing,
      master,
      project,
      relpath: ac.getSceneCodeRelpath(),
      folder: BLANK_PROJECT_PATH,
      ac
    }, () => {
      plumbing.teardown(() => {
        fse.removeSync(BLANK_PROJECT_PATH)
        fse.outputFileSync(path.join(BLANK_PROJECT_PATH, '.keep'), '')
      })
    })
  }) 
}

module.exports = {
  e2e
}
