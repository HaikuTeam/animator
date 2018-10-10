const lodash = require('lodash')
const HaikuElement = require('@haiku/core/lib/HaikuElement').default
const Layout3D = require('@haiku/core/lib/Layout3D').default
const {cssQueryTree} = require('@haiku/core/lib/HaikuNode')
const {default: composedTransformsToTimelineProperties} = require('haiku-common/lib/layout/composedTransformsToTimelineProperties')
const functionToRFO = require('@haiku/core/lib/reflection/functionToRFO').default
const {LAYOUT_3D_SCHEMA} = require('@haiku/core/lib/HaikuComponent')
const KnownDOMEvents = require('@haiku/core/lib/renderers/dom/Events').default
const titlecase = require('titlecase')
const decamelize = require('decamelize')
const Matrix = require('gl-matrix')
const polygonOverlap = require('polygon-overlap')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')
const TransformCache = require('./TransformCache')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')

/**
 * Tag names with no presentational context on their own. These are usually found inside <defs>, but technically don't
 * have to be.
 */
const DEFABLE_TAG_NAMES = {
  hatch: true,
  linearGradient: true,
  meshGradient: true,
  pattern: true,
  radialGradient: true,
  solidcolor: true,
  filter: true
}

/**
 * Attributes which only show on SVG and shouldn't be copied during ungrouping.
 */
const SVG_ONLY_ATTRIBUTES = {
  baseProfile: true,
  contentScriptType: true,
  contentStyleType: true,
  height: true,
  preserveAspectRatio: true,
  version: true,
  viewBox: true,
  xmlns: true,
  width: true
}

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'
const HAIKU_LOCKED_ATTRIBUTE = 'haiku-locked'
const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source'
const SYNC_LOCKED_ID_SUFFIX = '#lock'
const TIMELINE_EVENT_PREFIX = 'timeline:'

const EMPTY_ELEMENT = {elementName: 'div', attributes: {}, children: []}

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function getAncestry (ancestors, elementInstance) {
  ancestors.unshift(elementInstance)
  if (elementInstance.parent) {
    getAncestry(ancestors, elementInstance.parent)
  }
  return ancestors
}

function anyEditedKeyframesInKeyframesObject (keyframesObject) {
  if (!keyframesObject) return false
  const values = Object.values(keyframesObject)
  return values.filter((object) => { return object && object.edited }).length > 0
}

/**
 * @class Element
 * @description
 *.  Model to abstract on-stage elements. This model has logic for:
 *.    - Locating elements
 *.    - Getting elements' DOM nodes
 *.    - Getting position, transformation, and bounding box info about the element
 *.    - Changing the element's state, e.g. selected or hovered
 *.    - Managing addressable properties for the element in component's context.
 */
