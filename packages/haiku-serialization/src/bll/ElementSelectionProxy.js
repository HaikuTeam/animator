const async = require('async')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')
const TransformCache = require('./TransformCache')
const Layout3D = require('@haiku/core/lib/Layout3D').default
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')

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

const HAIKU_ID_ATTRIBUTE = 'haiku-id'

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 * @class ElementSelectionProxy
 * @description
 *   Represents a set of 0 or more Element instances, providing a singular
 *   way to transform an edit them together, for times when said operations
 *   need to be aware of the entire set.
 */
class ElementSelectionProxy extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    if (!Array.isArray(this.selection)) {
      throw new Error('ElementSelectionProxy selection must be an array')
    }

    if (this.doesSelectionContainArtboard() && this.hasMultipleInSelection()) {
      throw new Error('ElementSelectionProxy can only manage an artboard alone')
    }

    // Allows transforms to be recalled on demand, e.g. during Alt+drag
    this.transformCache = new TransformCache(this)

    // When representing multiple elements, we apply changes to our proxy properties
    this._proxyProperties = Object.assign(ElementSelectionProxy.DEFAULT_PROPERTY_VALUES)
  }

  hasAnythingInSelection () {
    return this.selection.length > 0
  }

  hasAnythingInSelectionButNotArtboard () {
    return (
      this.hasAnythingInSelection() &&
      !this.doesSelectionContainArtboard()
    )
  }

  hasMultipleInSelection () {
    return this.selection.length > 1
  }

  doesSelectionContainArtboard () {
    return !!this.getArtboardElement()
  }

  getArtboardElement () {
    return this.selection.filter((element) => {
      return element.isRootElement()
    })[0]
  }

  doesManageSingleElement () {
    return this.selection.length === 1
  }

  canRotate () {
    if (this.doesSelectionContainArtboard()) return false
    return true
  }

  canControlHandles () {
    if (this.hasAnythingInSelection()) return true
    return false
  }

  fetchActiveArtboard () {
    return Artboard.all()[0]
  }

  pushCachedTransform (key) {
    this.transformCache.push(key)
    this.selection.forEach((element) => {
      element.transformCache.push(key)
    })
  }

  canCreateComponentFromSelection () {
    return (
      this.selection.length > 0 &&
      !(
        this.selection.length === 1 &&
        this.selection[0] &&
        this.selection[0].isComponent()
      )
    )
  }

  canEditComponentFromSelection () {
    return (
      this.selection.length === 1 &&
      this.selection[0] &&
      this.selection[0].isComponent()
    )
  }

  getSourcePath () {
    return (
      this.selection[0] &&
      this.selection[0].staticTemplateNode &&
      this.selection[0].staticTemplateNode.attributes &&
      this.selection[0].staticTemplateNode.attributes['source']
    )
  }

  isSelectionSketchEditable () {
    return !!this.getSourcePath()
  }

  getSketchAssetPath () {
    const sourcePath = this.getSourcePath()
    return (
      sourcePath &&
      sourcePath.split(/\.sketch\.contents/)[0].concat('.sketch')
    )
  }

  canCut () {
    return this.hasAnythingInSelection() && !this.doesSelectionContainArtboard()
  }

  canCopy () {
    return this.hasAnythingInSelection() && !this.doesSelectionContainArtboard()
  }

  canPaste () {
    // TODO: How can we determine whether we have a pasteable ready?
    return this.selection.length < 1
  }

  canDelete () {
    return this.hasAnythingInSelection() && !this.doesSelectionContainArtboard()
  }

  canBringForward () {
    return (
      this.doesManageSingleElement() &&
      !this.doesSelectionContainArtboard() &&
      !this.selection[0].isAtFront()
    )
  }

  bringForward () {
    return this.selection[0].bringForward()
  }

  canSendBackward () {
    return (
      this.doesManageSingleElement() &&
      !this.doesSelectionContainArtboard() &&
      !this.selection[0].isAtBack()
    )
  }

  sendBackward () {
    return this.selection[0].sendBackward()
  }

  canBringToFront () {
    return (
      this.doesManageSingleElement() &&
      !this.doesSelectionContainArtboard() &&
      !this.selection[0].isAtFront()
    )
  }

  bringToFront () {
    return this.selection[0].bringToFront()
  }

  canSendToBack () {
    return (
      this.doesManageSingleElement() &&
      !this.doesSelectionContainArtboard() &&
      !this.selection[0].isAtBack()
    )
  }

  sendToBack () {
    return this.selection[0].sendToBack()
  }

  canGroup () {
    return (
      !this.doesSelectionContainArtboard() &&
      !this.doesManageSingleElement()
    )
  }

  group (metadata) {
    const elementHaikuIds = this.selection.map((element) => {
      return element.getComponentId()
    })

    if (elementHaikuIds.length > 0) {
      return this.component.groupElements(
        elementHaikuIds,
        metadata,
        () => {}
      )
    }
  }

  canUngroup () {
    return (
      !this.doesSelectionContainArtboard() &&
      this.doesManageSingleElement() &&
      !this.selection[0].isComponent() && // components are treated as singletons
      this.selection[0].doesContainUngroupableContent()
    )
  }

  ungroup (metadata) {
    const grouperElement = this.selection[0].getParentOfUngroupables()

    if (grouperElement) {
      return this.component.ungroupElements(
        grouperElement.attributes[HAIKU_ID_ATTRIBUTE],
        metadata,
        () => {}
      )
    }
  }

  canCopySVG () {
    return this.doesManageSingleElement()
  }

  copySVG () {
    return this.selection[0].toXMLString()
  }

  canHTMLSnapshot () {
    return true
  }

  getLastClipboardPayload () {
    return this.selection.map((element) => {
      return element.getLastClip()
    })
  }

  getSingleComponentElement () {
    throw new Error('not yet implemented')
  }

  getParentSize () {
    const { width, height } = this.component.getContextSize()
    return {
      x: width,
      y: height,
      z: 1
    }
  }

  getProxyBoxPoints () {
    return Element.getBoundingBoxPointsForElementsTransformed(this.selection)
  }

  getBoxPointsTransformed () {
    // If managing only one element, use its own box points
    if (this.doesManageSingleElement()) {
      const elementPoints = this.selection[0].getBoxPointsTransformed()
      return elementPoints
    }

    const parentSize = this.getParentSize()

    const ourMatrix = Layout3D.createMatrix()

    const proxyLayoutSpec = {
      shown: true,
      opacity: 1.0,
      mount: {x: 0, y: 0, z: 0},
      align: {x: 0, y: 0, z: 0},
      origin: {
        x: this.computePropertyValue('origin.x'),
        y: this.computePropertyValue('origin.y'),
        z: this.computePropertyValue('origin.z')
      },
      translation: {
        x: this.computePropertyValue('translation.x'),
        y: this.computePropertyValue('translation.y'),
        z: this.computePropertyValue('translation.z')
      },
      rotation: {
        x: this.computePropertyValue('rotation.x'),
        y: this.computePropertyValue('rotation.y'),
        z: this.computePropertyValue('rotation.z'),
        w: 0
      },
      scale: {
        x: this.computePropertyValue('scale.x'),
        y: this.computePropertyValue('scale.y'),
        z: this.computePropertyValue('scale.z')
      },
      orientation: {x: 0, y: 0, z: 0, w: 0},
      sizeMode: {x: 1, y: 1, z: 1},
      sizeProportional: {x: 1, y: 1, z: 1},
      sizeDifferential: {x: 0, y: 0, z: 0},
      sizeAbsolute: {
        x: this.computePropertyValue('sizeAbsolute.x'),
        y: this.computePropertyValue('sizeAbsolute.y'),
        z: this.computePropertyValue('sizeAbsolute.z')
      }
    }

    const proxyMatrix = Layout3D.computeLayout(
      proxyLayoutSpec,
      ourMatrix,
      parentSize
    ).matrix

    const proxyPoints = Element.transformPointsInPlace(
      this.getProxyBoxPoints(),
      proxyMatrix
    )

    return proxyPoints
  }

  getBoundingClientRect () {
    const points = this.getBoxPointsTransformed()

    const left = Math.min(points[0].x, points[2].x, points[6].x, points[8].x)
    const right = Math.max(points[0].x, points[2].x, points[6].x, points[8].x)
    const top = Math.min(points[0].y, points[2].y, points[6].y, points[8].y)
    const bottom = Math.max(points[0].y, points[2].y, points[6].y, points[8].y)
    const width = Math.abs(left - right)
    const height = Math.abs(bottom - top)

    const proxyRect = {
      left,
      right,
      top,
      bottom,
      width,
      height
    }

    return proxyRect
  }

  getElementOrProxyPropertyValue (key) {
    const fallback = ElementSelectionProxy.DEFAULT_PROPERTY_VALUES[key]

    // If managing only one element, use its own property values
    if (this.doesManageSingleElement()) {
      return this.selection[0].computePropertyValue(key, fallback)
    }

    return this.computePropertyValue(key)
  }

  computePropertyValue (key) {
    // We always need to compute this dynamically because our managed elements may have been transformed
    if (key === 'sizeAbsolute.x' || key === 'sizeAbsolute.y') {
      const points = this.getProxyBoxPoints()
      if (points && points.length === 9) {
        if (key === 'sizeAbsolute.x') return Math.abs(points[2].x - points[0].x)
        if (key === 'sizeAbsolute.y') return Math.abs(points[6].y - points[0].y)
      } else {
        return 1
      }
    }

    // If managing multiple elements, use our proxy properties
    return this._proxyProperties[key]
  }

  /**
   * @method drag
   * @description Scale, rotate, or translate the elements in the selection
   */
  drag (
    dx,
    dy,
    mouseCoordsCurrent,
    mouseCoordsPrevious,
    lastMouseDownCoord,
    isAnythingScaling,
    isAnythingRotating,
    controlActivation,
    viewportTransform,
    globals
  ) {
    if (isAnythingScaling) {
      if (!controlActivation.cmd) {
        return this.scale(
          dx,
          dy,
          mouseCoordsCurrent,
          mouseCoordsPrevious,
          lastMouseDownCoord,
          controlActivation,
          viewportTransform
        )
      }
    } else if (isAnythingRotating) {
      if (controlActivation.cmd) {
        // In case we got here, don't allow artboard to rotate
        if (this.doesSelectionContainArtboard()) {
          return
        }

        return this.rotate(
          dx,
          dy,
          mouseCoordsCurrent,
          mouseCoordsPrevious,
          lastMouseDownCoord,
          controlActivation,
          viewportTransform
        )
      }
    } else {
      // In case we got here, don't allow artboard to move
      if (this.doesSelectionContainArtboard()) {
        return
      }

      if (globals.isShiftKeyDown) {
        return this.moveWithShiftDown(
          dx,
          dy,
          mouseCoordsCurrent,
          mouseCoordsPrevious,
          lastMouseDownCoord
        )
      } else {
        return this.move(
          dx,
          dy,
          mouseCoordsCurrent,
          mouseCoordsPrevious,
          lastMouseDownCoord
        )
      }
    }
  }

  move (dx, dy) {
    const propertyGroupDelta = {
      'translation.x': {
        value: dx
      },
      'translation.y': {
        value: dy
      }
    }

    const accumulatedUpdates = {}

    this.selection.forEach((element) => {
      const propertyGroup = element.computePropertyGroupValueFromGroupDelta(propertyGroupDelta)

      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        propertyGroup
      )
    })

    this.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {} // no-op
    )
  }

  moveWithShiftDown (dx, dy, mouseCoordsCurrent, mouseCoordsPrevious, lastMouseDownCoord) {
    const accumulatedUpdates = {}

    this.selection.forEach((element) => {
      const propertyGroup = ElementSelectionProxy.computeConstrainedMovePropertyGroup(
        element, // targetElement
        this, // contextElement
        dx,
        dy,
        mouseCoordsCurrent,
        mouseCoordsPrevious,
        lastMouseDownCoord
      )

      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        propertyGroup
      )
    })

    this.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {} // no-op
    )
  }

  scale (
    dx,
    dy,
    coordsCurrent,
    coordsPrevious,
    lastMouseDownCoord,
    activationPoint,
    viewportTransform
  ) {
    if (this.doesSelectionContainArtboard()) {
      return this.scaleArtboard(
        dx,
        dy,
        coordsCurrent,
        coordsPrevious,
        lastMouseDownCoord,
        activationPoint,
        viewportTransform
      )
    }

    return this.scaleElements(
      dx,
      dy,
      coordsCurrent,
      coordsPrevious,
      lastMouseDownCoord,
      activationPoint,
      viewportTransform
    )
  }

  scaleElements (
    dx,
    dy,
    coordsCurrent,
    coordsPrevious,
    lastMouseDownCoord,
    activationPoint,
    viewportTransform
  ) {
    // HACK: For now, disable multi-scale until I figure out how to do it
    if (this.hasMultipleInSelection()) {
      return
    }

    const accumulatedUpdates = {}

    this.selection.forEach((element) => {
      const propertyGroupDelta = ElementSelectionProxy.computeScalePropertyGroupDelta(
        element, // targetElement
        this, // contextElement
        dx,
        dy,
        coordsCurrent,
        coordsPrevious,
        lastMouseDownCoord,
        activationPoint,
        viewportTransform
      )

      const propertyGroup = element.computePropertyGroupValueFromGroupDelta(propertyGroupDelta)

      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        propertyGroup
      )
    })

    this.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {} // no-op
    )
  }

  scaleArtboard (
    dx,
    dy,
    coordsCurrent,
    coordsPrevious,
    lastMouseDownCoord,
    activationPoint,
    viewportTransform
  ) {
    const accumulatedUpdates = {}

    const bytecode = this.component.getReifiedBytecode()
    const element = this.getArtboardElement()
    const timelineName = element.component.getCurrentTimelineName()
    const timelineTime = 0 // Lock artboard changes to time 0

    if (!bytecode.timelines[timelineName]) {
      bytecode.timelines[timelineName] = {}
    }

    if (!accumulatedUpdates[timelineName]) { // dupe accumulateKeyframeUpdates
      accumulatedUpdates[timelineName] = {}
    }

    const {
      isLeft,
      isTop,
      deltaX,
      deltaY,
      finalSize
    } = ElementSelectionProxy.computeScaleInfoForArtboard(
      element, // targetElement
      this, // contextElement
      dx,
      dy,
      coordsCurrent,
      coordsPrevious,
      lastMouseDownCoord,
      activationPoint,
      viewportTransform
    )

    // Don't allow the user to reduce the artboard's scale to nothing
    if (finalSize['sizeAbsolute.x'].value < 5 || finalSize['sizeAbsolute.y'].value < 5) {
      return
    }

    ElementSelectionProxy.accumulateKeyframeUpdates(
      accumulatedUpdates,
      element.getComponentId(),
      timelineName,
      timelineTime,
      finalSize
    )

    if (experimentIsEnabled(Experiment.StageResizeAllSides)) {
      const elementOffset = {
        'translation.x': (isLeft) ? deltaX : 0,
        'translation.y': (isTop) ? deltaY : 0
      }

      // Translate all elements on stage by the offset so the stage can be resized
      // from any side with the elements retaining their original placement
      this.component.getTopLevelElementHaikuIds().forEach((haikuId) => {
        const selector = Template.buildHaikuIdSelector(haikuId)

        if (!accumulatedUpdates[timelineName][haikuId]) { // dupe accumulateKeyframeUpdates
          accumulatedUpdates[timelineName][haikuId] = {}
        }

        if (!bytecode.timelines[timelineName][selector]) {
          bytecode.timelines[timelineName][selector] = {}
        }

        for (const propertyName in elementOffset) {
          const offsetValue = elementOffset[propertyName]

          if (!accumulatedUpdates[timelineName][haikuId][propertyName]) { // dupe accumulateKeyframeUpdates
            accumulatedUpdates[timelineName][haikuId][propertyName] = {}
          }

          if (!bytecode.timelines[timelineName][selector][propertyName]) {
            bytecode.timelines[timelineName][selector][propertyName] = {}
          }

          // We must ensure the zeroth keyframe exists since some elements may end up on stage
          // without a translation.x,y value explicitly set, and we need to offset those too.
          if (!bytecode.timelines[timelineName][selector][propertyName][0]) {
            bytecode.timelines[timelineName][selector][propertyName][0] = {}
          }

          for (const keyframeMs in bytecode.timelines[timelineName][selector][propertyName]) {
            const existingValue = bytecode.timelines[timelineName][selector][propertyName][keyframeMs].value || 0

            if (isNumeric(existingValue)) {
              const updatedValue = existingValue - offsetValue

              accumulatedUpdates[timelineName][haikuId][propertyName][keyframeMs] = { // dupe accumulateKeyframeUpdates
                value: updatedValue
              }
            }
          }
        }
      })
    }

    this.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {} // no-op
    )
  }

  rotate (dx, dy, coordsCurrent, coordsPrevious, lastMouseDownCoord, activationPoint) {
    // HACK: For now, disable multi-rotation until I figure out how to do it
    if (this.hasMultipleInSelection()) {
      return
    }

    const accumulatedUpdates = {}

    this.selection.forEach((element) => {
      const propertyGroupDelta = ElementSelectionProxy.computeRotationPropertyGroupDelta(
        element, // targetElement
        this, // contextElement
        dx,
        dy,
        coordsCurrent,
        coordsPrevious,
        lastMouseDownCoord,
        activationPoint
      )

      const propertyGroup = element.computePropertyGroupValueFromGroupDelta(propertyGroupDelta)

      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        propertyGroup
      )
    })

    this.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {} // no-op
    )
  }

  pasteClipsAndSelect (clips, metadata, cb) {
    logger.info(`[element selection proxy] paste ${this.getComponentIds().join('|')}`)
    const duplicates = []
    return async.eachSeries(clips, (clip, next) => {
      return this.component.pasteThing(clip, {}, metadata, (err, {haikuId}) => {
        if (err) return next(err)
        const duplicate = Element.findByComponentAndHaikuId(this.component, haikuId)
        duplicates.push(duplicate)
        return next()
      })
    }, (err) => {
      if (err) return cb(err)
      Element.unselectAllElements({component: this.component}, metadata)
      duplicates.forEach((duplicate) => { duplicate.selectSoftly(metadata) })
      const proxy = ElementSelectionProxy.fromSelection(duplicates, {component: this.component})
      return cb(null, proxy)
    })
  }

  duplicateAllAndSelectDuplicates (metadata, cb) {
    const clips = this.selection.map((element) => { return element.clip(metadata) })
    return this.pasteClipsAndSelect(clips, metadata, cb)
  }

  cut (metadata) {
    logger.info(`[element selection proxy] cut ${this.getComponentIds().join('|')}`)

    const pasteables = []

    this.selection.forEach((element) => {
      // Don't allow the artboard to be cut
      if (!element.isRootElement()) {
        pasteables.push(element.cut(metadata))
      }
    })

    ElementSelectionProxy.trackPasteables(pasteables)
  }

  copy (metadata) {
    logger.info(`[element selection proxy] copy ${this.getComponentIds().join('|')}`)

    const pasteables = []

    this.selection.forEach((element) => {
      // Don't allow the artboard to be copied
      if (!element.isRootElement()) {
        pasteables.push(element.copy(metadata))
      }
    })

    ElementSelectionProxy.trackPasteables(pasteables)
  }

  remove (metadata) {
    logger.info(`[element selection proxy] remove ${this.getComponentIds().join('|')}`)

    this.selection.forEach((element) => {
      // Don't allow the artboard to be deleted
      if (!element.isRootElement()) {
        element.remove(metadata)
      }
    })
  }

  getComponentIds () {
    return this.selection.map((element) => element.getComponentId())
  }

  /**
   * @method dump
   * @description When debugging, use this to log a concise shorthand of this entity.
   */
  dump () {
    return this.getPrimaryKey()
  }
}

