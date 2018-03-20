const path = require('path')
const lodash = require('lodash')
const pretty = require('pretty')
const async = require('async')
const jss = require('json-stable-stringify')
const {sortedKeyframes} = require('@haiku/core/lib/Transitions').default
const HaikuDOMAdapter = require('@haiku/core/lib/adapters/dom').default
const {InteractionMode, isPreviewMode} = require('@haiku/core/lib/helpers/interactionModes')
const initializeComponentTree = require('@haiku/core/lib/helpers/initializeComponentTree').default
const Layout3D = require('@haiku/core/lib/Layout3D').default
const BaseModel = require('./BaseModel')
const logger = require('./../utils/LoggerInstance')
const toTitleCase = require('./helpers/toTitleCase')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const Lock = require('./Lock')

const KEYFRAME_MOVE_DEBOUNCE_TIME = 100
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const DEFAULT_SCENE_NAME = 'main' // e.g. code/main/*
const DEFAULT_INTERACTION_MODE = InteractionMode.EDIT
const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0

const describeHotComponent = (componentId, timelineName, timelineTime, propertyGroup) => {
  // If our keyframe is not at t = 0, we don't actually need a hot component because we are definitely working with
  // a "mutable"-looking component. We have to cast a number because we sometimes arrive at this
  // point by looping over object properties, whose keyframeMs value JavaScript casts to string
  if (Number(timelineTime) !== 0) {
    return null
  }

  return {
    selector: `haiku:${componentId}`,
    propertyNames: Array.isArray(propertyGroup) ? propertyGroup : Object.keys(propertyGroup),
    timelineName
  }
}

