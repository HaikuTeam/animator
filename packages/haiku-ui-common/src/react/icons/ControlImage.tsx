import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette.ROCK}) => (
  <svg width="16px" height="16px" viewBox="0 0 32 32">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <rect id="Rectangle" stroke={color} strokeWidth="2" x="1" y="1" width="29" height="30" rx="2" />
      <path d="M1.14648438,24.1845703 C2.85416667,18.1741536 5.7890625,15.633138 9.95117188,16.5615234 C13.1702477,17.2795591 15.6379576,20.3295812 18.0982106,22.7656725 C20.4094398,25.0542036 22.7140882,26.8009261 25.6289062,25.5634766 C29.640625,23.8603516 31.1923828,22.3973024 30.2841797,21.174329" id="Path-2" stroke={color} />
      <path d="M18.7617188,1.13183594 C19.0065104,8.7672526 22.5634766,12.7470703 29.4326172,13.0712891" id="Path-3" stroke={color} />
      <path d="M1.35058594,11.3994141 C4.9078776,13.7373047 7.72949219,14.5166016 9.81542969,13.7373047 C12.9443359,12.5683594 14.8916016,8.52734375 20.6865234,8.52734375" id="Path-4" stroke={color} />
    </g>
  </svg>
);
