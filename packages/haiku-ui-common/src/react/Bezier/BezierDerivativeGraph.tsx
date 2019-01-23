import {bezierInflections, linearMap} from 'haiku-common/lib/math/geometryUtils';
import * as React from 'react';

export interface BezierDerivativeGraphProps {
  rightGradFill: string;
  leftGradFill: string;
  id: string;
  value: number[];
  graphHeight: number;
}

export default class BezierDerivativeGraph extends React.PureComponent<BezierDerivativeGraphProps> {
  static defaultProps = {
    graphHeight: 25,
  }

  derivateX (value: number[]): number[] {
    const p = [0, value[0], value[2], 1];
    const d = [3 * (p[1] - p[0]), 3 * (p[2] - p[1]), 3 * (p[3] - p[2])].map(Math.abs);
    const maxValue = Math.max(...d);

    return d.map((v) => linearMap(0, maxValue, 0, this.props.graphHeight, v));
  }

  get d () {
    const {value} = this.props;
    const infl = bezierInflections([
      {x: 0, y: 0},
      {x: value[0], y: value[1]},
      {x: value[2], y: value[3]},
      {x: 1, y: 1},
    ]);
    const steps = [0, linearMap(0, 1, 0, 100, infl[0]), 100];
    const dx = this.derivateX(value);
    return `M${steps[0]} ${dx[0]} Q ${steps[1]} ${dx[1]}, ${steps[2]} ${dx[2]} L 100 0 L 0 0 Z`;
  }

  render () {
    const gradientId = `BezierDerivativeGradient${this.props.id}`;

    return (
      <svg
        width="100%"
        height="20px"
        viewBox={`0 0 100 ${this.props.graphHeight}`}
        preserveAspectRatio="none"
        style={{marginTop: -2, transform: 'scale(-1, -1)'}}
      >
        <defs>
          <linearGradient x1="98.721091%" y1="100%" x2="0%" y2="100%" id={gradientId}>
            <stop stopColor={this.props.rightGradFill} offset="0%" />
            <stop stopColor={this.props.leftGradFill} offset="100%" />
          </linearGradient>
        </defs>
        <path
          d={this.d}
          stroke="none"
          strokeWidth="1"
          fillRule="evenodd"
          opacity="0.429"
          fill={`url(#${gradientId})`}
        />
      </svg>
    );
  }
}
