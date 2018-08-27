const fse = require('haiku-fs-extra')
const path = require('path')
const async = require('async')
const WebSocket = require('ws')
const lodash = require('lodash')
const jss = require('json-stable-stringify')
const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')
const EnvoyClient = require('haiku-sdk-creator/lib/envoy/EnvoyClient').default
const EnvoyLogger = require('haiku-sdk-creator/lib/envoy/EnvoyLogger').default
const { GLASS_CHANNEL } = require('haiku-sdk-creator/lib/glass')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')
const reifyRFO = require('@haiku/core/lib/reflection/reifyRFO').default
const {InteractionMode} = require('@haiku/core/lib/helpers/interactionModes')
const toTitleCase = require('./helpers/toTitleCase')
const Lock = require('./Lock')
const ActionStack = require('./ActionStack')
const {
  getSafeProjectName,
  getProjectNameSafeShort,
  getDefaultIllustratorAssetPath,
  getDefaultSketchAssetPath,
  getReactProjectName,
  getProjectNameLowerCase,
  readPackageJson,
  getAngularSelectorName
} = require('@haiku/sdk-client/lib/ProjectDefinitions')

const ALWAYS_IGNORED_METHODS = {
  // Handled upstream, by Creator, Glass, Timeline, etc.
  executeFunctionSpecification: true
}
const SILENT_METHODS = {
  hoverElement: true,
  unhoverElement: true
}
const RACEY_METHODS = {
  hoverElement: true,
  unhoverElement: true,
  selectElement: true,
  unselectElement: true
}

/**
 * @class Project
 * @description
 *.  Representation of an entire project folder, including:
 *.    - All File objects tracked therein
 *.    - All ActiveComponent objects
 *.    - And all descendant model objects of those
 *
 *.  This is also where Plumbing websockets and Envoy clients are attached.
 *.  This handles transmitting updates to all the other views when updates happen.
 *.  It also handles routing remote method calls to the appropriate ActiveComponent.
 *.  TODO: A nice next step would be to Envoy-ize all of this.
 */
