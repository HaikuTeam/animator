import * as React from 'react';

export default ({color = '#636E71'}) => (
  <svg width="16px" height="10px" viewBox="0 0 16 10">
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path d="M6.07294615,0 L6.51685433,1.6136881 L1.70784905,4.91022235 L6.51685433,8.25286198 L6.07294615,9.8204447 L0.701657181,5.87843521 L0.701657181,3.94200949 L6.07294615,0 Z M9.94185079,0 L15.2983428,3.94200949 L15.2983428,5.87843521 L9.94185079,9.8204447 L9.48314567,8.25286198 L14.2921509,4.91022235 L9.48314567,1.6136881 L9.94185079,0 Z" fill={color} />
          <circle id="Oval" fill={color} cx="5" cy="5" r="1" />
          <circle id="Oval" fill={color} cx="8" cy="5" r="1" />
          <circle id="Oval" fill={color} cx="11" cy="5" r="1" />
      </g>
  </svg>
);
