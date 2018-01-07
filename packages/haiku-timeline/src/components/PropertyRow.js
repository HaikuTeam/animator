import React from 'react'
import humanizePropertyName from 'haiku-ui-common/lib/helpers/humanizePropertyName'
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG'
import PropertyInputField from './PropertyInputField'
import Palette from 'haiku-ui-common/lib/Palette'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import PropertyTimelineSegments from './PropertyTimelineSegments'
import PropertyRowHeading from './PropertyRowHeading'

export default class PropertyRow extends React.Component {
  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    const componentId = this.props.row.element.getComponentId()
    const propertyName = this.props.row.getPropertyNameString()
    const humanName = humanizePropertyName(propertyName)

    return (
      <div
        id={`property-row-${this.props.row.getAddress()}-${componentId}-${propertyName}`}
        className='property-row'
        onMouseEnter={() => {
          this.props.row.hoverAndUnhoverOthers()
        }}
        onMouseLeave={() => {
          this.props.row.unhover()
        }}
        style={{
          height: this.props.rowHeight,
          width: this.props.timeline.getPropertiesPixelWidth() + this.props.timeline.getTimelinePixelWidth(),
          left: 0,
          opacity: (this.props.row.isHidden()) ? 0.5 : 1.0,
          position: 'relative'
        }}>
        <div
          onClick={(clickEvent) => {
            // Allow clicking the subproperty of a cluster to collapse the parent row,
            // which 'contains' the rows of the cluster as children
            if (this.props.row.isCluster()) {
              this.props.row.parent.collapse()
            }
          }}>
          {(this.props.row.isFirstRowOfPropertyCluster())
            ? <div
              style={{
                position: 'absolute',
                width: 14,
                left: 136,
                top: -2,
                zIndex: 1006,
                textAlign: 'right',
                height: 'inherit'
              }}>
              <span className='utf-icon' style={{ top: -4, left: -3 }}><DownCarrotSVG /></span>
            </div>
            : ''
          }
          {(!this.props.row.isPropertyOnLastComponent() && humanName !== 'background color') &&
            <div style={{
              position: 'absolute',
              left: 36,
              width: 5,
              zIndex: 1005,
              borderLeft: '1px solid ' + Palette.GRAY_FIT1,
              height: this.props.rowHeight
            }} />
          }
          <div
            className='property-row-label no-select'
            style={{
              right: 0,
              width: this.props.timeline.getPropertiesPixelWidth() - 80,
              height: this.props.rowHeight,
              textAlign: 'right',
              backgroundColor: Palette.GRAY,
              zIndex: 1004,
              position: 'relative',
              paddingTop: 6,
              paddingRight: 10
            }}>
            <PropertyRowHeading
              row={this.props.row}
              humanName={humanName} />
          </div>
        </div>
        <div className='property-input-field-row'
          style={{
            position: 'absolute',
            left: this.props.timeline.getPropertiesPixelWidth() - 82,
            width: 82,
            top: 0,
            height: this.props.rowHeight - 1,
            textAlign: 'left'
          }}>
          <PropertyInputField
            parent={this}
            row={this.props.row}
            index={this.props.row.getAddress()}
            height={this.props.rowHeight}
            component={this.component}
            timeline={this.props.timeline}
            timelineName={this.props.timeline.getName()}
            rowHeight={this.props.rowHeight} />
        </div>
        <div
          onContextMenu={(ctxMenuEvent) => {
            ctxMenuEvent.stopPropagation()

            const tlOffset = Globals.mouse.x - this.props.timeline.getPropertiesPixelWidth()
            const pxOffsetLeft = tlOffset + this.props.timeline.getLeftFrameEndpoint() * frameInfo.pxpf

            PopoverMenu.emit('show', {
              type: 'property-row',
              event: { offsetX: 0 },
              model: this.props.row,
              offset: pxOffsetLeft
            })
          }}
          className='property-timeline-segments-box'
          onMouseDown={() => {
            this.props.row.activate()
          }}
          style={{
            position: 'absolute',
            width: this.props.timeline.getTimelinePixelWidth(),
            left: this.props.timeline.getPropertiesPixelWidth() - 4, // offset half of lone keyframe width so it lines up with the pole
            top: 0,
            height: 'inherit'
          }}>
          <PropertyTimelineSegments
            component={this.props.component}
            timeline={this.props.timeline}
            rowHeight={this.props.rowHeight}
            row={this.props.row} />
        </div>
      </div>
    )
  }
}

PropertyRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired
}
