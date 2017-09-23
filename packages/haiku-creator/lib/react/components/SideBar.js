'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/SideBar.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('./Icons');

var _btnShared = require('../styles/btnShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  container: {
    position: 'relative',
    backgroundColor: _Palette2.default.GRAY,
    WebkitUserSelect: 'none'
  },
  bar: { // This invisible bar is for grabbing and moving around the application via its 'frame' class
    position: 'absolute',
    right: 0,
    left: 0,
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: _Palette2.default.COAL
  },
  nav: {
    // display: 'none', // COMMENTING OUT THE STATE INSPECTOR NAV SEARCH 'ADDSTATEINSPECTOR' FOR MORE
    float: 'left',
    poistion: 'relative',
    width: 36,
    marginTop: 36,
    height: 'calc(100% - 36px)',
    backgroundColor: _Palette2.default.COAL
  },
  btnNav: {
    opacity: 0.66,
    height: 40,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      opacity: 1
    }
  },
  activeBtnNav: {
    opacity: 1
  },
  activeIndicator: {
    backgroundColor: _Palette2.default.LIGHTEST_PINK,
    position: 'absolute',
    top: 42,
    left: 0,
    height: 29,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    transform: 'translateY(0)',
    transition: 'transform 220ms cubic-bezier(0.75, 0.14, 0.1, 1.38)'
  },
  activeSecond: { // Yes, this is gross ¯\_(ツ)_/¯
    transform: 'translateY(40px)'
  },
  panelWrapper: {
    float: 'left',
    marginTop: 36,
    height: 'calc(100% - 36px)',
    width: 'calc(100% - 36px)' // ADDSTATEINSPECTOR
  }
};

