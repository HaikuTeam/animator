const path = require('path')
const lodash = require('lodash')
const raf = require('raf')
const pretty = require('pretty')
const async = require('async')
const mergeTimelineStructure = require('haiku-bytecode/src/mergeTimelineStructure')
const expressionToRO = require('@haiku/core/lib/reflection/expressionToRO').default
const HaikuDOMAdapter = require('@haiku/core/lib/adapters/dom').default
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const { InteractionMode, isPreviewMode } = require('@haiku/core/lib/helpers/interactionModes')
const initializeComponentTree = require('@haiku/core/lib/helpers/initializeComponentTree').default
const Layout3D = require('@haiku/core/lib/Layout3D').default
const BaseModel = require('./BaseModel')
const Bytecode = require('./Bytecode')
const logger = require('./../utils/LoggerInstance')
const getDefinedKeys = require('./helpers/getDefinedKeys')
const toTitleCase = require('./helpers/toTitleCase')
const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')
const Lock = require('./Lock')
const BytecodeActions = require('haiku-bytecode/src/actions')
const getPropertyValue = require('haiku-bytecode/src/getPropertyValue')
const upsertPropertyValue = require('haiku-bytecode/src/upsertPropertyValue')
const getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
const writeMetadata = require('haiku-bytecode/src/writeMetadata')

const KEYFRAME_MOVE_DEBOUNCE_TIME = 500

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const DEFAULT_SCENE_NAME = 'main' // e.g. code/main/*
const DEFAULT_INTERACTION_MODE = InteractionMode.EDIT
const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0
const MAX_UNDOABLES_LEN = 50

const DOABILITIES = {
  undo: 'undo',
  redo: 'redo'
}

/**
 * @class ActiveComponent
 * @descriptionx
 *.  Encapsulates and consolidates code to edit a live in-stage component.
 *.  TODO: This should just be called 'Component' or 'LiveComponent' or something, with
 *.  only one of them being "active" at a certain point in time.
 *.  For now, the logic of who is/isn't active is managed by Project.
 */