ElementSelectionProxy.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    selection: true,
    component: true
  }
}

BaseModel.extend(ElementSelectionProxy)

ElementSelectionProxy.DEFAULT_PROPERTY_VALUES = {
  'translation.x': 0,
  'translation.y': 0,
  'translation.z': 0,
  'rotation.x': 0,
  'rotation.y': 0,
  'rotation.z': 0,
  'scale.x': 1,
  'scale.y': 1,
  'scale.z': 1,
  'origin.x': 0.5,
  'origin.y': 0.5,
  'origin.z': 0.5,
  'sizeAbsolute.x': 1, // Note that we compute this dynamically when proxying
  'sizeAbsolute.y': 1, // Note that we compute this dynamically when proxying
  'sizeAbsolute.z': 1
}

ElementSelectionProxy.activeAxesFromActivationPoint = (activationPoint) => {
  const activeAxes = [0, 0]

  // Based on the handle being moved, build input vector (ignore unchanged axis by leaving as 0 when moving edge control points)
  // note that SHIFT effectively turns on both axes as well, even when dragging from an edge control point
  if (
    activationPoint.shift ||
    activationPoint.index === 6 ||
    activationPoint.index === 3 ||
    activationPoint.index === 0 ||
    activationPoint.index === 2 ||
    activationPoint.index === 5 ||
    activationPoint.index === 8
  ) {
    activeAxes[0] = 1
  }

  if (activationPoint.shift ||
    activationPoint.index === 0 ||
    activationPoint.index === 1 ||
    activationPoint.index === 2 ||
    activationPoint.index === 6 ||
    activationPoint.index === 7 ||
    activationPoint.index === 8
  ) {
    activeAxes[1] = 1
  }

  return activeAxes
}

