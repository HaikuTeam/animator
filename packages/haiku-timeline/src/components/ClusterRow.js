import React from 'react'
import Palette from './DefaultPalette'
import RightCarrotSVG from './icons/RightCarrotSVG'
import ClusterInputField from './ClusterInputField'
import RowSegments from './RowSegments'
import Globals from './Globals'

export default class ClusterRow extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.row.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.row.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (
      what === 'row-hovered' ||
      what === 'row-unhovered'
    ) {
      this.forceUpdate()
    }
  }

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
        onMouseOver={() => {
          this.props.row.hoverAndUnhoverOthers()
        }}
        onMouseOut={() => {
          this.props.row.unhover()
        }}
        onClick={() => {
          this.props.row.expandAndSelect({ from: 'timeline' })
        }}
        onContextMenu={(ctxMenuEvent) => {
          ctxMenuEvent.stopPropagation()

          const tlOffset = Globals.mouse.x - this.props.timeline.getPropertiesPixelWidth()
          const pxOffsetLeft = (tlOffset) + this.props.timeline.getLeftFrameEndpoint() * frameInfo.pxpf

          this.props.ctxmenu.show({
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
          {!this.props.row.isPropertyOnLastComponent() &&
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
            <span style={{
              textTransform: 'uppercase',
              fontSize: 10,
              color: (this.props.row.isHovered())
                ? Palette.ROCK
                : Palette.DARK_ROCK
            }}>
              {clusterName}
            </span>
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
            $update={this.props.$update}
            parent={this}
            row={this.props.row}
            index={this.props.row.getAddress()}
            height={this.props.rowHeight}
            component={this.props.component}
            timeline={this.props.timeline}
            isPlayerPlaying={this.props.isPlayerPlaying}
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
            preventDragging={true}
            row={this.props.row}
            $update={this.props.$update}
            component={this.props.component}
            ctxmenu={this.props.ctxmenu}
            timeline={this.props.timeline}
            rowHeight={this.props.rowHeight} />
        </div>
      </div>
    )
  }
}

ClusterRow.propTypes = {
  row: React.PropTypes.object.isRequired,
  ctxmenu: React.PropTypes.object.isRequired,
  timeline: React.PropTypes.object.isRequired,
  component: React.PropTypes.object.isRequired,
  rowHeight: React.PropTypes.number.isRequired,
  $update: React.PropTypes.object.isRequired
}
