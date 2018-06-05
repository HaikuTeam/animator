import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette.DARKER_ROCK2}) => {
  return (
    <svg width="12" height="15" viewBox="0 0 8 11">
      <path d="M1.85 10.6a.235.235 0 0 1-.141-.048.289.289 0 0 1-.087-.337l1.621-3.994H.85a.25.25 0 0 1-.231-.169.293.293 0 0 1 .054-.298l5-5.474a.235.235 0 0 1 .318-.032c.1.074.136.216.087.336L4.457 4.58H6.85a.25.25 0 0 1 .231.169.293.293 0 0 1-.054.298l-5 5.474a.239.239 0 0 1-.177.08z" fill={color} fillRule="evenodd" opacity=".602" />
    </svg>
  );
};