ElementSelectionProxy.sizeDeltaCoefficientFromActivationPoint = (activationPoint) => {
  return (activationPoint.alt ? 2 : 1)
}

ElementSelectionProxy.isActivationPointLeft = (activationPoint) => {
  return activationPoint.index === 6 || activationPoint.index === 3 || activationPoint.index === 0
}

ElementSelectionProxy.isActivationPointTop = (activationPoint) => {
  return activationPoint.index === 0 || activationPoint.index === 1 || activationPoint.index === 2
}

ElementSelectionProxy.isActivationPointBottom = (activationPoint) => {
  return activationPoint.index === 6 || activationPoint.index === 7 || activationPoint.index === 8
}

ElementSelectionProxy.isActivationPointRight = (activationPoint) => {
  return activationPoint.index === 2 || activationPoint.index === 5 || activationPoint.index === 8
}

ElementSelectionProxy.computeScaleInfoForArtboard = (
  targetElement,
  contextElement,
  dx,
  dy,
  coordsCurrent,
  coordsPrevious,
  lastMouseDownCoord,
  activationPoint,
  viewportTransform
) => {
  // The activation point index corresponds to a box with this coord system:
  // 0, 1, 2
  // 3, 4, 5
  // 6, 7, 8
  const activeAxes = ElementSelectionProxy.activeAxesFromActivationPoint(activationPoint)
  const isLeft = ElementSelectionProxy.isActivationPointLeft(activationPoint)
  const isTop = ElementSelectionProxy.isActivationPointTop(activationPoint)

  let dxFinal = dx
  let dyFinal = dy

  const x0 = coordsPrevious.clientX
  const x1 = coordsCurrent.clientX
  const y0 = coordsPrevious.clientY
  const y1 = coordsCurrent.clientY

  dxFinal = x1 - x0
  dyFinal = y1 - y0

  let worldDeltaX = dxFinal / viewportTransform.zoom
  let worldDeltaY = dyFinal / viewportTransform.zoom

  // Assigned below
  let proportionX = 1
  let proportionY = 1

  // If no parent, we are the artboard element and must via a different method
  const currentSize = {
    x: targetElement.computePropertyValue('sizeAbsolute.x'),
    y: targetElement.computePropertyValue('sizeAbsolute.y'),
    z: targetElement.computePropertyValue('sizeAbsolute.z') || 0
  }

  const finalSize = {
    width: currentSize.x + worldDeltaX * (isLeft ? -2 : 2) * activeAxes[0],
    height: currentSize.y + worldDeltaY * (isTop ? -2 : 2) * activeAxes[1]
  }

  // Note this logic is essentially duplicated below, for elements
  if (activationPoint.shift) {
    // Constrain proportion
    proportionX = finalSize.width / currentSize.x
    proportionY = finalSize.height / currentSize.y

    // This gnarly logic is just mixing EDGE constraining logic (index checks)
    // with CORNER constraining logic (proportion comparison)
    if (
      activationPoint.index !== 1 &&
      activationPoint.index !== 7 &&
      (
        Math.abs(1 - proportionX) < Math.abs(1 - proportionY) ||
        activationPoint.index === 3 ||
        activationPoint.index === 5
      )
    ) {
      finalSize.height = proportionX * currentSize.y
    } else {
      finalSize.width = proportionY * currentSize.x
    }
  }

  return {
    isLeft,
    isTop,
    deltaX: currentSize.x - finalSize.width,
    deltaY: currentSize.y - finalSize.height,
    finalSize: {
      'sizeAbsolute.y': {
        value: finalSize.height
      },
      'sizeAbsolute.x': {
        value: finalSize.width
      }
    }
  }
}

