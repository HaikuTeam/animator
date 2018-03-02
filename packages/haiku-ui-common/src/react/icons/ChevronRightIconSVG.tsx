import * as React from 'react';
import ButtonIconSVG from './ButtonIconSVG';

export default ({color = '#636E71'}) => (
  <ButtonIconSVG>
    <path d="M23.65 15.282c.467.396.467 1.04 0 1.436L6.038 31.702c-.466.397-1.222.397-1.688 0-.467-.396-.467-1.04 0-1.436l17.612-14.984v1.436L4.35 1.734c-.467-.397-.467-1.04 0-1.436.466-.397 1.222-.397 1.688 0L23.65 15.282z" stroke="none" fill={color}/>
  </ButtonIconSVG>
);
