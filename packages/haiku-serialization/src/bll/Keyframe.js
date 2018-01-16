const assign = require('lodash.assign')
const expressionToRO = require('@haiku/player/lib/reflection/expressionToRO').default
const BaseModel = require('./BaseModel')

/**
 * @class Keyframe
 * @description
 *.  Abstraction over the raw representation of keyframes in bytecode.
 *.  Helps with the following:
 *.    - Managing state changes between keyframes: selected, dragging, etc.
 *.    - Makes complicated actions like dragging multiple keyframes easy
 *.    - Handling model updates like changing curves, changing the ms time, etc.
 *.    - Has some logic for color changes that probably should be moved #FIXME
 */
class Keyframe extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._selected = false
    this._activated = false
    this._dragStartPx = null
    this._dragStartMs = null
    this._isDeleted = false
    this._needsMove = false
    this._directlySelected = false
    this._selectedBody = false
    this._hasMouseDown = false
    this._lastMouseDown = 0
    this._didHandleDragStop = false
    this._didHandleContextMenu = false
    this._mouseDownState = {}
  }

  activate () {
    this._activated = true
    Keyframe._activated[this.getUniqueKey()] = this
    this.emitWithNeighbors('update', 'keyframe-activated')
    return this
  }

  deactivate () {
    this._activated = false
    delete Keyframe._activated[this.getUniqueKey()]
    this.emitWithNeighbors('update', 'keyframe-deactivated')
    return this
  }

  isActive () {
    return this._activated
  }

  select () {
    this._selected = true
    Keyframe._selected[this.getUniqueKey()] = this
    this.emitWithNeighbors('update', 'keyframe-selected')
    return this
  }

  deselect () {
    this.unsetDirectlySelected()
    this.unsetBodySelected()
    this._selected = false
    delete Keyframe._selected[this.getUniqueKey()]
    this.emitWithNeighbors('update', 'keyframe-deselected')
    return this
  }

  setBodySelected () {
    this._selectedBody = true
    this.emitWithNeighbors('update', 'keyframe-body-selected')
  }

  unsetBodySelected () {
    this._selectedBody = false
    this.emitWithNeighbors('update', 'keyframe-body-unselected')
  }

  toggleBodySelected () {
    if (this.isSelectedBody()) {
      this.unsetBodySelected()
    } else {
      this.setBodySelected()
    }
  }

  setDirectlySelected () {
    this._directlySelected = true
  }

  unsetDirectlySelected () {
    this._directlySelected = false
  }

  toggleDirectlySelected () {
    if (this.isDirectlySelected()) {
      this.unsetDirectlySelected()
    } else {
      this.setDirectlySelected()
    }
  }

  deselectAndDeactivate () {
    this.deselect()
    this.deactivate()
  }

  /*
   * @method toggleActive
   * @description A keyframe should be made active when:
   *   - It was clicked
   *   - A tween that belongs to it was clicked
   * Note the difference between this and selected
   */
  toggleActive () {
    if (this.isActive()) {
      this.deactivate()
    } else {
      this.activate()
    }
  }

  /*
   * @method toggleSelected
   * @description A keyframe should be made selected when:
   *   - It was clicked
   * Note the difference between this and active
   */
  toggleSelected () {
    if (this.isSelected()) {
      this.deselect()
    } else {
      this.select()
    }
  }

  selectSelfAndSurrounds () {
    this.select()
    // this.callOnSelfAndSurrounds('activate', {skipDeselect: true})
  }

  emitWithNeighbors (what, a, b, c, d, e) {
    this.emit(what, a, b, c, d, e)
    if (this.next()) this.next().emit(what, a, b, c, d, e)
    if (this.prev()) this.prev().emit(what, a, b, c, d, e)
    return this
  }

  isSelected () {
    return this._selected
  }

  isSelectedBody () {
    return this._selectedBody
  }

  isDirectlySelected () {
    return this._directlySelected
  }

  areAnyOthersSelected () {
    return this.othersSelected().length > 0
  }

  othersSelected () {
    const selected = []
    Keyframe.where({ _selected: true }).forEach((keyframe) => {
      if (keyframe !== this) {
        selected.push(keyframe)
      }
    })
    return selected
  }

  isDeleted () {
    return this._isDeleted
  }

  delete (metadata) {
    this.row.deleteKeyframe(this, metadata)
    this._isDeleted = true

    return this
  }

  dragStart (dragData) {
    this._dragStartMs = this.getMs()
    this._dragStartPx = dragData.x
    return this
  }

  dragStop (dragData) {
    this._dragStartMs = null
    this._dragStartPx = null
    return this
  }

  drag (pxpf, mspf, dragData, metadata) {
    const pxChange = dragData.lastX - this._dragStartPx
    const msChange = Math.round(pxChange / pxpf * mspf)

    this.move(msChange, this._dragStartMs, mspf)

    return this
  }

  move (msChange, msOrig, mspf) {
    const msFinal = msOrig + msChange
    if (msFinal >= 0) {
      this.moveTo(msFinal, mspf)
    }
    return this
  }

  moveTo (ms, mspf) {
    // No-op the rest of this procedure if we're already at the same keyframe
    if (this.getMs() === ms) {
      return this
    }

    this.setMs(ms)

    const msMargin = Math.round(mspf)

    if (this.next()) {
      if (this.getMs() >= (this.next().getMs() - 1)) {
        const nextMs = this.getMs() + msMargin
        if (nextMs >= 0) {
          this.next().moveTo(nextMs, mspf)
        }
      }
    }

    if (this.prev()) {
      if (this.getMs() <= (this.prev().getMs() + 1)) {
        const prevMs = this.getMs() - msMargin
        if (prevMs >= 0) {
          this.prev().moveTo(prevMs, mspf)
        }
      }
    }

    // I'm adding the zeroth keyframe only after the keyframe move action is complete,
    // otherwise the cleared cache in React will result in the dragging action to be stopped
    this.row._needsToEnsureZerothKeyframe = true

    return this
  }

  createKeyframe (value, ms, metadata) {
    this.row.createKeyframe(value, ms, metadata)
    return this
  }

  removeCurve (metadata) {
    if (this.next() && this.next().isActive()) {
      this.setCurve(null)
      this.component.splitSegment(
        this.element.getComponentId(),
        this.timeline.getName(),
        this.element.getNameString(),
        this.row.getPropertyNameString(),
        this.getMs(),
        metadata,
        () => {}
      )

      this.row.emit('update', 'keyframe-remove-curve')
    }

    return this
  }

  addCurve (curveName, metadata) {
    this.setCurve(curveName)

    this.component.joinKeyframes(
      this.element.getComponentId(),
      this.timeline.getName(),
      this.element.getNameString(),
      this.row.getPropertyNameString(),
      this.getMs(),
      null,
      curveName,
      metadata,
      () => {}
    )

    this.row.emit('update', 'keyframe-add-curve')

    return this
  }

  changeCurve (curveName, metadata) {
    this.setCurve(curveName)

    this.component.changeSegmentCurve(
      this.element.getComponentId(),
      this.timeline.getName(),
      this.row.getPropertyNameString(),
      this.getMs(),
      curveName,
      metadata,
      () => {}
    )

    this.row.emit('update', 'keyframe-change-curve')

    return this
  }

  incrementIndex () {
    this.index += 1
    this.uid = Keyframe.getInferredUid(this.row, this.index)
    return this
  }

  decrementIndex () {
    this.index -= 1
    this.uid = Keyframe.getInferredUid(this.row, this.index)
    return this
  }

  isTransitionSegment () {
    return !!this.getCurve()
  }

  isConstantSegment () {
    return this.hasNextKeyframe()
  }

  isSoloKeyframe () {
    const prev = this.prev()
    if (!prev) return true
    return !prev.getCurve()
  }

  hasPreviousKeyframe () {
    return !!this.prev()
  }

  hasNextKeyframe () {
    return !!this.next()
  }

  getUniqueKey () {
    return `${this.getUniqueKeyWithoutTimeIncluded()}-${this.getMs()}`
  }

  getUniqueKeyWithoutTimeIncluded () {
    return `${this.row.getUniqueKey()}-${this.getIndex()}`
  }

  isWithinCollapsedRow () {
    return this.row.isCollapsed() || this.row.isWithinCollapsedRow()
  }

  getFrame (mspf) {
    return Timeline.millisecondToNearestFrame(this.getMs(), mspf)
  }

  getMs () {
    return this.ms
  }

  setMs (ms) {
    if (ms < 0) {
      throw new Error('keyframes cannot be less than 0')
    }

    // Normalize to a millitime that lines up with a frametime
    const normalized = this.timeline.normalizeMs(ms)

    if (normalized !== this.getMs()) {
      this.ms = normalized

      // Indicate that we need to be moved. Must set this before calling handleKeyframeMoves
      // otherwise the update might not make it correctly to the serialization layer
      this._needsMove = true

      this.emit('update', 'keyframe-ms-set')

      // This runs a debounced move action
      this.component.handleKeyframeMove()

      if (this.prev()) {
        this.prev().emit('update', 'keyframe-neighbor-move')
      }

      if (this.next()) {
        this.next().emit('update', 'keyframe-neighbor-move')
      }
    }

    return this
  }

  getIndex () {
    return this.index
  }

  getValue (serialized) {
    if (serialized) {
      return expressionToRO(this.value)
    }
    return this.value
  }

  getSpec (edited, serialized) {
    const spec = {
      value: this.getValue(serialized)
    }

    if (edited) {
      spec.edited = true
    }

    if (this.getCurve()) {
      spec.curve = this.getCurve()
    }

    return spec
  }

  setCurve (value) {
    this.curve = value
    return this
  }

  getCurve () {
    return this.curve
  }

  isVisible (a, b) {
    if (this.getMs() > b) {
      return false
    }

    const next = this.next()
    if (this.getMs() < a && (next && next.getMs() < a)) {
      return false
    }

    return true
  }

  next () {
    return this.cacheFetch('next', () => {
      return this.row.getKeyframes({ index: this.index + 1 })[0]
    })
  }

  prev () {
    return this.cacheFetch('prev', () => {
      return this.row.getKeyframes({ index: this.index - 1 })[0]
    })
  }

  isNextKeyframeSelected () {
    return this.next() && this.next().isSelected()
  }

  isNextKeyframeActive () {
    return this.next() && this.next().isActive()
  }

  getPixelOffsetRight (base, pxpf, mspf) {
    if (base === undefined || pxpf === undefined || mspf === undefined) {
      throw new Error(`keyframe pixel offset right params missing`)
    }
    if (this.next()) {
      return (this.next().getFrame(mspf) - base) * pxpf
    } else {
      return 0
    }
  }

  getPixelOffsetLeft (base, pxpf, mspf) {
    if (base === undefined || pxpf === undefined || mspf === undefined) {
      throw new Error(`keyframe pixel offset left params missing`)
    }
    return (this.getFrame(mspf) - base) * pxpf
  }

  isWithinCollapsedClusterHeadingRow () {
    return (
      this.row &&
      this.row.parent &&
      this.row.parent.isClusterHeading() &&
      this.row.parent.isCollapsed()
    )
  }

  isClusterMember () {
    return (
      this.row &&
      this.row.parent &&
      this.row.parent.isClusterHeading()
    )
  }

  getElementHeadingRow () {
    if (this.row && this.row.parent) {
      if (this.row.parent.isClusterHeading()) {
        return this.row.parent.parent
      }
      return this.row.parent
    }
  }

  getClusterHeadingRow () {
    if (this.row && this.row.parent) {
      if (this.row.parent.isClusterHeading()) {
        return this.row.parent
      }
    }
  }

  getCurveCapitalized () {
    const curve = this.getCurve()
    return curve.charAt(0).toUpperCase() + curve.slice(1)
  }

  isWithinCollapsedElementHeadingRow () {
    const elementHeading = this.getElementHeadingRow()
    return elementHeading.isCollapsed() || elementHeading.isWithinCollapsedRow()
  }

  getLeftKeyframeColorState () {
    if (this.isWithinCollapsedElementHeadingRow()) {
      return 'BLUE'
    }

    if (this.isWithinCollapsedClusterHeadingRow()) {
      return 'DARK_ROCK'
    }

    return (this.isActive() || this.isDirectlySelected())
      ? 'LIGHTEST_PINK'
      : 'ROCK'
  }

  getRightKeyframeColorState () {
    if (this.isWithinCollapsedElementHeadingRow()) {
      return 'BLUE'
    }

    if (this.isWithinCollapsedClusterHeadingRow()) {
      return 'DARK_ROCK'
    }

    if (this.next() && (this.next().isActive() || this.next().isDirectlySelected())) {
      return 'LIGHTEST_PINK'
    } else {
      return 'ROCK'
    }
  }

  getCurveColorState () {
    if (this.isWithinCollapsedElementHeadingRow()) {
      return 'BLUE'
    }

    if (this.isWithinCollapsedClusterHeadingRow()) {
      return 'DARK_ROCK'
    }

    if (this.isSelectedBody()) {
      return 'LIGHTEST_PINK'
    }

    if (this.isSelected() && this.isActive() && this.isDirectlySelected()) {
      return 'LIGHTEST_PINK'
    }

    return 'ROCK'
  }

  setMouseDown () {
    this._hasMouseDown = true
    this._lastMouseDown = Date.now()
  }

  getLastMouseDown () {
    return this._lastMouseDown
  }

  unsetMouseDown () {
    this._hasMouseDown = false
  }

  isMouseDown () {
    return this._hasMouseDown
  }

  setMouseDownState ({
    isSelected,
    isSelectedBody,
    isActive,
    isCurveTargeted,
    isPrevBodySelected
  }) {
    this._mouseDownState = {
      isSelected,
      isSelectedBody,
      isActive,
      isCurveTargeted,
      isPrevBodySelected
    }
  }

  unsetMouseDownState () {
    this._mouseDownState = {}
  }

  getMouseDownState () {
    return this._mouseDownState
  }

  setDidHandleDragStop () {
    this._didHandleDragStop = true
  }

  unsetDidHandleDragStop () {
    this._didHandleDragStop = false
  }

  didHandleDragStop () {
    return this._didHandleDragStop
  }

  setDidHandleContextMenu () {
    this._didHandleContextMenu = true
  }

  unsetDidHandleContextMenu () {
    this._didHandleContextMenu = false
  }

  didHandleContextMenu () {
    return this._didHandleContextMenu
  }

  handleMouseDown (
    {nativeEvent: {which}},
    {isShiftKeyDown, isControlKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView}
  ) {
    if (isControlKeyDown) {
      return this.handleContextMenu(
        {isShiftKeyDown, isControlKeyDown},
        {isViaConstantBodyView, isViaTransitionBodyView}
      )
    }

    this.setMouseDown()
    this.unsetDidHandleDragStop()

    this.setMouseDownState({
      isSelected: this.isSelected(),
      isSelectedBody: this.isSelectedBody(),
      isActive: this.isActive(),
      isCurveTargeted: isViaTransitionBodyView || isViaConstantBodyView,
      isPrevBodySelected: this.prev() && this.prev().isSelectedBody()
    })

    this.ensureIsSelected(isViaTransitionBodyView || isViaConstantBodyView)
    this.highlightNextAccordingToOurStatus()
  }

  handleMouseUp (
    {nativeEvent: {which}},
    {lastMouseButtonPressed, isShiftKeyDown, isControlKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView}
  ) {
    if (!this.isMouseDown()) {
      // We weren't the one who received the initial mouse down
      const otherKeyframe = Keyframe.where({ _hasMouseDown: true })[0]
      if (otherKeyframe && otherKeyframe !== this) {
        otherKeyframe.handleMouseUp(
          {nativeEvent: {which}},
          {lastMouseButtonPressed, isShiftKeyDown, isControlKeyDown},
          {isViaConstantBodyView, isViaTransitionBodyView}
        )
      }
      return
    }

    this.unsetMouseDown()

    if (this.didHandleDragStop()) {
      this.unsetDidHandleDragStop()
      return
    }

    if (!isShiftKeyDown) {
      this.clearOtherKeyframes()
    }

    const {
      isSelected,
      isSelectedBody,
      isCurveTargeted,
      isPrevBodySelected
    } = this.getMouseDownState()
    this.unsetMouseDownState()

    if (isCurveTargeted) {
      if (isSelected) {
        if (!isSelectedBody) {
          this.setBodySelected()
          this.activate()
        } else {
          this.unsetBodySelected()
        }
      } else {
        this.setBodySelected()
        this.activate()
        this.select()
      }
    } else {
      if (isSelected) {
        if (isSelectedBody) {
          this.unsetBodySelected()
        } else {
          if (isPrevBodySelected) {
            this.prev().unsetBodySelected()
          } else {
            this.deactivate()
            this.deselect()
          }
        }
      } else {
        this.select()
        this.activate()
      }
    }

    this.highlightNextAccordingToOurStatus()
  }

  handleDragStop (
    dragData,
    {wasDrag, lastMouseButtonPressed, isShiftKeyDown, isControlKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView}
  ) {
    if (!wasDrag) {
      return this.handleMouseUp(
        {nativeEvent: {which: 1}}, // Mock
        {isShiftKeyDown, isControlKeyDown},
        {isViaConstantBodyView, isViaTransitionBodyView}
      )
    }

    if (this.didHandleDragStop()) {
      this.unsetDidHandleDragStop()
      return
    }

    this.setDidHandleDragStop()
    this.component.dragStopActiveKeyframes(dragData)
  }

  handleContextMenu (
    {isShiftKeyDown},
    {isViaConstantBodyView, isViaTransitionBodyView}
  ) {
    this.unsetMouseDown()
    this.unsetMouseDownState()

    if (this.didHandleContextMenu()) {
      this.unsetDidHandleContextMenu()
      return
    }

    this.setDidHandleContextMenu()

    if (this.isWithinCollapsedRow()) {
      return
    }

    this.ensureIsSelected(isViaTransitionBodyView || isViaConstantBodyView)
    this.highlightNextAccordingToOurStatus()
  }

  ensureIsSelected (isCurveTargeted) {
    if (!this.isSelected()) this.select()
    if (!this.isActive()) this.activate()
    if (isCurveTargeted) {
      if (!this.isSelectedBody()) this.setBodySelected()
    }
  }

  highlightNextAccordingToOurStatus () {
    // For visual consistency, highlight the next keyframe if we are on a segment
    const nextKeyframe = this.next()
    if (nextKeyframe) {
      if (this.isSelected() && this.isSelectedBody()) {
        nextKeyframe.select()
        nextKeyframe.activate()
      }
    }
  }

  clearOtherKeyframes () {
    Keyframe.all().forEach((keyframe) => {
      if (keyframe !== this) keyframe.deselectAndDeactivate()
    })
  }

  /**
   * @method dump
   * @description When debugging, use this to log a concise shorthand of this entity.
   */
  dump () {
    let str = `${this.row.getPropertyNameString()}[${this.getIndex()}]:${this.getMs()}/${this.getCurve() || '!'}`
    if (this.isTransitionSegment()) str += ' {t}'
    if (this.isConstantSegment()) str += ' {c}'
    if (this.isSoloKeyframe()) str += ' {s}'
    if (this.prev()) str += ' <'
    if (this.next()) str += ' >'
    return str
  }
}