ElementSelectionProxy.computeScalePropertyGroupDelta = (
  targetElement,
  contextElement,
  dx,
  dy,
  coordsCurrent,
  coordsPrevious,
  lastMouseDownCoord,
  activationPoint,
  viewportTransform
) => {
  // The activation point index corresponds to a box with this coord system:
  // 0, 1, 2
  // 3, 4, 5
  // 6, 7, 8
  const activeAxes = ElementSelectionProxy.activeAxesFromActivationPoint(activationPoint)
  const sizeDeltaCoefficient = ElementSelectionProxy.sizeDeltaCoefficientFromActivationPoint(activationPoint)
  const isLeft = ElementSelectionProxy.isActivationPointLeft(activationPoint)
  const isTop = ElementSelectionProxy.isActivationPointTop(activationPoint)

  const dxFinal = dx
  const dyFinal = dy

  const worldDeltaX = dxFinal / viewportTransform.zoom
  const worldDeltaY = dyFinal / viewportTransform.zoom

  // Assigned below
  let proportionX
  let proportionY

  const targetWidth = targetElement.computePropertyValue('sizeAbsolute.x')
  const targetHeight = targetElement.computePropertyValue('sizeAbsolute.y')
  const targetScaleX = targetElement.computePropertyValue('scale.x')
  const targetScaleY = targetElement.computePropertyValue('scale.y')
  const targetAbsoluteWidth = targetScaleX * targetWidth
  const targetAbsoluteHeight = targetScaleY * targetHeight
  const targetThetaRadians = targetElement.computePropertyValue('rotation.z')

  let deltaX = worldDeltaX * Math.cos(targetThetaRadians) + worldDeltaY * Math.sin(targetThetaRadians)
  let deltaY = -worldDeltaX * Math.sin(targetThetaRadians) + worldDeltaY * Math.cos(targetThetaRadians)

  deltaX *= (isLeft ? -sizeDeltaCoefficient : sizeDeltaCoefficient)
  deltaY *= (isTop ? -sizeDeltaCoefficient : sizeDeltaCoefficient)

  // note this logic is essentially duplicated above, for artboards
  if (activationPoint.shift) {
    // constrain proportion
    proportionX = deltaX / targetAbsoluteWidth
    proportionY = deltaY / targetAbsoluteHeight
    // this gnarly logic is just mixing EDGE constraining logic (index checks)
    // with CORNER constraining logic (proportion comparison)
    if (
      activationPoint.index !== 1 &&
      activationPoint.index !== 7 && (
        Math.abs(proportionX) < Math.abs(proportionY) ||
        activationPoint.index === 3 ||
        activationPoint.index === 5
      )
    ) {
      deltaY = proportionX * targetAbsoluteHeight
    } else {
      deltaX = proportionY * targetAbsoluteWidth
    }
  }

  const deltaScaleVector = [
    (deltaX / (targetAbsoluteWidth / targetScaleX)) * activeAxes[0],
    (deltaY / (targetAbsoluteHeight / targetScaleY)) * activeAxes[1]
  ]

  const destinationScaleX = targetScaleX + deltaScaleVector[0]
  const destinationScaleY = targetScaleY + deltaScaleVector[1]

  const baseTranslationOffset = (activationPoint.alt)
    ? [0, 0]
    : [
      (isLeft ? -1 : 1) * (destinationScaleX - targetScaleX) * (targetWidth * 0.5),
      (isTop ? -1 : 1) * (destinationScaleY - targetScaleY) * (targetHeight * 0.5)
    ]

  const translationOffset = [
    baseTranslationOffset[0] * Math.cos(targetThetaRadians) - baseTranslationOffset[1] * Math.sin(targetThetaRadians),
    baseTranslationOffset[0] * Math.sin(targetThetaRadians) + baseTranslationOffset[1] * Math.cos(targetThetaRadians)
  ]

  const propertyGroup = {
    'scale.x': {
      value: deltaScaleVector[0]
    },
    'scale.y': {
      value: deltaScaleVector[1]
    },
    'translation.x': {
      value: translationOffset[0]
    },
    'translation.y': {
      value: translationOffset[1]
    }
  }

  return propertyGroup
}

