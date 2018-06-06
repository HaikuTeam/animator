import * as React from 'react';
import Palette from '../../Palette';

export interface ModalNoticeProps {
  color?: string;
  message: string;
}

export class ModalNotice extends React.PureComponent<ModalNoticeProps> {
  render () {
    return (
      <div
        style={{
          width: '100%',
          height: '25px',
          lineHeight: '25px',
          padding: '3px',
          textAlign: 'center',
          color: Palette.SUNSTONE,
          backgroundColor: this.props.color,
        }}
      >
        {this.props.message}
      </div>
    );
  }
}
