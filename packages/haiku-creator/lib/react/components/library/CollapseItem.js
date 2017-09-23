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
    _this.handleSketchDoubleClick = _this.handleSketchDoubleClick.bind(_this);
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
    key: 'handleSketchDoubleClick',
    value: function handleSketchDoubleClick() {
      this.props.instantiate();
      this.props.tourChannel.next();
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
            lineNumber: 79
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
            lineNumber: 94
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
              lineNumber: 110
            },
            __self: _this2
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.row, __source: {
            fileName: _jsxFileName,
            lineNumber: 127
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { onClick: this.handleCollapseToggle, __source: {
              fileName: _jsxFileName,
              lineNumber: 128
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            { style: STYLES.chevy, __source: {
                fileName: _jsxFileName,
                lineNumber: 129
              },
              __self: this
            },
            this.state.isOpened ? _react2.default.createElement(_Icons.CollapseChevronDownSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 130
              },
              __self: this
            }) : _react2.default.createElement(_Icons.CollapseChevronRightSVG, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 130
              },
              __self: this
            })
          ),
          this.props.file ? _react2.default.createElement(
            'span',
            { key: 'file-header-' + file.fileName, style: STYLES.header, __source: {
                fileName: _jsxFileName,
                lineNumber: 133
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.handleSketchDoubleClick, style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 134
                },
                __self: this
              },
              _react2.default.createElement(_Icons.SketchIconSVG, { style: '', color: _radium2.default.getState(this.state, 'file-header-' + file.fileName, ':hover') ? _Palette2.default.ORANGE : _Palette2.default.DARKER_ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 135
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.handleSketchDoubleClick, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 137
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
                lineNumber: 139
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 139
                },
                __self: this
              },
              _react2.default.createElement(_Icons.FolderIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 139
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
              lineNumber: 143
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvQ29sbGFwc2VJdGVtLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaGVsbCIsIlNUWUxFUyIsInJvdyIsIm1hcmdpbkxlZnQiLCJ1c2VyU2VsZWN0IiwiY3Vyc29yIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImNoZXZ5IiwibWFyZ2luUmlnaHQiLCJpY29uIiwicG9zaXRpb24iLCJ0b3AiLCJoZWFkZXIiLCJDb2xsYXBzZUl0ZW0iLCJwcm9wcyIsInN0YXRlIiwiaXNPcGVuZWQiLCJoYW5kbGVDb2xsYXBzZVRvZ2dsZSIsImJpbmQiLCJoYW5kbGVTa2V0Y2hEb3VibGVDbGljayIsInNldFN0YXRlIiwiZXZlbnQiLCJmb2xkZXIiLCJmaWxlIiwibWVudSIsImxpYnJhcnkiLCJvbiIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsInNob3dJdGVtSW5Gb2xkZXIiLCJpbnN0YW50aWF0ZSIsInRvdXJDaGFubmVsIiwibmV4dCIsInN1YkxldmVsIiwiYXJ0Ym9hcmRzIiwiY29sbGVjdGlvbiIsImxlbmd0aCIsInB1c2giLCJjaGFuZ2VQcmV2aWV3Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJ3ZWJzb2NrZXQiLCJzbGljZXMiLCJtYXAiLCJwcmV2aWV3IiwidXBkYXRlVGltZSIsImhhbmRsZUNvbnRleHRNZW51IiwiZ2V0U3RhdGUiLCJPUkFOR0UiLCJEQVJLRVJfUk9DSyIsIm5hbWUiLCJzdGlmZm5lc3MiLCJkYW1waW5nIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O2VBQ2dCQSxRQUFRLFVBQVIsQztJQUFUQyxLLFlBQUFBLEs7O0FBRVAsSUFBTUMsU0FB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LGdCQUFNLE9BQU8vQixPQUFPVyxJQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMUIsYUFBTjtBQUF5RCxpQkFBS0ssS0FBTCxDQUFXc0M7QUFBcEU7QUFYTixTQURGO0FBZ0JFO0FBQUE7QUFBQSxZQUFVLFVBQVVwQyxRQUFwQixFQUE4QixjQUFjLEVBQUNxQyxXQUFXLEdBQVosRUFBaUJDLFNBQVMsRUFBMUIsRUFBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0duQjtBQURIO0FBaEJGLE9BREY7QUFzQkQ7Ozs7RUFqSHdCLGdCQUFNb0IsUzs7a0JBb0hsQixzQkFBTzFDLFlBQVAsQyIsImZpbGUiOiJDb2xsYXBzZUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9QYWxldHRlLmpzJ1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJ3JlYWN0LWNvbGxhcHNlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi8uLi8uLi9Db250ZXh0TWVudSdcbmltcG9ydCB7IENvbGxhcHNlQ2hldnJvblJpZ2h0U1ZHLCBDb2xsYXBzZUNoZXZyb25Eb3duU1ZHLCBTa2V0Y2hJY29uU1ZHLCBGb2xkZXJJY29uU1ZHIH0gZnJvbSAnLi8uLi9JY29ucydcbmNvbnN0IHtzaGVsbH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgcm93OiB7XG4gICAgbWFyZ2luTGVmdDogMTMsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgcGFkZGluZ0JvdHRvbTogMixcbiAgICBtYXJnaW5Cb3R0b206IDQsXG4gICAgZm9udFNpemU6IDEzXG4gIH0sXG4gIGNoZXZ5OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDZcbiAgfSxcbiAgaWNvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMyxcbiAgICBtYXJnaW5SaWdodDogNlxuICB9LFxuICBoZWFkZXI6IHtcbiAgICAnOmhvdmVyJzogeyAvLyBoYXMgdG8gYmUgaGVyZSBmb3IgdGhlIFJhZGl1bS5nZXRTdGF0ZSB0byB3b3JrXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENvbGxhcHNlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc09wZW5lZDogdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGUgPSB0aGlzLmhhbmRsZUNvbGxhcHNlVG9nZ2xlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNrZXRjaERvdWJsZUNsaWNrID0gdGhpcy5oYW5kbGVTa2V0Y2hEb3VibGVDbGljay5iaW5kKHRoaXMpXG4gIH1cblxuICBoYW5kbGVDb2xsYXBzZVRvZ2dsZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNPcGVuZWQ6ICF0aGlzLnN0YXRlLmlzT3BlbmVkfSlcbiAgfVxuXG4gIGhhbmRsZUNvbnRleHRNZW51IChldmVudCkge1xuICAgIGNvbnN0IHtmb2xkZXIsIGZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBtZW51ID0gbmV3IENvbnRleHRNZW51KHRoaXMsIHtcbiAgICAgIGxpYnJhcnk6IHRydWUgLy8gSGFja3k6IFVzZWQgdG8gY29uZmlndXJlIHdoYXQgdG8gZGlzcGxheSBpbiB0aGUgY29udGV4dCBtZW51OyBzZWUgQ29udGV4dE1lbnUuanNcbiAgICB9KVxuXG4gICAgbWVudS5vbignY29udGV4dC1tZW51Om9wZW4taW4tc2tldGNoJywgKCkgPT4ge1xuICAgICAgdmFyIGFic3BhdGggPSBwYXRoLmpvaW4oZm9sZGVyLCAnZGVzaWducycsIGZpbGUuZmlsZU5hbWUpXG4gICAgICBzaGVsbC5vcGVuSXRlbShhYnNwYXRoKVxuICAgIH0pXG5cbiAgICBtZW51Lm9uKCdjb250ZXh0LW1lbnU6c2hvdy1pbi1maW5kZXInLCAoKSA9PiB7XG4gICAgICB2YXIgYWJzcGF0aCA9IHBhdGguam9pbihmb2xkZXIsICdkZXNpZ25zJywgZmlsZS5maWxlTmFtZSlcbiAgICAgIHNoZWxsLnNob3dJdGVtSW5Gb2xkZXIoYWJzcGF0aClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlU2tldGNoRG91YmxlQ2xpY2sgKCkge1xuICAgIHRoaXMucHJvcHMuaW5zdGFudGlhdGUoKVxuICAgIHRoaXMucHJvcHMudG91ckNoYW5uZWwubmV4dCgpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtpc09wZW5lZH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3Qge2ZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBzdWJMZXZlbCA9IFtdXG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2Bib2FyZHMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nQXJ0Ym9hcmRzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuYXJ0Ym9hcmRzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2BzbGljZXMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nU2xpY2VzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuc2xpY2VzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsZWN0aW9uICYmIHRoaXMucHJvcHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbCA9IHRoaXMucHJvcHMuY29sbGVjdGlvbi5tYXAoKGZpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAgICAgIGluVHJlZVxuICAgICAgICAgICAga2V5PXtgbXlJdGVtLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgICAgZmlsZU5hbWU9e2ZpbGUuZmlsZU5hbWV9XG4gICAgICAgICAgICBwcmV2aWV3PXtmaWxlLnByZXZpZXd9XG4gICAgICAgICAgICB1cGRhdGVUaW1lPXtmaWxlLnVwZGF0ZVRpbWV9XG4gICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnJvd30+XG4gICAgICAgIDxkaXYgb25DbGljaz17dGhpcy5oYW5kbGVDb2xsYXBzZVRvZ2dsZX0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5jaGV2eX0gPlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNPcGVuZWQgPyA8Q29sbGFwc2VDaGV2cm9uRG93blNWRyAvPiA6IDxDb2xsYXBzZUNoZXZyb25SaWdodFNWRyAvPn1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAge3RoaXMucHJvcHMuZmlsZVxuICAgICAgICAgICAgPyA8c3BhbiBrZXk9e2BmaWxlLWhlYWRlci0ke2ZpbGUuZmlsZU5hbWV9YH0gc3R5bGU9e1NUWUxFUy5oZWFkZXJ9PlxuICAgICAgICAgICAgICA8c3BhbiBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlU2tldGNoRG91YmxlQ2xpY2t9IHN0eWxlPXtTVFlMRVMuaWNvbn0+XG4gICAgICAgICAgICAgICAgPFNrZXRjaEljb25TVkcgc3R5bGU9JycgY29sb3I9e1JhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgZmlsZS1oZWFkZXItJHtmaWxlLmZpbGVOYW1lfWAsICc6aG92ZXInKSA/IFBhbGV0dGUuT1JBTkdFIDogUGFsZXR0ZS5EQVJLRVJfUk9DS30gLz5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlU2tldGNoRG91YmxlQ2xpY2t9Pnt0aGlzLnByb3BzLmZpbGUuZmlsZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgOiA8c3Bhbj48c3BhbiBzdHlsZT17U1RZTEVTLmljb259PjxGb2xkZXJJY29uU1ZHIC8+PC9zcGFuPnt0aGlzLnByb3BzLm5hbWV9PC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPENvbGxhcHNlIGlzT3BlbmVkPXtpc09wZW5lZH0gc3ByaW5nQ29uZmlnPXt7c3RpZmZuZXNzOiAxNzcsIGRhbXBpbmc6IDE3fX0+XG4gICAgICAgICAge3N1YkxldmVsfVxuICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShDb2xsYXBzZUl0ZW0pXG4iXX0=