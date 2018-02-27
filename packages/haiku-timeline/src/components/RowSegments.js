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
    return (
      <div>
        {this.props.row.mapVisibleKeyframes((keyframe) => {
          let segmentPieces = []

          if (keyframe.isTransitionSegment()) {
            segmentPieces.push(
              <TransitionBody
                preventDragging={this.props.preventDragging}
                key={`keyframe-${keyframe.getPrimaryKey()}-transition-body`}
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
                  key={`keyframe-${keyframe.getPrimaryKey()}-constant-body`}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
            if (keyframe.isSoloKeyframe()) {
              segmentPieces.push(
                <SoloKeyframe
                  preventDragging={this.props.preventDragging}
                  key={`keyframe-${keyframe.getPrimaryKey()}-solo-keyframe`}
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
                  key={`keyframe-${keyframe.getPrimaryKey()}-invisible-1`}
                  offset={-10}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
            segmentPieces.push(
              <InvisibleKeyframeDragger
                key={`keyframe-${keyframe.getPrimaryKey()}-invisible-2`}
                offset={0}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe} />
            )
            if (keyframe.hasNextKeyframe()) {
              segmentPieces.push(
                <InvisibleKeyframeDragger
                  key={`keyframe-${keyframe.getPrimaryKey()}-invisible-3`}
                  offset={+10}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
          }

          return (
            <div
              id={`keyframe-container-${keyframe.getPrimaryKey()}`}
              key={`keyframe-container-${keyframe.getPrimaryKey()}`}
              className={`keyframe-container no-select`}>
              {segmentPieces}
            </div>
          )
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
  includeDraggables: React.PropTypes.bool.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
