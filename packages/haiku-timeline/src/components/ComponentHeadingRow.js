import React from 'react'
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG'
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG'
import Palette from 'haiku-ui-common/lib/Palette'
import ComponentHeadingRowHeading from './ComponentHeadingRowHeading'
import CollapsedPropertyTimelineSegments from './CollapsedPropertyTimelineSegments'
import EventHandlerTriggerer from './EventHandlerTriggerer'
import PropertyManager from './PropertyManager'
import { Experiment, experimentIsEnabled } from 'haiku-common/lib/experiments'

export default class ComponentHeadingRow extends React.Component {
  shouldComponentUpdate (nextProps) {
    return (
      (this.props.isExpanded ^ nextProps.isExpanded) ||
      (this.props.isHidden ^ nextProps.isHidden) ||
      (this.props.isSelected ^ nextProps.isSelected) ||
      (this.props.hasAttachedActions ^ nextProps.hasAttachedActions)
    )
  }

  render () {
    const componentId = this.props.row.element.getComponentId()
    const boltColor = this.props.hasAttachedActions ? Palette.LIGHT_BLUE : Palette.DARK_ROCK

    return (
      <div
        ref='$row'
        id={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        key={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        className='component-heading-row no-select'
        data-component-id={componentId}
        onMouseOver={() => {
          this.props.row.hoverAndUnhoverOthers()
        }}
        onMouseOut={() => {
          this.props.row.unhover()
        }}
        onClick={(clickEvent) => {
          clickEvent.stopPropagation()
          // Expand and select the entire component area when it is clicked, but note that we
          // only collapse if the user clicked directly on the chevron.
          this.props.row.expandAndSelect({ from: 'timeline' })
        }}
        style={{
          display: 'table',
          tableLayout: 'fixed',
          height: this.props.isExpanded ? 0 : this.props.rowHeight,
          width: '100%',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 1007,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          verticalAlign: 'top',
          opacity: this.props.isHidden ? 0.75 : 1.0
        }}>
        {!this.props.isExpanded && // covers keyframe hangover at frame 0 that for uncollapsed rows is hidden by the input field
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
          width: this.props.timeline.getPropertiesPixelWidth() - 140,
          height: 'inherit',
          position: 'absolute',
          zIndex: 3,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY
        }}>
          <div
            style={{
              height: this.props.rowHeight,
              marginTop: -6
            }}
            onClick={(clickEvent) => {
              // Collapse/expand the entire component area when it is clicked
              if (this.props.isExpanded && this.props.isSelected) {
                clickEvent.stopPropagation()
                this.props.row.collapseAndDeselect({ from: 'timeline' })
              }
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: this.props.row.isRootRow() ? 'translate(0, -1px)' : 'translate(15px, -1px)'
              }}
              onClick={(clickEvent) => {
                // Collapse/expand the entire component area when it is clicked
                if (this.props.isExpanded) {
                  clickEvent.stopPropagation()
                  this.props.row.collapseAndDeselect({ from: 'timeline' })
                }
              }}
            >
              {this.props.isExpanded
                  ? <span className='utf-icon'
                    style={{
                      top: 1,
                      pointerEvents: 'none',
                      left: -1
                    }}>
                    <DownCarrotSVG color={Palette.ROCK} />
                  </span>
                  : <span className='utf-icon'
                    style={{
                      top: 3,
                      pointerEvents: 'none'
                    }}>
                    <RightCarrotSVG />
                  </span>
                }
            </span>
            <ComponentHeadingRowHeading
              row={this.props.row}
              isExpanded={this.props.isExpanded}
              isSelected={this.props.isSelected}
              isHovered={this.props.isHovered}
              onEventHandlerTriggered={this.props.onEventHandlerTriggered} />
          </div>
          <div
            style={
              this.props.isExpanded
                ? {
                  marginLeft: '37px',
                  marginTop: '4px',
                  position: 'relative',
                  height: '20px'
                }
                : {float: 'right', marginTop: '-15px', position: 'relative'}
            }
          >
            <div
              style={{
                width: 10,
                position: 'absolute',
                left: 0,
                top: 0
              }}>
              {(this.props.isExpanded || this.props.hasAttachedActions)
                ? <EventHandlerTriggerer
                  element={this.props.row.element}
                  row={this.props.row}
                  boltColor={boltColor}
                  onEventHandlerTriggered={this.props.onEventHandlerTriggered}
                  />
                : ''}
            </div>

            {(experimentIsEnabled(Experiment.JustInTimeProperties))
              ? <div
                style={{
                  width: 10,
                  position: 'absolute',
                  left: 16,
                  top: -1
                }}>
                {(this.props.isExpanded)
                    ? <PropertyManager
                      element={this.props.row.element}
                        />
                    : ''}
              </div>
              : ''}

          </div>
        </div>
        <div
          className='component-collapsed-segments-box'
          style={{
            display: 'table-cell',
            width: this.props.timeline.getTimelinePixelWidth(),
            height: 'inherit'
          }}>
          {(!this.props.isExpanded)
            ? <CollapsedPropertyTimelineSegments
              component={this.props.component}
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
  component: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  onEventHandlerTriggered: React.PropTypes.func.isRequired
}
