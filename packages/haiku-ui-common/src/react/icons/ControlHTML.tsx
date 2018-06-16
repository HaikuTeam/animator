import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette.ROCK}) => (
  <svg width="16px" height="16px" viewBox="0 0 32 32">
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(0,4)">
      <path d="M0,12.2590397 L9.49710983,4.33491405 L9.49710983,6.86721992 L3.0121112,12.2448133 L9.49710983,17.6935388 L9.49710983,20.1831654 L0,12.2590397 Z M12.0143132,24 L10.4186623,24 L19.0539499,0 L20.5984035,0 L12.0143132,24 Z M31,12.2590397 L21.5028902,20.1831654 L21.5028902,17.665086 L28.0049546,12.2732662 L21.5028902,6.83876704 L21.5028902,4.33491405 L31,12.2590397 Z" id="&lt;/&gt;" fill={color} />
    </g>
  </svg>
);
