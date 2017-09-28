'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/library/ThreeDotMenu.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  container: {
    position: 'absolute',
    right: 15
  },
  popover: {
    position: 'fixed',
    width: 100,
    zIndex: 10000,
    height: 100,
    backgroundColor: _Palette2.default.DARK_GRAY,
    color: _Palette2.default.ROCK
  }

  // 2017-02-08: ZB started building this menu for library items, to
  //             give a non-context-menu way to open files in Sketch or
  //             Finder.  Decided that building the popover
  //             was too heavy-weight (either relies on bloated third-party
  //             libraries or requires a lot of wheel-reinventing.)
  //
  //             Leaving this code here in case someone else wants to pick this up.
  //             Tether (http://tether.io/) may be a useful next step.
  //
  //             Might make sense to find a way to patch into the same
  //             logic that's being used for the custom context menu, and
  //             just programatically trigger that context menu here

};
var ThreeDotMenu = function (_React$Component) {
  _inherits(ThreeDotMenu, _React$Component);

  function ThreeDotMenu(props) {
    _classCallCheck(this, ThreeDotMenu);

    var _this = _possibleConstructorReturn(this, (ThreeDotMenu.__proto__ || Object.getPrototypeOf(ThreeDotMenu)).call(this, props));

    _this.state = {
      popoverVisible: false,
      popoverX: 0,
      popoverY: 0,
      refReady: false
    };
    _this.handleThreeDotClick = _this.handleThreeDotClick.bind(_this);
    return _this;
  }

  _createClass(ThreeDotMenu, [{
    key: 'handleThreeDotClick',
    value: function handleThreeDotClick(evt) {
      var rect = this.refs.threeDots.getBoundingClientRect();

      var x = rect.left + rect.width;
      var y = rect.top;
      this.setState({
        popoverVisible: !this.state.popoverVisible,
        popoverX: x,
        popoverY: y,
        refReady: false
      });
    }
  }, {
    key: 'getDynamicPopoverStyle',
    value: function getDynamicPopoverStyle() {
      var offset = this.calcPopoverYOffsetFromDOMNode(this.popoverRef);
      return {
        top: this.state.popoverY + offset,
        left: this.state.popoverX
      };
    }
  }, {
    key: 'calcPopoverYOffsetFromDOMNode',
    value: function calcPopoverYOffsetFromDOMNode(node) {
      if (!node) return 0;
      return 10 - node.getBoundingClientRect().height / 2;
    }

    // &#5867; for bigger bullets
    // &#183; for smaller bullets

  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'span',
        { ref: 'threeDots', onClick: this.handleThreeDotClick, className: 'container', style: STYLES.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 75
          },
          __self: this
        },
        '\u16EB \u16EB \u16EB',
        this.state.popoverVisible ? _react2.default.createElement(
          'div',
          { ref: function ref(elem) {
              if (!_this2.state.refReady) {
                _this2.setState({ refReady: true });
                _this2.popoverRef = elem;
              }
            },
            style: [STYLES.popover, this.getDynamicPopoverStyle()], __source: {
              fileName: _jsxFileName,
              lineNumber: 79
            },
            __self: this
          },
          'Popover!'
        ) : _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 88
          },
          __self: this
        })
      );
    }
  }]);

  return ThreeDotMenu;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(ThreeDotMenu);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvVGhyZWVEb3RNZW51LmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsImNvbnRhaW5lciIsInBvc2l0aW9uIiwicmlnaHQiLCJwb3BvdmVyIiwid2lkdGgiLCJ6SW5kZXgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJEQVJLX0dSQVkiLCJjb2xvciIsIlJPQ0siLCJUaHJlZURvdE1lbnUiLCJwcm9wcyIsInN0YXRlIiwicG9wb3ZlclZpc2libGUiLCJwb3BvdmVyWCIsInBvcG92ZXJZIiwicmVmUmVhZHkiLCJoYW5kbGVUaHJlZURvdENsaWNrIiwiYmluZCIsImV2dCIsInJlY3QiLCJyZWZzIiwidGhyZWVEb3RzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsImxlZnQiLCJ5IiwidG9wIiwic2V0U3RhdGUiLCJvZmZzZXQiLCJjYWxjUG9wb3ZlcllPZmZzZXRGcm9tRE9NTm9kZSIsInBvcG92ZXJSZWYiLCJub2RlIiwiZWxlbSIsImdldER5bmFtaWNQb3BvdmVyU3R5bGUiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxhQUFXO0FBQ1RDLGNBQVUsVUFERDtBQUVUQyxXQUFPO0FBRkUsR0FERTtBQUtiQyxXQUFTO0FBQ1BGLGNBQVUsT0FESDtBQUVQRyxXQUFPLEdBRkE7QUFHUEMsWUFBUSxLQUhEO0FBSVBDLFlBQVEsR0FKRDtBQUtQQyxxQkFBaUIsa0JBQVFDLFNBTGxCO0FBTVBDLFdBQU8sa0JBQVFDO0FBTlI7O0FBVVg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQTFCZSxDQUFmO0lBNEJNQyxZOzs7QUFDSix3QkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLDRIQUNaQSxLQURZOztBQUVsQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsc0JBQWdCLEtBREw7QUFFWEMsZ0JBQVUsQ0FGQztBQUdYQyxnQkFBVSxDQUhDO0FBSVhDLGdCQUFVO0FBSkMsS0FBYjtBQU1BLFVBQUtDLG1CQUFMLEdBQTJCLE1BQUtBLG1CQUFMLENBQXlCQyxJQUF6QixPQUEzQjtBQVJrQjtBQVNuQjs7Ozt3Q0FFb0JDLEcsRUFBSztBQUN4QixVQUFJQyxPQUFPLEtBQUtDLElBQUwsQ0FBVUMsU0FBVixDQUFvQkMscUJBQXBCLEVBQVg7O0FBRUEsVUFBSUMsSUFBSUosS0FBS0ssSUFBTCxHQUFZTCxLQUFLakIsS0FBekI7QUFDQSxVQUFJdUIsSUFBSU4sS0FBS08sR0FBYjtBQUNBLFdBQUtDLFFBQUwsQ0FBYztBQUNaZix3QkFBZ0IsQ0FBQyxLQUFLRCxLQUFMLENBQVdDLGNBRGhCO0FBRVpDLGtCQUFVVSxDQUZFO0FBR1pULGtCQUFVVyxDQUhFO0FBSVpWLGtCQUFVO0FBSkUsT0FBZDtBQU1EOzs7NkNBRXlCO0FBQ3hCLFVBQUlhLFNBQVMsS0FBS0MsNkJBQUwsQ0FBbUMsS0FBS0MsVUFBeEMsQ0FBYjtBQUNBLGFBQU87QUFDTEosYUFBSyxLQUFLZixLQUFMLENBQVdHLFFBQVgsR0FBc0JjLE1BRHRCO0FBRUxKLGNBQU0sS0FBS2IsS0FBTCxDQUFXRTtBQUZaLE9BQVA7QUFJRDs7O2tEQUU4QmtCLEksRUFBTTtBQUNuQyxVQUFJLENBQUNBLElBQUwsRUFBVyxPQUFPLENBQVA7QUFDWCxhQUFPLEtBQUtBLEtBQUtULHFCQUFMLEdBQTZCbEIsTUFBN0IsR0FBc0MsQ0FBbEQ7QUFDRDs7QUFFRDtBQUNBOzs7OzZCQUNVO0FBQUE7O0FBQ1IsYUFDRTtBQUFBO0FBQUEsVUFBTSxLQUFJLFdBQVYsRUFBc0IsU0FBUyxLQUFLWSxtQkFBcEMsRUFBeUQsV0FBVSxXQUFuRSxFQUErRSxPQUFPbkIsT0FBT0MsU0FBN0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHSSxhQUFLYSxLQUFMLENBQVdDLGNBQVgsR0FDRTtBQUFBO0FBQUEsWUFBSyxLQUFLLGFBQUNvQixJQUFELEVBQVU7QUFDcEIsa0JBQUksQ0FBQyxPQUFLckIsS0FBTCxDQUFXSSxRQUFoQixFQUEwQjtBQUN4Qix1QkFBS1ksUUFBTCxDQUFjLEVBQUNaLFVBQVUsSUFBWCxFQUFkO0FBQ0EsdUJBQUtlLFVBQUwsR0FBa0JFLElBQWxCO0FBQ0Q7QUFDRixhQUxDO0FBTUEsbUJBQU8sQ0FBQ25DLE9BQU9JLE9BQVIsRUFBaUIsS0FBS2dDLHNCQUFMLEVBQWpCLENBTlA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGLEdBVUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFiTixPQURGO0FBa0JEOzs7O0VBM0R3QixnQkFBTUMsUzs7a0JBOERsQixzQkFBT3pCLFlBQVAsQyIsImZpbGUiOiJUaHJlZURvdE1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4uL1BhbGV0dGUnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6IDE1XG4gIH0sXG4gIHBvcG92ZXI6IHtcbiAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICB3aWR0aDogMTAwLFxuICAgIHpJbmRleDogMTAwMDAsXG4gICAgaGVpZ2h0OiAxMDAsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gIH1cbn1cblxuLy8gMjAxNy0wMi0wODogWkIgc3RhcnRlZCBidWlsZGluZyB0aGlzIG1lbnUgZm9yIGxpYnJhcnkgaXRlbXMsIHRvXG4vLyAgICAgICAgICAgICBnaXZlIGEgbm9uLWNvbnRleHQtbWVudSB3YXkgdG8gb3BlbiBmaWxlcyBpbiBTa2V0Y2ggb3Jcbi8vICAgICAgICAgICAgIEZpbmRlci4gIERlY2lkZWQgdGhhdCBidWlsZGluZyB0aGUgcG9wb3ZlclxuLy8gICAgICAgICAgICAgd2FzIHRvbyBoZWF2eS13ZWlnaHQgKGVpdGhlciByZWxpZXMgb24gYmxvYXRlZCB0aGlyZC1wYXJ0eVxuLy8gICAgICAgICAgICAgbGlicmFyaWVzIG9yIHJlcXVpcmVzIGEgbG90IG9mIHdoZWVsLXJlaW52ZW50aW5nLilcbi8vXG4vLyAgICAgICAgICAgICBMZWF2aW5nIHRoaXMgY29kZSBoZXJlIGluIGNhc2Ugc29tZW9uZSBlbHNlIHdhbnRzIHRvIHBpY2sgdGhpcyB1cC5cbi8vICAgICAgICAgICAgIFRldGhlciAoaHR0cDovL3RldGhlci5pby8pIG1heSBiZSBhIHVzZWZ1bCBuZXh0IHN0ZXAuXG4vL1xuLy8gICAgICAgICAgICAgTWlnaHQgbWFrZSBzZW5zZSB0byBmaW5kIGEgd2F5IHRvIHBhdGNoIGludG8gdGhlIHNhbWVcbi8vICAgICAgICAgICAgIGxvZ2ljIHRoYXQncyBiZWluZyB1c2VkIGZvciB0aGUgY3VzdG9tIGNvbnRleHQgbWVudSwgYW5kXG4vLyAgICAgICAgICAgICBqdXN0IHByb2dyYW1hdGljYWxseSB0cmlnZ2VyIHRoYXQgY29udGV4dCBtZW51IGhlcmVcblxuY2xhc3MgVGhyZWVEb3RNZW51IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBvcG92ZXJWaXNpYmxlOiBmYWxzZSxcbiAgICAgIHBvcG92ZXJYOiAwLFxuICAgICAgcG9wb3Zlclk6IDAsXG4gICAgICByZWZSZWFkeTogZmFsc2VcbiAgICB9XG4gICAgdGhpcy5oYW5kbGVUaHJlZURvdENsaWNrID0gdGhpcy5oYW5kbGVUaHJlZURvdENsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZVRocmVlRG90Q2xpY2sgKGV2dCkge1xuICAgIHZhciByZWN0ID0gdGhpcy5yZWZzLnRocmVlRG90cy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgdmFyIHggPSByZWN0LmxlZnQgKyByZWN0LndpZHRoXG4gICAgdmFyIHkgPSByZWN0LnRvcFxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcG9wb3ZlclZpc2libGU6ICF0aGlzLnN0YXRlLnBvcG92ZXJWaXNpYmxlLFxuICAgICAgcG9wb3Zlclg6IHgsXG4gICAgICBwb3BvdmVyWTogeSxcbiAgICAgIHJlZlJlYWR5OiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBnZXREeW5hbWljUG9wb3ZlclN0eWxlICgpIHtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5jYWxjUG9wb3ZlcllPZmZzZXRGcm9tRE9NTm9kZSh0aGlzLnBvcG92ZXJSZWYpXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogdGhpcy5zdGF0ZS5wb3BvdmVyWSArIG9mZnNldCxcbiAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucG9wb3ZlclhcbiAgICB9XG4gIH1cblxuICBjYWxjUG9wb3ZlcllPZmZzZXRGcm9tRE9NTm9kZSAobm9kZSkge1xuICAgIGlmICghbm9kZSkgcmV0dXJuIDBcbiAgICByZXR1cm4gMTAgLSBub2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDJcbiAgfVxuXG4gIC8vICYjNTg2NzsgZm9yIGJpZ2dlciBidWxsZXRzXG4gIC8vICYjMTgzOyBmb3Igc21hbGxlciBidWxsZXRzXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIHJlZj0ndGhyZWVEb3RzJyBvbkNsaWNrPXt0aGlzLmhhbmRsZVRocmVlRG90Q2xpY2t9IGNsYXNzTmFtZT0nY29udGFpbmVyJyBzdHlsZT17U1RZTEVTLmNvbnRhaW5lcn0+XG4gICAgICAgICYjNTg2NzsgJiM1ODY3OyAmIzU4Njc7XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnBvcG92ZXJWaXNpYmxlXG4gICAgICAgICAgPyA8ZGl2IHJlZj17KGVsZW0pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5yZWZSZWFkeSkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtyZWZSZWFkeTogdHJ1ZX0pXG4gICAgICAgICAgICAgIHRoaXMucG9wb3ZlclJlZiA9IGVsZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgICAgc3R5bGU9e1tTVFlMRVMucG9wb3ZlciwgdGhpcy5nZXREeW5hbWljUG9wb3ZlclN0eWxlKCldfT5cbiAgICAgICAgICAgICBQb3BvdmVyIVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgOiA8c3BhbiAvPlxuICAgICAgICB9XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShUaHJlZURvdE1lbnUpXG4iXX0=