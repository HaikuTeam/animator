const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const xmlToMana = require('@haiku/player/lib/helpers/xmlToMana').default
const convertManaLayout = require('@haiku/player/lib/layout/convertManaLayout').default
const objectToRO = require('@haiku/player/lib/reflection/objectToRO').default
const upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default
const ensureManaChildrenArray = require('haiku-bytecode/src/ensureManaChildrenArray')
const mergeTimelineStructure = require('haiku-bytecode/src/mergeTimelineStructure')
const cleanMana = require('haiku-bytecode/src/cleanMana')
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const BytecodeActions = require('haiku-bytecode/src/actions')
const getPropertyValue = require('haiku-bytecode/src/getPropertyValue')
const upsertPropertyValue = require('haiku-bytecode/src/upsertPropertyValue')
const getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
const writeMetadata = require('haiku-bytecode/src/writeMetadata')
const BaseModel = require('./BaseModel')
const Logger = require('./../utils/Logger')
const walkFiles = require('./../utils/walkFiles')
const getSvgOptimizer = require('./../svg/getSvgOptimizer')

// This file also depends on '@haiku/player/lib/HaikuComponent'
// in the sense that one of those instances is assigned as .hostInstance here.
// ^^ Leave this message in this file so we can grep for it if necessary

const logger = new Logger()
const differ = require('./../utils/LoggerInstanceDiffs')

const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0
const DEFAULT_ROOT_NODE_NAME = 'div'
const FALLBACK_TEMPLATE = '<' + DEFAULT_ROOT_NODE_NAME + '></' + DEFAULT_ROOT_NODE_NAME + '>'
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const DEFAULT_CONTEXT_SIZE = { width: 550, height: 400 }

const FILE_TYPES = {
  design: 'design',
  code: 'code'
}

/**
 * @class File
 * @description
 *.  Abstraction of Files that are contained in a project.
 *.  WARNING: Contains a lot of legacy code which extends its responsibilities
 *.  quite a bit further than what you would expect its purview to be.
 *.  Worth a refactor. Many methods here belong in ActiveComponent or elsewhere.
 */
