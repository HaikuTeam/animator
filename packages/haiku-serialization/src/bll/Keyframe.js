const expressionToRO = require('@haiku/player/lib/reflection/expressionToRO').default
const BaseModel = require('./BaseModel')
const millisecondToNearestFrame = require('./helpers/millisecondToNearestFrame')

class Keyframe extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._selected = false
    this._activated = false
    this._dragStartPx = null
    this._dragStartMs = null
    this._isDeleted = false
    this._needsMove = false
  }

  activate () {
    if (!this._activated || !Keyframe._activated[this.getUniqueKey()]) {
      this._activated = true
      Keyframe._activated[this.getUniqueKey()] = this
      this.emitWithNeighbors('update', 'keyframe-activated')
    }
    return this
  }

  deactivate () {
    if (this._activated || Keyframe._activated[this.getUniqueKey()]) {
      this._activated = false
      delete Keyframe._activated[this.getUniqueKey()]
      this.emitWithNeighbors('update', 'keyframe-deactivated')
    }
    return this
  }

  isActive () {
    return this._activated
  }

  select (config) {
    if (config) {
      if (config.skipDeselect) {
        // do nothing
      } else {
        Keyframe.deselectAndDeactivateAllKeyframes()
      }
    } else {
      Keyframe.deselectAndDeactivateAllKeyframes()
    }

    if (
      (!this._selected || !this._selectedBody) ||
      !Keyframe._selected[this.getUniqueKey()]
    ) {
      this._selected = true
      if (config.selectConstBody) this._selectedBody = true
      if (config.directlySelected) this._directlySelected = true
      Keyframe._selected[this.getUniqueKey()] = this
      this.emitWithNeighbors('update', 'keyframe-selected')
    }

    return this
  }

  deselect () {
    if (this._selected || Keyframe._selected[this.getUniqueKey()]) {
      this._selected = false
      this._selectedBody = false
      this._directlySelected = false
      delete Keyframe._selected[this.getUniqueKey()]
      this.emitWithNeighbors('update', 'keyframe-deselected')
    }
    return this
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

  selectSelfAndSurrounds (config) {
    this.select(config)
    if (this.next()) {
      // HACK: Normally selecting a keyframe deselects all others, but in this
      // case we want to retain the one we selected in the line above, so add
      // this property to the event/config to prevent that behavior
      this.next().select({ skipDeselect: true })
    }
    return this
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
    this.activate()
    this._dragStartMs = this.getMs()
    this._dragStartPx = dragData.x
    return this
  }

  dragStop (dragData) {
    this.deactivate()
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
    if (this.next() && this.next().isSelected()) {
      this.setCurve(null)
      this.component.splitSegment(
        [this.element.getComponentId()],
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
      [this.element.getComponentId()],
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
      [this.element.getComponentId()],
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
    return `${this.row.getPropertyNameString()}-${this.getIndex()}-${this.getMs()}`
  }

  getUniqueKeyWithoutTimeIncluded () {
    return `${this.row.getPropertyNameString()}-${this.getIndex()}`
  }

  isWithinCollapsedRow () {
    return this.row.isCollapsed() || this.row.isWithinCollapsedRow()
  }

  getFrame (mspf) {
    return millisecondToNearestFrame(this.getMs(), mspf)
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
    return this.cacheFetch(('next'), () => {
      return this.row.getKeyframes({ index: this.index + 1 })[0]
    })
  }

  prev () {
    return this.cacheFetch(('prev'), () => {
      return this.row.getKeyframes({ index: this.index - 1 })[0]
    })
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

    if (this.isSelected() && this.next() && this.next().isSelected()) {
      return 'LIGHTEST_PINK'
    }

    return 'ROCK'
  }

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

Keyframe.deselectAndDeactivateAllKeyframes = function deselectAndDeactivateAllKeyframes () {
  for (const key in Keyframe._selected) {
    Keyframe._selected[key].deselect()
  }
  for (const key in Keyframe._activated) {
    Keyframe._activated[key].deactivate()
  }
}

Keyframe.getInferredUid = function getInferredUid (row, index) {
  return `${row.getPrimaryKey()}-keyframe-${index}`
}

Keyframe.buildKeyframeMoves = function buildKeyframeMoves (serialized) {
  // Keyframes not part of this object will be deleted from the bytecode
  const moves = {}

  const movables = Keyframe.where({ _needsMove: true })

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
    Keyframe.all().forEach((partner) => {
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
