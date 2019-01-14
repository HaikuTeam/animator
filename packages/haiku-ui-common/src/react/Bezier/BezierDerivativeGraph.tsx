import * as React from 'react';

export interface BezierDerivativeGraphProps {
  rightGradFill: string;
  leftGradFill: string;
  id: string;
  value: number[];
}

export default class BezierDerivativeGraph extends React.PureComponent<BezierDerivativeGraphProps> {
  private scale = 10;

  derivateX (value: number[]): number[] {
    const p = [0, value[0], value[2], 1];

    return [
      3 * (p[1] - p[0]),
      3 * (p[2] - p[1]),
      3 * (p[3] - p[2]),
    ].map((v) => Math.abs(v * this.scale));
  }

  get d () {
    const steps = [0, 50, 100];
    const dx = this.derivateX(this.props.value);
    return `M${steps[0]} ${dx[0]} Q ${steps[1]} ${dx[1]}, ${steps[2]} ${dx[2]} L 100 0 L 0 0 Z`;
  }

  render () {
    const gradientId = `BezierDerivativeGradient${this.props.id}`;

    return (
      <svg width="100%" height="20px" viewBox="0 0 100 25" preserveAspectRatio="none" style={{transform: 'scale(-1, -1)'}}>
      <defs>
        <linearGradient x1="98.721091%" y1="100%" x2="0%" y2="100%" id={gradientId}>
          <stop stopColor={this.props.rightGradFill} offset="0%" />
          <stop stopColor={this.props.leftGradFill} offset="100%" />
        </linearGradient>
      </defs>
      <path d={this.d} stroke="none" strokeWidth="1" fillRule="evenodd" opacity="0.429" fill={`url(#${gradientId})`} />
    </svg>
    );
  }
}
