import * as React from 'react';

export interface PopoverProps {
  x: number;
  y: number;
  zIndex?: number;
  onHide: () => void;
  onMouseMove?: (e: React.MouseEvent<any>) => void;
  onMouseUp?: (e: React.MouseEvent<any>) => void;
  onMouseLeave?: (e: React.MouseEvent<any>) => void;
}

export default class Popover extends React.Component<PopoverProps> {
  static defaultProps = {
    x: 0,
    y: 0,
    zIndex: 999999999,
  };

  hide = (event: React.MouseEvent<any>) => {
    if (event.target === event.currentTarget) {
      this.props.onHide();
    }
  };

  render () {
    return (
      <div
        style={{
          position: 'fixed',
          zIndex: this.props.zIndex,
          background: 'transparent',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={this.hide}
        onMouseMove={this.props.onMouseMove}
        onMouseUp={this.props.onMouseUp}
        onMouseLeave={this.props.onMouseLeave}
      >
        <div
          style={{
            position: 'absolute',
            top: this.props.y,
            left: this.props.x,
            transform: 'translateY(-50%)',
          }}
        >
        {this.props.children}
        </div>
      </div>
    );
  }
}
