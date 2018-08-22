import * as React from 'react';
import * as Color from 'color';
import zIndex from './styles/zIndex';
import Palette from 'haiku-ui-common/lib/Palette';

export default class PostMaxKeyframeArea extends React.Component {
  constructor (props) {
    super(props);

    this.frameInfo = props.timeline.getFrameInfo();
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
    }
  }

  handleUpdate = (what) => {
    if (!this.mounted) {
      return null;
    }

    if (
      what === 'timeline-frame-range' ||
      what === 'timeline-timeline-pixel-width' ||
      what === 'time-display-mode-change' ||
      what === 'timeline-max-frame-changed'
    ) {
      this.frameInfo = this.props.timeline.getFrameInfo();
      this.forceUpdate();
    }
  };

  componentWillReceiveProps (nextProps) {
    // FIXME: when a keyframe is added, it takes some time for the Timeline
    // model to clear the cached value of frameInfo, this hack re-renders
    // the component after 100ms after new props are arrived to compensate that
    // delay...
    setTimeout(() => {
      this.frameInfo = nextProps.timeline.getFrameInfo();
      this.forceUpdate();
    }, 100);
  }

  render () {
    return (
      <div style={{
        background: Color(Palette.COAL).fade(0.7),
        zIndex: zIndex.areaPostMaxKeyframe.base,
        marginLeft: Math.round(this.frameInfo.maxf * this.frameInfo.pxpf) + this.props.propertiesPixelWidth + this.props.timelineOffsetPadding,
        position: 'sticky',
        pointerEvents: 'none',
        height: 'calc(100% - 35px)',
        width: this.frameInfo.friMax * this.frameInfo.pxpf + 999,
        top: '35px',
      }} />
    );
  }
}
