import * as Color from 'color';
import * as React from 'react';
import Palette from '../../../Palette';

export const PUBLISH_SHARED = {
  codebox: {
    color: Palette.ROCK,
    userSelect: 'all',
  },
  container: {
    padding: '0 30px',
    margin: '0 auto',
    height: '100%',
  },
  bullet: {
    borderRadius: 50,
    backgroundColor: 'rgba(254, 254, 254, .06)',
    color: Palette.ROCK,
    textAlign: 'center',
    display: 'inline-block',
    width: '18px',
    height: '18px',
    lineHeight: '18px',
    fontWeight: 'bold',
    fontSize: '11px',
  } as React.CSSProperties,
  block: {
    display: 'inline-block',
    verticalAlign: 'top',
    // fontSize: 14,
    width: '100%',
  },
  nav: {
    width: 190,
    borderLeft: 'none',
    padding: '30px 0 0 0',
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  link: {
    padding: '2px 16px',
    cursor: 'pointer',
    color: Color(Palette.ROCK).fade(0.5),
    ':hover': {
      color: Color(Palette.ROCK).fade(0.2),
      backgroundColor: Color(Palette.LIGHTER_GRAY).fade(0.39),
    },
  },
  inlineLink: {
    color: Color(Palette.ROCK).fade(0.2),
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    ':hover': {
      color: Color(Palette.ROCK).fade(0.3),
    },
  } as React.CSSProperties,
  active: {
    fontWeight: 'bold',
    color: Palette.ROCK,
    backgroundColor: Palette.LIGHTER_GRAY,
  },
  code: {
    backgroundColor: Palette.FATHER_COAL,
    borderRadius: 5,
    padding: '12px 20px',
    display: 'block',
    overflowX: 'auto',
    MozUserSelect: 'all',
    WebkitUserSelect: 'all',
    userSelect: 'all',
  } as React.CSSProperties,
  instructionsRow: {
    width: '100%',
    marginBottom: '15px',
  },
  instructionsCol1: {
    width: '25px',
    marginRight: '10px',
    display: 'inline-block',
  },
  instructionsCol2: {
    width: 'calc(100% - 35px)',
    display: 'inline-block',
    userSelect: 'none',
  },
};
