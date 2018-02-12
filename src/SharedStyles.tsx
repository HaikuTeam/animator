import {CSSProperties} from 'react';
import Palette from './Palette';

export const SHARED_STYLES = {
  btn: {
    height: '25px',
    padding: '4px 9px',
    fontSize: 11,
    letterSpacing: '1.3px',
    marginRight: '5px',
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '3px',
    color: Palette.ROCK,
    transform: 'scale(1)',
    cursor: 'pointer',
    transition: 'transform 200ms ease, border-color 200ms ease',
    backgroundColor: Palette.FATHER_COAL,
    marginBottom: '20px',
    ':active': {
      transform: 'scale(.9)',
    },
    ':hover': {
      color: Palette.ROCK,
    },
  } as CSSProperties,
};
