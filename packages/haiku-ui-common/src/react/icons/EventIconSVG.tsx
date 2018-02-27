import * as React from 'react';
import ButtonIconSVG from './ButtonIconSVG';

export default ({color = '#636E71'}) => (
  <ButtonIconSVG>
    <path d="M.223 16.4a1 1 0 0 0 .8 1.6h8.383l-.972-1.236-3.406 14c-.26 1.066 1.14 1.711 1.783.821l13-18A1 1 0 0 0 19 12h-8l.986 1.164 2-12C14.16.131 12.827-.438 12.2.401L.223 16.4zM12.013.837l-2 12A1 1 0 0 0 11 14h8l-.81-1.585-13 18 1.782.821 3.406-14A1 1 0 0 0 9.406 16H1.023l.8 1.6 11.978-16-1.787-.764z" stroke="none" fill={color}/>
  </ButtonIconSVG>
);

// TODO: delete this file if icon not in use