class Element extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._isHovered = false
    this._isSelected = false
    this._clusterAndPropertyRows = []
    this._headingRow = null

    this.transformCache = new TransformCache(this)
  }

  $el () {
    const staticTemplateNode = this.getStaticTemplateNode()
    if (typeof staticTemplateNode === 'string') return null
    const haikuId = staticTemplateNode.attributes && staticTemplateNode.attributes[HAIKU_ID_ATTRIBUTE]
    return Element.findDomNode(haikuId, this.component.getMount().$el())
  }

  afterInitialize () {
    // Make sure we add to the appropriate collections to avoid unexpected state issues
    this.populateVisiblePropertiesFromKeyframes()
  }

  oneListener ($el, uid, type, fn) {
    if (!Element.cache.eventListeners[uid]) Element.cache.eventListeners[uid] = {}
    if (Element.cache.eventListeners[uid][type]) {
      $el.removeEventListener(type, Element.cache.eventListeners[uid][type])
      delete Element.cache.eventListeners[uid][type]
    }
    Element.cache.eventListeners[uid][type] = fn
    $el.addEventListener(type, fn)
    return fn
  }

  hoverOn (metadata, softly = false) {
    if (!this._isHovered) {
      this.cache.clear()
      this._isHovered = true

      if (!softly) {
        this.emit('update', 'element-hovered', metadata)
      }
    }
    return this
  }

  hoverOnSoftly (metadata) {
    return this.hoverOn(metadata, true)
  }

  hoverOff (metadata, softly = false) {
    if (this._isHovered) {
      this.cache.clear()
      this._isHovered = false

      if (!softly) {
        this.emit('update', 'element-unhovered', metadata)
      }
    }
  }

  hoverOffSoftly (metadata) {
    return this.hoverOff(metadata, true)
  }

  isHovered () {
    return this._isHovered
  }

  isShimElement () {
    return this.parent && this.parent.getSource() === '<group>'
  }

  select (metadata, softly = false) {
    if (this.isLocked()) return

    if (!this._isSelected) {
      this._isSelected = true

      if (softly) {
        this.emit('update', 'element-selected-softly', metadata)
      } else {
        // Roundabout! Note that rows, when selected, will select their corresponding element
        const row = this.getHeadingRow()
        if (row) {
          row.expandAndSelect(metadata)
        }

        this.emit('update', 'element-selected', metadata)
      }
    }
  }

  /**
   * @method selectSoftly
   * @description Like select, but emit a different event and don't select the row.
   * Mainly used for multi-selection in glass-only context.
   */
  selectSoftly (metadata) {
    return this.select(metadata, true)
  }

  unselect (metadata, softly = false) {
    if (this._isSelected) {
      this._isSelected = false

      if (softly) {
        this.emit('update', 'element-unselected-softly', metadata)
      } else {
        // Roundabout! Note that rows, when deselected, will deselect their corresponding element
        const row = this.getHeadingRow()
        if (row && row.isSelected()) {
          row.deselect(metadata)
        }

        this.emit('update', 'element-unselected', metadata)
      }

      // #FIXME: this is a bit overzealous.
      ElementSelectionProxy.purge()
    }
  }

  /**
   * @method unselectSoftly
   * @description Like unselect, but emit a different event and don't select the row.
   * Mainly used for multi-selection in glass-only context.
   */
  unselectSoftly (metadata) {
    return this.unselect(metadata, true)
  }

  getHeadingRow () {
    return this._headingRow
  }

  getPropertyRowByPropertyName (propertyName) {
    for (let i = 0; i < this._clusterAndPropertyRows.length; i++) {
      const candidateRow = this._clusterAndPropertyRows[i]
      if (candidateRow.isPropertyOfName(propertyName)) {
        return candidateRow
      }
    }
  }

  isSelected () {
    return this._isSelected
  }

  isLocked () {
    return !!this.getStaticTemplateNode().attributes[HAIKU_LOCKED_ATTRIBUTE]
  }

  isLockedViaParents () {
    let p = this
    while (p) {
      if (p.isLocked()) return true
      p = p.parent
    }
    return false
  }

  toggleLocked (metadata, cb) {
    this.component.setLockedStatusForComponent(this.getComponentId(), !this.getStaticTemplateNode().attributes[HAIKU_LOCKED_ATTRIBUTE], metadata, cb)
    this.emit('update', 'element-locked-toggle')
  }

  getStaticTemplateNode () {
    return this.component.locateTemplateNodeByComponentId(this.componentId)
  }

  getCoreHostComponentInstance () {
    return this.component.$instance
  }

  copy () {
    return this.clip()
  }

  clip () {
    return this.buildClipboardPayload()
  }

  getVisibleEvents () {
    return Object.keys(
      this.getReifiedEventHandlers()
    ).filter(handler => !this.isTimelineEvent(handler))
  }

  getTimelineEvents () {
    return Object.keys(
      this.getReifiedEventHandlers()
    ).filter(handler => this.isTimelineEvent(handler))
  }

  isTimelineEvent (eventName) {
    return eventName.includes(TIMELINE_EVENT_PREFIX)
  }

  hasEventHandlers () {
    return !lodash.isEmpty(this.getReifiedEventHandlers())
  }

  hasVisibleEventHandlers () {
    return !lodash.isEmpty(this.getVisibleEvents())
  }

  getReifiedEventHandlers () {
    const bytecode = this.component.getReifiedBytecode()
    const selector = 'haiku:' + this.getComponentId()
    if (!bytecode.eventHandlers) bytecode.eventHandlers = {}
    if (!bytecode.eventHandlers[selector]) bytecode.eventHandlers[selector] = {}
    return bytecode.eventHandlers[selector]
  }

  getReifiedEventHandler (eventName) {
    return this.getReifiedEventHandlers()[eventName]
  }

  upsertEventHandler (eventName, handlerDescriptor) {
    const eventHandlers = this.getReifiedEventHandlers()
    eventHandlers[eventName] = handlerDescriptor
    this.emit('update', 'element-event-handler-update')
    return this
  }

  batchUpsertEventHandlers (serializedEvents) {
    this.emit('update', 'element-event-handler-update')
    return this
  }

  getEventHandlerSaveStatus (eventName) {
    if (!this._eventHandlerSaves) this._eventHandlerSaves = {}
    return this._eventHandlerSaves[eventName]
  }

  setEventHandlerSaveStatus (eventName, statusValue) {
    if (!this._eventHandlerSaves) this._eventHandlerSaves = {}
    this._eventHandlerSaves[eventName] = statusValue
    this.emit('update', 'element-event-handler-save-status-update')
    return this
  }

  getApplicableEventHandlerOptionsList () {
    const options = []

    // Track which ones we've already accounted for in the 'known events' lists so that
    // we only display those that aren't accounted for under the 'custom events' list
    const predefined = {}

    Element.HIGHER_ORDER_EVENTS.forEach((spec) => {
      predefined[spec.value] = true
    })

    options.push({
      label: 'Favorites',
      options: Element.HIGHER_ORDER_EVENTS
    })

    const handlers = this.getReifiedEventHandlers()

    for (let category in KnownDOMEvents) {
      let suboptions = []

      options.push({
        label: category,
        options: suboptions
      })

      for (let name in KnownDOMEvents[category]) {
        let candidate = KnownDOMEvents[category][name]
        predefined[name] = true

        // If this is whitelisted to appear in the menu, show it.
        // If not, show it only if there is a handler explicitly defined for it.
        if (candidate.menuable || handlers[name]) {
          suboptions.push({
            label: candidate.human,
            value: name
          })
        }
      }
    }

    Element.COMPONENT_EVENTS.forEach((spec) => {
      predefined[spec.value] = true
    })

    options.push({
      label: 'Component/Lifecycle',
      options: Element.COMPONENT_EVENTS
    })

    const customEvents = []
    for (let name in handlers) {
      if (!this.isTimelineEvent(name) && !predefined[name]) {
        customEvents.push({
          label: name,
          value: name
        })
      }
    }

    options.push({
      label: 'Custom Events',
      options: customEvents
    })

    return options
  }

  /**
   * @method buildClipboardPayload
   * @description Return a serializable payload for this object that represents sufficient
   * information to be able to paste (instantiate with overrides) or delete it if received as
   * part of a pasteThing command.
   */
  buildClipboardPayload () {
    const originalNode = this.getStaticTemplateNode()

    // These are cloned because we may mutate their references in place when we paste
    const clonedNode = lodash.cloneDeep(
      Template.manaWithOnlyStandardProps(originalNode, true)
    )

    const clonedBytecode = lodash.cloneDeep(
      this.component.fetchActiveBytecodeFile().getReifiedDecycledBytecode()
    )

    const eventHandlers = Bytecode.getAppliedEventHandlersForNode({}, clonedBytecode, clonedNode)

    Object.keys(eventHandlers).forEach((element) => {
      Object.keys(eventHandlers[element]).forEach((event) => {
        eventHandlers[element][event].handler = functionToRFO(eventHandlers[element][event].handler)
      })
    })

    return {
      kind: 'bytecode',
      data: {
        eventHandlers,
        timelines: Bytecode.getAppliedTimelinesForNode({}, clonedBytecode, clonedNode),
        template: clonedNode
      }
    }
  }

  getQualifiedBytecode () {
    // Grab the 'host' bytecode and pull any control structures applied to us from it
    // These are cloned because we may mutate their references in place if we instantiate it
    const bytecode = Bytecode.clone(this.component.getReifiedBytecode())
    const template = Template.clone(
      {},
      Template.manaWithOnlyStandardProps(this.getStaticTemplateNode(), false)
    )
    const states = Bytecode.getAppliedStatesForNode({}, bytecode, template)
    const helpers = Bytecode.getAppliedHelpersForNode({}, bytecode, template)
    const timelines = Bytecode.getAppliedTimelinesForNode({}, bytecode, template)
    const eventHandlers = Bytecode.getAppliedEventHandlersForNode({}, bytecode, template)
    return {
      helpers,
      states,
      timelines,
      eventHandlers,
      template
    }
  }

  isSyncLocked () {
    const node = this.getStaticTemplateNode()
    if (node && node.attributes && node.attributes[HAIKU_SOURCE_ATTRIBUTE]) {
      return node.attributes[HAIKU_SOURCE_ATTRIBUTE].endsWith(SYNC_LOCKED_ID_SUFFIX)
    }
    return false
  }

  getStackingInfo () {
    if (!this.parent) return
    if (!this.parent.getStaticTemplateNode()) return
    return Template.getStackingInfo(
      this.component.getReifiedBytecode(),
      this.parent.getStaticTemplateNode(),
      // TODO: If we ever support time-bound stacking, change these to their dynamic counterparts
      this.component.getInstantiationTimelineName(),
      this.component.getInstantiationTimelineTime()
    )
  }

  isAtFront () {
    const stackingInfo = this.getStackingInfo()
    if (!stackingInfo) return true // Can happen with artboard
    const myIndex = lodash.findIndex(stackingInfo, {haikuId: this.getComponentId()})
    return myIndex === stackingInfo.length - 1
  }

  isAtBack () {
    const stackingInfo = this.getStackingInfo()
    if (!stackingInfo) return true // Can happen with artboard
    const myIndex = lodash.findIndex(stackingInfo, {haikuId: this.getComponentId()})
    return myIndex === 0
  }

  sendToBack () {
    this.component.zMoveToBack(this.getComponentId(), this.component.getCurrentTimelineName(), 0, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-send-to-back')
  }

  bringToFront () {
    this.component.zMoveToFront(this.getComponentId(), this.component.getCurrentTimelineName(), 0, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-bring-to-front')
  }

  bringForward () {
    this.component.zMoveForward(this.getComponentId(), this.component.getCurrentTimelineName(), 0, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-bring-forward')
  }

  sendBackward () {
    this.component.zMoveBackward(this.getComponentId(), this.component.getCurrentTimelineName(), 0, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-send-backward')
  }

  // marginX and marginY represent the distance from the container
  // boundary to the stage boundary, i.e. the margin that centers the
  // stage.
  // since this is dependent on artboard + window dimensions,
  // this needs to be passed in from the artboard.
  getBoundingClientRect (marginX, marginY) {
    const points = this.getBoxPointsTransformed()

    // account for stage margin to provide a screen-space bbox
    if (marginX !== undefined && marginY !== undefined) {
      let mat = Matrix.mat2d.create()
      let margin = Matrix.vec2.create()

      Matrix.vec2.set(margin, -marginX, -marginY)
      Matrix.mat2d.translate(mat, mat, margin)

      for (let i = 0; i < points.length; i++) {
        let pointInput = Matrix.vec2.create()
        let pointOutput = Matrix.vec2.create()
        Matrix.vec2.set(pointInput, points[i].x, points[i].y)
        Matrix.vec2.transformMat2d(pointOutput, pointInput, mat)
        points[i] = {x: pointOutput[0], y: pointOutput[1]}
      }
    }

    const top = Math.min(points[0].y, points[2].y, points[6].y, points[8].y)
    const bottom = Math.max(points[0].y, points[2].y, points[6].y, points[8].y)
    const left = Math.min(points[0].x, points[2].x, points[6].x, points[8].x)
    const right = Math.max(points[0].x, points[2].x, points[6].x, points[8].x)
    const height = Math.abs(bottom - top)
    const width = Math.abs(right - left)

    return {
      top,
      right,
      bottom,
      left,
      width,
      height
    }
  }

  isAutoSizeX () {
    const layout = this.getLayoutSpec()
    return typeof layout.sizeAbsolute.x !== 'number'
  }

  isAutoSizeY () {
    const layout = this.getLayoutSpec()
    return typeof layout.sizeAbsolute.y !== 'number'
  }

  getComputedSize () {
    if (this.isTextNode()) {
      return this.parent.getComputedSize()
    }
    return this.getHaikuElement().size
  }

  getComputedLayout () {
    const targetNode = this.getLiveRenderedNode() || {} // Fallback in case of render race
    const parentNode = (this.parent && this.parent.getLiveRenderedNode()) || {} // Fallback in case of render race

    return HaikuElement.computeLayout(
      { // targetNode
        // We need the layout spec which is *produced by this module* as opposed to the
        // layout spec mutated on the node during rendering/property application, because
        // this module's layout spec represents a "snapshot in time" that we can safely
        // transform without resulting in exponentially-accumulating value-updates.
        // (If we pass the actual live rendered node, resizing the stage goes crazy.)
        layout: this.getLayoutSpec(),
        // But we still need the live node's actual properties in case we need to compute
        // auto sizing, which will require that we hydrate a HaikuElement and recurse
        // into its children and compute their sizes, and so-on.
        elementName: targetNode.elementName,
        attributes: targetNode.attributes,
        children: targetNode.__memory.children || targetNode.children,
        __memory: targetNode.__memory
      },
      { // parentNode
        layout: {
          computed: {
            matrix: Layout3D.createMatrix(),
            bounds: (this.parent && this.parent.getHaikuElement().computeContentBounds()) || {},
            size: (this.parent && this.parent.getComputedSize()) || this.getComputedSize()
          }
        },
        elementName: parentNode.elementName,
        attributes: parentNode.attributes,
        children: parentNode.children,
        __memory: parentNode.__memory
      }
    )
  }

  getLayoutSpec () {
    const bytecode = this.component.getReifiedBytecode()
    const hostInstance = this.component.$instance

    // Race condition when converting elements on stage to components
    if (!hostInstance) {
      return Layout3D.createLayoutSpec()
    }

    const componentId = this.getComponentId()
    const elementName = Element.safeElementName(this.getStaticTemplateNode())
    const elementNode = hostInstance.findElementsByHaikuId(componentId)[0]
    const timelineName = this.component.getCurrentTimelineName()
    const timelineTime = this.component.getCurrentTimelineTime()

    const propertiesBase = TimelineProperty.getPropertiesBase(
      bytecode.timelines,
      timelineName,
      componentId
    ) || {}

    const grabValue = (outputName) => {
      const {
        computedValue
      } = hostInstance.grabValue(
        timelineName,
        componentId,
        elementNode,
        outputName,
        propertiesBase[outputName],
        timelineTime,
        !hostInstance.shouldPerformFullFlush(), // isPatchOperation
        true // skipCache
      )

      if (computedValue === undefined || computedValue === null) {
        return TimelineProperty.getFallbackValue(
          elementName,
          outputName
        )
      }

      return computedValue
    }

    return {
      shown: grabValue('shown'),
      opacity: grabValue('opacity'),
      offset: {
        x: grabValue('offset.x'),
        y: grabValue('offset.y'),
        z: grabValue('offset.z')
      },
      origin: {
        x: grabValue('origin.x'),
        y: grabValue('origin.y'),
        z: grabValue('origin.z')
      },
      translation: {
        x: grabValue('translation.x'),
        y: grabValue('translation.y'),
        z: grabValue('translation.z')
      },
      rotation: {
        x: grabValue('rotation.x'),
        y: grabValue('rotation.y'),
        z: grabValue('rotation.z')
      },
      scale: {
        x: grabValue('scale.x'),
        y: grabValue('scale.y'),
        z: grabValue('scale.z')
      },
      shear: {
        xy: grabValue('shear.xy'),
        xz: grabValue('shear.xz'),
        yz: grabValue('shear.yz')
      },
      sizeMode: {
        x: grabValue('sizeMode.x'),
        y: grabValue('sizeMode.y'),
        z: grabValue('sizeMode.z')
      },
      sizeProportional: {
        x: grabValue('sizeProportional.x'),
        y: grabValue('sizeProportional.y'),
        z: grabValue('sizeProportional.z')
      },
      sizeDifferential: {
        x: grabValue('sizeDifferential.x'),
        y: grabValue('sizeDifferential.y'),
        z: grabValue('sizeDifferential.z')
      },
      sizeAbsolute: {
        x: grabValue('sizeAbsolute.x'),
        y: grabValue('sizeAbsolute.y'),
        z: grabValue('sizeAbsolute.z')
      }
    }
  }

  getBoundingBoxPoints () {
    const layout = this.getComputedLayout()
    const w = layout.size.x
    const h = layout.size.y
    return [
      {x: 0, y: 0, z: 0}, {x: w / 2, y: 0, z: 0}, {x: w, y: 0, z: 0},
      {x: 0, y: h / 2, z: 0}, {x: w / 2, y: h / 2, z: 0}, {x: w, y: h / 2, z: 0},
      {x: 0, y: h, z: 0}, {x: w / 2, y: h, z: 0}, {x: w, y: h, z: 0}
    ]
  }

  getBoxPointsTransformed () {
    return HaikuElement.transformPointsInPlace(
      this.getBoundingBoxPoints(),
      this.getOriginOffsetComposedMatrix()
    )
  }

  getOriginNotTransformed () {
    return this.cache.fetch('getOriginNotTransformed', () => {
      const layout = this.getComputedLayout()
      return {
        x: layout.size.x * layout.origin.x,
        y: layout.size.y * layout.origin.y,
        z: layout.size.z * layout.origin.z
      }
    })
  }

  getOriginTransformed () {
    return this.cache.fetch('getOriginTransformed', () => {
      return HaikuElement.transformPointInPlace(
        this.getOriginNotTransformed(),
        this.getOriginOffsetComposedMatrix()
      )
    })
  }

  getOriginOffsetComposedMatrix () {
    return this.cache.fetch('getOriginOffsetComposedMatrix', () => {
      return Layout3D.multiplyArrayOfMatrices(this.getComputedLayoutAncestry().reverse().map(
        (layout) => layout.matrix
      ))
    })
  }

  getAncestry () {
    const ancestors = [] // We'll build a list with the original ancestor first and our node last
    getAncestry(ancestors, this)
    return ancestors
  }

  getComputedLayoutAncestry () {
    return this.getAncestry().map((ancestor) => {
      return ancestor.getComputedLayout()
    })
  }

  getPropertyKeyframesObject (propertyName) {
    const bytecode = this.component.getReifiedBytecode()
    return TimelineProperty.getPropertySegmentsBase(
      bytecode.timelines,
      this.component.getCurrentTimelineName(),
      this.getComponentId(),
      propertyName
    )
  }

  computePropertyValue (propertyName, fallbackValue) {
    const bytecode = this.component.getReifiedBytecode()
    const host = this.component.$instance
    const states = (host && host.getStates()) || {}
    const computed = TimelineProperty.getComputedValue(
      this.getComponentId(),
      Element.safeElementName(
        this.getStaticTemplateNode()
      ),
      propertyName,
      this.component.getCurrentTimelineName(),
      this.component.getCurrentTimelineTime(),
      fallbackValue,
      bytecode,
      host,
      states
    )
    // Re: the scale NaN/Infinity issue on a freshly instantiated component module,
    // The problem is probably upstream of here in core or ActiveComponent
    return computed
  }

  computePropertyGroupValueFromGroupDelta (propertyGroupDelta) {
    const propertyGroupValue = {}

    for (const propertyName in propertyGroupDelta) {
      const existingPropertyValue = this.computePropertyValue(propertyName, 0)
      const deltaPropertyValue = propertyGroupDelta[propertyName].value

      if (isNumeric(existingPropertyValue) && isNumeric(deltaPropertyValue)) {
        propertyGroupValue[propertyName] = {
          value: MathUtils.rounded(existingPropertyValue + deltaPropertyValue)
        }
      } else {
        propertyGroupValue[propertyName] = {
          value: existingPropertyValue
        }
      }
    }

    return propertyGroupValue
  }

  remove () {
    this.destroy()

    const row = this.getHeadingRow()
    if (row) {
      row.delete()
    }

    this.emit('update', 'element-removed')
  }

  isRepeater () {
    const rkfs = this.getRepeaterKeyframes()
    return !!(rkfs && Object.keys(rkfs).length > 0)
  }

  getRepeaterKeyframes () {
    return this.getPropertyKeyframesObject('controlFlow.repeat')
  }

  isTextNode () {
    return typeof this.getStaticTemplateNode() === 'string'
  }

  isComponent () {
    return !!this.getHostedComponentBytecode()
  }

  isNonRenderedComponent () {
    const bytecode = this.getHostedComponentBytecode()
    if (!bytecode) { // Not even a component
      return false
    }
    if (!bytecode.metadata) {
      return false
    }
    return !!bytecode.metadata.nonrendered
  }

  isExternalComponent () {
    if (!this.isComponent()) return false
    return !this.isLocalComponent()
  }

  isLocalComponent () {
    if (!this.isComponent()) return false
    const sourceAttr = this.getSource()
    // Like npm, assume dot-paths equate to a local component
    return sourceAttr && sourceAttr[0] === '.'
  }

  getSource () {
    const node = this.getStaticTemplateNode()
    return node && node.attributes && node.attributes[HAIKU_SOURCE_ATTRIBUTE]
  }

  getHostedComponentBytecode () {
    if (this.isTextNode()) return null
    const node = this.getStaticTemplateNode()
    if (!node) return null
    const elementName = node.elementName
    if (!elementName) return null
    if (typeof elementName !== 'object') return null
    return elementName
  }

  getTitle () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    return this.getStaticTemplateNode().attributes[HAIKU_TITLE_ATTRIBUTE] || `<${this.getNameString()}>`
  }

  setTitle (newTitle, metadata, cb) {
    this.component.setTitleForComponent(this.getComponentId(), newTitle, metadata, cb)
  }

  getNameString () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    if (this.isComponent()) return 'div' // this tends to be the default
    const node = this.getStaticTemplateNode()
    if (node) return node.elementName
    return 'div'
  }

  getSafeDomFriendlyName () {
    // If this element is component, then start by populating standard DOM properties
    const elementName = (this.isComponent())
      ? 'div'
      : this.getNameString()

    return elementName
  }

  getComponentId () {
    return this.componentId
  }

  getGraphAddress () {
    return this.address
  }

  updateTargetingRows (updateEventName) {
    this.getAllRows().forEach((row) => {
      row.emit('update', updateEventName)
    })
  }

  getAllRows () {
    return Row.where({component: this.component, element: this})
  }

  shouldBeDisplayed () {
    return (
      !this.isTextNode() &&
      !this.isShimElement() &&
      this._clusterAndPropertyRows.length
    )
  }

  getHostedPropertyRows (doRecurse = false) {
    const rows = []

    const headingRow = this.getHeadingRow()
    if (headingRow) {
      rows.push(headingRow)

      if (headingRow.children) {
        headingRow.children.forEach((childRow) => {
          if (childRow.isCluster() || childRow.isProperty()) {
            rows.push(childRow)

            if (childRow.children) {
              childRow.children.forEach((grandchildRow) => {
                rows.push(grandchildRow)
              })
            }
          }
        })
      }
    }


    const teste = (descendantElement) => {
      if (!descendantElement) {
        return headingRow;
      }

      const descendantHeading = descendantElement.getHeadingRow();

      if (
        (descendantHeading &&
          descendantHeading.children.length &&
          descendantElement.parent &&
          descendantElement.parent.children.length > 1) ||
        descendantHeading.parent.isRootRow()
      ) {
        descendantHeading.parent.silentlyExpandSelfAndParents();
        return descendantHeading;
      } else {
        return teste(descendantElement.parent);
      }
    };

    if (doRecurse && experimentIsEnabled(Experiment.ShowSubElementsInJitMenu)) {
      const deeprows = [];
      this.visitDescendants((descendantElement) => {
        if (!descendantElement.shouldBeDisplayed()) {
          return;
        }

        const currentHeadingRow = teste(descendantElement);
        const subrows = descendantElement
          .getHostedPropertyRows(false)
          .filter((row) => row.shouldBeDisplayed(currentHeadingRow))

        deeprows.push.apply(deeprows, subrows);
      });

      rows.push.apply(rows, deeprows);
    }

    return rows
  }

  clearEntityCaches () {
    if (this.children) {
      this.children.forEach((element) => {
        element.cache.clear()
        element.clearEntityCaches()
      })
    }

    this.getAllRows().forEach((row) => {
      row.cache.clear()
      row.clearEntityCaches()
    })
  }

  getFirstNotShimParent (current = this) {
    if (!current.parent || !current.parent.isShimElement()) {
      return current.parent
    }

    return current.getFirstNotShimParent(current.parent)
  }

  rehydrateRows (options = {}) {
    if (
      options.superficial ||
      process.env.HAIKU_SUBPROCESS !== 'timeline'
    ) {
      return
    }

    const existingRows = this.getAllRows()
    existingRows.forEach((row) => row.mark())

    const element = this
    const component = this.component
    const timeline = this.component.getCurrentTimeline()
    const parent = this.getFirstNotShimParent()

    const parentElementHeadingRow = parent && parent.getHeadingRow()

    const currentElementHeadingRow = Row.upsert({
      uid: Row.buildHeadingUid(component, element),
      parent: parentElementHeadingRow,
      element,
      component,
      timeline,
      children: [],
      property: null,
      cluster: null
    }, {})

    if (parentElementHeadingRow) {
      parentElementHeadingRow.insertChild(currentElementHeadingRow)
    }

    this._headingRow = currentElementHeadingRow
    this._clusterAndPropertyRows = []

    const clusters = {}

    this.eachAddressableProperty((
      propertyGroupDescriptor,
      addressableName
    ) => {
      if (propertyGroupDescriptor.cluster) {
        // Properties that are 'clustered', like rotation.x,y,z
        const clusterId = Row.buildClusterUid(
          this,
          element,
          propertyGroupDescriptor
        )

        let clusterRow

        if (clusters[clusterId]) {
          clusterRow = Row.findById(clusterId)
        } else {
          clusterRow = Row.upsert({
            uid: clusterId,
            element,
            component,
            timeline,
            parent: currentElementHeadingRow,
            children: [],
            property: null, // This null is used to determine isClusterHeading
            cluster: propertyGroupDescriptor.cluster
          }, {})

          this._clusterAndPropertyRows.push(clusterRow)
          currentElementHeadingRow.insertChild(clusterRow)
          clusters[clusterId] = true
        }

        const clusterMember = Row.upsert({
          uid: Row.buildClusterMemberUid(this, element, propertyGroupDescriptor, addressableName),
          element,
          component,
          timeline,
          parent: clusterRow,
          children: [],
          property: propertyGroupDescriptor,
          cluster: propertyGroupDescriptor.cluster
        }, {})

        this._clusterAndPropertyRows.push(clusterMember)
        clusterMember.rehydrate()
        clusterRow.insertChild(clusterMember)
      } else {
        // Properties represented as a single row, like 'opacity'
        const propertyRow = Row.upsert({
          uid: Row.buildPropertyUid(this, element, addressableName),
          element,
          component,
          timeline,
          parent: currentElementHeadingRow,
          children: [],
          property: propertyGroupDescriptor,
          cluster: null
        }, {})

        this._clusterAndPropertyRows.push(propertyRow)
        propertyRow.rehydrate()
        currentElementHeadingRow.insertChild(propertyRow)
      }
    })

    existingRows.forEach((row) => row.sweep())
  }

  visitAll (iteratee) {
    Element.visitAll(this, iteratee)
  }

  visitDescendants (iteratee) {
    Element.visitDescendants(this, iteratee)
  }

  getAllChildren () {
    return this.children || []
  }

  rehydrateChildren ({maxRehydrationDepth}) {
    const node = this.getStaticTemplateNode()

    if (typeof node.elementName === 'object') {
      return
    }

    if (node && node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]

        const element = Element.upsertElementFromVirtualElement(
          this.component, // component
          child, // staticTemplateNode
          this, // parent element
          i, // index in parent
          `${this.getGraphAddress()}.${i}` // graph address
        )

        // If our node is replacing an existing one, we can grab its properties
        if (child.__replacee) {
          const replaceeHaikuId = child.__replacee.attributes && child.__replacee.attributes[HAIKU_ID_ATTRIBUTE]

          if (replaceeHaikuId) {
            const replaceeElement = Element.findByComponentAndHaikuId(this.component, replaceeHaikuId)

            if (replaceeElement) {
              // This ensures that the timeline displays correct JIT sub-element rows even after a design merge
              element._visibleProperties = replaceeElement._visibleProperties
            }
          }

          // Don't forget to clean up to avoid possible weird side effects
          delete child.__replacee
        }

        element.rehydrate({maxRehydrationDepth})
      }
    }
  }

  rehydrate ({maxRehydrationDepth}) {
    if (
      this.getDepthAmongElements() <= maxRehydrationDepth ||
      (
        experimentIsEnabled(Experiment.ShowSubElementsInJitMenu) &&
        this.hasInternalPropertiesDefinedCached()
      )
    ) {
      this.rehydrateChildren({maxRehydrationDepth})
    }
  }

  /**
   * @description Returns true/false whether this element contains any elements
   * that have any keyframes defined, without relying on the presence of hydrated
   * models for any of those elements (it uses the raw template).
   */
  hasInternalPropertiesDefined () {
    const selectors = {}

    const node = this.getStaticTemplateNode()

    Template.visitWithoutDescendingIntoSubcomponents(node, (subnode) => {
      if (node === subnode) {
        return
      }

      const selector = TimelineProperty.getSelectorForComponentId(
        subnode.attributes[HAIKU_ID_ATTRIBUTE]
      )

      selectors[selector] = subnode
    })

    if (Object.keys(selectors).length < 1) {
      return false
    }

    const bytecode = this.component.getReifiedBytecode()

    if (!bytecode || !bytecode.timelines) {
      return false
    }

    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        const subnode = selectors[selector]

        if (!subnode) {
          continue
        }

        for (const propertyName in bytecode.timelines[timelineName][selector]) {
          const keyframesObject = bytecode.timelines[timelineName][selector][propertyName]

          if (Property.areAnyKeyframesDefined(subnode.elementName, propertyName, keyframesObject)) {
            return true
          }
        }
      }
    }

    // If we got this far, we've found no evidence that any internal node has a property
    return false
  }

  hasInternalPropertiesDefinedCached () {
    return this.cache.fetch('hasInternalPropertiesDefinedCached', () => {
      return this.hasInternalPropertiesDefined()
    })
  }

  getDepthAmongElements () {
    let depth = 0
    let parent = this.parent
    while (parent) {
      depth += 1
      parent = parent.parent
    }
    return depth
  }

  getBuiltinAddressables () {
    const builtinAddressables = {}

    // This assigns so-called 'cluster' properties if any are deemed such
    Property.assignDOMSchemaProperties(builtinAddressables, this)

    return builtinAddressables
  }

  getComponentAddressables () {
    const componentAddressables = {}

    // If this is a component, then add any of our componentAddressables states as builtinAddressables
    if (this.isComponent()) {
      const instance = this.getCoreTargetComponentInstance()
      if (instance) {
        // Note that the states also contain .value() for lazy evaluation of current state
        // Also note that states values should have a type='state' property
        instance.getAddressableProperties(componentAddressables)
      }
    }

    return componentAddressables
  }

  getCompleteAddressableProperties () {
    const builtinAddressables = this.getBuiltinAddressables()

    const componentAddressables = this.getComponentAddressables()

    const returnedAddressables = {}

    for (const key1 in builtinAddressables) {
      returnedAddressables[key1] = builtinAddressables[key1]
    }

    for (const key2 in componentAddressables) {
      returnedAddressables[key2] = componentAddressables[key2]
    }

    return returnedAddressables
  }

  // options: [
  //   {
  //     label: 'hi',
  //     options: [
  //       {
  //         value: '123',
  //         label: 'hello'
  //       }
  //     ]
  //   }
  // ]
  getJITPropertyOptions () {
    if (this.isNonRenderedComponent()) {
      return []
    }

    const exclusions = this.getExcludedAddressableProperties()

    // Because of bad code, I have to explicitly collect addressable properties for
    // sub-elements that wouldn't be shown in the JIT menu otherwise
    if (this.getDepthAmongElements() > 1) {
      const complete = this.getCompleteAddressableProperties()

      for (const key in complete) {
        if (!this._visibleProperties[key]) {
          exclusions[key] = complete[key]
        }
      }
    }

    const grouped = {}

    for (const propertyName in exclusions) {
      const propertyObj = exclusions[propertyName]

      if (!Property.includeInJIT(propertyName, this, propertyObj, null)) {
        continue
      }

      let prefix = propertyObj.prefix
      let suffix = propertyObj.suffix

      // Wrap e.g. clipPath into attributes.clipPath so the menu
      // displays the items in a more reasonable way
      if (prefix && !suffix) {
        // Only show attributes if we're showing sub-elements in the JIT
        // menu; without sub-elements, attributes just cause noise
        if (experimentIsEnabled(Experiment.ShowSubElementsInJitMenu)) {
          suffix = prefix
          prefix = 'Attributes'
        }
      }

      if (!grouped[prefix]) {
        grouped[prefix] = {
          element: this,
          prefix,
          suffix,
          label: Property.humanizePropertyNamePart(prefix)
        }
      }

      if (suffix) {
        if (!grouped[prefix].options) {
          grouped[prefix].options = []
        }

        grouped[prefix].options.push({
          element: this,
          prefix,
          suffix,
          label: Property.humanizePropertyNamePart(suffix),
          value: propertyObj.name
        })
      } else {
        grouped[prefix].value = propertyObj.name
      }
    }

    if (experimentIsEnabled(Experiment.ShowSubElementsInJitMenu)) {
      // Expose properties of our sub-element in the timeline
      if (!this.isRootElement() && !this.isComponent()) {
        if (this.children && this.children.length > 0) {
          this.children.forEach((child) => {
            const name = child.getSafeDomFriendlyName()

            // Exclude elements that are either 'useless' or should be
            // represented elsewhere in the displayed element tree,
            // or which don't warrant display at all (text nodes)
            if (
              name === 'defs' ||
              name === 'title' ||
              name === 'desc' ||
              child.isTextNode()
            ) {
              return false
            }

            // Don't include useless children, and collapse sets of useless
            // children into a single node, to keep the menu as simple as we can
            const insert = this.grabNextUsefulMenuInsert(child)

            if (insert) {
              const {
                key,
                label,
                options,
                element
              } = insert

              grouped[key] = {
                type: 'element',
                element,
                // Alpha ordering HACK; see groupedOptionsObjectToList
                prefix: `zzzzz_element_${label}`,
                label: `‹› ${label}`,
                options
              }
            }
          })
        }
      }
    }

    const list = this.groupedOptionsObjectToList(grouped)
    return list
  }

  grabNextUsefulMenuInsert (child) {
    if (child.isTextNode()) {
      return null
    }

    const options = child.getJITPropertyOptions()

    if (options.length === 1 && options[0].type === 'element') {
      return this.grabNextUsefulMenuInsert(options[0].element)
    }

    const key = child.getPrimaryKey()
    const label = child.getFriendlyLabel()

    return {
      key,
      label,
      options,
      element: child
    }
  }

  eachAddressableProperty (iteratee) {
    const addressableProperties = this.getDisplayedAddressableProperties()

    for (const propertyName in addressableProperties) {
      if (addressableProperties[propertyName]) {
        iteratee(
          addressableProperties[propertyName],
          propertyName
        )
      }
    }
  }

  groupedOptionsObjectToList (grouped) {
    const options = Object.values(grouped).sort((a, b) => {
      const ap = a.prefix.toLowerCase()
      const bp = b.prefix.toLowerCase()

      if (ap < bp) {
        return -1
      }

      if (ap > bp) {
        return 1
      }

      return 0
    })

    return options
  }

  getFriendlyLabel () {
    const node = this.getStaticTemplateNode()
    return Element.getFriendlyLabel(node)
  }

  getJITPropertyOptionsAsMenuItems () {
    const options = this.getJITPropertyOptions()
    return this.optionsToItems(options)
  }

  optionsToItems (options) {
    return options.map((option) => {
      const item = {
        label: option.label
      }

      if (option.options) {
        item.submenu = this.optionsToItems(option.options)
      } else {
        item.onClick = () => {
          // "showing" the addressable property means to add it to our whitelist,
          // which results in the Timeline UI displaying it even if not in the
          // hardcoded list of always-public properties
          option.element.showAddressableProperty(option.value)
        }
      }

      return item
    })
  }

  getExcludedAddressableProperties () {
    return this.getCollatedAddressableProperties().excluded
  }

  getDisplayedAddressableProperties () {
    const ours = this.getCollatedAddressableProperties().filtered
    return ours
  }

  populateVisiblePropertiesFromKeyframes () {
    if (!this._visibleProperties) this._visibleProperties = {}
    const completeAddressableProperties = this.getCompleteAddressableProperties()
    for (const propertyName in completeAddressableProperties) {
      const keyframesObject = this.getPropertyKeyframesObject(propertyName)
      if (keyframesObject && anyEditedKeyframesInKeyframesObject(keyframesObject)) {
        this._visibleProperties[propertyName] = completeAddressableProperties[propertyName]
      }
    }
  }

  getExplicitlyVisibleAddressableProperties () {
    const complete = this.getCompleteAddressableProperties()
    const filtered = {}
    for (const propertyName in complete) {
      if (this._visibleProperties[propertyName]) {
        filtered[propertyName] = complete[propertyName]
      }
    }
    return filtered
  }

  getCollatedAddressableProperties () {
    const complete = this.getCompleteAddressableProperties()

    // The ones to display in the timeline
    const filtered = {}

    // The ones to exclude from the timeline, but show in the JIT menu
    const excluded = {}

    for (const propertyName in complete) {
      const propertyObject = complete[propertyName]

      Property.buildFilterObject(
        filtered,
        this, // hostElement
        propertyName,
        propertyObject
      )

      // Make sure to list any exclusions we did
      if (!filtered[propertyName]) {
        excluded[propertyName] = propertyObject
      }
    }

    return {
      filtered,
      excluded
    }
  }

  showAddressableProperty (propertyName) {
    this._visibleProperties[propertyName] = true

    this.rehydrateRows()

    const row = this.getPropertyRowByPropertyName(propertyName)
    if (row) {
      if (row.isWithinCollapsedRow()) {
        row.parent.expand(this.component.project.getMetadata())
      }
      row.select(this.component.project.getMetadata())
    }

    this.emit('update', 'jit-property-added')
  }

  hideAddressableProperty (propertyName) {
    this._visibleProperties[propertyName] = false
    this.emit('update', 'jit-property-removed')
  }

  isRootElement () {
    return !this.parent
  }

  getBoxPolygonPointsTransformed () {
    const points = this.getBoxPointsTransformed()
    return Element.pointsToPolygonPoints(points)
  }

  doesOverlapWithBox (box) {
    const theirPoints = Element.boxToCornersAsPolygonPoints(box)
    const ourPoints = this.getBoxPolygonPointsTransformed()
    return polygonOverlap(theirPoints, ourPoints)
  }

  /**
   * DANGER
   * The methods below rely on the player having rendered the component;
   * race conditions abound
   */

  getLiveRenderedNode () {
    // We query our "host" instance to get our wrapper node that it "hosts"
    // Note the difference from the target instance
    const instance = this.getCoreHostComponentInstance()
    // FIXME: Handle race when component instance isn't present
    return instance ? instance.findElementsByHaikuId(this.getComponentId())[0] : null
  }

  getHaikuElement () {
    return HaikuElement.findOrCreateByNode(this.getLiveRenderedNode())
  }

  getParentSvgElement () {
    let currElem = this
    while (currElem) {
      if (currElem.getNameString() === 'svg') {
        return currElem
      }
      currElem = currElem.parent
    }
    return null
  }

  getUngroupables () {
    const haikuElement = this.getHaikuElement()
    switch (haikuElement.tagName) {
      case 'svg':
      case 'div':
        const ungroupables = []
        this.getHaikuElement().visit((descendantHaikuElement) => {
          const eligibleChildren = descendantHaikuElement.children.filter(
            (element) => element.tagName !== 'defs' && element.target && (haikuElement.tagName === 'div' || typeof element.target.getBBox === 'function')
          )
          if (eligibleChildren.length > 1) {
            ungroupables.push(...eligibleChildren)
            return false
          }
        }, (node) => node.tagName !== 'defs')
        return ungroupables
      default:
        return []
    }
  }

  doesContainUngroupableContent () {
    return this.getUngroupables().length > 1
  }

  ungroup (metadata, cb = () => {}) {
    const nodes = []
    this.ungroupWrapper(nodes)
    switch (this.getStaticTemplateNode().elementName) {
      case 'svg':
        this.ungroupSvg(nodes)
        break
      case 'div':
        this.ungroupDiv(nodes)
        break
      default:
        logger.warn(`[element] ignoring nonsense request to ungroup ${this.getStaticTemplateNode().elementName}`)
    }

    return this.component.ungroupElements(
      this.getComponentId(),
      nodes,
      metadata,
      cb
    )
  }

  ungroupWrapper (nodes) {
    const haikuElement = this.getHaikuElement()
    const baseStyles = haikuElement.attributes.style
    if (!baseStyles) {
      return
    }

    const style = {}
    Object.keys(baseStyles).forEach((styleName) => {
      switch (styleName) {
        case 'background':
        case 'backgroundColor':
          style[styleName] = baseStyles[styleName]
      }
    })

    if (Object.keys(style).length === 0) {
      // We didn't find any styles that would justify ungrouping the wrapper.
      return
    }

    // Upsert the wrapper div the styles on this node "imply".
    const attributes = Object.assign({
      width: haikuElement.layout.size.x,
      height: haikuElement.layout.size.y,
      [HAIKU_SOURCE_ATTRIBUTE]: haikuElement.attributes[HAIKU_SOURCE_ATTRIBUTE]
    }, {style})

    const layoutMatrix = this.getOriginOffsetComposedMatrix()
    const originX = haikuElement.layout.size.x / 2
    const originY = haikuElement.layout.size.y / 2
    layoutMatrix[12] += originX * layoutMatrix[0] + originY * layoutMatrix[4]
    layoutMatrix[13] += originX * layoutMatrix[1] + originY * layoutMatrix[5]
    composedTransformsToTimelineProperties(attributes, [layoutMatrix])
    nodes.push(Template.cleanMana({
      elementName: 'svg',
      attributes,
      children: [{
        elementName: 'rect',
        attributes: {
          width: haikuElement.layout.size.x,
          height: haikuElement.layout.size.y,
          fill: 'none',
          stroke: 'none'
        }
      }]
    }, {resetIds: true}))
  }

  ungroupDiv (nodes) {
    this.getUngroupables().forEach((haikuElement) => {
      const layoutMatrix = Layout3D.multiplyArrayOfMatrices(
        // Under unknown conditions, some elements lack a layout.matrix,
        // which causes a crash during ungroup; hence this filter
        haikuElement.layoutAncestryMatrices.reverse().filter((m) => !!m)
      )
      const layout = haikuElement.layout
      const attributes = {
        width: layout.size.x,
        height: layout.size.y,
        [HAIKU_TITLE_ATTRIBUTE]: haikuElement.attributes[HAIKU_TITLE_ATTRIBUTE],
        [HAIKU_SOURCE_ATTRIBUTE]: haikuElement.attributes[HAIKU_SOURCE_ATTRIBUTE],
        'origin.x': layout.origin.x,
        'origin.y': layout.origin.y,
        'haiku-transclude': haikuElement.getComponentId()
      }
      composedTransformsToTimelineProperties(attributes, [layoutMatrix])
      // Make sure we have something here, so we can add to it.
      if (!attributes['translation.x']) {
        attributes['translation.x'] = 0
      }
      if (!attributes['translation.y']) {
        attributes['translation.y'] = 0
      }
      // Add our origin offset directly to the derived translation.
      const originX = layout.size.x * layout.origin.x
      const originY = layout.size.y * layout.origin.y

      // Ensure SVGs have overflow: visible.
      if (haikuElement.tagName === 'svg') {
        attributes.style = {overflow: 'visible'}
        // (1 of 3) opacity is "special". Make sure it is preserved.
        if (haikuElement.layout.opacity !== 1) {
          attributes.opacity = haikuElement.layout.opacity
        }
      }

      attributes['translation.x'] += originX * layoutMatrix[0] + originY * layoutMatrix[4]
      attributes['translation.y'] += originX * layoutMatrix[1] + originY * layoutMatrix[5]
      nodes.push({
        // Important: ensure we can serialize the node mana if we encounter a component.
        // #FIXME: Why isn't haikuElement.isComponent() correct, and why is the component pseudo tag name 'div'?
        elementName: typeof haikuElement.type !== 'string' ? '__component__' : haikuElement.tagName,
        attributes,
        children: []
      })
    })
  }

  ungroupSvg (nodes) {
    const defs = []
    const extraNodes = []
    const svgElement = this.getHaikuElement()
    const ungroupables = this.getUngroupables()
    const bytecode = this.component.getReifiedBytecode()
    // First isolate defs.
    svgElement.visit((descendantHaikuElement) => {
      if (descendantHaikuElement.tagName === 'defs') {
        defs.push(...descendantHaikuElement.node.children)
        return false
      } else if (descendantHaikuElement.tagName === 'style' && descendantHaikuElement.memory && descendantHaikuElement.memory.children) {
        const styleNode = Template.cleanMana(lodash.cloneDeep(descendantHaikuElement.node), {resetIds: true})
        styleNode.children = [descendantHaikuElement.memory.children[0]]
        extraNodes.push(styleNode)
        return false
      } else if (DEFABLE_TAG_NAMES[descendantHaikuElement.tagName]) {
        defs.push(descendantHaikuElement.node)
      }
    })

    ungroupables.forEach((descendantHaikuElement) => {
      const mergedAttributes = {}
      let parent = descendantHaikuElement.parent
      while (parent && (parent.node.elementName === 'g' || parent.node.elementName === 'svg')) {
        for (const propertyName in bytecode.timelines[this.component.getCurrentTimelineName()][`haiku:${parent.componentId}`]) {
          if (!propertyName.startsWith('style') && !SVG_ONLY_ATTRIBUTES[propertyName] && !mergedAttributes.hasOwnProperty(propertyName)) {
            mergedAttributes[propertyName] = parent.componentId
          }
        }
        parent = parent.parent
      }

      const attributes = Object.keys(mergedAttributes).reduce((accumulator, propertyName) => {
        // (2 of 3) opacity is "special". Make sure it is preserved.
        if (!LAYOUT_3D_SCHEMA.hasOwnProperty(propertyName) || propertyName === 'opacity') {
          accumulator[propertyName] = this.component.getComputedPropertyValue(
            descendantHaikuElement.node,
            mergedAttributes[propertyName],
            this.component.getCurrentTimelineName(),
            this.component.getCurrentTimelineTime(),
            propertyName,
            undefined
          )
        }
        return accumulator
      }, {})

      // (3 of 3) opacity is "special". Make sure it is preserved.
      if (typeof descendantHaikuElement.opacity === 'number' && descendantHaikuElement.opacity !== 1) {
        attributes.opacity = descendantHaikuElement.opacity
      }

      // Note the implementation details of HaikuElement#target, which actually returns
      // the most recently added target - one of a list of possible DOM targets shared by each
      // render node
      const boundingBox = descendantHaikuElement.target.getBBox()

      // The fallbacks here ensure nonzero width/height by any means necessary. SVG getBBox() (and DOM cousins)
      // all fail to account for stroke, clipping masks, etc.
      if (boundingBox.width < 1) {
        boundingBox.width = Math.max(descendantHaikuElement.attributes['stroke-width'] || attributes['stroke-width'] || 1, 1)
      }

      if (boundingBox.height < 1) {
        boundingBox.height = Math.max(descendantHaikuElement.attributes['stroke-width'] || attributes['stroke-width'] || 1, 1)
      }

      const originX = boundingBox.width / 2
      const originY = boundingBox.height / 2
      const layoutMatrix = descendantHaikuElement.layoutMatrix
      layoutMatrix[12] += (boundingBox.x + originX) * layoutMatrix[0] + (boundingBox.y + originY) * layoutMatrix[4]
      layoutMatrix[13] += (boundingBox.x + originX) * layoutMatrix[1] + (boundingBox.y + originY) * layoutMatrix[5]
      const layoutAncestryMatrices = descendantHaikuElement.layoutAncestryMatrices
      if (layoutAncestryMatrices[layoutAncestryMatrices.length - 1] !== layoutMatrix) {
        layoutAncestryMatrices.push(layoutMatrix)
      }
      descendantHaikuElement.visit((subHaikuElement) => {
        // Clean out the computed layout so we can hoist it to the parent SVG element.
        delete subHaikuElement.node.layout
      })

      const parentAttributes = {
        width: boundingBox.width,
        height: boundingBox.height,
        // Important: in case we have borders that spill outside the bounding box, allow SVG overflow so nothing
        // is clipped.
        style: {
          overflow: 'visible'
        },
        [HAIKU_SOURCE_ATTRIBUTE]: `${svgElement.attributes[HAIKU_SOURCE_ATTRIBUTE]}#${descendantHaikuElement.id}`,
        [HAIKU_TITLE_ATTRIBUTE]: descendantHaikuElement[HAIKU_TITLE_ATTRIBUTE] || descendantHaikuElement.title || descendantHaikuElement.id
      }

      composedTransformsToTimelineProperties(parentAttributes, layoutAncestryMatrices)

      // The following ensures that width/height receivers we might encounter inside an SVG (rect, image, use, etc.)
      // won't lose their sizing.
      if (descendantHaikuElement.layout) {
        if (descendantHaikuElement.layout.sizeAbsolute.x > 0) {
          descendantHaikuElement.attributes.width = descendantHaikuElement.layout.sizeAbsolute.x
        }

        if (descendantHaikuElement.layout.sizeAbsolute.y) {
          descendantHaikuElement.attributes.height = descendantHaikuElement.layout.sizeAbsolute.y
        }
      }

      // In this very special mana construct, we:
      //   - Offset the translation of the ungrouped SVG element by the render-time bounding box. This allows us
      //     to bypass otherwise necessary recomputation of things like path vertices in a new coordinate system.
      //   - Transclude the children of our descendant node to ensure any existing timeline properties are
      //     preserved.
      const node = Template.cleanMana({
        elementName: 'svg',
        attributes: parentAttributes,
        children: [{
          elementName: 'g',
          attributes: Object.assign(
            attributes,
            {
              transform: `translate(${-MathUtils.rounded(boundingBox.x)} ${-MathUtils.rounded(boundingBox.y)})`
            }
          ),
          children: [Object.assign(
            {},
            descendantHaikuElement.node,
            {
              attributes: Object.assign(
                {
                  'haiku-transclude': descendantHaikuElement.getComponentId()
                },
                descendantHaikuElement.attributes
              ),
              children: []
            }
          )]
        }]
      }, {resetIds: true})

      if (defs.length > 0) {
        node.children.unshift(
          Template.cleanMana(
            {
              elementName: 'defs',
              attributes: {},
              children: defs.map(Template.reuseHotMana)
            },
            // Note: by resetting IDs here, we willfully destroy any animations that are inside defs. Since this is an atypical
            // construct which can only be achieved by editing bytecode directly today, it's "acceptable".
            {resetIds: true}
          )
        )
      }

      node.children.unshift(...extraNodes.map(Template.reuseHotMana))
      nodes.push(node)
    })
  }

  getCoreTargetComponentInstance () {
    if (!this.isComponent()) return null
    const liveRenderedNode = this.getLiveRenderedNode()
    if (!liveRenderedNode) return null
    if (!liveRenderedNode.__memory) return null
    return liveRenderedNode.__memory.subcomponent
  }

  getAttribute (key) {
    const node = this.getLiveRenderedNode()
    return node && node.attributes && node.attributes[key]
  }

  toXMLString () {
    return Template.manaToHtml('', this.getLiveRenderedNode() || EMPTY_ELEMENT)
  }

  toJSONString () {
    return Template.manaToJson(this.getLiveRenderedNode() || EMPTY_ELEMENT, null, 2)
  }

  /**
   * @method dump
   * @description When debugging, use this to log a concise shorthand of this entity.
   */
  dump () {
    let str = `${this.getNameString()}:${this.getTitle()}:${this.getComponentId()}`
    if (this.isHovered()) str += ' {h}'
    if (this.isSelected()) str += ' {s}'
    return str
  }
}