ElementSelectionProxy.computeRotationPropertyGroupDelta = (
  targetElement,
  contextElement,
  dx,
  dy,
  coordsCurrent,
  coordsPrevious,
  lastMouseDownCoord,
  activationPoint
) => {
  // Calculate rotation delta based on old mouse position and new
  //  *(x0, y0)
  //  |          Ex.
  //  |        \ click+drag starts at x0,y0, ends at x1,y1
  // h|         v
  //  |(cx,cy)
  //  *-------------*(x1,y1)
  //  ^      w
  //  center of rotation

  const x0 = coordsPrevious.clientX
  const y0 = coordsPrevious.clientY
  const x1 = coordsCurrent.clientX
  const y1 = coordsCurrent.clientY

  // TODO: Compute the rect without reaching into the DOM
  const rect = targetElement.$el().getBoundingClientRect()

  // TODO: Replace 0.5 with the origin value
  const cx = rect.left + ((rect.right - rect.left) * 0.5)
  const cy = rect.top + ((rect.bottom - rect.top) * 0.5)

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

  // Last angle
  const w0 = x0 - cx
  const h0 = y0 - cy
  let theta0 = Math.atan2(w0, h0)

  // New angle
  const w1 = x1 - cx
  const h1 = y1 - cy
  let theta1 = Math.atan2(w1, h1)

  let deltaRotationZ = theta0 - theta1

  // If shift is held, snap to absolute increments of pi/12
  if (activationPoint.shift) {
    // Pretty hacky math/logic, won't allow for rotating past 2*Math.PI
    // (unlike free rotation, which will rotate to any limit)
    theta0 = targetElement.computePropertyValue('rotation.z')
    theta1 = -PI_OVER_12 * Math.round(theta1 / PI_OVER_12)
    deltaRotationZ = DELTA_ROTATION_OFFSETS[activationPoint.index] + theta1 - theta0
  }

  const propertyGroup = {
    'rotation.z': {
      value: deltaRotationZ
    }
  }

  return propertyGroup
}

