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
            lineNumber: 237
          },
          __self: this
        },
        !this.state.isEditing && !this.props.isNew ? _react2.default.createElement(
          'div',
          { style: STYLES.stateWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 242
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col1], __source: {
                fileName: _jsxFileName,
                lineNumber: 243
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-name',
                style: [STYLES.pill, STYLES.pillName], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 244
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
                lineNumber: 249
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-value',
                style: [STYLES.pill, STYLES.pillValue], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 250
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
                  lineNumber: 254
                },
                __self: this
              },
              _react2.default.createElement(_Icons.StackMenuSVG, { color: _radium2.default.getState(this.state, this.props.stateName + '-menu', ':hover') ? _Palette2.default.ROCK : _Palette2.default.ROCK_MUTED, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 259
                },
                __self: this
              })
            )
          )
        ) : _react2.default.createElement(
          'div',
          { style: STYLES.stateWrapper, __source: {
              fileName: _jsxFileName,
              lineNumber: 263
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col2], __source: {
                fileName: _jsxFileName,
                lineNumber: 264
              },
              __self: this
            },
            _react2.default.createElement('input', { key: this.props.stateName + '-name',
              ref: 'name',
              style: [STYLES.pill, STYLES.input],
              defaultValue: this.props.stateName,
              onKeyUp: function onKeyUp(event) {
                return _this4.handleChange(event, 'name');
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 265
              },
              __self: this
            })
          ),
          _react2.default.createElement(
            'div',
            { style: [STYLES.col, STYLES.col2], __source: {
                fileName: _jsxFileName,
                lineNumber: 271
              },
              __self: this
            },
            _react2.default.createElement('input', { key: this.props.stateName + '-value',
              ref: 'value',
              style: [STYLES.pill, STYLES.input, STYLES.input2],
              defaultValue: this.getEditableStateValue(),
              onKeyUp: function onKeyUp(event) {
                return _this4.handleChange(event, 'value');
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 272
              },
              __self: this
            }),
            _react2.default.createElement(
              'span',
              { key: this.props.stateName + '-menu',
                style: [STYLES.stateMenu, !_radium2.default.getState(this.state, this.props.stateName + '-state', ':hover') && { display: 'none' }], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 277
                },
                __self: this
              },
              _react2.default.createElement(_Icons.StackMenuSVG, { color: _radium2.default.getState(this.state, this.props.stateName + '-menu', ':hover') ? _Palette2.default.ROCK : _Palette2.default.ROCK_MUTED, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 282
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlUm93LmpzIl0sIm5hbWVzIjpbIlN0YXRlcyIsIlNUWUxFUyIsInN0YXRlV3JhcHBlciIsInBhZGRpbmciLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImJhY2tncm91bmRDb2xvciIsIkdSQVkiLCJkYXJrZW4iLCJjb2wiLCJ3aWR0aCIsImNvbDEiLCJtYXhXaWR0aCIsImNvbDIiLCJwb3NpdGlvbiIsInN0YXRlTWVudSIsInJpZ2h0IiwidHJhbnNmb3JtIiwianVzdGlmeUNvbnRlbnQiLCJoZWlnaHQiLCJjdXJzb3IiLCJwaWxsIiwiYm9yZGVyUmFkaXVzIiwibWF4SGVpZ2h0IiwicGlsbE5hbWUiLCJCTFVFIiwiZmxvYXQiLCJtYXJnaW5SaWdodCIsImNvbG9yIiwiUk9DSyIsInBpbGxWYWx1ZSIsImxpZ2h0ZW4iLCJvdmVyZmxvdyIsIm1hcmdpbkxlZnQiLCJtaW5IZWlnaHQiLCJpbnB1dCIsIkNPQUwiLCJXZWJraXRVc2VyU2VsZWN0IiwiZm9udFNpemUiLCJmb250RmFtaWx5IiwiYm9yZGVyIiwiTElHSFRFU1RfUElOSyIsImlucHV0MiIsImlzQmxhbmsiLCJzdHIiLCJ0ZXN0IiwiU3RhdGVSb3ciLCJwcm9wcyIsInN0YXRlIiwiaXNFZGl0aW5nIiwiaXNIb3ZlcmVkIiwibmFtZSIsImRlc2MiLCJ2YWx1ZVByZUVkaXQiLCJkaWRFc2NhcGUiLCJzZXRTdGF0ZSIsIm9yaWdpbmFsTmFtZSIsInN0YXRlTmFtZSIsInN0YXRlRGVzY3JpcHRvciIsInZhbHVlIiwibmV4dFByb3BzIiwiZXZlbnQiLCJzaWRlIiwia2V5Q29kZSIsImtleSIsInRyaW1tZWROYW1lIiwidGFyZ2V0IiwidHJpbSIsImF1dG9DYXN0VG9UeXBlIiwiaXNOZXciLCJjbG9zZU5ld1N0YXRlRm9ybSIsImRlbGV0ZVN0YXRlVmFsdWUiLCJjcmVhdGVOb3RpY2UiLCJ0eXBlIiwidGl0bGUiLCJtZXNzYWdlIiwic3VibWl0Q2hhbmdlcyIsImRpZFZhbHVlQ2hhbmdlIiwiZGlkTmFtZUNoYW5nZSIsInVwc2VydFN0YXRlVmFsdWUiLCJhdXRvU3RyaW5naWZ5IiwiZ2V0RGlzcGxheWFibGVTdGF0ZVZhbHVlIiwiZ2V0U3RhdGUiLCJST0NLX01VVEVEIiwiaGFuZGxlQ2hhbmdlIiwiZ2V0RWRpdGFibGVTdGF0ZVZhbHVlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxNOztBQUNaOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1DLFNBQVM7QUFDYkMsZ0JBQWM7QUFDWkMsYUFBUyxDQURHO0FBRVpDLGFBQVMsTUFGRztBQUdaQyxnQkFBWSxZQUhBO0FBSVosY0FBVTtBQUNSQyx1QkFBaUIscUJBQU0sa0JBQVFDLElBQWQsRUFBb0JDLE1BQXBCLENBQTJCLEdBQTNCO0FBRFQ7QUFKRSxHQUREO0FBU2JDLE9BQUs7QUFDSEwsYUFBUyxjQUROO0FBRUhNLFdBQU87QUFGSixHQVRRO0FBYWJDLFFBQU07QUFDSkMsY0FBVTtBQUROLEdBYk87QUFnQmJDLFFBQU07QUFDSkMsY0FBVTtBQUROLEdBaEJPO0FBbUJiQyxhQUFXO0FBQ1RMLFdBQU8sRUFERTtBQUVUSSxjQUFVLFVBRkQ7QUFHVEUsV0FBTyxDQUFDLENBSEM7QUFJVEMsZUFBVyxZQUpGO0FBS1RiLGFBQVMsTUFMQTtBQU1UQyxnQkFBWSxRQU5IO0FBT1RhLG9CQUFnQixRQVBQO0FBUVRDLFlBQVEsTUFSQztBQVNUQyxZQUFRLFNBVEM7QUFVVCxjQUFVO0FBVkQsR0FuQkU7QUErQmJDLFFBQU07QUFDSmxCLGFBQVMsU0FETDtBQUVKbUIsa0JBQWMsQ0FGVjtBQUdKQyxlQUFXLEVBSFA7QUFJSkgsWUFBUTtBQUpKLEdBL0JPO0FBcUNiSSxZQUFVO0FBQ1JsQixxQkFBaUIsa0JBQVFtQixJQURqQjtBQUVSQyxXQUFPLE9BRkM7QUFHUkMsaUJBQWEsQ0FITDtBQUlSQyxXQUFPLGtCQUFRQztBQUpQLEdBckNHO0FBMkNiQyxhQUFXO0FBQ1R4QixxQkFBaUIscUJBQU0sa0JBQVFDLElBQWQsRUFBb0J3QixPQUFwQixDQUE0QixJQUE1QixDQURSO0FBRVRDLGNBQVUsUUFGRDtBQUdUTixXQUFPLE1BSEU7QUFJVE8sZ0JBQVksQ0FKSDtBQUtUckIsY0FBVSxtQkFMRDtBQU1Uc0IsZUFBVztBQU5GLEdBM0NFO0FBbURiQyxTQUFPO0FBQ0w3QixxQkFBaUIsa0JBQVE4QixJQURwQjtBQUVMakMsYUFBUyxhQUZKO0FBR0xrQyxzQkFBa0IsTUFIYjtBQUlMakIsWUFBUSxNQUpIO0FBS0xRLFdBQU8sa0JBQVFDLElBTFY7QUFNTG5CLFdBQU8sa0JBTkY7QUFPTHdCLGVBQVcsRUFQTjtBQVFMSSxjQUFVLEVBUkw7QUFTTEMsZ0JBQVksV0FUUDtBQVVMQyxZQUFRLHVCQVZIO0FBV0wsY0FBVTtBQUNSQSxjQUFRLGVBQWUsa0JBQVFDO0FBRHZCO0FBWEwsR0FuRE07QUFrRWJDLFVBQVE7QUFDTmhDLFdBQU8sa0JBREQ7QUFFTnVCLGdCQUFZO0FBRk47QUFsRUssQ0FBZjs7QUF3RUEsU0FBU1UsT0FBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDckIsU0FBTyxTQUFRQyxJQUFSLENBQWFELEdBQWI7QUFBUDtBQUNEOztJQUVLRSxROzs7QUFDSixvQkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLG9IQUNaQSxLQURZOztBQUVsQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsaUJBQVcsS0FEQTtBQUVYQyxpQkFBVyxLQUZBO0FBR1hDLFlBQU0sSUFISztBQUlYQyxZQUFNLElBSks7QUFLWEMsb0JBQWMsSUFMSDtBQU1YQyxpQkFBVztBQU5BLEtBQWI7QUFGa0I7QUFVbkI7Ozs7d0NBRW9CO0FBQ25CLFdBQUtDLFFBQUwsQ0FBYztBQUNaQyxzQkFBYyxLQUFLVCxLQUFMLENBQVdVLFNBRGI7QUFFWk4sY0FBTSxLQUFLSixLQUFMLENBQVdVLFNBRkw7QUFHWkwsY0FBTSxLQUFLTCxLQUFMLENBQVdXLGVBSEw7QUFJWkwsc0JBQWMsS0FBS04sS0FBTCxDQUFXVyxlQUFYLENBQTJCQztBQUo3QixPQUFkO0FBTUQ7Ozs4Q0FFMEJDLFMsRUFBVztBQUNwQyxXQUFLTCxRQUFMLENBQWM7QUFDWkMsc0JBQWNJLFVBQVVILFNBRFo7QUFFWk4sY0FBTVMsVUFBVUgsU0FGSjtBQUdaTCxjQUFNUSxVQUFVRixlQUhKO0FBSVpMLHNCQUFjTyxVQUFVRixlQUFWLENBQTBCQztBQUo1QixPQUFkO0FBTUQ7OztpQ0FFYUUsSyxFQUFPQyxJLEVBQU07QUFBQTs7QUFDekIsVUFBSUQsTUFBTUUsT0FBTixLQUFrQixFQUF0QixFQUEwQjtBQUFFO0FBQzFCLGVBQU8sS0FBS1IsUUFBTCxDQUFjLEVBQUNOLFdBQVcsS0FBWixFQUFtQkssV0FBVyxJQUE5QixFQUFkLENBQVA7QUFDRDs7QUFFRCxVQUFJRixPQUFPLEtBQUtKLEtBQUwsQ0FBV0ksSUFBdEI7O0FBRUE7QUFDQTtBQUNBLFVBQUlTLE1BQU1HLEdBQU4sS0FBYyxPQUFsQixFQUEyQjtBQUN6QixZQUFJRixTQUFTLE1BQWIsRUFBcUI7QUFDbkIsY0FBSUcsY0FBY0osTUFBTUssTUFBTixDQUFhUCxLQUFiLENBQW1CUSxJQUFuQixFQUFsQjtBQUNBLGVBQUtaLFFBQUwsQ0FBYyxFQUFFSixNQUFNYyxXQUFSLEVBQWQ7QUFDRCxTQUhELE1BR087QUFBRTtBQUNQYixlQUFLTyxLQUFMLEdBQWFFLE1BQU1LLE1BQU4sQ0FBYVAsS0FBYixDQUFtQlEsSUFBbkIsRUFBYjtBQUNBLGVBQUtaLFFBQUwsQ0FBYyxFQUFDSCxVQUFELEVBQWQ7QUFDRDtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQUEsYUFBT3BELE9BQU9vRSxjQUFQLENBQXNCaEIsSUFBdEIsQ0FBUDs7QUFFQTtBQUNBLFVBQUlULFFBQVEsS0FBS0ssS0FBTCxDQUFXRyxJQUFuQixDQUFKLEVBQThCO0FBQzVCLFlBQUksS0FBS0osS0FBTCxDQUFXc0IsS0FBZixFQUFzQjtBQUNwQixpQkFBTyxLQUFLdEIsS0FBTCxDQUFXdUIsaUJBQVgsRUFBUDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLEtBQUt2QixLQUFMLENBQVd3QixnQkFBWCxDQUE0QixLQUFLdkIsS0FBTCxDQUFXUSxZQUF2QyxFQUFxRCxZQUFNO0FBQ2hFLG1CQUFPLE9BQUtELFFBQUwsQ0FBYyxFQUFDTixXQUFXLEtBQVosRUFBZCxDQUFQO0FBQ0QsV0FGTSxDQUFQO0FBR0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUlOLFFBQVFTLEtBQUtPLEtBQWIsS0FBdUJoQixRQUFRLEtBQUtLLEtBQUwsQ0FBV0csSUFBbkIsQ0FBM0IsRUFBcUQ7QUFDbkQsWUFBSVIsUUFBUSxLQUFLSyxLQUFMLENBQVdHLElBQW5CLENBQUosRUFBOEI7QUFDNUIsaUJBQU8sS0FBS0osS0FBTCxDQUFXeUIsWUFBWCxDQUF3QjtBQUM3QkMsa0JBQU0sU0FEdUI7QUFFN0JDLG1CQUFPLE9BRnNCO0FBRzdCQyxxQkFBUztBQUhvQixXQUF4QixDQUFQO0FBS0Q7O0FBRUQ7QUFDQSxZQUFJLENBQUMsd0JBQXdCOUIsSUFBeEIsQ0FBNkIsS0FBS0csS0FBTCxDQUFXRyxJQUF4QyxDQUFMLEVBQW9EO0FBQ2xELGlCQUFPLEtBQUtKLEtBQUwsQ0FBV3lCLFlBQVgsQ0FBd0I7QUFDN0JDLGtCQUFNLFNBRHVCO0FBRTdCQyxtQkFBTyxPQUZzQjtBQUc3QkMscUJBQVM7QUFIb0IsV0FBeEIsQ0FBUDtBQUtEOztBQUVELFlBQUloQyxRQUFRUyxLQUFLTyxLQUFiLENBQUosRUFBeUI7QUFDdkI7QUFDRDs7QUFFRCxhQUFLSixRQUFMLENBQWMsRUFBQ0gsVUFBRCxFQUFPRCxNQUFNLEtBQUtILEtBQUwsQ0FBV0csSUFBeEIsRUFBZCxFQUE2QyxZQUFNO0FBQ2pELGlCQUFLeUIsYUFBTDtBQUNBLGNBQUksT0FBSzdCLEtBQUwsQ0FBV3NCLEtBQWYsRUFBc0IsT0FBS3RCLEtBQUwsQ0FBV3VCLGlCQUFYO0FBQ3RCLGlCQUFPLE9BQUtmLFFBQUwsQ0FBYyxFQUFDTixXQUFXLEtBQVosRUFBZCxDQUFQO0FBQ0QsU0FKRDtBQUtELE9BM0JELE1BMkJPO0FBQUU7QUFDUCxhQUFLTSxRQUFMLENBQWMsRUFBQ0gsVUFBRCxFQUFPRCxNQUFNLEtBQUtILEtBQUwsQ0FBV0csSUFBeEIsRUFBZCxFQUE2QyxZQUFNO0FBQ2pELGlCQUFLeUIsYUFBTDtBQUNBLGNBQUksT0FBSzdCLEtBQUwsQ0FBV3NCLEtBQWYsRUFBc0IsT0FBS3RCLEtBQUwsQ0FBV3VCLGlCQUFYO0FBQ3RCLGlCQUFLZixRQUFMLENBQWMsRUFBQ04sV0FBVyxLQUFaLEVBQWQ7QUFDRCxTQUpEO0FBS0Q7QUFDRjs7O29DQUVnQjtBQUFBOztBQUNmLFVBQU00QixpQkFBaUIsS0FBSzdCLEtBQUwsQ0FBV0ksSUFBWCxDQUFnQk8sS0FBaEIsS0FBMEIsS0FBS1gsS0FBTCxDQUFXSyxZQUE1RDtBQUNBLFVBQU15QixnQkFBZ0IsS0FBSzlCLEtBQUwsQ0FBV0csSUFBWCxLQUFvQixLQUFLSixLQUFMLENBQVdVLFNBQXJEOztBQUVBLFVBQUlxQixpQkFBaUJELGNBQXJCLEVBQXFDO0FBQ25DLGVBQU8sS0FBSzlCLEtBQUwsQ0FBV3dCLGdCQUFYLENBQTRCLEtBQUt4QixLQUFMLENBQVdVLFNBQXZDLEVBQWtELFlBQU07QUFDN0QsaUJBQU8sT0FBS1YsS0FBTCxDQUFXZ0MsZ0JBQVgsQ0FBNEIsT0FBSy9CLEtBQUwsQ0FBV0csSUFBdkMsRUFBNkMsT0FBS0gsS0FBTCxDQUFXSSxJQUF4RCxFQUE4RCxZQUFNO0FBQ3pFLG1CQUFLRyxRQUFMLENBQWMsRUFBRU4sV0FBVyxLQUFiLEVBQWQ7QUFDRCxXQUZNLENBQVA7QUFHRCxTQUpNLENBQVA7QUFLRCxPQU5ELE1BTU8sSUFBSTZCLGFBQUosRUFBbUI7QUFDeEIsZUFBTyxLQUFLL0IsS0FBTCxDQUFXd0IsZ0JBQVgsQ0FBNEIsS0FBS3hCLEtBQUwsQ0FBV1UsU0FBdkMsRUFBa0QsWUFBTTtBQUM3RCxpQkFBTyxPQUFLVixLQUFMLENBQVdnQyxnQkFBWCxDQUE0QixPQUFLL0IsS0FBTCxDQUFXRyxJQUF2QyxFQUE2QyxPQUFLSCxLQUFMLENBQVdJLElBQXhELEVBQThELFlBQU07QUFDekUsbUJBQUtHLFFBQUwsQ0FBYyxFQUFFTixXQUFXLEtBQWIsRUFBZDtBQUNELFdBRk0sQ0FBUDtBQUdELFNBSk0sQ0FBUDtBQUtELE9BTk0sTUFNQSxJQUFJNEIsY0FBSixFQUFvQjtBQUN6QixlQUFPLEtBQUs5QixLQUFMLENBQVdnQyxnQkFBWCxDQUE0QixLQUFLL0IsS0FBTCxDQUFXRyxJQUF2QyxFQUE2QyxLQUFLSCxLQUFMLENBQVdJLElBQXhELEVBQThELFlBQU07QUFDekUsaUJBQUtHLFFBQUwsQ0FBYyxFQUFFTixXQUFXLEtBQWIsRUFBZDtBQUNELFNBRk0sQ0FBUDtBQUdEO0FBQ0Y7Ozt5Q0FFcUI7QUFDcEIsVUFBSSxLQUFLRixLQUFMLENBQVdzQixLQUFmLEVBQXNCLE9BQU8sS0FBS3RCLEtBQUwsQ0FBV3VCLGlCQUFYLEVBQVA7QUFDdEIsV0FBS00sYUFBTDtBQUNEOzs7NENBRXdCO0FBQ3ZCLFVBQUksS0FBSzVCLEtBQUwsQ0FBV0ksSUFBZixFQUFxQjtBQUNuQixlQUFPcEQsT0FBT2dGLGFBQVAsQ0FBcUIsS0FBS2hDLEtBQUwsQ0FBV0ksSUFBaEMsQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJLEtBQUtMLEtBQUwsQ0FBV1csZUFBZixFQUFnQztBQUNyQyxlQUFPMUQsT0FBT2dGLGFBQVAsQ0FBcUIsS0FBS2pDLEtBQUwsQ0FBV1csZUFBaEMsQ0FBUDtBQUNELE9BRk0sTUFFQTtBQUNMLGVBQU8sRUFBUDtBQUNEO0FBQ0Y7OzsrQ0FFMkI7QUFDMUIsVUFBSSxLQUFLVixLQUFMLENBQVdLLFlBQWYsRUFBNkI7QUFDM0IsZUFBT3JELE9BQU9nRixhQUFQLENBQXFCLEVBQUVyQixPQUFPLEtBQUtYLEtBQUwsQ0FBV0ssWUFBcEIsRUFBckIsQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJLEtBQUtOLEtBQUwsQ0FBV1csZUFBZixFQUFnQztBQUNyQyxlQUFPMUQsT0FBT2dGLGFBQVAsQ0FBcUIsS0FBS2pDLEtBQUwsQ0FBV1csZUFBaEMsQ0FBUDtBQUNELE9BRk0sTUFFQTtBQUNMLGVBQU8sRUFBUDtBQUNEO0FBQ0Y7Ozs2QkFFUztBQUFBOztBQUNSLGFBQ0U7QUFBQTtBQUFBLFVBQU0sS0FBUSxLQUFLWCxLQUFMLENBQVdVLFNBQW5CLFdBQU47QUFDRSx1QkFBYTtBQUFBLG1CQUFNLE9BQUtGLFFBQUwsQ0FBYyxFQUFDTCxXQUFXLElBQVosRUFBZCxDQUFOO0FBQUEsV0FEZjtBQUVFLHNCQUFZO0FBQUEsbUJBQU0sT0FBS0ssUUFBTCxDQUFjLEVBQUNMLFdBQVcsS0FBWixFQUFkLENBQU47QUFBQSxXQUZkO0FBR0UseUJBQWU7QUFBQSxtQkFBTSxPQUFLSyxRQUFMLENBQWMsRUFBQ04sV0FBVyxJQUFaLEVBQWtCSyxXQUFXLEtBQTdCLEVBQWQsQ0FBTjtBQUFBLFdBSGpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlHLFNBQUMsS0FBS04sS0FBTCxDQUFXQyxTQUFaLElBQXlCLENBQUMsS0FBS0YsS0FBTCxDQUFXc0IsS0FBckMsR0FDRztBQUFBO0FBQUEsWUFBSyxPQUFPcEUsT0FBT0MsWUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLGNBQUssT0FBTyxDQUFDRCxPQUFPUSxHQUFSLEVBQWFSLE9BQU9VLElBQXBCLENBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGdCQUFNLEtBQVEsS0FBS29DLEtBQUwsQ0FBV1UsU0FBbkIsVUFBTjtBQUNFLHVCQUFPLENBQUN4RCxPQUFPb0IsSUFBUixFQUFjcEIsT0FBT3VCLFFBQXJCLENBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUcsbUJBQUt1QixLQUFMLENBQVdVO0FBRmQ7QUFERixXQURBO0FBT0E7QUFBQTtBQUFBLGNBQUssT0FBTyxDQUFDeEQsT0FBT1EsR0FBUixFQUFhUixPQUFPWSxJQUFwQixDQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxnQkFBTSxLQUFRLEtBQUtrQyxLQUFMLENBQVdVLFNBQW5CLFdBQU47QUFDRSx1QkFBTyxDQUFDeEQsT0FBT29CLElBQVIsRUFBY3BCLE9BQU82QixTQUFyQixDQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVHLG1CQUFLbUQsd0JBQUw7QUFGSCxhQURGO0FBS0U7QUFBQTtBQUFBLGdCQUFNLEtBQVEsS0FBS2xDLEtBQUwsQ0FBV1UsU0FBbkIsVUFBTjtBQUNFLHVCQUFPLENBQ0x4RCxPQUFPYyxTQURGLEVBRUwsQ0FBQyxDQUFDLEtBQUtpQyxLQUFMLENBQVdFLFNBQVosSUFBeUIsSUFBMUIsS0FBbUMsRUFBQzlDLFNBQVMsTUFBVixDQUFrQjtBQUFsQixpQkFGOUIsQ0FEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLRSxtRUFBYyxPQUFPLGlCQUFPOEUsUUFBUCxDQUFnQixLQUFLbEMsS0FBckIsRUFBK0IsS0FBS0QsS0FBTCxDQUFXVSxTQUExQyxZQUE0RCxRQUE1RCxJQUF3RSxrQkFBUTVCLElBQWhGLEdBQXVGLGtCQUFRc0QsVUFBcEg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEY7QUFMRjtBQVBBLFNBREgsR0FzQkc7QUFBQTtBQUFBLFlBQUssT0FBT2xGLE9BQU9DLFlBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxjQUFLLE9BQU8sQ0FBQ0QsT0FBT1EsR0FBUixFQUFhUixPQUFPWSxJQUFwQixDQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLHFEQUFPLEtBQVEsS0FBS2tDLEtBQUwsQ0FBV1UsU0FBbkIsVUFBUDtBQUNFLG1CQUFJLE1BRE47QUFFRSxxQkFBTyxDQUFDeEQsT0FBT29CLElBQVIsRUFBY3BCLE9BQU9rQyxLQUFyQixDQUZUO0FBR0UsNEJBQWMsS0FBS1ksS0FBTCxDQUFXVSxTQUgzQjtBQUlFLHVCQUFTLGlCQUFDSSxLQUFEO0FBQUEsdUJBQVcsT0FBS3VCLFlBQUwsQ0FBa0J2QixLQUFsQixFQUF5QixNQUF6QixDQUFYO0FBQUEsZUFKWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERixXQURBO0FBUUE7QUFBQTtBQUFBLGNBQUssT0FBTyxDQUFDNUQsT0FBT1EsR0FBUixFQUFhUixPQUFPWSxJQUFwQixDQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLHFEQUFPLEtBQVEsS0FBS2tDLEtBQUwsQ0FBV1UsU0FBbkIsV0FBUDtBQUNFLG1CQUFJLE9BRE47QUFFRSxxQkFBTyxDQUFDeEQsT0FBT29CLElBQVIsRUFBY3BCLE9BQU9rQyxLQUFyQixFQUE0QmxDLE9BQU95QyxNQUFuQyxDQUZUO0FBR0UsNEJBQWMsS0FBSzJDLHFCQUFMLEVBSGhCO0FBSUUsdUJBQVMsaUJBQUN4QixLQUFEO0FBQUEsdUJBQVcsT0FBS3VCLFlBQUwsQ0FBa0J2QixLQUFsQixFQUF5QixPQUF6QixDQUFYO0FBQUEsZUFKWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FERjtBQU1FO0FBQUE7QUFBQSxnQkFBTSxLQUFRLEtBQUtkLEtBQUwsQ0FBV1UsU0FBbkIsVUFBTjtBQUNFLHVCQUFPLENBQ0x4RCxPQUFPYyxTQURGLEVBRUwsQ0FBQyxpQkFBT21FLFFBQVAsQ0FBZ0IsS0FBS2xDLEtBQXJCLEVBQStCLEtBQUtELEtBQUwsQ0FBV1UsU0FBMUMsYUFBNkQsUUFBN0QsQ0FBRCxJQUEyRSxFQUFDckQsU0FBUyxNQUFWLEVBRnRFLENBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0UsbUVBQWMsT0FBTyxpQkFBTzhFLFFBQVAsQ0FBZ0IsS0FBS2xDLEtBQXJCLEVBQStCLEtBQUtELEtBQUwsQ0FBV1UsU0FBMUMsWUFBNEQsUUFBNUQsSUFBd0Usa0JBQVE1QixJQUFoRixHQUF1RixrQkFBUXNELFVBQXBIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGO0FBTkY7QUFSQTtBQTFCTixPQURGO0FBcUREOzs7O0VBNU1vQixnQkFBTUcsUzs7a0JBK01kLG1DQUFlLHNCQUFPeEMsUUFBUCxDQUFmLEMiLCJmaWxlIjoiU3RhdGVSb3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBvbkNsaWNrT3V0c2lkZSBmcm9tICdyZWFjdC1vbmNsaWNrb3V0c2lkZSdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCAqIGFzIFN0YXRlcyBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvU3RhdGVzJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi4vUGFsZXR0ZSdcbmltcG9ydCB7IFN0YWNrTWVudVNWRyB9IGZyb20gJy4uL0ljb25zJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHN0YXRlV3JhcHBlcjoge1xuICAgIHBhZGRpbmc6IDYsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdmbGV4LXN0YXJ0JyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkdSQVkpLmRhcmtlbigwLjEpXG4gICAgfVxuICB9LFxuICBjb2w6IHtcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICB3aWR0aDogJzUwJSdcbiAgfSxcbiAgY29sMToge1xuICAgIG1heFdpZHRoOiAxNDVcbiAgfSxcbiAgY29sMjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gIH0sXG4gIHN0YXRlTWVudToge1xuICAgIHdpZHRoOiAxMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICByaWdodDogLTMsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4zKScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAnOmhvdmVyJzoge31cbiAgfSxcbiAgcGlsbDoge1xuICAgIHBhZGRpbmc6ICcycHggNXB4JyxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgbWF4SGVpZ2h0OiAyMSxcbiAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICB9LFxuICBwaWxsTmFtZToge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5CTFVFLFxuICAgIGZsb2F0OiAncmlnaHQnLFxuICAgIG1hcmdpblJpZ2h0OiA0LFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tcbiAgfSxcbiAgcGlsbFZhbHVlOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkdSQVkpLmxpZ2h0ZW4oMC4xNyksXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgbWFyZ2luTGVmdDogNCxcbiAgICBtYXhXaWR0aDogJ2NhbGMoMTAwJSAtIDEycHgpJyxcbiAgICBtaW5IZWlnaHQ6IDIyXG4gIH0sXG4gIGlucHV0OiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgcGFkZGluZzogJzRweCA1cHggM3B4JyxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnYXV0bycsXG4gICAgY3Vyc29yOiAndGV4dCcsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICB3aWR0aDogJ2NhbGMoMTAwJSAtIDRweCknLFxuICAgIG1pbkhlaWdodDogMjIsXG4gICAgZm9udFNpemU6IDEyLFxuICAgIGZvbnRGYW1pbHk6ICdGaXJhIFNhbnMnLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgJzpmb2N1cyc6IHtcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgfVxuICB9LFxuICBpbnB1dDI6IHtcbiAgICB3aWR0aDogJ2NhbGMoMTAwJSAtIDhweCknLFxuICAgIG1hcmdpbkxlZnQ6IDRcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0JsYW5rIChzdHIpIHtcbiAgcmV0dXJuIC9eXFxzKiQvLnRlc3Qoc3RyKVxufVxuXG5jbGFzcyBTdGF0ZVJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0VkaXRpbmc6IGZhbHNlLFxuICAgICAgaXNIb3ZlcmVkOiBmYWxzZSxcbiAgICAgIG5hbWU6IG51bGwsXG4gICAgICBkZXNjOiBudWxsLFxuICAgICAgdmFsdWVQcmVFZGl0OiBudWxsLFxuICAgICAgZGlkRXNjYXBlOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG9yaWdpbmFsTmFtZTogdGhpcy5wcm9wcy5zdGF0ZU5hbWUsXG4gICAgICBuYW1lOiB0aGlzLnByb3BzLnN0YXRlTmFtZSxcbiAgICAgIGRlc2M6IHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yLFxuICAgICAgdmFsdWVQcmVFZGl0OiB0aGlzLnByb3BzLnN0YXRlRGVzY3JpcHRvci52YWx1ZVxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG9yaWdpbmFsTmFtZTogbmV4dFByb3BzLnN0YXRlTmFtZSxcbiAgICAgIG5hbWU6IG5leHRQcm9wcy5zdGF0ZU5hbWUsXG4gICAgICBkZXNjOiBuZXh0UHJvcHMuc3RhdGVEZXNjcmlwdG9yLFxuICAgICAgdmFsdWVQcmVFZGl0OiBuZXh0UHJvcHMuc3RhdGVEZXNjcmlwdG9yLnZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZSAoZXZlbnQsIHNpZGUpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMjcpIHsgLy8gZXNjIGtleVxuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2UsIGRpZEVzY2FwZTogdHJ1ZX0pXG4gICAgfVxuXG4gICAgbGV0IGRlc2MgPSB0aGlzLnN0YXRlLmRlc2NcblxuICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBpbnB1dHMgaW4gdGhlIFVJIGlmIHRoZSB1c2VyIGRpZG4ndCBwcmVzcyBSZXR1cm5cbiAgICAvLyBIZXJlIHdlJ3JlIG9ubHkgdXBkYXRpbmcgdGhlIHZpZXcgc3RhdGUsIHdlIGhhdmVuJ3QgY29tbWl0dGVkIGFueXRoaW5nIHlldFxuICAgIGlmIChldmVudC5rZXkgIT09ICdFbnRlcicpIHtcbiAgICAgIGlmIChzaWRlID09PSAnbmFtZScpIHtcbiAgICAgICAgbGV0IHRyaW1tZWROYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlLnRyaW0oKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgbmFtZTogdHJpbW1lZE5hbWUgfSlcbiAgICAgIH0gZWxzZSB7IC8vIFVwZGF0ZSB0aGUgdmFsdWVcbiAgICAgICAgZGVzYy52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZS50cmltKClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGVzY30pXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBnb3QgaGVyZSwgRW50ZXIgd2FzIHByZXNzZWQsIG1lYW5pbmcgd2Ugd2FudCB0byBjb21taXQgdGhlIHN0YXRlIHZhbHVlL25hbWVcbiAgICBkZXNjID0gU3RhdGVzLmF1dG9DYXN0VG9UeXBlKGRlc2MpXG5cbiAgICAvLyBJZiB0aGUgbmFtZSBmaWVsZCBpcyBibGFuaywgZGVsZXRlIHRoZSBzdGF0ZSAob3IganVzdCByZW1vdmUgaXQgaWYgaXQgaXMgbmV3KVxuICAgIGlmIChpc0JsYW5rKHRoaXMuc3RhdGUubmFtZSkpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmlzTmV3KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNsb3NlTmV3U3RhdGVGb3JtKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmRlbGV0ZVN0YXRlVmFsdWUodGhpcy5zdGF0ZS5vcmlnaW5hbE5hbWUsICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiBmYWxzZX0pXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgbWFkZSBpdCB0aGlzIGZhciwgYXQgbGVhc3Qgb25lIG9mIHRoZSBmaWVsZHMgaXMgTk9UIGJsYW5rLCBhbmQgd2UgY2FuIGF0dGVtcHQgYSBzdWJtaXRcbiAgICBpZiAoaXNCbGFuayhkZXNjLnZhbHVlKSB8fCBpc0JsYW5rKHRoaXMuc3RhdGUubmFtZSkpIHtcbiAgICAgIGlmIChpc0JsYW5rKHRoaXMuc3RhdGUubmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0eXBlOiAnd2FybmluZycsXG4gICAgICAgICAgdGl0bGU6ICdTb3JyeScsXG4gICAgICAgICAgbWVzc2FnZTogJ1N0YXRlIG5hbWVzIGNhbm5vdCBiZSBibGFuaydcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gRm9yIG5vdywgb25seSBzdXBwb3J0IFVTIEFTQ0lJIGNoYXJzIHRoYXQgd291bGQgYmUgdmFsaWQgYXMgYSBKYXZhU2NyaXB0IGlkZW50aWZpZXJcbiAgICAgIGlmICghL15bJEEtWl9dWzAtOUEtWl8kXSokL2kudGVzdCh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnU29ycnknLFxuICAgICAgICAgIG1lc3NhZ2U6ICdTdGF0ZSBuYW1lcyBjYW5ub3QgaGF2ZSBzcGFjZXMgb3Igc3BlY2lhbCBjaGFyYWN0ZXJzLCBhbmQgbXVzdCBiZWdpbiB3aXRoIGEgbGV0dGVyJ1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNCbGFuayhkZXNjLnZhbHVlKSkge1xuICAgICAgICAvLyBUT0RPOiBOb3Qgc3VyZSBpZiB3ZSB3YW50IHRvIHNldCB0aGlzIGFzIG51bGwgb3Igbm90XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rlc2MsIG5hbWU6IHRoaXMuc3RhdGUubmFtZX0sICgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRDaGFuZ2VzKClcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNOZXcpIHRoaXMucHJvcHMuY2xvc2VOZXdTdGF0ZUZvcm0oKVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7aXNFZGl0aW5nOiBmYWxzZX0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7IC8vIG5laXRoZXIgd2VyZSBibGFua1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZGVzYywgbmFtZTogdGhpcy5zdGF0ZS5uYW1lfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLnN1Ym1pdENoYW5nZXMoKVxuICAgICAgICBpZiAodGhpcy5wcm9wcy5pc05ldykgdGhpcy5wcm9wcy5jbG9zZU5ld1N0YXRlRm9ybSgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBzdWJtaXRDaGFuZ2VzICgpIHtcbiAgICBjb25zdCBkaWRWYWx1ZUNoYW5nZSA9IHRoaXMuc3RhdGUuZGVzYy52YWx1ZSAhPT0gdGhpcy5zdGF0ZS52YWx1ZVByZUVkaXRcbiAgICBjb25zdCBkaWROYW1lQ2hhbmdlID0gdGhpcy5zdGF0ZS5uYW1lICE9PSB0aGlzLnByb3BzLnN0YXRlTmFtZVxuXG4gICAgaWYgKGRpZE5hbWVDaGFuZ2UgJiYgZGlkVmFsdWVDaGFuZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmRlbGV0ZVN0YXRlVmFsdWUodGhpcy5wcm9wcy5zdGF0ZU5hbWUsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBzZXJ0U3RhdGVWYWx1ZSh0aGlzLnN0YXRlLm5hbWUsIHRoaXMuc3RhdGUuZGVzYywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc0VkaXRpbmc6IGZhbHNlIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoZGlkTmFtZUNoYW5nZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMuZGVsZXRlU3RhdGVWYWx1ZSh0aGlzLnByb3BzLnN0YXRlTmFtZSwgKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy51cHNlcnRTdGF0ZVZhbHVlKHRoaXMuc3RhdGUubmFtZSwgdGhpcy5zdGF0ZS5kZXNjLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzRWRpdGluZzogZmFsc2UgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChkaWRWYWx1ZUNoYW5nZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBzZXJ0U3RhdGVWYWx1ZSh0aGlzLnN0YXRlLm5hbWUsIHRoaXMuc3RhdGUuZGVzYywgKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNFZGl0aW5nOiBmYWxzZSB9KVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVDbGlja091dHNpZGUgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmlzTmV3KSByZXR1cm4gdGhpcy5wcm9wcy5jbG9zZU5ld1N0YXRlRm9ybSgpXG4gICAgdGhpcy5zdWJtaXRDaGFuZ2VzKClcbiAgfVxuXG4gIGdldEVkaXRhYmxlU3RhdGVWYWx1ZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZGVzYykge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHRoaXMuc3RhdGUuZGVzYylcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yKSB7XG4gICAgICByZXR1cm4gU3RhdGVzLmF1dG9TdHJpbmdpZnkodGhpcy5wcm9wcy5zdGF0ZURlc2NyaXB0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldERpc3BsYXlhYmxlU3RhdGVWYWx1ZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmFsdWVQcmVFZGl0KSB7XG4gICAgICByZXR1cm4gU3RhdGVzLmF1dG9TdHJpbmdpZnkoeyB2YWx1ZTogdGhpcy5zdGF0ZS52YWx1ZVByZUVkaXQgfSlcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yKSB7XG4gICAgICByZXR1cm4gU3RhdGVzLmF1dG9TdHJpbmdpZnkodGhpcy5wcm9wcy5zdGF0ZURlc2NyaXB0b3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LXN0YXRlYH1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0U3RhdGUoe2lzSG92ZXJlZDogdHJ1ZX0pfVxuICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFN0YXRlKHtpc0hvdmVyZWQ6IGZhbHNlfSl9XG4gICAgICAgIG9uRG91YmxlQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogdHJ1ZSwgZGlkRXNjYXBlOiBmYWxzZX0pfT5cbiAgICAgICAgeyF0aGlzLnN0YXRlLmlzRWRpdGluZyAmJiAhdGhpcy5wcm9wcy5pc05ld1xuICAgICAgICAgID8gPGRpdiBzdHlsZT17U1RZTEVTLnN0YXRlV3JhcHBlcn0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmNvbCwgU1RZTEVTLmNvbDFdfT5cbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tbmFtZWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMucGlsbCwgU1RZTEVTLnBpbGxOYW1lXX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdGVOYW1lfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuY29sLCBTVFlMRVMuY29sMl19PlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS12YWx1ZWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMucGlsbCwgU1RZTEVTLnBpbGxWYWx1ZV19PlxuICAgICAgICAgICAgICAgIHt0aGlzLmdldERpc3BsYXlhYmxlU3RhdGVWYWx1ZSgpfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LW1lbnVgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtbXG4gICAgICAgICAgICAgICAgICBTVFlMRVMuc3RhdGVNZW51LFxuICAgICAgICAgICAgICAgICAgKCF0aGlzLnN0YXRlLmlzSG92ZXJlZCB8fCB0cnVlKSAmJiB7ZGlzcGxheTogJ25vbmUnfSAvLyBUT0RPOiByZW1vdmUgdGhpcyAnfHwgdHJ1ZScgdG8gc2hvdyBzdGFjayBtZW51IG9uIGhvdmVyIGFuZCBjcmVhdGUgcG9wb3ZlclxuICAgICAgICAgICAgICAgIF19PlxuICAgICAgICAgICAgICAgIDxTdGFja01lbnVTVkcgY29sb3I9e1JhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tbWVudWAsICc6aG92ZXInKSA/IFBhbGV0dGUuUk9DSyA6IFBhbGV0dGUuUk9DS19NVVRFRH0gLz5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgOiA8ZGl2IHN0eWxlPXtTVFlMRVMuc3RhdGVXcmFwcGVyfT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuY29sLCBTVFlMRVMuY29sMl19PlxuICAgICAgICAgICAgICA8aW5wdXQga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tbmFtZWB9XG4gICAgICAgICAgICAgICAgcmVmPSduYW1lJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLnBpbGwsIFNUWUxFUy5pbnB1dF19XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLnByb3BzLnN0YXRlTmFtZX1cbiAgICAgICAgICAgICAgICBvbktleVVwPXsoZXZlbnQpID0+IHRoaXMuaGFuZGxlQ2hhbmdlKGV2ZW50LCAnbmFtZScpfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmNvbCwgU1RZTEVTLmNvbDJdfT5cbiAgICAgICAgICAgICAgPGlucHV0IGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LXZhbHVlYH1cbiAgICAgICAgICAgICAgICByZWY9J3ZhbHVlJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXtbU1RZTEVTLnBpbGwsIFNUWUxFUy5pbnB1dCwgU1RZTEVTLmlucHV0Ml19XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlPXt0aGlzLmdldEVkaXRhYmxlU3RhdGVWYWx1ZSgpfVxuICAgICAgICAgICAgICAgIG9uS2V5VXA9eyhldmVudCkgPT4gdGhpcy5oYW5kbGVDaGFuZ2UoZXZlbnQsICd2YWx1ZScpfSAvPlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS1tZW51YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgICAgICAgU1RZTEVTLnN0YXRlTWVudSxcbiAgICAgICAgICAgICAgICAgICFSYWRpdW0uZ2V0U3RhdGUodGhpcy5zdGF0ZSwgYCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LXN0YXRlYCwgJzpob3ZlcicpICYmIHtkaXNwbGF5OiAnbm9uZSd9XG4gICAgICAgICAgICAgICAgXX0+XG4gICAgICAgICAgICAgICAgPFN0YWNrTWVudVNWRyBjb2xvcj17UmFkaXVtLmdldFN0YXRlKHRoaXMuc3RhdGUsIGAke3RoaXMucHJvcHMuc3RhdGVOYW1lfS1tZW51YCwgJzpob3ZlcicpID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEfSAvPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgfVxuICAgICAgPC9mb3JtPlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvbkNsaWNrT3V0c2lkZShSYWRpdW0oU3RhdGVSb3cpKVxuIl19