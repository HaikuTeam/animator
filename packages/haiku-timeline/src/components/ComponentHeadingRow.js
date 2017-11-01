import React from 'react'
import DownCarrotSVG from './icons/DownCarrotSVG'
import RightCarrotSVG from './icons/RightCarrotSVG'
import Palette from './DefaultPalette'
import ComponentHeadingRowHeading from './ComponentHeadingRowHeading'
import CollapsedPropertyTimelineSegments from './CollapsedPropertyTimelineSegments'

export default class ComponentHeadingRow extends React.Component {
  render () {
    let componentId = this.props.row.element.getComponentId()
    return (
      <div
        id={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        key={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        className='component-heading-row no-select'
        data-component-id={componentId}
        onClick={(clickEvent) => {
          // Collapse/expand the entire component area when it is clicked
          if (this.props.row.isExpanded()) {
            this.props.row.collapseAndDeselect({ from: 'timeline' })
          } else {
            this.props.row.expandAndSelect({ from: 'timeline' })
          }
        }}
        style={{
          display: 'table',
          tableLayout: 'fixed',
          height: this.props.row.isExpanded() ? 0 : this.props.rowHeight,
          width: '100%',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1005,
          backgroundColor: this.props.row.isExpanded() ? 'transparent' : Palette.LIGHT_GRAY,
          verticalAlign: 'top',
          opacity: (this.props.row.isHidden()) ? 0.75 : 1.0
        }}>
        {!this.props.row.isExpanded() && // covers keyframe hangover at frame 0 that for uncollapsed rows is hidden by the input field
          <div style={{
            position: 'absolute',
            zIndex: 1006,
            left: this.props.timeline.getPropertiesPixelWidth() - 10,
            top: 0,
            backgroundColor: Palette.LIGHT_GRAY,
            width: 10,
            height: this.props.rowHeight}} />}
        <div style={{
          display: 'table-cell',
          width: this.props.timeline.getPropertiesPixelWidth() - 150,
          height: 'inherit',
          position: 'absolute',
          zIndex: 3,
          backgroundColor: (this.props.row.isExpanded()) ? 'transparent' : Palette.LIGHT_GRAY
        }}>
          <div style={{
            height: this.props.rowHeight,
            marginTop: -6
          }}>
            <span
              style={{
                marginLeft: 10
              }}>
              {(this.props.row.isExpanded())
                  ? <span className='utf-icon' style={{ top: 1, left: -1 }}><DownCarrotSVG color={Palette.ROCK} /></span>
                  : <span className='utf-icon' style={{ top: 3 }}><RightCarrotSVG /></span>
                }
            </span>
            <ComponentHeadingRowHeading
              $update={this.props.$update}
              row={this.props.row} />
          </div>
        </div>
        <div
          className='component-collapsed-segments-box'
          style={{
            display: 'table-cell',
            width: this.props.timeline.getTimelinePixelWidth(),
            height: 'inherit'
          }}>
          {(!this.props.row.isExpanded())
            ? <CollapsedPropertyTimelineSegments
              $update={this.props.$update}
              component={this.props.component}
              ctxmenu={this.props.ctxmenu}
              timeline={this.props.timeline}
              rowHeight={this.props.rowHeight}
              row={this.props.row} />
            : ''}
        </div>
      </div>
    )
  }
}

ComponentHeadingRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  ctxmenu: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired,
}
