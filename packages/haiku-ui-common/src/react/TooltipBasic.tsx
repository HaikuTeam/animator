import * as React from 'react';
import Palette from '../Palette';

/*
  This component is very rudimentary atm and needs to be fleshed out for
  dynamic arrow positioning.

  GOTCHA-warning: note that with the current implementation whatever element
  this is included within must have position relative.

*/

const STYLES = {
  tooltip: {
    position: 'absolute',
    zIndex: 2000,
    left: '50%',
    top: 34,
    transform: 'translateX(-50%)',
    borderRadius: '3px',
    maxWidth: 170,
    minWidth: 110,
    padding: '0 4px',
    textAlign: 'center',
    color: Palette.SUNSTONE,
    backgroundColor: Palette.DARKEST_COAL,
    borderColor: Palette.DARKEST_COAL,
    boxShadow: '0 2px 7px 0 rgba(0,0,0,.3)',
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
    borderBottom: '5px solid ' + Palette.DARKEST_COAL,
  } as React.CSSProperties,
  light: {
    backgroundColor: Palette.BLUE,
  } as React.CSSProperties,
  tipLight: {
    borderBottom: '5px solid ' + Palette.BLUE,
  } as React.CSSProperties,
};

export interface TooltipBasicProps {
  light?: boolean;
  top?: number;
  width?: number;
}

export class TooltipBasic extends React.PureComponent<TooltipBasicProps> {
  render () {
    return (
      <div
        style={{
          ...STYLES.tooltip,
          ...(this.props.light && STYLES.light),
          ...{top: this.props.top},
          ...{width: this.props.width},
        }}
      >
        <span style={{...STYLES.tip, ...(this.props.light && STYLES.tipLight)}} />
        {this.props.children}
      </div>
    );
  }
}
