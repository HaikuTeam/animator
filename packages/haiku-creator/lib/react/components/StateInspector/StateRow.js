'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/StateInspector/StateRow.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _States = require('haiku-bytecode/src/States');

var States = _interopRequireWildcard(_States);

var _Palette = require('../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('../Icons');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  stateWrapper: {
    padding: 6,
    display: 'flex',
    alignItems: 'flex-start',
    ':hover': {
      backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).darken(0.1)
    }
  },
  col: {
    display: 'inline-block',
    width: '50%'
  },
  col1: {
    maxWidth: 145
  },
  col2: {
    position: 'relative'
  },
  stateMenu: {
    width: 10,
    position: 'absolute',
    right: -3,
    transform: 'scale(1.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    cursor: 'pointer',
    ':hover': {}
  },
  pill: {
    padding: '2px 5px',
    borderRadius: 3,
    maxHeight: 21,
    cursor: 'pointer'
  },
  pillName: {
    backgroundColor: _Palette2.default.BLUE,
    float: 'right',
    marginRight: 4,
    color: _Palette2.default.ROCK
  },
  pillValue: {
    backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).lighten(0.17),
    overflow: 'hidden',
    float: 'left',
    marginLeft: 4,
    maxWidth: 'calc(100% - 12px)',
    minHeight: 22
  },
  input: {
    backgroundColor: _Palette2.default.COAL,
    padding: '4px 5px 3px',
    WebkitUserSelect: 'auto',
    cursor: 'text',
    color: _Palette2.default.ROCK,
    width: 'calc(100% - 4px)',
    minHeight: 22,
    fontSize: 12,
    fontFamily: 'Fira Sans',
    border: '1px solid transparent',
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHTEST_PINK
    }
  },
  input2: {
    width: 'calc(100% - 8px)',
    marginLeft: 4
  }
};

function isBlank(str) {
  return (/^\s*$/.test(str)
  );
}

