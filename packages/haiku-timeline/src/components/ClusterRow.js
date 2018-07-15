import * as React from 'react'
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments'
import Palette from 'haiku-ui-common/lib/Palette'
import truncate from 'haiku-ui-common/lib/helpers/truncate'
import RightCarrotSVG from 'haiku-ui-common/lib/react/icons/RightCarrotSVG'
import FamilySVG from 'haiku-ui-common/lib/react/icons/FamilySVG'
import ClusterInputField from './ClusterInputField'
import RowSegments from './RowSegments'
import ClusterRowHeading from './ClusterRowHeading'
import zIndex from './styles/zIndex'
import Globals from 'haiku-ui-common/lib/Globals'
import PopoverMenu from 'haiku-ui-common/lib/electron/PopoverMenu'

export default class ClusterRow extends React.Component {
  maybeRenderFamilyLabel () {
    if (!this.props.prev) return false
    if (this.props.row.doesTargetHostElement()) return false
    if (!this.props.row.isFirstRowOfSubElementSet()) return false
    return (
      <div
        className='family-label-for-cluster'
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
    const clusterName = this.props.row.getClusterNameString()

    return (
      <div
        id={`property-cluster-row-${this.props.row.getAddress()}-${componentId}-${clusterName}`}
        className='property-cluster-row'
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
          width: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : this.props.timeline.getPropertiesPixelWidth() + this.props.timeline.getTimelinePixelWidth(),
          left: 0,
          opacity: (this.props.row.isHidden()) ? 0.5 : 1.0,
          position: 'relative',
          cursor: 'pointer'
        }}>
        <div style={(experimentIsEnabled(Experiment.NativeTimelineScroll) ? {
          position: 'sticky',
          top: 0,
          left: 0,
          width: this.props.timeline.getPropertiesPixelWidth(),
          zIndex: zIndex.clusterRowHeading.base,
          backgroundColor: Palette.GRAY
        } : {})}>
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
            {this.maybeRenderFamilyLabel()}
            <div
              className='property-cluster-row-label no-select'
              style={{
                position: experimentIsEnabled(Experiment.NativeTimelineScroll) ? 'absolute' : 'relative',
                right: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 0,
                width: this.props.timeline.getPropertiesPixelWidth() - (experimentIsEnabled(Experiment.NativeTimelineScroll) ? 80 : 120),
                marginLeft: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 40,
                height: this.props.rowHeight,
                paddingTop: 3,
                paddingRight: 10,
                borderTop: (this.props.row.isFirstRowOfSubElementSet()) ? `1px solid ${Palette.GRAY}` : 'none',
                backgroundColor: (this.props.row.doesTargetHostElement()) ? Palette.GRAY : 'rgb(46, 59, 62)',
                borderTopLeftRadius: (this.props.row.isFirstRowOfSubElementSet()) ? 4 : 0,
                borderBottomLeftRadius: (this.props.row.isLastRowOfSubElementSet()) ? 4 : 0,
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
        </div>
        <div
          className='property-cluster-timeline-segments-box'
          style={{
            overflow: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : 'hidden',
            position: 'absolute',
            width: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : this.props.timeline.getTimelinePixelWidth(),
            left: this.props.timeline.getPropertiesPixelWidth() - 4, // offset half of lone keyframe width so it lines up with the pole
            top: 0,
            height: 'inherit',
            zIndex: experimentIsEnabled(Experiment.NativeTimelineScroll) ? zIndex.clusterRow.base : undefined
          }}>
          <RowSegments
            scope='ClusterRow'
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
