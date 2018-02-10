import path from 'path'
import async from 'async'
import fse from 'haiku-fs-extra'
import lodash from 'lodash'
import find from 'lodash.find'
import merge from 'lodash.merge'
import filter from 'lodash.filter'
import net from 'net'
import qs from 'qs'
import WebSocket from 'ws'
import { EventEmitter } from 'events'
import EnvoyServer from 'haiku-sdk-creator/lib/envoy/EnvoyServer'
import EnvoyLogger from 'haiku-sdk-creator/lib/envoy/EnvoyLogger'
import { EXPORTER_CHANNEL, ExporterHandler } from 'haiku-sdk-creator/lib/exporter'
import { USER_CHANNEL, UserHandler } from 'haiku-sdk-creator/lib/bll/User'
import { GLASS_CHANNEL, GlassHandler } from 'haiku-sdk-creator/lib/glass'
import { TimelineHandler } from 'haiku-sdk-creator/lib/timeline'
import { TourHandler } from 'haiku-sdk-creator/lib/tour'
import { inkstone } from '@haiku/sdk-inkstone'
import { client as sdkClient } from '@haiku/sdk-client'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'
import StateObject from 'haiku-state-object'
import serializeError from 'haiku-serialization/src/utils/serializeError'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import mixpanel from 'haiku-serialization/src/utils/Mixpanel'
import * as ProjectFolder from './ProjectFolder'
import { crashReport } from 'haiku-serialization/src/utils/carbonite'
import { HOMEDIR_PATH } from 'haiku-serialization/src/utils/HaikuHomeDir'
import functionToRFO from '@haiku/core/lib/reflection/functionToRFO'
import Master from './Master'

global.eval = function () { // eslint-disable-line
  // noop: eval is forbidden
}

// Useful debugging originator of calls in shared model code
process.env.HAIKU_SUBPROCESS = 'plumbing'

Error.stackTraceLimit = Infinity // Show long stack traces when errors are shown

const Raven = require('./Raven')

// Don't allow malicious websites to connect to our websocket server (Plumbing or Envoy)
const HAIKU_WS_SECURITY_TOKEN = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
const WS_POLICY_VIOLATION_CODE = 1008

// For any methods that are...
// - noisy
// - internal use only
// - housekeeping
// we'll skip Sentry for now.
const METHODS_TO_SKIP_IN_SENTRY = {
  setTimelineTime: true,
  doesProjectHaveUnsavedChanges: true,
  masterHeartbeat: true,
  applyPropertyGroupDelta: true,
  applyPropertyGroupValue: true,
  moveSegmentEndpoints: true,
  moveKeyframes: true,
  toggleDevTools: true,
  fetchProjectInfo: true
}

const IGNORED_METHOD_MESSAGES = {
  setTimelineTime: true,
  doesProjectHaveUnsavedChanges: true,
  masterHeartbeat: true
}

// See note under 'processMethodMessage' for the purpose of this
const METHOD_MESSAGES_TO_HANDLE_IMMEDIATELY = {
  setTimelineTime: true,
  doesProjectHaveUnsavedChanges: true,
  masterHeartbeat: true,
  toggleDevTools: true,
  openTextEditor: true,
  openTerminal: true,
  saveProject: true,
  listProjects: true,
  fetchProjectInfo: true,
  doLogOut: true,
  deleteProject: true,
  teardownMaster: true
}

const METHOD_MESSAGES_TIMEOUT = 10000
const METHODS_TO_AWAIT_FOREVER = {}

const Q_GLASS = { alias: 'glass' }
const Q_TIMELINE = { alias: 'timeline' }
const Q_CREATOR = { alias: 'creator' }
const Q_MASTER = { alias: 'master' }

const AWAIT_INTERVAL = 100
const WAIT_DELAY = 10 * 1000

const HAIKU_DEFAULTS = {
  socket: {
    port: process.env.HAIKU_CONTROL_PORT,
    host: process.env.HAIKU_CONTROL_HOST || '0.0.0.0'
  }
}

// configure inkstone, useful for testing off of dev (HAIKU_API=https://localhost:8080/)
if (process.env.HAIKU_API) {
  inkstone.setConfig({
    baseUrl: process.env.HAIKU_API
  })
}

const emitter = new EventEmitter()

const PINFO = `${process.pid} ${path.basename(__filename)} ${path.basename(process.execPath)}`

const PLUMBING_INSTANCES = []

const teardownPlumbings = (cb) => {
  return async.each(PLUMBING_INSTANCES, (plumbing, next) => {
    return plumbing.teardown(next)
  }, cb)
}

