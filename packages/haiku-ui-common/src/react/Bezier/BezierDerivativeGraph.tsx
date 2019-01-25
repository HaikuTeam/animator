import * as React from 'react';

export interface BezierDerivativeGraphProps {
  rightGradFill: string;
  leftGradFill: string;
  id: string;
  value: number[];
  graphHeight?: number;
  graphWidth?: number;
}

export default class BezierDerivativeGraph extends React.PureComponent<BezierDerivativeGraphProps> {
  static defaultProps = {
    graphHeight: 25,
    graphWidth: 100,
  };

  map (x: number, y: number, x1: number, y1: number, nx: number, ny: number, n: number): number[] {
    return [
      (x - 3 * x1) * nx,
      ((y - 3 * y1) * ny) + (n * (y1 / x1)),
    ];
  }

  get d () {
    const [x1, y1, x2, y2] = this.props.value;
    const dx = [3 * x1, 3 * (x2 - x1), 3 * (1 - x2)];
    const dy = [3 * y1, 3 * (y2 - y1), 3 * (1 - y2)];
    const n = this.props.graphHeight / Math.max(Math.abs(y1 / x1), Math.abs((1 - y2) / (1 - x2)));
    const nx = this.props.graphWidth / (3 * (1 - x2) - 3 * x1);
    const ny = (n * (((1 - y2) / (1 - x2)) - (y1 / x1))) / (3 * (1 - y2) - (3 * y1));
    const p0 = this.map(dx[0], dy[0], x1, y1, nx, ny, n);
    const p1 = this.map(dx[1], dy[1], x1, y1, nx, ny, n);
    const p2 = this.map(dx[2], dy[2], x1, y1, nx, ny, n);

    return `M${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]} L 100 0 L 0 0 Z`;
  }

  render () {
    const gradientId = `BezierDerivativeGradient${this.props.id}`;

    return (
      <svg
        width="100%"
        height="20px"
        viewBox={`0 0 ${this.props.graphWidth} ${this.props.graphHeight}`}
        preserveAspectRatio="none"
        style={{marginTop: -2, transform: 'scale(1, -1)'}}
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
