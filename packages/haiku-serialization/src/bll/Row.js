const { Experiment, experimentIsEnabled } = require('haiku-common/lib/experiments')
const BaseModel = require('./BaseModel')
const TimelineProperty = require('haiku-serialization/src/bll/TimelineProperty')

const NAVIGATION_DIRECTIONS = {
  SAME: 0,
  NEXT: +1,
  PREV: -1
}

/**
 * @class Row
 * @description
 *.  Abstraction over the concept of a row that appears in the Timeline UI.
 *.  In practice this is only used in the Timeline UI for managing the display
 *.  of rows.
 *
 *.  Things that can be a row:
 *.    - A row of a single property
 *.    - A row of a complex property's subproperty
 *.    - The heading of a set of complex properties
 *.    - The heading of an element (or component)
 *
 *.  Rows are nested per the groupings mentioned above, so you can call row.children
 *.  to get the rows that would be displayed inside/underneath that row in question
 *.  (presuming that they are visible per the visibility rules).
 */

class Row extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this._isSelected = false
    this._isFocused = false
    this._isExpanded = false
    this._isActive = false
    this._isHidden = false
    this._isHovered = false

    // Hacky check whether we've already auto-expanded this row
    this._wasInitiallyExpanded = false
  }

  getUniqueKey () {
    return `${this.element.getComponentId()}+${this.element.getComponentId()}-${this.getType()}-${this.getClusterNameString()}-${this.getPropertyNameString()}`
  }

  deselectOthers (metadata, skipSelectElements = false) {
    // Deselect all other rows; currently assume only one row selected at a time
    Row.where({ component: this.component }).forEach((row) => {
      if (row === this) return null
      row.deselect(metadata, skipSelectElements)
    })
  }

  select (metadata) {
    if (!this._isSelected) {
      // The purpose of the `true` argument here tells the instruction to
      // deselect the other rows, but not deselect all their respective elements;
      // we need all processes to have a correct record of the actual number of
      // elements which are explicitly selected on stage, otherwise certain behavior,
      // such as the topbar controls, will not behave correctly.
      this.deselectOthers(metadata, true)

      this._isSelected = true
      this.emit('update', 'row-selected', metadata)

      // Roundabout! Note that elements, when selected, will select their corresponding row
      if (this.isHeading() && this.element && !this.element.isSelected()) {
        this.element.select(metadata)
      }
    }
    return this
  }

  deselect (metadata, skipSelectElements = false) {
    if (this._isSelected) {
      this._isSelected = false
      this.emit('update', 'row-deselected', metadata)

      // Roundabout! Note that elements, when unselected, will unselect their corresponding row
      if (!skipSelectElements && this.isHeading() && this.element && this.element.isSelected()) {
        this.element.unselect(metadata)
      }
    }
    return this
  }

  isSelected () {
    return this._isSelected
  }

  activate () {
    if (!this._isActive) {
      this._isActive = true
      this.emit('update', 'row-activated')
    }
    return this
  }

  deactivate () {
    if (this._isActive) {
      this._isActive = false
      this.emit('update', 'row-deactivated')
    }
    return this
  }

  isActive () {
    return this._isActive
  }

  expand (metadata) {
    if (!this._isExpanded) {
      this._isExpanded = true
      this.emit('update', 'row-expanded', metadata)
    }

    // If we are expanded, we also need our parent to be expanded
    if (this.parent) {
      this.parent.expand(metadata)
    }

    return this
  }

  collapse (metadata) {
    if (this._isExpanded) {
      this._isExpanded = false
      this.emit('update', 'row-collapsed', metadata)
    }
    return this
  }

  isCollapsed () {
    // Something that has no inner contents cannot be 'collapsed'
    if (this.isProperty()) {
      return false
    }
    return !this._isExpanded
  }

  isExpanded () {
    // Something that has no inner contents cannot be 'collapsed'
    if (this.isProperty()) {
      return true
    }
    return this._isExpanded
  }

  blurOthers (metadata) {
    Row.where({ component: this.component }).forEach((row) => {
      if (row !== this) {
        row.blur(metadata)
      }
    })
  }

  focus (metadata) {
    if (!this._isFocused) {
      this.blurOthers(metadata)

      this._isFocused = true
      this.emit('update', 'row-focused', metadata)
    }
    return this
  }

  blur (metadata) {
    if (this._isFocused) {
      this._isFocused = false
      this.emit('update', 'row-blurred', metadata)
    }
    return this
  }

  isFocused () {
    return this._isFocused
  }

  hide () {
    if (!this._isHidden) {
      this._isHidden = true
      this.emit('update', 'row-hidden')
    }
    return this
  }

  show () {
    if (this._isHidden) {
      this._isHidden = false
      this.emit('update', 'row-shown')
    }
    return this
  }

  isHidden () {
    return this._isHidden
  }

  hover (metadata) {
    if (!this._isHovered) {
      this._isHovered = true
      this.emit('update', 'row-hovered')

      // Roundabout! Note that elements, when hovered, will hover their corresponding row
      if (this.isHeading() && this.element && !this.element.isHovered() && !this.element.isSelected()) {
        this.element.hoverOn(metadata)
      }
    }
    return this
  }

  isHovered () {
    return this._isHovered
  }

  hoverAndUnhoverOthers (metadata) {
    Row.where({ component: this.component }).forEach((row) => {
      if (row !== this) row.unhover(metadata)
    })
    this.hover(metadata)
  }

  unhover (metadata) {
    if (this._isHovered) {
      this._isHovered = false
      this.emit('update', 'row-unhovered')

      // Roundabout! Note that elements, when hovered, will hover their corresponding row
      if (this.isHeading() && this.element && this.element.isHovered()) {
        this.element.hoverOff(metadata)
      }
    }
    return this
  }

  expandAndSelect (metadata) {
    if (!this.isExpanded()) {
      this.expand(metadata)
    }
    if (!this.isSelected()) {
      this.select(metadata)
    }
    return this
  }

  collapseAndDeselect (metadata) {
    if (this.isExpanded()) {
      this.collapse(metadata)
    }
    if (this.isSelected()) {
      this.deselect(metadata)
    }
    return this
  }

  getBaselineValueAtMillisecond (ms) {
    const { baselineValue } = Timeline.getPropertyValueDescriptor(this, {
      timelineTime: ms,
      timelineName: this.timeline.getName()
    })

    return baselineValue
  }

  getBaselineCurveAtMillisecond (ms) {
    const { baselineCurve } = Timeline.getPropertyValueDescriptor(this, {
      timelineTime: ms,
      timelineName: this.timeline.getName()
    })

    return baselineCurve
  }

  delete () {
    // Deleting a parent row means the children also have to go
    this.children.forEach((child) => {
      child.delete()
    })

    this.destroy()
  }

  visit (visitor) {
    visitor(this)
    this.children.forEach((child) => {
      child.visit(visitor)
    })
  }

  rehydrate () {
    this.rehydrateKeyframes()
    this.emit('update', 'row-rehydrated')
    // Need to inform our heading row about the update or else updates to rows within collapsed rows
    // won't see their keyframe updates reflected within the timeline
    if (this.parent) {
      this.parent.emit('update', 'child-row-rehydrated')
    }
  }

  getKeyframesDescriptor () {
    return TimelineProperty.getValueGroup(
      this.element.getComponentId(),
      this.component.getCurrentTimelineName(),
      this.getPropertyNameString(),
      this.component.getReifiedBytecode()
    )
  }

  rehydrateKeyframes () {
    const valueGroup = this.getKeyframesDescriptor()

    if (!valueGroup) {
      return []
    }

    const keyframesList = Object.keys(valueGroup)
      .map((keyframeKey) => parseInt(keyframeKey, 10))
      .sort((a, b) => a - b)

    if (keyframesList.length < 1) {
      return []
    }

    this.getKeyframes().forEach((keyframe) => {
      keyframe.mark()
    })

    for (let i = 0; i < keyframesList.length; i++) {
      let mscurr = keyframesList[i]

      if (isNaN(mscurr)) {
        continue
      }

      // Unknown why, but sometimes this isn't present and we crash
      if (!valueGroup[mscurr] || valueGroup[mscurr].value === undefined) {
        continue
      }

      const value = valueGroup[mscurr].value

      let curve = valueGroup[mscurr].curve
      // The upsert assumes that undefined means 'leave the previous value', so if we
      // get an undefined curve here, we need to set it explicitly as 'null' to unset
      // the curve from the previous keyframe object that lives at this uid
      if (curve === undefined) {
        curve = null
      }

      const uid = Keyframe.getInferredUid(this, mscurr)

      Keyframe.upsert({
        // The keyframe's uid is in the context of the row, which is in turn in context of the component
        uid,
        origMs: mscurr,
        ms: mscurr,
        index: i,
        value,
        curve,
        row: this,
        element: this.element,
        timeline: this.timeline,
        component: this.component
      }, {})
    }

    this.getKeyframes().forEach((keyframe) => {
      keyframe.sweep()
    })

    const updatedKeyframes = this.getKeyframes()

    updatedKeyframes.forEach((keyframe, idx) => {
      keyframe._prev = updatedKeyframes[idx - 1]
      keyframe._next = updatedKeyframes[idx + 1]
    })
  }

  createKeyframe (value, ms, metadata) {
    // If creating a keyframe on a cluster row, create one for all of the child rows
    if (this.isClusterHeading()) {
      this.children.forEach((child) => child.createKeyframe(value, ms, metadata))
      return this.expandAndSelect(metadata)
    }

    let valueToAssign

    // If no value provided, we'll grab a value from existing keyframes here
    if (value === undefined) {
      // Otherwise, grab the value from the previous keyframe known in the sequence
      valueToAssign = this.getBaselineValueAtMillisecond(ms)
    } else {
      valueToAssign = value
    }

    const curveToAssign = this.getBaselineCurveAtMillisecond(ms)

    // Lock sync on deep SVG attributes change
    const parentSVG = this.element.getParentSvgElement()
    let options = {}
    if (parentSVG && this.element !== parentSVG) {
      options = {setElementLockStatus: {[parentSVG.getComponentId()]: true}}
    }

    // Update the bytecode directly via ActiveComponent, which updates Timeline UI.
    // Note that createKeyframe handles rehydrating the keyframes with correct indices.
    this.component.createKeyframe(
      this.element.getComponentId(),
      this.timeline.getName(),
      this.element.getNameString(),
      this.getPropertyNameString(),
      ms,
      valueToAssign,
      curveToAssign,
      null, // end ms, not used?
      null, // end value, not used?
      options,
      metadata,
      () => {}
    )

    // Clear timeline caches; the max frame might have changed.
    Timeline.clearCaches()

    this.emit('update', 'keyframe-create')

    if (this.parent) {
      this.parent.emit('update', 'keyframe-create')

      if (this.parent.parent) this.parent.parent.emit('update', 'keyframe-create')
    }
  }

  deleteKeyframe (keyframe, metadata) {
    keyframe.destroy()

    // Note that component.deleteKeyframe handles rehydrating keyframes with the correct indices
    this.component.deleteKeyframe(
      this.element.getComponentId(),
      this.timeline.getName(),
      this.getPropertyNameString(),
      keyframe.getMs(),
      metadata,
      () => {}
    )

    // Clear timeline caches; the max frame might have changed.
    Timeline.clearCaches()

    this.emit('update', 'keyframe-delete')
    if (this.parent) this.parent.emit('update', 'keyframe-delete')
  }

  getDescriptor () {
    return this.property
  }

  getKeyframes () {
    return Keyframe.where({row: this}).sort((a, b) => a.index - b.index)
  }

  getKeyframeByMs (ms) {
    return this.getKeyframes().filter((keyframe) => {
      return keyframe.getMs() === ms
    })[0]
  }

  mapVisibleKeyframes ({ maxDepth = Infinity }, iteratee) {
    // Avoid extra computation by not returning keyframes from too deep in the tree
    if (this.getDepthAmongRows() > maxDepth) {
      return []
    }

    // If we are a heading row (either a cluster or an element), we have no keyframes,
    // so we instead query our children for the list of keyframes within us
    if (this.isHeading() || this.isClusterHeading()) {
      return [...this.children.map((child) => child.mapVisibleKeyframes({ maxDepth }, iteratee))]
    }

    return this.getKeyframes().map(iteratee)
  }

  isState () {
    return this.property && this.property.type === 'state'
  }

  isFirstRowOfSubElementSet () {
    if (this.isHeading()) return true
    const prev = this.prev()
    if (!prev) return true
    if (prev.element !== this.element) return true
    if (prev.isHeading()) return true
    if (prev.isClusterHeading()) {
      return prev.isFirstRowOfSubElementSet()
    }
    return false
  }

  isLastRowOfSubElementSet () {
    const next = this.next()
    if (!next) return true
    if (next.element !== this.element) return true
    return false
  }

  isFirstRowOfPropertyCluster () {
    return this.cluster && this.property && this.getIndexWithinParentRow() === 0
  }

  isClusterProperty () {
    return this.cluster && !this.property
  }

  isClusterHeading () {
    return this.cluster && !this.property
  }

  isCluster () {
    return !!this.cluster
  }

  isProperty () {
    return !!this.property
  }

  isPropertyOfName (propertyName) {
    return (
      this.property &&
      this.property.name === propertyName
    )
  }

  isHeading () {
    return !this.property && !this.cluster
  }

  getType () {
    if (this.isClusterHeading()) return 'cluster-heading'
    if (this.isHeading()) return 'element-heading'
    if (this.isProperty()) return 'property'
    return 'unknown'
  }

  getAddress () {
    let id
    if (this.isHeading()) id = 'heading'
    else if (this.isClusterHeading()) id = 'cluster-heading'
    else id = this.getPropertyNameString()
    return `${this.element.getGraphAddress()}/${id}`
  }

  getClusterNameString () {
    return this.cluster && this.cluster.name
  }

  getPropertyNameString () {
    return this.property && this.property.name
  }

  getClusterValues () {
    return this.children.map((row) => {
      return row.getPropertyValueDescriptor()
    })
  }

  getPropertyValueDescriptor () {
    return Timeline.getPropertyValueDescriptor(this, { numFormat: '0,0[.]000' })
  }

  getPropertyId () {
    return `${this.element.getComponentId()}-${this.element.getNameString()}-${this.getPropertyNameString()}`
  }

  getInputPropertyId () {
    return `property-input-field-box-${this.getPropertyId()}`
  }

  // This is a dupe of getPropertyNameString, not sure which is preferred
  getPropertyName () {
    return this.property && this.property.name
  }

  isClusterActivated (item) {
    return false // TODO
  }

  isRootRow () {
    return !this.parent
  }

  isWithinCollapsedRow () {
    return this.parent && (this.parent.isCollapsed() || this.parent.isWithinCollapsedRow())
  }

  representsStringNode () {
    return typeof this.element.getStaticTemplateNode() === 'string'
  }

  clearEntityCaches () {
    if (this.children) {
      this.children.forEach((row) => {
        row.cache.clear()
        row.clearEntityCaches()
      })
    }

    this.getKeyframes().forEach((keyframe) => {
      keyframe.cache.clear()
    })
  }

  getPosition () {
    if (typeof this.position === 'number') return this.position
    return Number.MAX_SAFE_INTEGER
  }

  setPosition (position) {
    this.position = position
  }

  getDepthAmongRows () {
    let depth = 0
    let parent = this.parent
    while (parent) {
      depth += 1
      parent = parent.parent
    }
    return depth
  }

  getDepthAmongElements () {
    return this.element.getDepthAmongElements()
  }

  getAllSiblings () {
    return (this.parent && this.parent.children) || []
  }

  getIndexWithinParentRow () {
    const siblings = this.getAllSiblings()
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === this) return i
    }
    return 0
  }

  doesTargetHostElement () {
    return (
      this.host &&
      this.host === this.element
    )
  }

  next () {
    return this._next
  }

  prev () {
    return this._prev
  }

  /**
   * @method dump
   * @description When debugging, use this to log a concise shorthand of this entity.
   */
  dump () {
    let str = `${this.getType()}.${this.element.getComponentId()}<${this.element.getSafeDomFriendlyName()}>|${this.getDepthAmongRows()}.${this.getIndexWithinParentRow()}`
    if (this.isCluster()) str += `.${this.cluster.prefix}[]`
    if (this.isProperty()) str += `.${this.getPropertyName()}`
    return str
  }
}