// In test environment these listeners may get wrapped so we begin listening
// to them immediately in the hope that we can start listening before the
// test wrapper steps in and interferes
process.on('exit', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) exiting`)
  teardownPlumbings(() => {})
})
process.on('SIGINT', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) SIGINT`)
  teardownPlumbings(() => {
    process.exit()
  })
})
process.on('SIGTERM', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) SIGTERM`)
  teardownPlumbings(() => {
    process.exit()
  })
})

// Apparently there are circumstances where we won't crash (?); ensure that we do
process.on('uncaughtException', (err) => {
  console.error(err)

  // Notify mixpanel so we can track improvements to the app over time
  mixpanel.haikuTrackOnce('app:crash', { error: err.message })

  // Exit after timeout to give a chance for mixpanel to transmit
  setTimeout(() => {
    // Wait for teardown so we don't interrupt e.g. an important disk-write
    teardownPlumbings(() => {
      process.exit(1)
    })
  }, 100)
})

export default class Plumbing extends StateObject {
  constructor () {
    super()

    // Keep track of all PLUMBING_INSTANCES so we can put our process.on listeners
    // above this constructor, which is necessary in test environments such
    // as tape where exit might never get called despite an exit.
    PLUMBING_INSTANCES.push(this)

    this.masters = {} // Instances of Master, keyed by folder
    this.servers = [] // Websocket servers (there is usually only one)
    this.clients = [] // Websocket clients
    this.requests = {} // Websocket requests, keyed by id

    // Avoid creating new handles if we have been explicitly torn down by a signal
    this._isTornDown = false

    this._methodMessages = []

    this.executeMethodMessagesWorker()

    emitter.on('teardown-requested', () => this.teardown())
  }

  /**
   * Mostly-internal methods
   */

  launch (haiku = {}, cb) {
    haiku = merge({}, HAIKU_DEFAULTS, haiku)

    logger.info('[plumbing] launching plumbing', haiku)

    this.envoyServer = new EnvoyServer({
      token: HAIKU_WS_SECURITY_TOKEN,
      WebSocket: WebSocket,
      logger: new EnvoyLogger('warn', logger)
    })

    return this.envoyServer.ready().then(() => {
      if (!haiku.envoy) haiku.envoy = {} // Gets stored in env vars before subprocs created

      haiku.envoy.port = this.envoyServer.port
      haiku.envoy.host = this.envoyServer.host
      haiku.envoy.token = HAIKU_WS_SECURITY_TOKEN

      const envoyTimelineHandler = new TimelineHandler(this.envoyServer)
      const envoyTourHandler = new TourHandler(this.envoyServer)
      const envoyExporterHandler = new ExporterHandler(this.envoyServer)
      const envoyGlassHandler = new GlassHandler(this.envoyServer)
      const envoyUserHandler = new UserHandler(this.envoyServer)

      this.envoyServer.bindHandler('timeline', TimelineHandler, envoyTimelineHandler)
      this.envoyServer.bindHandler('tour', TourHandler, envoyTourHandler)
      this.envoyServer.bindHandler(EXPORTER_CHANNEL, ExporterHandler, envoyExporterHandler)
      this.envoyServer.bindHandler(USER_CHANNEL, UserHandler, envoyUserHandler)
      this.envoyServer.bindHandler(GLASS_CHANNEL, GlassHandler, envoyGlassHandler)

      logger.info('[plumbing] launching plumbing control server')

      haiku.socket.token = HAIKU_WS_SECURITY_TOKEN

      return this.launchControlServer(haiku.socket, (err, server, host, port) => {
        if (err) return cb(err)

        // Forward these env vars to creator
        process.env.HAIKU_PLUMBING_PORT = port
        process.env.HAIKU_PLUMBING_HOST = host
        process.env.HAIKU_WS_SECURITY_TOKEN = HAIKU_WS_SECURITY_TOKEN

        if (!haiku.socket) haiku.socket = {}

        haiku.socket.port = port
        haiku.socket.host = host

        haiku.plumbing = { url: `http://${host}:${port}` }

        this.servers.push(server)

        server.on('connection', (websocket, request) => {
          const params = getWsParams(websocket, request)

          if (haiku.socket.token && params.token !== haiku.socket.token) {
            logger.info(`[plumbing] websocket connected with bad token ${params.token}`)
            websocket.close(WS_POLICY_VIOLATION_CODE, 'forbidden')
            return
          }

          if (!params.type) params.type = 'default'
          if (!params.haiku) params.haiku = {}
          if (!websocket.params) websocket.params = params

          const type = websocket.params && websocket.params.type
          const alias = websocket.params && websocket.params.alias
          const folder = websocket.params && websocket.params.folder

          logger.info(`[plumbing] websocket for ${folder} connected (${type} ${alias})`)

          // Don't allow multiple clients of the same alias and folder
          for (let i = this.clients.length - 1; i >= 0; i--) {
            const client = this.clients[i]

            if (client.params) {
              if (client.params.alias === alias && client.params.folder === folder) {
                if (client.readyState === WebSocket.OPEN) {
                  client.close()
                }

                this.clients.splice(i, 1)
              }
            }
          }

          this.clients.push(websocket)

          websocket.on('close', () => {
            logger.info(`[plumbing] websocket  for ${folder} closed (${type} ${alias})`)
            this.removeWebsocketClient(websocket)
          })

          websocket.on('error', (err) => {
            logger.error(`[plumbing] websocket for ${folder} errored (${type} ${alias})`, err)
            throw err
          })

          websocket.on('message', (data) => {
            const message = JSON.parse(data)

            this.handleRemoteMessage(
              type,
              alias,
              message.folder || folder,
              message,
              websocket,
              server,
              createResponder(message, websocket)
            )
          })
        })

        this.spawnSubgroup(haiku, (err) => {
          if (err) return cb(err)
          return cb(null, host, port, server, null, haiku.envoy)
        })
      })
    })
  }

  removeWebsocketClient (websocket) {
    for (let j = this.clients.length - 1; j >= 0; j--) {
      let client = this.clients[j]
      if (client === websocket) {
        this.clients.splice(j, 1)
      }
    }
  }

  /**
   * @method executeFunction
   * @param views {Array} List of all views in which to execute the function
   * @param data {Object} Data object to pass to the function on each execution
   * @param fn {Function} The function to execute
   * @param cb {Function} The callback to call when finished
   * @description Execute an arbitrary function in all of the subviews.
   * The this-binding of the function will be an instance of Project, if available.
   */
  executeFunction (views, data, fn, cb) {
    const outputs = {}
    return async.eachSeries(views, (alias, next) => {
      const finish = (err, result) => {
        if (err) return next(err)
        outputs[alias] = result
        return next()
      }
      if (alias === 'plumbing') {
        return fn.call({ plumbing: this }, data, finish)
      }
      const rfo = lodash.assign(functionToRFO(fn).__function, data)
      return this.sendQueriedClientMethod(
        lodash.assign({alias}, data),
        'executeFunctionSpecification',
        [rfo, {from: 'plumbing'}],
        finish
      )
    }, (err) => {
      if (err) return cb(err)
      return cb(null, outputs)
    })
  }

  /**
   * @method invokeAction
   * @description Convenience wrapper around making a generic action call
   */
  invokeAction (folder, method, params, cb) {
    params.unshift(folder)
    return this.handleRemoteMessage(
      'controller',
      'plumbing',
      folder,
      { method, params, folder, type: 'action' },
      null,
      null,
      cb
    )
  }

  handleRemoteMessage (type, alias, folder, message, websocket, server, responder) {
    // IMPORTANT! Creator uses this
    if (!folder && message.folder) {
      folder = message.folder
    }

    if (message.type === 'broadcast') {
      // HACK: This doesn't belong here, but it's convenient while I refactor
      if (message.name === 'component:reload:complete') {
        return this.findMasterByFolder(folder)._mod.handleReloadComplete(message)
      }

      // Give clients the chance to emit events to all others
      return this.sendBroadcastMessage(message, folder, alias, websocket)
    }

    if (message.id && this.requests[message.id]) {
      // If we have an entry in this.requests, that means this is a reply
      const { callback } = this.requests[message.id]
      delete this.requests[message.id]
      return callback(message.error, message.result, message)
    }

    if (message.method) {
      // Ensure that actions/methods occur in order by using a queue
      return this.processMethodMessage(type, alias, folder, message, responder)
    }
  }

  methodMessageBeforeLog (message, alias) {
    if (!IGNORED_METHOD_MESSAGES[message.method]) {
      logger.info(`[plumbing] ↓-- ${message.method} via ${alias} -> ${JSON.stringify(message.params)} --↓`)
    }
  }

  methodMessageAfterLog (message, err, result, alias) {
    if (!IGNORED_METHOD_MESSAGES[message.method]) {
      if ((err && err.message) || (err && err.stack)) {
        logger.info(`[plumbing] ${message.method} error ${err.stack || err.message}`)
      }
      logger.info(`[plumbing] ↑-- ${message.method} via ${alias} --↑`)
    }
  }

  executeMethodMessagesWorker () {
    if (this._isTornDown) return void (0) // Avoid leaking a handle

    const nextMethodMessage = this._methodMessages.shift()

    if (!nextMethodMessage) {
      return setTimeout(this.executeMethodMessagesWorker.bind(this), 64)
    }

    const { type, alias, folder, message, cb } = nextMethodMessage

    this.methodMessageBeforeLog(message, alias)

    // If it takes too long for us to get a response for a method, kick start the queue
    // again so we don't hang when important new messages are being received
    let timedOut = false
    let gotResponse = false

    if (!METHODS_TO_AWAIT_FOREVER[message.method]) {
      setTimeout(() => {
        timedOut = true
        if (!gotResponse) {
          logger.warn(`[plumbing] timed out waiting for ${message.method}; restarting worker`)
          this.executeMethodMessagesWorker()
        }
      }, METHOD_MESSAGES_TIMEOUT)
    }

    // Actions are a special case of methods that end up routed through all of the clients,
    // glass -> timeline -> master before returning. They go through one handler as opposed
    // to the normal 'methods' which plumbing handles on a more a la carte basis
    if (message.type === 'action') {
      return this.handleClientAction(type, alias, folder, message.method, message.params, (err, result) => {
        if (timedOut) {
          logger.warn(`[plumbing] received late response from timed out action ${message.method}`)
        }

        this.methodMessageAfterLog(message, err, result, alias)
        cb(err, result)

        if (!timedOut) {
          gotResponse = true
          this.executeMethodMessagesWorker() // Continue with the next queue entry (if any)
        }
      })
    }

    return this.plumbingMethod(message.method, message.params || [], (err, result) => {
      if (timedOut) {
        logger.warn(`[plumbing] received late response from timed out method ${message.method}`)
      }

      this.methodMessageAfterLog(message, err, result, alias)
      cb(err, result)

      if (!timedOut) {
        gotResponse = true
        this.executeMethodMessagesWorker() // Continue with the next queue entry (if any)
      }
    })
  }

  processMethodMessage (type, alias, folder, message, cb) {
    // Certain messages aren't of a kind that we can reliably enqueue -
    // either they happen too fast or they are 'fire and forget'
    if (METHOD_MESSAGES_TO_HANDLE_IMMEDIATELY[message.method]) {
      if (message.type === 'action') {
        return this.handleClientAction(type, alias, folder, message.method, message.params, cb)
      } else {
        return this.plumbingMethod(message.method, message.params, cb)
      }
    } else {
      this._methodMessages.push({ type, alias, folder, message, cb })
    }
  }

  sendBroadcastMessage (message, folder, alias, websocket) {
    this.clients.forEach((client) => {
      if (websocket && client === websocket) return void (0) // Skip message's send
      if (client.readyState !== WebSocket.OPEN) return void (0)
      delete message.id // Don't confuse this as a request/response
      sendMessageToClient(client, merge(message, { folder, alias }))
    })
  }

  sentryError (method, error, extras) {
    try {
      logger.info(`[plumbing] error @ ${method}`, error, extras)
      if (!Raven) return null
      if (method && METHODS_TO_SKIP_IN_SENTRY[method]) return null
      if (!error) return null
      if (typeof error === 'object' && !(error instanceof Error)) {
        const fixed = new Error(error.message || `Plumbing.${method} error`)
        if (error.stack) fixed.stack = error.stack
        error = fixed
      } else if (typeof error === 'string') {
        error = new Error(error) // Unfortunately no good stack trace in this case
      }
      crashReport(this.get('organizationName'), this.get('lastOpenedProjectName'), this.get('lastOpenedProjectPath'))
      return Raven.captureException(error, extras)
    } catch (exception) {
      logger.info(`[plumbing] unable to send crash report`)
      logger.error(exception)
    }
  }

  plumbingMethod (method, params = [], cb) {
    if (typeof this[method] !== 'function') return cb(new Error(`Plumbing has no method '${method}'`))
    return this[method].apply(this, params.concat((error, result) => {
      if (error) return cb(error)
      return cb(null, result)
    }))
  }

  awaitClientWithQuery (query, timeout, cb) {
    if (!query) {
      throw new Error('Query is required')
    }

    const fixed = {alias: query.alias}

    // The creator socket doesn't have a folder param, so omit the folder
    // from the query otherwise we won't find the socket in the collection
    if (fixed.alias !== 'creator') {
      if (query.folder) {
        fixed.folder = query.folder
      }
    }

    if (timeout <= 0) {
      logger.warn(`[plumbing] timed out waiting for client ${JSON.stringify(fixed)}`)
      return null
    }

    const clientMatching = find(
      this.clients,
      {params: fixed}
    )

    if (clientMatching) {
      return cb(null, clientMatching)
    }

    return setTimeout(() => {
      return this.awaitClientWithQuery(query, timeout - AWAIT_INTERVAL, cb)
    }, AWAIT_INTERVAL)
  }

  sendQueriedClientMethod (query = {}, method, params = [], cb) {
    return this.awaitClientWithQuery(query, WAIT_DELAY, (err, client) => {
      if (err) return cb(err)

      // Give a maximum of 10 seconds before forcing a crash if the client doesn't respond.
      // If the page crashes before sending the result, we might not find out and could lose work.
      let responseReceived = false
      let timedOut = false

      // In dev, we may use a debugger in which case we don't want to force a timeout
      setTimeout(() => {
        timedOut = true

        if (!responseReceived) {
          logger.warn(`[plumbing] timed out sending ${method} to client ${JSON.stringify(query)}`)
        }
      }, WAIT_DELAY)

      return this.sendClientMethod(client, method, params, (error, response) => {
        responseReceived = true

        if (!timedOut) {
          if (error) {
            this.sentryError(method, error, { tags: query })
            return cb(error)
          }

          return cb(null, response)
        }
      })
    })
  }

  sendClientMethod (websocket, method, params = [], callback) {
    const message = { method, params }
    return this.sendClientRequest(websocket, message, callback)
  }

  sendClientRequest (websocket, message, callback) {
    if (message.id === undefined) message.id = `${Math.random()}`
    this.requests[message.id] = { websocket, message, callback }
    const data = JSON.stringify(message)
    // In case we get an error here, log it and then throw so we can see context
    if (websocket.readyState === WebSocket.OPEN) {
      return websocket.send(data, (err) => {
        if (err) {
          logger.error(err)
          throw err
        }
      })
    } else {
      throw new Error('WebSocket is not open')
    }
  }

  teardown (cb) {
    logger.info('[plumbing] teardown method called')

    return async.eachOfSeries(this.masters, (master, folder, next) => {
      return master.teardown(next)
    }, () => {
      if (this.envoyServer) {
        logger.info('[plumbing] closing envoy server')
        this.envoyServer.close()
      }

      this.servers.forEach((server) => {
        logger.info('[plumbing] closing server')
        server.close()
      })

      this._isTornDown = true

      if (cb) cb()
    })
  }

  toggleDevTools (folder, cb) {
    this.sendBroadcastMessage({ type: 'broadcast', name: 'dev-tools:toggle' })
    cb()
  }

  /**
   * Outward-facing
   */

  masterHeartbeat (folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'masterHeartbeat', [{ from: 'master' }], cb)
  }

  doesProjectHaveUnsavedChanges (folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'doesProjectHaveUnsavedChanges', [{ from: 'master' }], cb)
  }

  /**
   * @method initializeProject
   * @description Flexible method for setting up a project based on an unknown file system state and possibly missing inputs.
   * We make a decision here as to where + whether to generate a new folder.
   * When it is ready, we kick off the content initialization step with initializeFolder.
   */
  initializeProject (
    maybeProjectName,
    { projectsHome, projectPath, skipContentCreation, organizationName, authorName, repositoryUrl },
    maybeUsername,
    maybePassword,
    finish
  ) {
    const projectOptions = {
      projectsHome,
      projectPath,
      skipContentCreation,
      organizationName,
      repositoryUrl,
      projectName: maybeProjectName,
      username: maybeUsername,
      password: maybePassword
    }

    // TODO/QUESTION: When do these attributes get set upstream?
    if (!projectOptions.organizationName) projectOptions.organizationName = this.get('organizationName')
    if (!projectOptions.authorName) projectOptions.authorName = this.get('username')

    // We don't need to waste time making these bundles before we have done anything -
    // Instead, we'll generate them just-in-time when the user saves.
    projectOptions.skipCDNBundles = true

    let projectFolder
    let didFolderAlreadyExist

    return async.series([
      (cb) => {
        if (projectOptions.organizationName) {
          return cb()
        }
        return this.getCurrentOrganizationName((err, organizationName) => {
          if (err) return cb(err)
          projectOptions.organizationName = organizationName
          return cb()
        })
      },
      (cb) => {
        return ProjectFolder.ensureProject(projectOptions, (err, _projectFolder, _didFolderAlreadyExist) => {
          if (err) return cb(err)
          projectFolder = _projectFolder
          didFolderAlreadyExist = _didFolderAlreadyExist
          return cb()
        })
      },
      (cb) => {
        const haikuInfo = {
          folder: projectFolder,
          username: projectOptions.username,
          organizationName: projectOptions.organizationName,
          projectName: projectOptions.projectName,
          projectPath: projectFolder,
          envoy: {
            host: this.envoyServer.host,
            port: this.envoyServer.port,
            token: process.env.HAIKU_WS_SECURITY_TOKEN
          }
        }
        return this.spawnSubgroup(haikuInfo, (err) => {
          if (err) return cb(err)
          return cb()
        })
      }
    ], (err) => {
      if (err) {
        this.sentryError('initializeProject', err)
        return finish(err)
      }

      // QUESTION: Does this *need* to happen down here after the org fetch?
      const gitInitializeUsername = projectOptions.username || this.get('username')
      const gitInitializePassword = projectOptions.password || this.get('password')

      // A simpler project options to avoid passing options only used for the first pass, e.g. skipContentCreation
      const projectOptionsAgain = {
        didFolderAlreadyExist,
        organizationName: projectOptions.organizationName,
        repositoryUrl: projectOptions.repositoryUrl,
        username: gitInitializeUsername,
        password: gitInitializePassword,
        authorName
      }

      return this.initializeFolder(maybeProjectName, projectFolder, gitInitializeUsername, gitInitializePassword, projectOptionsAgain, (err) => {
        if (err) return finish(err)

        if (Raven) {
          Raven.setContext({
            user: { email: projectOptionsAgain.username }
          })
        }

        this.set('lastOpenedProjectName', maybeProjectName)
        this.set('lastOpenedProjectPath', projectFolder)

        return finish(null, projectFolder)
      })
    })
  }

  /**
   * @method initializeFolder
   * @description Assuming we already have a folder created, an organization name, etc., now bootstrap the folder itself.
   */
  initializeFolder (maybeProjectName, folder, maybeUsername, maybePassword, projectOptions, cb) {
    return this.awaitMasterAndCallMethod(folder, 'initializeFolder', [maybeProjectName, maybeUsername, maybePassword, projectOptions, { from: 'master' }], cb)
  }

  startProject (maybeProjectName, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'startProject', [{ from: 'master' }], cb)
  }

  restartProject (folder, projectInfo, cb) {
    // We run initializeFolder first to ensure the Git bootstrapping works correctly, especially setting
    // a branch name and ensuring we have a good baseline commit with which to start; we get errors on restart
    // unless we do this so take care if you plan to re/move this
    return this.awaitMasterAndCallMethod(folder, 'initializeFolder', [projectInfo.name, projectInfo.username, projectInfo.password, projectInfo.options, { from: 'master' }], (err) => {
      if (err) return cb(err)
      return this.awaitMasterAndCallMethod(folder, 'restartProject', [{ from: 'master' }], cb)
    })
  }

  isUserAuthenticated (cb) {
    const answer = sdkClient.config.isAuthenticated()
    if (!answer) {
      return cb(null, { isAuthed: false })
    }
    return this.getCurrentOrganizationName((err, organizationName) => {
      if (err) return cb(err)
      const username = sdkClient.config.getUserId()
      mixpanel.mergeToPayload({ distinct_id: username })
      if (Raven) {
        Raven.setContext({
          user: { email: username }
        })
      }
      return cb(null, {
        isAuthed: true,
        username: username,
        authToken: sdkClient.config.getAuthToken(),
        organizationName
      })
    })
  }

  resendEmailConfirmation (username, cb) {
    return inkstone.user.requestConfirmEmail(username, cb)
  }

  authenticateUser (username, password, cb) {
    this.set('organizationName', null) // Unset this cache to avoid writing others folders if somebody switches accounts in the middle of a session
    return inkstone.user.authenticate(username, password, (authErr, authResponse, httpResponse) => {
      if (authErr) return cb(authErr)
      if (httpResponse.statusCode === 401 || httpResponse.statusCode === 403) {
        // eslint-disable-next-line standard/no-callback-literal
        return cb({
          code: httpResponse.statusCode,
          message: httpResponse.body || 'Unauthorized'
        })
      }

      if (httpResponse.statusCode > 499) {
        const serverErr = new Error(`Auth HTTP Error: ${httpResponse.statusCode}`)
        this.sentryError('authenticateUser', serverErr)
        return cb(serverErr)
      }

      if (httpResponse.statusCode > 299) {
        const unexpectedError = new Error(`Auth HTTP Error: ${httpResponse.statusCode}`)
        return cb(unexpectedError)
      }

      if (!authResponse) return cb(new Error('Auth response was empty'))
      this.set('username', username)
      this.set('password', password)
      this.set('inkstoneAuthToken', authResponse.Token)
      sdkClient.config.setAuthToken(authResponse.Token)
      sdkClient.config.setUserId(username)
      mixpanel.mergeToPayload({ distinct_id: username })
      if (Raven) {
        Raven.setContext({
          user: { email: username }
        })
      }
      return this.getCurrentOrganizationName((err, organizationName) => {
        if (err) return cb(err)
        return cb(null, {
          isAuthed: true,
          username: username,
          authToken: authResponse.Token,
          organizationName
        })
      })
    })
  }

  getCurrentOrganizationName (cb) {
    if (this.get('organizationName')) return cb(null, this.get('organizationName'))
    logger.info('[plumbing] fetching organization name for current user')
    try {
      const authToken = sdkClient.config.getAuthToken()
      return inkstone.organization.list(authToken, (orgErr, orgsArray, orgHttpResp) => {
        if (orgErr) return cb(new Error('Organization error'))
        if (orgHttpResp.statusCode === 401) return cb(new Error('Unauthorized organization'))
        if (orgHttpResp.statusCode > 299) return cb(new Error(`Error status code: ${orgHttpResp.statusCode}`))
        if (!orgsArray || orgsArray.length < 1) return cb(new Error('No organization found'))
        // Cache this since it's used to write/manage some project files
        const organizationName = orgsArray[0].Name
        logger.info('[plumbing] organization name:', organizationName)
        this.set('organizationName', organizationName)
        return cb(null, this.get('organizationName'))
      })
    } catch (exception) {
      logger.error(exception)
      return cb(new Error('Unable to find organization name from Haiku Cloud'))
    }
  }

  listProjects (cb) {
    logger.info('[plumbing] listing projects')
    try {
      const authToken = sdkClient.config.getAuthToken()
      return inkstone.project.list(authToken, (projectListErr, projectsList) => {
        if (projectListErr) {
          this.sentryError('listProjects', projectListErr)
          return cb(projectListErr)
        }

        const finalList = new Array(projectsList.length)
        async.eachOf(projectsList, (project, index, done) => {
          finalList[index] = remapProjectObjectToExpectedFormat(project, this.get('organizationName'))
          done()
        }, () => {
          logger.info('[plumbing] fetched project list', JSON.stringify(finalList))
          cb(null, finalList)
        })
      })
    } catch (exception) {
      logger.error(exception)
      return cb(new Error('Unable to load projects from Haiku Cloud'))
    }
  }

  createProject (name, cb) {
    logger.info('[plumbing] creating project', name)
    const authToken = sdkClient.config.getAuthToken()
    return inkstone.project.create(authToken, { Name: name }, (projectCreateErr, projectPayload) => {
      if (projectCreateErr) {
        this.sentryError('createProject', projectCreateErr)
        return cb(projectCreateErr)
      }
      const remoteProjectObject = remapProjectObjectToExpectedFormat(projectPayload, this.get('organizationName'))
      return cb(null, remoteProjectObject)
    })
  }

  deleteProject (name, path, cb) {
    logger.info('[plumbing] deleting project', name)
    const authToken = sdkClient.config.getAuthToken()
    return inkstone.project.deleteByName(authToken, name, (deleteErr) => {
      if (deleteErr) {
        this.sentryError('deleteProject', deleteErr)
        if (cb) return cb(deleteErr)
      }
      if (fse.existsSync(path)) {
        // Delete the project locally, but in a recoverable state.
        let archivePath = `${path}.bak`
        if (fse.existsSync(archivePath)) {
          let i = 0
          while (fse.existsSync(archivePath = `${path}.bak.${i++}`)) {}
        }
        return fse.move(path, archivePath, cb)
      }
      if (cb) return cb()
    })
  }

  teardownMaster (folder, cb) {
    logger.info(`[plumbing] tearing down master ${folder}`)

    if (this.masters[folder]) {
      this.masters[folder].active = false
      this.masters[folder].watchOff()
    }

    // Since we're about to nav back to the dashboard, we're also about to drop the
    // connection to the websockets, so here we close them to avoid crashes
    const clientsOfFolder = filter(this.clients, { params: { folder } })

    clientsOfFolder.forEach((clientOfFolder) => {
      const alias = clientOfFolder.params.alias
      if (alias === 'glass' || alias === 'timeline') {
        logger.info(`[plumbing] closing client ${alias} of ${folder}`)
        clientOfFolder.close()
        this.removeWebsocketClient(clientOfFolder)
      }
    })

    // Any messages destined for the folder need to be cleared since there's now
    // nobody who is able to receive them
    for (let i = this._methodMessages.length - 1; i >= 0; i--) {
      const message = this._methodMessages[i]
      if (message.folder === folder) {
        logger.info(`[plumbing] clearing message`, message)
        this._methodMessages.splice(i, 1)
      }
    }

    cb()
  }

  discardProjectChanges (folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'discardProjectChanges', [{ from: 'master' }], cb)
  }

  saveProject (folder, projectName, maybeUsername, maybePassword, saveOptions, cb) {
    if (!saveOptions) saveOptions = {}
    if (!saveOptions.authorName) saveOptions.authorName = this.get('username')
    if (!saveOptions.organizationName) saveOptions.organizationName = this.get('organizationName')
    logger.info('[plumbing] saving with options', saveOptions)
    return this.awaitMasterAndCallMethod(folder, 'saveProject', [projectName, maybeUsername, maybePassword, saveOptions, { from: 'master' }], cb)
  }

  fetchProjectInfo (folder, projectName, maybeUsername, maybePassword, fetchOptions, cb) {
    if (!fetchOptions) fetchOptions = {}
    if (!fetchOptions.authorName) fetchOptions.authorName = this.get('username')
    if (!fetchOptions.organizationName) fetchOptions.organizationName = this.get('organizationName')
    return this.awaitMasterAndCallMethod(folder, 'fetchProjectInfo', [projectName, maybeUsername, maybePassword, fetchOptions, { from: 'master' }], cb)
  }

  checkInkstoneUpdates (query = '', cb) {
    const authToken = sdkClient.config.getAuthToken()
    return inkstone.updates.check(authToken, query, cb)
  }

  doLogOut (cb) {
    sdkClient.config.setAuthToken('')
    return cb()
  }

  listAssets (folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'fetchAssets', [{ from: 'master' }], cb)
  }

  linkAsset (assetAbspath, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'linkAsset', [assetAbspath, { from: 'master' }], cb)
  }

  bulkLinkAssets (assetsAbspaths, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'bulkLinkAssets', [assetsAbspaths, { from: 'master' }], cb)
  }

  unlinkAsset (assetRelpath, folder, cb) {
    return this.awaitMasterAndCallMethod(folder, 'unlinkAsset', [assetRelpath, { from: 'master' }], cb)
  }

  gitUndo (folder, undoOptions, cb) {
    return this.awaitMasterAndCallMethod(folder, 'gitUndo', [undoOptions, { from: 'master' }], cb)
  }

  gitRedo (folder, redoOptions, cb) {
    return this.awaitMasterAndCallMethod(folder, 'gitRedo', [redoOptions, { from: 'master' }], cb)
  }

  readAllStateValues (folder, relpath, cb) {
    return this.awaitMasterAndCallMethod(folder, 'readAllStateValues', [relpath, { from: 'master' }], cb)
  }

  readAllEventHandlers (folder, relpath, cb) {
    return this.awaitMasterAndCallMethod(folder, 'readAllEventHandlers', [relpath, { from: 'master' }], cb)
  }

  handleClientAction (type, alias, folder, method, params, cb) {
    // Params always arrive with the folder as the first argument, so we strip that off
    params = params.slice(1)

    // Start with glass, since we depend on its handling of insantiateComponent to function correctly
    const asyncMethod = experimentIsEnabled(Experiment.AsyncClientActions) ? 'each' : 'eachSeries'
    return async[asyncMethod]([Q_GLASS, Q_TIMELINE, Q_CREATOR, Q_MASTER], (clientSpec, nextStep) => {
      if (clientSpec.alias === alias) {
        // Don't send methods that originated with ourself
        return nextStep()
      }

      logActionInitiation(method, clientSpec)

      // Master is handled differently because it's not actually a separate process
      if (clientSpec === Q_MASTER) {
        return this.awaitMasterAndCallMethod(folder, method, params.concat({ from: alias }), nextStep)
      }

      return this.sendQueriedClientMethod(lodash.assign({folder}, clientSpec), method, params.concat({ from: alias }), (err, maybeOutput) => {
        if (err) return nextStep(err)

        // HACK: Stupidly we have to rely on glass to tell us where to position the element based on the
        // offset of the artboard. So in this one case we have the glass transmit a return value that
        // we read and then use as the payload to the next actions in this pipeline
        if (method === 'instantiateComponent' && clientSpec.alias === 'glass') {
          if (maybeOutput && maybeOutput.center) {
            // Called 'posdata' in the ActiveComponent method as the second arg.
            // The third arg is the more open-ended 'metadata' (API change from May 10)
            params[2] = maybeOutput.center
          }
        }

        return nextStep()
      })
    }, (err) => {
      return logAndHandleActionResult(err, cb, method, type, alias)
    })
  }
}

