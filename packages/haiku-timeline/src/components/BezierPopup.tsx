import BezierEditor from 'haiku-ui-common/lib/react/Bezier/BezierEditor';
import * as React from 'react';

const HEIGHT = 280;
const WIDTH = 250;

export interface BezierPopupProps {
  keyframes?: any[];
  x?: number;
  y?: number;
  onHide: () => void;
  activeComponent: {
    changeCurveOnSelectedKeyframes: (bezier: number[], metadata: object) => void,
  };
  timeline: any;
}

export default class BezierPopup extends React.Component<BezierPopupProps> {
  private mounted = false;

  state = {
    currentBezier: this.bezierPointsFromEditingCurve,
  };

  componentWillUnmount () {
    this.mounted = false;
    if (this.referenceKeyframe) {
      this.referenceKeyframe.row.removeListener('update', this.handleUpdate);
    }
  }

  componentDidMount () {
    this.mounted = true;

    if (this.referenceKeyframe) {
      this.referenceKeyframe.row.on('update', this.handleUpdate);
    }
  }

  handleUpdate = (what: string): void => {
    if (!this.mounted) {
      return;
    }

    if (
      what === 'keyframe-remove-curve' ||
      what === 'keyframe-add-curve' ||
      what === 'keyframe-change-curve' ||
      what === 'row-rehydrated'
    ) {
      this.displayChanges(this.bezierPointsFromEditingCurve);
    }
  };

  displayChanges = (currentBezier: number[]) => {
    this.setState({currentBezier});
  };

  save = () => {
    this.props.activeComponent.changeCurveOnSelectedKeyframes(this.state.currentBezier, {from: 'timeline'});
  };

  get referenceKeyframe () {
    return this.props.keyframes && this.props.keyframes[0];
  }

  get bezierPointsFromEditingCurve (): number[] {
    if (this.referenceKeyframe) {
      return this.referenceKeyframe.getCurveInterpolationPoints();
    }

    return  [];
  }

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