class Project extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    // Super hack, but it turns out we need to have this in a LOT of places in order for routing to work
    // and not end up with infinite loops of events emitted, captured, and emitted again. Beware!
    this.metadata = {
      from: this.alias, // #FIXME, dumb name?
      alias: this.alias
    }

    this.ensurePlatformHaikuRegistry()

    // Batched collections of methods to send through the websocket
    this.actionStack = new ActionStack({
      uid: this.getPrimaryKey(),
      project: this
    })

    this.actionStack.on('next', (method, params, done) => {
      logger.info(`[project (${this.getAlias()})] sending action: ${method}`)

      this.websocket.action(method, params, (err, out) => {
        done(err, out)
      }, this.getFolder())
    })

    // Setup the Plumbing websocket and Envoy connections if necessary
    this._didStartWebsocketListeners = false
    this.connectClients()

    // In multi-component editing, this controls what the current active component is
    this._activeComponentSceneName = null

    ActiveComponent.on('update', (ac, what, entity) => {
      this.emit('update', what, entity, ac, this.getMetadata())
    })

    // List of components we are tracking as part of the component tabs
    /**
     * @type {Array.<{scenename: string, active: boolean}>}
     * @private
     */
    this._multiComponentTabs = []

    // Whether we should actually receive and act upon remote methods received
    this.isHandlingMethods = true

    this.interactionMode = InteractionMode.EDIT

    // An internal counter of how many updateHook requests we have dispatched.
    this.actionStackIndex = 0
  }

  teardown () {
    this.stopHandlingMethods()
    this.getEnvoyClient().closeConnection()
    if (this.websocket) {
      this.websocket.disconnect()
    }
    this.actionStack.stop()
  }

  stopHandlingMethods () {
    this.isHandlingMethods = false
  }

  startHandlingMethods () {
    this.isHandlingMethods = true
  }

  connectClients () {
    this.startHandlingMethods()

    if (this.websocket) {
      // Idempotent setup should handle an already-connected client gracefully
      this.websocket.connect()

      if (!this._didStartWebsocketListeners) {
        // Upon receipt of a method, route to the correct ActiveComponent
        this.websocket.on('method', this.receiveMethodCall.bind(this))
        this.websocket.on('close', () => logger.info(`[project (${this.getAlias()})] websocket closed`))
        this.websocket.on('error', () => logger.info(`[project (${this.getAlias()})] websocket error`))

        this._didStartWebsocketListeners = true
      }
    }

    if (this._envoyClient) {
      // no-op; the client should already be connected to the server
    } else {
      const websocketClient = (
        this.WebSocket ||
        ((typeof window !== 'undefined') && window.WebSocket) ||
        WebSocket
      )

      this._envoyClient = new EnvoyClient(Object.assign({
        WebSocket: websocketClient,
        logger: new EnvoyLogger('warn')
      }, this.getEnvoyOptions()))

      this._envoyClient.get('timeline').then((timelineChannel) => {
        this._envoyTimelineChannel = timelineChannel
        this.emit('envoy:timelineClientReady', this._envoyTimelineChannel)
      })

      this._envoyClient.get(GLASS_CHANNEL).then((glassChannel) => {
        this._envoyGlassChannel = glassChannel
        this.emit('envoy:glassClientReady', this._envoyGlassChannel)
      })

      this._envoyClient.get('tour').then((tourChannel) => {
        this._envoyTourChannel = tourChannel
        if (!this._envoyClient.isInMockMode()) {
          this._envoyTourChannel.requestWebviewCoordinates().then(() => {
            this.emit('envoy:tourClientReady', this._envoyTourChannel)
          })
        }
      })
    }
  }

  isIgnoringMethodRequestsForMethod (method) {
    if (ALWAYS_IGNORED_METHODS[method]) return true
    // HACK: This probably doesn't/shouldn't belong as a part of 'fileOptions'
    // It's a hacky way for MasterProcess to handle certain methods it cares about
    const fileOptions = this.getFileOptions()
    return fileOptions && fileOptions.methodsToIgnore && fileOptions.methodsToIgnore[method]
  }

  receiveMethodCall (method, params, message, cb) {
    if (!this.isHandlingMethods) {
      return cb()
    } else if (this.isIgnoringMethodRequestsForMethod(method)) {
      return null // Another handler will call the callback in this case
    } else {
      return this.handleMethodCall(method, params, message, cb)
    }
  }

  handleMethodCall (method, params, message, cb) {
    return Lock.request(Lock.LOCKS.ProjectMethodHandler, false, (release) => {
      // Try matching a method on a given active component
      const ac = (typeof params[0] === 'string')
        ? this.findActiveComponentBySourceIfPresent(params[0])
        : null

      if (ac && typeof ac[method] === 'function') {
        if (!SILENT_METHODS[method]) {
          logger.info(
            `[project (${this.getAlias()})] component handling method ${method}`
          )
        }

        return ac[method].apply(ac, params.slice(1).concat((err, out) => {
          release()

          if (err) {
            return cb(err)
          }

          return cb() // Skip objects that don't play well with Websockets
        }))
      }

      // If we have a method here at the top, call it
      if (typeof this[method] === 'function') {
        if (!SILENT_METHODS) {
          logger.info(`[project (${this.getAlias()})] project handling method ${method}`)
        }

        return this[method].apply(this, params.concat((err, result) => {
          release()

          if (err) {
            return cb(err)
          }

          return cb() // Skip objects that don't play well with Websockets
        }))
      }

      release()

      if (RACEY_METHODS[method]) {
        logger.info(`[project ${this.getAlias()}] letting method ${method} fall through`)
        return cb()
      }

      throw new Error(`Unknown project method ${method}`)
    })
  }

  ensurePlatformHaikuRegistry () {
    if (!this.platform) this.platform = {}
    if (!this.platform.haiku) this.platform.haiku = {}
    if (!this.platform.haiku.registry) this.platform.haiku.registry = {}
  }

  getName () {
    const parts = this.folder.split(path.sep)
    const last = parts[parts.length - 1]
    return last
  }

  getNameVariations () {
    return Project.getProjectNameVariations(this.getFolder())
  }

  getFriendlyName (maybeProjectName) {
    return maybeProjectName || toTitleCase(this.getName())
  }

  getCurrentActiveComponentSceneName () {
    const ac = this.getCurrentActiveComponent()
    return ac && ac.getSceneName()
  }

  getCurrentActiveComponentRelpath () {
    const ac = this.getCurrentActiveComponent()
    return ac && ac.getRelpath()
  }

  getCurrentActiveComponent () {
    if (!this._activeComponentSceneName) return null
    return this.findActiveComponentBySceneName(this._activeComponentSceneName)
  }

  getAllActiveComponents () {
    return ActiveComponent.where({ project: this })
  }

  addActiveComponentToMultiComponentTabs (scenename, active = false) {
    // Update the active tabs in memory used for displaying in the UI
    for (const tab of this._multiComponentTabs) {
      if (tab.scenename === scenename) {
        tab.active = active
        return
      }
    }

    this._multiComponentTabs.push({ scenename, active })
  }

  describeSubComponents () {
    return this._multiComponentTabs.map(({scenename, active}) => {
      return {
        isActive: !!active,
        scenename,
        title: toTitleCase(scenename)
      }
    })
  }

  getExistingComponentNames () {
    const names = {
      'main': true // Never allow 'main'
    }

    this._multiComponentTabs.forEach((tab) => {
      names[tab.scenename] = true
    })

    return names
  }

  getNextAvailableSceneNameWithPrefix (prefix, num = 0) {
    // myName, myName_2, myName_3, ...
    const full = `${prefix}${(num < 2) ? '' : `_${num}`}`
    if (!this.findActiveComponentBySceneName(full)) return full
    return this.getNextAvailableSceneNameWithPrefix(prefix, num + 1)
  }

  getMultiComponentTabs () {
    return this._multiComponentTabs
  }

  getMetadata () {
    return this.metadata
  }

  getFileOptions () {
    return this.fileOptions
  }

  getEnvoyOptions () {
    return this.envoyOptions
  }

  getFolder () {
    return this.folder
  }

  getAlias () {
    return this.alias
  }

  buildFileUid (relpath) {
    return path.join(this.getFolder(), relpath)
  }

  getEnvoyChannel (name) {
    switch (name) {
      case 'timeline': return this._envoyTimelineChannel
      case 'glass': return this._envoyGlassChannel
      case 'tour': return this._envoyTourChannel
      default:
        throw new Error('Envoy channel name required')
    }
  }

  getEnvoyClient () {
    return this._envoyClient
  }

  getPlatform () {
    return this.platform
  }

  undo (options, metadata, cb) {
    this.actionStack.undo(options, metadata, cb)
  }

  redo (options, metadata, cb) {
    this.actionStack.redo(options, metadata, cb)
  }

  advanceActionStackIndex () {
    this.actionStackIndex++
  }

  updateHook (...args) {
    const method = args.shift()
    const tx = args.pop()
    // Make our own copy of metadata to munge on, to ensure that we don't pass actionStackIndex along to dependent
    // methods.
    const metadata = Object.assign({}, args.pop())
    args.push(metadata)
    // In case this was provided by a parent updateHook.
    delete metadata.actionStackIndex

    return this.actionStack.handleActionInitiation(
      method,
      args,
      metadata,
      (handleActionResolution) => tx((err, out) => {
        // Should only called if there is *not* an error, but sticking with err-first convention anyway.
        if (experimentIsEnabled(Experiment.IpcIntegrityCheck) && metadata.integrity !== false) {
          const integrity = this.describeIntegrity()

          if (metadata.integrity && this.isRemoteRequest(metadata)) {
            const mismatch = integritiesMismatched(metadata.integrity, integrity)
            if (mismatch) {
              logger.error(`
                Integrity mismatch due to ${method} in ${this.getAlias()}:
                  ${metadata.from} (their result):
                    ${mismatch[0]}
                  ${this.getAlias()} (our result):
                    ${mismatch[1]}
              `)
              if (experimentIsEnabled(Experiment.CrashOnIpcIntegrityCheckFailure)) {
                let message = `Unable to update component (${method} in ${this.getAlias()})`

                if (process.env.NODE_ENV !== 'production') {
                  message = `CRASH! Stop editing now and open dev tools (Cmd+Option+I). ${message}`
                }

                throw new Error(message)
              }
            }
          }

          Object.assign(metadata, {integrity})
        }

        // If we originated the action, notify all other views
        if (!this.isRemoteRequest(metadata)) {
          this.emit('update', method, ...args)
          this.actionStack.enqueueAction(method, [this.getFolder()].concat(args), () => {
            // Only assign the actionStackIndex before we're actually going to fire the action. This ensures we don't
            // prematurely increment our dispatch counter when we're only going to accumulate and defer a remote update.
            metadata.actionStackIndex = this.actionStackIndex
            this.advanceActionStackIndex()
            handleActionResolution(err, out)
          })
        } else {
          // Otherwise we received an update and may need to update ourselves
          this.emit('remote-update', method, ...args)
          handleActionResolution(err, out)
        }
      })
    )
  }

  getWebsocketBroadcastDefaults () {
    return {
      time: Date.now(),
      type: 'broadcast',
      folder: this.getFolder(),
      from: this.getMetadata().alias
    }
  }

  broadcastPayload (mainPayload) {
    const fullPayloadWithMetadata = Object.assign(this.getWebsocketBroadcastDefaults(), mainPayload)
    this.websocket.send(fullPayloadWithMetadata)
  }

  upsertFile ({ relpath, type }) {
    const spec = Object.assign({}, File.DEFAULT_ATTRIBUTES, {
      uid: this.buildFileUid(relpath),
      folder: this.getFolder(),
      dtModified: Date.now(),
      project: this,
      relpath,
      type
    })

    return File.upsert(spec, this.getFileOptions())
  }

  isRemoteRequest (metadata) {
    return metadata && metadata.from !== this.getAlias()
  }

  isLocalUpdate (metadata) {
    return metadata && metadata.from === this.getAlias()
  }

  masterHeartbeat (cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'masterHeartbeat',
      params: [this.getFolder()]
    }, cb)
  }

  saveProject (project, saveOptions = {}, cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'saveProject',
      params: [
        project,
        saveOptions
      ]
    }, cb)
  }

  setInteractionMode (interactionMode, metadata, cb) {
    const components = ActiveComponent.where({project: this})

    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      return async.eachSeries(components, (component, next) => {
        // If we toggle preview mode before any subcomponents are bootstrapped,
        // the bytecode for those subcomponents will be null
        return component.moduleFindOrCreate('basicReload', {}, (err) => {
          if (err) {
            return next(err)
          }

          return component.setInteractionMode(interactionMode, next)
        })
      }, (err) => {
        if (err) {
          release()
          return cb(err)
        }

        // Only set interaction mode once it's been completely assigned to the in-mem components
        this.interactionMode = interactionMode

        release()
        this.updateHook('setInteractionMode', interactionMode, metadata, (fire) => fire())
        return cb()
      })
    })
  }

  getInteractionMode () {
    return this.interactionMode
  }

  toggleInteractionMode (metadata, cb) {
    const interactionMode = this.interactionMode === InteractionMode.EDIT
      ? InteractionMode.LIVE
      : InteractionMode.EDIT

    this.setInteractionMode(interactionMode, metadata, cb)
  }

  linkAsset (assetAbspath, cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'linkAsset',
      params: [
        assetAbspath,
        this.getFolder()
      ]
    }, cb)
  }

  unlinkAsset (assetRelpath, cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'unlinkAsset',
      params: [
        assetRelpath,
        this.getFolder()
      ]
    }, cb)
  }

  bulkLinkAssets (assetAbspaths, cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'bulkLinkAssets',
      params: [
        assetAbspaths,
        this.getFolder()
      ]
    }, cb)
  }

  listAssets (cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'listAssets',
      params: [this.getFolder()]
    }, cb)
  }

  readAllStateValues (cb) {
    return this.websocket.method(
      'readAllStateValues',
      [
        this.getFolder(),
        this.getCurrentActiveComponentRelpath()
      ],
      cb
    )
  }

  queryImageSize (abspath, cb) {
    return this.websocket.method(
      'queryImageSize',
      [abspath],
      cb
    )
  }

  mergeDesigns (designs, metadata, cb) {
    const ac = this.getCurrentActiveComponent()

    if (!ac) {
      logger.warn(`[project] skipping design merge since no component is active`)
      return cb()
    }

    // Since several designs are merged, and that process occurs async, we can get into a situation
    // where individual fragments are inserted but their parent layouts have not been appropriately
    // populated. To fix this, we wait to do any rendering until this whole process has finished
    ac.codeReloadingOn()

    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      return this.updateHook('mergeDesigns', designs, metadata || this.getMetadata(), (fire) => {
        const components = ActiveComponent.where({project: this})

        return async.eachSeries(components, (component, next) => {
          return component.moduleFindOrCreate('basicReload', {}, (err) => {
            if (err) {
              return next(err)
            }

            return component.mergeDesignFiles(designs, next)
          })
        }, (err) => {
          if (err) {
            ac.codeReloadingOff()
            release()
            logger.error(`[project (${this.getAlias()})]`, err)
            return cb(err)
          }

          return ac.reload({
            hardReload: true,
            clearCacheOptions: {
              doClearEntityCaches: true
            }
          }, null, () => {
            ac.codeReloadingOff()
            release()
            fire()
            return cb()
          })
        })
      })
    })
  }

  addActiveComponentToRegistry (activeComponent) {
    const activeComponentKey = path.join(
      this.getFolder(),
      activeComponent.getRelpath()
    )
    this.ensurePlatformHaikuRegistry() // Make sure we have this.platform.haiku; race condition
    this.platform.haiku.registry[activeComponentKey] = activeComponent
    this.addActiveComponentToMultiComponentTabs(activeComponent.getSceneName(), false)
  }

  upsertSceneByName (scenename, cb) {
    const relpath = path.join('code', scenename, 'code.js')
    return this.upsertComponentBytecodeToModule(relpath, cb)
  }

  findOrCreateActiveComponent (scenename, cb) {
    const ac = this.findActiveComponentBySceneName(scenename)

    if (ac) {
      return cb(null, ac)
    }

    return this.upsertSceneByName(scenename, (err) => {
      if (err) {
        return cb(err)
      }

      return cb(null, this.findActiveComponentBySceneName(scenename))
    })
  }

  setCurrentActiveComponent (scenename, metadata, cb) {
    metadata.integrity = false
    return Lock.request(Lock.LOCKS.SetCurrentActiveComponent, false, (release) => {
      // If not in read only mode, create the component entity for the scene in question
      this.findOrCreateActiveComponent(scenename, (err, ac) => {
        if (err) {
          release()
          return cb(err)
        }

        this.addActiveComponentToMultiComponentTabs(scenename, true)
        this._multiComponentTabs.forEach((tab) => {
          // Deactivate all other components held in memory
          tab.active = tab.scenename === scenename
        })

        return Lock.awaitAllLocksFreeExcept([Lock.LOCKS.SetCurrentActiveComponent, Lock.LOCKS.ProjectMethodHandler], () => {
          // Useful to stop haiku-creator listeners when deactivating ActiveComponent
          const currentActiveComponent = this.getCurrentActiveComponent()
          if (currentActiveComponent) {
            currentActiveComponent.emit('update', 'componentDeactivating')
          }

          this._activeComponentSceneName = scenename

          this.updateHook('setCurrentActiveComponent', scenename, metadata || this.getMetadata(), (fire) => {
            fire()
            release()
            return cb(null, ac)
          })
        })
      })
    })
  }

  closeNamedActiveComponent (scenename, metadata, cb) {
    for (let i = this._multiComponentTabs.length - 1; i >= 0; i--) {
      const tab = this._multiComponentTabs[i]
      if (tab.scenename === scenename) this._multiComponentTabs.splice(i, 1)
      else tab.active = false
    }
    // TODO: Make smarter instead of just choosing the first one in the list
    this._activeComponentSceneName = this._multiComponentTabs[0]
    this.updateHook('closeNamedActiveComponent', scenename, metadata || this.getMetadata(), (fire) => fire())
    if (cb) return cb()
  }

  renameComponent (scenenameOld, scenenameNew, metadata, cb) {
    // TODO, important for multi-component, launching straight to editing, etc.
    // Need to change all in-memory references to the name,
    // all existing file-system references to the name including other components
    // within the project that may have instantiated this :/
    throw new Error('not yet implemented')
    // if (cb) return cb()
  }

  /**
   * Standard import and instantiation of files dropped
   * in Haiku from the user file system by:
   * - Handling the drop event
   * - Filtering files that are not supported
   * - Linking the assets via plumbing
   */
  linkExternalAssetOnDrop (event, cb) {
    if (Asset.isInternalDrop(event)) return cb()

    event.preventDefault()

    const files = Array.from(event.dataTransfer.items)
      .filter(Asset.isValidFile) /* Allow only svg and sketch files */
      .map(item => item.getAsFile().path)

    return this.websocket.request({
      folder: this.getFolder(),
      method: 'bulkLinkAssets',
      params: [files, this.getFolder()]
    }, cb)
  }

  /**
   * @method upsertComponentBytecodeToFile
   * @description Given a relpath and a bytecode object, insert a component file
   * at the given relpath with the given bytecode as its code.js export. If the
   * file already exists, we'll merge the bytecode objects' contents together.
   * The relpath here is the destination of the file to write to within the project
   * @param relpath {String} Relative path to destination code file within project
   * @param cb {Function}
   */
  upsertComponentBytecodeToModule (relpath, cb) {
    // Note: This assumes that the basic bytecode file *has already been created*
    this.upsertActiveComponentInstance(relpath, (err, ac) => {
      if (err) {
        return cb(err)
      }

      return ac.mountApplication(null, {}, (err) => {
        if (err) return cb(err)
        this.emit('active-component:upserted')
        return cb(null, ac)
      })
    })
  }

  relpathToSceneName (relpath) {
    // Must normalize so ./foo/bar/baz becomes foo/bar/baz (note number of slashes)
    return path.normalize(relpath).split(path.sep)[1]
  }

  upsertActiveComponentInstance (relpath, cb) {
    const abspath = path.join(this.getFolder(), relpath)
    return Lock.request(Lock.LOCKS.FileReadWrite(abspath), false, (release) => {
      const file = this.upsertFile({
        relpath,
        type: File.TYPES.code
      })

      release()
      return cb(null, file.component)
    })
  }

  findActiveComponentBySource (relpath, cb) {
    const scenename = ModuleWrapper.getScenenameFromRelpath(relpath)
    return this.findOrCreateActiveComponent(scenename, cb)
  }

  findActiveComponentBySourceIfPresent (relpath) {
    const scenename = ModuleWrapper.getScenenameFromRelpath(relpath)
    return this.findActiveComponentBySceneName(scenename)
  }

  findActiveComponentBySceneName (scenename) {
    return ActiveComponent.findById(ActiveComponent.buildPrimaryKey(this.getFolder(), scenename))
  }

  getPackageJsonPath () {
    return path.join(this.getFolder(), 'package.json')
  }

  getDefaultComponentInfo () {

  }

  readPackageJsonSafe (cb) {
    let pkg

    try {
      pkg = fse.readJsonSync(this.getPackageJsonPath(), {throws: false})
    } catch (exception) {
      logger.warn(`[project (${this.getAlias()})] package.json error:`, exception)
      pkg = {}
    }

    return cb(pkg)
  }

  writePackageJson (pkg, cb) {
    try {
      fse.outputJsonSync(this.getPackageJsonPath(), pkg)
    } catch (exception) {
      return cb(exception)
    }

    return cb()
  }

  readComponentInfo (scenename, cb) {
    return this.readPackageJsonSafe((pkg) => {
      const info = lodash.get(pkg, `haiku.${scenename}`) || {}

      const getMetadata = (cb) => {
        const ac = this.findActiveComponentBySceneName(scenename)

        if (!ac) {
          return cb({}) // eslint-disable-line standard/no-callback-literal
        }

        return ac.readMetadata((err, metadata) => {
          if (err) {
            logger.warn(`[project (${this.getAlias()})] component metadata error:`, err)
          }

          return cb(metadata || {})
        })
      }

      return getMetadata((metadata) => {
        const final = lodash.assign({}, metadata, info)
        return cb(null, final)
      })
    })
  }

  getCodeFolderAbspath () {
    return path.join(this.getFolder(), 'code')
  }

  rehydrate () {
    fse.readdirSync(this.getCodeFolderAbspath()).filter((entry) => {
      // Ignore hidden files that may appear here such as everyone's favorite .DS_Store
      return entry && entry[0] !== '.'
    }).forEach((scenename) => {
      this.addActiveComponentToMultiComponentTabs(scenename)
    })
  }

  describeIntegrity () {
    const descriptor = {}

    this.getAllActiveComponents().forEach((ac) => {
      const relpath = ac.getRelpath()

      const {
        hash,
        source
      } = ac.getInsertionPointInfo()

      descriptor[relpath] = {hash}

      if (experimentIsEnabled(Experiment.IncludeSourceInIntegrityHash)) {
        descriptor[relpath].source = source
      }
    })

    return descriptor
  }
}

