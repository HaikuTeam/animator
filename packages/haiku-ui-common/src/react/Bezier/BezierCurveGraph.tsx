import * as React from 'react';
import BezierComponent from './BezierComponent';

export interface BezierCurveGraphProps {
  curveColor: string;
  curveWidth: string| number;
  value: number[];
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
}

export default class BezierCurveGraph extends BezierComponent<BezierCurveGraphProps> {
  shouldComponentUpdate (nextProps: BezierCurveGraphProps) {
    if (super.shouldComponentUpdate(nextProps)) {
      return true;
    }

    return (
      nextProps.curveColor !== this.props.curveColor ||
      nextProps.curveWidth !== this.props.curveWidth ||
      nextProps.value !== this.props.value
    );
  }

  render () {
    const sx = this.x(0);
    const sy = this.y(0);
    const ex = this.x(1);
    const ey = this.y(1);
    const cx1 = this.x(this.props.value[0]);
    const cy1 = this.y(this.props.value[1]);
    const cx2 = this.x(this.props.value[2]);
    const cy2 = this.y(this.props.value[3]);
    const curve = `M${sx},${sy} C${cx1},${cy1} ${cx2},${cy2} ${ex},${ey}`;

    return (
      <path
        fill="none"
        stroke={this.props.curveColor}
        strokeWidth={this.props.curveWidth}
        d={curve}
      />
    );
  }
}
