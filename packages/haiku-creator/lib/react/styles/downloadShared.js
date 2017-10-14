'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOWNLOAD_STYLES = undefined;

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _Palette = require('../components/Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _dashShared = require('./dashShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DOWNLOAD_STYLES = exports.DOWNLOAD_STYLES = {
  container: {
    fontSize: 16,
    zIndex: 9999999,
    backgroundColor: _Palette2.default.COAL,
    borderRadius: 3,
    padding: 20,
    color: _Palette2.default.ROCK,
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    position: 'fixed',
    display: 'inline-block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 325
  },
  btn: Object.assign({}, _dashShared.DASH_STYLES.btn, {
    padding: '10px 15px',
    fontSize: 16,
    float: 'right'
  }),
  btnSecondary: {
    textTransform: 'none',
    color: _Palette2.default.DARK_PINK
  },
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).fade(0.023),
    zIndex: 99999,
    pointerEvents: 'none'
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0'
  },
  progressBar: {
    width: '100%'
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9zdHlsZXMvZG93bmxvYWRTaGFyZWQuanMiXSwibmFtZXMiOlsiRE9XTkxPQURfU1RZTEVTIiwiY29udGFpbmVyIiwiZm9udFNpemUiLCJ6SW5kZXgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJDT0FMIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsImNvbG9yIiwiUk9DSyIsImJveFNoYWRvdyIsInBvc2l0aW9uIiwiZGlzcGxheSIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJtYXhXaWR0aCIsImJ0biIsImZsb2F0IiwiYnRuU2Vjb25kYXJ5IiwidGV4dFRyYW5zZm9ybSIsIkRBUktfUElOSyIsIm92ZXJsYXkiLCJ3aWR0aCIsImhlaWdodCIsIkdSQVkiLCJmYWRlIiwicG9pbnRlckV2ZW50cyIsInByb2dyZXNzTnVtYmVyIiwibWFyZ2luIiwicHJvZ3Jlc3NCYXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFTyxJQUFNQSw0Q0FBa0I7QUFDN0JDLGFBQVc7QUFDVEMsY0FBVSxFQUREO0FBRVRDLFlBQVEsT0FGQztBQUdUQyxxQkFBaUIsa0JBQVFDLElBSGhCO0FBSVRDLGtCQUFjLENBSkw7QUFLVEMsYUFBUyxFQUxBO0FBTVRDLFdBQU8sa0JBQVFDLElBTk47QUFPVEMsZUFBVyxpQ0FQRjtBQVFUQyxjQUFVLE9BUkQ7QUFTVEMsYUFBUyxjQVRBO0FBVVRDLFNBQUssS0FWSTtBQVdUQyxVQUFNLEtBWEc7QUFZVEMsZUFBVyx1QkFaRjtBQWFUQyxjQUFVO0FBYkQsR0FEa0I7QUFnQjdCQyx5QkFDSyx3QkFBWUEsR0FEakI7QUFFRVYsYUFBUyxXQUZYO0FBR0VMLGNBQVUsRUFIWjtBQUlFZ0IsV0FBTztBQUpULElBaEI2QjtBQXNCN0JDLGdCQUFjO0FBQ1pDLG1CQUFlLE1BREg7QUFFWlosV0FBTyxrQkFBUWE7QUFGSCxHQXRCZTtBQTBCN0JDLFdBQVM7QUFDUFgsY0FBVSxPQURIO0FBRVBZLFdBQU8sTUFGQTtBQUdQQyxZQUFRLE1BSEQ7QUFJUFgsU0FBSyxDQUpFO0FBS1BDLFVBQU0sQ0FMQztBQU1QVixxQkFBaUIscUJBQU0sa0JBQVFxQixJQUFkLEVBQW9CQyxJQUFwQixDQUF5QixLQUF6QixDQU5WO0FBT1B2QixZQUFRLEtBUEQ7QUFRUHdCLG1CQUFlO0FBUlIsR0ExQm9CO0FBb0M3QkMsa0JBQWdCO0FBQ2QxQixjQUFVLEVBREk7QUFFZDJCLFlBQVE7QUFGTSxHQXBDYTtBQXdDN0JDLGVBQWE7QUFDWFAsV0FBTztBQURJO0FBeENnQixDQUF4QiIsImZpbGUiOiJkb3dubG9hZFNoYXJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4uL2NvbXBvbmVudHMvUGFsZXR0ZSdcbmltcG9ydCB7IERBU0hfU1RZTEVTIH0gZnJvbSAnLi9kYXNoU2hhcmVkJ1xuXG5leHBvcnQgY29uc3QgRE9XTkxPQURfU1RZTEVTID0ge1xuICBjb250YWluZXI6IHtcbiAgICBmb250U2l6ZTogMTYsXG4gICAgekluZGV4OiA5OTk5OTk5LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBwYWRkaW5nOiAyMCxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGJveFNoYWRvdzogJzAgNHB4IDE4cHggMCByZ2JhKDEsMjgsMzMsMC4zOCknLFxuICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHRvcDogJzUwJScsXG4gICAgbGVmdDogJzUwJScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJyxcbiAgICBtYXhXaWR0aDogMzI1XG4gIH0sXG4gIGJ0bjoge1xuICAgIC4uLkRBU0hfU1RZTEVTLmJ0bixcbiAgICBwYWRkaW5nOiAnMTBweCAxNXB4JyxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgZmxvYXQ6ICdyaWdodCdcbiAgfSxcbiAgYnRuU2Vjb25kYXJ5OiB7XG4gICAgdGV4dFRyYW5zZm9ybTogJ25vbmUnLFxuICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUElOS1xuICB9LFxuICBvdmVybGF5OiB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjAyMyksXG4gICAgekluZGV4OiA5OTk5OSxcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgcHJvZ3Jlc3NOdW1iZXI6IHtcbiAgICBmb250U2l6ZTogMTUsXG4gICAgbWFyZ2luOiAnMTBweCAwIDAgMCdcbiAgfSxcbiAgcHJvZ3Jlc3NCYXI6IHtcbiAgICB3aWR0aDogJzEwMCUnXG4gIH1cbn1cbiJdfQ==