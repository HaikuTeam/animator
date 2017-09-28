'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/ToolSelector.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Icons = require('./Icons');

var _PseudoMenuButton = require('./PseudoMenuButton');

var _PseudoMenuButton2 = _interopRequireDefault(_PseudoMenuButton);

var _btnShared = require('../styles/btnShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var electron = require('electron');
var remote = electron.remote;
var Menu = remote.Menu,
    MenuItem = remote.MenuItem;

var ipcRenderer = electron.ipcRenderer;

var ToolSelector = function (_React$Component) {
  _inherits(ToolSelector, _React$Component);

  function ToolSelector(props) {
    _classCallCheck(this, ToolSelector);

    var _this = _possibleConstructorReturn(this, (ToolSelector.__proto__ || Object.getPrototypeOf(ToolSelector)).call(this, props));

    _this.shapes = [{ name: 'Rectangle', path: '@haiku/player/components/Rect' }, { name: 'Line', path: '@haiku/player/components/Line' }, { name: 'Oval', path: '@haiku/player/components/Oval' }];
    _this.state = {
      currentTool: 'pointer',
      currentShape: _this.shapes[0],
      currentDrawingTool: 'pen'
    };
    return _this;
  }

  _createClass(ToolSelector, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      ipcRenderer.on('global-menu:set-tool', this._handleGlobalMenu);
      this.props.websocket.on('broadcast', this._handleWebsocketBroadcast);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      ipcRenderer.removeListener('global-menu:set-tool', this._handleGlobalMenu);
      this.props.websocket.removeListener('broadcast', this._handleWebsocketBroadcast);
    }
  }, {
    key: 'broadcastToolSelection',
    value: function broadcastToolSelection(component, isModal) {
      this.props.websocket.send({ type: 'broadcast', name: 'drawing:setActive', params: [component, isModal] });
    }
  }, {
    key: '_setCurrentTool',
    value: function _setCurrentTool(name) {
      this.setState({ currentTool: name });
      this.broadcastToolSelection(name, true);
    }
  }, {
    key: '_showDrawingMenu',
    value: function _showDrawingMenu() {
      // build a context menu from the shapes definitions
      var menu = new Menu();
      menu.append(new MenuItem({
        label: 'Pen',
        click: this._setActiveDrawingTool.bind(this, 'pen')
      }));
      menu.append(new MenuItem({
        label: 'Brush',
        click: this._setActiveDrawingTool.bind(this, 'brush')
      }));

      menu.popup(remote.getCurrentWindow());
    }
  }, {
    key: '_showShapeMenu',
    value: function _showShapeMenu() {
      var _this2 = this;

      // build a context menu from the shapes definitions
      var menu = new Menu();
      this.shapes.forEach(function (def) {
        menu.append(new MenuItem({
          label: def.name,
          click: _this2._setActiveShape.bind(_this2, def)
        }));
      });

      menu.popup(remote.getCurrentWindow());
    }
  }, {
    key: '_setActiveShape',
    value: function _setActiveShape(shapeDef) {
      this.setState({
        currentTool: 'shape',
        currentShape: shapeDef
      });
      this.broadcastToolSelection(shapeDef.path, false);
    }
  }, {
    key: '_setActiveDrawingTool',
    value: function _setActiveDrawingTool(name) {
      this.setState({
        currentTool: name,
        currentDrawingTool: name
      });
      this.broadcastToolSelection(name, true);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: 'selector', __source: {
            fileName: _jsxFileName,
            lineNumber: 99
          },
          __self: this
        },
        _react2.default.createElement(
          _PseudoMenuButton2.default,
          { style: [_btnShared.BTN_STYLES.btnIcon, _btnShared.BTN_STYLES.leftBtns, { cursor: 'pointer' }, this.state.currentTool === 'pointer' && STYLES.btnActive],
            onClick: this._setCurrentTool.bind(this, 'pointer'), __source: {
              fileName: _jsxFileName,
              lineNumber: 100
            },
            __self: this
          },
          _react2.default.createElement(_Icons.PointerSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 103
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          _PseudoMenuButton2.default,
          { style: [_btnShared.BTN_STYLES.btnIcon, _btnShared.BTN_STYLES.leftBtns, STYLES.btnDrop, { cursor: 'pointer' }, this.state.currentTool === 'shape' && STYLES.btnActive],
            onExpand: this._showShapeMenu.bind(this),
            onClick: function onClick() {
              return _this3._setActiveShape(_this3.state.currentShape);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 106
            },
            __self: this
          },
          _react2.default.createElement(_Icons.PrimitiveIconSVG, { type: this.state.currentShape.name, __source: {
              fileName: _jsxFileName,
              lineNumber: 110
            },
            __self: this
          }),
          _react2.default.createElement(_Icons.DropTriangle, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 111
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          _PseudoMenuButton2.default,
          { style: [_btnShared.BTN_STYLES.btnIcon, _btnShared.BTN_STYLES.leftBtns, STYLES.btnDrop, { cursor: 'pointer' }, (this.state.currentTool === 'pen' || this.state.currentTool === 'brush') && STYLES.btnActive],
            onExpand: this._showDrawingMenu.bind(this),
            onClick: function onClick() {
              return _this3._setActiveDrawingTool(_this3.state.currentDrawingTool);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 114
            },
            __self: this
          },
          this.state.currentDrawingTool === 'pen' ? _react2.default.createElement(_Icons.PenSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 119
            },
            __self: this
          }) : _react2.default.createElement(_Icons.BrushSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 120
            },
            __self: this
          }),
          _react2.default.createElement(_Icons.DropTriangle, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 121
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          _PseudoMenuButton2.default,
          { style: [_btnShared.BTN_STYLES.btnIcon, _btnShared.BTN_STYLES.leftBtns, { cursor: 'pointer' }, this.state.currentTool === 'text' && STYLES.btnActive],
            onClick: this._setCurrentTool.bind(this, 'text'), __source: {
              fileName: _jsxFileName,
              lineNumber: 124
            },
            __self: this
          },
          _react2.default.createElement(_Icons.PrimitiveIconSVG, { type: 'Text', __source: {
              fileName: _jsxFileName,
              lineNumber: 127
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: '_handleGlobalMenu',
    value: function _handleGlobalMenu(ev, tool) {
      if (tool[0] === 'shape') {
        var shape = _lodash2.default.find(this.shapes, function (shape) {
          return shape.name === tool[1];
        });
        this._setActiveShape(shape);
      } else if (tool[0] === 'pen' || tool[0] === 'brush') {
        this._setActiveDrawingTool(tool[0]);
      } else {
        this._setCurrentTool(tool[0]);
      }
    }
  }, {
    key: '_handleWebsocketBroadcast',
    value: function _handleWebsocketBroadcast(message) {
      if (message.name === 'drawing:completed') {
        this._setCurrentTool('pointer');
      }
    }
  }]);

  return ToolSelector;
}(_react2.default.Component);

var STYLES = {
  btnActive: {
    border: '1px solid white'
  },
  btnDrop: {
    borderRadius: '3px 3px 0px'
  }
};

exports.default = (0, _radium2.default)(ToolSelector);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Rvb2xTZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJlbGVjdHJvbiIsInJlcXVpcmUiLCJyZW1vdGUiLCJNZW51IiwiTWVudUl0ZW0iLCJpcGNSZW5kZXJlciIsIlRvb2xTZWxlY3RvciIsInByb3BzIiwic2hhcGVzIiwibmFtZSIsInBhdGgiLCJzdGF0ZSIsImN1cnJlbnRUb29sIiwiY3VycmVudFNoYXBlIiwiY3VycmVudERyYXdpbmdUb29sIiwib24iLCJfaGFuZGxlR2xvYmFsTWVudSIsIndlYnNvY2tldCIsIl9oYW5kbGVXZWJzb2NrZXRCcm9hZGNhc3QiLCJyZW1vdmVMaXN0ZW5lciIsImNvbXBvbmVudCIsImlzTW9kYWwiLCJzZW5kIiwidHlwZSIsInBhcmFtcyIsInNldFN0YXRlIiwiYnJvYWRjYXN0VG9vbFNlbGVjdGlvbiIsIm1lbnUiLCJhcHBlbmQiLCJsYWJlbCIsImNsaWNrIiwiX3NldEFjdGl2ZURyYXdpbmdUb29sIiwiYmluZCIsInBvcHVwIiwiZ2V0Q3VycmVudFdpbmRvdyIsImZvckVhY2giLCJkZWYiLCJfc2V0QWN0aXZlU2hhcGUiLCJzaGFwZURlZiIsImJ0bkljb24iLCJsZWZ0QnRucyIsImN1cnNvciIsIlNUWUxFUyIsImJ0bkFjdGl2ZSIsIl9zZXRDdXJyZW50VG9vbCIsImJ0bkRyb3AiLCJfc2hvd1NoYXBlTWVudSIsIl9zaG93RHJhd2luZ01lbnUiLCJldiIsInRvb2wiLCJzaGFwZSIsImZpbmQiLCJtZXNzYWdlIiwiQ29tcG9uZW50IiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFPQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsV0FBV0MsUUFBUSxVQUFSLENBQWpCO0lBQ1FDLE0sR0FBV0YsUSxDQUFYRSxNO0lBQ0FDLEksR0FBbUJELE0sQ0FBbkJDLEk7SUFBTUMsUSxHQUFhRixNLENBQWJFLFE7O0FBQ2QsSUFBTUMsY0FBY0wsU0FBU0ssV0FBN0I7O0lBRU1DLFk7OztBQUNKLHdCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsNEhBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLE1BQUwsR0FBYyxDQUNaLEVBQUVDLE1BQU0sV0FBUixFQUFxQkMsTUFBTSwrQkFBM0IsRUFEWSxFQUVaLEVBQUVELE1BQU0sTUFBUixFQUFnQkMsTUFBTSwrQkFBdEIsRUFGWSxFQUdaLEVBQUVELE1BQU0sTUFBUixFQUFnQkMsTUFBTSwrQkFBdEIsRUFIWSxDQUFkO0FBS0EsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLG1CQUFhLFNBREY7QUFFWEMsb0JBQWMsTUFBS0wsTUFBTCxDQUFZLENBQVosQ0FGSDtBQUdYTSwwQkFBb0I7QUFIVCxLQUFiO0FBUGtCO0FBWW5COzs7O3lDQUVxQjtBQUNwQlQsa0JBQVlVLEVBQVosQ0FBZSxzQkFBZixFQUF1QyxLQUFLQyxpQkFBNUM7QUFDQSxXQUFLVCxLQUFMLENBQVdVLFNBQVgsQ0FBcUJGLEVBQXJCLENBQXdCLFdBQXhCLEVBQXFDLEtBQUtHLHlCQUExQztBQUNEOzs7MkNBRXVCO0FBQ3RCYixrQkFBWWMsY0FBWixDQUEyQixzQkFBM0IsRUFBbUQsS0FBS0gsaUJBQXhEO0FBQ0EsV0FBS1QsS0FBTCxDQUFXVSxTQUFYLENBQXFCRSxjQUFyQixDQUFvQyxXQUFwQyxFQUFpRCxLQUFLRCx5QkFBdEQ7QUFDRDs7OzJDQUV1QkUsUyxFQUFXQyxPLEVBQVM7QUFDMUMsV0FBS2QsS0FBTCxDQUFXVSxTQUFYLENBQXFCSyxJQUFyQixDQUEwQixFQUFFQyxNQUFNLFdBQVIsRUFBcUJkLE1BQU0sbUJBQTNCLEVBQWdEZSxRQUFRLENBQUNKLFNBQUQsRUFBWUMsT0FBWixDQUF4RCxFQUExQjtBQUNEOzs7b0NBRWdCWixJLEVBQU07QUFDckIsV0FBS2dCLFFBQUwsQ0FBYyxFQUFFYixhQUFhSCxJQUFmLEVBQWQ7QUFDQSxXQUFLaUIsc0JBQUwsQ0FBNEJqQixJQUE1QixFQUFrQyxJQUFsQztBQUNEOzs7dUNBRW1CO0FBQ2xCO0FBQ0EsVUFBSWtCLE9BQU8sSUFBSXhCLElBQUosRUFBWDtBQUNBd0IsV0FBS0MsTUFBTCxDQUFZLElBQUl4QixRQUFKLENBQWE7QUFDdkJ5QixlQUFPLEtBRGdCO0FBRXZCQyxlQUFPLEtBQUtDLHFCQUFMLENBQTJCQyxJQUEzQixDQUFnQyxJQUFoQyxFQUFzQyxLQUF0QztBQUZnQixPQUFiLENBQVo7QUFJQUwsV0FBS0MsTUFBTCxDQUFZLElBQUl4QixRQUFKLENBQWE7QUFDdkJ5QixlQUFPLE9BRGdCO0FBRXZCQyxlQUFPLEtBQUtDLHFCQUFMLENBQTJCQyxJQUEzQixDQUFnQyxJQUFoQyxFQUFzQyxPQUF0QztBQUZnQixPQUFiLENBQVo7O0FBS0FMLFdBQUtNLEtBQUwsQ0FBVy9CLE9BQU9nQyxnQkFBUCxFQUFYO0FBQ0Q7OztxQ0FFaUI7QUFBQTs7QUFDaEI7QUFDQSxVQUFJUCxPQUFPLElBQUl4QixJQUFKLEVBQVg7QUFDQSxXQUFLSyxNQUFMLENBQVkyQixPQUFaLENBQW9CLFVBQUNDLEdBQUQsRUFBUztBQUMzQlQsYUFBS0MsTUFBTCxDQUFZLElBQUl4QixRQUFKLENBQWE7QUFDdkJ5QixpQkFBT08sSUFBSTNCLElBRFk7QUFFdkJxQixpQkFBTyxPQUFLTyxlQUFMLENBQXFCTCxJQUFyQixTQUFnQ0ksR0FBaEM7QUFGZ0IsU0FBYixDQUFaO0FBSUQsT0FMRDs7QUFPQVQsV0FBS00sS0FBTCxDQUFXL0IsT0FBT2dDLGdCQUFQLEVBQVg7QUFDRDs7O29DQUVnQkksUSxFQUFVO0FBQ3pCLFdBQUtiLFFBQUwsQ0FBYztBQUNaYixxQkFBYSxPQUREO0FBRVpDLHNCQUFjeUI7QUFGRixPQUFkO0FBSUEsV0FBS1osc0JBQUwsQ0FBNEJZLFNBQVM1QixJQUFyQyxFQUEyQyxLQUEzQztBQUNEOzs7MENBRXNCRCxJLEVBQU07QUFDM0IsV0FBS2dCLFFBQUwsQ0FBYztBQUNaYixxQkFBYUgsSUFERDtBQUVaSyw0QkFBb0JMO0FBRlIsT0FBZDtBQUlBLFdBQUtpQixzQkFBTCxDQUE0QmpCLElBQTVCLEVBQWtDLElBQWxDO0FBQ0Q7Ozs2QkFFUztBQUFBOztBQUNSLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxVQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFrQixPQUFPLENBQUMsc0JBQVc4QixPQUFaLEVBQXFCLHNCQUFXQyxRQUFoQyxFQUEwQyxFQUFFQyxRQUFRLFNBQVYsRUFBMUMsRUFDdkIsS0FBSzlCLEtBQUwsQ0FBV0MsV0FBWCxLQUEyQixTQUEzQixJQUF3QzhCLE9BQU9DLFNBRHhCLENBQXpCO0FBRUUscUJBQVMsS0FBS0MsZUFBTCxDQUFxQlosSUFBckIsQ0FBMEIsSUFBMUIsRUFBZ0MsU0FBaEMsQ0FGWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLFNBREY7QUFPRTtBQUFBO0FBQUEsWUFBa0IsT0FBTyxDQUFDLHNCQUFXTyxPQUFaLEVBQXFCLHNCQUFXQyxRQUFoQyxFQUEwQ0UsT0FBT0csT0FBakQsRUFBMEQsRUFBRUosUUFBUSxTQUFWLEVBQTFELEVBQ3ZCLEtBQUs5QixLQUFMLENBQVdDLFdBQVgsS0FBMkIsT0FBM0IsSUFBc0M4QixPQUFPQyxTQUR0QixDQUF6QjtBQUVFLHNCQUFVLEtBQUtHLGNBQUwsQ0FBb0JkLElBQXBCLENBQXlCLElBQXpCLENBRlo7QUFHRSxxQkFBUztBQUFBLHFCQUFNLE9BQUtLLGVBQUwsQ0FBcUIsT0FBSzFCLEtBQUwsQ0FBV0UsWUFBaEMsQ0FBTjtBQUFBLGFBSFg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUUsbUVBQWtCLE1BQU0sS0FBS0YsS0FBTCxDQUFXRSxZQUFYLENBQXdCSixJQUFoRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFKRjtBQUtFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEYsU0FQRjtBQWVFO0FBQUE7QUFBQSxZQUFrQixPQUFPLENBQUMsc0JBQVc4QixPQUFaLEVBQXFCLHNCQUFXQyxRQUFoQyxFQUEwQ0UsT0FBT0csT0FBakQsRUFBMEQsRUFBRUosUUFBUSxTQUFWLEVBQTFELEVBQ3ZCLENBQUMsS0FBSzlCLEtBQUwsQ0FBV0MsV0FBWCxLQUEyQixLQUEzQixJQUFvQyxLQUFLRCxLQUFMLENBQVdDLFdBQVgsS0FBMkIsT0FBaEUsS0FBNEU4QixPQUFPQyxTQUQ1RCxDQUF6QjtBQUVFLHNCQUFVLEtBQUtJLGdCQUFMLENBQXNCZixJQUF0QixDQUEyQixJQUEzQixDQUZaO0FBR0UscUJBQVM7QUFBQSxxQkFBTSxPQUFLRCxxQkFBTCxDQUEyQixPQUFLcEIsS0FBTCxDQUFXRyxrQkFBdEMsQ0FBTjtBQUFBLGFBSFg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUssZUFBS0gsS0FBTCxDQUFXRyxrQkFBWCxLQUFrQyxLQUFuQyxHQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBREYsR0FFRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQU5OO0FBT0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFQRixTQWZGO0FBeUJFO0FBQUE7QUFBQSxZQUFrQixPQUFPLENBQUMsc0JBQVd5QixPQUFaLEVBQXFCLHNCQUFXQyxRQUFoQyxFQUEwQyxFQUFFQyxRQUFRLFNBQVYsRUFBMUMsRUFDdEIsS0FBSzlCLEtBQUwsQ0FBV0MsV0FBWCxLQUEyQixNQUE1QixJQUF1QzhCLE9BQU9DLFNBRHZCLENBQXpCO0FBRUUscUJBQVMsS0FBS0MsZUFBTCxDQUFxQlosSUFBckIsQ0FBMEIsSUFBMUIsRUFBZ0MsTUFBaEMsQ0FGWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHRSxtRUFBa0IsTUFBSyxNQUF2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRjtBQXpCRixPQURGO0FBaUNEOzs7c0NBRWtCZ0IsRSxFQUFJQyxJLEVBQU07QUFDM0IsVUFBSUEsS0FBSyxDQUFMLE1BQVksT0FBaEIsRUFBeUI7QUFDdkIsWUFBSUMsUUFBUSxpQkFBRUMsSUFBRixDQUFPLEtBQUszQyxNQUFaLEVBQW9CLFVBQUMwQyxLQUFEO0FBQUEsaUJBQVdBLE1BQU16QyxJQUFOLEtBQWV3QyxLQUFLLENBQUwsQ0FBMUI7QUFBQSxTQUFwQixDQUFaO0FBQ0EsYUFBS1osZUFBTCxDQUFxQmEsS0FBckI7QUFDRCxPQUhELE1BR08sSUFBSUQsS0FBSyxDQUFMLE1BQVksS0FBWixJQUFxQkEsS0FBSyxDQUFMLE1BQVksT0FBckMsRUFBOEM7QUFDbkQsYUFBS2xCLHFCQUFMLENBQTJCa0IsS0FBSyxDQUFMLENBQTNCO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsYUFBS0wsZUFBTCxDQUFxQkssS0FBSyxDQUFMLENBQXJCO0FBQ0Q7QUFDRjs7OzhDQUUwQkcsTyxFQUFTO0FBQ2xDLFVBQUlBLFFBQVEzQyxJQUFSLEtBQWlCLG1CQUFyQixFQUEwQztBQUN4QyxhQUFLbUMsZUFBTCxDQUFxQixTQUFyQjtBQUNEO0FBQ0Y7Ozs7RUFqSXdCLGdCQUFNUyxTOztBQW9JakMsSUFBSVgsU0FBUztBQUNYQyxhQUFXO0FBQ1RXLFlBQVE7QUFEQyxHQURBO0FBSVhULFdBQVM7QUFDUFUsa0JBQWM7QUFEUDtBQUpFLENBQWI7O2tCQVNlLHNCQUFPakQsWUFBUCxDIiwiZmlsZSI6IlRvb2xTZWxlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IHtcbiAgUHJpbWl0aXZlSWNvblNWRyxcbiAgUG9pbnRlclNWRyxcbiAgUGVuU1ZHLFxuICBCcnVzaFNWRyxcbiAgRHJvcFRyaWFuZ2xlXG59IGZyb20gJy4vSWNvbnMnXG5pbXBvcnQgUHNldWRvTWVudUJ1dHRvbiBmcm9tICcuL1BzZXVkb01lbnVCdXR0b24nXG5pbXBvcnQgeyBCVE5fU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL2J0blNoYXJlZCdcblxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCB7IHJlbW90ZSB9ID0gZWxlY3Ryb25cbmNvbnN0IHsgTWVudSwgTWVudUl0ZW0gfSA9IHJlbW90ZVxuY29uc3QgaXBjUmVuZGVyZXIgPSBlbGVjdHJvbi5pcGNSZW5kZXJlclxuXG5jbGFzcyBUb29sU2VsZWN0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnNoYXBlcyA9IFtcbiAgICAgIHsgbmFtZTogJ1JlY3RhbmdsZScsIHBhdGg6ICdAaGFpa3UvcGxheWVyL2NvbXBvbmVudHMvUmVjdCcgfSxcbiAgICAgIHsgbmFtZTogJ0xpbmUnLCBwYXRoOiAnQGhhaWt1L3BsYXllci9jb21wb25lbnRzL0xpbmUnIH0sXG4gICAgICB7IG5hbWU6ICdPdmFsJywgcGF0aDogJ0BoYWlrdS9wbGF5ZXIvY29tcG9uZW50cy9PdmFsJyB9XG4gICAgXVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBjdXJyZW50VG9vbDogJ3BvaW50ZXInLFxuICAgICAgY3VycmVudFNoYXBlOiB0aGlzLnNoYXBlc1swXSxcbiAgICAgIGN1cnJlbnREcmF3aW5nVG9vbDogJ3BlbidcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIGlwY1JlbmRlcmVyLm9uKCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIHRoaXMuX2hhbmRsZUdsb2JhbE1lbnUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIHRoaXMuX2hhbmRsZVdlYnNvY2tldEJyb2FkY2FzdClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcignZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCB0aGlzLl9oYW5kbGVHbG9iYWxNZW51KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlbW92ZUxpc3RlbmVyKCdicm9hZGNhc3QnLCB0aGlzLl9oYW5kbGVXZWJzb2NrZXRCcm9hZGNhc3QpXG4gIH1cblxuICBicm9hZGNhc3RUb29sU2VsZWN0aW9uIChjb21wb25lbnQsIGlzTW9kYWwpIHtcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICdkcmF3aW5nOnNldEFjdGl2ZScsIHBhcmFtczogW2NvbXBvbmVudCwgaXNNb2RhbF0gfSlcbiAgfVxuXG4gIF9zZXRDdXJyZW50VG9vbCAobmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50VG9vbDogbmFtZSB9KVxuICAgIHRoaXMuYnJvYWRjYXN0VG9vbFNlbGVjdGlvbihuYW1lLCB0cnVlKVxuICB9XG5cbiAgX3Nob3dEcmF3aW5nTWVudSAoKSB7XG4gICAgLy8gYnVpbGQgYSBjb250ZXh0IG1lbnUgZnJvbSB0aGUgc2hhcGVzIGRlZmluaXRpb25zXG4gICAgdmFyIG1lbnUgPSBuZXcgTWVudSgpXG4gICAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgIGxhYmVsOiAnUGVuJyxcbiAgICAgIGNsaWNrOiB0aGlzLl9zZXRBY3RpdmVEcmF3aW5nVG9vbC5iaW5kKHRoaXMsICdwZW4nKVxuICAgIH0pKVxuICAgIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ0JydXNoJyxcbiAgICAgIGNsaWNrOiB0aGlzLl9zZXRBY3RpdmVEcmF3aW5nVG9vbC5iaW5kKHRoaXMsICdicnVzaCcpXG4gICAgfSkpXG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpXG4gIH1cblxuICBfc2hvd1NoYXBlTWVudSAoKSB7XG4gICAgLy8gYnVpbGQgYSBjb250ZXh0IG1lbnUgZnJvbSB0aGUgc2hhcGVzIGRlZmluaXRpb25zXG4gICAgdmFyIG1lbnUgPSBuZXcgTWVudSgpXG4gICAgdGhpcy5zaGFwZXMuZm9yRWFjaCgoZGVmKSA9PiB7XG4gICAgICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogZGVmLm5hbWUsXG4gICAgICAgIGNsaWNrOiB0aGlzLl9zZXRBY3RpdmVTaGFwZS5iaW5kKHRoaXMsIGRlZilcbiAgICAgIH0pKVxuICAgIH0pXG5cbiAgICBtZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpXG4gIH1cblxuICBfc2V0QWN0aXZlU2hhcGUgKHNoYXBlRGVmKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VG9vbDogJ3NoYXBlJyxcbiAgICAgIGN1cnJlbnRTaGFwZTogc2hhcGVEZWZcbiAgICB9KVxuICAgIHRoaXMuYnJvYWRjYXN0VG9vbFNlbGVjdGlvbihzaGFwZURlZi5wYXRoLCBmYWxzZSlcbiAgfVxuXG4gIF9zZXRBY3RpdmVEcmF3aW5nVG9vbCAobmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFRvb2w6IG5hbWUsXG4gICAgICBjdXJyZW50RHJhd2luZ1Rvb2w6IG5hbWVcbiAgICB9KVxuICAgIHRoaXMuYnJvYWRjYXN0VG9vbFNlbGVjdGlvbihuYW1lLCB0cnVlKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3NlbGVjdG9yJz5cbiAgICAgICAgPFBzZXVkb01lbnVCdXR0b24gc3R5bGU9e1tCVE5fU1RZTEVTLmJ0bkljb24sIEJUTl9TVFlMRVMubGVmdEJ0bnMsIHsgY3Vyc29yOiAncG9pbnRlcicgfSxcbiAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRUb29sID09PSAncG9pbnRlcicgJiYgU1RZTEVTLmJ0bkFjdGl2ZV19XG4gICAgICAgICAgb25DbGljaz17dGhpcy5fc2V0Q3VycmVudFRvb2wuYmluZCh0aGlzLCAncG9pbnRlcicpfT5cbiAgICAgICAgICA8UG9pbnRlclNWRyAvPlxuICAgICAgICA8L1BzZXVkb01lbnVCdXR0b24+XG5cbiAgICAgICAgPFBzZXVkb01lbnVCdXR0b24gc3R5bGU9e1tCVE5fU1RZTEVTLmJ0bkljb24sIEJUTl9TVFlMRVMubGVmdEJ0bnMsIFNUWUxFUy5idG5Ecm9wLCB7IGN1cnNvcjogJ3BvaW50ZXInIH0sXG4gICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VG9vbCA9PT0gJ3NoYXBlJyAmJiBTVFlMRVMuYnRuQWN0aXZlXX1cbiAgICAgICAgICBvbkV4cGFuZD17dGhpcy5fc2hvd1NoYXBlTWVudS5iaW5kKHRoaXMpfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuX3NldEFjdGl2ZVNoYXBlKHRoaXMuc3RhdGUuY3VycmVudFNoYXBlKX0+XG4gICAgICAgICAgPFByaW1pdGl2ZUljb25TVkcgdHlwZT17dGhpcy5zdGF0ZS5jdXJyZW50U2hhcGUubmFtZX0gLz5cbiAgICAgICAgICA8RHJvcFRyaWFuZ2xlIC8+XG4gICAgICAgIDwvUHNldWRvTWVudUJ1dHRvbj5cblxuICAgICAgICA8UHNldWRvTWVudUJ1dHRvbiBzdHlsZT17W0JUTl9TVFlMRVMuYnRuSWNvbiwgQlROX1NUWUxFUy5sZWZ0QnRucywgU1RZTEVTLmJ0bkRyb3AsIHsgY3Vyc29yOiAncG9pbnRlcicgfSxcbiAgICAgICAgICAodGhpcy5zdGF0ZS5jdXJyZW50VG9vbCA9PT0gJ3BlbicgfHwgdGhpcy5zdGF0ZS5jdXJyZW50VG9vbCA9PT0gJ2JydXNoJykgJiYgU1RZTEVTLmJ0bkFjdGl2ZV19XG4gICAgICAgICAgb25FeHBhbmQ9e3RoaXMuX3Nob3dEcmF3aW5nTWVudS5iaW5kKHRoaXMpfVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuX3NldEFjdGl2ZURyYXdpbmdUb29sKHRoaXMuc3RhdGUuY3VycmVudERyYXdpbmdUb29sKX0+XG4gICAgICAgICAgeyAodGhpcy5zdGF0ZS5jdXJyZW50RHJhd2luZ1Rvb2wgPT09ICdwZW4nKVxuICAgICAgICAgICAgPyA8UGVuU1ZHIC8+XG4gICAgICAgICAgICA6IDxCcnVzaFNWRyAvPiB9XG4gICAgICAgICAgPERyb3BUcmlhbmdsZSAvPlxuICAgICAgICA8L1BzZXVkb01lbnVCdXR0b24+XG5cbiAgICAgICAgPFBzZXVkb01lbnVCdXR0b24gc3R5bGU9e1tCVE5fU1RZTEVTLmJ0bkljb24sIEJUTl9TVFlMRVMubGVmdEJ0bnMsIHsgY3Vyc29yOiAncG9pbnRlcicgfSxcbiAgICAgICAgICAodGhpcy5zdGF0ZS5jdXJyZW50VG9vbCA9PT0gJ3RleHQnKSAmJiBTVFlMRVMuYnRuQWN0aXZlXX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLl9zZXRDdXJyZW50VG9vbC5iaW5kKHRoaXMsICd0ZXh0Jyl9PlxuICAgICAgICAgIDxQcmltaXRpdmVJY29uU1ZHIHR5cGU9J1RleHQnIC8+XG4gICAgICAgIDwvUHNldWRvTWVudUJ1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIF9oYW5kbGVHbG9iYWxNZW51IChldiwgdG9vbCkge1xuICAgIGlmICh0b29sWzBdID09PSAnc2hhcGUnKSB7XG4gICAgICB2YXIgc2hhcGUgPSBfLmZpbmQodGhpcy5zaGFwZXMsIChzaGFwZSkgPT4gc2hhcGUubmFtZSA9PT0gdG9vbFsxXSlcbiAgICAgIHRoaXMuX3NldEFjdGl2ZVNoYXBlKHNoYXBlKVxuICAgIH0gZWxzZSBpZiAodG9vbFswXSA9PT0gJ3BlbicgfHwgdG9vbFswXSA9PT0gJ2JydXNoJykge1xuICAgICAgdGhpcy5fc2V0QWN0aXZlRHJhd2luZ1Rvb2wodG9vbFswXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0Q3VycmVudFRvb2wodG9vbFswXSlcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlV2Vic29ja2V0QnJvYWRjYXN0IChtZXNzYWdlKSB7XG4gICAgaWYgKG1lc3NhZ2UubmFtZSA9PT0gJ2RyYXdpbmc6Y29tcGxldGVkJykge1xuICAgICAgdGhpcy5fc2V0Q3VycmVudFRvb2woJ3BvaW50ZXInKVxuICAgIH1cbiAgfVxufVxuXG52YXIgU1RZTEVTID0ge1xuICBidG5BY3RpdmU6IHtcbiAgICBib3JkZXI6ICcxcHggc29saWQgd2hpdGUnXG4gIH0sXG4gIGJ0bkRyb3A6IHtcbiAgICBib3JkZXJSYWRpdXM6ICczcHggM3B4IDBweCdcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oVG9vbFNlbGVjdG9yKVxuIl19