ElementSelectionProxy.computeConstrainedMovePropertyGroup = (
  targetElement,
  contextElement,
  dx,
  dy,
  mouseCoordsCurrent,
  mouseCoordsPrevious,
  lastMouseDownCoord
) => {
  // If shift is held, should snap translation to x/y axis
  const contextTransform = contextElement.transformCache.peek('CONSTRAINED_DRAG')
  const elementTransform = targetElement.transformCache.peek('CONSTRAINED_DRAG')

  const initialTransform = {
    // If the user multi-selects too quckly the transform may not be available, hence the guard
    x: (elementTransform && elementTransform.translation[0]) || 0,
    y: (elementTransform && elementTransform.translation[1]) || 0
  }

  // We need to add our context transform to the element's individual transform value,
  // but only if we are in multi-select mode, i.e. if the context is not the target element.
  // If we don't do this, then as soon as constrained drag starts, the element within the
  // multi-selection will jump over to the side of the context (i.e., back to 0)
  if (contextElement !== targetElement) {
    initialTransform.x += ((contextTransform && contextTransform.translation[0]) || 0)
    initialTransform.y += ((contextTransform && contextTransform.translation[1]) || 0)
  }

  const artboard = contextElement.fetchActiveArtboard()

  const isXAxis = Math.abs(mouseCoordsCurrent.x - lastMouseDownCoord.x) > Math.abs(mouseCoordsCurrent.y - lastMouseDownCoord.y)

  const mouseDelta = {
    x: mouseCoordsCurrent.x - lastMouseDownCoord.x,
    y: mouseCoordsCurrent.y - lastMouseDownCoord.y
  }

  const mouseDeltaWorld = artboard.transformScreenToWorld(mouseDelta)

  const x = isXAxis ? initialTransform.x + mouseDeltaWorld.x : initialTransform.x
  const y = isXAxis ? initialTransform.y : initialTransform.y + mouseDeltaWorld.y

  return {
    'translation.x': {
      value: x
    },
    'translation.y': {
      value: y
    }
  }
}

