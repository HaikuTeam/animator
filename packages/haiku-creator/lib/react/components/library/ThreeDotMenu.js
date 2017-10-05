'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsxFileName = 'src/react/components/library/ThreeDotMenu.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _reactPopover = require('react-popover');

var _reactPopover2 = _interopRequireDefault(_reactPopover);

var _Icons = require('./../Icons');

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
    marginLeft: '5px'
  },
  popover: {
    container: {
      listStyle: 'none',
      padding: '15px',
      margin: '0',
      backgroundColor: _Palette2.default.DARKER_GRAY,
      minWidth: '150px'
    },
    item: {
      textAlign: 'left',
      marginBottom: '5px',
      color: _Palette2.default.ROCK,
      ':hover': {
        backgroundColor: _Palette2.default.DARK_GRAY
      }
    }
  }
};

var PopoverBody = function PopoverBody() {
  var items = [{ name: 'Open Sketch', onClick: function onClick() {
      console.log('click');
    }, icon: _Icons.SketchIconSVG }, { name: 'Remove' }];

  var renderedItems = items.map(function (_ref, id) {
    var name = _ref.name,
        icon = _ref.icon,
        onClick = _ref.onClick;

    return _react2.default.createElement(
      'li',
      { key: id, onClick: onClick, __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: undefined
      },
      _react2.default.createElement(
        'button',
        { style: STYLES.popover.item, __source: {
            fileName: _jsxFileName,
            lineNumber: 44
          },
          __self: undefined
        },
        icon && _react2.default.createElement(icon),
        name
      )
    );
  });

  return _react2.default.createElement(
    'ul',
    { style: STYLES.popover.container, __source: {
        fileName: _jsxFileName,
        lineNumber: 53
      },
      __self: undefined
    },
    renderedItems
  );
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
    key: 'render',
    value: function render() {
      var isPopoverOpen = this.state.isPopoverOpen;


      return _react2.default.createElement(
        'div',
        { style: STYLES.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 84
          },
          __self: this
        },
        _react2.default.createElement(
          _reactPopover2.default,
          {
            onOuterAction: this.closePopover,
            isOpen: isPopoverOpen,
            place: 'left',
            tipSize: 0.1,
            body: _react2.default.createElement(PopoverBody, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 90
              },
              __self: this
            }),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 85
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 92
              },
              __self: this
            },
            _react2.default.createElement(
              'button',
              { style: STYLES.dots, onClick: this.openPopover, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 93
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvVGhyZWVEb3RNZW51LmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsImRvdHMiLCJjb2xvciIsIlJPQ0siLCJ0cmFuc2Zvcm0iLCJjb250YWluZXIiLCJkaXNwbGF5IiwibWFyZ2luTGVmdCIsInBvcG92ZXIiLCJsaXN0U3R5bGUiLCJwYWRkaW5nIiwibWFyZ2luIiwiYmFja2dyb3VuZENvbG9yIiwiREFSS0VSX0dSQVkiLCJtaW5XaWR0aCIsIml0ZW0iLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Cb3R0b20iLCJEQVJLX0dSQVkiLCJQb3BvdmVyQm9keSIsIml0ZW1zIiwibmFtZSIsIm9uQ2xpY2siLCJjb25zb2xlIiwibG9nIiwiaWNvbiIsInJlbmRlcmVkSXRlbXMiLCJtYXAiLCJpZCIsImNyZWF0ZUVsZW1lbnQiLCJUaHJlZURvdE1lbnUiLCJwcm9wcyIsIm9wZW5Qb3BvdmVyIiwiYmluZCIsImNsb3NlUG9wb3ZlciIsInN0YXRlIiwiaXNQb3BvdmVyT3BlbiIsImV2dCIsInN0b3BQcm9wYWdhdGlvbiIsInNldFN0YXRlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsUUFBTTtBQUNKQyxXQUFPLGtCQUFRQyxJQURYO0FBRUpDLGVBQVc7QUFGUCxHQURPO0FBS2JDLGFBQVc7QUFDVEMsYUFBUyxjQURBO0FBRVRDLGdCQUFZO0FBRkgsR0FMRTtBQVNiQyxXQUFTO0FBQ1BILGVBQVc7QUFDVEksaUJBQVcsTUFERjtBQUVUQyxlQUFTLE1BRkE7QUFHVEMsY0FBUSxHQUhDO0FBSVRDLHVCQUFpQixrQkFBUUMsV0FKaEI7QUFLVEMsZ0JBQVU7QUFMRCxLQURKO0FBUVBDLFVBQU07QUFDSkMsaUJBQVcsTUFEUDtBQUVKQyxvQkFBYyxLQUZWO0FBR0pmLGFBQU8sa0JBQVFDLElBSFg7QUFJSixnQkFBVTtBQUNSUyx5QkFBaUIsa0JBQVFNO0FBRGpCO0FBSk47QUFSQztBQVRJLENBQWY7O0FBNEJBLElBQU1DLGNBQWMsU0FBZEEsV0FBYyxHQUFNO0FBQ3hCLE1BQU1DLFFBQVEsQ0FDWixFQUFDQyxNQUFNLGFBQVAsRUFBc0JDLFNBQVMsbUJBQU07QUFBQ0MsY0FBUUMsR0FBUixDQUFZLE9BQVo7QUFBcUIsS0FBM0QsRUFBNkRDLDBCQUE3RCxFQURZLEVBRVosRUFBQ0osTUFBTSxRQUFQLEVBRlksQ0FBZDs7QUFLQSxNQUFNSyxnQkFBZ0JOLE1BQU1PLEdBQU4sQ0FBVSxnQkFBMEJDLEVBQTFCLEVBQWlDO0FBQUEsUUFBOUJQLElBQThCLFFBQTlCQSxJQUE4QjtBQUFBLFFBQXhCSSxJQUF3QixRQUF4QkEsSUFBd0I7QUFBQSxRQUFsQkgsT0FBa0IsUUFBbEJBLE9BQWtCOztBQUMvRCxXQUNFO0FBQUE7QUFBQSxRQUFJLEtBQUtNLEVBQVQsRUFBYSxTQUFTTixPQUF0QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsVUFBUSxPQUFPdEIsT0FBT1EsT0FBUCxDQUFlTyxJQUE5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDR1UsZ0JBQVEsZ0JBQU1JLGFBQU4sQ0FBb0JKLElBQXBCLENBRFg7QUFFR0o7QUFGSDtBQURGLEtBREY7QUFRRCxHQVRxQixDQUF0Qjs7QUFXQSxTQUNFO0FBQUE7QUFBQSxNQUFJLE9BQU9yQixPQUFPUSxPQUFQLENBQWVILFNBQTFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHcUI7QUFESCxHQURGO0FBS0QsQ0F0QkQ7O0lBd0JNSSxZOzs7QUFDSix3QkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLDRIQUNaQSxLQURZOztBQUdsQixVQUFLQyxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJDLElBQWpCLE9BQW5CO0FBQ0EsVUFBS0MsWUFBTCxHQUFvQixNQUFLQSxZQUFMLENBQWtCRCxJQUFsQixPQUFwQjs7QUFFQSxVQUFLRSxLQUFMLEdBQWE7QUFDWEMscUJBQWU7QUFESixLQUFiO0FBTmtCO0FBU25COzs7O2dDQUVZQyxHLEVBQUs7QUFDaEJBLFVBQUlDLGVBQUo7QUFDQSxXQUFLQyxRQUFMLENBQWMsRUFBQ0gsZUFBZSxJQUFoQixFQUFkO0FBQ0Q7OzttQ0FFZTtBQUNkLFdBQUtHLFFBQUwsQ0FBYyxFQUFDSCxlQUFlLEtBQWhCLEVBQWQ7QUFDRDs7OzZCQUVTO0FBQUEsVUFDREEsYUFEQyxHQUNnQixLQUFLRCxLQURyQixDQUNEQyxhQURDOzs7QUFHUixhQUNFO0FBQUE7QUFBQSxVQUFLLE9BQU9wQyxPQUFPSyxTQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSwyQkFBZSxLQUFLNkIsWUFEdEI7QUFFRSxvQkFBUUUsYUFGVjtBQUdFLG1CQUFNLE1BSFI7QUFJRSxxQkFBUyxHQUpYO0FBS0Usa0JBQU0sOEJBQUMsV0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQUxSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGdCQUFRLE9BQU9wQyxPQUFPQyxJQUF0QixFQUE0QixTQUFTLEtBQUsrQixXQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUFQRjtBQURGLE9BREY7QUFlRDs7OztFQXZDd0IsZ0JBQU1RLFM7O2tCQTBDbEIsc0JBQU9WLFlBQVAsQyIsImZpbGUiOiJUaHJlZURvdE1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4uL1BhbGV0dGUnXG5pbXBvcnQgUG9wb3ZlciBmcm9tICdyZWFjdC1wb3BvdmVyJ1xuaW1wb3J0IHsgQ29sbGFwc2VDaGV2cm9uUmlnaHRTVkcsIENvbGxhcHNlQ2hldnJvbkRvd25TVkcsIFNrZXRjaEljb25TVkcsIEZvbGRlckljb25TVkcgfSBmcm9tICcuLy4uL0ljb25zJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGRvdHM6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHRyYW5zZm9ybTogJ3JvdGF0ZSg5MGRlZyknXG4gIH0sXG4gIGNvbnRhaW5lcjoge1xuICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgIG1hcmdpbkxlZnQ6ICc1cHgnXG4gIH0sXG4gIHBvcG92ZXI6IHtcbiAgICBjb250YWluZXI6IHtcbiAgICAgIGxpc3RTdHlsZTogJ25vbmUnLFxuICAgICAgcGFkZGluZzogJzE1cHgnLFxuICAgICAgbWFyZ2luOiAnMCcsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICBtaW5XaWR0aDogJzE1MHB4J1xuICAgIH0sXG4gICAgaXRlbToge1xuICAgICAgdGV4dEFsaWduOiAnbGVmdCcsXG4gICAgICBtYXJnaW5Cb3R0b206ICc1cHgnLFxuICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICc6aG92ZXInOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLX0dSQVlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY29uc3QgUG9wb3ZlckJvZHkgPSAoKSA9PiB7XG4gIGNvbnN0IGl0ZW1zID0gW1xuICAgIHtuYW1lOiAnT3BlbiBTa2V0Y2gnLCBvbkNsaWNrOiAoKSA9PiB7Y29uc29sZS5sb2coJ2NsaWNrJyl9LCBpY29uOiBTa2V0Y2hJY29uU1ZHfSxcbiAgICB7bmFtZTogJ1JlbW92ZSd9XG4gIF1cblxuICBjb25zdCByZW5kZXJlZEl0ZW1zID0gaXRlbXMubWFwKCh7IG5hbWUsIGljb24sIG9uQ2xpY2sgfSwgaWQpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpIGtleT17aWR9IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMucG9wb3Zlci5pdGVtfT5cbiAgICAgICAgICB7aWNvbiAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KGljb24pfVxuICAgICAgICAgIHtuYW1lfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvbGk+XG4gICAgKVxuICB9KVxuXG4gIHJldHVybiAoXG4gICAgPHVsIHN0eWxlPXtTVFlMRVMucG9wb3Zlci5jb250YWluZXJ9PlxuICAgICAge3JlbmRlcmVkSXRlbXN9XG4gICAgPC91bD5cbiAgKVxufVxuXG5jbGFzcyBUaHJlZURvdE1lbnUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMub3BlblBvcG92ZXIgPSB0aGlzLm9wZW5Qb3BvdmVyLmJpbmQodGhpcylcbiAgICB0aGlzLmNsb3NlUG9wb3ZlciA9IHRoaXMuY2xvc2VQb3BvdmVyLmJpbmQodGhpcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc1BvcG92ZXJPcGVuOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIG9wZW5Qb3BvdmVyIChldnQpIHtcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB0aGlzLnNldFN0YXRlKHtpc1BvcG92ZXJPcGVuOiB0cnVlfSlcbiAgfVxuXG4gIGNsb3NlUG9wb3ZlciAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNQb3BvdmVyT3BlbjogZmFsc2V9KVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7aXNQb3BvdmVyT3Blbn0gPSB0aGlzLnN0YXRlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+XG4gICAgICAgIDxQb3BvdmVyXG4gICAgICAgICAgb25PdXRlckFjdGlvbj17dGhpcy5jbG9zZVBvcG92ZXJ9XG4gICAgICAgICAgaXNPcGVuPXtpc1BvcG92ZXJPcGVufVxuICAgICAgICAgIHBsYWNlPVwibGVmdFwiXG4gICAgICAgICAgdGlwU2l6ZT17MC4xfVxuICAgICAgICAgIGJvZHk9ezxQb3BvdmVyQm9keSAvPn1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuZG90c30gb25DbGljaz17dGhpcy5vcGVuUG9wb3Zlcn0+JiM1ODY3OyYjNTg2NzsmIzU4Njc7PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvUG9wb3Zlcj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oVGhyZWVEb3RNZW51KVxuIl19