import path from 'path'
import async from 'async'
import fse from 'haiku-fs-extra'
import find from 'lodash.find'
import merge from 'lodash.merge'
import filter from 'lodash.filter'
import net from 'net'
import cp from 'child_process'
import qs from 'qs'
import WebSocket from 'ws'
import { EventEmitter } from 'events'
import EnvoyServer from 'haiku-sdk-creator/lib/envoy/server'
import EnvoyLogger from 'haiku-sdk-creator/lib/envoy/logger'
import TimelineHandler from 'haiku-sdk-creator/lib/timeline'
import TourHandler from 'haiku-sdk-creator/lib/tour'
import { inkstone } from 'haiku-sdk-inkstone'
import { client as sdkClient } from 'haiku-sdk-client'
import StateObject from 'haiku-state-object'
import serializeError from 'haiku-serialization/src/utils/serializeError'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import mixpanel from 'haiku-serialization/src/utils/Mixpanel'
import * as ProjectFolder from './ProjectFolder'
import getNormalizedComponentModulePath from 'haiku-serialization/src/model/helpers/getNormalizedComponentModulePath'

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
  fetchProjectInfo: true
}

const ROOT_DIR = path.join(__dirname, '..')
const PROC_DIR = path.join(__dirname)

const PROCS = {
  master: { name: 'master', path: path.join(PROC_DIR, 'MasterProcess.js') },
  creator: { name: 'creator', path: require('electron'), args: [path.join(ROOT_DIR, 'node_modules', 'haiku-creator-electron', 'lib', 'electron.js')], opts: { electron: true, spawn: true } }
}

const Q_GLASS = { alias: 'glass' }
const Q_MASTER = { alias: 'master' }
const Q_TIMELINE = { alias: 'timeline' }
const Q_CREATOR = { alias: 'creator' }

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

var idIncrementor = 1
function _id () {
  return idIncrementor++
}

const PLUMBING_INSTANCES = []

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

function _safeErrorMessage (err) {
  if (!err) return 'unknown error'
  if (typeof err === 'string') return err
  if (err.stack) return err.stack
  if (err.message) return err.message
  return err + ''
}

export default class Plumbing extends StateObject {
  constructor () {
    super()

    // Keep track of all PLUMBING_INSTANCES so we can put our process.on listeners
    // above this constructor, which is necessary in test environments such
    // as tape where exit might never get called despite an exit.
    PLUMBING_INSTANCES.push(this)

    this.subprocs = []
    this.envoys = []
    this.servers = []
    this.clients = []
    this.requests = {}
    this.caches = {}
    this.projects = {}

    // Keep track of whether we got a teardown signal so we know whether we should keep trying to
    // reconnect any subprocs that seem to have disconnected. This seems useless (why not just kill
    // the process) but keep in mind we need to unit test this.
    this._isTornDown = false

    this._methodMessages = []
    this.executeMethodMessagesWorker()

    emitter.on('teardown-requested', () => {
      this.teardown()
    })

    emitter.on('proc-respawned', (folder, alias) => {
      if (this._isTornDown) {
        logger.info('[plumbing] we are torn down, so not restarting client')
        return void (0)
      }

      logger.info(`[plumbing] restarting client ${alias} in ${folder}`)

      // This just waits until we have a 'master' client available with the given name.
      // The reconnect logic is elsewhere
      return this.awaitFolderClientWithQuery(folder, 'proc-respawned+restartProject', { alias }, WAIT_DELAY, (err) => {
        if (err) {
          return this._handleUnrecoverableError(new Error(`Waited too long for client ${alias} in ${folder} because ${_safeErrorMessage(err)}`))
        }

        if (alias === 'master') {
          // This actually calls the method in question on the given client
          return this.restartProject(null/* projectName is ignored */, folder, (err) => {
            if (err) {
              return this._handleUnrecoverableError(new Error(`Unable to finish restart on client ${alias} in ${folder} because ${_safeErrorMessage(err)}`))
            }
            logger.info(`[plumbing] restarted client ${alias} in ${folder}`)
          })
        }
      })
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

    logger.info('[plumbing] launching envoy server')

    var envoyServer = new EnvoyServer({
      WebSocket: WebSocket,
      logger: new EnvoyLogger('warn', logger)
    })

    this.envoys.push(envoyServer)

    return envoyServer.ready().then(() => {
      if (!haiku.envoy) haiku.envoy = {} // Gets stored in env vars before subprocs created
      haiku.envoy.port = envoyServer.port
      haiku.envoy.host = envoyServer.host

      var envoyTimelineHandler = new TimelineHandler(envoyServer)
      var envoyTourHandler = new TourHandler(envoyServer)

      envoyServer.bindHandler('timeline', TimelineHandler, envoyTimelineHandler)
      envoyServer.bindHandler('tour', TourHandler, envoyTourHandler)

      logger.info('[plumbing] launching plumbing control server')

      return this.launchControlServer(haiku.socket, (err, server, host, port) => {
        if (err) return cb(err)

        // Forward these env vars to creator
        process.env.HAIKU_PLUMBING_PORT = port
        process.env.HAIKU_PLUMBING_HOST = host

        if (!haiku.socket) haiku.socket = {}
        haiku.socket.port = port
        haiku.socket.host = host
        haiku.plumbing = { url: `http://${host}:${port}` }

        this.servers.push(server)

        server.on('connected', (websocket, type, alias, folder, params) => {
          logger.info(`[plumbing] websocket client connection opened: (${type} ${alias}) ${JSON.stringify(params)}`)

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
            logger.info(`[plumbing] websocket client connection closed (${type} ${alias})`)
            this.clients.splice(index, 1)
          })
        })

        server.on('message', (type, alias, folder, message, websocket, server, responder) => {
          // IMPORTANT! Creator uses this
          if (!folder && message.folder) {
            folder = message.folder
          }

          if (message.type === 'broadcast') {
            // Give clients the chance to emit events to all others
            this.sendBroadcastMessage(message, folder, alias, websocket)
          } else if (message.id && this.requests[message.id]) {
            // If we have an entry in this.requests, that means this is a reply
            const { callback } = this.requests[message.id]
            delete this.requests[message.id]
            return callback(message.error, message.result, message)
          } else if (message.method) { // This condition MUST happen before the one above since .method is present on that one too
            // Ensure that actions/methods occur in order by using a queue
            this.processMethodMessage(type, alias, folder, message, responder)
          }
        })

        this.spawnSubgroup(this.subprocs, haiku, (err, spawned) => {
          if (err) return cb(err)
          this.subprocs.push.apply(this.subprocs, spawned)
          return cb(null, host, port, server, spawned, haiku.envoy)
        })
      })
    })
  }

