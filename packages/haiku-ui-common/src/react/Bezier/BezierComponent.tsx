import * as React from 'react';

function interp (a: number, b: number, x: number) {
  return a * (1 - x) + b * x;
}

export interface BezierComponentProps {
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
}

export default class BezierComponent<T> extends React.Component<T> {
  props: T & BezierComponentProps;
  x = (value: number) => Math.round(interp(this.props.xFrom, this.props.xTo, value));
  y = (value: number) => Math.round(interp(this.props.yFrom, this.props.yTo, value));
  shouldComponentUpdate (nextProps: T & BezierComponentProps) {
    return (
      nextProps.xFrom !== this.props.xFrom ||
      nextProps.yFrom !== this.props.yFrom ||
      nextProps.xTo !== this.props.xTo ||
      nextProps.yTo !== this.props.yTo
    );
  }
}
