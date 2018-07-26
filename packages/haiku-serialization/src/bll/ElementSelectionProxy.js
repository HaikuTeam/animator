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
const _ = require('lodash')

const PI_OVER_12 = Math.PI / 12

const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n)

const forceNumeric = (n) => (isNaN(n) || !isFinite(n)) ? 0 : n

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'
const SNAP_THRESHOLD = 10 // px, world-space (i.e. will get bigger/smaller with zoom)
const SNAP_EPSILON = 0.025

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

    const elements = this.selection.filter((element) => !!element.getLiveRenderedNode())

    // After ungrouping, the live rendered node of the <group> won't be available,
    // thus no bounding points to compute, thus we should early return.
    if (elements.length < 1) {
      return
    }

    // If we're dealing with just a single element, we need to to use its points and
    // layout spec directly so that the transform control box fits to its actual shape.
    if (elements.length === 1) {
      // It's assumed that this list of points is *not* transformed here but downstream
      // as the return value of this.getBoxPointsTransformed
      this._proxyBoxPoints = elements[0].getBoundingBoxPoints().map((p) => p)

      Object.assign(
        this._proxyProperties,
        Property.layoutSpecAsProperties(elements[0].getLayoutSpec()),
        {
          'sizeAbsolute.x': Math.abs(this._proxyBoxPoints[0].x - this._proxyBoxPoints[8].x),
          'sizeAbsolute.y': Math.abs(this._proxyBoxPoints[0].y - this._proxyBoxPoints[8].y)
        }
      )

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

  // very similar to pushCachedTransform, but does it for all selected elements,
  // doesn't keep a stack, and only tracks origins rather than full transforms
  cacheOrigins () {
    this._originCache = this.selection.map((elem) => {
      return elem.getOriginTransformed()
    })
    this._originCache.groupOrigin = this.getOriginTransformed()
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
    const shimMatrix = Layout3D.computeMatrix(shimLayout, computedLayout.size)
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

  getSingleComponentElement () {
    return this.selection[0]
  }

  getSingleComponentElementRelpath () {
    return this.selection[0].getAttribute(HAIKU_SOURCE_ATTRIBUTE)
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

  // returns the box points of the base element, without transform applied
  getBoxPointsCompletelyNotTransformed () {
    const layout = this.getComputedLayout()
    const w = layout.size.x
    const h = layout.size.y
    return [
      {x: 0, y: 0, z: 0}, {x: w / 2, y: 0, z: 0}, {x: w, y: 0, z: 0},
      {x: 0, y: h / 2, z: 0}, {x: w / 2, y: h / 2, z: 0}, {x: w, y: h / 2, z: 0},
      {x: 0, y: h, z: 0}, {x: w / 2, y: h, z: 0}, {x: w, y: h, z: 0}
    ]
  }

  getLayoutSpec () {
    // Important: in the case we're we have a single element selected, we ensure correctness of the box placement
    // by applying all the properties affecting layout.
    return {
      shown: true,
      opacity: 1.0,
      sizeMode: {x: 1, y: 1, z: 1},
      sizeProportional: {x: 1, y: 1, z: 1},
      sizeDifferential: {x: 0, y: 0, z: 0},
      offset: {
        x: this.computePropertyValue('offset.x'),
        y: this.computePropertyValue('offset.y'),
        z: this.computePropertyValue('offset.z')
      },
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
      shear: {
        xy: this.computePropertyValue('shear.xy'),
        xz: this.computePropertyValue('shear.xz'),
        yz: this.computePropertyValue('shear.yz')
      },
      rotation: {
        x: this.computePropertyValue('rotation.x'),
        y: this.computePropertyValue('rotation.y'),
        z: this.computePropertyValue('rotation.z')
      },
      scale: {
        x: this.computePropertyValue('scale.x'),
        y: this.computePropertyValue('scale.y'),
        z: 1
      },
      sizeAbsolute: {
        x: this.computePropertyValue('sizeAbsolute.x'),
        y: this.computePropertyValue('sizeAbsolute.y'),
        z: this.computePropertyValue('sizeAbsolute.z')
      }
    }
  }

  isAutoSizeX () {
    if (this.hasNothingInSelection() || this.hasMultipleInSelection()) {
      return false
    }

    // When displaying transform control lines, indicate the mode of the wrapee not wrapper
    if (this.selection[0].isComponent()) {
      const wrapper = this.selection[0].getHaikuElement()
      const component = wrapper && wrapper.children && wrapper.children[0]
      if (component) {
        return typeof component.sizeAbsolute.x !== 'number'
      }
    }

    return this.selection[0].isAutoSizeX()
  }

  isAutoSizeY () {
    if (this.hasNothingInSelection() || this.hasMultipleInSelection()) {
      return false
    }

    // When displaying transform control lines, indicate the mode of the wrapee not wrapper
    if (this.selection[0].isComponent()) {
      const wrapper = this.selection[0].getHaikuElement()
      const component = wrapper && wrapper.children && wrapper.children[0]
      if (component) {
        return typeof component.sizeAbsolute.y !== 'number'
      }
    }

    return this.selection[0].isAutoSizeY()
  }

  getComputedLayout () {
    return this.cache.fetch('getComputedLayout', () => {
      const {width, height} = this.component.getContextSize()

      let bounds = {
        left: null,
        top: null,
        right: null,
        bottom: null,
        front: null,
        back: null
      }

      if (this.doesManageSingleElement() && !this.doesSelectionContainArtboard()) {
        bounds = this.selection[0].parent.getHaikuElement().computeContentBounds()
      }

      return HaikuElement.computeLayout(
        { // targetNode
          layout: this.getLayoutSpec()
        },
        { // parentNode
          layout: {
            computed: {
              bounds,
              matrix: Layout3D.createMatrix(),
              size: {
                x: width,
                y: height,
                z: 0
              }
            }
          }
        }
      )
    })
  }

  getBoxPointsTransformed () {
    return this.cache.fetch('getBoxPointsTransformed', () => {
      const points = this._proxyBoxPoints.map((point) => Object.assign({}, point))
      return HaikuElement.transformPointsInPlace(points, this.getComputedLayout().matrix)
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

    let left, right, top, bottom, width, height
    if (!points || !points.length) {
      // It seems that sometimes proxy is given an empty set of elements to drag (?)
      // so `getBoxPointsTransformed` sensibly returns an empty array.
      // Unfortunately, that crashes the UI.
      // This provides a stub, non-UI-breaking bbox.
      left = -21
      right = -20
      top = -21
      bottom = -20
      width = 1
      height = 1
    } else {
      left = Math.min(points[0].x, points[2].x, points[6].x, points[8].x)
      right = Math.max(points[0].x, points[2].x, points[6].x, points[8].x)
      top = Math.min(points[0].y, points[2].y, points[6].y, points[8].y)
      bottom = Math.max(points[0].y, points[2].y, points[6].y, points[8].y)
      width = Math.abs(left - right)
      height = Math.abs(bottom - top)
    }

    return {
      left,
      right,
      top,
      bottom,
      width,
      height
    }
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

  handleMouseDown (mousePosition) {
    this._shouldCaptureMousePosition = true
  }

  handleMouseUp (mousePosition) {
    // no-op for now; 'lifecycle' event stub
  }

  // this is used specifically for the CMD key (though it is not explicitly filtered here.)
  // if we don't "recapture" mouse position when CMD is released, the element will unexpectedly
  // jolt back to its original position pre-drag.
  handleKeyUp () {
    this._shouldCaptureMousePosition = true
  }

  // snapDefinitions are the element-side 'snap points' (lines)
  // snapLines are the stage-side 'snap points' (lines)
  // note that snapLines will generally include snapDefinitions, so there's a filter step at the beginning
  findSnapsMatchesAndBreakTies (snapDefinitions, snapLines) {
    let horizWinners = []
    let vertWinners = []
    let winningDeltaHoriz
    let winningDeltaVert
    snapLines.forEach((snap) => {
      // don't snap to this element's own bounding snaplines
      let ids = this.getComponentIds()
      if (ids.indexOf(snap.elementId) !== -1) {
        return
      }

      snapDefinitions.forEach((def) => {
        if (snap.direction === def.direction &&
          def.bboxEdgePosition > snap.positionWorld - SNAP_THRESHOLD &&
          def.bboxEdgePosition < snap.positionWorld + SNAP_THRESHOLD) {
          let delta = Math.abs(def.bboxEdgePosition - snap.positionWorld)

          if (snap.direction === 'HORIZONTAL' && (winningDeltaHoriz === undefined || delta < winningDeltaHoriz + SNAP_EPSILON)) {
            winningDeltaHoriz = Math.min(delta, winningDeltaHoriz) || delta

            let newWinner = {
              direction: def.direction,
              positionWorld: snap.positionWorld,
              bboxEdgePosition: def.bboxEdgePosition,
              metadata: Object.assign({}, def.metadata, snap.metadata)
            }
            for (let i = 0; i < horizWinners.length; i++) {
              let oldWinner = horizWinners[i]
              let oldWinningDelta = Math.abs(oldWinner.bboxEdgePosition - oldWinner.positionWorld)
              if (winningDeltaHoriz + SNAP_EPSILON < oldWinningDelta) {
                horizWinners.splice(i, 1)
                i--
              }
            }
            horizWinners.push(newWinner)
          } else if (snap.direction === 'VERTICAL' && (winningDeltaVert === undefined || delta < winningDeltaVert + SNAP_EPSILON)) {
            winningDeltaVert = Math.min(delta, winningDeltaVert) || delta
            let newWinner = {
              direction: def.direction,
              positionWorld: snap.positionWorld,
              bboxEdgePosition: def.bboxEdgePosition,
              metadata: Object.assign({}, def.metadata, snap.metadata)
            }
            for (let j = 0; j < vertWinners.length; j++) {
              let oldWinner = vertWinners[j]
              let oldWinningDelta = Math.abs(oldWinner.bboxEdgePosition - oldWinner.positionWorld)
              if (winningDeltaVert + SNAP_EPSILON < oldWinningDelta) {
                vertWinners.splice(j, 1)
                j--
              }
            }
            vertWinners.push(newWinner)
          }
        }
      })
    })
    return [].concat(horizWinners, vertWinners)
  }

  getBboxValueFromEdgeValue (
    bbox,
    xEdge,
    yEdge
  ) {
    if (xEdge !== undefined) {
      if (xEdge === 0) {
        return bbox.left
      } else if (xEdge === 0.5) {
        return bbox.left + (bbox.width / 2)
      } else if (xEdge === 1) {
        return bbox.right
      } else {
        throw new Error('Unknown edge value', xEdge)
      }
    } else {
      if (yEdge === 0) {
        return bbox.top
      } else if (yEdge === 0.5) {
        return bbox.top + (bbox.height / 2)
      } else if (yEdge === 1) {
        return bbox.bottom
      } else {
        throw new Error('Unknown edge value', yEdge)
      }
    }
  }

  // Aligns selected elements along the x or y axis, either to selection bbox or to stage bbox
  // xEdge ∈ {undefined, 0, .5, .1}
  // yEdge ∈ {undefined, 0, .5, .1}
  // toStage ∈ {true, falsy}
  align (
    xEdge,
    yEdge,
    toStage
  ) {
    if (!this.selection || !this.selection.length) {
      return
    }

    let alignBbox = {}
    if (toStage) {
      let artboard = this.component.getArtboard()
      alignBbox = {
        top: 0,
        left: 0,
        right: artboard._mountWidth,
        bottom: artboard._mountHeight,
        width: artboard._mountWidth,
        height: artboard._mountHeight
      }
    } else {
      alignBbox = this.getBoundingClientRect()
    }

    let edge = (xEdge !== undefined) ? xEdge : yEdge
    let axis = (xEdge !== undefined) ? 'x' : 'y'
    let targetValue = (axis === 'x' ? this.getBboxValueFromEdgeValue(alignBbox, edge, undefined) : this.getBboxValueFromEdgeValue(alignBbox, undefined, edge))
    let origins = this.selection.map((elem) => {
      return elem.getOriginTransformed()
    })
    let overrides = []

    for (var i = 0; i < this.selection.length; i++) {
      let bbox = this.selection[i].getBoundingClientRect()
      let bboxEdgePosition = (axis === 'x' ? this.getBboxValueFromEdgeValue(bbox, edge, undefined) : this.getBboxValueFromEdgeValue(bbox, undefined, edge))
      overrides[i] = overrides[i] || {}
      overrides[i][axis] = targetValue - (bboxEdgePosition - origins[i][axis])
    }
    this.move(0, 0, overrides)
    this.reinitializeLayout()
  }

  // Distributes selected elements over the x or y axis, either to selection bbox or to stage bbox
  // xEdge ∈ {undefined, 0, .5, .1}
  // yEdge ∈ {undefined, 0, .5, .1}
  // toStage ∈ {true, falsy}
  distribute (
    xEdge,
    yEdge,
    toStage
  ) {
    if (!this.selection) {
      return
    }

    if (!toStage && this.selection.length < 2) {
      return
    }

    let axis = (xEdge !== undefined) ? 'x' : 'y'

    // First, we'll sort the elements by the appropriate bounding edge, tracking
    // relevant data along the way
    this.selection.forEach((elem, i) => {
      let points = elem.getBoxPointsTransformed()
      let bbox = {
        top: Math.min.apply(this, points.map((p) => { return p.y })),
        right: Math.max.apply(this, points.map((p) => { return p.x })),
        bottom: Math.max.apply(this, points.map((p) => { return p.y })),
        left: Math.min.apply(this, points.map((p) => { return p.x }))
      }
      bbox.width = bbox.right - bbox.left
      bbox.height = bbox.bottom - bbox.top

      elem._distributeBbox = bbox
      elem._distributeOriginalIndex = i
      elem._distributeBoundingEdge = (axis === 'x' ? this.getBboxValueFromEdgeValue(elem._distributeBbox, xEdge, undefined) : this.getBboxValueFromEdgeValue(elem._distributeBbox, undefined, yEdge))
    })

    // Execute the sort
    const elementsSortedByBoundingEdge = _.cloneDeep(this.selection).sort((elemA, elemB) => {
      return elemA._distributeBoundingEdge - elemB._distributeBoundingEdge
    })

    // Calculate & populate overrides
    let overrides = []
    let count = elementsSortedByBoundingEdge.length
    let origins = this.selection.map((elem) => {
      return elem.getOriginTransformed()
    })

    let min = elementsSortedByBoundingEdge[0]._distributeBoundingEdge
    let max = elementsSortedByBoundingEdge[count - 1]._distributeBoundingEdge

    // Stage has special boundaries
    if (toStage) {
      let artboard = this.component.getArtboard()
      if (axis === 'x') {
        min = (this.getBboxValueFromEdgeValue(elementsSortedByBoundingEdge[0]._distributeBbox, xEdge, undefined) - elementsSortedByBoundingEdge[0]._distributeBbox.left)// origins[elementsSortedByBoundingEdge[0]._distributeOriginalIndex][axis] - elementsSortedByBoundingEdge[0]._distributeBbox.left
        max = artboard._mountWidth - (elementsSortedByBoundingEdge[count - 1]._distributeBbox.right - this.getBboxValueFromEdgeValue(elementsSortedByBoundingEdge[count - 1]._distributeBbox, xEdge, undefined))
      } else {
        min = (this.getBboxValueFromEdgeValue(elementsSortedByBoundingEdge[0]._distributeBbox, undefined, yEdge) - elementsSortedByBoundingEdge[0]._distributeBbox.top)
        max = artboard._mountHeight - (elementsSortedByBoundingEdge[count - 1]._distributeBbox.bottom - this.getBboxValueFromEdgeValue(elementsSortedByBoundingEdge[count - 1]._distributeBbox, undefined, yEdge))
      }
    }

    let interval = (max - min) / (count - 1)

    elementsSortedByBoundingEdge.forEach((elem, i) => {
      let origIndex = elem._distributeOriginalIndex
      let targetValue = min + (interval * i)
      overrides[origIndex] = overrides[origIndex] || {}
      overrides[origIndex][axis] = targetValue - (elem._distributeBoundingEdge - origins[origIndex][axis])
    })

    this.move(0, 0, overrides)
    this.reinitializeLayout()
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
    // 'mousetrap' for snapping
    if (this._shouldCaptureMousePosition || this._lastMouseDownPosition === undefined) {
      this._lastMouseDownPosition = mouseCoordsCurrent
      this._lastBbox = this.getBoundingClientRect()
      this._lastProxyBox = this.getBoxPointsTransformed()
      this._lastOrigin = this.getOriginTransformed()
      this._baseBoxPointsNotTransformed = this.getBoxPointsCompletelyNotTransformed()
      this._lastOrigins = this.selection.map((elem) => {
        return elem.getOriginTransformed()
      })
      this._shouldCaptureMousePosition = false
    }

    // track mouse positions, offsets, and original bounding boxes for snapping
    let totalDragDelta = {
      x: mouseCoordsCurrent.x - this._lastMouseDownPosition.x,
      y: mouseCoordsCurrent.y - this._lastMouseDownPosition.y
    }

    if (isOriginPanning) {
      return this.panOrigin(dx, dy)
    }

    if (this.canControlHandles()) {
      if (isAnythingScaling) {
        if (!controlActivation.cmd) {
          // TODO: add snapping
          return this.scale(
            dx,
            dy,
            controlActivation,
            mouseCoordsCurrent,
            mouseCoordsPrevious,
            viewportTransform,
            globals
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
            controlActivation,
            globals
          )
        }
      }
    }

    // In case we got here, don't allow artboard to move
    if (this.doesSelectionContainArtboard()) {
      return
    }

    let artboard = this.component.getArtboard()

    // handle snapping
    // don't snap if user is holding cmd key (like Sketch)
    if (!globals.isCommandKeyDown && experimentIsEnabled(Experiment.Snapping)) {
      let bbox
      if (this._lastBbox !== undefined) {
        bbox = ((bbox, delta) => {
          const ret = {}
          ret.top = bbox.top + delta.y
          ret.right = bbox.right + delta.x
          ret.bottom = bbox.bottom + delta.y
          ret.left = bbox.left + delta.x
          ret.height = ret.bottom - ret.top
          ret.width = ret.right - ret.left
          return ret
        })(this._lastBbox, totalDragDelta)
      } else {
        bbox = this.getBoundingClientRect()
      }

      // TODO:
      //  - handle snapping for origin
      //  - perf pass on snapping?
      //     - perf could filter only snaps within viewport
      //     - perf could check snap lines and bounding box edges using bounding volumes,
      //       instead of checking every element linearly+

      // Snapline {
      //  direction : "HORIZONTAL"|"VERTICAL"
      //  position : Number
      //  positionWorld : Number
      //  elementId : (Number | String) (?)
      // }
      const snapLines = artboard.getSnapLinesInScreenCoords()

      const addVectors = (v0, v1) => {
        return {
          x: v0.x + v1.x,
          y: v0.y + v1.y
        }
      }

      // index corresponds with selected elements' indicies
        // { x : number
        //  y : number }
      let overrides = []

      let origin = addVectors(this._lastOrigin, totalDragDelta)
      let origins = this._lastOrigins.map((o) => {
        return addVectors(o, totalDragDelta)
      })

      origins.groupOrigin = origin

      // note that 'name' is really only used for readability & debugging
      const SNAP_DEFINITIONS = [
        {
          name: 'TOP',
          direction: 'HORIZONTAL',
          bboxEdgePosition: bbox.top
        },
        {
          name: 'RIGHT',
          direction: 'VERTICAL',
          bboxEdgePosition: bbox.right
        },
        {
          name: 'BOTTOM',
          direction: 'HORIZONTAL',
          bboxEdgePosition: bbox.bottom
        },
        {
          name: 'LEFT',
          direction: 'VERTICAL',
          bboxEdgePosition: bbox.left
        },
        {
          name: 'VERTICAL_MID',
          direction: 'VERTICAL',
          bboxEdgePosition: (bbox.right + bbox.left) / 2
        },
        {
          name: 'HORIZONTAL_MID',
          direction: 'HORIZONTAL',
          bboxEdgePosition: (bbox.bottom + bbox.top) / 2
        }
      ]
      let foundSnaps = this.findSnapsMatchesAndBreakTies(SNAP_DEFINITIONS, snapLines)

      // Shift-dragging affects which axis we want to snap on
      // and can use the same `overrides` mechanism
      if (globals.isShiftKeyDown) {
        const isXAxis = Math.abs(mouseCoordsCurrent.x - this._originCache.groupOrigin.x) >
          Math.abs(mouseCoordsCurrent.y - this._originCache.groupOrigin.y)

        // only snap to the relevant axis
        if (isXAxis) {
          foundSnaps = foundSnaps.filter((snap) => { return snap.direction === 'VERTICAL' })
          for (let i = 0; i < this.selection.length; i++) {
            overrides[i] = overrides[i] || {}
            overrides[i].y = this._originCache[i].y
            overrides.groupOrigin = overrides.groupOrigin || {}
            overrides.groupOrigin.y = this._originCache.groupOrigin.y
          }
        } else {
          foundSnaps = foundSnaps.filter((snap) => { return snap.direction === 'HORIZONTAL' })
          for (let j = 0; j < this.selection.length; j++) {
            overrides[j] = overrides[j] || {}
            overrides[j].x = this._originCache[j].x
            overrides.groupOrigin = overrides.groupOrigin || {}
            overrides.groupOrigin.x = this._originCache.groupOrigin.x
          }
        }
      }

      foundSnaps.forEach((snap) => {
        let whichAxis = (snap.direction === 'HORIZONTAL' ? 'y' : 'x')
        let desiredPosition = snap.positionWorld
        this.selection.forEach((elem, i) => {
          overrides[i] = overrides[i] || {}
          overrides[i][whichAxis] = desiredPosition - (snap.bboxEdgePosition - origins[i][whichAxis])
        })
        overrides.groupOrigin = overrides.groupOrigin || {}
        overrides.groupOrigin[whichAxis] = desiredPosition - (snap.bboxEdgePosition - origins.groupOrigin[whichAxis])
      })

      this.emit('snaps-updated', foundSnaps)
      return this.move(dx, dy, overrides)
    }

    return this.move(dx, dy)
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
    const targetElement = this
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

  // overrides allow per-element absolute position overrides, useful for snapping
  move (dx, dy, overrides) {
    const propertyGroupDelta = {
      'translation.x': {
        value: dx
      },
      'translation.y': {
        value: dy
      }
    }

    const accumulatedUpdates = {}

    this.selection.forEach((element, i) => {
      const layoutSpec = element.getLayoutSpec()
      const propertyGroup = element.computePropertyGroupValueFromGroupDelta(propertyGroupDelta)
      if (overrides && overrides[i] && overrides[i].x !== undefined) {
        propertyGroup['translation.x'] = {value: overrides[i].x - layoutSpec.offset.x}
      }
      if (overrides && overrides[i] && overrides[i].y !== undefined) {
        propertyGroup['translation.y'] = {value: overrides[i].y - layoutSpec.offset.y}
      }

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
    if (overrides && overrides.groupOrigin && overrides.groupOrigin.x) {
      this.applyPropertyValue('translation.x', overrides.groupOrigin.x - this.computePropertyValue('offset.x'))
    } else {
      this.applyPropertyDelta('translation.x', dx)
    }

    if (overrides && overrides.groupOrigin && overrides.groupOrigin.y) {
      this.applyPropertyValue('translation.y', overrides.groupOrigin.y - this.computePropertyValue('offset.y'))
    } else {
      this.applyPropertyDelta('translation.y', dy)
    }
  }

  getActivationPointInRadians (index) {
    switch (index) {
      case 5: return Math.PI * 2
      case 8: return Math.PI / 4
      case 7: return Math.PI / 2
      case 6: return 3 * Math.PI / 4
      case 3: return Math.PI
      case 0: return 5 * Math.PI / 4
      case 1: return 3 * Math.PI / 2
      case 2: return 7 * Math.PI / 4
      default:
        throw new Error('Cannot retrieve radian value for provided activation point: ' + index)
    }
  }

  scale (
    dx,
    dy,
    activationPoint,
    mouseCoordsCurrent,
    mouseCoordsPrevious,
    viewportTransform,
    globals
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
      mouseCoordsCurrent,
      mouseCoordsPrevious,
      activationPoint,
      globals
    )
  }

  translateBoxPointsManual (boxPoints, delta) {
    return boxPoints.map((point) => {
      return {
        x: point.x + delta.x,
        y: point.y + delta.y
      }
    })
  }

  scaleElements (mouseCoordsCurrent, mouseCoordsPrevious, activationPoint, globals) {
    const foundSnaps = []

    const accumulatedUpdates = {}

    const baseProxyBox = Object.assign({}, this._lastProxyBox)

    // note an Object.assign({}, ...) doesn't suffice here because computeScalePropertyGroup mutates properties deeply
    const getBaseTransform = () => _.cloneDeep(this.transformCache.peek('CONTROL_ACTIVATION'))

    const baseTransform = getBaseTransform()

    const fixedPoint = activationPoint.alt
      ? this._lastOrigin
      : ElementSelectionProxy.getFixedPointForScale(baseProxyBox, activationPoint)

    let translatedPoint = ElementSelectionProxy.getTranslatedPointForScale(baseProxyBox, activationPoint)

    const totalMouseDelta = {
      x: mouseCoordsCurrent.x - this._lastMouseDownPosition.x,
      y: mouseCoordsCurrent.y - this._lastMouseDownPosition.y,
      z: 0
    }

    let scalePropertyGroup = ElementSelectionProxy.computeScalePropertyGroup(
      baseTransform,
      fixedPoint,
      translatedPoint,
      totalMouseDelta,
      activationPoint,
      true
    )

    let updatedLayout = getBaseTransform()
    updatedLayout.scale.x = scalePropertyGroup['scale.x'].value
    updatedLayout.scale.y = scalePropertyGroup['scale.y'].value
    updatedLayout.translation.x = scalePropertyGroup['translation.x'].value
    updatedLayout.translation.y = scalePropertyGroup['translation.y'].value
    let transformedPoints = _.cloneDeep(this._baseBoxPointsNotTransformed)
    ElementSelectionProxy.transformPointsByLayoutInPlace(transformedPoints, updatedLayout)
    // find axis-aligned bounding box; add each edge
    let axisAlignedBbox = [
      {name: 'TOP', value: Math.min.apply(this, transformedPoints.map((p) => { return p.y }))},
      {name: 'RIGHT', value: Math.max.apply(this, transformedPoints.map((p) => { return p.x }))},
      {name: 'BOTTOM', value: Math.max.apply(this, transformedPoints.map((p) => { return p.y }))},
      {name: 'LEFT', value: Math.min.apply(this, transformedPoints.map((p) => { return p.x }))}
    ]

    const transformedTranslatedPoint = transformedPoints[activationPoint.index]

    const filteredEdges = []

    const isWithinEpsilon = (v0, v1, override) => {
      return (v0 < v1 + (override || SNAP_EPSILON)) && (v0 > v1 - (override || SNAP_EPSILON))
    }

    // When scaling, we want to snap to the axis-aligned bounding box of the control points, a.k.a. the "super-bounding box."
    // To complicate things though, the user expects only some of the edges of the bounding box to snap, depending on
    // which control point is being dragged and the rotation of the element.  The logic below simplifies this 'lookup'
    // based on observations of how the translated point and fixed point intersect with the axis-aligned bbox.
    let isDraggingEdge = false

    if (activationPoint.alt) {
      // TODO:  when alt is held, we care about all bounding edges
      // BUT, the 'unusual' edges need to give a proper offset
      // for now, disable snapping when alt-scaling
    } else if (activationPoint.shift) {
      // TODO:  when shift is held, break ties between horiz & vert (could refactor findSnapsMatchesAndBreakTies to handle based on flag, or could do a post-pass manually)
      // for now, disable snapping when shift-scaling
    } else if ([1, 3, 5, 7].indexOf(activationPoint.index) > -1) {
      // When dragging an edge, check if the translated point is touching a bbox edge.  if it is,
      // we care ONLY about that edge.  If it's not, we care about the bbox edges that its two neighbor (corners) are touching.
      for (const edge of axisAlignedBbox) {
        const isHoriz = (edge.name === 'TOP' || edge.name === 'BOTTOM')
        if (
          (isHoriz && isWithinEpsilon(transformedTranslatedPoint.y, edge.value, 10)) ||
          (!isHoriz && isWithinEpsilon(transformedTranslatedPoint.x, edge.value, 10))
        ) {
          filteredEdges.push(edge)
          break
        }
      }
      if (filteredEdges.length === 0) {
        // get neighbor points and find the edges they're touching
        isDraggingEdge = true
        const transformedNeighborPoints = ElementSelectionProxy.getNeighborPointsForScaleSnapping(transformedPoints, activationPoint)
        filteredEdges.push(...axisAlignedBbox.filter((edge) => {
          const isHoriz = (edge.name === 'TOP' || edge.name === 'BOTTOM')
          if (isHoriz && (isWithinEpsilon(transformedNeighborPoints[0].y, edge.value) || isWithinEpsilon(transformedNeighborPoints[1].y, edge.value))) return true
          if (!isHoriz && (isWithinEpsilon(transformedNeighborPoints[0].x, edge.value) || isWithinEpsilon(transformedNeighborPoints[1].x, edge.value))) return true
          return false
        }))
      }
    } else {
      // TODO: Level up; when dragging a corner, we can handle adjacent corners by the following:
      // - We don't want to snap to any edges that the fixed point is touching
      // - Non 'active' corners (the ones that can still snap) have to provide an offset to the final
      //   delta-x and delta-y, as there's a trig relationship between active point's positionX and non-active-point's positionY

      // let transformedFixedPoint = activationPoint.alt
      //    ? this._lastOrigin
      //    : ElementSelectionProxy.getFixedPointForScale(transformedPoints, activationPoint)
      //
      // filteredEdges = axisAlignedBbox.filter((edge) => {
      //   const isHoriz = (edge.name === 'TOP' || edge.name === 'BOTTOM')
      //   if(isHoriz && isWithinEpsilon(transformedFixedPoint.y, edge.value)) return false
      //   if(!isHoriz && isWithinEpsilon(transformedFixedPoint.x, edge.value)) return false
      //   return true
      // })

      // Instead of the above, when dragging a corner, we only want to snap to the edge(s) that the translatedPoint is touching
      filteredEdges.push(...axisAlignedBbox.filter((edge) => {
        const isHoriz = (edge.name === 'TOP' || edge.name === 'BOTTOM')
        if (isHoriz && isWithinEpsilon(transformedTranslatedPoint.y, edge.value, 1)) return true
        if (!isHoriz && isWithinEpsilon(transformedTranslatedPoint.x, edge.value, 1)) return true
        return false
      }))
    }

    const snapDefinitions = filteredEdges.map((edge) => {
      const isHoriz = (edge.name === 'TOP' || edge.name === 'BOTTOM')
      return {
        name: edge.name,
        direction: isHoriz ? 'HORIZONTAL' : 'VERTICAL',
        bboxEdgePosition: edge.value,
        metadata: {
          offset: edge.value - transformedTranslatedPoint[isHoriz ? 'y' : 'x'],
          isDraggingEdge
        }
      }
    })

    const artboard = this.component.getArtboard()
    foundSnaps.push(...this.findSnapsMatchesAndBreakTies(snapDefinitions, artboard.getSnapLinesInScreenCoords()))
    foundSnaps.forEach((snap) => {
      if (snap.direction === 'HORIZONTAL') {
        totalMouseDelta.y = (snap.positionWorld - (snap.metadata.offset || 0)) - (this._lastProxyBox[activationPoint.index].y)
        if (snap.metadata && snap.metadata.isDraggingEdge) {
          // we know one of the deltas but must solve for the other based on our knowledge of the current
          // rotation & the transform controls' absolute rotations.
          let offsetRotation = this.getActivationPointInRadians(activationPoint.index)
          let transformRotation = updatedLayout.rotation.z
          let theta = (((offsetRotation + transformRotation) * 10000) % 62832) / 10000 // 'mod' by 2*pi
          totalMouseDelta.x = (totalMouseDelta.y / Math.tan(theta)) || 0
        }
      } else {
        totalMouseDelta.x = (snap.positionWorld - (snap.metadata.offset || 0)) - (this._lastProxyBox[activationPoint.index].x)
        if (snap.metadata && snap.metadata.isDraggingEdge) {
          let offsetRotation = this.getActivationPointInRadians(activationPoint.index)
          let transformRotation = updatedLayout.rotation.z
          let theta = (((offsetRotation + transformRotation) * 10000) % 62832) / 10000 // 'mod' by 2*pi
          totalMouseDelta.y = (totalMouseDelta.x * Math.tan(theta)) || 0
        }
      }
    })

    if (foundSnaps.length) {
      // Reset baseTransform
      Object.assign(baseTransform, getBaseTransform())
      scalePropertyGroup = ElementSelectionProxy.computeScalePropertyGroup(
        baseTransform,
        fixedPoint,
        translatedPoint,
        totalMouseDelta,
        activationPoint,
        true
      )
    }

    const matrixBeforeInverted = new Float32Array(16)

    invertMatrix(matrixBeforeInverted, baseTransform.matrix)

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
    } = scalePropertyGroup

    this.applyPropertyValue('scale.x', scaleX)
    this.applyPropertyValue('scale.y', scaleY)
    this.applyPropertyValue('translation.x', translationX)
    this.applyPropertyValue('translation.y', translationY)

    const matrixAfter = this.getComputedLayout().matrix
    let shouldTick = false

    this.selection.forEach((element) => {
      // Use our cached transform to mitigate the possibility of rounding errors at small/weird scales.
      const layoutSpec = element.transformCache.peek('CONTROL_ACTIVATION')
      if (!layoutSpec) {
        return
      }

      // We're going to populate this object with all the necessary property values
      // to represent the scale transform.
      const propertyGroup = {}

      // This matrix represents all transformations that have occurred to the element,
      // treating the selection box as a container element.
      const finalMatrix = Layout3D.multiplyArrayOfMatrices([
        layoutSpec.originOffsetComposedMatrix,
        matrixBeforeInverted,
        matrixAfter
      ])

      // This converts a composition of matrices like [[1,0,0,...],...] into our own
      // transform properties like scale.x, rotation.z, and merges them into the
      // given property group object.
      composedTransformsToTimelineProperties(propertyGroup, [finalMatrix], true)

      const offsetX = layoutSpec.offset.x
      const offsetY = layoutSpec.offset.y
      const offsetZ = layoutSpec.offset.z
      const originX = layoutSpec.origin.x * layoutSpec.size.x
      const originY = layoutSpec.origin.y * layoutSpec.size.y
      const originZ = layoutSpec.origin.z * layoutSpec.size.z

      propertyGroup['translation.x'] +=
        finalMatrix[0] * originX + finalMatrix[4] * originY + finalMatrix[8] * originZ - offsetX
      propertyGroup['translation.y'] +=
        finalMatrix[1] * originX + finalMatrix[5] * originY + finalMatrix[9] * originZ - offsetY
      propertyGroup['translation.z'] +=
        finalMatrix[2] * originX + finalMatrix[6] * originY + finalMatrix[10] * originZ - offsetZ

      const propertyGroupNorm = Object.keys(propertyGroup).reduce((accumulator, property) => {
        accumulator[property] = { value: propertyGroup[property] }
        return accumulator
      }, {})

      if (experimentIsEnabled(Experiment.SizeInsteadOfScaleWhenPossible)) {
        if (element.isComponent()) {
          const addressables = element.getComponentAddressables()
          const baseProxyTransform = getBaseTransform()

          if (
            addressables.width &&
            addressables.width.typedef === 'number'
          ) {
            propertyGroupNorm.width = {value: Math.abs(layoutSpec.size.x * scaleX / baseProxyTransform.scale.x)}
            // Note: here and below, scale.x and scale.y are guaranteed to exist as properties of propertyGroup[Norm]
            // because composedTransformsToTimelineProperties was called with explicit = true.
            propertyGroupNorm['scale.x'] = {value: Math.sign(propertyGroup['scale.x'])}
            shouldTick = true
          }

          if (
            addressables.height &&
            addressables.height.typedef === 'number'
          ) {
            propertyGroupNorm.height = {value: Math.abs(layoutSpec.size.y * scaleY / baseProxyTransform.scale.y)}
            propertyGroupNorm['scale.y'] = {value: Math.sign(propertyGroup['scale.y'])}
            shouldTick = true
          }
        }
      }

      ElementSelectionProxy.accumulateKeyframeUpdates(
        accumulatedUpdates,
        element.getComponentId(),
        element.component.getCurrentTimelineName(),
        element.component.getCurrentTimelineTime(),
        propertyGroupNorm
      )
    })

    this.component.updateKeyframes(
      accumulatedUpdates,
      {},
      this.component.project.getMetadata(),
      () => {
        if (shouldTick) {
          this.component.tick()
        }
        this.clearAllRelatedCaches()
      }
    )

    this.emit('snaps-updated', foundSnaps)
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
        this.reinitializeLayout()
      }
    )
  }

  rotate (dx, dy, coordsCurrent, coordsPrevious, activationPoint, globals) {
    const accumulatedUpdates = {}

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
      activationPoint,
      globals
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
  'offset.x': 0,
  'offset.y': 0,
  'offset.z': 0,
  'origin.x': 0.5,
  'origin.y': 0.5,
  'origin.z': 0.5,
  'rotation.x': 0,
  'rotation.y': 0,
  'rotation.z': 0,
  'scale.x': 1,
  'scale.y': 1,
  'scale.z': 1,
  'sizeAbsolute.x': 0,
  'sizeAbsolute.y': 0,
  'sizeAbsolute.z': 0,
  'translation.x': 0,
  'translation.y': 0,
  'translation.z': 0
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
    targetElement.getComputedLayout(),
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

// For a given activation point, we're also interested in the snaps of its neighbors, for e.g.
ElementSelectionProxy.getNeighborPointsForScaleSnapping = (proxyBoxPoints, activationPoint) => {
  switch (activationPoint.index) {
    case 1:
      return [proxyBoxPoints[0], proxyBoxPoints[2]]
    case 3:
      return [proxyBoxPoints[0], proxyBoxPoints[6]]
    case 5:
      return [proxyBoxPoints[2], proxyBoxPoints[8]]
    case 7:
      return [proxyBoxPoints[6], proxyBoxPoints[8]]
    default: // 4 or other
      throw new Error("Snapping behavior for 'center point' scaling is undefined")
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
  targetLayout,
  fixedPointIn,
  translatedPointIn,
  deltaIn,
  activationPoint,
  applyConstraints
) => {
  // Make a copy of inbound points so we can transform them in place.
  const fixedPoint = Object.assign({}, fixedPointIn)
  const translatedPoint = Object.assign({}, translatedPointIn)
  const delta = _.cloneDeep(deltaIn)
  // We compute the entire scale property group by fixing a point (the *temporary* transform origin) and translating a
  // point (the point being dragged). These are represented by `fixedPoint` and `translatedPoint` respectively.

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

// This is used for a side-effect-free 'dry run' calculation of points through a layout spec
ElementSelectionProxy.transformPointsByLayoutInPlace = (points, layout) => {
  const matrix = Layout3D.computeMatrix(layout, layout.size)
  return points.map((point) => {
    HaikuElement.transformPointInPlace(point, matrix)
    return point
  })
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
  const matrix = Layout3D.computeMatrix(layout, ignoredSize)

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
  if (layoutSpec.offset.x !== 0 || layoutSpec.offset.y !== 0) {
    ray.x += layoutSpec.offset.x
    ray.y += layoutSpec.offset.y
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
  activationPoint,
  globals
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
  if (globals.isShiftKeyDown) {
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
const Property = require('./Property')
const Template = require('./Template')
