import * as React from 'react';
import ButtonIconSVG from './ButtonIconSVG';

export default ({color = '#636E71'}) => (
  <ButtonIconSVG>
    <path d="M.35 16.718c-.467-.396-.467-1.04 0-1.436L17.962.298c.466-.397 1.222-.397 1.688 0 .467.396.467 1.04 0 1.436L2.038 16.718v-1.436L19.65 30.266c.467.397.467 1.04 0 1.436-.466.397-1.222.397-1.688 0L.35 16.718z" stroke="none" fill={color}/>
  </ButtonIconSVG>
);
