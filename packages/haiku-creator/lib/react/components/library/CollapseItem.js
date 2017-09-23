'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/library/CollapseItem.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('../Palette.js');

var _Palette2 = _interopRequireDefault(_Palette);

var _reactCollapse = require('react-collapse');

var _reactCollapse2 = _interopRequireDefault(_reactCollapse);

var _LibraryItem = require('./LibraryItem');

var _LibraryItem2 = _interopRequireDefault(_LibraryItem);

var _ContextMenu = require('./../../ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _Icons = require('./../Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('electron'),
    shell = _require.shell;

var STYLES = {
  row: {
    marginLeft: 13,
    userSelect: 'none',
    cursor: 'pointer',
    paddingTop: 2,
    paddingBottom: 2,
    marginBottom: 4,
    fontSize: 13
  },
  chevy: {
    marginRight: 6
  },
  icon: {
    position: 'relative',
    top: 3,
    marginRight: 6
  },
  header: {
    ':hover': {// has to be here for the Radium.getState to work
    }
  }
};

var CollapseItem = function (_React$Component) {
  _inherits(CollapseItem, _React$Component);

  function CollapseItem(props) {
    _classCallCheck(this, CollapseItem);

    var _this = _possibleConstructorReturn(this, (CollapseItem.__proto__ || Object.getPrototypeOf(CollapseItem)).call(this, props));

    _this.state = {
      isOpened: true
    };

    _this.handleCollapseToggle = _this.handleCollapseToggle.bind(_this);
    return _this;
  }

  _createClass(CollapseItem, [{
    key: 'handleCollapseToggle',
    value: function handleCollapseToggle() {
      this.setState({ isOpened: !this.state.isOpened });
    }
  }, {
    key: 'handleContextMenu',
    value: function handleContextMenu(event) {
      var _props = this.props,
          folder = _props.folder,
          file = _props.file;

      var menu = new _ContextMenu2.default(this, {
        library: true // Hacky: Used to configure what to display in the context menu; see ContextMenu.js
      });

      menu.on('context-menu:open-in-sketch', function () {
        var abspath = _path2.default.join(folder, 'designs', file.fileName);
        shell.openItem(abspath);
      });

      menu.on('context-menu:show-in-finder', function () {
        var abspath = _path2.default.join(folder, 'designs', file.fileName);
        shell.showItemInFolder(abspath);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var isOpened = this.state.isOpened;
      var file = this.props.file;

      var subLevel = [];

      if (file && file.artboards.collection.length > 0) {
        subLevel.push(_react2.default.createElement(CollapseItem, {
          key: 'boards-' + file.fileName,
          name: 'Artboards',
          collection: file.artboards.collection,
          changePreview: this.props.changePreview,
          onDragEnd: this.props.onDragEnd,
          onDragStart: this.props.onDragStart,
          websocket: this.props.websocket,
          instantiate: this.props.instantiate,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 73
          },
          __self: this
        }));
      }

      if (file && file.slices.collection.length > 0) {
        subLevel.push(_react2.default.createElement(CollapseItem, {
          key: 'slices-' + file.fileName,
          name: 'Slices',
          collection: file.slices.collection,
          changePreview: this.props.changePreview,
          onDragEnd: this.props.onDragEnd,
          onDragStart: this.props.onDragStart,
          websocket: this.props.websocket,
          instantiate: this.props.instantiate,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 88
          },
          __self: this
        }));
      }

      if (this.props.collection && this.props.collection.length > 0) {
        subLevel = this.props.collection.map(function (file) {
          return _react2.default.createElement(_LibraryItem2.default, {
            inTree: true,
            key: 'myItem-' + file.fileName,
            onDragEnd: _this2.props.onDragEnd,
            onDragStart: _this2.props.onDragStart,
            fileName: file.fileName,
            preview: file.preview,
            updateTime: file.updateTime,
            websocket: _this2.props.websocket,
            changePreview: _this2.props.changePreview,
            instantiate: _this2.props.instantiate,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 104
            },
            __self: _this2
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.row, __source: {
            fileName: _jsxFileName,
            lineNumber: 121
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { onClick: this.handleCollapseToggle, __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: STYLES.chevy, __source: {
                fileName: _jsxFileName,
                lineNumber: 123
              },
              __self: this
            },
            this.state.isOpened ? _react2.default.createElement(_Icons.CollapseChevronDownSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 124
              },
              __self: this
            }) : _react2.default.createElement(_Icons.CollapseChevronRightSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 124
              },
              __self: this
            })
          ),
          this.props.file ? _react2.default.createElement(
            'span',
            { key: 'file-header-' + file.fileName, style: STYLES.header, __source: {
                fileName: _jsxFileName,
                lineNumber: 127
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.props.instantiate, style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 128
                },
                __self: this
              },
              _react2.default.createElement(_Icons.SketchIconSVG, { style: '', color: _radium2.default.getState(this.state, 'file-header-' + file.fileName, ':hover') ? _Palette2.default.ORANGE : _Palette2.default.DARKER_ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 129
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.props.instantiate, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 131
                },
                __self: this
              },
              this.props.file.fileName
            )
          ) : _react2.default.createElement(
            'span',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 133
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 133
                },
                __self: this
              },
              _react2.default.createElement(_Icons.FolderIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 133
                },
                __self: this
              })
            ),
            this.props.name
          )
        ),
        _react2.default.createElement(
          _reactCollapse2.default,
          { isOpened: isOpened, springConfig: { stiffness: 177, damping: 17 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 137
            },
            __self: this
          },
          subLevel
        )
      );
    }
  }]);

  return CollapseItem;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(CollapseItem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvQ29sbGFwc2VJdGVtLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaGVsbCIsIlNUWUxFUyIsInJvdyIsIm1hcmdpbkxlZnQiLCJ1c2VyU2VsZWN0IiwiY3Vyc29yIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImNoZXZ5IiwibWFyZ2luUmlnaHQiLCJpY29uIiwicG9zaXRpb24iLCJ0b3AiLCJoZWFkZXIiLCJDb2xsYXBzZUl0ZW0iLCJwcm9wcyIsInN0YXRlIiwiaXNPcGVuZWQiLCJoYW5kbGVDb2xsYXBzZVRvZ2dsZSIsImJpbmQiLCJzZXRTdGF0ZSIsImV2ZW50IiwiZm9sZGVyIiwiZmlsZSIsIm1lbnUiLCJsaWJyYXJ5Iiwib24iLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJzaG93SXRlbUluRm9sZGVyIiwic3ViTGV2ZWwiLCJhcnRib2FyZHMiLCJjb2xsZWN0aW9uIiwibGVuZ3RoIiwicHVzaCIsImNoYW5nZVByZXZpZXciLCJvbkRyYWdFbmQiLCJvbkRyYWdTdGFydCIsIndlYnNvY2tldCIsImluc3RhbnRpYXRlIiwic2xpY2VzIiwibWFwIiwicHJldmlldyIsInVwZGF0ZVRpbWUiLCJoYW5kbGVDb250ZXh0TWVudSIsImdldFN0YXRlIiwiT1JBTkdFIiwiREFSS0VSX1JPQ0siLCJuYW1lIiwic3RpZmZuZXNzIiwiZGFtcGluZyIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztlQUNnQkEsUUFBUSxVQUFSLEM7SUFBVEMsSyxZQUFBQSxLOztBQUVQLElBQU1DLFNBQVM7QUFDYkMsT0FBSztBQUNIQyxnQkFBWSxFQURUO0FBRUhDLGdCQUFZLE1BRlQ7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QyxRQUFwQixFQUE4QixjQUFjLEVBQUNrQyxXQUFXLEdBQVosRUFBaUJDLFNBQVMsRUFBMUIsRUFBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0dwQjtBQURIO0FBaEJGLE9BREY7QUFzQkQ7Ozs7RUEzR3dCLGdCQUFNcUIsUzs7a0JBOEdsQixzQkFBT3ZDLFlBQVAsQyIsImZpbGUiOiJDb2xsYXBzZUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9QYWxldHRlLmpzJ1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJ3JlYWN0LWNvbGxhcHNlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi8uLi8uLi9Db250ZXh0TWVudSdcbmltcG9ydCB7IENvbGxhcHNlQ2hldnJvblJpZ2h0U1ZHLCBDb2xsYXBzZUNoZXZyb25Eb3duU1ZHLCBTa2V0Y2hJY29uU1ZHLCBGb2xkZXJJY29uU1ZHIH0gZnJvbSAnLi8uLi9JY29ucydcbmNvbnN0IHtzaGVsbH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgcm93OiB7XG4gICAgbWFyZ2luTGVmdDogMTMsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgcGFkZGluZ0JvdHRvbTogMixcbiAgICBtYXJnaW5Cb3R0b206IDQsXG4gICAgZm9udFNpemU6IDEzXG4gIH0sXG4gIGNoZXZ5OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDZcbiAgfSxcbiAgaWNvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMyxcbiAgICBtYXJnaW5SaWdodDogNlxuICB9LFxuICBoZWFkZXI6IHtcbiAgICAnOmhvdmVyJzogeyAvLyBoYXMgdG8gYmUgaGVyZSBmb3IgdGhlIFJhZGl1bS5nZXRTdGF0ZSB0byB3b3JrXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENvbGxhcHNlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc09wZW5lZDogdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGUgPSB0aGlzLmhhbmRsZUNvbGxhcHNlVG9nZ2xlLmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZUNvbGxhcHNlVG9nZ2xlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc09wZW5lZDogIXRoaXMuc3RhdGUuaXNPcGVuZWR9KVxuICB9XG5cbiAgaGFuZGxlQ29udGV4dE1lbnUgKGV2ZW50KSB7XG4gICAgY29uc3Qge2ZvbGRlciwgZmlsZX0gPSB0aGlzLnByb3BzXG4gICAgbGV0IG1lbnUgPSBuZXcgQ29udGV4dE1lbnUodGhpcywge1xuICAgICAgbGlicmFyeTogdHJ1ZSAvLyBIYWNreTogVXNlZCB0byBjb25maWd1cmUgd2hhdCB0byBkaXNwbGF5IGluIHRoZSBjb250ZXh0IG1lbnU7IHNlZSBDb250ZXh0TWVudS5qc1xuICAgIH0pXG5cbiAgICBtZW51Lm9uKCdjb250ZXh0LW1lbnU6b3Blbi1pbi1za2V0Y2gnLCAoKSA9PiB7XG4gICAgICB2YXIgYWJzcGF0aCA9IHBhdGguam9pbihmb2xkZXIsICdkZXNpZ25zJywgZmlsZS5maWxlTmFtZSlcbiAgICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gICAgfSlcblxuICAgIG1lbnUub24oJ2NvbnRleHQtbWVudTpzaG93LWluLWZpbmRlcicsICgpID0+IHtcbiAgICAgIHZhciBhYnNwYXRoID0gcGF0aC5qb2luKGZvbGRlciwgJ2Rlc2lnbnMnLCBmaWxlLmZpbGVOYW1lKVxuICAgICAgc2hlbGwuc2hvd0l0ZW1JbkZvbGRlcihhYnNwYXRoKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtpc09wZW5lZH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3Qge2ZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBzdWJMZXZlbCA9IFtdXG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2Bib2FyZHMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nQXJ0Ym9hcmRzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuYXJ0Ym9hcmRzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2BzbGljZXMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nU2xpY2VzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuc2xpY2VzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsZWN0aW9uICYmIHRoaXMucHJvcHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbCA9IHRoaXMucHJvcHMuY29sbGVjdGlvbi5tYXAoKGZpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAgICAgIGluVHJlZVxuICAgICAgICAgICAga2V5PXtgbXlJdGVtLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgICAgZmlsZU5hbWU9e2ZpbGUuZmlsZU5hbWV9XG4gICAgICAgICAgICBwcmV2aWV3PXtmaWxlLnByZXZpZXd9XG4gICAgICAgICAgICB1cGRhdGVUaW1lPXtmaWxlLnVwZGF0ZVRpbWV9XG4gICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnJvd30+XG4gICAgICAgIDxkaXYgb25DbGljaz17dGhpcy5oYW5kbGVDb2xsYXBzZVRvZ2dsZX0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5jaGV2eX0gPlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNPcGVuZWQgPyA8Q29sbGFwc2VDaGV2cm9uRG93blNWRyAvPiA6IDxDb2xsYXBzZUNoZXZyb25SaWdodFNWRyAvPn1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAge3RoaXMucHJvcHMuZmlsZVxuICAgICAgICAgICAgPyA8c3BhbiBrZXk9e2BmaWxlLWhlYWRlci0ke2ZpbGUuZmlsZU5hbWV9YH0gc3R5bGU9e1NUWUxFUy5oZWFkZXJ9PlxuICAgICAgICAgICAgICA8c3BhbiBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9IG9uRG91YmxlQ2xpY2s9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9IHN0eWxlPXtTVFlMRVMuaWNvbn0+XG4gICAgICAgICAgICAgICAgPFNrZXRjaEljb25TVkcgc3R5bGU9JycgY29sb3I9e1JhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgZmlsZS1oZWFkZXItJHtmaWxlLmZpbGVOYW1lfWAsICc6aG92ZXInKSA/IFBhbGV0dGUuT1JBTkdFIDogUGFsZXR0ZS5EQVJLRVJfUk9DS30gLz5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9IG9uRG91YmxlQ2xpY2s9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9Pnt0aGlzLnByb3BzLmZpbGUuZmlsZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgOiA8c3Bhbj48c3BhbiBzdHlsZT17U1RZTEVTLmljb259PjxGb2xkZXJJY29uU1ZHIC8+PC9zcGFuPnt0aGlzLnByb3BzLm5hbWV9PC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPENvbGxhcHNlIGlzT3BlbmVkPXtpc09wZW5lZH0gc3ByaW5nQ29uZmlnPXt7c3RpZmZuZXNzOiAxNzcsIGRhbXBpbmc6IDE3fX0+XG4gICAgICAgICAge3N1YkxldmVsfVxuICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShDb2xsYXBzZUl0ZW0pXG4iXX0=