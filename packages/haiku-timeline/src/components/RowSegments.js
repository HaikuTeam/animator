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
      what === 'timeline-timeline-pixel-width' ||
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
        {this.props.row.mapVisibleKeyframes({ maxDepth: 3 }, (keyframe) => {
          let segmentPieces = []

          // The use of this.props.scope as part of the id/key is necessary so that
          // model updates are routed properly; if you remove it, things will break.

          if (keyframe.isTransitionSegment()) {
            segmentPieces.push(
              <TransitionBody
                id={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-transition-body`}
                key={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-transition-body`}
                preventDragging={this.props.preventDragging}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe} />
            )
          } else {
            if (keyframe.isConstantSegment()) {
              segmentPieces.push(
                <ConstantBody
                  id={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-constant-body`}
                  key={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-constant-body`}
                  preventDragging={this.props.preventDragging}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
            if (keyframe.isSoloKeyframe()) {
              segmentPieces.push(
                <SoloKeyframe
                  id={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-solo-keyframe`}
                  key={`keyframe-${keyframe.getUniqueKey()}-${this.props.scope}-solo-keyframe`}
                  preventDragging={this.props.preventDragging}
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
                  id={`keyframe-${keyframe.getUniqueKey()}-invisible-1`}
                  key={`keyframe-${keyframe.getUniqueKey()}-invisible-1`}
                  offset={-10}
                  component={this.props.component}
                  timeline={this.props.timeline}
                  rowHeight={this.props.rowHeight}
                  keyframe={keyframe} />
              )
            }
            segmentPieces.push(
              <InvisibleKeyframeDragger
                id={`keyframe-${keyframe.getUniqueKey()}-invisible-2`}
                key={`keyframe-${keyframe.getUniqueKey()}-invisible-2`}
                offset={0}
                component={this.props.component}
                timeline={this.props.timeline}
                rowHeight={this.props.rowHeight}
                keyframe={keyframe} />
            )
            if (keyframe.hasNextKeyframe()) {
              segmentPieces.push(
                <InvisibleKeyframeDragger
                  id={`keyframe-${keyframe.getUniqueKey()}-invisible-3`}
                  key={`keyframe-${keyframe.getUniqueKey()}-invisible-3`}
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
              id={`keyframe-container-${keyframe.getUniqueKey()}`}
              key={`keyframe-container-${keyframe.getUniqueKey()}`}
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
  scope: React.PropTypes.string.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  includeDraggables: React.PropTypes.bool.isRequired,
  preventDragging: React.PropTypes.bool.isRequired
}
