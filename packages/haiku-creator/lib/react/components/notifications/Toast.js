'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/notifications/Toast.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _Palette = require('./../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('./../Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  cap: {
    width: '32px',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  success: {
    backgroundColor: _Palette2.default.GREEN
  },
  info: {
    backgroundColor: _Palette2.default.BLUE
  },
  warning: {
    backgroundColor: _Palette2.default.ORANGE
  },
  danger: {
    backgroundColor: _Palette2.default.RED
  },
  error: {
    backgroundColor: _Palette2.default.RED
  },
  closer: {
    backgroundColor: _Palette2.default.GRAY,
    color: _Palette2.default.ROCK,
    padding: '3px 7px 2px 7px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    fontSize: '11px',
    position: 'absolute',
    top: '8px',
    right: '8px',
    cursor: 'pointer',
    WebkitUserSelect: 'none'
  },
  lightCloser: {
    backgroundColor: _Palette2.default.FATHER_COAL,
    color: _Palette2.default.ROCK
  },
  container: {
    WebkitUserSelect: 'none',
    backgroundColor: _Palette2.default.COAL,
    width: '260px',
    padding: '9px 6px 9px 46px',
    zIndex: 3,
    position: 'relative',
    float: 'right',
    marginTop: '14px',
    marginRight: '14px',
    borderRadius: '3px',
    color: _Palette2.default.ROCK,
    overflow: 'hidden',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)'
  },
  title: {
    fontSize: '14.5px',
    fontStyle: 'italic',
    lineHeight: 1.3,
    color: _Palette2.default.ROCK,
    pointerEvents: 'none'
  },
  body: {
    fontSize: '12px',
    marginTop: '8px',
    color: _Palette2.default.DARK_ROCK,
    pointerEvents: 'none',
    width: '190px'
  }
};

