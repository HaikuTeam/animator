var EventEmitter = require('events').EventEmitter
var util = require('util')
var lodash = require('lodash')
var pretty = require('pretty')
var SVGPoints = require('@haiku/player/lib/helpers/SVGPoints').default
var Layout3D = require('@haiku/player/lib/Layout3D').default
var cssQueryTree = require('@haiku/player/lib/helpers/cssQueryTree').default
var KnownDOMEvents = require('@haiku/player/lib/renderers/dom/Events').default
var DOMSchema = require('@haiku/player/lib/properties/dom/schema')
var DOMFallbacks = require('@haiku/player/lib/properties/dom/fallbacks')
var TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
var manaToHtml = require('haiku-bytecode/src/manaToHtml')
var manaToJson = require('haiku-bytecode/src/manaToJson')
var getStackingInfo = require('haiku-bytecode/src/getStackingInfo')
var Collection = require('./Collection')
var serializeElement = require('./../dom/serializeElement')

var HAIKU_ID_ATTRIBUTE = 'haiku-id'

const RENDERABLE_ELEMENTS = {
  rect: true,
  circle: true,
  ellipse: true,
  line: true,
  polyline: true,
  polygon: true
}
const TOP_LEVEL_GROUP_ELEMENTS = {
  svg: true
}
const GROUPING_ELEMENTS = {
  svg: true,
  g: true
}

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

/**
 * Hey! If you want to ADD any properties here, you might also need to update the dictionary in
 * haiku-bytecode/src/properties/dom/schema,
 * haiku-bytecode/src/properties/dom/fallbacks,
 * or they might not show up in the view.
 */

const ALLOWED_PROPS = {
  'translation.x': true,
  'translation.y': true,
  // 'translation.z': true, // This doesn't work for some reason, so leaving it out
  'rotation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'scale.x': true,
  'scale.y': true,
  'opacity': true,
  // 'shown': true,
  'backgroundColor': true
  // 'color': true,
  // 'fill': true,
  // 'stroke': true
}

const ALLOWED_PROPS_TOP_LEVEL = {
  'sizeAbsolute.x': true,
  'sizeAbsolute.y': true,
  // Enable these as such a time as we can represent them visually in the glass
  // 'style.overflowX': true,
  // 'style.overflowY': true,
  'backgroundColor': true,
  'opacity': true
}

const CLUSTERED_PROPS = {
  'mount.x': 'mount',
  'mount.y': 'mount',
  'mount.z': 'mount',
  'align.x': 'align',
  'align.y': 'align',
  'align.z': 'align',
  'origin.x': 'origin',
  'origin.y': 'origin',
  'origin.z': 'origin',
  'translation.x': 'translation',
  'translation.y': 'translation',
  'translation.z': 'translation', // This doesn't work for some reason, so leaving it out
  'rotation.x': 'rotation',
  'rotation.y': 'rotation',
  'rotation.z': 'rotation',
  // 'rotation.w': 'rotation', // Probably easiest not to let the user have control over quaternion math
  'scale.x': 'scale',
  'scale.y': 'scale',
  'scale.z': 'scale',
  'sizeMode.x': 'sizeMode',
  'sizeMode.y': 'sizeMode',
  'sizeMode.z': 'sizeMode',
  'sizeProportional.x': 'sizeProportional',
  'sizeProportional.y': 'sizeProportional',
  'sizeProportional.z': 'sizeProportional',
  'sizeDifferential.x': 'sizeDifferential',
  'sizeDifferential.y': 'sizeDifferential',
  'sizeDifferential.z': 'sizeDifferential',
  'sizeAbsolute.x': 'sizeAbsolute',
  'sizeAbsolute.y': 'sizeAbsolute',
  'sizeAbsolute.z': 'sizeAbsolute',
  'style.overflowX': 'overflow',
  'style.overflowY': 'overflow'
}

