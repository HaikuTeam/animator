import * as React from 'react';

const STYLES: React.CSSProperties = {
  wrapper: {
    width: '200%',
    display: 'flex',
    transition: 'transform 200ms linear',
    padding: '0 20px',
    marginBottom: '30px',
    pointerEvents: 'none',
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
  wrapperStyles?: React.CSSProperties;
}

export class RevealPanel extends React.PureComponent<RevealPanelProps> {
  render () {
    return (
      <div
        style={{
          ...STYLES.wrapper,
          ...this.props.wrapperStyles,
          transform: `translateX(${this.props.showDetail ? '-50%' : '0'})`,
        }}
      >
        <div style={{...STYLES.item, ...(this.props.showDetail ? STYLES.hidden : STYLES.visible)}}>{this.props.leftPanel}</div>
        <div style={{...STYLES.item, ...(this.props.showDetail ? STYLES.visible : STYLES.hidden)}}>{this.props.rightPanel}</div>
      </div>
    );
  }
}
