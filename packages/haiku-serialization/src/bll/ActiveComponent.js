const path = require('path')
const lodash = require('lodash')
const pretty = require('pretty')
const async = require('async')
const jss = require('json-stable-stringify')
const pascalcase = require('pascalcase')
const {PlaybackSetting} = require('@haiku/core/lib/HaikuTimeline')
const {HAIKU_ID_ATTRIBUTE, HAIKU_LOCKED_ATTRIBUTE, HAIKU_TITLE_ATTRIBUTE, HAIKU_VAR_ATTRIBUTE} = require('@haiku/core/lib/HaikuElement')
const {sortedKeyframes} = require('@haiku/core/lib/Transitions').default
const HaikuComponent = require('@haiku/core/lib/HaikuComponent').default
const {LAYOUT_3D_SCHEMA} = require('@haiku/core/lib/HaikuComponent')
const HaikuDOMAdapter = require('@haiku/core/lib/adapters/dom').default
const {InteractionMode, isPreviewMode} = require('@haiku/core/lib/helpers/interactionModes')
const Layout3D = require('@haiku/core/lib/Layout3D')
const BaseModel = require('./BaseModel')
const logger = require('./../utils/LoggerInstance')
const CryptoUtils = require('./../utils/CryptoUtils')
const toTitleCase = require('./helpers/toTitleCase')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const Lock = require('./Lock')
const SustainedWarningChecker = require('haiku-common/lib/sustained-checker/SustainedWarningChecker').default

