import * as React from 'react';
import Palette from './../../Palette';

const STYLES = {
  position: 'absolute',
  bottom: '20px',
  right: '20px'
}

export class ModalFooter extends React.PureComponent {
  props;

  render () {
    return (
      <div style={{...STYLES, ...this.props.style}}>
        {this.props.children}
      </div>
    )
  }
}
