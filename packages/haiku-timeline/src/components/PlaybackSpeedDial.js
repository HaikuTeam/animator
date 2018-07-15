import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  // Note this holster is rotated 90deg counter-clockwise
  sliderHolster: {
    transform: 'rotate(-90deg)',
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 'calc(-100% - 5px)',
    height: 19,
    left: 53,
    borderRadius: 4,
  },
  speed: {
    transform: 'rotate(90deg)',
    position: 'absolute',
    bottom: -14,
    left: -31,
    width: 25,
    height: 42,
    lineHeight: 3.4,
    textAlign: 'center',
    borderRadius: 2,
    fontSize: 13,
    fontWeight: 600,
    WebkitUserSelect: 'none',
    cursor: 'pointer',
  },
  input: {
    opacity: 0,
    width: 70,
    margin: '0 7px',
    pointerEvents: 'none',
  },
  show: {
    opacity: 1,
    pointerEvents: 'auto',
    backgroundColor: Palette.COAL,
  },
};

class PlaybackSpeedDial extends React.Component {
  constructor (props) {
    super(props);
    this.state = {isOpen: false};
  }

  handleToggle () {
    this.setState({isOpen: !this.state.isOpen});
  }

  handleMouseLeave () {
    this.setState({isOpen: false});
  }

  playbackSpeedChange (changeEvent) {
    this.props.changePlaybackSpeed(changeEvent);
  }

  render () {
    return (
      <span style={[STYLES.sliderHolster, this.state.isOpen && STYLES.show]}
        onMouseLeave={this.handleMouseLeave.bind(this)}>
        <div style={STYLES.speed}
          onClick={this.handleToggle.bind(this)}>
          {this.props.playbackSpeed}
          <span style={{fontWeight: 300, marginLeft: 1}}>x</span>
        </div>
        <input
          type="range"
          style={[STYLES.input, this.state.isOpen && STYLES.show]}
          min={0.1}
          max={1}
          step={0.1}
          value={this.props.playbackSpeed}
          onChange={this.playbackSpeedChange.bind(this)} />
      </span>
    );
  }
}

export default Radium(PlaybackSpeedDial);
