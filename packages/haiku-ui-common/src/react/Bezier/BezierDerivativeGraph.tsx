import memoizeOne from 'memoize-one';
import * as React from 'react';

export interface BezierDerivativeGraphProps {
  rightGradFill: string;
  leftGradFill: string;
  id: string;
  value: [number, number, number, number];
  graphHeight?: number;
  graphWidth?: number;
  sampleSize?: number;
}

export default class BezierDerivativeGraph extends React.PureComponent<BezierDerivativeGraphProps> {
  static defaultProps = {
    graphHeight: 25,
    graphWidth: 100,
    sampleSize: 50,
  };

  private epsilon = 0.000001

  private fx (t: number) {
    const fx = (
      3 * this.props.value[0] * (1 - t) ** 2 +
      6 * (this.props.value[2] - this.props.value[0]) * (1 - t) * t +
      3 * t ** 2 * (1 - this.props.value[2])
    );

    return Math.abs(fx) > this.epsilon ? fx : this.epsilon;
  }

  private fy (t: number) {
    return (
      3 * this.props.value[1] * (1 - t) ** 2 +
      6 * (this.props.value[3] - this.props.value[1]) * (1 - t) * t +
      3 * t ** 2 * (1 - this.props.value[3])
    );
  }

  private calculateDerivativeAt (t: number) {
    return this.fy(t) / this.fx(t);
  }

  private calculateSample = (): [number[][], number] => {
    const points = [];
    let max: number;
    for (let i = 0; i <= 1; i += (1 / this.props.sampleSize)) {
      const y = this.calculateDerivativeAt(i);
      points.push([i, y]);

      if (!max || y > max) {
        max = y;
      }
    }

    return [points, max];
  };

  calculateD = memoizeOne((x1: number, y1: number, x2: number, y2: number) => {
    const [points, max] = this.calculateSample();
    const d = points.reduce((a, [x, y]) => {
      return `${a} L ${x * this.props.graphWidth} ${y * this.props.graphHeight / max}`;
    }, '');

    return `M 0 0 ${d} V0 H0 Z`;
  });

  render () {
    const gradientId = `BezierDerivativeGradient${this.props.id}`;

    return (
      <svg
        width="100%"
        height="20px"
        viewBox={`0 0 ${this.props.graphWidth} ${this.props.graphHeight}`}
        preserveAspectRatio="none"
        style={{marginTop: -2, transform: 'scale(1, -1)', overflow: 'visible'}}
      >
        <defs>
          <linearGradient x1="98.721091%" y1="100%" x2="0%" y2="100%" id={gradientId}>
            <stop stopColor={this.props.rightGradFill} offset="0%" />
            <stop stopColor={this.props.leftGradFill} offset="100%" />
          </linearGradient>
        </defs>
        <path d={this.calculateD(...this.props.value)} opacity="0.429" fill={`url(#${gradientId})`} />
      </svg>
    );
  }
}
