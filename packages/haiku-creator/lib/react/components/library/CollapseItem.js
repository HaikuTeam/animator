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
    key: 'doesAssetHaveAnyDescendants',
    value: function doesAssetHaveAnyDescendants() {
      if (this.props.collection && this.props.collection.length > 0) {
        return true;
      }
      if (this.props.file) {
        if (this.props.file.artboards) {
          if (this.props.file.artboards.collection.length > 0) {
            return true;
          }
        }
        if (this.props.file.slices) {
          if (this.props.file.slices.collection.length > 0) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: 'renderChevy',
    value: function renderChevy() {
      if (!this.doesAssetHaveAnyDescendants()) {
        return _react2.default.createElement('span', { style: STYLES.chevy, __source: {
            fileName: _jsxFileName,
            lineNumber: 87
          },
          __self: this
        });
      }
      if (this.state.isOpened) {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 91
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronDownSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 92
            },
            __self: this
          })
        );
      } else {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 97
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronRightSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 98
            },
            __self: this
          })
        );
      }
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
            lineNumber: 111
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
            lineNumber: 126
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
              lineNumber: 142
            },
            __self: _this2
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.row, __source: {
            fileName: _jsxFileName,
            lineNumber: 159
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { onClick: this.handleCollapseToggle, __source: {
              fileName: _jsxFileName,
              lineNumber: 160
            },
            __self: this
          },
          this.renderChevy(),
          this.props.file ? _react2.default.createElement(
            'span',
            { key: 'file-header-' + file.fileName, style: STYLES.header, __source: {
                fileName: _jsxFileName,
                lineNumber: 163
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.props.instantiate, style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 164
                },
                __self: this
              },
              _react2.default.createElement(_Icons.SketchIconSVG, { style: '', color: _radium2.default.getState(this.state, 'file-header-' + file.fileName, ':hover') ? _Palette2.default.ORANGE : _Palette2.default.DARKER_ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 165
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.props.instantiate, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 167
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
                lineNumber: 169
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 169
                },
                __self: this
              },
              _react2.default.createElement(_Icons.FolderIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 169
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
              lineNumber: 173
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvQ29sbGFwc2VJdGVtLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaGVsbCIsIlNUWUxFUyIsInJvdyIsIm1hcmdpbkxlZnQiLCJ1c2VyU2VsZWN0IiwiY3Vyc29yIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImNoZXZ5IiwibWFyZ2luUmlnaHQiLCJpY29uIiwicG9zaXRpb24iLCJ0b3AiLCJoZWFkZXIiLCJDb2xsYXBzZUl0ZW0iLCJwcm9wcyIsInN0YXRlIiwiaXNPcGVuZWQiLCJoYW5kbGVDb2xsYXBzZVRvZ2dsZSIsImJpbmQiLCJzZXRTdGF0ZSIsImV2ZW50IiwiZm9sZGVyIiwiZmlsZSIsIm1lbnUiLCJsaWJyYXJ5Iiwib24iLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJzaG93SXRlbUluRm9sZGVyIiwiY29sbGVjdGlvbiIsImxlbmd0aCIsImFydGJvYXJkcyIsInNsaWNlcyIsImRvZXNBc3NldEhhdmVBbnlEZXNjZW5kYW50cyIsInN1YkxldmVsIiwicHVzaCIsImNoYW5nZVByZXZpZXciLCJvbkRyYWdFbmQiLCJvbkRyYWdTdGFydCIsIndlYnNvY2tldCIsImluc3RhbnRpYXRlIiwibWFwIiwicHJldmlldyIsInVwZGF0ZVRpbWUiLCJyZW5kZXJDaGV2eSIsImhhbmRsZUNvbnRleHRNZW51IiwiZ2V0U3RhdGUiLCJPUkFOR0UiLCJEQVJLRVJfUk9DSyIsIm5hbWUiLCJzdGlmZm5lc3MiLCJkYW1waW5nIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O2VBQ2dCQSxRQUFRLFVBQVIsQztJQUFUQyxLLFlBQUFBLEs7O0FBRVAsSUFBTUMsU0FBUztB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QUFBQTtBQUNHakI7QUFESDtBQWRGLE9BREY7QUFvQkQ7Ozs7RUEvSXdCLGdCQUFNa0IsUzs7a0JBa0psQixzQkFBT3pDLFlBQVAsQyIsImZpbGUiOiJDb2xsYXBzZUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9QYWxldHRlLmpzJ1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJ3JlYWN0LWNvbGxhcHNlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi8uLi8uLi9Db250ZXh0TWVudSdcbmltcG9ydCB7IENvbGxhcHNlQ2hldnJvblJpZ2h0U1ZHLCBDb2xsYXBzZUNoZXZyb25Eb3duU1ZHLCBTa2V0Y2hJY29uU1ZHLCBGb2xkZXJJY29uU1ZHIH0gZnJvbSAnLi8uLi9JY29ucydcbmNvbnN0IHtzaGVsbH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgcm93OiB7XG4gICAgbWFyZ2luTGVmdDogMTMsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgcGFkZGluZ0JvdHRvbTogMixcbiAgICBtYXJnaW5Cb3R0b206IDQsXG4gICAgZm9udFNpemU6IDEzXG4gIH0sXG4gIGNoZXZ5OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDZcbiAgfSxcbiAgaWNvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMyxcbiAgICBtYXJnaW5SaWdodDogNlxuICB9LFxuICBoZWFkZXI6IHtcbiAgICAnOmhvdmVyJzogeyAvLyBoYXMgdG8gYmUgaGVyZSBmb3IgdGhlIFJhZGl1bS5nZXRTdGF0ZSB0byB3b3JrXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENvbGxhcHNlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc09wZW5lZDogdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGUgPSB0aGlzLmhhbmRsZUNvbGxhcHNlVG9nZ2xlLmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZUNvbGxhcHNlVG9nZ2xlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc09wZW5lZDogIXRoaXMuc3RhdGUuaXNPcGVuZWR9KVxuICB9XG5cbiAgaGFuZGxlQ29udGV4dE1lbnUgKGV2ZW50KSB7XG4gICAgY29uc3Qge2ZvbGRlciwgZmlsZX0gPSB0aGlzLnByb3BzXG4gICAgbGV0IG1lbnUgPSBuZXcgQ29udGV4dE1lbnUodGhpcywge1xuICAgICAgbGlicmFyeTogdHJ1ZSAvLyBIYWNreTogVXNlZCB0byBjb25maWd1cmUgd2hhdCB0byBkaXNwbGF5IGluIHRoZSBjb250ZXh0IG1lbnU7IHNlZSBDb250ZXh0TWVudS5qc1xuICAgIH0pXG5cbiAgICBtZW51Lm9uKCdjb250ZXh0LW1lbnU6b3Blbi1pbi1za2V0Y2gnLCAoKSA9PiB7XG4gICAgICB2YXIgYWJzcGF0aCA9IHBhdGguam9pbihmb2xkZXIsICdkZXNpZ25zJywgZmlsZS5maWxlTmFtZSlcbiAgICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gICAgfSlcblxuICAgIG1lbnUub24oJ2NvbnRleHQtbWVudTpzaG93LWluLWZpbmRlcicsICgpID0+IHtcbiAgICAgIHZhciBhYnNwYXRoID0gcGF0aC5qb2luKGZvbGRlciwgJ2Rlc2lnbnMnLCBmaWxlLmZpbGVOYW1lKVxuICAgICAgc2hlbGwuc2hvd0l0ZW1JbkZvbGRlcihhYnNwYXRoKVxuICAgIH0pXG4gIH1cblxuICBkb2VzQXNzZXRIYXZlQW55RGVzY2VuZGFudHMgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbGxlY3Rpb24gJiYgdGhpcy5wcm9wcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLmZpbGUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuYXJ0Ym9hcmRzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuYXJ0Ym9hcmRzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuc2xpY2VzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuc2xpY2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZW5kZXJDaGV2eSAoKSB7XG4gICAgaWYgKCF0aGlzLmRvZXNBc3NldEhhdmVBbnlEZXNjZW5kYW50cygpKSB7XG4gICAgICByZXR1cm4gPHNwYW4gc3R5bGU9e1NUWUxFUy5jaGV2eX0gLz5cbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNPcGVuZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuY2hldnl9PlxuICAgICAgICAgIDxDb2xsYXBzZUNoZXZyb25Eb3duU1ZHIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5jaGV2eX0+XG4gICAgICAgICAgPENvbGxhcHNlQ2hldnJvblJpZ2h0U1ZHIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtpc09wZW5lZH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3Qge2ZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBzdWJMZXZlbCA9IFtdXG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2Bib2FyZHMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nQXJ0Ym9hcmRzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuYXJ0Ym9hcmRzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2BzbGljZXMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nU2xpY2VzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuc2xpY2VzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsZWN0aW9uICYmIHRoaXMucHJvcHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbCA9IHRoaXMucHJvcHMuY29sbGVjdGlvbi5tYXAoKGZpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAgICAgIGluVHJlZVxuICAgICAgICAgICAga2V5PXtgbXlJdGVtLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgICAgZmlsZU5hbWU9e2ZpbGUuZmlsZU5hbWV9XG4gICAgICAgICAgICBwcmV2aWV3PXtmaWxlLnByZXZpZXd9XG4gICAgICAgICAgICB1cGRhdGVUaW1lPXtmaWxlLnVwZGF0ZVRpbWV9XG4gICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnJvd30+XG4gICAgICAgIDxkaXYgb25DbGljaz17dGhpcy5oYW5kbGVDb2xsYXBzZVRvZ2dsZX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ2hldnkoKX1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5maWxlXG4gICAgICAgICAgICA/IDxzcGFuIGtleT17YGZpbGUtaGVhZGVyLSR7ZmlsZS5maWxlTmFtZX1gfSBzdHlsZT17U1RZTEVTLmhlYWRlcn0+XG4gICAgICAgICAgICAgIDxzcGFuIG9uQ29udGV4dE1lbnU9e3RoaXMuaGFuZGxlQ29udGV4dE1lbnUuYmluZCh0aGlzKX0gb25Eb3VibGVDbGljaz17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX0gc3R5bGU9e1NUWUxFUy5pY29ufT5cbiAgICAgICAgICAgICAgICA8U2tldGNoSWNvblNWRyBzdHlsZT0nJyBjb2xvcj17UmFkaXVtLmdldFN0YXRlKHRoaXMuc3RhdGUsIGBmaWxlLWhlYWRlci0ke2ZpbGUuZmlsZU5hbWV9YCwgJzpob3ZlcicpID8gUGFsZXR0ZS5PUkFOR0UgOiBQYWxldHRlLkRBUktFUl9ST0NLfSAvPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIG9uQ29udGV4dE1lbnU9e3RoaXMuaGFuZGxlQ29udGV4dE1lbnUuYmluZCh0aGlzKX0gb25Eb3VibGVDbGljaz17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX0+e3RoaXMucHJvcHMuZmlsZS5maWxlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA6IDxzcGFuPjxzcGFuIHN0eWxlPXtTVFlMRVMuaWNvbn0+PEZvbGRlckljb25TVkcgLz48L3NwYW4+e3RoaXMucHJvcHMubmFtZX08L3NwYW4+XG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8Q29sbGFwc2UgaXNPcGVuZWQ9e2lzT3BlbmVkfSBzcHJpbmdDb25maWc9e3tzdGlmZm5lc3M6IDE3NywgZGFtcGluZzogMTd9fT5cbiAgICAgICAgICB7c3ViTGV2ZWx9XG4gICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKENvbGxhcHNlSXRlbSlcbiJdfQ==