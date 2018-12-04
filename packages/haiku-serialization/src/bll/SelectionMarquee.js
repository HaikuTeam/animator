const BaseModel = require('./BaseModel');

/**
 * @class SelectionMarquee
 * @description
 *  Represents the on-stage selection marquee.
 */
class SelectionMarquee extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    // Whether or not our marquee is active, i.e. displayed
    this._isActive = false;
  }

  startSelection (startPosition) {
    this._isActive = true;
    this._startPosition = startPosition;
  }

  moveSelection (movePosition) {
    this._movePosition = movePosition;
  }

  endSelection () {
    this._isActive = false;
    this._startPosition = null;
    this._movePosition = null;
  }

  isActive () {
    return this._isActive;
  }

  getBox () {
    if (
      !this._startPosition ||
      !this._movePosition ||
      !this._isActive
    ) {
      return {x: 1, y: 1, width: 1, height: 1};
    }

    const w = this._movePosition.x - this._startPosition.x;
    const h = this._movePosition.y - this._startPosition.y;
    const x1 = this._startPosition.x;
    const y1 = this._startPosition.y;
    const x2 = x1 + w;
    const y2 = y1 + h;

    // This box gets rendered as a div, so we rearrange the values so x,y
    // is always the box's top-left corner
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const width = Math.abs(w);
    const height = Math.abs(h);

    return {
      x,
      y,
      width,
      height,
    };
  }
}

SelectionMarquee.DEFAULT_OPTIONS = {
  required: {
    uid: true,
    component: true,
    artboard: true,
  },
};

BaseModel.extend(SelectionMarquee);

module.exports = SelectionMarquee;