class File extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this.mod = ModuleWrapper.upsert({
      uid: this.getAbspath(),
      file: this
    })

    this.ast = AST.upsert({
      uid: this.getAbspath(),
      file: this
    })

    this._elementsCache = {}
  }

  updateInMemoryHotModuleOnly (bytecode, cb) {
    this.dtModified = Date.now()
    this.mod.monkeypatch(bytecode)
    this.emit('in-memory-content-state-updated')
    return cb()
  }

  updateInMemoryContentState (bytecode, cb) {
    this.dtModified = Date.now()
    this.mod.monkeypatch(bytecode)
    const contents = this.ast.updateWithBytecodeAndReturnCode(bytecode)
    const previous = this.contents
    this.previous = previous
    this.contents = contents
    this.maybeLogDiff(previous, contents)
    this.emit('in-memory-content-state-updated')
    return cb()
  }

  maybeLogDiff (previous, contents) {
    if (!this.options.skipDiffLogging) {
      if (this.isCode()) {
        // Diffs of 'snapshots' or bundled code are usually fairly useless to show and too long anyway.
        // These files are written as part of the save process
        if (!_looksLikeMassiveFile(this.relpath)) {
          differ.difflog(previous, contents, { relpath: this.relpath })
        }
      }
    }
  }

  write (cb) {
    this.dtLastWriteStart = Date.now()
    logger.info(`[file] writing ${this.relpath} to disk`)
    return File.write(this.folder, this.relpath, this.contents, (err) => {
      this.dtLastWriteEnd = Date.now()
      if (err) {
        logger.info(`[file] error writing ${this.relpath} to disk`, err)
        return cb(err)
      }
      return cb()
    })
  }

  getAbspath () {
    return path.join(this.folder, this.relpath)
  }

  isCode () {
    return this.type === FILE_TYPES.code
  }

  isDesign () {
    return this.type === FILE_TYPES.design
  }

  performComponentWork (worker, finish) {
    try {
      // We shouldn't need to do these 'ensure X Y Z' steps more than once
      this.reinitializeBytecode(null)

      const bytecode = this.getReifiedBytecode()

      return worker(bytecode, bytecode.template, (err, result) => {
        if (err) return finish(err)
        try {
          Bytecode.cleanBytecode(bytecode)
          Template.cleanTemplate(bytecode.template)

          return this.commitContentState(bytecode, (err) => {
            if (err) return finish(err)

            // TODO types; some callers expect to get the result of the worker
            return finish(null, result)
          })
        } catch (exception) {
          return finish(exception)
        }
      })
    } catch (exception) {
      logger.error('[file] ' + exception)
      return finish(exception)
    }
  }

  /**
   * @method reinitializeBytecode
   * @description Make sure the in-memory bytecode object has all of the correct settings, attributes, and structure.
   * This ought to get called if the bytecode has just been ingested from somewhere and you need to make sure it is right.
   */
  reinitializeBytecode (config) {
    if (!config) config = {}

    let bytecode = this.mod.fetchInMemoryExport()

    // If no bytecode is present at all, we'll create the object here, and monkeypatch it
    // as the export so downstream actions get access to the same object 'pointer'
    if (!bytecode) {
      bytecode = {}
      this.mod.monkeypatch(bytecode)
    }

    let mana
    if (typeof bytecode.template === 'string') {
      mana = xmlToMana(bytecode.template || FALLBACK_TEMPLATE)
    } else if (typeof bytecode.template === 'object') {
      mana = bytecode.template || xmlToMana(FALLBACK_TEMPLATE)
    } else {
      // If nothing had been set, what is the risk of just setting it here?
      mana = { elementName: 'div', attributes: {}, children: [] }
    }

    bytecode.template = mana

    this.normalizeAndUpgradeBytecode(bytecode)

    // Make sure there is at least a baseline metadata objet
    writeMetadata(bytecode, {
      uuid: 'HAIKU_SHARE_UUID', // This magic string is detected+replaced by our cloud services to produce a full share link
      type: config.type,
      name: config.name,
      relpath: this.relpath
    })

    // The same content when instantiated in a different host folder will result in a different absolute path
    // (here called "context"), which in turn will result in the id generation algorithm, SHA256, generating
    // different base identifiers across different projects despite the same actions.
    const context = path.join(path.normalize(this.folder), path.normalize(this.relpath))

    // Make sure all elements in the tree have a haiku-id assigned
    Template.ensureTitleAndUidifyTree(
      bytecode.template,
      path.normalize(this.relpath),
      context,
      '0',
      { title: config.name } // If present, this will force a change to the new title
    )

    // Move inline attributes at the top level into the control object
    const timeline = Template.hoistTreeAttributes(
      bytecode.template,
      DEFAULT_TIMELINE_NAME,
      DEFAULT_TIMELINE_TIME
    )

    let contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]

    this.upsertDefaultProperties(contextHaikuId, {
      'style.WebkitTapHighlightColor': 'rgba(0,0,0,0)',
      'style.position': 'relative',
      'style.overflowX': 'hidden',
      'style.overflowY': 'hidden',
      'sizeAbsolute.x': DEFAULT_CONTEXT_SIZE.width,
      'sizeAbsolute.y': DEFAULT_CONTEXT_SIZE.height,
      'sizeMode.x': 1,
      'sizeMode.y': 1,
      'sizeMode.z': 1
    }, 'assign')

    // Inject the hoisted attributes into the actual timelines object
    mergeTimelineStructure(bytecode, timeline, 'defaults')

    return bytecode
  }

  normalizeAndUpgradeBytecode (bytecode, options) {
    upgradeBytecodeInPlace(bytecode)

    // Since we may be appending a child, make sure the children is an array
    if (!Array.isArray(bytecode.template.children)) {
      ensureManaChildrenArray(bytecode.template)
    }

    // We're about to mutate this, so may as well make sure it's present
    if (!bytecode.template.attributes) bytecode.template.attributes = {}

    Template.ensureTopLevelDisplayAttributes(bytecode.template)

    // Hack...but helps avoid issues downstream if the template part of the bytecode was empty
    if (!bytecode.template.elementName) bytecode.template.elementName = 'div'

    // Ensure the top-level context gets the appropriate display attributes
    Template.ensureRootDisplayAttributes(bytecode.template)

    // Make sure there is an options object (can be used for playback configuration)
    if (!bytecode.options) {
      bytecode.options = {}
    }

    // Make sure there is always a timelines object
    if (!bytecode.timelines) {
      bytecode.timelines = {}
    }

    // And make sure there is always a default timelines object
    if (!bytecode.timelines[DEFAULT_TIMELINE_NAME]) {
      bytecode.timelines[DEFAULT_TIMELINE_NAME] = {}
    }

    convertManaLayout(bytecode.template)
  }

  writeMetadata (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      writeMetadata(bytecode, metadata)
      done()
    }, cb)
  }

  commitContentState (bytecode, cb) {
    // If we aren't writing to disk, we don't need to update the AST (heavy)
    if (!this.options.doWriteToDisk) {
      return this.updateInMemoryHotModuleOnly(bytecode, cb)
    }

    // This updates the in-memory module pointer and the AST
    return this.updateInMemoryContentState(bytecode, (err) => {
      if (err) return cb(err)

      // Allow the user calling this upstream to specify we want to hit the fs or not
      if (this.options.doWriteToDisk) {
        return this.write(cb)
      }

      // If no disk write desired, it's fine to just return
      return cb()
    })
  }

  performComponentTimelinesWork (worker, finish) {
    return this.performComponentWork((bytecode, mana, done) => {
      if (!bytecode) return done(new Error('Missing bytecode'))
      if (!bytecode.timelines) return done(new Error('Missing timelines'))
      return worker(bytecode, mana, bytecode.timelines, done)
    }, finish)
  }

  /** ------------------ */
  /** ------------------ */
  /** ------------------ */

  setHostInstance (hostInstance) {
    this.hostInstance = hostInstance
  }

  getHostInstance () {
    return this.hostInstance
  }

  getHostStates () {
    return this.getHostInstance().getStates()
  }

  applyPropertyGroupValue (componentId, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      let elementNode = this.findElementByComponentId(mana, componentId)
      if (elementNode) TimelineProperty.addPropertyGroup(timelines, timelineName, componentId, Element.safeElementName(elementNode), propertyGroup, timelineTime)
      else (problem = `Cannot locate element with id ${componentId}`)
      if (problem) {
        return done(new Error(problem))
      }
      return done()
    }, cb)
  }

  applyPropertyGroupDelta (componentId, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let problem = false
      let elementNode = this.findElementByComponentId(mana, componentId)
      if (elementNode) {
        TimelineProperty.addPropertyGroupDelta(timelines, timelineName, componentId, Element.safeElementName(elementNode), propertyGroup, timelineTime, this.getHostInstance(), this.getHostStates())
      } else {
        problem = `Cannot locate element with id ${componentId}`
      }
      if (problem) return done(new Error(problem))
      return done()
    }, cb)
  }

  resizeContext (artboardId, timelineName, timelineTime, sizeDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      let contextHaikuId = mana.attributes[HAIKU_ID_ATTRIBUTE]
      this.upsertProperties(bytecode, contextHaikuId, timelineName, timelineTime, {
        'sizeAbsolute.x': sizeDescriptor.width,
        'sizeAbsolute.y': sizeDescriptor.height,
        'sizeMode.x': 1,
        'sizeMode.y': 1,
        'sizeMode.z': 1
      }, 'merge')
      done()
    }, cb)
  }

  changeKeyframeValue (componentId, timelineName, propertyName, keyframeMs, newValue, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changeKeyframeValue(bytecode, componentId, timelineName, propertyName, keyframeMs, newValue)
      done()
    }, cb)
  }

  changePlaybackSpeed (framesPerSecond, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changePlaybackSpeed(bytecode, framesPerSecond)
      done()
    }, cb)
  }

  changeSegmentCurve (componentId, timelineName, propertyName, keyframeMs, newCurve, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changeSegmentCurve(bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve)
      done()
    }, cb)
  }

  changeSegmentEndpoints (componentId, timelineName, propertyName, oldMs, newMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changeSegmentEndpoints(bytecode, componentId, timelineName, propertyName, oldMs, newMs)
      done()
    }, cb)
  }

  createKeyframe (componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.createKeyframe(bytecode, componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, this.getHostInstance(), this.getHostStates())
      done()
    }, cb)
  }

  createTimeline (timelineName, timelineDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.createTimeline(bytecode, timelineName, timelineDescriptor)
      done()
    }, cb)
  }

  deleteKeyframe (componentId, timelineName, propertyName, keyframeMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteKeyframe(bytecode, componentId, timelineName, propertyName, keyframeMs)
      done()
    }, cb)
  }

  deleteTimeline (timelineName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  duplicateTimeline (timelineName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.duplicateTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  joinKeyframes (componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.joinKeyframes(bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve)
      done()
    }, cb)
  }

  moveSegmentEndpoints (componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.moveSegmentEndpoints(bytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo)
      done()
    }, cb)
  }

  moveKeyframes (componentId, timelineName, propertyName, keyframeMoves, frameInfo, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.moveKeyframes(bytecode, componentId, timelineName, propertyName, keyframeMoves, frameInfo)
      done()
    }, cb)
  }

  renameTimeline (timelineNameOld, timelineNameNew, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.renameTimeline(bytecode, timelineNameOld, timelineNameNew)
      done()
    }, cb)
  }

  sliceSegment (componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.sliceSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs)
      done()
    }, cb)
  }

  splitSegment (componentId, timelineName, elementName, propertyName, keyframeMs, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.splitSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs)
      done()
    }, cb)
  }

  _normalizeStackingAndReturnInfo (bytecode, mana, timelineName, timelineTime) {
    let stackingInfo = getStackingInfo(bytecode, mana, timelineName, timelineTime)
    stackingInfo.forEach(({ zIndex, haikuId }) => {
      this.upsertProperties(bytecode, haikuId, timelineName, timelineTime, { 'style.zIndex': zIndex }, 'merge')
    })
    return stackingInfo
  }

  zMoveToFront (componentId, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let stackingInfo = this._normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      let highestZ = stackingInfo[stackingInfo.length - 1].zIndex
      let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      if (myZ < highestZ) {
        this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': highestZ + 1 }, 'merge')
      }
      done()
    }, cb)
  }

  zMoveForward (componentId, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': myZ + 1 })
      done()
    }, cb)
  }

  zMoveBackward (componentId, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': myZ - 1 })
      done()
    }, cb)
  }

  zMoveToBack (componentId, timelineName, timelineTime, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let stackingInfo = this._normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      let lowestZ = stackingInfo[0].zIndex
      let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      if (myZ <= lowestZ) return void (0)
      // Shift all the z indices upward to make room for this one
      if (lowestZ < 2) {
        let zOffset = 2 - lowestZ
        stackingInfo.forEach(({ haikuId, zIndex }) => {
          let theirHaikuId = haikuId
          let theirZ = zIndex
          let finalZ = theirZ + zOffset
          this.upsertProperties(bytecode, theirHaikuId, timelineName, timelineTime, { 'style.zIndex': finalZ }, 'merge')
        })
      }
      this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': 1 }, 'merge')
      done()
    }, cb)
  }

  reorderElement (componentId, componentIdToInsertBefore, cb) {
    return cb() // Not yet implemented
  }

  groupElements (groupSpec, cb) {
    return cb() // Not yet implemented
  }

  ungroupElements (ungroupSpec, cb) {
    return cb() // Not yet implemented
  }

  // Metadata could contain info on whether it is a true hide or only hiding during editing
  hideElements (componentId, metadata, cb) {
    return cb() // Not yet implemented
  }

  /**
   * @method deleteThing
   * @description Flexibly delete some content from the component. Usually the thing deleted is going to be a
   * component, but this could theoretically handle any kind of 'deleteable' content.
   * @param deleteable {Object} - Content of the thing to delete into the component.
   */
  deleteThing (deletable, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      // TODO
      done()
    }, cb)
  }

  upsertStateValue (stateName, stateDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertStateValue(bytecode, stateName, stateDescriptor)
      done()
    }, cb)
  }

  deleteStateValue (stateName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteStateValue(bytecode, stateName)
      done()
    }, cb)
  }

  readAllEventHandlers (cb) {
    const bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllEventHandlers(bytecode))
  }

  readAllStateValues (cb) {
    const bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllStateValues(bytecode))
  }

  upsertEventHandler (selectorName, eventName, handlerDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertEventHandler(bytecode, selectorName, eventName, handlerDescriptor)
      done()
    }, cb)
  }

  batchUpsertEventHandlers (selectorName, serializedEvents, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.batchUpsertEventHandlers(bytecode, selectorName, serializedEvents)
      done()
    }, cb)
  }

  deleteEventHandler (selectorName, eventName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteEventHandler(bytecode, selectorName, eventName)
      done()
    }, cb)
  }

  /** ------------- */
  /** ------------- */
  /** ------------- */

  clearElementsCache (componentId) {
    if (componentId) {
      delete this._elementsCache[componentId]
    } else {
      this._elementsCache = {}
    }
  }

  findElementByComponentId (mana, componentId) {
    if (this._elementsCache[componentId]) return this._elementsCache[componentId]
    let nodes = Template.manaTreeToDepthFirstArray([], mana)
    let found = nodes.filter((node) => node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE] === componentId)[0]
    if (!found) return null
    this._elementsCache[componentId] = found
    return this._elementsCache[componentId]
  }

  upsertDefaultProperties (componentId, propertiesToMerge, strategy) {
    if (!strategy) strategy = 'merge'
    let haikuSelector = `haiku:${componentId}`
    let bytecode = this.getReifiedBytecode()
    if (!bytecode.timelines.Default[haikuSelector]) bytecode.timelines.Default[haikuSelector] = {}
    let defaultTimeline = bytecode.timelines.Default[haikuSelector]
    for (let propName in propertiesToMerge) {
      if (!defaultTimeline[propName]) defaultTimeline[propName] = {}
      if (!defaultTimeline[propName][DEFAULT_TIMELINE_TIME]) defaultTimeline[propName][DEFAULT_TIMELINE_TIME] = {}
      switch (strategy) {
        case 'merge':
          defaultTimeline[propName][DEFAULT_TIMELINE_TIME].value = propertiesToMerge[propName]
          break
        case 'assign':
          if (defaultTimeline[propName][DEFAULT_TIMELINE_TIME].value === undefined) defaultTimeline[propName][DEFAULT_TIMELINE_TIME].value = propertiesToMerge[propName]
          break
      }
    }
  }

  upsertProperties (bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy) {
    return upsertPropertyValue(bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy)
  }

  getContextSize (timelineName, timelineTime) {
    const bytecode = this.getReifiedBytecode()
    if (!bytecode || !bytecode.template || !bytecode.template.attributes) return null
    const contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]
    if (!contextHaikuId) return null
    const contextElementName = Element.safeElementName(bytecode.template)
    if (!contextElementName) return null
    const contextWidth = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.x', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, this.getHostInstance(), this.getHostStates())
    const contextHeight = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.y', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, this.getHostInstance(), this.getHostStates())
    return {
      width: contextWidth,
      height: contextHeight
    }
  }

  getDeclaredPropertyValue (componentId, timelineName, timelineTime, propertyName) {
    const bytecode = this.getReifiedBytecode()
    return getPropertyValue(bytecode, componentId, timelineName, timelineTime, propertyName)
  }

  getComputedPropertyValue (template, componentId, timelineName, timelineTime, propertyName, fallbackValue) {
    const bytecode = this.getReifiedBytecode()
    const element = _findElementByComponentId(componentId, template)
    return TimelineProperty.getComputedValue(componentId, Element.safeElementName(element), propertyName, timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, fallbackValue, bytecode, this.getHostInstance(), this.getHostStates())
  }

  /**
   * @method getReifiedBytecode
   * @description Return the reified form of the bytecode, that is, with actual functions, references,
   * and instances present as they would be if it were being executed in memory.
   */
  getReifiedBytecode () {
    // NOTE: Due to a legacy issue there used to be the assumption that the bytecode file could contain
    // multiple bytecodes, hence the [0]; that is no longer the case and this should be refactored! #FIXME
    return this.mod.fetchInMemoryExport()
  }

  /**
   * @method getReifiedDecycledBytecode
   * @description Similar to getReifiedBytecode but removes internal object pointers/annotations which either cause
   * serialization issues or which have the effect of adding too much metadata to the object. For example, the
   * reified bytecode by itself probably has a template that contains .__depth, .__parent, .layout properties, etc.
   */
  getReifiedDecycledBytecode () {
    const reified = this.getReifiedBytecode()

    const decycled = {}

    if (reified.metadata) decycled.metadata = reified.metadata
    if (reified.options) decycled.options = reified.options
    if (reified.config) decycled.config = reified.config
    if (reified.settings) decycled.settings = reified.settings
    if (reified.properties) decycled.properties = reified.properties
    if (reified.states) decycled.states = reified.states

    // At runtime we wrap the original event handler in a wrapper function, and store
    // the original on the 'original' property, so when serializing we need to grab the original
    if (reified.eventHandlers) {
      decycled.eventHandlers = {}
      for (const componentId in reified.eventHandlers) {
        decycled.eventHandlers[componentId] = {}
        for (const eventListenerName in reified.eventHandlers[componentId]) {
          decycled.eventHandlers[componentId][eventListenerName] = {
            handler: reified.eventHandlers[componentId][eventListenerName].original
          }
        }
      }
    }

    if (reified.timelines) decycled.timelines = reified.timelines
    if (reified.template) decycled.template = cleanMana(reified.template)
    return decycled
  }

  /**
   * @method getSerializedBytecode
   * @description Return the serialized form of the bytecode, that is, with all of its contents converted
   * into a form that can be safely transmitted over the wire. Functions get converted to function specifications,
   * identifiers are replaced with identifier descriptors, etc.
   * Note that this returns a new object; it doesn't serialize the bytecode in place. I.e., you can't
   * mutate the returned object and expect that to affect the live in-memory bytecode, nor the file system.
   */
  getSerializedBytecode () {
    const reified = this.getReifiedDecycledBytecode()
    const serialized = objectToRO(reified) // This returns a *new* object
    return serialized
  }

  /**
   * @method read
   * @description Reads a file's filesystem contents into memory. Useful if you have a reference but need its content.
   */
  read (cb) {
    return File.ingestOne(this.folder, this.relpath, (err) => {
      if (err) return cb(err)

      // Make sure we get the correct things set up right off the bat
      this.reinitializeBytecode(null)

      return cb(null, this)
    })
  }
}

