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

var _ThreeDotMenu = require('../ThreeDotMenu');

var _ThreeDotMenu2 = _interopRequireDefault(_ThreeDotMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('electron'),
    shell = _require.shell;

var STYLES = {
  row: {
    paddingLeft: 13,
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
    padding: '4px 0 4px 13px',
    marginLeft: -13,
    ':hover': {
      backgroundColor: _Palette2.default.DARKER_GRAY
    }
  },
  fileName: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'calc(100% - 85px)',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle'
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

    _this.threeDotMenuItems = [{
      label: 'Open Sketch',
      icon: _Icons.SketchIconSVG,
      onClick: _this.props.instantiate
    }, {
      label: 'Remove',
      icon: _Icons.TrashIconSVG,
      onClick: _this.props.delete
    }];
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
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 120
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronDownSVG, { color: 'transparent', __source: {
              fileName: _jsxFileName,
              lineNumber: 121
            },
            __self: this
          })
        );
      }
      if (this.state.isOpened) {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 127
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronDownSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 128
            },
            __self: this
          })
        );
      } else {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 133
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronRightSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 134
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
            lineNumber: 151
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
            lineNumber: 166
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
              lineNumber: 182
            },
            __self: _this2
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.row, __source: {
            fileName: _jsxFileName,
            lineNumber: 199
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: this.handleCollapseToggle,
            style: file ? STYLES.header : {},
            key: file ? 'file-header-' + file.fileName : '',
            __source: {
              fileName: _jsxFileName,
              lineNumber: 200
            },
            __self: this
          },
          this.renderChevy(),
          file ? _react2.default.createElement(
            'span',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 207
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              {
                onContextMenu: this.handleContextMenu.bind(this),
                onDoubleClick: this.handleSketchDoubleClick,
                style: STYLES.icon,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 208
                },
                __self: this
              },
              _react2.default.createElement(_Icons.SketchIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 213
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              {
                onContextMenu: this.handleContextMenu.bind(this),
                onDoubleClick: this.handleSketchDoubleClick,
                style: STYLES.fileName,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 215
                },
                __self: this
              },
              this.props.file.fileName
            ),
            _react2.default.createElement(_ThreeDotMenu2.default, {
              items: this.threeDotMenuItems,
              isHovered: _radium2.default.getState(this.state, 'file-header-' + file.fileName, ':hover'),
              __source: {
                fileName: _jsxFileName,
                lineNumber: 222
              },
              __self: this
            })
          ) : _react2.default.createElement(
            'span',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 232
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 233
                },
                __self: this
              },
              _react2.default.createElement(_Icons.FolderIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 234
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              { style: STYLES.fileName, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 236
                },
                __self: this
              },
              this.props.name
            )
          )
        ),
        _react2.default.createElement(
          _reactCollapse2.default,
          {
            isOpened: isOpened,
            springConfig: { stiffness: 177, damping: 17 },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 241
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvQ29sbGFwc2VJdGVtLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaGVsbCIsIlNUWUxFUyIsInJvdyIsInBhZGRpbmdMZWZ0IiwidXNlclNlbGVjdCIsImN1cnNvciIsInBhZGRpbmdUb3AiLCJwYWRkaW5nQm90dG9tIiwibWFyZ2luQm90dG9tIiwiZm9udFNpemUiLCJjaGV2eSIsIm1hcmdpblJpZ2h0IiwiaWNvbiIsInBvc2l0aW9uIiwidG9wIiwiaGVhZGVyIiwicGFkZGluZyIsIm1hcmdpbkxlZnQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJEQVJLRVJfR1JBWSIsImZpbGVOYW1lIiwiZGlzcGxheSIsIm92ZXJmbG93IiwidGV4dE92ZXJmbG93Iiwid2lkdGgiLCJ3aGl0ZVNwYWNlIiwidmVydGljYWxBbGlnbiIsIkNvbGxhcHNlSXRlbSIsInByb3BzIiwic3RhdGUiLCJpc09wZW5lZCIsImhhbmRsZUNvbGxhcHNlVG9nZ2xlIiwiYmluZCIsImhhbmRsZVNrZXRjaERvdWJsZUNsaWNrIiwidGhyZWVEb3RNZW51SXRlbXMiLCJsYWJlbCIsIm9uQ2xpY2siLCJpbnN0YW50aWF0ZSIsImRlbGV0ZSIsInNldFN0YXRlIiwiZXZlbnQiLCJmb2xkZXIiLCJmaWxlIiwibWVudSIsImxpYnJhcnkiLCJvbiIsImFic3BhdGgiLCJqb2luIiwib3Blbkl0ZW0iLCJzaG93SXRlbUluRm9sZGVyIiwiY29sbGVjdGlvbiIsImxlbmd0aCIsImFydGJvYXJkcyIsInNsaWNlcyIsImRvZXNBc3NldEhhdmVBbnlEZXNjZW5kYW50cyIsInN1YkxldmVsIiwicHVzaCIsImNoYW5nZVByZXZpZXciLCJvbkRyYWdFbmQiLCJvbkRyYWdTdGFydCIsIndlYnNvY2tldCIsIm1hcCIsInByZXZpZXciLCJ1cGRhdGVUaW1lIiwicmVuZGVyQ2hldnkiLCJoYW5kbGVDb250ZXh0TWVudSIsImdldFN0YXRlIiwibmFtZSIs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c0JBQU8zQyxZQUFQLEMiLCJmaWxlIjoiQ29sbGFwc2VJdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi4vUGFsZXR0ZS5qcydcbmltcG9ydCBDb2xsYXBzZSBmcm9tICdyZWFjdC1jb2xsYXBzZSdcbmltcG9ydCBMaWJyYXJ5SXRlbSBmcm9tICcuL0xpYnJhcnlJdGVtJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vLi4vLi4vQ29udGV4dE1lbnUnXG5pbXBvcnQge1xuICBDb2xsYXBzZUNoZXZyb25SaWdodFNWRyxcbiAgQ29sbGFwc2VDaGV2cm9uRG93blNWRyxcbiAgU2tldGNoSWNvblNWRyxcbiAgRm9sZGVySWNvblNWRyxcbiAgVHJhc2hJY29uU1ZHXG59IGZyb20gJy4vLi4vSWNvbnMnXG5pbXBvcnQgVGhyZWVEb3RNZW51IGZyb20gJy4uL1RocmVlRG90TWVudSdcbmNvbnN0IHtzaGVsbH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgcm93OiB7XG4gICAgcGFkZGluZ0xlZnQ6IDEzLFxuICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICBwYWRkaW5nVG9wOiAyLFxuICAgIHBhZGRpbmdCb3R0b206IDIsXG4gICAgbWFyZ2luQm90dG9tOiA0LFxuICAgIGZvbnRTaXplOiAxM1xuICB9LFxuICBjaGV2eToge1xuICAgIG1hcmdpblJpZ2h0OiA2XG4gIH0sXG4gIGljb246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB0b3A6IDMsXG4gICAgbWFyZ2luUmlnaHQ6IDZcbiAgfSxcbiAgaGVhZGVyOiB7XG4gICAgcGFkZGluZzogJzRweCAwIDRweCAxM3B4JyxcbiAgICBtYXJnaW5MZWZ0OiAtMTMsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgIH1cbiAgfSxcbiAgZmlsZU5hbWU6IHtcbiAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLFxuICAgIHdpZHRoOiAnY2FsYygxMDAlIC0gODVweCknLFxuICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnLFxuICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnXG4gIH1cbn1cblxuY2xhc3MgQ29sbGFwc2VJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzT3BlbmVkOiB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVDb2xsYXBzZVRvZ2dsZSA9IHRoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2tldGNoRG91YmxlQ2xpY2sgPSB0aGlzLmhhbmRsZVNrZXRjaERvdWJsZUNsaWNrLmJpbmQodGhpcylcblxuICAgIHRoaXMudGhyZWVEb3RNZW51SXRlbXMgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnT3BlbiBTa2V0Y2gnLFxuICAgICAgICBpY29uOiBTa2V0Y2hJY29uU1ZHLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnByb3BzLmluc3RhbnRpYXRlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1JlbW92ZScsXG4gICAgICAgIGljb246IFRyYXNoSWNvblNWRyxcbiAgICAgICAgb25DbGljazogdGhpcy5wcm9wcy5kZWxldGVcbiAgICAgIH1cbiAgICBdXG4gIH1cblxuICBoYW5kbGVDb2xsYXBzZVRvZ2dsZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNPcGVuZWQ6ICF0aGlzLnN0YXRlLmlzT3BlbmVkfSlcbiAgfVxuXG4gIGhhbmRsZUNvbnRleHRNZW51IChldmVudCkge1xuICAgIGNvbnN0IHtmb2xkZXIsIGZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBtZW51ID0gbmV3IENvbnRleHRNZW51KHRoaXMsIHtcbiAgICAgIGxpYnJhcnk6IHRydWUgLy8gSGFja3k6IFVzZWQgdG8gY29uZmlndXJlIHdoYXQgdG8gZGlzcGxheSBpbiB0aGUgY29udGV4dCBtZW51OyBzZWUgQ29udGV4dE1lbnUuanNcbiAgICB9KVxuXG4gICAgbWVudS5vbignY29udGV4dC1tZW51Om9wZW4taW4tc2tldGNoJywgKCkgPT4ge1xuICAgICAgdmFyIGFic3BhdGggPSBwYXRoLmpvaW4oZm9sZGVyLCAnZGVzaWducycsIGZpbGUuZmlsZU5hbWUpXG4gICAgICBzaGVsbC5vcGVuSXRlbShhYnNwYXRoKVxuICAgIH0pXG5cbiAgICBtZW51Lm9uKCdjb250ZXh0LW1lbnU6c2hvdy1pbi1maW5kZXInLCAoKSA9PiB7XG4gICAgICB2YXIgYWJzcGF0aCA9IHBhdGguam9pbihmb2xkZXIsICdkZXNpZ25zJywgZmlsZS5maWxlTmFtZSlcbiAgICAgIHNoZWxsLnNob3dJdGVtSW5Gb2xkZXIoYWJzcGF0aClcbiAgICB9KVxuICB9XG5cbiAgZG9lc0Fzc2V0SGF2ZUFueURlc2NlbmRhbnRzICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsZWN0aW9uICYmIHRoaXMucHJvcHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZiAodGhpcy5wcm9wcy5maWxlKSB7XG4gICAgICBpZiAodGhpcy5wcm9wcy5maWxlLmFydGJvYXJkcykge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWxlLmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wcm9wcy5maWxlLnNsaWNlcykge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5maWxlLnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmVuZGVyQ2hldnkgKCkge1xuICAgIGlmICghdGhpcy5kb2VzQXNzZXRIYXZlQW55RGVzY2VuZGFudHMoKSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5jaGV2eX0+XG4gICAgICAgICAgPENvbGxhcHNlQ2hldnJvbkRvd25TVkcgY29sb3I9J3RyYW5zcGFyZW50JyAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmlzT3BlbmVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLmNoZXZ5fT5cbiAgICAgICAgICA8Q29sbGFwc2VDaGV2cm9uRG93blNWRyAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuY2hldnl9PlxuICAgICAgICAgIDxDb2xsYXBzZUNoZXZyb25SaWdodFNWRyAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU2tldGNoRG91YmxlQ2xpY2sgKCkge1xuICAgIHRoaXMucHJvcHMuaW5zdGFudGlhdGUoKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7aXNPcGVuZWR9ID0gdGhpcy5zdGF0ZVxuICAgIGNvbnN0IHtmaWxlfSA9IHRoaXMucHJvcHNcbiAgICBsZXQgc3ViTGV2ZWwgPSBbXVxuXG4gICAgaWYgKGZpbGUgJiYgZmlsZS5hcnRib2FyZHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbC5wdXNoKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAga2V5PXtgYm9hcmRzLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgIG5hbWU9J0FydGJvYXJkcydcbiAgICAgICAgICBjb2xsZWN0aW9uPXtmaWxlLmFydGJvYXJkcy5jb2xsZWN0aW9ufVxuICAgICAgICAgIGNoYW5nZVByZXZpZXc9e3RoaXMucHJvcHMuY2hhbmdlUHJldmlld31cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKGZpbGUgJiYgZmlsZS5zbGljZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbC5wdXNoKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAga2V5PXtgc2xpY2VzLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgIG5hbWU9J1NsaWNlcydcbiAgICAgICAgICBjb2xsZWN0aW9uPXtmaWxlLnNsaWNlcy5jb2xsZWN0aW9ufVxuICAgICAgICAgIGNoYW5nZVByZXZpZXc9e3RoaXMucHJvcHMuY2hhbmdlUHJldmlld31cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuY29sbGVjdGlvbiAmJiB0aGlzLnByb3BzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgc3ViTGV2ZWwgPSB0aGlzLnByb3BzLmNvbGxlY3Rpb24ubWFwKChmaWxlKSA9PiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPExpYnJhcnlJdGVtXG4gICAgICAgICAgICBpblRyZWVcbiAgICAgICAgICAgIGtleT17YG15SXRlbS0ke2ZpbGUuZmlsZU5hbWV9YH1cbiAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICAgIGZpbGVOYW1lPXtmaWxlLmZpbGVOYW1lfVxuICAgICAgICAgICAgcHJldmlldz17ZmlsZS5wcmV2aWV3fVxuICAgICAgICAgICAgdXBkYXRlVGltZT17ZmlsZS51cGRhdGVUaW1lfVxuICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgIGNoYW5nZVByZXZpZXc9e3RoaXMucHJvcHMuY2hhbmdlUHJldmlld31cbiAgICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLnByb3BzLmluc3RhbnRpYXRlfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfVxuXG5yZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnJvd30+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNvbGxhcHNlVG9nZ2xlfVxuICAgICAgICAgIHN0eWxlPXtmaWxlID8gU1RZTEVTLmhlYWRlciA6IHt9fVxuICAgICAgICAgIGtleT17ZmlsZSA/IGBmaWxlLWhlYWRlci0ke2ZpbGUuZmlsZU5hbWV9YCA6ICcnfVxuICAgICAgICA+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ2hldnkoKX1cbiAgICAgICAgICB7ZmlsZSA/IChcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIG9uQ29udGV4dE1lbnU9e3RoaXMuaGFuZGxlQ29udGV4dE1lbnUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICBvbkRvdWJsZUNsaWNrPXt0aGlzLmhhbmRsZVNrZXRjaERvdWJsZUNsaWNrfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtTVFlMRVMuaWNvbn1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxTa2V0Y2hJY29uU1ZHIC8+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBvbkNvbnRleHRNZW51PXt0aGlzLmhhbmRsZUNvbnRleHRNZW51LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVTa2V0Y2hEb3VibGVDbGlja31cbiAgICAgICAgICAgICAgICBzdHlsZT17U1RZTEVTLmZpbGVOYW1lfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmlsZS5maWxlTmFtZX1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8VGhyZWVEb3RNZW51XG4gICAgICAgICAgICAgICAgaXRlbXM9e3RoaXMudGhyZWVEb3RNZW51SXRlbXN9XG4gICAgICAgICAgICAgICAgaXNIb3ZlcmVkPXtSYWRpdW0uZ2V0U3RhdGUoXG4gICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLFxuICAgICAgICAgICAgICAgICAgYGZpbGUtaGVhZGVyLSR7ZmlsZS5maWxlTmFtZX1gLFxuICAgICAgICAgICAgICAgICAgJzpob3ZlcidcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5pY29ufT5cbiAgICAgICAgICAgICAgICA8Rm9sZGVySWNvblNWRyAvPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuZmlsZU5hbWV9Pnt0aGlzLnByb3BzLm5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxDb2xsYXBzZVxuICAgICAgICAgIGlzT3BlbmVkPXtpc09wZW5lZH1cbiAgICAgICAgICBzcHJpbmdDb25maWc9e3tzdGlmZm5lc3M6IDE3NywgZGFtcGluZzogMTd9fVxuICAgICAgICA+XG4gICAgICAgICAge3N1YkxldmVsfVxuICAgICAgICA8L0NvbGxhcHNlPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShDb2xsYXBzZUl0ZW0pXG4iXX0=