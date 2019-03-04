const HaikuComponent = require('@haiku/core/lib/HaikuComponent').default;
const expressionToRO = require('@haiku/core/lib/reflection/expressionToRO').default;
const isDecomposableCurve = require('haiku-formats/lib/exporters/curves').isDecomposableCurve;
const getCurveInterpolationPoints = require('haiku-formats/lib/exporters/curves').getCurveInterpolationPoints;
const BaseModel = require('./BaseModel');

/**
 * @class Keyframe
 * @description
 *  Abstraction over the raw representation of keyframes in bytecode.
 *  Helps with the following:
 *    - Managing state changes between keyframes: selected, dragging, etc.
 *    - Makes complicated actions like dragging multiple keyframes easy
 *    - Handling model updates like changing curves, changing the ms time, etc.
 *    - Has some logic for color changes that probably should be moved #FIXME
 */
class Keyframe extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    this._selected = false;
    this._selectedBody = false;
    this._activated = false;
    this._dragStartPx = null;
    this._dragStartMs = null;
    this._needsMove = false;
    this._hasMouseDown = false;
    this._lastMouseDown = 0;
    this._didHandleDragStop = false;
    this._didHandleContextMenu = false;
    this._mouseDownState = {};
    this._updateReceivers = {};
    this._viewPosition = {};
  }

  activate () {
    if (!this._activated) {
      this._activated = true;
      this.notifyUpdateReceivers('keyframe-activated');
    }
  }

  deactivate () {
    if (this._activated) {
      this._activated = false;
      this.notifyUpdateReceivers('keyframe-deactivated');
    }
  }

  isActive () {
    return this._activated;
  }

  select () {
    if (!this._selected) {
      this._selected = true;
      this.notifyUpdateReceivers('keyframe-selected');
    }
  }

  deselect () {
    if (this._selected) {
      this._selected = false;
      this.notifyUpdateReceivers('keyframe-deselected');
    }
  }

  setBodySelected () {
    if (!this._selectedBody) {
      this._selectedBody = true;
      this.notifyUpdateReceivers('keyframe-body-selected');
    }
  }

  unsetBodySelected () {
    if (this._selectedBody) {
      this._selectedBody = false;
      this.notifyUpdateReceivers('keyframe-body-unselected');
    }
  }

  deselectAndDeactivate () {
    this.unsetBodySelected();
    this.deselect();
    this.deactivate();
  }

  isSelected () {
    return this._selected;
  }

  isSelectedBody () {
    return this._selectedBody;
  }

  delete (metadata) {
    this.row.deleteKeyframe(this, metadata);
    Timeline.clearCaches();
    return this;
  }

  dragStart (dragData) {
    this._dragStartMs = this.getMs();
    this._dragStartPx = dragData.x;
    return this;
  }

  dragStop () {
    this._dragStartMs = null;
    this._dragStartPx = null;
    return this;
  }

  drag (pxpf, mspf, dragData, metadata) {
    const pxChange = dragData.lastX - this._dragStartPx;
    const msChange = Math.round(pxChange / pxpf * mspf);

    this.move(msChange, this._dragStartMs, mspf);

    return this;
  }

  move (msChange, msOrig, mspf) {
    const msFinal = msOrig + msChange;
    if (msFinal >= 0) {
      this.moveTo(msFinal, mspf);
    }
    return this;
  }

  moveTo (ms, mspf) {
    // No-op the rest of this procedure if we're already at the same keyframe
    if (this.getMs() === ms) {
      return this;
    }

    this.setMs(ms);

    const msMargin = Math.round(mspf);

    if (this.next()) {
      if (this.getMs() >= (this.next().getMs() - 1)) {
        const nextMs = this.getMs() + msMargin;
        if (nextMs >= 0) {
          this.next().moveTo(nextMs, mspf);
        }
      }
    }

    if (this.prev()) {
      if (this.getMs() <= (this.prev().getMs() + 1)) {
        const prevMs = this.getMs() - msMargin;
        if (prevMs >= 0) {
          this.prev().moveTo(prevMs, mspf);
        }
      }
    }

    return this;
  }

  createKeyframe (value, ms, metadata) {
    this.row.createKeyframe(value, ms, metadata);
    return this;
  }

  removeCurve (metadata) {
    if (this.next() && this.next().isActive()) {
      this.setCurve(null);
      this.component.splitSegment(
        this.element.getComponentId(),
        this.timeline.getName(),
        this.element.getNameString(),
        this.row.getPropertyNameString(),
        this.getMs(),
        metadata,
        () => {},
      );

      this.row.emit('update', 'keyframe-remove-curve');
    }

    return this;
  }

  addCurve (curveName, metadata) {
    this.setCurve(curveName);

    this.component.joinKeyframes(
      this.element.getComponentId(),
      this.timeline.getName(),
      this.element.getNameString(),
      this.row.getPropertyNameString(),
      this.getMs(),
      null,
      curveName,
      metadata,
      () => {},
    );

    this.row.emit('update', 'keyframe-add-curve');

    return this;
  }

  changeCurve (curveName, metadata) {
    this.setCurve(curveName);

    this.component.changeSegmentCurve(
      this.element.getComponentId(),
      this.timeline.getName(),
      this.row.getPropertyNameString(),
      this.getMs(),
      curveName,
      metadata,
      () => {},
    );

    this.row.emit('update', 'keyframe-change-curve');

    return this;
  }

  isTransitionSegment () {
    return !!this.getCurve();
  }

  isConstantSegment () {
    return this.hasNextKeyframe();
  }

  hasConstantBody () {
    return (
      this.next() &&
      !this.getCurve()
    );
  }

  hasCurveBody () {
    return (
      this.next() &&
      this.getCurve()
    );
  }

  /**
   * @method hasDecomposableCurve
   * @description Return if the current curve body is composed of multiple Bezier Curves.
   */
  hasDecomposableCurve () {
    return this.hasCurveBody() && isDecomposableCurve(this.getCurve());
  }

  /**
   * @method getCurveInterpolationPoints
   * @description Returns the curve descomposed
   */
  getCurveInterpolationPoints () {
    return getCurveInterpolationPoints(this.getCurve());
  }

  isSoloKeyframe () {
    const prev = this.prev();
    if (!prev) {
      return true;
    }
    return !prev.getCurve();
  }

  hasPreviousKeyframe () {
    return !!this.prev();
  }

  hasNextKeyframe () {
    return !!this.next();
  }

  setOrigMs (ms) {
    this.origMs = ms;
  }

  updateOwnMetadata () {
    const ms = this.getMs();
    const newUid = Keyframe.getInferredUid(this.row, ms);
    this.setOrigMs(ms);
    Keyframe.setInstancePrimaryKey(this, newUid);
  }

  getUniqueKey () {
    return this.getPrimaryKey();
  }

  getViewPosition () {
    return this._viewPosition;
  }

  isWithinCollapsedRow () {
    return this.row.isCollapsed() || this.row.isWithinCollapsedRow();
  }

  getFrame (mspf) {
    return Timeline.millisecondToNearestFrame(this.getMs(), mspf);
  }

  getOrigMs () {
    return this.origMs;
  }

  getMs () {
    return this.ms;
  }

  setMs (ms) {
    if (ms < 0) {
      throw new Error('keyframes cannot be less than 0');
    }

    // Normalize to a millitime that lines up with a frametime
    const normalized = this.timeline.normalizeMs(ms);
    const previous = this.getMs();
    this.ms = normalized;

    // Clear timeline caches; the max frame might have changed.
    Timeline.clearCaches();

    if (normalized !== previous) {
      // Indicate that we need to be moved. Must set this before calling handleKeyframeMoves
      // otherwise the update might not make it correctly to the serialization layer
      this._needsMove = true;

      this.notifyUpdateReceivers('keyframe-ms-set');

      if (this.prev()) {
        this.prev().notifyUpdateReceivers('keyframe-neighbor-move');
      }

      if (this.next()) {
        this.next().notifyUpdateReceivers('keyframe-neighbor-move');
      }
    }

    return this;
  }

  getIndex () {
    return this.index;
  }

  getValue (serialized) {
    if (serialized) {
      return expressionToRO(this.value);
    }
    return this.value;
  }

  getSpec (edited, serialized) {
    const spec = {
      value: this.getValue(serialized),
    };

    if (edited) {
      spec.edited = true;
    }

    if (this.getCurve()) {
      spec.curve = this.getCurve();
    }

    return spec;
  }

  setCurve (value) {
    this.curve = value;
    return this;
  }

  getCurve () {
    return this.curve;
  }

  isVisible (a, b) {
    if (this.getMs() > b) {
      return false;
    }

    const next = this.next();
    return !next || this.getMs() >= a || next.getMs() >= a;
  }

  isTweenable () {
    if (typeof this.value === 'string' || this.value instanceof String) {
      const ourPropertyName = this.row.getPropertyNameString();

      // Some strings, such as color and path.d, are tweenable because core parses
      // them on the fly into numeric payloads that can be tweened.
      // tslint:disable-next-line:triple-equals
      return HaikuComponent.PARSERS[ourPropertyName] || this.value == parseFloat(this.value, 10);
    }

    return typeof (this.value) !== 'boolean';
  }

  next () {
    return this._next;
  }

  prev () {
    return this._prev;
  }

  isNextKeyframeSelected () {
    return this.next() && this.next().isSelected();
  }

  getPixelOffsetRight (base, pxpf, mspf) {
    if (base === undefined || pxpf === undefined || mspf === undefined) {
      throw new Error(`keyframe pixel offset right params missing`);
    }
    if (this.next()) {
      return (this.next().getFrame(mspf) - base) * pxpf;
    }

    return 0;
  }

  getPixelOffsetLeft (base, pxpf, mspf) {
    if (base === undefined || pxpf === undefined || mspf === undefined) {
      throw new Error(`keyframe pixel offset left params missing`);
    }
    return (this.getFrame(mspf) - base) * pxpf;
  }

  storeViewPosition ({rect, offset}) {
    this._viewPosition = {
      left: rect.left + offset,
      right: rect.right + offset,
    };
  }

  clearViewPosition () {
    this._viewPosition = {};
  }

  isWithinCollapsedClusterHeadingRow () {
    return (
      this.row &&
      this.row.parent &&
      this.row.parent.isClusterHeading() &&
      this.row.parent.isCollapsed()
    );
  }

  isClusterMember () {
    return (
      this.row &&
      this.row.parent &&
      this.row.parent.isClusterHeading()
    );
  }

  getElementHeadingRow () {
    if (this.row && this.row.parent) {
      if (this.row.parent.isClusterHeading()) {
        return this.row.parent.parent;
      }
      return this.row.parent;
    }
  }

  getClusterHeadingRow () {
    if (this.row && this.row.parent) {
      if (this.row.parent.isClusterHeading()) {
        return this.row.parent;
      }
    }
  }

  getCurveCapitalized () {
    const curve = this.getCurve();

    if (Array.isArray(curve)) {
      return 'Custom';
    }

    if (typeof curve !== 'string' && !(curve instanceof String)) {
      return '';
    }

    return curve.charAt(0).toUpperCase() + curve.slice(1);
  }

  isWithinCollapsedElementHeadingRow () {
    const elementHeading = this.getElementHeadingRow();
    return elementHeading.isCollapsed() || elementHeading.isWithinCollapsedRow();
  }

  getLeftKeyframeColorState () {
    if (this.isActive()) {
      return 'LIGHTEST_PINK';
    }

    if (this.isWithinCollapsedElementHeadingRow()) {
      return 'BLUE';
    }

    if (this.isWithinCollapsedClusterHeadingRow()) {
      return 'DARK_ROCK';
    }

    return 'ROCK';
  }

  getRightKeyframeColorState () {
    if (this.next() && this.next().isActive()) {
      return 'LIGHTEST_PINK';
    }

    if (this.isWithinCollapsedElementHeadingRow()) {
      return 'BLUE';
    }

    if (this.isWithinCollapsedClusterHeadingRow()) {
      return 'DARK_ROCK';
    }

    return 'ROCK';
  }

  getCurveColorState () {
    if (this.isSelected() && this.isActive() && this.isCurveSelected()) {
      return 'LIGHTEST_PINK';
    }

    if (this.isWithinCollapsedElementHeadingRow()) {
      return 'BLUE';
    }

    if (this.isWithinCollapsedClusterHeadingRow()) {
      return 'DARK_ROCK';
    }

    return 'ROCK';
  }

  isCurveSelected () {
    return (
      this.hasCurveBody() &&
      this.isSelectedBody()
    );
  }

  setMouseDown () {
    this._hasMouseDown = true;
    this._lastMouseDown = Date.now();
  }

  getLastMouseDown () {
    return this._lastMouseDown;
  }

  unsetMouseDown () {
    this._hasMouseDown = false;
  }

  isMouseDown () {
    return this._hasMouseDown;
  }

  setMouseDownState ({
    wasSelected,
    wasSelectedBody,
    wasCurveTargeted,
  }) {
    this._mouseDownState = {
      wasSelected,
      wasSelectedBody,
      wasCurveTargeted,
    };
  }

  unsetMouseDownState () {
    this._mouseDownState = {};
  }

  getMouseDownState () {
    return this._mouseDownState;
  }

  setDidHandleDragStop () {
    this._didHandleDragStop = true;
  }

  unsetDidHandleDragStop () {
    this._didHandleDragStop = false;
  }

  didHandleDragStop () {
    return this._didHandleDragStop;
  }

  setDidHandleContextMenu () {
    this._didHandleContextMenu = true;
  }

  unsetDidHandleContextMenu () {
    this._didHandleContextMenu = false;
  }

  didHandleContextMenu () {
    return this._didHandleContextMenu;
  }

  updateActivationStatesAccordingToNeighborStates () {
    const prevKeyframe = this.prev();

    /**
     * o keyframe
     * - constant segment
     * ~ curve segment
     *
     *   |<~this keyframe
     *   |
     *   o
     *   o-o <~ has next only
     *   o~o
     * o-o   <~ has prev only
     * o~o
     * o-o-o <~ has next and prev
     * o~o-o
     * o-o~o
     * o~o~o
     */

    if (prevKeyframe) {
      if (prevKeyframe.isSelected()) {
        if (prevKeyframe.isSelectedBody()) {
          this.select();
        }
      }
    }

    if (this.isSelected()) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  handleMouseDown (
    {nativeEvent: {which}},
    {isShiftKeyDown, isControlKeyDown, isCommandKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView},
  ) {
    if (isControlKeyDown || which === 3) {
      return this.handleContextMenu(
        {isShiftKeyDown, isControlKeyDown, isCommandKeyDown},
        {isViaConstantBodyView, isViaTransitionBodyView},
      );
    }

    this.setMouseDown();
    this.unsetDidHandleDragStop();

    const isCurveTargeted = (isViaTransitionBodyView || isViaConstantBodyView);

    // Keeping track of this information so we can do the correct thing on mouse up
    this.setMouseDownState({
      wasSelected: this.isSelected(),
      wasSelectedBody: this.isSelectedBody(),
      wasCurveTargeted: isCurveTargeted,
    });

    // Unless the shift key is down, a direct click normally clear others
    if (!isShiftKeyDown && !isCommandKeyDown) {
      // But only if we're touching an unrelated (unselected) set of keyframes
      if (!this.isSelected()) {
        this.clearOtherKeyframes();
      }
    }

    // Ensure we and neighbors are selected and activated since this may begin a drag
    this.select();

    if (isCurveTargeted) {
      this.setBodySelected();
    }

    // Loop through keyframes in this row left-to-right and update activations
    this.updateActivationStatesInRow();
  }

  updateActivationStatesInRow () {
    this.row.getKeyframes().forEach((keyframe) => {
      keyframe.updateActivationStatesAccordingToNeighborStates();
    });
  }

  handleMouseUp (
    {nativeEvent: {which}},
    {lastMouseButtonPressed, isShiftKeyDown, isControlKeyDown, isCommandKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView},
  ) {
    if (!this.isMouseDown()) {
      // We weren't the one who received the initial mouse down
      const otherKeyframe = Keyframe.where({_hasMouseDown: true, component: this.component})[0];
      if (otherKeyframe && otherKeyframe !== this) {
        otherKeyframe.handleMouseUp(
          {nativeEvent: {which}},
          {lastMouseButtonPressed, isShiftKeyDown, isControlKeyDown, isCommandKeyDown},
          {isViaConstantBodyView, isViaTransitionBodyView},
        );
      }
      return;
    }

    this.unsetMouseDown();

    if (this.didHandleDragStop()) {
      this.unsetDidHandleDragStop();
      return;
    }

    const {
      wasSelected,
      wasSelectedBody,
      wasCurveTargeted,
    } = this.getMouseDownState();

    this.unsetMouseDownState();

    if (!isShiftKeyDown && !isCommandKeyDown) {
      // Since mouseup commits the action, we don't check for selection state here
      this.clearOtherKeyframes();
    }

    // If shift is down on mouse up, we deselect current selections
    if (isShiftKeyDown || isCommandKeyDown) {
      if (wasCurveTargeted) {
        if (wasSelectedBody) {
          this.unsetBodySelected();
        } else {
          this.setBodySelected();
        }
      } else {
        if (wasSelected) {
          this.unsetBodySelected();
          this.deselect();
        } else {
          this.select();
        }
      }
    } else {
      // We've explicitly activated the keyframe as opposed to the whole segment
      if (!wasCurveTargeted) {
        this.unsetBodySelected();
      }
    }

    // Loop through keyframes in this row left-to-right and update activations
    this.updateActivationStatesInRow();

    this.component.dragStopSelectedKeyframes();
  }

  handleContextMenu (
    {isShiftKeyDown, isCommandKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView},
  ) {
    this.unsetMouseDown();
    this.unsetMouseDownState();

    if (this.didHandleContextMenu()) {
      this.unsetDidHandleContextMenu();
      return;
    }

    this.setDidHandleContextMenu();

    if (this.isWithinCollapsedRow()) {
      return;
    }

    const isCurveTargeted = (isViaTransitionBodyView || isViaConstantBodyView);

    // Unless the shift key is down, a direct click normally clear others
    if (!isShiftKeyDown && !isCommandKeyDown) {
      // But only if we're touching an unrelated (unselected) set of keyframes

      if (isCurveTargeted && !this.isNextKeyframeSelected()) {
        this.clearOtherKeyframes();
      }

      if (!this.isSelected()) {
        this.clearOtherKeyframes();
      }
    }

    // Ensure we and neighbors are selected and activated since this may begin a drag
    this.select();
    if (isCurveTargeted) {
      this.setBodySelected();
    }

    // Loop through keyframes in this row left-to-right and update activations
    this.updateActivationStatesInRow();

    this.component.dragStopSelectedKeyframes();
  }

  handleDragStop (
    dragData,
    {wasDrag, lastMouseButtonPressed, isShiftKeyDown, isControlKeyDown, isCommandKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView},
  ) {
    if (!wasDrag) {
      return this.handleMouseUp(
        {nativeEvent: {which: 1}}, // Mock
        {isShiftKeyDown, isControlKeyDown, isCommandKeyDown},
        {isViaConstantBodyView, isViaTransitionBodyView},
      );
    }

    if (this.didHandleDragStop()) {
      this.unsetDidHandleDragStop();
      return;
    }

    this.setDidHandleDragStop();
    this.component.dragStopSelectedKeyframes();
  }

  clearOtherKeyframes () {
    Keyframe.where({component: this.component}).forEach((keyframe) => {
      if (keyframe !== this) {
        keyframe.deselectAndDeactivate();
      }
    });
  }

  /**
   * @method dump
   * @description When debugging, use this to log a concise shorthand of this entity.
   */
  dump () {
    let str = `${this.row.getPropertyNameString()}[${this.getIndex()}]:${this.getMs()}/${this.getCurve() || '!'}`;
    if (this.isTransitionSegment()) {
      str += ' {t}';
    }
    if (this.isConstantSegment()) {
      str += ' {c}';
    }
    if (this.isSoloKeyframe()) {
      str += ' {s}';
    }
    if (this.prev()) {
      str += ' <';
    }
    if (this.next()) {
      str += ' >';
    }
    return str;
  }
}

