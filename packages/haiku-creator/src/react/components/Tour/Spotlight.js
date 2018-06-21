import * as React from 'react';
import {throttle} from 'lodash';

const STYLES = {
  spotlight: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '100%',
    background: 'transparent',
    pointerEvents: 'none',
  },
};

class Spotlight extends React.PureComponent {
  constructor () {
    super();

    this.setMouseOverHole = throttle(this.setMouseOverHole.bind(this), 350);
    this.state = {
      mouseOverHole: false,
      showBackground: true,
    };
  }

  componentWillReceiveProps () {
    this.setState({showBackground: true});
  }

  setMouseOverHole (event) {
    const sizeReference = this.props.holeStyles ? this.props.holeStyles : STYLES.spotlight;
    const {width, height} = sizeReference;
    const {display} = this.props;
    let {top, left} = this.props.position;

    switch (display) {
      case 'top':
        // top = top + height
        left = left - (width / 2);
        break;
      case 'bottom':
        top = top - height;
        left = left - (width / 2);
        break;
      case 'left':
        top = top - (height / 2);
        break;
      case 'right':
        left = left - width;
        top = top - (height / 2);
        break;
    }

    if (typeof top !== 'number') {
      return;
    }

    const inHoleHeight = event.pageY >= top && event.pageY <= top + height;
    const inHoleWidth = event.pageX >= left && event.pageX <= left + width;
    const inHole = inHoleWidth && inHoleHeight;

    if (inHole && !this.state.mouseOverHole) {
      this.setState({mouseOverHole: true});
    }

    if (!inHole && this.state.mouseOverHole) {
      this.setState({mouseOverHole: false});
    }
  }

  componentWillMount () {
    document.addEventListener('mousemove', this.setMouseOverHole);
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.setMouseOverHole);
  }

  render () {
    const {offset, holeStyles, containerStyles} = this.props;
    return (
      <div style={containerStyles}>
        <div
          onClick={() => {
            if (this.props.isOverlayHideable) {
              this.setState({showBackground: false});
            }
          }}
          style={{
            bottom: 0,
            left: 0,
            position: 'fixed',
            right: 0,
            top: 0,
            pointerEvents: this.state.mouseOverHole ? 'none' : 'all',
            display: this.state.showBackground ? 'initial' : 'none',
          }}
        />
        <div
          style={{
            ...offset,
            ...STYLES.spotlight,
            ...holeStyles,
            boxShadow: this.state.showBackground
              ? '0 0 0 150vw rgba(0, 0, 0, 0.5), 0 0 20px 0px #000 inset'
              : '',
          }}
        />
      </div>
    );
  }
}

Spotlight.propTypes = {
  offset: React.PropTypes.object,
  position: React.PropTypes.object,
  containerStyles: React.PropTypes.object,
  holeStyles: React.PropTypes.object,
  display: React.PropTypes.string,
  isOverlayHideable: React.PropTypes.bool,
};

export default Spotlight;
