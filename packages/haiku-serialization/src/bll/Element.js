const lodash = require('lodash')
const SVGPoints = require('@haiku/player/lib/helpers/SVGPoints').default
const Layout3D = require('@haiku/player/lib/Layout3D').default
const cssQueryTree = require('@haiku/player/lib/helpers/cssQueryTree').default
const KnownDOMEvents = require('@haiku/player/lib/renderers/dom/Events').default
const DOMSchema = require('@haiku/player/lib/properties/dom/schema').default
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const manaToHtml = require('haiku-bytecode/src/manaToHtml')
const manaToJson = require('haiku-bytecode/src/manaToJson')
const getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
const BaseModel = require('./BaseModel')
const RENDERABLE_ELEMENTS = require('./svg/RenderableElements')
const TOP_LEVEL_GROUP_ELEMENTS = require('./svg/TopLevelGroupElements')
const GROUPING_ELEMENTS = require('./svg/GroupingElements')
const serializeElement = require('./../dom/serializeElement')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'

const CUSTOM_EVENT_PREFIX = 'timeline:'

const PI_OVER_12 = Math.PI / 12

const DELTA_ROTATION_OFFSETS = {
  0: 16 * PI_OVER_12,
  1: 12 * PI_OVER_12,
  2: 8 * PI_OVER_12,
  3: 18 * PI_OVER_12,
  5: 6 * PI_OVER_12,
  6: 20 * PI_OVER_12,
  7: 24 * PI_OVER_12,
  8: 4 * PI_OVER_12
}

