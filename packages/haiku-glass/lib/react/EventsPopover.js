'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/EventsPopover.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var popoverWidth = 210;
var popoverHeight = '200px';
var pageTransDur = 170;

var STYLES = {
  container: {
    borderRadius: '4px',
    minHeight: '155px',
    maxHeight: '200px',
    width: popoverWidth + 'px',
    display: 'relative',
    backgroundColor: _Palette2.default.FATHER_COAL,
    color: _Palette2.default.ROCK,
    boxShadow: '0 6px 25px 0 ' + _Palette2.default.FATHER_COAL,
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  pagesWrapper: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '4px',
    width: popoverWidth + 'px',
    height: popoverHeight
  },
  pages: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    width: popoverWidth + 'px',
    height: popoverHeight,
    fontSize: '12px',
    WebkitUserSelect: 'none'
  },
  pageOne: {
    transition: 'transform 220ms ease',
    transform: 'translate3d(0, 0, 0)'
  },
  pageTwo: {
    backgroundColor: _Palette2.default.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: 'transform ' + pageTransDur + 'ms ease-out',
    color: 'white',
    width: popoverWidth + 1 + 'px',
    borderLeft: '1px solid ' + _Palette2.default.COAL,
    marginLeft: '-1px'
  },
  pageThree: {
    backgroundColor: _Palette2.default.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: 'transform ' + pageTransDur + 'ms ease-out',
    color: 'white',
    width: popoverWidth + 1 + 'px',
    borderLeft: '1px solid ' + _Palette2.default.COAL,
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
    borderBottom: '1px solid ' + _Palette2.default.COAL
  },
  title: {
    paddingTop: 3,
    color: _Palette2.default.DARK_ROCK,
    cursor: 'default',
    width: '100%'
  },
  mutedText: {
    color: _Palette2.default.ROCK_MUTED,
    fontStyle: 'italic'
  },
  strong: {
    color: _Palette2.default.LIGHT_PINK,
    fontStyle: 'italic',
    fontWeight: 700
  },
  btn: {
    backgroundColor: _Palette2.default.COAL,
    color: _Palette2.default.ROCK,
    padding: '4px 12px',
    borderRadius: '3px',
    ':hover': {
      backgroundColor: _Palette2.default.GRAY
    }
  },
  btnFull: {
    width: '80%',
    margin: '0 0 0 17px'
  },
  flip: {
    transform: 'rotate(180deg)',
    padding: '8px !important'
  },
  bottomRow: {
    borderTop: '1px solid ' + _Palette2.default.COAL,
    padding: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  btnMini: {
    padding: '4px 4px',
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
    padding: '3px 10px 3px 10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: _Palette2.default.DARK_GRAY
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
    backgroundColor: _Palette2.default.LIGHT_PINK
  }
};