class ActiveComponent extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    if (!this.scenename) {
      this.scenename = DEFAULT_SCENE_NAME
    }

    // Collection of instances of a @haiku/core/src/HaikuComponent
    // currently present across multiple editing context on stage
    this.instancesOfHaikuCoreComponent = []

    // All elements representing instantiated components within us,
    // mapped by their haiku-id
    this.instantiatedSubcomponentElements = {}

    // The MountElement abstracts over the actual DOM element into which
    // the component gets mounted. It's convenient to have this object since
    // we might be running in a situation where there is no DOM.
    this.mount = MountElement.upsert({
      uid: this.getPrimaryKey(),
      component: this,
      project: this.project
    })

    this.mount.on('update', (what) => {
      this.emit('update', what, this.mount)
    })

    // Representing the visual bounding box on the stage
    this.artboard = Artboard.upsert({
      uid: this.getPrimaryKey(),
      component: this,
      project: this.project,
      mount: this.mount
    })

    this.artboard.on('update', (what) => {
      this.emit('update', what, this.artboard)
    })

    this.marquee = SelectionMarquee.upsert({
      uid: this.getPrimaryKey(),
      component: this,
      artboard: this.artboard
    })

    this.project.addActiveComponentToRegistry(this)

    // Used to control how we render in an editing environment, e.g. preview mode
    this._interactionMode = DEFAULT_INTERACTION_MODE

    this.project.upsertFile({
      relpath: this.getSceneCodeRelpath(),
      type: File.TYPES.code
    })

    Element.on('update', (element, what, metadata) => {
      if (element.component === this) {
        if (what === 'element-selected') {
          this.handleElementSelected(element.getComponentId(), metadata)
        } else if (what === 'element-unselected') {
          this.handleElementUnselected(element.getComponentId(), metadata)
        } else if (
          what === 'jit-property-added' ||
          what === 'jit-property-removed'
        ) {
          this.reload({ hardReload: true }, {}, () => {})
        }
        this.emit('update', what, element, metadata)
      }
    })

    Row.on('update', (row, what) => {
      if (row.component === this) {
        this.emit('update', what, row, this.project.getMetadata())
      }
    })

    Keyframe.on('update', (keyframe, what) => {
      if (keyframe.component === this) {
        this.emit('update', what, keyframe, this.project.getMetadata())
      }
    })

    // Debounced version of the keyframe move action handler
    this.debouncedKeyframeMoveAction = lodash.debounce(
      this.keyframeMoveAction.bind(this),
      KEYFRAME_MOVE_DEBOUNCE_TIME
    )

    // Keep track of actions that can be undone/redone
    this._undoables = []
    this._redoables = []
    this._doability = DOABILITIES.undo
  }

  findElementRoots () {
    return Element.findRoots()
  }

  queryElements (criteria) {
    if (!criteria) criteria = {}
    criteria.component = this // Only query elements that belong to us
    return Element.where(criteria)
  }

  findRowByComponentId (haikuId) {
    return Row.findByComponentAndHaikuId(this, haikuId)
  }

  findPropertyRowsByParentComponentId (parentHaikuId) {
    return Row.findPropertyRowsByComponentAndParentHaikuId(this, parentHaikuId)
  }

  findElementByComponentId (haikuId) {
    return Element.findByComponentAndHaikuId(this, haikuId)
  }

  findTemplateNodeByComponentId (mana, componentId) {
    let foundNode

    if (mana.attributes && mana.attributes[HAIKU_ID_ATTRIBUTE] === componentId) {
      return mana
    }

    if (mana && Array.isArray(mana.children)) {
      for (let i = 0; i < mana.children.length; i++) {
        const node = mana.children[i]

        if (
          node &&
          node.attributes &&
          node.attributes[HAIKU_ID_ATTRIBUTE] === componentId
        ) {
          foundNode = node
          break
        }
      }
    }

    return foundNode
  }

  findElementByUid (uid) {
    return Element.findById(uid)
  }

  getCurrentTimelineName () {
    return Timeline.DEFAULT_NAME // TODO: Support many
  }

  upsertCurrentTimeline () {
    const timeline = Timeline.upsert({
      uid: this.buildCurrentTimelineUid(),
      folder: this.project.getFolder(),
      name: this.getCurrentTimelineName(),
      component: this,
      _isCurrent: true
    }, {})
    return timeline
  }

  getCurrentTimelineTime () {
    // Although we own multiple instances, assume that they are operating in lockstep during
    // editing; we just need to grab a single 'canonical' one for reference
    const canonicalCoreInstance = this.getCoreComponentInstance()

    // In case we get called before fully initialized, e.g. on stage during first load
    if (!canonicalCoreInstance) {
      return 0
    }

    const canonicalCoreTimeline = canonicalCoreInstance.getTimeline(this.getCurrentTimelineName())

    // This should never happen, but just in case, fallback to 0 if no timeline with this name
    if (!canonicalCoreTimeline) {
      return 0
    }

    const controlledTime = canonicalCoreTimeline.getControlledTime()

    // If time control hasn't been established yet, the controlled time may be null
    return controlledTime || 0
  }

  getSceneCodeRelpath () {
    return path.join('code', this.getSceneName(), 'code.js')
  }

  getSceneCodeFolder () {
    return path.join(this.project.getFolder(), 'code', this.getSceneName())
  }

  getSceneDomModulePath () {
    return path.join('code', this.getSceneName(), 'dom.js')
  }

  getRelpathWithRespectToProjectFromPathRelativeToUs (relpathRelativeToUs) {
    const abspathToGivenPath = path.normalize(path.join(this.getSceneCodeFolder(), relpathRelativeToUs))
    const relpathWithRespectToProject = abspathToGivenPath.replace(this.project.getFolder(), '').slice(1) // Remove leftover slash
    return relpathWithRespectToProject
  }

  setSceneName (scenename) {
    this.scenename = scenename
    return this
  }

  setAsCurrentActiveComponent (metadata, cb) {
    this.project.setCurrentActiveComponent(this.getSceneName(), metadata, cb)
  }

  getSceneName () {
    return this.scenename
  }

  getFriendlySceneName (maybeProjectName) {
    const snakename = this.getSceneName()
    if (snakename === DEFAULT_SCENE_NAME) return `${this.project.getFriendlyName(maybeProjectName)} (Main)`
    return `${toTitleCase(snakename)}`
  }

  getAbsoluteLottieFilePath () {
    return path.join(this.getSceneCodeFolder(), 'lottie.json')
  }

  fetchActiveBytecodeFile () {
    const folder = this.project.getFolder()
    const relpath = this.getSceneCodeRelpath()
    const uid = path.join(folder, relpath)

    let file = File.findById(uid)

    // There is a race where the file might not be ready, so we upsert
    if (!file) {
      file = File.upsert({
        uid,
        relpath,
        folder
      })

      // This calls require, which might introduce its own race ¯\_(ツ)_/¯
      file.mod.load()
    }

    return file
  }

  getActiveInstancesOfHaikuCoreComponent () {
    return this.instancesOfHaikuCoreComponent.filter((instance) => {
      return !instance.isDeactivated()
    })
  }

  getAllInstancesOfHaikuCoreComponent () {
    return this.instancesOfHaikuCoreComponent
  }

  forceFlush () {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance._markForFullFlush(true)
      // This guard is to allow headless mode, e.g. in Haiku's timeline application
      if (instance._context && instance._context.tick) {
        instance._context.tick()
      }
    })
  }

  clearCaches (options) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance.clearCaches(options) // Also clears instance._builder sub-caches
    })
    this.fetchRootElement().cacheClear()
    this.fetchRootElement().clearEntityCaches()
    return this
  }

  clearCachedClusters (timelineName, componentId) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance._builder._clearCachedClusters(timelineName, componentId)
    })
    return this
  }

  updateTimelineMaxes (timelineName) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      let timeline = instance._timelineInstances[timelineName]
      if (timeline) {
        let descriptor = instance._getTimelineDescriptor(timelineName)
        timeline._resetMaxDefinedTimeFromDescriptor(descriptor)
      }
    })
    return this
  }

  getPropertyGroupValueFromPropertyKeys (componentId, timelineName, timelineTime, propertyKeys) {
    let groupValue = {}
    let bytecode = this.getReifiedBytecode()

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
    return this.getMount().getInnerHTML()
  }

  htmlSnapshot (cb) {
    const html = this.getMountHTML()
    return cb(null, pretty(html))
  }

  setTimelineTimeValue (timelineTime, forceSeek = false) {
    timelineTime = Math.round(timelineTime)
    // When doing a hardReload (in which we load a fresh component instance from disk)
    // that component will be completely fresh and not yet in 'controlled time' mode, which
    // means that it will initially start playing. Hard reload depends on being able to
    // force set a time value to get it into 'controlled time' mode, hence the `forceSeek` flag.
    if (forceSeek || timelineTime !== this.getCurrentTimelineTime()) {
      // Note that this call reaches in and updates our instance's timeline objects
      Timeline.setCurrentTime({ component: this }, timelineTime, /* skipTransmit= */ true, forceSeek)
      // Perform a lightweight full flush render, recomputing all values without without trying to be clever about
      // which properties have actually changed.
      this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
        if (instance._context && instance._context.tick) {
          instance._context.tick(true)
        }
      })
    }
  }

  setTimelineName (timelineName, metadata, cb) {
    logger.info(`[active component (${this.project.getAlias()})] changing active timeline to ` + timelineName)
    Timeline.setCurrent({ component: this }, timelineName)
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance.stopAllTimelines()
      instance.startTimeline(timelineName)
    })
    this.project.methodHook('setTimelineName', this.getSceneCodeRelpath(), timelineName, metadata)
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
    this.project.updateHook('selectElement', this.getSceneCodeRelpath(), componentId, metadata)
    return this
  }

  /**
   * @method handleElementUnselected
   * @description Hook to call once an element in-memory has been unselected.
   * This is responsible for notifying other views about the action, and emitting an event that others can listen to.
   * The metadata arg is important because it has info about who originated the message, allowing us to avoid infinite loop.
   * Note: This gets called automatically by element.unselect()
   */
  handleElementUnselected (componentId, metadata) {
    this.project.updateHook('unselectElement', this.getSceneCodeRelpath(), componentId, metadata)
    return this
  }

  getTopLevelElementHaikuIds () {
    const template = this.getReifiedBytecode().template
    const children = (template && template.children) || []
    return children.map((child) => {
      return child && child.attributes && child.attributes[HAIKU_ID_ATTRIBUTE]
    }).filter((id) => {
      return !!id
    })
  }

  selectElementWithinTime (waitTime, componentId, metadata, cb) {
    const element = Element.findByComponentAndHaikuId(this, componentId)

    // If we don't initially find the element, wait up to `waitTime` to see if it appears
    // Race conditions with instantiate can cause this to happen
    if (!element) {
      if (waitTime <= 0) {
        // Is it better to throw here?
        return cb()
      }

      return setTimeout(() => {
        return this.selectElementWithinTime(waitTime - 250, componentId, metadata, cb)
      }, 250)
    }

    element.select(metadata)

    const row = element.getHeadingRow()

    if (row) {
      row.expand(metadata)
    }

    cb()
  }

  selectElement (componentId, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      // Assuming the update occurs remotely, we want to unselect everything but the selected one
      Element.unselectAllElements({ component: this }, metadata)

      return this.selectElementWithinTime(1000, componentId, metadata, () => {
        release()
        return cb() // Must return or the plumbing action circuit never completes
      })
    })
  }

  unselectElementWithinTime (waitTime, componentId, metadata, cb) {
    const element = Element.findByComponentAndHaikuId(this, componentId)

    if (!element) {
      if (waitTime <= 0) {
        // Is it better to throw here?
        return cb()
      }

      return setTimeout(() => {
        return this.unselectElementWithinTime(waitTime - 250, componentId, metadata, cb)
      }, 250)
    }

    element.unselect(metadata)

    return cb()
  }

  unselectElement (componentId, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      return this.unselectElementWithinTime(1000, componentId, metadata, () => {
        release()
        return cb() // Must return or the plumbing action circuit never completes
      })
    })
  }

  undo (options, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      return this.undoActual(options, (err) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          release()
          this.project.updateHook('undo', this.getSceneCodeRelpath(), options, metadata)
          return cb()
        })
      })
    })
  }

  undoActual (options, cb) {
    return Lock.request(Lock.LOCKS.FileUndoRedo, (release) => {
      if (this.getUndoables().length < 1) {
        release()
        return cb()
      }

      const { method, params } = this.popUndoable()

      // Specify that the inverse of this method, which originates as an undo,
      // should be made into a *redoable*
      this._doability = DOABILITIES.redo

      return this[method].apply(this, params.concat((err, out) => {
        release()

        // Don't forget to set us back to the default: methods can be undone
        this._doability = DOABILITIES.undo

        if (err) return cb(err)
        return cb(null, out)
      }))
    })
  }

  redo (options, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      return this.redoActual(options, (err) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          release()
          this.project.updateHook('redo', this.getSceneCodeRelpath(), options, metadata)
          return cb()
        })
      })
    })
  }

  redoActual (options, cb) {
    return Lock.request(Lock.LOCKS.FileUndoRedo, (release) => {
      if (this.getRedoables().length < 1) {
        release()
        return cb()
      }

      const { method, params } = this.popRedoable()

      return this[method].apply(this, params.concat((err, out) => {
        release()
        if (err) return cb(err)
        return cb(null, out)
      }))
    })
  }

  isPreviewModeActive () {
    return isPreviewMode(this._interactionMode)
  }

  /**
  * @method setInteractionMode
  * @description Changes the current interaction mode and flushes all cachés
  */
  setInteractionMode (interactionMode, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      this._interactionMode = interactionMode

      this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
        instance.assignConfig({
          options: {
            interactionMode: interactionMode,
            // Disable hot editing mode during preview mode for smooth playback.
            hotEditingMode: !this.isPreviewModeActive()
          }
        })
      })

      this.reload({ hardReload: false }, null, () => {
        release()
        this.project.updateHook('setInteractionMode', this.getSceneCodeRelpath(), this._interactionMode, metadata)
        return cb()
      })
    })
  }

  setHotEditingMode (hotEditingMode) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance.assignConfig({ options: { hotEditingMode } })
    })
  }

  createComponentFromElements (elements, metadata, cb) {
    if (elements.length < 1) return cb()

    this.codeReloadingOn()

    const finish = (err, arg) => {
      this.codeReloadingOff()

      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return cb(null, arg)
    }

    const artboardElement = this.getArtboard().getElement()
    const artboardTranslation = {
      x: (artboardElement && artboardElement.getPropertyValue('translation.x')) || 0,
      y: (artboardElement && artboardElement.getPropertyValue('translation.y')) || 0
    }

    const points = Element.getBoundingBoxPointsForElementsTransformed(elements)

    // Get the sizing and positioning information for the new encapsulating component
    const offsetFromArtboard = points[0] // Translation from artboard 0,0

    // Edge case if the artboard has been shifted away from the normal stage container
    const offsetFromArtboardAdjusted = {
      x: offsetFromArtboard.x - artboardTranslation.x,
      y: offsetFromArtboard.y - artboardTranslation.y
    }

    const sizeOfNewComponent = { // Absolute size of the wrapper element
      width: points[2].x - points[0].x,
      height: points[7].y - points[0].y
    }

    // Something like untitled or untitled_2 to start with
    const name = this.project.getNextAvailableSceneNameWithPrefix('untitled')

    return this.project.upsertSceneByName(name, (err, ac) => {
      if (err) return finish(err)

      return async.eachSeries(elements, (element, next) => {
        // We need to put the element where it belongs in the new component
        const translationOfElement = {
          x: element.getPropertyValue('translation.x'),
          y: element.getPropertyValue('translation.y')
        }

        // const sizeOfElement = {
        //   width: element.getPropertyValue('sizeAbsolute.x'),
        //   height: element.getPropertyValue('sizeAbsolute.y'),
        // }
        // const centerOfElementRelativeToItself = {
        //   x: sizeOfElement.width / 2,
        //   y: sizeOfElement.height / 2,
        // }

        // The element will be placed as if instantiated at this location in the new component
        const propertyGroupToApply = {
          'translation.x': translationOfElement.x - offsetFromArtboardAdjusted.x,
          'translation.y': translationOfElement.y - offsetFromArtboardAdjusted.y
        }

        return ac.instantiateElement(element, propertyGroupToApply, metadata, next)
      }, (err) => {
        if (err) return finish(err)

        // Make the new component's size the same size as the element selection
        return ac.resizeContext(artboardElement.getComponentId(), this.getCurrentTimelineName(), this.getCurrentTimelineTime(), sizeOfNewComponent, metadata, (err) => {
          if (err) return finish(err)

          // Now delete our own instances of these elements
          elements.forEach((element) => element.remove())

          // And instantiate the created component in ourselves at the offset location
          // Note that this will also perform a hard reload so we shouldn't need to do that here
          return this.instantiateComponent(ac.getSceneCodeRelpath(), offsetFromArtboardAdjusted, metadata, (err) => {
            if (err) return finish(err)

            // Not sure yet what to do here - jump into editing mode for the component?
            return finish(null, ac)
          })
        })
      })
    })
  }

  getInsertionPointHash () {
    const template = this.getReifiedBytecode().template
    return Template.getInsertionPointInfo(template, 0, 0).hash
  }

  instantiateElement (element, propertyGroupToApply, metadata, cb) {
    const bytecode = element.getQualifiedBytecode()
    return this.instantiateBytecode(bytecode, propertyGroupToApply, metadata, cb)
  }

  instantiateBytecode (incomingBytecode, propertyGroupToApply, metadata, cb) {
    const timelineName = this.getInstantiationTimelineName()
    const timelineTime = this.getInstantiationTimelineTime()
    let componentId

    return this.performComponentWork((existingBytecode, existingTemplate, done) => {
      const {
        hash
      } = Template.getInsertionPointInfo(existingTemplate, existingTemplate.children.length, 0)

      Bytecode.padIds(incomingBytecode, (oldId) => {
        return Template.getHash(`${oldId}-${hash}`, 12)
      })

      // Has to happen after the above line in case an id was generated
      componentId = incomingBytecode.template.attributes[HAIKU_ID_ATTRIBUTE]

      logger.info(`[active component (${this.project.getAlias()})] instantiatee (bytecode) ${componentId} via ${hash}`)

      this.mutateInstantiateeDisplaySettings(
        componentId,
        incomingBytecode.timelines,
        timelineName,
        timelineTime,
        incomingBytecode.template
      )

      if (propertyGroupToApply) {
        TimelineProperty.addPropertyGroup(
          incomingBytecode.timelines,
          timelineName,
          componentId,
          Element.safeElementName(incomingBytecode.template),
          propertyGroupToApply,
          timelineTime
        )
      }

      existingTemplate.children.push(incomingBytecode.template)

      Bytecode.mergeBytecodeControlStructures(existingBytecode, incomingBytecode)

      // Unlock performComponent work so zMoveToFront can proceed
      done()
    }, (err) => {
      if (err) return cb(err)
      // Downstream may depend on getting this mana object returned
      return cb(null, incomingBytecode.template)
    })
  }

  /**
   * @method instantiateReference
   * @description Instantiate a component by reference, i.e., using a module path
   * that points to that component using a require()-compatible path.
   * @param identifier {String} Identifier (variable) name to write to the AST
   * @param modpath {String} require()-compatible path to a module
   * @param coords {Object} Coordinates of the instantiatee
   * @param overrides {Object} Overrides to apply to the timeline [unused]
   * @param metadata {Object} Signal metadata
   * @param cb {Function}
   */
  instantiateReference (subcomponent, identifier, modpath, coords, overrides, metadata, cb) {
    let fullpath

    const isExternalModule = modpath[0] !== '.'

    if (!isExternalModule) {
      fullpath = path.join(this.project.getFolder(), modpath) // Expected to be ./*
    } else {
      fullpath = modpath
    }

    // This assumes that the file has already been written to the file system or
    // stored inside the module require.cache via an earlier hook
    const mod = ModuleWrapper.upsert({
      uid: fullpath,
      isExternalModule,
      file: this.project.upsertFile({
        relpath: modpath,
        folder: this.project.getFolder()
      })
    })

    return mod.moduleAsMana(identifier, this.getSceneCodeFolder(), (err, manaForWrapperElement) => {
      if (err) return cb(err)

      if (!manaForWrapperElement) {
        return cb(new Error(`Module ${fullpath} could not be imported`))
      }

      // As usual, we can use any of our instances to stand in during editing
      const ours = this.getCoreComponentInstance()

      // Assume the last component instantiated of their type
      const theirs = subcomponent && subcomponent.getCoreComponentInstance()

      initializeComponentTree(manaForWrapperElement, ours, ours._context, theirs)

      return this.instantiateMana(manaForWrapperElement, overrides, coords, metadata, cb)
    })
  }

  getCoreComponentInstance () {
    const haikuCoreComponentInstances = this.getActiveInstancesOfHaikuCoreComponent()
    return haikuCoreComponentInstances[haikuCoreComponentInstances.length - 1]
  }

  eachCoreComponentInstance (iteratee) {
    const haikuCoreComponentInstances = this.getActiveInstancesOfHaikuCoreComponent()
    return haikuCoreComponentInstances.forEach(iteratee)
  }

  /**
   * @method instantiatePrimitive
   * @description Given an identifier and the bytecode of some primitive, instantiate
   * it as a reference to that primitive instead of the whole primitive bytecode
   */
  instantiatePrimitive (primitive, coords, overrides, metadata, cb) {
    return this.instantiateReference(
      null,
      primitive.getClassName(),
      primitive.getRequirePath(),
      coords,
      overrides,
      metadata,
      cb
    )
  }

  fetchTimelinePropertyFromComponentElement (mana, propertyName) {
    return TimelineProperty.getComputedValue(
      mana.elementName.template.attributes[HAIKU_ID_ATTRIBUTE],
      mana.elementName.template.elementName,
      propertyName,
      this.getCurrentTimelineName(),
      this.getCurrentTimelineTime(),
      0,
      mana.elementName,
      mana.__instance,
      mana.__instance.state
    )
  }

  /**
   * @method instantiateMana
   * @description Given a chunk of 'mana' data, instantiate that 'mana' into
   * our component's template object
   * @param mana {Object} Chunk of 'mana' data to instantiate
   * @param overrides {Object} Overrides to apply to the timeline [unused]
   * @param metadata {Object} Signal metadata
   * @param cb {Function}
   */
  instantiateMana (mana, overrides, coords, metadata, cb) {
    const timelineName = this.getInstantiationTimelineName()
    const timelineTime = this.getInstantiationTimelineTime()
    let componentId

    return this.performComponentWork((bytecode, template, done) => {
      const {
        hash
      } = Template.getInsertionPointInfo(template, template.children.length, 0)

      const timelinesObject = Template.prepareManaAndBuildTimelinesObject(
        mana,
        hash,
        timelineName,
        timelineTime,
        { doHashWork: true }
      )

      // Has to happen after the above stanza in case an id was generated
      componentId = mana.attributes[HAIKU_ID_ATTRIBUTE]

      logger.info(`[active component (${this.project.getAlias()})] instantiatee (mana) ${componentId} via ${hash}`)

      this.mutateInstantiateeDisplaySettings(
        componentId,
        timelinesObject,
        timelineName,
        timelineTime,
        mana,
        coords
      )

      Bytecode.applyOverrides(overrides, timelinesObject, timelineName, `haiku:${componentId}`, timelineTime)

      template.children.push(mana)

      mergeTimelineStructure(bytecode, timelinesObject, 'assign')

      const doable = {
        method: 'deleteComponent',
        params: [
          componentId,
          metadata
        ]
      }

      // Unlock performComponent work so zMoveToFront can proceed
      done(null, null, doable)
    }, (err) => {
      if (err) return cb(err)
      // Downstream may depend on getting this mana object returned
      return cb(null, mana)
    })
  }

  getInstantiationTimelineName () {
    if (experimentIsEnabled(Experiment.HideInstantiatedElementUntilTimeInstantiated)) {
      return this.getCurrentTimelineName()
    } else {
      return Timeline.DEFAULT_NAME
    }
  }

  getInstantiationTimelineTime () {
    if (experimentIsEnabled(Experiment.HideInstantiatedElementUntilTimeInstantiated)) {
      return this.getCurrentTimelineTime()
    } else {
      return 0
    }
  }

  getMergeDesignTimelineName () {
    if (experimentIsEnabled(Experiment.MergeDesignChangesAtCurrentTime)) {
      return this.getCurrentTimelineName()
    } else {
      return Timeline.DEFAULT_NAME
    }
  }

  getMergeDesignTimelineTime () {
    if (experimentIsEnabled(Experiment.MergeDesignChangesAtCurrentTime)) {
      return this.getCurrentTimelineTime()
    } else {
      return 0
    }
  }

  createInTransitionInTimelineObject (timelineObj, propertyName, fromTime, fromValue, toTime, toValue, curveName) {
    if (!timelineObj[propertyName]) {
      timelineObj[propertyName] = {}
    }

    if (!timelineObj[propertyName][fromTime]) {
      timelineObj[propertyName][fromTime] = {}
    }

    timelineObj[propertyName][fromTime].value = fromValue

    if (curveName) {
      timelineObj[propertyName][fromTime].curve = curveName
    }

    if (!timelineObj[propertyName][toTime]) {
      timelineObj[propertyName][toTime] = {}
    }

    timelineObj[propertyName][toTime].value = toValue
  }

  mutateInstantiateeDisplaySettings (componentId, timelinesObject, timelineName, timelineTime, templateObject, maybeCoords) {
    const insertedTimeline = timelinesObject[this.getCurrentTimelineName()][`haiku:${componentId}`] || {}

    // If instantiated at a time greater than 0, make the element invisible
    // until the playhead time at which was instantiated on the stage
    if (timelineTime > 0) {
      this.createInTransitionInTimelineObject(insertedTimeline, 'opacity', 0, 0, timelineTime, 1, null)
    }

    // If the child being instantiated has a set size, set ours to the same
    // so the transform controls line up when it's selected on stage
    if (templateObject.elementName && typeof templateObject.elementName === 'object') {
      const sizeAbsoluteX = this.fetchTimelinePropertyFromComponentElement(templateObject, 'sizeAbsolute.x')
      if (sizeAbsoluteX) {
        if (!insertedTimeline['sizeAbsolute.x']) insertedTimeline['sizeAbsolute.x'] = {}
        if (!insertedTimeline['sizeAbsolute.x'][timelineTime]) insertedTimeline['sizeAbsolute.x'][timelineTime] = {}
        insertedTimeline['sizeAbsolute.x'][timelineTime].value = sizeAbsoluteX

        // The default size mode is proportional, so if we received an absolute size, we have to override the mode
        if (!insertedTimeline['sizeMode.x']) insertedTimeline['sizeMode.x'] = {}
        if (!insertedTimeline['sizeMode.x'][timelineTime]) insertedTimeline['sizeMode.x'][timelineTime] = {}
        insertedTimeline['sizeMode.x'][timelineTime].value = Layout3D.SIZE_ABSOLUTE
      }
      const sizeAbsoluteY = this.fetchTimelinePropertyFromComponentElement(templateObject, 'sizeAbsolute.y')
      if (sizeAbsoluteY) {
        if (!insertedTimeline['sizeAbsolute.y']) insertedTimeline['sizeAbsolute.y'] = {}
        if (!insertedTimeline['sizeAbsolute.y'][timelineTime]) insertedTimeline['sizeAbsolute.y'][timelineTime] = {}
        insertedTimeline['sizeAbsolute.y'][timelineTime].value = sizeAbsoluteY

        // The default size mode is proportional, so if we received an absolute size, we have to override the mode
        if (!insertedTimeline['sizeMode.y']) insertedTimeline['sizeMode.y'] = {}
        if (!insertedTimeline['sizeMode.y'][timelineTime]) insertedTimeline['sizeMode.y'][timelineTime] = {}
        insertedTimeline['sizeMode.y'][timelineTime].value = Layout3D.SIZE_ABSOLUTE
      }
    }

    if (maybeCoords && (maybeCoords.x || maybeCoords.y || maybeCoords.minimized)) {
      const instantiateeWidth = (insertedTimeline['sizeAbsolute.x'] && insertedTimeline['sizeAbsolute.x'][timelineTime] && insertedTimeline['sizeAbsolute.x'][timelineTime].value) || 1
      const instantiateeHeight = (insertedTimeline['sizeAbsolute.y'] && insertedTimeline['sizeAbsolute.y'][timelineTime] && insertedTimeline['sizeAbsolute.y'][timelineTime].value) || 1

      const propertyGroup = {
        'translation.x': (maybeCoords.x || 0) - instantiateeWidth / 2,
        'translation.y': (maybeCoords.y || 0) - instantiateeHeight / 2
      }

      TimelineProperty.addPropertyGroup(
        timelinesObject,
        timelineName,
        componentId,
        Element.safeElementName(templateObject),
        propertyGroup,
        timelineTime
      )
    }
  }

  /**
   * @method instantiateComponent
   * @description Given a relative path to an instantiable asset (which could be
   * an SVG or a component module, instantiate that component at the given position.
   * @param relpath {String} Relpath to an instantiable asset
   * @param coords {Object} Optional translation coords of the instantiatee
   * @param metadata {Object} Signal metadata
   * @param cb {Function}
   */
  instantiateComponent (relpath, coords, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      // Since there are a few pathways to account for, the callback is defined up here
      const finish = (err, manaForWrapperElement) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          release()

          this.project.updateHook(
            'instantiateComponent',
            this.getSceneCodeRelpath(),
            relpath,
            coords,
            metadata
          )

          return cb()
        })
      }

      // We'll treat an installed module path strictly as a reference and not copy it into our folder
      if (ModuleWrapper.doesRelpathLookLikeInstalledComponent(relpath)) {
        // This identifier is going to be something like HaikuLine or MyOrg_MyName
        const installedComponentIdentifier = ModuleWrapper.modulePathToIdentifierName(relpath)
        return this.instantiateReference(null, installedComponentIdentifier, relpath, coords, {}, metadata, finish)
      }

      // For local modules, the only caveat is that the component must be known in memory already
      if (ModuleWrapper.doesRelpathLookLikeLocalComponent(relpath)) {
        const subcomponent = this.project.findActiveComponentBySource(relpath)
        if (subcomponent) {
          // This identifier is going to be something like foo_svg_blah
          const localComponentIdentifier = ModuleWrapper.getScenenameFromRelpath(relpath)
          return this.instantiateReference(subcomponent, localComponentIdentifier, relpath, coords, {}, metadata, finish)
        } else {
          return finish(new Error(`Cannot find component ${relpath}`))
        }
      }

      if (ModuleWrapper.doesRelpathLookLikeSVGDesign(relpath)) {
        return File.readMana(this.project.getFolder(), relpath, (err, mana) => {
          if (err) return finish(err)

          Template.fixManaSourceAttribute(mana, relpath) // Adds source="relpath_to_file_from_project_root"

          if (experimentIsEnabled(Experiment.InstantiationOfPrimitivesAsComponents)) {
            return Design.manaAsCode(relpath, Template.clone({}, mana), {}, (err, identifier, modpath, bytecode) => {
              if (err) return finish(err)

              const primitive = Primitive.inferPrimitiveFromBytecode(bytecode)

              if (primitive) {
                const overrides = Bytecode.extractOverrides(bytecode)
                return this.instantiatePrimitive(primitive, coords, overrides, metadata, finish)
              }

              return this.instantiateMana(mana, {}, coords, metadata, finish)
            })
          } else {
            return this.instantiateMana(mana, {}, coords, metadata, finish)
          }
        })
      }

      return finish(new Error(`Problem instantiating ${relpath}`))
    })
  }

  deleteComponent (componentId, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      return this.performComponentWork((bytecode, mana, done) => {
        const doable = {
          method: 'pasteThing',
          params: [
            this.findElementByComponentId(componentId).clip(metadata),
            {}, // request,
            metadata
          ]
        }

        Template.visitManaTree(mana, (elementName, attributes, children, node, locator, parent, index) => {
          if (!attributes) return null
          if (!attributes[HAIKU_ID_ATTRIBUTE]) return null
          if (componentId !== attributes[HAIKU_ID_ATTRIBUTE]) return null

          if (parent) {
            // Where the magic happens ^_^
            parent.children.splice(index, 1)
          } else {
            // No parent means we are at the top
            mana.elementName = 'div'
            mana.attributes = {}
            mana.children = []
          }
        })

        done(null, null, doable)
      }, (err) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          release()
          this.project.updateHook('deleteComponent', this.getSceneCodeRelpath(), componentId, metadata)
          return cb()
        })
      })
    })
  }

  mergePrimitiveWithOverrides (primitive, overrides, cb) {
    return this.performComponentWork((bytecode, template, done) => {
      Template.visit((template), (node) => {
        // Only merge into nodes that match our source design path
        if (node.attributes.source !== primitive.getRequirePath()) {
          return
        }

        const timelineName = this.getMergeDesignTimelineName()
        const timelineTime = this.getMergeDesignTimelineTime()
        const haikuId = node.attributes[HAIKU_ID_ATTRIBUTE]

        const timelineObj = (
          bytecode.timelines &&
          bytecode.timelines[timelineName] &&
          bytecode.timelines[timelineName][`haiku:${haikuId}`]
        )

        if (timelineObj) {
          for (const propertyName in timelineObj) {
            const keyframeObj = timelineObj[propertyName][timelineTime]

            // Nothing to do if no keyframe spec at this time
            if (!keyframeObj) continue

            // Nothing to do if the keyframe object was edited
            if (keyframeObj.edited) continue

            const overrideVal = overrides[propertyName]

            if (overrideVal !== undefined) {
              keyframeObj.value = overrideVal
            }
          }
        }
      })

      done()
    }, cb)
  }

  removeChildContentFromBytecode (bytecode, mana) {
    // Return the data that we removed in case we want to retain anything when designs merge
    const removedOutputs = {}

    Template.visit(mana, (node, parent, index, depth, address) => {
      // Skip the topmost node; that wrapper stays
      if (node === mana) {
        return
      }

      const haikuId = node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]

      if (!haikuId) {
        return
      }

      removedOutputs[haikuId] = {
        treeInfo: { index, depth, address },
        templateNode: node,
        eventHandlers: {},
        timelines: {}
      }

      const haikuSelector = `haiku:${haikuId}`

      if (bytecode.eventHandlers) {
        // In case we want to re-set any removed event handlers to new content
        removedOutputs[haikuId].eventHandlers = bytecode.eventHandlers[haikuSelector]

        delete bytecode.eventHandlers[haikuSelector]
      }

      if (bytecode.timelines) {
        for (const timelineName in bytecode.timelines) {
          // In case we want to re-set any removed timelines to new content
          removedOutputs[haikuId].timelines[timelineName] = bytecode.timelines[timelineName][haikuSelector]

          delete bytecode.timelines[timelineName][haikuSelector]
        }
      }
    })

    // Remove our own children, whose content we just purged
    mana.children.splice(0)

    return removedOutputs
  }

  findEquivalentNode (node, { index, depth, address }, template) {
    let foundNode

    const ourDomId = node.attributes && node.attributes.id

    Template.visit(template, (desc, parent, theirIndex, theirDepth, theirAddress) => {
      // Stop if we've already found a match
      if (foundNode) return

      const theirDomId = desc.attributes && desc.attributes.id

      // We have a match if the node at the same address matches ours
      if (
        address === theirAddress &&
        node.elementName === desc.elementName &&
        ourDomId === theirDomId
      ) {
        foundNode = desc
      }
    })

    return foundNode
  }

  mergeRemovedOutputs (bytecode, subtemplate, removals) {
    // Nothing to do if there aren't any timelines to merge into
    if (!bytecode.timelines) return

    for (const haikuId in removals) {
      const {
        treeInfo,
        templateNode,
        timelines
      } = removals[haikuId]

      const equivalent = this.findEquivalentNode(templateNode, treeInfo, subtemplate)
      if (!equivalent) continue

      const equivalentId = equivalent.attributes && equivalent.attributes[HAIKU_ID_ATTRIBUTE]
      if (!equivalentId) continue

      // Allows for copying of replaced Element data into their replacements
      equivalent.__replacee = templateNode

      const equivalentSelector = `haiku:${equivalentId}`

      for (const timelineName in bytecode.timelines) {
        // Nothing to do if our removal doesn't have the matching timeline
        if (!timelines[timelineName]) continue

        // And nothing to do if our timeline doesn't have a matching output set
        if (!bytecode.timelines[timelineName][equivalentSelector]) continue

        for (const propertyName in timelines[timelineName]) {
          for (const keyframeMs in timelines[timelineName][propertyName]) {
            const sourceObj = timelines[timelineName][propertyName][keyframeMs]

            // Don't merge unless our source object has been explicitly edited
            if (!sourceObj.edited) continue

            // Create the keyframes set if it doesn't exist
            if (!bytecode.timelines[timelineName][equivalentSelector][propertyName]) {
              bytecode.timelines[timelineName][equivalentSelector][propertyName] = {}
            }

            // Create the values object if it doesn't exist
            if (!bytecode.timelines[timelineName][equivalentSelector][propertyName][keyframeMs]) {
              bytecode.timelines[timelineName][equivalentSelector][propertyName][keyframeMs] = {}
            }

            const targetObj = bytecode.timelines[timelineName][equivalentSelector][propertyName][keyframeMs]

            // Attach any values from source (old) onto the target (new)
            if (sourceObj.curve) targetObj.curve = sourceObj.curve
            if (sourceObj.value !== undefined) targetObj.value = sourceObj.value

            // Don't forget to mark the target (new) as edited so subsequent merges work
            targetObj.edited = true
          }
        }
      }
    }
  }

  mergeMana (existingBytecode, manaIncoming) {
    let numMatchingNodes = 0

    const timelineName = this.getMergeDesignTimelineName()
    const timelineTime = this.getMergeDesignTimelineTime()

    Template.visit((existingBytecode.template), (existingNode) => {
      // Only merge into any that match our source design path
      if (existingNode.attributes.source !== manaIncoming.attributes.source) {
        return
      }

      const safeIncoming = Template.clone({}, manaIncoming)

      const removedOutputs = this.removeChildContentFromBytecode(existingBytecode, existingNode)

      const {
        hash
      } = Template.getInsertionPointInfo(
        existingBytecode.template,
        existingBytecode.template.children.length,
        numMatchingNodes++
      )

      const timelinesObject = Template.prepareManaAndBuildTimelinesObject(
        safeIncoming,
        hash,
        timelineName,
        timelineTime,
        { doHashWork: true }
      )

      delete timelinesObject[timelineName][safeIncoming.attributes[HAIKU_ID_ATTRIBUTE]]

      for (let i = 0; i < safeIncoming.children.length; i++) {
        const incomingChild = safeIncoming.children[i]
        existingNode.children.push(incomingChild)
      }

      mergeTimelineStructure(existingBytecode, timelinesObject, 'assign')

      this.mergeRemovedOutputs(existingBytecode, existingNode, removedOutputs)
    })
  }

  mergeDesignFiles (designs, cb) {
    return this.performComponentWork((bytecode, template, done) => {
      // Ensure order is the same across processes otherwise we'll end up with different insertion point hashes
      const designsAsArray = Object.keys(designs).sort((a, b) => {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })

      // Each series is important so we don't inadvertently create a race and thus unstable insertion point hashes
      return async.eachSeries(designsAsArray, (relpath, next) => {
        if (ModuleWrapper.doesRelpathLookLikeSVGDesign(relpath)) {
          return File.readMana(this.project.getFolder(), relpath, (err, mana) => {
            // There may be a race where a file is removed before this gets called;
            // and in that case we need to skip this whole subroutine (simply don't
            // touch whatever designs may have been instantiated
            if (err || !mana) {
              return next()
            }

            Template.fixManaSourceAttribute(mana, relpath) // Adds source="relpath_to_file_from_project_root"

            if (experimentIsEnabled(Experiment.InstantiationOfPrimitivesAsComponents)) {
              return Design.manaAsCode(relpath, Template.clone({}, mana), {}, (err, identifier, modpath, bytecode) => {
                if (err) return next(err)

                const primitive = Primitive.inferPrimitiveFromBytecode(bytecode)

                if (primitive) {
                  const overrides = Bytecode.extractOverrides(bytecode)
                  return this.mergePrimitiveWithOverrides(primitive, overrides, next)
                }

                this.mergeMana(bytecode, mana)
                return next()
              })
            } else {
              this.mergeMana(bytecode, mana)
              return next()
            }
          })
        }

        return next(new Error(`Problem merging ${relpath}`))
      }, (err) => {
        if (err) return cb(err)
        return done()
      })
    }, cb)
  }

  mergeDesigns (designs, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      // Since several designs are merged, and that process occurs async, we can get into a situation
      // where individual fragments are inserted but their parent layouts have not been appropriately
      // populated. To fix this, we wait to do any rendering until this whole process has finished
      this.codeReloadingOn()

      this.mergeDesignFiles(designs, (err) => {
        // Now that we've finalized (or errored) the update, we can resume since we have no orphan fragments
        this.codeReloadingOff()

        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          release()
          this.project.updateHook('mergeDesigns', this.getSceneCodeRelpath(), designs, metadata)
          return cb()
        })
      })
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
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      let newHaikuId = ''

      return this.performComponentWork((bytecode, mana, done) => {
        switch (pasteable.kind) {
          case 'bytecode':
            // As usual, we use a hash rather than randomness because of multithreading
            const {
              hash
            } = Template.getInsertionPointInfo(mana, mana.children.length, 0)

            const incoming = Bytecode.clone(pasteable.data)

            // Pasting bytecode is implemented as a bytecode merge, so we pad all of the
            // ids inside the bytecode and then merge it, so we end up with a new element
            // and new timeline properties defined for it. This mutates the object.
            Bytecode.padIds(incoming, (oldId) => {
              return `${oldId}-${hash}`
            })

            // Paste handles "instantiating" a new template element for the incoming bytecode
            Bytecode.pasteBytecode(bytecode, incoming, request)

            newHaikuId = incoming.template.attributes['haiku-id']

            logger.info(`[active component (${this.project.getAlias()})] pastee (bytecode) ${newHaikuId} via ${hash}`)

            const doable = {
              method: 'deleteComponent',
              params: [
                newHaikuId,
                metadata
              ]
            }

            return done(null, {haikuId: newHaikuId}, doable)
          default:
            logger.warn(`[active component (${this.project.getAlias()})] cannot paste clipboard contents of kind ` + pasteable.kind)
            return done(new Error('Unable to paste clipboard contents'))
        }
      }, (err, data) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          release()

          this.project.updateHook('pasteThing', this.getSceneCodeRelpath(), pasteable, request, metadata)

          return cb(null, data)
        })
      })
    })
  }

  splitSelectedKeyframes (metadata) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.removeCurve(metadata))
    Keyframe.deselectAndDeactivateAllDeletedKeyframes({ component: this.component })
    return this
  }

  deleteSelectedKeyframes (metadata) {
    const keyframes = this.getSelectedKeyframes()

    keyframes.forEach((keyframe) => {
      if (!keyframe.isTransitionSegment()) {
        const prev = keyframe.prev()

        if (prev && prev.isTransitionSegment()) {
          prev.removeCurve(metadata)
        }
      }

      keyframe.delete(metadata)
    })
    Keyframe.deselectAndDeactivateAllDeletedKeyframes({ component: this.component })
    return this
  }

  joinSelectedKeyframes (curveName, metadata) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => {
      // Only keyframes that have a next keyframe should get the curve assigned,
      // otherwise you'll see a "surprise curve" if you add a next keyframe
      // But only assign if its body is selected or it is directly selected
      if (keyframe.next() && keyframe.isSelectedBody()) {
        keyframe.addCurve(curveName, metadata)
      }
    })
    return this
  }

  changeCurveOnSelectedKeyframes (curveName, metadata) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => {
      // Only keyframes that have a next keyframe should get the curve assigned,
      // otherwise you'll see a "surprise curve" if you add a next keyframe.
      // But only assign if its body is selected or it is directly selected
      if (keyframe.next() && keyframe.isSelectedBody()) {
        keyframe.changeCurve(curveName, metadata)
      }
    })
    return this
  }

  dragStartSelectedKeyframes (dragData) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.dragStart(dragData))
    return this
  }

  dragStopSelectedKeyframes (dragData) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.dragStop(dragData))
    return this
  }

  dragSelectedKeyframes (pxpf, mspf, dragData, metadata) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.drag(pxpf, mspf, dragData, metadata))
    return this
  }

  handleKeyframeMove () {
    this.debouncedKeyframeMoveAction()
    return this
  }

  keyframeMoveAction () {
    const moves = Keyframe.buildKeyframeMoves({ component: this }, true)

    for (const timelineName in moves) {
      for (const componentId in moves[timelineName]) {
        for (const propertyName in moves[timelineName][componentId]) {
          const keyframeMoves = moves[timelineName][componentId][propertyName]
          this.moveKeyframes(
            componentId,
            timelineName,
            propertyName,
            keyframeMoves,
            this.project.getMetadata(),
            () => {}
          )
        }
      }
    }

    this.postMoveZerothKeyframeHook()
  }

  postMoveZerothKeyframeHook () {
    const rowsNeedingZerothKeyframe = Row.fetchAndUnsetRowsToEnsureZerothKeyframe({ component: this })
    rowsNeedingZerothKeyframe.forEach((row) => {
      row.ensureZerothKeyframe(this.project.getMetadata())
    })
  }

  getMount () {
    return this.mount
  }

  getArtboard () {
    return this.artboard
  }

  getSelectionMarquee () {
    return this.marquee
  }

  /** ------------ */
  /** ------------ */
  /** ------------ */

  reload (reloadOptions, instanceConfig, cb) {
    const runReload = (done) => {
      if (reloadOptions.hardReload) {
        // Note: hardReload also calls softReload
        return this.hardReload(reloadOptions, instanceConfig, done)
      } else {
        return this.softReload(reloadOptions, instanceConfig, done)
      }
    }

    if (reloadOptions.skipReloadLock) {
      return runReload(cb)
    }

    // Note that this lock only occurs in .reload(); if you ever call hardReload or
    // softReload a la carte, you might get a race condition!
    return Lock.request(Lock.LOCKS.ActiveComponentReload, (release) => {
      const finish = (err) => {
        release()

        if (err) return cb(err)

        // Note: The hard/soft signal may affect how the views decide to refresh
        this.emit('update', 'reloaded', (reloadOptions.hardReload) ? 'hard' : 'soft')

        return cb()
      }

      return runReload(finish)
    })
  }

  hardReload (reloadOptions, instanceConfig, finish) {
    const timelineTimeBeforeReload = this.getCurrentTimelineTime() || 0

    const haikuCoreComponentInstances = this.getActiveInstancesOfHaikuCoreComponent()

    return async.series([
      (cb) => {
        // Stop the clock so we don't continue any animations while this update is happening
        haikuCoreComponentInstances.forEach((instance) => {
          instance._context.clock.stop()
        })

        return cb()
      },

      (cb) => {
        if (!reloadOptions.fileReload) {
          return cb()
        }

        // If no instances, we need to populate at least one for everything to work
        if (haikuCoreComponentInstances.length < 1) {
          return this.moduleCreate(instanceConfig, cb)
        }

        return this.moduleReload(reloadOptions, instanceConfig, cb)
      },

      (cb) => {
        return this.softReload(reloadOptions, instanceConfig, cb)
      },

      (cb) => {
        return raf(() => {
          // Rehydrate all the view-models so our view renders correctly
          // This has to happen __after softReload__ because softReload calls
          // flush, and all the models need access to the rendered app in
          // order to compute various things properly (race condition)
          this.rehydrate()

          // If we don't do this here, continued edits at this time won't work properly.
          // We have to do this  __after rehydrate__ so we update all copies fo the models we've
          // just loaded into memory who have reset attributes.
          this.forceFlush()
          this.setTimelineTimeValue(timelineTimeBeforeReload, /* forceSeek= */ true)

          // Start the clock again, as we should now be ready to flow updated component.
          this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
            instance._context.clock.start()
          })

          return cb()
        })
      }
    ], finish)
  }

  moduleReload (reloadOptions, instanceConfig, cb) {
    return this.fetchActiveBytecodeFile().mod.configuredReload(instanceConfig, (err, reifiedBytecode) => {
      if (err) return cb(err)
      this.getActiveInstancesOfHaikuCoreComponent().forEach((existingActiveInstance) => {
        this.replaceInstance(existingActiveInstance, reifiedBytecode, instanceConfig)
      })
      return cb()
    })
  }

  moduleCreate (instanceConfig, cb) {
    return this.fetchActiveBytecodeFile().mod.configuredReload(instanceConfig, (err) => {
      if (err) return cb(err)
      const reifiedBytecode = this.getReifiedBytecode()
      const createdHaikuCoreComponent = this.createInstance(reifiedBytecode, instanceConfig)
      this.addInstanceOfHaikuCoreComponent(createdHaikuCoreComponent)
      return cb()
    })
  }

  addInstanceOfHaikuCoreComponent (instanceGiven) {
    let foundInstance = false

    const allInstances = this.getAllInstancesOfHaikuCoreComponent()

    allInstances.forEach((instanceKnown) => {
      if (instanceGiven === instanceKnown) {
        foundInstance = true
      }
    })

    if (!foundInstance) {
      allInstances.push(instanceGiven)
    }

    // This is an easier way to trace back to its host ActiveComponent than
    // to look things up constantly using the scene id and relative pathing hacks
    instanceGiven.__activeComponent = this
  }

  ingestInstantiatedSubcomponentsInTemplate () {
    const bytecode = this.getReifiedBytecode()
    if (bytecode) {
      const template = bytecode.template
      if (template) {
        // Subcomponents are only ever instantiated as first-level children
        const children = template && template.children
        children.forEach((child) => {
          if (child.elementName && typeof child.elementName === 'object') {
            this.instantiatedSubcomponentElements[child.attributes[HAIKU_ID_ATTRIBUTE]] = child
          }
        })
      }
    }
  }

  createInstance (bytecode, config) {
    const factory = HaikuDOMAdapter(bytecode, null, null)

    const createdHaikuCoreComponent = factory(this.getMount().$el(), lodash.merge({}, {
      options: {
        contextMenu: 'disabled', // Don't show the right-click context menu since our editing tools use right-click
        overflowX: 'visible',
        overflowY: 'visible',
        mixpanel: false, // Don't track events in mixpanel while the component is being built
        interactionMode: this._interactionMode,
        hotEditingMode: true // Don't clone the bytecode/template so we can mutate it in-place
      }
    }, config))

    // Make sure we get notified of state updates and everything else we care about
    createdHaikuCoreComponent._doesEmitEventsVerbosely = true

    return createdHaikuCoreComponent
  }

  replaceInstance (existingActiveInstance, bytecode, config) {
    // Shut down the previous instance (if any) since it no longer needs to render
    // and doing continued rendering can conflict with new renderers entering the stage
    existingActiveInstance.deactivate()

    const freshInstance = this.createInstance(bytecode, config)

    // We need to copy the in-memory timeline (NOT the data object!) over the new one so we retain
    // the same local time/time control data that had already been set by the user
    for (const timelineName in existingActiveInstance._timelineInstances) {
      existingActiveInstance._timelineInstances[timelineName] = existingActiveInstance._timelineInstances[timelineName]
      existingActiveInstance._timelineInstances[timelineName]._setComponent(freshInstance)
    }

    // Discard the old (deactivated) instance and subsume it with this one
    // Note that here we are iterating over the entire collection, not just the active ones
    const allKnownInstances = this.getAllInstancesOfHaikuCoreComponent()
    allKnownInstances.forEach((existingInstanceWhichMayBeActive, index) => {
      if (existingInstanceWhichMayBeActive === existingActiveInstance) {
        // We replace it with our fresh active instance to keep the array small
        allKnownInstances[index] = freshInstance
      }
    })

    // And make sure we update the tree with the new instance (and new content)
    if (existingActiveInstance.__element) {
      existingActiveInstance.__element.__instance = freshInstance
      freshInstance.__element = existingActiveInstance.__element
    }
  }

  softReload (reloadOptions, instanceConfig, cb) {
    // Make sure the maximum keyframe is correctly defined for proper playback calc
    this.updateTimelineMaxes(this.getCurrentTimelineName())

    // In case properties were totally removed as a part of this update, we need to do a full re-render
    if (reloadOptions.clearCacheOptions) {
      this.clearCaches(reloadOptions.clearCacheOptions)
    } else {
      this.clearCaches()
    }

    // We'll end up with stale attributes in the DOM unless we do this; this calls .tick()
    if (reloadOptions.onlyForceFlushIf) {
      this.forceFlush()
    }

    // It's assumed that soft reload occurs after mutation operations, so we can do this here
    this.ingestInstantiatedSubcomponentsInTemplate()

    return this.reloadInstantiatedSubcomponentsSoftly(reloadOptions, cb)
  }

  getInstantiatedActiveComponents () {
    const activeComponents = {}
    for (const haikuId in this.instantiatedSubcomponentElements) {
      const subcomponentElement = this.instantiatedSubcomponentElements[haikuId]

      // In Node (i.e. Master) this isn't going to exist, so we can just skip it
      // TODO: Should we warn here?
      if (subcomponentElement && subcomponentElement.__instance) {
        const haikuCoreComponent = subcomponentElement.__instance
        const activeComponent = haikuCoreComponent.__activeComponent
        // When we initially hydrate the project, these aren't ready yet - there's nothing
        // to initially reload because the component instances haven't started yet, so we
        // skip this step and will take care of it later when it 'matters'
        if (activeComponent) {
          activeComponents[activeComponent.getPrimaryKey()] = activeComponent
        }
      }
    }
    return Object.values(activeComponents)
  }

  reloadInstantiatedSubcomponentsSoftly (reloadOptions, cb) {
    const activeComponents = this.getInstantiatedActiveComponents()
    return async.eachSeries(activeComponents, (activeComponent, next) => {
      // Just in case one of ourselves is nested inside us, avoid an infinite loop
      if (activeComponent === this) return next()
      return activeComponent.reload(lodash.assign({ hardReload: false, skipReloadLock: true }, reloadOptions), null, next)
    }, (err) => {
      if (err) return cb(err)
      return cb()
    })
  }

  /**
   * @method mountApplication
   * @description Given an *optional* DOM element to mount, load the component and boostrap it inside the mount.
   * If no mount is provided (i.e. in non-DOM contexts) this method can also be used if you just want to reload
   * the data for the component instead of actually displaying it. This is used by the Timeline but also nominally
   * by the Glass.
   */
  mountApplication ($el, instanceConfig, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      this.getMount().remountInto($el)

      this.codeReloadingOn()

      return this.reload({ hardReload: true, fileReload: true }, instanceConfig, (err) => {
        release()

        this.codeReloadingOff()

        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          this.emit('error', err)
          if (cb) return cb(err)
          return null
        }

        this._isMounted = true
        this.emit('update', 'application-mounted')

        if (cb) return cb()
        return null
      })
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

  sleepComponentsOn () {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance.sleepOn()
    })
  }

  sleepComponentsOff () {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance.sleepOff()
    })
  }

  isCodeReloading () {
    return this._isReloadingCode
  }

  codeReloadingOn () {
    this._isReloadingCode = true
    this.sleepComponentsOn()
    this.getMount().setOpacity(0.2)
  }

  codeReloadingOff () {
    this.getMount().setOpacity(1.0)
    this.sleepComponentsOff()
    this._isReloadingCode = false
  }

  /**
   * @method moduleReplace
   * @description The more severe cousin of mountApplication which also displays a message on the view
   * indicating that reloading is occurring. This is really only used in the Glass, where code reload
   * events can interfere with what the user is doing and a UI lock of some kind is required.
   */
  moduleReplace (cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      this.codeReloadingOn()

      return this.reload({ hardReload: true, fileReload: true }, null, (err) => {
        release()

        this.codeReloadingOff()

        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return this.emit('error', err)
        }

        return cb()
      })
    })
  }

  fetchRootElement () {
    const uid = Element.makeUid(
      this,
      null,
      0,
      this.getReifiedBytecode().template
    )

    const found = Element.findById(uid)

    if (found) {
      return found
    }

    return Element.upsertElementFromVirtualElement(
      this, // component
      this.getReifiedBytecode().template, // static template node
      null, // parent element
      0, // index in parent
      '0' // graph address
    )
  }

  rehydrate () {
    // Required before rehydration because entities use the timeline entity
    this.upsertCurrentTimeline()

    const root = this.fetchRootElement()

    // Sweep of elements must happen first or we'll end up with stale rows
    Element.where({ component: this }).forEach((element) => { if (element !== root) element.mark() })
    root.rehydrate()
    Element.where({ component: this }).forEach((element) => { if (element !== root) element.sweep() })

    // We should only need the row model hydrated in the context of the timeline or test
    if (this.project.getAlias() === 'timeline' || this.project.getAlias() === 'test') {
      // Keyframes are owned by rows, so they must be swept as part of this routine too
      Keyframe.where({ component: this }).forEach((keyframe) => keyframe.mark())
      Row.where({ component: this }).forEach((row) => row.mark())
      // Hydrate rows via element so the rows order matches depth-first element order
      root.visitAll((element) => element.rehydrateRows())
      Row.where({ component: this }).forEach((row) => row.sweep())
      Keyframe.where({ component: this }).forEach((keyframe) => keyframe.sweep())
    }

    const row = root.getHostedRows()[0]
    if (row) {
      // Expand the first (topmost) row by default, only if this is the first run
      if (!row._wasInitiallyExpanded) {
        row._isExpanded = true
        row._wasInitiallyExpanded = true
      }
    }

    this.positionRows()
  }

  positionRows () {
    let position = 0

    Template.visit(this.getReifiedBytecode().template, (node) => {
      if (node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]) {
        const element = this.findElementByComponentId(node.attributes[HAIKU_ID_ATTRIBUTE])

        if (element) {
          element.getHostedRowsInDefaultDisplayPositionOrder().forEach((row) => {
            row.setPosition(position)
            position += 1
          })
        }
      }
    })
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

  batchPropertyGroupUpdate (componentId, timelineName, timelineTime, propertyKeys, metadata) {
    const groupValue = this.getPropertyGroupValueFromPropertyKeys(
      componentId,
      timelineName,
      timelineTime,
      propertyKeys
    )

    const folder = this.project.getFolder()
    const relpath = this.getSceneCodeRelpath()

    if (this.project.isLocalUpdate(metadata)) {
      // Special casing an action that happens very quickly. We don't want to fire
      // a message for every single one, but we can't debounce either since we rely on
      // the order in which these are requested (consider what happens if we send a property
      // update call to an element that has been deleted). So we basically accumulate
      // method calls that occur together and which have the same tuple

      // If no last entry, it might mean the previous call was transmitted already,
      // which is fine. The key is that we accumulate what we can while retaining sequence
      const lastAction = this.project._websocketActions[this.project._websocketActions.length - 1]

      // If the previous payload matches ours, then we'll accumulate our group value
      // into it, so we end up with just once command for a fast sequence of commands
      if (lastAction && lastAction.method === 'applyPropertyGroupValue') {
        if (
          lastAction.params[0] === folder &&
          lastAction.params[1] === relpath &&
          lastAction.params[2] === componentId &&
          lastAction.params[3] === timelineName &&
          lastAction.params[4] === timelineTime // timeline time
        ) {
          // Merge entries from the incoming groupValue parameter into the existing one
          // In this way, the most recent values for all attributes are all used when
          // this method is finally transmitted
          lodash.assign(lastAction.params[5], groupValue)

          // Use this to decide whether to transmit immediately or wait for more to accumulate
          lastAction.timestamp = Date.now()

          // Important to early return since we don't want to enqueue a new action
          return
        }
      }

      // The Project model handles accumulating these to avoid excessive websocket calls
      this.project.batchedWebsocketAction(
        'applyPropertyGroupValue',
        [
          folder,
          relpath,
          componentId,
          timelineName,
          timelineTime,
          groupValue
        ],
        () => {
          // no-op
        }
      )
    }

    this.clearCachedClusters(timelineName, componentId)
  }

  upsertProperties (bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy) {
    return upsertPropertyValue(bytecode, componentId, timelineName, timelineTime, propertiesToMerge, strategy)
  }

  getDeclaredPropertyValue (componentId, timelineName, timelineTime, propertyName) {
    const bytecode = this.getReifiedBytecode()
    return getPropertyValue(bytecode, componentId, timelineName, timelineTime, propertyName)
  }

  getComputedPropertyValue (template, componentId, timelineName, timelineTime, propertyName, fallbackValue) {
    const bytecode = this.getReifiedBytecode()
    const elementsById = Template.getAllElementsByHaikuId(template)
    const element = elementsById[componentId]
    const host = this.getCoreComponentInstance()
    const states = (host && host.getStates()) || {}
    return TimelineProperty.getComputedValue(componentId, Element.safeElementName(element), propertyName, timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, fallbackValue, bytecode, host, states)
  }

  getContextSize () {
    return this.getContextSizeActual(this.getCurrentTimelineName(), this.getCurrentTimelineTime())
  }

  getContextSizeActual (timelineName, timelineTime) {
    const defaults = { width: 1, height: 1 } // In case of race where collateral isn't ready yet
    const bytecode = this.getReifiedBytecode()
    if (!bytecode || !bytecode.template || !bytecode.template.attributes) return defaults
    const contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]
    if (!contextHaikuId) return defaults
    const contextElementName = Element.safeElementName(bytecode.template)
    if (!contextElementName) return defaults
    const host = this.getCoreComponentInstance()
    const states = (host && host.getStates()) || {}
    const contextWidth = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.x', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, host, states)
    const contextHeight = TimelineProperty.getComputedValue(contextHaikuId, contextElementName, 'sizeAbsolute.y', timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, 0, bytecode, host, states)
    return {
      width: contextWidth,
      height: contextHeight
    }
  }

  buildCurrentTimelineUid () {
    return this.getPrimaryKey() + '::' + this.getCurrentTimelineName()
  }

  getCurrentTimeline () {
    return Timeline.findById(this.buildCurrentTimelineUid())
  }

  getRows () {
    return Row.where({ component: this })
  }

  getKeyframes () {
    return Keyframe.where({ component: this })
  }

  getElements () {
    return Element.where({ component: this })
  }

  getLastTemplateNode () {
    const bytecode = this.getReifiedBytecode()
    return (
      bytecode &&
      bytecode.template &&
      bytecode.template.children &&
      bytecode.template.children[bytecode.template.children.length - 1]
    )
  }

  getLastTemplateNodeHaikuId () {
    const node = this.getLastTemplateNode()
    return node && node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]
  }

  focusSelectNext (navDir, doFocus, metadata) {
    return Row.focusSelectNext({ component: this }, navDir, doFocus, metadata)
  }

  getSelectedRows () {
    return Row.where({ component: this, _isSelected: true })
  }

  getCurrentRows (criteria) {
    if (!criteria) criteria = {}
    criteria.component = this
    return Row.where(criteria)
  }

  getDisplayableRows () {
    return Row.getDisplayables({ component: this })
  }

  getSelectedKeyframes () {
    return Keyframe.where({ component: this, _selected: true })
  }

  getCurrentKeyframes (criteria) {
    if (!criteria) criteria = {}
    criteria.component = this
    return Keyframe.where(criteria)
  }

  getFocusedRow () {
    return Row.getFocusedRow({ component: this }) // Only one instance per component
  }

  getSelectedRow () {
    return Row.getSelectedRow({ component: this }) // Only one instance per component
  }

  pushUndoable (undoable) {
    this._undoables.push(undoable)

    if (this._undoables.length > MAX_UNDOABLES_LEN) {
      this._undoables.shift()
    }
  }

  popUndoable () {
    return this._undoables.pop()
  }

  pushRedoable (redoable) {
    this._redoables.push(redoable)

    if (this._redoables.length > MAX_UNDOABLES_LEN) {
      this._redoables.shift()
    }
  }

  popRedoable () {
    return this._redoables.pop()
  }

  getUndoables () {
    return this._undoables
  }

  getRedoables () {
    return this._redoables
  }

  performComponentWork (worker, cb) {
    return Lock.request(Lock.LOCKS.FilePerformComponentWork, (release) => {
      const finish = (err, result) => {
        release()
        return cb(err, result)
      }

      const bytecode = this.getReifiedBytecode()

      return worker(bytecode, bytecode.template, (err, result, doable) => {
        if (err) {
          return finish(err)
        }

        // Let un/redo specify which stack its inverse belongs in
        if (doable) {
          if (this._doability === DOABILITIES.undo) {
            console.log('pushed undoable', doable)
            this.pushUndoable(doable)
          } else if (this._doability === DOABILITIES.redo) {
            console.log('pushed redoable', doable)
            this.pushRedoable(doable)
          }
        }

        this.handleUpdatedBytecode(bytecode)

        return finish(null, result)
      })
    })
  }

  handleUpdatedBytecode (bytecode) {
    Bytecode.cleanBytecode(bytecode)

    Template.cleanTemplate(bytecode.template)

    const file = this.fetchActiveBytecodeFile()

    file.updateInMemoryHotModule(bytecode)

    if (file.options.doWriteToDisk) {
      file.requestAsyncContentFlush({ who: 'performComponentWork' })
    }
  }

  performComponentTimelinesWork (worker, finish) {
    return this.performComponentWork((bytecode, mana, done) => {
      if (!bytecode) return done(new Error('Missing bytecode'))
      if (!bytecode.timelines) return done(new Error('Missing timelines'))
      return worker(bytecode, mana, bytecode.timelines, done)
    }, finish)
  }

  snapshotCurrentPropertyGroup (componentId, timelineName, timelineTime, propertyKeys) {
    // for (let i = 0; i < propertyKeys.length; i++) {
    //   const propertyName = propertyKeys[i]

    //   const propertyValue = this.getKeyframeValue(
    //     componentId,
    //     timelineName,
    //     timelineTime,
    //     propertyName
    //   )
    // }
  }

  getKeyframeValue (componentId, timelineName, timelineTime, propertyName) {
    const bytecode = this.getReifiedBytecode()
    const selector = `haiku:${componentId}`
    return (
      bytecode &&
      bytecode.timelines &&
      bytecode.timelines[timelineName] &&
      bytecode.timelines[timelineName][selector] &&
      bytecode.timelines[timelineName][selector][propertyName] &&
      bytecode.timelines[timelineName][selector][propertyName][timelineTime] &&
      bytecode.timelines[timelineName][selector][propertyName][timelineTime].value
    )
  }

  getKeyframeCurve (componentId, timelineName, timelineTime, propertyName) {
    const bytecode = this.getReifiedBytecode()
    const selector = `haiku:${componentId}`
    return (
      bytecode &&
      bytecode.timelines &&
      bytecode.timelines[timelineName] &&
      bytecode.timelines[timelineName][selector] &&
      bytecode.timelines[timelineName][selector][propertyName] &&
      bytecode.timelines[timelineName][selector][propertyName][timelineTime] &&
      bytecode.timelines[timelineName][selector][propertyName][timelineTime].curve
    )
  }

  getElementNameOfComponentId (componentId) {
    const element = this.findTemplateNodeByComponentId(componentId)
    return element && element.elementName
  }

  getTimelineDescriptor (timelineName) {
    const bytecode = this.getReifiedBytecode()
    return bytecode && bytecode.timelines && bytecode.timelines[timelineName]
  }

  invertKeyframeMoves (componentId, timelineName, propertyName, keyframeMoves) {
    //
  }

  normalizeStackingAndReturnInfo (bytecode, mana, timelineName, timelineTime) {
    const stackingInfo = getStackingInfo(bytecode, mana, timelineName, timelineTime)
    stackingInfo.forEach(({ zIndex, haikuId }) => {
      this.upsertProperties(bytecode, haikuId, timelineName, timelineTime, { 'style.zIndex': zIndex }, 'merge')
    })
    return stackingInfo
  }

  // ==========
  //
  // METHODS
  //
  // ==========

  /**
   * @method writeMetadata
   */
  writeMetadata (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      writeMetadata(bytecode, metadata)
      done()
    }, cb)
  }

  /**
   * @method readAllEventHandlers
   */
  readAllEventHandlers (metadata, cb) {
    return this.readAllEventHandlersActual(cb)
  }

  readAllEventHandlersActual (cb) {
    const bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllEventHandlers(bytecode))
  }

  /**
   * @method readAllStateValues
   */
  readAllStateValues (metadata, cb) {
    return this.readAllStateValuesActual(cb)
  }

  readAllStateValuesActual (cb) {
    const bytecode = this.getSerializedBytecode()
    return cb(null, BytecodeActions.readAllStateValues(bytecode))
  }

  /**
   * @method upsertEventHandler
   */
  upsertEventHandler (selectorName, eventName, handlerDescriptor, metadata, cb) {
    handlerDescriptor.edited = true
    return this.upsertEventHandlerActual(selectorName, eventName, handlerDescriptor, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({
        hardReload: this.project.isRemoteRequest(metadata),
        clearCacheOptions: {
          clearPreviouslyRegisteredEventListeners: true
        }
      }, null, () => {
        this.project.updateHook('upsertEventHandler', this.getSceneCodeRelpath(), selectorName, eventName, handlerDescriptor, metadata)
        return cb()
      })
    })
  }

  upsertEventHandlerActual (selectorName, eventName, handlerDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertEventHandler(bytecode, selectorName, eventName, handlerDescriptor)
      done()
    }, cb)
  }

  /**
   * @method batchUpsertEventHandlers
   */
  batchUpsertEventHandlers (selectorName, serializedEvents, metadata, cb) {
    return this.batchUpsertEventHandlersActual(selectorName, serializedEvents, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({
        hardReload: this.project.isRemoteRequest(metadata),
        clearCacheOptions: {
          clearPreviouslyRegisteredEventListeners: true
        }
      }, null, () => {
        this.project.updateHook('batchUpsertEventHandlers', this.getSceneCodeRelpath(), selectorName, serializedEvents, metadata)

        this.project.broadcastPayload({
          name: 'event-handlers-updated'
        })

        return cb()
      })
    })
  }

  batchUpsertEventHandlersActual (selectorName, serializedEvents, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.batchUpsertEventHandlers(bytecode, selectorName, serializedEvents)
      done()
    }, cb)
  }

  /**
   * @method deleteEventHandler
   */
  deleteEventHandler (selectorName, eventName, metadata, cb) {
    return this.deleteEventHandlerActual(selectorName, eventName, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({
        hardReload: this.project.isRemoteRequest(metadata),
        clearCacheOptions: {
          clearPreviouslyRegisteredEventListeners: true
        }
      }, null, () => {
        this.project.updateHook('deleteEventHandler', this.getSceneCodeRelpath(), selectorName, eventName, metadata)
        return cb()
      })
    })
  }

  deleteEventHandlerActual (selectorName, eventName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteEventHandler(bytecode, selectorName, eventName)
      done()
    }, cb)
  }

  /**
   * @method applyPropertyGroupValue
   */
  applyPropertyGroupValue (componentId, timelineName, timelineTime, propertyGroup, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      // Keep track of the values to which we will undo
      this.snapshotCurrentPropertyGroup(
        componentId,
        timelineName,
        timelineTime,
        Object.keys(propertyGroup)
      )

      this.applyPropertyGroupValueActual(componentId, timelineName, timelineTime, propertyGroup, metadata, (err) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          release()

          this.batchPropertyGroupUpdate(
            componentId,
            this.getCurrentTimelineName(),
            this.getCurrentTimelineTime(),
            getDefinedKeys(propertyGroup),
            metadata
          )

          return cb()
        })
      })
    })
  }

  applyPropertyGroupValueActual (componentId, timelineName, timelineTime, propertyGroup, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let elementNode = this.findTemplateNodeByComponentId(mana, componentId)

      if (elementNode) {
        TimelineProperty.addPropertyGroup(timelines, timelineName, componentId, Element.safeElementName(elementNode), propertyGroup, timelineTime)
      } else {
        // Things are badly broken if this happens; to avoid lost work, it's best to crash
        throw new Error(`Cannot find element ${componentId}`)
      }

      return done()
    }, cb)
  }

  /**
   * @method resizeContext
   */
  resizeContext (artboardId, timelineName, timelineTime, sizeDescriptor, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      // Keep track of the values to which we will undo
      this.snapshotCurrentPropertyGroup(
        artboardId,
        timelineName,
        timelineTime,
        ['sizeAbsolute.x', 'sizeAbsolute.y']
      )

      this.resizeContextActual(artboardId, timelineName, timelineTime, sizeDescriptor, metadata, (err) => {
        if (err) {
          release()
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          release()
          this.project.emitHook('resizeContext', this.getSceneCodeRelpath(), artboardId, timelineName, timelineTime, sizeDescriptor, metadata)

          this.batchPropertyGroupUpdate(
            artboardId,
            timelineName,
            timelineTime,
            ['sizeAbsolute.x', 'sizeAbsolute.y']
          )

          return cb()
        })
      })
    })
  }

  resizeContextActual (artboardId, timelineName, timelineTime, sizeDescriptor, metadata, cb) {
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

  /**
   * @method changeKeyframeValue
   */
  changeKeyframeValue (componentId, timelineName, propertyName, keyframeMs, newValue, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.changeKeyframeValueActual(componentId, timelineName, propertyName, keyframeMs, newValue, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changeKeyframeValue', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, newValue, metadata)
        return cb()
      })
    })
  }

  changeKeyframeValueActual (componentId, timelineName, propertyName, keyframeMs, newValue, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'changeKeyframeValue',
        params: [
          componentId,
          timelineName,
          propertyName,
          keyframeMs,
          this.getKeyframeValue(
            componentId,
            timelineName,
            propertyName,
            keyframeMs
          ),
          metadata
        ]
      }

      BytecodeActions.changeKeyframeValue(bytecode, componentId, timelineName, propertyName, keyframeMs, newValue)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method changeSegmentCurve
   */
  changeSegmentCurve (componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.changeSegmentCurve(componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changeSegmentCurve', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, expressionToRO(newCurve), metadata)
        return cb()
      })
    })
  }

  changeSegmentCurveActual (componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'changeSegmentCurve',
        params: [
          componentId,
          timelineName,
          propertyName,
          keyframeMs,
          this.getKeyframeCurve(
            componentId,
            timelineName,
            propertyName,
            keyframeMs
          ),
          metadata
        ]
      }

      BytecodeActions.changeSegmentCurve(bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method createKeyframe
   */
  createKeyframe (componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.createKeyframeActual(componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('createKeyframe', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata)
        return cb()
      })
    })
  }

  createKeyframeActual (componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'deleteKeyframe',
        params: [
          componentId,
          timelineName,
          propertyName,
          keyframeStartMs,
          metadata
        ]
      }

      const host = this.getCoreComponentInstance()
      const states = (host && host.getStates()) || {}
      BytecodeActions.createKeyframe(bytecode, componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, host, states)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method deleteKeyframe
   */
  deleteKeyframe (componentId, timelineName, propertyName, keyframeMs, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.deleteKeyframeActual(componentId, timelineName, propertyName, keyframeMs, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('deleteKeyframe', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, metadata)
        return cb()
      })
    })
  }

  deleteKeyframeActual (componentId, timelineName, propertyName, keyframeMs, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'createKeyframe',
        params: [
          componentId,
          timelineName,
          this.getElementNameOfComponentId(componentId),
          propertyName,
          keyframeMs,
          this.getKeyframeValue(
            componentId,
            timelineName,
            propertyName,
            keyframeMs
          ),
          this.getKeyframeCurve(
            componentId,
            timelineName,
            propertyName,
            keyframeMs
          ),
          null, // keyframeEndMs
          null, // keyframeEndValue
          metadata
        ]
      }

      BytecodeActions.deleteKeyframe(bytecode, componentId, timelineName, propertyName, keyframeMs)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method joinKeyframes
   */
  joinKeyframes (componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.joinKeyframesActual(componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('joinKeyframes', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, expressionToRO(newCurve), metadata)
        return cb()
      })
    })
  }

  joinKeyframesActual (componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'splitSegment',
        params: [
          componentId,
          timelineName,
          elementName,
          propertyName,
          keyframeMsLeft,
          metadata
        ]
      }

      BytecodeActions.joinKeyframes(bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method splitSegment
   */
  splitSegment (componentId, timelineName, elementName, propertyName, keyframeMs, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.splitSegmentActual(componentId, timelineName, elementName, propertyName, keyframeMs, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('splitSegment', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMs, metadata)
        return cb()
      })
    })
  }

  splitSegmentActual (componentId, timelineName, elementName, propertyName, keyframeMs, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'joinKeyframes',
        params: [
          componentId,
          timelineName,
          elementName,
          propertyName,
          keyframeMs,
          null, // keyframeMsRight is ignored
          this.getKeyframeCurve(
            componentId,
            timelineName,
            propertyName,
            keyframeMs
          ),
          metadata
        ]
      }

      BytecodeActions.splitSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method moveKeyframes
   */
  moveKeyframes (componentId, timelineName, propertyName, keyframeMoves, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.moveKeyframesActual(componentId, timelineName, propertyName, keyframeMoves, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('moveKeyframes', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMoves, metadata)
        return cb()
      })
    })
  }

  moveKeyframesActual (componentId, timelineName, propertyName, keyframeMoves, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'moveKeyframes',
        params: [
          componentId,
          timelineName,
          propertyName,
          this.invertKeyframeMoves(
            componentId,
            timelineName,
            propertyName,
            keyframeMoves
          ),
          metadata
        ]
      }

      BytecodeActions.moveKeyframes(bytecode, componentId, timelineName, propertyName, keyframeMoves)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method reorderElement
   */
  reorderElement (componentId, componentIdToInsertBefore, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    this.reorderElementActual(componentId, componentIdToInsertBefore, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('reorderElement', this.getSceneCodeRelpath(), componentId, componentIdToInsertBefore, metadata)
        return cb()
      })
    })
  }

  reorderElementActual (componentId, componentIdToInsertBefore, metadata, cb) {
    return cb() // Not yet implemented
  }

  /**
   * @method groupElements
   */
  groupElements (groupSpec, metadata, cb) {
    return cb() // Not yet implemented
  }

  groupElementsActual (groupSpec, metadata, cb) {
    return cb() // Not yet implemented
  }

  /**
   * @method ungroupElements
   */
  ungroupElements (ungroupSpec, metadata, cb) {
    return cb() // Not yet implemented
  }

  ungroupElementsActual (ungroupSpec, metadata, cb) {
    return cb() // Not yet implemented
  }

  /**
   * @method ungroupElements
   */
  hideElements (componentId, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    this.hideElementsActual(componentId, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('hideElements', this.getSceneCodeRelpath(), componentId, metadata)
        return cb()
      })
    })
  }

  hideElementsActual (componentId, metadata, cb) {
    return cb() // Not yet implemented
  }

  /**
   * @method upsertStateValue
   */
  upsertStateValue (stateName, stateDescriptor, metadata, cb) {
    stateDescriptor.edited = true
    return this.upsertStateValueActual(stateName, stateDescriptor, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('upsertStateValue', this.getSceneCodeRelpath(), stateName, stateDescriptor, metadata)
        return cb()
      })
    })
  }

  upsertStateValueActual (stateName, stateDescriptor, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.upsertStateValue(bytecode, stateName, stateDescriptor)
      done()
    }, cb)
  }

  /**
   * @method deleteStateValue
   */
  deleteStateValue (stateName, metadata, cb) {
    return this.deleteStateValueActual(stateName, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('deleteStateValue', this.getSceneCodeRelpath(), stateName, metadata)
        return cb()
      })
    })
  }

  deleteStateValueActual (stateName, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.deleteStateValue(bytecode, stateName)
      done()
    }, cb)
  }

  /**
   * @method zMoveBackward
   */
  zMoveToFront (componentId, timelineName, timelineTime, metadata, cb) {
    this.zMoveToFrontActual(componentId, timelineName, timelineTime, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveToFront', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveToFrontActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      const highestInStack = stackingInfo[stackingInfo.length - 1]
      const highestZ = (highestInStack && highestInStack.zIndex) || 1
      const myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      if (myZ < highestZ) {
        this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': highestZ + 1 }, 'merge')
      }
      done()
    }, cb)
  }

  /**
   * @method zMoveForward
   */
  zMoveForward (componentId, timelineName, timelineTime, metadata, cb) {
    this.zMoveForwardActual(componentId, timelineName, timelineTime, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveForward', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveForwardActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': myZ + 1 })
      done()
    }, cb)
  }

  /**
   * @method zMoveBackward
   */
  zMoveBackward (componentId, timelineName, timelineTime, metadata, cb) {
    this.zMoveBackwardActual(componentId, timelineName, timelineTime, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveBackward', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveBackwardActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      let myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')
      this.upsertProperties(bytecode, componentId, timelineName, timelineTime, { 'style.zIndex': myZ - 1 })
      done()
    }, cb)
  }

  /**
   * @method zMoveToBack
   */
  zMoveToBack (componentId, timelineName, timelineTime, metadata, cb) {
    this.zMoveToBackActual(componentId, timelineName, timelineTime, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveToBack', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveToBackActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      const lowestZ = (stackingInfo[0] && stackingInfo[0].zIndex) || 1
      const myZ = this.getComputedPropertyValue(mana, componentId, timelineName, timelineTime, 'style.zIndex')

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

  /**
   * @method createTimeline
   */
  createTimeline (timelineName, timelineDescriptor, metadata, cb) {
    return this.createTimelineActual(timelineName, timelineDescriptor, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('createTimeline', this.getSceneCodeRelpath(), timelineName, timelineDescriptor, metadata)
        return cb()
      })
    })
  }

  createTimelineActual (timelineName, timelineDescriptor, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'deleteTimeline',
        params: [timelineName, metadata]
      }

      BytecodeActions.createTimeline(bytecode, timelineName, timelineDescriptor)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method renameTimeline
   */
  renameTimeline (timelineNameOld, timelineNameNew, metadata, cb) {
    return this.renameTimelineActual(timelineNameOld, timelineNameNew, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('renameTimeline', this.getSceneCodeRelpath(), timelineNameOld, timelineNameNew, metadata)
        return cb()
      })
    })
  }

  renameTimelineActual (timelineNameOld, timelineNameNew, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: ['renameTimeline'],
        params: [timelineNameNew, timelineNameOld, metadata]
      }

      BytecodeActions.renameTimeline(bytecode, timelineNameOld, timelineNameNew)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method deleteTimeline
   */
  deleteTimeline (timelineName, metadata, cb) {
    return this.deleteTimelineActual(timelineName, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('deleteTimeline', this.getSceneCodeRelpath(), timelineName, metadata)
        return cb()
      })
    })
  }

  deleteTimelineActual (timelineName, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const doable = {
        method: 'createTimeline',
        params: [timelineName, this.getTimelineDescriptor(timelineName), metadata]
      }

      BytecodeActions.deleteTimeline(bytecode, timelineName)

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method duplicateTimeline
   */
  duplicateTimeline (timelineName, metadata, cb) {
    return this.duplicateTimelineActual(timelineName, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('duplicateTimeline', this.getSceneCodeRelpath(), timelineName, metadata)
        return cb()
      })
    })
  }

  duplicateTimelineActual (timelineName, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const duplicateTimelineName = BytecodeActions.duplicateTimeline(bytecode, timelineName)

      const doable = {
        method: 'deleteTimeline',
        params: [duplicateTimelineName, metadata]
      }

      done(null, null, doable)
    }, cb)
  }

  /**
   * @method changePlaybackSpeed
   */
  changePlaybackSpeed (framesPerSecond, metadata, cb) {
    return this.changePlaybackSpeedActual(framesPerSecond, metadata, (err) => {
      if (err) {
        logger.error(`[active component (${this.project.getAlias()})]`, err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changePlaybackSpeed', this.getSceneCodeRelpath(), framesPerSecond, metadata)
        return cb()
      })
    })
  }

  changePlaybackSpeedActual (framesPerSecond, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      BytecodeActions.changePlaybackSpeed(bytecode, framesPerSecond)
      done()
    }, cb)
  }

  /**
   * @method dump
   * @description When debugging, use this to log a concise shorthand of this entity.
   */
  dump () {
    const relpath = this.getSceneCodeRelpath()
    const aid = this.getArtboard().getElementHaikuId()
    return `${relpath}(${this.getMount().getRenderId()})@${aid}/${this._interactionMode}`
  }

  /**
   * @method serialize
   * @description Return a snapshot of the current source code for this component.
   * TODO: Is serialize a misnomer here? Maybe just `toCode()` would be better?
   */
  serialize () {
    return Bytecode.bytecodeToCode(this.getSerializedBytecode())
  }
}

ActiveComponent.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    project: true
  }
}

BaseModel.extend(ActiveComponent)

ActiveComponent.buildPrimaryKey = (folder, scenename) => {
  return folder + '::' + scenename
}

module.exports = ActiveComponent

// Down here to avoid Node circular dependency stub objects. #FIXME
const Artboard = require('./Artboard')
const Design = require('./Design')
const Element = require('./Element')
const File = require('./File')
const Keyframe = require('./Keyframe')
const ModuleWrapper = require('./ModuleWrapper')
const MountElement = require('./MountElement')
const Primitive = require('./Primitive')
const Row = require('./Row')
const SelectionMarquee = require('./SelectionMarquee')
const Template = require('./Template')
const Timeline = require('./Timeline')
