import * as React from 'react';
import Palette from '../Palette';
import {SHARED_STYLES} from '../SharedStyles';
import {LoadingTopBar} from './LoadingTopBar';

const STYLES = {
  entry: {
    float: 'none',
    width: '100%',
    marginBottom: '8px',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    disabled: {
      backgroundColor: 'transparent',
      color: Palette.BLACK,
      cursor: 'auto',
      border: `1px solid ${Palette.DARKEST_COAL}`,
    },
    loading: {
      opacity: 0.7,
      cursor: 'wait',
    },
  },
} as React.CSSProperties;

export interface LoadingButtonProps {
  disabled: boolean;
  done: boolean;
  effectivelyDisabled: boolean;
  progress: number;
  speed?: number|string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOver?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseOut?: React.MouseEventHandler<HTMLButtonElement>;
}

export class LoadingButton extends React.PureComponent<LoadingButtonProps> {
  render () {
    return (
      <button
        style={{
          ...SHARED_STYLES.btn,
          ...STYLES.entry,
          ...(!this.props.done && STYLES.entry.loading),
          ...(this.props.effectivelyDisabled && STYLES.entry.disabled),
        }}
        disabled={!this.props.done}
        onClick={this.props.onClick}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
      >
        {!this.props.effectivelyDisabled && (
          <LoadingTopBar
            progress={this.props.progress}
            speed={this.props.speed}
            done={this.props.done}
          />
        )}
        {this.props.children}
      </button>
    );
  }
}
