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
    zIndex: 99999
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0'
  },
  progressBar: {
    width: '100%'
  },
  formInput: {
    display: 'flex',
    marginBottom: 15
  },
  checkInput: {
    marginRight: 10
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9zdHlsZXMvZG93bmxvYWRTaGFyZWQuanMiXSwibmFtZXMiOlsiRE9XTkxPQURfU1RZTEVTIiwiY29udGFpbmVyIiwiZm9udFNpemUiLCJ6SW5kZXgiLCJiYWNrZ3JvdW5kQ29sb3IiLCJDT0FMIiwiYm9yZGVyUmFkaXVzIiwicGFkZGluZyIsImNvbG9yIiwiUk9DSyIsImJveFNoYWRvdyIsInBvc2l0aW9uIiwiZGlzcGxheSIsInRvcCIsImxlZnQiLCJ0cmFuc2Zvcm0iLCJtYXhXaWR0aCIsImJ0biIsImZsb2F0IiwiYnRuU2Vjb25kYXJ5IiwidGV4dFRyYW5zZm9ybSIsIkRBUktfUElOSyIsIm92ZXJsYXkiLCJ3aWR0aCIsImhlaWdodCIsIkdSQVkiLCJmYWRlIiwicHJvZ3Jlc3NOdW1iZXIiLCJtYXJnaW4iLCJwcm9ncmVzc0JhciIsImZvcm1JbnB1dCIsIm1hcmdpbkJvdHRvbSIsImNoZWNrSW5wdXQiLCJtYXJnaW5SaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVPLElBQU1BLDRDQUFrQjtBQUM3QkMsYUFBVztBQUNUQyxjQUFVLEVBREQ7QUFFVEMsWUFBUSxPQUZDO0FBR1RDLHFCQUFpQixrQkFBUUMsSUFIaEI7QUFJVEMsa0JBQWMsQ0FKTDtBQUtUQyxhQUFTLEVBTEE7QUFNVEMsV0FBTyxrQkFBUUMsSUFOTjtBQU9UQyxlQUFXLGlDQVBGO0FBUVRDLGNBQVUsT0FSRDtBQVNUQyxhQUFTLGNBVEE7QUFVVEMsU0FBSyxLQVZJO0FBV1RDLFVBQU0sS0FYRztBQVlUQyxlQUFXLHVCQVpGO0FBYVRDLGNBQVU7QUFiRCxHQURrQjtBQWdCN0JDLHlCQUNLLHdCQUFZQSxHQURqQjtBQUVFVixhQUFTLFdBRlg7QUFHRUwsY0FBVSxFQUhaO0FBSUVnQixXQUFPO0FBSlQsSUFoQjZCO0FBc0I3QkMsZ0JBQWM7QUFDWkMsbUJBQWUsTUFESDtBQUVaWixXQUFPLGtCQUFRYTtBQUZILEdBdEJlO0FBMEI3QkMsV0FBUztBQUNQWCxjQUFVLE9BREg7QUFFUFksV0FBTyxNQUZBO0FBR1BDLFlBQVEsTUFIRDtBQUlQWCxTQUFLLENBSkU7QUFLUEMsVUFBTSxDQUxDO0FBTVBWLHFCQUFpQixxQkFBTSxrQkFBUXFCLElBQWQsRUFBb0JDLElBQXBCLENBQXlCLEtBQXpCLENBTlY7QUFPUHZCLFlBQVE7QUFQRCxHQTFCb0I7QUFtQzdCd0Isa0JBQWdCO0FBQ2R6QixjQUFVLEVBREk7QUFFZDBCLFlBQVE7QUFGTSxHQW5DYTtBQXVDN0JDLGVBQWE7QUFDWE4sV0FBTztBQURJLEdBdkNnQjtBQTBDN0JPLGFBQVc7QUFDVGxCLGFBQVMsTUFEQTtBQUVUbUIsa0JBQWM7QUFGTCxHQTFDa0I7QUE4QzdCQyxjQUFZO0FBQ1ZDLGlCQUFhO0FBREg7QUE5Q2lCLENBQXhCIiwiZmlsZSI6ImRvd25sb2FkU2hhcmVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi4vY29tcG9uZW50cy9QYWxldHRlJ1xuaW1wb3J0IHsgREFTSF9TVFlMRVMgfSBmcm9tICcuL2Rhc2hTaGFyZWQnXG5cbmV4cG9ydCBjb25zdCBET1dOTE9BRF9TVFlMRVMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGZvbnRTaXplOiAxNixcbiAgICB6SW5kZXg6IDk5OTk5OTksXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIHBhZGRpbmc6IDIwLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYm94U2hhZG93OiAnMCA0cHggMThweCAwIHJnYmEoMSwyOCwzMywwLjM4KScsXG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgdG9wOiAnNTAlJyxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgIG1heFdpZHRoOiAzMjVcbiAgfSxcbiAgYnRuOiB7XG4gICAgLi4uREFTSF9TVFlMRVMuYnRuLFxuICAgIHBhZGRpbmc6ICcxMHB4IDE1cHgnLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBmbG9hdDogJ3JpZ2h0J1xuICB9LFxuICBidG5TZWNvbmRhcnk6IHtcbiAgICB0ZXh0VHJhbnNmb3JtOiAnbm9uZScsXG4gICAgY29sb3I6IFBhbGV0dGUuREFSS19QSU5LXG4gIH0sXG4gIG92ZXJsYXk6IHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5HUkFZKS5mYWRlKDAuMDIzKSxcbiAgICB6SW5kZXg6IDk5OTk5XG4gIH0sXG4gIHByb2dyZXNzTnVtYmVyOiB7XG4gICAgZm9udFNpemU6IDE1LFxuICAgIG1hcmdpbjogJzEwcHggMCAwIDAnXG4gIH0sXG4gIHByb2dyZXNzQmFyOiB7XG4gICAgd2lkdGg6ICcxMDAlJ1xuICB9LFxuICBmb3JtSW5wdXQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgbWFyZ2luQm90dG9tOiAxNVxuICB9LFxuICBjaGVja0lucHV0OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDEwXG4gIH1cbn1cbiJdfQ==