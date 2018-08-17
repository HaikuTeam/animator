import * as React from 'react';
import * as Color from 'color';
import zIndex from './styles/zIndex';
import Palette from 'haiku-ui-common/lib/Palette';

export default class PostMaxKeyframeArea extends React.Component {
  constructor (props) {
    super();

    this.frameInfo = props.timeline.getFrameInfo();
  }

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
        background: Color(Palette.COAL).fade(0.8),
        zIndex: zIndex.areaPostMaxKeyframe.base,
        marginLeft: this.frameInfo.maxf * this.frameInfo.pxpf + this.props.propertiesPixelWidth + 14,
        position: 'sticky',
        pointerEvents: 'none',
        height: 'calc(100% - 35px)',
        width: '999px',
        top: '35px',
      }} />
    );
  }
}
