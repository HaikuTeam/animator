import * as React from 'react';
import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import zIndex from './styles/zIndex';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';

class ScrollView extends React.PureComponent {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
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

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (
      what === 'timeline-frame-range' ||
      what === 'timeline-max-frame-changed' ||
      what === 'timeline-frame'
    ) {
      this.forceUpdate();
    }
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo();
    return (
      <div
        ref="scrollview"
        id="property-rows"
        className="no-select"
        style={
          experimentIsEnabled(Experiment.NativeTimelineScroll)
            ? {
              position: 'absolute',
              top: 35,
              left: 0,
              width: this.props.timeline.calculateFullTimelineWidth(),
              pointerEvents: 'auto',
              WebkitUserSelect: 'auto',
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
            }
            : {
              position: 'absolute',
              top: 35,
              left: 0,
              width: '100%',
              pointerEvents: 'auto',
              WebkitUserSelect: 'auto',
              bottom: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
            }
        }
        onMouseDown={this.props.onMouseDown}
      >
        {this.props.children}
        <div style={{
          background: Palette.GRAY,
          zIndex: zIndex.backgroundHelper.base,
          flex: 1,
          width: this.props.propertiesPixelWidth,
          position: 'sticky',
          left: 0,
        }} />

        <div style={{
          position: 'absolute',
          background: Color(Palette.LIGHT_GRAY).fade(0.7),
          pointerEvents: 'none',
          zIndex: zIndex.areaPostMaxKeyframe.base,
          top: '0',
          bottom: '0',
          width: '9999999px',
          left: frameInfo.maxf * frameInfo.pxpf + this.props.propertiesPixelWidth + 14,
        }} />
      </div>
    );
  }
}

export default ScrollView;