function logActionInitiation (method, clientSpec) {
  if (!IGNORED_METHOD_MESSAGES[method]) {
    logger.info(`[plumbing] -> client action ${method} being sent to ${clientSpec.alias}`)
  }
}

function logAndHandleActionResult (err, cb, method, type, alias) {
  if (!IGNORED_METHOD_MESSAGES[method]) {
    const status = (err) ? 'errored' : 'completed'
    logger.info(`[plumbing] <- client action ${method} from ${type}@${alias} ${status}`, err)
  }

  if (err) {
    if (cb) return cb(err)
    return void (0)
  }

  if (cb) return cb()
  return void (0)
}

Plumbing.prototype.awaitMasterAndCallMethod = function (folder, method, params, cb) {
  const master = this.findMasterByFolder(folder)
  if (!master) return setTimeout(() => this.awaitMasterAndCallMethod(folder, method, params, cb), AWAIT_INTERVAL)
  return master.handleMethodMessage(method, params, cb)
}

Plumbing.prototype.findMasterByFolder = function (folder) {
  return this.masters[folder]
}

Plumbing.prototype.upsertMaster = function ({ folder, fileOptions, envoyOptions }) {
  const remote = (payload, cb) => {
    return this.handleRemoteMessage(
      'controllee',
      'master',
      folder,
      payload,
      null, // websocket
      null, // server
      cb
    )
  }

  // When the user launches a project, we create a Master instance, and we keep it
  // running even if they navigate back to the dashboard to avoid a double expense
  // of initializing file watchers, Git, etc. This is just a simple multiton dict.
  if (!this.masters[folder]) {
    const master = new Master(
      folder,
      fileOptions,
      envoyOptions
    )

    master.on('assets-changed', (master, assets) => {
      remote({
        type: 'broadcast',
        name: 'assets-changed',
        folder: master.folder,
        assets
      }, () => {})
    })

    master.on('component:reload', (master, file) => {
      remote({
        type: 'broadcast',
        name: 'component:reload',
        folder: master.folder,
        relpath: file.relpath
      }, () => {})
    })

    master.on('project-state-change', (payload) => {
      remote(lodash.assign({
        type: 'broadcast',
        name: 'project-state-change',
        folder: master.folder
      }, payload), () => {})
    })

    master.on('merge-designs', (relpath, designs) => {
      // Important that we enqueue this like all other actions, otherwise we'll have a race
      this.processMethodMessage(
        'controller',
        'plumbing', // We'll delegate on Master's behalf
        master.folder,
        {
          folder: master.folder,
          type: 'action',
          method: 'mergeDesigns',
          params: [master.folder, relpath, designs]
        },
        () => {
          logger.info(`[plumbing] finished merge designs`)
        }
      )
    })

    this.masters[folder] = master
  }

  this.masters[folder].active = true

  return this.masters[folder]
}

