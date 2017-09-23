'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/StateInspector/StateInspector.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _StateRow = require('./StateRow');

var _StateRow2 = _interopRequireDefault(_StateRow);

var _Palette = require('../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { StackMenuSVG } from '../Icons'
// import { BTN_STYLES } from '../../styles/btnShared'

var STYLES = {
  container: {
    position: 'relative',
    backgroundColor: _Palette2.default.GRAY,
    WebkitUserSelect: 'none',
    height: '100%'
  },
  statesContainer: {
    overflow: 'auto',
    height: 'calc(100% - 50px)'
  },
  sectionHeader: {
    cursor: 'default',
    height: 25,
    marginBottom: 8,
    padding: '18px 14px 10px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    justifyContent: 'space-between'
  },
  button: {
    padding: '3px 9px',
    backgroundColor: _Palette2.default.DARKER_GRAY,
    color: _Palette2.default.ROCK,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -4,
    borderRadius: 3,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease',
    ':hover': {
      backgroundColor: (0, _color2.default)(_Palette2.default.DARKER_GRAY).darken(0.2)
    },
    ':active': {
      transform: 'scale(.8)'
    }
  }
};

var StateInspector = function (_React$Component) {
  _inherits(StateInspector, _React$Component);

  function StateInspector(props) {
    _classCallCheck(this, StateInspector);

    var _this = _possibleConstructorReturn(this, (StateInspector.__proto__ || Object.getPrototypeOf(StateInspector)).call(this, props));

    _this.upsertStateValue = _this.upsertStateValue.bind(_this);
    _this.deleteStateValue = _this.deleteStateValue.bind(_this);
    _this.closeNewStateForm = _this.closeNewStateForm.bind(_this);
    _this.state = {
      statesData: null,
      addingNew: false
    };
    return _this;
  }

  _createClass(StateInspector, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.props.websocket.request({ method: 'readAllStateValues', params: [this.props.folder] }, function (err, statesData) {
        if (err) {
          return _this2.props.createNotice({
            title: 'Uh oh',
            type: 'error',
            message: 'There was a problem loading the states data for this project'
          });
        }
        _this2.setState({ statesData: statesData });
      });

      this.props.websocket.on('broadcast', function (message) {
        if (message.name === 'state:set') {
          // TODO: What?
          console.info('[creator] state set', message.params[1]);
        }
      });
    }
  }, {
    key: 'upsertStateValue',
    value: function upsertStateValue(stateName, stateDescriptor, maybeCb) {
      var _this3 = this;

      console.info('[creator] inserting state', stateName, stateDescriptor);

      this.props.websocket.request({ type: 'action', method: 'upsertStateValue', params: [this.props.folder, stateName, stateDescriptor] }, function (err) {
        if (err) {
          return _this3.props.createNotice({
            title: 'Uh oh',
            type: 'error',
            message: 'There was a problem editing that state value'
          });
        }

        var statesData = _this3.state.statesData;
        statesData[stateName] = stateDescriptor;
        _this3.setState({ statesData: statesData });

        if (maybeCb) {
          return maybeCb();
        }
      });

      this.props.tourChannel.next();
    }
  }, {
    key: 'deleteStateValue',
    value: function deleteStateValue(stateName, maybeCb) {
      var _this4 = this;

      console.info('[creator] deleting state', stateName);

      this.props.websocket.request({ type: 'action', method: 'deleteStateValue', params: [this.props.folder, stateName] }, function (err) {
        if (err) {
          return _this4.props.createNotice({
            title: 'Uh oh',
            type: 'error',
            message: 'There was a problem deleting that state value'
          });
        }

        var statesData = _this4.state.statesData;
        delete statesData[stateName];
        _this4.setState({ statesData: statesData });

        if (maybeCb) {
          return maybeCb();
        }
      });
    }
  }, {
    key: 'closeNewStateForm',
    value: function closeNewStateForm() {
      this.setState({ addingNew: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        { style: STYLES.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 136
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 137
            },
            __self: this
          },
          'State Inspector',
          _react2.default.createElement(
            'button',
            { id: 'add-state-button', style: STYLES.button,
              onClick: function onClick() {
                return _this5.setState({ addingNew: true });
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 139
              },
              __self: this
            },
            '+'
          )
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.statesContainer, __source: {
              fileName: _jsxFileName,
              lineNumber: 144
            },
            __self: this
          },
          this.state.addingNew && _react2.default.createElement(_StateRow2.default, {
            key: 'new-row',
            stateDescriptor: { value: '' },
            stateName: '',
            isNew: true,
            allStatesData: this.state.statesData,
            createNotice: this.props.createNotice,
            removeNotice: this.props.removeNotice,
            closeNewStateForm: this.closeNewStateForm,
            upsertStateValue: this.upsertStateValue,
            deleteStateValue: this.deleteStateValue, __source: {
              fileName: _jsxFileName,
              lineNumber: 146
            },
            __self: this
          }),
          this.state.statesData ? _lodash2.default.map(this.state.statesData, function (stateDescriptor, stateName) {
            return _react2.default.createElement(_StateRow2.default, {
              key: stateName + '-row',
              allStatesData: _this5.state.statesData,
              stateDescriptor: stateDescriptor,
              stateName: stateName,
              createNotice: _this5.props.createNotice,
              removeNotice: _this5.props.removeNotice,
              upsertStateValue: _this5.upsertStateValue,
              deleteStateValue: _this5.deleteStateValue, __source: {
                fileName: _jsxFileName,
                lineNumber: 161
              },
              __self: _this5
            });
          }) : _react2.default.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 172
              },
              __self: this
            },
            'LOADING...'
          )
        )
      );
    }
  }]);

  return StateInspector;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(StateInspector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yLmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsImNvbnRhaW5lciIsInBvc2l0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJoZWlnaHQiLCJzdGF0ZXNDb250YWluZXIiLCJvdmVyZmxvdyIsInNlY3Rpb25IZWFkZXIiLCJjdXJzb3IiLCJtYXJnaW5Cb3R0b20iLCJwYWRkaW5nIiwidGV4dFRyYW5zZm9ybSIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiZm9udFNpemUiLCJqdXN0aWZ5Q29udGVudCIsImJ1dHRvbiIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJTdGF0ZUluc3BlY3RvciIsInByb3BzIiwidXBzZXJ0U3RhdGVWYWx1ZSIsImJpbmQiLCJkZWxldGVTdGF0ZVZhbHVlIiwiY2xvc2VOZXdTdGF0ZUZvcm0iLCJzdGF0ZSIsInN0YXRlc0RhdGEiLCJhZGRpbmdOZXciLCJ3ZWJzb2NrZXQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwiZXJyIiwiY3JlYXRlTm90aWNlIiwidGl0bGUiLCJ0eXBlIiwibWVzc2FnZSIsInNldFN0YXRlIiwib24iLCJuYW1lIiwiY29uc29sZSIsImluZm8iLCJzdGF0ZU5hbWUiLCJzdGF0ZURlc2NyaXB0b3IiLCJtYXliZUNiIiwidG91ckNoYW5uZWwiLCJuZXh0IiwidmFsdWUiLCJyZW1vdmVOb3RpY2UiLCJtYXAiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTs7QUFFQSxJ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QUdFLCtCQUFpQmtCLGVBSG5CO0FBSUUseUJBQVdELFNBSmI7QUFLRSw0QkFBYyxPQUFLdkIsS0FBTCxDQUFXYyxZQUwzQjtBQU1FLDRCQUFjLE9BQUtkLEtBQUwsQ0FBVzZCLFlBTjNCO0FBT0UsZ0NBQWtCLE9BQUs1QixnQkFQekI7QUFRRSxnQ0FBa0IsT0FBS0UsZ0JBUnpCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQURGO0FBV0QsV0FaQyxDQURILEdBY0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTVCTjtBQVJGLE9BREY7QUEwQ0Q7Ozs7RUE3SDBCLGdCQUFNNEIsUzs7a0JBZ0lwQixzQkFBT2hDLGNBQVAsQyIsImZpbGUiOiJTdGF0ZUluc3BlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgU3RhdGVSb3cgZnJvbSAnLi9TdGF0ZVJvdydcbmltcG9ydCBQYWxldHRlIGZyb20gJy4uL1BhbGV0dGUnXG4vLyBpbXBvcnQgeyBTdGFja01lbnVTVkcgfSBmcm9tICcuLi9JY29ucydcbi8vIGltcG9ydCB7IEJUTl9TVFlMRVMgfSBmcm9tICcuLi8uLi9zdHlsZXMvYnRuU2hhcmVkJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgIFdlYmtpdFVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzdGF0ZXNDb250YWluZXI6IHtcbiAgICBvdmVyZmxvdzogJ2F1dG8nLFxuICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDUwcHgpJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgZm9udFNpemU6IDE1LFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbidcbiAgfSxcbiAgYnV0dG9uOiB7XG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBTdGF0ZUluc3BlY3RvciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMudXBzZXJ0U3RhdGVWYWx1ZSA9IHRoaXMudXBzZXJ0U3RhdGVWYWx1ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5kZWxldGVTdGF0ZVZhbHVlID0gdGhpcy5kZWxldGVTdGF0ZVZhbHVlLmJpbmQodGhpcylcbiAgICB0aGlzLmNsb3NlTmV3U3RhdGVGb3JtID0gdGhpcy5jbG9zZU5ld1N0YXRlRm9ybS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXRlc0RhdGE6IG51bGwsXG4gICAgICBhZGRpbmdOZXc6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAncmVhZEFsbFN0YXRlVmFsdWVzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnIsIHN0YXRlc0RhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0aXRsZTogJ1VoIG9oJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdUaGVyZSB3YXMgYSBwcm9ibGVtIGxvYWRpbmcgdGhlIHN0YXRlcyBkYXRhIGZvciB0aGlzIHByb2plY3QnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHsgc3RhdGVzRGF0YSB9KVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLm5hbWUgPT09ICdzdGF0ZTpzZXQnKSB7XG4gICAgICAgIC8vIFRPRE86IFdoYXQ/XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIHN0YXRlIHNldCcsIG1lc3NhZ2UucGFyYW1zWzFdKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB1cHNlcnRTdGF0ZVZhbHVlIChzdGF0ZU5hbWUsIHN0YXRlRGVzY3JpcHRvciwgbWF5YmVDYikge1xuICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGluc2VydGluZyBzdGF0ZScsIHN0YXRlTmFtZSwgc3RhdGVEZXNjcmlwdG9yKVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICd1cHNlcnRTdGF0ZVZhbHVlJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHN0YXRlTmFtZSwgc3RhdGVEZXNjcmlwdG9yXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdGl0bGU6ICdVaCBvaCcsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgd2FzIGEgcHJvYmxlbSBlZGl0aW5nIHRoYXQgc3RhdGUgdmFsdWUnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YXRlc0RhdGEgPSB0aGlzLnN0YXRlLnN0YXRlc0RhdGFcbiAgICAgIHN0YXRlc0RhdGFbc3RhdGVOYW1lXSA9IHN0YXRlRGVzY3JpcHRvclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdGVzRGF0YX0pXG5cbiAgICAgIGlmIChtYXliZUNiKSB7XG4gICAgICAgIHJldHVybiBtYXliZUNiKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgfVxuXG4gIGRlbGV0ZVN0YXRlVmFsdWUgKHN0YXRlTmFtZSwgbWF5YmVDYikge1xuICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGRlbGV0aW5nIHN0YXRlJywgc3RhdGVOYW1lKVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdkZWxldGVTdGF0ZVZhbHVlJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHN0YXRlTmFtZV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHRpdGxlOiAnVWggb2gnLFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1RoZXJlIHdhcyBhIHByb2JsZW0gZGVsZXRpbmcgdGhhdCBzdGF0ZSB2YWx1ZSdcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhdGVzRGF0YSA9IHRoaXMuc3RhdGUuc3RhdGVzRGF0YVxuICAgICAgZGVsZXRlIHN0YXRlc0RhdGFbc3RhdGVOYW1lXVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdGVzRGF0YX0pXG5cbiAgICAgIGlmIChtYXliZUNiKSB7XG4gICAgICAgIHJldHVybiBtYXliZUNiKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgY2xvc2VOZXdTdGF0ZUZvcm0gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2FkZGluZ05ldzogZmFsc2V9KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zZWN0aW9uSGVhZGVyfT5cbiAgICAgICAgICBTdGF0ZSBJbnNwZWN0b3JcbiAgICAgICAgICA8YnV0dG9uIGlkPSdhZGQtc3RhdGUtYnV0dG9uJyBzdHlsZT17U1RZTEVTLmJ1dHRvbn1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc2V0U3RhdGUoe2FkZGluZ05ldzogdHJ1ZX0pfT5cbiAgICAgICAgICAgICtcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zdGF0ZXNDb250YWluZXJ9PlxuICAgICAgICAgIHt0aGlzLnN0YXRlLmFkZGluZ05ldyAmJlxuICAgICAgICAgICAgPFN0YXRlUm93XG4gICAgICAgICAgICAgIGtleT17YG5ldy1yb3dgfVxuICAgICAgICAgICAgICBzdGF0ZURlc2NyaXB0b3I9e3t2YWx1ZTogJyd9fVxuICAgICAgICAgICAgICBzdGF0ZU5hbWU9eycnfVxuICAgICAgICAgICAgICBpc05ld1xuICAgICAgICAgICAgICBhbGxTdGF0ZXNEYXRhPXt0aGlzLnN0YXRlLnN0YXRlc0RhdGF9XG4gICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5wcm9wcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5wcm9wcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgIGNsb3NlTmV3U3RhdGVGb3JtPXt0aGlzLmNsb3NlTmV3U3RhdGVGb3JtfVxuICAgICAgICAgICAgICB1cHNlcnRTdGF0ZVZhbHVlPXt0aGlzLnVwc2VydFN0YXRlVmFsdWV9XG4gICAgICAgICAgICAgIGRlbGV0ZVN0YXRlVmFsdWU9e3RoaXMuZGVsZXRlU3RhdGVWYWx1ZX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAge3RoaXMuc3RhdGUuc3RhdGVzRGF0YVxuICAgICAgICAgICAgPyBsb2Rhc2gubWFwKHRoaXMuc3RhdGUuc3RhdGVzRGF0YSwgKHN0YXRlRGVzY3JpcHRvciwgc3RhdGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFN0YXRlUm93XG4gICAgICAgICAgICAgICAgICBrZXk9e2Ake3N0YXRlTmFtZX0tcm93YH1cbiAgICAgICAgICAgICAgICAgIGFsbFN0YXRlc0RhdGE9e3RoaXMuc3RhdGUuc3RhdGVzRGF0YX1cbiAgICAgICAgICAgICAgICAgIHN0YXRlRGVzY3JpcHRvcj17c3RhdGVEZXNjcmlwdG9yfVxuICAgICAgICAgICAgICAgICAgc3RhdGVOYW1lPXtzdGF0ZU5hbWV9XG4gICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMucHJvcHMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnByb3BzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgIHVwc2VydFN0YXRlVmFsdWU9e3RoaXMudXBzZXJ0U3RhdGVWYWx1ZX1cbiAgICAgICAgICAgICAgICAgIGRlbGV0ZVN0YXRlVmFsdWU9e3RoaXMuZGVsZXRlU3RhdGVWYWx1ZX0gLz5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogPGRpdj5MT0FESU5HLi4uPC9kaXY+XG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oU3RhdGVJbnNwZWN0b3IpXG4iXX0=