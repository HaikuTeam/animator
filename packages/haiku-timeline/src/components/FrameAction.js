import * as React from 'react';
import Bolt from 'haiku-ui-common/lib/react/icons/Bolt';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLE = {
  base: {
    position: 'absolute',
    top: '-31px',
    left: '-6px',
    cursor: 'pointer',
    overflow: 'hidden',
    height: 17,
  },
  addAction: {
    padding: '0 8px',
    left: '-14px',
    opacity: 0,
    cursor: 'pointer',
    transform: 'scale(.5)',
    transition: 'transform 180ms ease',
  },
  show: {
    opacity: 1,
    transform: 'scale(1)',
  },
  plus: {
    width: '12px',
    height: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,.2)',
    fontSize: '20px',
  },
};

const HOVER_INTENT_TIME = 190;

class FrameAction extends React.Component {
  constructor () {
    super();
    this.timeout = null;
    this.state = {
      achievedHover: false,
    };
  }

  setHover = () => {
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.timeout = null;
        this.setState({achievedHover: true});
      }, HOVER_INTENT_TIME);
    }
  };

  unsetTimeout = () => {
    this.setState({achievedHover: false});

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  componentWillUnmount () {
    this.unsetTimeout();
  }

  openFrameActionsEditor = (clickEvent) => {
    clickEvent.stopPropagation();
    this.props.onShowFrameActionsEditor(this.props.frame);
  };

  openFrameActionsEditorIfAchievedHover = (event) => {
    if (this.state.achievedHover) {
      this.openFrameActionsEditor(event);
    }
  };

  render () {
    if (this.props.hasActions) {
      return (
        <div onMouseDown={this.openFrameActionsEditor} style={STYLE.base}>
          <Bolt color={Palette.LIGHT_BLUE} />
        </div>
      );
    }

    return (
      <div
        className="frame-action-box"
        onMouseOver={this.setHover}
        onMouseLeave={this.unsetTimeout}
        onMouseDown={this.openFrameActionsEditorIfAchievedHover}
        style={{...STYLE.base, ...STYLE.addAction, ...(this.state.achievedHover && STYLE.show)}}>
        <div style={STYLE.plus}>
          +
        </div>
      </div>
    );
  }
}

FrameAction.propTypes = {
  hasActions: React.PropTypes.bool,
  onShowFrameActionsEditor: React.PropTypes.func.isRequired,
};

export default FrameAction;