Element.DEFAULT_OPTIONS = {
  required: {
    component: true,
    uid: true,
    address: true,
    componentId: true
  }
}

BaseModel.extend(Element)

Element.directlySelected = null

Element.cache = {
  domNodes: {},
  eventListeners: {}
}

Element.HIGHER_ORDER_EVENTS = [
  { label: 'Hover', value: 'hover' },
  { label: 'Unhover', value: 'unhover' }
]

Element.COMPONENT_EVENTS = [
  { label: 'Will Mount', value: 'component:will-mount' },
  { label: 'Did Mount', value: 'component:did-mount' },
  { label: 'Will Unmount', value: 'component:will-unmount' },
  { label: 'Did Initialize', value: 'component:did-initialize' },
  { label: 'Frame', value: 'frame' }
]

Element.nodeIsGrouper = (node) => {
  return (
    node.elementName === 'svg' ||
    node.elementName === 'g' ||
    node.elementName === 'div'
  )
}

Element.unselectAllElements = function (criteria, metadata) {
  Element.where(criteria).forEach((element) => element.unselect(metadata))
  Element.directlySelected = null
}

Element.hoverOffAllElements = function (criteria, metadata) {
  Element.where(criteria).forEach((element) => element.hoverOff(metadata))
}

Element.clearCaches = function clearCaches () {
  Element.cache = {
    domNodes: {},
    eventListeners: {}
  }
}

