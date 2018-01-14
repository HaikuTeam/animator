import path from 'path'
import async from 'async'
import lodash from 'lodash'
import find from 'lodash.find'
import merge from 'lodash.merge'
import filter from 'lodash.filter'
import net from 'net'
import cp from 'child_process'
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
import Master from './Master'

global.eval = function () { // eslint-disable-line
  throw new Error('Sorry, eval is forbidden')
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
  // These are noisy, maybe not worth including?
  // applyPropertyGroupDelta: true,
  // applyPropertyGroupValue: true,
  // moveSegmentEndpoints: true,
  // moveKeyframes: true
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
  previewProject: true,
  fetchProjectInfo: true,
  doLogOut: true,
  deleteProject: true
}

const PROCS = {
  creator: {
    name: 'creator',
    path: require('electron'),
    args: [require.resolve(path.join('haiku-creator', 'lib', 'electron.js'))],
    opts: { electron: true, spawn: true }
  }
}

const Q_GLASS = { alias: 'glass' }
const Q_TIMELINE = { alias: 'timeline' }
const Q_CREATOR = { alias: 'creator' }
const MASTER_SPEC = 'master' // not a separate process

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

let idIncrementor = 1
function _id () {
  return idIncrementor++
}

const PLUMBING_INSTANCES = []
const MASTER_INSTANCES = {}

// In test environment these listeners may get wrapped so we begin listening
// to them immediately in the hope that we can start listening before the
// test wrapper steps in and interferes
process.on('exit', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) exiting`)
  PLUMBING_INSTANCES.forEach((plumbing) => plumbing.teardown())
})
process.on('SIGINT', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) SIGINT`)
  PLUMBING_INSTANCES.forEach((plumbing) => plumbing.teardown())
  process.exit()
})
process.on('SIGTERM', () => {
  logger.info(`[plumbing] plumbing process (${PINFO}) SIGTERM`)
  PLUMBING_INSTANCES.forEach((plumbing) => plumbing.teardown())
  process.exit()
})

export default class Plumbing extends StateObject {
  constructor () {
    super()

    // Keep track of all PLUMBING_INSTANCES so we can put our process.on listeners
    // above this constructor, which is necessary in test environments such
    // as tape where exit might never get called despite an exit.
    PLUMBING_INSTANCES.push(this)

    this.masters = []
    this.subprocs = []
    this.servers = []
    this.clients = []
    this.requests = {}
    this.caches = {}
    this.projects = {}

    // Avoid creating new handles if we have been explicitly torn down by a signal
    this._isTornDown = false

    this._methodMessages = []

    this.executeMethodMessagesWorker()

    emitter.on('teardown-requested', () => {
      this.teardown()
    })
  }