BaseModel.extend(File)

File.TYPES = FILE_TYPES

File.DEFAULT_OPTIONS = {
  doWriteToDisk: true, // Write all actions/content updates to disk
  skipDiffLogging: false, // Log a colorized diff of every content update
  required: {
    relpath: true,
    folder: true
  }
}

File.DEFAULT_CONTEXT_SIZE = DEFAULT_CONTEXT_SIZE

// Dictionary of files currently in the process of being read/written.
// Used as a kind of mutex where reading-while-writing causes a problem.
File.lockees = {}

File.awaitUnlock = function awaitUnlock (abspath, cb) {
  return setTimeout(() => {
    // Continue waiting if the file is still flagged as being written
    if (File.lockees[abspath]) {
      return File.awaitUnlock(abspath, cb)
    }
    return cb()
  }, 0)
}

File.write = function write (folder, relpath, contents, cb) {
  let abspath = path.join(folder, relpath)
  return File.awaitUnlock(abspath, () => {
    File.lockees[abspath] = true
    return _writeFile(abspath, contents, (err) => {
      File.lockees[abspath] = false
      if (err) return cb(err)
      return cb()
    })
  })
}

File.read = function read (folder, relpath, cb) {
  let abspath = path.join(folder, relpath)
  return File.awaitUnlock(abspath, () => {
    File.lockees[abspath] = true
    return _readFile(abspath, (err, buffer) => {
      File.lockees[abspath] = false
      if (err) return cb(err)
      return cb(null, buffer.toString())
    })
  })
}