const CLUSTER_NAMES = {
  'mount': 'Mount',
  'align': 'Align',
  'origin': 'Origin',
  'translation': 'Position',
  'rotation': 'Rotation',
  'scale': 'Scale',
  'sizeMode': 'Sizing Mode',
  'sizeProportional': 'Size %',
  'sizeDifferential': 'Size +/-',
  'sizeAbsolute': 'Size',
  'overflow': 'Overflow'
}

const ALLOWED_TAGNAMES = {
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

function _manaQuerySelectorAll (selector, mana) {
  return cssQueryTree([], mana, selector, {
    name: 'elementName',
    attributes: 'attributes',
    children: 'children'
  })
}

function _isCoordInsideRect (x, y, rect) {
  return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom
}

function _getAncestry (ancestors, node) {
  ancestors.unshift(node)
  if (node.parent) _getAncestry(ancestors, node.parent)
  return ancestors
}

function _transformVectorByMatrix (out, v, m) {
  out[0] = m[0] * v[0] + m[4] * v[1] + m[12]
  out[1] = m[1] * v[0] + m[5] * v[1] + m[13]
  return out
}

function ElementModel (platform, component, metadata) {
  function Element (attrs) {
    EventEmitter.call(this)
    this.update(attrs)
    this.initialize(metadata)
  }

  util.inherits(Element, EventEmitter)

  // An event emitter on behalf of the class, so folks can subscribe to events from 'any' element.
  // Useful if you want to get notified of a change or action on any element within this collection.
  var emitter = new EventEmitter()
  Element.on = emitter.on.bind(emitter)
  Element.emit = emitter.emit.bind(emitter)

  Element.dict = {}
  Element.clicked = Collection()
  Element.dblclicked = Collection()
  Element.selected = Collection()
  Element.hovered = Collection()

  Element.cache = {
    domNodes: {},
    eventListeners: {}
  }

  Element.visitTemplate = require('./helpers/visitTemplate')

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

  Element.findDomNode = function findDomNode (haikuId) {
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

    var selector = '[' + HAIKU_ID_ATTRIBUTE + '="' + haikuId + '"]'
    var element = platform.document.querySelector(selector)
    Element.cache.domNodes[haikuId] = element
    return element
  }

  Element.upsert = function upsert (attrs, metadata) {
    var instance
    if (Element.dict[attrs.uid]) {
      instance = Element.dict[attrs.uid]
      instance.update(attrs)
      instance.initialize(metadata)
    } else {
      instance = new Element(attrs)

      instance.on('element:copy', (componentId) => {
        Element.emit('element:copy', componentId)
      })

      Element.dict[attrs.uid] = instance
    }
    // Make sure we add to the appropriate collections to avoid unexpected state issues
    if (instance.isHovered) Element.hovered.add(instance)
    if (instance.isSelected) Element.selected.add(instance)
    return instance
  }

  Element.find = function find (uid) {
    return Element.dict[uid]
  }

  Element.selectElementByComponentId = function (componentId, metadata) {
    var element = Element.find(componentId)
    if (element) {
      element.select(metadata)
    }
    return element
  }

  Element.unselectElementByComponentId = function (componentId, metadata) {
    var element = Element.find(componentId)
    if (element) {
      element.unselect(metadata)
    }
    return element
  }

  Element.where = function where (query) {
    var collection = []
    for (var uid in Element.dict) {
      var instance = Element.dict[uid]
      var matches = true
      for (var key in query) {
        if (query[key] !== instance[key]) {
          matches = false
        }
      }
      if (matches) {
        collection.push(instance)
      }
    }
    return collection
  }

  Element.findRoots = function () {
    return Element.all().filter((element) => {
      return !element.parent
    })
  }

  Element.all = function all () {
    var collection = []
    for (var uid in Element.dict) {
      var instance = Element.dict[uid]
      collection.push(instance)
    }
    return collection
  }

  Element.visitAll = function (element, visitor) {
    visitor(element)
    Element.visitChildren(element, visitor)
  }

  Element.visitChildren = function (element, visitor) {
    if (!element.children) return void (0)
    element.children.each((child) => {
      visitor(child)
      Element.visitChildren(child, visitor)
    })
  }

  Element.transformPoints = function (points, matrix) {
    for (var i = 0; i < points.length; i++) {
      var point = points[i]
      var vector = [point.x, point.y]
      var offset = _transformVectorByMatrix([], vector, matrix)
      point.x = offset[0]
      point.y = offset[1]
    }
    return points
  }

  Element.upsertFromNodeWithComponentCached = function upsertFromNodeWithComponentCached (node, parent, component, metadata) {
    var found = Element.find(node.attributes[HAIKU_ID_ATTRIBUTE])
    if (found) return found
    return Element.upsertFromNodeWithComponent(node, parent, component, metadata)
  }

  Element.upsertFromNodeWithComponent = function upsertFromNodeWithComponent (node, parent, component, metadata) {
    var uid = node.attributes[HAIKU_ID_ATTRIBUTE] || Math.random()
    var $el = Element.findDomNode(uid)
    parent = parent && Element.find(parent.attributes[HAIKU_ID_ATTRIBUTE])

    var instance = Element.upsert({
      uid: uid,
      node: node,
      component: component,
      $el: $el,
      isSelected: false,
      isHovered: false,
      isTargetedForRotate: false,
      isTargetedForScale: false,
      parent: parent
    }, metadata)

    if (parent) {
      if (!parent.children) parent.children = Collection()
      parent.children.add(instance)
    }
    return instance
  }

  Element.prototype.update = function update (attrs) {
    for (var key in attrs) this[key] = attrs[key]
    return this
  }

  Element.prototype.destroy = function destroy () {
    delete Element.dict[this.uid]
    Element.selected.dequeue()
    Element.hovered.dequeue()
    Element.clicked.dequeue()
    Element.dblclicked.dequeue()
    Element.clearCaches()
  }

  Element.getRotationIn360 = function (radians) {
    if (radians < 0) radians += (Math.PI * 2)
    var rotationDegrees = ~~(radians * 180 / Math.PI)
    if (rotationDegrees > 360) rotationDegrees = rotationDegrees % 360
    return rotationDegrees
  }

  Element.prototype.oneListener = function oneListener ($el, uid, type, fn) {
    if (!Element.cache.eventListeners[uid]) Element.cache.eventListeners[uid] = {}
    if (Element.cache.eventListeners[uid][type]) {
      $el.removeEventListener(type, Element.cache.eventListeners[uid][type])
      delete Element.cache.eventListeners[uid][type]
    }
    Element.cache.eventListeners[uid][type] = fn
    $el.addEventListener(type, fn)
    return fn
  }

  Element.prototype.hoverOn = function (metadata) {
    this.isHovered = true
    Element.hovered.add(this)
  }

  Element.prototype.hoverOff = function (metadata) {
    this.isHovered = false
    Element.hovered.remove(this)
  }

  Element.prototype.select = function (metadata) {
    this.isSelected = true
    Element.selected.add(this)
    this.component._elementWasSelected(this.uid, metadata, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.unselect = function (metadata) {
    this.isSelected = false
    Element.selected.remove(this)
    this.component._elementWasUnselected(this.uid, metadata, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.canRotate = function () {
    return this.isSelectableType() && this.isGroupingType() && !!this.parent
  }

  Element.prototype.getOriginOffsetMatrix = function () {
    var offset = Layout3D.createMatrix()
    var size = this.getComputedSize()
    offset[12] = -size.x * (0.5 - this.node.layout.origin.x)
    offset[13] = -size.y * (0.5 - this.node.layout.origin.y)
    return offset
  }

  Element.prototype.getOriginResetMatrix = function () {
    var reset = this.getOriginOffsetMatrix()
    reset[12] = -reset[12]
    reset[13] = -reset[13]
    reset[14] = -reset[14]
    return reset
  }

  Element.prototype.cut = function () {
    this.copy()
    this.remove()
  }

  Element.prototype.copy = function () {
    this.emit('element:copy', this.uid)
  }

  Element.prototype.querySelectorAll = function (selector) {
    return _manaQuerySelectorAll(selector, this.node)
  }

  Element.prototype.getReifiedEventHandlers = function () {
    var bytecode = component.getReifiedBytecode()
    var selector = 'haiku:' + this.uid
    if (!bytecode.eventHandlers) bytecode.eventHandlers = {}
    if (!bytecode.eventHandlers[selector]) bytecode.eventHandlers[selector] = {}
    return bytecode.eventHandlers[selector]
  }

  Element.prototype.getReifiedEventHandler = function getReifiedEventHandler (eventName) {
    return this.getReifiedEventHandlers()[eventName]
  }

  Element.prototype.upsertEventHandler = function upsertEventHandler (eventName, handlerDescriptor) {
    var eventHandlers = this.getReifiedEventHandlers() // pointer to substructs[0].bytecode
    eventHandlers[eventName] = handlerDescriptor
    return this
  }

  Element.prototype.getEventHandlerSaveStatus = function (eventName) {
    if (!this._eventHandlerSaves) this._eventHandlerSaves = {}
    return this._eventHandlerSaves[eventName]
  }

  Element.prototype.setEventHandlerSaveStatus = function (eventName, statusValue) {
    if (!this._eventHandlerSaves) this._eventHandlerSaves = {}
    this._eventHandlerSaves[eventName] = statusValue
    return this
  }

  Element.COMPONENT_EVENTS = [
    { label: 'Will Mount', value: 'component:will-mount' },
    { label: 'Did Mount', value: 'component:did-mount' },
    { label: 'Will Unmount', value: 'component:will-unmount' }
  ]

  Element.prototype.getApplicableEventHandlerOptionsList = function getApplicableEventHandlerOptionsList () {
    var options = []

    var handlers = this.getReifiedEventHandlers()

    // Track which ones we've already accounted for in the 'known events' lists so that
    // we only display those that aren't accounted for under the 'custom events' list
    var predefined = {}

    for (var category in KnownDOMEvents) {
      var suboptions = []

      options.push({
        label: category,
        options: suboptions
      })

      for (var name in KnownDOMEvents[category]) {
        var candidate = KnownDOMEvents[category][name]
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

    var customs = []
    options.push({
      label: 'Custom',
      options: customs
    })

    for (var key in handlers) {
      // Only add to the custom events list if we didn't already define it above
      if (!predefined[key]) {
        customs.push({
          label: key,
          value: key
        })
      }
    }

    return options
  }

  /**
   * @method getClipboardPayload
   * @description Return a serializable payload for this object that represents sufficient
   * information to be able to paste (instantiate with overrides) or delete it if received as
   * part of a pasteThing or deleteThing command.
   */
  Element.prototype.getClipboardPayload = function (_from) {
    return {
      from: _from, // Used to help determine who should handle a given global clipboard action
      kind: 'element',
      componentId: this.uid,
      serializedBytecode: this.component.getSerializedBytecode()
    }
  }

  Element.prototype.getStackingInfo = function () {
    if (!this.parent) return void (0)
    if (!this.parent.node) return void (0)
    return getStackingInfo(this.component.getReifiedBytecode(), this.parent.node, this.component._currentTimelineName, this.component._currentTimelineTime)
  }

  Element.prototype.isAtFront = function () {
    var stackingInfo = this.getStackingInfo()
    var myIndex = lodash.findIndex(stackingInfo, { haikuId: this.uid })
    return myIndex === stackingInfo.length - 1
  }

  Element.prototype.isAtBack = function () {
    var stackingInfo = this.getStackingInfo()
    var myIndex = lodash.findIndex(stackingInfo, { haikuId: this.uid })
    return myIndex === 0
  }

  Element.prototype.sendToBack = function () {
    this.component.zMoveToBack([this.uid], this.component._currentTimelineName, 0, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.bringToFront = function () {
    this.component.zMoveToFront([this.uid], this.component._currentTimelineName, 0, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.sendForward = function () {
    this.component.zMoveForward([this.uid], this.component._currentTimelineName, 0, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.sendBackward = function () {
    this.component.zMoveBackward([this.uid], this.component._currentTimelineName, 0, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.getBBox = function () {
    var domnode = this.getDOMNodeSerialization(false, false)
    return domnode.bbox
  }

  Element.prototype.getBoundingClientRect = function () {
    var domnode = this.getDOMNodeSerialization(false, false)
    return domnode.rect
  }

  Element.prototype.getDOMNodeSerialization = function (doIncludeAncestry, doStripIds) {
    if (!this.$el) return null
    // serializeElement copies a DOM node to a mana-esque node, with some extra properties if desired
    var node = serializeElement(this.$el, false, true, false)
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

  Element.prototype.getAncestry = function () {
    var ancestors = [] // We'll build a list with the original ancestor first and our node last
    _getAncestry(ancestors, this)
    return ancestors
  }

  Element.prototype.getLayoutAncestry = function () {
    return this.getAncestry().map((ancestor) => {
      return ancestor.node.layout
    })
  }

  Element.prototype.getMatrixAncestry = function () {
    return this.getLayoutAncestry().map((layout) => {
      return layout.computed.matrix
    })
  }

  Element.prototype.getOriginOffsetComposedMatrix = function () {
    var offset = this.getOriginOffsetMatrix()
    var reset = this.getOriginResetMatrix()
    var composition = this.getComposedMatrix(offset)
    var result = Layout3D.multiplyMatrices([], composition, reset)
    return result
  }

  Element.prototype.getComposedMatrix = function (matrix) {
    var layouts = this.getLayoutAncestry()
    var i = layouts.length
    while (i--) {
      matrix = Layout3D.multiplyMatrices([], matrix, layouts[i].computed.matrix)
    }
    return matrix
  }

  Element.prototype.getComputedMatrix = function () {
    return this.node.layout.computed.matrix
  }

  Element.prototype.getComputedSize = function () {
    return {
      x: this.node.layout.computed.size.x,
      y: this.node.layout.computed.size.y,
      z: this.node.layout.computed.size.z
    }
  }

  Element.prototype.getPoints = function () {
    return SVGPoints.manaToPoints(this.node) // TODO: Use bytecode overrides?
  }

  Element.getBoundingBoxPoints = function (points) {
    var x1 = points[0].x
    var y1 = points[0].y
    var x2 = points[0].x
    var y2 = points[0].y
    points.forEach((point) => {
      if (point.x < x1) x1 = point.x
      if (point.y < y1) y1 = point.y
      if (point.x > x2) x2 = point.x
      if (point.y > y2) y2 = point.y
    })
    var w = x2 - x1
    var h = y2 - y1
    return [
      {x: x1, y: y1}, {x: x1 + w / 2, y: y1}, {x: x2, y: y1},
      {x: x1, y: y1 + h / 2}, {x: x1 + w / 2, y: y1 + h / 2}, {x: x2, y: y1 + h / 2},
      {x: x1, y: y2}, {x: x1 + w / 2, y: y2}, {x: x2, y: y2}
    ]
  }

  Element.prototype.getBoxPoints = function () {
    return Element.getBoundingBoxPoints(this.getPoints())
  }

  Element.prototype.getBoxPointsTransformed = function () {
    return Element.transformPoints(this.getBoxPoints(), this.getOriginOffsetComposedMatrix())
  }

  Element.prototype.getPointsTransformed = function () {
    return Element.transformPoints(this.getPoints(), this.getOriginOffsetComposedMatrix())
  }

  Element.prototype.getPath = function () {
    return SVGPoints.pointsToPath(this.getPoints())
  }

  Element.prototype.getPathTransformed = function () {
    return SVGPoints.pointsToPath(this.getPointsTransformed())
  }

  Element.prototype.getPropertyValue = function (propertyName, fallbackValue) {
    var bytecode = component.getReifiedBytecode()
    var computed = TimelineProperty.getComputedValue(
      this.uid,
      _safeElementName(this.node),
      propertyName,
      component._currentTimelineName,
      component._currentTimelineTime,
      fallbackValue,
      bytecode,
      component.fetchActiveBytecodeFile().get('hostInstance'),
      component.fetchActiveBytecodeFile().get('states')
    )
    // Re: the scale NaN/Infinity issue on a freshly instantiated component module,
    // The problem is probably upstream of here in the player or ActiveComponent
    return computed
  }

  // I'm using "drag" as an abstraction over {any movement caused by the mouse dragging} whether that
  // is actually moving it in space, or rotating it, etc. This method makes the decision on what the "outcome"
  // of the drag should actually be.
  Element.prototype.drag = function (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState) {
    var localTransform = {zoom: reactState.zoomXY || 1, pan: {x: reactState.panX, y: reactState.panY}}
    if (reactState.isAnythingScaling) {
      if (Element.selected.count() <= 1) { // Until we fix transform logic/grouping, don't allow multi-rotate/-scale
        if (!reactState.controlActivation.cmd) {
          return this.scale(dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, reactState.controlActivation, localTransform)
        }
      }
    } else if (reactState.isAnythingRotating) {
      if (Element.selected.count() <= 1) { // Until we fix transform logic/grouping, don't allow multi-rotate/-scale
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

  Element.prototype.move = function (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord) {
    if (!this.parent) return void (0) // Don't allow artboard to move
    const propertyGroup = { 'translation.x': dx, 'translation.y': dy }
    this.component.applyPropertyGroupDelta([this.uid], this.component._currentTimelineName, this.component._currentTimelineTime, propertyGroup, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.scale = function (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, activationPoint, localTransform) {
    if (!coordsPrevious) return void (0)

    // The activation point index corresponds to a box with this coord system:
    // 0, 1, 2
    // 3, 4, 5
    // 6, 7, 8

    // Based on the handle being moved, build input vector (ignore unchanged axis by leaving as 0 when moving edge control points)
    // note that SHIFT effectively turns on both axes as well, even when dragging from an edge control point
    var activeAxes = [0, 0]
    if (activationPoint.shift || activationPoint.index === 6 || activationPoint.index === 3 || activationPoint.index === 0 || activationPoint.index === 2 || activationPoint.index === 5 || activationPoint.index === 8) {
      activeAxes[0] = 1
    }
    if (activationPoint.shift || activationPoint.index === 0 || activationPoint.index === 1 || activationPoint.index === 2 || activationPoint.index === 6 || activationPoint.index === 7 || activationPoint.index === 8) {
      activeAxes[1] = 1
    }

    var isLeft = activationPoint.index === 6 || activationPoint.index === 3 || activationPoint.index === 0
    var isTop = activationPoint.index === 0 || activationPoint.index === 1 || activationPoint.index === 2

    var x0 = coordsPrevious.clientX
    var y0 = coordsPrevious.clientY
    var x1 = coordsCurrent.clientX
    var y1 = coordsCurrent.clientY

    var worldDeltaX = (x1 - x0) / localTransform.zoom
    var worldDeltaY = (y1 - y0) / localTransform.zoom

    // assigned below
    var proportionX
    var proportionY

    // If no parent, we are the artboard element and must via a different method
    if (!this.parent) {
      var currentSize = {
        x: this.getPropertyValue('sizeAbsolute.x'),
        y: this.getPropertyValue('sizeAbsolute.y'),
        z: this.getPropertyValue('sizeAbsolute.z') || 0
      }

      var finalSize = {
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
      return this.component.resizeContext([this.uid], this.component._currentTimelineName, 0, finalSize, { from: 'glass' }, (err) => {
        if (err) return void (0)
      })
    }

    var baseWidth = this.getPropertyValue('sizeAbsolute.x')
    var baseHeight = this.getPropertyValue('sizeAbsolute.y')
    var oldScaleX = this.getPropertyValue('scale.x')
    var oldScaleY = this.getPropertyValue('scale.y')
    var oldWidth = oldScaleX * baseWidth
    var oldHeight = oldScaleY * baseHeight

    var thetaRadians = this.getPropertyValue('rotation.z') || 0
    var sizeDeltaCoefficient = (activationPoint.alt ? 2 : 1)
    var deltaX = worldDeltaX * Math.cos(thetaRadians) + worldDeltaY * Math.sin(thetaRadians)
    var deltaY = -worldDeltaX * Math.sin(thetaRadians) + worldDeltaY * Math.cos(thetaRadians)
    deltaX *= (isLeft ? -sizeDeltaCoefficient : sizeDeltaCoefficient)
    deltaY *= (isTop ? -sizeDeltaCoefficient : sizeDeltaCoefficient)
    // var newWidth = oldWidth + deltaX
    // var newHeight = oldHeight + deltaY

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

    var deltaScaleVector = [(deltaX / (oldWidth / oldScaleX)) * activeAxes[0], (deltaY / (oldHeight / oldScaleY)) * activeAxes[1]]

    var newScaleX = oldScaleX + deltaScaleVector[0]
    var newScaleY = oldScaleY + deltaScaleVector[1]

    var baseTranslationOffset = activationPoint.alt ? [0, 0] : [(isLeft ? -1 : 1) * (newScaleX - oldScaleX) * baseWidth / 2, (isTop ? -1 : 1) * (newScaleY - oldScaleY) * baseHeight / 2]
    var translationOffset = [
      baseTranslationOffset[0] * Math.cos(thetaRadians) - baseTranslationOffset[1] * Math.sin(thetaRadians),
      baseTranslationOffset[0] * Math.sin(thetaRadians) + baseTranslationOffset[1] * Math.cos(thetaRadians)
    ]

    var scaleGroup = { 'scale.x': deltaScaleVector[0], 'scale.y': deltaScaleVector[1] }
    var translationGroup = {'translation.x': translationOffset[0], 'translation.y': translationOffset[1]}
    var transformGroup = Object.assign(Object.assign({}, scaleGroup), translationGroup)
    this.component.applyPropertyGroupDelta([this.uid], this.component._currentTimelineName, this.component._currentTimelineTime, transformGroup, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.rotate = function (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, activationPoint, localTransform) {
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

    var x0 = coordsPrevious.clientX
    var y0 = coordsPrevious.clientY
    var x1 = coordsCurrent.clientX
    var y1 = coordsCurrent.clientY

    // TODO: get center of rotation from matrix transform?
    //      bbox may approximate well enough for now, but will
    //      at least need to account for adjustments in origin etc.
    //      Currently assuming center of rotation is center of object's bbox.
    var rect = this.getBoundingClientRect()
    var cx = rect.left + ((rect.right - rect.left) / 2)
    var cy = rect.top + ((rect.bottom - rect.top) / 2)

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
    var w0 = x0 - cx
    var h0 = y0 - cy
    var theta0 = Math.atan2(w0, h0)

    // new angle
    var w1 = x1 - cx
    var h1 = y1 - cy
    var theta1 = Math.atan2(w1, h1)

    var deltaRotationZ = theta0 - theta1

    // if shift is held, snap to absolute increments of pi/12
    if (activationPoint.shift) {
      // pretty hacky math/logic, won't allow for rotating past 2*Math.PI (unlike free rotation, which will rotate to any limit)
      theta0 = this.getPropertyValue('rotation.z') || 0
      theta1 = -PI_OVER_12 * Math.round(theta1 / PI_OVER_12)
      deltaRotationZ = DELTA_ROTATION_OFFSETS[activationPoint.index] + theta1 - theta0
    }

    const propertyGroup = { 'rotation.z': deltaRotationZ }
    this.component.applyPropertyGroupDelta([this.uid], this.component._currentTimelineName, this.component._currentTimelineTime, propertyGroup, { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.remove = function () {
    this.destroy()
    this.component.deleteComponent([this.uid], { from: 'glass' }, (err) => {
      if (err) return void (0)
    })
  }

  Element.prototype.isRenderableType = function () {
    return !!RENDERABLE_ELEMENTS[_safeElementName(this.node)]
  }

  Element.prototype.isSelectableType = function () {
    return !!TOP_LEVEL_GROUP_ELEMENTS[_safeElementName(this.node)]
  }

  Element.prototype.isGroupingType = function () {
    return !!GROUPING_ELEMENTS[_safeElementName(this.node)]
  }

  Element.prototype.isComponent = function () {
    return typeof this.node.elementName === 'object'
  }

  Element.prototype.getNameString = function () {
    if (this.isComponent()) return this.node.attributes.source
    return this.node.elementName
  }

  Element.prototype.getComponentId = function () {
    return this.node.attributes[HAIKU_ID_ATTRIBUTE]
  }

  Element.prototype.getAddressablePropertiesArray = function (isTopLevel) {
    const addressables = []

    // If this element is component, then start by populating standard DOM properties
    const elementName = (this.isComponent()) ? 'div' : this.getNameString()
    const domSchema = DOMSchema[elementName]
    const domFallbacks = DOMFallbacks[elementName]

    // Start with the basic hardcoded DOM schema; we'll add component-specifics if necessary
    if (domSchema) {
      for (const propertyName in domSchema) {
        let propertyGroup = null

        let nameParts = propertyName.split('.')
        if (propertyName === 'style.overflowX') nameParts = ['overflow', 'x']
        if (propertyName === 'style.overflowY') nameParts = ['overflow', 'y']

        if (isTopLevel) {
          if (ALLOWED_PROPS_TOP_LEVEL[propertyName]) {
            propertyGroup = {
              name: propertyName,
              prefix: nameParts[0],
              suffix: nameParts[1],
              fallback: domFallbacks[propertyName],
              typedef: domSchema[propertyName]
            }
          }
        } else {
          if (ALLOWED_PROPS[propertyName]) {
            propertyGroup = {
              name: propertyName,
              prefix: nameParts[0],
              suffix: nameParts[1],
              fallback: domFallbacks[propertyName],
              typedef: domSchema[propertyName]
            }
          }
        }

        // If we successfully created a property group, push it onto the list
        if (propertyGroup) {
          let clusterPrefix = CLUSTERED_PROPS[propertyGroup.name]
          if (clusterPrefix) {
            propertyGroup.cluster = {
              prefix: clusterPrefix,
              name: CLUSTER_NAMES[clusterPrefix]
            }
          }
          addressables.push(propertyGroup)
        }
      }
    }

    // If this is a component, then add any of our exposed states as addressables
    if (this.isComponent()) {
      for (let name in this.node.elementName.states) {
        let state = this.node.elementName.states[name]
        addressables.push({
          name: name,
          prefix: name,
          suffix: undefined,
          fallback: state.value,
          typedef: state.type
        })
      }
    }

    return addressables
  }

  Element.prototype.isAtCoords = function (coords) {
    if (!this.$el) return false
    return _isCoordInsideRect(coords.clientX, coords.clientY, this.$el.getBoundingClientRect())
  }

  Element.prototype.toXMLString = function () {
    return manaToHtml('', this.node)
  }

  Element.prototype.toJSONString = function () {
    return manaToJson(this.node, null, 2)
  }

  Element.HTMLSnapshot = function HTMLSnapshot (cb) {
    var html = component.getMountHTML()
    return cb(null, pretty(html))
  }

  Element.unselectAllElements = function (metadata) {
    Element.all().forEach((element) => element.unselect(metadata))
  }

  Element.drilldownIntoAlreadySelectedElement = function (coords) {
    Element.all().forEach((element) => {
      if (element.isAtCoords(coords) && element.isSelected) {
        element.drill()
      }
    })
  }

  // Used by Timeline
  Element.ALLOWED_TAGNAMES = ALLOWED_TAGNAMES

  return Element
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

module.exports = ElementModel
