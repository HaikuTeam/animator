'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/ThreeDotMenu.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _reactPopover = require('react-popover');

var _reactPopover2 = _interopRequireDefault(_reactPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  dots: {
    color: _Palette2.default.ROCK,
    transform: 'rotate(90deg)'
  },
  container: {
    display: 'inline-block',
    marginLeft: '8px',
    width: '20px',
    textAlign: 'center',
    borderRadius: '3px',
    hover: {
      backgroundColor: _Palette2.default.GRAY
    }
  },
  popover: {
    container: {
      listStyle: 'none',
      padding: '15px 15px 5px',
      margin: '0',
      backgroundColor: _Palette2.default.FATHER_COAL,
      minWidth: '150px',
      borderRadius: '3px'
    },
    item: {
      display: 'flex',
      textAlign: 'left',
      alignItems: 'center',
      marginBottom: '10px',
      color: _Palette2.default.ROCK
    },
    icon: {
      width: '16px',
      display: 'inline-block',
      textAlign: 'center'
    },
    text: {
      display: 'inline-block',
      marginLeft: '8px'
    }
  }
};

var ThreeDotMenu = function (_React$Component) {
  _inherits(ThreeDotMenu, _React$Component);

  function ThreeDotMenu(props) {
    _classCallCheck(this, ThreeDotMenu);

    var _this = _possibleConstructorReturn(this, (ThreeDotMenu.__proto__ || Object.getPrototypeOf(ThreeDotMenu)).call(this, props));

    _this.openPopover = _this.openPopover.bind(_this);
    _this.closePopover = _this.closePopover.bind(_this);

    _this.state = {
      isPopoverOpen: false
    };
    return _this;
  }

  _createClass(ThreeDotMenu, [{
    key: 'openPopover',
    value: function openPopover(evt) {
      evt.stopPropagation();
      this.setState({ isPopoverOpen: true });
    }
  }, {
    key: 'closePopover',
    value: function closePopover() {
      this.setState({ isPopoverOpen: false });
    }
  }, {
    key: 'renderMenuItems',
    value: function renderMenuItems() {
      var _this2 = this;

      return _react2.default.createElement(
        'ul',
        { style: STYLES.popover.container, onClick: this.closePopover, __source: {
            fileName: _jsxFileName,
            lineNumber: 72
          },
          __self: this
        },
        this.props.items.map(function (_ref, id) {
          var label = _ref.label,
              icon = _ref.icon,
              onClick = _ref.onClick;

          return _react2.default.createElement(
            'li',
            { key: id, onClick: onClick, __source: {
                fileName: _jsxFileName,
                lineNumber: 75
              },
              __self: _this2
            },
            _react2.default.createElement(
              'button',
              { style: STYLES.popover.item, key: id, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 76
                },
                __self: _this2
              },
              _react2.default.createElement(
                'span',
                { style: STYLES.popover.icon, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 77
                  },
                  __self: _this2
                },
                icon && _react2.default.createElement(icon)
              ),
              _react2.default.createElement(
                'span',
                { style: STYLES.popover.text, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 80
                  },
                  __self: _this2
                },
                label
              )
            )
          );
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          style: [STYLES.container, this.props.isHovered ? STYLES.container.hover : {}],
          __source: {
            fileName: _jsxFileName,
            lineNumber: 93
          },
          __self: this
        },
        _react2.default.createElement(
          _reactPopover2.default,
          {
            onOuterAction: this.closePopover,
            isOpen: this.state.isPopoverOpen,
            place: 'below',
            body: this.renderMenuItems(),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 99
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 105
              },
              __self: this
            },
            _react2.default.createElement(
              'button',
              { style: STYLES.dots, onClick: this.openPopover, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 106
                },
                __self: this
              },
              '\u16EB\u16EB\u16EB'
            )
          )
        )
      );
    }
  }]);

  return ThreeDotMenu;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(ThreeDotMenu);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RocmVlRG90TWVudS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJkb3RzIiwiY29sb3IiLCJST0NLIiwidHJhbnNmb3JtIiwiY29udGFpbmVyIiwiZGlzcGxheSIsIm1hcmdpbkxlZnQiLCJ3aWR0aCIsInRleHRBbGlnbiIsImJvcmRlclJhZGl1cyIsImhvdmVyIiwiYmFja2dyb3VuZENvbG9yIiwiR1JBWSIsInBvcG92ZXIiLCJsaXN0U3R5bGUiLCJwYWRkaW5nIiwibWFyZ2luIiwiRkFUSEVSX0NPQUwiLCJtaW5XaWR0aCIsIml0ZW0iLCJhbGlnbkl0ZW1zIiwibWFyZ2luQm90dG9tIiwiaWNvbiIsInRleHQiLCJUaHJlZURvdE1lbnUiLCJwcm9wcyIsIm9wZW5Qb3BvdmVyIiwiYmluZCIsImNsb3NlUG9wb3ZlciIsInN0YXRlIiwiaXNQb3BvdmVyT3BlbiIsImV2dCIsInN0b3BQcm9wYWdhdGlvbiIsInNldFN0YXRlIiwiaXRlbXMiLCJtYXAiLCJpZCIsImxhYmVsIiwib25DbGljayIsImNyZWF0ZUVsZW1lbnQiLCJpc0hvdmVyZWQiLCJyZW5kZXJNZW51SXRlbXMiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLFFBQU07QUFDSkMsV0FBTyxrQkFBUUMsSUFEWDtBQUVKQyxlQUFXO0FBRlAsR0FETztBQUtiQyxhQUFXO0FBQ1RDLGFBQVMsY0FEQTtBQUVUQyxnQkFBWSxLQUZIO0FBR1RDLFdBQU8sTUFIRTtBQUlUQyxlQUFXLFFBSkY7QUFLVEMsa0JBQWMsS0FMTDtBQU1UQyxXQUFPO0FBQ0xDLHVCQUFpQixrQkFBUUM7QUFEcEI7QUFORSxHQUxFO0FBZWJDLFdBQVM7QUFDUFQsZUFBVztBQUNUVSxpQkFBVyxNQURGO0FBRVRDLGVBQVMsZUFGQTtBQUdUQyxjQUFRLEdBSEM7QUFJVEwsdUJBQWlCLGtCQUFRTSxXQUpoQjtBQUtUQyxnQkFBVSxPQUxEO0FBTVRULG9CQUFjO0FBTkwsS0FESjtBQVNQVSxVQUFNO0FBQ0pkLGVBQVMsTUFETDtBQUVKRyxpQkFBVyxNQUZQO0FBR0pZLGtCQUFZLFFBSFI7QUFJSkMsb0JBQWMsTUFKVjtBQUtKcEIsYUFBTyxrQkFBUUM7QUFMWCxLQVRDO0FBZ0JQb0IsVUFBTTtBQUNKZixhQUFPLE1BREg7QUFFSkYsZUFBUyxjQUZMO0FBR0pHLGlCQUFXO0FBSFAsS0FoQkM7QUFxQlBlLFVBQU07QUFDSmxCLGVBQVMsY0FETDtBQUVKQyxrQkFBWTtBQUZSO0FBckJDO0FBZkksQ0FBZjs7SUEyQ01rQixZOzs7QUFDSix3QkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLDRIQUNaQSxLQURZOztBQUdsQixVQUFLQyxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJDLElBQWpCLE9BQW5CO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCRCxJQUFsQixPQUFwQjs7QUFFQSxVQUFLRSxLQUFMLEdBQWE7QUFDWEMscUJBQWU7QUFESixLQUFiO0FBTmtCO0FBU25COzs7O2dDQUVZQyxHLEVBQUs7QUFDaEJBLFVBQUlDLGVBQUo7QUFDQSxXQUFLQyxRQUFMLENBQWMsRUFBRUgsZUFBZSxJQUFqQixFQUFkO0FBQ0Q7OzttQ0FFZTtBQUNkLFdBQUtHLFFBQUwsQ0FBYyxFQUFFSCxlQUFlLEtBQWpCLEVBQWQ7QUFDRDs7O3NDQUVrQjtBQUFBOztBQUNqQixhQUNFO0FBQUE7QUFBQSxVQUFJLE9BQU8vQixPQUFPYyxPQUFQLENBQWVULFNBQTFCLEVBQXFDLFNBQVMsS0FBS3dCLFlBQW5EO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGFBQUtILEtBQUwsQ0FBV1MsS0FBWCxDQUFpQkMsR0FBakIsQ0FBcUIsZ0JBQTJCQyxFQUEzQixFQUFrQztBQUFBLGNBQS9CQyxLQUErQixRQUEvQkEsS0FBK0I7QUFBQSxjQUF4QmYsSUFBd0IsUUFBeEJBLElBQXdCO0FBQUEsY0FBbEJnQixPQUFrQixRQUFsQkEsT0FBa0I7O0FBQ3RELGlCQUNFO0FBQUE7QUFBQSxjQUFJLEtBQUtGLEVBQVQsRUFBYSxTQUFTRSxPQUF0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsZ0JBQVEsT0FBT3ZDLE9BQU9jLE9BQVAsQ0FBZU0sSUFBOUIsRUFBb0MsS0FBS2lCLEVBQXpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxrQkFBTSxPQUFPckMsT0FBT2MsT0FBUCxDQUFlUyxJQUE1QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDR0Esd0JBQVEsZ0JBQU1pQixhQUFOLENBQW9CakIsSUFBcEI7QUFEWCxlQURGO0FBSUU7QUFBQTtBQUFBLGtCQUFNLE9BQU92QixPQUFPYyxPQUFQLENBQWVVLElBQTVCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHYztBQURIO0FBSkY7QUFERixXQURGO0FBWUQsU0FiQTtBQURILE9BREY7QUFrQkQ7Ozs2QkFFUztBQUNSLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsaUJBQU8sQ0FDTHRDLE9BQU9LLFNBREYsRUFFTCxLQUFLcUIsS0FBTCxDQUFXZSxTQUFYLEdBQXVCekMsT0FBT0ssU0FBUCxDQUFpQk0sS0FBeEMsR0FBZ0QsRUFGM0MsQ0FEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1FO0FBQUE7QUFBQTtBQUNFLDJCQUFlLEtBQUtrQixZQUR0QjtBQUVFLG9CQUFRLEtBQUtDLEtBQUwsQ0FBV0MsYUFGckI7QUFHRSxtQkFBTSxPQUhSO0FBSUUsa0JBQU0sS0FBS1csZUFBTCxFQUpSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGdCQUFRLE9BQU8xQyxPQUFPQyxJQUF0QixFQUE0QixTQUFTLEtBQUswQixXQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFORjtBQU5GLE9BREY7QUFxQkQ7Ozs7RUFoRXdCLGdCQUFNZ0IsUzs7a0JBbUVsQixzQkFBT2xCLFlBQVAsQyIsImZpbGUiOiJUaHJlZURvdE1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCBQb3BvdmVyIGZyb20gJ3JlYWN0LXBvcG92ZXInXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgZG90czoge1xuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgdHJhbnNmb3JtOiAncm90YXRlKDkwZGVnKSdcbiAgfSxcbiAgY29udGFpbmVyOiB7XG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgbWFyZ2luTGVmdDogJzhweCcsXG4gICAgd2lkdGg6ICcyMHB4JyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGJvcmRlclJhZGl1czogJzNweCcsXG4gICAgaG92ZXI6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZXG4gICAgfVxuICB9LFxuICBwb3BvdmVyOiB7XG4gICAgY29udGFpbmVyOiB7XG4gICAgICBsaXN0U3R5bGU6ICdub25lJyxcbiAgICAgIHBhZGRpbmc6ICcxNXB4IDE1cHggNXB4JyxcbiAgICAgIG1hcmdpbjogJzAnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgbWluV2lkdGg6ICcxNTBweCcsXG4gICAgICBib3JkZXJSYWRpdXM6ICczcHgnXG4gICAgfSxcbiAgICBpdGVtOiB7XG4gICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcbiAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgbWFyZ2luQm90dG9tOiAnMTBweCcsXG4gICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gICAgfSxcbiAgICBpY29uOiB7XG4gICAgICB3aWR0aDogJzE2cHgnLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gICAgfSxcbiAgICB0ZXh0OiB7XG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIG1hcmdpbkxlZnQ6ICc4cHgnXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRocmVlRG90TWVudSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5vcGVuUG9wb3ZlciA9IHRoaXMub3BlblBvcG92ZXIuYmluZCh0aGlzKVxuICAgIHRoaXMuY2xvc2VQb3BvdmVyID0gdGhpcy5jbG9zZVBvcG92ZXIuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzUG9wb3Zlck9wZW46IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgb3BlblBvcG92ZXIgKGV2dCkge1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BvcG92ZXJPcGVuOiB0cnVlIH0pXG4gIH1cblxuICBjbG9zZVBvcG92ZXIgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BvcG92ZXJPcGVuOiBmYWxzZSB9KVxuICB9XG5cbiAgcmVuZGVyTWVudUl0ZW1zICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHVsIHN0eWxlPXtTVFlMRVMucG9wb3Zlci5jb250YWluZXJ9IG9uQ2xpY2s9e3RoaXMuY2xvc2VQb3BvdmVyfT5cbiAgICAgICAge3RoaXMucHJvcHMuaXRlbXMubWFwKCh7IGxhYmVsLCBpY29uLCBvbkNsaWNrIH0sIGlkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxsaSBrZXk9e2lkfSBvbkNsaWNrPXtvbkNsaWNrfT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLnBvcG92ZXIuaXRlbX0ga2V5PXtpZH0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5wb3BvdmVyLmljb259PlxuICAgICAgICAgICAgICAgICAge2ljb24gJiYgUmVhY3QuY3JlYXRlRWxlbWVudChpY29uKX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5wb3BvdmVyLnRleHR9PlxuICAgICAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L3VsPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e1tcbiAgICAgICAgICBTVFlMRVMuY29udGFpbmVyLFxuICAgICAgICAgIHRoaXMucHJvcHMuaXNIb3ZlcmVkID8gU1RZTEVTLmNvbnRhaW5lci5ob3ZlciA6IHt9XG4gICAgICAgIF19XG4gICAgICA+XG4gICAgICAgIDxQb3BvdmVyXG4gICAgICAgICAgb25PdXRlckFjdGlvbj17dGhpcy5jbG9zZVBvcG92ZXJ9XG4gICAgICAgICAgaXNPcGVuPXt0aGlzLnN0YXRlLmlzUG9wb3Zlck9wZW59XG4gICAgICAgICAgcGxhY2U9XCJiZWxvd1wiXG4gICAgICAgICAgYm9keT17dGhpcy5yZW5kZXJNZW51SXRlbXMoKX1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuZG90c30gb25DbGljaz17dGhpcy5vcGVuUG9wb3Zlcn0+XG4gICAgICAgICAgICAgICYjNTg2NzsmIzU4Njc7JiM1ODY3O1xuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUG9wb3Zlcj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oVGhyZWVEb3RNZW51KVxuIl19