Project.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    folder: true, // Absolute path to project folder on file system
    alias: true, // Name of view in which we are running
    userconfig: true, // Generic configuration project
    websocket: true, // Websocket for plumbing connection - Expected to be initialized already
    platform: true, // E.g. window or global
    fileOptions: true,
    envoyOptions: true
  }
}

BaseModel.extend(Project)

module.exports = Project

Project.awaitOneUpdateFromActiveComponent = (activeComponent, channel, fn) => {
  let once = true
  activeComponent.on('update', (what, a, b, c, d, e, f, g, h) => {
    if (once && what === channel) {
      once = false
      fn(a, b, c, d, e, f, g, h)
    }
  })
}

Project.setup = (
  folder,
  alias,
  websocket,
  platform = {},
  userconfig = {},
  fileOptions = {},
  envoyOptions = {},
  cb
) => {
  fse.mkdirpSync(path.join(folder, 'code'))

  const project = Project.upsert({
    uid: folder,
    folder,
    alias,
    websocket,
    userconfig,
    platform,
    fileOptions,
    envoyOptions
  })

  project.rehydrate()
  return cb(null, project)
}

Project.getProjectNameVariations = (folder) => {
  const projectHaikuConfig = readPackageJson(folder).haiku
  const projectNameSafe = getSafeProjectName(projectHaikuConfig.project)
  const projectNameSafeShort = getProjectNameSafeShort(projectHaikuConfig.project)
  const projectNameLowerCase = getProjectNameLowerCase(projectHaikuConfig.project)
  const reactProjectName = getReactProjectName(projectHaikuConfig.project)
  const angularSelectorName = getAngularSelectorName(projectHaikuConfig.project)
  const primaryAssetPath = getDefaultSketchAssetPath(projectHaikuConfig.project)
  const defaultIllustratorAssetPath = getDefaultIllustratorAssetPath(projectHaikuConfig.project)

  return {
    projectNameSafe,
    projectNameSafeShort,
    projectNameLowerCase,
    reactProjectName,
    angularSelectorName,
    primaryAssetPath,
    defaultIllustratorAssetPath
  }
}

