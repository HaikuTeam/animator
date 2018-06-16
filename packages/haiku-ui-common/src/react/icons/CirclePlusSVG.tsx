import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette.COAL}) => {
  return (
    <svg width="17" height="17">
      <g fill="none" stroke={color}>
        <circle cx="8.5" cy="8.5" r="7.5"/>
        <path d="M8.75 4.5v8M12.5 8.5H4.75"/>
      </g>
    </svg>
  );
};
