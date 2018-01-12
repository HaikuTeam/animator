import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG'
import ClusterInputField from './ClusterInputField'
import RowSegments from './RowSegments'
import ClusterRowHeading from './ClusterRowHeading'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'

export default class ClusterRow extends React.Component {
  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    const componentId = this.props.row.element.getComponentId()
    const clusterName = this.props.row.getClusterNameString()

    return (
      <div
        ref={(ref) => {
          this.ref = ref
        }}
        id={`property-cluster-row-${this.props.row.getAddress()}-${componentId}-${clusterName}`}
        className='property-cluster-row'
        onMouseEnter={() => {
          this.props.row.hoverAndUnhoverOthers()
        }}
        onMouseLeave={() => {
          this.props.row.unhover()
        }}
        onClick={() => {
          this.props.row.expandAndSelect({ from: 'timeline' })
        }}
        onContextMenu={(ctxMenuEvent) => {
          ctxMenuEvent.stopPropagation()

          const tlOffset = Globals.mouse.x - this.props.timeline.getPropertiesPixelWidth()
          const pxOffsetLeft = (tlOffset) + this.props.timeline.getLeftFrameEndpoint() * frameInfo.pxpf

          PopoverMenu.emit('show', {
            type: 'cluster-row',
            event: { offsetX: 0 },
            model: this.props.row,
            offset: pxOffsetLeft
          })
        }}
        style={{
          height: this.props.rowHeight,
          width: this.props.timeline.getPropertiesPixelWidth() + this.props.timeline.getTimelinePixelWidth(),
          left: 0,
          opacity: (this.props.row.isHidden()) ? 0.5 : 1.0,
          position: 'relative',
          cursor: 'pointer'
        }}>
        <div>
          <div
            style={{
              position: 'absolute',
              left: 145,
              width: 10,
              height: 'inherit',
              zIndex: 1005
            }}>
            <span className='utf-icon' style={{ top: -2, left: -3 }}><RightCarrotSVG /></span>
          </div>
          <div
            className='property-cluster-row-label no-select'
            style={{
              position: 'relative',
              right: 0,
              width: this.props.timeline.getPropertiesPixelWidth() - 80,
              height: this.props.rowHeight,
              paddingTop: 3,
              paddingRight: 10,
              backgroundColor: Palette.GRAY,
              zIndex: 1004,
              textAlign: 'right'
            }}>
            <ClusterRowHeading
              clusterName={clusterName}
              row={this.props.row}
              />
          </div>
        </div>
        <div className='property-cluster-input-field'
          style={{
            position: 'absolute',
            left: this.props.timeline.getPropertiesPixelWidth() - 82,
            width: 82,
            top: 0,
            height: 24,
            textAlign: 'left'
          }}>
          <ClusterInputField
            parent={this}
            row={this.props.row}
            index={this.props.row.getAddress()}
            height={this.props.rowHeight}
            component={this.props.component}
            timeline={this.props.timeline}
            rowHeight={this.props.rowHeight} />
        </div>
        <div
          className='property-cluster-timeline-segments-box'
          style={{
            overflow: 'hidden',
            position: 'absolute',
            width: this.props.timeline.getTimelinePixelWidth(),
            left: this.props.timeline.getPropertiesPixelWidth() - 4, // offset half of lone keyframe width so it lines up with the pole
            top: 0,
            height: 'inherit'
          }}>
          <RowSegments
            includeDraggables={false}
            preventDragging
            row={this.props.row}
            component={this.props.component}
            timeline={this.props.timeline}
            rowHeight={this.props.rowHeight} />
        </div>
      </div>
    )
  }
}

ClusterRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired
}