/**
 * @function accumulateKeyframeUpdates
 */
ElementSelectionProxy.accumulateKeyframeUpdates = (
  out,
  componentId,
  timelineName,
  timelineTime,
  propertyGroup
) => {
  if (!out[timelineName]) {
    out[timelineName] = {}
  }

  if (!out[timelineName][componentId]) {
    out[timelineName][componentId] = {}
  }

  for (const propertyName in propertyGroup) {
    if (!out[timelineName][componentId][propertyName]) {
      out[timelineName][componentId][propertyName] = {}
    }

    out[timelineName][componentId][propertyName][timelineTime] = {
      value: propertyGroup[propertyName].value
    }
  }

  return out
}

ElementSelectionProxy.fromSelection = (selection, query) => {
  const uid = selection.map((element) => element.getPrimaryKey()).sort().join('+') || 'none'
  return ElementSelectionProxy.upsert(Object.assign({ uid, selection }, query))
}

const PASTEABLES = []

ElementSelectionProxy.trackPasteables = (pasteables) => {
  PASTEABLES.splice(0)
  PASTEABLES.push.apply(PASTEABLES, pasteables)
}

ElementSelectionProxy.getPasteables = () => {
  return PASTEABLES
}

module.exports = ElementSelectionProxy

// Down here to avoid Node circular dependency stub objects. #FIXME
const Element = require('./Element')
const Artboard = require('./Artboard')
const Template = require('./Template')