var StateRow = function (_React$Component) {
  _inherits(StateRow, _React$Component);

  function StateRow(props) {
    _classCallCheck(this, StateRow);

    var _this = _possibleConstructorReturn(this, (StateRow.__proto__ || Object.getPrototypeOf(StateRow)).call(this, props));

    _this.state = {
      isEditing: false,
      isHovered: false,
      name: null,
      desc: null,
      valuePreEdit: null,
      didEscape: false
    };
    return _this;
  }

  _createClass(StateRow, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        originalName: this.props.stateName,
        name: this.props.stateName,
        desc: this.props.stateDescriptor,
        valuePreEdit: this.props.stateDescriptor.value
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        originalName: nextProps.stateName,
        name: nextProps.stateName,
        desc: nextProps.stateDescriptor,
        valuePreEdit: nextProps.stateDescriptor.value
      });
    }
  }, {
    key: 'handleTabSwitch',
    value: function handleTabSwitch(event, side) {
      if (event.keyCode === 9) {
        event.preventDefault();

        if (side === 'name') {
          this.valueInput.focus();
        }

        if (side === 'value') {
          this.nameInput.focus();
        }
      }
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event, side) {
      var _this2 = this;

      if (event.keyCode === 27) {
        // esc key
        return this.setState({ isEditing: false, didEscape: true });
      }

      var desc = this.state.desc;

      // Only update the inputs in the UI if the user didn't press Return
      // Here we're only updating the view state, we haven't committed anything yet
      if (event.key !== 'Enter') {
        if (side === 'name') {
          var trimmedName = event.target.value.trim();
          this.setState({ name: trimmedName });
        } else {
          // Update the value
          desc.value = event.target.value.trim();
          this.setState({ desc: desc });
        }
        return;
      }

      // If we got here, Enter was pressed, meaning we want to commit the state value/name
      desc = States.autoCastToType(desc);

      // If the name field is blank, delete the state (or just remove it if it is new)
      if (isBlank(this.state.name)) {
        if (this.props.isNew) {
          return this.props.closeNewStateForm();
        } else {
          return this.props.deleteStateValue(this.state.originalName, function () {
            return _this2.setState({ isEditing: false });
          });
        }
      }

      // If made it this far, at least one of the fields is NOT blank, and we can attempt a submit
      if (isBlank(desc.value) || isBlank(this.state.name)) {
        if (isBlank(this.state.name)) {
          return this.props.createNotice({
            type: 'warning',
            title: 'Sorry',
            message: 'State names cannot be blank'
          });
        }

        // For now, only support US ASCII chars that would be valid as a JavaScript identifier
        if (!/^[$A-Z_][0-9A-Z_$]*$/i.test(this.state.name)) {
          return this.props.createNotice({
            type: 'warning',
            title: 'Sorry',
            message: 'State names cannot have spaces or special characters, and must begin with a letter'
          });
        }

        if (isBlank(desc.value)) {
          // TODO: Not sure if we want to set this as null or not
        }

        this.setState({ desc: desc, name: this.state.name }, function () {
          _this2.submitChanges();
          if (_this2.props.isNew) _this2.props.closeNewStateForm();
          return _this2.setState({ isEditing: false });
        });
      } else {
        // neither were blank
        this.setState({ desc: desc, name: this.state.name }, function () {
          _this2.submitChanges();
          if (_this2.props.isNew) _this2.props.closeNewStateForm();
          _this2.setState({ isEditing: false });
        });
      }
    }
  }, {
    key: 'submitChanges',
    value: function submitChanges() {
      var _this3 = this;

      var didValueChange = this.state.desc.value !== this.state.valuePreEdit;
      var didNameChange = this.state.name !== this.props.stateName;

      if (didNameChange && didValueChange) {
        return this.props.deleteStateValue(this.props.stateName, function () {
          return _this3.props.upsertStateValue(_this3.state.name, _this3.state.desc, function () {
            _this3.setState({ isEditing: false });
          });
        });
      } else if (didNameChange) {
        return this.props.deleteStateValue(this.props.stateName, function () {
          return _this3.props.upsertStateValue(_this3.state.name, _this3.state.desc, function () {
            _this3.setState({ isEditing: false });
          });
        });
      } else if (didValueChange) {
        return this.props.upsertStateValue(this.state.name, this.state.desc, function () {
          _this3.setState({ isEditing: false });
        });
      }
    }
  }, {
    key: 'handleClickOutside',
    value: function handleClickOutside() {
      if (this.props.isNew) return this.props.closeNewStateForm();
      this.submitChanges();
    }
  }, {
    key: 'getEditableStateValue',
    value: function getEditableStateValue() {
      if (this.state.desc) {
        return States.autoStringify(this.state.desc);
      } else if (this.props.stateDescriptor) {
        return States.autoStringify(this.props.stateDescriptor);
      } else {
        return '';
      }
    }
  }, {
    key: 'getDisplayableStateValue',
    value: function getDisplayableStateValue() {
      if (this.state.valuePreEdit) {
        return States.autoStringify({ value: this.state.valuePreEdit });
      } else if (this.props.stateDescriptor) {
        return States.autoStringify(this.props.stateDescriptor);
      } else {
        return '';
      }
    }
  }, {
    key: 'isValidColor',
    value: function isValidColor(color) {
      var dummyElement = document.createElement('span');
      dummyElement.style.backgroundColor = color;

      return dummyElement.style.backgroundColor !== '';
    }
  }, {
    key: 'generateColorCap',
    value: function generateColorCap() {
      var maybeColor = this.getDisplayableStateValue();

      if (this.isValidColor(maybeColor)) {
        return {
          borderRightWidth: 4,
          borderRightColor: maybeColor,
          borderRightStyle: 'solid'
        };
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'form',
        { key: this.props.stateName + '-state',
          onMouseOver: function onMouseOver() {
            return _this4.setState({ isHovered: true });
          },
          onMouseOut: function onMouseOut() {
            return _this4.setState({ isHovered: false });
          },
          onDoubleClick: function onDoubleClick() {
            return _this4.setState({ isEditing: true, didEscape: false });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 270
          },
          __self: this
        },
        !this.state.isEditing && !this.props.isNew ? _react2.default.createElement(
          'div',
          { style: STYLES.stateWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 275
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col1], __source: {
                fileName: _jsxFileName,
                lineNumber: 276
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-name',
                style: [STYLES.pill, STYLES.pillName], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 277
                },
                __self: this
              },
              this.props.stateName
            )
          ),
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col2], __source: {
                fileName: _jsxFileName,
                lineNumber: 282
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-value',
                style: [STYLES.pill, STYLES.pillValue, this.generateColorCap()], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 283
                },
                __self: this
              },
              this.getDisplayableStateValue()
            ),
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-menu',
                style: [STYLES.stateMenu, (!this.state.isHovered || true) && { display: 'none' // TODO: remove this '|| true' to show stack menu on hover and create popover
                }], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 287
                },
                __self: this
              },
              _react2.default.createElement(_Icons.StackMenuSVG, { color: _radium2.default.getState(this.state, this.props.stateName + '-menu', ':hover') ? _Palette2.default.ROCK : _Palette2.default.ROCK_MUTED, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 292
                },
                __self: this
              })
            )
          )
        ) : _react2.default.createElement(
          'div',
          { style: STYLES.stateWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 296
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col2], __source: {
                fileName: _jsxFileName,
                lineNumber: 297
              },
              __self: this
            },
            _react2.default.createElement('input', { key: this.props.stateName + '-name',
              ref: function ref(nameInput) {
                _this4.nameInput = nameInput;
              },
              style: [STYLES.pill, STYLES.input],
              defaultValue: this.props.stateName,
              onKeyUp: function onKeyUp(event) {
                return _this4.handleChange(event, 'name');
              },
              onKeyDown: function onKeyDown(event) {
                return _this4.handleTabSwitch(event, 'name');
              },
              autoFocus: true, __source: {
                fileName: _jsxFileName,
                lineNumber: 298
              },
              __self: this
            })
          ),
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col2], __source: {
                fileName: _jsxFileName,
                lineNumber: 306
              },
              __self: this
            },
            _react2.default.createElement('input', { key: this.props.stateName + '-value',
              ref: function ref(valueInput) {
                _this4.valueInput = valueInput;
              },
              style: [STYLES.pill, STYLES.input, STYLES.input2],
              defaultValue: this.getEditableStateValue(),
              onKeyUp: function onKeyUp(event) {
                return _this4.handleChange(event, 'value');
              },
              onKeyDown: function onKeyDown(event) {
                return _this4.handleTabSwitch(event, 'value');
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 307
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-menu',
                style: [STYLES.stateMenu, !_radium2.default.getState(this.state, this.props.stateName + '-state', ':hover') && { display: 'none' }], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 313
                },
                __self: this
              },
              _react2.default.createElement(_Icons.StackMenuSVG, { color: _radium2.default.getState(this.state, this.props.stateName + '-menu', ':hover') ? _Palette2.default.ROCK : _Palette2.default.ROCK_MUTED, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 318
                },
                __self: this
              })
            )
          )
        )
      );
    }
  }]);

  return StateRow;
}(_react2.default.Component);

