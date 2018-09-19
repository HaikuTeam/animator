import Palette from 'haiku-ui-common/lib/Palette';
import * as React from 'react';
import zIndex from './styles/zIndex';

export interface ScrubberInteriorProps {
  timeline: any;
  timelineOffsetPadding: number;
  onMouseDown: React.MouseEventHandler<HTMLElement>;
}

export default class ScrubberInterior extends React.Component<ScrubberInteriorProps> {
  private mounted = false;

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
  }

  componentWillReceiveProps (nextProps: ScrubberInteriorProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);
    }
  }

  handleUpdate = (what: string): null => {
    if (!this.mounted) {
      return null;
    }

    if (what === 'timeline-frame') {
      this.forceUpdate();
    } else if (what === 'timeline-frame-range') {
      this.forceUpdate();
    } else if (what === 'time-display-mode-change') {
      this.forceUpdate();
    } else if (what === 'timeline-scroll' || 'timeline-scroll-from-scrollbar') {
      this.forceUpdate();
    }
  };

  render () {
    const frameInfo = this.props.timeline.getFrameInfo();
    const currFrame = this.props.timeline.getCurrentFrame();
    const pxOffset = currFrame * frameInfo.pxpf;
    const translation = this.props.timeline.getPropertiesPixelWidth() + pxOffset + this.props.timelineOffsetPadding;

    return (
      <div
        onMouseDown={this.props.onMouseDown}
        style={{
          position: 'sticky',
          top: 0,
          marginTop: -45,
          zIndex: zIndex.scrubber.base,
          fontSize: 10,
        }}>
        <div
          style={{
            position: 'absolute',
            backgroundColor: Palette.SUNSTONE,
            color: Palette.FATHER_COAL,
            textAlign: 'center',
            height: 18,
            width: 16,
            top: 13,
            left: -7,
            borderRadius: '50%',
            cursor: 'move',
            boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
            willChange: 'transform',
            transform: `translate3D(${translation}px, 0, 0)`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 1,
              left: 0,
              width: '100%',
            }}
          >
            {this.props.timeline.getDisplayTime()}
          </span>
          <span
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              top: 13,
              left: 1,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '9px solid rgb(254, 254, 254)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              top: 15,
              left: 2,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid rgb(254, 254, 254)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: Palette.SUNSTONE,
            height: 'calc(100vh - 80px)',
            width: 1,
            top: 35,
            pointerEvents: 'none',
            willChange: 'transform',
            transform: `translate3D(${translation}px, 0, 0)`,
          }} />
      </div>
    );
  }
}