function getAncestry (ancestors, elementInstance) {
  ancestors.unshift(elementInstance)
  if (elementInstance.parent) {
    getAncestry(ancestors, elementInstance.parent)
  }
  return ancestors
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

    // User-specified list of properties to show for this element, "just-in-time"
    this._visibleProperties = {}
  }

  $el () {
    const staticTemplateNode = this.getStaticTemplateNode()
    if (typeof staticTemplateNode === 'string') return null
    const haikuId = staticTemplateNode.attributes && staticTemplateNode.attributes[HAIKU_ID_ATTRIBUTE]
    return Element.findDomNode(haikuId, this.component.getMount().$el())
  }

  afterInitialize () {
    // Make sure we add to the appropriate collections to avoid unexpected state issues
    if (this.isHovered()) Element.hovered[this.getPrimaryKey()] = this
    if (this.isSelected()) Element.selected[this.getPrimaryKey()] = this
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

  hoverOn (metadata) {
    if (!this._isHovered || !Element.hovered[this.getPrimaryKey()]) {
      this._isHovered = true
      Element.hovered[this.getPrimaryKey()] = this
      this.emit('update', 'element-hovered', metadata)
    }
    return this
  }

  hoverOff (metadata) {
    if (this._isHovered || Element.hovered[this.getPrimaryKey()]) {
      this._isHovered = false
      delete Element.hovered[this.getPrimaryKey()]
      this.emit('update', 'element-unhovered', metadata)
    }
  }

  isHovered () {
    return this._isHovered
  }

  select (metadata) {
    if (!this._isSelected || !Element.selected[this.getPrimaryKey()]) {
      this._isSelected = true
      Element.selected[this.getPrimaryKey()] = this
      this.emit('update', 'element-selected', metadata)

      // Roundabout! Note that rows, when selected, will select their corresponding element
      const row = this.getHeadingRow()
      if (row && !row.isSelected()) {
        row.select(metadata)
      }
    }
  }

  /**
   * @method selectSoftly
   * @description Like select, but emit a different event and don't select the row.
   * Mainly used for multi-selection in glass-only context.
   */
  selectSoftly (metadata) {
    if (!this._isSelected || !Element.selected[this.getPrimaryKey()]) {
      this._isSelected = true
      Element.selected[this.getPrimaryKey()] = this
      this.emit('update', 'element-selected-softly', metadata)
    }
  }

  unselect (metadata) {
    if (this._isSelected || Element.selected[this.getPrimaryKey()]) {
      this._isSelected = false
      delete Element.selected[this.getPrimaryKey()]
      this.emit('update', 'element-unselected', metadata)

      // Roundabout! Note that rows, when deselected, will deselect their corresponding element
      const row = this.getHeadingRow()
      if (row && row.isSelected()) {
        row.deselect(metadata)
      }
    }
  }

  /**
   * @method unselectSoftly
   * @description Like unselect, but emit a different event and don't select the row.
   * Mainly used for multi-selection in glass-only context.
   */
  unselectSoftly (metadata) {
    if (this._isSelected || Element.selected[this.getPrimaryKey()]) {
      this._isSelected = false
      delete Element.selected[this.getPrimaryKey()]
      this.emit('update', 'element-unselected-softly', metadata)
    }
  }

  getAllAssociatedRows () {
    return Row.where({ element: this })
  }

  getHeadingRow () {
    const rows = this.getAllAssociatedRows()
    // Our 'official' row is the row that represents the element heading
    return rows.filter((row) => row.isHeading())[0]
  }

  isSelected () {
    return this._isSelected
  }

  canRotate () {
    return this.isSelectableType() && this.isGroupingType() && !!this.parent
  }

  getStaticTemplateNode () {
    return this.staticTemplateNode
  }

  getPlayerHostComponentInstance () {
    return this.component.getPlayerComponentInstance()
  }

  getPlayerTargetComponentInstance () {
    if (!this.isComponent()) return null
    const liveRenderedNode = this.getLiveRenderedNode()
    if (!liveRenderedNode) return null
    return liveRenderedNode.__instance
  }

  getLiveRenderedNode () {
    // We query our "host" instance to get our wrapper node that it "hosts"
    // Note the difference from the target instance
    const instance = this.getPlayerHostComponentInstance()
    const element = instance.findElementsByHaikuId(this.getComponentId())[0]
    return element
  }

  getOriginOffsetMatrix () {
    const offset = Layout3D.createMatrix()
    if (this.isTextNode()) return offset
    const size = this.getComputedSize()
    offset[12] = -size.x * (0.5 - this.getLiveRenderedNode().layout.origin.x)
    offset[13] = -size.y * (0.5 - this.getLiveRenderedNode().layout.origin.y)
    return offset
  }

  getOriginResetMatrix () {
    const reset = this.getOriginOffsetMatrix()
    reset[12] = -reset[12]
    reset[13] = -reset[13]
    reset[14] = -reset[14]
    return reset
  }

  cut () {
    this.copy()
    this.remove()
  }

  copy () {
    this.emit('element:copy', this.getComponentId())
  }

  querySelectorAll (selector) {
    return Element.querySelectorAll(selector, this.getLiveRenderedNode())
  }

  getDOMEvents () {
    return Object.keys(
      this.getReifiedEventHandlers()
    ).filter(handler => !handler.includes(CUSTOM_EVENT_PREFIX))
  }

  getCustomEvents () {
    return Object.keys(
      this.getReifiedEventHandlers()
    ).filter(handler => handler.includes(CUSTOM_EVENT_PREFIX))
  }

  hasEventHandlers () {
    return !lodash.isEmpty(this.getReifiedEventHandlers())
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
    // TODO: What is this code supposed to do?
    // let eventHandlers = this.getReifiedEventHandlers() // pointer to substructs[0].bytecode
    // eventHandlers = serializedEvents // eslint-disable-line
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
    const handlers = this.getReifiedEventHandlers()

    // Track which ones we've already accounted for in the 'known events' lists so that
    // we only display those that aren't accounted for under the 'custom events' list
    const predefined = {}

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

    return options.filter(category => category.options.length > 0)
  }

  /**
   * @method getClipboardPayload
   * @description Return a serializable payload for this object that represents sufficient
   * information to be able to paste (instantiate with overrides) or delete it if received as
   * part of a pasteThing or deleteThing command.
   */
  getClipboardPayload (_from) {
    // These are cloned because we may mutate their references in place when we paste
    const staticTemplateNode = lodash.cloneDeep(this.getStaticTemplateNode())
    const serializedBytecode = lodash.cloneDeep(this.component.getSerializedBytecode())
    return {
      from: _from, // Used to help determine who should handle a given global clipboard action
      kind: 'bytecode',
      data: {
        timelines: Bytecode.getAppliedTimelinesForNode({}, serializedBytecode, staticTemplateNode),
        eventHandlers: Bytecode.getAppliedEventHandlersForNode({}, serializedBytecode, staticTemplateNode),
        template: staticTemplateNode
      }
    }
  }

  getQualifiedBytecode () {
    // Grab the 'host' bytecode and pull any control structures applied to us from it
    // These are cloned because we may mutate their references in place if we instantiate it
    const bytecode = lodash.cloneDeep(this.component.getReifiedBytecode())
    const template = lodash.cloneDeep(this.getStaticTemplateNode())
    const states = Bytecode.getAppliedStatesForNode({}, bytecode, template)
    const timelines = Bytecode.getAppliedTimelinesForNode({}, bytecode, template)
    const eventHandlers = Bytecode.getAppliedEventHandlersForNode({}, bytecode, template)
    return {
      states,
      timelines,
      eventHandlers,
      template
    }
  }

  getClipboardPayloadWithPaddedIds (_from, padderFunction) {
    const payload = this.getClipboardPayload(_from)
    Bytecode.padIds(payload.data, padderFunction)
    return payload
  }

  getStackingInfo () {
    if (!this.parent) return void (0)
    if (!this.parent.getStaticTemplateNode()) return void (0)
    return getStackingInfo(
      this.component.getReifiedBytecode(),
      this.parent.getStaticTemplateNode(),
      this.component.getCurrentTimelineName(),
      this.component.getCurrentTimelineTime()
    )
  }

  isAtFront () {
    const stackingInfo = this.getStackingInfo()
    if (!stackingInfo) return true // Can happen with artboard
    const myIndex = lodash.findIndex(stackingInfo, { haikuId: this.getComponentId() })
    return myIndex === stackingInfo.length - 1
  }

  isAtBack () {
    const stackingInfo = this.getStackingInfo()
    if (!stackingInfo) return true // Can happen with artboard
    const myIndex = lodash.findIndex(stackingInfo, { haikuId: this.getComponentId() })
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

  getBBox () {
    const domNode = this.getDOMNodeSerialization(false, false)
    return domNode.bbox
  }

  getBoundingClientRect () {
    const domNode = this.getDOMNodeSerialization(false, false)
    return domNode.rect
  }

  getDOMNodeSerialization (doIncludeAncestry, doStripIds) {
    if (!this.$el()) return null
    // serializeElement copies a DOM node to a mana-esque node, with some extra properties if desired
    const serializationOfEl = serializeElement(this.$el(), false, true, false)
    if (doStripIds) {
      delete serializationOfEl.attributes.id
      delete serializationOfEl.attributes[HAIKU_ID_ATTRIBUTE]
    }
    if (doIncludeAncestry) {
      if (this.parent) {
        serializationOfEl.parent = this.parent.getDOMNodeSerialization(doIncludeAncestry, doStripIds)
        serializationOfEl.parent.children = [serializationOfEl]
      }
    }
    return serializationOfEl
  }

  getAncestry () {
    const ancestors = [] // We'll build a list with the original ancestor first and our node last
    getAncestry(ancestors, this)
    return ancestors
  }

  getLayoutAncestry () {
    return this.getAncestry().map((ancestor) => {
      return ancestor.getLiveRenderedNode().layout
    })
  }

  getMatrixAncestry () {
    return this.getLayoutAncestry().map((layout) => {
      return layout.computed.matrix
    })
  }

  getOriginOffsetComposedMatrix () {
    const offset = this.getOriginOffsetMatrix()
    const reset = this.getOriginResetMatrix()
    const composition = this.getComposedMatrix(offset)
    const result = Layout3D.multiplyMatrices(composition, reset)
    return result
  }

  getComposedMatrix (matrix) {
    const layouts = this.getLayoutAncestry()
    let i = layouts.length
    while (i--) {
      matrix = Layout3D.multiplyMatrices(matrix, layouts[i].computed.matrix)
    }
    return matrix
  }

  getComputedMatrix () {
    if (this.isTextNode()) {
      return Layout3D.createMatrix()
    }
    return this.getLiveRenderedNode().layout.computed.matrix
  }

  getComputedSize () {
    if (this.isTextNode()) {
      return this.parent.getComputedSize()
    }
    return {
      x: this.getLiveRenderedNode().layout.computed.size.x,
      y: this.getLiveRenderedNode().layout.computed.size.y,
      z: this.getLiveRenderedNode().layout.computed.size.z
    }
  }

  getPoints () {
    return SVGPoints.manaToPoints(this.getLiveRenderedNode()) // TODO: Use bytecode overrides?
  }

  getBoxPoints () {
    return Element.getBoundingBoxPoints(this.getPoints())
  }

  getBoxPointsTransformed () {
    const points = Element.transformPoints(this.getBoxPoints(), this.getOriginOffsetComposedMatrix())
    return points
  }

  getPointsTransformed () {
    return Element.transformPoints(this.getPoints(), this.getOriginOffsetComposedMatrix())
  }

  getPath () {
    return SVGPoints.pointsToPath(this.getPoints())
  }

  getPathTransformed () {
    return SVGPoints.pointsToPath(this.getPointsTransformed())
  }

  getPropertyKeyframesObject (propertyName) {
    const bytecode = this.component.getReifiedBytecode()
    const keyframes = TimelineProperty.getPropertySegmentsBase(
      bytecode.timelines,
      this.component.getCurrentTimelineName(),
      this.getComponentId(),
      propertyName
    )
    return keyframes
  }

  getPropertyValue (propertyName, fallbackValue) {
    const bytecode = this.component.getReifiedBytecode()
    const computed = TimelineProperty.getComputedValue(
      this.getComponentId(),
      Element.safeElementName(this.getStaticTemplateNode()),
      propertyName,
      this.component.getCurrentTimelineName(),
      this.component.getCurrentTimelineTime(),
      fallbackValue,
      bytecode,
      this.component.fetchActiveBytecodeFile().getHostInstance(),
      this.component.fetchActiveBytecodeFile().getHostStates()
    )
    // Re: the scale NaN/Infinity issue on a freshly instantiated component module,
    // The problem is probably upstream of here in the player or ActiveComponent
    return computed
  }

  // I'm using "drag" as an abstraction over {any movement caused by the mouse dragging} whether that
  // is actually moving it in space, or rotating it, etc. This method makes the decision on what the "outcome"
  // of the drag should actually be.
  drag (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState) {
    const localTransform = {zoom: reactState.zoomXY || 1, pan: {x: reactState.panX, y: reactState.panY}}
    if (reactState.isAnythingScaling) {
      if (!reactState.controlActivation.cmd) {
        return this.scale(dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState.controlActivation, localTransform)
      }
    } else if (reactState.isAnythingRotating) {
      if (reactState.controlActivation.cmd) {
        if (!this.parent) return void (0) // Don't allow artboard to rotate
        return this.rotate(dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState.controlActivation, localTransform)
      }
    } else {
      if (!reactState.controlActivation) {
        if (!this.parent) return void (0) // Don't allow artboard to move
        return this.move(dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord)
      }
    }
  }

  move (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord) {
    if (!this.parent) return void (0) // Don't allow artboard to move
    const propertyGroup = { 'translation.x': dx, 'translation.y': dy }
    this.component.applyPropertyGroupDelta(this.getComponentId(), this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime(), propertyGroup, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-move')
  }

  scale (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, activationPoint, localTransform) {
    if (!coordsPrevious) return void (0)

    // The activation point index corresponds to a box with this coord system:
    // 0, 1, 2
    // 3, 4, 5
    // 6, 7, 8

    // Based on the handle being moved, build input vector (ignore unchanged axis by leaving as 0 when moving edge control points)
    // note that SHIFT effectively turns on both axes as well, even when dragging from an edge control point
    let activeAxes = [0, 0]
    if (activationPoint.shift || activationPoint.index === 6 || activationPoint.index === 3 || activationPoint.index === 0 || activationPoint.index === 2 || activationPoint.index === 5 || activationPoint.index === 8) {
      activeAxes[0] = 1
    }
    if (activationPoint.shift || activationPoint.index === 0 || activationPoint.index === 1 || activationPoint.index === 2 || activationPoint.index === 6 || activationPoint.index === 7 || activationPoint.index === 8) {
      activeAxes[1] = 1
    }

    let isLeft = activationPoint.index === 6 || activationPoint.index === 3 || activationPoint.index === 0
    let isTop = activationPoint.index === 0 || activationPoint.index === 1 || activationPoint.index === 2

    let x0 = coordsPrevious.clientX
    let y0 = coordsPrevious.clientY
    let x1 = coordsCurrent.clientX
    let y1 = coordsCurrent.clientY

    let worldDeltaX = (x1 - x0) / localTransform.zoom
    let worldDeltaY = (y1 - y0) / localTransform.zoom

    // assigned below
    let proportionX
    let proportionY

    // If no parent, we are the artboard element and must via a different method
    if (!this.parent) {
      let currentSize = {
        x: this.getPropertyValue('sizeAbsolute.x'),
        y: this.getPropertyValue('sizeAbsolute.y'),
        z: this.getPropertyValue('sizeAbsolute.z') || 0
      }

      let finalSize = {
        width: currentSize.x + worldDeltaX * (isLeft ? -2 : 2) * activeAxes[0],
        height: currentSize.y + worldDeltaY * (isTop ? -2 : 2) * activeAxes[1]
      }

      // note this logic is essentially duplicated below, for elements
      if (activationPoint.shift) {
        // constrain proportion
        proportionX = finalSize.width / currentSize.x
        proportionY = finalSize.height / currentSize.y

        // this gnarly logic is just mixing EDGE constraining logic (index checks) with CORNER constraining logic (proportion comparison)
        if (activationPoint.index !== 1 && activationPoint.index !== 7 && (Math.abs(1 - proportionX) < Math.abs(1 - proportionY) || activationPoint.index === 3 || activationPoint.index === 5)) {
          finalSize.height = proportionX * currentSize.y
        } else {
          finalSize.width = proportionY * currentSize.x
        }
      }

      if (finalSize.width <= 1 || finalSize.height <= 1) return void (0)

      // Frame zero is hardcoded since artboard resizes at different times is confusing
      return this.component.resizeContext(this.getComponentId(), this.component.getCurrentTimelineName(), 0, finalSize, this.component.project.getMetadata(), (err) => {
        if (err) return void (0)
      })
    }

    let baseWidth = this.getPropertyValue('sizeAbsolute.x')
    let baseHeight = this.getPropertyValue('sizeAbsolute.y')
    let oldScaleX = this.getPropertyValue('scale.x')
    let oldScaleY = this.getPropertyValue('scale.y')
    let oldWidth = oldScaleX * baseWidth
    let oldHeight = oldScaleY * baseHeight

    let thetaRadians = this.getPropertyValue('rotation.z') || 0
    let sizeDeltaCoefficient = (activationPoint.alt ? 2 : 1)
    let deltaX = worldDeltaX * Math.cos(thetaRadians) + worldDeltaY * Math.sin(thetaRadians)
    let deltaY = -worldDeltaX * Math.sin(thetaRadians) + worldDeltaY * Math.cos(thetaRadians)
    deltaX *= (isLeft ? -sizeDeltaCoefficient : sizeDeltaCoefficient)
    deltaY *= (isTop ? -sizeDeltaCoefficient : sizeDeltaCoefficient)
    // newWidth = oldWidth + deltaX
    // newHeight = oldHeight + deltaY

    // note this logic is essentially duplicated above, for artboards
    if (activationPoint.shift) {
        // constrain proportion
      proportionX = deltaX / oldWidth
      proportionY = deltaY / oldHeight
        // this gnarly logic is just mixing EDGE constraining logic (index checks) with CORNER constraining logic (proportion comparison)
      if (activationPoint.index !== 1 && activationPoint.index !== 7 && (Math.abs(proportionX) < Math.abs(proportionY) || activationPoint.index === 3 || activationPoint.index === 5)) {
        deltaY = proportionX * oldHeight
      } else {
        deltaX = proportionY * oldWidth
      }
    }

    let deltaScaleVector = [(deltaX / (oldWidth / oldScaleX)) * activeAxes[0], (deltaY / (oldHeight / oldScaleY)) * activeAxes[1]]

    let newScaleX = oldScaleX + deltaScaleVector[0]
    let newScaleY = oldScaleY + deltaScaleVector[1]

    let baseTranslationOffset = activationPoint.alt ? [0, 0] : [(isLeft ? -1 : 1) * (newScaleX - oldScaleX) * baseWidth / 2, (isTop ? -1 : 1) * (newScaleY - oldScaleY) * baseHeight / 2]
    let translationOffset = [
      baseTranslationOffset[0] * Math.cos(thetaRadians) - baseTranslationOffset[1] * Math.sin(thetaRadians),
      baseTranslationOffset[0] * Math.sin(thetaRadians) + baseTranslationOffset[1] * Math.cos(thetaRadians)
    ]

    let scaleGroup = { 'scale.x': deltaScaleVector[0], 'scale.y': deltaScaleVector[1] }
    let translationGroup = {'translation.x': translationOffset[0], 'translation.y': translationOffset[1]}
    let transformGroup = Object.assign(Object.assign({}, scaleGroup), translationGroup)

    this.component.applyPropertyGroupDelta(this.getComponentId(), this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime(), transformGroup, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })

    this.emit('update', 'element-scale')
  }

  rotate (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, activationPoint, localTransform) {
    // If no parent, we are the artboard, and cannot be rotated
    if (!this.parent) {
      return void (0)
    }

    //  Calculate rotation delta based on old mouse position and new
    //   *(x0, y0)
    //   |          Ex.
    //   |        \ click+drag starts at x0,y0, ends at x1,y1
    //  h|         v
    //   |(cx,cy)
    //   *-------------*(x1,y1)
    //   ^      w
    //   center of rotation

    let x0 = coordsPrevious.clientX
    let y0 = coordsPrevious.clientY
    let x1 = coordsCurrent.clientX
    let y1 = coordsCurrent.clientY

    // TODO: get center of rotation from matrix transform?
    //      bbox may approximate well enough for now, but will
    //      at least need to account for adjustments in origin etc.
    //      Currently assuming center of rotation is center of object's bbox.
    let rect = this.getBoundingClientRect()
    let cx = rect.left + ((rect.right - rect.left) / 2)
    let cy = rect.top + ((rect.bottom - rect.top) / 2)

    //       *mouse(x,y)
    //      /|
    //     / |
    //    /  |
    //   /   |h
    //  /    |
    // /θ ___|
    // ^   w
    // (cx,cy)
    // tan(θ) = h / w

    // last angle
    let w0 = x0 - cx
    let h0 = y0 - cy
    let theta0 = Math.atan2(w0, h0)

    // new angle
    let w1 = x1 - cx
    let h1 = y1 - cy
    let theta1 = Math.atan2(w1, h1)

    let deltaRotationZ = theta0 - theta1

    // if shift is held, snap to absolute increments of pi/12
    if (activationPoint.shift) {
      // pretty hacky math/logic, won't allow for rotating past 2*Math.PI (unlike free rotation, which will rotate to any limit)
      theta0 = this.getPropertyValue('rotation.z') || 0
      theta1 = -PI_OVER_12 * Math.round(theta1 / PI_OVER_12)
      deltaRotationZ = DELTA_ROTATION_OFFSETS[activationPoint.index] + theta1 - theta0
    }

    const propertyGroup = { 'rotation.z': deltaRotationZ }

    this.component.applyPropertyGroupDelta(this.getComponentId(), this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime(), propertyGroup, this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })

    this.emit('update', 'element-rotate')
  }

  remove () {
    this.unselect(this.component.project.getMetadata())
    this.hoverOff(this.component.project.getMetadata())

    this.component.deleteComponent(this.getComponentId(), this.component.project.getMetadata(), (err) => {
      if (err) return void (0)
    })

    // Destroy after the above so we retain our UID for the necessary actions
    this.destroy()

    const row = this.getHeadingRow()
    if (row) {
      row.delete()
    }

    this.emit('update', 'element-remove')
  }

  isRenderableType () {
    return !!RENDERABLE_ELEMENTS[Element.safeElementName(this.getStaticTemplateNode())]
  }

  isSelectableType () {
    return !!TOP_LEVEL_GROUP_ELEMENTS[Element.safeElementName(this.getStaticTemplateNode())]
  }

  isGroupingType () {
    return !!GROUPING_ELEMENTS[Element.safeElementName(this.getStaticTemplateNode())]
  }

  isTextNode () {
    return typeof this.getStaticTemplateNode() === 'string'
  }

  isComponent () {
    return !!this.getHostedComponentBytecode()
  }

  getHostedComponentBytecode () {
    if (this.isTextNode()) return null
    const elementName = this.getStaticTemplateNode().elementName
    if (!elementName) return null
    if (typeof elementName !== 'object') return null
    return elementName
  }

  getHostedComponent () {
    if (!this.isComponent()) return null
    const staticTemplateNode = this.getStaticTemplateNode()
    const playerComponentInstance = staticTemplateNode && staticTemplateNode.__instance
    const activeComponent = playerComponentInstance && playerComponentInstance.__activeComponent
    return activeComponent
  }

  getTitle () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    return this.getStaticTemplateNode().attributes[HAIKU_TITLE_ATTRIBUTE] || 'unknown'
  }

  getNameString () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    if (this.isComponent()) return 'div' // this tends to be the default
    return this.getStaticTemplateNode().elementName
  }

  getSafeDomFriendlyName () {
    // If this element is component, then start by populating standard DOM properties
    const elementName = (this.isComponent())
      ? 'div'
      : this.getNameString()

    return elementName
  }

  getComponentId () {
    if (this.isTextNode()) return this.uid // HACK, but not sure what else to do
    return this.getStaticTemplateNode().attributes[HAIKU_ID_ATTRIBUTE]
  }

  getAddress () {
    return this.address
  }

  getAddressableProperties () {
    const addressables = {}

    // Start with the basic hardcoded DOM schema; we'll add component-specifics if necessary
    if (DOMSchema[this.getSafeDomFriendlyName()]) {
      // This assigns so-called 'cluster' properties if any are deemed such
      Property.assignDOMSchemaProperties(addressables, this)
    }

    // If this is a component, then add any of our exposed states as addressables
    if (this.isComponent()) {
      const component = this.getPlayerTargetComponentInstance()
      if (component) {
        // The addressables are mutated in place
        // Note that the states also contain .value() for lazy evaluation of current state
        component.getAddressableProperties(addressables)
      }
    }

    const filtered = {}

    for (const key in addressables) {
      if (!Element.FORBIDDEN_PROPS[key]) {
        filtered[key] = addressables[key]
      }
    }

    return filtered
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
    const exclusions = this.getExcludedAddressableProperties()

    const grouped = {}

    for (const propertyName in exclusions) {
      const propertyObj = exclusions[propertyName]

      if (Property.EXCLUDE_FROM_JIT[propertyName]) {
        continue
      }

      if (!grouped[propertyObj.prefix]) {
        grouped[propertyObj.prefix] = {
          label: Property.humanizePropertyNamePart(propertyObj.prefix)
        }
      }

      if (propertyObj.suffix) {
        if (!grouped[propertyObj.prefix].options) {
          grouped[propertyObj.prefix].options = []
        }

        grouped[propertyObj.prefix].options.push({
          label: Property.humanizePropertyNamePart(propertyObj.suffix),
          value: propertyObj.name
        })
      } else {
        grouped[propertyObj.prefix].value = propertyObj.name
      }
    }

    const options = Object.values(grouped).sort((a, b) => {
      if (a.prefix === 'style') {
        return -1
      }

      return a.prefix - b.prefix
    })

    return options
  }

  getExcludedAddressableProperties () {
    return this.getCollatedAddressableProperties().excluded
  }

  getDisplayedAddressableProperties () {
    return this.getCollatedAddressableProperties().filtered
  }

  getCollatedAddressableProperties () {
    return this.cacheFetch('getCollatedAddressableProperties', () => {
      const unfilteredProperties = this.getAddressableProperties()

      const filtered = {}
      const excluded = {}

      for (const propertyName in unfilteredProperties) {
        const propertyObject = unfilteredProperties[propertyName]

        if (this._visibleProperties[propertyName]) {
          // Highest precedence is if the property is deemed explicitly visible
          filtered[propertyName] = propertyObject
        } else {
          if (propertyObject.type === 'state') {
            // If the property is a component state, we definitely want it
            filtered[propertyName] = propertyObject
          } else {
            const keyframesObject = this.getPropertyKeyframesObject(propertyName)

            if (keyframesObject) {
              if (Object.keys(keyframesObject).length > 1) {
                // If many keyframes are defined, include the property
                filtered[propertyName] = propertyObject
              } else {
                // Or if only one keyframe and that keyframe is not the 0th
                if (!keyframesObject[0]) {
                  filtered[propertyName] = propertyObject
                } else {
                  // If the keyframe is an internally managed prop that has been changed from its default value
                  const fallbackValue = Element.INTERNALLY_MANAGED_PROPS_WITH_DEFAULT_VALUES[propertyName]
                  if (fallbackValue !== undefined && keyframesObject[0].value !== fallbackValue) {
                    filtered[propertyName] = propertyObject
                  }
                }
              }
            }

            // Finally, there are som properties that we always want to show
            if (Element.ALWAYS_ALLOWED_PROPS[propertyName]) {
              filtered[propertyName] = propertyObject
            }
          }
        }

        if (!filtered[propertyName]) {
          excluded[propertyName] = propertyObject
        }
      }

      return {
        filtered,
        excluded
      }
    })
  }

  showAddressableProperty (propertyName) {
    this._visibleProperties[propertyName] = true
    this.cacheUnset('getCollatedAddressableProperties')
    this.emit('update', 'jit-property-added')
  }

  hideAddressableProperty (propertyName) {
    this._visibleProperties[propertyName] = false
    this.cacheUnset('getCollatedAddressableProperties')
    this.emit('update', 'jit-property-removed')
  }

  isAtCoords (coords) {
    if (!this.$el()) return false
    return Math.isCoordInsideRect(coords.clientX, coords.clientY, this.$el().getBoundingClientRect())
  }

  toXMLString () {
    return manaToHtml('', this.getLiveRenderedNode())
  }

  toJSONString () {
    return manaToJson(this.getLiveRenderedNode(), null, 2)
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
    staticTemplateNode: true,
    address: true
  }
}

