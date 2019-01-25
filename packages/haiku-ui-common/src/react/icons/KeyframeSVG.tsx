import * as React from 'react';
import Palette from './../../Palette';

export interface KeyframeSVGProps {
  color?: string;
  style?: React.CSSProperties;
}

export default ({color = Palette.ROCK, style}: KeyframeSVGProps) => (
  <svg width="7" height="7" viewBox="0 8 7 7" style={style}>
    <g fill={color}>
      <path d="M5.331 11c1.245 0 1.543.787.663 1.759l-1.697 1.875a1.052 1.052 0 0 1-1.595 0L1.005 12.76C.126 11.787.424 11 1.668 11h3.663"/>
      <path d="M5.331 12.5c1.245 0 1.543-.787.663-1.759L4.297 8.866a1.052 1.052 0 0 0-1.595 0L1.005 10.74c-.879.972-.581 1.759.663 1.759h3.663"/>
    </g>
  </svg>
);