  methodMessageBeforeLog (message, alias) {
    if (!IGNORED_METHOD_MESSAGES[message.method]) {
      logger.info(`[plumbing] ↓-------- BEGAN ${message.method} from ${alias} --------↓`)
      logger.info(`[plumbing] ${message.method} -> ${JSON.stringify(message.params)}`)
    }
  }

  methodMessageAfterLog (message, err, result, alias) {
    if (!IGNORED_METHOD_MESSAGES[message.method]) {
      logger.info(`[plumbing] ${message.method} <-`, (err && err.message) || '', (err && err.stack) || '', result)
      logger.info(`[plumbing] ↑-------- ENDED ${message.method} from ${alias} --------↑`)
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
      if (message.type === 'action') return this.handleClientAction(type, alias, folder, message.method, message.params, cb)
      else return this.plumbingMethod(message.method, message.params, cb)
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

    // // uncomment me for insight into why a request might not be making it
    // console.log('==== awaiting', method, query)

    // HACK: At the time of this writing, there is only "one" creator client, not one per folder.
    // So the method just get ssent to the one client (if available)
    if (query.alias === 'creator') {
      const creatorClient = find(this.clients, { params: query })
      if (creatorClient) {
        return cb(null, creatorClient)
      }
    } else {
      const clientsOfFolder = filter(this.clients, { params: { folder } })
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
      return this.sendClientMethod(client, method, params, cb)
    })
  }

  sendClientMethod (websocket, method, params = [], callback) {
    var message = { method, params }
    return this.sendClientRequest(websocket, message, callback)
  }

  sendClientRequest (websocket, message, callback) {
    if (message.id === undefined) message.id = `${Math.random()}`
    this.requests[message.id] = { websocket, message, callback }
    if (websocket.readyState === WebSocket.OPEN) {
      const data = JSON.stringify(message)
      return websocket.send(data)
    } else {
      logger.info(`[plumbing] websocket readyState was not open so we did not send message ${message.method || message.id}`)
      callback() // Should this return an error or remain silent?
    }
  }

  teardown () {
    logger.info('[plumbing] teardown method called')
    this.subprocs.forEach((subproc) => {
      if (subproc.kill) {
        logger.info('[plumbing] sending interrupt signal')
        if (subproc.stdin) subproc.stdin.pause()
        subproc.kill('SIGKILL')
      } else if (subproc.exit) {
        logger.info('[plumbing] calling exit')
        subproc.exit()
      }
    })
    this.envoys.forEach((envoy) => {
      logger.info('[plumbing] closing envoy')
      envoy.close()
    })
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
  }

