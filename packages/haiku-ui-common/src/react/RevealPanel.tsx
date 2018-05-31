import * as React from 'react';

const STYLES = {
  wrapper: {
    width: '200%',
    display: 'flex',
    transition: 'transform 600ms cubic-bezier(0.19, 1, 0.22, 1)',
    padding: '0 20px',
    marginBottom: '30px',
  },
  item: {
    width: '50%',
  },
};

export type RevealPanelProps = {
  showDetail: boolean;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
};

export class RevealPanel extends React.PureComponent<RevealPanelProps> {
  render () {
    return (
      <div
        style={{
          ...STYLES.wrapper,
          transform: `translateX(${this.props.showDetail ? '-50%' : '0'})`,
        }}
      >
        <div style={STYLES.item}>{this.props.leftPanel}</div>
        <div style={STYLES.item}>{this.props.rightPanel}</div>
      </div>
    );
  }
}