Element.findDomNode = function findDomNode (haikuId, element) {
  // Allow headless, e.g. in tests
  if (!element) {
    return null
  }

  if (Element.cache.domNodes[haikuId]) {
    return Element.cache.domNodes[haikuId]
  }

  const selector = '[' + HAIKU_ID_ATTRIBUTE + '="' + haikuId + '"]'

  const found = element.querySelector(selector)
  Element.cache.domNodes[haikuId] = found
  return found
}

Element.findRoots = (criteria) => {
  return Element.where(criteria).filter((element) => {
    return !element.parent
  })
}

/**
 * Visit all elements in the given element's family, in depth-first order.
 * The element passed is the first visit.
 */
Element.visitAll = (element, visitor) => {
  visitor(element)
  Element.visitDescendants(element, visitor)
}

/**
 * Visit the descendants of the given element in depth-first order.
 */
Element.visitDescendants = (element, visitor) => {
  if (!element.children) return void (0)
  element.children.forEach((child) => {
    visitor(child)
    Element.visitDescendants(child, visitor)
  })
}

Element.getRotationIn360 = (radians) => {
  if (radians < 0) radians += (Math.PI * 2)
  let rotationDegrees = ~~(radians * 180 / Math.PI)
  if (rotationDegrees > 360) rotationDegrees = rotationDegrees % 360
  return rotationDegrees
}

