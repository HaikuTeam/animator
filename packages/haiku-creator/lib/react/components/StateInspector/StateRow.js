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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlUm93LmpzIl0sIm5hbWVzIjpbIlN0YXRlcyIsIlNUWUxFUyIsInN0YXRlV3JhcHBlciIsInBhZGRpbmciLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImJhY2tncm91bmRDb2xvciIsIkdSQVkiLCJkYXJrZW4iLCJjb2wiLCJ3aWR0aCIsImNvbDEiLCJtYXhXaWR0aCIsImNvbDIiLCJwb3NpdGlvbiIsInN0YXRlTWVudSIsInJpZ2h0IiwidHJhbnNmb3JtIiwianVzdGlmeUNvbnRlbnQiLCJoZWlnaHQiLCJjdXJzb3IiLCJwaWxsIiwiYm9yZGVyUmFkaXVzIiwibWF4SGVpZ2h0IiwicGlsbE5hbWUiLCJCTFVFIiwiZmxvYXQiLCJtYXJnaW5SaWdodCIsImNvbG9yIiwiUk9DSyIsInBpbGxWYWx1ZSIsImxpZ2h0ZW4iLCJvdmVyZmxvdyIsIm1hcmdpbkxlZnQiLCJtaW5IZWlnaHQiLCJpbnB1dCIsIkNPQUwiLCJXZWJraXRVc2VyU2VsZWN0IiwiZm9udFNpemUiLCJmb250RmFtaWx5IiwiYm9yZGVyIiwiTElHSFRFU1RfUElOSyIsImlucHV0MiIsImlzQmxhbmsiLCJzdHIiLCJ0ZXN0IiwiU3RhdGVSb3ciLCJwcm9wcyIsInN0YXRlIiwiaXNFZGl0aW5nIiwiaXNIb3ZlcmVkIiwibmFtZSIsImRlc2MiLCJ2YWx1ZVByZUVkaXQiLCJkaWRFc2NhcGUiLCJzZXRTdGF0ZSIsIm9yaWdpbmFsTmFtZSIsInN0YXRlTmFtZSIsInN0YXRlRGVzY3JpcHRvciIsInZhbHVlIiwibmV4dFByb3BzIiwiZXZlbnQiLCJzaWRlIiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwidmFsdWVJbnB1dCIsImZvY3VzIiwibmFtZUlucHV0Iiwia2V5IiwidHJpbW1lZE5hbWUiLCJ0YXJnZXQiLCJ0cmltIiwiYXV0b0Nhc3RUb1R5cGUiLCJpc05ldyIsImNsb3NlTmV3U3RhdGVGb3JtIiwiZGVsZXRlU3RhdGVWYWx1ZSIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJzdWJtaXRDaGFuZ2VzIiwiZGlkVmFsdWVDaGFuZ2UiLCJkaWROYW1lQ2hhbmdlIiwidXBzZXJ0U3RhdGVWYWx1ZSIsImF1dG9TdHJpbmdpZnkiLCJkdW1teUVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsIm1heWJlQ29sb3IiLCJnZXREaXNwbGF5YWJsZVN0YXRlVmFsdWUiLCJpc1ZhbGlkQ29sb3IiLCJib3JkZXJSaWdodFdpZHRoIiwiYm9yZGVyUmlnaHRDb2xvciIsImJvcmRlclJpZ2h0U3R5bGUiLCJnZW5lcmF0ZUNvbG9yQ2FwIiwiZ2V0U3RhdGUiLCJST0NLX01VVEVEIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlVGFiU3dpdGNoIiwiZ2V0RWRpdGFibGVTdGF0ZVZhbHVlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztJQUFZQSxNOztBQUNaOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1DLFNBQVM7QUFDYkMsZ0JBQWM7QUFDWkMsYUFBUyxDQURHO0FBRVpDLGFBQVMsTUFGRztBQUdaQyxnQkFBWSxZQUhBO0FBSVosY0FBVTtBQUNSQyx1QkFBaUIscUJBQU0sa0JBQVFDLElBQWQsRUFBb0JDLE1BQXBCLENBQTJCLEdBQTNCO0FBRFQ7QUFKRSxHQUREO0FBU2JDLE9BQUs7QUFDSEwsYUFBUyxjQUROO0FBRUhNLFdBQU87QUFGSixHQVRRO0FBYWJDLFFBQU07QUFDSkMsY0FBVTtBQUROLEdBYk87QUFnQmJDLFFBQU07QUFDSkMsY0FBVTtBQUROLEdBaEJPO0FBbUJiQyxhQUFXO0FBQ1RMLFdBQU8sRUFERTtBQUVUSSxjQUFVLFVBRkQ7QUFHVEUsV0FBTyxDQUFDLENBSEM7QUFJVEMsZUFBVyxZQUpGO0FBS1RiLGFBQVMsTUFMQTtBQU1UQyxnQkFBWSxRQU5IO0FBT1Rh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aEQsS0FBckIsRUFBK0IsS0FBS0QsS0FBTCxDQUFXVSxTQUExQyxZQUE0RCxRQUE1RCxJQUF3RSxrQkFBUTVCLElBQWhGLEdBQXVGLGtCQUFRb0UsVUFBcEg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEY7QUFQRjtBQVZBO0FBMUJOLE9BREY7QUF3REQ7Ozs7RUFoUG9CLGdCQUFNSSxTOztrQkFtUGQsbUNBQWUsc0JBQU92RCxRQUFQLENBQWYsQyIsImZpbGUiOiJTdGF0ZVJvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IG9uQ2xpY2tPdXRzaWRlIGZyb20gJ3JlYWN0LW9uY2xpY2tvdXRzaWRlJ1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0ICogYXMgU3RhdGVzIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9TdGF0ZXMnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9QYWxldHRlJ1xuaW1wb3J0IHsgU3RhY2tNZW51U1ZHIH0gZnJvbSAnLi4vSWNvbnMnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgc3RhdGVXcmFwcGVyOiB7XG4gICAgcGFkZGluZzogNixcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkuZGFya2VuKDAuMSlcbiAgICB9XG4gIH0sXG4gIGNvbDoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIHdpZHRoOiAnNTAlJ1xuICB9LFxuICBjb2wxOiB7XG4gICAgbWF4V2lkdGg6IDE0NVxuICB9LFxuICBjb2wyOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfSxcbiAgc3RhdGVNZW51OiB7XG4gICAgd2lkdGg6IDEwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHJpZ2h0OiAtMyxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjMpJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICc6aG92ZXInOiB7fVxuICB9LFxuICBwaWxsOiB7XG4gICAgcGFkZGluZzogJzJweCA1cHgnLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBtYXhIZWlnaHQ6IDIxLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gIH0sXG4gIHBpbGxOYW1lOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkJMVUUsXG4gICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgbWFyZ2luUmlnaHQ6IDQsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DS1xuICB9LFxuICBwaWxsVmFsdWU6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkubGlnaHRlbigwLjE3KSxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgZmxvYXQ6ICdsZWZ0JyxcbiAgICBtYXJnaW5MZWZ0OiA0LFxuICAgIG1heFdpZHRoOiAnY2FsYygxMDAlIC0gMTJweCknLFxuICAgIG1pbkhlaWdodDogMjJcbiAgfSxcbiAgaW5wdXQ6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBwYWRkaW5nOiAnNHB4IDVweCAzcHgnLFxuICAgIFdlYmtpdFVzZXJTZWxlY3Q6ICdhdXRvJyxcbiAgICBjdXJzb3I6ICd0ZXh0JyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHdpZHRoOiAnY2FsYygxMDAlIC0gNHB4KScsXG4gICAgbWluSGVpZ2h0OiAyMixcbiAgICBmb250U2l6ZTogMTIsXG4gICAgZm9udEZhbWlseTogJ0ZpcmEgU2FucycsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAnOmZvY3VzJzoge1xuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICB9XG4gIH0sXG4gIGlucHV0Mjoge1xuICAgIHdpZHRoOiAnY2FsYygxMDAlIC0gOHB4KScsXG4gICAgbWFyZ2luTGVmdDogNFxuICB9XG59XG5cbmZ1bmN0aW9uIGlzQmxhbmsgKHN0cikge1xuICByZXR1cm4gL15cXHMqJC8udGVzdChzdHIpXG59XG5cbmNsYXNzIFN0YXRlUm93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzRWRpdGluZzogZmFsc2UsXG4gICAgICBpc0hvdmVyZWQ6IGZhbHNlLFxuICAgICAgbmFtZTogbnVsbCxcbiAgICAgIGRlc2M6IG51bGwsXG4gICAgICB2YWx1ZVByZUVkaXQ6IG51bGwsXG4gICAgICBkaWRFc2NhcGU6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgb3JpZ2luYWxOYW1lOiB0aGlzLnByb3BzLnN0YXRlTmFtZSxcbiAgICAgIG5hbWU6IHRoaXMucHJvcHMuc3RhdGVOYW1lLFxuICAgICAgZGVzYzogdGhpcy5wcm9wcy5zdGF0ZURlc2NyaXB0b3IsXG4gICAgICB2YWx1ZVByZUVkaXQ6IHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yLnZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMgKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgb3JpZ2luYWxOYW1lOiBuZXh0UHJvcHMuc3RhdGVOYW1lLFxuICAgICAgbmFtZTogbmV4dFByb3BzLnN0YXRlTmFtZSxcbiAgICAgIGRlc2M6IG5leHRQcm9wcy5zdGF0ZURlc2NyaXB0b3IsXG4gICAgICB2YWx1ZVByZUVkaXQ6IG5leHRQcm9wcy5zdGF0ZURlc2NyaXB0b3IudmFsdWVcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlVGFiU3dpdGNoKGV2ZW50LCBzaWRlKSB7XG4gICAgaWYoZXZlbnQua2V5Q29kZSA9PT0gOSkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICBpZiAoc2lkZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIHRoaXMudmFsdWVJbnB1dC5mb2N1cygpXG4gICAgICB9XG5cbiAgICAgIGlmIChzaWRlID09PSAndmFsdWUnKSB7XG4gICAgICAgIHRoaXMubmFtZUlucHV0LmZvY3VzKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UgKGV2ZW50LCBzaWRlKSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDI3KSB7IC8vIGVzYyBrZXlcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlLCBkaWRFc2NhcGU6IHRydWV9KVxuICAgIH1cblxuICAgIGxldCBkZXNjID0gdGhpcy5zdGF0ZS5kZXNjXG5cbiAgICAvLyBPbmx5IHVwZGF0ZSB0aGUgaW5wdXRzIGluIHRoZSBVSSBpZiB0aGUgdXNlciBkaWRuJ3QgcHJlc3MgUmV0dXJuXG4gICAgLy8gSGVyZSB3ZSdyZSBvbmx5IHVwZGF0aW5nIHRoZSB2aWV3IHN0YXRlLCB3ZSBoYXZlbid0IGNvbW1pdHRlZCBhbnl0aGluZyB5ZXRcbiAgICBpZiAoZXZlbnQua2V5ICE9PSAnRW50ZXInKSB7XG4gICAgICBpZiAoc2lkZSA9PT0gJ25hbWUnKSB7XG4gICAgICAgIGxldCB0cmltbWVkTmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZS50cmltKClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG5hbWU6IHRyaW1tZWROYW1lIH0pXG4gICAgICB9IGVsc2UgeyAvLyBVcGRhdGUgdGhlIHZhbHVlXG4gICAgICAgIGRlc2MudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWUudHJpbSgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Rlc2N9KVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZ290IGhlcmUsIEVudGVyIHdhcyBwcmVzc2VkLCBtZWFuaW5nIHdlIHdhbnQgdG8gY29tbWl0IHRoZSBzdGF0ZSB2YWx1ZS9uYW1lXG4gICAgZGVzYyA9IFN0YXRlcy5hdXRvQ2FzdFRvVHlwZShkZXNjKVxuXG4gICAgLy8gSWYgdGhlIG5hbWUgZmllbGQgaXMgYmxhbmssIGRlbGV0ZSB0aGUgc3RhdGUgKG9yIGp1c3QgcmVtb3ZlIGl0IGlmIGl0IGlzIG5ldylcbiAgICBpZiAoaXNCbGFuayh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5pc05ldykge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jbG9zZU5ld1N0YXRlRm9ybSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5kZWxldGVTdGF0ZVZhbHVlKHRoaXMuc3RhdGUub3JpZ2luYWxOYW1lLCAoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIG1hZGUgaXQgdGhpcyBmYXIsIGF0IGxlYXN0IG9uZSBvZiB0aGUgZmllbGRzIGlzIE5PVCBibGFuaywgYW5kIHdlIGNhbiBhdHRlbXB0IGEgc3VibWl0XG4gICAgaWYgKGlzQmxhbmsoZGVzYy52YWx1ZSkgfHwgaXNCbGFuayh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICBpZiAoaXNCbGFuayh0aGlzLnN0YXRlLm5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIHRpdGxlOiAnU29ycnknLFxuICAgICAgICAgIG1lc3NhZ2U6ICdTdGF0ZSBuYW1lcyBjYW5ub3QgYmUgYmxhbmsnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIC8vIEZvciBub3csIG9ubHkgc3VwcG9ydCBVUyBBU0NJSSBjaGFycyB0aGF0IHdvdWxkIGJlIHZhbGlkIGFzIGEgSmF2YVNjcmlwdCBpZGVudGlmaWVyXG4gICAgICBpZiAoIS9eWyRBLVpfXVswLTlBLVpfJF0qJC9pLnRlc3QodGhpcy5zdGF0ZS5uYW1lKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICB0aXRsZTogJ1NvcnJ5JyxcbiAgICAgICAgICBtZXNzYWdlOiAnU3RhdGUgbmFtZXMgY2Fubm90IGhhdmUgc3BhY2VzIG9yIHNwZWNpYWwgY2hhcmFjdGVycywgYW5kIG11c3QgYmVnaW4gd2l0aCBhIGxldHRlcidcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKGlzQmxhbmsoZGVzYy52YWx1ZSkpIHtcbiAgICAgICAgLy8gVE9ETzogTm90IHN1cmUgaWYgd2Ugd2FudCB0byBzZXQgdGhpcyBhcyBudWxsIG9yIG5vdFxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtkZXNjLCBuYW1lOiB0aGlzLnN0YXRlLm5hbWV9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3VibWl0Q2hhbmdlcygpXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlzTmV3KSB0aGlzLnByb3BzLmNsb3NlTmV3U3RhdGVGb3JtKClcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogZmFsc2V9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgeyAvLyBuZWl0aGVyIHdlcmUgYmxhbmtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2Rlc2MsIG5hbWU6IHRoaXMuc3RhdGUubmFtZX0sICgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJtaXRDaGFuZ2VzKClcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuaXNOZXcpIHRoaXMucHJvcHMuY2xvc2VOZXdTdGF0ZUZvcm0oKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc0VkaXRpbmc6IGZhbHNlfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgc3VibWl0Q2hhbmdlcyAoKSB7XG4gICAgY29uc3QgZGlkVmFsdWVDaGFuZ2UgPSB0aGlzLnN0YXRlLmRlc2MudmFsdWUgIT09IHRoaXMuc3RhdGUudmFsdWVQcmVFZGl0XG4gICAgY29uc3QgZGlkTmFtZUNoYW5nZSA9IHRoaXMuc3RhdGUubmFtZSAhPT0gdGhpcy5wcm9wcy5zdGF0ZU5hbWVcblxuICAgIGlmIChkaWROYW1lQ2hhbmdlICYmIGRpZFZhbHVlQ2hhbmdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy5kZWxldGVTdGF0ZVZhbHVlKHRoaXMucHJvcHMuc3RhdGVOYW1lLCAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwc2VydFN0YXRlVmFsdWUodGhpcy5zdGF0ZS5uYW1lLCB0aGlzLnN0YXRlLmRlc2MsICgpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNFZGl0aW5nOiBmYWxzZSB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKGRpZE5hbWVDaGFuZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLmRlbGV0ZVN0YXRlVmFsdWUodGhpcy5wcm9wcy5zdGF0ZU5hbWUsICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMudXBzZXJ0U3RhdGVWYWx1ZSh0aGlzLnN0YXRlLm5hbWUsIHRoaXMuc3RhdGUuZGVzYywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc0VkaXRpbmc6IGZhbHNlIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoZGlkVmFsdWVDaGFuZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnVwc2VydFN0YXRlVmFsdWUodGhpcy5zdGF0ZS5uYW1lLCB0aGlzLnN0YXRlLmRlc2MsICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzRWRpdGluZzogZmFsc2UgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQ2xpY2tPdXRzaWRlICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5pc05ldykgcmV0dXJuIHRoaXMucHJvcHMuY2xvc2VOZXdTdGF0ZUZvcm0oKVxuICAgIHRoaXMuc3VibWl0Q2hhbmdlcygpXG4gIH1cblxuICBnZXRFZGl0YWJsZVN0YXRlVmFsdWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmRlc2MpIHtcbiAgICAgIHJldHVybiBTdGF0ZXMuYXV0b1N0cmluZ2lmeSh0aGlzLnN0YXRlLmRlc2MpXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnN0YXRlRGVzY3JpcHRvcikge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXREaXNwbGF5YWJsZVN0YXRlVmFsdWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnZhbHVlUHJlRWRpdCkge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHsgdmFsdWU6IHRoaXMuc3RhdGUudmFsdWVQcmVFZGl0IH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BzLnN0YXRlRGVzY3JpcHRvcikge1xuICAgICAgcmV0dXJuIFN0YXRlcy5hdXRvU3RyaW5naWZ5KHRoaXMucHJvcHMuc3RhdGVEZXNjcmlwdG9yKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBpc1ZhbGlkQ29sb3IgKGNvbG9yKSB7XG4gICAgY29uc3QgZHVtbXlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZHVtbXlFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGNvbG9yXG5cbiAgICByZXR1cm4gZHVtbXlFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciAhPT0gJydcbiAgfVxuXG4gIGdlbmVyYXRlQ29sb3JDYXAgKCkge1xuICAgIGNvbnN0IG1heWJlQ29sb3IgPSB0aGlzLmdldERpc3BsYXlhYmxlU3RhdGVWYWx1ZSgpXG5cbiAgICBpZih0aGlzLmlzVmFsaWRDb2xvcihtYXliZUNvbG9yKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYm9yZGVyUmlnaHRXaWR0aDogNCxcbiAgICAgICAgYm9yZGVyUmlnaHRDb2xvcjogbWF5YmVDb2xvcixcbiAgICAgICAgYm9yZGVyUmlnaHRTdHlsZTogJ3NvbGlkJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtIGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LXN0YXRlYH1cbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0U3RhdGUoe2lzSG92ZXJlZDogdHJ1ZX0pfVxuICAgICAgICBvbk1vdXNlT3V0PXsoKSA9PiB0aGlzLnNldFN0YXRlKHtpc0hvdmVyZWQ6IGZhbHNlfSl9XG4gICAgICAgIG9uRG91YmxlQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe2lzRWRpdGluZzogdHJ1ZSwgZGlkRXNjYXBlOiBmYWxzZX0pfT5cbiAgICAgICAgeyF0aGlzLnN0YXRlLmlzRWRpdGluZyAmJiAhdGhpcy5wcm9wcy5pc05ld1xuICAgICAgICAgID8gPGRpdiBzdHlsZT17U1RZTEVTLnN0YXRlV3JhcHBlcn0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmNvbCwgU1RZTEVTLmNvbDFdfT5cbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tbmFtZWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMucGlsbCwgU1RZTEVTLnBpbGxOYW1lXX0+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc3RhdGVOYW1lfVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuY29sLCBTVFlMRVMuY29sMl19PlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS12YWx1ZWB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMucGlsbCwgU1RZTEVTLnBpbGxWYWx1ZSwgdGhpcy5nZW5lcmF0ZUNvbG9yQ2FwKCldfT5cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXREaXNwbGF5YWJsZVN0YXRlVmFsdWUoKX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS1tZW51YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgICAgICAgU1RZTEVTLnN0YXRlTWVudSxcbiAgICAgICAgICAgICAgICAgICghdGhpcy5zdGF0ZS5pc0hvdmVyZWQgfHwgdHJ1ZSkgJiYge2Rpc3BsYXk6ICdub25lJ30gLy8gVE9ETzogcmVtb3ZlIHRoaXMgJ3x8IHRydWUnIHRvIHNob3cgc3RhY2sgbWVudSBvbiBob3ZlciBhbmQgY3JlYXRlIHBvcG92ZXJcbiAgICAgICAgICAgICAgICBdfT5cbiAgICAgICAgICAgICAgICA8U3RhY2tNZW51U1ZHIGNvbG9yPXtSYWRpdW0uZ2V0U3RhdGUodGhpcy5zdGF0ZSwgYCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LW1lbnVgLCAnOmhvdmVyJykgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURUR9IC8+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDogPGRpdiBzdHlsZT17U1RZTEVTLnN0YXRlV3JhcHBlcn0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtbU1RZTEVTLmNvbCwgU1RZTEVTLmNvbDJdfT5cbiAgICAgICAgICAgICAgPGlucHV0IGtleT17YCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LW5hbWVgfVxuICAgICAgICAgICAgICAgIHJlZj17KG5hbWVJbnB1dCkgPT4ge3RoaXMubmFtZUlucHV0ID0gbmFtZUlucHV0fX1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5waWxsLCBTVFlMRVMuaW5wdXRdfVxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5wcm9wcy5zdGF0ZU5hbWV9XG4gICAgICAgICAgICAgICAgb25LZXlVcD17KGV2ZW50KSA9PiB0aGlzLmhhbmRsZUNoYW5nZShldmVudCwgJ25hbWUnKX1cbiAgICAgICAgICAgICAgICBvbktleURvd249eyhldmVudCkgPT4gdGhpcy5oYW5kbGVUYWJTd2l0Y2goZXZlbnQsICduYW1lJyl9XG4gICAgICAgICAgICAgICAgYXV0b0ZvY3VzIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e1tTVFlMRVMuY29sLCBTVFlMRVMuY29sMl19PlxuICAgICAgICAgICAgICA8aW5wdXQga2V5PXtgJHt0aGlzLnByb3BzLnN0YXRlTmFtZX0tdmFsdWVgfVxuICAgICAgICAgICAgICAgIHJlZj17KHZhbHVlSW5wdXQpID0+IHt0aGlzLnZhbHVlSW5wdXQgPSB2YWx1ZUlucHV0fX1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5waWxsLCBTVFlMRVMuaW5wdXQsIFNUWUxFUy5pbnB1dDJdfVxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17dGhpcy5nZXRFZGl0YWJsZVN0YXRlVmFsdWUoKX1cbiAgICAgICAgICAgICAgICBvbktleVVwPXsoZXZlbnQpID0+IHRoaXMuaGFuZGxlQ2hhbmdlKGV2ZW50LCAndmFsdWUnKX1cbiAgICAgICAgICAgICAgICBvbktleURvd249eyhldmVudCkgPT4gdGhpcy5oYW5kbGVUYWJTd2l0Y2goZXZlbnQsICd2YWx1ZScpfSAvPlxuICAgICAgICAgICAgICA8c3BhbiBrZXk9e2Ake3RoaXMucHJvcHMuc3RhdGVOYW1lfS1tZW51YH1cbiAgICAgICAgICAgICAgICBzdHlsZT17W1xuICAgICAgICAgICAgICAgICAgU1RZTEVTLnN0YXRlTWVudSxcbiAgICAgICAgICAgICAgICAgICFSYWRpdW0uZ2V0U3RhdGUodGhpcy5zdGF0ZSwgYCR7dGhpcy5wcm9wcy5zdGF0ZU5hbWV9LXN0YXRlYCwgJzpob3ZlcicpICYmIHtkaXNwbGF5OiAnbm9uZSd9XG4gICAgICAgICAgICAgICAgXX0+XG4gICAgICAgICAgICAgICAgPFN0YWNrTWVudVNWRyBjb2xvcj17UmFkaXVtLmdldFN0YXRlKHRoaXMuc3RhdGUsIGAke3RoaXMucHJvcHMuc3RhdGVOYW1lfS1tZW51YCwgJzpob3ZlcicpID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEfSAvPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgfVxuICAgICAgPC9mb3JtPlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBvbkNsaWNrT3V0c2lkZShSYWRpdW0oU3RhdGVSb3cpKVxuIl19