  _handleUnrecoverableError (err) {
    mixpanel.haikuTrackOnce('app:crash', {
      error: err.message
    })

    // Crash in the timeout to give a chance for mixpanel to transmit
    setTimeout(() => {
      throw err
    }, 100)
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

        server.on('connected', (websocket, type, alias, folder, params) => {
          logger.info(`[plumbing] websocket opened (${type} ${alias})`)

          // Don't allow duplicate clients
          for (let i = this.clients.length - 1; i >= 0; i--) {
            let client = this.clients[i]
            if (client.params) {
              if (client.params.alias === alias && client.params.folder === folder) {
                if (client.readyState === WebSocket.OPEN) {
                  client.close()
                }
                this.clients.splice(i, 1)
              }
            }
          }

          websocket.params.id = _id()
          const index = this.clients.push(websocket) - 1

          websocket._index = index

          websocket.on('close', () => {
            logger.info(`[plumbing] websocket closed (${type} ${alias})`)

            // Clean up dead clients
            for (let j = this.clients.length - 1; j >= 0; j--) {
              let client = this.clients[j]
              if (client === websocket) {
                this.clients.splice(j, 1)
              }
            }
          })
        })

        server.on('message', this.handleRemoteMessage.bind(this))

        this.spawnSubgroup(this.subprocs, haiku, (err, spawned) => {
          if (err) return cb(err)
          this.subprocs.push.apply(this.subprocs, spawned)
          return cb(null, host, port, server, spawned, haiku.envoy)
        })
      })
    })
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
    } else if (message.id && this.requests[message.id]) {
      // If we have an entry in this.requests, that means this is a reply
      const { callback } = this.requests[message.id]
      delete this.requests[message.id]
      return callback(message.error, message.result, message)
    } else if (message.method) { // This condition MUST happen before the one above since .method is present on that one too
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

    let nextMethodMessage = this._methodMessages.shift()
    if (!nextMethodMessage) return setTimeout(this.executeMethodMessagesWorker.bind(this), 64)

    let { type, alias, folder, message, cb } = nextMethodMessage

    this.methodMessageBeforeLog(message, alias)

    // Actions are a special case of methods that end up routed through all of the clients,
    // glass -> timeline -> master before returning. They go through one handler as opposed
    // to the normal 'methods' which plumbing handles on a more a la carte basis
    if (message.type === 'action') {
      return this.handleClientAction(type, alias, folder, message.method, message.params, (err, result) => {
        this.methodMessageAfterLog(message, err, result, alias)
        cb(err, result)
        this.executeMethodMessagesWorker() // Continue with the next queue entry (if any)
      })
    }

    return this.plumbingMethod(message.method, message.params || [], (err, result) => {
      this.methodMessageAfterLog(message, err, result, alias)
      cb(err, result)
      this.executeMethodMessagesWorker() // Continue with the next queue entry (if any)
    })
  }

  processMethodMessage (type, alias, folder, message, cb) {
    // Certain messages aren't of a kind that we can reliably enqueue - either they happen too fast or they are 'fire and forget'
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

  awaitFolderClientWithQuery (folder, method, query, timeout, cb) {
    if (!folder) return cb(new Error('Folder argument was missing'))
    if (!query) return cb(new Error('Query argument was missing'))
    if (timeout <= 0) {
      return cb(new Error(`Timed out waiting for client ${JSON.stringify(query)} of ${folder} to connect`))
    }

    // HACK: At the time of this writing, there is only "one" creator client, not one per folder.
    // So the method just get ssent to the one client (if available)
    if (query.alias === 'creator') {
      const creatorClient = find(this.clients, { params: query })
      if (creatorClient) {
        return cb(null, creatorClient)
      }
    } else {
      const clientsOfFolder = filter(this.clients, { params: { folder } })

      // // uncomment me for insight into why a request might not be making it
      // if (method !== 'masterHeartbeat') {
      //   console.log('awaiting', method, query, folder, JSON.stringify(this.clients.map((c) => c.params.alias)))
      // }

      if (clientsOfFolder && clientsOfFolder.length > 0) {
        const clientMatching = find(clientsOfFolder, { params: query })
        if (clientMatching) {
          return cb(null, clientMatching)
        }
      }
    }
    return setTimeout(() => {
      return this.awaitFolderClientWithQuery(folder, method, query, timeout - AWAIT_INTERVAL, cb)
    }, AWAIT_INTERVAL)
  }

  sendFolderSpecificClientMethodQuery (folder, query = {}, method, params = [], cb) {
    return this.awaitFolderClientWithQuery(folder, method, query, WAIT_DELAY, (err, client) => {
      if (err) return cb(err)
      return this.sendClientMethod(client, method, params, (error, response) => {
        if (error) {
          this.sentryError(method, error, { tags: query })
          return cb(error)
        }
        return cb(null, response)
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
    // Delay to unblock thread for websocket ready state transitions
    setTimeout(() => {
      if (websocket.readyState === WebSocket.OPEN) {
        const data = JSON.stringify(message)
        const ret = websocket.send(data)
        return ret
      } else {
        logger.info(`[plumbing] websocket readyState was not open so we did not send message ${message.method || message.id}`)
        callback() // Should this return an error or remain silent?
      }
    })
  }

  teardown () {
    logger.info('[plumbing] teardown method called')

    return async.eachSeries(this.masters, (master, next) => {
      return master.teardown(next)
    }, () => {
      this.subprocs.forEach((subproc) => {
        if (subproc.kill) {
          if (subproc.stdin) subproc.stdin.pause()
          // Using sigterm as opposed to kill to give the processes a chance to cleanup
          // so we don't end up with corrupt git objects
          logger.info('[plumbing] sending terminate signal')
          subproc.kill('SIGTERM')
        } else if (subproc.exit) {
          logger.info('[plumbing] calling exit')
          subproc.exit()
        }
      })

      if (this.envoyServer) {
        logger.info('[plumbing] closing envoy server')
        this.envoyServer.close()
      }

      this.servers.forEach((server) => {
        logger.info('[plumbing] closing server')
        server.close()
      })

      this.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return void (0)
        logger.info('[plumbing] sending crash signal to client')
        sendMessageToClient(client, { signal: 'CRASH' })
      })

      this._isTornDown = true
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
  initializeProject (maybeProjectName, { projectsHome, projectPath, skipContentCreation, organizationName, authorName }, maybeUsername, maybePassword, finish) {
    const projectOptions = {
      projectsHome,
      projectPath,
      skipContentCreation,
      organizationName,
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
        return this.spawnSubgroup(this.subprocs, haikuInfo, (err, spawned) => {
          if (err) return cb(err)
          this.subprocs.push.apply(this.subprocs, spawned)
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
        username: gitInitializeUsername,
        password: gitInitializePassword,
        authorName
      }

      return this.initializeFolder(maybeProjectName, projectFolder, gitInitializeUsername, gitInitializePassword, projectOptionsAgain, (err) => {
        if (err) return finish(err)
        // HACK: used when restarting the process to allow us to reinitialize properly
        this.projects[projectFolder] = {
          name: maybeProjectName,
          folder: projectFolder,
          username: projectOptionsAgain.username,
          password: projectOptionsAgain.password,
          organization: projectOptionsAgain.organizationName,
          options: projectOptionsAgain
        }

        if (Raven) {
          Raven.setContext({
            user: { email: projectOptionsAgain.username }
          })
        }

        this.set('lastOpenedProjectName', maybeProjectName)
        this.set('lastOpenedProjectPath', projectFolder)

        if (maybeProjectName) {
          // HACK: alias to allow lookup by project name
          this.projects[maybeProjectName] = this.projects[projectFolder]
        }

        return finish(null, projectFolder)
      })
    })
  }

  /**
   * Returns the absolute path of the folder of a project by name, if we are tracking one.
   */
  getFolderFor (projectName) {
    let info = this.getProjectInfoFor(projectName)
    if (!info) return null
    return info.folder
  }

  getProjectInfoFor (projectNameOrFolder) {
    return this.projects[projectNameOrFolder]
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

  authenticateUser (username, password, cb) {
    this.set('organizationName', null) // Unset this cache to avoid writing others folders if somebody switches accounts in the middle of a session
    return inkstone.user.authenticate(username, password, (authErr, authResponse, httpResponse) => {
      if (authErr) return cb(authErr)
      if (httpResponse.statusCode === 401) return cb(new Error('Unauthorized'))

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
        const finalList = projectsList.map((val) => remapProjectObjectToExpectedFormat(
          val,
          this.get('organizationName')
        ))
        logger.info('[plumbing] fetched project list', JSON.stringify(finalList))
        return cb(null, finalList)
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
      this.createEmptyProjectFolderToHackilyAvoidInitialClone(remoteProjectObject)

      return cb(null, remoteProjectObject)
    })
  }

  deleteProject (name, cb) {
    logger.info('[plumbing] deleting project', name)
    const authToken = sdkClient.config.getAuthToken()
    return inkstone.project.deleteByName(authToken, name, (deleteErr) => {
      if (deleteErr) {
        this.sentryError('deleteProject', deleteErr)
        if (cb) return cb(deleteErr)
      }
      if (cb) return cb()
    })
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

  /** ------------------- */
  /** ------------------- */
  /** ------------------- */

  handleClientAction (type, alias, folder, method, params, cb) {
    // Params always arrive with the folder as the first argument, so we strip that off
    params = params.slice(1)

    // This special method gets called frequently (up to 60 times per second) so fast-path it and don't log it
    if (method === 'setTimelineTime') {
      if (alias === 'timeline') {
        return this.sendFolderSpecificClientMethodQuery(folder, Q_GLASS, method, params.concat({ from: alias }), () => {})
      } else if (alias === 'glass') {
        return this.sendFolderSpecificClientMethodQuery(folder, Q_TIMELINE, method, params.concat({ from: alias }), () => {})
      }
    }

    // Start with the glass, since that's most visible, then move through the rest, and end
    // with master at the end, which results in a file system update reflecting the change
    const asyncMethod = experimentIsEnabled(Experiment.AsyncClientActions) ? 'each' : 'eachSeries'
    return async[asyncMethod]([Q_GLASS, Q_TIMELINE, Q_CREATOR, MASTER_SPEC], (clientSpec, nextStep) => {
      if (clientSpec === MASTER_SPEC) {
        logger.info(`[plumbing] -> client action ${method} being sent to master`)
        return this.awaitMasterAndCallMethod(folder, method, params.concat({ from: alias }), cb)
      }

      if (clientSpec.alias === alias) {
        // Don't send methods that originated with ourself
        return nextStep()
      }

      if (!IGNORED_METHOD_MESSAGES[method]) {
        logger.info(`[plumbing] -> client action ${method} being sent to ${clientSpec.alias}`)
      }

      return this.sendFolderSpecificClientMethodQuery(folder, clientSpec, method, params.concat({ from: alias }), (err, maybeOutput) => {
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
      if (err) {
        if (!IGNORED_METHOD_MESSAGES[method]) {
          logger.info(`[plumbing] <- client action ${method} from ${type}@${alias} errored`, err)
        }
        if (cb) return cb(err)
        return void (0)
      }
      if (!IGNORED_METHOD_MESSAGES[method]) {
        logger.info(`[plumbing] <- client action ${method} from ${type}@${alias} complete`)
      }
      if (cb) return cb()
      return void (0)
    })
  }
}

Plumbing.prototype.awaitMasterAndCallMethod = function (folder, method, params, cb) {
  const master = this.findMasterByFolder(folder)
  if (!master) return setTimeout(() => this.awaitMasterAndCallMethod(folder, method, params, cb), AWAIT_INTERVAL)
  return master.handleMethodMessage(method, params, cb)
}

Plumbing.prototype.findMasterByFolder = function (folder) {
  return this.masters.filter((master) => {
    return master.folder === folder
  })[0]
}

Plumbing.prototype.addMaster = function (master) {
  let found = false
  this.masters.forEach((candidate) => {
    if (candidate === master) found = true
  })
  if (!found) {
    this.masters.push(master)
  }
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

  let master

  // When the user launches a project, we create a Master instance, and we keep it
  // running even if they navigate back to the dashboard to avoid a double expense
  // of initializing file watchers, Git, etc. This is just a simple multiton dict.
  if (!MASTER_INSTANCES[folder]) {
    master = new Master(
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
      this.handleClientAction(
        'controller',
        'plumbing', // We'll delegate on Master's behalf
        master.folder,
        'mergeDesigns',
        [master.folder, relpath, designs],
        () => {}
      )
    })
  } else {
    master = MASTER_INSTANCES[folder]
  }

  return master
}

Plumbing.prototype.spawnSubgroup = function (existingSpawnedSubprocs, haiku, cb) {
  if (haiku.folder) {
    const master = this.upsertMaster({
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

    this.addMaster(master)
  }

  // Back when Master lived in its own MasterProcess, we had a bunch of processes,
  // but now we only really have Creator (Electron). I opted *not* to remove this legacy
  // logic when removing MasterProcess just in case there were hidden dependencies here.
  // But it should eventually be refactored out. #TODO
  const subprocs = []
  if (haiku.mode === 'creator') subprocs.push(PROCS.creator)
  return this.spawnSubprocesses(existingSpawnedSubprocs, haiku, subprocs, cb)
}

Plumbing.prototype.spawnSubprocesses = function (existingSpawnedSubprocs, haiku, subprocs, cb) {
  this.extendEnvironment(haiku)
  return async.map(subprocs, (subproc, next) => {
    return this.spawnSubprocess(existingSpawnedSubprocs, haiku.folder, subproc, next)
  }, (err, spawned) => {
    if (err) return cb(err)
    return cb(null, spawned)
  })
}

Plumbing.prototype.spawnSubprocess = function spawnSubprocess (existingSpawnedSubprocs, folder, { name, path, args, opts }, cb) {
  const existing = find(existingSpawnedSubprocs, { _attributes: { name, folder } })
  if (existing) {
    // Reconnection (via websocket) is only available if the process itself is still alive
    if (existing.connected && !existing._attributes.disconnected && !existing._attributes.exited && !existing._attributes.closed) {
      if (existing.reestablishConnection) existing.reestablishConnection()
      else (existing.send('reestablishConnection!'))

      logger.info(`[plumbing] reusing existing ${name} process`)
      existing._attributes.reused = true

      return cb(null, existing)
    }
  }

  let proc

  if (opts && opts.electron && isElectronMain() && typeof path === 'object') {
    // If we are *in* Electron, this 'path', which would normally be an absolute path to the
    // Electron binary, is actually the require('electron') export object. Instead of launching
    // the subprocess 'with' Electron binary as the command, we can just 'require' it since
    // that is where we already are. This is condition is critical for our packaging hooks.
    // Be aware that a change here might break the ability to create a working distribution.
    logger.info(`[plumbing] requiring ${name} @ ${args[0]}`)
    proc = require(args[0]).default
  } else {
    // If we aren't in electron, start the process using the electron binary path
    if (opts && opts.spawn) {
      // Remote debugging hook only used in development; causes problems in distro
      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging' && process.env.NO_REMOTE_DEBUG !== '1') {
        args.push('--enable-logging', '--remote-debugging-port=9222')
      }
      proc = cp.spawn(path, args, { stdio: [null, null, null, 'ipc'] })
    } else {
      args = args || []
      // Remote debugging hook only used in development; causes problems in distro
      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging' && process.env.NO_REMOTE_DEBUG !== '1') {
        args.push('--debug=5859')
      }
      proc = cp.fork(path, args)
    }

    logger.info(`[plumbing] proc ${name} created @ ${path}`)
  }

  proc._attributes = { name, folder, id: _id() }

  proc.on('exit', () => {
    logger.info(`[plumbing] proc ${name} exiting`)

    proc._attributes.exited = true

    if (proc._attributes.name) {
      // If electron is finished, we should clean up stuff. This usually means the user has closed the view.
      if (proc._attributes.name.match(/electron/) || name.match(/creator/)) {
        emitter.emit('teardown-requested')
      }
    }

    // Remove the old, unused process from the list of existing ones
    for (let i = existingSpawnedSubprocs.length - 1; i >= 0; i--) {
      let existing = existingSpawnedSubprocs[i]
      if (existing === proc) {
        existingSpawnedSubprocs.splice(i, 1)
      }
    }
  })

  proc.on('close', () => {
    proc._attributes.closed = true
  })
  proc.on('disconnect', () => {
    proc._attributes.disconnected = true
  })
  proc.on('error', (error) => {
    logger.info(`[plumbing] proc ${name} got error`, error)
  })
  proc.on('message', (message) => {
    logger.info(`[plumbing] proc ${name} got message`, message)
  })
  proc.on('request', (message) => {
    logger.info(`[plumbing] proc ${name} got request`, message)
  })

  return cb(null, proc)
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
      port: socketInfo.port,
      token: socketInfo.token
    })
    return cb(null, websocketServer, host, socketInfo.port)
  }

  return getPort(host, (err, port) => {
    if (err) return cb(err)
    const websocketServer = this.createControlSocket({
      host,
      port,
      token: socketInfo.token
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
  const websocketServer = new WebSocket.Server({
    port: socketInfo.port,
    host: socketInfo.host
  })

  websocketServer.on('connection', (websocket, request) => {
    const params = getWsParams(websocket, request)

    if (socketInfo.token && params.token !== socketInfo.token) {
      logger.info(`[plumbing] websocket connected with bad token ${params.token}`)
      websocket.close(WS_POLICY_VIOLATION_CODE, 'forbidden')
      return
    }

    if (!params.type) params.type = 'default'
    if (!params.haiku) params.haiku = {}
    if (!websocket.params) websocket.params = params

    const type = websocket.params && websocket.params.type
    const alias = websocket.params && websocket.params.alias

    let folder = websocket.params && websocket.params.folder

    websocketServer.emit('connected', websocket, type, alias, folder, params)

    websocket.on('message', (data) => {
      const message = JSON.parse(data)

      // Allow explicit override; Creator uses this!
      // Also some tests use this.
      if (message.folder) folder = message.folder

      websocketServer.emit('message', type, alias, folder, message, websocket, websocketServer, createResponder(message, websocket))
    })
  })

  return websocketServer
}

function sendMessageToClient (client, message) {
  // Delay to unblock thread for websocket ready state transitions
  return setTimeout(() => {
    if (client.readyState === WebSocket.OPEN) {
      const data = JSON.stringify(message)
      const ret = client.send(data)
      return ret
    }
  })
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
  return {
    projectName: projectObject.Name,
    projectPath: path.join(
      HOMEDIR_PATH,
      'projects',
      organizationName,
      projectObject.Name
    ),
    projectsHome: HOMEDIR_PATH
    // GitRemoteUrl
    // GitRemoteName
    // GitRemoteArn
  }
}

function isElectronMain () {
  return typeof process !== 'undefined' && process.versions && !!process.versions.electron
}
