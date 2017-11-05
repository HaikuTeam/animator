const path = require('path')
const lodash = require('lodash')
const raf = require('raf')
const WebSocket = require('ws')
const pretty = require('pretty')
const async = require('async')
const EnvoyClient = require('haiku-sdk-creator/lib/envoy/client').default
const EnvoyLogger = require('haiku-sdk-creator/lib/envoy/logger').default
const expressionToRO = require('@haiku/player/lib/reflection/expressionToRO').default
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const BaseModel = require('./BaseModel')
const Element = require('./Element')
const File = require('./File')
const Keyframe = require('./Keyframe')
const Row = require('./Row')
const Timeline = require('./Timeline')
const log = require('./helpers/log')
const getDefinedKeys = require('./helpers/getDefinedKeys')
const getHaikuKnownImportMatch = require('./helpers/getHaikuKnownImportMatch')
const overrideModulesLoaded = require('./../utils/overrideModulesLoaded')
const { GLASS_CHANNEL } = require('haiku-sdk-creator/lib/glass')

const WEBSOCKET_BATCH_INTERVAL = 250
const KEYFRAME_MOVE_THROTTLE_TIME = 250

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const DEFAULT_SCENE_NAME = 'main' // e.g. code/main/*
const DEFAULT_INTERACTION_MODE = {
  type: 'edit' // I.e., the player shouldn't respond to events, etc. (live/edit)
}

/**
 * @class ActiveComponent
 * @description Encapsulates and consolidates code to edit a live in-stage component.
 * @param options {Object} Object of configurable options
 * @param options.alias {String} Name of instance used for routing, e.g. 'timeline'
 * @param options.folder {String} Absolute path to project folder being edited
 * @param options.userconfig {String} Configuration defined in project's haiku.js
 * @param options.websocket {Object} WebSocket client object, usually passed in from React
 * @param options.platform {Object} Object representing render platform, e.g. window
 * @param options.file {Object} File or options object to override File model options
 */