Plumbing.prototype.spawnSubgroup = function (haiku, cb) {
  if (haiku.folder) {
    this.upsertMaster({
      folder: path.normalize(haiku.folder),
      envoyOptions: lodash.assign({
        host: process.env.ENVOY_HOST,
        port: process.env.ENVOY_PORT,
        token: process.env.ENVOY_TOKEN
      }, haiku.envoy),
      fileOptions: {
        doWriteToDisk: true, // default
        skipDiffLogging: false // default
      }
    })
  }

  if (haiku.mode === 'creator') {
    // If we were spawned as a subprocess inside of electron main, tell our parent to launch creator.
    if (typeof process.send === 'function') {
      process.send({
        message: 'launchCreator',
        haiku: haiku
      })
    } else if (process.versions && !!process.versions.electron) {
      // We are in electron main (e.g. in a test context).
      global.process.env.HAIKU_ENV = JSON.stringify(haiku)
      require('haiku-creator/lib/electron')
    }
  }

  cb()
}

let portrange = 45032

// On the given host, return the port number of an open port. Note that the host must be
// specified otherwise you end up getting false positives! E.g. ipv4 0.0.0.0 vs ipv6 ::.
function getPort (host, cb) {
  let port = portrange
  portrange += 1
  let server = net.createServer()
  server.listen(port, host)
  server.once('listening', () => {
    server.once('close', () => {
      return cb(null, port)
    })
    server.close()
  })
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      return getPort(host, cb)
    }
    // If not an address-in-use error, something bad has happened and we likely shouldn't continue
    throw err
  })
  return server
}

