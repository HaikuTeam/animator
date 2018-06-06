import * as React from 'react';
import Palette from './../../Palette';

const STYLES = {
  backgroundColor: Palette.COAL,
  boxShadow: 'rgba(21, 32, 34, 0.9) 0px 12px 60px 0px',
  borderRadius: '6px',
  zIndex: 9001,
  cursor: 'auto',
  margin: 'auto',
  position: 'fixed',
  top: '40px',
  left: '0',
  right: '0',
} as React.CSSProperties;

export interface ModalWrapperProps {
  style: React.CSSProperties;
}

const stopPropagation: React.MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation();

export class ModalWrapper extends React.PureComponent<ModalWrapperProps> {
  render () {
    return (
      <div
        style={{...STYLES, ...this.props.style}}
        onClick={stopPropagation}
      >
        {this.props.children}
      </div>
    );
  }
}