Row.DEFAULT_OPTIONS = {
  required: {
    timeline: true, // Timeline
    element: true, // Element
    component: true // Component
  }
}

BaseModel.extend(Row, { useQueryCache: experimentIsEnabled(Experiment.BaseModelQueryCache) })

Row.top = (criteria) => {
  return Row.find(Object.assign({ parent: null }, criteria))
}

Row.findByComponentAndHaikuId = (component, haikuId) => {
  return Row.where({ component }).filter((row) => {
    return row.element.getComponentId() === haikuId
  })[0]
}

Row.findPropertyRowsByComponentAndParentHaikuId = (component, haikuId) => {
  return Row.where({ component }).filter((row) => {
    return row.isProperty() && row.parent && row.parent.element.getComponentId() === haikuId
  })
}

Row.cyclicalNav = (criteria, row, navDir) => {
  let target

  if (navDir === undefined || navDir === null || navDir === NAVIGATION_DIRECTIONS.SAME) {
    target = row
  } else if (row && navDir === NAVIGATION_DIRECTIONS.NEXT) {
    target = row.next()
  } else if (row && navDir === NAVIGATION_DIRECTIONS.PREV) {
    target = row.prev()
  }

  // Only allow navigating through rows that we can act upon in the timeline
  if (target && !target.isProperty()) {
    // Endless recursion without this check
    if (navDir !== undefined && navDir !== null && navDir !== NAVIGATION_DIRECTIONS.SAME) {
      return Row.cyclicalNav(criteria, target, navDir)
    }
  }

  return target
}

