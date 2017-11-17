import React from 'react'
import RowSegments from './RowSegments'

export default class PropertyTimelineSegments extends React.Component {
  render () {
    return (
      <div
        className='property-timeline-segments'>
        <RowSegments
          includeDraggables
          preventDragging={false}
          row={this.props.row}
          component={this.props.component}
          $update={this.props.$update}
          ctxmenu={this.props.ctxmenu}
          timeline={this.props.timeline}
          rowHeight={this.props.rowHeight} />
      </div>
    )
  }
}

PropertyTimelineSegments.propTypes = {
  row: React.PropTypes.object.isRequired,
  ctxmenu: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired
}
