import * as React from 'react';
import Palette from '../Palette';

const STYLES = {
  bar: {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '3px',
    backgroundColor: Palette.LIGHT_PINK,
  } as React.CSSProperties,
};

export interface LoadingTopBarProps {
  progress?: number;
  speed: number|string;
  done: boolean;
}

export class LoadingTopBar extends React.PureComponent<LoadingTopBarProps> {
  shouldComponentUpdate (nextProps: LoadingTopBarProps) {
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

  render () {
    return (
      <span
        style={{
          width: `${this.props.done ? 0 : this.props.progress}%`,
          transition: `width ${this.props.speed} cubic-bezier(0.4, 0, 1, 1), opacity 300ms ease`,
          opacity: this.props.done ? 0 : 1,
          ...STYLES.bar,
        }}
      />
    );
  }
}