Row.focusSelectNext = (criteria, navDir, doFocus, metadata) => {
  const selected = Row.getSelectedRow(criteria)
  const focused = Row.getFocusedRow(criteria)

  if (selected) {
    selected.blur(metadata)
    selected.deselect(metadata)
  }

  if (focused) {
    focused.blur(metadata)
    focused.deselect(metadata)
  }

  const previous = focused || selected

  const target = (previous)
    ? Row.cyclicalNav(criteria, previous, navDir)
    : Row.cyclicalNav(criteria, Row.findByGlobalPosition(criteria, 0), navDir)

  if (target) {
    target.expand(metadata)
    target.select(metadata)
    if (doFocus) target.focus(metadata)
  }
}

Row.getSelectedRow = function getSelectedRow (criteria) {
  return Row.where(criteria).filter((row) => {
    return row._isSelected
  })[0]
}

Row.getFocusedRow = function getFocusedRow (criteria) {
  return Row.where(criteria).filter((row) => {
    return row._isFocused
  })[0]
}

/**
 * @function rmap
 * @description Recursively 'map' through all rows, their children, etc.
 */
Row.rmap = function _rmap (criteria, iteratee) {
  return rmap([Row.top(criteria)], iteratee)
}

Row.rsmap = function _rsmap (criteria, iteratee, indentation) {
  const tree = rsmap([Row.top(criteria)], iteratee)
  return tlines([], '', indentation || '    ', tree).join('\n')
}