Keyframe.DEFAULT_OPTIONS = {
  required: {
    component: true,
    timeline: true,
    element: true,
    row: true,
    ms: true,
    index: true,
    value: true,
  },
};

BaseModel.extend(Keyframe);

Keyframe.deselectAndDeactivateAllKeyframes = (criteria) => {
  Keyframe.where(criteria).forEach((keyframe) => {
    keyframe.unsetBodySelected();
    keyframe.deselect();
    keyframe.deactivate();
  });
};

Keyframe.getInferredUid = (row, ms) => {
  return `${row.getPrimaryKey()}-keyframe-${ms}`;
};

Keyframe.clearAllViewPositions = (filter) => {
  Keyframe.where(filter).forEach((keyframe) => {
    keyframe.clearViewPosition();
  });
};

Keyframe.buildKeyframeMoves = (criteria, serialized) => {
  // Keyframes not part of this object will be deleted from the bytecode
  const moves = {};

  const movables = Keyframe.where(Object.assign({_needsMove: true}, criteria));

  movables.forEach((movable) => {
    // As an optimization, skip any that we have already moved below in case of dupes
    if (!movable._needsMove) {
      return null;
    }

    const timelineName = movable.timeline.getName();
    const componentId = movable.element.getComponentId();
    const propertyName = movable.row.getPropertyNameString();

    if (!moves[timelineName]) {
      moves[timelineName] = {};
    }
    if (!moves[timelineName][componentId]) {
      moves[timelineName][componentId] = {};
    }
    if (!moves[timelineName][componentId][propertyName]) {
      moves[timelineName][componentId][propertyName] = {};
    }

    // Because the keyframe move action interprets excluded entries as *deletes*, we have to
    // also include all keyframes that are a part of the same timeline/component/property tuple
    Keyframe.where(criteria).forEach((partner) => {
      if (partner.timeline.getName() !== timelineName) {
        return null;
      }
      if (partner.element.getComponentId() !== componentId) {
        return null;
      }
      if (partner.row.getPropertyNameString() !== propertyName) {
        return null;
      }

      moves[timelineName][componentId][propertyName][partner.getMs()] = partner.getSpec(true, serialized);

      // Since this action resolves the move, exclude it from future calls until set again
      partner._needsMove = false;
    });

    moves[timelineName][componentId][propertyName][movable.getMs()] = movable.getSpec(true, serialized);

    // Since this action resolves the move, exclude it from future calls until set again
    movable._needsMove = false;
  });

  return moves;
};