const keyframeUpdatesToHotComponentDescriptors = (keyframeUpdates) => {
  const hotComponentDescriptors = []

  for (const timelineName in keyframeUpdates) {
    for (const componentId in keyframeUpdates[timelineName]) {
      for (const propertyName in keyframeUpdates[timelineName][componentId]) {
        for (const keyframeMs in keyframeUpdates[timelineName][componentId][propertyName]) {
          const hotComponent = describeHotComponent(
            componentId,
            timelineName,
            keyframeMs,
            [propertyName]
          )

          if (hotComponent) {
            hotComponentDescriptors.push(hotComponent)
          }
        }
      }
    }
  }

  return hotComponentDescriptors
}

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
        if (
          what === 'element-selected' ||
          (
            what === 'element-selected-softly' &&
            Element.where({
              component: this,
              _isSelected: true
            }).length === 1
          )
        ) {
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
        if (what === 'row-collapsed' || what === 'row-expanded') {
          this.cacheUnset('displayableRows')
        }
      }
    })

    Keyframe.on('update', (keyframe, what) => {
      if (keyframe.component === this) {
        this.emit('update', what, keyframe, this.project.getMetadata())
      }
    })

    this.commitAccumulatedKeyframeMovesDebounced = lodash.debounce(
      this.commitAccumulatedKeyframeMoves.bind(this),
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
    // TODO: Support many. When the timeline changes, clear Timeline (bll collection) caches.
    return Timeline.DEFAULT_NAME
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

  getAbsoluteHaikuStaticFilePath () {
    return path.join(this.getSceneCodeFolder(), 'static.json')
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

  addHotComponents (hotComponents) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      hotComponents.forEach((hotComponent) => {
        // hotComponent may be null if the timeline time was not 0
        if (hotComponent) {
          instance.addHotComponent(hotComponent)
        }
      })
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
      instance._builder.clearCachedClusters(timelineName, componentId)
    })
    return this
  }

  updateTimelineMaxes (timelineName) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      let timeline = instance._timelineInstances[timelineName]
      if (timeline) {
        let descriptor = instance._getTimelineDescriptor(timelineName)
        timeline.resetMaxDefinedTimeFromDescriptor(descriptor)
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

  /**
   * @method handleElementSelected
   * @description Hook to call once an element in-memory has been selected.
   * This is responsible for notifying other views about the action, and emitting an event that others can listen to.
   * The metadata arg is important because it has info about who originated the message, allowing us to avoid infinite loop.
   * Note: This gets called automatically by element.select()
   */
  handleElementSelected (componentId, metadata) {
    this.project.updateHook('selectElement', this.getSceneCodeRelpath(), componentId, metadata, (fire) => fire())
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
    this.project.updateHook('unselectElement', this.getSceneCodeRelpath(), componentId, metadata, (fire) => fire())
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

    cb()
  }

  selectAll (options, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      this.getArtboard().getElement().children.forEach((element) => {
        element.select(metadata)
      })

      release()
      this.project.updateHook('selectAll', this.getSceneCodeRelpath(), options, metadata, (fire) => fire())
      return cb()
    })
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
        this.project.updateHook('setInteractionMode', this.getSceneCodeRelpath(), this._interactionMode, metadata, (fire) => fire())
        return cb()
      })
    })
  }

  setHotEditingMode (hotEditingMode) {
    this.getActiveInstancesOfHaikuCoreComponent().forEach((instance) => {
      instance.assignConfig({ options: { hotEditingMode } })
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

  instantiateManaInBytecode (mana, bytecode, overrides, coords) {
    const {
      hash
    } = Template.getInsertionPointInfo(
      bytecode.template,
      bytecode.template.children.length,
      0
    )

    const timelineName = this.getInstantiationTimelineName()
    const timelineTime = this.getInstantiationTimelineTime()

    const timelines = Template.prepareManaAndBuildTimelinesObject(
      mana,
      hash,
      timelineName,
      timelineTime,
      { doHashWork: true }
    )

    // Has to happen after the above stanza in case an id was generated
    const componentId = mana.attributes[HAIKU_ID_ATTRIBUTE]

    logger.info(`[active component (${this.project.getAlias()})] instantiatee (mana) ${componentId} via ${hash}`)

    this.mutateInstantiateeDisplaySettings(
      componentId,
      timelines,
      timelineName,
      timelineTime,
      mana,
      coords
    )

    Bytecode.applyOverrides(overrides, timelines, timelineName, `haiku:${componentId}`, timelineTime)

    // Used to be `.push` but it makes more sense to put at the top of the list,
    // so that it displays on top of other elements by in the stack display
    bytecode.template.children.unshift(mana)

    Bytecode.mergeTimelineStructure(bytecode, timelines, 'assign')

    // And move the element to the z-front of all the rest of the layers
    // This must be part of this atomic action or undo/redo won't work properly
    // This has to happen after we merge the timeline structure or the object will be overwritten
    this.zMoveToFrontImpl(
      bytecode,
      componentId,
      timelineName,
      timelineTime
    )

    return componentId
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
    return this.performComponentWork((bytecode, template, done) => {
      this.instantiateManaInBytecode(
        mana,
        bytecode,
        overrides,
        coords
      )

      // Unlock performComponent work so zMoveToFront can proceed
      done()
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

    if (maybeCoords && (maybeCoords.x || maybeCoords.y)) {
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
      return this.project.updateHook(
        'instantiateComponent',
        this.getSceneCodeRelpath(),
        relpath,
        coords,
        metadata,
        (fire) => {
          // Since there are a few pathways to account for, the callback is defined up here
          const finish = (err, manaForWrapperElement) => {
            if (err) {
              release()
              logger.error(`[active component (${this.project.getAlias()})]`, err)
              return cb(err)
            }

            return this.reload({ hardReload: true }, null, () => {
              release()
              fire(null, manaForWrapperElement)

              // Immediately select the element after it is placed on stage
              this.selectElement(manaForWrapperElement.attributes[HAIKU_ID_ATTRIBUTE], metadata, () => {})

              return cb(null, manaForWrapperElement)
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
      )
    })
  }

  deleteComponent (componentId, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      this.project.updateHook(
        'deleteComponent',
        this.getSceneCodeRelpath(),
        componentId,
        metadata,
        (fire) => {
          return this.performComponentWork((bytecode, mana, done) => {
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
              release()
              logger.error(`[active component (${this.project.getAlias()})]`, err)
              return cb(err)
            }

            return this.reload({ hardReload: true }, null, () => {
              release()
              fire()
              return cb()
            })
          })
        }
      )
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

      Bytecode.mergeTimelineStructure(existingBytecode, timelinesObject, 'assign')

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
      return this.project.updateHook('mergeDesigns', this.getSceneCodeRelpath(), designs, metadata, (fire) => {
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
            fire()
            return cb()
          })
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
  pasteThing (pasteableSerial, {skipHashPadding}, metadata, cb) {
    const pasteable = Bytecode.unserValue(pasteableSerial)

    return Lock.request(Lock.LOCKS.ActiveComponentWork, (release) => {
      return this.project.updateHook('pasteThing', this.getSceneCodeRelpath(), Bytecode.serializeValue(pasteable), {skipHashPadding}, metadata, (fire) => {
        return this.performComponentWork((bytecode, mana, done) => {
          switch (pasteable.kind) {
            case 'bytecode':
              const incoming = Bytecode.clone(pasteable.data)

              if (!skipHashPadding) {
                // As usual, we use a hash rather than randomness because of multithreading
                const {
                  hash
                } = Template.getInsertionPointInfo(mana, mana.children.length, 0)

                // Pasting bytecode is implemented as a bytecode merge, so we pad all of the
                // ids inside the bytecode and then merge it, so we end up with a new element
                // and new timeline properties defined for it. This mutates the object.
                Bytecode.padIds(incoming, (oldId) => {
                  return `${oldId}-${hash}`
                })
              }

              const haikuId = incoming.template.attributes['haiku-id']

              // Paste handles "instantiating" a new template element for the incoming bytecode
              Bytecode.pasteBytecode(bytecode, incoming)

              logger.info(`[active component (${this.project.getAlias()})] pastee (bytecode) ${haikuId}`)

              return done(null, {haikuId})
            default:
              logger.warn(`[active component (${this.project.getAlias()})] cannot paste clipboard contents of kind ` + pasteable.kind)
              return done(new Error('Unable to paste clipboard contents'))
          }
        }, (err, {haikuId}) => {
          if (err) {
            release()
            logger.error(`[active component (${this.project.getAlias()})]`, err)
            return cb(err)
          }

          return this.reload({ hardReload: true }, null, () => {
            release()
            fire(null, {haikuId})
            return cb(null, {haikuId})
          })
        })
      })
    })
  }

  splitSelectedKeyframes (metadata) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.removeCurve(metadata))
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
  }

  dragStartSelectedKeyframes (dragData) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.dragStart(dragData))
  }

  dragStopSelectedKeyframes (dragData) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.dragStop(dragData))

    // We only update once we're finished dragging because moving keyframes may end up
    // destroying/creating keyframes in the bytecode, and when rehydrate is called, the
    // ids (which are based on keyframe indices) would end up offset
    this.commitAccumulatedKeyframeMovesDebounced()
  }

  dragSelectedKeyframes (pxpf, mspf, dragData, metadata) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.drag(pxpf, mspf, dragData, metadata))
  }

  snapshotKeyframeUpdates (keyframeUpdates) {
    const bytecode = this.getReifiedBytecode()

    const updates = {}

    for (const timelineName in keyframeUpdates) {
      updates[timelineName] = {}

      for (const componentId in keyframeUpdates[timelineName]) {
        const selector = Template.buildHaikuIdSelector(componentId)

        updates[timelineName][componentId] = {}

        for (const propertyName in keyframeUpdates[timelineName][componentId]) {
          updates[timelineName][componentId][propertyName] = {}

          for (const keyframeMs in keyframeUpdates[timelineName][componentId][propertyName]) {
            if (
              !bytecode.timelines[timelineName] ||
              !bytecode.timelines[timelineName][selector] ||
              !bytecode.timelines[timelineName][selector][propertyName] ||
              !bytecode.timelines[timelineName][selector][propertyName][keyframeMs]
            ) {
              const elementName = this.getElementNameOfComponentId(componentId)

              updates[timelineName][componentId][propertyName][keyframeMs] = {
                value: TimelineProperty.getFallbackValue(
                  componentId,
                  elementName,
                  propertyName
                )
              }

              continue
            }

            const keyfVal = (typeof bytecode.timelines[timelineName][selector][propertyName][keyframeMs].value === 'function')
              ? bytecode.timelines[timelineName][selector][propertyName][keyframeMs].value
              : lodash.clone(bytecode.timelines[timelineName][selector][propertyName][keyframeMs].value)

            updates[timelineName][componentId][propertyName][keyframeMs] = {
              value: keyfVal
            }
          }
        }
      }
    }

    return updates
  }

  gatherKeyframeMoves (componentId, timelineName, propertyNames) {
    const keyframeMovesDescriptor = {}
    keyframeMovesDescriptor[timelineName] = {}
    keyframeMovesDescriptor[timelineName][componentId] = {}
    propertyNames.forEach((propertyName) => {
      keyframeMovesDescriptor[timelineName][componentId][propertyName] = {}
    })
    return this.snapshotKeyframeMoves(keyframeMovesDescriptor)
  }

  snapshotKeyframeMoves (keyframeMovesDescriptor) {
    const moves = {}

    for (const timelineName in keyframeMovesDescriptor) {
      moves[timelineName] = {}

      for (const componentId in keyframeMovesDescriptor[timelineName]) {
        moves[timelineName][componentId] = {}

        const propertyNames = Object.keys(keyframeMovesDescriptor[timelineName][componentId])

        const keyframesObj = this.getKeyframesObjectForPropertyNames(
          timelineName,
          componentId,
          propertyNames
        )

        for (const propertyName in keyframesObj) {
          const propertyObj = keyframesObj[propertyName]

          moves[timelineName][componentId][propertyName] = {}

          for (const keyframeMs in propertyObj) {
            const keyfObj = propertyObj[keyframeMs]

            const keyfVal = (typeof keyfObj.value === 'function')
              ? keyfObj.value
              : lodash.clone(keyfObj.value)

            moves[timelineName][componentId][propertyName][keyframeMs] = {
              value: keyfVal
            }

            if (keyfObj.curve) {
              moves[timelineName][componentId][propertyName][keyframeMs].curve = keyfObj.curve
            }

            if (keyfObj.edited) {
              moves[timelineName][componentId][propertyName][keyframeMs].edited = true
            }
          }
        }
      }
    }

    return moves
  }

  commitAccumulatedKeyframeMoves () {
    this.moveKeyframes(
      Keyframe.buildKeyframeMoves({ component: this }, true),
      this.project.getMetadata(),
      () => {}
    )
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
        if (typeof reloadOptions.customRehydrate === 'function') {
          // In many cases a full rehydration isn't desired because we know exactly
          // what models need to be updated in order to proceed; if the user
          // specifies this then we call their own custom rehydration function
          reloadOptions.customRehydrate()
        } else {
          // Rehydrate all the view-models so our view renders correctly
          // This has to happen __after softReload__ because softReload calls
          // flush, and all the models need access to the rendered app in
          // order to compute various things properly (race condition)
          this.rehydrate()
        }

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
      existingActiveInstance._timelineInstances[timelineName].setComponent(freshInstance)
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

    // If we were passed a "hot component" or asked to request a full flush render, forward this to our underlying
    // HaikuComponent instances to ensure correct rendering. This can be skipped if softReload() was called in the
    // context of a hard reload, because hardReload() calls forceFlush() after soft reloading.
    if (!reloadOptions.hardReload) {
      if (reloadOptions.hotComponents) {
        this.addHotComponents(reloadOptions.hotComponents)
      } else if (reloadOptions.forceFlush) {
        this.forceFlush()
      }
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
      return activeComponent.reload(Object.assign({ hardReload: false, skipReloadLock: true }, reloadOptions), null, next)
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
    const staticTemplateNode = this.getReifiedBytecode().template

    const uid = Element.makeUid(
      this,
      null,
      0,
      staticTemplateNode
    )

    const found = Element.findById(uid)

    if (found) {
      // Without this, the element instance in 'master' can end up with a stale node
      found.staticTemplateNode = staticTemplateNode

      return found
    }

    return Element.upsertElementFromVirtualElement(
      this, // component
      staticTemplateNode,
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
    Element.where({ component: this }).forEach((element) => {
      if (element !== root) {
        element.mark()
      }
    })

    root.rehydrate()

    Element.where({ component: this }).forEach((element) => {
      if (element !== root) {
        element.sweep()
      }
    })

    // We should only need the row model hydrated in the context of the timeline or test
    if (this.project.getAlias() === 'timeline' || this.project.getAlias() === 'test') {
      // Hydrate rows via element so the rows order matches depth-first element order
      root.visitAll((element) => element.rehydrateRows())
      this.cacheUnset('displayableRows')
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

  getBytecodeJSON (replacer, spacing) {
    return jss(this.getSerializedBytecode(), replacer, spacing)
  }

  getReifiedTemplate () {
    const reifiedBytecode = this.getReifiedBytecode()
    return reifiedBytecode && reifiedBytecode.template
  }

  upsertProperties (
    bytecode,
    componentId,
    timelineName,
    timelineTime,
    propertiesToMerge,
    strategy
  ) {
    return Bytecode.upsertPropertyValue(
      bytecode,
      componentId,
      timelineName,
      timelineTime,
      propertiesToMerge,
      strategy
    )
  }

  getDeclaredPropertyValue (componentId, timelineName, timelineTime, propertyName) {
    const bytecode = this.getReifiedBytecode()

    let propertyValue = Template.getPropertyValue(
      bytecode,
      componentId,
      timelineName,
      timelineTime,
      propertyName
    )

    // Suppose we instantiate an element, scale it, then undo
    // Since elements don't have an explicit scale set, our undoable
    // would have `undefined` values in the snapshot, which would
    // have the effect of *not* reverting the scale; so we grab the
    // fallback value just in case
    if (propertyValue === undefined || propertyValue === null) {
      const elementName = this.getElementNameOfComponentId(componentId)

      propertyValue = TimelineProperty.getFallbackValue(
        componentId,
        elementName,
        propertyName
      )
    }

    return propertyValue
  }

  getDeclaredPropertyValues (componentId, timelineName, timelineTime, propertyNames) {
    const out = {}

    propertyNames.forEach((propertyName) => {
      out[propertyName] = this.getDeclaredPropertyValue(
        componentId,
        timelineName,
        timelineTime,
        propertyName
      )
    })

    return out
  }

  getStateDescriptor (stateName) {
    const states = this.getReifiedBytecode().states
    return states && states[stateName]
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

  getFirstTemplateNode () {
    const bytecode = this.getReifiedBytecode()
    return (
      bytecode &&
      bytecode.template &&
      bytecode.template.children &&
      bytecode.template.children[0]
    )
  }

  getLastTemplateNodeHaikuId () {
    const node = this.getLastTemplateNode()
    return node && node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]
  }

  getFirstTemplateNodeHaikuId () {
    const node = this.getFirstTemplateNode()
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
    return this.cacheFetch('displayableRows', () => Row.getDisplayables({ component: this }))
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

  performComponentWork (worker, cb) {
    // Playback during an update creates difficult-to-debug conditions
    this.sleepComponentsOn()

    return Lock.request(Lock.LOCKS.FilePerformComponentWork, (release) => {
      const finish = (err, result) => {
        release()
        return cb(err, result)
      }

      const bytecode = this.getReifiedBytecode()

      return worker(bytecode, bytecode.template, (err, result) => {
        if (err) {
          return finish(err)
        }

        this.handleUpdatedBytecode(bytecode)

        // Now that we're finished, we can resume on-stage playback
        this.sleepComponentsOff()

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
    const template = this.getReifiedBytecode().template
    const element = this.findTemplateNodeByComponentId(template, componentId)
    return element && element.elementName
  }

  getTimelineDescriptor (timelineName) {
    const bytecode = this.getReifiedBytecode()
    return bytecode && bytecode.timelines && bytecode.timelines[timelineName]
  }

  normalizeStackingAndReturnInfo (bytecode, mana, timelineName, timelineTime) {
    const stackingInfo = Template.getStackingInfo(
      bytecode,
      mana,
      timelineName,
      timelineTime
    )

    this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)

    return stackingInfo
  }

  getRawStackingInfo (timelineName, timelineTime) {
    const bytecode = this.getReifiedBytecode()

    return Template.getStackingInfo(
      bytecode,
      bytecode.template,
      timelineName,
      timelineTime
    )
  }

  setZIndicesForStackingInfo (bytecode, timelineName, timelineTime, stackingInfo) {
    stackingInfo.forEach(({ haikuId }, arrayIndex) => {
      this.upsertProperties(
        bytecode,
        haikuId,
        timelineName,
        timelineTime,
        {
          'style.zIndex': arrayIndex + 1 // No 0-index
        },
        'merge'
      )
    })
  }

  grabStackObjectFromStackingInfo (stackingInfo, componentId) {
    for (let i = stackingInfo.length - 1; i >= 0; i--) {
      if (stackingInfo[i].haikuId === componentId) {
        return stackingInfo.splice(i, 1)[0]
      }
    }
  }

  /**
   * @method writeMetadata
   */
  writeMetadata (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.writeMetadata(bytecode, metadata)
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
    return cb(null, Bytecode.readAllEventHandlers(bytecode))
  }

  /**
   * @method readAllStateValues
   */
  readAllStateValues (metadata, cb) {
    return this.readAllStateValuesActual(cb)
  }

  readAllStateValuesActual (cb) {
    const bytecode = this.getSerializedBytecode()
    return cb(null, Bytecode.readAllStateValues(bytecode))
  }

  /**
   * @method upsertEventHandler
   */
  upsertEventHandler (selectorName, eventName, handlerDescriptorMaybeSerial, metadata, cb) {
    const handlerDescriptor = Bytecode.unserValue(handlerDescriptorMaybeSerial)

    return this.project.updateHook('upsertEventHandler', this.getSceneCodeRelpath(), selectorName, eventName, Bytecode.serializeValue(handlerDescriptor), metadata, (fire) => {
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
          fire()
          return cb()
        })
      })
    })
  }

  upsertEventHandlerActual (selectorName, eventName, handlerDescriptor, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.upsertEventHandler(bytecode, selectorName, eventName, handlerDescriptor)
      done()
    }, cb)
  }

  /**
   * @method batchUpsertEventHandlers
   */
  batchUpsertEventHandlers (selectorName, eventsSerial, metadata, cb) {
    const events = Bytecode.unserValue(eventsSerial)

    return this.project.updateHook('batchUpsertEventHandlers', this.getSceneCodeRelpath(), selectorName, Bytecode.serializeValue(events), metadata, (fire) => {
      return this.batchUpsertEventHandlersActual(selectorName, events, (err) => {
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
          fire()
          this.project.broadcastPayload({ name: 'event-handlers-updated' })
          return cb()
        })
      })
    })
  }

  batchUpsertEventHandlersActual (selectorName, serializedEvents, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.batchUpsertEventHandlers(bytecode, selectorName, serializedEvents)
      done()
    }, cb)
  }

  /**
   * @method deleteEventHandler
   */
  deleteEventHandler (selectorName, eventName, metadata, cb) {
    return this.project.updateHook('deleteEventHandler', this.getSceneCodeRelpath(), selectorName, eventName, metadata, (fire) => {
      return this.deleteEventHandlerActual(selectorName, eventName, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true,
          clearCacheOptions: {
            clearPreviouslyRegisteredEventListeners: true
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  deleteEventHandlerActual (selectorName, eventName, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.deleteEventHandler(bytecode, selectorName, eventName)
      done()
    }, cb)
  }

  /**
   * @method changeKeyframeValue
   */
  changeKeyframeValue (componentId, timelineName, propertyName, keyframeMs, newValueSerial, metadata, cb) {
    const newValue = Bytecode.unserValue(newValueSerial)

    return this.project.updateHook('changeKeyframeValue', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, Bytecode.serializeValue(newValue), metadata, (fire) => {
      this.clearCachedClusters(this.getCurrentTimelineName(), componentId)

      return this.changeKeyframeValueActual(componentId, timelineName, propertyName, keyframeMs, newValue, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata), forceFlush: true }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  changeKeyframeValueActual (componentId, timelineName, propertyName, keyframeMs, newValue, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.changeKeyframeValue(bytecode, componentId, timelineName, propertyName, keyframeMs, newValue)
      done()
    }, cb)
  }

  /**
   * @method changeSegmentCurve
   */
  changeSegmentCurve (componentId, timelineName, propertyName, keyframeMs, newCurveSerial, metadata, cb) {
    const newCurve = Bytecode.unserValue(newCurveSerial)

    return this.project.updateHook('changeSegmentCurve', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, Bytecode.serializeValue(newCurve), metadata, (fire) => {
      this.clearCachedClusters(this.getCurrentTimelineName(), componentId)

      return this.changeSegmentCurveActual(componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  changeSegmentCurveActual (componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.changeSegmentCurve(bytecode, componentId, timelineName, propertyName, keyframeMs, newCurve)
      done()
    }, cb)
  }

  /**
   * @method joinKeyframes
   */
  joinKeyframes (componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurveSerial, metadata, cb) {
    const newCurve = Bytecode.unserValue(newCurveSerial)

    return this.project.updateHook('joinKeyframes', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, Bytecode.serializeValue(newCurve), metadata, (fire) => {
      this.clearCachedClusters(this.getCurrentTimelineName(), componentId)

      return this.joinKeyframesActual(componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  joinKeyframesActual (componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.joinKeyframes(bytecode, componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve)
      done()
    }, cb)
  }

  /**
   * @method splitSegment
   */
  splitSegment (componentId, timelineName, elementName, propertyName, keyframeMs, metadata, cb) {
    return this.project.updateHook('splitSegment', this.getSceneCodeRelpath(), componentId, timelineName, elementName, propertyName, keyframeMs, metadata, (fire) => {
      this.clearCachedClusters(this.getCurrentTimelineName(), componentId)

      return this.splitSegmentActual(componentId, timelineName, elementName, propertyName, keyframeMs, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  splitSegmentActual (componentId, timelineName, elementName, propertyName, keyframeMs, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.splitSegment(bytecode, componentId, timelineName, elementName, propertyName, keyframeMs)
      done()
    }, cb)
  }

  getKeyframesObjectForPropertyNames (timelineName, componentId, propertyNames) {
    const bytecode = this.getReifiedBytecode() || {}
    const timeline = bytecode.timelines[timelineName] || {}
    const properties = timeline[`haiku:${componentId}`] || {}
    const keyframes = {}
    propertyNames.forEach((propertyName) => {
      keyframes[propertyName] = properties[propertyName]
    })
    return keyframes
  }

  ensureZerothKeyframe (
    bytecode,
    timelineName,
    componentId,
    propertyName
  ) {
    const selector = `haiku:${componentId}`

    if (!bytecode.timelines[timelineName]) bytecode.timelines[timelineName] = {}
    if (!bytecode.timelines[timelineName][selector]) bytecode.timelines[timelineName][selector] = {}
    if (!bytecode.timelines[timelineName][selector][propertyName]) bytecode.timelines[timelineName][selector][propertyName] = {}

    const descriptor = bytecode.timelines[timelineName][selector][propertyName]
    const keyframeNumbers = sortedKeyframes(descriptor)
    const initialKeyframeMs = keyframeNumbers[0]
    const initialKeyframeObj = (initialKeyframeMs !== undefined)
      ? descriptor[initialKeyframeMs]
      : undefined

    if (!descriptor[0]) {
      descriptor[0] = {}
    }

    if (descriptor[0].value === undefined) {
      if (initialKeyframeObj) {
        descriptor[0].value = Bytecode.unserValue(initialKeyframeObj.value)
        descriptor[0].curve = Bytecode.unserValue(initialKeyframeObj.curve)
      } else {
        // Otherwise, use the fallback if we have no next keyframe defined
        descriptor[0].value = Bytecode.unserValue(this.getDeclaredPropertyValue(
          componentId,
          timelineName,
          0,
          propertyName
        ))
      }
    }

    if (descriptor[0].value === undefined) {
      // Set it to a reasonably safe value if we couldn't find one
      descriptor[0].value = 1
    }

    // Avoid effects of design merge changes
    descriptor[0].edited = true
  }

  /**
   * @method moveKeyframes
   */
  moveKeyframes (keyframeMovesSerial, metadata, cb) {
    if (Object.keys(keyframeMovesSerial).length < 1) {
      return cb()
    }

    const keyframeMoves = Bytecode.unserValue(keyframeMovesSerial)

    return this.project.updateHook('moveKeyframes', this.getSceneCodeRelpath(), Bytecode.serializeValue(keyframeMoves), metadata, (fire) => {
      for (const timelineName in keyframeMoves) {
        for (const componentId in keyframeMoves[timelineName]) {
          this.clearCachedClusters(timelineName, componentId)
        }
      }

      return this.moveKeyframesActual(keyframeMoves, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: true,
          customRehydrate: () => {
            if (this.project.isRemoteRequest(metadata)) {
              this.rehydrate()
              return
            }
            for (const timelineName in keyframeMoves) {
              for (const componentId in keyframeMoves[timelineName]) {
                const element = this.findElementByComponentId(componentId)
                for (const propertyName in keyframeMoves[timelineName][componentId]) {
                  const row = element.getPropertyRowByPropertyName(propertyName)
                  // The row object does not exist inside the glass app
                  if (row) {
                    // The pkey of keyframes is {row.pkey}+{keyframe.ms}. Since we've just modified
                    // the ms value through a move, we need to update its uid according to that new ms
                    // since when we rehydrate, we'll want upsertion to match the new ms value
                    // so we don't end up with extra objects or other stale things laying around
                    row.getKeyframes().forEach((keyframe) => keyframe.updateOwnMetadata())
                    row.rehydrate()
                  }
                }
              }
            }
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  moveKeyframesActual (keyframeMoves, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.moveKeyframes(bytecode, keyframeMoves)

      for (const timelineName in keyframeMoves) {
        for (const componentId in keyframeMoves[timelineName]) {
          for (const propertyName in keyframeMoves[timelineName][componentId]) {
            this.ensureZerothKeyframe(
              bytecode,
              timelineName,
              componentId,
              propertyName
            )
          }
        }
      }

      // Clear timeline caches; the max frame might have changed.
      Timeline.clearCaches()

      done()
    }, cb)
  }

  /**
   * @method moveKeyframes
   */
  updateKeyframes (keyframeUpdatesSerial, metadata, cb) {
    const keyframeUpdates = Bytecode.unserValue(keyframeUpdatesSerial)

    return this.project.updateHook('updateKeyframes', this.getSceneCodeRelpath(), Bytecode.serializeValue(keyframeUpdates), metadata, (fire) => {
      for (const timelineName in keyframeUpdates) {
        for (const componentId in keyframeUpdates[timelineName]) {
          this.clearCachedClusters(timelineName, componentId)
        }
      }

      return this.updateKeyframesActual(keyframeUpdates, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          hotComponents: keyframeUpdatesToHotComponentDescriptors(keyframeUpdates)
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  updateKeyframesActual (keyframeUpdates, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      for (const timelineName in keyframeUpdates) {
        if (!bytecode.timelines[timelineName]) bytecode.timelines[timelineName] = {}
        for (const componentId in keyframeUpdates[timelineName]) {
          const selector = Template.buildHaikuIdSelector(componentId)
          if (!bytecode.timelines[timelineName][selector]) bytecode.timelines[timelineName][selector] = {}
          for (const propertyName in keyframeUpdates[timelineName][componentId]) {
            if (!bytecode.timelines[timelineName][selector][propertyName]) bytecode.timelines[timelineName][selector][propertyName] = {}
            for (const keyframeMs in keyframeUpdates[timelineName][componentId][propertyName]) {
              if (!bytecode.timelines[timelineName][selector][propertyName][keyframeMs]) bytecode.timelines[timelineName][selector][propertyName][keyframeMs] = {}
              const propertyObj = keyframeUpdates[timelineName][componentId][propertyName][keyframeMs]

              const keyfVal = (typeof propertyObj.value === 'function')
                ? propertyObj.value
                : lodash.clone(propertyObj.value)

              bytecode.timelines[timelineName][selector][propertyName][keyframeMs].value = keyfVal
            }
          }
        }
      }

      // Clear timeline caches; the max frame might have changed.
      Timeline.clearCaches()

      done()
    }, cb)
  }

  /**
   * @method createKeyframe
   */
  createKeyframe (
    componentId,
    timelineName,
    elementName,
    propertyName,
    keyframeStartMs,
    keyframeValueSerial,
    keyframeCurveSerial,
    keyframeEndMs,
    keyframeEndValueSerial,
    metadata,
    cb
  ) {
    const keyframeValue = Bytecode.unserValue(keyframeValueSerial)
    const keyframeCurve = Bytecode.unserValue(keyframeCurveSerial)
    const keyframeEndValue = Bytecode.unserValue(keyframeEndValueSerial)

    return this.project.updateHook(
      'createKeyframe',
      this.getSceneCodeRelpath(),
      componentId,
      timelineName,
      elementName,
      propertyName,
      keyframeStartMs,
      Bytecode.serializeValue(keyframeValue),
      Bytecode.serializeValue(keyframeCurve),
      keyframeEndMs,
      Bytecode.serializeValue(keyframeEndValue),
      metadata,
      (fire) => {
        this.clearCachedClusters(this.getCurrentTimelineName(), componentId)

        return this.createKeyframeActual(componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, (err) => {
          if (err) {
            logger.error(`[active component (${this.project.getAlias()})]`, err)
            return cb(err)
          }

          return this.reload({
            hardReload: true,
            customRehydrate: () => {
              if (this.project.isRemoteRequest(metadata)) {
                this.rehydrate()
                return
              }
              const element = this.findElementByComponentId(componentId)
              const row = element.getPropertyRowByPropertyName(propertyName)
              row.getKeyframes().forEach((keyframe) => keyframe.updateOwnMetadata())
              row.rehydrate()
            }
          }, null, () => {
            fire()
            return cb()
          })
        })
      }
    )
  }

  createKeyframeActual (componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const host = this.getCoreComponentInstance()
      const states = (host && host.getStates()) || {}

      Bytecode.createKeyframe(
        bytecode,
        componentId,
        timelineName,
        elementName,
        propertyName,
        keyframeStartMs,
        keyframeValue,
        keyframeCurve,
        keyframeEndMs,
        keyframeEndValue,
        host,
        states
      )

      this.ensureZerothKeyframe(
        bytecode,
        timelineName,
        componentId,
        propertyName
      )

      done()
    }, cb)
  }

  /**
   * @method deleteKeyframe
   */
  deleteKeyframe (componentId, timelineName, propertyName, keyframeMs, metadata, cb) {
    return this.project.updateHook('deleteKeyframe', this.getSceneCodeRelpath(), componentId, timelineName, propertyName, keyframeMs, metadata, (fire) => {
      this.clearCachedClusters(this.getCurrentTimelineName(), componentId)

      return this.deleteKeyframeActual(componentId, timelineName, propertyName, keyframeMs, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        // In case we ended up with a materially different, immutable-looking property group after removing a
        // second-from-last keyframe, request a force flush.
        return this.reload({
          hardReload: true,
          customRehydrate: () => {
            if (this.project.isRemoteRequest(metadata)) {
              this.rehydrate()
              return
            }
            const element = this.findElementByComponentId(componentId)
            const row = element.getPropertyRowByPropertyName(propertyName)
            row.getKeyframes().forEach((keyframe) => keyframe.updateOwnMetadata())
            row.rehydrate()
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  deleteKeyframeActual (componentId, timelineName, propertyName, keyframeMs, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.deleteKeyframe(bytecode, componentId, timelineName, propertyName, keyframeMs)

      this.ensureZerothKeyframe(
        bytecode,
        timelineName,
        componentId,
        propertyName
      )

      done()
    }, cb)
  }

  /**
   * @method groupElements
   */
  groupElements (componentIds, metadata, cb) {
    return this.project.updateHook('groupElements', this.getSceneCodeRelpath(), componentIds, metadata, (fire) => {
      return this.groupElementsActual(componentIds, metadata, (err, groupComponentId) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          fire(null, groupComponentId)
          return cb()
        })
      })
    })
  }

  groupElementsActual (componentIds, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const timelineName = this.getInstantiationTimelineName()
      const timelineTime = this.getInstantiationTimelineTime()

      const nodesToRegroup = []

      // We only allow grouping of the top level elements, hence iterating children, not visiting
      for (let i = mana.children.length - 1; i >= 0; i--) {
        const node = mana.children[i]

        if (
          node.attributes &&
          componentIds.indexOf(node.attributes[HAIKU_ID_ATTRIBUTE]) !== -1
        ) {
          // Add to a list of nodes we want to regroup
          nodesToRegroup.push(node)

          // Remove node from its existing parent
          mana.children.splice(i, 1)
        }
      }

      // Get the Element instance for every node we want to regroup
      const elementsToRegroup = nodesToRegroup.map((node) => {
        return this.findElementByComponentId(node.attributes[HAIKU_ID_ATTRIBUTE])
      })

      // This object makes it easier to compute the bounding box of the group
      const proxy = ElementSelectionProxy.fromSelection(
        elementsToRegroup,
        {component: this}
      )

      // We'll use the rectangle to compute the attribute we'll need to set for the grouping element
      const rect = proxy.getBoundingClientRect()

      // The new top-level object that will host the groupees
      const group = {
        elementName: 'div',
        attributes: {
          // The group needs to be relative to offset the child transforms
          width: rect.width,
          height: rect.height
        },
        children: []
      }

      // The instantiation process should convert this to translation.x/y
      // We have to pad with the rect dimensions because the instantiation process
      // assumes an offset from the size is needed (hack)
      const coords = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }

      // The derived id of the new group element (used for undo)
      const groupComponentId = this.instantiateManaInBytecode(
        group,
        bytecode,
        {},
        coords
      )

      // Move the children inside of their new host element
      group.children.push.apply(group.children, nodesToRegroup)

      // Place the new group at the top (TODO: retain inner stacking order somehow)
      const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      const ourStackObject = this.grabStackObjectFromStackingInfo(stackingInfo, groupComponentId)
      stackingInfo.push(ourStackObject) // Push to front
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)

      // const host = this.getCoreComponentInstance()
      // const states = (host && host.getStates()) || {}
      // Offset the children based on their new position within the parent
      group.children.forEach((child) => {
        // TODO:
        // TimelineProperty.addPropertyGroupValue(
        //   bytecode.timelines,
        //   timelineName,
        //   child.attributes[HAIKU_ID_ATTRIBUTE],
        //   Element.safeElementName(child),
        //   {
        //     // 'translation.x': -rect.left, // TODO <~ compute the deltas
        //     // 'translation.y': -rect.top // TODO <~ compute the deltas
        //   },
        //   timelineTime,
        //   host,
        //   states
        // )
      })

      done(null, groupComponentId)
    }, cb)
  }

  /**
   * @method ungroupElements
   */
  ungroupElements (componentId, metadata, cb) {
    return this.project.updateHook('ungroupElements', this.getSceneCodeRelpath(), componentId, metadata, (fire) => {
      return this.ungroupElementsActual(componentId, metadata, (err, ungroupedComponentIds) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: true }, null, () => {
          fire(null, ungroupedComponentIds)
          return cb()
        })
      })
    })
  }

  ungroupElementsActual (componentId, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      const ungroupedComponentIds = []

      // Do the ungrouping here

      done(null, ungroupedComponentIds)
    }, cb)
  }

  /**
   * @method upsertStateValue
   */
  upsertStateValue (stateName, stateDescriptorSerial, metadata, cb) {
    const stateDescriptor = Bytecode.unserValue(stateDescriptorSerial)

    return this.project.updateHook('upsertStateValue', this.getSceneCodeRelpath(), stateName, Bytecode.serializeValue(stateDescriptor), metadata, (fire) => {
      stateDescriptor.edited = true

      return this.upsertStateValueActual(stateName, stateDescriptor, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  upsertStateValueActual (stateName, stateDescriptor, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.upsertStateValue(bytecode, stateName, stateDescriptor)
      done()
    }, cb)
  }

  /**
   * @method deleteStateValue
   */
  deleteStateValue (stateName, metadata, cb) {
    return this.project.updateHook('deleteStateValue', this.getSceneCodeRelpath(), stateName, metadata, (fire) => {
      return this.deleteStateValueActual(stateName, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  deleteStateValueActual (stateName, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.deleteStateValue(bytecode, stateName)
      done()
    }, cb)
  }

  /**
   * @method zMoveToFront
   */
  zMoveToFront (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveToFront', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveToFrontActual(componentId, timelineName, timelineTime, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          hotComponents: [describeHotComponent(componentId, timelineName, timelineTime, ['style.zIndex'])]
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveToFrontImpl (bytecode, componentId, timelineName, timelineTime) {
    const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, bytecode.template, timelineName, timelineTime)
    const ourStackObject = this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
    stackingInfo.push(ourStackObject)
    this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
  }

  zMoveToFrontActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      this.zMoveToFrontImpl(bytecode, componentId, timelineName, timelineTime)
      done()
    }, cb)
  }

  /**
   * @method zMoveForward
   */
  zMoveForward (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveForward', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveForwardActual(componentId, timelineName, timelineTime, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          hotComponents: [describeHotComponent(componentId, timelineName, timelineTime, ['style.zIndex'])]
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveForwardActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      const ourStackObject = this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
      stackingInfo.splice(ourStackObject.zIndex, 0, ourStackObject)
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
      done()
    }, cb)
  }

  /**
   * @method zMoveBackward
   */
  zMoveBackward (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveBackward', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveBackwardActual(componentId, timelineName, timelineTime, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          hotComponents: [describeHotComponent(componentId, timelineName, timelineTime, ['style.zIndex'])]
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveBackwardActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      const ourStackObject = this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
      stackingInfo.splice(ourStackObject.zIndex - 2, 0, ourStackObject)
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
      done()
    }, cb)
  }

  /**
   * @method zMoveToBack
   */
  zMoveToBack (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveToBack', this.getSceneCodeRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveToBackActual(componentId, timelineName, timelineTime, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          hotComponents: [describeHotComponent(componentId, timelineName, timelineTime, ['style.zIndex'])]
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveToBackActual (componentId, timelineName, timelineTime, metadata, cb) {
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      const stackingInfo = this.normalizeStackingAndReturnInfo(bytecode, mana, timelineName, timelineTime)
      const ourStackObject = this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
      stackingInfo.unshift(ourStackObject)
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
      done()
    }, cb)
  }

  /**
   * @method createTimeline
   */
  createTimeline (timelineName, timelineDescriptorSerial, metadata, cb) {
    const timelineDescriptor = Bytecode.unserValue(timelineDescriptorSerial)

    return this.project.updateHook('createTimeline', this.getSceneCodeRelpath(), timelineName, Bytecode.serializeValue(timelineDescriptor), metadata, (fire) => {
      return this.createTimelineActual(timelineName, timelineDescriptor, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  createTimelineActual (timelineName, timelineDescriptor, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.createTimeline(bytecode, timelineName, timelineDescriptor)
      done()
    }, cb)
  }

  /**
   * @method renameTimeline
   */
  renameTimeline (timelineNameOld, timelineNameNew, metadata, cb) {
    return this.project.updateHook('renameTimeline', this.getSceneCodeRelpath(), timelineNameOld, timelineNameNew, metadata, (fire) => {
      return this.renameTimelineActual(timelineNameOld, timelineNameNew, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  renameTimelineActual (timelineNameOld, timelineNameNew, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.renameTimeline(bytecode, timelineNameOld, timelineNameNew)
      done()
    }, cb)
  }

  /**
   * @method deleteTimeline
   */
  deleteTimeline (timelineName, metadata, cb) {
    return this.project.updateHook('deleteTimeline', this.getSceneCodeRelpath(), timelineName, metadata, (fire) => {
      return this.deleteTimelineActual(timelineName, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  deleteTimelineActual (timelineName, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.deleteTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  /**
   * @method duplicateTimeline
   */
  duplicateTimeline (timelineName, metadata, cb) {
    return this.project.updateHook('duplicateTimeline', this.getSceneCodeRelpath(), timelineName, metadata, (fire) => {
      return this.duplicateTimelineActual(timelineName, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  duplicateTimelineActual (timelineName, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.duplicateTimeline(bytecode, timelineName)
      done()
    }, cb)
  }

  /**
   * @method changePlaybackSpeed
   */
  changePlaybackSpeed (framesPerSecond, metadata, cb) {
    return this.project.updateHook('changePlaybackSpeed', this.getSceneCodeRelpath(), framesPerSecond, metadata, (fire) => {
      return this.changePlaybackSpeedActual(framesPerSecond, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({ hardReload: this.project.isRemoteRequest(metadata) }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  changePlaybackSpeedActual (framesPerSecond, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.changePlaybackSpeed(bytecode, framesPerSecond)
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
const Bytecode = require('./Bytecode')
const Design = require('./Design')
const Element = require('./Element')
const ElementSelectionProxy = require('./ElementSelectionProxy')
const File = require('./File')
const Keyframe = require('./Keyframe')
const ModuleWrapper = require('./ModuleWrapper')
const MountElement = require('./MountElement')
const Primitive = require('./Primitive')
const Row = require('./Row')
const SelectionMarquee = require('./SelectionMarquee')
const Template = require('./Template')
const Timeline = require('./Timeline')
const TimelineProperty = require('./TimelineProperty')
