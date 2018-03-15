import * as React from 'react';
import Palette from './Palette';

const STYLES = {
  bar: {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '3px',
    backgroundColor: Palette.LIGHT_PINK,
  } as React.CSSProperties,
};

export class LoadingTopBar extends React.PureComponent {
  props;

  static propTypes = {
    progress: React.PropTypes.number,
    speed: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
    ]).isRequired,
    done: React.PropTypes.bool,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.progress !== this.props.progress ||
      nextProps.done !== this.props.done
    );
  }

  static defaultProps = {
    progress: 0,
    speed: '15s',
    done: false,
  };

  render() {
    return (
      <span
        style={{
          width: `${this.props.progress}%`,
          transition: `width ${this.props.speed} cubic-bezier(0.4, 0, 1, 1), opacity 300ms ease`,
          opacity: this.props.done ? 0 : 1,
          ...STYLES.bar,
        }}
      />
    );
  }
}