Keyframe.findIntersectingWithArea = ({
  component,
  area,
  offset,
  viewCoordinatesProvider,
}) => {
  return Keyframe.where({component})
    .filter((keyframe) => {
      const keyframeView = keyframe.getViewPosition();

      if (!keyframeView.left || keyframe.element.isLocked()) {
        return false;
      }

      // First, check if the keyframe is contained in the marquee horizontally,
      // we perform this check first because we can't rely on the cached `y` value due
      // to the rows expanding/collapsing. Since we don't have a similar behavior that
      // modifies the `x` position of a keyframe post-render this is a safe filter to
      // avoid performing the expensive `getBoundingClientRect` calculation on all keyframes
      if (
        keyframeView.left - offset.horizontal > area.right ||
        area.left > keyframeView.right - offset.horizontal
      ) {
        return false;
      }

      const freshBounds = viewCoordinatesProvider(keyframe);

      return freshBounds && !(
        freshBounds.top > area.bottom ||
        area.top > freshBounds.bottom
      );
    })
    .reduce((acc, keyframe) => {
      return acc.set(keyframe.getUniqueKey(), keyframe);
    }, new Map());
};

Keyframe.marqueeSelect = ({
  component,
  area,
  offset,
  viewCoordinatesProvider,
}) => {
  const selected = Keyframe.findIntersectingWithArea({
    component,
    area,
    offset,
    viewCoordinatesProvider,
  });

  Keyframe.any({
    component,
    _selected: true,
  }).forEach((keyframe) => {
    if (!selected.has(keyframe.getUniqueKey())) {
      keyframe.deselect();
      if (keyframe.isConstantSegment() || keyframe.isTransitionSegment()) {
        keyframe.unsetBodySelected();
      }
      keyframe.updateActivationStatesInRow();
    }
  });

  selected.forEach((keyframe) => {
    keyframe.select();
    if (keyframe.isConstantSegment() || keyframe.isTransitionSegment()) {
      keyframe.setBodySelected();
    }
    keyframe.updateActivationStatesInRow();
  });
};

