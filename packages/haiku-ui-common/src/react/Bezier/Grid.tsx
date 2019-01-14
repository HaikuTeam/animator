import * as React from 'react';
import BezierComponent from './BezierComponent';

function range (from: number, to: number, step: number) {
  const t = [];
  for (let i = from; i < to; i += step) {
    t.push(i);
  }
  return t;
}

export interface GridProps {
  background: string;
  gridColor: string;
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
}

export default class Grid extends BezierComponent<GridProps> {
  gridX (div: number) {
    const step = 1 / div;
    return range(0, 1, step).map(this.x);
  }

  gridY (div: number) {
    const step = 1 / div;
    return range(0, 1, step).map(this.y);
  }

  shouldComponentUpdate (nextProps: GridProps) {
    if (super.shouldComponentUpdate(nextProps)) {
      return true;
    }
    const {background, gridColor} = this.props;
    return (
      nextProps.background !== background ||
      nextProps.gridColor !== gridColor
    );
  }

  render () {
    const {background, gridColor} = this.props;

    const sx = this.x(0);
    const sy = this.y(0);
    const ex = this.x(1);
    const ey = this.y(1);

    const xtenth = this.gridX(10);
    const ytenth = this.gridY(10);

    const gridbg = `M${sx},${sy} L${sx},${ey} L${ex},${ey} L${ex},${sy} Z`;

    const tenth = xtenth
      .map((xp) => `M${xp},${sy} L${xp},${ey}`)
      .concat(ytenth.map((yp) => `M${sx},${yp} L${ex},${yp}`))
      .join(' ');

    const ticksLeft = ytenth
      .map((yp, i) => {
        const w = 3 + (i % 5 === 0 ? 2 : 0);
        return `M${sx},${yp} L${sx - w},${yp}`;
      })
      .join(' ');

    return (
      <g>
        <path fill={background} d={gridbg} />
        <path strokeWidth="1px" stroke={gridColor} d={tenth} />
        <path strokeWidth="1px" stroke={gridColor} d={ticksLeft} />
      </g>
    );
  }
}
