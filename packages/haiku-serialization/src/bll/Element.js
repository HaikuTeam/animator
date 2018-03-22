const lodash = require('lodash')
const Layout3D = require('@haiku/core/lib/Layout3D').default
const cssQueryTree = require('@haiku/core/lib/helpers/cssQueryTree').default
const KnownDOMEvents = require('@haiku/core/lib/renderers/dom/Events').default
const DOMSchema = require('@haiku/core/lib/properties/dom/schema').default
const titlecase = require('titlecase')
const decamelize = require('decamelize')
const polygonOverlap = require('polygon-overlap')
const BaseModel = require('./BaseModel')
const TransformCache = require('./TransformCache')
const RENDERABLE_ELEMENTS = require('./svg/RenderableElements')
const TOP_LEVEL_GROUP_ELEMENTS = require('./svg/TopLevelGroupElements')
const GROUPING_ELEMENTS = require('./svg/GroupingElements')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'

const CUSTOM_EVENT_PREFIX = 'timeline:'

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
    this.transformCache = new TransformCache(this)
    this.orientation = {x: 0, y: 0, z: 0, w: 0}

    this._headingRow = null
    this._clusterAndPropertyRows = []
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
      if (row) {
        row.expandAndSelect(metadata)
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

  canRotate () {
    return this.isSelectableType() && this.isGroupingType() && !!this.parent
  }

  getStaticTemplateNode () {
    return this.staticTemplateNode
  }

  getCoreHostComponentInstance () {
    return this.component.getCoreComponentInstance()
  }

  getOriginOffsetMatrix () {
    const offset = Layout3D.createMatrix()
    if (this.isTextNode()) {
      return offset
    }
    const layout = this.getLayoutSpec()
    const size = layout.sizeAbsolute
    const origin = layout.origin
    offset[12] = -size.x * (0.5 - origin.x)
    offset[13] = -size.y * (0.5 - origin.y)
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
    // Note that .copy() also calls .clip()
    const clip = this.copy()
    this.remove()
    return clip
  }

  copy () {
    return this.clip()
  }

  clip () {
    this._clip = this.buildClipboardPayload()
    return this._clip
  }

  getLastClip () {
    return this._clip
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
   * @method buildClipboardPayload
   * @description Return a serializable payload for this object that represents sufficient
   * information to be able to paste (instantiate with overrides) or delete it if received as
   * part of a pasteThing command.
   */
  buildClipboardPayload () {
    // These are cloned because we may mutate their references in place when we paste
    const staticTemplateNode = lodash.cloneDeep(Template.manaWithOnlyStandardProps(this.getStaticTemplateNode()))
    const serializedBytecode = lodash.cloneDeep(this.component.fetchActiveBytecodeFile().getReifiedDecycledBytecode())
    return {
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
    const template = lodash.cloneDeep(Template.manaWithOnlyStandardProps(this.getStaticTemplateNode()))
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

  getStackingInfo () {
    if (!this.parent) return void (0)
    if (!this.parent.getStaticTemplateNode()) return void (0)
    return Template.getStackingInfo(
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

  getBoundingClientRect () {
    // TODO:
    //   This doesn't quite work yet.
    //   Stubbing out possible behavior while cleaning out DOM/render dependencies/races
    //
    const points = this.getBoxPointsTransformed()
    const top = Math.min(points[0].y, points[2].y, points[6].y, points[8].y)
    const bottom = Math.max(points[0].y, points[2].y, points[6].y, points[8].y)
    const left = Math.min(points[0].x, points[2].x, points[6].x, points[8].x)
    const right = Math.max(points[0].x, points[2].x, points[6].x, points[8].x)
    const width = Math.abs(bottom - top)
    const height = Math.abs(right - left)
    return {
      top,
      right,
      bottom,
      left,
      width,
      height
    }
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

  getOriginOffsetComposedMatrix () {
    const offset = this.getOriginOffsetMatrix()
    const reset = this.getOriginResetMatrix()
    const composition = this.getComposedComputedMatrix(offset)
    const result = Layout3D.multiplyMatrices(composition, reset)
    return result
  }

  getComposedComputedMatrix (matrix) {
    const computedLayouts = this.getComputedLayoutAncestry()
    let i = computedLayouts.length
    while (i--) {
      matrix = Layout3D.multiplyMatrices(
        matrix,
        computedLayouts[i].matrix
      )
    }
    return matrix
  }

  getComputedSize () {
    if (this.isTextNode()) {
      return this.parent.getComputedSize()
    }
    return this.getComputedLayout().size
  }

  getParentComputedSize () {
    if (!this.parent) {
      return this.getLayoutSpec().sizeAbsolute
    }
    return this.parent.getComputedSize()
  }

  getComputedMatrix () {
    if (this.isTextNode()) {
      return Layout3D.createMatrix()
    }
    return this.getComputedLayout().matrix
  }

  getComputedLayout () {
    return Layout3D.computeLayout(
      this.getLayoutSpec(),
      Layout3D.createMatrix(), // QUESTION: Is this ever not-identity?
      this.getParentComputedSize()
    )
  }

  updateOrientationWithRotationValues (rx, ry, rz, rw) {
    this.orientation = Layout3D.computeOrientationFlexibly(
      rx,
      ry,
      rz,
      rw,
      this.orientation
    )
  }

  getLayoutSpec () {
    const bytecode = this.component.getReifiedBytecode()
    const hostInstance = this.component.getCoreComponentInstance()
    const componentId = this.getComponentId()
    const elementName = Element.safeElementName(this.getStaticTemplateNode())
    const elementNode = hostInstance.findElementsByHaikuId(componentId)[0]
    const timelineName = this.component.getCurrentTimelineName()
    const timelineTime = this.component.getCurrentTimelineTime()

    const propertiesBase = TimelineProperty.getPropertiesBase(
      bytecode.timelines,
      timelineName,
      componentId
    )

    const grabValue = (outputName) => {
      const computedValue = hostInstance._builder.grabValue(
        timelineName,
        componentId,
        elementNode,
        outputName,
        propertiesBase,
        timelineTime,
        hostInstance,
        !hostInstance._shouldPerformFullFlush(),
        true
      )

      if (computedValue === undefined || computedValue === null) {
        return TimelineProperty.getFallbackValue(
          componentId,
          elementName,
          outputName
        )
      }

      return computedValue
    }

    return {
      shown: grabValue('shown'),
      opacity: grabValue('opacity'),
      mount: {
        x: grabValue('mount.x'),
        y: grabValue('mount.y'),
        z: grabValue('mount.z')
      },
      align: {
        x: grabValue('align.x'),
        y: grabValue('align.y'),
        z: grabValue('align.z')
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
        z: grabValue('rotation.z'),
        w: grabValue('rotation.w')
      },
      orientation: Layout3D.computeOrientationFlexibly(
        grabValue('rotation.x'),
        grabValue('rotation.y'),
        grabValue('rotation.z'),
        grabValue('rotation.w'),
        this.orientation
      ),
      scale: {
        x: grabValue('scale.x'),
        y: grabValue('scale.y'),
        z: grabValue('scale.z')
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
      {x: 0, y: 0}, {x: w / 2, y: 0}, {x: w, y: 0},
      {x: 0, y: h / 2}, {x: w / 2, y: h / 2}, {x: w, y: h / 2},
      {x: 0, y: h}, {x: w / 2, y: h}, {x: w, y: h}
    ]
  }

  getBoxPointsNotTransformed () {
    return Element.getBoundingBoxPoints(
      this.getBoundingBoxPoints()
    )
  }

  getBoxPointsTransformed () {
    const points = Element.transformPointsInPlace(
      this.getBoxPointsNotTransformed(),
      this.getOriginOffsetComposedMatrix()
    )
    return points
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

  computePropertyValue (propertyName, fallbackValue) {
    const bytecode = this.component.getReifiedBytecode()
    const host = this.component.getCoreComponentInstance()
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
          value: existingPropertyValue + deltaPropertyValue
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
    this.unselect(this.component.project.getMetadata())
    this.hoverOff(this.component.project.getMetadata())

    this.component.deleteComponent(
      this.getComponentId(),
      this.component.project.getMetadata(),
      () => {}
    )

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
    const coreComponentInstance = staticTemplateNode && staticTemplateNode.__instance
    const activeComponent = coreComponentInstance && coreComponentInstance.__activeComponent
    return activeComponent
  }

  getTitle () {
    if (this.isTextNode()) return '<text>' // HACK, but not sure what else to do
    return this.getStaticTemplateNode().attributes[HAIKU_TITLE_ATTRIBUTE] || 'notitle'
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
    if (this.isTextNode()) return this.getPrimaryKey() // HACK, but not sure what else to do
    return this.getStaticTemplateNode().attributes[HAIKU_ID_ATTRIBUTE]
  }

  getGraphAddress () {
    return this.address
  }

  getAllRows () {
    return lodash.uniq([].concat(this.getHostedRows(), this.getTargetingRows()))
  }

  getHostedRowsInDefaultDisplayPositionOrder () {
    const rows = []

    const heading = this.getHeadingRow()

    if (heading) {
      rows.push(heading)

      if (heading.children) {
        heading.children.forEach((child) => {
          rows.push(child)
          if (child.children) {
            child.children.forEach((grandchild) => {
              rows.push(grandchild)
            })
          }
        })
      }
    }

    return rows
  }

  getHostedRows () {
    return Row.where({ component: this.component, host: this })
  }

  getTargetingRows () {
    return Row.where({ component: this.component, element: this })
  }

  clearEntityCaches () {
    if (this.children) {
      this.children.forEach((element) => {
        element.cacheClear()
        element.clearEntityCaches()
      })
    }

    this.getHostedRows().forEach((row) => {
      row.cacheClear()
      row.clearEntityCaches()
    })

    this.getTargetingRows().forEach((row) => {
      row.cacheClear()
      row.clearEntityCaches()
    })
  }

  rehydrateRows () {
    const existingRows = this.getAllRows()
    existingRows.forEach((row) => row.mark())

    // Populating this cache of rows for faster lookups
    this._headingRow = null
    this._clusterAndPropertyRows = []

    const hostElement = this
    const component = this.component
    const timeline = this.component.getCurrentTimeline()

    const parentElementHeadingRow = this.parent && this.parent.getHeadingRow()

    const currentElementHeadingRow = Row.upsert({
      uid: Row.buildHeadingUid(component, hostElement),
      parent: parentElementHeadingRow,
      host: hostElement,
      element: hostElement,
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

    const clusters = {}

    this.eachAddressableProperty((
      propertyGroupDescriptor,
      addressableName,
      targetElement
    ) => {
      if (propertyGroupDescriptor.cluster) {
        // Properties that are 'clustered', like rotation.x,y,z
        const clusterId = Row.buildClusterUid(this, hostElement, targetElement, propertyGroupDescriptor)

        let clusterRow

        // Ensure we get a correct number for the row index
        if (clusters[clusterId]) {
          clusterRow = Row.findById(clusterId)
        } else {
          clusterRow = Row.upsert({
            uid: clusterId,
            host: hostElement,
            element: targetElement,
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
          uid: Row.buildClusterMemberUid(this, hostElement, targetElement, propertyGroupDescriptor, addressableName),
          host: hostElement,
          element: targetElement,
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
          uid: Row.buildPropertyUid(this, hostElement, targetElement, addressableName),
          host: hostElement,
          element: targetElement,
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

  rehydrateChildren () {
    const node = this.getStaticTemplateNode()

    if (node && node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]

        const element = Element.upsertElementFromVirtualElement(
          this.component, // component
          child, // static template node
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

        element.rehydrate()
      }
    }
  }

  rehydrate () {
    if (!experimentIsEnabled(Experiment.ElementDepthFilter) || this.getDepthAmongElements() < 2) {
      this.rehydrateChildren()
    }
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

  getIdsOfDescendantsThatHaveEditedKeyframes () {
    const idsToNodes = {}

    Template.visit(this.getStaticTemplateNode(), (node) => {
      if (node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE]) {
        // Visitor goes to all nodes including ours; skip since we're concerned with descendants only
        if (node.attributes[HAIKU_ID_ATTRIBUTE] !== this.getComponentId()) {
          idsToNodes[node.attributes[HAIKU_ID_ATTRIBUTE]] = node
        }
      }
    })

    const idsWithEditedKeyframes = {}

    const bytecode = this.component.getReifiedBytecode()

    if (bytecode && bytecode.timelines) {
      for (const timelineName in bytecode.timelines) {
        for (const foundSelector in bytecode.timelines[timelineName]) {
          const haikuId = Template.haikuSelectorToHaikuId(foundSelector)

          // No point proceeding if this is a property set for another element;
          if (!idsToNodes[haikuId]) {
            continue
          }

          for (const propertyName in bytecode.timelines[timelineName][foundSelector]) {
            const propertyObj = bytecode.timelines[timelineName][foundSelector][propertyName]

            // If the zeroth keyframe is edited or if there are any keyframes other
            // than the zeroth keyframe, assume that the property has been edited
            if (
              (propertyObj[0] && propertyObj[0].edited) ||
              Object.keys(propertyObj).length > 1
            ) {
              idsWithEditedKeyframes[haikuId] = idsToNodes[haikuId]

              // We've found at least one so we can stop iterating through properties
              break
            }
          }
        }
      }
    }

    return idsWithEditedKeyframes
  }

  hasAnyDescendantsWithEditedKeyframes () {
    const idsWithEditedKeyframes = this.getIdsOfDescendantsThatHaveEditedKeyframes()
    return Object.keys(idsWithEditedKeyframes).length > 0
  }

  getBuiltinAddressables () {
    const builtinAddressables = {}

    // Start with the basic hardcoded DOM schema; we'll add component-specifics if necessary
    if (DOMSchema[this.getSafeDomFriendlyName()]) {
      // This assigns so-called 'cluster' properties if any are deemed such
      Property.assignDOMSchemaProperties(builtinAddressables, this)
    }

    return builtinAddressables
  }

  getComponentAddressables () {
    const componentAddressables = {}

    // If this is a component, then add any of our componentAddressables states as builtinAddressables
    if (this.isComponent()) {
      const component = this.getCoreTargetComponentInstance()
      if (component) {
        // Note that the states also contain .value() for lazy evaluation of current state
        // Also note that states values should have a type='state' property
        component.getAddressableProperties(componentAddressables)
      }
    }

    return componentAddressables
  }

  getCompleteAddressableProperties () {
    const builtinAddressables = this.getBuiltinAddressables()

    const componentAddressables = this.getComponentAddressables()

    const returnedAddressables = {}

    for (const key1 in builtinAddressables) {
      if (!Element.FORBIDDEN_PROPS[key1]) {
        returnedAddressables[key1] = builtinAddressables[key1]
      }
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

      if (Property.EXCLUDE_FROM_JIT[propertyName]) {
        continue
      }

      if (this.isRootElement() && Property.EXCLUDE_FROM_JIT_IF_ROOT_ELEMENT[propertyName]) {
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
      if (!this.isRootElement()) {
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
    const addressableProperties = this.getDisplayedAddressableProperties(/* includeSubElements= */ true)

    for (const propertyName in addressableProperties) {
      if (propertyName !== '__subElementProperties' && addressableProperties[propertyName]) {
        iteratee(
          addressableProperties[propertyName],
          propertyName,
          this // targetElement
        )
      }
    }

    if (experimentIsEnabled(Experiment.ShowSubElementsInJitMenu)) {
      // Only allow this behavior among the top-level children of the root element
      // Without this condition, stuff goes wrong in a bad way
      if (this.getDepthAmongElements() === 1) {
        // Expose sub-element properties as rows in the timeline
        // Note that the target element is not the host element here
        if (addressableProperties.__subElementProperties) {
          for (const subElementId in addressableProperties.__subElementProperties) {
            const targetElement = Element.findById(subElementId) // targetElement
            if (targetElement) {
              for (const subElementPropertyName in addressableProperties.__subElementProperties[subElementId]) {
                iteratee(
                  addressableProperties.__subElementProperties[subElementId][subElementPropertyName],
                  subElementPropertyName,
                  targetElement
                )
              }
            }
          }
        }
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

    const id = node && node.attributes && node.attributes.id
    const title = node && node.attributes && node.attributes[HAIKU_TITLE_ATTRIBUTE]

    let name = (typeof node.elementName === 'string' && node.elementName) ? node.elementName : 'div'
    if (Element.FRIENDLY_NAME_SUBSTITUTES[name]) {
      name = Element.FRIENDLY_NAME_SUBSTITUTES[name]
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

  getDisplayedAddressableProperties (includeSubElements) {
    const ours = this.getCollatedAddressableProperties().filtered

    if (experimentIsEnabled(Experiment.ShowSubElementsInJitMenu)) {
      if (includeSubElements) {
        // The Timeline UI will handle this property specially; the double
        // underscore is so not to collide with real named properties
        if (!ours.__subElementProperties) {
          ours.__subElementProperties = {}
        }

        // This assumes that our descendants have been populated already,
        // which happens on-demand when the JIT options are requested
        Element.visitDescendants(this, (child) => {
          // I don't know why, but in some scenarios, this is undefined
          if (child.getPrimaryKey()) {
            const subs = child.getExplicitlyVisibleAddressableProperties()
            ours.__subElementProperties[child.getPrimaryKey()] = subs
          }
        })
      }
    }

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

      if (Property.shouldBasicallyIncludeProperty(propertyName, propertyObject, this)) {
        if (this._visibleProperties[propertyName]) {
          // Highest precedence is if the property is deemed explicitly visible;
          // Typically these get exposed when the user has selected via the JIT menu
          filtered[propertyName] = propertyObject
        } else {
          if (propertyObject.type === 'state') {
            // If the property is a component state (exposed property), we definitely want it;
            // the exposed states are the API to the component
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
                  // If the keyframe has definitely been edited by the user
                  if (keyframesObject[0].edited) {
                    filtered[propertyName] = propertyObject
                  } else {
                    // If the keyframe is an internally managed prop that has been changed from its default value
                    const fallbackValue = Element.INTERNALLY_MANAGED_PROPS_WITH_DEFAULT_VALUES[propertyName]

                    // If no fallback value defined, cannot compare, so assume we want to keep it in the list
                    if (fallbackValue === undefined) {
                      filtered[propertyName] = propertyObject
                    } else if (
                      keyframesObject[0].value !== undefined &&
                      keyframesObject[0].value !== fallbackValue
                    ) {
                      filtered[propertyName] = propertyObject
                    }
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
      }

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

  getOrigin () {
    return {
      x: this.computePropertyValue('origin.x'),
      y: this.computePropertyValue('origin.y'),
      z: this.computePropertyValue('origin.z')
    }
  }

  doesContainUngroupableContent () {
    return !!this.getParentOfUngroupables()
  }

  getParentOfUngroupables () {
    // Returning null if we don't have anything that can be ungrouped
    let out = null

    Template.visit(this.getStaticTemplateNode(), (node, parent, index, depth) => {
      // Use the first element we've found
      if (out) {
        return
      }

      if (Element.nodeIsGrouper(node)) {
        if (
          node.children &&
          // If we have more than one groupee in our contents, we can group
          node.children.filter((child) => {
            return child && Element.nodeIsGroupee(child)
          }).length > 1
        ) {
          out = {
            node,
            depth,
            index
          }
        }
      }
    })

    return out
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
    if (!instance) {
      return null
    }
    const element = instance.findElementsByHaikuId(this.getComponentId())[0]
    return element
  }

  getCoreTargetComponentInstance () {
    if (!this.isComponent()) return null
    const liveRenderedNode = this.getLiveRenderedNode()
    if (!liveRenderedNode) return null
    return liveRenderedNode.__instance
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

Element.nodeIsGrouper = (node) => {
  return (
    node.elementName === 'svg' ||
    node.elementName === 'g' ||
    node.elementName === 'div'
  )
}

Element.nodeIsGroupee = (node) => {
  // Don't include empty groups
  if (
    node.elementName === 'g' &&
    (!node.children || node.children.length < 1)
  ) {
    return false
  }

  return (
    Element.nodeIsGrouper(node) ||
    node.elementName === 'rect' ||
    node.elementName === 'line' ||
    node.elementName === 'circle' ||
    node.elementName === 'ellipse' ||
    node.elementName === 'polygon' ||
    node.elementName === 'polyline' ||
    node.elementName === 'path' ||
    node.elementName === 'text' ||
    node.elementName === 'tspan'
  )
}

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

Element.transformPointsInPlace = (points, matrix) => {
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

Element.getBoundingBoxPointsForElementsTransformed = (elements) => {
  const points = []
  if (!elements) return points
  if (elements.length < 1) return points
  if (elements.length === 1) return elements[0].getBoxPointsTransformed()
  elements.forEach((element) => {
    element.getBoxPointsTransformed().forEach((point) => points.push(point))
  })
  return Element.getBoundingBoxPoints(points)
}

Element.getBoundingBoxPointsForElementsNotTransformed = (elements) => {
  const points = []
  if (!elements) return points
  if (elements.length < 1) return points
  if (elements.length === 1) return elements[0].getBoxPointsNotTransformed()
  elements.forEach((element) => {
    element.getBoxPointsNotTransformed().forEach((point) => points.push(point))
  })
  return Element.getBoundingBoxPoints(points)
}

Element.boxToCornersAsPolygonPoints = ({ x, y, width, height }) => {
  return [
    [x, y], [x + width, y],
    [x, y + height], [x + width, y + height]
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

Element.getOriginPosition = (element) => {
  const originFractionX = element.computePropertyValue('origin.x')
  const originFractionY = element.computePropertyValue('origin.y')
  const width = element.computePropertyValue('sizeAbsolute.x')
  const height = element.computePropertyValue('sizeAbsolute.y')
  const left = element.computePropertyValue('translation.x')
  const top = element.computePropertyValue('translation.y')
  return {
    x: left + (width * originFractionX),
    y: top + (height * originFractionY)
  }
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

  const element = Element.upsert({
    uid,
    staticTemplateNode,
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

Element.ALWAYS_ALLOWED_PROPS = {
  'sizeAbsolute.x': true,
  'sizeAbsolute.y': true,
  'translation.x': true,
  'translation.y': true,
  'translation.z': true, // This only works if `transform-style: preserve-3d` is set
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
  'style.backgroundColor': 'rgba(255,255,255,0)',
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

Element.FRIENDLY_NAME_SUBSTITUTES = {
  g: 'group'
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

module.exports = Element

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
const MathUtils = require('./MathUtils')
const Property = require('./Property')
const Row = require('./Row')
const Template = require('./Template')
const TimelineProperty = require('./TimelineProperty')