var Toast = function (_React$Component) {
  _inherits(Toast, _React$Component);

  function Toast() {
    _classCallCheck(this, Toast);

    var _this = _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).call(this));

    _this.closeNotice = _this.closeNotice.bind(_this);
    return _this;
  }

  _createClass(Toast, [{
    key: 'closeNotice',
    value: function closeNotice() {
      this.props.removeNotice(this.props.myKey);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          toastType = _props.toastType,
          toastTitle = _props.toastTitle,
          toastMessage = _props.toastMessage,
          closeText = _props.closeText,
          lightScheme = _props.lightScheme;

      var icon = void 0;

      if (toastType === 'info') {
        icon = _react2.default.createElement(_Icons.InfoIconSVG, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 99
          },
          __self: this
        });
      } else if (toastType === 'success') {
        icon = _react2.default.createElement(_Icons.SuccessIconSVG, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 101
          },
          __self: this
        });
      } else if (toastType === 'warning') {
        icon = _react2.default.createElement(_Icons.WarningIconSVG, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 103
          },
          __self: this
        });
      } else if (toastType === 'danger' || toastType === 'error') {
        icon = _react2.default.createElement(_Icons.DangerIconSVG, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 105
          },
          __self: this
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.container,
          id: 'toast',
          className: 'toast', __source: {
            fileName: _jsxFileName,
            lineNumber: 109
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: [STYLES.cap, STYLES[toastType], lightScheme && { backgroundColor: (0, _color2.default)(STYLES[toastType].backgroundColor).fade(0.27) }],
            onClick: this.closeNotice, __source: {
              fileName: _jsxFileName,
              lineNumber: 112
            },
            __self: this
          },
          icon
        ),
        _react2.default.createElement(
          'div',
          { style: [STYLES.title], __source: {
              fileName: _jsxFileName,
              lineNumber: 119
            },
            __self: this
          },
          toastTitle
        ),
        _react2.default.createElement(
          'div',
          { style: [STYLES.body], __source: {
              fileName: _jsxFileName,
              lineNumber: 120
            },
            __self: this
          },
          toastMessage
        ),
        _react2.default.createElement(
          'span',
          {
            style: [STYLES.closer, lightScheme && STYLES.lightCloser],
            onClick: this.closeNotice, __source: {
              fileName: _jsxFileName,
              lineNumber: 121
            },
            __self: this
          },
          closeText || 'Got it'
        )
      );
    }
  }]);

  return Toast;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(Toast);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL25vdGlmaWNhdGlvbnMvVG9hc3QuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiY2FwIiwid2lkdGgiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJib3R0b20iLCJib3JkZXJUb3BMZWZ0UmFkaXVzIiwiYm9yZGVyQm90dG9tTGVmdFJhZGl1cyIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJzdWNjZXNzIiwiYmFja2dyb3VuZENvbG9yIiwiR1JFRU4iLCJpbmZvIiwiQkxVRSIsIndhcm5pbmciLCJPUkFOR0UiLCJkYW5nZXIiLCJSRUQiLCJlcnJvciIsImNsb3NlciIsIkdSQVkiLCJjb2xvciIsIlJPQ0siLCJwYWRkaW5nIiwiYm9yZGVyUmFkaXVzIiwidGV4dFRyYW5zZm9ybSIsImZvbnRTaXplIiwicmlnaHQiLCJjdXJzb3IiLCJXZWJraXRVc2VyU2VsZWN0IiwibGlnaHRDbG9zZXIiLCJGQVRIRVJfQ09BTCIsImNvbnRhaW5lciIsIkNPQUwiLCJ6SW5kZXgiLCJmbG9hdCIsIm1hcmdpblRvcCIsIm1hcmdpblJpZ2h0Iiwib3ZlcmZsb3ciLCJib3hTaGFkb3ciLCJ0aXRsZSIsImZvbnRTdHlsZSIsImxpbmVIZWlnaHQiLCJwb2ludGVyRXZlbnRzIiwiYm9keSIsIkRBUktfUk9DSyIsIlRvYXN0IiwiY2xvc2VOb3RpY2UiLCJiaW5kIiwicHJvcHMiLCJyZW1vdmVOb3RpY2UiLCJteUtleSIsInRvYXN0VHlwZSIsInRvYXN0VGl0bGUiLCJ0b2FzdE1lc3NhZ2UiLCJjbG9zZVRleHQiLCJsaWdodFNjaGVtZSIsImljb24iLCJmYWRlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxPQUFLO0FBQ0hDLFdBQU8sTUFESjtBQUVIQyxjQUFV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SyxlQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQVA7QUFDRDs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLE9BQU81RCxPQUFPbUMsU0FBbkI7QUFDRSxjQUFHLE9BREw7QUFFRSxxQkFBVSxPQUZaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdFO0FBQUE7QUFBQSxZQUFLLE9BQU8sQ0FDVm5DLE9BQU9DLEdBREcsRUFFVkQsT0FBT3VELFNBQVAsQ0FGVSxFQUdWSSxlQUFlLEVBQUM5QyxpQkFBaUIscUJBQU1iLE9BQU91RCxTQUFQLEVBQWtCMUMsZUFBeEIsRUFBeUNnRCxJQUF6QyxDQUE4QyxJQUE5QyxDQUFsQixFQUhMLENBQVo7QUFLRSxxQkFBUyxLQUFLWCxXQUxoQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLOEJVO0FBTDlCLFNBSEY7QUFVRTtBQUFBO0FBQUEsWUFBSyxPQUFPLENBQUM1RCxPQUFPMkMsS0FBUixDQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE2QmE7QUFBN0IsU0FWRjtBQVdFO0FBQUE7QUFBQSxZQUFLLE9BQU8sQ0FBQ3hELE9BQU8rQyxJQUFSLENBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTRCVTtBQUE1QixTQVhGO0FBWUU7QUFBQTtBQUFBO0FBQ0UsbUJBQU8sQ0FBQ3pELE9BQU9zQixNQUFSLEVBQWdCcUMsZUFBZTNELE9BQU9pQyxXQUF0QyxDQURUO0FBRUUscUJBQVMsS0FBS2lCLFdBRmhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUU4QlEsdUJBQWE7QUFGM0M7QUFaRixPQURGO0FBbUJEOzs7O0VBNUNpQixnQkFBTUksUzs7a0JBK0NYLHNCQUFPYixLQUFQLEMiLCJmaWxlIjoiVG9hc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vLi4vUGFsZXR0ZSdcbmltcG9ydCB7IFN1Y2Nlc3NJY29uU1ZHLCBJbmZvSWNvblNWRywgV2FybmluZ0ljb25TVkcsIERhbmdlckljb25TVkcgfSBmcm9tICcuLy4uL0ljb25zJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGNhcDoge1xuICAgIHdpZHRoOiAnMzJweCcsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIGJvcmRlclRvcExlZnRSYWRpdXM6ICczcHgnLFxuICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6ICczcHgnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcidcbiAgfSxcbiAgc3VjY2Vzczoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkVFTlxuICB9LFxuICBpbmZvOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkJMVUVcbiAgfSxcbiAgd2FybmluZzoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5PUkFOR0VcbiAgfSxcbiAgZGFuZ2VyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJFRFxuICB9LFxuICBlcnJvcjoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5SRURcbiAgfSxcbiAgY2xvc2VyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBwYWRkaW5nOiAnM3B4IDdweCAycHggN3B4JyxcbiAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnOHB4JyxcbiAgICByaWdodDogJzhweCcsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnXG4gIH0sXG4gIGxpZ2h0Q2xvc2VyOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgfSxcbiAgY29udGFpbmVyOiB7XG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIHdpZHRoOiAnMjYwcHgnLFxuICAgIHBhZGRpbmc6ICc5cHggNnB4IDlweCA0NnB4JyxcbiAgICB6SW5kZXg6IDMsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgbWFyZ2luVG9wOiAnMTRweCcsXG4gICAgbWFyZ2luUmlnaHQ6ICcxNHB4JyxcbiAgICBib3JkZXJSYWRpdXM6ICczcHgnLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIGJveFNoYWRvdzogJzAgNHB4IDE4cHggMCByZ2JhKDEsMjgsMzMsMC4zOCknXG4gIH0sXG4gIHRpdGxlOiB7XG4gICAgZm9udFNpemU6ICcxNC41cHgnLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgbGluZUhlaWdodDogMS4zLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGJvZHk6IHtcbiAgICBmb250U2l6ZTogJzEycHgnLFxuICAgIG1hcmdpblRvcDogJzhweCcsXG4gICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICB3aWR0aDogJzE5MHB4J1xuICB9XG59XG5cbmNsYXNzIFRvYXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcblxuICAgIHRoaXMuY2xvc2VOb3RpY2UgPSB0aGlzLmNsb3NlTm90aWNlLmJpbmQodGhpcylcbiAgfVxuXG4gIGNsb3NlTm90aWNlICgpIHtcbiAgICB0aGlzLnByb3BzLnJlbW92ZU5vdGljZSh0aGlzLnByb3BzLm15S2V5KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7dG9hc3RUeXBlLCB0b2FzdFRpdGxlLCB0b2FzdE1lc3NhZ2UsIGNsb3NlVGV4dCwgbGlnaHRTY2hlbWV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBpY29uXG5cbiAgICBpZiAodG9hc3RUeXBlID09PSAnaW5mbycpIHtcbiAgICAgIGljb24gPSA8SW5mb0ljb25TVkcgLz5cbiAgICB9IGVsc2UgaWYgKHRvYXN0VHlwZSA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICBpY29uID0gPFN1Y2Nlc3NJY29uU1ZHIC8+XG4gICAgfSBlbHNlIGlmICh0b2FzdFR5cGUgPT09ICd3YXJuaW5nJykge1xuICAgICAgaWNvbiA9IDxXYXJuaW5nSWNvblNWRyAvPlxuICAgIH0gZWxzZSBpZiAodG9hc3RUeXBlID09PSAnZGFuZ2VyJyB8fCB0b2FzdFR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgIGljb24gPSA8RGFuZ2VySWNvblNWRyAvPlxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGFpbmVyfVxuICAgICAgICBpZD0ndG9hc3QnXG4gICAgICAgIGNsYXNzTmFtZT0ndG9hc3QnPlxuICAgICAgICA8ZGl2IHN0eWxlPXtbXG4gICAgICAgICAgU1RZTEVTLmNhcCxcbiAgICAgICAgICBTVFlMRVNbdG9hc3RUeXBlXSxcbiAgICAgICAgICBsaWdodFNjaGVtZSAmJiB7YmFja2dyb3VuZENvbG9yOiBDb2xvcihTVFlMRVNbdG9hc3RUeXBlXS5iYWNrZ3JvdW5kQ29sb3IpLmZhZGUoMC4yNyl9XG4gICAgICAgIF19XG4gICAgICAgICAgb25DbGljaz17dGhpcy5jbG9zZU5vdGljZX0+e2ljb259XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLnRpdGxlXX0+e3RvYXN0VGl0bGV9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuYm9keV19Pnt0b2FzdE1lc3NhZ2V9PC9kaXY+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgc3R5bGU9e1tTVFlMRVMuY2xvc2VyLCBsaWdodFNjaGVtZSAmJiBTVFlMRVMubGlnaHRDbG9zZXJdfVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2xvc2VOb3RpY2V9PntjbG9zZVRleHQgfHwgJ0dvdCBpdCd9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oVG9hc3QpXG4iXX0=