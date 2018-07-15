import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import ActiveComponentIndicator from './ActiveComponentIndicator';
// import CurrentTimelineSelectMenu from './CurrentTimelineSelectMenu'
import PlaybackButtons from './PlaybackButtons';
// import PlaybackSpeedDial from './PlaybackSpeedDial'

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
          {/* <CurrentTimelineSelectMenu
            timelineNames={this.props.timelineNames}
            selectedTimelineName={this.props.selectedTimelineName}
            changeTimelineName={this.props.changeTimelineName}
            createTimeline={this.props.createTimeline}
            duplicateTimeline={this.props.duplicateTimeline}
            deleteTimeline={this.props.deleteTimeline}
            selectTimeline={this.props.selectTimeline}
          /> */}
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
          }}>
            {/* zb: removing for now because
                      1. it interferes with ability to drag horiz scrollbar (even when hidden, vertical track steals events)
                      2. we don't support playback speed changes yet, perhaps encouraging the new user to wonder "what else is fake?"
                 <PlaybackSpeedDial
              changePlaybackSpeed={this.props.changePlaybackSpeed}
              playbackSpeed={this.props.playbackSpeed} /> */}
          </div>
        </span>
      </div>
    );
  }
}

ControlsArea.propTypes = {
  timeline: React.PropTypes.object.isRequired,
};
