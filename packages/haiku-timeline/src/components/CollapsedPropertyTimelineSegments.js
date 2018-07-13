import React from 'react'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import Palette from 'haiku-ui-common/lib/Palette'
import RowSegments from './RowSegments'
import zIndex from './styles/zIndex'

export default class CollapsedPropertyTimelineSegments extends React.Component {
  render () {
    // TODO: Optimize this? We don't need to render every segment since some of them overlap.
    // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
    return (
      <div
        className='collapsed-segments-box'
        style={{
          position: 'absolute',
          left: experimentIsEnabled(Experiment.NativeTimelineScroll) ? this.props.timeline.getPropertiesPixelWidth() + 1 : this.props.timeline.getPropertiesPixelWidth() - 4,
          height: this.props.rowHeight,
          width: '100%',
          overflow: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 'hidden',
          zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? zIndex.collapsedSegments.base : undefined,
          backgroundColor: experimentIsEnabled(Experiment.NativeTimelineScroll) ? Palette.LIGHT_GRAY : undefined,
          paddingLeft: 1
        }}>
        <RowSegments
          scope='CollapsedPropertyTimelineSegments'
          includeDraggables={false}
          preventDragging
          row={this.props.row}
          component={this.props.component}
          timeline={this.props.timeline}
          rowHeight={this.props.rowHeight} />
      </div>
    )
  }
}

CollapsedPropertyTimelineSegments.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired
}
