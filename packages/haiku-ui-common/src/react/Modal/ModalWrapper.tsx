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
};

export class ModalWrapper extends React.PureComponent {
  props;

  render () {
    return (
      <div style={{...STYLES, ...this.props.style}}
        onClick={(event) => event.stopPropagation()}>
        {this.props.children}
      </div>
    );
  }
}
