const tape = require('tape')
const path = require('path')
const fse = require('fs-extra')
const lodash = require('lodash')
const os = require('os')
const async = require('async')
const functionToRFO = require('@haiku/core/lib/reflection/functionToRFO').default
const haikuInfo = require('../packages/haiku-plumbing/lib/haikuInfo').default()
const Plumbing = require('../packages/haiku-plumbing/lib/Plumbing').default

process.env.HAIKU_SKIP_AUTOUPDATE = '1' // Skip autoupdate
process.env.DEV = '1' // Force dev tools open

const DEFAULT_USERNAME = 'matthew+matthew@haiku.ai'
const DEFAULT_PASSWORD = 'supersecure'
const DEFAULT_PROJECT = 'e2etest'

/**
 * @description Wait the given number of seconds, then fire the callback
 */
const wait = (secs, cb) => {
  return (err) => {
    return setTimeout(() => cb(err), Math.floor(secs * 1000))
  }
}

/**
 * @description Start up the Haiku app, passing the plumbing instance to the callback.
 */
const start = (folder, cb) => {
  // Note: If the folder argument is falsy, Haiku will start in normal mode
  const haiku = lodash.assign({}, haikuInfo, { folder, mode: 'creator' })
  const plumbing = new Plumbing()
  return plumbing.launch(haiku, (err) => {
    if (err) throw err // No point proceeding if we haven't launched
    return cb(null, plumbing)
  })
}

/**
 * @description Force logout by clearing the on-disk auth token.
 */
const logout = () => {
  const authToken = path.join(os.homedir(), '.haiku', 'auth')
  fse.removeSync(authToken)
}

/**
 * @description Run an individual test.
 */
const run = (name, options = {}, runner) => {
  return tape(name, (t) => {
    // Log out; assumes all test runs should include a login step
    logout()

    // Passing null so that the app opens on the project dashboard
    return start(null, (err, plumbing) => {
      if (err) throw err

      // The async series of test steps to execute during this run
      const series = []

      // Data passed to every `step` function in all views
      const data = {}

      // For convenience, extend the `t` object with some extra utilities
      lodash.assign(t, {
        plumbing, // Let us talk to plumbing directly if we want to

        /**
         * @description Enqueue an individual test step
         */
        step: (fn) => {
          series.push((cb) => {
            setTimeout(() => fn(cb), 1000)
          })
        },

        /**
         * @description Merge some data into the data object that gets passed to all views.
         * This is available as the `data` argument passed to all step functions.
         */
        def: (obj) => {
          lodash.assign(data, obj)
        },

        /**
         * @description In all listed views, execute the given function, passing results to the after callback
         * The execution in the views occurs in the order that was passed.
         * Note that the function won't have the scope of this test runner; use `def` to pass data.
         * If you want access to this.creator, this.plumbing, etc, don't use an arrow function!
         */
        robin: (views, fn, after) => {
          return t.step((cb) => {
            return plumbing.executeFunction(
              views,
              data,
              fn,
              (err, out) => {
                return after(err, out, () => {
                  // Pad the end of any 'robin' with this timeout so the view has a chance to update
                  return setTimeout(cb, 5000)
                })
              }
            )
          })
        },
      })

      // Give Electron some time to open up and show the login screen
      t.step((cb) => {
        return setTimeout(cb, 5000)
      })

      // For now, assume all tests will use the default user/pass/project
      t.def({
        username: DEFAULT_USERNAME,
        password: DEFAULT_PASSWORD,
        project: DEFAULT_PROJECT
      })

      function deleteProjectIfPresent (data, cb) {
        // Find the project of the given name in the browser's projects list
        let indexOfProject = null
        const projectsList = this.creator.refs.ProjectBrowser.state.projectsList || []
        for (let i = 0; i < projectsList.length; i++) {
          if (projectsList[i].projectName === data.project) {
            indexOfProject = i
            break
          }
        }

        // No matching project found; early return
        if (indexOfProject === null) {
          return cb()
        }

        // Delete the project from the list, typing in its name to confirm
        this.creator.refs.ProjectBrowser.showDeleteModal(data.project)
        return setTimeout(() => {
          this.creator.refs.ProjectBrowser.handleDeleteInputChange({target: {value: data.project}})
          return setTimeout(() => {
            this.creator.refs.ProjectBrowser.handleDeleteInputKeyDown({keyCode: 13})
            return cb()
          }, 1000)
        }, 1000)
      }

      // Login using the authentication UI
      t.robin(
        ['creator'],
        function (data, cb) {
          return this.creator.refs.AuthenticationUI.setState({username: data.username, password: data.password}, () => {
            document.getElementById('haiku-button-login').click()
            return cb()
          })
        },
        (err, outputs, done) => {
          if (err) throw err
          return done()
        }
      )

      // If the project is left over from a previous run, delete it
      t.robin(
        ['creator'],
        deleteProjectIfPresent,
        (err, outputs, done) => {
          if (err) throw err
          return done()
        }
      )

      // Create a new project with the given name
      t.robin(
        ['creator'],
        function (data, cb) {
          document.getElementById('haiku-button-show-new-project-modal').click()
          return setTimeout(() => {
            this.creator.refs.ProjectBrowser.handleNewProjectInputChange({target: {value: data.project}})
            return setTimeout(() => {
              this.creator.refs.ProjectBrowser.handleNewProjectInputKeyDown({keyCode: 13})
              return cb()
            }, 1000)
          }, 1000)
        },
        (err, outputs, done) => {
          if (err) throw err
          // It takes longer to launch a project, so add some extra time
          return setTimeout(() => done(), 20000)
        }
      )

      // Execute the runner, giving individual tests a chance to plan tests and add steps
      runner(t)

      // Go back to the dashboard now that the main test sequence is done
      t.robin(
        ['creator'],
        function (data, cb) {
          document.getElementById('go-to-dashboard').click()
          return cb()
        },
        (err, outputs, done) => {
          if (err) throw err
          return done()
        }
      )

      // Delete the project since we're now done with it
      t.robin(
        ['creator'],
        deleteProjectIfPresent,
        (err, outputs, done) => {
          if (err) throw err
          return done()
        }
      )

      // Log out of the account
      t.robin(
        ['creator'],
        function (data, cb) {
          document.getElementById('haiku-button-show-account-popover').click()
          return setTimeout(() => {
            document.getElementById('haiku-button-logout').click()
            return cb()
          }, 1000)
        },
        (err, outputs, done) => {
          if (err) throw err
          return done()
        }
      )

      t.step((cb) => {
        t.plumbing.teardown(() => {
          cb()
        })
      })

      // Now that we've assembled the sequence, execute it
      return async.series(series, (err) => {
        if (err) throw err
        t.end()
      })
    })
  })
}

const stripUnstableIdsFromHtml = (html) => {
  return html.replace(/haiku-id=".{12}"/g, '')
             .replace(/xlink:href=".+?"/g, '')
             .replace(/id=".+?"/g, '')
             .replace(/url\(#.+?\)/g, '')
}

module.exports = {
  run,
  wait,
  stripUnstableIdsFromHtml
}