File.isPathCode = function isPathCode (relpath) {
  return _isFileCode(relpath)
}

File.ingestOne = function ingestOne (folder, relpath, cb) {
  // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
  // Track it here so we get an accurate picture of when the ingestion routine actually began, including before
  // we actually talked to the real filesystem, which can take some time
  const dtLastReadStart = Date.now()

  return File.ingestContents(folder, relpath, { dtLastReadStart }, cb)
}

File.ingestContents = function ingestContents (folder, relpath, { dtLastReadStart }, cb) {
  // Note: The only properties that should be in the object at this point should be relpath and folder,
  // otherwise the upsert won't work correctly since it uses these props as a comparison
  const fileAttrs = {
    uid: path.normalize(path.join(folder, relpath)),
    relpath,
    folder
  }

  const file = File.upsert(fileAttrs)

  // See the note under ingestOne to understand why this gets set here
  file.dtLastReadStart = dtLastReadStart || Date.now()

  if (File.isPathCode(relpath)) {
    file.type = FILE_TYPES.code
  } else {
    file.type = 'other'
  }

  const bytecode = file.mod.isolatedForceReload()

  return file.updateInMemoryContentState(bytecode, (err) => {
    if (err) return cb(err)

    // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
    // Useful when trying to detect e.g. whether code should reload
    file.dtLastReadEnd = Date.now()

    return cb(null, file)
  })
}

