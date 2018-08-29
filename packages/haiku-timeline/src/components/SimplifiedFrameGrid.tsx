import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import * as React from 'react';

export interface SimplifiedFrameGridProps {
  timeline: any;
  timelineOffsetPadding: number;
}

export default class SimplifiedFrameGrid extends React.PureComponent<SimplifiedFrameGridProps> {
  private defaultFrameBorder = `1px solid ${Color(Palette.COAL).fade(0.65)}`;
  private activeFrameBorder = `1px solid ${Color(Palette.ROCK).fade(0.8)}`;
  private lastHoveredFrame = 0;
  private lastHoveredFrameEl: null|HTMLElement = null;
  private mounted = false;

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
  }

  componentWillReceiveProps (nextProps: SimplifiedFrameGridProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);
    }
  }

  toggleFrameHover () {
    const hoveredFrame = this.props.timeline.getHoveredFrame();

    if (hoveredFrame === this.lastHoveredFrame) {
      return;
    }

    if (this.lastHoveredFrameEl) {
      this.lastHoveredFrameEl.style.borderLeft = this.defaultFrameBorder;
    }

    const hoveredFrameEl = document.getElementById(`frame-${hoveredFrame}`);

    if (hoveredFrameEl) {
      hoveredFrameEl.style.borderLeft = this.activeFrameBorder;
      this.lastHoveredFrame = hoveredFrame;
      this.lastHoveredFrameEl = hoveredFrameEl;
    }
  }

  handleUpdate = (what: string): null => {
    if (!this.mounted) {
      return null;
    }
    if (what === 'timeline-frame-hovered') {
      this.toggleFrameHover();
    } else if (
      what === 'timeline-frame-range' ||
      what === 'timeline-timeline-pixel-width' ||
      what === 'time-display-mode-change' ||
      what === 'timeline-max-frame-changed'
    ) {
      this.forceUpdate();
    }
  };

  render () {
    return (
      <div
        id="frame-grid"
        style={{
          position: 'sticky',
          top: 0,
          width: this.props.propertiesPixelWidth + this.props.timeline.calculateFullTimelineWidth(),
          transform: `translateX(${this.props.timelineOffsetPadding}px)`,
        }}
      >
        {this.props.timeline.mapVisibleFrames(
          (frameNumber: number, pixelOffsetLeft: number) => {
            return (
              <span
                id={`frame-${frameNumber}`}
                key={`frame-${frameNumber}`}
                style={{
                  height: 'calc(100vh - 80px)',
                  position: 'absolute',
                  borderLeft: this.defaultFrameBorder,
                  left: pixelOffsetLeft + this.props.propertiesPixelWidth,
                  top: 34,
                }}
              />
            );
          },
        )}
      </div>
    );
  }
}
