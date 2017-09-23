'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/CurrentTimelinePopover.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _DuplicateIconSVG = require('./icons/DuplicateIconSVG');

var _DuplicateIconSVG2 = _interopRequireDefault(_DuplicateIconSVG);

var _EditsIconSVG = require('./icons/EditsIconSVG');

var _EditsIconSVG2 = _interopRequireDefault(_EditsIconSVG);

var _DeleteIconSVG = require('./icons/DeleteIconSVG');

var _DeleteIconSVG2 = _interopRequireDefault(_DeleteIconSVG);

var _CheckmarkIconSVG = require('./icons/CheckmarkIconSVG');

var _CheckmarkIconSVG2 = _interopRequireDefault(_CheckmarkIconSVG);

var _ChevronLeftIconSVG = require('./icons/ChevronLeftIconSVG');

var _ChevronLeftIconSVG2 = _interopRequireDefault(_ChevronLeftIconSVG);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var popoverWidth = 170;
var popoverHeight = '200px';
var pageTransDur = 170;

var STYLES = {
  container: {
    minHeight: '155px',
    maxHeight: '200px',
    width: popoverWidth + 'px',
    display: 'relative',
    backgroundColor: _DefaultPalette2.default.FATHER_COAL,
    color: 'white',
    boxShadow: '0 6px 25px 0 ' + _DefaultPalette2.default.FATHER_COAL,
    borderRadius: '4px',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  pagesWrapper: {
    overflow: 'hidden',
    position: 'relative',
    width: popoverWidth + 'px',
    height: popoverHeight
  },
  pages: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    width: popoverWidth + 'px',
    height: popoverHeight
    // paddingTop: '5px'
  },
  pageOne: {
    transition: 'transform 220ms ease',
    transform: 'translate3d(0, 0, 0)'
  },
  pageTwo: {
    backgroundColor: _DefaultPalette2.default.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: 'transform ' + pageTransDur + 'ms ease-out',
    color: 'white',
    width: popoverWidth + 1 + 'px',
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
    fontSize: '13px',
    letterSpacing: '2px',
    borderBottom: '1px solid ' + _DefaultPalette2.default.COAL
  },
  btn: {
    backgroundColor: _DefaultPalette2.default.COAL,
    color: _DefaultPalette2.default.ROCK,
    padding: '4px 12px',
    borderRadius: '3px',
    ':hover': {
      backgroundColor: _DefaultPalette2.default.GRAY
    }
  },
  btnFull: {
    width: '80%',
    margin: '0 0 0 17px'
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
  timelineRow: {
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
  input: {
    borderRadius: '2px',
    color: _DefaultPalette2.default.ROCK,
    padding: '5px 10px',
    border: '1px solid transparent',
    width: '80%',
    pointerEvents: 'auto',
    ':focus': {
      border: '1px solid ' + _DefaultPalette2.default.PINK,
      backgroundColor: _DefaultPalette2.default.MEDIUM_COAL
    }
  },
  shorty: {
    width: '63%',
    pointerEvents: 'none'
  },
  inputSolo: {
    margin: '7px 0 4px 17px',
    backgroundColor: _DefaultPalette2.default.MEDIUM_COAL,
    ':hover': {
      backgroundColor: _DefaultPalette2.default.COAL
    },
    ':focus': {
      backgroundColor: _DefaultPalette2.default.COAL
    }
  }
};

var CurrentTimelinePopover = function (_React$Component) {
  _inherits(CurrentTimelinePopover, _React$Component);

  function CurrentTimelinePopover(props) {
    _classCallCheck(this, CurrentTimelinePopover);

    var _this = _possibleConstructorReturn(this, (CurrentTimelinePopover.__proto__ || Object.getPrototypeOf(CurrentTimelinePopover)).call(this, props));

    _this.state = { onPageTwo: false };
    return _this;
  }

  _createClass(CurrentTimelinePopover, [{
    key: 'goToPageOne',
    value: function goToPageOne() {
      this.setState({ onPageTwo: false });
    }
  }, {
    key: 'goToPageTwo',
    value: function goToPageTwo() {
      var _this2 = this;

      this.setState({ onPageTwo: true });
      setTimeout(function () {
        console.log(_this2.creationInput);
        _this2.creationInput.focus();
      }, pageTransDur);
    }
  }, {
    key: 'handleRename',
    value: function handleRename(event, timelineName) {
      event.preventDefault();
      var originalName = this.state.focusedTimeline;
      var newName = this[timelineName].value;
      this.props.changeTimelineName({ originalName: originalName, newName: newName });
      this[timelineName].blur();
    }
  }, {
    key: 'handleCreateTimeline',
    value: function handleCreateTimeline(event, form) {
      event.preventDefault();
      var name = this.creationInput.value;
      this.props.createTimeline(name);
      this.creationInput.blur();
      this.creationInput.value = '';
      this.setState({ onPageTwo: false });
    }
  }, {
    key: 'handleDuplicateTimeline',
    value: function handleDuplicateTimeline(event, timelineName) {
      event.preventDefault();
      event.stopPropagation();
      this.props.duplicateTimeline(timelineName);
    }
  }, {
    key: 'showRenameField',
    value: function showRenameField(event, timelineName) {
      event.preventDefault();
      event.stopPropagation();
      // this[timelineName].focus() // ?
    }
  }, {
    key: 'handleDeleteTimeline',
    value: function handleDeleteTimeline(event, timelineName) {
      event.preventDefault();
      event.stopPropagation();
      this.props.deleteTimeline(timelineName);
    }
  }, {
    key: 'handleSelectTimeline',
    value: function handleSelectTimeline(event, timelineName) {
      this.props.selectTimeline(timelineName);
      this.props.closePopover();
    }
  }, {
    key: 'timelineElementsList',
    value: function timelineElementsList() {
      var _this3 = this;

      return React.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 209
          },
          __self: this
        },
        this.props.timelineNames.map(function (timelineName) {
          return React.createElement(
            'div',
            {
              key: 'main-' + timelineName,
              onClick: function onClick(e) {
                if (!_radium2.default.getState(_this3.state, 't-' + timelineName, ':focus')) {
                  _this3.handleSelectTimeline(e, timelineName);
                }
              },
              style: { position: 'relative' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 212
              },
              __self: _this3
            },
            React.createElement(
              'form',
              {
                onSubmit: function onSubmit(e) {
                  _this3.handleRename(e, timelineName);
                },
                onFocus: function onFocus(e) {
                  _this3.setState({ focusedTimeline: timelineName });
                },
                key: 'timelineName-' + timelineName,
                style: [STYLES.timelineNameRow, _radium2.default.getState(_this3.state, 't-' + timelineName, ':focus') && STYLES.rowNoBg], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 220
                },
                __self: _this3
              },
              React.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 225
                  },
                  __self: _this3
                },
                React.createElement('input', {
                  placeholder: 'Enter name',
                  key: 't-' + timelineName,
                  defaultValue: timelineName,
                  className: 'popover-input',
                  style: [STYLES.input, !_radium2.default.getState(_this3.state, 't-' + timelineName, ':focus') && STYLES.shorty],
                  ref: function ref(input) {
                    _this3[timelineName] = input;
                  }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 226
                  },
                  __self: _this3
                }),
                _radium2.default.getState(_this3.state, 't-' + timelineName, ':focus') ? React.createElement(
                  'button',
                  {
                    key: 'b-' + timelineName,
                    style: [STYLES.btn, STYLES.btnTrans, STYLES.btnMini, STYLES.rogueLayout],
                    type: 'submit', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 234
                    },
                    __self: _this3
                  },
                  React.createElement(_CheckmarkIconSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 238
                    },
                    __self: _this3
                  })
                ) : null
              )
            ),
            !_radium2.default.getState(_this3.state, 't-' + timelineName, ':focus') ? React.createElement(
              'span',
              { style: { position: 'absolute', right: '4px', top: '5px' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 244
                },
                __self: _this3
              },
              React.createElement(
                'button',
                {
                  onClick: _this3.handleDeleteTimeline.bind(_this3),
                  key: 'd-' + timelineName,
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnMini], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 245
                  },
                  __self: _this3
                },
                React.createElement(_DeleteIconSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 249
                  },
                  __self: _this3
                })
              ),
              React.createElement(
                'button',
                {
                  onClick: _this3.showRenameField.bind(_this3),
                  key: 'e-' + timelineName,
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnMini], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 251
                  },
                  __self: _this3
                },
                React.createElement(_EditsIconSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 255
                  },
                  __self: _this3
                })
              ),
              React.createElement(
                'button',
                {
                  onClick: _this3.handleDuplicateTimeline.bind(_this3),
                  key: 'v-' + timelineName,
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnMini], __source: {
                    fileName: _jsxFileName,
                    lineNumber: 257
                  },
                  __self: _this3
                },
                React.createElement(_DuplicateIconSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 261
                  },
                  __self: _this3
                })
              )
            ) : null
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        { style: STYLES.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 275
          },
          __self: this
        },
        React.createElement(
          'div',
          { style: STYLES.pagesWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 276
            },
            __self: this
          },
          React.createElement(
            'div',
            { style: [STYLES.pages, STYLES.pageOne, this.state.onPageTwo && STYLES.leftPage], __source: {
                fileName: _jsxFileName,
                lineNumber: 277
              },
              __self: this
            },
            React.createElement(
              'div',
              { style: STYLES.titleRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 278
                },
                __self: this
              },
              React.createElement(
                'button',
                { key: 'btn1', style: [STYLES.btn, STYLES.btnFull], onClick: this.goToPageTwo.bind(this), __source: {
                    fileName: _jsxFileName,
                    lineNumber: 279
                  },
                  __self: this
                },
                'Add Timeline'
              )
            ),
            this.timelineElementsList()
          ),
          React.createElement(
            'div',
            { style: [STYLES.pages, STYLES.pageTwo, this.state.onPageTwo && STYLES.onPage], __source: {
                fileName: _jsxFileName,
                lineNumber: 283
              },
              __self: this
            },
            React.createElement(
              'div',
              { style: STYLES.titleRow, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 284
                },
                __self: this
              },
              React.createElement(
                'button',
                {
                  key: 'btn2',
                  style: [STYLES.btn, STYLES.btnTrans, STYLES.btnPrev],
                  onClick: this.goToPageOne.bind(this), __source: {
                    fileName: _jsxFileName,
                    lineNumber: 285
                  },
                  __self: this
                },
                React.createElement(_ChevronLeftIconSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 289
                  },
                  __self: this
                })
              ),
              React.createElement(
                'div',
                { style: { paddingTop: '5px', width: '100%' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 291
                  },
                  __self: this
                },
                'NEW TIMELINE'
              )
            ),
            React.createElement(
              'form',
              {
                onSubmit: this.handleCreateTimeline.bind(this),
                key: 'timeline-new', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 293
                },
                __self: this
              },
              React.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 296
                  },
                  __self: this
                },
                React.createElement('input', {
                  placeholder: 'Name timeline',
                  key: 't-new',
                  className: 'normal-input',
                  style: [STYLES.input, STYLES.inputSolo],
                  ref: function ref(input) {
                    _this4.creationInput = input;
                  }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 297
                  },
                  __self: this
                }),
                React.createElement(
                  'button',
                  { style: [STYLES.btn, STYLES.btnFull], type: 'submit', __source: {
                      fileName: _jsxFileName,
                      lineNumber: 305
                    },
                    __self: this
                  },
                  'Create'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return CurrentTimelinePopover;
}(React.Component);

