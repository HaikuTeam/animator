const fse = require('haiku-fs-extra')
const path = require('path')
const async = require('async')
const WebSocket = require('ws')
const dedent = require('dedent')
const pascalcase = require('pascalcase')
const lodash = require('lodash')
const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')
const EnvoyClient = require('haiku-sdk-creator/lib/envoy/EnvoyClient').default
const EnvoyLogger = require('haiku-sdk-creator/lib/envoy/EnvoyLogger').default
const { GLASS_CHANNEL } = require('haiku-sdk-creator/lib/glass')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')
const reifyRO = require('@haiku/core/lib/reflection/reifyRO').default
const reifyRFO = require('@haiku/core/lib/reflection/reifyRFO').default
const toTitleCase = require('./helpers/toTitleCase')
const Lock = require('./Lock')
const ActionStack = require('./ActionStack')

const WHITESPACE_REGEX = /\s+/
const UNDERSCORE = '_'
const FALLBACK_ORG_NAME = 'Unknown'
const FALLBACK_SEMVER_VERSION = '0.0.0'
const ALWAYS_IGNORED_METHODS = {
  // Handled upstream, by Creator, Glass, Timeline, etc.
  executeFunctionSpecification: true
}
const SILENT_METHODS = {
  hoverElement: true,
  unhoverElement: true
}
const SERIAL_METHODS = {
  describeIntegrityHandler: true
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
    this._multiComponentTabs = []

    // Whether we should actually receive and act upon remote methods received
    this.isHandlingMethods = true
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
        ? this.findActiveComponentBySource(params[0])
        : null

      if (ac && typeof ac[method] === 'function') {
        if (!SILENT_METHODS[method]) {
          logger.info(`[project (${this.getAlias()})] component handling method ${method}`, params)
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
          logger.info(`[project (${this.getAlias()})] project handling method ${method}`, params)
        }

        return this[method].apply(this, params.concat((err, result) => {
          release()

          if (err) {
            return cb(err)
          }

          if (SERIAL_METHODS[method]) {
            return cb(null, result)
          } else {
            return cb() // Skip objects that don't play well with Websockets
          }
        }))
      }

      release()

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

  addActiveComponentToMultiComponentTabs (scenename, active) {
    // Update the active tabs in memory used for displaying in the UI
    let foundAlready = false
    this._multiComponentTabs.forEach((tab) => {
      if (tab.scenename === scenename) foundAlready = true
    })
    if (!foundAlready) {
      this._multiComponentTabs.push({ scenename, active })
    }
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

  updateHook (...args) {
    const method = args.shift()
    const tx = args.pop()
    const metadata = args[args.length - 1]
    return this.actionStack.handleActionInitiation(method, args, metadata, (handleActionResolution) => {
      // Should only called if there is *not* an error, but sticking with err-first convention anyay
      return tx((err, out) => {
        // If we originated the action, notify all other views
        if (!this.isRemoteRequest(metadata)) {
          this.emit.apply(this, ['update', method].concat(args))
          this.actionStack.fireAction(method, [this.getFolder()].concat(args), null, () => {
            handleActionResolution(err, out)
          })
        } else {
          // Otherwise we received an update and may need to update ourselves
          this.emit.apply(this, ['remote-update', method].concat(args))
          handleActionResolution(err, out)
        }
      })
    })
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

  requestSyndicationInfo (cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'requestSyndicationInfo',
      params: [this.getFolder()]
    }, cb)
  }

  saveProject (projectName, username, password, saveOptions = {}, cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'saveProject',
      params: [
        this.getFolder(),
        projectName,
        username,
        password,
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

        release()
        this.updateHook('setInteractionMode', interactionMode, metadata, (fire) => fire())
        return cb()
      })
    })
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
    this.addActiveComponentToMultiComponentTabs(activeComponent.getSceneName(), null)
  }

  upsertSceneByName (scenename, cb) {
    const relpath = path.join('code', scenename, 'code.js')
    const bytecode = null // In this pathway, we want to create the bytecode or load it from disk
    const instanceConfig = {}
    return this.upsertComponentBytecodeToModule(relpath, bytecode, instanceConfig, cb)
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
    return Lock.request(Lock.LOCKS.SetCurrentActiveCompnent, null, (release) => {
      this.addActiveComponentToMultiComponentTabs(scenename, true)

      const activateComponentContinuation = () => {
        this._multiComponentTabs.forEach((tab) => {
          // Deactivate all other components held in memory
          if (tab.scenename !== scenename) {
            tab.active = false
          } else {
            tab.active = true
          }
        })

        return Lock.awaitFree([
          Lock.LOCKS.ActiveComponentWork,
          Lock.LOCKS.ActiveComponentReload,
          Lock.LOCKS.FilePerformComponentWork,
          Lock.LOCKS.ActionStackUndoRedo
        ], () => {
          this._activeComponentSceneName = scenename

          this.updateHook('setCurrentActiveComponent', scenename, metadata || this.getMetadata(), (fire) => {
            const ac = this.findActiveComponentBySceneName(scenename)
            fire()
            release()
            return cb(null, ac)
          })
        })
      }

      // If not in read only mode, create the component entity for the scene in question
      if (!this.findActiveComponentBySceneName(scenename)) {
        return this.upsertSceneByName(scenename, (err) => {
          if (err) {
            release()
            return cb(err)
          }

          return activateComponentContinuation()
        })
      }

      return activateComponentContinuation()
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
   * @method componentizeDesign
   * @description Given a relpath to a design asset that exists on the file system,
   * convert its contents into an component object ('bytecode'), creating a component
   * code file within the file system.
   * @param relpath {String} Path to the design element
   * @param cb {Function}
   */
  componentizeDesign (relpath, options, cb) {
    return Design.designAsCode(this.getFolder(), relpath, {}, (err, identifier, modpath, bytecode) => {
      if (err) return cb(err)

      return this.upsertComponentBytecodeToModule(modpath, bytecode, options, (err, component) => {
        if (err) return cb(err)
        return cb(null, identifier, modpath, bytecode, null, component)
      })
    })
  }

  /**
   * @method upsertComponentBytecodeToFile
   * @description Given a relpath and a bytecode object, insert a component file
   * at the given relpath with the given bytecode as its code.js export. If the
   * file already exists, we'll merge the bytecode objects' contents together.
   * The relpath here is the destination of the file to write to within the project
   * @param folder {String} Absolute path to project folder
   * @param relpath {String} Relative path to destination code file within project
   * @param bytecode {Object} A bytecode object (maybe reified or serialized)
   * @param cb {Function}
   */
  upsertComponentBytecodeToModule (relpath, bytecode, instanceConfig, cb) {
    // Note: This assumes that the basic bytecode file *has already been created*
    const ac = this.upsertActiveComponentInstance(relpath)

    // This is going to be called once we finish up the async work below
    const finalize = (cb) => {
      this.emit('active-component:upserted')

      // Note that this instanceConfig variable may get mutated below
      return ac.mountApplication(null, instanceConfig, (err) => {
        if (err) return cb(err)
        return cb(null, ac)
      })
    }

    const file = this.upsertFile({
      relpath,
      type: File.TYPES.code
    })

    const mod = ac.fetchActiveBytecodeFile().mod

    // Allow bytecode already stored in memory to be passed here to avoid the need for a forced require
    if (bytecode) {
      // If we do a merge, we may swap this variable with the existing merged one in a moment
      let reified = reifyRO(bytecode)

      // If we have existing bytecode, we are going to merge the incoming properties
      return mod.reloadExtantModule((err, extant) => {
        if (err) return cb(err)

        if (extant) {
          Bytecode.mergeBytecode(extant, reified)
          reified = extant
        }

        // Hacky, but in situations where we don't want to have to write to the fs before being
        // able to load the module via require() call, i.e. in the glass or timeline
        return file.mod.update(reified, () => {
          return finalize(cb)
        })
      })
    } else {
      // Make sure we end up with something defined for the bytecode, or things don't work
      return file.mod.update({}, () => {
        return finalize(cb)
      })
    }
  }

  relpathToSceneName (relpath) {
    // Must normalize so ./foo/bar/baz becomes foo/bar/baz (note number of slashes)
    return path.normalize(relpath).split(path.sep)[1]
  }

  upsertActiveComponentInstance (relpath) {
    const file = File.upsert({
      uid: path.join(this.getFolder(), relpath),
      project: this,
      folder: this.getFolder(),
      relpath
    })

    return file.component
  }

  findActiveComponentBySource (relpath) {
    const scenename = ModuleWrapper.getScenenameFromRelpath(relpath)
    return this.findActiveComponentBySceneName(scenename)
  }

  findActiveComponentBySceneName (scenename) {
    return ActiveComponent.findById(ActiveComponent.buildPrimaryKey(this.getFolder(), scenename))
  }

  bootstrapSceneFilesSync (scenename, userconfig) {
    const rootComponentId = getCodeJs(
      Template.getHash(scenename, 12),
      experimentIsEnabled(Experiment.MultiComponentFeatures)
        ? scenename
        : path.basename(this.getFolder()),
      userconfig
    )

    // Only write these files if they don't exist yet; don't overwrite the user's own content
    if (!fse.existsSync(path.join(this.getFolder(), `code/${scenename}/code.js`))) {
      fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/code.js`), rootComponentId)
    }

    const nameVariations = this.getNameVariations()
    fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/dom.js`), DOM_JS)
    fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/dom-embed.js`), DOM_EMBED_JS)
    fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/react-dom.js`), REACT_DOM_JS)
    fse.outputFileSync(
      path.join(this.getFolder(), `code/${scenename}/angular-dom.js`),
      ANGULAR_DOM_JS(nameVariations.angularSelectorName, scenename)
    )
    fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/vue-dom.js`), VUE_DOM_JS)

    if (!fse.existsSync(path.join(this.getFolder(), `code/${scenename}/dom-standalone.js`))) {
      fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/dom-standalone.js`), DOM_STANDALONE_JS)
    }

    return rootComponentId
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

  setupActiveComponent (relpath, cb) {
    const activeComponent = this.upsertActiveComponentInstance(relpath)
    return cb(null, activeComponent)
  }

  setupScene (scenename, cb) {
    return this.setupActiveComponent(path.join('code', scenename, 'code.js'), cb)
  }

  getCodeFolderAbspath () {
    return path.join(this.getFolder(), 'code')
  }

  rehydrate (cb) {
    const entries = fse.readdirSync(this.getCodeFolderAbspath()).filter((entry) => {
      // Ignore hidden files that may appear here such as everyone's favorite .DS_Store
      return entry && entry[0] !== '.'
    })
    return async.eachSeries(entries, this.setupScene.bind(this), cb)
  }

  describeComponents () {
    let out = ''

    this.getAllActiveComponents().forEach((ac) => {
      out += ac.getRelpath() + '\n'
      out += (Template.inspect(ac.getReifiedBytecode().template) || '?') + '\n\n'
    })

    return out
  }

  /**
   * @method getComponentBytecodeSHAs
   * @description Return a dictionary mapping component relpaths to SHA256s representing
   * their current in-mem bytecode, e.g. {'code/main/code.js': 'abc123abc...'}
   */
  describeIntegrity () {
    const shas = {}

    this.getAllActiveComponents().forEach((ac) => {
      shas[ac.getRelpath()] = {
        len: ac.getNormalizedBytecodeJSON().length
      }
    })

    return shas
  }

  describeIntegrityHandler (metadata, cb) {
    return cb(null, this.describeIntegrity())
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

  return project.rehydrate((err) => {
    if (err) return cb(err)
    return cb(null, project)
  })
}

