import * as React from 'react';
import ButtonIconSVG from './ButtonIconSVG';

export default ({color = '#636E71'}) => (
  <ButtonIconSVG>
    <path d="M15.282 19.65c.396.467 1.04.467 1.436 0L31.702 2.038c.397-.466.397-1.222 0-1.688-.396-.467-1.04-.467-1.436 0L15.282 17.962h1.436L1.734.35C1.337-.117.694-.117.298.35-.1.816-.1 1.572.298 2.038L15.282 19.65z" stroke="none" fill={color}/>
  </ButtonIconSVG>
);
