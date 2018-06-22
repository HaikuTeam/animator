import React from 'react'
import lodash from 'lodash'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import DownCarrotSVG from 'haiku-ui-common/lib/react/icons/DownCarrotSVG'
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG'
import DragGrip from 'haiku-ui-common/lib/react/icons/DragGrip'
import Palette from 'haiku-ui-common/lib/Palette'
import Element from 'haiku-serialization/src/bll/Element'
import ComponentHeadingRowHeading from './ComponentHeadingRowHeading'
import CollapsedPropertyTimelineSegments from './CollapsedPropertyTimelineSegments'
import EventHandlerTriggerer from './EventHandlerTriggerer'
import PropertyManager from './PropertyManager'

export default class ComponentHeadingRow extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.throttledHandleRowHoverUnhover = lodash.debounce(this.handleRowHoverUnhover, 100)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.row.host.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.row.host.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'drag-group-start' ||
      what === 'drag-group-end'
    ) {
      this.forceUpdate()
    }
  }

  shouldComponentUpdate (nextProps) {
    return (
      (this.props.isExpanded ^ nextProps.isExpanded) ||
      (this.props.isHidden ^ nextProps.isHidden) ||
      (this.props.isSelected ^ nextProps.isSelected) ||
      (this.props.hasAttachedActions ^ nextProps.hasAttachedActions)
    )
  }

  handleRowHoverUnhover (shouldHover) {
    if (shouldHover) {
      this.props.row.hoverAndUnhoverOthers({ from: 'timeline' })
    } else {
      this.props.row.unhover({ from: 'timeline' })
    }
  }

  render () {
    const componentId = this.props.row.element.getComponentId()
    const boltColor = this.props.hasAttachedActions ? Palette.LIGHT_BLUE : Palette.DARK_ROCK
    const propertiesPixelWidth = this.props.timeline.getPropertiesPixelWidth()

    return (
      <div
        id={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        key={`component-heading-row-${componentId}-${this.props.row.getAddress()}`}
        className='component-heading-row no-select'
        onMouseOver={() => { this.throttledHandleRowHoverUnhover(true) }}
        onMouseOut={() => { this.throttledHandleRowHoverUnhover(false) }}
        style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          display: 'flex',
          alignItems: 'top',
          height: this.props.isExpanded ? 'auto' : this.props.rowHeight,
          position: this.props.isExpanded ? 'sticky' : 'relative',
          float: this.props.isExpanded ? 'left' : undefined,
          width: this.props.isExpanded ? 100 : undefined,
          top: this.props.isExpanded ? 0 : undefined,
          left: this.props.isExpanded ? 20 : undefined,
          zIndex: 99999999,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          opacity: this.props.isHidden ? 0.75 : 1.0
        } : {
          display: 'table',
          tableLayout: 'fixed',
          height: this.props.isExpanded ? 0 : this.props.rowHeight,
          width: '100%',
          position: 'relative',
          zIndex: 1007,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          verticalAlign: 'top',
          opacity: this.props.isHidden ? 0.75 : 1.0
        })}>
        {!this.props.isExpanded && !experimentIsEnabled(Experiment.NativeTimelineScroll) && // covers keyframe hangover at frame 0 that for uncollapsed rows is hidden by the input field
          <div style={{
            position: 'absolute',
            zIndex: 1006,
            left: propertiesPixelWidth - 10,
            top: 0,
            backgroundColor: Palette.LIGHT_GRAY,
            width: 10,
            height: this.props.rowHeight}} />}
        <div style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          display: 'flex',
          position: 'sticky',
          top: 0,
          left: 0,
          paddingLeft: this.props.isExpanded ? 0 : (this.props.row.isRootRow() ? 7 : 20),
          width: propertiesPixelWidth,
          backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
          zIndex: 1006
        } : {})}>
          {!this.props.row.isRootRow() &&
            <div
              style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
                marginTop: 1
              } : {
                position: 'absolute',
                top: 3,
                left: 12,
                zIndex: 4
              })}
              className='component-heading-row-drag-handle'
              {...this.props.dragHandleProps}>
              <span
                style={{transform: 'scale(0.5)', display: 'block'}}>
                <DragGrip />
              </span>
            </div>
          }
          <div
            className='component-heading-row-inner no-select'
            onClick={(clickEvent) => {
              clickEvent.stopPropagation()
              // Expand and select the entire component area when it is clicked, but note that we
              // only collapse if the user clicked directly on the chevron.
              Element.deselectAll({component: this.props.row.component}, {from: 'timeline'})
              this.props.row.expandAndSelect({from: 'timeline'})
            }}
            style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
              width: (this.props.row.isExpanded()) ? propertiesPixelWidth - 140 : propertiesPixelWidth,
              height: 'inherit',
              cursor: 'pointer',
              zIndex: 9999999999999,
              backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY,
              display: 'flex',
              flexDirection: 'column'
            } : {
              display: 'table-cell',
              width: (this.props.row.isExpanded()) ? this.props.timeline.getPropertiesPixelWidth() - 140 : '100%',
              height: 'inherit',
              position: 'absolute',
              cursor: 'pointer',
              zIndex: 3,
              backgroundColor: this.props.isExpanded ? 'transparent' : Palette.LIGHT_GRAY
            })}>
            <div
              className='component-heading-row-inner-r1'
              style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
                height: this.props.rowHeight,
                display: 'flex',
                alignItems: this.props.isExpanded ? 'flex-start' : 'center'
              } : {
                height: this.props.rowHeight,
                marginTop: -6,
                maxWidth: (this.props.row.isRootRow()) ? '120px' : undefined
              })}
              onClick={(clickEvent) => {
                // Collapse/expand the entire component area when it is clicked
                if (this.props.isExpanded && this.props.isSelected) {
                  clickEvent.stopPropagation()
                  this.props.row.collapseAndDeselect({ from: 'timeline' })
                }
              }}
            >
              <span
                className='component-heading-chevron-box'
                style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {} : {
                  display: 'inline-block',
                  transform: this.props.row.isRootRow() ? 'translate(0, -1px)' : 'translate(30px, -1px)'
                })}
                onClick={(clickEvent) => {
                  // Collapse/expand the entire component area when it is clicked
                  if (this.props.isExpanded) {
                    clickEvent.stopPropagation()
                    this.props.row.collapseAndDeselect({ from: 'timeline' })
                  }
                }}
              >
                {this.props.isExpanded
                    ? <span className={experimentIsEnabled(Experiment.NativeTimelineScroll) ? '' : 'utf-icon'}
                      style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
                        pointerEvents: 'none'
                      } : {
                        top: 1,
                        pointerEvents: 'none',
                        left: -1
                      })}>
                      <DownCarrotSVG color={Palette.ROCK} />
                    </span>
                    : <span className={experimentIsEnabled(Experiment.NativeTimelineScroll) ? '' : 'utf-icon'}
                      style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
                        pointerEvents: 'none'
                      } : {
                        top: 3,
                        pointerEvents: 'none'
                      })}>
                      <RightCarrotSVG />
                    </span>
                  }
              </span>
              <ComponentHeadingRowHeading
                row={this.props.row}
                isExpanded={this.props.isExpanded}
                isSelected={this.props.isSelected}
                isHovered={this.props.isHovered}
                onEventHandlerTriggered={this.props.onEventHandlerTriggered}
                onExpand={() => {
                  Element.deselectAll({component: this.props.row.component}, {from: 'timeline'})
                  this.props.row.expandAndSelect({from: 'timeline'})
                }}
              />
            </div>
            <div
              className='component-heading-row-inner-r2'
              style={(
                experimentIsEnabled(Experiment.NativeTimelineScroll)
                  ? {
                    display: this.props.isExpanded ? 'flex' : 'none',
                    alignItems: 'center'
                  } : (
                    this.props.isExpanded
                      ? {
                        marginLeft: '37px',
                        marginTop: '4px',
                        position: 'relative',
                        height: '20px',
                        maxWidth: '100px'
                      }
                      : {float: 'right', marginTop: '-15px', position: 'relative'}
                  )
              )}
            >
              <div
                className='event-handler-triggerer-button'
                style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {} : {
                  width: 10,
                  position: 'absolute',
                  left: 0,
                  top: 0
                })}>
                {(this.props.isExpanded || this.props.hasAttachedActions)
                  ? <EventHandlerTriggerer
                    element={this.props.row.element}
                    row={this.props.row}
                    boltColor={boltColor}
                    onEventHandlerTriggered={this.props.onEventHandlerTriggered}
                    />
                  : ''}
              </div>

              <div
                className='property-manager-button'
                style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {} : {
                  width: 10,
                  position: 'absolute',
                  left: 16,
                  top: -1
                })}>
                {(this.props.isExpanded)
                  ? <PropertyManager
                    element={this.props.row.element}
                  />
                  : ''}
              </div>

            </div>
          </div>
        </div>
        {!this.props.isExpanded &&
        <div
          onClick={(clickEvent) => {
            // We need this click listener here or we won't capture events that occur on
            // the keyframe pills or transition body segments
            clickEvent.stopPropagation()
            // Expand and select the entire component area when it is clicked, but note that we
            // only collapse if the user clicked directly on the chevron.
            Element.deselectAll({component: this.props.row.component}, {from: 'timeline'})
            this.props.row.expandAndSelect({from: 'timeline'})
          }}
          className='component-collapsed-segments-box'
          style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
            height: 'inherit'
          } : {
            display: 'table-cell',
            width: this.props.timeline.getTimelinePixelWidth(),
            height: 'inherit'
          })}>
          {(!this.props.isExpanded)
            ? <CollapsedPropertyTimelineSegments
              component={this.props.component}
              timeline={this.props.timeline}
              rowHeight={this.props.rowHeight}
              row={this.props.row} />
          : ''}
        </div>
      }
      </div>
    )
  }
}

ComponentHeadingRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  onEventHandlerTriggered: React.PropTypes.func.isRequired,
  dragHandleProps: React.PropTypes.object.isRequired
}