Element.boxToCornersAsPolygonPoints = ({ x, y, width, height }) => {
  return [
    [x, y], [x + width, y],
    [x + width, y + height], [x, y + height]
  ]
}

Element.pointsToPolygonPoints = (points) => {
  return points.map((point) => {
    return [point.x, point.y]
  })
}

Element.distanceBetweenPoints = (p1, p2, zoomFactor) => {
  let distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  if (zoomFactor) {
    distance *= zoomFactor
  }
  return distance
}

Element.buildPrimaryKeyFromComponentParentIdAndStaticTemplateNode = (component, parentId, indexInParent, staticTemplateNode) => {
  let uid
  if (typeof staticTemplateNode === 'string') {
    uid = `${parentId}/text:${indexInParent}`
  } else {
    uid = (staticTemplateNode.attributes && staticTemplateNode.attributes[HAIKU_ID_ATTRIBUTE]) || Math.random()
  }

  // Elements have to be created uniquely in the scope of their host component
  // or else we'll get collision lookups due to the fact that this is all a singleton system
  uid = Element.buildUidFromComponentAndHaikuId(component, uid)

  return uid
}

Element.buildUidFromComponentAndDomElement = (component, $el) => {
  return `${component.getPrimaryKey()}::${$el.getAttribute(HAIKU_ID_ATTRIBUTE)}`
}