var EventsPopover = function (_React$Component) {
  _inherits(EventsPopover, _React$Component);

  function EventsPopover(props) {
    _classCallCheck(this, EventsPopover);

    var _this = _possibleConstructorReturn(this, (EventsPopover.__proto__ || Object.getPrototypeOf(EventsPopover)).call(this, props));

    _this.state = {
      onPageTwo: false,
      onPageThree: false,
      prevPage: null,
      selectedEvent: null
    };
    _this.goToPageOne = _this.goToPageOne.bind(_this);
    _this.goToPageTwo = _this.goToPageTwo.bind(_this);
    _this.goToPageThree = _this.goToPageThree.bind(_this);
    _this.goPrevPage = _this.goPrevPage.bind(_this);
    _this.selectTimeline = _this.selectTimeline.bind(_this);
    return _this;
  }

  _createClass(EventsPopover, [{
    key: 'goToPageOne',
    value: function goToPageOne() {
      this.setState({ onPageTwo: false });
      this.setState({ onPageThree: false });
      this.setState({ prevPage: null });
    }
  }, {
    key: 'goToPageTwo',
    value: function goToPageTwo() {
      this.setState({ onPageTwo: true });
      this.setState({ onPageThree: false });
    }
  }, {
    key: 'goToPageThree',
    value: function goToPageThree(prevPage, chosenEvent) {
      this.setState({ onPageThree: true });
      this.setState({ prevPage: prevPage });
      this.setState({ selectedEvent: chosenEvent });
    }
  }, {
    key: 'goPrevPage',
    value: function goPrevPage() {
      this.state.prevPage === 'Two' ? this.goToPageTwo() : this.goToPageOne();
    }
  }, {
    key: 'selectTimeline',
    value: function selectTimeline() {
      // TODO
    }
  }, {
    key: 'renderConnections',
    value: function renderConnections() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 217
          },
          __self: this
        },
        this.props.connections.map(function (connection) {
          return _react2.default.createElement(
            'div',
            {
              key: 'main-' + connection,
              style: STYLES.row,
              onClick: function onClick() {
                return _this2.goToPageThree('One', connection[0]);
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 220
              },
              __self: _this2
            },
            connection[0],
            ' ',
            _react2.default.createElement(
              'span',
              { style: STYLES.mutedText, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 224
                },
                __self: _this2
              },
              'plays'
            ),
            ' ',
            connection[1],
            _react2.default.createElement(
              'span',
              { style: { position: 'absolute', right: '4px', top: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 225
                },
                __self: _this2
              },
              _react2.default.createElement(
                'button',
                {
                  key: 'v-' + connection,
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnMini], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 226
                  },
                  __self: _this2
                },
                _react2.default.createElement(_Icons.ChevronRightIconSVG, { color: _Palette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 229
                  },
                  __self: _this2
                })
              )
            )
          );
        })
      );
    }
  }, {
    key: 'renderAvailEvents',
    value: function renderAvailEvents() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 242
          },
          __self: this
        },
        this.props.availEvents.map(function (theEvent) {
          return _react2.default.createElement(
            'div',
            {
              key: 'main-' + theEvent,
              style: STYLES.row,
              onClick: function onClick() {
                return _this3.goToPageThree('Two', theEvent);
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 245
              },
              __self: _this3
            },
            theEvent,
            _react2.default.createElement(
              'span',
              { style: { position: 'absolute', right: '4px', top: 0 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 250
                },
                __self: _this3
              },
              _react2.default.createElement(
                'button',
                {
                  key: 'v-' + theEvent,
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnMini], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 251
                  },
                  __self: _this3
                },
                _react2.default.createElement(_Icons.ChevronRightIconSVG, { color: _Palette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 254
                  },
                  __self: _this3
                })
              )
            )
          );
        })
      );
    }
  }, {
    key: 'renderAvailTimelines',
    value: function renderAvailTimelines() {
      var _this4 = this;

      var connections = this.props.connections;
      var match = void 0;
      var active = void 0;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 271
          },
          __self: this
        },
        this.props.availTimelines.map(function (timeline) {
          connections.forEach(function (connection) {
            if (connection[0] === _this4.state.selectedEvent) active = connection[1];
          });

          match = active === timeline;

          return _react2.default.createElement(
            'div',
            {
              key: 'main-' + timeline,
              style: STYLES.row,
              onClick: _this4.selectTimeline, __source: {
                fileName: _jsxFileName,
                lineNumber: 280
              },
              __self: _this4
            },
            _react2.default.createElement('span', { style: [STYLES.indicator, match && STYLES.activeIndicator], __source: {
                fileName: _jsxFileName,
                lineNumber: 284
              },
              __self: _this4
            }),
            timeline
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: STYLES.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 296
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.pagesWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 297
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: [STYLES.pages, STYLES.pageOne, this.state.onPageTwo && STYLES.leftPage], __source: {
                fileName: _jsxFileName,
                lineNumber: 299
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: STYLES.titleRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 300
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: STYLES.title, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 301
                  },
                  __self: this
                },
                'Linked Events'
              )
            ),
            this.renderConnections(),
            _react2.default.createElement(
              'div',
              { style: STYLES.bottomRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 304
                },
                __self: this
              },
              _react2.default.createElement(
                'button',
                { key: 'btn1', style: [STYLES.btn, STYLES.btnFull], onClick: this.goToPageTwo, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 305
                  },
                  __self: this
                },
                'Create Link'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { style: [STYLES.pages, STYLES.pageTwo, this.state.onPageTwo && STYLES.onPage, this.state.onPageThree && STYLES.leftPage], __source: {
                fileName: _jsxFileName,
                lineNumber: 309
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: STYLES.titleRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 310
                },
                __self: this
              },
              _react2.default.createElement(
                'button',
                {
                  key: 'btn2',
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnPrev],
                  onClick: this.goToPageOne, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 311
                  },
                  __self: this
                },
                _react2.default.createElement(_Icons.ChevronLeftIconSVG, { color: _Palette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 315
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: STYLES.title, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 317
                  },
                  __self: this
                },
                'Select Event'
              )
            ),
            this.renderAvailEvents()
          ),
          _react2.default.createElement(
            'div',
            { style: [STYLES.pages, STYLES.pageThree, this.state.onPageThree && STYLES.onPage], __source: {
                fileName: _jsxFileName,
                lineNumber: 322
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: STYLES.titleRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 323
                },
                __self: this
              },
              _react2.default.createElement(
                'button',
                {
                  key: 'btn3',
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnPrev],
                  onClick: this.goPrevPage, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 324
                  },
                  __self: this
                },
                _react2.default.createElement(_Icons.ChevronLeftIconSVG, { color: _Palette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 328
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: STYLES.title, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 330
                  },
                  __self: this
                },
                'On ',
                _react2.default.createElement(
                  'span',
                  { style: STYLES.strong, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 330
                    },
                    __self: this
                  },
                  this.state.selectedEvent
                ),
                ' Play'
              )
            ),
            this.renderAvailTimelines(),
            _react2.default.createElement(
              'div',
              { style: STYLES.bottomRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 333
                },
                __self: this
              },
              _react2.default.createElement(
                'button',
                { key: 'btn4', style: [STYLES.btn, STYLES.btnFull], onClick: this.props.closePopover, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 334
                  },
                  __self: this
                },
                'Done'
              )
            )
          )
        )
      );
    }
  }]);

  return EventsPopover;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(EventsPopover);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9FdmVudHNQb3BvdmVyLmpzIl0sIm5hbWVzIjpbInBvcG92ZXJXaWR0aCIsInBvcG92ZXJIZWlnaHQiLCJwYWdlVHJhbnNEdXIiLCJTVFlMRVMiLCJjb250YWluZXIiLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJtYXhIZWlnaHQiLCJ3aWR0aCIsImRpc3BsYXkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJGQVRIRVJfQ09BTCIsImNvbG9yIiwiUk9DSyIsImJveFNoYWRvdyIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsInBhZ2VzV3JhcHBlciIsIm92ZXJmbG93IiwicG9zaXRpb24iLCJoZWlnaHQiLCJwYWdlcyIsInRvcCIsImxlZnQiLCJmb250U2l6ZSIsIldlYmtpdFVzZXJTZWxlY3QiLCJwYWdlT25lIiwidHJhbnNpdGlvbiIsInRyYW5zZm9ybSIsInBhZ2VUd28iLCJib3JkZXJMZWZ0IiwiQ09BTCIsIm1hcmdpbkxlZnQiLCJwYWdlVGhyZWUiLCJvblBhZ2UiLCJsZWZ0UGFnZSIsInRpdGxlUm93IiwiYWxpZ25JdGVtcyIsInRleHRBbGlnbiIsInRleHRUcmFuc2Zvcm0iLCJsZXR0ZXJTcGFjaW5nIiwiYm9yZGVyQm90dG9tIiwidGl0bGUiLCJwYWRkaW5nVG9wIiwiREFSS19ST0NLIiwiY3Vyc29yIiwibXV0ZWRUZXh0IiwiUk9DS19NVVRFRCIsImZvbnRTdHlsZSIsInN0cm9uZyIsIkxJR0hUX1BJTksiLCJmb250V2VpZ2h0IiwiYnRuIiwicGFkZGluZyIsIkdSQVkiLCJidG5GdWxsIiwibWFyZ2luIiwiZmxpcCIsImJvdHRvbVJvdyIsImJvcmRlclRvcCIsImJvdHRvbSIsInJpZ2h0IiwiYnRuTWluaSIsIm9wYWNpdHkiLCJmbG9hdCIsInJvZ3VlTGF5b3V0IiwibWFyZ2luVG9wIiwiYnRuVHJhbnMiLCJidG5QcmV2Iiwicm93IiwiREFSS19HUkFZIiwicm93Tm9CZyIsInNob3J0eSIsInBvaW50ZXJFdmVudHMiLCJpbmRpY2F0b3IiLCJtYXJnaW5SaWdodCIsImFjdGl2ZUluZGljYXRvciIsIkV2ZW50c1BvcG92ZXIiLCJwcm9wcyIsInN0YXRlIiwib25QYWdlVHdvIiwib25QYWdlVGhyZWUiLCJwcmV2UGFnZSIsInNlbGVjdGVkRXZlbnQiLCJnb1RvUGFnZU9uZSIsImJpbmQiLCJnb1RvUGFnZVR3byIsImdvVG9QYWdlVGhyZWUiLCJnb1ByZXZQYWdlIiwic2VsZWN0VGltZWxpbmUiLCJzZXRTdGF0ZSIsImNob3NlbkV2ZW50IiwiY29ubmVjdGlvbnMiLCJtYXAiLCJjb25uZWN0aW9uIiwiYXZhaWxFdmVudHMiLCJ0aGVFdmVudCIsIm1hdGNoIiwiYWN0aXZlIiwiYXZhaWxUaW1lbGluZXMiLCJ0aW1lbGluZSIsImZvckVhY2giLCJyZW5kZXJDb25uZWN0aW9ucyIsInJlbmRlckF2YWlsRXZlbnRzIiwicmVuZGVyQXZhaWxUaW1lbGluZXMiLCJjbG9zZVBvcG92ZXIiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZSxHQUFyQjtBQUNBLElBQU1DLGdCQUFnQixPQUF0QjtBQUNBLElBQU1DLGVBQWUsR0FBckI7O0FBRUEsSUFBTUMsU0FBUztBQUNiQyxhQUFXO0FBQ1RDLGtCQUFjLEtBREw7QUFFVEMsZUFBVyxPQUZGO0FBR1RDLGVBQVcsT0FIRjtBQUlUQyxXQUFPUixlQUFlLElBSmI7QUFLVFMsYUFBUyxVQUxBO0FBTVRDLHFCQUFpQixrQkFBUUMsV0FOaEI7QUFPVEMsV0FBTyxrQkFBUUMsSUFQTjtBQVFUQyxlQUFXLGtCQUFrQixrQkFBUUgsV0FSNUI7QUFTVEksZUFBVyxRQVRGO0FBVVRDLGVBQVc7QUFWRixHQURFO0FBYWJDLGdCQUFjO0FBQ1pDLGNBQVUsUUFERTtBQUVaQyxjQUFVLFVBRkU7QUFHWmQsa0JBQWMsS0FIRjtBQUlaRyxXQUFPUixlQUFlLElBSlY7QUFLWm9CLFlBQVFuQjtBQUxJLEdB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LENBQTFCLEVBQXdELFNBQVMsS0FBS3VCLEtBQUwsQ0FBVzJCLFlBQTVFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERjtBQVhGO0FBekJGO0FBREYsT0FERjtBQThDRDs7OztFQXpLeUIsZ0JBQU1DLFM7O2tCQTRLbkIsc0JBQU83QixhQUFQLEMiLCJmaWxlIjoiRXZlbnRzUG9wb3Zlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IHsgQ2hldnJvbkxlZnRJY29uU1ZHLCBDaGV2cm9uUmlnaHRJY29uU1ZHIH0gZnJvbSAnLi9JY29ucydcblxuY29uc3QgcG9wb3ZlcldpZHRoID0gMjEwXG5jb25zdCBwb3BvdmVySGVpZ2h0ID0gJzIwMHB4J1xuY29uc3QgcGFnZVRyYW5zRHVyID0gMTcwXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICBtaW5IZWlnaHQ6ICcxNTVweCcsXG4gICAgbWF4SGVpZ2h0OiAnMjAwcHgnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGggKyAncHgnLFxuICAgIGRpc3BsYXk6ICdyZWxhdGl2ZScsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYm94U2hhZG93OiAnMCA2cHggMjVweCAwICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIG92ZXJmbG93WDogJ2hpZGRlbicsXG4gICAgb3ZlcmZsb3dZOiAnYXV0bydcbiAgfSxcbiAgcGFnZXNXcmFwcGVyOiB7XG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgd2lkdGg6IHBvcG92ZXJXaWR0aCArICdweCcsXG4gICAgaGVpZ2h0OiBwb3BvdmVySGVpZ2h0XG4gIH0sXG4gIHBhZ2VzOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICB3aWR0aDogcG9wb3ZlcldpZHRoICsgJ3B4JyxcbiAgICBoZWlnaHQ6IHBvcG92ZXJIZWlnaHQsXG4gICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZSdcbiAgfSxcbiAgcGFnZU9uZToge1xuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjIwbXMgZWFzZScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknXG4gIH0sXG4gIHBhZ2VUd286IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLFxuICAgIHRyYW5zaXRpb246IGB0cmFuc2Zvcm0gJHtwYWdlVHJhbnNEdXJ9bXMgZWFzZS1vdXRgLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGggKyAxICsgJ3B4JyxcbiAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkNPQUwsXG4gICAgbWFyZ2luTGVmdDogJy0xcHgnXG4gIH0sXG4gIHBhZ2VUaHJlZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUzZCgxMDAlLCAwLCAwKScsXG4gICAgdHJhbnNpdGlvbjogYHRyYW5zZm9ybSAke3BhZ2VUcmFuc0R1cn1tcyBlYXNlLW91dGAsXG4gICAgY29sb3I6ICd3aGl0ZScsXG4gICAgd2lkdGg6IHBvcG92ZXJXaWR0aCArIDEgKyAncHgnLFxuICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuQ09BTCxcbiAgICBtYXJnaW5MZWZ0OiAnLTFweCdcbiAgfSxcbiAgb25QYWdlOiB7XG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknXG4gIH0sXG4gIGxlZnRQYWdlOiB7XG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoLTMwcHgsIDAsIDApJ1xuICB9LFxuICB0aXRsZVJvdzoge1xuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBoZWlnaHQ6ICczNXB4JyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgbGV0dGVyU3BhY2luZzogJzEuM3B4JyxcbiAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIFBhbGV0dGUuQ09BTFxuICB9LFxuICB0aXRsZToge1xuICAgIHBhZGRpbmdUb3A6IDMsXG4gICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLLFxuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIHdpZHRoOiAnMTAwJSdcbiAgfSxcbiAgbXV0ZWRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHN0cm9uZzoge1xuICAgIGNvbG9yOiBQYWxldHRlLkxJR0hUX1BJTkssXG4gICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICBmb250V2VpZ2h0OiA3MDBcbiAgfSxcbiAgYnRuOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBwYWRkaW5nOiAnNHB4IDEycHgnLFxuICAgIGJvcmRlclJhZGl1czogJzNweCcsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZXG4gICAgfVxuICB9LFxuICBidG5GdWxsOiB7XG4gICAgd2lkdGg6ICc4MCUnLFxuICAgIG1hcmdpbjogJzAgMCAwIDE3cHgnXG4gIH0sXG4gIGZsaXA6IHtcbiAgICB0cmFuc2Zvcm06ICdyb3RhdGUoMTgwZGVnKScsXG4gICAgcGFkZGluZzogJzhweCAhaW1wb3J0YW50J1xuICB9LFxuICBib3R0b21Sb3c6IHtcbiAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuQ09BTCxcbiAgICBwYWRkaW5nOiA2LFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGJvdHRvbTogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHJpZ2h0OiAwXG4gIH0sXG4gIGJ0bk1pbmk6IHtcbiAgICBwYWRkaW5nOiAnNHB4IDRweCcsXG4gICAgb3BhY2l0eTogMC43LFxuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBvcGFjaXR5OiAxXG4gICAgfVxuICB9LFxuICByb2d1ZUxheW91dDoge1xuICAgIG1hcmdpblRvcDogJzNweCdcbiAgfSxcbiAgYnRuVHJhbnM6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuICAgIH1cbiAgfSxcbiAgYnRuUHJldjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IDAsXG4gICAgdG9wOiAnNnB4J1xuICB9LFxuICByb3c6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIHBhZGRpbmc6ICczcHggMTBweCAzcHggMTBweCcsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLX0dSQVlcbiAgICB9XG4gIH0sXG4gIHJvd05vQmc6IHtcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG4gICAgfVxuICB9LFxuICBzaG9ydHk6IHtcbiAgICB3aWR0aDogJzYzJScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGluZGljYXRvcjoge1xuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgbWFyZ2luTGVmdDogMixcbiAgICB3aWR0aDogOCxcbiAgICBoZWlnaHQ6IDgsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaydcbiAgfSxcbiAgYWN0aXZlSW5kaWNhdG9yOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX1BJTktcbiAgfVxufVxuXG5jbGFzcyBFdmVudHNQb3BvdmVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG9uUGFnZVR3bzogZmFsc2UsXG4gICAgICBvblBhZ2VUaHJlZTogZmFsc2UsXG4gICAgICBwcmV2UGFnZTogbnVsbCxcbiAgICAgIHNlbGVjdGVkRXZlbnQ6IG51bGxcbiAgICB9XG4gICAgdGhpcy5nb1RvUGFnZU9uZSA9IHRoaXMuZ29Ub1BhZ2VPbmUuYmluZCh0aGlzKVxuICAgIHRoaXMuZ29Ub1BhZ2VUd28gPSB0aGlzLmdvVG9QYWdlVHdvLmJpbmQodGhpcylcbiAgICB0aGlzLmdvVG9QYWdlVGhyZWUgPSB0aGlzLmdvVG9QYWdlVGhyZWUuYmluZCh0aGlzKVxuICAgIHRoaXMuZ29QcmV2UGFnZSA9IHRoaXMuZ29QcmV2UGFnZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zZWxlY3RUaW1lbGluZSA9IHRoaXMuc2VsZWN0VGltZWxpbmUuYmluZCh0aGlzKVxuICB9XG5cbiAgZ29Ub1BhZ2VPbmUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe29uUGFnZVR3bzogZmFsc2V9KVxuICAgIHRoaXMuc2V0U3RhdGUoe29uUGFnZVRocmVlOiBmYWxzZX0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7cHJldlBhZ2U6IG51bGx9KVxuICB9XG5cbiAgZ29Ub1BhZ2VUd28gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe29uUGFnZVR3bzogdHJ1ZX0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7b25QYWdlVGhyZWU6IGZhbHNlfSlcbiAgfVxuXG4gIGdvVG9QYWdlVGhyZWUgKHByZXZQYWdlLCBjaG9zZW5FdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe29uUGFnZVRocmVlOiB0cnVlfSlcbiAgICB0aGlzLnNldFN0YXRlKHtwcmV2UGFnZX0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRFdmVudDogY2hvc2VuRXZlbnR9KVxuICB9XG5cbiAgZ29QcmV2UGFnZSAoKSB7XG4gICAgdGhpcy5zdGF0ZS5wcmV2UGFnZSA9PT0gJ1R3bydcbiAgICAgID8gdGhpcy5nb1RvUGFnZVR3bygpXG4gICAgICA6IHRoaXMuZ29Ub1BhZ2VPbmUoKVxuICB9XG5cbiAgc2VsZWN0VGltZWxpbmUgKCkge1xuICAgIC8vIFRPRE9cbiAgfVxuXG4gIHJlbmRlckNvbm5lY3Rpb25zICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMuY29ubmVjdGlvbnMubWFwKChjb25uZWN0aW9uKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXtgbWFpbi0ke2Nvbm5lY3Rpb259YH1cbiAgICAgICAgICAgICAgc3R5bGU9e1NUWUxFUy5yb3d9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuZ29Ub1BhZ2VUaHJlZSgnT25lJywgY29ubmVjdGlvblswXSl9PlxuICAgICAgICAgICAgICB7Y29ubmVjdGlvblswXX0gPHNwYW4gc3R5bGU9e1NUWUxFUy5tdXRlZFRleHR9PnBsYXlzPC9zcGFuPiB7Y29ubmVjdGlvblsxXX1cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6ICc0cHgnLCB0b3A6IDB9fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBrZXk9e2B2LSR7Y29ubmVjdGlvbn1gfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuLCBTVFlMRVMuYnRuVHJhbnMsIFNUWUxFUy5idG5NaW5pXX0+XG4gICAgICAgICAgICAgICAgICA8Q2hldnJvblJpZ2h0SWNvblNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckF2YWlsRXZlbnRzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucHJvcHMuYXZhaWxFdmVudHMubWFwKCh0aGVFdmVudCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGtleT17YG1haW4tJHt0aGVFdmVudH1gfVxuICAgICAgICAgICAgICBzdHlsZT17U1RZTEVTLnJvd31cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5nb1RvUGFnZVRocmVlKCdUd28nLCB0aGVFdmVudCl9PlxuICAgICAgICAgICAgICB7dGhlRXZlbnR9XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAnNHB4JywgdG9wOiAwfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtgdi0ke3RoZUV2ZW50fWB9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5idG4sIFNUWUxFUy5idG5UcmFucywgU1RZTEVTLmJ0bk1pbmldfT5cbiAgICAgICAgICAgICAgICAgIDxDaGV2cm9uUmlnaHRJY29uU1ZHIGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQXZhaWxUaW1lbGluZXMgKCkge1xuICAgIGNvbnN0IGNvbm5lY3Rpb25zID0gdGhpcy5wcm9wcy5jb25uZWN0aW9uc1xuICAgIGxldCBtYXRjaFxuICAgIGxldCBhY3RpdmVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5wcm9wcy5hdmFpbFRpbWVsaW5lcy5tYXAoKHRpbWVsaW5lKSA9PiB7XG4gICAgICAgICAgY29ubmVjdGlvbnMuZm9yRWFjaChjb25uZWN0aW9uID0+IHtcbiAgICAgICAgICAgIGlmIChjb25uZWN0aW9uWzBdID09PSB0aGlzLnN0YXRlLnNlbGVjdGVkRXZlbnQpIGFjdGl2ZSA9IGNvbm5lY3Rpb25bMV1cbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgbWF0Y2ggPSBhY3RpdmUgPT09IHRpbWVsaW5lXG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBrZXk9e2BtYWluLSR7dGltZWxpbmV9YH1cbiAgICAgICAgICAgICAgc3R5bGU9e1NUWUxFUy5yb3d9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2VsZWN0VGltZWxpbmV9PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17W1NUWUxFUy5pbmRpY2F0b3IsIG1hdGNoICYmIFNUWUxFUy5hY3RpdmVJbmRpY2F0b3JdfSAvPlxuICAgICAgICAgICAgICB7dGltZWxpbmV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5jb250YWluZXJ9PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMucGFnZXNXcmFwcGVyfT5cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMucGFnZXMsIFNUWUxFUy5wYWdlT25lLCB0aGlzLnN0YXRlLm9uUGFnZVR3byAmJiBTVFlMRVMubGVmdFBhZ2VdfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy50aXRsZVJvd30+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy50aXRsZX0+TGlua2VkIEV2ZW50czwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb25uZWN0aW9ucygpfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmJvdHRvbVJvd30+XG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PSdidG4xJyBzdHlsZT17W1NUWUxFUy5idG4sIFNUWUxFUy5idG5GdWxsXX0gb25DbGljaz17dGhpcy5nb1RvUGFnZVR3b30+Q3JlYXRlIExpbms8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17W1NUWUxFUy5wYWdlcywgU1RZTEVTLnBhZ2VUd28sIHRoaXMuc3RhdGUub25QYWdlVHdvICYmIFNUWUxFUy5vblBhZ2UsIHRoaXMuc3RhdGUub25QYWdlVGhyZWUgJiYgU1RZTEVTLmxlZnRQYWdlXX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMudGl0bGVSb3d9PlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAga2V5PSdidG4yJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmJ0biwgU1RZTEVTLmJ0blRyYW5zLCBTVFlMRVMuYnRuUHJldl19XG4gICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5nb1RvUGFnZU9uZX0+XG4gICAgICAgICAgICAgICAgPENoZXZyb25MZWZ0SWNvblNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnRpdGxlfT5TZWxlY3QgRXZlbnQ8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQXZhaWxFdmVudHMoKX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMucGFnZXMsIFNUWUxFUy5wYWdlVGhyZWUsIHRoaXMuc3RhdGUub25QYWdlVGhyZWUgJiYgU1RZTEVTLm9uUGFnZV19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnRpdGxlUm93fT5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGtleT0nYnRuMydcbiAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5idG4sIFNUWUxFUy5idG5UcmFucywgU1RZTEVTLmJ0blByZXZdfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZ29QcmV2UGFnZX0+XG4gICAgICAgICAgICAgICAgPENoZXZyb25MZWZ0SWNvblNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnRpdGxlfT5PbiA8c3BhbiBzdHlsZT17U1RZTEVTLnN0cm9uZ30+e3RoaXMuc3RhdGUuc2VsZWN0ZWRFdmVudH08L3NwYW4+IFBsYXk8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQXZhaWxUaW1lbGluZXMoKX1cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5ib3R0b21Sb3d9PlxuICAgICAgICAgICAgICA8YnV0dG9uIGtleT0nYnRuNCcgc3R5bGU9e1tTVFlMRVMuYnRuLCBTVFlMRVMuYnRuRnVsbF19IG9uQ2xpY2s9e3RoaXMucHJvcHMuY2xvc2VQb3BvdmVyfT5Eb25lPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oRXZlbnRzUG9wb3ZlcilcbiJdfQ==