const async = require('async')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')
const {rounded, transformFourVectorByMatrix} = require('./MathUtils')
const TransformCache = require('./TransformCache')
const Layout3D = require('@haiku/core/lib/Layout3D').default
const invertMatrix = require('@haiku/core/lib/vendor/gl-mat4/invert').default
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const Figma = require('./Figma')
const Sketch = require('./Sketch')

const PI_OVER_12 = Math.PI / 12

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
    this._proxyBoxPoints = []
    this._proxyProperties = {}
    const boxPoints = Element.getBoundingBoxPointsForElementsTransformed(this.selection)
    if (!boxPoints || boxPoints.length !== 9) {
      return
    }

    const xOffset = boxPoints[0].x
    const yOffset = boxPoints[0].y
    boxPoints.forEach(({x, y}) => {
      this._proxyBoxPoints.push({x: x - xOffset, y: y - yOffset, z: 0})
    })

    const width = Math.abs(boxPoints[0].x - boxPoints[8].x)
    const height = Math.abs(boxPoints[0].y - boxPoints[8].y)
    Object.assign(
      this._proxyProperties,
      ElementSelectionProxy.DEFAULT_PROPERTY_VALUES,
      {
        'sizeAbsolute.x': width,
        'sizeAbsolute.y': height,
        'translation.x': boxPoints[0].x + width * ElementSelectionProxy.DEFAULT_PROPERTY_VALUES['origin.x'],
        'translation.y': boxPoints[0].y + height * ElementSelectionProxy.DEFAULT_PROPERTY_VALUES['origin.y']
      }
    )

    this.initializeRotationSnap()
  }

  initializeRotationSnap () {
    this.rotationSnapOffset = null
    this.rotationSnapStrategy = null
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

  shouldUseChildLayout () {
    return this.doesManageSingleElement() && !this.selection[0].isRootElement()
  }

  canRotate () {
    return !this.doesSelectionContainArtboard()
  }

  canControlHandles () {
    return this.hasAnythingInSelection() && (
      this.doesManageSingleElement() || experimentIsEnabled(Experiment.AdvancedMultiTransform)
    )
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
    if (!this.selection) return
    if (!this.selection[0]) return
    const node = this.selection[0].getStaticTemplateNode()
    return (
      node &&
      node.attributes &&
      node.attributes['source']
    )
  }

  isSelectionSketchEditable () {
    const sourcePath = this.getSourcePath()
    return !!(
      sourcePath &&
      Sketch.isSketchFolder(sourcePath)
    )
  }

  getSketchAssetPath () {
    const sourcePath = this.getSourcePath()
    return (
      sourcePath &&
      sourcePath.split(/\.sketch\.contents/)[0].concat('.sketch')
    )
  }

  isSelectionFigmaEditable () {
    const sourcePath = this.getSourcePath()
    return !!(
      sourcePath &&
      Figma.isFigmaFolder(sourcePath)
    )
  }

  getFigmaAssetPath () {
    const sourcePath = this.getSourcePath()
    return (
      sourcePath &&
      sourcePath.split(/\.figma\.contents/)[0].concat('.figma')
    )
  }

  getFigmaAssetLink () {
    return Figma.buildFigmaLinkFromPath(this.getFigmaAssetPath())
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

  getParentComputedSize () {
    const { width, height } = this.component.getContextSize()
    return {
      x: width,
      y: height,
      z: 0
    }
  }

  getOriginTransformed () {
    return this.cacheFetch('getOriginTransformed', () => {
      // If managing only one element, use its own box points
      if (this.shouldUseChildLayout()) {
        return this.selection[0].getOriginTransformed()
      }

      const layout = this.getComputedLayout()
      return Element.transformPointInPlace(
        {
          x: layout.size.x * layout.origin.x,
          y: layout.size.y * layout.origin.y,
          z: layout.size.z * layout.origin.z
        },
        layout.matrix
      )
    })
  }

  getBoxPointsNotTransformed () {
    // Return a fresh copy each time.
    return this._proxyBoxPoints.map((point) => Object.assign({}, point))
  }

  getLayoutSpec () {
    if (this.shouldUseChildLayout()) {
      return this.selection[0].getLayoutSpec()
    }

    return {
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
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: this.computePropertyValue('rotation.z'),
        w: 0
      },
      scale: {
        x: this.computePropertyValue('scale.x'),
        y: this.computePropertyValue('scale.y'),
        z: 1
      },
      orientation: {x: 0, y: 0, z: 0, w: 0},
      sizeMode: {x: 1, y: 1, z: 1},
      sizeProportional: {x: 1, y: 1, z: 1},
      sizeDifferential: {x: 0, y: 0, z: 0},
      sizeAbsolute: {
        x: this.computePropertyValue('sizeAbsolute.x'),
        y: this.computePropertyValue('sizeAbsolute.y'),
        z: 0
      }
    }
  }

  getComputedLayout () {
    return this.cacheFetch('getComputedLayout', () => Layout3D.computeLayout(
      this.getLayoutSpec(),
      Layout3D.createMatrix(),
      this.getParentComputedSize()
    ))
  }

  getBoxPointsTransformed () {
    return this.cacheFetch('getBoxPointsTransformed', () => {
      // If managing only one element, use its own box points
      if (this.doesManageSingleElement()) {
        return this.selection[0].getBoxPointsTransformed()
      }

      return Element.transformPointsInPlace(
        this.getBoxPointsNotTransformed(),
        this.getComputedLayout().matrix
      )
    })
  }

  getControlsPosition (basisPointIndex, xOffset, yOffset) {
    return this.cacheFetch('getControlsPosition', () => {
      const layout = this.getComputedLayout()
      const orthonormalBasisMatrix = Layout3D.computeOrthonormalBasisMatrix(layout.rotation)
      const offset = {
        x: xOffset * Math.sign(layout.scale.x),
        y: yOffset * Math.sign(layout.scale.y),
        z: 0
      }
      Element.transformPointInPlace(offset, orthonormalBasisMatrix)
      const basisPoint = this.getBoxPointsTransformed()[basisPointIndex]

      return {
        x: basisPoint.x + offset.x,
        y: basisPoint.y + offset.y,
        z: basisPoint.z
      }
    })
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

  getElement () {
    return this.selection[0]
  }

  computePropertyValue (key) {
    return this._proxyProperties[key]
  }

  applyPropertyValue (key, value) {
    this._proxyProperties[key] = value
    this.cacheClear()
  }

  applyPropertyDelta (key, delta) {
    this.applyPropertyValue(key, this._proxyProperties[key] + delta)
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
    isOriginPanning,
    controlActivation,
    viewportTransform,
    globals
  ) {
    if (isOriginPanning) {
      return this.panOrigin(dx, dy)
    }

    if (this.canControlHandles()) {
      if (isAnythingScaling) {
        if (!controlActivation.cmd) {
          return this.scale(
            dx,
            dy,
            controlActivation,
            mouseCoordsCurrent,
            mouseCoordsPrevious,
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
            controlActivation
          )
        }
      }
    }

    // In case we got here, don't allow artboard to move
    if (this.doesSelectionContainArtboard()) {
      return
    }

    if (globals.isShiftKeyDown) {
      return this.moveWithShiftDown(
        dx,
        dy,
        mouseCoordsCurrent
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

  panOrigin (dx, dy) {
    // Origin panning is a position-preserving operation (in parent coordinates), requiring us to update translation to
    // match. To achieve the desired effect, first we compute the effective (x, y) translation after accounting for
    // z-rotation and scale, so the origin dot "lands" in an expected place while dragging.
    const targetElement = this.shouldUseChildLayout() ? this.selection[0] : this
    const computedLayout = targetElement.getComputedLayout()
    const deltaTranslationX = dx
    const deltaTranslationY = dy
    const delta = {
      x: deltaTranslationX,
      y: deltaTranslationY,
      z: 0
    }

    const scaledBasisMatrix = Layout3D.computeScaledBasisMatrix(computedLayout.rotation, computedLayout.scale)
    const scaledBasisMatrixInverted = []
    invertMatrix(scaledBasisMatrixInverted, scaledBasisMatrix)
    Element.transformPointInPlace(delta, scaledBasisMatrixInverted)
    const deltaOriginX = delta.x / computedLayout.size.x
    const deltaOriginY = delta.y / computedLayout.size.y

    if (targetElement === this) {
      this.applyPropertyDelta('translation.x', deltaTranslationX)
      this.applyPropertyDelta('translation.y', deltaTranslationY)
      this.applyPropertyDelta('origin.x', deltaOriginX)
      this.applyPropertyDelta('origin.y', deltaOriginY)
      return
    }

    const propertyGroupDelta = {
      'translation.x': {
        value: deltaTranslationX
      },
      'translation.y': {
        value: deltaTranslationY
      },
      'origin.x': {
        value: deltaOriginX
      },
      'origin.y': {
        value: deltaOriginY
      }
    }
    const propertyGroup = targetElement.computePropertyGroupValueFromGroupDelta(propertyGroupDelta)
    const accumulatedUpdates = {}
    ElementSelectionProxy.accumulateKeyframeUpdates(
      accumulatedUpdates,
      targetElement.getComponentId(),
      this.component.getCurrentTimelineName(),
      this.component.getCurrentTimelineTime(),
      propertyGroup
    )
    targetElement.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {
        this.cacheClear()
      }
    )
  }

  cacheClear () {
    if (this.hasAnythingInSelection()) {
      super.cacheClear()
      this.selection.forEach((element) => {
        element.cacheClear()
      })
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
    this.applyPropertyDelta('translation.x', dx)
    this.applyPropertyDelta('translation.y', dy)
  }

  moveWithShiftDown (dx, dy, mouseCoordsCurrent) {
    const accumulatedUpdates = {}

    const elementTransform = this.transformCache.peek('CONSTRAINED_DRAG')
    const initialTransform = {
      // If the user multi-selects too quickly the transform may not be available, hence the guard
      x: (elementTransform && elementTransform.translation[0]) || 0,
      y: (elementTransform && elementTransform.translation[1]) || 0
    }

    const isXAxis = Math.abs(mouseCoordsCurrent.x - initialTransform.x) >
      Math.abs(mouseCoordsCurrent.y - initialTransform.y)

    const constrainedDeltaX = isXAxis ? dx : initialTransform.x - this.computePropertyValue('translation.x')
    const constrainedDeltaY = isXAxis ? initialTransform.y - this.computePropertyValue('translation.y') : dy

    const propertyGroupDelta = {
      'translation.x': {
        value: constrainedDeltaX
      },
      'translation.y': {
        value: constrainedDeltaY
      }
    }

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
    this.applyPropertyDelta('translation.x', constrainedDeltaX)
    this.applyPropertyDelta('translation.y', constrainedDeltaY)
  }

  scale (
    dx,
    dy,
    activationPoint,
    mouseCoordsCurrent,
    mouseCoordsPrevious,
    viewportTransform
  ) {
    if (this.doesSelectionContainArtboard()) {
      return this.scaleArtboard(
        mouseCoordsCurrent,
        mouseCoordsPrevious,
        viewportTransform,
        activationPoint
      )
    }

    return this.scaleElements(
      dx,
      dy,
      activationPoint
    )
  }

  scaleElements (dx, dy, activationPoint) {
    const accumulatedUpdates = {}
    const proxyBoxPoints = this.getBoxPointsTransformed()
    const fixedPoint = activationPoint.alt
      ? this.getOriginTransformed()
      : ElementSelectionProxy.getFixedPointForScale(proxyBoxPoints, activationPoint)
    const translatedPoint = ElementSelectionProxy.getTranslatedPointForScale(proxyBoxPoints, activationPoint)

    const delta = {
      x: dx,
      y: dy,
      z: 0
    }

    if (this.hasMultipleInSelection()) {
      const {
        'scale.x': {
          value: scaleX
        },
        'scale.y': {
          value: scaleY
        },
        'translation.x': {
          value: translationX
        },
        'translation.y': {
          value: translationY
        }
      } = ElementSelectionProxy.computeScalePropertyGroup(
        this,
        fixedPoint,
        translatedPoint,
        delta,
        activationPoint,
        true
      )

      this.applyPropertyValue('scale.x', scaleX)
      this.applyPropertyValue('scale.y', scaleY)
      this.applyPropertyValue('translation.x', translationX)
      this.applyPropertyValue('translation.y', translationY)
    }

    this.selection.forEach((element) => {
      const propertyGroup = ElementSelectionProxy.computeScalePropertyGroup(
        element,
        fixedPoint,
        translatedPoint,
        delta,
        activationPoint,
        // If we manage a single element, we _should_ apply the shift/alt constraints in this pass (because we _didn't_
        // do so above).
        this.doesManageSingleElement()
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
      () => {
        this.cacheClear()
      }
    )
  }

  scaleArtboard (
    mouseCoordsCurrent,
    mouseCoordsPrevious,
    {zoom},
    activationPoint
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

    const dx = (mouseCoordsCurrent.clientX - mouseCoordsPrevious.clientX) * 2 / zoom
    const dy = (mouseCoordsCurrent.clientY - mouseCoordsPrevious.clientY) * 2 / zoom

    const {
      'scale.x': {
        value: scaleX
      },
      'scale.y': {
        value: scaleY
      },
      'translation.x': {
        value: translationX
      },
      'translation.y': {
        value: translationY
      }
    } = ElementSelectionProxy.computeScaleInfoForArtboard(
      element,
      dx,
      dy,
      activationPoint
    )

    const sizeX = element.computePropertyValue('sizeAbsolute.x')
    const sizeY = element.computePropertyValue('sizeAbsolute.y')
    const finalSize = {
      'sizeAbsolute.x': {
        value: rounded(scaleX * sizeX)
      },
      'sizeAbsolute.y': {
        value: rounded(scaleY * sizeY)
      }
    }

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
        'translation.x': translationX,
        'translation.y': translationY
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
      () => {
        this.cacheClear()
      }
    )
  }

  rotate (dx, dy, coordsCurrent, coordsPrevious, activationPoint) {
    const accumulatedUpdates = {}

    if (this.hasMultipleInSelection()) {
      const fixedPoint = this.getOriginTransformed()
      const {
        'rotation.z': {
          value: rotationZ
        }
      } = ElementSelectionProxy.computeRotationPropertyGroupDelta(
        this,
        this,
        coordsCurrent,
        coordsPrevious,
        activationPoint
      )

      this.applyPropertyDelta('rotation.z', rotationZ)
      this.selection.forEach((element) => {
        ElementSelectionProxy.accumulateKeyframeUpdates(
          accumulatedUpdates,
          element.getComponentId(),
          element.component.getCurrentTimelineName(),
          element.component.getCurrentTimelineTime(),
          ElementSelectionProxy.computeRotationPropertyGroup(
            element,
            rotationZ,
            fixedPoint
          )
        )
      })
    } else {
      const element = this.selection[0]
      const propertyGroupDelta = ElementSelectionProxy.computeRotationPropertyGroupDelta(
        element,
        this,
        coordsCurrent,
        coordsPrevious,
        activationPoint
      )
      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        element.computePropertyGroupValueFromGroupDelta(propertyGroupDelta)
      )
    }

    this.component.updateKeyframes(
      accumulatedUpdates,
      this.component.project.getMetadata(),
      () => {
        this.cacheClear()
      }
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
  'sizeAbsolute.x': 0,
  'sizeAbsolute.y': 0,
  'sizeAbsolute.z': 0
}

ElementSelectionProxy.activeAxesFromActivationPoint = (activationPoint) => {
  const activeAxes = new Uint8Array(2)

  // Shift (proportional scale) should always enable all axes.
  if (activationPoint.shift) {
    activeAxes[0] = activeAxes[1] = 1
    return activeAxes
  }

  // Based on the handle being moved, build input vector (ignore unchanged axis by leaving as 0 when moving edge control
  // points).

  // x-axis is only disabled at top and bottom edges.
  if (activationPoint.index !== 1 && activationPoint.index !== 7) {
    activeAxes[0] = 1
  }

  // y-axis is only disabled at left and right edges.
  if (activationPoint.index !== 3 && activationPoint.index !== 5) {
    activeAxes[1] = 1
  }

  return activeAxes
}

ElementSelectionProxy.sizeDeltaCoefficientFromActivationPoint = (activationPoint) => {
  return (activationPoint.alt ? 2 : 1)
}

ElementSelectionProxy.isActivationPointLeft = (activationPoint) => activationPoint.index % 3 === 0

ElementSelectionProxy.isActivationPointTop = (activationPoint) => activationPoint.index < 3

ElementSelectionProxy.computeScaleInfoForArtboard = (
  targetElement,
  dx,
  dy,
  activationPoint
) => {
  // Disable origin scaling, which does not really make sense in this context.
  activationPoint.alt = false
  const boxPoints = targetElement.getBoxPointsTransformed()
  return ElementSelectionProxy.computeScalePropertyGroup(
    targetElement,
    ElementSelectionProxy.getFixedPointForScale(boxPoints, activationPoint),
    ElementSelectionProxy.getTranslatedPointForScale(boxPoints, activationPoint),
    {
      x: dx,
      y: dy,
      z: 0
    },
    activationPoint,
    true
  )
}

ElementSelectionProxy.getFixedPointForScale = (proxyBoxPoints, activationPoint) => {
  switch (activationPoint.index) {
    case 5:
    case 7:
      return proxyBoxPoints[0]
    case 1:
      return proxyBoxPoints[6]
    case 3:
      return proxyBoxPoints[2]
    default:
      return proxyBoxPoints[8 - activationPoint.index]
  }
}

ElementSelectionProxy.getTranslatedPointForScale = (proxyBoxPoints, activationPoint) => {
  switch (activationPoint.index) {
    case 5:
    case 7:
      return proxyBoxPoints[8]
    case 1:
      return proxyBoxPoints[2]
    case 3:
      return proxyBoxPoints[6]
    default:
      return proxyBoxPoints[activationPoint.index]
  }
}

ElementSelectionProxy.computeScalePropertyGroup = (
  element,
  fixedPointIn,
  translatedPointIn,
  delta,
  activationPoint,
  applyConstraints
) => {
  // Make a copy of inbound points so we can transform them in place.
  const fixedPoint = Object.assign({}, fixedPointIn)
  const translatedPoint = Object.assign({}, translatedPointIn)
  // We compute the entire scale property group by fixing a point (the *temporary* transform origin) and translating a
  // point (the point being dragged). These are represented by `fixedPoint` and `translatedPoint` respectively.
  const targetLayout = element.getComputedLayout()
  // Opportunity to return early if we have a downstream "division by 0" problem. Scaling _from_ 0 is not supported (and
  // the UI should make it imposible.
  if (targetLayout.scale.x === 0 || targetLayout.scale.y === 0) {
    return {}
  }

  if (applyConstraints) {
    // The activation point index corresponds to a box with this coordinate system:
    // 0 1 2
    // 3   5
    // 6 7 8
    // In a group-scale context, we should only apply constraints based on the bounding container. Accordingly, we
    // transform `delta` in place here so it can be reused on child elements. First, translate to "local" coordinates so
    // so that these adjustments are meaningful and correct.
    const scaledBasisMatrix = Layout3D.computeScaledBasisMatrix(targetLayout.rotation, targetLayout.scale)
    const scaledBasisMatrixInverter = []
    invertMatrix(scaledBasisMatrixInverter, scaledBasisMatrix)
    Element.transformPointInPlace(delta, scaledBasisMatrixInverter)
    const activeAxes = ElementSelectionProxy.activeAxesFromActivationPoint(activationPoint)

    delta.x *= activeAxes[0]
    delta.y *= activeAxes[1]

    // If we are performing a proportional scale, it suffices to let the longer side "dominate" the shorter one.
    // Note that we are scale and rotation-normalized while carrying out this operation.
    if (activationPoint.shift) {
      // We encounter a "negative proportion" trigger whenever negative Δsx increases the size, while positive Δsy
      // decreases the size, or conversely. This is accordingly offset below.
      const negativeProportion = ElementSelectionProxy.isActivationPointLeft(activationPoint) ^
        ElementSelectionProxy.isActivationPointTop(activationPoint)
      // "Edge case", lulz: if we are scaling from a vertical edge, Δsx should _always_ dominate Δsy, even if the
      // transformed object is taller than it is wide.
      if (activationPoint.index === 3 || activationPoint.index === 5 ||
        (targetLayout.size.x > targetLayout.size.y && activationPoint.index !== 1 && activationPoint.index !== 7)
      ) {
        delta.y = delta.x * targetLayout.size.y / targetLayout.size.x
        if (negativeProportion) {
          delta.y *= -1
        }
      } else {
        delta.x = delta.y * targetLayout.size.x / targetLayout.size.y
        if (negativeProportion) {
          delta.x *= -1
        }
      }
    }

    Element.transformPointInPlace(delta, scaledBasisMatrix)
  }

  const layoutMatrix = targetLayout.matrix
  const layoutMatrixInverted = new Float32Array(16)
  invertMatrix(layoutMatrixInverted, layoutMatrix)
  Element.transformPointInPlace(fixedPoint, layoutMatrixInverted)
  Element.transformPointInPlace(translatedPoint, layoutMatrixInverted)

  // To save CPU cycles and rounding errors, armed with the knowledge that a set of four unique deltas in scale.x,
  // scale.y, translation.x, and translation.y will fix our "fixed point" and translate our "translated point" exactly
  // as intended (proof left to reader), we can "normalize" to the requested property group after solving a linear
  // equation in these four unknown deltas.
  //
  // This works because if we represent the original transformation matrix T as:
  // [ [0]   [4]     -   [12] ]
  // [ [1]   [5]     -   [13] ]
  // [   -     -     -      - ]
  // [   0     0     0      - ]
  //
  // With unknown scale and translation offsets Δsx, Δsy, Δtx, Δty we can obtain the corresponding transformation
  // matrix T', where sx, sy are the original scale.x and scale.y and ox, oy are the (unchanged) scaled origin.x and
  // origin.y:
  // [ [0] + [0]/sx * Δsx   [4] + [4]/sy * Δsy   _   [12] - [0]/sx * ox * Δsx - [4]/sy * oy * Δsy ]
  // [ [1] + [1]/sx * Δsx   [5] + [5]/sy * Δsy   _   [13] - [0]/sx * ox * Δsx - [5]/sy * oy * Δsy ]
  // [                  _                    _   _                                              _ ]
  // [                  0                    _   _                                              _ ]
  //
  // Our job is essentially to find Δsx, Δsy, Δtx, Δty such that:
  //  - T * fixedPoint = T' * fixedPoint
  //  - T * translatedPoint + <dx, dy> = T' * translatedPoint
  //
  // Using the notation above and cancelling terms, this boils down to the relatively simply system of linear equations,
  // where Fx, Fy represent the fixed point and Tx, Ty represent the translated point:
  // [ [0] * (Fx - ox) / sx   [4] * (Fy - oy) / sy   1   0 ]   [ Δsx ]   [ 0 ]
  // [ [1] * (Fx - ox) / sx   [5] * (Fy - oy) / sy   0   1 ] * [ Δsy ] = [ 0 ]
  // [ [0] * (Tx - ox) / sx   [4] * (Ty - oy) / sy   1   0 ]   [ Δtx ]   [ Δx ]
  // [ [1] * (Tx - ox) / sx   [5] * (Ty - oy) / sy   1   0 ]   [ Δty ]   [ Δy ]
  //
  // The result is quickly computed below.
  const originX = targetLayout.origin.x * targetLayout.size.x
  const originY = targetLayout.origin.y * targetLayout.size.y
  const coefficientMatrix = [
    layoutMatrix[0] * (fixedPoint.x - originX) / targetLayout.scale.x,
    layoutMatrix[1] * (fixedPoint.x - originX) / targetLayout.scale.x,
    layoutMatrix[0] * (translatedPoint.x - originX) / targetLayout.scale.x,
    layoutMatrix[1] * (translatedPoint.x - originX) / targetLayout.scale.x,

    layoutMatrix[4] * (fixedPoint.y - originY) / targetLayout.scale.y,
    layoutMatrix[5] * (fixedPoint.y - originY) / targetLayout.scale.y,
    layoutMatrix[4] * (translatedPoint.y - originY) / targetLayout.scale.y,
    layoutMatrix[5] * (translatedPoint.y - originY) / targetLayout.scale.y,
    1, 0, 1, 0,
    0, 1, 0, 1
  ]
  const coefficientMatrixInverted = new Float32Array(16)
  invertMatrix(coefficientMatrixInverted, coefficientMatrix)

  const propertyGroupInitialVector = [0, 0, delta.x, delta.y]

  const propertyGroupFinalVector = new Float32Array(4)
  transformFourVectorByMatrix(propertyGroupFinalVector, propertyGroupInitialVector, coefficientMatrixInverted)

  targetLayout.scale.x += propertyGroupFinalVector[0]
  targetLayout.scale.y += propertyGroupFinalVector[1]
  targetLayout.translation.x += propertyGroupFinalVector[2]
  targetLayout.translation.y += propertyGroupFinalVector[3]

  return {
    'scale.x': {
      value: rounded(targetLayout.scale.x)
    },
    'scale.y': {
      value: rounded(targetLayout.scale.y)
    },
    'translation.x': {
      value: rounded(targetLayout.translation.x)
    },
    'translation.y': {
      value: rounded(targetLayout.translation.y)
    }
  }
}

ElementSelectionProxy.computeRotationPropertyGroup = (element, rotationZDelta, fixedPoint) => {
  const targetLayout = element.getComputedLayout()
  const layoutMatrix = targetLayout.matrix
  const layoutMatrixInverted = new Float32Array(16)
  invertMatrix(layoutMatrixInverted, layoutMatrix)
  const fixedPointCopy = Object.assign({}, fixedPoint)
  Element.transformPointInPlace(fixedPointCopy, layoutMatrixInverted)
  targetLayout.rotation.z += rotationZDelta
  const {matrix: finalMatrix} = Layout3D.computeLayout(
    targetLayout, Layout3D.createMatrix(), element.getParentComputedSize())
  Element.transformPointInPlace(fixedPointCopy, finalMatrix)

  return {
    'translation.x': {
      value: rounded(targetLayout.translation.x + fixedPointCopy.x - fixedPoint.x)
    },
    'translation.y': {
      value: rounded(targetLayout.translation.y + fixedPointCopy.y - fixedPoint.y)
    },
    'rotation.z': {
      value: rounded(targetLayout.rotation.z)
    }
  }
}

ElementSelectionProxy.normalizeRotationDelta = (delta) => {
  if (Math.abs(delta) > Math.PI) {
    // If we have somehow flipped over an axis, normalize in [-π, π]. In realistic scenarios, we are actually
    // normalizing in [- π / 64, π / 64] or so.
    return delta - 2 * Math.PI * Math.sign(delta)
  }

  return delta
}

ElementSelectionProxy.computeRotationPropertyGroupDelta = (
  targetElement,
  contextElement,
  coordsCurrent,
  coordsPrevious,
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

  const x0 = coordsPrevious.x
  const y0 = coordsPrevious.y
  const x1 = coordsCurrent.x
  const y1 = coordsCurrent.y

  const {x: cx, y: cy} = targetElement.getOriginTransformed()

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

  // New angle
  const theta1 = Math.atan2(cy - y1, cx - x1)
  // Last angle
  const theta0 = Math.atan2(cy - y0, cx - x0)
  const delta = ElementSelectionProxy.normalizeRotationDelta(theta1 - theta0)

  // If shift is held, snap to absolute increments of π / 12.
  if (activationPoint.shift) {
    const originalRotation = targetElement.computePropertyValue('rotation.z')
    if (!contextElement.rotationSnapOffset) {
      // Look at the directionality of the original requested rotation and round up/down according to the apparent wish
      // of the user. We need to stick with this strategy for as long as snapping rotation is active to avoid confusion
      // and/or judders.
      contextElement.rotationSnapStrategy = delta > 0 ? Math.ceil : Math.floor
      const originalRotationRounded = PI_OVER_12 * contextElement.rotationSnapStrategy(originalRotation / PI_OVER_12)
      contextElement.rotationSnapOffset = PI_OVER_12 * contextElement.rotationSnapStrategy(theta1 / PI_OVER_12)
      return {
        'rotation.z': {
          value: originalRotationRounded - originalRotation
        }
      }
    }

    const theta1Rounded = PI_OVER_12 * contextElement.rotationSnapStrategy(theta1 / PI_OVER_12)
    const effectiveDelta = theta1Rounded - contextElement.rotationSnapOffset
    if (effectiveDelta !== 0) {
      contextElement.rotationSnapOffset = theta1Rounded
    }
    return {
      'rotation.z': {
        value: effectiveDelta
      }
    }
  } else {
    // Reset rotation snap in case it comes back!
    contextElement.initializeRotationSnap()
  }

  return {
    'rotation.z': {
      value: rounded(delta)
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
  return ElementSelectionProxy.findById(uid) || ElementSelectionProxy.upsert(Object.assign({ uid, selection }, query))
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
const Template = require('./Template')
