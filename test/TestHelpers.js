const path = require('path')
const fse = require('fs-extra')
const lodash = require('lodash')
const os = require('os')
const async = require('async')
const functionToRFO = require('@haiku/player/lib/reflection/functionToRFO').default
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

const ACTION_WAIT = 10000

const startHaiku = (folder, cb) => {
  const haiku = lodash.assign({}, haikuInfo, { folder, mode: 'creator' })

  const plumbing = new Plumbing()

  return plumbing.launch(haiku, (err) => {
    if (err) throw err

    /**
     * @method method
     * @description Run a plumbing method.
     */
    plumbing.method = (folder, method, params, done) => {
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

    /**
     * @method exec
     * @description Execute an arbitrary function.
     * The this-binding of the fn will be an instance of Project.
     */
    plumbing.exec = (folder, fn, {views, info}, done) => {
      const rfo = functionToRFO(fn).__function
      rfo.views = views
      rfo.info = info

      const method = 'executeFunctionSpecification'
      const params = ['', rfo]

      // If only sending to creator, just route straight there instead of the action loop
      if (!folder && views && views.length === 1 && views[0] === 'creator') {
        // Note that plumbing already knows to ignore the folder arg when routing to creator
        return plumbing.sendFolderSpecificClientMethodQuery(folder, {alias: 'creator'}, method, params, done)
      }

      return plumbing.method(folder, method, params, done)
    }

    plumbing.loginWithUI = (cb) => {
      return plumbing.exec(null, function(info, fin) {
        const username = 'matthew+matthew@haiku.ai'
        const password = 'supersecure'
        return this.refs.AuthenticationUI.setState({username, password}, function() {
          document.getElementById('haiku-button-login').click()
          return setTimeout(() => { return fin() }, 10000)
        })
      }, {views: ['creator']}, cb)
    }

    plumbing.logoutWithUI = (cb) => {
      return plumbing.exec(null, function(info, fin) {
        document.getElementById('haiku-button-show-account-popover').click()
        return setTimeout(() => {
          document.getElementById('haiku-button-logout').click()
          return setTimeout(() => { return fin() }, 10000)
        }, 1000)
      }, {views: ['creator']}, cb)
    }

    plumbing.createProjectWithUI = (name, cb) => {
      return plumbing.exec(null, function(info, fin) {
        document.getElementById('haiku-button-show-new-project-modal').click()
        return setTimeout(() => {
          this.refs.ProjectBrowser.handleNewProjectInputChange({target: {value: info.name}})
          return setTimeout(() => {
            this.refs.ProjectBrowser.handleNewProjectInputKeyDown({keyCode: 13})
            return setTimeout(() => { return fin() }, 10000 * 2)
          }, 1000)
        }, 1000)
      }, {views: ['creator'], info: {name}}, cb)
    }

    plumbing.deleteProjectWithUI = (name, cb) => {
      return plumbing.exec(null, function(info, fin) {
        this.refs.ProjectBrowser.showDeleteModal(0)
        return setTimeout(() => {
          this.refs.ProjectBrowser.handleDeleteInputChange({target: {value: info.name}})
          return setTimeout(() => {
            this.refs.ProjectBrowser.handleDeleteInputKeyDown({keyCode: 13})
            return setTimeout(() => { return fin() }, 10000)
          }, 1000)
        }, 1000)
      }, {views: ['creator'], info: {name}}, cb)
    }

    plumbing.backToDashboardWithUI = (cb) => {
      return plumbing.exec(null, function(info, fin) {
        document.getElementById('go-to-dashboard').click()
        return setTimeout(() => { return fin() }, 10000)
      }, {views: ['creator']}, cb)
    }

    return cb(null, plumbing)
  })
}

const logout = () => {
  const authToken = path.join(os.homedir(), '.haiku', 'auth')
  fse.removeSync(authToken)
}

const start = (worker) => {
  logout()
  
  return startHaiku(null, (err, plumbing) => {
    if (err) throw err

    // A bit of extra time for the Electron window to open up and show the login screen
    return setTimeout(() => {
      // We assume every test sequence begins by logging in and creating a fresh project
      return async.series([
        (cb) => { return plumbing.loginWithUI(cb) },
        (cb) => { return plumbing.createProjectWithUI('e2etest', cb) },
        (cb) => {
          const folder = Object.keys(plumbing.masters)[0]
          return worker({plumbing, folder}, (after) => {
            // And that the project ends by deleting the project and logging out
            return async.series([
              (cb) => { return plumbing.backToDashboardWithUI(cb) },
              (cb) => { return plumbing.deleteProjectWithUI('e2etest', cb) },
              (cb) => { return plumbing.logoutWithUI(cb) }
            ], (err) => {
              if (err) throw err
              return plumbing.teardown(() => {
                after()
                return cb()
              })
            })
          })
        }
      ], (err) => {
        if (err) throw err
      })
    }, 5000)
  })
}

const wait = (secs, cb) => {
  return (err) => {
    return setTimeout(() => cb(err), secs * 1000)
  }
}

const stripUnstableIdsFromHtml = (html) => {
  return html.replace(/haiku-id=".{12}"/g, '')
             .replace(/xlink:href=".+?"/g, '')
             .replace(/id=".+?"/g, '')
             .replace(/url\(#.+?\)/g, '')
}

module.exports = {
  start,
  stripUnstableIdsFromHtml,
  wait
}