class ActiveComponent extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    // Super hack, but it turns out we need to have this in a LOT of places in order for routing to work
    // and not end up with infinite loops of events emitted, captured, and emitted again. Beware!
    this.metadata = { from: this.alias }
    this._scenename = DEFAULT_SCENE_NAME

    this.instance = null // ::HaikuComponent
    this.mount = null // Optional storage for a mount DOM element which the player needs to run

    if (!this.platform.haiku) this.platform.haiku = {}
    if (!this.platform.haiku.registry) this.platform.haiku.registry = {}
    this.platform.haiku.registry[path.join(this.folder, this.getSceneCodePath())] = this

    // Used to control how we render in an editing environment, e.g. preview mode
    this._interactionMode = DEFAULT_INTERACTION_MODE

    File.upsert(lodash.assign({}, {
      uid: path.join(this.folder, this.getSceneCodePath()),
      relpath: this.getSceneCodePath(),
      folder: this.folder,
      type: File.TYPES.code,
      dtModified: Date.now(),
      contents: null,
      previous: null,
      doShallowWorkOnly: true, // By default, don't do fs, ast, or code updates (overridden in MasterProcess)
      skipDiffLogging: true, // By default don't diff log (overridden in MasterProcess)
      hostInstance: {} // Assigned later; used for dynamic computation of values during live editing
    }, this.file))

    Element.on('element:copy', (element) => {
      this.emit('element:copy', element)
    })

    Element.on('update', (element, what, metadata) => {
      if (what === 'element-selected') {
        this.handleElementSelected(element.uid, metadata)
      } else if (what === 'element-unselected') {
        this.handleElementUnselected(element.uid, metadata)
      }
      this.emit('update', what, element, metadata)
    })

    Row.on('update', (row, what) => {
      this.emit('update', what, row, this.metadata)
    })

    Keyframe.on('update', (keyframe, what) => {
      this.emit('update', what, keyframe, this.metadata)
    })

    // HACK: Master doesn't provide this object; FIXME
    if (this.websocket && this.websocket.on) {
      this.websocket.on('method', (method, params, cb) => {
        log.info('[active component] method received', method, params)
        return this.callMethod(method, params, cb)
      })
    }

    // Batched collections of methods to send through the websocket
    this._websocketActions = []

    // No-op callback for arbitrary websocket actions
    this._receiveWebsocketResponse = () => {}

    setInterval(() => {
      const actions = this._websocketActions.splice(0)

      if (actions.length < 1) {
        return void (0)
      }

      actions.forEach(({ method, params }) => {
        this.websocket.action(method, params, this._receiveWebsocketResponse)
      })
    }, WEBSOCKET_BATCH_INTERVAL)

    let wsc = (
      this.WebSocket ||
      ((typeof window !== 'undefined') && window.WebSocket) ||
      WebSocket
    )

    this._envoyClient = new EnvoyClient(lodash.assign({
      WebSocket: wsc,
      logger: new EnvoyLogger('warn', console)
    }, this.envoy))

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

    this._stageTransform = {
      zoom: 1,
      pan: { x: 0, y: 0 }
    }

    this._propertyGroupBatches = {}
    this.debouncedSendPropertyGroupUpdates = lodash.debounce(() => {
      const groupBatches = this._propertyGroupBatches
      this._propertyGroupBatches = {}
      lodash.each(groupBatches, ({ componentId, timelineName, timelineTime, groupValue }) => {
        this.websocket.send({ type: 'action', method: 'applyPropertyGroupValue', params: [this.folder, [componentId], timelineName, timelineTime, groupValue] })
      })
    }, 100, { trailing: true })

    // Key/value pairs of keyframes we are going to move on a batch-by-batch basis
    this._keyframeMoves = {}

    // Debounced version of the keyframe move action handler
    this.debouncedKeyframeMoveAction = lodash.throttle(this.keyframeMoveAction.bind(this), KEYFRAME_MOVE_THROTTLE_TIME)
  }

  getCurrentFolder () {
    return this.folder
  }

  findElementByComponentId (componentId) {
    return Element.findByComponentId(componentId)
  }

  queryElements (criteria) {
    if (!criteria) criteria = {}
    criteria.component = this // Only query elements that belong to us
    return Element.where(criteria)
  }

  findRowByComponentId (componentId) {
    return Row.findByComponentId(componentId)
  }

  findPropertyRowsByParentComponentId (parentComponentId) {
    return Row.findPropertyRowsByParentComponentId(parentComponentId)
  }

  getEnvoyChannel () {
    return this._envoyTimelineChannel
  }

  getEnvoyClient () {
    return this._envoyClient
  }

  getCurrentTimelineName () {
    // TODO: maybe something like this.instance.getPrimaryActiveTimeline?
    return 'Default' // TODO: Support many
  }

  upsertCurrentTimeline () {
    const timeline = Timeline.upsert({
      uid: this.getCurrentTimelineUid(),
      folder: this.folder,
      name: this.getCurrentTimelineName(),
      component: this,
      _isCurrent: true
    })
    return timeline
  }

  getCurrentTimelineTime () {
    // If time control hasn't been established yet, note that the controlled time may be null
    return this.instance.getTimeline(this.getCurrentTimelineName()).getControlledTime() || 0
  }

  getSceneCodePath () {
    return path.join('code', this.getSceneName(), 'code.js')
  }

  getSceneCodeFolder () {
    return this.fetchActiveBytecodeFile().folder
  }

  getSceneDomModulePath () {
    return path.join('code', this.getSceneName(), 'dom.js')
  }

  setSceneName (scenename) {
    this._scenename = scenename
    return this
  }

  getSceneName () {
    return this._scenename
  }

  getAbsoluteLottieFilePath () {
    return path.join(this.getSceneCodeFolder(), 'code', this.getSceneName(), 'lottie.json')
  }

  fetchActiveBytecodeFile () {
    return File.findById(path.join(this.folder, this.getSceneCodePath()))
  }

  clearCaches (options) {
    this.instance.clearCaches(options) // Also clears builder sub-caches
    return this
  }

  clearCachedClusters (timelineName, componentId) {
    this.instance._builder._clearCachedClusters(timelineName, componentId)
    return this
  }

  updateTimelineMaxes (timelineName) {
    let timeline = this.instance._timelineInstances[timelineName]
    if (!timeline) return this
    let descriptor = this.instance._getTimelineDescriptor(timelineName)
    timeline._resetMaxDefinedTimeFromDescriptor(descriptor)
    return this
  }

  // Dynamic interface to make incoming websocket calls easier to route
  callMethod (method, params, cb) {
    try {
      if (!this[method]) return cb(new Error('ActiveComponent: No such method ' + method))
      return this[method].apply(this, params.concat(cb))
    } catch (exception) {
      return cb(exception)
    }
  }

  batchedWebsocketAction (method, params) {
    this._websocketActions.push({ method, params })
    return this
  }

  getPropertyGroupValue (componentId, timelineName, timelineTime, propertyKeys) {
    let groupValue = {}
    let bytecode = this.fetchActiveBytecodeFile().substructs[0].bytecode
    if (!bytecode) return groupValue
    if (!bytecode.timelines) return groupValue
    if (!bytecode.timelines[timelineName]) return groupValue
    if (!bytecode.timelines[timelineName][`haiku:${componentId}`]) return groupValue
    let cluster = bytecode.timelines[timelineName][`haiku:${componentId}`]
    propertyKeys.forEach((propertyKey) => {
      if (!cluster[propertyKey]) return void (0)
      if (!cluster[propertyKey][timelineTime]) return void (0)
      groupValue[propertyKey] = cluster[propertyKey][timelineTime].value
    })
    return groupValue
  }

  getMountHTML () {
    let mount = this.getMount()
    if (!mount) return ''
    return mount.innerHTML
  }

  htmlSnapshot (cb) {
    const html = this.getMountHTML()
    return cb(null, pretty(html))
  }

  forceFlush () {
    if (this.instance) {
      this.instance._markForFullFlush(true)
      // This guard is to allow headless mode, e.g. in Haiku's timeline application
      if (this.instance._context && this.instance._context.tick) {
        this.instance._context.tick()
      }
    }
  }

  setTimelineTimeValue (timelineTime) {
    timelineTime = Math.round(timelineTime)
    // Note that this call reaches in and updates our instance's timeline objects
    Timeline.setCurrentTime(timelineTime)
  }

  setTimelineTime (timelineTime, metadata, cb) {
    this.setTimelineTimeValue(timelineTime)
    this.forceFlush()
    this.emit('time:change', this.getCurrentTimelineName(), this.getCurrentTimelineTime())

    if (metadata.from === this.alias) {
      this.batchedWebsocketAction('setTimelineTime', [this.folder, timelineTime])
    }

    return cb()
  }

  setTimelineName (timelineName, metadata, cb) {
    log.info('[active component] changing active timeline to ' + timelineName)
    Timeline.setCurrent(timelineName)
    this.instance.stopAllTimelines()
    this.instance.startTimeline(timelineName)
    if (metadata.from === this.alias) {
      this.batchedWebsocketAction('setTimelineName', [this.folder, timelineName])
    }
    return cb()
  }

  /**
   * @method handleElementSelected
   * @description Hook to call once an element in-memory has been selected.
   * This is responsible for notifying other views about the action, and emitting an event that others can listen to.
   * The metadata arg is important because it has info about who originated the message, allowing us to avoid infinite loop.
   * Note: This gets called automatically by element.select()
   */
  handleElementSelected (componentId, metadata) {
    // If we originated the selection, notify all other views that it occurred
    if (metadata.from === this.alias) {
      this.batchedWebsocketAction('selectElement', [this.folder, componentId])
    }

    this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'selectElement', componentId)
  }

  /**
   * @method handleElementUnselected
   * @description Hook to call once an element in-memory has been unselected.
   * This is responsible for notifying other views about the action, and emitting an event that others can listen to.
   * The metadata arg is important because it has info about who originated the message, allowing us to avoid infinite loop.
   * Note: This gets called automatically by element.unselect()
   */
  handleElementUnselected (componentId, metadata) {
    // If we originated the selection, notify all other views that it occurred
    if (metadata.from === this.alias) {
      this.batchedWebsocketAction('unselectElement', [this.folder, componentId])
    }

    this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'unselectElement', componentId)
  }

  selectElement (componentId, metadata, cb) {
    const element = Element.findById(componentId)
    if (element) {
      element.select(metadata)
      const row = element.getHeadingRow()
      if (row) {
        row.expand(metadata)
      }
    }
    return cb() // MUST return or the websocket action circuit never completes
  }

  unselectElement (componentId, metadata, cb) {
    const element = Element.findById(componentId)
    if (element) {
      element.unselect(metadata)
    }
    return cb() // MUST return or the websocket action circuit never completes
  }

  gitUndo (options, metadata, cb) {
    return cb()
  }

  gitRedo (options, metadata, cb) {
    return cb()
  }

  setStageTransform (newTransform) {
    this._stageTransform = newTransform
    return this
  }

  getStageTransform () {
    return this._stageTransform
  }

  setInteractionMode (modeOptions, metadata, cb) {
    this._interactionMode = modeOptions || DEFAULT_INTERACTION_MODE

    if (metadata.from === this.alias) {
      this.websocket.send({ type: 'action', method: 'setInteractionMode', params: [this.folder, modeOptions] })
    }

    this.instance.assignConfig({
      options: {
        interactionMode: this._interactionMode
      }
    })

    this.clearCaches()
    this.forceFlush()
    this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'setInteractionMode')

    return cb()
  }

  instantiateComponent (relpath, posdata, metadata, cb) {
    const coords = {
      x: 0,
      y: 0
    }

    if (posdata.x !== undefined) coords.x = posdata.x
    if (posdata.y !== undefined) coords.y = posdata.y
    if (posdata.minimized) coords.minimized = posdata.minimized

    const mount = this.getMount()

    if (mount) {
      let bounds = mount.getBoundingClientRect()
      if (posdata.offsetX) coords.x = posdata.offsetX - bounds.left
      if (posdata.offsetY) coords.y = posdata.offsetY - bounds.top
    }

    coords.x *= 1 / this._stageTransform.zoom
    coords.y *= 1 / this._stageTransform.zoom

    this.fetchActiveBytecodeFile().instantiateComponent(relpath, coords, (err, mana) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.reload({}, null, () => {
        // For instantiation, we unselect everything except the selected element.
        // Note that we do this *after* rehydrate so the element model in question exists.
        let componentId = mana.attributes[HAIKU_ID_ATTRIBUTE]

        Element.unselectAllElements(metadata)

        const element = Element.findById(componentId)
        if (element) {
          element.select(metadata)
          const row = element.getHeadingRow()
          if (row) {
            row.expand(metadata)
          }
        }

        if (metadata.from === this.alias) {
          this.batchedWebsocketAction('instantiateComponent', [this.folder, relpath, posdata])
        }

        this.clearCaches()
        this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'instantiateComponent')

        cb(null, { center: coords }, element)
      })
    })
  }

  deleteComponent (componentIds, metadata, cb) {
    this.fetchActiveBytecodeFile().deleteComponent(componentIds, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.reload({}, null, () => {
        if (metadata.from === this.alias) {
          this.batchedWebsocketAction('deleteComponent', [this.folder, componentIds])
        }

        this.clearCaches()
        this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'deleteComponent')

        return cb()
      })
    })
  }

  mergeDesigns (timelineName, timelineTime, designs, metadata, cb) {
    // Since several designs are merged, and that process occurs async, we can get into a situation
    // where individual fragments are inserted but their parent layouts have not been appropriately
    // populated. To fix this, we wait to do any rendering until this whole process has finished
    this.instance._sleepOn()

    this.fetchActiveBytecodeFile().mergeDesigns(timelineName, timelineTime, designs, (err) => {
      // Now that we've finalized (or errored) the update, we can resume since we have no orphan fragments
      this.instance._sleepOff()

      if (err) {
        log.error(err)
        return cb(err)
      }

      this.reload({}, null, () => {
        if (metadata.from === this.alias) {
          this.batchedWebsocketAction('mergeDesigns', [this.folder, timelineName, timelineTime, designs])
        }

        this.clearCaches()
        this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'mergeDesigns')

        return cb()
      })
    })
  }

  applyPropertyValue (componentIds, timelineName, timelineTime, propertyName, propertyValue, metadata, cb) {
    this.fetchActiveBytecodeFile().applyPropertyValue(componentIds, timelineName, timelineTime, propertyName, propertyValue, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'applyPropertyValue')

      return cb()
    })
  }

  applyPropertyDelta (componentIds, timelineName, timelineTime, propertyName, propertyValue, metadata, cb) {
    this.fetchActiveBytecodeFile().applyPropertyDelta(componentIds, timelineName, timelineTime, propertyName, propertyValue, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'applyPropertyDelta')

      return cb()
    })
  }

  applyPropertyGroupValue (componentIds, timelineName, timelineTime, propertyGroup, metadata, cb) {
    this.fetchActiveBytecodeFile().applyPropertyGroupValue(componentIds, timelineName, timelineTime, propertyGroup, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'applyPropertyGroupValue')

      return cb()
    })
  }

  applyPropertyGroupDelta (componentIds, timelineName, timelineTime, propertyGroup, metadata, cb) {
    this.fetchActiveBytecodeFile().applyPropertyGroupDelta(componentIds, timelineName, timelineTime, propertyGroup, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())

      let definedKeys = getDefinedKeys(propertyGroup)

      this.clearCaches({
        clearStates: false,
        clearEventHandlers: false,
        clearOnlySpecificProperties: {
          componentId: componentIds[0],
          timelineName: timelineName,
          timelineTime: timelineTime,
          propertyKeys: definedKeys
        }
      })

      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'applyPropertyGroupDelta')

      // If we're doing rotation, then we really *really* need to make sure we do a full flush.
      // In production mode, rotation is handled normally, but as we do live editing, we lose
      // 'determinism' on rotation if we update the property piecemeal, because the quaternion
      // calc depends on passing in and mutating the previous output. This is a bug we should
      // try to address better in the future, but for now, this seems an 'all right' way to fix.
      if (_propertyGroupContainsRotation(propertyGroup)) {
        this.forceFlush()
      }

      if (metadata.from === this.alias) {
        componentIds.forEach((componentId) => {
          this.batchPropertyGroupUpdate(componentId, this.getCurrentTimelineName(), this.getCurrentTimelineTime(), getDefinedKeys(propertyGroup))
        })
      }

      return cb()
    })
  }

  getContextSize () {
    return this.fetchActiveBytecodeFile().getContextSize(this.getCurrentTimelineName(), this.getCurrentTimelineTime())
  }

  resizeContext (artboardIds, timelineName, timelineTime, sizeDescriptor, metadata, cb) {
    this.fetchActiveBytecodeFile().resizeContext(artboardIds, timelineName, timelineTime, sizeDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'resizeContext')

      if (metadata.from === this.alias) {
        artboardIds.forEach((artboardId) => {
          this.batchPropertyGroupUpdate(artboardId, timelineName, timelineTime, ['sizeAbsolute.x', 'sizeAbsolute.y'])
        })
      }

      return cb()
    })
  }

  changePlaybackSpeed (framesPerSecond, metadata, cb) {
    return this.fetchActiveBytecodeFile().changePlaybackSpeed(framesPerSecond, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'changePlaybackSpeed')

      return cb()
    })
  }

  changeKeyframeValue (componentIds, timelineName, propertyName, keyframeMs, newValue, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().changeKeyframeValue(componentIds, timelineName, propertyName, keyframeMs, newValue, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'changeKeyframeValue')

      return cb()
    })
  }

  joinKeyframes (componentIds, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().joinKeyframes(componentIds, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'joinKeyframes')

      if (metadata.from === this.alias) {
        const curveForWire = expressionToRO(newCurve) // In the future, curve may be a function
        this.batchedWebsocketAction('joinKeyframes', [this.folder, componentIds, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, curveForWire])
      }

      return cb()
    })
  }

  changeSegmentCurve (componentIds, timelineName, propertyName, keyframeMs, newCurve, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().changeSegmentCurve(componentIds, timelineName, propertyName, keyframeMs, newCurve, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'changeSegmentCurve')

      if (metadata.from === this.alias) {
        const curveForWire = expressionToRO(newCurve) // In the future, curve may be a function
        this.batchedWebsocketAction('changeSegmentCurve', [this.folder, componentIds, timelineName, propertyName, keyframeMs, curveForWire])
      }

      return cb()
    })
  }

  changeSegmentEndpoints (componentIds, timelineName, propertyName, oldMs, newMs, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().changeSegmentEndpoints(componentIds, timelineName, propertyName, oldMs, newMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'changeSegmentEndpoints')
      if (this.alias === metadata.from) {
        this.batchedWebsocketAction('changeSegmentEndpoints', [this.folder, componentIds, timelineName, propertyName, oldMs, newMs])
      }

      return cb()
    })
  }

  createKeyframe (componentIds, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().createKeyframe(componentIds, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'createKeyframe')
      if (this.alias === metadata.from) {
        this.batchedWebsocketAction('createKeyframe', [this.folder, componentIds, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue])
      }

      return cb()
    })
  }

  deleteKeyframe (componentIds, timelineName, propertyName, keyframeMs, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().deleteKeyframe(componentIds, timelineName, propertyName, keyframeMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'deleteKeyframe')
      if (this.alias === metadata.from) {
        this.batchedWebsocketAction('deleteKeyframe', [this.folder, componentIds, timelineName, propertyName, keyframeMs])
      }

      return cb()
    })
  }

  createTimeline (timelineName, timelineDescriptor, metadata, cb) {
    return this.fetchActiveBytecodeFile().createTimeline(timelineName, timelineDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'createTimeline')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('createTimeline', [this.folder, timelineName, timelineDescriptor])
      }

      return cb()
    })
  }

  deleteTimeline (timelineName, metadata, cb) {
    return this.fetchActiveBytecodeFile().deleteTimeline(timelineName, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'deleteTimeline')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('deleteTimeline', [this.folder, timelineName])
      }

      return cb()
    })
  }

  duplicateTimeline (timelineName, metadata, cb) {
    return this.fetchActiveBytecodeFile().duplicateTimeline(timelineName, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'duplicateTimeline')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('duplicateTimeline', [this.folder, timelineName])
      }

      return cb()
    })
  }

  renameTimeline (timelineNameOld, timelineNameNew, metadata, cb) {
    return this.fetchActiveBytecodeFile().renameTimeline(timelineNameOld, timelineNameNew, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'renameTimeline')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('renameTimeline', [this.folder, timelineNameOld, timelineNameNew])
      }

      return cb()
    })
  }

  moveSegmentEndpoints (componentIds, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().moveSegmentEndpoints(componentIds, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'moveSegmentEndpoints')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('moveSegmentEndpoints', [this.folder, componentIds, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo])
      }

      return cb()
    })
  }

  moveKeyframes (componentIds, timelineName, propertyName, keyframeMoves, frameInfo, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().moveKeyframes(componentIds, timelineName, propertyName, keyframeMoves, frameInfo, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'moveKeyframes')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('moveKeyframes', [this.folder, componentIds, timelineName, propertyName, keyframeMoves, frameInfo])
      }

      return cb()
    })
  }

  sliceSegment (componentIds, timelineName, elementName, propertyName, keyframeMs, sliceMs, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().sliceSegment(componentIds, timelineName, elementName, propertyName, keyframeMs, sliceMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'sliceSegment')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('sliceSegment', [this.folder, componentIds, timelineName, elementName, propertyName, keyframeMs, sliceMs])
      }

      return cb()
    })
  }

  splitSelectedKeyframes (metadata) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.removeCurve(metadata))
    return this
  }

  deleteSelectedKeyframes (metadata) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.delete(metadata))
    return this
  }

  joinSelectedKeyframes (curveName, metadata) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.addCurve(curveName, metadata))
    return this
  }

  changeCurveOnSelectedKeyframes (curveName, metadata) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.changeCurve(curveName, metadata))
    return this
  }

  dragStartSelectedKeyframes (dragData) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.dragStart(dragData))
    return this
  }

  dragStopSelectedKeyframes (dragData) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.dragStart(dragData))
    return this
  }

  dragSelectedKeyframes (pxpf, mspf, dragData, metadata) {
    const keyframes = Keyframe.where({ component: this, _selected: true })
    keyframes.forEach((keyframe) => keyframe.drag(pxpf, mspf, dragData, metadata))
    return this
  }

  handleKeyframeMove (keyframe) {
    this._keyframeMoves[keyframe.getPrimaryKey()] = keyframe
    this.debouncedKeyframeMoveAction()
    return this
  }

  keyframeMoveAction () {
    for (const primaryKey in this._keyframeMoves) {
      if (!primaryKey) {
        continue
      }

      if (!this._keyframeMoves[primaryKey]) {
        continue
      }

      const keyframe = this._keyframeMoves[primaryKey]

      const frameInfo = keyframe.timeline.getFrameInfo()
      const propertyName = keyframe.row.getPropertyNameString()
      const timelineName = keyframe.timeline.getName()
      const componentId = keyframe.element.getComponentId()

      // TODO

      delete this._keyframeMoves[primaryKey]
    }
  }

  splitSegment (componentIds, timelineName, elementName, propertyName, keyframeMs, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    return this.fetchActiveBytecodeFile().splitSegment(componentIds, timelineName, elementName, propertyName, keyframeMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'splitSegment')

      if (this.alias === metadata.from) {
        this.batchedWebsocketAction('splitSegment', [this.folder, componentIds, timelineName, elementName, propertyName, keyframeMs])
      }

      return cb()
    })
  }

  zMoveToFront (componentIds, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveToFront(componentIds, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'zMoveToFront')

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('zMoveToFront', [this.folder, componentIds, timelineName, timelineTime])
      }

      return cb()
    })
  }

  zMoveForward (componentIds, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveForward(componentIds, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'zMoveForward')

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('zMoveForward', [this.folder, componentIds, timelineName, timelineTime])
      }

      return cb()
    })
  }

  zMoveBackward (componentIds, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveBackward(componentIds, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'zMoveBackward')

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('zMoveBackward', [this.folder, componentIds, timelineName, timelineTime])
      }

      return cb()
    })
  }

  zMoveToBack (componentIds, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveToBack(componentIds, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'zMoveToBack')

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('zMoveToBack', [this.folder, componentIds, timelineName, timelineTime])
      }

      return cb()
    })
  }

  reorderElement (componentId, componentIdToInsertBefore, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    this.fetchActiveBytecodeFile().reorderElement(componentId, componentIdToInsertBefore, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'reorderElement')

      return cb()
    })
  }

  groupElements (componentIdsToGroup, metadata, cb) {
    componentIdsToGroup.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    this.fetchActiveBytecodeFile().groupElements(componentIdsToGroup, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'groupElements')

      return cb()
    })
  }

  ungroupElements (groupComponentIds, metadata, cb) {
    groupComponentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    this.fetchActiveBytecodeFile().ungroupElements(groupComponentIds, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'ungroupElements')

      return cb()
    })
  }

  hideElements (componentIds, metadata, cb) {
    componentIds.forEach((componentId) => { this.clearCachedClusters(this.getCurrentTimelineName(), componentId) })
    this.fetchActiveBytecodeFile().hideElements(componentIds, metadata, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'hideElements')

      return cb()
    })
  }

  /**
   * @method pasteThing
   * @description Flexibly paste some content into the component. Usually the thing pasted is going to be a
   * component, but this could theoretically handle any kind of 'pasteable' content.
   * @param pasteable {Object} - Content of the thing to paste into the component.
   * @param request {Object} - Optional object containing information about _how_ to paste, e.g. coords
   * @param metadata {Object}
   */
  pasteThing (pasteable, request, metadata, cb) {
    this.fetchActiveBytecodeFile().pasteThing(pasteable, request, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.reload({}, null, () => {
        // QUESTION: Do we need this?:
        // cb(null, { center: coords })
        // Should this have the same logic we use for instantiation? (probably yes)

        this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'pasteThing')

        return cb()
      })
    })
  }

  /**
   * @method deleteThing
   * @description Flexibly delete some content into the component. Usually the thing deleted is going to be a
   * component, but this could theoretically handle any kind of 'deleteable' content.
   * @param deleteable {Object} - Content of the thing to delete into the component.
   * @param metadata {Object}
   */
  deleteThing (deletable, metadata, cb) {
    this.fetchActiveBytecodeFile().deleteThing(deletable, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'deleteThing')
      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('deleteThing', [this.folder, deletable])
      }

      return cb()
    })
  }

  /**
   * @method readAllStateValues
   */
  readAllStateValues (metadata, cb) {
    return this.fetchActiveBytecodeFile().readAllStateValues(cb)
  }

  /**
   * @method upsertStateValue
   */
  upsertStateValue (stateName, stateDescriptor, metadata, cb) {
    return this.fetchActiveBytecodeFile().upsertStateValue(stateName, stateDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'upsertStateValue')

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('upsertStateValue', [this.folder, stateName, stateDescriptor])
      }

      return cb()
    })
  }

  /**
   * @method deleteStateValue
   */
  deleteStateValue (stateName, metadata, cb) {
    return this.fetchActiveBytecodeFile().deleteStateValue(stateName, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.clearCaches()
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'deleteStateValue')

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('deleteStateValue', [this.folder, stateName])
      }

      return cb()
    })
  }

  /**
   * @method upsertEventHandler
   */
  upsertEventHandler (selectorName, eventName, handlerDescriptor, metadata, cb) {
    return this.fetchActiveBytecodeFile().upsertEventHandler(selectorName, eventName, handlerDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'upsertEventHandler')
      this.clearCaches({
        clearPreviouslyRegisteredEventListeners: true
      })
      this.forceFlush()

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('upsertEventHandler', [this.folder, selectorName, eventName, handlerDescriptor])
      }

      return cb()
    })
  }

  /**
   * @method deleteEventHandler
   */
  deleteEventHandler (selectorName, eventName, metadata, cb) {
    return this.fetchActiveBytecodeFile().deleteEventHandler(selectorName, eventName, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.updateTimelineMaxes(this.getCurrentTimelineName())
      this.emit((metadata.from === this.alias) ? 'update' : 'remote-update', 'deleteEventHandler')
      this.clearCaches({
        clearPreviouslyRegisteredEventListeners: true
      })
      this.forceFlush()

      if (metadata.from === this.alias) {
        this.batchedWebsocketAction('deleteEventHandler', [this.folder, selectorName, eventName])
      }

      return cb()
    })
  }

  /**
   * @method readAllEventHandlers
   */
  readAllEventHandlers (metadata, cb) {
    return this.fetchActiveBytecodeFile().readAllEventHandlers(cb)
  }

  setMount (mount) {
    this.mount = mount
    return this
  }

  getMount () {
    return this.mount
  }

  getHotBytecode () {
    return this.instance._bytecode
  }

  getHotTemplate () {
    return this.instance._template
  }

  /** ------------ */
  /** ------------ */
  /** ------------ */

  reload (reloadOptions, instanceConfig, finish) {
    let updatedHaikuComponentFactory

    return async.series([
      (cb) => {
        // Wait until current work finishes before we do the heavy stuff
        return raf(() => cb())
      },

      (cb) => {
        // Stop the clock so we don't continue any animations while this update is happening
        if (this.instance) {
          this.instance._context.clock.stop()
        }
        return cb()
      },

      (cb) => {
        if (reloadOptions.fullReload) {
          const modulePath = path.join(this.folder, this.getSceneDomModulePath())

          // Clear the require cache so we get a full reload based on up-to-date content
          for (const key in require.cache) {
            if (!key.match(/node_modules/)) delete require.cache[key]
          }

          return overrideModulesLoaded((stop) => {
            updatedHaikuComponentFactory = require(modulePath)
            stop() // Tell the node hook to stop interfering since we've got what we need now

            log.info('[active component] module reloaded (' + modulePath + ')')
            return cb()
          }, getHaikuKnownImportMatch)
        } else {
          return cb()
        }
      },

      (cb) => {
        if (reloadOptions.fullReload) {
          return this.fetchActiveBytecodeFile().read(cb)
        } else {
          return cb()
        }
      },

      (cb) => {
        const previousComponentInstance = this.instance

        if (updatedHaikuComponentFactory) {
          // Tell the previous component to stop updating so we don't munge anything on stage
          if (previousComponentInstance) {
            previousComponentInstance._deactivate()
          }

          this.instance = updatedHaikuComponentFactory(this.getMount(), lodash.assign({}, {
            options: {
              contextMenu: 'disabled', // Don't show the right-click context menu since our editing tools use right-click
              overflowX: 'visible',
              overflowY: 'visible',
              mixpanel: false, // Don't track events in mixpanel while the component is being built
              interactionMode: this._interactionMode
            }
          }, instanceConfig))
        }

        // Make sure we get notified of state updates and everything else we care about
        this.instance._doesEmitEventsVerbosely = true

        // Need to notify others any time we change our state so that it can be updated dynamically
        this.instance.on('state:set', (stateName, stateValue) => {
          this.websocket.send({ type: 'broadcast', name: 'state:set', params: [this.folder, stateName, stateValue] })
        })

        if (previousComponentInstance) {
          // We need to copy the in-memory timeline (NOT the data object!) over the new one so we retain
          // the same local time/time control data that had already been set by the user
          for (const timelineName in previousComponentInstance._timelineInstances) {
            this.instance._timelineInstances[timelineName] = previousComponentInstance._timelineInstances[timelineName]
            previousComponentInstance._timelineInstances[timelineName]._setComponent(this.instance)
          }
        }

        // Lock the time to zero since we are inside 'control' mode
        const globalTime = this.instance._context.clock.getExplicitTime()
        const timelines = this.instance._timelineInstances
        for (const timelineName in timelines) {
          const timeline = timelines[timelineName]
          // Whatever the previous time had been, make sure we 're-control' it to that point
          timeline._controlTime(this.getCurrentTimelineTime(), globalTime)
        }

        // HaikuComponent clones so we reattach the pointer here so file updates work
        this.instance._bytecode.template = this.instance._template

        // Update a bunch of pointers necessary for the bytecode file to work propertly
        const bytecodeFile = this.fetchActiveBytecodeFile()
        bytecodeFile.hostInstance = this.instance
        bytecodeFile.substructs[0].bytecode = this.instance._bytecode
        bytecodeFile.substructInitialized = this.fetchActiveBytecodeFile().reinitializeSubstruct(null)

        // Make sure the timeline model is up to date so we can play back correctly
        this.upsertCurrentTimeline()
        this.updateTimelineMaxes(this.getCurrentTimelineName())

        // In case properties were totally removed as a part of this update, we need to do a full re-render
        this.clearCaches()

        // We'll end up with stale attributes in the DOM unless we do this; this calls .tick()
        this.forceFlush()

        return cb()
      },

      (cb) => {
        // Let updates flush before proceeding with the tree rehydration, which needs the DOM
        return raf(() => cb())
      },

      (cb) => {
        this.rehydrate()
        return cb()
      },

      (cb) => {
        // Start the clock again, as we should now be ready to flow updated component.
        this.instance._context.clock.start()
        return cb()
      }
    ], finish)
  }

  /**
   * @method mountApplication
   * @description Given an *optional* DOM element to mount, load the component and boostrap it inside the mount.
   * If no mount is provided (i.e. in non-DOM contexts) this method can also be used if you just want to reload
   * the data for the component instead of actually displaying it. This is used by the Timeline but also nominally
   * by the Glass.
   */
  mountApplication (mount, config) {
    // Allow headless, e.g. in plumbing or timeline
    this.setMount(mount)
    return this.reload({ fullReload: true }, config, (err) => {
      if (err) {
        log.error(err)
        return this.emit('error', err)
      }
      this._isMounted = true
      return this.emit('component:mounted')
    })
  }

  /**
  * @method reloadBytecodeFromDisk
  * @description Reloads bytecode from disk. This may be necessary if we want to munge on a copy of bytecode for our
  * own purposes, e.g. during export to another format.
  */
  reloadBytecodeFromDisk (cb) {
    return this.fetchActiveBytecodeFile().read(cb)
  }

  /**
   * @method moduleReplace
   * @description The more severe cousin of mountApplication which also displays a message on the view
   * indicating that reloading is occurring. This is really only used in the Glass, where code reload
   * events can interfere with what the user is doing and a UI lock of some kind is required.
   */
  moduleReplace (cb) {
    log.toast('Reloading component')
    this._isReloadingCode = true
    let mount = this.getMount()
    if (mount) mount.style.opacity = '0.2'
    return this.reload({ fullReload: true }, null, (err) => {
      if (err) {
        log.error(err)
        return this.emit('error', err)
      }
      if (mount) mount.style.opacity = '1.0'
      this._isReloadingCode = false
      return cb()
    })
  }

  rehydrate () {
    // If you want to call 'rehydrateFromTree' from the top, remember to reset this to 0.
    this._numrows = 0
    // We use this to help purge elements have been removed since the previous run.
    this._timestamp = Date.now()
    this.rehydrateFromTree(this.getHotTemplate(), null, null, null, 0, 0, 0, '0')
    this.purgeStaleEntities(this._timestamp)
  }

  purgeStaleEntities (timestamp) {
    Row.filter((row) => row.timestamp < timestamp).forEach((row) => row.destroy())
    Keyframe.filter((kf) => kf.timestamp < timestamp).forEach((kf) => kf.destroy())
    Element.filter((el) => el.timestamp < timestamp).forEach((el) => el.destroy())
    return this
  }

  rehydrateFromTree (virtualNode, virtualParent, parentElement, parentElementRow, rowIndex, rowDepth, indexInParent, graphAddress) {
    const element = this.upsertElementFromVirtualElement(virtualNode, virtualParent, indexInParent, graphAddress)

    const elementHeadingRow = Row.upsert({
      timestamp: this._timestamp,
      uid: `${element.getComponentId()}-heading`,
      element: element,
      parent: parentElementRow,
      index: rowIndex++,
      depth: rowDepth,
      seq: indexInParent,
      subseq: null,
      place: this._numrows++,
      children: [],
      component: this,
      timeline: this.getCurrentTimeline(),
      property: null,
      cluster: null
    })

    // Expand the top row by default, only if this is the first run
    if (elementHeadingRow.place === 0) {
      if (!elementHeadingRow._wasInitiallyExpanded) {
        elementHeadingRow._isExpanded = true
        elementHeadingRow._wasInitiallyExpanded = true
      }
    }

    if (parentElementRow) {
      parentElementRow.addChild(elementHeadingRow)
    }

    const addressableProperties = element.getAddressableProperties(false)

    const clustersUpserted = {}

    for (let addressableName in addressableProperties) {
      let propertyGroupDescriptor = addressableProperties[addressableName]

      if (!propertyGroupDescriptor.cluster) {
        // Properties represented as a single row, like 'opacity'
        const propertyRow = Row.upsert({
          timestamp: this._timestamp,
          uid: `${element.getComponentId()}-property-${addressableName}`,
          element: element,
          parent: elementHeadingRow,
          index: rowIndex++,
          depth: rowDepth,
          seq: indexInParent,
          subseq: null,
          place: this._numrows++,
          children: [],
          component: this,
          timeline: this.getCurrentTimeline(),
          property: propertyGroupDescriptor,
          cluster: null
        })

        this.rehydrateKeyframes(propertyRow)
        elementHeadingRow.addChild(propertyRow)
      } else {
        // Properties that are 'clustered', like rotation.x,y,z
        const clusterId = `${element.getComponentId()}-cluster-${propertyGroupDescriptor.cluster.prefix}`

        let clusterRow

        // This check is just to make sure we get a correct number for the row index
        if (!clustersUpserted[clusterId]) {
          clusterRow = Row.upsert({
            timestamp: this._timestamp,
            uid: clusterId,
            element: element,
            parent: elementHeadingRow,
            index: rowIndex++,
            depth: rowDepth,
            seq: indexInParent,
            subseq: null,
            place: this._numrows++,
            children: [],
            component: this,
            timeline: this.getCurrentTimeline(),
            property: null, // This null is used to determine isClusterHeading
            cluster: propertyGroupDescriptor.cluster
          })

          clustersUpserted[clusterId] = {}
        } else {
          clusterRow = Row.findById(clusterId)
        }

        elementHeadingRow.addChild(clusterRow)

        const clusterMember = Row.upsert({
          timestamp: this._timestamp,
          uid: `${element.getComponentId()}-cluster-${propertyGroupDescriptor.cluster.prefix}-property-${addressableName}`,
          element: element,
          parent: clusterRow,
          index: rowIndex++,
          depth: rowDepth,
          seq: indexInParent,
          subseq: Object.keys(clustersUpserted[clusterId]).length,
          place: this._numrows++,
          children: [],
          component: this,
          timeline: this.getCurrentTimeline(),
          property: propertyGroupDescriptor,
          cluster: propertyGroupDescriptor.cluster
        })

        clustersUpserted[clusterId][propertyGroupDescriptor.name] = true

        this.rehydrateKeyframes(clusterMember)
        clusterRow.addChild(clusterMember)
      }
    }

    if (virtualNode.children) {
      for (let i = 0; i < virtualNode.children.length; i++) {
        let virtualChild = virtualNode.children[i]
        // Recursive call descends through and rehydrates the tree in depth-first order
        this.rehydrateFromTree(virtualChild, virtualNode, element, elementHeadingRow, 0, rowDepth + 1, i, `${graphAddress}.${i}`)
      }
    }
  }

  rehydrateKeyframes (row) {
    const valueGroup = TimelineProperty.getValueGroup(
      row.element.getComponentId(),
      this.getCurrentTimelineName(),
      row.getPropertyNameString(),
      this.getReifiedBytecode()
    )

    if (!valueGroup) {
      return []
    }

    const keyframesList = Object.keys(valueGroup)
      .map((keyframeKey) => parseInt(keyframeKey, 10))
      .sort((a, b) => a - b)

    if (keyframesList.length < 1) {
      return []
    }

    for (let i = 0; i < keyframesList.length; i++) {
      let mscurr = keyframesList[i]

      if (isNaN(mscurr)) {
        continue
      }

      Keyframe.upsert({
        timestamp: this._timestamp,
        uid: Keyframe.getInferredUid(row, i),
        ms: mscurr,
        index: i,
        value: valueGroup[mscurr].value,
        curve: valueGroup[mscurr].curve,
        row: row,
        element: row.element,
        timeline: row.timeline,
        component: row.component
      })
    }
  }

  upsertElementFromVirtualElement (node, parent, indexInParent, graphAddress) {
    let uid
    let $el

    const parentId = parent && parent.attributes && parent.attributes[HAIKU_ID_ATTRIBUTE]
    parent = parentId && Element.findById(parentId)

    if (typeof node === 'string') {
      uid = `${parentId}/text:${indexInParent}`
      $el = null
    } else {
      uid = node.attributes[HAIKU_ID_ATTRIBUTE] || Math.random()
      $el = Element.findDomNode(uid, this.platform)
    }

    const element = Element.upsert({
      timestamp: this._timestamp,
      uid: uid,
      node: node,
      index: indexInParent,
      address: graphAddress,
      component: this,
      $el: $el,
      _isSelected: false,
      _isHovered: false,
      isTargetedForRotate: false,
      isTargetedForScale: false,
      parent: parent
    }, this.metadata)

    if (parent) {
      if (!parent.children) parent.children = []
      let found = false
      parent.children.forEach((child) => {
        if (child === element) found = true
      })
      if (!found) {
        parent.children.push(element)
      }
    }

    return element
  }

  getReifiedBytecode () {
    return this.fetchActiveBytecodeFile().getReifiedBytecode()
  }

  getSerializedBytecode () {
    return this.fetchActiveBytecodeFile().getSerializedBytecode()
  }

  getReifiedTemplate () {
    const reifiedBytecode = this.getReifiedBytecode()
    return reifiedBytecode && reifiedBytecode.template
  }

  batchPropertyGroupUpdate (componentId, timelineName, timelineTime, propertyKeys) {
    const batchKey = `${componentId}-${timelineName}-${timelineTime}`
    const groupValue = this.getPropertyGroupValue(componentId, timelineName, timelineTime, propertyKeys)
    if (!this._propertyGroupBatches[batchKey]) this._propertyGroupBatches[batchKey] = { componentId, timelineName, timelineTime, groupValue }
    else lodash.assign(this._propertyGroupBatches[batchKey].groupValue, groupValue)
    this.debouncedSendPropertyGroupUpdates()
    this.clearCachedClusters(timelineName, componentId)
  }

  getCurrentTimelineUid () {
    return this.uid + '::' + this.getCurrentTimelineName()
  }

  getCurrentTimeline () {
    return Timeline.findById(this.getCurrentTimelineUid())
  }

  getCurrentRows (criteria) {
    return Row.where(criteria)
  }

  getDisplayableRows () {
    return Row.getDisplayables()
  }

  getCurrentKeyframes (criteria) {
    return Keyframe.where(criteria)
  }

  deselectAndDeactivateAllKeyframes (metadata) {
    return Keyframe.deselectAndDeactivateAllKeyframes(metadata || this.metadata)
  }

  getFocusedRow () {
    return Row.getFocusedRow()
  }

  getSelectedRow () {
    return Row.getSelectedRow()
  }
}

ActiveComponent.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    alias: true,
    folder: true,
    userconfig: true,
    websocket: true, // Expected to be initialized already
    platform: true // E.g. window or global
  }
}

BaseModel.extend(ActiveComponent)

function _propertyGroupContainsRotation (propertyGroup) {
  return (
    propertyGroup['rotation.x'] ||
    propertyGroup['rotation.y'] ||
    propertyGroup['rotation.z']
  )
}

module.exports = ActiveComponent
