const path = require('path')
const logger = require('./../utils/LoggerInstance')
const BaseModel = require('./BaseModel')
const {rounded, transformFourVectorByMatrix} = require('./MathUtils')
const TransformCache = require('./TransformCache')
const {default: Layout3D} = require('@haiku/core/lib/Layout3D')
const {default: HaikuElement} = require('@haiku/core/lib/HaikuElement')
const {default: composedTransformsToTimelineProperties} = require('@haiku/core/lib/helpers/composedTransformsToTimelineProperties')
const {default: invertMatrix} = require('@haiku/core/lib/vendor/gl-mat4/invert')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const {Figma} = require('./Figma')
const Sketch = require('./Sketch')
const Illustrator = require('./Illustrator')

const PI_OVER_12 = Math.PI / 12

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n)

const forceNumeric = (n) => (isNaN(n) || !isFinite(n)) ? 0 : n

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'

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

    // When representing multiple elements, we apply changes to our proxy properties
    this.reinitializeLayout()

    // Allows transforms to be recalled on demand, e.g. during Alt+drag
    this.transformCache = new TransformCache(this)

    this.initializeRotationSnap()
  }

  reinitializeLayout () {
    this._proxyBoxPoints = []
    this._proxyProperties = {}
    Object.assign(this._proxyProperties, ElementSelectionProxy.DEFAULT_PROPERTY_VALUES)

    if (!this.hasAnythingInSelection()) {
      return
    }

    // After ungrouping, the live rendered node of the <group> won't be available,
    // thus no boinding points to compute, thus we should early return.
    const elements = this.selection.filter((element) => !!element.getLiveRenderedNode())
    if (elements.length < 1) {
      return
    }

    const boxPoints = HaikuElement.getBoundingBoxPoints(
      elements.map((element) => element.getBoxPointsTransformed()).reduce((accumulator, boxPoints) => {
        accumulator.push(...boxPoints)
        return accumulator
      }, [])
    )

    const xOffset = boxPoints[0].x
    const yOffset = boxPoints[0].y
    boxPoints.forEach(({x, y}) => {
      this._proxyBoxPoints.push({x: x - xOffset, y: y - yOffset, z: 0})
    })

    const width = Math.abs(boxPoints[0].x - boxPoints[8].x)
    const height = Math.abs(boxPoints[0].y - boxPoints[8].y)
    Object.assign(
      this._proxyProperties,
      {
        'sizeAbsolute.x': width,
        'sizeAbsolute.y': height,
        'translation.x': boxPoints[0].x + width * ElementSelectionProxy.DEFAULT_PROPERTY_VALUES['origin.x'],
        'translation.y': boxPoints[0].y + height * ElementSelectionProxy.DEFAULT_PROPERTY_VALUES['origin.y']
      }
    )
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

  hasNothingInSelection () {
    return !this.hasAnythingInSelection()
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
    return this.selection.length > 0
  }

  isSingleComponentSelected () {
    return this.selection.length === 1 &&
      this.selection[0] &&
      this.selection[0].isComponent()
  }

  canEditComponentFromSelection () {
    return this.isSingleComponentSelected() && this.selection[0].isLocalComponent()
  }

  getSourcePath () {
    if (!this.selection) return
    if (!this.selection[0]) return
    const node = this.selection[0].getStaticTemplateNode()
    return (
      node &&
      node.attributes &&
      node.attributes[HAIKU_SOURCE_ATTRIBUTE]
    )
  }

  isSelectionFinderOpenable () {
    const sourcePath = this.getSourcePath()
    if (!sourcePath) return false
  }

  getAbspath () {
    const folder = this.component.project.getFolder()
    if (this.isSelectionSketchEditable()) {
      return path.join(folder, this.getSourcePath(), '..', '..')
    }
    if (this.canEditComponentFromSelection()) {
      const sourcePath = this.getSourcePath()
      const componentFolder = this.component.getSceneCodeFolder()
      const targetPath = path.resolve(componentFolder, sourcePath)
      return path.dirname(targetPath)
    }
    return folder
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

  isSelectionIllustratorEditable () {
    const sourcePath = this.getSourcePath()
    return !!(
      sourcePath &&
      Illustrator.isIllustratorFolder(sourcePath)
    )
  }

  getIllustratorAssetPath () {
    const sourcePath = this.getSourcePath()
    return (
      sourcePath &&
      sourcePath.split(/\.ai\.contents/)[0].concat('.ai')
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
    if (!this.hasAnythingInSelection()) {
      return
    }

    const componentIds = this.selection.map((element) => {
      return element.getComponentId()
    })

    // Re-normalize scale to 1 to simplify the upcoming math, but give our incoming group the same origin and rotation
    // as its ElementSelectionProxy. This allows us to keep visual continuity between onstage transforms before and
    // after grouping.
    this.reset()
    const computedLayout = this.getComputedLayout()
    const attributes = {
      width: computedLayout.size.x,
      height: computedLayout.size.y,
      [HAIKU_SOURCE_ATTRIBUTE]: '<group>',
      [HAIKU_TITLE_ATTRIBUTE]: this.component.nextSuggestedGroupName,
      'origin.x': computedLayout.origin.x,
      'origin.y': computedLayout.origin.y,
      'rotation.z': computedLayout.rotation.z
    }

    // The new top-level object that will host the groupees. We can use the top-left box point of the selection proxy to
    // determine the correct translation offset of a new, non-virtual bounding box. To avoid recalculating the layouts
    // of inner elements, we wrap an additional inner div providing orientation/position offsets. Instantiation of this
    // mana in bytecode will transcribe these explicit transforms into the declarative layout system.
    const boxPoint = this.getBoxPointsTransformed()[0]

    // This shim layout has the effect of first reversing our rotation, then translating the top-left box point up to
    // (0, 0) in the parent coordinate system. In 2D, we're basically producing this matrix:
    // [ 1 0 -x ]   [ cos(-z)  -sin(-z)  0 ]
    // [ 0 1 -y ] * [ sin(-z)   cos(-z)  0 ]
    // [ 0 0  1 ]   [       0         0  1 ]
    const shimLayout = Layout3D.createLayoutSpec()
    shimLayout.rotation.z = -computedLayout.rotation.z
    shimLayout.origin = computedLayout.origin
    const ignoredSize = {x: 0, y: 0, z: 0}
    const shimMatrix = Layout3D.computeMatrix(shimLayout, computedLayout.size, ignoredSize)
    shimMatrix[12] = -(boxPoint.x * shimMatrix[0] + boxPoint.y * shimMatrix[4])
    shimMatrix[13] = -(boxPoint.x * shimMatrix[1] + boxPoint.y * shimMatrix[5])
    const groupMana = {
      elementName: 'div',
      attributes,
      children: [{
        elementName: 'div',
        attributes: {
          transform: `matrix3d(${shimMatrix.join(',')})`,
          'origin.x': 0,
          'origin.y': 0,
          style: {
            pointerEvents: 'none'
          },
          children: []
        }
      }]
    }

    return this.component.groupElements(
      componentIds,
      groupMana,
      // The ElementSelectionProxy origin is the correct `coords` for the new group, since we kept the origin used
      // during on-stage transformation.
      this.getOriginTransformed(),
      metadata,
      () => {}
    )
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
    return this.selection[0].ungroup(metadata)
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
    return this.selection[0]
  }

  getSingleComponentElementRelpath () {
    return this.selection[0].getAttribute(HAIKU_SOURCE_ATTRIBUTE)
  }

  getParentComputedSize () {
    const { width, height } = this.component.getContextSize()
    return {
      x: width,
      y: height,
      z: 0
    }
  }

  getConglomerateTranslation () {
    const points = this.getBoundingBoxPoints()
    return points[0]
  }

  getConglomerateSize () {
    const points = this.getBoundingBoxPoints()
    return {
      x: points[2].x - points[0].x,
      y: points[6].y - points[0].y
    }
  }

  getBoundingBoxPoints () {
    return HaikuElement.getBoundingBoxPoints(
      this.selection.map((element) => element.getBoxPointsTransformed()).reduce((accumulator, boxPoints) => {
        accumulator.push(...boxPoints)
        return accumulator
      }, [])
    )
  }

  getOriginTransformed () {
    return this.cache.fetch('getOriginTransformed', () => {
      // If managing only one element, use its own box points
      if (this.shouldUseChildLayout()) {
        return this.selection[0].getOriginTransformed()
      }

      const layout = this.getComputedLayout()
      return HaikuElement.transformPointInPlace(
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
      shear: {
        xy: 0,
        xz: 0,
        yz: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: this.computePropertyValue('rotation.z')
      },
      scale: {
        x: this.computePropertyValue('scale.x'),
        y: this.computePropertyValue('scale.y'),
        z: 1
      },
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

  isAutoSizeX () {
    if (this.hasNothingInSelection() || this.hasMultipleInSelection()) {
      return false
    }

    return this.selection[0].isAutoSizeX()
  }

  isAutoSizeY () {
    if (this.hasNothingInSelection() || this.hasMultipleInSelection()) {
      return false
    }

    return this.selection[0].isAutoSizeY()
  }

  getComputedLayout () {
    return this.cache.fetch('getComputedLayout', () => HaikuElement.computeLayout(
      {layout: this.getLayoutSpec()}, // targetNode
      this.getParentComputedSize()
    ))
  }

  getBoxPointsTransformed () {
    return this.cache.fetch('getBoxPointsTransformed', () => {
      // If managing only one element, use its own box points
      if (this.doesManageSingleElement()) {
        return this.selection[0].getBoxPointsTransformed()
      }

      return HaikuElement.transformPointsInPlace(
        this.getBoxPointsNotTransformed(),
        this.getComputedLayout().matrix
      )
    })
  }

  getControlsPosition (basisPointIndex, xOffset, yOffset) {
    return this.cache.fetch('getControlsPosition', () => {
      const layout = this.getComputedLayout()
      const orthonormalBasisMatrix = Layout3D.computeOrthonormalBasisMatrix(layout.rotation, layout.shear)
      const offset = {
        x: xOffset * Math.sign(layout.scale.x),
        y: yOffset * Math.sign(layout.scale.y),
        z: 0
      }
      HaikuElement.transformPointInPlace(offset, orthonormalBasisMatrix)
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
    return HaikuElement.getRectFromPoints(points)
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
    this.clearAllRelatedCaches()
  }

  applyPropertyDelta (key, delta) {
    this.applyPropertyValue(key, this._proxyProperties[key] + delta)
  }

  reset () {
    const layout = this.getComputedLayout()
    this.applyPropertyValue('sizeAbsolute.x', Math.abs(layout.size.x * layout.scale.x))
    this.applyPropertyValue('sizeAbsolute.y', Math.abs(layout.size.y * layout.scale.y))
    this.applyPropertyValue('scale.x', 1)
    this.applyPropertyValue('scale.y', 1)
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

    // We don't want to mutate around with z origin or translation when we have a 3D rotated object, so it's simpler to
    // start with the scaled basis matrix S and solve directly:
    //   S * [ deltaX; deltaY; 0, 1] = [ dx, dy, ?, 1 ]
    // We don't particularly care what the value of `?` is here, so this resolves to a system of linear equations in two
    // unknowns:
    //   [ S[0] S[4] ] [ deltaX ] = [ dx ]
    //   [ S[1] S[5] ] [ deltaY ]   [ dy ]
    // We can solve this directly.
    const targetElement = this.shouldUseChildLayout() ? this.selection[0] : this
    const computedLayout = targetElement.getComputedLayout()
    const scaledBasisMatrix = Layout3D.computeScaledBasisMatrix(computedLayout.rotation, computedLayout.scale, computedLayout.shear)
    const determinant = scaledBasisMatrix[0] * scaledBasisMatrix[5] - scaledBasisMatrix[1] * scaledBasisMatrix[4]
    const deltaX = (scaledBasisMatrix[5] * dx - scaledBasisMatrix[4] * dy) / determinant
    const deltaY = (-scaledBasisMatrix[1] * dx + scaledBasisMatrix[0] * dy) / determinant
    const deltaOriginX = rounded(forceNumeric(deltaX / computedLayout.size.x))
    const deltaOriginY = rounded(forceNumeric(deltaY / computedLayout.size.y))
    const {matrix: layoutMatrix} = computedLayout
    const deltaTranslationX = layoutMatrix[0] * deltaX + layoutMatrix[4] * deltaY
    const deltaTranslationY = layoutMatrix[1] * deltaX + layoutMatrix[5] * deltaY

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
      {},
      this.component.project.getMetadata(),
      () => {
        this.clearAllRelatedCaches()
      }
    )
  }

  clearAllRelatedCaches () {
    if (this.hasAnythingInSelection()) {
      this.cache.clear()

      this.selection.forEach((element) => {
        element.cache.clear()
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
      {},
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
      x: (elementTransform && elementTransform.translation.x) || 0,
      y: (elementTransform && elementTransform.translation.y) || 0
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
      {},
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
      const cachedTransform = this.transformCache.peek('CONTROL_ACTIVATION')
      if (!cachedTransform) {
        return
      }
      const matrixBeforeInverted = new Float32Array(16)
      invertMatrix(matrixBeforeInverted, cachedTransform.matrix)

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
      const matrixAfter = this.getComputedLayout().matrix
      this.selection.forEach((element) => {
        // Use our cached transform to mitigate the possibility of rounding errors at small/weird scales.
        const layoutSpec = element.transformCache.peek('CONTROL_ACTIVATION')
        if (!layoutSpec) {
          return
        }
        const propertyGroup = {}
        const finalMatrix = Layout3D.multiplyArrayOfMatrices([
          layoutSpec.originOffsetComposedMatrix,
          matrixBeforeInverted,
          matrixAfter
        ])
        composedTransformsToTimelineProperties(propertyGroup, [finalMatrix], true)
        const alignX = layoutSpec.align.x * layoutSpec.size.x
        const alignY = layoutSpec.align.y * layoutSpec.size.y
        const alignZ = layoutSpec.align.z * layoutSpec.size.z
        const mountPointX = layoutSpec.mount.x * layoutSpec.size.x
        const mountPointY = layoutSpec.mount.y * layoutSpec.size.y
        const mountPointZ = layoutSpec.mount.z * layoutSpec.size.z
        const originX = layoutSpec.origin.x * layoutSpec.size.x
        const originY = layoutSpec.origin.y * layoutSpec.size.y
        const originZ = layoutSpec.origin.z * layoutSpec.size.z
        propertyGroup['translation.x'] +=
          finalMatrix[0] * originX + finalMatrix[4] * originY + finalMatrix[8] * originZ + mountPointX - alignX
        propertyGroup['translation.y'] +=
          finalMatrix[1] * originX + finalMatrix[5] * originY + finalMatrix[9] * originZ + mountPointY - alignY
        propertyGroup['translation.z'] +=
          finalMatrix[2] * originX + finalMatrix[6] * originY + finalMatrix[10] * originZ + mountPointZ - alignZ
        ElementSelectionProxy.accumulateKeyframeUpdates(
          accumulatedUpdates,
          element.getComponentId(),
          element.component.getCurrentTimelineName(),
          element.component.getCurrentTimelineTime(),
          Object.keys(propertyGroup).reduce((accumulator, property) => {
            accumulator[property] = { value: propertyGroup[property] }
            return accumulator
          }, {})
        )
      })
    } else {
      const element = this.selection[0]
      const propertyGroup = ElementSelectionProxy.computeScalePropertyGroup(
        element,
        fixedPoint,
        translatedPoint,
        delta,
        activationPoint,
        // If we manage a single element, we _should_ apply the shift/alt constraints in this pass (because we _didn't_
        // do so above).
        true
      )

      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        propertyGroup
      )
    }

    this.component.updateKeyframes(
      accumulatedUpdates,
      {},
      this.component.project.getMetadata(),
      () => {
        this.clearAllRelatedCaches()
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

    let sizeX = element.computePropertyValue('sizeAbsolute.x')
    let sizeY = element.computePropertyValue('sizeAbsolute.y')

    // If the artboard has "auto"-size designated, then resizing it has the effect of
    // switching it to numeric sizing. But in order for that to work, we first need to
    // compute the numeric size and then switch to it.
    if (typeof sizeX !== 'number' || typeof sizeY !== 'number') {
      const computedSize = element.getComputedSize()
      if (typeof sizeX !== 'number') {
        sizeX = computedSize.x
      }
      if (typeof sizeY !== 'number') {
        sizeY = computedSize.y
      }
    }

    const didSizeX = scaleX > 1.000001 || scaleX < 0.999999
    const didSizeY = scaleY > 1.000001 || scaleY < 0.999999

    if (!didSizeX && !didSizeY) {
      return
    }

    const finalSize = {}

    // We don't want to overwrite "auto"-size unless the axis was actually changed numerically
    if (didSizeX) {
      finalSize['sizeAbsolute.x'] = {
        value: rounded(scaleX * sizeX)
      }
    }
    if (didSizeY) {
      finalSize['sizeAbsolute.y'] = {
        value: rounded(scaleY * sizeY)
      }
    }

    // Don't allow the user to reduce the artboard's scale to nothing
    if (
      (finalSize['sizeAbsolute.x'] && finalSize['sizeAbsolute.x'].value < 5) ||
      (finalSize['sizeAbsolute.y'] && finalSize['sizeAbsolute.y'].value < 5)
    ) {
      return
    }

    ElementSelectionProxy.accumulateKeyframeUpdates(
      accumulatedUpdates,
      element.getComponentId(),
      timelineName,
      timelineTime,
      finalSize
    )

    const elementOffset = {}

    // We shouldn't bother translating elements if there was no offet along the given axis
    if (didSizeX) {
      elementOffset['translation.x'] = translationX
    }
    if (didSizeY) {
      elementOffset['translation.y'] = translationY
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

    this.component.updateKeyframes(
      accumulatedUpdates,
      {},
      this.component.project.getMetadata(),
      () => {
        this.clearAllRelatedCaches()
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
      {},
      this.component.project.getMetadata(),
      () => {
        this.clearAllRelatedCaches()
      }
    )
  }

  pasteClipsAndSelect (clips, metadata, cb) {
    logger.info(`[element selection proxy] paste ${this.getComponentIds().join('|')}`)
    this.component.pasteThings(clips, {}, metadata, (err, {haikuIds}) => {
      if (err) return cb(err)
      Element.unselectAllElements({component: this.component}, metadata)
      console.log(haikuIds)
      haikuIds.map(
        (haikuId) => this.component.findElementByComponentId(haikuId)
      ).forEach((element) => {
        if (element) {
          element.selectSoftly(metadata)
        }
      })
      return cb(null)
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
        pasteables.push(element.copy())
      }
    })

    ElementSelectionProxy.trackPasteables(pasteables)
    this.remove(metadata)
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

    const componentIdsToRemove = this.selection.filter(
      (element) => !element.isRootElement()
    ).map(
      (element) => element.getComponentId()
    )

    this.component.deleteComponents(
      componentIdsToRemove,
      metadata,
      () => {}
    )
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

  // Prevent zero scale because matrix multiplication will lock the scale to zero permanently while interacting.
  if (targetLayout.scale.x === 0) targetLayout.scale.x = 0.0001
  if (targetLayout.scale.y === 0) targetLayout.scale.y = 0.0001

  if (applyConstraints) {
    // The activation point index corresponds to a box with this coordinate system:
    // 0 1 2
    // 3   5
    // 6 7 8
    // In a group-scale context, we should only apply constraints based on the bounding container. Accordingly, we
    // transform `delta` in place here so it can be reused on child elements. First, translate to "local" coordinates so
    // so that these adjustments are meaningful and correct.
    const scaledBasisMatrix = Layout3D.computeScaledBasisMatrix(targetLayout.rotation, targetLayout.scale, targetLayout.shear)
    const scaledBasisMatrixInverted = new Float32Array(16)
    invertMatrix(scaledBasisMatrixInverted, scaledBasisMatrix)
    HaikuElement.transformPointInPlace(delta, scaledBasisMatrixInverted)
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

    HaikuElement.transformPointInPlace(delta, scaledBasisMatrix)
  }

  const layoutMatrix = targetLayout.matrix
  const layoutMatrixInverted = new Float32Array(16)
  invertMatrix(layoutMatrixInverted, layoutMatrix)
  HaikuElement.transformPointInPlace(fixedPoint, layoutMatrixInverted)
  HaikuElement.transformPointInPlace(translatedPoint, layoutMatrixInverted)

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
  // Given a known rotation delta, we can directly compute the new property group for a subelement of a selection.
  //       target origin (x1, y1)
  //      /|
  //     /
  //    /
  //   /
  //  /
  // /dz
  // context origin (x0, y0)
  // It suffices to rotate the ray <x1 - x0, y1 - y0> about the origin and then renormalize in context coordinates.

  // First build a simple rotation matrix to hold the rotation by `rotationZDelta`. (We could do this directly but
  // prefer to use the layout system for consistent rounding etc.)
  const layout = Layout3D.createLayoutSpec()
  layout.rotation.z = rotationZDelta
  const ignoredSize = {x: 0, y: 0, z: 0}
  const matrix = Layout3D.computeMatrix(layout, ignoredSize, ignoredSize)

  // Next build the vector from `fixedPoint` to `targetOrigin` and rotate it.
  const targetOrigin = element.getOriginTransformed()
  const ray = {
    x: targetOrigin.x - fixedPoint.x,
    y: targetOrigin.y - fixedPoint.y,
    z: targetOrigin.z - fixedPoint.z
  }
  HaikuElement.transformPointInPlace(ray, matrix)

  const layoutSpec = element.getLayoutSpec()
  const originalRotationMatrix = Layout3D.computeOrthonormalBasisMatrix(layoutSpec.rotation, layoutSpec.shear)
  if (layoutSpec.mount.x !== 0 || layoutSpec.mount.y !== 0) {
    ray.x += layoutSpec.mount.x * layoutSpec.sizeAbsolute.x
    ray.y += layoutSpec.mount.y * layoutSpec.sizeAbsolute.y
  }
  const attributes = {}
  composedTransformsToTimelineProperties(attributes, [matrix, originalRotationMatrix])

  // Return directly after offsetting translation by the `fixedPoint`'s coordinates. Note that we are choosing _not_ to
  // change the z-translation, effectively projecting the origin of rotation from the context element onto the z = C
  // plane, where C is the z-translation of the target origin. This is a natural expectation of multi-rotation.
  return Object.keys(attributes).reduce(
    (accumulator, key) => {
      accumulator[key] = {value: attributes[key]}
      return accumulator
    },
    {
      'translation.x': {
        value: rounded(fixedPoint.x + ray.x)
      },
      'translation.y': {
        value: rounded(fixedPoint.y + ray.y)
      },
      'translation.z': {
        value: rounded(fixedPoint.z + ray.z)
      }
    }
  )
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
        value: ElementSelectionProxy.normalizeRotationDelta(effectiveDelta)
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
