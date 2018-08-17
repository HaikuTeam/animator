import * as React from 'react';
import * as Color from 'color';
import zIndex from './styles/zIndex';
import Palette from 'haiku-ui-common/lib/Palette';

export default class PostMaxKeyframeArea extends React.Component {
  render () {
    const frameInfo = this.props.timeline.getFrameInfo();

    return (
      <div style={{
        background: Color(Palette.COAL).fade(0.8),
        zIndex: zIndex.areaPostMaxKeyframe.base,
        marginLeft: frameInfo.maxf * frameInfo.pxpf + this.props.propertiesPixelWidth + 14,
        position: 'sticky',
        pointerEvents: 'none',
        height: 'calc(100% - 35px)',
        width: '999px',
        top: '35px',
      }} />
    );
  }
}
