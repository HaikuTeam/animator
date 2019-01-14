import BezierEditor from 'haiku-ui-common/lib/react/Bezier/BezierEditor';
import * as React from 'react';

const HEIGHT = 280;
const WIDTH = 250;

export interface BezierPopupProps {
  value?: number[];
  x?: number;
  y?: number;
  onHide: () => void;
  activeComponent: {
    changeCurveOnSelectedKeyframes: (bezier: number[], metadata: object) => void,
  };
}

export default class BezierPopup extends React.Component<BezierPopupProps> {
  static defaultProps = {
    value: [0.2, 0.2, 0.8, 0.8],
  };

  state = {
    currentBezier: this.props.value,
  };

  displayChanges = (currentBezier: number[]) => {
    this.setState({currentBezier});
  };

  save = () => {
    this.props.activeComponent.changeCurveOnSelectedKeyframes(this.state.currentBezier, {from: 'timeline'});
  };

  get boundXPosition (): number {
    let x = this.props.x;

    if (x + WIDTH > window.innerWidth) {
      x = x - WIDTH;
    }

    if (x - WIDTH < 0) {
      x = window.innerWidth - WIDTH;
    }

    return x;
  }

  get boundYPosition (): number {
    let y = this.props.y;

    if (y + HEIGHT > window.innerHeight) {
      y = y - HEIGHT;
    }

    if (y - HEIGHT < 0) {
      y = (HEIGHT / 2) + 40;
    }

    return y;
  }

  render () {
    return (
      <BezierEditor
        x={this.boundXPosition}
        y={this.boundYPosition}
        popupWidth={WIDTH}
        popupHeight={HEIGHT}
        onHide={this.props.onHide}
        onChange={this.displayChanges}
        onValueChangeFinish={this.save}
        value={this.state.currentBezier}
      />
    );
  }
}
