const path = require('path')
const lodash = require('lodash')
const raf = require('raf')
const pretty = require('pretty')
const async = require('async')
const mergeTimelineStructure = require('haiku-bytecode/src/mergeTimelineStructure')
const expressionToRO = require('@haiku/player/lib/reflection/expressionToRO').default
const HaikuDOMAdapter = require('@haiku/player/lib/adapters/dom').default
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const { InteractionMode, isPreviewMode } = require('@haiku/player/lib/helpers/interactionModes')
const initializeComponentTree = require('@haiku/player/lib/helpers/initializeComponentTree').default
const Layout3D = require('@haiku/player/lib/Layout3D').default
const BaseModel = require('./BaseModel')
const Bytecode = require('./Bytecode')
const log = require('./helpers/log')
const getDefinedKeys = require('./helpers/getDefinedKeys')
const toTitleCase = require('./helpers/toTitleCase')
const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')

const KEYFRAME_MOVE_DEBOUNCE_TIME = 500

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const DEFAULT_SCENE_NAME = 'main' // e.g. code/main/*
const DEFAULT_INTERACTION_MODE = InteractionMode.EDIT

/**
 * @class ActiveComponent
 * @description
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

    // Collection of instances of a @haiku/player/src/HaikuComponent
    // currently present across multiple editing context on stage
    this.instancesOfHaikuPlayerComponent = []

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

    this.project.addActiveComponentToRegistry(this)

    // Used to control how we render in an editing environment, e.g. preview mode
    this._interactionMode = DEFAULT_INTERACTION_MODE

    this.project.upsertFile({
      relpath: this.getSceneCodeRelpath(),
      type: File.TYPES.code
    })

    Element.on('element:copy', (element) => {
      if (element.component === this) {
        this.emit('element:copy', element)
      }
    })

    Element.on('update', (element, what, metadata) => {
      if (element.component === this) {
        if (what === 'element-selected') {
          this.handleElementSelected(element.getComponentId(), metadata)
        } else if (what === 'element-unselected') {
          this.handleElementUnselected(element.getComponentId(), metadata)
        } else if (what === 'jit-property-added' || what === 'jit-property-removed') {
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

    // Since property group updates happen quickly, we batch them together.
    // Note that when we receive a series of applyPropertyGroupDelta calls,
    // those end up summed together into a single applyPropertyGroupValue call.
    this._propertyGroupBatches = {}

    this.debouncedSendPropertyGroupUpdates = lodash.debounce(() => {
      const groupBatches = this._propertyGroupBatches
      this._propertyGroupBatches = {}

      lodash.each(groupBatches, ({ componentId, timelineName, timelineTime, groupValue }) => {
        this.project.transmitAction(
          'applyPropertyGroupValue',
          this.getSceneCodeRelpath(),
          componentId,
          timelineName,
          timelineTime,
          groupValue
        )
      })
    }, 100, { trailing: true })

    // Debounced version of the keyframe move action handler
    this.debouncedKeyframeMoveAction = lodash.debounce(
      this.keyframeMoveAction.bind(this),
      KEYFRAME_MOVE_DEBOUNCE_TIME
    )
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
    const canonicalPlayerInstance = this.getPlayerComponentInstance()

    // In case we get called before fully initialized, e.g. on stage during first load
    if (!canonicalPlayerInstance) {
      return 0
    }

    const canonicalPlayerTimeline = canonicalPlayerInstance.getTimeline(this.getCurrentTimelineName())

    // This should never happen, but just in case, fallback to 0 if no timeline with this name
    if (!canonicalPlayerTimeline) {
      return 0
    }

    const controlledTime = canonicalPlayerTimeline.getControlledTime()

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
    return File.findById(path.join(this.project.getFolder(), this.getSceneCodeRelpath()))
  }

  getActiveInstancesOfHaikuPlayerComponent () {
    return this.instancesOfHaikuPlayerComponent.filter((instance) => {
      return !instance.isDeactivated()
    })
  }

  getAllInstancesOfHaikuPlayerComponent () {
    return this.instancesOfHaikuPlayerComponent
  }

  forceFlush () {
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
      instance._markForFullFlush(true)
      // This guard is to allow headless mode, e.g. in Haiku's timeline application
      if (instance._context && instance._context.tick) {
        instance._context.tick()
      }
    })
  }

  clearCaches (options) {
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
      instance.clearCaches(options) // Also clears instance._builder sub-caches
    })
    this.clearEntityCaches()
    return this
  }

  clearCachedClusters (timelineName, componentId) {
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
      instance._builder._clearCachedClusters(timelineName, componentId)
    })
    return this
  }

  updateTimelineMaxes (timelineName) {
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
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
      this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
        if (instance._context && instance._context.tick) {
          instance._context.tick(true)
        }
      })
    }
  }

  setTimelineName (timelineName, metadata, cb) {
    log.info('[active component] changing active timeline to ' + timelineName)
    Timeline.setCurrent({ component: this }, timelineName)
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
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

  selectElement (componentId, metadata, cb) {
    // Assuming the update occurs remotely, we want to unselect everything but the selected one
    Element.unselectAllElements({ component: this }, metadata)

    const element = Element.findByComponentAndHaikuId(this, componentId)

    if (element) {
      element.select(metadata)

      const row = element.getHeadingRow()

      if (row) {
        row.expand(metadata)
      }
    }

    return cb() // Must return or the plumbing action circuit never completes
  }

  unselectElement (componentId, metadata, cb) {
    const element = Element.findByComponentAndHaikuId(this, componentId)

    if (element) {
      element.unselect(metadata)
    }

    return cb() // Must return or the plumbing action circuit never completes
  }

  gitUndo (options, metadata, cb) {
    return cb()
  }

  gitRedo (options, metadata, cb) {
    return cb()
  }

  isPreviewModeActive () {
    return isPreviewMode(this._interactionMode)
  }

  /**
  * @method setInteractionMode
  * @description Changes the current interaction mode and flushes all cachés
  */
  setInteractionMode (interactionMode, metadata, cb) {
    this._interactionMode = interactionMode

    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
      instance.assignConfig({
        options: {
          interactionMode: interactionMode,
          // Disable hot editing mode during preview mode for smooth playback.
          hotEditingMode: !this.isPreviewModeActive()
        }
      })
    })

    this.softReload({}, {}, () => {
      this.project.updateHook('setInteractionMode', this.getSceneCodeRelpath(), this._interactionMode, metadata)
      return cb()
    })
  }

  setHotEditingMode (hotEditingMode) {
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
      instance.assignConfig({ options: { hotEditingMode } })
    })
  }

  createComponentFromElements (elements, metadata, cb) {
    if (elements.length < 1) return cb()

    this.codeReloadingOn()

    const finish = (err, arg) => {
      this.codeReloadingOff()

      if (err) {
        log.error(err)
        return cb(err)
      }

      return cb(null, arg)
    }

    const artboardElement = this.getArtboard().getElement()
    const artboardTranslation = {
      x: (artboardElement && artboardElement.getPropertyValue('translation.x')) || 0,
      y: (artboardElement && artboardElement.getPropertyValue('translation.y')) || 0
    }

    const points = Element.getBoundingBoxPointsForElements(elements)

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
    const template = this.fetchActiveBytecodeFile().getReifiedBytecode().template
    return Template.getInsertionPointHash(template, 0, 0)
  }

  /**
   * @method getInstantiationCoords
   * @description Given artboard-relative position data, return the x,y coords
   * where the element would be instantiated within the artboard on our stage,
   * accounting for the appropriate zoom level and page offset
   * @param posdata {Object|null} x,y coordinates of instantiation
   */
  getInstantiationCoords (posdata) {
    const coords = {
      x: 0,
      y: 0
    }

    if (posdata.x !== undefined) coords.x = posdata.x
    if (posdata.y !== undefined) coords.y = posdata.y
    if (posdata.minimized) coords.minimized = posdata.minimized

    const bounds = this.getMount().getBoundingClientRect()
    if (bounds) {
      if (posdata.offsetX) coords.x = posdata.offsetX - bounds.left
      if (posdata.offsetY) coords.y = posdata.offsetY - bounds.top
    }

    coords.x *= 1 / this.getArtboard().getZoom()
    coords.y *= 1 / this.getArtboard().getZoom()

    return coords
  }

  instantiateElement (element, propertyGroupToApply, metadata, cb) {
    const bytecode = element.getQualifiedBytecode()
    return this.instantiateBytecode(bytecode, propertyGroupToApply, metadata, cb)
  }

  instantiateBytecode (incomingBytecode, propertyGroupToApply, metadata, cb) {
    return this.fetchActiveBytecodeFile().performComponentWork((existingBytecode, existingTemplate, done) => {
      const insertionPointHash = Template.getInsertionPointHash(existingTemplate, existingTemplate.children.length, 0)

      Bytecode.padIds(incomingBytecode, (oldId) => {
        return Template.getHash(`${oldId}-${insertionPointHash}`, 12)
      })

      const componentId = incomingBytecode.template.attributes[HAIKU_ID_ATTRIBUTE]
      const timelineName = this.getInstantiationTimelineName()
      const timelineTime = this.getInstantiationTimelineTime()

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

      return this.zMoveToFront(componentId, timelineName, timelineTime, metadata, (err) => {
        if (err) return done(err)
        return done(null, incomingBytecode.template)
      })
    }, cb)
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
      const ours = this.getPlayerComponentInstance()

      // Assume the last component instantiated of their type
      const theirs = subcomponent && subcomponent.getPlayerComponentInstance()

      initializeComponentTree(manaForWrapperElement, ours, ours._context, theirs)

      return this.instantiateMana(manaForWrapperElement, overrides, coords, metadata, cb)
    })
  }

  getPlayerComponentInstance () {
    const haikuPlayerComponentInstances = this.getActiveInstancesOfHaikuPlayerComponent()
    return haikuPlayerComponentInstances[haikuPlayerComponentInstances.length - 1]
  }

  eachPlayerComponentInstance (iteratee) {
    const haikuPlayerComponentInstances = this.getActiveInstancesOfHaikuPlayerComponent()
    return haikuPlayerComponentInstances.forEach(iteratee)
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
    return this.fetchActiveBytecodeFile().performComponentWork((bytecode, template, done) => {
      const insertionPointHash = Template.getInsertionPointHash(template, template.children.length, 0)

      const timelineName = this.getInstantiationTimelineName()
      const timelineTime = this.getInstantiationTimelineTime()

      const timelinesObject = Template.prepareManaAndBuildTimelinesObject(
        mana,
        insertionPointHash,
        timelineName,
        timelineTime,
        { doHashWork: true }
      )

      const componentId = mana.attributes[HAIKU_ID_ATTRIBUTE]

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

      return this.zMoveToFront(componentId, timelineName, timelineTime, metadata, (err) => {
        if (err) return done(err)
        return done(null, mana)
      })
    }, (err) => {
      if (err) return cb(err)
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

      if (maybeCoords.minimized) {
        // calculate the smallest scale value to make width/height < 1 pixel
        propertyGroup['scale.x'] = 1 / instantiateeWidth
        propertyGroup['scale.y'] = 1 / instantiateeHeight
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
   * @param posdata {Object} Optional position of the instantiatee
   * @param metadata {Object} Signal metadata
   * @param cb {Function}
   */
  instantiateComponent (relpath, posdata, metadata, cb) {
    const coords = this.getInstantiationCoords(posdata)

    // Since there are a few pathways to account for, the callback is defined up here
    const finish = (err, manaForWrapperElement) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: true }, null, () => {
        this.selectElement(manaForWrapperElement.attributes[HAIKU_ID_ATTRIBUTE], metadata, () => {
          this.project.updateHook(
            'instantiateComponent',
            this.getSceneCodeRelpath(),
            relpath,
            posdata,
            metadata
          )

          cb(null, { center: coords }, manaForWrapperElement)
        })
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
  }

  deleteComponent (componentId, metadata, cb) {
    return this.fetchActiveBytecodeFile().performComponentWork((bytecode, mana, done) => {
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
      done()
    }, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }
      return this.reload({ hardReload: true }, null, () => {
        this.project.updateHook('deleteComponent', this.getSceneCodeRelpath(), componentId, metadata)
        return cb()
      })
    })
  }

  mergePrimitiveWithOverrides (primitive, overrides, cb) {
    return this.fetchActiveBytecodeFile().performComponentWork((bytecode, template, done) => {
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

  mergeMana (destinationTimelines, existingTemplate, manaIncoming) {
    let numMatchingNodes = 0

    Template.visit((existingTemplate), (existingNode) => {
      // Only merge into any that match our source design path
      if (existingNode.attributes.source !== manaIncoming.attributes.source) {
        return
      }

      const safe = Template.clone({}, manaIncoming)

      Template.mirrorHaikuUids(existingNode, safe)

      const insertionPointHash = Template.getInsertionPointHash(existingNode, existingNode.children.length, numMatchingNodes++)

      const timelineName = this.getMergeDesignTimelineName()
      const timelineTime = this.getMergeDesignTimelineTime()

      const timelinesObject = Template.prepareManaAndBuildTimelinesObject(
        safe,
        insertionPointHash,
        timelineName,
        timelineTime,
        { doHashWork: true }
      )

      const changesMade = Bytecode.mergeTimelines(destinationTimelines, timelinesObject, (propertyName, oldValue, newValue) => {
        if (typeof oldValue === 'string' && typeof newValue === 'string') {
          // HACK: Changing URL reference breaks the reference since our merge doesn't affect
          //       the structure of the element (TODO: Support merging structural changes too)
          if (oldValue.slice(0, 5) === 'url(#') {
            return false
          }
          // HACK: Related to the above; changing references essentially means breaking them
          if (propertyName === 'xlink:href') {
            return false
          }
        }

        return true
      })

      if (changesMade.length > 0) {
        log.info(
          `[active component] ${existingNode.attributes.source} merged design changes`,
          JSON.stringify(changesMade)
        )
      }
    })
  }

  mergeDesignFiles (designs, cb) {
    return this.fetchActiveBytecodeFile().performComponentWork((bytecode, template, done) => {
      return async.eachOf(designs, (truthy, relpath, next) => {
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

                this.mergeMana(bytecode.timelines, template, mana)
                return next()
              })
            } else {
              this.mergeMana(bytecode.timelines, template, mana)
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
    // Since several designs are merged, and that process occurs async, we can get into a situation
    // where individual fragments are inserted but their parent layouts have not been appropriately
    // populated. To fix this, we wait to do any rendering until this whole process has finished
    this.codeReloadingOn()

    this.mergeDesignFiles(designs, (err) => {
      // Now that we've finalized (or errored) the update, we can resume since we have no orphan fragments
      this.codeReloadingOff()

      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: true }, null, () => {
        this.project.updateHook('mergeDesigns', this.getSceneCodeRelpath(), designs, metadata)
        return cb()
      })
    })
  }

  applyPropertyGroupValue (componentId, timelineName, timelineTime, propertyGroup, metadata, cb) {
    this.fetchActiveBytecodeFile().applyPropertyGroupValue(componentId, timelineName, timelineTime, propertyGroup, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        if (this.project.isLocalUpdate(metadata)) {
          this.batchPropertyGroupUpdate(componentId, this.getCurrentTimelineName(), this.getCurrentTimelineTime(), getDefinedKeys(propertyGroup))
        }
        return cb()
      })
    })
  }

  applyPropertyGroupDelta (componentId, timelineName, timelineTime, propertyGroup, metadata, cb) {
    this.fetchActiveBytecodeFile().applyPropertyGroupDelta(componentId, timelineName, timelineTime, propertyGroup, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      this.reload({
        hardReload: this.project.isRemoteRequest(metadata),
        // If we're doing rotation, then we really *really* need to make sure we do a full flush.
        // In production mode, rotation is handled normally, but as we do live editing, we lose
        // 'determinism' on rotation if we update the property piecemeal, because the quaternion
        // calc depends on passing in and mutating the previous output. This is a bug we should
        // try to address better in the future, but for now, this seems an 'all right' way to fix.
        onlyForceFlushIf: Property.doesPropertyGroupContainRotation(propertyGroup),
        clearCacheOptions: {
          clearStates: false,
          clearEventHandlers: false,
          clearOnlySpecificProperties: {
            componentId: componentId,
            timelineName: timelineName,
            timelineTime: timelineTime,
            propertyKeys: getDefinedKeys(propertyGroup)
          }
        }
      }, null, () => {
        if (this.project.isLocalUpdate(metadata)) {
          this.batchPropertyGroupUpdate(componentId, this.getCurrentTimelineName(), this.getCurrentTimelineTime(), getDefinedKeys(propertyGroup))
        }

        return cb()
      })
    })
  }

  getContextSize () {
    const file = this.fetchActiveBytecodeFile()
    // In case of race where file isn't ready yet
    if (file) {
      return file.getContextSize(this.getCurrentTimelineName(), this.getCurrentTimelineTime())
    }
    return { width: 1, height: 1 }
  }

  resizeContext (artboardId, timelineName, timelineTime, sizeDescriptor, metadata, cb) {
    this.fetchActiveBytecodeFile().resizeContext(artboardId, timelineName, timelineTime, sizeDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.emitHook('resizeContext', this.getSceneCodeRelpath(), artboardId, timelineName, timelineTime, sizeDescriptor, metadata)
        if (this.project.isLocalUpdate(metadata)) {
          this.batchPropertyGroupUpdate(artboardId, timelineName, timelineTime, ['sizeAbsolute.x', 'sizeAbsolute.y'])
        }
        return cb()
      })
    })
  }

  changePlaybackSpeed (framesPerSecond, metadata, cb) {
    return this.fetchActiveBytecodeFile().changePlaybackSpeed(framesPerSecond, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changePlaybackSpeed', this.getSceneCodeRelpath(), framesPerSecond, metadata)
        return cb()
      })
    })
  }

  changeKeyframeValue (componentId, timelineName, propertyName, keyframeMs, newValue, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().changeKeyframeValue(componentId, timelineName, propertyName, keyframeMs, newValue, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changeKeyframeValue', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, newValue, metadata)
        return cb()
      })
    })
  }

  joinKeyframes (componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().joinKeyframes(componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('joinKeyframes', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, expressionToRO(newCurve), metadata)
        return cb()
      })
    })
  }

  changeSegmentCurve (componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().changeSegmentCurve(componentId, timelineName, propertyName, keyframeMs, newCurve, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changeSegmentCurve', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, expressionToRO(newCurve), metadata)
        return cb()
      })
    })
  }

  changeSegmentEndpoints (componentId, timelineName, propertyName, oldMs, newMs, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().changeSegmentEndpoints(componentId, timelineName, propertyName, oldMs, newMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('changeSegmentEndpoints', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, oldMs, newMs, metadata)
        return cb()
      })
    })
  }

  createKeyframe (componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().createKeyframe(componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('createKeyframe', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata)
        return cb()
      })
    })
  }

  deleteKeyframe (componentId, timelineName, propertyName, keyframeMs, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().deleteKeyframe(componentId, timelineName, propertyName, keyframeMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('deleteKeyframe', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, metadata)
        return cb()
      })
    })
  }

  createTimeline (timelineName, timelineDescriptor, metadata, cb) {
    return this.fetchActiveBytecodeFile().createTimeline(timelineName, timelineDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('createTimeline', this.getSceneCodeRelpath(), timelineName, timelineDescriptor, metadata)
        return cb()
      })
    })
  }

  deleteTimeline (timelineName, metadata, cb) {
    return this.fetchActiveBytecodeFile().deleteTimeline(timelineName, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('deleteTimeline', this.getSceneCodeRelpath(), timelineName, metadata)
        return cb()
      })
    })
  }

  duplicateTimeline (timelineName, metadata, cb) {
    return this.fetchActiveBytecodeFile().duplicateTimeline(timelineName, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('duplicateTimeline', this.getSceneCodeRelpath(), timelineName, metadata)
        return cb()
      })
    })
  }

  renameTimeline (timelineNameOld, timelineNameNew, metadata, cb) {
    return this.fetchActiveBytecodeFile().renameTimeline(timelineNameOld, timelineNameNew, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('renameTimeline', this.getSceneCodeRelpath(), timelineNameOld, timelineNameNew, metadata)
        return cb()
      })
    })
  }

  moveSegmentEndpoints (componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().moveSegmentEndpoints(componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('moveSegmentEndpoints', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo, metadata)
        return cb()
      })
    })
  }

  moveKeyframes (componentId, timelineName, propertyName, keyframeMoves, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().moveKeyframes(componentId, timelineName, propertyName, keyframeMoves, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('moveKeyframes', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMoves, metadata)
        return cb()
      })
    })
  }

  sliceSegment (componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().sliceSegment(componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('sliceSegment', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMs, sliceMs, metadata)
        return cb()
      })
    })
  }

  splitSegment (componentId, timelineName, elementName, propertyName, keyframeMs, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    return this.fetchActiveBytecodeFile().splitSegment(componentId, timelineName, elementName, propertyName, keyframeMs, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('splitSegment', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMs, metadata)
        return cb()
      })
    })
  }

  zMoveToFront (componentId, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveToFront(componentId, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveToFront', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveForward (componentId, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveForward(componentId, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveForward', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveBackward (componentId, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveBackward(componentId, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveBackward', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  zMoveToBack (componentId, timelineName, timelineTime, metadata, cb) {
    this.fetchActiveBytecodeFile().zMoveToBack(componentId, timelineName, timelineTime, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('zMoveToBack', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata)
        return cb()
      })
    })
  }

  reorderElement (componentId, componentIdToInsertBefore, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    this.fetchActiveBytecodeFile().reorderElement(componentId, componentIdToInsertBefore, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('reorderElement', this.getSceneCodeRelpath(), componentId, componentIdToInsertBefore, metadata)
        return cb()
      })
    })
  }

  groupElements (groupSpec, metadata, cb) {
    return cb() // Not yet implemented
  }

  ungroupElements (ungroupSpec, metadata, cb) {
    return cb() // Not yet implemented
  }

  hideElements (componentId, metadata, cb) {
    this.clearCachedClusters(this.getCurrentTimelineName(), componentId)
    this.fetchActiveBytecodeFile().hideElements(componentId, metadata, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('hideElements', this.getSceneCodeRelpath(), componentId, metadata)
        return cb()
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
    let newHaikuId = ''
    this.fetchActiveBytecodeFile().performComponentWork((bytecode, mana, done) => {
      switch (pasteable.kind) {
        case 'bytecode':
          // As usual, we use a hash rather than randomness because of multithreading
          const hash = Template.getInsertionPointHash(mana, mana.children.length, 0)

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

          return done(null, {haikuId: newHaikuId})
        default:
          log.warn('[active component] cannot paste clipboard contents of kind ' + pasteable.kind)
          return done(new Error('Unable to paste clipboard contents'))
      }
    }, (err, data) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: true }, null, () => {
        this.project.updateHook('pasteThing', this.getSceneCodeRelpath(), pasteable, request, metadata)
        return cb(null, data)
      })
    })
  }

  /**
   * @method deleteThing
   * @description Flexibly delete some content. Usually the thing deleted is going to be a
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

      return this.reload({ hardReload: true }, null, () => {
        this.project.updateHook('deleteThing', this.getSceneCodeRelpath(), deletable, metadata)
        return cb()
      })
    })
  }

  /**
   * @method upsertStateValue
   */
  upsertStateValue (stateName, stateDescriptor, metadata, cb) {
    stateDescriptor.edited = true
    return this.fetchActiveBytecodeFile().upsertStateValue(stateName, stateDescriptor, (err) => {
      if (err) {
        log.error(err)
        return cb(err)
      }

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('upsertStateValue', this.getSceneCodeRelpath(), stateName, stateDescriptor, metadata)
        return cb()
      })
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

      return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
        this.project.updateHook('deleteStateValue', this.getSceneCodeRelpath(), stateName, metadata)
        return cb()
      })
    })
  }

  /**
   * @method upsertEventHandler
   */
  upsertEventHandler (selectorName, eventName, handlerDescriptor, metadata, cb) {
    handlerDescriptor.edited = true
    return this.fetchActiveBytecodeFile().upsertEventHandler(selectorName, eventName, handlerDescriptor, (err) => {
      if (err) {
        log.error(err)
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

  /**
   * @method batchUpsertEventHandlers
   */
  batchUpsertEventHandlers (selectorName, serializedEvents, metadata, cb) {
    return this.fetchActiveBytecodeFile().batchUpsertEventHandlers(selectorName, serializedEvents, (err) => {
      if (err) {
        log.error(err)
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

  /**
   * @method deleteEventHandler
   */
  deleteEventHandler (selectorName, eventName, metadata, cb) {
    return this.fetchActiveBytecodeFile().deleteEventHandler(selectorName, eventName, (err) => {
      if (err) {
        log.error(err)
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

  /**
   * @method readAllEventHandlers
   */
  readAllEventHandlers (metadata, cb) {
    return this.fetchActiveBytecodeFile().readAllEventHandlers(cb)
  }

  /**
   * @method readAllStateValues
   */
  readAllStateValues (metadata, cb) {
    return this.fetchActiveBytecodeFile().readAllStateValues(cb)
  }

  getMount () {
    return this.mount
  }

  getArtboard () {
    return this.artboard
  }

  /** ------------ */
  /** ------------ */
  /** ------------ */

  reload (reloadOptions, instanceConfig, finish) {
    if (reloadOptions.hardReload) {
      // Also calls softReload
      return this.hardReload(reloadOptions, instanceConfig, (err) => {
        if (err) return finish(err)
        this.emit('update', 'reloaded', 'hard')
        return finish()
      })
    } else {
      return this.softReload(reloadOptions, instanceConfig, (err) => {
        if (err) return finish(err)
        this.emit('update', 'reloaded', 'soft')
        return finish()
      })
    }
  }

  hardReload (reloadOptions, instanceConfig, finish) {
    const timelineTimeBeforeReload = this.getCurrentTimelineTime() || 0

    const haikuPlayerComponentInstances = this.getActiveInstancesOfHaikuPlayerComponent()

    return async.series([
      (cb) => {
        // Stop the clock so we don't continue any animations while this update is happening
        haikuPlayerComponentInstances.forEach((instance) => {
          instance._context.clock.stop()
        })

        return cb()
      },

      (cb) => {
        if (!reloadOptions.fileReload) {
          return cb()
        }

        // If no instances, we need to populate at least one for everything to work
        if (haikuPlayerComponentInstances.length < 1) {
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
          this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
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
      this.getActiveInstancesOfHaikuPlayerComponent().forEach((existingActiveInstance) => {
        this.replaceInstance(existingActiveInstance, reifiedBytecode, instanceConfig)
      })
      return cb()
    })
  }

  moduleCreate (instanceConfig, cb) {
    return this.fetchActiveBytecodeFile().mod.configuredReload(instanceConfig, (err) => {
      if (err) return cb(err)
      this.fetchActiveBytecodeFile().reinitializeBytecode(null) // Ensure we have ids, a template, etc.
      const reifiedBytecode = this.getReifiedBytecode()
      const createdHaikuPlayerComponent = this.createInstance(reifiedBytecode, instanceConfig)
      this.addInstanceOfHaikuPlayerComponent(createdHaikuPlayerComponent)
      return cb()
    })
  }

  addInstanceOfHaikuPlayerComponent (instanceGiven) {
    let foundInstance = false

    const allInstances = this.getAllInstancesOfHaikuPlayerComponent()

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

  updateBytecodeFileWthInstance (haikuPlayerComponent) {
    // Update a bunch of pointers necessary for the bytecode file to work propertly
    const bytecodeFile = this.fetchActiveBytecodeFile()
    bytecodeFile.setHostInstance(haikuPlayerComponent)
    bytecodeFile.hostInstance = haikuPlayerComponent
    this.fetchActiveBytecodeFile().reinitializeBytecode(null)
  }

  createInstance (bytecode, config) {
    const factory = HaikuDOMAdapter(bytecode, null, null)

    const createdHaikuPlayerComponent = factory(this.getMount().$el(), lodash.merge({}, {
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
    createdHaikuPlayerComponent._doesEmitEventsVerbosely = true

    this.updateBytecodeFileWthInstance(createdHaikuPlayerComponent)

    return createdHaikuPlayerComponent
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

    this.updateBytecodeFileWthInstance(freshInstance)

    // Discard the old (deactivated) instance and subsume it with this one
    // Note that here we are iterating over the entire collection, not just the active ones
    const allKnownInstances = this.getAllInstancesOfHaikuPlayerComponent()
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

    return this.softReloadInstantiatedSubcomponents(reloadOptions, cb)
  }

  getInstantiatedActiveComponents () {
    const activeComponents = {}
    for (const haikuId in this.instantiatedSubcomponentElements) {
      const subcomponentElement = this.instantiatedSubcomponentElements[haikuId]

      // In Node (i.e. Master) this isn't going to exist, so we can just skip it
      // TODO: Should we warn here?
      if (subcomponentElement && subcomponentElement.__instance) {
        const haikuPlayerComponent = subcomponentElement.__instance
        const activeComponent = haikuPlayerComponent.__activeComponent
        // When we initially hydrate the project, these aren't ready yet - there's nothing
        // to initially reload because the player components haven't started yet, so we
        // skip this step and will take care of it later when it 'matters'
        if (activeComponent) {
          activeComponents[activeComponent.getPrimaryKey()] = activeComponent
        }
      }
    }
    return Object.values(activeComponents)
  }

  softReloadInstantiatedSubcomponents (reloadOptions, cb) {
    const activeComponents = this.getInstantiatedActiveComponents()
    return async.each(activeComponents, (activeComponent, next) => {
      // Just in case one of ourselves is nested inside us, avoid an infinite loop
      if (activeComponent === this) return next()
      return activeComponent.softReload(reloadOptions, {}, next)
    }, cb)
  }

  /**
   * @method mountApplication
   * @description Given an *optional* DOM element to mount, load the component and boostrap it inside the mount.
   * If no mount is provided (i.e. in non-DOM contexts) this method can also be used if you just want to reload
   * the data for the component instead of actually displaying it. This is used by the Timeline but also nominally
   * by the Glass.
   */
  mountApplication ($el, instanceConfig, cb) {
    this.getMount().remountInto($el)

    this.codeReloadingOn()

    return this.reload({ hardReload: true, fileReload: true }, instanceConfig, (err) => {
      this.codeReloadingOff()

      if (err) {
        log.error(err)
        this.emit('error', err)
        if (cb) return cb(err)
        return null
      }

      this._isMounted = true
      this.emit('update', 'application-mounted')

      if (cb) return cb()
      return null
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
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
      instance.sleepOn()
    })
  }

  sleepComponentsOff () {
    this.getActiveInstancesOfHaikuPlayerComponent().forEach((instance) => {
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
    this.codeReloadingOn()

    return this.reload({ hardReload: true, fileReload: true }, null, (err) => {
      this.codeReloadingOff()

      if (err) {
        log.error(err)
        return this.emit('error', err)
      }

      return cb()
    })
  }

  rehydrate () {
    // If you want to call 'rehydrateFromTree' from the top, remember to reset this to 0.
    this._numrows = 0

    // We use this to help purge elements have been removed since the previous run.
    this._timestamp = Date.now()

    // This is required before running the 'rehydrateFromTree' method; entities need the timeline
    this.upsertCurrentTimeline()

    this.rehydrateFromTree(this.getReifiedBytecode().template, null, null, null, 0, 0, 0, '0')

    this.purgeStaleEntities(this._timestamp)
  }

  clearEntityCaches () {
    this.getRows().forEach((row) => {
      row.cacheClear()
    })
    this.getKeyframes().forEach((keyframe) => {
      keyframe.cacheClear()
    })
    this.getElements().forEach((element) => {
      element.cacheClear()
    })
    return this
  }

  purgeStaleEntities (timestamp) {
    this.getRows().filter((row) => row.timestamp < timestamp).forEach((row) => row.destroy())
    this.getKeyframes().filter((kf) => kf.timestamp < timestamp).forEach((kf) => kf.destroy())
    this.getElements().filter((el) => el.timestamp < timestamp).forEach((el) => el.destroy())
    return this
  }

  rehydrateFromTree (virtualNode, virtualParent, parentElement, parentElementRow, rowIndex, rowDepth, indexInParent, graphAddress) {
    // We need to pass ourselves in as a selection criteria since there may be elements with the same id already
    const element = Element.upsertElementFromVirtualElement({ component: this }, this, virtualNode, parentElement, indexInParent, graphAddress, false)

    const elementHeadingRow = Row.upsert({
      timestamp: this._timestamp,
      uid: Row.buildHeadingUid(this, element),
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
    }, {})

    // Expand the top row by default, only if this is the first run
    if (elementHeadingRow.place === 0 && !elementHeadingRow._wasInitiallyExpanded) {
      elementHeadingRow._isExpanded = true
      elementHeadingRow._wasInitiallyExpanded = true
    }

    if (parentElementRow) {
      parentElementRow.addChild(elementHeadingRow)
    }

    const addressableProperties = element.getDisplayedAddressableProperties()

    const clustersUpserted = {}

    for (let addressableName in addressableProperties) {
      let propertyGroupDescriptor = addressableProperties[addressableName]

      if (propertyGroupDescriptor.cluster) {
        // Properties that are 'clustered', like rotation.x,y,z
        const clusterId = Row.buildClusterUid(this, element, propertyGroupDescriptor)
        let clusterRow

        // This check is just to make sure we get a correct number for the row index
        if (clustersUpserted[clusterId]) {
          clusterRow = Row.findById(clusterId)
        } else {
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
          }, {})
          elementHeadingRow.addChild(clusterRow)
          clustersUpserted[clusterId] = {}
        }

        const clusterMember = Row.upsert({
          timestamp: this._timestamp,
          uid: Row.buildClusterMemberUid(this, element, propertyGroupDescriptor, addressableName),
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
        }, {})

        clustersUpserted[clusterId][propertyGroupDescriptor.name] = true

        this.rehydrateKeyframes(clusterMember)
        clusterRow.addChild(clusterMember)
      } else {
        // Properties represented as a single row, like 'opacity'
        const propertyRow = Row.upsert({
          timestamp: this._timestamp,
          uid: Row.buildPropertyUid(this, element, addressableName),
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
        }, {})

        this.rehydrateKeyframes(propertyRow)
        elementHeadingRow.addChild(propertyRow)
      }
    }

    // HACK: `rowDepth` is the "depth" of the row in relation to the scene graph element it corresponds to, so for example:
    //   <a> 0
    //     <b> 1
    //     <c> 1
    //       <d> 2
    //
    // Currently the timeline and stage only support editing to depths up to 1: the active component and its children.
    // Since projects of even "a resonable amount of complexity" can theoretically have 1000s of elements, that means
    // 1000s of Element entities, and a LOT of (Timeline) Row entities, since a Row represents not only the element,
    // but properties, clusters of properties, etc. To avoid waiting a long, long time for this rehydration to happen,
    // (think 10X num elements) any time the component reloads, we limit to only that of those entities we need to display.
    //
    // TODO: Instead of rehydrating, only create the entity "on demand" when the object is being edited
    // TODO: Row is only really coherent from the POV of the Timeline UI, so only use it there
    // TODO: Likely lots more optimizations we can do as well... or just rearchitect this to be smarter
    if (rowDepth < 1) {
      if (virtualNode.children) {
        for (let i = 0; i < virtualNode.children.length; i++) {
          let virtualChild = virtualNode.children[i]
          // Recursive call descends through and rehydrates the tree in depth-first order
          this.rehydrateFromTree(virtualChild, virtualNode, element, elementHeadingRow, 0, rowDepth + 1, i, `${graphAddress}.${i}`)
        }
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
        // The keyframe's uid is in the context of the row, which is in turn in context of the component
        uid: Keyframe.getInferredUid(row, i),
        ms: mscurr,
        index: i,
        value: valueGroup[mscurr].value,
        curve: valueGroup[mscurr].curve,
        row: row,
        element: row.element,
        timeline: row.timeline,
        component: row.component
      }, {})
    }
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
    const groupValue = this.getPropertyGroupValueFromPropertyKeys(componentId, timelineName, timelineTime, propertyKeys)

    if (!this._propertyGroupBatches[batchKey]) {
      this._propertyGroupBatches[batchKey] = {
        componentId,
        timelineName,
        timelineTime,
        groupValue
      }
    } else {
      lodash.assign(this._propertyGroupBatches[batchKey].groupValue, groupValue)
    }

    this.debouncedSendPropertyGroupUpdates()
    this.clearCachedClusters(timelineName, componentId)
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
const Property = require('./Property')
const Row = require('./Row')
const Template = require('./Template')
const Timeline = require('./Timeline')
