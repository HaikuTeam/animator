const BaseModel = require('./BaseModel')

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

    this.project.on('update', (what) => {
      if (what === 'reload' || what === 'application-mounted' || what === 'resizeContext') {
        this.updateMountSize()
      }
    })

    this.project.on('remote-update', (what) => {
      if (what === 'resizeContext') {
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
    return {
      left: this._mountX,
      right: this._mountX + this._mountWidth,
      top: this._mountY,
      bottom: this._mountY + this._mountHeight,
      width: this._mountWidth,
      height: this._mountHeight
    }
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
  }

  updateMountSize ($container) {
    const updatedArtboardSize = this.component.getContextSize()
    if (updatedArtboardSize && updatedArtboardSize.width && updatedArtboardSize.height) {
      this._mountWidth = updatedArtboardSize.width
      this._mountHeight = updatedArtboardSize.height
    }
    this.resetContainerDimensions($container)
    this.emit('update', 'dimensions-changed')
  }

  zoomIn (factor) {
    this._zoomXY = this._zoomXY * factor
    this.emit('update', 'dimensions-changed')
  }

  zoomOut (factor) {
    this._zoomXY = this._zoomXY / factor
    this.emit('update', 'dimensions-changed')
  }

  performPan (dx, dy) {
    this._panX = this._originalPanX + dx
    this._panY = this._originalPanY + dy
    this.emit('update', 'dimensions-changed')
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
