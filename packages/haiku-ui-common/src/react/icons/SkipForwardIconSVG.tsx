import * as React from 'react';
import Palette from './../../Palette';

export default ({color = Palette.SUNSTONE}) => (
  <svg width="24" height="24" viewBox="0 0 20 20">
    <path d="M6.5 16a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .82-.384l6 5a.5.5 0 0 1 0 .768l-6 5A.502.502 0 0 1 6.5 16zM7 6.568v7.865l4.719-3.933L7 6.568z" fill={color}/>
    <path d="M13.5 15a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 1 0v8a.5.5 0 0 1-.5.5z" fill={color}/>
  </svg>
);
