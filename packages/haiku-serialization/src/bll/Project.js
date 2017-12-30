const fse = require('haiku-fs-extra')
const path = require('path')
const lodash = require('lodash')
const async = require('async')
const WebSocket = require('ws')
const dedent = require('dedent')
const pascalcase = require('pascalcase')
const EnvoyClient = require('haiku-sdk-creator/lib/envoy/EnvoyClient').default
const EnvoyLogger = require('haiku-sdk-creator/lib/envoy/EnvoyLogger').default
const { GLASS_CHANNEL } = require('haiku-sdk-creator/lib/glass')
const log = require('./helpers/log')
const BaseModel = require('./BaseModel')
const reifyRO = require('@haiku/player/lib/reflection/reifyRO').default
const toTitleCase = require('./helpers/toTitleCase')
const normalizeBytecodeFile = require('./../ast/normalizeBytecodeFile')

const WHITESPACE_REGEX = /\s+/
const UNDERSCORE = '_'
const WEBSOCKET_BATCH_INTERVAL = 250
const HAIKU_CONFIG_FILE = 'haiku.js'

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
 *
 *.  Some top-level methods that don't relate strictly to components also live
 *.  here, such as git-undo.
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
    this._websocketActions = []

    // No-op callback for arbitrary websocket actions
    this._receiveWebsocketResponse = () => {}

    // Queue processor that invokes any pending websocket actions
    setInterval(() => {
      const actions = this._websocketActions.splice(0)
      if (actions.length < 1) return void (0)
      actions.forEach(({ method, params, callback }) => {
        this.websocket.action(method, params, callback, this.getFolder())
      })
    }, WEBSOCKET_BATCH_INTERVAL)

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
  }

  teardown () {
    this.getEnvoyClient().closeConnection()
    if (this.websocket) this.websocket.disconnect()
  }

  connectClients () {
    if (this.websocket) {
      // Idempotent setup should handle an already-connected client gracefully
      this.websocket.connect()

      if (!this._didStartWebsocketListeners) {
        // Upon receipt of a method, route to the correct ActiveComponent
        this.websocket.on('method', (method, params, message, cb) => {
          if (this.isIgnoringMethodRequestsForMethod(method)) {
            return null // Another handler will call the callback in this case
          } else if (this.shouldShortCircuitRequestsForMethod(method)) {
            return cb() // Skip the method and return; nobody will handle this otherwise
          } else {
            return this.handleMethodCall(method, params, message, cb)
          }
        })

        this.websocket.on('close', () => log.info('[project] websocket closed'))
        this.websocket.on('error', () => log.info('[project] websocket error'))

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

      this._envoyClient = new EnvoyClient(lodash.assign({
        WebSocket: websocketClient,
        logger: new EnvoyLogger('warn', console)
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

  websocketActionWithFolder (method, params, cb) {
    return this.batchedWebsocketAction(method, [this.getFolder()].concat(params), cb)
  }

  isIgnoringMethodRequestsForMethod (method) {
    // HACK: This probably doesn't/shouldn't belong as a part of 'fileOptions'
    // It's a hacky way for MasterProcess to handle certain methods it cares about
    const fileOptions = this.getFileOptions()
    return fileOptions && fileOptions.methodsToIgnore && fileOptions.methodsToIgnore[method]
  }

  shouldShortCircuitRequestsForMethod (method) {
    // HACK: This probably doesn't/shouldn't belong as a part of 'fileOptions'
    // It's a hacky way for MasterProcess to handle certain methods it cares about
    const fileOptions = this.getFileOptions()
    return (
      fileOptions &&
      fileOptions.methodsToShortCircuit &&
      (
        fileOptions.methodsToShortCircuit[method] ||
        fileOptions.methodsToShortCircuit['*']
      )
    )
  }

  handleMethodCall (method, params, message, cb) {
    // Try matching a method on a given active component
    const ac = this.findActiveComponentBySource(params[0])
    if (ac && typeof ac[method] === 'function') {
      log.info(`[project (${this.getAlias()})] component handling method ${method}`, params, typeof cb === 'function')
      try {
        return ac[method].apply(ac, params.slice(1).concat(cb))
      } catch (exception) {
        return cb(exception)
      }
    }

    // If we have a method here at the top, call it
    if (typeof this[method] === 'function') {
      log.info(`[project (${this.getAlias()})] project handling method ${method}`, params, typeof cb === 'function')
      try {
        return this[method].apply(this, params.concat((err) => {
          if (err) return cb(err)
          // We usually return full objects, which don't play well with Websockets
          return cb()
        }))
      } catch (exception) {
        return cb(exception)
      }
    }

    return cb(new Error(`Unknown project method ${method}`))
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
    return this.getCurrentActiveComponent() && this.getCurrentActiveComponent().getSceneName()
  }

  getCurrentActiveComponentRelpath () {
    return this.getCurrentActiveComponent() && this.getCurrentActiveComponent().getSceneCodeRelpath()
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

  batchedWebsocketAction (method, params, callback) {
    this._websocketActions.push({ method, params, callback })
  }

  transmitAction (...args) {
    const method = args.shift()
    this.websocket.send({
      folder: this.getFolder(),
      type: 'action',
      from: this.getAlias(),
      method,
      params: [this.getFolder()].concat(args)
    })
  }

  updateHook (...args) {
    this.methodHook.apply(this, args)
    this.emitHook.apply(this, args)
  }

  emitHook (...args) {
    const method = args.shift()
    const metadata = args.pop()
    if (metadata.from === this.getAlias()) {
      this.emit.apply(this, ['update', method].concat(args))
    } else {
      // Otherwise we received an update and may need to update ourselves
      this.emit.apply(this, ['remote-update', method].concat(args))
    }
  }

  methodHook (...args) {
    const method = args.shift()
    const metadata = args.pop()
    // If we originated the action, notify all other views
    if (metadata.from === this.getAlias()) {
      log.info(`[project (${this.getAlias()})] method hook: ${method}`)
      this.batchedWebsocketAction(
        method,
        [this.getFolder()].concat(args),
        this._receiveWebsocketResponse
      )
    }
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
    const fullPayloadWithMetadata = lodash.assign(this.getWebsocketBroadcastDefaults(), mainPayload)
    this.websocket.send(fullPayloadWithMetadata)
  }

  broadcastMethod (...args) {
    const method = args.shift()
    const relpath = args.shift()
    this.websocket.send(lodash.assign(this.getWebsocketBroadcastDefaults(), {
      method,
      params: [this.getFolder(), relpath].concat(args)
    }))
  }

  upsertFile ({ relpath, type }) {
    const spec = lodash.assign({}, File.DEFAULT_ATTRIBUTES, {
      uid: this.buildFileUid(relpath),
      folder: this.getFolder(),
      dtModified: Date.now(),
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

  toggleDevTools () {
    return this.websocket.send({
      folder: this.getFolder(),
      method: 'toggleDevTools',
      params: [this.getFolder()]
    })
  }

  fetchProjectInfo (projectName, username, password, cb) {
    return this.websocket.request({
      folder: this.getFolder(),
      method: 'fetchProjectInfo',
      params: [
        this.getFolder(),
        projectName,
        username,
        password,
        {}
      ]
    }, cb)
  }

  pasteThing (pastedElement, maybePasteRequest = {}, cb) {
    return this.websocketActionWithFolder(
      'pasteThing',
      [
        this.getCurrentActiveComponentRelpath(),
        pastedElement,
        maybePasteRequest
      ],
      cb
    )
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

  instantiateComponent (relpath, posdata, cb) {
    return this.getCurrentActiveComponent().instantiateComponent(relpath, posdata, this.getMetadata(), cb)
  }

  setInteractionMode (interactionMode, cb) {
    return this.getCurrentActiveComponent().setInteractionMode(interactionMode, this.getMetadata(), cb)
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

  upsertStateValue (stateName, stateValue, cb) {
    return this.websocketActionWithFolder(
      'upsertStateValue',
      [
        this.getCurrentActiveComponentRelpath(),
        stateName,
        stateValue
      ],
      cb
    )
  }

  deleteStateValue (stateName, cb) {
    return this.websocketActionWithFolder(
      'deleteStateValue',
      [
        this.getCurrentActiveComponentRelpath(),
        stateName
      ],
      cb
    )
  }

  transmitInstantiateComponent (relpath, posdata, cb) {
    return this.websocketActionWithFolder(
      'instantiateComponent',
      [
        this.getCurrentActiveComponentRelpath(),
        relpath,
        posdata
      ],
      cb
    )
  }

  viewZoomIn () {
    return this.websocket.send({ type: 'broadcast', name: 'view:zoom-in' })
  }

  viewZoomOut () {
    return this.websocket.send({ type: 'broadcast', name: 'view:zoom-out' })
  }

  gitUndo () {
    return this.websocket.send({
      folder: this.getFolder(),
      method: 'gitUndo',
      params: [this.getFolder(), { type: 'global' }]
    })
  }

  gitRedo () {
    return this.websocket.send({
      folder: this.getFolder(),
      method: 'gitRedo',
      params: [this.getFolder(), { type: 'global' }]
    })
  }

  addActiveComponentToRegistry (activeComponent) {
    const activeComponentKey = path.join(this.getFolder(), activeComponent.getSceneCodeRelpath())
    this.ensurePlatformHaikuRegistry() // Make sure we have this.platform.haiku; race condition
    this.platform.haiku.registry[activeComponentKey] = activeComponent
    this.addActiveComponentToMultiComponentTabs(activeComponent.getSceneName(), null)
  }

  upsertSceneByName (scenename, cb) {
    const relpath = path.join('code', scenename, 'code.js')
    const bytecode = null // In this pathway, we want to create the bytecode or load it from disk
    const instanceConfig = {
      // If we have monkeypatched content, use that, otherwise, reload from disk
      reloadMode: ModuleWrapper.RELOAD_MODES.MONKEYPATCHED_OR_ISOLATED
    }
    return this.upsertComponentBytecodeToModule(relpath, bytecode, instanceConfig, cb)
  }

  /**
   * Methods that may be called via the view and thus require `metadata` parameter
   */

  setCurrentActiveComponent (scenename, metadata, cb) {
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

      this._activeComponentSceneName = scenename

      this.updateHook('setCurrentActiveComponent', scenename, metadata || this.getMetadata())

      const ac = this.findActiveComponentBySceneName(scenename)

      return cb(null, ac)
    }

    // If not in read only mode, create the component entity for the scene in question
    if (!this.findActiveComponentBySceneName(scenename)) {
      return this.upsertSceneByName(scenename, (err) => {
        if (err) return cb(err)
        return activateComponentContinuation()
      })
    }

    return activateComponentContinuation()
  }

  closeNamedActiveComponent (scenename, metadata, cb) {
    for (let i = this._multiComponentTabs.length - 1; i >= 0; i--) {
      const tab = this._multiComponentTabs[i]
      if (tab.scenename === scenename) this._multiComponentTabs.splice(i, 1)
      else tab.active = false
    }
    // TODO: Make smarter instead of just choosing the first one in the list
    const nextSceneName = this._multiComponentTabs[0] && this._multiComponentTabs[0]
    this._activeComponentSceneName = nextSceneName
    this.updateHook('closeNamedActiveComponent', scenename, metadata || this.getMetadata())
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
    return Design.designAsCode(this.getFolder(), relpath, (err, identifier, modpath, bytecode) => {
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

    const file = this.upsertFile({
      relpath,
      type: File.TYPES.code
    })

    const mod = ac.fetchActiveBytecodeFile().mod

    // Allow bytecode already stored in memory to be passed here to avoid the need for a forced require
    if (bytecode) {
      // If we do a merge, we may swap this variable with the existing merged one in a moment
      let reified = reifyRO(bytecode)

      // If we have existing bytecode, we are going to merge the incoming properties in since this
      // pathway is used by mergeDesign in addition to with instantiateComponent
      let extant
      if (mod.hasLoadedAtLeastOnce() || mod.hasMonkeypatchedContent()) {
        extant = mod.reload()
      } else {
        // This may not work if the file doesn't seem to exist on disk yet, but will only warn
        extant = mod.isolatedForceReload()
      }

      if (extant) {
        Bytecode.mergeBytecode(extant, reified)
        reified = extant
      }

      // Hacky, but in situations where we don't want to have to write to the fs before being
      // able to load the module via require() call, i.e. in the glass or timeline
      file.mod.monkeypatch(reified)

      // Because we have just monkeypatched the module, we don't need to (and shouldn't) reload
      // from disk since at this point disk will contain stale content, which we need to update later
      instanceConfig = lodash.assign({}, instanceConfig, {
        reloadMode: ModuleWrapper.RELOAD_MODES.CACHE
      })
    } else {
      // If no bytecode, that's ok because we're going to load it as part of mount application step
      // The reload mode here should force a reload from whatever currently lives on disk, and we are
      // assuming that said files are already created on disk
    }

    return ac.mountApplication(null, instanceConfig, (err) => {
      if (err) return cb(err)

      return ac.fetchActiveBytecodeFile().performComponentWork((bytecode, mana, done) => {
        // No-op; we only call this to ensure the file is bootstrapped and written to fs
        done()
      }, (err) => {
        if (err) return cb(err)
        return cb(null, ac)
      })
    })
  }

  relpathToSceneName (relpath) {
    return relpath.split(path.sep)[1]
  }

  upsertActiveComponentInstance (relpath) {
    const scenename = this.relpathToSceneName(relpath)

    const uid = ActiveComponent.buildPrimaryKey(this.getFolder(), scenename)

    // This writes to the file system so be careful about making this call
    this.bootstrapSceneFilesSync(scenename)

    const ac = ActiveComponent.upsert({
      uid,
      scenename, // This string is important for fs lookups to work
      project: this
    }, {})

    return ac
  }

  findActiveComponentBySource (relpath) {
    const scenename = ModuleWrapper.getScenenameFromRelpath(relpath)
    return this.findActiveComponentBySceneName(scenename)
  }

  findActiveComponentBySceneName (scenename) {
    const uid = ActiveComponent.buildPrimaryKey(this.getFolder(), scenename)
    return ActiveComponent.findById(uid)
  }

  bootstrapSceneFilesSync (scenename) {
    const rootComponentId = getCodeJs(Template.getHash(scenename, 12))

    // Only write these files if they don't exist yet; don't overwrite the user's own content
    if (!fse.existsSync(path.join(this.getFolder(), `code/${scenename}/code.js`))) {
      fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/code.js`), rootComponentId)
    } else {
      // If the file already exists, we can run any migration steps we might want
      AST.mutateWith(path.join(this.getFolder(), `code/${scenename}/code.js`), (ast) => {
        normalizeBytecodeFile(ast)
      })
    }

    if (!fse.existsSync(path.join(this.getFolder(), `code/${scenename}/dom.js`))) {
      fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/dom.js`), DOM_JS)
    }

    fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/dom-embed.js`), DOM_EMBED_JS)

    if (!fse.existsSync(path.join(this.getFolder(), `code/${scenename}/dom-standalone.js`))) {
      fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/dom-standalone.js`), DOM_STANDALONE_JS)
    }

    if (!fse.existsSync(path.join(this.getFolder(), `code/${scenename}/react-dom.js`))) {
      fse.outputFileSync(path.join(this.getFolder(), `code/${scenename}/react-dom.js`), REACT_DOM_JS)
    }

    return rootComponentId
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
    const entries = fse.readdirSync(this.getCodeFolderAbspath())
    return async.eachSeries(entries, this.setupScene.bind(this), cb)
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

Project.setup = (folder, alias, websocket, platform = {}, userconfig = {}, fileOptions = {}, envoyOptions = {}, cb) => {
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

Project.getProjectHaikuConfig = (folder) => {
  return require(dir(folder, HAIKU_CONFIG_FILE))
}

Project.getProjectNameVariations = (folder) => {
  const projectHaikuConfig = Project.getProjectHaikuConfig(folder)
  const projectNameSafe = Project.getSafeProjectName(folder, projectHaikuConfig.name)
  const projectNameSafeShort = projectNameSafe.slice(0, 20)
  const projectNameLowerCase = projectNameSafe.toLowerCase()
  const reactProjectName = `React_${projectNameSafe}`
  const primaryAssetPath = `designs/${projectNameSafeShort}.sketch`
  return {
    projectNameSafe,
    projectNameSafeShort,
    projectNameLowerCase,
    reactProjectName,
    primaryAssetPath
  }
}

Project.getSafeProjectName = (maybeProjectPath, maybeProjectName) => {
  if (maybeProjectName) return maybeProjectName.replace(WHITESPACE_REGEX, UNDERSCORE)
  if (maybeProjectPath) return pascalcase(maybeProjectPath.split(path.sep).join(UNDERSCORE))
  throw new Error('Unable to infer a project name!')
}

// Sorry, hacky. We route some methods to this object dynamically, and in order
// to detect which should receive the metadata parameter, we use this
Project.PUBLIC_METHODS = {
  setCurrentActiveComponent: true,
  closeNamedActiveComponent: true,
  renameComponent: true
}

function dir () {
  var args = []
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]
  var location = path.join.apply(path, args)
  return location
}

// Down here to avoid Node circular dependency stub objects. #FIXME
const ActiveComponent = require('./ActiveComponent')
const Asset = require('./Asset')
const AST = require('./AST')
const Bytecode = require('./Bytecode')
const Design = require('./Design')
const File = require('./File')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')

function getCodeJs (haikuId) {
  return dedent`
    var Haiku = require('@haiku/player')
    module.exports = {
      metadata: {},
      options: {},
      states: {},
      eventHandlers: {},
      timelines: {
        Default: {}
      },
      template: {
        elementName: 'div',
        attributes: {
          'haiku-id': '${haikuId}',
          'haiku-title': 'HaikuComponent'
        },
        children: []
      }
    }
  `.trim()
}

const DOM_JS = dedent`
  var HaikuDOMAdapter = require('@haiku/player/dom')
  module.exports = HaikuDOMAdapter(require('./code'))
`.trim()

const DOM_EMBED_JS = dedent`
  var code = require('./code')
  var adapter = window.HaikuPlayer && window.HaikuPlayer['${ModuleWrapper.PLAYER_VERSION}']
  if (adapter) {
    module.exports = adapter(code)
  } else  {
    function safety () {
      console.error(
        '[haiku player] player version ${ModuleWrapper.PLAYER_VERSION} seems to be missing. ' +
        'index.embed.js expects it at window.HaikuPlayer["${ModuleWrapper.PLAYER_VERSION}"], but we cannot find it. ' +
        'you may need to add a <script src="path/to/HaikuPlayer.js"></script> to fix this.'
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
  var React = require('react') // Installed as a peer dependency of '@haiku/player'
  var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
  var HaikuReactAdapter = require('@haiku/player/dom/react')
  var HaikuReactComponent = HaikuReactAdapter(require('./dom'))
  if (HaikuReactComponent.default) HaikuReactComponent = HaikuReactComponent.default
  module.exports = HaikuReactComponent
`.trim()