Element.buildUidFromComponentAndHaikuId = (component, haikuId) => {
  return `${component.getPrimaryKey()}::${haikuId}`
}

Element.findByComponentAndHaikuId = (component, haikuId) => {
  return Element.findById(Element.buildUidFromComponentAndHaikuId(component, haikuId))
}

Element.findHoveredElement = (component) => {
  return Element.where({ component, _isHovered: true })[0]
}

Element.makeUid = (component, parent, index, staticTemplateNode) => {
  const parentHaikuId = (
    parent &&
    parent.attributes &&
    parent.attributes[HAIKU_ID_ATTRIBUTE]
  )

  if (!parent) {
    parent = (
      parentHaikuId &&
      Element.findById(
        Element.buildUidFromComponentAndHaikuId(component, parentHaikuId)
      )
    )
  }

  const uid = Element.buildPrimaryKeyFromComponentParentIdAndStaticTemplateNode(
    component,
    parentHaikuId,
    index,
    staticTemplateNode
  )

  return uid
}

Element.getFriendlyLabel = (node) => {
  if (!node || typeof node !== 'object') {
    return ''
  }

  const id = node.attributes && node.attributes.id

  const title = node.attributes && node.attributes[HAIKU_TITLE_ATTRIBUTE]

  let name = (typeof node.elementName === 'string' && node.elementName) ? node.elementName : 'div'
  if (Element.FRIENDLY_NAME_SUBSTITUTES[name]) {
    name = Element.FRIENDLY_NAME_SUBSTITUTES[name]
  }

  if (id && !title) {
    return id + '' // The id may be a number (?!) so cast it to a string
  }

  let out = ''
  if (typeof id === 'string') out += `${id} `
  if (typeof title === 'string') out += `${title} `

  if (out.length === 0 && typeof name === 'string') {
    out += `${name}`
  }

  out = out.trim()
  out = titlecase(decamelize(out).replace(/[\W_]/g, ' '))

  return out
}