const KEYFRAME_MOVE_DEBOUNCE_TIME = 100
const CHECK_SUSTAINED_WARNINGS_DEBOUNCE_TIME = 1000
const DEFAULT_SCENE_NAME = 'main' // e.g. code/main/*
const DEFAULT_INTERACTION_MODE = InteractionMode.EDIT
const DEFAULT_TIMELINE_NAME = 'Default'
const DEFAULT_TIMELINE_TIME = 0
const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source'
const SYNC_LOCKED_ID_SUFFIX = '#lock'
const SELECTION_WAIT_TIME = 0
const SELECTION_PING_TIME = 100

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n)

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

    this.snapshots = []

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

    this.devConsole = DevConsole.upsert({
      uid: this.getPrimaryKey(),
      component: this
    })

    this.project.addActiveComponentToRegistry(this)

    // Used to control how we render in an editing environment, e.g. preview mode
    this.interactionMode = DEFAULT_INTERACTION_MODE

    Element.on('update', (element, what, metadata) => {
      if (element.component === this) {
        if (
          what === 'element-selected' ||
          what === 'element-selected-softly'
        ) {
          this.handleElementSelected(element.getComponentId(), metadata)
        } else if (
          what === 'element-unselected' ||
          what === 'element-unselected-softly'
        ) {
          this.handleElementUnselected(element.getComponentId(), metadata)
        } else if (what === 'element-hovered') {
          this.handleElementHovered(element.getComponentId(), metadata)
        } else if (what === 'element-unhovered') {
          this.handleElementUnhovered(element.getComponentId(), metadata)
        } else if (
          what === 'jit-property-added' ||
          what === 'jit-property-removed'
        ) {
          this.reload({
            hardReload: true,
            clearCacheOptions: {
              doClearEntityCaches: true
            }
          }, {}, () => {})
        }
        this.emit('update', what, element, metadata)
      }
    })

    Row.on('update', (row, what) => {
      if (row.component === this) {
        this.emit('update', what, row, this.project.getMetadata())
        if (what === 'row-collapsed' || what === 'row-expanded') {
          this.cache.unset('displayableRows')
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

  findElementRoot () {
    for (const element of Element.findRoots()) {
      if (element.component.uid === this.uid) {
        return element
      }
    }
    return null
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

  locateTemplateNodeByComponentId (componentId) {
    return this.getTemplateNodesByComponentId()[componentId]
  }

  getTemplateNodesByComponentId () {
    return this.cache.fetch('getTemplateNodesByComponentId', () => {
      const nodes = {}
      const mana = this.getReifiedBytecode().template
      Template.visit(mana, (node) => {
        if (node && node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]) {
          nodes[node.attributes[HAIKU_ID_ATTRIBUTE]] = node
        }
      })
      return nodes
    })
  }

  findTemplateNodeByComponentId (componentId) {
    const mana = this.getReifiedBytecode().template

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

  getCurrentTimelineTime () {
    // Although we own multiple instances, assume that they are operating in lockstep during
    // editing; we just need to grab a single 'canonical' one for reference
    const canonicalCoreInstance = this.$instance

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

  getCurrentMspf () {
    return 16.666
  }

  getRelpath () {
    return path.join('code', this.getSceneName(), 'code.js')
  }

  getLocalizedRelpath () {
    return Template.normalizePath(`./${this.getRelpath()}`)
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
    return this.file
  }

  tick () {
    // This guard is to allow headless mode, e.g. in Haiku's timeline application
    if (this.$instance.context && this.$instance.context.tick) {
      this.$instance.context.tick()
    }
  }

  forceFlush () {
    this.$instance.markForFullFlush(true)
    this.tick()
  }

  addHotComponents (hotComponents) {
    hotComponents.forEach((hotComponent) => {
      // hotComponent may be null if the timeline time was not 0
      if (hotComponent) {
        this.$instance.addHotComponent(hotComponent)
      }
    })
  }

  clearCaches (options = {}) {
    this.$instance.clearCaches(options)
    this.fetchRootElement().cache.clear()
    if (options.doClearEntityCaches) {
      this.fetchRootElement().clearEntityCaches()
    }
  }

  updateTimelineMaxes (timelineName) {
    const timeline = this.$instance.getTimeline(timelineName)
    if (timeline) {
      const descriptor = this.$instance.getTimelineDescriptor(timelineName)
      timeline.resetMaxDefinedTimeFromDescriptor(descriptor)
    }
  }

  getPropertyGroupValueFromPropertyKeys (componentId, timelineName, timelineTime, propertyKeys) {
    const groupValue = {}
    const bytecode = this.getReifiedBytecode()

    if (!bytecode) return groupValue
    if (!bytecode.timelines) return groupValue
    if (!bytecode.timelines[timelineName]) return groupValue
    if (!bytecode.timelines[timelineName][`haiku:${componentId}`]) return groupValue

    const cluster = bytecode.timelines[timelineName][`haiku:${componentId}`]

    propertyKeys.forEach((propertyKey) => {
      if (!cluster[propertyKey]) return
      if (!cluster[propertyKey][timelineTime]) return
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

  setCurrentTimelineFrameValue (frame) {
    this.getCurrentTimeline().seek(frame, /* skipTransmit= */ true)
  }

  setTimelineTimeValue (timelineTime, forceSeek = false) {
    timelineTime = Math.round(timelineTime)
    // When doing a hard reload (in which we load a fresh component instance from disk)
    // that component will be completely fresh and not yet in 'controlled time' mode, which
    // means that it will initially start playing. Hard reload depends on being able to
    // force set a time value to get it into 'controlled time' mode, hence the `forceSeek` flag.
    if (forceSeek || timelineTime !== this.getCurrentTimelineTime()) {
      // Note that this call reaches in and updates our instance's timeline objects
      Timeline.where({component: this}).forEach((timeline) => {
        timeline.seekToTime(timelineTime, /* skipTransmit= */ true, forceSeek)
      })

      // Perform a lightweight full flush render, recomputing all values without without trying to be clever about
      // which properties have actually changed.
      if (this.$instance.context && this.$instance.context.tick) {
        this.$instance.context.tick(true)
      }

      // Purge any ElementSelectionProxy caches in case the layout of selected elements is changing.
      ElementSelectionProxy.all().forEach((proxy) => {
        proxy.clearAllRelatedCaches()
        proxy.reinitializeLayout()
      })
    }
  }

  setTitleForComponent (componentId, newTitle, metadata, cb) {
    this.project.updateHook('setTitleForComponent', this.getRelpath(), componentId, newTitle, metadata, (fire) => {
      return this.performComponentWork((bytecode, mana, done) => {
        const templateNode = this.locateTemplateNodeByComponentId(componentId)
        if (!templateNode) {
          return done(null, '', '')
        }

        if (newTitle) {
          const oldTitle = templateNode.attributes[HAIKU_TITLE_ATTRIBUTE]
          templateNode.attributes[HAIKU_TITLE_ATTRIBUTE] = newTitle
          return done(null, newTitle, oldTitle)
        }

        return done(
          null,
          templateNode.attributes[HAIKU_TITLE_ATTRIBUTE],
          templateNode.attributes[HAIKU_TITLE_ATTRIBUTE]
        )
      }, (err, newTitle, oldTitle) => {
        if (err) {
          return cb(err)
        }
        const element = this.findElementByComponentId(componentId)
        if (element) {
          element.updateTargetingRows('row-set-title')
        }
        fire(null, oldTitle)
        return cb(null, newTitle)
      })
    })
  }

  setLockedStatusForComponent (componentId, locked, metadata, cb) {
    this.project.updateHook('setLockedStatusForComponent', this.getRelpath(), componentId, locked, metadata, (fire) => {
      return this.performComponentWork((bytecode, mana, done) => {
        const templateNode = this.locateTemplateNodeByComponentId(componentId)
        if (!templateNode) {
          return done(null, '', '')
        }

        const oldStatus = templateNode.attributes[HAIKU_LOCKED_ATTRIBUTE]
        templateNode.attributes[HAIKU_LOCKED_ATTRIBUTE] = locked
        return done(null, locked, oldStatus)
      }, (err, locked, oldStatus) => {
        if (err) {
          return cb(err)
        }
        const element = this.findElementByComponentId(componentId)
        if (element) {
          element.updateTargetingRows('row-set-locked')
        }
        fire(null, oldStatus)
        return cb(null, locked)
      })
    })
  }

  /**
   * @method handleElementSelected
   * @description Hook to call once an element in-memory has been selected.
   * This is responsible for notifying other views about the action, and emitting an event that others can listen to.
   * The metadata arg is important because it has info about who originated the message, allowing us to avoid infinite loop.
   * Note: This gets called automatically by element.select()
   */
  handleElementSelected (componentId, metadata) {
    metadata.integrity = false
    this.project.updateHook('selectElement', this.getRelpath(), componentId, metadata, (fire) => fire())
  }

  /**
   * @method handleElementUnselected
   * @description Hook to call once an element in-memory has been unselected.
   * This is responsible for notifying other views about the action, and emitting an event that others can listen to.
   * The metadata arg is important because it has info about who originated the message, allowing us to avoid infinite loop.
   * Note: This gets called automatically by element.unselect()
   */
  handleElementUnselected (componentId, metadata) {
    metadata.integrity = false
    this.project.updateHook('unselectElement', this.getRelpath(), componentId, metadata, (fire) => fire())
  }

  handleElementHovered (componentId, metadata) {
    metadata.integrity = false
    this.project.updateHook('hoverElement', this.getRelpath(), componentId, metadata, (fire) => fire())
  }

  handleElementUnhovered (componentId, metadata) {
    metadata.integrity = false
    this.project.updateHook('unhoverElement', this.getRelpath(), componentId, metadata, (fire) => fire())
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
        return this.selectElementWithinTime(waitTime - SELECTION_PING_TIME, componentId, metadata, cb)
      }, SELECTION_PING_TIME)
    }

    element.select(metadata)

    cb()
  }

  selectAll (options, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      this.getArtboard().getElement().children.forEach((element) => {
        if (element.isLocked()) return
        element.selectSoftly(metadata)
      })

      release()
      this.project.updateHook('selectAll', this.getRelpath(), options, metadata, (fire) => fire())
      return cb()
    })
  }

  selectElement (componentId, metadata, cb) {
    return this.selectElementWithinTime(SELECTION_WAIT_TIME, componentId, metadata, () => {
      return cb() // Must return or the plumbing action circuit never completes
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
        return this.unselectElementWithinTime(waitTime - SELECTION_PING_TIME, componentId, metadata, cb)
      }, SELECTION_PING_TIME)
    }

    element.unselect(metadata)

    return cb()
  }

  unselectElement (componentId, metadata, cb) {
    return this.unselectElementWithinTime(SELECTION_WAIT_TIME, componentId, metadata, () => {
      return cb() // Must return or the plumbing action circuit never completes
    })
  }

  hoverElement (componentId, metadata, cb) {
    const element = Element.findByComponentAndHaikuId(this, componentId)
    if (element) {
      element.hoverOn(metadata)
    }
    return cb()
  }

  unhoverElement (componentId, metadata, cb) {
    const element = Element.findByComponentAndHaikuId(this, componentId)
    if (element) {
      element.hoverOff(metadata)
    }
    return cb()
  }

  isPreviewModeActive () {
    return isPreviewMode(this.interactionMode)
  }

  /**
  * @method setInteractionMode
  * @description Changes the current interaction mode and flushes all cachés
  */
  setInteractionMode (interactionMode, cb) {
    this.interactionMode = interactionMode

    return this.reload({
      clearCacheOptions: {
        doClearEntityCaches: true
      }
    }, null, cb)
  }

  /**
  * @method setHotEditingMode
  * @description Changes the current hot-editing mode setting.
  * Used by Glass when playing the component using the "play" button.
  */
  setHotEditingMode (hotEditingMode) {
    this.$instance.assignConfig({hotEditingMode})
  }

  getInsertionPointInfo (nonce = 0) {
    const bytecode = this.getReifiedBytecode()

    const mana = bytecode && bytecode.template

    const index = (mana && mana.children && mana.children.length) || 0

    const template = mana && Template.manaWithOnlyMinimalProps(mana, () => ({}))

    const source = jss(template) + '-' + index + '-' + nonce

    const hash = Template.getHash(source, /* len= */ 6)

    return {
      template,
      source,
      hash
    }
  }

  getInsertionPointHash () {
    return this.getInsertionPointInfo().hash
  }

  /**
   * @method doesMatchOrHostComponent
   * @description Detect whether we contain other in our tree or in the subtrees of
   * any components that we host, or whether we are a match for other.
   */
  doesMatchOrHostComponent (other, cb) {
    if (other === this) {
      return cb(null, true)
    }

    if (
      Template.normalizePath(other.getRelpath()) ===
      Template.normalizePath(this.getRelpath())
    ) {
      return cb(null, true)
    }

    return cb(
      null,
      Bytecode.doesMatchOrHostBytecode(
        this.getReifiedBytecode(),
        other.getReifiedBytecode(),
        undefined // seen={}
      )
    )
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
    return subcomponent.doesMatchOrHostComponent(this, (err, answer) => {
      if (err) {
        return cb(err)
      }

      if (answer) {
        return cb(new Error('You cannot place a component within itself'))
      }

      let fullpath

      const isExternalModule = modpath[0] !== '.'

      if (!isExternalModule) {
        fullpath = path.join(this.project.getFolder(), modpath) // Expected to be ./*
      } else {
        fullpath = modpath
      }

      const file = (isExternalModule)
        ? PseudoFile.upsert({ relpath: modpath })
        : this.project.upsertFile({
          relpath: modpath,
          folder: this.project.getFolder()
        })

      // This assumes that the file has already been written to the file system or
      // stored inside the module require.cache via an earlier hook
      const mod = ModuleWrapper.upsert({
        uid: fullpath,
        isExternalModule,
        component: subcomponent,
        file
      })

      const title = subcomponent.getTitle()

      return mod.moduleAsMana(
        this.getRelpath(),
        identifier,
        title,
        (err, manaForWrapperElement) => {
          if (err) return cb(err)

          if (!manaForWrapperElement) {
            return cb(new Error(`Module ${fullpath} could not be imported`))
          }

          this.instantiateManaInBytecode(
            manaForWrapperElement,
            this.getReifiedBytecode(),
            overrides,
            coords
          )

          return cb(null, manaForWrapperElement)
        }
      )
    })
  }

  getTitle () {
    return pascalcase(this.getSceneName())
  }

  getAbspath () {
    return path.join(this.project.getFolder(), this.getRelpath())
  }

  fetchTimelinePropertyFromComponentElement (mana, propertyName) {
    if (!mana.elementName) return
    if (!mana.elementName.template) return
    if (!mana.elementName.template.attributes) return
    if (!mana.elementName.template.elementName) return

    return TimelineProperty.getComputedValue(
      mana.elementName.template.attributes[HAIKU_ID_ATTRIBUTE],
      mana.elementName.template.elementName,
      propertyName,
      this.getCurrentTimelineName(),
      this.getCurrentTimelineTime(),
      0,
      mana.elementName,
      mana.__subcomponent, // can be undefined
      mana.__subcomponent && mana.__subcomponent.state // can be undefined
    )
  }

  instantiateManaInBytecode (mana, bytecode, overrides, coords) {
    const {
      hash
    } = this.getInsertionPointInfo(0)

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

    // Used to be `.push` but it makes more sense to put at the top of the list,
    // so that it displays on top of other elements in the stack display
    bytecode.template.children.unshift(mana)

    this.mutateInstantiateeDisplaySettings(
      componentId,
      timelines,
      timelineName,
      timelineTime,
      mana,
      coords
    )

    Bytecode.applyOverrides(overrides, timelines, timelineName, `haiku:${componentId}`, timelineTime)

    Bytecode.mergeTimelines(bytecode.timelines, timelines)

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
  instantiateMana (mana, bytecode, coords, metadata, cb) {
    this.instantiateManaInBytecode(
      mana,
      bytecode,
      {},
      coords
    )
    return cb(null, mana)
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

  mutateInstantiateeDisplaySettings (
    componentId,
    timelinesObject,
    timelineName,
    timelineTime,
    templateObject,
    maybeCoords
  ) {
    // This method depends on being able to fetch data from the component instance,
    // so we call render here to ensure all the instances in the tree are bootstrapped
    const instance = this.$instance
    if (instance) {
      instance.context.getContainer(true) // Force recalc of container for correct sizing
      instance.render() // Flush a tree, ensuring new components are initialized
    }

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
        insertedTimeline['sizeAbsolute.x'][timelineTime].value = Layout3D.AUTO_SIZING_TOKEN

        // The default size mode is proportional, so if we received an absolute size, we have to override the mode
        if (!insertedTimeline['sizeMode.x']) insertedTimeline['sizeMode.x'] = {}
        if (!insertedTimeline['sizeMode.x'][timelineTime]) insertedTimeline['sizeMode.x'][timelineTime] = {}
        insertedTimeline['sizeMode.x'][timelineTime].value = Layout3D.SIZE_ABSOLUTE
      }

      const sizeAbsoluteY = this.fetchTimelinePropertyFromComponentElement(templateObject, 'sizeAbsolute.y')

      if (sizeAbsoluteY) {
        if (!insertedTimeline['sizeAbsolute.y']) insertedTimeline['sizeAbsolute.y'] = {}
        if (!insertedTimeline['sizeAbsolute.y'][timelineTime]) insertedTimeline['sizeAbsolute.y'][timelineTime] = {}
        insertedTimeline['sizeAbsolute.y'][timelineTime].value = Layout3D.AUTO_SIZING_TOKEN

        // The default size mode is proportional, so if we received an absolute size, we have to override the mode
        if (!insertedTimeline['sizeMode.y']) insertedTimeline['sizeMode.y'] = {}
        if (!insertedTimeline['sizeMode.y'][timelineTime]) insertedTimeline['sizeMode.y'][timelineTime] = {}
        insertedTimeline['sizeMode.y'][timelineTime].value = Layout3D.SIZE_ABSOLUTE
      }
    }

    if (maybeCoords !== undefined && maybeCoords !== null) {
      const propertyGroup = {}

      const {width, height} = this.getContextSizeActual(timelineName, timelineTime)

      if (maybeCoords && typeof maybeCoords.x === 'number') {
        propertyGroup['translation.x'] = maybeCoords.x
      } else {
        propertyGroup['translation.x'] = width / 2
      }
      if (maybeCoords && typeof maybeCoords.y === 'number') {
        propertyGroup['translation.y'] = maybeCoords.y
      } else {
        propertyGroup['translation.y'] = height / 2
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
   * @method conglomerateComponent
   * @description Given a list of existing component ids on stage, create a component
   * from them and place the result on the stage
   */
  conglomerateComponent (
    componentIds,
    name,
    size,
    translation,
    coords,
    propertiesSerial,
    metadata,
    cb
  ) {
    const properties = Bytecode.unserializeValue(propertiesSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      return this.project.updateHook(
        'conglomerateComponent',
        this.getRelpath(),
        componentIds,
        name,
        size,
        translation,
        coords,
        Bytecode.serializeValue(properties),
        metadata,
        (fire) => {
          const finish = (err, mana) => {
            if (err) {
              release()
              logger.error(`[active component (${this.project.getAlias()})]`, err)
              return cb(err)
            }

            return this.reload({
              hardReload: true,
              clearCacheOptions: {
                doClearEntityCaches: true
              }
            }, null, () => {
              release()
              fire(null, mana)
              this.selectElement(mana.attributes[HAIKU_ID_ATTRIBUTE], metadata, () => {})
              return cb(null, mana)
            })
          }

          return this.conglomerateComponentActual(
            componentIds,
            name,
            size,
            translation,
            coords,
            properties,
            metadata,
            finish
          )
        }
      )
    })
  }

  conglomerateComponentActual (
    ids,
    name,
    size,
    translation,
    coords,
    properties,
    metadata,
    cb
  ) {
    return this.performComponentWork((hostBytecode, hostTemplate, done) => {
      return this.project.upsertSceneByName(name, (err, newActiveComponent) => {
        if (err) return done(err)

        // Give the new component the passed-in properties, which includes its size
        const newBytecode = newActiveComponent.getReifiedBytecode()

        newActiveComponent.upsertProperties(
          newBytecode,
          newBytecode.template.attributes[HAIKU_ID_ATTRIBUTE],
          newActiveComponent.getInstantiationTimelineName(),
          newActiveComponent.getInstantiationTimelineTime(),
          lodash.assign({
            'sizeAbsolute.x': size.x,
            'sizeAbsolute.y': size.y
          }),
          'merge'
        )

        ids.forEach((id) => {
          const element = this.findElementByComponentId(id)

          // If we can't find this element, we are out of sync and need to crash
          if (!element) {
            throw new Error(`Cannot relocate element ${id}`)
          }

          // Grab the bytecode that will represent the element in the sub-component.
          // We have to do this before deleting the original element or we won't
          // be able to find the node in the current host template
          const elementBytecode = element.getQualifiedBytecode()

          // The size of the group selection is used to determine the size of the artboard
          // of the new component, which means we also have to offset the translations of all
          // children in accordance with their offset within their original artboard
          const elementOffset = {
            'translation.x': translation.x,
            'translation.y': translation.y
          }

          const timelineName = this.getCurrentTimelineName()

          const selector = Template.buildHaikuIdSelector(elementBytecode.template.attributes[HAIKU_ID_ATTRIBUTE])

          if (!elementBytecode.timelines[timelineName][selector]) {
            elementBytecode.timelines[timelineName][selector] = {}
          }

          for (const propertyName in elementOffset) {
            const offsetValue = elementOffset[propertyName]

            if (!elementBytecode.timelines[timelineName][selector][propertyName]) {
              elementBytecode.timelines[timelineName][selector][propertyName] = {}
            }

            if (!elementBytecode.timelines[timelineName][selector][propertyName][0]) {
              elementBytecode.timelines[timelineName][selector][propertyName][0] = {}
            }

            for (const keyframeMs in elementBytecode.timelines[timelineName][selector][propertyName]) {
              const existingValue = elementBytecode.timelines[timelineName][selector][propertyName][keyframeMs].value || 0
              const existingCurve = elementBytecode.timelines[timelineName][selector][propertyName][keyframeMs].curve

              if (typeof existingValue === 'function') {
                continue
              }

              const updatedValue = (isNumeric(existingValue))
                ? existingValue - offsetValue
                : offsetValue

              elementBytecode.timelines[timelineName][selector][propertyName][keyframeMs] = {
                value: updatedValue
              }

              if (existingCurve) {
                elementBytecode.timelines[timelineName][selector][propertyName][keyframeMs].curve = existingCurve
              }
            }
          }

          // Insert an identical element into the newly created component
          newActiveComponent.instantiateBytecode(elementBytecode)

          // Delete all elements that are going to be replaced by the new component
          this.deleteElementImpl(hostTemplate, id)
        })

        // We must hard reload the new active component to ensure its own models have
        // been hydrated, or else element removals on subsequent conglomerations will
        // fail, i.e. template integrity will mismatch between processes and crash.
        return newActiveComponent.reload({
          hardReload: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, {}, () => {
          // Need to ensure we make the requisite updates to disk
          newActiveComponent.handleUpdatedBytecode(newBytecode)

          const relpath = `./${newActiveComponent.getRelpath()}`
          const identifier = ModuleWrapper.modulePathToIdentifierName(relpath)

          // Finally we instantiate the created component on our own stage
          return this.instantiateReference(
            newActiveComponent, // subcomponent
            identifier,
            relpath,
            coords, // "coords"/"maybeCoords"
            properties, // properties
            metadata,
            (err) => {
              if (err) {
                return done(err)
              }

              // Now set up 'playback' settings on the same keyframes defined for the child.
              // This makes it clear that keyframes must be defined on the parent in order for
              // playback to work as expected in the child.
              const insertion = this.getReifiedBytecode().template.children[0]

              // Places on the host timeline that we're going to create 'playback' keyframes
              const bookends = [
                0,
                Timeline.getMaximumMs(
                  newActiveComponent.getReifiedBytecode(),
                  this.getInstantiationTimelineName()
                )
              ]

              bookends.forEach((ms) => {
                this.upsertProperties(
                  this.getReifiedBytecode(),
                  insertion.attributes[HAIKU_ID_ATTRIBUTE],
                  this.getInstantiationTimelineName(),
                  ms,
                  {'playback': PlaybackSetting.LOOP},
                  'merge'
                )
              })

              return done()
            }
          )
        })
      })
    }, (err) => {
      if (err) return cb(err)
      const insertion = this.getReifiedBytecode().template.children[0]
      return cb(null, insertion)
    })
  }

  instantiateBytecode (
    incomingBytecode
  ) {
    const timelineName = this.getInstantiationTimelineName()
    const timelineTime = this.getInstantiationTimelineTime()

    const existingBytecode = this.getReifiedBytecode()
    const existingTemplate = existingBytecode.template

    const {
      hash
    } = this.getInsertionPointInfo(0)

    Bytecode.padIds(incomingBytecode, (oldId) => {
      return Template.getHash(`${oldId}-${hash}`, 12)
    })

    // Has to happen after the above line in case an id was generated
    const componentId = incomingBytecode.template.attributes[HAIKU_ID_ATTRIBUTE]

    logger.info(`[active component (${this.project.getAlias()})] instantiatee (bytecode) ${componentId} via ${hash}`)

    existingTemplate.children.unshift(incomingBytecode.template)

    this.mutateInstantiateeDisplaySettings(
      componentId,
      incomingBytecode.timelines,
      timelineName,
      timelineTime,
      incomingBytecode.template,
      null // coords
    )

    Bytecode.mergeBytecodeControlStructures(existingBytecode, incomingBytecode)
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
    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      return this.project.updateHook(
        'instantiateComponent',
        this.getRelpath(),
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

            return this.reload({
              hardReload: true,
              clearCacheOptions: {
                doClearEntityCaches: true
              }
            }, null, () => {
              release()
              fire(null, manaForWrapperElement)

              cb(null, manaForWrapperElement)

              // Immediately select the element after it is placed on stage
              return this.selectElement(manaForWrapperElement.attributes[HAIKU_ID_ATTRIBUTE], metadata, () => {})
            })
          }

          return this.performComponentWork((bytecode, mana, done) => {
            // We'll treat an installed module path strictly as a reference and not copy it into our folder
            if (ModuleWrapper.doesRelpathLookLikeInstalledComponent(relpath)) {
              const installedComponent = InstalledComponent.upsert({
                modpath: relpath
              })

              return this.instantiateReference(
                installedComponent,
                installedComponent.getIdentifier(),
                relpath,
                coords,
                {'origin.x': 0.5, 'origin.y': 0.5},
                metadata,
                done
              )
            }

            // For local modules, the only caveat is that the component must be known in memory already
            if (ModuleWrapper.doesRelpathLookLikeLocalComponent(relpath)) {
              return this.project.findActiveComponentBySource(relpath, (err, subcomponent) => {
                if (!err && subcomponent) {
                  // We can't go further unless we actually have the reified bytecode
                  return subcomponent.moduleReload('basicReload', () => {
                    // This identifier is going to be something like foo_svg_blah
                    const localComponentIdentifier = ModuleWrapper.modulePathToIdentifierName(relpath)

                    return this.instantiateReference(
                      subcomponent,
                      localComponentIdentifier,
                      relpath,
                      coords,
                      {'origin.x': 0.5, 'origin.y': 0.5},
                      metadata,
                      done
                    )
                  })
                }

                return done(new Error(`Cannot find component ${relpath}`))
              })
            }

            if (ModuleWrapper.doesRelpathLookLikeSVGDesign(relpath)) {
              return File.readMana(this.project.getFolder(), relpath, (err, mana) => {
                if (err) return done(err)

                Template.fixManaSourceAttribute(mana, relpath) // Adds haiku-source="relpath_to_file_from_project_root"

                return this.instantiateMana(mana, bytecode, coords, metadata, done)
              })
            }

            if (Asset.isImage(relpath)) {
              const imageComponent = ImageComponent.upsert({
                project: this.project,
                relpath
              })

              return imageComponent.queryImageSize((err, size) => {
                if (err) {
                  return done(err)
                }

                const {width, height} = size

                return this.instantiateReference(
                  imageComponent, // subcomponent
                  imageComponent.identifier, // identifier
                  imageComponent.modpath, // modpath
                  coords, // coords
                  { // overrides
                    'origin.x': 0.5,
                    'origin.y': 0.5,
                    href: imageComponent.getLocalHref(),
                    width,
                    height
                  },
                  metadata,
                  done
                )
              })
            }

            return done(new Error(`Problem instantiating ${relpath}`))
          }, finish)
        }
      )
    })
  }

  deleteComponents (componentIds, metadata, cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      this.project.updateHook(
        'deleteComponents',
        this.getRelpath(),
        componentIds,
        metadata,
        (fire) => {
          return this.performComponentWork((bytecode, mana, done) => {
            componentIds.forEach((componentId) => {
              const element = this.findElementByComponentId(componentId)
              if (element) {
                element.remove()
              }
              this.deleteElementImpl(mana, componentId)
            })
            done()
          }, (err) => {
            if (err) {
              release()
              logger.error(`[active component (${this.project.getAlias()})]`, err)
              return cb(err)
            }

            return this.reload({
              hardReload: true,
              clearCacheOptions: {
                doClearEntityCaches: true
              }
            }, null, () => {
              release()
              fire()
              return cb()
            })
          })
        }
      )
    })
  }

  deleteElementImpl (
    mana,
    componentId
  ) {
    Template.visitManaTree(
      mana,
      (elementName, attributes, children, node, locator, parent, index) => {
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
      }
    )
  }

  mergePrimitiveWithOverrides (primitive, overrides, cb) {
    return this.performComponentWork((bytecode, template, done) => {
      Template.visit((template), (node) => {
        // Only merge into nodes that match our haiku-source design path
        if (node.attributes[HAIKU_SOURCE_ATTRIBUTE] !== primitive.getRequirePath()) {
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

  mergeMana (existingBytecode, manaIncoming, {mergeRemovedOutputs = true}) {
    let numMatchingNodes = 0

    const timelineName = this.getMergeDesignTimelineName()
    const timelineTime = this.getMergeDesignTimelineTime()

    Template.visitWithoutDescendingIntoSubcomponents(existingBytecode.template, (existingNode) => {
      // Only merge into any that match our source design path
      if (
        !existingNode.attributes[HAIKU_SOURCE_ATTRIBUTE] ||
        !manaIncoming.attributes[HAIKU_SOURCE_ATTRIBUTE] ||
        (
          Template.normalizePath(existingNode.attributes[HAIKU_SOURCE_ATTRIBUTE]) !==
          Template.normalizePath(manaIncoming.attributes[HAIKU_SOURCE_ATTRIBUTE])
        )
      ) {
        return
      }

      const safeIncoming = Template.clone({}, manaIncoming)

      const removedOutputs = this.removeChildContentFromBytecode(existingBytecode, existingNode)

      const {
        hash
      } = this.getInsertionPointInfo(numMatchingNodes++)

      const timelinesObject = Template.prepareManaAndBuildTimelinesObject(
        safeIncoming,
        hash,
        timelineName,
        timelineTime,
        {
          doHashWork: true
        }
      )

      const existingSelector = `haiku:${existingNode.attributes[HAIKU_ID_ATTRIBUTE]}`
      const incomingSelector = `haiku:${safeIncoming.attributes[HAIKU_ID_ATTRIBUTE]}`

      // Ensure properties destined for the root node are applied to the correct id
      timelinesObject[timelineName][existingSelector] = timelinesObject[timelineName][incomingSelector]
      delete timelinesObject[timelineName][incomingSelector]

      for (let i = 0; i < safeIncoming.children.length; i++) {
        const incomingChild = safeIncoming.children[i]
        existingNode.children.push(incomingChild)
      }

      Bytecode.mergeTimelines(existingBytecode.timelines, timelinesObject)

      if (mergeRemovedOutputs) {
        this.mergeRemovedOutputs(existingBytecode, existingNode, removedOutputs)
      }
    })
  }

  mergeDesignFiles (designs, cb) {
    return this.performComponentWork((bytecode, template, done) => {
      return this.mergeDesignFilesImpl(designs, bytecode, {}, done)
    }, cb)
  }

  mergeDesignFilesImpl (designs, bytecode, {mergeRemovedOutputs = true}, cb) {
    // Ensure order is the same across processes otherwise we'll end up with different insertion point hashes
    const designsAsArray = Object.keys(designs).sort((a, b) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    if (!designsAsArray.length) return cb()

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

          Template.fixManaSourceAttribute(mana, relpath) // Adds haiku-source="relpath_to_file_from_project_root"

          this.mergeMana(bytecode, mana, {mergeRemovedOutputs})
          return next()
        })
      } else {
        return next(new Error(`Problem merging ${relpath}`))
      }
    }, (err, out) => {
      if (err) return cb(err)

      const bytecode = this.getReifiedBytecode()

      // Make sure all components that host a copy of us now have updated bytecode for us
      this.project.getAllActiveComponents().forEach((ac) => {
        if (!ac.$instance) {
          return
        }

        ac.$instance.visitGuestHierarchy((instance) => {
          if (this.doesManageCoreInstance(instance)) {
            if (instance.node.__parent) {
              Object.assign(instance.node.__parent.elementName, bytecode)
            }

            Object.assign(instance.bytecode, bytecode)
          }
        })
      })

      return cb(null, out)
    })
  }

  /**
   * @method pasteThings
   * @description Flexibly paste some content into the component. Usually the thing pasted is going to be a
   * component, but this could theoretically handle any kind of 'pasteable' content.
   * @param pasteablesSerial {Array.<{}>} - Content of the thing to paste into the component.
   * @param options {{skipHashPadding: boolean}} - Optional object containing information about _how_ to paste
   * @param metadata {Object}
   * @param cb {Function}
   */
  pasteThings (pasteablesSerial, options, metadata, cb) {
    const pasteables = pasteablesSerial.map((pasteableSerial) => Bytecode.unserializeValue(pasteableSerial, (ref) => {
      return this.evaluateReference(ref)
    }))

    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      return this.project.updateHook('pasteThings', this.getRelpath(), pasteablesSerial, options, metadata, (fire) => {
        return this.performComponentWork((bytecode, mana, done) => {
          const haikuIds = []

          return async.eachSeries(pasteables, (pasteable, next) => {
            if (pasteable.kind === 'bytecode') {
              // Handle specially if the pasted thing is a component
              const nested = (
                pasteable.data &&
                pasteable.data.template &&
                pasteable.data.template.elementName
              )

              if (typeof nested === 'object') {
                const source = pasteable.data.template.attributes[HAIKU_SOURCE_ATTRIBUTE]
                const identifier = pasteable.data.template.attributes[HAIKU_VAR_ATTRIBUTE]
                const scenename = this.project.relpathToSceneName(source)

                nested.__reference = ModuleWrapper.buildReference(
                  ModuleWrapper.REF_TYPES.COMPONENT, // type
                  Template.normalizePath(`./${this.getRelpath()}`), // host
                  Template.normalizePathOfPossiblyExternalModule(source),
                  identifier
                )

                return this.project.findOrCreateActiveComponent(scenename, (err, ac) => {
                  if (err) {
                    return next(err)
                  }

                  // We can't go further unless we actually have the reified bytecode
                  return ac.moduleReload('basicReload', () => {
                    // In order to render correctly, the template.elementName needs to have the full
                    // bytecode object; note that core should automatically instantiate a HaikuComponent
                    lodash.assign(nested, ac.getReifiedBytecode())

                    haikuIds.push(this.pasteBytecodeImpl(bytecode, pasteable.data, options))
                    return next()
                  })
                })
              }

              haikuIds.push(this.pasteBytecodeImpl(bytecode, pasteable.data, options))
              return next()
            }

            logger.warn(`[active component (${this.project.getAlias()})] cannot paste ${pasteable.kind}`)
            return next()
          }, (err) => {
            return done(err, {haikuIds})
          })
        }, (err, {haikuIds}) => {
          if (err) {
            release()
            logger.error(`[active component (${this.project.getAlias()})]`, err)
            return cb(err)
          }

          return this.reload({
            hardReload: true,
            clearCacheOptions: {
              doClearEntityCaches: true
            }
          }, null, () => {
            release()
            fire(null, {haikuIds})
            return cb(null, {haikuIds})
          })
        })
      })
    })
  }

  pasteBytecodeImpl (ourBytecode, theirBytecode, {skipHashPadding = false}) {
    theirBytecode = Bytecode.clone(theirBytecode)

    if (!skipHashPadding) {
      // As usual, we use a hash rather than randomness because of multithreading
      const {
        hash
      } = this.getInsertionPointInfo(0)

      // Pasting bytecode is implemented as a bytecode merge, so we pad all of the
      // ids inside the bytecode and then merge it, so we end up with a new element
      // and new timeline properties defined for it. This mutates the object.
      Bytecode.padIds(theirBytecode, (oldId) => {
        return `${oldId}-${hash}`
      })
    }

    const haikuId = theirBytecode.template.attributes['haiku-id']

    // Paste handles "instantiating" a new template element for their bytecode
    Bytecode.pasteBytecode(ourBytecode, theirBytecode)

    logger.info(`[active component (${this.project.getAlias()})] pastee (bytecode) ${haikuId}`)

    return haikuId
  }

  evaluateReference (__reference) {
    const modref = ModuleWrapper.parseReference(__reference)

    if (modref && modref.type && modref.type === ModuleWrapper.REF_TYPES.COMPONENT) {
      const ac = this.project.findActiveComponentBySourceIfPresent(modref.source)

      if (ac) {
        const bytecode = ac.getReifiedBytecode()
        return lodash.assign({__reference}, bytecode)
      }
    }

    return __reference
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

  getFirstSelectedCurve () {
    const keyframes = this.getSelectedKeyframes()
    const selectedKeyframeWithCurve = keyframes.find((keyframe) => keyframe.isSelectedBody())
    return selectedKeyframeWithCurve ? selectedKeyframeWithCurve.getCurve() : null
  }

  dragStartSelectedKeyframes (dragData) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.dragStart(dragData))
  }

  dragStopSelectedKeyframes (dragData) {
    const keyframes = this.getSelectedKeyframes()
    keyframes.forEach((keyframe) => keyframe.dragStop(dragData))

    // We only update once we're finished dragging because moving keyframes may end up
    // destroying/creating keyframes in the bytecode, and when rehydrate() is called, the
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
              if (Number(keyframeMs) === 0) {
                const elementName = this.getElementNameOfComponentId(componentId)

                updates[timelineName][componentId][propertyName][keyframeMs] = {
                  value: TimelineProperty.getFallbackValue(
                    elementName,
                    propertyName
                  )
                }
              } else {
                // Special marker for inverter: before, there was no keyframe here.
                updates[timelineName][componentId][propertyName][keyframeMs] = null
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

  gatherZIndexKeyframeMoves (timelineName) {
    const keyframeMovesDescriptor = {[timelineName]: {}}
    this.getReifiedTemplate().children.forEach((child) => {
      keyframeMovesDescriptor[timelineName][child.attributes[HAIKU_ID_ATTRIBUTE]] = {
        'style.zIndex': {}
      }
    })
    return this.snapshotKeyframeMoves(keyframeMovesDescriptor)
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
        return this.hardReload(reloadOptions, instanceConfig, done)
      } else {
        return this.softReload(reloadOptions, instanceConfig, done)
      }
    }

    if (reloadOptions.skipReloadLock) {
      return runReload(cb)
    }

    // Note that this lock only occurs in .reload(); if you ever hard reload or
    // soft reload a la carte, you might get a race condition!
    return Lock.request(Lock.LOCKS.ActiveComponentReload, false, (release) => {
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

  softReload (reloadOptions, instanceConfig, cb) {
    // Make sure the maximum keyframe is correctly defined for proper playback calc
    this.updateTimelineMaxes(this.getCurrentTimelineName())

    this.clearCaches(reloadOptions.clearCacheOptions)

    // Check sustained warnings should be done after cache clear
    // We use emit so only creator will perform sustained warning check
    if (experimentIsEnabled(Experiment.WarnOnUndefinedStateVariables)) {
      this.emitDebouncedCheckSustainedWarning()
    }

    // If we were passed a "hot component" or asked to request a full flush render, forward this to our underlying
    // instances to ensure correct rendering. This can be skipped if softReload() was called in the
    // context of a hard reload, because hardReload() calls forceFlush() after soft reloading.
    if (!reloadOptions.hardReload) {
      if (reloadOptions.forceFlush) {
        this.forceFlush()
      } else if (reloadOptions.hotComponents) {
        this.addHotComponents(reloadOptions.hotComponents)
      }
    }

    return cb()
  }

  hardReload (reloadOptions, instanceConfig, finish) {
    const timelineTimeBeforeReload = this.getCurrentTimelineTime() || 0

    return async.series([
      (cb) => {
        // Stop the clock so we don't continue any animations while this update is happening
        if (this.$instance) {
          this.$instance.context.clock.stop()
        }

        return cb()
      },

      (cb) => {
        if (!reloadOptions.moduleReloadMethod) {
          return cb()
        }

        return this.moduleCreate(reloadOptions.moduleReloadMethod, instanceConfig, cb)
      },

      (cb) => {
        // softReload calls clearCaches, which clears the caches of our component instance
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
          // This has to happen __after softReload__ because soft reload calls
          // flush, and all the models need access to the rendered app in
          // order to compute various things properly (race condition)
          this.rehydrate()
        }

        // Fix caches from our on-stage controls.
        ElementSelectionProxy.clearCaches()

        // If we don't do this here, continued edits at this time won't work properly.
        // We have to do this  __after rehydrate__ so we update all copies fo the models we've
        // just loaded into memory who have reset attributes.
        this.forceFlush()

        this.setTimelineTimeValue(timelineTimeBeforeReload, /* forceSeek= */ true)

        // Start the clock again, as we should now be ready to flow updated component.
        if (this.$instance) {
          this.$instance.context.clock.start()

          // If the scrubber had been dragged past the max defined keyframe, the timeline instances
          // will start off in a not-playing state, the effect of which will be that scrubbing the
          // timeline will not animate the child; this sets the value to playing so that scrubbing works
          const timeline = this.$instance.getTimeline(this.getCurrentTimelineName())
          if (timeline) {
            timeline.setPlaying(true)
          }
        }

        // Solely used to allow glass to update internally when the authoritative frame changes
        this.project.emit(
          'change-authoritative-frame',
          Math.round(timelineTimeBeforeReload / this.getCurrentMspf())
        )

        return cb()
      }
    ], finish)
  }

  moduleReload (moduleReloadMethod = 'basicReload', cb) {
    return this.fetchActiveBytecodeFile().mod[moduleReloadMethod](cb)
  }

  doesManageCoreInstance (instance) {
    // In case an installed or builtin component doesn't declare its relpath
    if (!instance.getBytecodeRelpath()) {
      return false
    }

    return (
      path.normalize(instance.getBytecodeRelpath()) ===
      path.normalize(this.getRelpath())
    )
  }

  moduleCreate (moduleReloadMethod, instanceConfig = {}, cb) {
    return this.moduleReload(moduleReloadMethod, (err) => {
      if (err) return cb(err)

      const bytecode = this.getReifiedBytecode()

      // Don't clean up instances which may own the current editing context.
      // WARNING: be VERY careful changing anything here—your sanity depends on it.
      if (this.isProjectActiveComponent()) {
        this.project.getAllActiveComponents().forEach((ac) => {
          // We also deactivate our own instance since we're about to create a new one
          if (ac.$instance) {
            ac.$instance.visitGuestHierarchy((instance) => {
              instance.deactivate()

              if (this.doesManageCoreInstance(instance)) {
                if (instance.node.__parent) {
                  Object.assign(instance.node.__parent.elementName, bytecode)
                }

                Object.assign(instance.bytecode, bytecode)
              }

              instance.clearCaches({
                clearStates: true
              })
            })

            ac.$instance.context.contextUnmount()
            ac.$instance.context.getClock().stop()
          }
        })
      }

      if (this.$instance) {
        this.$instance.context.destroy()
      }

      const timelineTime = this.getCurrentTimelineTime()
      this.$instance = this.createInstance(bytecode, instanceConfig)

      // Sustained warnings checker (eg. injected function identifier not found, etc)
      this.sustainedWarningsChecker = new SustainedWarningChecker(this.$instance)

      // Use debounce to emit event to trigger sustained warnings check on haiku-creator
      this.emitDebouncedCheckSustainedWarning = lodash.debounce(() => {
        this.emit('sustained-check:start')
      }, CHECK_SUSTAINED_WARNINGS_DEBOUNCE_TIME, {leading: false, trailing: true})

      this.setTimelineTimeValue(timelineTime, /* forceSeek= */true)

      return cb()
    })
  }

  moduleFindOrCreate (moduleReloadMethod, instanceConfig, cb) {
    if (this.$instance) {
      return cb()
    }

    return this.moduleCreate(moduleReloadMethod, instanceConfig, cb)
  }

  isProjectActiveComponent () {
    return this.project.getCurrentActiveComponent() === this
  }

  createInstance (bytecode, config) {
    const factory = HaikuDOMAdapter(bytecode, null, null)

    const createdHaikuCoreComponent = factory(this.getMount().$el(), lodash.merge({}, {
      contextMenu: 'disabled', // Don't show the right-click context menu since our editing tools use right-click
      overflowX: 'visible',
      overflowY: 'visible',
      mixpanel: false, // Don't track events in mixpanel while the component is being built
      interactionMode: this.interactionMode,
      hotEditingMode: true // Don't clone the bytecode/template so we can mutate it in-place
    }, config))

    createdHaikuCoreComponent.context.getContainer(true) // Force recalc of container for correct sizing
    createdHaikuCoreComponent.render() // Expand the tree, ensuring new components are initialized
    createdHaikuCoreComponent.visitGuestHierarchy((instance) => {
      instance.activate() // Ensure all existing subcomponents are activated
    })

    return createdHaikuCoreComponent
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

    return this.reload({
      hardReload: true,
      moduleReloadMethod: 'basicReload',
      clearCacheOptions: {
        doClearEntityCaches: true
      }
    }, instanceConfig, (err) => {
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
  }

  /**
  * @method reloadBytecodeFromDisk
  * @description Reloads bytecode from disk. This may be necessary if we want to munge on a copy of bytecode for our
  * own purposes, e.g. during export to another format.
  */
  reloadBytecodeFromDisk (cb) {
    this.fetchActiveBytecodeFile().mod.isolatedForceReload(cb)
  }

  sleepComponentsOn () {
    HaikuComponent.all().forEach((instance) => {
      instance.sleepOn()
    })
  }

  sleepComponentsOff () {
    HaikuComponent.all().forEach((instance) => {
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
    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      this.codeReloadingOn()

      return this.reload({
        hardReload: true,
        moduleReloadMethod: 'reload',
        clearCacheOptions: {
          doClearEntityCaches: true
        }
      }, null, (err) => {
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

  /**
   * @method moduleSync
   * @description Basically identical to `moduleReplace`, but without reloading from disk.
   */
  moduleSync (cb) {
    return Lock.request(Lock.LOCKS.ActiveComponentWork, false, (release) => {
      this.codeReloadingOn()

      return this.reload({
        hardReload: true,
        moduleReloadMethod: 'basicReload',
        clearCacheOptions: {
          doClearEntityCaches: true
        }
      }, null, (err) => {
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

  pushBytecodeSnapshot (done) {
    // Push our reified decycled bytecode into our local snapshots with no prejudice.
    // TODO: does this leak too much memory?
    this.snapshots.push(
      Bytecode.snapshot(this.fetchActiveBytecodeFile().getReifiedDecycledBytecode({suppressSubcomponents: false}))
    )
    done()
  }

  popBytecodeSnapshot (metadata, cb) {
    return this.project.updateHook('popBytecodeSnapshot', this.getRelpath(), metadata, (fire) => {
      this.fetchActiveBytecodeFile().updateInMemoryHotModule(
        // We are our own inversion, so the action stack will have pushed a snapshot onto the snapshot stack before we
        // got here. As a result, the snapshot we actually pop is the penultimate one in the stack and not the final
        // one.
        this.snapshots.splice(this.snapshots.length - 2, 1)[0],
        () => {
          this.moduleSync(() => {
            fire()
            return cb()
          })
        }
      )
    })
  }

  rehydrate () {
    // Don't allow any incoming syncs while we're in the midst of this
    BaseModel.__sync = false

    this.cache.unset('displayableRows')
    this.cache.unset('getTemplateNodesByComponentId')

    // Required before rehydration because entities use the timeline entity
    Timeline.upsert({
      uid: this.buildCurrentTimelineUid(),
      folder: this.project.getFolder(),
      name: this.getCurrentTimelineName(),
      component: this
    }, {})

    const root = this.fetchRootElement()

    Keyframe.where({ component: this }).forEach((keyframe) => keyframe.mark())
    Row.where({ component: this }).forEach((row) => row.mark())

    Element.where({ component: this }).forEach((element) => {
      if (element !== root) {
        element.mark()
      }
    })

    // We *must* unset this or else stale elements will be left, messing up rehydration
    root.children = []

    root.rehydrate({maxRehydrationDepth: 1})

    // Note that visitAll also visits self, so all elements' rows get rehydrated here
    root.visitAll((element) => {
      element.rehydrateRows()
    })

    Element.where({ component: this }).forEach((element) => {
      if (element !== root) {
        element.sweep()
      }
    })

    Row.where({ component: this }).forEach((row) => row.sweep())
    Keyframe.where({ component: this }).forEach((keyframe) => keyframe.sweep())

    const row = root.getAllRows()[0]
    if (row) {
      // Expand the first (topmost) row by default, only if this is the first run
      if (!row._wasInitiallyExpanded) {
        row._isExpanded = true
        row._wasInitiallyExpanded = true
      }
    }

    // Now that we have all the initial models ready, we can receive syncs
    BaseModel.__sync = true
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

  getComponentId () {
    return this.getArtboard().getElementHaikuId()
  }

  isAutoSizeX () {
    return this.getDeclaredPropertyValue(
      this.getComponentId(),
      this.getCurrentTimelineName(),
      this.getCurrentTimelineTime(),
      'sizeAbsolute.x'
    ) === 'auto'
  }

  isAutoSizeY () {
    return this.getDeclaredPropertyValue(
      this.getComponentId(),
      this.getCurrentTimelineName(),
      this.getCurrentTimelineTime(),
      'sizeAbsolute.y'
    ) === 'auto'
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
    const host = this.$instance
    const states = (host && host.getStates()) || {}
    return TimelineProperty.getComputedValue(componentId, Element.safeElementName(element), propertyName, timelineName || DEFAULT_TIMELINE_NAME, timelineTime || DEFAULT_TIMELINE_TIME, fallbackValue, bytecode, host, states)
  }

  getContextSize () {
    return this.getContextSizeActual(this.getCurrentTimelineName(), this.getCurrentTimelineTime())
  }

  getContextSizeActual (timelineName, timelineTime) {
    const defaults = {width: 1, height: 1} // In case of race where collateral isn't ready yet

    const bytecode = this.getReifiedBytecode()

    if (!bytecode || !bytecode.template || !bytecode.template.attributes) {
      return defaults
    }

    const contextHaikuId = bytecode.template.attributes[HAIKU_ID_ATTRIBUTE]

    if (!contextHaikuId) {
      return defaults
    }

    const contextElementName = Element.safeElementName(bytecode.template)

    if (!contextElementName) {
      return defaults
    }

    const modelElement = this.findElementByComponentId(contextHaikuId)

    // We can't get the HaikuElement nor compute a size if the live node is missing.
    // This guard is to ensure we don't crash in case of races or in a headless test context.
    if (!modelElement || !modelElement.getLiveRenderedNode()) {
      return defaults
    }

    const haikuElement = modelElement.getHaikuElement()

    if (!haikuElement) {
      return defaults
    }

    const host = this.$instance
    const states = (host && host.getStates()) || {}

    let contextWidth = TimelineProperty.getComputedValue(
      contextHaikuId,
      contextElementName,
      'sizeAbsolute.x',
      timelineName || DEFAULT_TIMELINE_NAME,
      timelineTime || DEFAULT_TIMELINE_TIME,
      0,
      bytecode,
      host,
      states
    )

    let contextHeight = TimelineProperty.getComputedValue(
      contextHaikuId,
      contextElementName,
      'sizeAbsolute.y',
      timelineName || DEFAULT_TIMELINE_NAME,
      timelineTime || DEFAULT_TIMELINE_TIME,
      0,
      bytecode,
      host,
      states
    )

    if (typeof contextWidth !== 'number') {
      contextWidth = haikuElement.computeSizeX()
    }

    if (typeof contextHeight !== 'number') {
      contextHeight = haikuElement.computeSizeY()
    }

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

  getDisplayableRowsGroupedByElementInZOrder () {
    const stack = this.getRawStackingInfo(
      this.getInstantiationTimelineName(),
      this.getInstantiationTimelineTime() // Assume z-dragging only at 0
    ).reverse()

    const root = this.fetchRootElement()

    const rows = root.getHostedPropertyRows(false)
    const all = [].concat(rows)

    const groups = [{
      host: root,
      id: root.getComponentId(),
      rows
    }].concat(stack.map(({haikuId}) => {
      const child = this.findElementByComponentId(haikuId)

      // Race condition when undoing multi-delete
      if (child) {
        const rows = child.getHostedPropertyRows(true)
        all.push.apply(all, rows)
        return {
          host: child,
          id: child.getComponentId(),
          rows
        }
      }
    }))

    // It's hacky to do this here but ultimately easier than finding the
    // right place to do it when rehydrating. Note that prev/next is only
    // used by Timeline in order to provide keyboard navigation of rows
    const first = all[0]
    const last = all[all.length - 1]
    all.forEach((row, index) => {
      const prev = all[index - 1]
      row._prev = null
      row._next = null
      if (prev) {
        row._prev = prev
        prev._next = row
      }
    })
    first._prev = last
    last._next = first

    return groups
  }

  getSelectedKeyframes () {
    return Keyframe.where({ component: this, _selected: true })
  }

  /**
   * Returns a boolean indicating if *all* of the selected keyframes
   * are the first non-zero keyframe in their row.
   *
   * @returns Boolean
   */
  checkIfSelectedKeyframesAreMovableToZero () {
    const selectedKeyframes = this.getSelectedKeyframes()
    const notMovable = selectedKeyframes.findIndex(
      (keyframe) => !(keyframe.prev() && keyframe.prev().origMs === 0)
    )
    return notMovable === -1
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

    return Lock.request(Lock.LOCKS.FilePerformComponentWork, false, (release) => {
      const finish = (err, ...result) => {
        release()
        return cb(err, ...result)
      }

      const bytecode = this.getReifiedBytecode()

      return worker(bytecode, bytecode.template, (err, ...result) => {
        if (err) {
          return finish(err)
        }

        this.handleUpdatedBytecode(bytecode)

        // Now that we're finished, we can resume on-stage playback
        this.sleepComponentsOff()

        return finish(null, ...result)
      })
    })
  }

  handleUpdatedBytecode (bytecode) {
    Bytecode.cleanBytecode(bytecode)
    Template.cleanTemplate(bytecode.template)
    const file = this.fetchActiveBytecodeFile()
    file.updateInMemoryHotModule(bytecode, () => {
      this.fetchActiveBytecodeFile().requestAsyncContentFlush()
    })
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
    const element = this.findTemplateNodeByComponentId(componentId)
    return element && element.elementName
  }

  getTimelineDescriptor (timelineName) {
    const bytecode = this.getReifiedBytecode()
    return bytecode && bytecode.timelines && bytecode.timelines[timelineName]
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
    // If we received items out of order, fix their z-indexes.
    stackingInfo
      .forEach(({ haikuId }, arrayIndex) => {
        this.upsertProperties(
          bytecode,
          haikuId,
          timelineName,
          timelineTime,
          {
            'style.zIndex': arrayIndex + 1
          },
          'merge'
        )
      })
  }

  grabStackObjectFromStackingInfo (stackingInfo, componentId) {
    for (let index = stackingInfo.length - 1; index >= 0; index--) {
      if (stackingInfo[index].haikuId === componentId) {
        return {ourStackObject: stackingInfo.splice(index, 1)[0], index}
      }
    }
  }

  /**
   * @method writeMetadata
   */
  writeMetadata (metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      Bytecode.writeMetadata(
        bytecode,
        lodash.assign({}, metadata, {title: this.getTitle()})
      )
      done()
    }, cb)
  }

  /**
   * @method readMetadata
   */
  readMetadata (cb) {
    return cb(null, this.getReifiedBytecode().metadata || {})
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
    const handlerDescriptor = Bytecode.unserializeValue(handlerDescriptorMaybeSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('upsertEventHandler', this.getRelpath(), selectorName, eventName, Bytecode.serializeValue(handlerDescriptor), metadata, (fire) => {
      handlerDescriptor.edited = true

      return this.upsertEventHandlerActual(selectorName, eventName, handlerDescriptor, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
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
    const events = Bytecode.unserializeValue(eventsSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('batchUpsertEventHandlers', this.getRelpath(), selectorName, Bytecode.serializeValue(events), metadata, (fire) => {
      return this.batchUpsertEventHandlersActual(selectorName, events, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
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
    return this.project.updateHook('deleteEventHandler', this.getRelpath(), selectorName, eventName, metadata, (fire) => {
      return this.deleteEventHandlerActual(selectorName, eventName, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true
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
    const newValue = Bytecode.unserializeValue(newValueSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('changeKeyframeValue', this.getRelpath(), componentId, timelineName, propertyName, keyframeMs, Bytecode.serializeValue(newValue), metadata, (fire) => {
      return this.changeKeyframeValueActual(componentId, timelineName, propertyName, keyframeMs, newValue, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
    const newCurve = Bytecode.unserializeValue(newCurveSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('changeSegmentCurve', this.getRelpath(), componentId, timelineName, propertyName, keyframeMs, Bytecode.serializeValue(newCurve), metadata, (fire) => {
      return this.changeSegmentCurveActual(componentId, timelineName, propertyName, keyframeMs, newCurve, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
    const newCurve = Bytecode.unserializeValue(newCurveSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('joinKeyframes', this.getRelpath(), componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, Bytecode.serializeValue(newCurve), metadata, (fire) => {
      return this.joinKeyframesActual(componentId, timelineName, elementName, propertyName, keyframeMsLeft, keyframeMsRight, newCurve, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: true,
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          },
          customRehydrate: () => {
            if (this.project.isRemoteRequest(metadata)) {
              this.rehydrate()
              return
            }
            const element = this.findElementByComponentId(componentId)
            if (element) {
              const row = element.getPropertyRowByPropertyName(propertyName)
              const keyframe = row.getKeyframeByMs(keyframeMsLeft)
              if (keyframe) {
                keyframe.setCurve(newCurve)
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
    return this.project.updateHook('splitSegment', this.getRelpath(), componentId, timelineName, elementName, propertyName, keyframeMs, metadata, (fire) => {
      return this.splitSegmentActual(componentId, timelineName, elementName, propertyName, keyframeMs, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: true,
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          },
          customRehydrate: () => {
            if (this.project.isRemoteRequest(metadata)) {
              this.rehydrate()
              return
            }
            const element = this.findElementByComponentId(componentId)
            if (element) {
              const row = element.getPropertyRowByPropertyName(propertyName)
              const keyframe = row.getKeyframeByMs(keyframeMs)
              if (keyframe) {
                keyframe.setCurve(null)
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
    propertyName,
    fallbackToInitialKeyframeIfProvided = true
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
      if (fallbackToInitialKeyframeIfProvided && initialKeyframeObj) {
        descriptor[0].value = Bytecode.unserializeValue(initialKeyframeObj.value, (ref) => this.evaluateReference(ref))
      } else {
        // Otherwise, use the fallback if we have no next keyframe defined
        const declaredValue = this.getDeclaredPropertyValue(
          componentId,
          timelineName,
          0,
          propertyName
        )

        descriptor[0].value = Bytecode.unserializeValue(declaredValue, (ref) => this.evaluateReference(ref))
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

    const keyframeMoves = Bytecode.unserializeValue(keyframeMovesSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('moveKeyframes', this.getRelpath(), Bytecode.serializeValue(keyframeMoves), metadata, (fire) => {
      return this.moveKeyframesActual(keyframeMoves, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: true,
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          },
          customRehydrate: () => {
            if (this.project.isRemoteRequest(metadata)) {
              this.rehydrate()
              return
            }
            for (const timelineName in keyframeMoves) {
              for (const componentId in keyframeMoves[timelineName]) {
                const element = this.findElementByComponentId(componentId)
                if (!element) { // Entity may not exist in all views
                  continue
                }

                for (const propertyName in keyframeMoves[timelineName][componentId]) {
                  const row = element.getPropertyRowByPropertyName(propertyName)
                  if (!row) { // Entity may not exist in all views
                    continue
                  }

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
              propertyName,
              false
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
  updateKeyframes (keyframeUpdatesSerial, options, metadata, cb) {
    const keyframeUpdates = Bytecode.unserializeValue(keyframeUpdatesSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('updateKeyframes', this.getRelpath(), Bytecode.serializeValue(keyframeUpdates), options, metadata, (fire) => {
      const unlockedDesigns = {}
      if (options.setElementLockStatus) {
        for (const elID in options.setElementLockStatus) {
          const node = this.findTemplateNodeByComponentId(elID)
          const lockStatus = options.setElementLockStatus[elID]
          if (!lockStatus && node.attributes[HAIKU_SOURCE_ATTRIBUTE].endsWith(SYNC_LOCKED_ID_SUFFIX)) {
            node.attributes[HAIKU_SOURCE_ATTRIBUTE] = node.attributes[HAIKU_SOURCE_ATTRIBUTE].replace(SYNC_LOCKED_ID_SUFFIX, '')
            unlockedDesigns[node.attributes[HAIKU_SOURCE_ATTRIBUTE]] = true
          } else if (lockStatus && !node.attributes[HAIKU_SOURCE_ATTRIBUTE].endsWith(SYNC_LOCKED_ID_SUFFIX)) {
            node.attributes[HAIKU_SOURCE_ATTRIBUTE] = node.attributes[HAIKU_SOURCE_ATTRIBUTE] + SYNC_LOCKED_ID_SUFFIX
          }
        }
      }

      return this.updateKeyframesActual(keyframeUpdates, {unlockedDesigns}, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: !!metadata.cursor,
          hotComponents: keyframeUpdatesToHotComponentDescriptors(keyframeUpdates),
          clearCacheOptions: {
            doClearEntityCaches: !!metadata.cursor
          },
          customRehydrate: () => {
            const componentIds = {}

            for (const timelineName in keyframeUpdates) {
              for (const componentId in keyframeUpdates[timelineName]) {
                // Only run once for each component id
                if (componentIds[componentId]) continue
                componentIds[componentId] = true

                const element = this.findElementByComponentId(componentId)

                // Not all views necessarily have the same collection of elements
                if (element) {
                  Row.where({ component: this, element }).forEach((row) => {
                    row.rehydrate()
                  })
                }
              }
            }

            if (options.setElementLockStatus) {
              for (const elID in options.setElementLockStatus) {
                const element = this.findElementByComponentId(elID)
                Row.where({ component: this, element }).forEach((row) => {
                  row.rehydrate()
                })
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

  updateKeyframesActual (keyframeUpdates, {unlockedDesigns}, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      for (const timelineName in keyframeUpdates) {
        if (!bytecode.timelines[timelineName]) bytecode.timelines[timelineName] = {}
        for (const componentId in keyframeUpdates[timelineName]) {
          const selector = Template.buildHaikuIdSelector(componentId)
          if (!bytecode.timelines[timelineName][selector]) bytecode.timelines[timelineName][selector] = {}
          for (const propertyName in keyframeUpdates[timelineName][componentId]) {
            if (!bytecode.timelines[timelineName][selector][propertyName]) bytecode.timelines[timelineName][selector][propertyName] = {}
            for (const keyframeMs in keyframeUpdates[timelineName][componentId][propertyName]) {
              const propertyObj = keyframeUpdates[timelineName][componentId][propertyName][keyframeMs]
              if (propertyObj === null) {
                // Special directive to remove this property if defined.
                delete bytecode.timelines[timelineName][selector][propertyName][keyframeMs]
                continue
              }
              if (!bytecode.timelines[timelineName][selector][propertyName][keyframeMs]) bytecode.timelines[timelineName][selector][propertyName][keyframeMs] = {}

              const keyfVal = (typeof propertyObj.value === 'function')
                ? propertyObj.value
                : lodash.clone(propertyObj.value)

              bytecode.timelines[timelineName][selector][propertyName][keyframeMs].value = keyfVal
              // Note: we set fallbackToInitialKeyframeIfProvided to `false` here, ensuring that we always use the
              // "implicit" value for properties whose first keyframes are created at a time after t = 0.
              this.ensureZerothKeyframe(bytecode, timelineName, componentId, propertyName, false)
            }
          }
        }
      }

      // Clear timeline caches; the max frame might have changed.
      Timeline.clearCaches()

      this.mergeDesignFilesImpl(unlockedDesigns, bytecode, {mergeRemovedOutputs: false}, done)
    }, cb)
  }

  updateTypesActual (typeUpdates, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      for (const id in typeUpdates) {
        const node = this.locateTemplateNodeByComponentId(id)
        node.elementName = typeUpdates[id]
      }

      done()
    }, cb)
  }

  updateKeyframesAndTypes (keyframeUpdatesSerial, typeUpdates, options, metadata, cb) {
    const keyframeUpdates = Bytecode.unserializeValue(keyframeUpdatesSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('updateKeyframesAndTypes', this.getRelpath(), Bytecode.serializeValue(keyframeUpdates), typeUpdates, options, metadata, (fire) => {
      const unlockedDesigns = {}
      if (options.setElementLockStatus) {
        for (const elID in options.setElementLockStatus) {
          const node = this.findTemplateNodeByComponentId(elID)
          const lockStatus = options.setElementLockStatus[elID]
          if (!lockStatus && node.attributes[HAIKU_SOURCE_ATTRIBUTE].endsWith(SYNC_LOCKED_ID_SUFFIX)) {
            node.attributes[HAIKU_SOURCE_ATTRIBUTE] = node.attributes[HAIKU_SOURCE_ATTRIBUTE].replace(SYNC_LOCKED_ID_SUFFIX, '')
            unlockedDesigns[node.attributes[HAIKU_SOURCE_ATTRIBUTE]] = true
          } else if (lockStatus && !node.attributes[HAIKU_SOURCE_ATTRIBUTE].endsWith(SYNC_LOCKED_ID_SUFFIX)) {
            node.attributes[HAIKU_SOURCE_ATTRIBUTE] = node.attributes[HAIKU_SOURCE_ATTRIBUTE] + SYNC_LOCKED_ID_SUFFIX
          }
        }
      }

      return this.updateKeyframesActual(keyframeUpdates, {unlockedDesigns}, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.updateTypesActual(typeUpdates, metadata, (err) => {
          if (err) {
            logger.error(`[active component (${this.project.getAlias()})]`, err)
            return cb(err)
          }

          return this.reload({
            hardReload: this.project.isRemoteRequest(metadata),
            forceFlush: !!metadata.cursor,
            hotComponents: keyframeUpdatesToHotComponentDescriptors(keyframeUpdates),
            clearCacheOptions: {
              doClearEntityCaches: !!metadata.cursor
            },
            customRehydrate: () => {
              const componentIds = {}

              for (const timelineName in keyframeUpdates) {
                for (const componentId in keyframeUpdates[timelineName]) {
                  // Only run once for each component id
                  if (componentIds[componentId]) continue
                  componentIds[componentId] = true

                  const element = this.findElementByComponentId(componentId)

                  // Not all views necessarily have the same collection of elements
                  if (element) {
                    Row.where({ component: this, element }).forEach((row) => {
                      row.rehydrate()
                    })
                  }
                }
              }

              if (options.setElementLockStatus) {
                for (const elID in options.setElementLockStatus) {
                  const element = this.findElementByComponentId(elID)
                  Row.where({ component: this, element }).forEach((row) => {
                    row.rehydrate()
                  })
                }
              }
            }
          }, null, () => {
            fire()
            return cb()
          })
        })
      })
    })
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
    const keyframeValue = Bytecode.unserializeValue(keyframeValueSerial, (ref) => {
      return this.evaluateReference(ref)
    })
    const keyframeCurve = Bytecode.unserializeValue(keyframeCurveSerial, (ref) => {
      return this.evaluateReference(ref)
    })
    const keyframeEndValue = Bytecode.unserializeValue(keyframeEndValueSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook(
      'createKeyframe',
      this.getRelpath(),
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
        return this.createKeyframeActual(componentId, timelineName, elementName, propertyName, keyframeStartMs, keyframeValue, keyframeCurve, keyframeEndMs, keyframeEndValue, metadata, (err) => {
          if (err) {
            logger.error(`[active component (${this.project.getAlias()})]`, err)
            return cb(err)
          }

          return this.reload({
            hardReload: true,
            clearCacheOptions: {
              doClearEntityCaches: true
            },
            customRehydrate: () => {
              if (this.project.isRemoteRequest(metadata)) {
                this.rehydrate()
                return
              }
              const element = this.findElementByComponentId(componentId)
              if (!element) { // Entity may not exist in all views
                return
              }

              const row = element.getPropertyRowByPropertyName(propertyName)
              if (!row) { // Entity may not exist in all views
                return
              }

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
      const host = this.$instance
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
    return this.project.updateHook('deleteKeyframe', this.getRelpath(), componentId, timelineName, propertyName, keyframeMs, metadata, (fire) => {
      return this.deleteKeyframeActual(componentId, timelineName, propertyName, keyframeMs, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        // In case we ended up with a materially different, immutable-looking property group after removing a
        // second-from-last keyframe, request a force flush.
        return this.reload({
          hardReload: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          },
          customRehydrate: () => {
            if (this.project.isRemoteRequest(metadata)) {
              this.rehydrate()
              return
            }

            const element = this.findElementByComponentId(componentId)
            if (!element) { // Entity may not exist in all views
              return
            }

            const row = element.getPropertyRowByPropertyName(propertyName)
            if (!row) { // Entity may not exist in all views
              return
            }

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

  get nextSuggestedGroupName () {
    const reservations = []
    this.getElements().forEach((element) => {
      const matches = element.getTitle().match(/^group (\d+)$/i)
      if (matches) {
        reservations.push(Number(matches[1]))
      }
    })

    return `Group ${Math.max(reservations) + 1}`
  }

  /**
   * @method groupElements
   */
  groupElements (componentIds, groupMana, coords, metadata, cb) {
    return this.project.updateHook('groupElements', this.getRelpath(), componentIds, groupMana, coords, metadata, (fire) => {
      return this.groupElementsActual(componentIds, groupMana, coords, metadata, (err, groupComponentId) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire(null, groupComponentId)
          this.findElementByComponentId(groupComponentId).select(metadata)
          return cb()
        })
      })
    })
  }

  groupElementsActual (componentIds, groupManaIn, coords, metadata, cb) {
    // Make a copy so that we don't have to decycle.
    const groupMana = lodash.cloneDeep(groupManaIn)
    const originalTimeline = this.getTimelineDescriptor(this.getCurrentTimelineName())
    return this.performComponentWork((bytecode, mana, done) => {
      const timelineName = this.getInstantiationTimelineName()
      const timelineTime = this.getInstantiationTimelineTime()

      const nodesToRegroup = []

      // We only allow grouping of the top level elements, hence iterating children, not visiting
      for (let i = mana.children.length - 1; i >= 0; i--) {
        const node = mana.children[i]
        if (!node.attributes) {
          continue
        }

        if (componentIds.indexOf(node.attributes[HAIKU_ID_ATTRIBUTE]) !== -1) {
          const timelineSelector = `haiku:${node.attributes[HAIKU_ID_ATTRIBUTE]}`
          // Add to a list of nodes we want to regroup
          nodesToRegroup.push(node)

          // Remove node from its existing parent
          mana.children.splice(i, 1)

          // Clobber all layout properties using their current values.
          if (!originalTimeline[timelineSelector]) {
            continue
          }
          const propertyGroup = Object.keys(originalTimeline[timelineSelector]).reduce((accumulator, propertyName) => {
            if (LAYOUT_3D_SCHEMA[propertyName]) {
              accumulator[propertyName] = {
                0: {
                  value: this.getComputedPropertyValue(
                    mana,
                    node.attributes[HAIKU_ID_ATTRIBUTE],
                    timelineName,
                    this.getCurrentTimelineTime(),
                    propertyName,
                    undefined
                  )
                }
              }
            }
            return accumulator
          }, {})
          Bytecode.replaceTimelinePropertyGroups(bytecode, timelineName, timelineSelector, propertyGroup)
        }
      }

      const groupComponentId = this.instantiateManaInBytecode(groupMana, bytecode, {}, coords)
      groupMana.children[0].children = nodesToRegroup

      // Place the new group at the top.
      const stackingInfo = Template.getStackingInfo(bytecode, mana, timelineName, timelineTime)
      const stackObject = this.grabStackObjectFromStackingInfo(stackingInfo, groupComponentId)

      // Don't know why, but sometimes the stack object can be undefined
      const ourStackObject = stackObject && stackObject.ourStackObject
      if (ourStackObject) {
        stackingInfo.push(ourStackObject) // Push to front
      } else {
        logger.warn(`[active component] stack object missing at ${timelineName} ${timelineTime}`)
      }

      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)

      done(null, groupComponentId)
    }, cb)
  }

  /**
   * @method ungroupElements
   */
  ungroupElements (componentId, nodes, metadata, cb) {
    return this.project.updateHook('ungroupElements', this.getRelpath(), componentId, nodes, metadata, (fire) => {
      const clonedNodes = lodash.cloneDeep(nodes)
      return this.ungroupElementsActual(componentId, clonedNodes, metadata, (err, ungroupedComponentIds) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: true,
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire(null, ungroupedComponentIds)
          return cb()
        })
      })
    })
  }

  ungroupElementsActual (componentId, nodes, metadata, cb) {
    return this.performComponentWork((bytecode, mana, done) => {
      // `nodes` is an array of clean mana we can instantiate as-is.
      const updatedComponentIds = nodes.map((node) => {
        const componentId = this.instantiateManaInBytecode(
          node,
          bytecode,
          {},
          undefined
        )

        Template.visitManaTree(node, (elementName, attributes, children, componentMana) => {
          // Resolve and destroy the special haiku-transclude here. This special property provides an outlet for the
          // original component's children, so that we don't need to recalculate layouts and properties for every
          // subelement.
          if (attributes && attributes['haiku-transclude']) {
            const originalComponent = this.getTemplateNodesByComponentId()[attributes['haiku-transclude']]
            if (originalComponent) {
              children.push(...originalComponent.children)
              // If we are looking at a proper subcomponent, reassign the elementName to its transcluded bytecode.
              if (elementName === '__component__') {
                componentMana.elementName = originalComponent.elementName
                attributes['haiku-var'] = originalComponent.attributes['haiku-var']
              }
            }
            delete attributes['haiku-transclude']
          }
        })

        return componentId
      })

      this.deleteElementImpl(mana, componentId)

      done(null, updatedComponentIds)
    }, cb)
  }

  /**
   * @method upsertStateValue
   */
  upsertStateValue (stateName, stateDescriptorSerial, metadata, cb) {
    const stateDescriptor = Bytecode.unserializeValue(stateDescriptorSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('upsertStateValue', this.getRelpath(), stateName, Bytecode.serializeValue(stateDescriptor), metadata, (fire) => {
      stateDescriptor.edited = true

      return this.upsertStateValueActual(stateName, stateDescriptor, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true,
            clearStates: true
          }
        }, null, () => {
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
    return this.project.updateHook('deleteStateValue', this.getRelpath(), stateName, metadata, (fire) => {
      return this.deleteStateValueActual(stateName, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true,
          clearCacheOptions: {
            doClearEntityCaches: true,
            clearStates: true
          }
        }, null, () => {
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
   * @method zShiftIndices
   */
  zShiftIndices (
    componentId,
    timelineName,
    timelineTime,
    newIndex,
    metadata,
    cb
  ) {
    return this.project.updateHook('zShiftIndices', this.getRelpath(), componentId, timelineName, timelineTime, newIndex, metadata, (fire) => {
      return this.zShiftIndicesActual(componentId, timelineName, timelineTime, newIndex, metadata, (err, stackingInfo) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true, // Since z-changes are fixed to frame 0, we must force flush to reflect the change at all frames
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zShiftIndicesImpl (bytecode, componentId, timelineName, timelineTime, newIndex) {
    const stackingInfo = Template.getStackingInfo(bytecode, bytecode.template, timelineName, timelineTime)

    this.grabStackObjectFromStackingInfo(stackingInfo, componentId)

    stackingInfo.splice(newIndex, 0, {
      haikuId: componentId,
      zIndex: newIndex
    })

    this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)

    return stackingInfo
  }

  zShiftIndicesActual (componentId, timelineName, timelineTime, newIndex, metadata, cb) {
    let stackingInfo
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      stackingInfo = this.zShiftIndicesImpl(bytecode, componentId, timelineName, timelineTime, newIndex)
      done()
    }, (err) => {
      cb(err, stackingInfo)
    })
  }

  /**
   * @method zMoveToFront
   */
  zMoveToFront (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveToFront', this.getRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveToFrontActual(componentId, timelineName, timelineTime, metadata, (err, stackingInfo) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true, // Since z-changes are fixed to frame 0, we must force flush to reflect the change at all frames
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveToFrontImpl (bytecode, componentId, timelineName, timelineTime) {
    const stackingInfo = Template.getStackingInfo(bytecode, bytecode.template, timelineName, timelineTime)
    this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
    stackingInfo.push({
      haikuId: componentId,
      zIndex: (stackingInfo.length > 0) ? stackingInfo[stackingInfo.length - 1].zIndex + 1 : 1
    })
    this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
    return stackingInfo
  }

  zMoveToFrontActual (componentId, timelineName, timelineTime, metadata, cb) {
    let stackingInfo
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      stackingInfo = this.zMoveToFrontImpl(bytecode, componentId, timelineName, timelineTime)
      done()
    }, (err) => {
      cb(err, stackingInfo)
    })
  }

  /**
   * @method zMoveForward
   */
  zMoveForward (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveForward', this.getRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveForwardActual(componentId, timelineName, timelineTime, metadata, (err, stackingInfo) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true, // Since z-changes are fixed to frame 0, we must force flush to reflect the change at all frames
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveForwardActual (componentId, timelineName, timelineTime, metadata, cb) {
    let stackingInfo
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      stackingInfo = Template.getStackingInfo(bytecode, mana, timelineName, timelineTime)
      const stackObject = this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
      const ourStackObject = stackObject && stackObject.ourStackObject
      // Don't know why, but for some reason stackObject can be undefined
      if (ourStackObject) {
        const index = stackObject.index
        stackingInfo.splice(index + 1, 0, ourStackObject)
      } else {
        logger.warn(`[active component] stack object missing at ${timelineName} ${timelineTime}`)
      }
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
      done()
    }, (err) => {
      cb(err, stackingInfo)
    })
  }

  /**
   * @method zMoveBackward
   */
  zMoveBackward (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveBackward', this.getRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveBackwardActual(componentId, timelineName, timelineTime, metadata, (err, stackingInfo) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true, // Since z-changes are fixed to frame 0, we must force flush to reflect the change at all frames
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveBackwardActual (componentId, timelineName, timelineTime, metadata, cb) {
    let stackingInfo
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      stackingInfo = Template.getStackingInfo(bytecode, mana, timelineName, timelineTime)
      const stackObject = this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
      const ourStackObject = stackObject && stackObject.ourStackObject
      // Don't know why, but for some reason stackObject can be undefined
      if (ourStackObject) {
        const index = stackObject.index
        stackingInfo.splice(Math.max(index - 1, 0), 0, ourStackObject)
      } else {
        logger.warn(`[active component] stack object missing at ${timelineName} ${timelineTime}`)
      }
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
      done()
    }, (err) => {
      cb(err, stackingInfo)
    })
  }

  /**
   * @method zMoveToBack
   */
  zMoveToBack (componentId, timelineName, timelineTime, metadata, cb) {
    return this.project.updateHook('zMoveToBack', this.getRelpath(), componentId, timelineName, timelineTime, metadata, (fire) => {
      return this.zMoveToBackActual(componentId, timelineName, timelineTime, metadata, (err, stackingInfo) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          forceFlush: true, // Since z-changes are fixed to frame 0, we must force flush to reflect the change at all frames
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
          fire()
          return cb()
        })
      })
    })
  }

  zMoveToBackActual (componentId, timelineName, timelineTime, metadata, cb) {
    let stackingInfo
    return this.performComponentTimelinesWork((bytecode, mana, timelines, done) => {
      stackingInfo = Template.getStackingInfo(bytecode, mana, timelineName, timelineTime)
      this.grabStackObjectFromStackingInfo(stackingInfo, componentId)
      stackingInfo.unshift({
        haikuId: componentId,
        zIndex: 1
      })
      this.setZIndicesForStackingInfo(bytecode, timelineName, timelineTime, stackingInfo)
      done()
    }, (err) => {
      cb(err, stackingInfo)
    })
  }

  /**
   * @method createTimeline
   */
  createTimeline (timelineName, timelineDescriptorSerial, metadata, cb) {
    const timelineDescriptor = Bytecode.unserializeValue(timelineDescriptorSerial, (ref) => {
      return this.evaluateReference(ref)
    })

    return this.project.updateHook('createTimeline', this.getRelpath(), timelineName, Bytecode.serializeValue(timelineDescriptor), metadata, (fire) => {
      return this.createTimelineActual(timelineName, timelineDescriptor, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
    return this.project.updateHook('renameTimeline', this.getRelpath(), timelineNameOld, timelineNameNew, metadata, (fire) => {
      return this.renameTimelineActual(timelineNameOld, timelineNameNew, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
    return this.project.updateHook('deleteTimeline', this.getRelpath(), timelineName, metadata, (fire) => {
      return this.deleteTimelineActual(timelineName, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
    return this.project.updateHook('duplicateTimeline', this.getRelpath(), timelineName, metadata, (fire) => {
      return this.duplicateTimelineActual(timelineName, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
    return this.project.updateHook('changePlaybackSpeed', this.getRelpath(), framesPerSecond, metadata, (fire) => {
      return this.changePlaybackSpeedActual(framesPerSecond, metadata, (err) => {
        if (err) {
          logger.error(`[active component (${this.project.getAlias()})]`, err)
          return cb(err)
        }

        return this.reload({
          hardReload: this.project.isRemoteRequest(metadata),
          clearCacheOptions: {
            doClearEntityCaches: true
          }
        }, null, () => {
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
   * @method getNormalizedBytecodeSHA
   * @description Return a SHA256 for the current in-mem bytecode.
   */
  getNormalizedBytecodeSHA () {
    return CryptoUtils.sha256(this.getNormalizedBytecodeJSON())
  }

  getNormalizedBytecode () {
    return AST.normalizeBytecode(this.getReifiedBytecode())
  }

  getNormalizedBytecodeJSON () {
    return jss(this.getNormalizedBytecode())
  }

  /**
   * @method dump
   * @description Use this to log a concise shorthand of this entity.
   */
  dump () {
    const relpath = this.getRelpath()
    const aid = this.getArtboard().getElementHaikuId()
    return `${relpath}(${this.getMount().getRenderId()})@${aid}/${this.interactionMode}`
  }

  // Check sustained warnings (eg identifier not found on expression)
  checkSustainedWarnings () {
    this.sustainedWarningsChecker.checkAndGetAllSustainedWarnings()
  }

  replaceBytecode (currentEditorContents, metadata, cb) {
    const absPath = this.fetchActiveBytecodeFile().getAbspath()
    return Lock.request(Lock.LOCKS.FileReadWrite(absPath), false, (release) => {
      return this.project.updateHook('replaceBytecode', this.getRelpath(), currentEditorContents, metadata, (fire) => {
        try {
          this.handleUpdatedBytecode(ModuleWrapper.testLoadBytecode(currentEditorContents, absPath))
        } catch (requireError) {
          release()
          // If we cannot validate it, return an error.
          return cb(requireError)
        }
        release()
        fire()
        return this.moduleSync(cb)
      })
    })
  }
}

ActiveComponent.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    file: true,
    project: true,
    relpath: true,
    scenename: true
  }
}

BaseModel.extend(ActiveComponent)

ActiveComponent.buildPrimaryKey = (folder, scenename) => {
  // This replace is a workaround on Windows port to fix that svg fill='url()' cannot
  // understand an URI with backslashes ( rfc2396.txt also states that
  // shouldn't exist backslash on URI ), which is a given by Windows folder path
  //
  // The ideal solution would be use something else to buildPrimaryKey such as
  // organizationName + projectName + scenename
  return folder.replace(/\\/g, '/') + '::' + scenename
}

module.exports = ActiveComponent

// Down here to avoid Node circular dependency stub objects. #FIXME
const Artboard = require('./Artboard')
const Asset = require('./Asset')
const AST = require('./AST')
const Bytecode = require('./Bytecode')
const DevConsole = require('./DevConsole')
const Element = require('./Element')
const ElementSelectionProxy = require('./ElementSelectionProxy')
const File = require('./File')
const ImageComponent = require('./ImageComponent')
const InstalledComponent = require('./InstalledComponent')
const Keyframe = require('./Keyframe')
const ModuleWrapper = require('./ModuleWrapper')
const MountElement = require('./MountElement')
const PseudoFile = require('./PseudoFile')
const Row = require('./Row')
const SelectionMarquee = require('./SelectionMarquee')
const Template = require('./Template')
const Timeline = require('./Timeline')
const TimelineProperty = require('./TimelineProperty')
