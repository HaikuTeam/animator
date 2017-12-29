import React from 'react'
import TransitionBody from './TransitionBody'
import ConstantBody from './ConstantBody'
import SoloKeyframe from './SoloKeyframe'
import InvisibleKeyframeDragger from './InvisibleKeyframeDragger'

export default class RowSegments extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
    this.props.row.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
    this.props.row.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'timeline-frame-range' ||
      what === 'keyframe-create' ||
      what === 'keyframe-delete' ||
      what === 'keyframe-remove-curve' ||
      what === 'keyframe-add-curve' ||
      what === 'keyframe-change-curve'
    ) {
      this.forceUpdate()
    }
  }

  render () {
    const renders = {}

    return (
      <div>
        {this.props.row.mapVisibleKeyframes((keyframe) => {
          let segmentPieces = []

          if (keyframe.isTransitionSegment()) {
            segmentPieces.push(
              <TransitionBody
                preventDragging={this.props.preventDragging}
                key={`keyframe-${keyframe.getUniqueKeyWithoutTimeIncluded()}-transition-body`}
                $update={this.props.$update}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe} />
            )
          } else {
            if (keyframe.isConstantSegment()) {
              segmentPieces.push(
                <ConstantBody
                  preventDragging={this.props.preventDragging}
                  key={`keyframe-${keyframe.getUniqueKeyWithoutTimeIncluded()}-constant-body`}
                  $update={this.props.$update}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
            if (keyframe.isSoloKeyframe()) {
              segmentPieces.push(
                <SoloKeyframe
                  preventDragging={this.props.preventDragging}
                  key={`keyframe-${keyframe.getUniqueKeyWithoutTimeIncluded()}-solo-keyframe`}
                  $update={this.props.$update}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
          }

          if (this.props.includeDraggables) {
            if (keyframe.hasPreviousKeyframe()) {
              segmentPieces.push(
                <InvisibleKeyframeDragger
                  key={`keyframe-${keyframe.getUniqueKeyWithoutTimeIncluded()}-invisible-1`}
                  offset={-10}
                  $update={this.props.$update}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
            segmentPieces.push(
              <InvisibleKeyframeDragger
                key={`keyframe-${keyframe.getUniqueKeyWithoutTimeIncluded()}-invisible-2`}
                offset={0}
                $update={this.props.$update}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe} />
            )
            if (keyframe.hasNextKeyframe()) {
              segmentPieces.push(
                <InvisibleKeyframeDragger
                  key={`keyframe-${keyframe.getUniqueKeyWithoutTimeIncluded()}-invisible-3`}
                  offset={+10}
                  $update={this.props.$update}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
          }

          if (!renders[keyframe.getUniqueKey()]) {
            renders[keyframe.getUniqueKey()] = true
            return (
              <div
                id={`keyframe-container-${keyframe.getUniqueKey()}`}
                key={`keyframe-container-${keyframe.getUniqueKey()}`}
                className={`keyframe-container no-select`}>
                {segmentPieces}
              </div>
            )
          } else {
            return ''
          }
        })}
      </div>
    )
  }
}

RowSegments.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired,
  includeDraggables: React.PropTypes.bool.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