Keyframe.epandRowsOfSelectedKeyframes = ({component, from}) => {
  Keyframe.any({
    component,
    _selected: true,
  }).forEach((keyframe) => {
    if (!keyframe.row._isExpanded) {
      keyframe.row.expand({from});
    }
  });
};

Keyframe.groupIsSingleTween = (keyframes) => {
  return keyframes.length === 2 && keyframes[0].next() === keyframes[1] && keyframes[0].hasCurveBody();
};

/**
 * @method groupHasBezierEditableCurves
 * @description Determines if every keyframe in a group can be edited via the
 * Bezier Curve editor by the following criteria:
 * @returns boolean
 *
 * - Every keyframe has a curve body
 * - Every curve is the same curve (so they can all be edited with a single editor)
 * - Every curve can be represented via a single Bezier Curve (FIXME: allow chains of curves)
 */
Keyframe.groupHasBezierEditableCurves = (keyframes) => {
  if (!keyframes || keyframes.length === 0) {
    return false;
  }

  const referenceCurve = keyframes[0].getCurve();

  return keyframes
    .filter((kf) => kf.hasCurveBody())
    .every((kf) => kf.getCurve() === referenceCurve && !kf.hasDecomposableCurve());
};

module.exports = Keyframe;

// Down here to avoid Node circular dependency stub objects. #FIXME
const Timeline = require('./Timeline');