Element.upsertElementFromVirtualElement = (
  component,
  staticTemplateNode,
  parent,
  index,
  address
) => {
  if (!component.project) {
    throw new Error('component argument must have a `project` defined')
  }

  if (!component.project.getPlatform()) {
    throw new Error('component project must be able to return a platform object')
  }

  if (!component.project.getMetadata()) {
    throw new Error('component proct must be able to return a metadata object')
  }

  const uid = Element.makeUid(component, parent, index, staticTemplateNode)

  const metadata = component.project.getMetadata()

  const componentId = (typeof staticTemplateNode === 'string')
    ? uid
    : staticTemplateNode.attributes[HAIKU_ID_ATTRIBUTE]

  const element = Element.upsert({
    uid,
    componentId,
    index,
    address,
    component,
    parent,
    children: [] // We *must* unset this or else stale elements will be left, messing up rehydration
  }, metadata)

  if (parent) {
    parent.insertChild(element)
  }

  return element
}

Element.querySelectorAll = (selector, mana) => {
  return cssQueryTree(mana, selector, {
    name: 'elementName',
    attributes: 'attributes',
    children: 'children'
  })
}

Element.FRIENDLY_NAME_SUBSTITUTES = {
  g: 'group',
  tspan: 'Text Span'
}

// If elementName is bytecode (i.e. a nested component) return a fallback name
// used for a bunch of lookups, otherwise return the given string element name
Element.safeElementName = (mana) => {
  if (!mana || typeof mana !== 'object') {
    return 'div'
  }
  // If bytecode, the fallback name is div
  if (mana.elementName && typeof mana.elementName === 'object') {
    return 'div' // TODO: How will this bite us?
  }
  return mana.elementName
}

Element.deselectAllOtherElements = (criteria, target, metadata) => {
  Element.where(Object.assign({_isSelected: true}, criteria)).forEach((element) => {
    if (element.getComponentId() !== target.getComponentId()) {
      element.unselect(metadata, true)
    }
  })
}

module.exports = Element

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
const MathUtils = require('./MathUtils')
const Property = require('./Property')
const Row = require('./Row')
const Template = require('./Template')
const TimelineProperty = require('./TimelineProperty')
const ElementSelectionProxy = require('./ElementSelectionProxy')