Plumbing.prototype.launchControlServer = function launchControlServer (socketInfo, cb) {
  const host = (socketInfo && socketInfo.host) || '0.0.0.0'

  if (socketInfo && socketInfo.port) {
    logger.info(`[plumbing] plumbing websocket server listening on specified port ${socketInfo.port}...`)

    const websocketServer = this.createControlSocket({
      host,
      port: socketInfo.port
    })

    return cb(null, websocketServer, host, socketInfo.port)
  }

  return getPort(host, (err, port) => {
    if (err) return cb(err)

    const websocketServer = this.createControlSocket({
      host,
      port
    })

    return cb(null, websocketServer, host, port)
  })
}

Plumbing.prototype.extendEnvironment = function extendEnvironment (haiku) {
  const HAIKU_ENV = JSON.parse(process.env.HAIKU_ENV || '{}')
  merge(HAIKU_ENV, haiku)
  logger.info('[plumbing] environment forwarding:', JSON.stringify(HAIKU_ENV, 2, null))
  process.env.HAIKU_ENV = JSON.stringify(HAIKU_ENV) // Forward env to subprocesses
}

function getWsParams (websocket, request) {
  const url = request.url || ''
  const query = url.split('?')[1] || ''
  const params = qs.parse(query)
  params.url = url
  return params
}