Project.storeConfigValues = (folder, incoming) => {
  fse.mkdirpSync(folder)
  const pkgjson = Project.readPackageJson(folder)
  lodash.assign(pkgjson.haiku, incoming)
  fse.outputJsonSync(path.join(folder, 'package.json'), pkgjson, {spaces: 2})
  return pkgjson.haiku
}

Project.readPackageJson = (folder) => {
  let pkgjson = {}
  try {
    pkgjson = fse.readJsonSync(path.join(folder, 'package.json'), {throws: false})
  } catch (e) {
    pkgjson = {}
  }
  if (!pkgjson.haiku) pkgjson.haiku = {}
  if (!pkgjson.version) pkgjson.version = FALLBACK_SEMVER_VERSION
  return pkgjson
}

Project.fetchProjectConfigInfo = (folder, cb) => {
  const pkgjson = Project.readPackageJson(folder)
  const config = (pkgjson && pkgjson.haiku) || {}
  return cb(null, lodash.assign({
    folder,
    uuid: 'HAIKU_SHARE_UUID', // Replaced on the server
    core: ModuleWrapper.CORE_VERSION,
    player: ModuleWrapper.CORE_VERSION // legacy alias for 'core'
    // config: name, project, username, organization, branch, version, commit
  }, config))
}

