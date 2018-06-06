import * as React from 'react';
import Palette from './../../Palette';

const STYLES: React.CSSProperties = {
  width: '100%',
  backgroundColor: Palette.BLACK,
  borderTopRightRadius: '7px',
  borderTopLeftRadius: '7px',
  padding: '5px 20px',
  zIndex: 999999,
};

export interface ModalHeaderProps {
  style?: React.CSSProperties;
}

export class ModalHeader extends React.PureComponent<ModalHeaderProps> {
  render () {
    return (
      <div style={{...STYLES, ...this.props.style}}>
        {this.props.children}
      </div>
    );
  }
}
