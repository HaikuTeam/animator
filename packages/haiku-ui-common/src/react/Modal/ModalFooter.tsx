import * as React from 'react';

const STYLES: React.CSSProperties = {
  position: 'absolute',
  bottom: '20px',
  right: '20px',
};

export type ModalFooterProps = {
  style: React.CSSProperties;
};

export class ModalFooter extends React.PureComponent<ModalFooterProps> {
  render () {
    return (
      <div style={{...STYLES, ...this.props.style}}>
        {this.props.children}
      </div>
    );
  }
}
