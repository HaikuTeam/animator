'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/library/LibraryItem.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _Palette = require('./../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _helpers = require('./../../helpers');

var _reactDragAndDrop = require('react-drag-and-drop');

var _Icons = require('./../Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  card: {
    position: 'relative',
    paddingLeft: 20,
    paddingTop: 2,
    fontSize: 13,
    paddingBottom: 2,
    cursor: 'move',
    marginLeft: 27,
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: _Palette2.default.DARK_GRAY
    }
  },
  cardIcon: {
    position: 'absolute',
    top: 3,
    bottom: 0,
    left: 0,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardPreview: {
    opacity: 0,
    position: 'absolute',
    top: 3,
    left: 22,
    zIndex: 2,
    padding: 8,
    backgroundColor: (0, _color2.default)(_Palette2.default.COAL).fade(0.4),
    border: '1px solid rgba(0,0,0,.2)',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    transform: 'translateX(-10px)',
    transition: 'transform 270ms ease'
  },
  show: {
    opacity: 1,
    display: 'flex',
    transform: 'translateX(0)'
  },
  cardImage: {
    pointerEvents: 'none',
    height: 14,
    width: 14
  },
  inTree: {
    marginLeft: 4
  }
};

var LibraryItem = function (_React$Component) {
  _inherits(LibraryItem, _React$Component);

  function LibraryItem(props) {
    _classCallCheck(this, LibraryItem);

    var _this = _possibleConstructorReturn(this, (LibraryItem.__proto__ || Object.getPrototypeOf(LibraryItem)).call(this, props));

    _this.state = {
      isHovered: false,
      isDragging: false
    };
    return _this;
  }

  _createClass(LibraryItem, [{
    key: 'getFileName',
    value: function getFileName() {
      var name = this.props.fileName || '';
      name = name.replace('.svg', '');
      name = (0, _helpers.truncate)(name, 22);
      return name;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var src = escape(this.props.preview) + '?t=' + this.props.updateTime;
      var icon = this.props.isPrimitive ? _react2.default.createElement(
        'span',
        { style: STYLES.cardIcon, __source: {
            fileName: _jsxFileName,
            lineNumber: 85
          },
          __self: this
        },
        _react2.default.createElement(_Icons.PrimitiveIconSVG, { type: this.props.fileName, __source: {
            fileName: _jsxFileName,
            lineNumber: 86
          },
          __self: this
        })
      ) : _react2.default.createElement(
        'span',
        { style: STYLES.cardIcon,
          onMouseOver: function onMouseOver() {
            return _this2.setState({ isHovered: true });
          },
          onMouseOut: function onMouseOut() {
            return _this2.setState({ isHovered: false });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 88
          },
          __self: this
        },
        _react2.default.createElement('img', { style: STYLES.cardImage, src: 'file://' + src, __source: {
            fileName: _jsxFileName,
            lineNumber: 91
          },
          __self: this
        }),
        _react2.default.createElement('img', { style: [STYLES.cardPreview, this.state.isHovered && STYLES.show, this.state.isDragging && { display: 'none' }],
          src: 'file://' + src, __source: {
            fileName: _jsxFileName,
            lineNumber: 92
          },
          __self: this
        })
      );

      return _react2.default.createElement(
        'div',
        { style: [this.props.inTree && STYLES.inTree], __source: {
            fileName: _jsxFileName,
            lineNumber: 101
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDragAndDrop.Draggable,
          {
            onDragEnd: function onDragEnd(dragEndEvent) {
              _this2.setState({ isDragging: false });
              _this2.props.onDragEnd(dragEndEvent.nativeEvent, _this2.props);
            },
            onDragStart: function onDragStart(dragStartEvent) {
              _this2.setState({ isDragging: true });
              _this2.props.onDragStart(dragStartEvent.nativeEvent, _this2.props);
              _this2.props.websocket.set('dragee', _this2.props);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 102
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            {
              style: STYLES.card,
              onDoubleClick: function onDoubleClick() {
                return _this2.props.instantiate(_this2.props);
              },
              key: 'asset-' + this.props.preview, __source: {
                fileName: _jsxFileName,
                lineNumber: 112
              },
              __self: this
            },
            icon,
            this.getFileName()
          )
        )
      );
    }
  }]);

  return LibraryItem;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(LibraryItem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeUl0ZW0uanMiXSwibmFtZXMiOlsiU1RZTEVTIiwiY2FyZCIsInBvc2l0aW9uIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nVG9wIiwiZm9udFNpemUiLCJwYWRkaW5nQm90dG9tIiwiY3Vyc29yIiwibWFyZ2luTGVmdCIsIndoaXRlU3BhY2UiLCJiYWNrZ3JvdW5kQ29sb3IiLCJEQVJLX0dSQVkiLCJjYXJkSWNvbiIsInRvcCIsImJvdHRvbSIsImxlZnQiLCJ3aWR0aCIsImhlaWdodCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwianVzdGlmeUNvbnRlbnQiLCJjYXJkUHJldmlldyIsIm9wYWNpdHkiLCJ6SW5kZXgiLCJwYWRkaW5nIiwiQ09BTCIsImZhZGUiLCJib3JkZXIiLCJwb2ludGVyRXZlbnRzIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsInNob3ciLCJjYXJkSW1hZ2UiLCJpblRyZWUiLCJMaWJyYXJ5SXRlbSIsInByb3BzIiwic3RhdGUiLCJpc0hvdmVyZWQiLCJpc0RyYWdnaW5nIiwibmFtZSIsImZpbGVOYW1lIiwicmVwbGFjZSIsInNyYyIsImVzY2FwZSIsInByZXZpZXciLCJ1cGRhdGVUaW1lIiwiaWNvbiIsImlzUHJpbWl0aXZlIiwic2V0U3RhdGUiLCJkcmFnRW5kRXZlbnQiLCJvbkRyYWdFbmQiLCJuYXRpdmVFdmVudCIsImRyYWdTdGFydEV2ZW50Iiwib25EcmFnU3RhcnQiLCJ3ZWJzb2NrZXQiLCJzZXQiLCJpbnN0YW50aWF0ZSIsImdldEZpbGVOYW1lIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxRQUFNO0FBQ0pDLGNBQVUsVUFETjtBQUVKQyxpQkFBYSxFQUZUO0FBR0pDLGdCQUFZLENB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dCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IHsgdHJ1bmNhdGUgfSBmcm9tICcuLy4uLy4uL2hlbHBlcnMnXG5pbXBvcnQgeyBEcmFnZ2FibGUgfSBmcm9tICdyZWFjdC1kcmFnLWFuZC1kcm9wJ1xuaW1wb3J0IHsgUHJpbWl0aXZlSWNvblNWRyB9IGZyb20gJy4vLi4vSWNvbnMnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgY2FyZDoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHBhZGRpbmdMZWZ0OiAyMCxcbiAgICBwYWRkaW5nVG9wOiAyLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBwYWRkaW5nQm90dG9tOiAyLFxuICAgIGN1cnNvcjogJ21vdmUnLFxuICAgIG1hcmdpbkxlZnQ6IDI3LFxuICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS19HUkFZXG4gICAgfVxuICB9LFxuICBjYXJkSWNvbjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMyxcbiAgICBib3R0b206IDAsXG4gICAgbGVmdDogMCxcbiAgICB3aWR0aDogMTgsXG4gICAgaGVpZ2h0OiAxOCxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInXG4gIH0sXG4gIGNhcmRQcmV2aWV3OiB7XG4gICAgb3BhY2l0eTogMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDMsXG4gICAgbGVmdDogMjIsXG4gICAgekluZGV4OiAyLFxuICAgIHBhZGRpbmc6IDgsXG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC40KSxcbiAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgwLDAsMCwuMiknLFxuICAgIHdpZHRoOiAxODAsXG4gICAgaGVpZ2h0OiAxODAsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC0xMHB4KScsXG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAyNzBtcyBlYXNlJ1xuICB9LFxuICBzaG93OiB7XG4gICAgb3BhY2l0eTogMSxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSdcbiAgfSxcbiAgY2FyZEltYWdlOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgIGhlaWdodDogMTQsXG4gICAgd2lkdGg6IDE0XG4gIH0sXG4gIGluVHJlZToge1xuICAgIG1hcmdpbkxlZnQ6IDRcbiAgfVxufVxuXG5jbGFzcyBMaWJyYXJ5SXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc0hvdmVyZWQ6IGZhbHNlLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2VcbiAgICB9XG4gIH1cblxuICBnZXRGaWxlTmFtZSAoKSB7XG4gICAgdmFyIG5hbWUgPSB0aGlzLnByb3BzLmZpbGVOYW1lIHx8ICcnXG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSgnLnN2ZycsICcnKVxuICAgIG5hbWUgPSB0cnVuY2F0ZShuYW1lLCAyMilcbiAgICByZXR1cm4gbmFtZVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgc3JjID0gYCR7ZXNjYXBlKHRoaXMucHJvcHMucHJldmlldyl9P3Q9JHt0aGlzLnByb3BzLnVwZGF0ZVRpbWV9YFxuICAgIGNvbnN0IGljb24gPSB0aGlzLnByb3BzLmlzUHJpbWl0aXZlXG4gICAgICA/IDxzcGFuIHN0eWxlPXtTVFlMRVMuY2FyZEljb259PlxuICAgICAgICA8UHJpbWl0aXZlSWNvblNWRyB0eXBlPXt0aGlzLnByb3BzLmZpbGVOYW1lfSAvPlxuICAgICAgPC9zcGFuPlxuICAgICAgOiA8c3BhbiBzdHlsZT17U1RZTEVTLmNhcmRJY29ufVxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7aXNIb3ZlcmVkOiB0cnVlfSl9XG4gICAgICAgIG9uTW91c2VPdXQ9eygpID0+IHRoaXMuc2V0U3RhdGUoe2lzSG92ZXJlZDogZmFsc2V9KX0+XG4gICAgICAgIDxpbWcgc3R5bGU9e1NUWUxFUy5jYXJkSW1hZ2V9IHNyYz17YGZpbGU6Ly8ke3NyY31gfSAvPlxuICAgICAgICA8aW1nIHN0eWxlPXtbXG4gICAgICAgICAgU1RZTEVTLmNhcmRQcmV2aWV3LFxuICAgICAgICAgIHRoaXMuc3RhdGUuaXNIb3ZlcmVkICYmIFNUWUxFUy5zaG93LFxuICAgICAgICAgIHRoaXMuc3RhdGUuaXNEcmFnZ2luZyAmJiB7ZGlzcGxheTogJ25vbmUnfVxuICAgICAgICBdfVxuICAgICAgICAgIHNyYz17YGZpbGU6Ly8ke3NyY31gfSAvPlxuICAgICAgPC9zcGFuPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1t0aGlzLnByb3BzLmluVHJlZSAmJiBTVFlMRVMuaW5UcmVlXX0+XG4gICAgICAgIDxEcmFnZ2FibGVcbiAgICAgICAgICBvbkRyYWdFbmQ9eyhkcmFnRW5kRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzRHJhZ2dpbmc6IGZhbHNlfSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EcmFnRW5kKGRyYWdFbmRFdmVudC5uYXRpdmVFdmVudCwgdGhpcy5wcm9wcylcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXsoZHJhZ1N0YXJ0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzRHJhZ2dpbmc6IHRydWV9KVxuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudC5uYXRpdmVFdmVudCwgdGhpcy5wcm9wcylcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNldCgnZHJhZ2VlJywgdGhpcy5wcm9wcylcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17U1RZTEVTLmNhcmR9XG4gICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmluc3RhbnRpYXRlKHRoaXMucHJvcHMpfVxuICAgICAgICAgICAga2V5PXtgYXNzZXQtJHt0aGlzLnByb3BzLnByZXZpZXd9YH0+XG4gICAgICAgICAgICB7aWNvbn1cbiAgICAgICAgICAgIHsgdGhpcy5nZXRGaWxlTmFtZSgpIH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGU+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKExpYnJhcnlJdGVtKVxuIl19