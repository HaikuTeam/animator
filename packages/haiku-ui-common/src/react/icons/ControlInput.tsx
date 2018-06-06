import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette.ROCK}) => (
  <svg width="16px" height="16px" viewBox="0 0 32 32">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <rect id="Rectangle" stroke={color} x="0.5" y="0.5" width="30" height="31" rx="1" />
      <path d="M4.5,27.5 L12.5,27.5" id="Line" stroke={color} strokeLinecap="square" />
      <path d="M4.5,4.5 L12.5,4.5" id="Line" stroke={color} strokeLinecap="square" />
      <path d="M8.5,4.5 L8.5,27.5" id="Line-2" stroke={color} strokeLinecap="square" />
    </g>
  </svg>
);