Keyframe.DEFAULT_OPTIONS = {
  required: {
    component: true,
    timeline: true,
    element: true,
    row: true,
    ms: true,
    originalMs: true,
    index: true,
    value: true
  }
}

BaseModel.extend(Keyframe)

Keyframe._selected = {}
Keyframe._activated = {}

Keyframe.deselectAndDeactivateAllKeyframes = function deselectAndDeactivateAllKeyframes (criteria) {
  Keyframe.where(criteria).forEach((keyframe) => {
    keyframe.deselect()
    keyframe.deactivate()
  })
}

Keyframe.getInferredUid = function getInferredUid (row, index) {
  return `${row.getPrimaryKey()}-keyframe-${index}`
}

Keyframe.buildKeyframeMoves = function buildKeyframeMoves (criteria, serialized) {
  // Keyframes not part of this object will be deleted from the bytecode
  const moves = {}

  const movables = Keyframe.where(assign({ _needsMove: true }, criteria))

  movables.forEach((movable) => {
    // As an optimization, skip any that we have already moved below in case of dupes
    if (!movable._needsMove) return null

    const timelineName = movable.timeline.getName()
    const componentId = movable.element.getComponentId()
    const propertyName = movable.row.getPropertyNameString()

    if (!moves[timelineName]) moves[timelineName] = {}
    if (!moves[timelineName][componentId]) moves[timelineName][componentId] = {}
    if (!moves[timelineName][componentId][propertyName]) moves[timelineName][componentId][propertyName] = {}

    moves[timelineName][componentId][propertyName][movable.getMs()] = movable.getSpec(true, serialized)

    // Since this action resolves the move, exclude it from future calls until set again
    movable._needsMove = false

    // Because the keyframe move action interprets excluded entries as *deletes*, we have to
    // also include all keyframes that are a part of the same timeline/component/property tuple
    Keyframe.where(criteria).forEach((partner) => {
      if (partner.isDeleted()) return null
      if (partner.timeline.getName() !== timelineName) return null
      if (partner.element.getComponentId() !== componentId) return null
      if (partner.row.getPropertyNameString() !== propertyName) return null

      moves[timelineName][componentId][propertyName][partner.getMs()] = partner.getSpec(true, serialized)

      // Since this action resolves the move, exclude it from future calls until set again
      partner._needsMove = false
    })
  })

  return moves
}

module.exports = Keyframe

// Down here to avoid Node circular dependency stub objects. #FIXME
const Timeline = require('./Timeline')
