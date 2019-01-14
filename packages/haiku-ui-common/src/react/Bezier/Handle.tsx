import * as React from 'react';
import BezierComponent from './BezierComponent';

export interface HandleProps {
  index: number;
  handleRadius: number;
  handleColor: string;
  hover: boolean;
  down: boolean;
  background: string;
  handleStroke: number;
  xval: number;
  yval: number;
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseDown?: () => void;
}

export default class Handle extends BezierComponent<HandleProps> {

  shouldComponentUpdate (nextProps: HandleProps) {
    if (super.shouldComponentUpdate(nextProps)) {
      return true;
    }

    return (
      nextProps.index !== this.props.index ||
      nextProps.handleRadius !== this.props.handleRadius ||
      nextProps.handleColor !== this.props.handleColor ||
      nextProps.hover !== this.props.hover ||
      nextProps.down !== this.props.down ||
      nextProps.background !== this.props.background ||
      nextProps.handleStroke !== this.props.handleStroke ||
      nextProps.xval !== this.props.xval ||
      nextProps.yval !== this.props.yval ||
      nextProps.onMouseDown !== this.props.onMouseDown ||
      nextProps.onMouseLeave !== this.props.onMouseLeave ||
      nextProps.onMouseEnter !== this.props.onMouseEnter
    );
  }

  render () {
    const {
      index,
      handleRadius,
      handleColor,
      hover,
      down,
      background,
      handleStroke,
      xval,
      yval,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
    } = this.props;

    const sx = this.x(index);
    const sy = this.y(index);
    const cx = this.x(xval);
    const cy = this.y(yval);
    const a = Math.atan2(cy - sy, cx - sx);
    const cxs = cx - handleRadius * Math.cos(a);
    const cys = cy - handleRadius * Math.sin(a);

    return (
      <g>
        <line
          opacity={.6}
          stroke={handleColor}
          strokeWidth={hover || down ? 1 + handleStroke : handleStroke}
          x1={cxs}
          y1={cys}
          x2={sx}
          y2={sy}
        />
        <circle
          cx={cx}
          cy={cy}
          r={handleRadius}
          stroke={handleColor}
          strokeWidth={hover || down ? 2 * handleStroke : handleStroke}
          fill={down ? background : handleColor}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
        />
      </g>
    );
  }
}
