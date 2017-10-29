import React from 'react'
import RowSegments from './RowSegments'

export default class CollapsedPropertyTimelineSegments extends React.Component {
  render () {
    // TODO: Optimize this? We don't need to render every segment since some of them overlap.
    // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
    return (
      <div
        className='collapsed-segments-box'
        style={{
          position: 'absolute',
          left: this.props.timeline.getPropertiesPixelWidth() - 4,
          height: this.props.rowHeight,
          width: '100%',
          overflow: 'hidden'
        }}>
        <RowSegments
          includeDraggables={false}
          row={this.props.row}
          $update={this.props.$update}
          ctxmenu={this.props.ctxmenu}
          timeline={this.props.timeline}
          rowHeight={this.props.rowHeight} />
      </div>
    )
  }
}

CollapsedPropertyTimelineSegments.propTypes = {
  row: React.PropTypes.object.isRequired,
  ctxmenu: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired,
}
