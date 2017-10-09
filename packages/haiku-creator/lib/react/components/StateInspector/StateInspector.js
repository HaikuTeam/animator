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
    _this.openNewStateForm = _this.openNewStateForm.bind(_this);
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
    key: 'openNewStateForm',
    value: function openNewStateForm() {
      if (!this.state.addingNew) {
        this.setState({ addingNew: true });
      }
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
            lineNumber: 143
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 144
            },
            __self: this
          },
          'State Inspector',
          _react2.default.createElement(
            'button',
            { id: 'add-state-button', style: STYLES.button,
              onClick: this.openNewStateForm, __source: {
                fileName: _jsxFileName,
                lineNumber: 146
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
              lineNumber: 151
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
              lineNumber: 153
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
                lineNumber: 168
              },
              __self: _this5
            });
          }).reverse() : _react2.default.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 179
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1N0YXRlSW5zcGVjdG9yL1N0YXRlSW5zcGVjdG9yLmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsImNvbnRhaW5lciIsInBvc2l0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJoZWlnaHQiLCJzdGF0ZXNDb250YWluZXIiLCJvdmVyZmxvdyIsInNlY3Rpb25IZWFkZXIiLCJjdXJzb3IiLCJtYXJnaW5Cb3R0b20iLCJwYWRkaW5nIiwidGV4dFRyYW5zZm9ybSIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiZm9udFNpemUiLCJqdXN0aWZ5Q29udGVudCIsImJ1dHRvbiIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJTdGF0ZUluc3BlY3RvciIsInByb3BzIiwidXBzZXJ0U3RhdGVWYWx1ZSIsImJpbmQiLCJkZWxldGVTdGF0ZVZhbHVlIiwib3Blbk5ld1N0YXRlRm9ybSIsImNsb3NlTmV3U3RhdGVGb3JtIiwic3RhdGUiLCJzdGF0ZXNEYXRhIiwiYWRkaW5nTmV3Iiwid2Vic29ja2V0IiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsImVyciIsImNyZWF0ZU5vdGljZSIsInRpdGxlIiwidHlwZSIsIm1lc3NhZ2UiLCJzZXRTdGF0ZSIsIm9uIiwibmFtZSIsImNvbnNvbGUiLCJpbmZvIiwic3RhdGVOYW1lIiwic3RhdGVEZXNjcmlwdG9yIiwibWF5YmVDYiIsInRvdXJDaGFubmVsIiwibmV4dCIsInZhbHVlIiwicmVtb3ZlTm90aWNlIiwibWFwIiwicmV2ZXJzZSIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNB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QUFQLENBQVcsS0FBS3pCLEtBQUwsQ0FBV0MsVUFBdEIsRUFBa0MsVUFBQ2tCLGVBQUQsRUFBa0JELFNBQWxCLEVBQWdDO0FBQ2xFLG1CQUNFO0FBQ0UsbUJBQVFBLFNBQVIsU0FERjtBQUVFLDZCQUFlLE9BQUtsQixLQUFMLENBQVdDLFVBRjVCO0FBR0UsK0JBQWlCa0IsZUFIbkI7QUFJRSx5QkFBV0QsU0FKYjtBQUtFLDRCQUFjLE9BQUt4QixLQUFMLENBQVdlLFlBTDNCO0FBTUUsNEJBQWMsT0FBS2YsS0FBTCxDQUFXOEIsWUFOM0I7QUFPRSxnQ0FBa0IsT0FBSzdCLGdCQVB6QjtBQVFFLGdDQUFrQixPQUFLRSxnQkFSekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBREY7QUFXRCxXQVpDLEVBWUM2QixPQVpELEVBREgsR0FjRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNUJOO0FBUkYsT0FERjtBQTBDRDs7OztFQXBJMEIsZ0JBQU1DLFM7O2tCQXVJcEIsc0JBQU9sQyxjQUFQLEMiLCJmaWxlIjoiU3RhdGVJbnNwZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IFN0YXRlUm93IGZyb20gJy4vU3RhdGVSb3cnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9QYWxldHRlJ1xuLy8gaW1wb3J0IHsgU3RhY2tNZW51U1ZHIH0gZnJvbSAnLi4vSWNvbnMnXG4vLyBpbXBvcnQgeyBCVE5fU1RZTEVTIH0gZnJvbSAnLi4vLi4vc3R5bGVzL2J0blNoYXJlZCdcblxuY29uc3QgU1RZTEVTID0ge1xuICBjb250YWluZXI6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgaGVpZ2h0OiAnMTAwJSdcbiAgfSxcbiAgc3RhdGVzQ29udGFpbmVyOiB7XG4gICAgb3ZlcmZsb3c6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICdjYWxjKDEwMCUgLSA1MHB4KSdcbiAgfSxcbiAgc2VjdGlvbkhlYWRlcjoge1xuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIGhlaWdodDogMjUsXG4gICAgbWFyZ2luQm90dG9tOiA4LFxuICAgIHBhZGRpbmc6ICcxOHB4IDE0cHggMTBweCcsXG4gICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGZvbnRTaXplOiAxNSxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nXG4gIH0sXG4gIGJ1dHRvbjoge1xuICAgIHBhZGRpbmc6ICczcHggOXB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBmb250U2l6ZTogMTMsXG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIG1hcmdpblRvcDogLTQsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIwMG1zIGVhc2UnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS0VSX0dSQVkpLmRhcmtlbigwLjIpXG4gICAgfSxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU3RhdGVJbnNwZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnVwc2VydFN0YXRlVmFsdWUgPSB0aGlzLnVwc2VydFN0YXRlVmFsdWUuYmluZCh0aGlzKVxuICAgIHRoaXMuZGVsZXRlU3RhdGVWYWx1ZSA9IHRoaXMuZGVsZXRlU3RhdGVWYWx1ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5vcGVuTmV3U3RhdGVGb3JtID0gdGhpcy5vcGVuTmV3U3RhdGVGb3JtLmJpbmQodGhpcylcbiAgICB0aGlzLmNsb3NlTmV3U3RhdGVGb3JtID0gdGhpcy5jbG9zZU5ld1N0YXRlRm9ybS5iaW5kKHRoaXMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXRlc0RhdGE6IG51bGwsXG4gICAgICBhZGRpbmdOZXc6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAncmVhZEFsbFN0YXRlVmFsdWVzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnIsIHN0YXRlc0RhdGEpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHtcbiAgICAgICAgICB0aXRsZTogJ1VoIG9oJyxcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdUaGVyZSB3YXMgYSBwcm9ibGVtIGxvYWRpbmcgdGhlIHN0YXRlcyBkYXRhIGZvciB0aGlzIHByb2plY3QnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHsgc3RhdGVzRGF0YSB9KVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLm5hbWUgPT09ICdzdGF0ZTpzZXQnKSB7XG4gICAgICAgIC8vIFRPRE86IFdoYXQ/XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIHN0YXRlIHNldCcsIG1lc3NhZ2UucGFyYW1zWzFdKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB1cHNlcnRTdGF0ZVZhbHVlIChzdGF0ZU5hbWUsIHN0YXRlRGVzY3JpcHRvciwgbWF5YmVDYikge1xuICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGluc2VydGluZyBzdGF0ZScsIHN0YXRlTmFtZSwgc3RhdGVEZXNjcmlwdG9yKVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICd1cHNlcnRTdGF0ZVZhbHVlJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHN0YXRlTmFtZSwgc3RhdGVEZXNjcmlwdG9yXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7XG4gICAgICAgICAgdGl0bGU6ICdVaCBvaCcsXG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAnVGhlcmUgd2FzIGEgcHJvYmxlbSBlZGl0aW5nIHRoYXQgc3RhdGUgdmFsdWUnXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YXRlc0RhdGEgPSB0aGlzLnN0YXRlLnN0YXRlc0RhdGFcbiAgICAgIHN0YXRlc0RhdGFbc3RhdGVOYW1lXSA9IHN0YXRlRGVzY3JpcHRvclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdGVzRGF0YX0pXG5cbiAgICAgIGlmIChtYXliZUNiKSB7XG4gICAgICAgIHJldHVybiBtYXliZUNiKClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgfVxuXG4gIGRlbGV0ZVN0YXRlVmFsdWUgKHN0YXRlTmFtZSwgbWF5YmVDYikge1xuICAgIGNvbnNvbGUuaW5mbygnW2NyZWF0b3JdIGRlbGV0aW5nIHN0YXRlJywgc3RhdGVOYW1lKVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdkZWxldGVTdGF0ZVZhbHVlJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIHN0YXRlTmFtZV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2Uoe1xuICAgICAgICAgIHRpdGxlOiAnVWggb2gnLFxuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1RoZXJlIHdhcyBhIHByb2JsZW0gZGVsZXRpbmcgdGhhdCBzdGF0ZSB2YWx1ZSdcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhdGVzRGF0YSA9IHRoaXMuc3RhdGUuc3RhdGVzRGF0YVxuICAgICAgZGVsZXRlIHN0YXRlc0RhdGFbc3RhdGVOYW1lXVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdGVzRGF0YX0pXG5cbiAgICAgIGlmIChtYXliZUNiKSB7XG4gICAgICAgIHJldHVybiBtYXliZUNiKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb3Blbk5ld1N0YXRlRm9ybSAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFkZGluZ05ldykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7YWRkaW5nTmV3OiB0cnVlfSlcbiAgICB9XG4gIH1cblxuICBjbG9zZU5ld1N0YXRlRm9ybSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7YWRkaW5nTmV3OiBmYWxzZX0pXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGFpbmVyfT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNlY3Rpb25IZWFkZXJ9PlxuICAgICAgICAgIFN0YXRlIEluc3BlY3RvclxuICAgICAgICAgIDxidXR0b24gaWQ9J2FkZC1zdGF0ZS1idXR0b24nIHN0eWxlPXtTVFlMRVMuYnV0dG9ufVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5vcGVuTmV3U3RhdGVGb3JtfT5cbiAgICAgICAgICAgICtcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zdGF0ZXNDb250YWluZXJ9PlxuICAgICAgICAgIHt0aGlzLnN0YXRlLmFkZGluZ05ldyAmJlxuICAgICAgICAgICAgPFN0YXRlUm93XG4gICAgICAgICAgICAgIGtleT17YG5ldy1yb3dgfVxuICAgICAgICAgICAgICBzdGF0ZURlc2NyaXB0b3I9e3t2YWx1ZTogJyd9fVxuICAgICAgICAgICAgICBzdGF0ZU5hbWU9eycnfVxuICAgICAgICAgICAgICBpc05ld1xuICAgICAgICAgICAgICBhbGxTdGF0ZXNEYXRhPXt0aGlzLnN0YXRlLnN0YXRlc0RhdGF9XG4gICAgICAgICAgICAgIGNyZWF0ZU5vdGljZT17dGhpcy5wcm9wcy5jcmVhdGVOb3RpY2V9XG4gICAgICAgICAgICAgIHJlbW92ZU5vdGljZT17dGhpcy5wcm9wcy5yZW1vdmVOb3RpY2V9XG4gICAgICAgICAgICAgIGNsb3NlTmV3U3RhdGVGb3JtPXt0aGlzLmNsb3NlTmV3U3RhdGVGb3JtfVxuICAgICAgICAgICAgICB1cHNlcnRTdGF0ZVZhbHVlPXt0aGlzLnVwc2VydFN0YXRlVmFsdWV9XG4gICAgICAgICAgICAgIGRlbGV0ZVN0YXRlVmFsdWU9e3RoaXMuZGVsZXRlU3RhdGVWYWx1ZX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAge3RoaXMuc3RhdGUuc3RhdGVzRGF0YVxuICAgICAgICAgICAgPyBsb2Rhc2gubWFwKHRoaXMuc3RhdGUuc3RhdGVzRGF0YSwgKHN0YXRlRGVzY3JpcHRvciwgc3RhdGVOYW1lKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPFN0YXRlUm93XG4gICAgICAgICAgICAgICAgICBrZXk9e2Ake3N0YXRlTmFtZX0tcm93YH1cbiAgICAgICAgICAgICAgICAgIGFsbFN0YXRlc0RhdGE9e3RoaXMuc3RhdGUuc3RhdGVzRGF0YX1cbiAgICAgICAgICAgICAgICAgIHN0YXRlRGVzY3JpcHRvcj17c3RhdGVEZXNjcmlwdG9yfVxuICAgICAgICAgICAgICAgICAgc3RhdGVOYW1lPXtzdGF0ZU5hbWV9XG4gICAgICAgICAgICAgICAgICBjcmVhdGVOb3RpY2U9e3RoaXMucHJvcHMuY3JlYXRlTm90aWNlfVxuICAgICAgICAgICAgICAgICAgcmVtb3ZlTm90aWNlPXt0aGlzLnByb3BzLnJlbW92ZU5vdGljZX1cbiAgICAgICAgICAgICAgICAgIHVwc2VydFN0YXRlVmFsdWU9e3RoaXMudXBzZXJ0U3RhdGVWYWx1ZX1cbiAgICAgICAgICAgICAgICAgIGRlbGV0ZVN0YXRlVmFsdWU9e3RoaXMuZGVsZXRlU3RhdGVWYWx1ZX0gLz5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSkucmV2ZXJzZSgpXG4gICAgICAgICAgICA6IDxkaXY+TE9BRElORy4uLjwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKFN0YXRlSW5zcGVjdG9yKVxuIl19