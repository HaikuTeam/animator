import * as React from 'react';

export default ({color = '#657575'}) => (
  <svg width="20px" height="15px" viewBox="0 0 20 15">
    <g id="Group" transform="translate(1.000000, 0.000000)" stroke={color} strokeWidth="2">
      <path d="M0.5,1.5 L25.5,1.5" id="Line1" />
      <path d="M0.5,7.5 L25.5,7.5" id="Line2" />
      <path d="M0.5,13.5 L25.5,13.5" id="Line3" />
    </g>
  </svg>
);