  toggleDevTools (folder, cb) {
    this.sendBroadcastMessage({ type: 'broadcast', name: 'dev-tools:toggle' })
    cb()
  }

  /**
   * Outward-facing
   */

  masterHeartbeat (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'masterHeartbeat', [], (err, masterState) => {
      if (err) return cb(err)
      return cb(null, masterState)
    })
  }

  doesProjectHaveUnsavedChanges (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'doesProjectHaveUnsavedChanges', [], cb)
  }

  /**
   * @method initializeProject
   * @description Flexible method for setting up a project based on an unknown file system state and possibly missing inputs.
   * We make a decision here as to where + whether to generate a new folder.
   * With a folder in hand, we boot up the MasterProcess for the folder in question.
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

    let projectFolder // To be populated momentarily...

    return async.series([
      (cb) => {
        return this.getCurrentOrganizationName((err, organizationName) => {
          if (err) return cb(err)
          projectOptions.organizationName = organizationName
          return cb()
        })
      },
      (cb) => {
        return ProjectFolder.ensureProject(projectOptions, (err, _projectFolder) => {
          if (err) return cb(err)
          projectFolder = _projectFolder
          return cb()
        })
      },
      (cb) => {
        // Just a second check to make sure we created the folder - probably not necessary
        return fse.exists(projectFolder, (doesFolderExist) => {
          if (!doesFolderExist) return cb(new Error('Project folder does not exist'))
          return cb()
        })
      },
      (cb) => {
        return this.spawnSubgroup(this.subprocs, { folder: projectFolder }, (err, spawned) => {
          if (err) return cb(err)
          this.subprocs.push.apply(this.subprocs, spawned)
          return cb()
        })
      },
      (cb) => {
        // QUESTION: Does this *need* to happen down here after the org fetch?
        const gitInitializeUsername = maybeUsername || this.get('username')
        const gitInitializePassword = maybePassword || this.get('password')

        // A simpler project options to avoid passing options only used for the first pass, e.g. skipContentCreation
        const projectOptionsAgain = {
          organizationName: projectOptions.organizationName,
          username: projectOptions.username,
          password: projectOptions.password,
          authorName
        }

        return this.initializeFolder(maybeProjectName, projectFolder, gitInitializeUsername, gitInitializePassword, projectOptionsAgain, (err) => {
          if (err) return cb(err)
          return cb(null, projectFolder)
        })
      }
    ], (err) => {
      if (err) return finish(err)

      if (maybeProjectName) {
        this.projects[maybeProjectName] = {
          folder: projectFolder,
          username: maybeUsername,
          password: maybePassword,
          organization: projectOptions.organizationName
        }
      }

      return finish(null, projectFolder)
    })
  }

  /**
   * Returns the absolute path of the folder of a project by name, if we are tracking one.
   */
  getFolderFor (projectName) {
    if (!this.projects[projectName]) return null
    return this.projects[projectName].folder
  }

  /**
   * @method initializeFolder
   * @description Assuming we already have a folder created, an organization name, etc., now bootstrap the folder itself.
   */
  initializeFolder (maybeProjectName, folder, maybeUsername, maybePassword, projectOptions, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'initializeFolder', [maybeProjectName, maybeUsername, maybePassword, projectOptions], (err) => {
      if (err) return cb(err)
      return cb()
    })
  }

  startProject (maybeProjectName, folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'startProject', [], cb)
  }

  restartProject (maybeProjectName, folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'restartProject', [], cb)
  }

  isUserAuthenticated (cb) {
    var answer = sdkClient.config.isAuthenticated()
    if (!answer) {
      return cb(null, { isAuthed: false })
    }
    return this.getCurrentOrganizationName((err, organizationName) => {
      if (err) return cb(err)
      const username = sdkClient.config.getUserId()
      mixpanel.mergeToPayload({ distinct_id: username })
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
      if (httpResponse.statusCode > 299) return cb(new Error(`Error status code: ${httpResponse.statusCode}`))
      if (!authResponse) return cb(new Error('Auth response was empty'))
      this.set('username', username)
      this.set('password', password)
      this.set('inkstoneAuthToken', authResponse.Token)
      sdkClient.config.setAuthToken(authResponse.Token)
      sdkClient.config.setUserId(username)
      mixpanel.mergeToPayload({ distinct_id: username })
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
    var authToken = sdkClient.config.getAuthToken()
    return inkstone.organization.list(authToken, (orgErr, orgsArray, orgHttpResp) => {
      if (orgErr) return cb(new Error('Organization error'))
      if (orgHttpResp.statusCode === 401) return cb(new Error('Unauthorized organization'))
      if (orgHttpResp.statusCode > 299) return cb(new Error(`Error status code: ${orgHttpResp.statusCode}`))
      if (!orgsArray || orgsArray.length < 1) return cb(new Error('No organization found'))
      // Cache this since it's used to write/manage some project files
      var organizationName = orgsArray[0].Name
      logger.info('[plumbing] organization name:', organizationName)
      this.set('organizationName', organizationName)
      return cb(null, this.get('organizationName'))
    })
  }

  listProjects (cb) {
    logger.info('[plumbing] listing projects')
    var authToken = sdkClient.config.getAuthToken()
    return inkstone.project.list(authToken, (projectListErr, projectsList) => {
      if (projectListErr) return cb(projectListErr)
      var finalList = projectsList.map(remapProjectObjectToExpectedFormat)
      logger.info('[plumbing] fetched project list', JSON.stringify(finalList))
      return cb(null, finalList)
    })
  }

  createProject (name, cb) {
    logger.info('[plumbing] creating project', name)
    var authToken = sdkClient.config.getAuthToken()
    return inkstone.project.create(authToken, { Name: name }, (projectCreateErr, project) => {
      if (projectCreateErr) return cb(projectCreateErr)
      return cb(null, remapProjectObjectToExpectedFormat(project))
    })
  }

  deleteProject (name, cb) {
    logger.info('[plumbing] deleting project', name)
    var authToken = sdkClient.config.getAuthToken()
    return inkstone.project.deleteByName(authToken, name, cb)
  }

  discardProjectChanges (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'discardProjectChanges', [], cb)
  }

  saveProject (folder, projectName, maybeUsername, maybePassword, saveOptions, cb) {
    if (!saveOptions) saveOptions = {}
    if (!saveOptions.authorName) saveOptions.authorName = this.get('username')
    if (!saveOptions.organizationName) saveOptions.organizationName = this.get('organizationName')
    logger.info('[plumbing] saving with options', saveOptions)
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'saveProject', [projectName, maybeUsername, maybePassword, saveOptions], cb)
  }

  previewProject (folder, projectName, previewOptions, cb) {
    if (!previewOptions) previewOptions = {}
    if (!previewOptions.authorName) previewOptions.authorName = this.get('username')
    if (!previewOptions.organizationName) previewOptions.organizationName = this.get('organizationName')
    logger.info('[plumbing] previewing with options', previewOptions)
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'previewProject', [projectName, previewOptions], cb)
  }

  fetchProjectInfo (folder, projectName, maybeUsername, maybePassword, fetchOptions, cb) {
    if (!fetchOptions) fetchOptions = {}
    if (!fetchOptions.authorName) fetchOptions.authorName = this.get('username')
    if (!fetchOptions.organizationName) fetchOptions.organizationName = this.get('organizationName')
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'fetchProjectInfo', [projectName, maybeUsername, maybePassword, fetchOptions], cb)
  }

  listAssets (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'fetchAssets', [], cb)
  }

  linkAsset (assetAbspath, folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'linkAsset', [assetAbspath], cb)
  }

  unlinkAsset (assetRelpath, folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'unlinkAsset', [assetRelpath], cb)
  }

  gitUndo (folder, undoOptions, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'gitUndo', [folder, undoOptions], (err) => {
      if (err) return cb(err)
      return cb()
    })
  }

  gitRedo (folder, redoOptions, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'gitRedo', [folder, redoOptions], (err) => {
      if (err) return cb(err)
      return cb()
    })
  }

  readMetadata (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'readMetadata', [folder], cb)
  }

  readAllStateValues (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'readAllStateValues', [folder], cb)
  }

  readAllEventHandlers (folder, cb) {
    return this.sendFolderSpecificClientMethodQuery(folder, Q_MASTER, 'readAllEventHandlers', [folder], cb)
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

    // HACK: A few methods require this special handling; #FIXME
    if (method === 'instantiateComponent') {
      var modulepath = getNormalizedComponentModulePath(params[0], /* ?? */ '')
      if (!modulepath) {
        params[0] = path.normalize(path.relative(folder, params[0]))
      }
    }

    // Start with the glass, since that's most visible, then move through the rest, and end
    // with master at the end, which results in a file system update reflecting the change
    async.eachSeries([Q_GLASS, Q_TIMELINE, Q_CREATOR, Q_MASTER], (clientSpec, nextStep) => {
      if (clientSpec.alias === alias) {
        if (method !== 'mergeDesigns') {
          // Don't send to oneself, unless it is mergeDesigns, which is a special snowflake
          // that originates in 'master' but also needs to be sent back to it (HACK)
          return nextStep()
        }
      }

      // There are a bunch of methods (actually...most of them) that creator doesn't need to receive
      if ((method === 'moveSegmentEndpoints' || method === 'mergeDesigns' || method === 'moveKeyframes') && clientSpec.alias === 'creator') {
        return nextStep()
      }

      if (!IGNORED_METHOD_MESSAGES[method]) {
        logger.info(`[plumbing] -> client action ${method} being sent to ${clientSpec.alias}`)
      }

      // HACK: Glass and timeline always expect some metadata as the last argument
      if (clientSpec.alias === 'glass' || clientSpec.alias === 'timeline') {
        return this.sendFolderSpecificClientMethodQuery(folder, clientSpec, method, params.concat({ from: alias }), (err, maybeOutput) => {
          if (err) return nextStep(err)

          // HACK: Stupidly we have to rely on glass to tell us where to position the element based on the
          // offset of the artboard. So in this one case we have the glass transmit a return value that
          // we read and then use as the payload to the next actions in this pipeline
          if (method === 'instantiateComponent' && clientSpec.alias === 'glass') {
            if (maybeOutput && maybeOutput.center) {
              // Called 'posdata' in the ActiveComponent method as the second arg.
              // The third arg is the more open-ended 'metadata' (API change from May 10)
              params[1] = maybeOutput.center
            }
          }

          return nextStep()
        })
      } else {
        return this.sendFolderSpecificClientMethodQuery(folder, clientSpec, method, params, (err) => {
          if (err) return nextStep(err)
          return nextStep()
        })
      }
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

Plumbing.prototype.spawnSubgroup = function (existingSpawnedSubprocs, haiku, cb) {
  logger.info('[plumbing] spawning subprocesses for this group', haiku)
  const subprocs = []
  // MasterProcess can only operate if a folder is defined
  if (haiku.folder) {
    subprocs.push(PROCS.master)
  }
  if (haiku.mode === 'creator') {
    subprocs.push(PROCS.creator)
  }
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
      } else if (proc._attributes.name.match(/master/)) {
        // Avoid ending up in an endless loop of fail if we find ourselves torn down
        if (!this._isTornDown) {
          // Master should probably keep running, since it does peristence stuff, so reconnect if we detect it crashed.
          logger.info(`[plumbing] trying to respawn master for ${folder}`)

          this.spawnSubprocess(existingSpawnedSubprocs, folder, { name, path, args, opts }, (err, newProc) => {
            if (err) {
              return this._handleUnrecoverableError(new Error(`Unable to respawn master for ${folder} because ${_safeErrorMessage(err)}`))
            }

            newProc._attributes.closed = undefined
            newProc._attributes.disconnected = undefined
            newProc._attributes.exited = undefined

            existingSpawnedSubprocs.push(newProc)

            logger.info(`[plumbing] respawned proc master for folder ${folder}; restarting project`)

            // Emit this event to notify ourselves that we want to wait for the websocket
            // in the given process to reconnect itself and then do any of the usual setup
            emitter.emit('proc-respawned', folder, name)
          })
        }
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

    const websocketServer = this.createControlSocket({ host, port: socketInfo.port })

    return cb(null, websocketServer, host, socketInfo.port)
  }

  logger.info('[plumbing] finding open port...')

  return getPort(host, (err, port) => {
    if (err) return cb(err)

    logger.info(`[plumbing] plumbing websocket server listening on discovered port ${port}...`)

    const websocketServer = this.createControlSocket({ host, port: port })

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
  const websocketServer = new WebSocket.Server({ port: socketInfo.port, host: socketInfo.host })

  // Reserve this port so that OpenPort sees it as being unavailable in case other instances
  // of plumbing happen to open. This isn't intended to do anything except that, hence the no-op listener.
  // const httpServer = http.createServer()
  // httpServer.listen(socketInfo.port)

  websocketServer.on('connection', (websocket, request) => {
    const params = getWsParams(websocket, request)

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
  if (client.readyState === WebSocket.OPEN) {
    const data = JSON.stringify(message)
    return client.send(data)
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

function remapProjectObjectToExpectedFormat (projectObject) {
  return {
    projectName: projectObject.Name
    // GitRemoteUrl
    // GitRemoteName
    // GitRemoteArn
  }
}

function isElectronMain () {
  return typeof process !== 'undefined' && process.versions && !!process.versions.electron
}
