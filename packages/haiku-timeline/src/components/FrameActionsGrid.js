import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import zIndex from './styles/zIndex';
import FrameAction from './FrameAction';

class FrameActionsGrid extends React.PureComponent {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.rootElement = props.timeline.component.findElementRoot();
    this.upsertTimelineEvents();
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);

      this.rootElement = nextProps.timeline.component.findElementRoot();
      this.upsertTimelineEvents();
    }
  }

  upsertTimelineEvents () {
    this.timelineEvents = this.rootElement
      .getTimelineEvents()
      .map((handler) => Number(handler.split(':')[2]));
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (what === 'timeline-frame-hovered' || 'timeline-max-frame-changed') {
      this.forceUpdate();
    }

    if (what === 'timeline-frame-action') {
      setTimeout(() => {
        this.upsertTimelineEvents();
        this.forceUpdate();
      }, 500);
    }
  }

  renderFrameActions (frameNumber, hoveredFrame) {
    if (this.timelineEvents.includes(frameNumber)) {
      return (
        <FrameAction
          hasActions={true}
          frame={frameNumber}
          onShowFrameActionsEditor={this.props.onShowFrameActionsEditor}
        />
      );
    }

    if (hoveredFrame === frameNumber) {
      return (
        <FrameAction
          hasActions={false}
          frame={frameNumber}
          onShowFrameActionsEditor={this.props.onShowFrameActionsEditor}
        />
      );
    }
  }

  render () {
    const timeline = this.props.timeline;
    const propertiesWidth = timeline.getPropertiesPixelWidth();
    const fullTimelineWidth = timeline.calculateFullTimelineWidth();
    const hoveredFrame = timeline.getHoveredFrame();

    return (
      <div style={{
        position: 'sticky',
        top: 0,
        height: 12,
        backgroundColor: Palette.COAL,
        width: propertiesWidth + fullTimelineWidth,
        zIndex: zIndex.frameActions.base,
        marginLeft: this.props.timelineOffsetPadding,
      }}>
        {this.props.timeline.mapVisibleFrames(
          (frameNumber, pixelOffsetLeft) => {
            return (
              <div
                key={`frame-${frameNumber}`}
                style={{
                  position: 'absolute',
                  left: pixelOffsetLeft + propertiesWidth,
                  top: 34,
                }}
                >
                {this.renderFrameActions(frameNumber, hoveredFrame)}
              </div>
            );
          },
        )}
      </div>
    );
  }
}

export default FrameActionsGrid;
