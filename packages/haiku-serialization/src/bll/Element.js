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
const Row = require('./Row')
const serializeElement = require('./../dom/serializeElement')
const _assignDOMSchemaProperties = require('./helpers/assignDOMSchemaProperties')
const _isCoordInsideRect = require('./helpers/isCoordInsideRect')
const _transformVectorByMatrix = require('./helpers/transformVectorByMatrix')

const RENDERABLE_ELEMENTS = require('./svg/RenderableElements')
const TOP_LEVEL_GROUP_ELEMENTS = require('./svg/TopLevelGroupElements')
const GROUPING_ELEMENTS = require('./svg/GroupingElements')
const ALLOWED_TAGNAMES = require('./element/AllowedTagNames')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'

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

function _manaQuerySelectorAll (selector, mana) {
  return cssQueryTree(mana, selector, {
    name: 'elementName',
    attributes: 'attributes',
    children: 'children'
  })
}

function _getAncestry (ancestors, node) {
  ancestors.unshift(node)
  if (node.parent) _getAncestry(ancestors, node.parent)
  return ancestors
}

class Element extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._isHovered = false
    this._isSelected = false
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

  getOriginOffsetMatrix () {
    const offset = Layout3D.createMatrix()
    if (this.isTextNode()) return offset
    const size = this.getComputedSize()
    offset[12] = -size.x * (0.5 - this.node.layout.origin.x)
    offset[13] = -size.y * (0.5 - this.node.layout.origin.y)
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
    return _manaQuerySelectorAll(selector, this.node)
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
    const eventHandlers = this.getReifiedEventHandlers() // pointer to substructs[0].bytecode
    eventHandlers[eventName] = handlerDescriptor
    this.emit('update', 'element-event-handler-update')
    return this
  }

  batchUpsertEventHandlers (serializedEvents) {
    const eventHandlers = this.getReifiedEventHandlers() // pointer to substructs[0].bytecode
    eventHandlers = serializedEvents
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

    const customs = []
    options.push({
      label: 'Custom',
      options: customs
    })

    for (let key in handlers) {
      // Only add to the custom events list if we didn't already define it above
      if (!predefined[key]) {
        customs.push({
          label: key,
          value: key
        })
      }
    }

    return options.filter(category => category.options.length > 0)
  }

  /**
   * @method getClipboardPayload
   * @description Return a serializable payload for this object that represents sufficient
   * information to be able to paste (instantiate with overrides) or delete it if received as
   * part of a pasteThing or deleteThing command.
   */
  getClipboardPayload (_from) {
    return {
      from: _from, // Used to help determine who should handle a given global clipboard action
      kind: 'element',
      componentId: this.getComponentId(),
      serializedBytecode: this.component.getSerializedBytecode()
    }
  }

  getStackingInfo () {
    if (!this.parent) return void (0)
    if (!this.parent.node) return void (0)
    return getStackingInfo(this.component.getReifiedBytecode(), this.parent.node, this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime())
  }

  isAtFront () {
    const stackingInfo = this.getStackingInfo()
    const myIndex = lodash.findIndex(stackingInfo, { haikuId: this.getComponentId() })
    return myIndex === stackingInfo.length - 1
  }

  isAtBack () {
    const stackingInfo = this.getStackingInfo()
    const myIndex = lodash.findIndex(stackingInfo, { haikuId: this.getComponentId() })
    return myIndex === 0
  }

  sendToBack () {
    this.component.zMoveToBack([this.getComponentId()], this.component.getCurrentTimelineName(), 0, this.component.metadata, (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-send-to-back')
  }

  bringToFront () {
    this.component.zMoveToFront([this.getComponentId()], this.component.getCurrentTimelineName(), 0, this.component.metadata, (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-bring-to-front')
  }

  bringForward () {
    this.component.zMoveForward([this.getComponentId()], this.component.getCurrentTimelineName(), 0, this.component.metadata, (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-bring-forward')
  }

  sendBackward () {
    this.component.zMoveBackward([this.getComponentId()], this.component.getCurrentTimelineName(), 0, this.component.metadata, (err) => {
      if (err) return void (0)
    })
    this.emit('update', 'element-send-backward')
  }

  getBBox () {
    const domnode = this.getDOMNodeSerialization(false, false)
    return domnode.bbox
  }

  getBoundingClientRect () {
    const domnode = this.getDOMNodeSerialization(false, false)
    return domnode.rect
  }

  getDOMNodeSerialization (doIncludeAncestry, doStripIds) {
    if (!this.$el) return null
    // serializeElement copies a DOM node to a mana-esque node, with some extra properties if desired
    const node = serializeElement(this.$el, false, true, false)
    if (doStripIds) {
      delete node.attributes.id
      delete node.attributes[HAIKU_ID_ATTRIBUTE]
    }
    if (doIncludeAncestry) {
      if (this.parent) {
        node.parent = this.parent.getDOMNodeSerialization(doIncludeAncestry, doStripIds)
        node.parent.children = [node]
      }
    }
    return node
  }

  getAncestry () {
    const ancestors = [] // We'll build a list with the original ancestor first and our node last
    _getAncestry(ancestors, this)
    return ancestors
  }

  getLayoutAncestry () {
    return this.getAncestry().map((ancestor) => {
      return ancestor.node.layout
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
    return this.node.layout.computed.matrix
  }

  getComputedSize () {
    if (this.isTextNode()) {
      return this.parent.getComputedSize()
    }
    return {
      x: this.node.layout.computed.size.x,
      y: this.node.layout.computed.size.y,
      z: this.node.layout.computed.size.z
    }
  }

  getPoints () {
    return SVGPoints.manaToPoints(this.node) // TODO: Use bytecode overrides?
  }

  getBoxPoints () {
    return Element.getBoundingBoxPoints(this.getPoints())
  }

  getBoxPointsTransformed () {
    return Element.transformPoints(this.getBoxPoints(), this.getOriginOffsetComposedMatrix())
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

  getPropertyValue (propertyName, fallbackValue) {
    const bytecode = this.component.getReifiedBytecode()
    const computed = TimelineProperty.getComputedValue(
      this.getComponentId(),
      _safeElementName(this.node),
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
      if (Object.keys(Element.selected).length <= 1) { // Until we fix transform logic/grouping, don't allow multi-rotate/-scale
        if (!reactState.controlActivation.cmd) {
          return this.scale(dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState.controlActivation, localTransform)
        }
      }
    } else if (reactState.isAnythingRotating) {
      if (Object.keys(Element.selected).length <= 1) { // Until we fix transform logic/grouping, don't allow multi-rotate/-scale
        if (reactState.controlActivation.cmd) {
          if (!this.parent) return void (0) // Don't allow artboard to rotate
          return this.rotate(dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState.controlActivation, localTransform)
        }
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
    this.component.applyPropertyGroupDelta([this.getComponentId()], this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime(), propertyGroup, this.component.metadata, (err) => {
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
      return this.component.resizeContext([this.getComponentId()], this.component.getCurrentTimelineName(), 0, finalSize, this.component.metadata, (err) => {
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

    this.component.applyPropertyGroupDelta([this.getComponentId()], this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime(), transformGroup, this.component.metadata, (err) => {
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

    this.component.applyPropertyGroupDelta([this.getComponentId()], this.component.getCurrentTimelineName(), this.component.getCurrentTimelineTime(), propertyGroup, this.component.metadata, (err) => {
      if (err) return void (0)
    })

    this.emit('update', 'element-rotate')
  }

  remove () {
    this.unselect(this.component.metadata)
    this.hoverOff(this.component.metadata)

    this.component.deleteComponent([this.getComponentId()], this.component.metadata, (err) => {
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
    return !!RENDERABLE_ELEMENTS[_safeElementName(this.node)]
  }

  isSelectableType () {
    return !!TOP_LEVEL_GROUP_ELEMENTS[_safeElementName(this.node)]
  }

  isGroupingType () {
    return !!GROUPING_ELEMENTS[_safeElementName(this.node)]
  }

  isTextNode () {
    return typeof this.node === 'string'
  }

  isComponent () {
    if (!this.isTextNode()) return false
    return typeof this.node.elementName === 'object'
  }

  getTitle () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    return this.node.attributes[HAIKU_TITLE_ATTRIBUTE]
  }

  getNameString () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    if (this.isComponent()) return this.node.attributes.source
    return this.node.elementName
  }

  getComponentId () {
    if (this.isTextNode()) return this.uid // HACK, but not sure what else to do
    return this.node.attributes[HAIKU_ID_ATTRIBUTE]
  }

  getAddress () {
    return this.address
  }

  getAddressableProperties () {
    const addressables = {}

    // If this element is component, then start by populating standard DOM properties
    const elementName = (this.isComponent()) ? 'div' : this.getNameString()

    // Start with the basic hardcoded DOM schema; we'll add component-specifics if necessary
    if (DOMSchema[elementName]) {
      // This assigns so-called 'cluster' properties if any are deemed such
      _assignDOMSchemaProperties(addressables, elementName)
    }

    // If this is a component, then add any of our exposed states as addressables
    if (this.isComponent()) {
      for (let name in this.node.elementName.states) {
        let state = this.node.elementName.states[name]
        addressables[name] = {
          name: name,
          prefix: name,
          suffix: undefined,
          fallback: state.value,
          typedef: state.type
        }
      }
    }

    return addressables
  }

  isAtCoords (coords) {
    if (!this.$el) return false
    return _isCoordInsideRect(coords.clientX, coords.clientY, this.$el.getBoundingClientRect())
  }

  toXMLString () {
    return manaToHtml('', this.node)
  }

  toJSONString () {
    return manaToJson(this.node, null, 2)
  }

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
    node: true,
    address: true
    // $el: true // Cannot require this is in headless testing mode
  }
}

BaseModel.extend(Element)

// Used by Timeline
Element.ALLOWED_TAGNAMES = ALLOWED_TAGNAMES

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

Element.visitTemplate = require('./helpers/visitTemplate')

Element.unselectAllElements = function (metadata) {
  Element.all().forEach((element) => element.unselect(metadata))
}

Element.clearCaches = function clearCaches () {
  Element.cache = {
    domNodes: {},
    eventListeners: {}
  }
}

Element.getAncestryTop = function getAncestryTop (node) {
  if (!node.parent) return node
  return Element.getAncestryTop(node.parent)
}

Element.findDomNode = function findDomNode (haikuId, platform) {
  // Allow headless, e.g. in tests
  if (typeof platform === 'undefined') {
    return null
  }

  if (!platform.document) {
    return null
  }

  if (Element.cache.domNodes[haikuId]) {
    return Element.cache.domNodes[haikuId]
  }

  const selector = '[' + HAIKU_ID_ATTRIBUTE + '="' + haikuId + '"]'
  const element = platform.document.querySelector(selector)
  Element.cache.domNodes[haikuId] = element
  return element
}

Element.findByComponentId = function findByComponentId (componentId) {
  return Element.findById(componentId)
}

Element.findRoots = function () {
  return Element.filter((element) => {
    return !element.parent
  })
}

Element.visitAll = function visitAll (element, visitor) {
  visitor(element)
  Element.visitChildren(element, visitor)
}

Element.visitChildren = function visitChildren (element, visitor) {
  if (!element.children) return void (0)
  element.children.forEach((child) => {
    visitor(child)
    Element.visitChildren(child, visitor)
  })
}

Element.transformPoints = function transformPoints (points, matrix) {
  for (let i = 0; i < points.length; i++) {
    let point = points[i]
    let vector = [point.x, point.y]
    let offset = _transformVectorByMatrix([], vector, matrix)
    point.x = offset[0]
    point.y = offset[1]
  }
  return points
}

Element.getRotationIn360 = function getRotationIn360 (radians) {
  if (radians < 0) radians += (Math.PI * 2)
  let rotationDegrees = ~~(radians * 180 / Math.PI)
  if (rotationDegrees > 360) rotationDegrees = rotationDegrees % 360
  return rotationDegrees
}

Element.getBoundingBoxPoints = function getBoundingBoxPoints (points) {
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

Element.distanceBetweenPoints = function distanceBetweenPoints (p1, p2, zoomFactor) {
  let distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  if (zoomFactor) {
    distance *= zoomFactor
  }
  return distance
}

// If elementName is bytecode (i.e. a nested component) return a fallback name
// used for a bunch of lookups, otherwise return the given string element name
function _safeElementName (mana) {
  // If bytecode, the fallback name is div
  if (mana.elementName && typeof mana.elementName === 'object') {
    return 'div' // TODO: How will this byte us?
  }
  return mana.elementName
}

module.exports = Element