Project.getAngularSelectorName = (name) => name
  .replace(/([A-Z])/g, (char) => `-${char.toLowerCase()}`)
  .replace(/^-/, '')

Project.getPrimaryAssetPath = (name) => `designs/${name}.sketch`

Project.getDefaultIllustratorAssetPath = (name) => `designs/${name}.ai`

Project.getProjectNameVariations = (folder) => {
  const projectHaikuConfig = Project.readPackageJson(folder).haiku
  const projectNameSafe = Project.getSafeProjectName(folder, projectHaikuConfig.project)
  const projectNameSafeShort = projectNameSafe.slice(0, 20)
  const projectNameLowerCase = projectNameSafe.toLowerCase()
  const reactProjectName = `React_${projectNameSafe}`
  const angularSelectorName = Project.getAngularSelectorName(projectNameSafe)
  const primaryAssetPath = Project.getPrimaryAssetPath(projectNameSafeShort)
  const defaultIllustratorAssetPath = Project.getDefaultIllustratorAssetPath(projectNameSafeShort)

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

Project.getSafeProjectName = (maybeProjectPath, maybeProjectName) => {
  if (maybeProjectName) return maybeProjectName.replace(WHITESPACE_REGEX, UNDERSCORE)
  if (maybeProjectPath) return pascalcase(maybeProjectPath.split(path.sep).join(UNDERSCORE))
  throw new Error('Unable to infer a project name!')
}

Project.getSafeOrgName = (maybeOrgName) => {
  if (!maybeOrgName || typeof maybeOrgName !== 'string') maybeOrgName = FALLBACK_ORG_NAME
  return maybeOrgName.replace(WHITESPACE_REGEX, UNDERSCORE)
}

Project.executeFunctionSpecification = (binding, alias, payload, cb) => {
  if (process.env.NODE_ENV === 'production') return cb()
  if (payload.views && payload.views.indexOf(alias) === -1) return cb()
  const fn = reifyRFO(payload)
  return fn.call(binding, payload, cb)
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
const Bytecode = require('./Bytecode')
const Design = require('./Design')
const File = require('./File')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')

function getCodeJs (haikuId, haikuComponentName, metadata = {}) {
  return dedent`
    var Haiku = require("@haiku/core");
    module.exports = {
      metadata: ${JSON.stringify(metadata, null, 2)},
      options: {},
      states: {},
      eventHandlers: {},
      timelines: {
        Default: {}
      },
      template: {
        elementName: "div",
        attributes: {
          "haiku-id": "${haikuId}",
          "haiku-title": "${haikuComponentName}"
        },
        children: []
      }
    };
  `.trim()
}

const DOM_JS = dedent`
  var HaikuDOMAdapter = require('@haiku/core/dom')
  module.exports = HaikuDOMAdapter(require('./code'))
`.trim()

const DOM_EMBED_JS = dedent`
  var code = require('./code')
  var adapter = window.HaikuResolve && window.HaikuResolve('${ModuleWrapper.CORE_VERSION}')
  if (adapter) {
    module.exports = adapter(code)
  } else  {
    function safety () {
      console.error(
        '[haiku core] core version ${ModuleWrapper.CORE_VERSION} seems to be missing. ' +
        'index.embed.js expects it at window.HaikuCore["${ModuleWrapper.CORE_VERSION}"], but we cannot find it. ' +
        'you may need to add a <script src="path/to/HaikuCore.js"></script> to fix this.'
      )
      return code
    }
    for (var key in code) {
      safety[key] = code[key]
    }
    module.exports = safety
  }
`.trim()

const DOM_STANDALONE_JS = dedent`
  module.exports = require('./dom')
`.trim()

const REACT_DOM_JS = dedent`
  var React = require('react') // Installed as a peer dependency of '@haiku/core'
  var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
  var HaikuReactAdapter = require('@haiku/core/dom/react')
  var HaikuReactComponent = HaikuReactAdapter(require('./dom'))
  if (HaikuReactComponent.default) HaikuReactComponent = HaikuReactComponent.default
  module.exports = HaikuReactComponent
`.trim()

const ANGULAR_DOM_JS = (selector, scenename) => dedent`
  var HaikuAngularAdapter = require('@haiku/core/dom/angular')
  var HaikuAngularModule = HaikuAngularAdapter('${selector}${scenename !== 'main' ? `-${scenename}` : ''}', require('./dom'))
  module.exports = HaikuAngularModule
`.trim()

const VUE_DOM_JS = dedent`
  var HaikuVueAdapter = require('@haiku/core/dom/vue')
  var HaikuVueComponent = HaikuVueAdapter(require('./dom'))
  if (HaikuVueComponent.default) HaikuVueComponent = HaikuVueComponent.default
  module.exports = HaikuVueComponent
`.trim()