File.expelOne = function expelOne (folder, relpath, cb) {
  // TODO
  const file = File.findById(path.join(folder, relpath))
  if (file) {
    file.destroy()
  }
  cb()
}

File.ingestFromFolder = function ingestFromFolder (folder, options, cb) {
  function isExcluded (relpath) {
    if (!options) return false
    if (!options.exclude) return false
    return options.exclude(relpath)
  }
  return walkFiles(folder, (err, entries) => {
    if (err) return cb(err)
    const picks = []
    entries.forEach((entry) => {
      const relpath = path.relative(folder, entry.path)
      // Don't ingest massive bundle files that have no business being in memory
      // Also skip any files that match any exclude patterns passed in with the options
      if (!_looksLikeMassiveFile(relpath) && !isExcluded(relpath)) {
        return picks.push(entry)
      }
    })
    // Load the code first, then designs. This is so we can merge design changes!
    return async.mapSeries(picks, (entry, next) => {
      const relpath = path.relative(folder, entry.path)
      return File.ingestOne(folder, relpath, next)
    }, (err, files) => {
      if (err) return cb(err)
      return cb(null, files)
    })
  })
}

/**
 * @method readMana
 * @description Given the relative path to an SVG file, read the file into
 * memory, parse the contents, and return the respective 'mana' data object.
 * @param relpath {String} Relative path to SVG design asset within folder
 * @param cb {Function} Callback
 */
File.readMana = function readMana (folder, relpath, cb) {
  return File.read(folder, relpath, (err, buffer) => {
    if (err) return cb(err)

    return getSvgOptimizer().optimize(buffer.toString(), { path: path.join(folder, relpath) }).then((contents) => {
      const mana = xmlToMana(contents.data)

      if (!mana) {
        return cb(new Error(`We couldn't load the contents of ${relpath}; please try again`))
      }

      return cb(null, mana)
    })
  })
}

function _isFileCode (relpath) {
  return path.extname(relpath) === '.js'
}

function _readFile (abspath, cb) {
  return fse.readFile(abspath, cb)
}

function _writeFile (abspath, contents, cb) {
  return fse.outputFile(abspath, contents, cb)
}

function _findElementByComponentId (componentId, mana) {
  let elementsById = Template.getAllElementsByHaikuId(mana)
  return elementsById[componentId]
}

function _looksLikeMassiveFile (relpath) {
  return relpath.match(/\.(standalone|bundle|embed)\.(js|html)$/)
}

module.exports = File

// Down here to avoid Node circular dependency stub objects. #FIXME
const AST = require('./AST')
const Bytecode = require('./Bytecode')
const Element = require('./Element')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')
