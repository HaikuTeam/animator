const BaseModel = require('./BaseModel')
const Matrix = require('gl-matrix')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'

/**
 * @class Artboard
 * @description
 *.  Abstraction over logic for managing the artboard, including:
 *.    - Artboard size and position
 *.    - Zooming and panning
 *.    - Current drawing tool (future)
 *.  And other such concerns. Consider putting Glass-related logic
 *.  in here instead of into the Glass React app.
 */
class Artboard extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    if (typeof window !== 'undefined') {
      this._containerWidth = window.document.body.clientWidth || 1
      this._containerHeight = window.document.body.clientHeight || 1
    } else {
      this._containerWidth = 1
      this._containerHeight = 1
    }

    this._mountWidth = Artboard.DEFAULT_WIDTH
    this._mountHeight = Artboard.DEFAULT_HEIGHT
    this._mountX = Artboard.DEFAULT_WIDTH / 2
    this._mountY = Artboard.DEFAULT_HEIGHT / 2

    this._panX = 0
    this._panY = 0
    this._originalPanX = 0
    this._originalPanY = 0

    this._zoomXY = Artboard.DEFAULT_ZOOM

    this._activeDrawingTool = 'pointer'
    this._drawingIsModal = true

    this.component.on('time:change', (timelineName, timelineTime) => {
      if (!this.component.isCodeReloading()) {
        this.updateMountSize()
      }
    })

    this.project.on('update', (what, arg1, arg2) => {
      if (
        what === 'application-mounted' ||
        (what === 'reloaded' && arg1 === 'hard')
      ) {
        this.updateMountSize()
      } else if (what === 'updateKeyframes') {
        const timelineName = this.component.getCurrentTimelineName()
        const artboardId = this.getElementHaikuId()
        if (arg2 && arg2[timelineName] && arg2[timelineName][artboardId]) {
          this.updateMountSize()
        }
      }
    })

    this.project.on('remote-update', (what) => {
      if (what === 'updateKeyframes') {
        this.updateMountSize()
      }
    })
  }

  // used by at least "cmd + 0" to center and
  // reset zoom on stage
  resetZoomPan () {
    this._panX = 0
    this._panY = 0
    this._originalPanX = 0
    this._originalPanY = 0

    this._zoomXY = Artboard.DEFAULT_ZOOM

    this.dimensionsChangedHook()
  }

  dimensionsChangedHook () {
    const hc = this.component.getCoreComponentInstance()
    const renderer = hc && hc.context && hc.context.renderer
    if (renderer) {
      if (!renderer.config) renderer.config = {}
      renderer.config.zoom = this.getZoom()
      renderer.config.pan = this.getPan()
    }
    ElementSelectionProxy.clearCaches()
    this.emit('update', 'dimensions-changed')
  }

  getElementHaikuId () {
    const bytecode = this.component.fetchActiveBytecodeFile().getReifiedBytecode()
    const template = bytecode && bytecode.template // If called too early this may not be present :/
    return template && template.attributes[HAIKU_ID_ATTRIBUTE]
  }

  getElement () {
    const haikuId = this.getElementHaikuId()
    if (!haikuId) return null
    return Element.findByComponentAndHaikuId(this.component, haikuId)
  }

  getArtboardRenderInfo () {
    return {
      drawingClassName: (this._activeDrawingTool !== 'pointer')
        ? 'draw-shape'
        : '',
      pan: {
        x: this._panX,
        y: this._panY
      },
      zoom: {
        x: this._zoomXY,
        y: this._zoomXY
      },
      container: {
        x: 0,
        y: 0,
        w: this._containerWidth,
        h: this._containerHeight
      },
      mount: {
        x: this._mountX,
        y: this._mountY,
        w: this._mountWidth,
        h: this._mountHeight
      }
    }
  }

  getRect () {
    return this.mount.getBoundingClientRect()
  }

  resetContainerDimensions ($container) {
    if ($container) {
      const w1 = $container.clientWidth
      const h1 = $container.clientHeight

      const w2 = this._mountWidth
      const h2 = this._mountHeight

      const mountX = (w1 - w2) / 2
      const mountY = (h1 - h2) / 2

      const cw = Math.max(w1, w2)
      const ch = Math.max(h1, h2)

      if (
        cw !== this._containerWidth ||
        ch !== this._containerHeight ||
        mountX !== this._mountX ||
        mountY !== this._mountY
      ) {
        this._containerWidth = cw
        this._containerHeight = ch
        this._mountX = mountX
        this._mountY = mountY
      }
    }

    this.emit('update', 'dimensions-reset')
  }

  updateMountSize ($container) {
    const updatedArtboardSize = this.component && this.component.getContextSize()
    if (updatedArtboardSize && updatedArtboardSize.width && updatedArtboardSize.height) {
      this._mountWidth = updatedArtboardSize.width
      this._mountHeight = updatedArtboardSize.height
    }
    this.resetContainerDimensions($container)
    this.dimensionsChangedHook()
  }

  zoomIn (factor) {
    this._zoomXY = this._zoomXY * factor
    this.dimensionsChangedHook()
  }

  zoomOut (factor) {
    this._zoomXY = this._zoomXY / factor
    this.dimensionsChangedHook()
  }

  performPan (dx, dy) {
    this._panX = this._originalPanX + dx
    this._panY = this._originalPanY + dy
    this.dimensionsChangedHook()
  }

  setDrawingTool (activeDrawingTool, drawingIsModal) {
    this._activeDrawingTool = activeDrawingTool
    this._drawingIsModal = drawingIsModal
    this.emit('update', 'drawing-tool-changed')
  }

  isDrawingModal () {
    return this._drawingIsModal
  }

  getMountX () {
    return this._mountX
  }

  getMountY () {
    return this._mountY
  }

  getMountWidth () {
    return this._mountWidth
  }

  getMountHeight () {
    return this._mountHeight
  }

  getContainerWidth () {
    return this._containerWidth
  }

  getContainerHeight () {
    return this._containerHeight
  }

  snapshotOriginalPan () {
    this._originalPanX = this._panX
    this._originalPanY = this._panY
  }

  // takes a point in screen space {x,y} and transforms it to 2D world space {x,y}
  transformScreenToWorld (screenCoords) {
    let mat = Matrix.mat2d.create()
    let scale = Matrix.vec2.create()
    Matrix.vec2.set(scale, 1 / this._zoomXY, 1 / this._zoomXY)
    Matrix.mat2d.scale(mat, mat, scale)
    let screenVec = Matrix.vec2.create()
    Matrix.vec2.set(screenVec, screenCoords.x, screenCoords.y)
    Matrix.vec2.transformMat2d(screenVec, screenVec, mat)
    let ret = {x: screenVec[0], y: screenVec[1]}
    return ret
  }

  getZoom () {
    return this._zoomXY
  }

  getPan () {
    return {
      x: this._panX,
      y: this._panY
    }
  }

  getActiveDrawingTool () {
    return this._activeDrawingTool
  }
}

Artboard.DEFAULT_OPTIONS = {
  required: {
    mount: true,
    component: true,
    project: true
  }
}

BaseModel.extend(Artboard)

Artboard.DEFAULT_WIDTH = 550
Artboard.DEFAULT_HEIGHT = 400
Artboard.DEFAULT_ZOOM = 1

module.exports = Artboard

// Down here to avoid Node circular dependency stub objects. #FIXME
const Element = require('./Element')
const ElementSelectionProxy = require('./ElementSelectionProxy')
