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
  }

  activate () {
    if (!this._activated || !Keyframe._activated[this.getUniqueKey()]) {
      this._activated = true
      Keyframe._activated[this.getUniqueKey()] = this
      this.emit('update', 'keyframe-activated')
    }
    return this
  }

  deactivate () {
    if (this._activated || Keyframe._activated[this.getUniqueKey()]) {
      this._activated = false
      delete Keyframe._activated[this.getUniqueKey()]
      this.emit('update', 'keyframe-deactivated')
    }
    return this
  }

  isActive () {
    return this._activated
  }

  select (maybeEvent) {
    // TODO: This logic probably doesn't belong here; move up into React?
    if (maybeEvent) {
      maybeEvent.stopPropagation()

      if (!maybeEvent.shiftKey && !maybeEvent.ctrlKey) {
        Keyframe.deselectAllKeyframes()
      }
    } else {
      Keyframe.deselectAllKeyframes()
    }

    if (!this._selected || !Keyframe._selected[this.getUniqueKey()]) {
      this._selected = true
      Keyframe._selected[this.getUniqueKey()] = this
      this.emit('update', 'keyframe-selected')
    }
    return this
  }

  deselect () {
    if (this._selected || Keyframe._selected[this.getUniqueKey()]) {
      this._selected = false
      delete Keyframe._selected[this.getUniqueKey()]
      this.emit('update', 'keyframe-deselected')
    }
    return this
  }

  isSelected () {
    return this._selected
  }

  selectSelfAndSurrounds (maybeEvent) {
    this.select(maybeEvent)
    if (this.next()) {
      this.next().select(maybeEvent)
    }
    return this
  }

  isDeleted () {
    return this._isDeleted
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
    
    //TODO
    //TODO
    //TODO

    this.emit('update', 'keyframe-drag')
  }

  createKeyframe (value, ms, metadata) {
    this.row.createKeyframe(value, ms, metadata)
    return this
  }

  removeCurve (metadata) {
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

    return this
  }

  delete (metadata) {
    this.row.deleteKeyframe(this, metadata)
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
    return millisecondToNearestFrame(this.ms, mspf)
  }

  getMs () {
    return this.ms
  }

  setMs (ms) {
    this.ms = ms
    return this
  }

  getIndex () {
    return this.index
  }

  getValue () {
    return this.value
  }

  setCurve (value) {
    this.curve = value
    return this
  }

  getCurve () {
    return this.curve
  }

  setCurve (curve) {
    this.curve = curve
    return this
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
    return this.row.getKeyframes({ index: this.index + 1 })[0]
  }

  prev () {
    return this.row.getKeyframes({ index: this.index - 1 })[0]
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

  isWithinCollapsedProperty () {
    return this.row && this.row.isCollapsed()
  }

  getCurveCapitalized () {
    const curve = this.getCurve()
    return curve.charAt(0).toUpperCase() + curve.slice(1)
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
    index: true,
    value: true
  }
}

BaseModel.extend(Keyframe)

Keyframe._selected = {}
Keyframe._activated = {}

Keyframe.deselectAllKeyframes = function deselectAllKeyframes () {
  for (const key in Keyframe._selected) {
    Keyframe._selected[key].deselect()
  }
}

Keyframe.getInferredUid = function getInferredUid (row, index) {
  return `${row.getPrimaryKey()}-keyframe-${index}`
}

module.exports = Keyframe
