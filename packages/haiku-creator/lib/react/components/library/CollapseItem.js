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
            lineNumber: 88
          },
          __self: this
        });
      }
      if (this.state.isOpened) {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 92
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronDownSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 93
            },
            __self: this
          })
        );
      } else {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 98
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronRightSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 99
            },
            __self: this
          })
        );
      }
    }
  }, {
    key: 'handleSketchDoubleClick',
    value: function handleSketchDoubleClick() {
      this.props.instantiate();
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
            lineNumber: 116
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
            lineNumber: 131
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
              lineNumber: 147
            },
            __self: _this2
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.row, __source: {
            fileName: _jsxFileName,
            lineNumber: 164
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { onClick: this.handleCollapseToggle, __source: {
              fileName: _jsxFileName,
              lineNumber: 165
            },
            __self: this
          },
          this.renderChevy(),
          this.props.file ? _react2.default.createElement(
            'span',
            { key: 'file-header-' + file.fileName, style: STYLES.header, __source: {
                fileName: _jsxFileName,
                lineNumber: 168
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.handleSketchDoubleClick, style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 169
                },
                __self: this
              },
              _react2.default.createElement(_Icons.SketchIconSVG, { style: '', color: _radium2.default.getState(this.state, 'file-header-' + file.fileName, ':hover') ? _Palette2.default.ORANGE : _Palette2.default.DARKER_ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 170
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.handleSketchDoubleClick, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 172
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
                lineNumber: 174
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 174
                },
                __self: this
              },
              _react2.default.createElement(_Icons.FolderIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 174
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
              lineNumber: 178
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvQ29sbGFwc2VJdGVtLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaGVsbCIsIlNUWUxFUyIsInJvdyIsIm1hcmdpbkxlZnQiLCJ1c2VyU2VsZWN0IiwiY3Vyc29yIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImNoZXZ5IiwibWFyZ2luUmlnaHQiLCJpY29uIiwicG9zaXRpb24iLCJ0b3AiLCJoZWFkZXIiLCJDb2xsYXBzZUl0ZW0iLCJwcm9wcyIsInN0YXRlIiwiaXNPcGVuZWQiLCJoYW5kbGVDb2xsYXBzZVRvZ2dsZSIsImJpbmQiLCJoYW5kbGVTa2V0Y2hEb3VibGVDbGljayIsInNldFN0YXRlIiwiZXZlbnQiLCJmb2xkZXIiLCJmaWxlIiwibWVudSIsImxpYnJhcnkiLCJvbiIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsInNob3dJdGVtSW5Gb2xkZXIiLCJjb2xsZWN0aW9uIiwibGVuZ3RoIiwiYXJ0Ym9hcmRzIiwic2xpY2VzIiwiZG9lc0Fzc2V0SGF2ZUFueURlc2NlbmRhbnRzIiwiaW5zdGFudGlhdGUiLCJzdWJMZXZlbCIsInB1c2giLCJjaGFuZ2VQcmV2aWV3Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJ3ZWJzb2NrZXQiLCJtYXAiLCJwcmV2aWV3IiwidXBkYXRlVGltZSIsInJlbmRlckNoZXZ5IiwiaGFuZGxlQ29udGV4dE1lbnUiLCJnZXRTdGF0ZSIsIk9SQU5HRSIsIkRBUktFUl9ST0NLIiwibmFtZSIsInN0aWZmbmVzcyIsImRhbXBpbmciLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7ZUFDZ0JBLFFBQVEsVUFBUixDO0lBQVRDLEss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RTtBQUFBO0FBQUEsWUFBVSxVQUFVcEMsUUFBcEIsRUFBOEIsY0FBYyxFQUFDcUMsV0FBVyxHQUFaLEVBQWlCQyxTQUFTLEVBQTFCLEVBQTVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHaEI7QUFESDtBQWRGLE9BREY7QUFvQkQ7Ozs7RUFwSndCLGdCQUFNaUIsUzs7a0JBdUpsQixzQkFBTzFDLFlBQVAsQyIsImZpbGUiOiJDb2xsYXBzZUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9QYWxldHRlLmpzJ1xuaW1wb3J0IENvbGxhcHNlIGZyb20gJ3JlYWN0LWNvbGxhcHNlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi8uLi8uLi9Db250ZXh0TWVudSdcbmltcG9ydCB7IENvbGxhcHNlQ2hldnJvblJpZ2h0U1ZHLCBDb2xsYXBzZUNoZXZyb25Eb3duU1ZHLCBTa2V0Y2hJY29uU1ZHLCBGb2xkZXJJY29uU1ZHIH0gZnJvbSAnLi8uLi9JY29ucydcbmNvbnN0IHtzaGVsbH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgcm93OiB7XG4gICAgbWFyZ2luTGVmdDogMTMsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgcGFkZGluZ0JvdHRvbTogMixcbiAgICBtYXJnaW5Cb3R0b206IDQsXG4gICAgZm9udFNpemU6IDEzXG4gIH0sXG4gIGNoZXZ5OiB7XG4gICAgbWFyZ2luUmlnaHQ6IDZcbiAgfSxcbiAgaWNvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHRvcDogMyxcbiAgICBtYXJnaW5SaWdodDogNlxuICB9LFxuICBoZWFkZXI6IHtcbiAgICAnOmhvdmVyJzogeyAvLyBoYXMgdG8gYmUgaGVyZSBmb3IgdGhlIFJhZGl1bS5nZXRTdGF0ZSB0byB3b3JrXG4gICAgfVxuICB9XG59XG5cbmNsYXNzIENvbGxhcHNlSXRlbSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc09wZW5lZDogdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGUgPSB0aGlzLmhhbmRsZUNvbGxhcHNlVG9nZ2xlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVNrZXRjaERvdWJsZUNsaWNrID0gdGhpcy5oYW5kbGVTa2V0Y2hEb3VibGVDbGljay5iaW5kKHRoaXMpXG4gIH1cblxuICBoYW5kbGVDb2xsYXBzZVRvZ2dsZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNPcGVuZWQ6ICF0aGlzLnN0YXRlLmlzT3BlbmVkfSlcbiAgfVxuXG4gIGhhbmRsZUNvbnRleHRNZW51IChldmVudCkge1xuICAgIGNvbnN0IHtmb2xkZXIsIGZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBtZW51ID0gbmV3IENvbnRleHRNZW51KHRoaXMsIHtcbiAgICAgIGxpYnJhcnk6IHRydWUgLy8gSGFja3k6IFVzZWQgdG8gY29uZmlndXJlIHdoYXQgdG8gZGlzcGxheSBpbiB0aGUgY29udGV4dCBtZW51OyBzZWUgQ29udGV4dE1lbnUuanNcbiAgICB9KVxuXG4gICAgbWVudS5vbignY29udGV4dC1tZW51Om9wZW4taW4tc2tldGNoJywgKCkgPT4ge1xuICAgICAgdmFyIGFic3BhdGggPSBwYXRoLmpvaW4oZm9sZGVyLCAnZGVzaWducycsIGZpbGUuZmlsZU5hbWUpXG4gICAgICBzaGVsbC5vcGVuSXRlbShhYnNwYXRoKVxuICAgIH0pXG5cbiAgICBtZW51Lm9uKCdjb250ZXh0LW1lbnU6c2hvdy1pbi1maW5kZXInLCAoKSA9PiB7XG4gICAgICB2YXIgYWJzcGF0aCA9IHBhdGguam9pbihmb2xkZXIsICdkZXNpZ25zJywgZmlsZS5maWxlTmFtZSlcbiAgICAgIHNoZWxsLnNob3dJdGVtSW5Gb2xkZXIoYWJzcGF0aClcbiAgICB9KVxuICB9XG5cbiAgZG9lc0Fzc2V0SGF2ZUFueURlc2NlbmRhbnRzICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsZWN0aW9uICYmIHRoaXMucHJvcHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5maWxlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5maWxlLmFydGJvYXJkcykge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWxlLmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcm9wcy5maWxlLnNsaWNlcykge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWxlLnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmVuZGVyQ2hldnkgKCkge1xuICAgIGlmICghdGhpcy5kb2VzQXNzZXRIYXZlQW55RGVzY2VuZGFudHMoKSkge1xuICAgICAgcmV0dXJuIDxzcGFuIHN0eWxlPXtTVFlMRVMuY2hldnl9IC8+XG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmlzT3BlbmVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLmNoZXZ5fT5cbiAgICAgICAgICA8Q29sbGFwc2VDaGV2cm9uRG93blNWRyAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuY2hldnl9PlxuICAgICAgICAgIDxDb2xsYXBzZUNoZXZyb25SaWdodFNWRyAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2tldGNoRG91YmxlQ2xpY2sgKCkge1xuICAgIHRoaXMucHJvcHMuaW5zdGFudGlhdGUoKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7aXNPcGVuZWR9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHtmaWxlfSA9IHRoaXMucHJvcHNcbiAgICBsZXQgc3ViTGV2ZWwgPSBbXVxuXG4gICAgaWYgKGZpbGUgJiYgZmlsZS5hcnRib2FyZHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbC5wdXNoKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAga2V5PXtgYm9hcmRzLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgIG5hbWU9J0FydGJvYXJkcydcbiAgICAgICAgICBjb2xsZWN0aW9uPXtmaWxlLmFydGJvYXJkcy5jb2xsZWN0aW9ufVxuICAgICAgICAgIGNoYW5nZVByZXZpZXc9e3RoaXMucHJvcHMuY2hhbmdlUHJldmlld31cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKGZpbGUgJiYgZmlsZS5zbGljZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbC5wdXNoKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAga2V5PXtgc2xpY2VzLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgIG5hbWU9J1NsaWNlcydcbiAgICAgICAgICBjb2xsZWN0aW9uPXtmaWxlLnNsaWNlcy5jb2xsZWN0aW9ufVxuICAgICAgICAgIGNoYW5nZVByZXZpZXc9e3RoaXMucHJvcHMuY2hhbmdlUHJldmlld31cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29sbGVjdGlvbiAmJiB0aGlzLnByb3BzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgc3ViTGV2ZWwgPSB0aGlzLnByb3BzLmNvbGxlY3Rpb24ubWFwKChmaWxlKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPExpYnJhcnlJdGVtXG4gICAgICAgICAgICBpblRyZWVcbiAgICAgICAgICAgIGtleT17YG15SXRlbS0ke2ZpbGUuZmlsZU5hbWV9YH1cbiAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICAgIGZpbGVOYW1lPXtmaWxlLmZpbGVOYW1lfVxuICAgICAgICAgICAgcHJldmlldz17ZmlsZS5wcmV2aWV3fVxuICAgICAgICAgICAgdXBkYXRlVGltZT17ZmlsZS51cGRhdGVUaW1lfVxuICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgIGNoYW5nZVByZXZpZXc9e3RoaXMucHJvcHMuY2hhbmdlUHJldmlld31cbiAgICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLnByb3BzLmluc3RhbnRpYXRlfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5yb3d9PlxuICAgICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGV9PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNoZXZ5KCl9XG4gICAgICAgICAge3RoaXMucHJvcHMuZmlsZVxuICAgICAgICAgICAgPyA8c3BhbiBrZXk9e2BmaWxlLWhlYWRlci0ke2ZpbGUuZmlsZU5hbWV9YH0gc3R5bGU9e1NUWUxFUy5oZWFkZXJ9PlxuICAgICAgICAgICAgICA8c3BhbiBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlU2tldGNoRG91YmxlQ2xpY2t9IHN0eWxlPXtTVFlMRVMuaWNvbn0+XG4gICAgICAgICAgICAgICAgPFNrZXRjaEljb25TVkcgc3R5bGU9JycgY29sb3I9e1JhZGl1bS5nZXRTdGF0ZSh0aGlzLnN0YXRlLCBgZmlsZS1oZWFkZXItJHtmaWxlLmZpbGVOYW1lfWAsICc6aG92ZXInKSA/IFBhbGV0dGUuT1JBTkdFIDogUGFsZXR0ZS5EQVJLRVJfUk9DS30gLz5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9IG9uRG91YmxlQ2xpY2s9e3RoaXMuaGFuZGxlU2tldGNoRG91YmxlQ2xpY2t9Pnt0aGlzLnByb3BzLmZpbGUuZmlsZU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgOiA8c3Bhbj48c3BhbiBzdHlsZT17U1RZTEVTLmljb259PjxGb2xkZXJJY29uU1ZHIC8+PC9zcGFuPnt0aGlzLnByb3BzLm5hbWV9PC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPENvbGxhcHNlIGlzT3BlbmVkPXtpc09wZW5lZH0gc3ByaW5nQ29uZmlnPXt7c3RpZmZuZXNzOiAxNzcsIGRhbXBpbmc6IDE3fX0+XG4gICAgICAgICAge3N1YkxldmVsfVxuICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShDb2xsYXBzZUl0ZW0pXG4iXX0=