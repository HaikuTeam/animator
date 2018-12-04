const BaseModel = require('./BaseModel');
const Matrix = require('gl-matrix');
const HAIKU_ID_ATTRIBUTE = 'haiku-id';

/**
 * @class Artboard
 * @description
 *  Abstraction over logic for managing the artboard, including:
 *    - Artboard size and position
 *    - Zooming and panning
 *    - Current drawing tool (future)
 *  And other such concerns. Consider putting Glass-related logic
 *  in here instead of into the Glass React app.
 */
class Artboard extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    if (typeof window !== 'undefined') {
      this._containerWidth = window.document.body.clientWidth || 1;
      this._containerHeight = window.document.body.clientHeight || 1;
    } else {
      this._containerWidth = 1;
      this._containerHeight = 1;
    }

    this._mountWidth = Artboard.DEFAULT_WIDTH;
    this._mountHeight = Artboard.DEFAULT_HEIGHT;
    this._mountX = Artboard.DEFAULT_WIDTH / 2;
    this._mountY = Artboard.DEFAULT_HEIGHT / 2;

    this._panX = 0;
    this._panY = 0;
    this._originalPanX = 0;
    this._originalPanY = 0;

    this._zoomXY = Artboard.DEFAULT_ZOOM;

    this._drawingIsModal = true;

    this.component.on('time:change', (timelineName, timelineTime) => {
      if (!this.component.isCodeReloading()) {
        this.updateMountSize();
      }
    });

    this.project.on('update', (what, arg1, arg2) => {
      if (
        what === 'application-mounted' ||
        (what === 'reloaded' && arg1 === 'hard')
      ) {
        this.updateMountSize();
      } else if (what === 'updateKeyframes') {
        const timelineName = this.component.getCurrentTimelineName();
        const artboardId = this.getElementHaikuId();
        if (arg2 && arg2[timelineName] && arg2[timelineName][artboardId]) {
          this.updateMountSize();
        }
      }
    });

    this.project.on('remote-update', (what) => {
      if (what === 'updateKeyframes') {
        this.updateMountSize();
      }
    });
  }

  // used by at least "cmd + 0" to center and
  // reset zoom on stage
  resetZoomPan () {
    this._panX = 0;
    this._panY = 0;
    this._originalPanX = 0;
    this._originalPanY = 0;

    this._zoomXY = Artboard.DEFAULT_ZOOM;

    this.dimensionsChangedHook();
  }

  dimensionsChangedHook () {
    const hc = this.component.$instance;
    const renderer = hc && hc.context && hc.context.renderer;
    if (renderer) {
      if (!renderer.config) {
        renderer.config = {};
      }
      renderer.config.zoom = this.getZoom();
      renderer.config.pan = this.getPan();
    }
    ElementSelectionProxy.clearCaches();
    this.emit('update', 'dimensions-changed');
  }

  getElementHaikuId () {
    const bytecode = this.component.fetchActiveBytecodeFile().getReifiedBytecode();
    const template = bytecode && bytecode.template; // If called too early this may not be present :/
    return template && template.attributes[HAIKU_ID_ATTRIBUTE];
  }

  getElement () {
    const haikuId = this.getElementHaikuId();
    if (!haikuId) {
      return null;
    }
    return Element.findByComponentAndHaikuId(this.component, haikuId);
  }

  getArtboardRenderInfo () {
    return {
      pan: {
        x: this._panX,
        y: this._panY,
      },
      zoom: {
        x: this._zoomXY,
        y: this._zoomXY,
      },
      container: {
        x: 0,
        y: 0,
        w: this._containerWidth,
        h: this._containerHeight,
      },
      mount: {
        x: this._mountX,
        y: this._mountY,
        w: this._mountWidth,
        h: this._mountHeight,
      },
    };
  }

  getRect () {
    return this.mount.getBoundingClientRect();
  }

  resetContainerDimensions ($container) {
    if ($container) {
      const w1 = $container.clientWidth;
      const h1 = $container.clientHeight;

      const w2 = this._mountWidth;
      const h2 = this._mountHeight;

      const mountX = Math.round((w1 - w2) / 2);
      const mountY = Math.round((h1 - h2) / 2);

      const cw = Math.max(w1, w2);
      const ch = Math.max(h1, h2);

      if (
        cw !== this._containerWidth ||
        ch !== this._containerHeight ||
        mountX !== this._mountX ||
        mountY !== this._mountY
      ) {
        this._containerWidth = cw;
        this._containerHeight = ch;
        this._mountX = mountX;
        this._mountY = mountY;
      }
    }

    this.emit('update', 'dimensions-reset');
  }

  updateMountSize ($container) {
    const updatedArtboardSize = this.component && this.component.getContextSize();
    if (updatedArtboardSize && updatedArtboardSize.width && updatedArtboardSize.height) {
      this._mountWidth = updatedArtboardSize.width;
      this._mountHeight = updatedArtboardSize.height;
    }
    this.resetContainerDimensions($container);
    this.dimensionsChangedHook();
  }

  zoomIn (factor) {
    this._zoomXY = this._zoomXY * factor;
    this.dimensionsChangedHook();
  }

  zoomOut (factor) {
    this._zoomXY = this._zoomXY / factor;
    this.dimensionsChangedHook();
  }

  performPan (dx, dy) {
    this._panX = this._originalPanX + dx;
    this._panY = this._originalPanY + dy;
    this.dimensionsChangedHook();
  }

  isDrawingModal () {
    return this._drawingIsModal;
  }

  getSize () {
    return {
      x: this.getMountWidth(),
      y: this.getMountHeight(),
    };
  }

  getMountX () {
    return this._mountX;
  }

  getMountY () {
    return this._mountY;
  }

  getMountWidth () {
    return this._mountWidth;
  }

  getMountHeight () {
    return this._mountHeight;
  }

  getContainerWidth () {
    return this._containerWidth;
  }

  getContainerHeight () {
    return this._containerHeight;
  }

  snapshotOriginalPan () {
    this._originalPanX = this._panX;
    this._originalPanY = this._panY;
  }

  transformScreenToWorld (screenCoords) {
    const mat = Matrix.mat2d.create();
    const mount = Matrix.vec2.create();

    Matrix.vec2.set(mount, -this._mountX, -this._mountY);

    const mountMat = Matrix.mat2d.create();
    Matrix.mat2d.translate(mountMat, mountMat, mount);
    Matrix.mat2d.multiply(mat, mat, mountMat);

    const screenVec = Matrix.vec2.create();
    Matrix.vec2.set(screenVec, screenCoords.x, screenCoords.y);
    Matrix.vec2.transformMat2d(screenVec, screenVec, mat);
    const screenSpace = {x: screenVec[0], y: screenVec[1]};
    return screenSpace;
  }

  getZoom () {
    return this._zoomXY;
  }

  getPan () {
    return {
      x: this._panX,
      y: this._panY,
    };
  }

  // Snapline {
  //  direction : "HORIZONTAL"|"VERTICAL"
  //  positionWorld: Number
  //  elementId: String | undefined
  // }

  getSnapLinesInScreenCoords () {
    const snapLines = [];
    const topWorld = 0;
    const rightWorld = this._mountWidth;
    const bottomWorld = this._mountHeight;
    const leftWorld = 0;

    snapLines.push({
      direction: 'HORIZONTAL',
      positionWorld: topWorld,
      elementId: 'STAGE_TOP',
    });
    snapLines.push({
      direction: 'VERTICAL',
      positionWorld: rightWorld,
      elementId: 'STAGE_RIGHT',
    });
    snapLines.push({
      direction: 'HORIZONTAL',
      positionWorld: bottomWorld,
      elementId: 'STAGE_BOTTOM',
    });
    snapLines.push({
      direction: 'VERTICAL',
      positionWorld: leftWorld,
      elementId: 'STAGE_LEFT',
    });
    snapLines.push({
      direction: 'VERTICAL',
      positionWorld: (leftWorld + rightWorld) / 2,
      elementId: 'STAGE_VERTICAL_MID',
    });
    snapLines.push({
      direction: 'HORIZONTAL',
      positionWorld: (topWorld + bottomWorld) / 2,
      elementId: 'STAGE_HORIZONTAL_MID',
    });

    const rootElement = this.getElement();
    const topLevelElements = rootElement.children;

    topLevelElements.forEach((elem) => {
      // deleted elements will show up as null entries in this array
      if (!elem) {
        return;
      }

      const marginX = (this._containerWidth - this._mountWidth) / 2;
      const marginY = (this._containerHeight - this._mountHeight) / 2;
      const bbox = elem.getBoundingClientRect(-marginX, -marginY);

      snapLines.push({
        direction: 'HORIZONTAL',
        positionWorld: this.transformScreenToWorld({x: 0, y: bbox.top}).y,
        elementId: elem.getComponentId(),
      });
      snapLines.push({
        direction: 'HORIZONTAL',
        positionWorld: this.transformScreenToWorld({x: 0, y: bbox.bottom}).y,
        elementId: elem.getComponentId(),
      });
      snapLines.push({
        direction: 'HORIZONTAL',
        positionWorld: this.transformScreenToWorld({x: 0, y: (bbox.bottom + bbox.top) / 2}).y,
        elementId: elem.getComponentId(),
      });
      snapLines.push({
        direction: 'VERTICAL',
        positionWorld: this.transformScreenToWorld({x: bbox.left, y: 0}).x,
        elementId: elem.getComponentId(),
      });
      snapLines.push({
        direction: 'VERTICAL',
        positionWorld: this.transformScreenToWorld({x: bbox.right, y: 0}).x,
        elementId: elem.getComponentId(),
      });
      snapLines.push({
        direction: 'VERTICAL',
        positionWorld: this.transformScreenToWorld({x: (bbox.right + bbox.left) / 2, y: 0}).x,
        elementId: elem.getComponentId(),
      });
    });

    if (typeof window !== 'undefined') {
      window.snapLines = snapLines;
    }

    return snapLines;
  }
}

Artboard.DEFAULT_OPTIONS = {
  required: {
    mount: true,
    component: true,
    project: true,
  },
};

BaseModel.extend(Artboard);

Artboard.DEFAULT_WIDTH = 550;
Artboard.DEFAULT_HEIGHT = 400;
Artboard.DEFAULT_ZOOM = 1;

module.exports = Artboard;

// Down here to avoid Node circular dependency stub objects. #FIXME
const Element = require('./Element');
const ElementSelectionProxy = require('./ElementSelectionProxy');