BaseModel.extend(Element)

Element.selected = {}
Element.hovered = {}

Element.cache = {
  domNodes: {},
  eventListeners: {}
}

Element.COMPONENT_EVENTS = [
  { label: 'Will Mount', value: 'component:will-mount' },
  { label: 'Did Mount', value: 'component:did-mount' },
  { label: 'Will Unmount', value: 'component:will-unmount' }
]

Element.unselectAllElements = function (criteria, metadata) {
  Element.where(criteria).forEach((element) => element.unselect(metadata))
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

Element.visitAll = (element, visitor) => {
  visitor(element)
  Element.visitChildren(element, visitor)
}

Element.visitChildren = (element, visitor) => {
  if (!element.children) return void (0)
  element.children.forEach((child) => {
    visitor(child)
    Element.visitChildren(child, visitor)
  })
}

Element.transformPoints = (points, matrix) => {
  for (let i = 0; i < points.length; i++) {
    let point = points[i]
    let vector = [point.x, point.y]
    let offset = MathUtils.transformVectorByMatrix([], vector, matrix)
    point.x = offset[0]
    point.y = offset[1]
  }
  return points
}

Element.getRotationIn360 = (radians) => {
  if (radians < 0) radians += (Math.PI * 2)
  let rotationDegrees = ~~(radians * 180 / Math.PI)
  if (rotationDegrees > 360) rotationDegrees = rotationDegrees % 360
  return rotationDegrees
}

Element.getBoundingBoxPoints = (points) => {
  let x1 = points[0].x
  let y1 = points[0].y
  let x2 = points[0].x
  let y2 = points[0].y
  points.forEach((point) => {
    if (point.x < x1) x1 = point.x
    if (point.y < y1) y1 = point.y
    if (point.x > x2) x2 = point.x
    if (point.y > y2) y2 = point.y
  })
  const w = x2 - x1
  const h = y2 - y1
  return [
    {x: x1, y: y1}, {x: x1 + w / 2, y: y1}, {x: x2, y: y1},
    {x: x1, y: y1 + h / 2}, {x: x1 + w / 2, y: y1 + h / 2}, {x: x2, y: y1 + h / 2},
    {x: x1, y: y2}, {x: x1 + w / 2, y: y2}, {x: x2, y: y2}
  ]
}

Element.getBoundingBoxPointsForElements = (elements) => {
  const points = []
  elements.forEach((element) => {
    element.getBoxPointsTransformed().forEach((point) => points.push(point))
  })
  return Element.getBoundingBoxPoints(points)
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
  return `${component.getPrimaryKey()}::${$el.getAttribute('haiku-id')}`
}

Element.buildUidFromComponentAndHaikuId = (component, haikuId) => {
  return `${component.getPrimaryKey()}::${haikuId}`
}

Element.findByComponentAndHaikuId = (component, haikuId) => {
  return Element.findById(Element.buildUidFromComponentAndHaikuId(component, haikuId))
}

Element.upsertElementFromVirtualElement = (criteria, component, staticTemplateNode, parent, indexInParent, graphAddress, doGoDeep) => {
  if (!component.project) throw new Error('component argument must have a `project` defined')
  if (!component.project.getPlatform()) throw new Error('component project must be able to return a platform object')
  if (!component.project.getMetadata()) throw new Error('component proejct must be able to return a metadata object')
  if (!component._timestamp) throw new Error('component  argumentmust have a `_timestamp` defined')

  const parentId = parent && parent.attributes && parent.attributes[HAIKU_ID_ATTRIBUTE]

  if (!parent) {
    parent = parentId && Element.findById(Element.buildUidFromComponentAndHaikuId(component, parentId))
  }

  const uid = Element.buildPrimaryKeyFromComponentParentIdAndStaticTemplateNode(component, parentId, indexInParent, staticTemplateNode)

  const element = Element.upsert({
    timestamp: component._timestamp,
    uid: uid,
    staticTemplateNode: staticTemplateNode,
    index: indexInParent,
    address: graphAddress,
    component: component,
    _isSelected: false,
    _isHovered: false,
    isTargetedForRotate: false,
    isTargetedForScale: false,
    parent: parent
  }, component.project.getMetadata())

  if (parent) {
    if (!parent.children) {
      parent.children = []
    }

    let found = false
    parent.children.forEach((child) => {
      if (child === element) found = true
    })

    if (!found) {
      parent.children.push(element)
    }
  }

  if (doGoDeep) {
    if (staticTemplateNode.children) {
      for (let i = 0; i < staticTemplateNode.children.length; i++) {
        let child = staticTemplateNode.children[i]
        Element.upsertElementFromVirtualElement(criteria, component, child, element, i, `${graphAddress}.${i}`, doGoDeep)
      }
    }
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

/**
 * Hey! If you want to add any properties here, you might also need to update
 * - haiku-bytecode/src/properties/dom/schema,
 * - haiku-bytecode/src/properties/dom/fallbacks
 */

Element.ALWAYS_ALLOWED_PROPS = {
  'sizeAbsolute.x': true,
  'sizeAbsolute.y': true,
  'translation.x': true,
  'translation.y': true,
  // 'translation.z': true, // This doesn't work for some reason, so leaving it out
  'rotation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'scale.x': true,
  'scale.y': true,
  'opacity': true
  // 'backgroundColor': true,
  // 'shown': true // Mainly so instantiation at non-0 times results in invisibility
}

// Properties that the plumbing creates automatically; this is used to avoid
// displaying properties that have a value assigned that aren't actually assigned
// by the user
Element.INTERNALLY_MANAGED_PROPS_WITH_DEFAULT_VALUES = {
  'sizeMode.x': 1,
  'sizeMode.y': 1,
  'sizeMode.z': 1,
  'style.border': '0',
  'style.margin': '0',
  'style.padding': '0',
  'style.overflowX': 'hidden',
  'style.overflowY': 'hidden',
  'style.WebkitTapHighlightColor': 'rgba(0,0,0,0)',
  'style.zIndex': 0 // Managed via stacking UI
}

Element.FORBIDDEN_PROPS = {
  // Internal metadata should not be edited
  'haiku-id': true,
  'haiku-title': true,
  'source': true,
  // All of the below mess with the layout system
  'width': true,
  'height': true,
  'transform': true,
  'transformOrigin': true,
  'style.position': true,
  'style.display': true,
  'style.width': true,
  'style.height': true,
  'style.transform': true,
  'style.transformOrigin': true
}

Element.ALLOWED_TAGNAMES = {
  div: true,
  svg: true,
  g: true,
  rect: true,
  circle: true,
  ellipse: true,
  line: true,
  polyline: true,
  polygon: true
}

// If elementName is bytecode (i.e. a nested component) return a fallback name
// used for a bunch of lookups, otherwise return the given string element name
Element.safeElementName = (mana) => {
  // If bytecode, the fallback name is div
  if (mana.elementName && typeof mana.elementName === 'object') {
    return 'div' // TODO: How will this byte us?
  }
  return mana.elementName
}

module.exports = Element

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
const MathUtils = require('./MathUtils')
const Property = require('./Property')
const Row = require('./Row')
