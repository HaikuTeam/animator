'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POPOVER_STYLES = undefined;

var _DefaultPalette = require('./../DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var popoverWidth = 170;
var pageTransDur = 170;

var POPOVER_STYLES = exports.POPOVER_STYLES = {
  container: {
    borderRadius: '4px',
    minHeight: 80,
    maxHeight: '200px',
    width: popoverWidth + 'px',
    display: 'relative',
    backgroundColor: _DefaultPalette2.default.FATHER_COAL,
    color: _DefaultPalette2.default.ROCK,
    boxShadow: '0 6px 25px 0 ' + _DefaultPalette2.default.FATHER_COAL,
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  pagesWrapper: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '4px',
    width: popoverWidth
  },
  pages: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    width: popoverWidth,
    fontSize: '12px',
    WebkitUserSelect: 'none',
    overflow: 'auto'
  },
  pageOne: {
    transition: 'transform 220ms ease',
    transform: 'translate3d(0, 0, 0)',
    height: 100
  },
  pageTwo: {
    backgroundColor: _DefaultPalette2.default.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: 'transform ' + pageTransDur + 'ms ease-out',
    color: 'white',
    width: popoverWidth + 1,
    height: 142,
    borderLeft: '1px solid ' + _DefaultPalette2.default.COAL,
    marginLeft: '-1px'
  },
  pageThree: {
    backgroundColor: _DefaultPalette2.default.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: 'transform ' + pageTransDur + 'ms ease-out',
    color: 'white',
    width: popoverWidth + 1,
    height: 200,
    borderLeft: '1px solid ' + _DefaultPalette2.default.COAL,
    marginLeft: '-1px'
  },
  onPage: {
    transform: 'translate3d(0, 0, 0)'
  },
  leftPage: {
    transform: 'translate3d(-30px, 0, 0)'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '35px',
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1.3px',
    borderBottom: '1px solid ' + _DefaultPalette2.default.COAL
  },
  title: {
    paddingTop: 3,
    color: _DefaultPalette2.default.DARK_ROCK,
    cursor: 'default',
    width: '100%'
  },
  mutedText: {
    color: _DefaultPalette2.default.ROCK_MUTED,
    fontStyle: 'italic'
  },
  strong: {
    color: _DefaultPalette2.default.ROCK,
    fontStyle: 'italic',
    fontWeight: 700
  },
  btn: {
    backgroundColor: _DefaultPalette2.default.COAL,
    color: _DefaultPalette2.default.ROCK,
    fontSize: 12,
    padding: '4px 12px',
    borderRadius: 3,
    ':hover': {
      backgroundColor: _DefaultPalette2.default.GRAY
    }
  },
  btnFull: {
    width: '90%',
    margin: '0 0 0 8px'
  },
  flip: {
    transform: 'rotate(180deg)',
    padding: '8px !important'
  },
  bottomRow: {
    borderTop: '1px solid ' + _DefaultPalette2.default.COAL,
    padding: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  btnMini: {
    padding: 4,
    opacity: 0.7,
    float: 'right',
    ':hover': {
      opacity: 1
    }
  },
  rogueLayout: {
    marginTop: '3px'
  },
  btnTrans: {
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: 'transparent'
    }
  },
  btnPrev: {
    position: 'absolute',
    left: 0,
    top: '6px'
  },
  row: {
    position: 'relative',
    width: '100%',
    padding: '3px 10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: _DefaultPalette2.default.DARK_GRAY
    }
  },
  rowNoBg: {
    ':hover': {
      backgroundColor: 'transparent'
    }
  },
  shorty: {
    width: '63%',
    pointerEvents: 'none'
  },
  indicator: {
    borderRadius: '50%',
    marginRight: 7,
    marginLeft: 2,
    width: 8,
    height: 8,
    display: 'inline-block'
  },
  activeIndicator: {
    backgroundColor: _DefaultPalette2.default.LIGHT_PINK
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3N0eWxlcy9wb3BvdmVyU2hhcmVkLmpzIl0sIm5hbWVzIjpbInBvcG92ZXJXaWR0aCIsInBhZ2VUcmFuc0R1ciIsIlBPUE9WRVJfU1RZTEVTIiwiY29udGFpbmVyIiwiYm9yZGVyUmFkaXVzIiwibWluSGVpZ2h0IiwibWF4SGVpZ2h0Iiwid2lkdGgiLCJkaXNwbGF5IiwiYmFja2dyb3VuZENvbG9yIiwiRkFUSEVSX0NPQUwiLCJjb2xvciIsIlJPQ0siLCJib3hTaGFkb3ciLCJvdmVyZmxvd1giLCJvdmVyZmxvd1kiLCJwYWdlc1dyYXBwZXIiLCJvdmVyZmxvdyIsInBvc2l0aW9uIiwicGFnZXMiLCJ0b3AiLCJsZWZ0IiwiZm9udFNpemUiLCJXZWJraXRVc2VyU2VsZWN0IiwicGFnZU9uZSIsInRyYW5zaXRpb24iLCJ0cmFuc2Zvcm0iLCJoZWlnaHQiLCJwYWdlVHdvIiwiYm9yZGVyTGVmdCIsIkNPQUwiLCJtYXJnaW5MZWZ0IiwicGFnZVRocmVlIiwib25QYWdlIiwibGVmdFBhZ2UiLCJ0aXRsZVJvdyIsImFsaWduSXRlbXMiLCJ0ZXh0QWxpZ24iLCJ0ZXh0VHJhbnNmb3JtIiwibGV0dGVyU3BhY2luZyIsImJvcmRlckJvdHRvbSIsInRpdGxlIiwicGFkZGluZ1RvcCIsIkRBUktfUk9DSyIsImN1cnNvciIsIm11dGVkVGV4dCIsIlJPQ0tfTVVURUQiLCJmb250U3R5bGUiLCJzdHJvbmciLCJmb250V2VpZ2h0IiwiYnRuIiwicGFkZGluZyIsIkdSQVkiLCJidG5GdWxsIiwibWFyZ2luIiwiZmxpcCIsImJvdHRvbVJvdyIsImJvcmRlclRvcCIsImJvdHRvbSIsInJpZ2h0IiwiYnRuTWluaSIsIm9wYWNpdHkiLCJmbG9hdCIsInJvZ3VlTGF5b3V0IiwibWFyZ2luVG9wIiwiYnRuVHJhbnMiLCJidG5QcmV2Iiwicm93IiwiREFSS19HUkFZIiwicm93Tm9CZyIsInNob3J0eSIsInBvaW50ZXJFdmVudHMiLCJpbmRpY2F0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ImltcG9ydCBQYWxldHRlIGZyb20gJy4vLi4vRGVmYXVsdFBhbGV0dGUnXG5cbmNvbnN0IHBvcG92ZXJXaWR0aCA9IDE3MFxuY29uc3QgcGFnZVRyYW5zRHVyID0gMTcwXG5cbmV4cG9ydCBjb25zdCBQT1BPVkVSX1NUWUxFUyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICBtaW5IZWlnaHQ6IDgwLFxuICAgIG1heEhlaWdodDogJzIwMHB4JyxcbiAgICB3aWR0aDogcG9wb3ZlcldpZHRoICsgJ3B4JyxcbiAgICBkaXNwbGF5OiAncmVsYXRpdmUnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGJveFNoYWRvdzogJzAgNnB4IDI1cHggMCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICBvdmVyZmxvd1g6ICdoaWRkZW4nLFxuICAgIG92ZXJmbG93WTogJ2F1dG8nXG4gIH0sXG4gIHBhZ2VzV3JhcHBlcjoge1xuICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGhcbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGgsXG4gICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgb3ZlcmZsb3c6ICdhdXRvJ1xuICB9LFxuICBwYWdlT25lOiB7XG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAyMjBtcyBlYXNlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgwLCAwLCAwKScsXG4gICAgaGVpZ2h0OiAxMDBcbiAgfSxcbiAgcGFnZVR3bzoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgdHJhbnNpdGlvbjogYHRyYW5zZm9ybSAke3BhZ2VUcmFuc0R1cn1tcyBlYXNlLW91dGAsXG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgd2lkdGg6IHBvcG92ZXJXaWR0aCArIDEsXG4gICAgaGVpZ2h0OiAxNDIsXG4gICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5DT0FMLFxuICAgIG1hcmdpbkxlZnQ6ICctMXB4J1xuICB9LFxuICBwYWdlVGhyZWU6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLFxuICAgIHRyYW5zaXRpb246IGB0cmFuc2Zvcm0gJHtwYWdlVHJhbnNEdXJ9bXMgZWFzZS1vdXRgLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGggKyAxLFxuICAgIGhlaWdodDogMjAwLFxuICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuQ09BTCxcbiAgICBtYXJnaW5MZWZ0OiAnLTFweCdcbiAgfSxcbiAgb25QYWdlOiB7XG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknXG4gIH0sXG4gIGxlZnRQYWdlOiB7XG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTMwcHgsIDAsIDApJ1xuICB9LFxuICB0aXRsZVJvdzoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBoZWlnaHQ6ICczNXB4JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgbGV0dGVyU3BhY2luZzogJzEuM3B4JyxcbiAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIFBhbGV0dGUuQ09BTFxuICB9LFxuICB0aXRsZToge1xuICAgIHBhZGRpbmdUb3A6IDMsXG4gICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLLFxuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIHdpZHRoOiAnMTAwJSdcbiAgfSxcbiAgbXV0ZWRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHN0cm9uZzoge1xuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICBmb250V2VpZ2h0OiA3MDBcbiAgfSxcbiAgYnRuOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBmb250U2l6ZTogMTIsXG4gICAgcGFkZGluZzogJzRweCAxMnB4JyxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZXG4gICAgfVxuICB9LFxuICBidG5GdWxsOiB7XG4gICAgd2lkdGg6ICc5MCUnLFxuICAgIG1hcmdpbjogJzAgMCAwIDhweCdcbiAgfSxcbiAgZmxpcDoge1xuICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSgxODBkZWcpJyxcbiAgICBwYWRkaW5nOiAnOHB4ICFpbXBvcnRhbnQnXG4gIH0sXG4gIGJvdHRvbVJvdzoge1xuICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5DT0FMLFxuICAgIHBhZGRpbmc6IDYsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDBcbiAgfSxcbiAgYnRuTWluaToge1xuICAgIHBhZGRpbmc6IDQsXG4gICAgb3BhY2l0eTogMC43LFxuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBvcGFjaXR5OiAxXG4gICAgfVxuICB9LFxuICByb2d1ZUxheW91dDoge1xuICAgIG1hcmdpblRvcDogJzNweCdcbiAgfSxcbiAgYnRuVHJhbnM6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuICAgIH1cbiAgfSxcbiAgYnRuUHJldjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IDAsXG4gICAgdG9wOiAnNnB4J1xuICB9LFxuICByb3c6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHBhZGRpbmc6ICczcHggMTBweCcsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLX0dSQVlcbiAgICB9XG4gIH0sXG4gIHJvd05vQmc6IHtcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG4gICAgfVxuICB9LFxuICBzaG9ydHk6IHtcbiAgICB3aWR0aDogJzYzJScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGluZGljYXRvcjoge1xuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgbWFyZ2luTGVmdDogMixcbiAgICB3aWR0aDogOCxcbiAgICBoZWlnaHQ6IDgsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgfSxcbiAgYWN0aXZlSW5kaWNhdG9yOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX1BJTktcbiAgfVxufVxuIl19