exports.default = (0, _radium2.default)(CurrentTimelinePopover);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0N1cnJlbnRUaW1lbGluZVBvcG92ZXIuanMiXSwibmFtZXMiOlsiUmVhY3QiLCJwb3BvdmVyV2lkdGgiLCJwb3BvdmVySGVpZ2h0IiwicGFnZVRyYW5zRHVyIiwiU1RZTEVTIiwiY29udGFpbmVyIiwibWluSGVpZ2h0IiwibWF4SGVpZ2h0Iiwid2lkdGgiLCJkaXNwbGF5IiwiYmFja2dyb3VuZENvbG9yIiwiRkFUSEVSX0NPQUwiLCJjb2xvciIsImJveFNoYWRvdyIsImJvcmRlclJhZGl1cyIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsInBhZ2VzV3JhcHBlciIsIm92ZXJmbG93IiwicG9zaXRpb24iLCJoZWlnaHQiLCJwYWdlcyIsInRvcCIsImxlZnQiLCJwYWdlT25lIiwidHJhbnNpdGlvbiIsInRyYW5zZm9ybSIsInBhZ2VUd28iLCJib3JkZXJMZWZ0IiwiQ09BTCIsIm1hcmdpbkxlZnQiLCJvblBhZ2UiLCJsZWZ0UGFnZSIsInRpdGxlUm93IiwiYWxpZ25JdGVtcyIsInRleHRBbGlnbiIsInRleHRUcmFuc2Zvcm0iLCJmb250U2l6ZSIsImxldHRlclNwYWNpbmciLCJib3JkZXJCb3R0b20iLCJidG4iLCJST0NLIiwicGFkZGluZyIsIkdSQVkiLCJidG5GdWxsIiwibWFyZ2luIiwiYnRuTWluaSIsIm9wYWNpdHkiLCJmbG9hdCIsInJvZ3VlTGF5b3V0IiwibWFyZ2luVG9wIiwiYnRuVHJhbnMiLCJidG5QcmV2IiwidGltZWxpbmVSb3ciLCJjdXJzb3IiLCJEQVJLX0dSQVkiLCJyb3dOb0JnIiwiaW5wdXQiLCJib3JkZXIiLCJwb2ludGVyRXZlbnRzIiwiUElOSyIsIk1FRElVTV9DT0FMIiwic2hvcnR5IiwiaW5wdXRTb2xvIiwiQ3VycmVudFRpbWVsaW5lUG9wb3ZlciIsInByb3BzIiwic3RhdGUiLCJvblBhZ2VUd28iLCJzZXRTdGF0ZSIsInNldFRpbWVvdXQiLCJjb25zb2xlIiwibG9nIiwiY3JlYXRpb25JbnB1dCIsImZvY3VzIiwiZXZlbnQiLCJ0aW1lbGluZU5hbWUiLCJwcmV2ZW50RGVmYXVsdCIsIm9yaWdpbmFsTmFtZSIsImZvY3VzZWRUaW1lbGluZSIsIm5ld05hbWUiLCJ2YWx1ZSIsImNoYW5nZVRpbWVsaW5lTmFtZSIsImJsdXIiLCJmb3JtIiwibmFtZSIsImNyZWF0ZVRpbWVsaW5lIiwic3RvcFByb3BhZ2F0aW9uIiwiZHVwbGljYXRlVGltZWxpbmUiLCJkZWxldGVUaW1lbGluZSIsInNlbGVjdFRpbWVsaW5lIiwiY2xvc2VQb3BvdmVyIiwidGltZWxpbmVOYW1lcyIsIm1hcCIsImUiLCJnZXRTdGF0ZSIsImhhbmRsZVNlbGVjdFRpbWVsaW5lIiwiaGFuZGxlUmVuYW1lIiwidGltZWxpbmVOYW1lUm93IiwicmlnaHQiLCJoYW5kbGVEZWxldGVUaW1lbGluZSIsImJpbmQiLCJzaG93UmVuYW1lRmllbGQiLCJoYW5kbGVEdXBsaWNhdGVUaW1lbGluZSIsImdvVG9QYWdlVHdvIiwidGltZWxpbmVFbGVtZW50c0xpc3QiLCJnb1RvUGFnZU9uZSIsInBhZGRpbmdUb3AiLCJoYW5kbGVDcmVhdGVUaW1lbGluZSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEs7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUMsZUFBZSxHQUFyQjtBQUNBLElBQU1DLGdCQUFnQixPQUF0QjtBQUNBLElBQU1DLGVBQWUsR0FBckI7O0FBRUEsSUFBTUMsU0FBUztBQUNiQyxhQUFXO0FBQ1RDLGVBQVcsT0FERjtBQUVUQyxlQUFXLE9BRkY7QUFHVEMsV0FBT1AsZUFBZSxJQUhiO0FBSVRRLGFBQVMsVUFKQTtBQUtUQyxxQkFBaUIseUJBQVFDLFdBTGhCO0FBTVRDLFdBQU8sT0FORTtBQU9UQyxlQUFXLGtCQUFrQix5QkFBUUYsV0FQNUI7QUFRVEcsa0JBQWMsS0FSTDtBQVNUQyxlQUFXLFFBVEY7QUFV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O0FBQUE7QUFBQTtBQUlFLG9FQUFvQixPQUFPLHlCQUFRM0QsSUFBbkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSkYsZUFERjtBQU9FO0FBQUE7QUFBQSxrQkFBSyxPQUFPLEVBQUNpRSxZQUFZLEtBQWIsRUFBb0JsRyxPQUFPLE1BQTNCLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVBGLGFBREY7QUFVRTtBQUFBO0FBQUE7QUFDRSwwQkFBVSxLQUFLbUcsb0JBQUwsQ0FBMEJQLElBQTFCLENBQStCLElBQS9CLENBRFo7QUFFRSxtQ0FGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUNFLCtCQUFZLGVBRGQ7QUFFRSw4QkFGRjtBQUdFLDZCQUFVLGNBSFo7QUFJRSx5QkFBTyxDQUFDaEcsT0FBT3FELEtBQVIsRUFBZXJELE9BQU8yRCxTQUF0QixDQUpUO0FBS0UsdUJBQUssYUFBQ04sS0FBRCxFQUFXO0FBQ2QsMkJBQUtlLGFBQUwsR0FBcUJmLEtBQXJCO0FBQ0QsbUJBUEg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtCQURGO0FBU0U7QUFBQTtBQUFBLG9CQUFRLE9BQU8sQ0FBQ3JELE9BQU9vQyxHQUFSLEVBQWFwQyxPQUFPd0MsT0FBcEIsQ0FBZixFQUE2QyxNQUFLLFFBQWxEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFURjtBQUhGO0FBVkY7QUFQRjtBQURGLE9BREY7QUFzQ0Q7Ozs7RUFuS2tDNUMsTUFBTTRHLFM7O2tCQXNLNUIsc0JBQU81QyxzQkFBUCxDIiwiZmlsZSI6IkN1cnJlbnRUaW1lbGluZVBvcG92ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IER1cGxpY2F0ZUljb25TVkcgZnJvbSAnLi9pY29ucy9EdXBsaWNhdGVJY29uU1ZHJ1xuaW1wb3J0IEVkaXRzSWNvblNWRyBmcm9tICcuL2ljb25zL0VkaXRzSWNvblNWRydcbmltcG9ydCBEZWxldGVJY29uU1ZHIGZyb20gJy4vaWNvbnMvRGVsZXRlSWNvblNWRydcbmltcG9ydCBDaGVja21hcmtJY29uU1ZHIGZyb20gJy4vaWNvbnMvQ2hlY2ttYXJrSWNvblNWRydcbmltcG9ydCBDaGV2cm9uTGVmdEljb25TVkcgZnJvbSAnLi9pY29ucy9DaGV2cm9uTGVmdEljb25TVkcnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuXG5jb25zdCBwb3BvdmVyV2lkdGggPSAxNzBcbmNvbnN0IHBvcG92ZXJIZWlnaHQgPSAnMjAwcHgnXG5jb25zdCBwYWdlVHJhbnNEdXIgPSAxNzBcblxuY29uc3QgU1RZTEVTID0ge1xuICBjb250YWluZXI6IHtcbiAgICBtaW5IZWlnaHQ6ICcxNTVweCcsXG4gICAgbWF4SGVpZ2h0OiAnMjAwcHgnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGggKyAncHgnLFxuICAgIGRpc3BsYXk6ICdyZWxhdGl2ZScsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIGJveFNoYWRvdzogJzAgNnB4IDI1cHggMCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgIG92ZXJmbG93WDogJ2hpZGRlbicsXG4gICAgb3ZlcmZsb3dZOiAnYXV0bydcbiAgfSxcbiAgcGFnZXNXcmFwcGVyOiB7XG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGggKyAncHgnLFxuICAgIGhlaWdodDogcG9wb3ZlckhlaWdodFxuICB9LFxuICBwYWdlczoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgd2lkdGg6IHBvcG92ZXJXaWR0aCArICdweCcsXG4gICAgaGVpZ2h0OiBwb3BvdmVySGVpZ2h0XG4gICAgLy8gcGFkZGluZ1RvcDogJzVweCdcbiAgfSxcbiAgcGFnZU9uZToge1xuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjIwbXMgZWFzZScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMCwgMCwgMCknXG4gIH0sXG4gIHBhZ2VUd286IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlM2QoMTAwJSwgMCwgMCknLFxuICAgIHRyYW5zaXRpb246IGB0cmFuc2Zvcm0gJHtwYWdlVHJhbnNEdXJ9bXMgZWFzZS1vdXRgLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHdpZHRoOiBwb3BvdmVyV2lkdGggKyAxICsgJ3B4JyxcbiAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkNPQUwsXG4gICAgbWFyZ2luTGVmdDogJy0xcHgnXG4gIH0sXG4gIG9uUGFnZToge1xuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKDAsIDAsIDApJ1xuICB9LFxuICBsZWZ0UGFnZToge1xuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZTNkKC0zMHB4LCAwLCAwKSdcbiAgfSxcbiAgdGl0bGVSb3c6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgaGVpZ2h0OiAnMzVweCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIGZvbnRTaXplOiAnMTNweCcsXG4gICAgbGV0dGVyU3BhY2luZzogJzJweCcsXG4gICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkNPQUxcbiAgfSxcbiAgYnRuOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBwYWRkaW5nOiAnNHB4IDEycHgnLFxuICAgIGJvcmRlclJhZGl1czogJzNweCcsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZXG4gICAgfVxuICB9LFxuICBidG5GdWxsOiB7XG4gICAgd2lkdGg6ICc4MCUnLFxuICAgIG1hcmdpbjogJzAgMCAwIDE3cHgnXG4gIH0sXG4gIGJ0bk1pbmk6IHtcbiAgICBwYWRkaW5nOiAnNHB4IDRweCcsXG4gICAgb3BhY2l0eTogMC43LFxuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBvcGFjaXR5OiAxXG4gICAgfVxuICB9LFxuICByb2d1ZUxheW91dDoge1xuICAgIG1hcmdpblRvcDogJzNweCdcbiAgfSxcbiAgYnRuVHJhbnM6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuICAgIH1cbiAgfSxcbiAgYnRuUHJldjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IDAsXG4gICAgdG9wOiAnNnB4J1xuICB9LFxuICB0aW1lbGluZVJvdzoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgcGFkZGluZzogJzNweCAxMHB4JyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktfR1JBWVxuICAgIH1cbiAgfSxcbiAgcm93Tm9CZzoge1xuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICB9XG4gIH0sXG4gIGlucHV0OiB7XG4gICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHBhZGRpbmc6ICc1cHggMTBweCcsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICB3aWR0aDogJzgwJScsXG4gICAgcG9pbnRlckV2ZW50czogJ2F1dG8nLFxuICAgICc6Zm9jdXMnOiB7XG4gICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuUElOSyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5NRURJVU1fQ09BTFxuICAgIH1cbiAgfSxcbiAgc2hvcnR5OiB7XG4gICAgd2lkdGg6ICc2MyUnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBpbnB1dFNvbG86IHtcbiAgICBtYXJnaW46ICc3cHggMCA0cHggMTdweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLk1FRElVTV9DT0FMLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgIH0sXG4gICAgJzpmb2N1cyc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEN1cnJlbnRUaW1lbGluZVBvcG92ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge29uUGFnZVR3bzogZmFsc2V9XG4gIH1cblxuICBnb1RvUGFnZU9uZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b25QYWdlVHdvOiBmYWxzZX0pXG4gIH1cblxuICBnb1RvUGFnZVR3byAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b25QYWdlVHdvOiB0cnVlfSlcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuY3JlYXRpb25JbnB1dClcbiAgICAgIHRoaXMuY3JlYXRpb25JbnB1dC5mb2N1cygpXG4gICAgfSwgcGFnZVRyYW5zRHVyKVxuICB9XG5cbiAgaGFuZGxlUmVuYW1lIChldmVudCwgdGltZWxpbmVOYW1lKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGNvbnN0IG9yaWdpbmFsTmFtZSA9IHRoaXMuc3RhdGUuZm9jdXNlZFRpbWVsaW5lXG4gICAgY29uc3QgbmV3TmFtZSA9IHRoaXNbdGltZWxpbmVOYW1lXS52YWx1ZVxuICAgIHRoaXMucHJvcHMuY2hhbmdlVGltZWxpbmVOYW1lKHtvcmlnaW5hbE5hbWUsIG5ld05hbWV9KVxuICAgIHRoaXNbdGltZWxpbmVOYW1lXS5ibHVyKClcbiAgfVxuXG4gIGhhbmRsZUNyZWF0ZVRpbWVsaW5lIChldmVudCwgZm9ybSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBsZXQgbmFtZSA9IHRoaXMuY3JlYXRpb25JbnB1dC52YWx1ZVxuICAgIHRoaXMucHJvcHMuY3JlYXRlVGltZWxpbmUobmFtZSlcbiAgICB0aGlzLmNyZWF0aW9uSW5wdXQuYmx1cigpXG4gICAgdGhpcy5jcmVhdGlvbklucHV0LnZhbHVlID0gJydcbiAgICB0aGlzLnNldFN0YXRlKHtvblBhZ2VUd286IGZhbHNlfSlcbiAgfVxuXG4gIGhhbmRsZUR1cGxpY2F0ZVRpbWVsaW5lIChldmVudCwgdGltZWxpbmVOYW1lKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgdGhpcy5wcm9wcy5kdXBsaWNhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gIH1cblxuICBzaG93UmVuYW1lRmllbGQgKGV2ZW50LCB0aW1lbGluZU5hbWUpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAvLyB0aGlzW3RpbWVsaW5lTmFtZV0uZm9jdXMoKSAvLyA/XG4gIH1cblxuICBoYW5kbGVEZWxldGVUaW1lbGluZSAoZXZlbnQsIHRpbWVsaW5lTmFtZSkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHRoaXMucHJvcHMuZGVsZXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICB9XG5cbiAgaGFuZGxlU2VsZWN0VGltZWxpbmUgKGV2ZW50LCB0aW1lbGluZU5hbWUpIHtcbiAgICB0aGlzLnByb3BzLnNlbGVjdFRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICB0aGlzLnByb3BzLmNsb3NlUG9wb3ZlcigpXG4gIH1cblxuICB0aW1lbGluZUVsZW1lbnRzTGlzdCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHt0aGlzLnByb3BzLnRpbWVsaW5lTmFtZXMubWFwKCh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBrZXk9e2BtYWluLSR7dGltZWxpbmVOYW1lfWB9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFSYWRpdW0uZ2V0U3RhdGUodGhpcy5zdGF0ZSwgYHQtJHt0aW1lbGluZU5hbWV9YCwgJzpmb2N1cycpKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNlbGVjdFRpbWVsaW5lKGUsIHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHN0eWxlPXt7cG9zaXRpb246ICdyZWxhdGl2ZSd9fT5cbiAgICAgICAgICAgICAgPGZvcm1cbiAgICAgICAgICAgICAgICBvblN1Ym1pdD17KGUpID0+IHsgdGhpcy5oYW5kbGVSZW5hbWUoZSwgdGltZWxpbmVOYW1lKSB9fVxuICAgICAgICAgICAgICAgIG9uRm9jdXM9eyhlKSA9PiB7IHRoaXMuc2V0U3RhdGUoe2ZvY3VzZWRUaW1lbGluZTogdGltZWxpbmVOYW1lfSkgfX1cbiAgICAgICAgICAgICAgICBrZXk9e2B0aW1lbGluZU5hbWUtJHt0aW1lbGluZU5hbWV9YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy50aW1lbGluZU5hbWVSb3csIFJhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgdC0ke3RpbWVsaW5lTmFtZX1gLCAnOmZvY3VzJykgJiYgU1RZTEVTLnJvd05vQmddfT5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdFbnRlciBuYW1lJ1xuICAgICAgICAgICAgICAgICAgICBrZXk9e2B0LSR7dGltZWxpbmVOYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J3BvcG92ZXItaW5wdXQnXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmlucHV0LCAhUmFkaXVtLmdldFN0YXRlKHRoaXMuc3RhdGUsIGB0LSR7dGltZWxpbmVOYW1lfWAsICc6Zm9jdXMnKSAmJiBTVFlMRVMuc2hvcnR5XX1cbiAgICAgICAgICAgICAgICAgICAgcmVmPXsoaW5wdXQpID0+IHsgdGhpc1t0aW1lbGluZU5hbWVdID0gaW5wdXQgfX0gLz5cbiAgICAgICAgICAgICAgICAgIHtSYWRpdW0uZ2V0U3RhdGUodGhpcy5zdGF0ZSwgYHQtJHt0aW1lbGluZU5hbWV9YCwgJzpmb2N1cycpXG4gICAgICAgICAgICAgICAgICAgICAgPyAoPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgYi0ke3RpbWVsaW5lTmFtZX1gfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuLCBTVFlMRVMuYnRuVHJhbnMsIFNUWUxFUy5idG5NaW5pLCBTVFlMRVMucm9ndWVMYXlvdXRdfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT0nc3VibWl0Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxDaGVja21hcmtJY29uU1ZHIGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+KVxuICAgICAgICAgICAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgICAgICB7IVJhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgdC0ke3RpbWVsaW5lTmFtZX1gLCAnOmZvY3VzJylcbiAgICAgICAgICAgICAgICA/ICg8c3BhbiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogJzRweCcsIHRvcDogJzVweCd9fT5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVEZWxldGVUaW1lbGluZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgICAgICBrZXk9e2BkLSR7dGltZWxpbmVOYW1lfWB9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmJ0biwgU1RZTEVTLmJ0blRyYW5zLCBTVFlMRVMuYnRuTWluaV19PlxuICAgICAgICAgICAgICAgICAgICA8RGVsZXRlSWNvblNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuc2hvd1JlbmFtZUZpZWxkLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIGtleT17YGUtJHt0aW1lbGluZU5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuLCBTVFlMRVMuYnRuVHJhbnMsIFNUWUxFUy5idG5NaW5pXX0+XG4gICAgICAgICAgICAgICAgICAgIDxFZGl0c0ljb25TVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUR1cGxpY2F0ZVRpbWVsaW5lLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgICAgIGtleT17YHYtJHt0aW1lbGluZU5hbWV9YH1cbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMuYnRuLCBTVFlMRVMuYnRuVHJhbnMsIFNUWUxFUy5idG5NaW5pXX0+XG4gICAgICAgICAgICAgICAgICAgIDxEdXBsaWNhdGVJY29uU1ZHIGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5wYWdlc1dyYXBwZXJ9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMucGFnZXMsIFNUWUxFUy5wYWdlT25lLCB0aGlzLnN0YXRlLm9uUGFnZVR3byAmJiBTVFlMRVMubGVmdFBhZ2VdfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy50aXRsZVJvd30+XG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PSdidG4xJyBzdHlsZT17W1NUWUxFUy5idG4sIFNUWUxFUy5idG5GdWxsXX0gb25DbGljaz17dGhpcy5nb1RvUGFnZVR3by5iaW5kKHRoaXMpfT5BZGQgVGltZWxpbmU8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge3RoaXMudGltZWxpbmVFbGVtZW50c0xpc3QoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLnBhZ2VzLCBTVFlMRVMucGFnZVR3bywgdGhpcy5zdGF0ZS5vblBhZ2VUd28gJiYgU1RZTEVTLm9uUGFnZV19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnRpdGxlUm93fT5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGtleT0nYnRuMidcbiAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5idG4sIFNUWUxFUy5idG5UcmFucywgU1RZTEVTLmJ0blByZXZdfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuZ29Ub1BhZ2VPbmUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgICAgPENoZXZyb25MZWZ0SWNvblNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e3BhZGRpbmdUb3A6ICc1cHgnLCB3aWR0aDogJzEwMCUnfX0+TkVXIFRJTUVMSU5FPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxmb3JtXG4gICAgICAgICAgICAgIG9uU3VibWl0PXt0aGlzLmhhbmRsZUNyZWF0ZVRpbWVsaW5lLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGtleT17YHRpbWVsaW5lLW5ld2B9PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9J05hbWUgdGltZWxpbmUnXG4gICAgICAgICAgICAgICAgICBrZXk9e2B0LW5ld2B9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9J25vcm1hbC1pbnB1dCdcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLmlucHV0LCBTVFlMRVMuaW5wdXRTb2xvXX1cbiAgICAgICAgICAgICAgICAgIHJlZj17KGlucHV0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRpb25JbnB1dCA9IGlucHV0XG4gICAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9e1tTVFlMRVMuYnRuLCBTVFlMRVMuYnRuRnVsbF19IHR5cGU9J3N1Ym1pdCc+Q3JlYXRlPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oQ3VycmVudFRpbWVsaW5lUG9wb3ZlcilcbiJdfQ==