function rmap (rows, iteratee) {
  return rows.map((row) => {
    const out = iteratee(row)
    if (!out) throw new Error('rmap iteratee must return an object')
    if (typeof out !== 'object') throw new Error('rmap iteratee must return an object')
    out.children = rmap(row.children, iteratee)
    return out
  })
}

function rsmap (rows, iteratee) {
  return rows.map((row) => {
    const out = iteratee(row)
    if (typeof out !== 'string') {
      throw new Error('rmap iteratee must return a string')
    }
    return {
      text: out,
      children: rsmap(row.children, iteratee)
    }
  })
}

function tlines (lines, indent, indentation, nodes) {
  nodes.forEach((node) => {
    lines.push(indent + node.text)
    tlines(lines, indent + indentation, indentation, node.children)
  })
  return lines
}

Row.dumpHierarchyInfo = (criteria) => {
  return Row.rsmap(criteria, (row) => {
    return row.dump()
  })
}

Row.buildPropertyUid = (component, targetElement, addressableName) => {
  const elementId = `${targetElement.getComponentId()}`
  return `${component.getPrimaryKey()}::${elementId}-property-${addressableName}`
}

Row.buildClusterUid = (component, targetElement, propertyGroupDescriptor) => {
  const elementId = `${targetElement.getComponentId()}`
  return `${component.getPrimaryKey()}::${elementId}-cluster-${propertyGroupDescriptor.cluster.prefix}`
}

Row.buildClusterMemberUid = (component, targetElement, propertyGroupDescriptor, addressableName) => {
  const elementId = `${targetElement.getComponentId()}`
  return `${component.getPrimaryKey()}::${elementId}-cluster-${propertyGroupDescriptor.cluster.prefix}-property-${addressableName}`
}

Row.buildHeadingUid = (component, targetElement) => {
  return `${component.getPrimaryKey()}::${targetElement.getComponentId()}-heading`
}

module.exports = Row

// Down here to avoid Node circular dependency stub objects. #FIXME
const Keyframe = require('./Keyframe')
const Timeline = require('./Timeline')
