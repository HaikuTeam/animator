import * as React from 'react';

const STYLES = {
  wrapper: {
    width: '200%',
    display: 'flex',
    transition: 'transform 600ms cubic-bezier(0.19, 1, 0.22, 1)',
    padding: '0 20px',
    marginBottom: '30px'
  },
  item: {
    flex: 1
  }
}

export class RevealPanel extends React.PureComponent {
  props;

  static propTypes = {
    showDetail: React.PropTypes.bool,
    leftPanel: React.PropTypes.element,
    rightPanel: React.PropTypes.element,
  }

  render () {
    return (
      <div
        style={{
          ...STYLES.wrapper,
          transform: `translateX(${this.props.showDetail ? '-50%' : '0'})`
        }}
      >
        <div style={STYLES.item}>{this.props.leftPanel}</div>
        <div style={STYLES.item}>{this.props.rightPanel}</div>
      </div>
    )
  }
}
