import * as React from 'react';
import * as Radium from 'radium';
import * as IPreview from '@haiku/taylor-ipreview2/react';
import {Tooltip} from 'haiku-ui-common/lib/react/Tooltip';

const STYLES = {
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
};

class Toggle extends React.Component {
  onToggle () {
    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle();
    }
  }

  componentWillReceiveProps ({active}) {
    if (active !== this.props.active) {
      this.changeActiveState(active);
    }
  }

  changeActiveState (active) {
    if (active) {
      this.previewHaiku.getDefaultTimeline().gotoAndPlay(100);
    } else {
      this.previewHaiku.getDefaultTimeline().gotoAndPlay(0);
    }
  }

  render () {
    return (
      <Tooltip content="Toggle preview" style={this.props.style}>
        <a
          href="#"
          style={[
            this.props.disabled && STYLES.disabled,
            this.props.style,
            {marginTop: -5},
          ]}
          onClick={() => {
            this.onToggle();
          }}
        >
          <div>
            <IPreview
              haikuStates={{isOn: {value: this.props.active}}}
              onHaikuComponentDidMount={(component) => {
                this.previewHaiku = component;
              }}
              onHaikuComponentWillUnmount={(component) => {
                component.context.destroy();
              }}
              contextMenu="disabled"
            />
          </div>
        </a>
      </Tooltip>
    );
  }
}

export default Radium(Toggle);
