import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import ActiveComponentIndicator from './ActiveComponentIndicator';
import PlaybackButtons from './PlaybackButtons';

const STYLES = {
  wrapper: {
    backgroundColor: Palette.FATHER_COAL,
    position: 'relative',
  },
  leftWrapper: {
    position: 'absolute',
    left: 14,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  centerWrapper: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
};

export default class ControlsArea extends React.Component {
  render () {
    return (
      <div style={STYLES.wrapper}>
        <span style={STYLES.leftWrapper}>
          <ActiveComponentIndicator
            displayName={this.props.activeComponentDisplayName} />
        </span>
        <span style={STYLES.centerWrapper}>
          <PlaybackButtons
            timeline={this.props.timeline}
            playbackSkipBack={this.props.playbackSkipBack}
            playbackSkipForward={this.props.playbackSkipForward}
            playbackPlayPause={this.props.playbackPlayPause}
            toggleRepeat={this.props.toggleRepeat}
            isRepeat={this.props.isRepeat} />
          <div style={{
            position: 'absolute',
            top: -63,
          }} />
        </span>
      </div>
    );
  }
}

ControlsArea.propTypes = {
  timeline: React.PropTypes.object.isRequired,
};
