import * as React from 'react';

const STYLES = {
  wrapper: {
    width: '200%',
    display: 'flex',
    transition: 'transform 200ms linear',
    padding: '0 20px',
    marginBottom: '30px',
    pointerEvents: 'none',
    maxHeight: 500,
    overflowY: 'scroll',
  },
  item: {
    width: '50%',
  },
  hidden: {
    pointerEvents: 'none',
    opacity: 0,
  },
  visible: {
    pointerEvents: 'all',
    opacity: 1,
  },
};

export interface RevealPanelProps {
  showDetail: boolean;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export class RevealPanel extends React.PureComponent<RevealPanelProps> {
  render () {
    return (
      <div
        style={{
          ...STYLES.wrapper,
          transform: `translateX(${this.props.showDetail ? '-50%' : '0'})`,
        }}
      >
        <div style={{...STYLES.item, ...(this.props.showDetail ? STYLES.hidden : STYLES.visible)}}>{this.props.leftPanel}</div>
        <div style={{...STYLES.item, ...(this.props.showDetail ? STYLES.visible : STYLES.hidden)}}>{this.props.rightPanel}</div>
      </div>
    );
  }
}
