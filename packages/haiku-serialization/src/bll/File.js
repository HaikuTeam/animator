const async = require('async')
const fse = require('fs-extra')
const {debounce} = require('lodash')
const path = require('path')
const xmlToMana = require('@haiku/core/lib/helpers/xmlToMana').default
const objectToRO = require('@haiku/core/lib/reflection/objectToRO').default
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const BytecodeActions = require('haiku-bytecode/src/actions')
const getPropertyValue = require('haiku-bytecode/src/getPropertyValue')
const upsertPropertyValue = require('haiku-bytecode/src/upsertPropertyValue')
const getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
const writeMetadata = require('haiku-bytecode/src/writeMetadata')
const BaseModel = require('./BaseModel')
const Logger = require('./../utils/Logger')
const walkFiles = require('./../utils/walkFiles')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const getSvgOptimizer = require('./../svg/getSvgOptimizer')

// This file also depends on '@haiku/core/lib/HaikuComponent'
// in the sense that one of those instances is assigned as .hostInstance here.
// ^^ Leave this message in this file so we can grep for it if necessary

const logger = new Logger()
const differ = require('./../utils/LoggerInstanceDiffs')

const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const DEFAULT_CONTEXT_SIZE = { width: 550, height: 400 }
const DISK_FLUSH_TIMEOUT = 500

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

    this.debouncedFlushContent = debounce(() => {
      this.flushContent()
    }, DISK_FLUSH_TIMEOUT)
    // Important: Please see afterInitialize for assigned properties
  }

  // Hook called automatically by BaseModel during construction or upsert
  afterInitialize () {
    // Track how many times we've updated our in-memory content.
    // This runs as an afterInitialize hook because when the user navigates from
    // the dashboard to the editor, this object will be reused, meaning that the
    // content and bytecode validity assertion will run, which depend on this
    // value reflecting the number of the times per session that updates occurred
    this._numBytecodeUpdates = 0
    this._elementsCache = {}

    // Avoid races during "component work" by locking so only one occurs at a time
    this._isWorkLocked = false
  }

  updateInMemoryHotModule (bytecode) {
    // In no circumstance do we want to write bad bytecode to in-memory pointer.
    // so instead of returning an error message, we crash the app in hope
    // that a full restart will resolve the condition leading to this.
    // Throwing here should also give insight into when/why this occurs.
    this.assertBytecode(bytecode)

    this.dtModified = Date.now()

    this.mod.monkeypatch(bytecode)

    // Helps detect whether we need to assert that bytecode is present
    this._numBytecodeUpdates++
  }

  flushContent () {
    const bytecode = this.mod.fetchInMemoryExport()
    const incoming = this.ast.updateWithBytecodeAndReturnCode(bytecode)

    this.assertContents(incoming)

    this.previous = this.contents
    this.contents = incoming

    this.maybeLogDiff(this.previous, this.contents)
    return this.write((err) => {
      if (err) {
        throw err
      }
    })
  }

  assertBytecode (bytecode) {
    // If we have a blank bytecode object after the first couple of updates,
    // that usually means we're about to end up with a "Red Wall of Death"
    if (this._numBytecodeUpdates > 1) {
      if (Object.keys(bytecode).length < 2) {
        throw new Error(`Bytecode object was empty ${this.getAbspath()}`)
      }
    }
  }

  assertContents (contents) {
    if (typeof contents !== 'string') {
      throw new Error(`Code was invalid ${this.getAbspath()}`)
    }

    // Returns truthy for "", " ", "   \n ", etc.
    if (contents.match(/^\s*$/)) {
      throw new Error(`Code was blank ${this.getAbspath()}`)
    }
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
    this.assertContents(this.contents)
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

  awaitWorkUnlock (cb) {
    if (!this._isWorkLocked) return cb() // Go immediately if not locked
    return setTimeout(() => this.awaitWorkUnlock(cb), 32)
  }

  workLock () {
    this._isWorkLocked = true
  }

  workUnlock () {
    this._isWorkLocked = false
  }

  performComponentWork (worker, cb) {
    return this.awaitWorkUnlock(() => {
      this.workLock() // Lock immediately until work is done

      const finish = (err, result) => {
        this.workUnlock() // Unlock now that we're finished
        return cb(err, result)
      }

      const bytecode = this.getReifiedBytecode()

      return worker(bytecode, bytecode.template, (err, result) => {
        if (err) {
          return finish(err)
        }

        Bytecode.cleanBytecode(bytecode)
        Template.cleanTemplate(bytecode.template)

        this.updateInMemoryHotModule(bytecode)

        if (this.options.doWriteToDisk) {
          this.debouncedFlushContent()
        }

        return finish(null, result)
      })
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

  writeMetadata (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      writeMetadata(bytecode, metadata)
      done()
    }, cb)
  }

  setHostInstance (hostInstance) {
    this.hostInstance = hostInstance
  }

  getHostInstance () {
    return this.hostInstance
  }

  getHostStates () {
    const haikuCoreComponentInstance = this.getHostInstance()
    // In case of race where collateral isn't ready yet
    if (haikuCoreComponentInstance) {
      return haikuCoreComponentInstance.getStates()
    }
    return {}
  }

  applyPropertyGroupValue (componentId, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let elementNode = this.findElementByComponentId(mana, componentId)

      if (elementNode) {
        TimelineProperty.addPropertyGroup(timelines, timelineName, componentId, Element.safeElementName(elementNode), propertyGroup, timelineTime)
      } else {
        // Things are badly broken if this happens; to avoid lost work, it's best to crash
        throw new Error(`Cannot find element ${componentId}`)
      }

      return done()
    }, cb)
  }

  applyPropertyGroupDelta (componentId, timelineName, timelineTime, propertyGroup, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let elementNode = this.findElementByComponentId(mana, componentId)

      if (elementNode) {
        TimelineProperty.addPropertyGroupDelta(timelines, timelineName, componentId, Element.safeElementName(elementNode), propertyGroup, timelineTime, this.getHostInstance(), this.getHostStates())
      } else {
        // Things are badly broken if this happens; to avoid lost work, it's best to crash
        throw new Error(`Cannot find element ${componentId}`)
      }

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

  moveKeyframes (componentId, timelineName, propertyName, keyframeMoves, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.moveKeyframes(bytecode, componentId, timelineName, propertyName, keyframeMoves)
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

  upsertProperties (bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy) {
    return upsertPropertyValue(bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy)
  }

  getContextSize (timelineName, timelineTime) {
    const defaults = { width: 1, height: 1 } // In case of race where collateral isn't ready yet
    const bytecode = this.getReifiedBytecode()
    if (!bytecode || !bytecode.template || !bytecode.template.attributes) return defaults
    const contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]
    if (!contextHaikuId) return defaults
    const contextElementName = Element.safeElementName(bytecode.template)
    if (!contextElementName) return defaults
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
    return Bytecode.decycle(reified, { doCleanMana: true })
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

  return file.mod.isolatedForceReload((err, bytecode) => {
    if (err) return cb(err)

    file.updateInMemoryHotModule(bytecode)

    // This can be used to determine if an in-memory-only update occurred
    // after or before a filesystem update. Use to decid whether to code reload
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

    if (experimentIsEnabled(Experiment.SvgOptimizer)) {
      return getSvgOptimizer().optimize(buffer.toString(), { path: path.join(folder, relpath) }).then((contents) => {
        const manaOptimized = xmlToMana(contents.data)

        if (!manaOptimized) {
          return cb(new Error(`We couldn't load the contents of ${relpath}`))
        }

        return cb(null, manaOptimized)
      })
    } else {
      const manaFull = xmlToMana(buffer.toString())

      if (!manaFull) {
        return cb(new Error(`We couldn't load the contents of ${relpath}`))
      }

      return cb(null, manaFull)
    }
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