Project.executeFunctionSpecification = (binding, alias, payload, cb) => {
  if (process.env.NODE_ENV === 'production') return cb()
  if (payload.views && payload.views.indexOf(alias) === -1) return cb()
  const fn = reifyRFO(payload)
  return fn.call(binding, payload, cb)
}

const integritiesMismatched = (i1, i2) => {
  const s1 = jss(Object.keys(i1).reduce((accumulator, key) => {
    if (i2[key]) {
      accumulator[key] = i1[key]
    }
    return accumulator
  }, {}))
  const s2 = jss(Object.keys(i1).reduce((accumulator, key) => {
    if (i1[key]) {
      accumulator[key] = i2[key]
    }
    return accumulator
  }, {}))
  if (s1 !== s2) {
    return [s1, s2]
  }
  return false
}

// Sorry, hacky. We route some methods to this object dynamically, and in order
// to detect which should receive the metadata parameter, we use this
Project.PUBLIC_METHODS = {
  setCurrentActiveComponent: true,
  closeNamedActiveComponent: true,
  renameComponent: true
}

// Down here to avoid Node circular dependency stub objects. #FIXME
const ActiveComponent = require('./ActiveComponent')
const Asset = require('./Asset')
const File = require('./File')
const ModuleWrapper = require('./ModuleWrapper')