exports.default = (0, _reactOnclickoutside2.default)((0, _radium2.default)(StateRow));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlUm93LmpzIl0sIm5hbWVzIjpbIlN0YXRlcyIsIlNUWUxFUyIsInN0YXRlV3JhcHBlciIsInBhZGRpbmciLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImJhY2tncm91bmRDb2xvciIsIkdSQVkiLCJkYXJrZW4iLCJjb2wiLCJ3aWR0aCIsImNvbDEiLCJtYXhXaWR0aCIsImNvbDIiLCJwb3NpdGlvbiIsInN0YXRlTWVudSIsInJpZ2h0IiwidHJhbnNmb3JtIiwianVzdGlmeUNvbnRlbnQiLCJoZWlnaHQiLCJjdXJzb3IiLCJwaWxsIiwiYm9yZGVyUmFkaXVzIiwibWF4SGVpZ2h0IiwicGlsbE5hbWUiLCJCTFVFIiwiZmxvYXQiLCJtYXJnaW5SaWdodCIsImNvbG9yIiwiUk9DSyIsInBpbGxWYWx1ZSIsImxpZ2h0ZW4iLCJvdmVyZmxvdyIsIm1hcmdpbkxlZnQiLCJtaW5IZWlnaHQiLCJpbnB1dCIsIkNPQUwiLCJXZWJraXRVc2VyU2VsZWN0IiwiZm9udFNpemUiLCJmb250RmFtaWx5IiwiYm9yZGVyIiwiTElHSFRFU1RfUElOSyIsImlucHV0MiIsImlzQmxhbmsiLCJzdHIiLCJ0ZXN0IiwiU3RhdGVSb3ciLCJwcm9wcyIsInN0YXRlIiwiaXNFZGl0aW5nIiwiaXNIb3ZlcmVkIiwibmFtZSIsImRlc2MiLCJ2YWx1ZVByZUVkaXQiLCJkaWRFc2NhcGUiLCJzZXRTdGF0ZSIsIm9yaWdpbmFsTmFtZSIsInN0YXRlTmFtZSIsInN0YXRlRGVzY3JpcHRvciIsInZhbHVlIiwibmV4dFByb3BzIiwiZXZlbnQiLCJzaWRlIiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwidmFsdWVJbnB1dCIsImZvY3VzIiwibmFtZUlucHV0Iiwia2V5IiwidHJpbW1lZE5hbWUiLCJ0YXJnZXQiLCJ0cmltIiwiYXV0b0Nhc3RUb1R5cGUiLCJpc05ldyIsImNsb3NlTmV3U3RhdGVGb3JtIiwiZGVsZXRlU3RhdGVWYWx1ZSIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJzdWJtaXRDaGFuZ2VzIiwiZGlkVmFsdWVDaGFuZ2UiLCJkaWROYW1lQ2hhbmdlIiwidXBzZXJ0U3RhdGVWYWx1ZSIsImF1dG9TdHJpbmdpZnkiLCJkdW1teUVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsIm1heWJlQ29sb3IiLCJnZXREaXNwbGF5YWJsZVN0YXRlVmFsdWUiLCJpc1ZhbGlkQ29sb3IiLCJib3JkZXJSaWdodFdpZHRoIiwiYm9yZGVyUmlnaHRDb2xvciIsImJvcmRlclJpZ2h0U3R5bGUiLCJnZW5lcmF0ZUNvbG9yQ2FwIiwiZ2V0U3RhdGUiLCJST0NLX01VVEVEIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlVGFiU3dpdGNoIiwiZ2V0RWRpdGFibGVTdGF0ZVZhbHVlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxNOztBQUNaOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1DLFNBQVM7QUFDYkMsZ0JBQWM7QUFDWkMsYUFBUyxDQURHO0FBRVpDLGFBQVMsTUFGRztBQUdaQyxnQkFBWSxZQUhBO0FBSVosY0FBVTtBQUNSQyx1QkFBaUIscUJBQU0sa0JBQVFDLElBQWQsRUFBb0JDLE1BQXBCLENBQTJCLEdBQTNCO0FBRFQ7QUFKRSxHQUREO0FBU2JDLE9BQUs7QUFDSEwsYUFBUyxjQUROO0FBRUhNLFdBQU87QUFGSixHQVRRO0FBYWJDLFFBQU07QUFDSkMsY0FBVTtBQUROLEdBYk87QUFnQmJDLFFBQU07QUFDSkMsY0FBVTtBQUROLEdBaEJPO0FBbUJiQyxhQUFXO0FBQ1RMLFdBQU8sRUFERTtBQUVUSSxjQUFVLFVBRkQ7QUFHVEUsV0FBTyxDQUFDLENBSEM7QUFJVEMsZUFBVyxZQUpGO0FBS1RiLGFBQVMsTUFMQTtBQU1UQyxnQkFBWSxRQU5IO0FBT1Rh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S2hELEtBQXJCLEVBQStCLEtBQUtELEtBQUwsQ0FBV1UsU0FBMUMsWUFBNEQsUUFBNUQsSUFBd0Usa0JBQVE1QixJQUFoRixHQUF1RixrQkFBUW9FLFVBQXBIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGO0FBUEY7QUFWQTtBQTFCTixPQURGO0FBd0REOzs7O0VBaFBvQixnQkFBTUksUzs7a0JBbVBkLG1DQUFlLHNCQUFPdkQsUUFBUCxDQUFmLEMiLCJmaWxlIjoiU3RhdGVSb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBvbkNsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZSdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCAqIGFzIFN0YXRlcyBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvU3RhdGVzJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi4vUGFsZXR0ZSdcbmltcG9ydCB7IFN0YWNrTWVudVNWRyB9IGZyb20gJy4uL0ljb25zJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHN0YXRlV3JhcHBlcjoge1xuICAgIHBhZGRpbmc6IDYsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkdSQVkpLmRhcmtlbigwLjEpXG4gICAgfVxuICB9LFxuICBjb2w6IHtcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICB3aWR0aDogJzUwJSdcbiAgfSxcbiAgY29sMToge1xuICAgIG1heFdpZHRoOiAxNDVcbiAgfSxcbiAgY29sMjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gIH0sXG4gIHN0YXRlTWVudToge1xuICAgIHdpZHRoOiAxMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICByaWdodDogLTMsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4zKScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAnOmhvdmVyJzoge31cbiAgfSxcbiAgcGlsbDoge1xuICAgIHBhZGRpbmc6ICcycHggNXB4JyxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgbWF4SGVpZ2h0OiAyMSxcbiAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICB9LFxuICBwaWxsTmFtZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5CTFVFLFxuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgIG1hcmdpblJpZ2h0OiA0LFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgfSxcbiAgcGlsbFZhbHVlOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkdSQVkpLmxpZ2h0ZW4oMC4xNyksXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgbWFyZ2luTGVmdDogNCxcbiAgICBtYXhXaWR0aDogJ2NhbGMoMTAwJSAtIDEycHgpJyxcbiAgICBtaW5IZWlnaHQ6IDIyXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgcGFkZGluZzogJzRweCA1cHggM3B4JyxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnYXV0bycsXG4gICAgY3Vyc29yOiAndGV4dCcsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICB3aWR0aDogJ2NhbGMoMTAwJSAtIDRweCknLFxuICAgIG1pbkhlaWdodDogMjIsXG4gICAgZm9udFNpemU6IDEyLFxuICAgIGZvbnRGYW1pbHk6ICdGaXJhIFNhbnMnLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgJzpmb2N1cyc6IHtcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgfVxuICB9LFxuICBpbnB1dDI6IHtcbiAgICB3aWR0aDogJ2NhbGMoMTAwJSAtIDhweCknLFxuICAgIG1hcmdpbkxlZnQ6IDRcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0JsYW5rIChzdHIpIHtcbiAgcmV0dXJuIC9eXFxzKiQvLnRlc3Qoc3RyKVxufVxuXG5jbGFzcyBTdGF0ZVJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0VkaXRpbmc6IGZhbHNlLFxuICAgICAgaXNIb3ZlcmVkOiBmYWxzZSxcbiAgICAgIG5hbWU6IG51bGwsXG4gICAgICBkZXNjOiBudWxsLFxuICAgICAgdmFsdWVQcmVFZGl0OiBudWxsLFxuICAgICAgZGlkRXNjYXBlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG9yaWdpbmFsTmFtZTogdGhpcy5wcm9wcy5zdGF0ZU5hbWUsXG4gICAgICBuYW1lOiB0aGlzLnByb3BzLnN0YXRlTmFtZSxcbiAgICAgIGRlc2M6IHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yLFxuICAgICAgdmFsdWVQcmVFZGl0OiB0aGlzLnByb3BzLnN0YXRlRGVzY3JpcHRvci52YWx1ZVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG9yaWdpbmFsTmFtZTogbmV4dFByb3BzLnN0YXRlTmFtZSxcbiAgICAgIG5hbWU6IG5leHRQcm9wcy5zdGF0ZU5hbWUsXG4gICAgICBkZXNjOiBuZXh0UHJvcHMuc3RhdGVEZXNjcmlwdG9yLFxuICAgICAgdmFsdWVQcmVFZGl0OiBuZXh0UHJvcHMuc3RhdGVEZXNjcmlwdG9yLnZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVRhYlN3aXRjaCAoZXZlbnQsIHNpZGUpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gOSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICBpZiAoc2lkZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIHRoaXMudmFsdWVJbnB1dC5mb2N1cygpXG4gICAgICB9XG5cbiAgICAgIGlmIChzaWRlID09PSAndmFsdWUnKSB7XG4gICAgICAgIHRoaXMubmFtZUlucHV0LmZvY3VzKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UgKGV2ZW50LCBzaWRlKSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7IC8vIGVzYyBrZXlcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlLCBkaWRFc2NhcGU6IHRydWV9KVxuICAgIH1cblxuICAgIGxldCBkZXNjID0gdGhpcy5zdGF0ZS5kZXNjXG5cbiAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgaW5wdXRzIGluIHRoZSBVSSBpZiB0aGUgdXNlciBkaWRuJ3QgcHJlc3MgUmV0dXJuXG4gICAgLy8gSGVyZSB3ZSdyZSBvbmx5IHVwZGF0aW5nIHRoZSB2aWV3IHN0YXRlLCB3ZSBoYXZlbid0IGNvbW1pdHRlZCBhbnl0aGluZyB5ZXRcbiAgICBpZiAoZXZlbnQua2V5ICE9PSAnRW50ZXInKSB7XG4gICAgICBpZiAoc2lkZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGxldCB0cmltbWVkTmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZS50cmltKClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5hbWU6IHRyaW1tZWROYW1lIH0pXG4gICAgICB9IGVsc2UgeyAvLyBVcGRhdGUgdGhlIHZhbHVlXG4gICAgICAgIGRlc2MudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWUudHJpbSgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Rlc2N9KVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZ290IGhlcmUsIEVudGVyIHdhcyBwcmVzc2VkLCBtZWFuaW5nIHdlIHdhbnQgdG8gY29tbWl0IHRoZSBzdGF0ZSB2YWx1ZS9uYW1lXG4gICAgZGVzYyA9IFN0YXRlcy5hdXRvQ2FzdFRvVHlwZShkZXNjKVxuXG4gICAgLy8gSWYgdGhlIG5hbWUgZmllbGQgaXMgYmxhbmssIGRlbGV0ZSB0aGUgc3RhdGUgKG9yIGp1c3QgcmVtb3ZlIGl0IGlmIGl0IGlzIG5ldylcbiAgICBpZiAoaXNCbGFuayh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc05ldykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jbG9zZU5ld1N0YXRlRm9ybSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kZWxldGVTdGF0ZVZhbHVlKHRoaXMuc3RhdGUub3JpZ2luYWxOYW1lLCAoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG1hZGUgaXQgdGhpcyBmYXIsIGF0IGxlYXN0IG9uZSBvZiB0aGUgZmllbGRzIGlzIE5PVCBibGFuaywgYW5kIHdlIGNhbiBhdHRlbXB0IGEgc3VibWl0XG4gICAgaWYgKGlzQmxhbmsoZGVzYy52YWx1ZSkgfHwgaXNCbGFuayh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICBpZiAoaXNCbGFuayh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnU29ycnknLFxuICAgICAgICAgIG1lc3NhZ2U6ICdTdGF0ZSBuYW1lcyBjYW5ub3QgYmUgYmxhbmsnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBub3csIG9ubHkgc3VwcG9ydCBVUyBBU0NJSSBjaGFycyB0aGF0IHdvdWxkIGJlIHZhbGlkIGFzIGEgSmF2YVNjcmlwdCBpZGVudGlmaWVyXG4gICAgICBpZiAoIS9eWyRBLVpfXVswLTlBLVpfJF0qJC9pLnRlc3QodGhpcy5zdGF0ZS5uYW1lKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ1NvcnJ5JyxcbiAgICAgICAgICBtZXNzYWdlOiAnU3RhdGUgbmFtZXMgY2Fubm90IGhhdmUgc3BhY2VzIG9yIHNwZWNpYWwgY2hhcmFjdGVycywgYW5kIG11c3QgYmVnaW4gd2l0aCBhIGxldHRlcidcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQmxhbmsoZGVzYy52YWx1ZSkpIHtcbiAgICAgICAgLy8gVE9ETzogTm90IHN1cmUgaWYgd2Ugd2FudCB0byBzZXQgdGhpcyBhcyBudWxsIG9yIG5vdFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtkZXNjLCBuYW1lOiB0aGlzLnN0YXRlLm5hbWV9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3VibWl0Q2hhbmdlcygpXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlzTmV3KSB0aGlzLnByb3BzLmNsb3NlTmV3U3RhdGVGb3JtKClcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgeyAvLyBuZWl0aGVyIHdlcmUgYmxhbmtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rlc2MsIG5hbWU6IHRoaXMuc3RhdGUubmFtZX0sICgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRDaGFuZ2VzKClcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNOZXcpIHRoaXMucHJvcHMuY2xvc2VOZXdTdGF0ZUZvcm0oKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgc3VibWl0Q2hhbmdlcyAoKSB7XG4gICAgY29uc3QgZGlkVmFsdWVDaGFuZ2UgPSB0aGlzLnN0YXRlLmRlc2MudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWVQcmVFZGl0XG4gICAgY29uc3QgZGlkTmFtZUNoYW5nZSA9IHRoaXMuc3RhdGUubmFtZSAhPT0gdGhpcy5wcm9wcy5zdGF0ZU5hbWVcblxuICAgIGlmIChkaWROYW1lQ2hhbmdlICYmIGRpZFZhbHVlQ2hhbmdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5kZWxldGVTdGF0ZVZhbHVlKHRoaXMucHJvcHMuc3RhdGVOYW1lLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwc2VydFN0YXRlVmFsdWUodGhpcy5zdGF0ZS5uYW1lLCB0aGlzLnN0YXRlLmRlc2MsICgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNFZGl0aW5nOiBmYWxzZSB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGRpZE5hbWVDaGFuZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmRlbGV0ZVN0YXRlVmFsdWUodGhpcy5wcm9wcy5zdGF0ZU5hbWUsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBzZXJ0U3RhdGVWYWx1ZSh0aGlzLnN0YXRlLm5hbWUsIHRoaXMuc3RhdGUuZGVzYywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc0VkaXRpbmc6IGZhbHNlIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoZGlkVmFsdWVDaGFuZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwc2VydFN0YXRlVmFsdWUodGhpcy5zdGF0ZS5uYW1lLCB0aGlzLnN0YXRlLmRlc2MsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzRWRpdGluZzogZmFsc2UgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2tPdXRzaWRlICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc05ldykgcmV0dXJuIHRoaXMucHJvcHMuY2xvc2VOZXdTdGF0ZUZvcm0oKVxuICAgIHRoaXMuc3VibWl0Q2hhbmdlcygpXG4gIH1cblxuICBnZXRFZGl0YWJsZVN0YXRlVmFsdWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmRlc2MpIHtcbiAgICAgIHJldHVybiBTdGF0ZXMuYXV0b1N0cmluZ2lmeSh0aGlzLnN0YXRlLmRlc2MpXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnN0YXRlRGVzY3JpcHRvcikge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXREaXNwbGF5YWJsZVN0YXRlVmFsdWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnZhbHVlUHJlRWRpdCkge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHsgdmFsdWU6IHRoaXMuc3RhdGUudmFsdWVQcmVFZGl0IH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnN0YXRlRGVzY3JpcHRvcikge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkQ29sb3IgKGNvbG9yKSB7XG4gICAgY29uc3QgZHVtbXlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZHVtbXlFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yXG5cbiAgICByZXR1cm4gZHVtbXlFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciAhPT0gJydcbiAgfVxuXG4gIGdlbmVyYXRlQ29sb3JDYXAgKCkge1xuICAgIGNvbnN0IG1heWJlQ29sb3IgPSB0aGlzLmdldERpc3BsYXlhYmxlU3RhdGVWYWx1ZSgpXG5cbiAgICBpZiAodGhpcy5pc1ZhbGlkQ29sb3IobWF5YmVDb2xvcikpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJvcmRlclJpZ2h0V2lkdGg6IDQsXG4gICAgICAgIGJvcmRlclJpZ2h0Q29sb3I6IG1heWJlQ29sb3IsXG4gICAgICAgIGJvcmRlclJpZ2h0U3R5bGU6ICdzb2xpZCdcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybSBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS1zdGF0ZWB9XG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtpc0hvdmVyZWQ6IHRydWV9KX1cbiAgICAgICAgb25Nb3VzZU91dD17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7aXNIb3ZlcmVkOiBmYWxzZX0pfVxuICAgICAgICBvbkRvdWJsZUNsaWNrPXsoKSA9PiB0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IHRydWUsIGRpZEVzY2FwZTogZmFsc2V9KX0+XG4gICAgICAgIHshdGhpcy5zdGF0ZS5pc0VkaXRpbmcgJiYgIXRoaXMucHJvcHMuaXNOZXdcbiAgICAgICAgICA/IDxkaXYgc3R5bGU9e1NUWUxFUy5zdGF0ZVdyYXBwZXJ9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17W1NUWUxFUy5jb2wsIFNUWUxFUy5jb2wxXX0+XG4gICAgICAgICAgICAgIDxzcGFuIGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LW5hbWVgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLnBpbGwsIFNUWUxFUy5waWxsTmFtZV19PlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnN0YXRlTmFtZX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmNvbCwgU1RZTEVTLmNvbDJdfT5cbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tdmFsdWVgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLnBpbGwsIFNUWUxFUy5waWxsVmFsdWUsIHRoaXMuZ2VuZXJhdGVDb2xvckNhcCgpXX0+XG4gICAgICAgICAgICAgICAge3RoaXMuZ2V0RGlzcGxheWFibGVTdGF0ZVZhbHVlKCl9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tbWVudWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICAgICAgICAgIFNUWUxFUy5zdGF0ZU1lbnUsXG4gICAgICAgICAgICAgICAgICAoIXRoaXMuc3RhdGUuaXNIb3ZlcmVkIHx8IHRydWUpICYmIHtkaXNwbGF5OiAnbm9uZSd9IC8vIFRPRE86IHJlbW92ZSB0aGlzICd8fCB0cnVlJyB0byBzaG93IHN0YWNrIG1lbnUgb24gaG92ZXIgYW5kIGNyZWF0ZSBwb3BvdmVyXG4gICAgICAgICAgICAgICAgXX0+XG4gICAgICAgICAgICAgICAgPFN0YWNrTWVudVNWRyBjb2xvcj17UmFkaXVtLmdldFN0YXRlKHRoaXMuc3RhdGUsIGAke3RoaXMucHJvcHMuc3RhdGVOYW1lfS1tZW51YCwgJzpob3ZlcicpID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEfSAvPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA6IDxkaXYgc3R5bGU9e1NUWUxFUy5zdGF0ZVdyYXBwZXJ9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17W1NUWUxFUy5jb2wsIFNUWUxFUy5jb2wyXX0+XG4gICAgICAgICAgICAgIDxpbnB1dCBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS1uYW1lYH1cbiAgICAgICAgICAgICAgICByZWY9eyhuYW1lSW5wdXQpID0+IHsgdGhpcy5uYW1lSW5wdXQgPSBuYW1lSW5wdXQgfX1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5waWxsLCBTVFlMRVMuaW5wdXRdfVxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy5zdGF0ZU5hbWV9XG4gICAgICAgICAgICAgICAgb25LZXlVcD17KGV2ZW50KSA9PiB0aGlzLmhhbmRsZUNoYW5nZShldmVudCwgJ25hbWUnKX1cbiAgICAgICAgICAgICAgICBvbktleURvd249eyhldmVudCkgPT4gdGhpcy5oYW5kbGVUYWJTd2l0Y2goZXZlbnQsICduYW1lJyl9XG4gICAgICAgICAgICAgICAgYXV0b0ZvY3VzIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuY29sLCBTVFlMRVMuY29sMl19PlxuICAgICAgICAgICAgICA8aW5wdXQga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tdmFsdWVgfVxuICAgICAgICAgICAgICAgIHJlZj17KHZhbHVlSW5wdXQpID0+IHsgdGhpcy52YWx1ZUlucHV0ID0gdmFsdWVJbnB1dCB9fVxuICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLnBpbGwsIFNUWUxFUy5pbnB1dCwgU1RZTEVTLmlucHV0Ml19XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmdldEVkaXRhYmxlU3RhdGVWYWx1ZSgpfVxuICAgICAgICAgICAgICAgIG9uS2V5VXA9eyhldmVudCkgPT4gdGhpcy5oYW5kbGVDaGFuZ2UoZXZlbnQsICd2YWx1ZScpfVxuICAgICAgICAgICAgICAgIG9uS2V5RG93bj17KGV2ZW50KSA9PiB0aGlzLmhhbmRsZVRhYlN3aXRjaChldmVudCwgJ3ZhbHVlJyl9IC8+XG4gICAgICAgICAgICAgIDxzcGFuIGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LW1lbnVgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICAgICAgICBTVFlMRVMuc3RhdGVNZW51LFxuICAgICAgICAgICAgICAgICAgIVJhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tc3RhdGVgLCAnOmhvdmVyJykgJiYge2Rpc3BsYXk6ICdub25lJ31cbiAgICAgICAgICAgICAgICBdfT5cbiAgICAgICAgICAgICAgICA8U3RhY2tNZW51U1ZHIGNvbG9yPXtSYWRpdW0uZ2V0U3RhdGUodGhpcy5zdGF0ZSwgYCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LW1lbnVgLCAnOmhvdmVyJykgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURUR9IC8+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICB9XG4gICAgICA8L2Zvcm0+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG9uQ2xpY2tPdXRzaWRlKFJhZGl1bShTdGF0ZVJvdykpXG4iXX0=