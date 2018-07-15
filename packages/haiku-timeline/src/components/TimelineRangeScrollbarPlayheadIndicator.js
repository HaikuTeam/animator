import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import {Experiment, experimentIsEnabled} from 'haiku-common/lib/experiments';
import * as lodash from 'lodash';

const KNOB_RADIUS = 5;

export default class TimelineRangeScrollbarPlayheadIndicator extends React.Component {
  constructor (props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.throttledForceUpdate = lodash.throttle(this.forceUpdate.bind(this), 64);
  }

  componentWillUnmount () {
    this.mounted = false;
    this.props.timeline.removeListener('update', this.handleUpdate);
  }

  componentDidMount () {
    this.mounted = true;
    this.props.timeline.on('update', this.handleUpdate);
  }

  handleUpdate (what) {
    if (!this.mounted) {
      return null;
    }
    if (what === 'timeline-frame') {
      this.throttledForceUpdate();
    }
  }

  componentWillReceiveProps (nextProps) {
    // When switching the active component, we also get a new timeline instance
    if (nextProps.timeline !== this.props.timeline) {
      this.props.timeline.removeListener('update', this.handleUpdate);
      nextProps.timeline.on('update', this.handleUpdate);
    }
  }

  getPlayheadPc (frameInfo) {
    if (frameInfo.friMaxVirt < 1) {
      return 0;
    }
    const frame = this.props.timeline.getCurrentFrame();
    if (frame < 1) {
      return 0;
    }
    return (frame / frameInfo.friMax) * 100;
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo();

    return (
      <div
        id="timeline-playhead-indicator-container"
        style={{
          width: experimentIsEnabled(Experiment.NativeTimelineScroll) ? undefined : this.props.timeline.getPropertiesPixelWidth() + this.props.timeline.getTimelinePixelWidth() - 35,
          left: 10,
          position: 'relative',
        }}>
        <div
          id="timeline-playhead-indicator"
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            height: KNOB_RADIUS * 2,
            width: 1,
            backgroundColor: Palette.ROCK,
            left: this.getPlayheadPc(frameInfo) + '%',
          }} />
      </div>
    );
  }
}

TimelineRangeScrollbarPlayheadIndicator.propTypes = {
  timeline: React.PropTypes.object.isRequired,
};