Plumbing.prototype.createControlSocket = function createControlSocket (socketInfo) {
  return new WebSocket.Server({
    port: socketInfo.port,
    host: socketInfo.host
  })
}

function sendMessageToClient (client, message) {
  const data = JSON.stringify(message)
  if (client.readyState === WebSocket.OPEN) {
    return client.send(data, (err) => {
      if (err) {
        // This should never happen.
        throw new Error(`Error during send: ${err}`)
      }
    })
  } else {
    throw new Error(`[plumbing] attempted to send message to non-OPEN ws: ${data}`)
  }
}

function createResponder (message, websocket) {
  return function messageResponder (error, result) {
    const reply = {
      jsonrpc: '2.0',
      id: message.id,
      result: result || void (0),
      error: (error) ? serializeError(error) : void (0)
    }
    sendMessageToClient(websocket, reply)
  }
}

function remapProjectObjectToExpectedFormat (projectObject, organizationName) {
  const projectPath = path.join(
    HOMEDIR_PATH,
    'projects',
    organizationName,
    projectObject.Name
  )
  return {
    projectPath,
    projectName: projectObject.Name,
    projectExistsLocally: fse.existsSync(projectPath),
    projectsHome: HOMEDIR_PATH,
    repositoryUrl: projectObject.RepositoryUrl
    // GitRemoteUrl
    // GitRemoteName
    // GitRemoteArn
  }
}
