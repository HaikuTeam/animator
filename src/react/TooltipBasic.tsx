import * as React from 'react';
import Palette from '../Palette';

const STYLES = {
  tooltip: {
    position: 'absolute',
    bottom: '-17px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '3px',
    width: '100%',
    textAlign: 'center',
    backgroundColor: Palette.DARKEST_COAL,
    boxShadow: '0 2px 7px 0 rgba(0,0,0,.3)'
  } as React.CSSProperties,
  tip: {
    position: 'absolute',
    top: -4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid' + Palette.DARKEST_COAL,
  } as React.CSSProperties,
};

export class TooltipBasic extends React.PureComponent {
  render () {
    return (
      <div style={STYLES.tooltip}>
        <span style={STYLES.tip} />
        {this.props.children}
      </div>
    );
  }
}