var SideBar = function (_React$Component) {
  _inherits(SideBar, _React$Component);

  function SideBar(props) {
    _classCallCheck(this, SideBar);

    var _this = _possibleConstructorReturn(this, (SideBar.__proto__ || Object.getPrototypeOf(SideBar)).call(this, props));

    _this.state = {
      isFullscreen: null
    };
    return _this;
  }

  _createClass(SideBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var self = this;
      this.windowResizeHandler = function (e) {
        // note: using 'resize' because 'fullscreenchange' doesn't seem to work in Electron
        var isFullscreen = !window.screenTop && !window.screenY;
        self.setState({ isFullscreen: isFullscreen });
      };
      window.addEventListener('resize', this.windowResizeHandler);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.windowResizeHandler);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { style: STYLES.container, className: 'layout-box', __source: {
            fileName: _jsxFileName,
            lineNumber: 98
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: [STYLES.bar, { zIndex: 1, paddingLeft: this.state.isFullscreen ? 15 : 82 }], className: 'frame', __source: {
              fileName: _jsxFileName,
              lineNumber: 99
            },
            __self: this
          },
          _react2.default.createElement(_Icons.LogoMiniSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 100
            },
            __self: this
          }),
          _react2.default.createElement(
            'button',
            { id: 'go-to-dashboard', key: 'dashboard', onClick: function onClick() {
                return _this2.props.setDashboardVisibility(true);
              },
              style: [_btnShared.BTN_STYLES.btnIcon, _btnShared.BTN_STYLES.btnIconHover, _btnShared.BTN_STYLES.btnText, { width: 'auto', position: 'absolute', right: 6 }], __source: {
                fileName: _jsxFileName,
                lineNumber: 101
              },
              __self: this
            },
            _react2.default.createElement(_Icons.ChevronLeftMenuIconSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 106
              },
              __self: this
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.nav, __source: {
              fileName: _jsxFileName,
              lineNumber: 109
            },
            __self: this
          },
          _react2.default.createElement('div', { style: [STYLES.activeIndicator, this.props.activeNav === 'state_inspector' && STYLES.activeSecond], __source: {
              fileName: _jsxFileName,
              lineNumber: 110
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            { key: 'library',
              style: [STYLES.btnNav, this.props.activeNav === 'library' && STYLES.activeBtnNav],
              onClick: function onClick() {
                return _this2.props.switchActiveNav('library');
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 111
              },
              __self: this
            },
            _react2.default.createElement(_Icons.LibraryIconSVG, { color: _Palette2.default.ROCK, __source: {
                fileName: _jsxFileName,
                lineNumber: 114
              },
              __self: this
            })
          ),
          _react2.default.createElement(
            'div',
            { id: 'state-inspector', key: 'state_inspector',
              style: [STYLES.btnNav, this.props.activeNav === 'state_inspector' && STYLES.activeBtnNav],
              onClick: function onClick() {
                return _this2.props.switchActiveNav('state_inspector');
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 116
              },
              __self: this
            },
            _react2.default.createElement(_Icons.StateInspectorIconSVG, { color: _Palette2.default.ROCK, __source: {
                fileName: _jsxFileName,
                lineNumber: 119
              },
              __self: this
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.panelWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            },
            __self: this
          },
          this.props.children
        )
      );
    }
  }]);

  return SideBar;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(SideBar);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1NpZGVCYXIuanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiY29udGFpbmVyIiwicG9zaXRpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJHUkFZIiwiV2Via2l0VXNlclNlbGVjdCIsImJhciIsInJpZ2h0IiwibGVmdCIsImhlaWdodCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJDT0FMIiwibmF2IiwiZmxvYXQiLCJwb2lzdGlvbiIsIndpZHRoIiwibWFyZ2luVG9wIiwiYnRuTmF2Iiwib3BhY2l0eSIsImN1cnNvciIsImFjdGl2ZUJ0bk5hdiIsImFjdGl2ZUluZGljYXRvciIsIkxJR0hURVNUX1BJTksiLCJ0b3AiLCJib3JkZXJUb3BSaWdodFJhZGl1cyIsImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsImFjdGl2ZVNlY29uZCIsInBhbmVsV3JhcHBlciIsIlNpZGVCYXIiLCJwcm9wcyIsInN0YXRlIiwiaXNGdWxsc2NyZWVuIiwic2VsZiIsIndpbmRvd1Jlc2l6ZUhhbmRsZXIiLCJlIiwid2luZG93Iiwic2NyZWVuVG9wIiwic2NyZWVuWSIsInNldFN0YXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ6SW5kZXgiLCJwYWRkaW5nTGVmdCIsInNldERhc2hib2FyZFZpc2liaWxpdHkiLCJidG5JY29uIiwiYnRuSWNvbkhvdmVyIiwiYnRuVGV4dCIsImFjdGl2ZU5hdiIsInN3aXRjaEFjdGl2ZU5hdiIsIlJPQ0siLCJjaGlsZHJlbiIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBTUE7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLGFBQVc7QUFDVEMsY0FBVSxVQUREO0FBRVRDLHFCQUFpQixrQkFBUUMsSUFGaEI7QUFH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QUFBQTtBQUFBLFlBQUssT0FBT3JELE9BQU8rQixZQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxlQUFLRSxLQUFMLENBQVdxQjtBQURkO0FBeEJGLE9BREY7QUE4QkQ7Ozs7RUFyRG1CLGdCQUFNQyxTOztrQkF3RGIsc0JBQU92QixPQUFQLEMiLCJmaWxlIjoiU2lkZUJhci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IHtcbiAgQ2hldnJvbkxlZnRNZW51SWNvblNWRyxcbiAgU3RhdGVJbnNwZWN0b3JJY29uU1ZHLFxuICBMaWJyYXJ5SWNvblNWRyxcbiAgTG9nb01pbmlTVkdcbiAgfSBmcm9tICcuL0ljb25zJ1xuaW1wb3J0IHsgQlROX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9idG5TaGFyZWQnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnXG4gIH0sXG4gIGJhcjogeyAvLyBUaGlzIGludmlzaWJsZSBiYXIgaXMgZm9yIGdyYWJiaW5nIGFuZCBtb3ZpbmcgYXJvdW5kIHRoZSBhcHBsaWNhdGlvbiB2aWEgaXRzICdmcmFtZScgY2xhc3NcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICByaWdodDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIGhlaWdodDogJzM2cHgnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtc3RhcnQnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gIH0sXG4gIG5hdjoge1xuICAgIC8vIGRpc3BsYXk6ICdub25lJywgLy8gQ09NTUVOVElORyBPVVQgVEhFIFNUQVRFIElOU1BFQ1RPUiBOQVYgU0VBUkNIICdBRERTVEFURUlOU1BFQ1RPUicgRk9SIE1PUkVcbiAgICBmbG9hdDogJ2xlZnQnLFxuICAgIHBvaXN0aW9uOiAncmVsYXRpdmUnLFxuICAgIHdpZHRoOiAzNixcbiAgICBtYXJnaW5Ub3A6IDM2LFxuICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDM2cHgpJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICB9LFxuICBidG5OYXY6IHtcbiAgICBvcGFjaXR5OiAwLjY2LFxuICAgIGhlaWdodDogNDAsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgb3BhY2l0eTogMVxuICAgIH1cbiAgfSxcbiAgYWN0aXZlQnRuTmF2OiB7XG4gICAgb3BhY2l0eTogMVxuICB9LFxuICBhY3RpdmVJbmRpY2F0b3I6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfUElOSyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDQyLFxuICAgIGxlZnQ6IDAsXG4gICAgaGVpZ2h0OiAyOSxcbiAgICB3aWR0aDogMyxcbiAgICBib3JkZXJUb3BSaWdodFJhZGl1czogMixcbiAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogMixcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIyMG1zIGN1YmljLWJlemllcigwLjc1LCAwLjE0LCAwLjEsIDEuMzgpJ1xuICB9LFxuICBhY3RpdmVTZWNvbmQ6IHsgLy8gWWVzLCB0aGlzIGlzIGdyb3NzIMKvXFxfKOODhClfL8KvXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSg0MHB4KSdcbiAgfSxcbiAgcGFuZWxXcmFwcGVyOiB7XG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBtYXJnaW5Ub3A6IDM2LFxuICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDM2cHgpJyxcbiAgICB3aWR0aDogJ2NhbGMoMTAwJSAtIDM2cHgpJyAgICAgICAgICAvLyBBRERTVEFURUlOU1BFQ1RPUlxuICB9XG59XG5cbmNsYXNzIFNpZGVCYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNGdWxsc2NyZWVuOiBudWxsXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIHRoaXMud2luZG93UmVzaXplSGFuZGxlciA9IChlKSA9PiB7XG4gICAgICAvLyBub3RlOiB1c2luZyAncmVzaXplJyBiZWNhdXNlICdmdWxsc2NyZWVuY2hhbmdlJyBkb2Vzbid0IHNlZW0gdG8gd29yayBpbiBFbGVjdHJvblxuICAgICAgY29uc3QgaXNGdWxsc2NyZWVuID0gIXdpbmRvdy5zY3JlZW5Ub3AgJiYgIXdpbmRvdy5zY3JlZW5ZXG4gICAgICBzZWxmLnNldFN0YXRlKHtpc0Z1bGxzY3JlZW59KVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy53aW5kb3dSZXNpemVIYW5kbGVyKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUhhbmRsZXIpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGFpbmVyfSBjbGFzc05hbWU9J2xheW91dC1ib3gnPlxuICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmJhciwge3pJbmRleDogMSwgcGFkZGluZ0xlZnQ6IHRoaXMuc3RhdGUuaXNGdWxsc2NyZWVuID8gMTUgOiA4Mn1dfSBjbGFzc05hbWU9J2ZyYW1lJz5cbiAgICAgICAgICA8TG9nb01pbmlTVkcgLz5cbiAgICAgICAgICA8YnV0dG9uIGlkPSdnby10by1kYXNoYm9hcmQnIGtleT0nZGFzaGJvYXJkJyBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLnNldERhc2hib2FyZFZpc2liaWxpdHkodHJ1ZSl9XG4gICAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgICBCVE5fU1RZTEVTLmJ0bkljb24sIEJUTl9TVFlMRVMuYnRuSWNvbkhvdmVyLCBCVE5fU1RZTEVTLmJ0blRleHQsXG4gICAgICAgICAgICAgIHt3aWR0aDogJ2F1dG8nLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDZ9XG4gICAgICAgICAgICBdfT5cbiAgICAgICAgICAgIDxDaGV2cm9uTGVmdE1lbnVJY29uU1ZHIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMubmF2fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmFjdGl2ZUluZGljYXRvciwgdGhpcy5wcm9wcy5hY3RpdmVOYXYgPT09ICdzdGF0ZV9pbnNwZWN0b3InICYmIFNUWUxFUy5hY3RpdmVTZWNvbmRdfSAvPlxuICAgICAgICAgIDxkaXYga2V5PSdsaWJyYXJ5J1xuICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuTmF2LCB0aGlzLnByb3BzLmFjdGl2ZU5hdiA9PT0gJ2xpYnJhcnknICYmIFNUWUxFUy5hY3RpdmVCdG5OYXZdfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5zd2l0Y2hBY3RpdmVOYXYoJ2xpYnJhcnknKX0+XG4gICAgICAgICAgICA8TGlicmFyeUljb25TVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGlkPSdzdGF0ZS1pbnNwZWN0b3InIGtleT0nc3RhdGVfaW5zcGVjdG9yJ1xuICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuTmF2LCB0aGlzLnByb3BzLmFjdGl2ZU5hdiA9PT0gJ3N0YXRlX2luc3BlY3RvcicgJiYgU1RZTEVTLmFjdGl2ZUJ0bk5hdl19XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLnN3aXRjaEFjdGl2ZU5hdignc3RhdGVfaW5zcGVjdG9yJyl9PlxuICAgICAgICAgICAgPFN0YXRlSW5zcGVjdG9ySWNvblNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnBhbmVsV3JhcHBlcn0+XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShTaWRlQmFyKVxuIl19