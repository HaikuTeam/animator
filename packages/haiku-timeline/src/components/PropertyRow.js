import React from 'react'
import lodash from 'lodash'
import humanizePropertyName from 'haiku-ui-common/lib/helpers/humanizePropertyName'
import truncate from 'haiku-ui-common/lib/helpers/truncate'
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG'
import FamilySVG from 'haiku-ui-common/lib/react/icons/FamilySVG'
import PropertyInputField from './PropertyInputField'
import Palette from 'haiku-ui-common/lib/Palette'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'
import PropertyTimelineSegments from './PropertyTimelineSegments'
import PropertyRowHeading from './PropertyRowHeading'

export default class PropertyRow extends React.Component {
  constructor (props) {
    super(props)

    this.throttledHandleRowHovered = lodash.throttle(this.handleRowHovered, 20).bind(this)
    this.throttledHandleRowUnhovered = lodash.throttle(this.handleRowUnhovered, 20).bind(this)
  }

  handleRowHovered (event) {
    this.props.row.hoverAndUnhoverOthers({ from: 'timeline' })
  }

  handleRowUnhovered (event) {
    this.props.row.unhover({ from: 'timeline' })
  }

  maybeRenderFamilySvg () {
    if (!this.props.prev) return false
    if (this.props.row.doesTargetHostElement()) return false
    if (!this.props.row.isFirstRowOfSubElementSet()) return false
    return (
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 50,
          zIndex: 10000
        }}>
        <FamilySVG color={Palette.BLUE} />
        <span
          style={{
            position: 'absolute',
            fontSize: '8px',
            marginLeft: 6,
            color: Palette.BLUE,
            top: 4,
            whiteSpace: 'nowrap'
          }}>
          {truncate(this.props.row.element.getFriendlyLabel(), 7)}
        </span>
      </div>
    )
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    const componentId = this.props.row.element.getComponentId()
    const propertyName = this.props.row.getPropertyNameString()
    const humanName = humanizePropertyName(propertyName)

    return (
      <div
        id={`property-row-${this.props.row.getAddress()}-${componentId}-${propertyName}`}
        className='property-row'
        onMouseEnter={this.throttledHandleRowHovered}
        onMouseLeave={this.throttledHandleRowUnhovered}
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
          {(this.props.row.isFirstRowOfPropertyCluster()) &&
            <div
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
            </div>}
          {this.maybeRenderFamilySvg()}
          <div
            className='property-row-label no-select'
            style={{
              right: 0,
              width: this.props.timeline.getPropertiesPixelWidth() - 120,
              height: this.props.rowHeight,
              textAlign: 'right',
              borderTop: (this.props.row.isFirstRowOfSubElementSet()) ? `1px solid ${Palette.GRAY}` : 'none',
              backgroundColor: (this.props.row.doesTargetHostElement()) ? Palette.GRAY : 'rgb(46, 59, 62)',
              borderTopLeftRadius: (this.props.row.isFirstRowOfSubElementSet()) ? 4 : 0,
              borderBottomLeftRadius: (this.props.row.isLastRowOfSubElementSet()) ? 4 : 0,
              zIndex: 1004,
              position: 'relative',
              paddingTop: 6,
              paddingRight: 10,
              marginLeft: 40
            }}>
            <div
              className='hacky-property-row-coverup'
              style={{
                position: 'absolute',
                left: -40,
                height: '100%',
                width: 40,
                backgroundColor: Palette.GRAY
              }} />
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
