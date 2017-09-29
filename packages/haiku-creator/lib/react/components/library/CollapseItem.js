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
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 89
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronDownSVG, { color: 'transparent', __source: {
              fileName: _jsxFileName,
              lineNumber: 90
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
              lineNumber: 96
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronDownSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 97
            },
            __self: this
          })
        );
      } else {
        return _react2.default.createElement(
          'span',
          { style: STYLES.chevy, __source: {
              fileName: _jsxFileName,
              lineNumber: 102
            },
            __self: this
          },
          _react2.default.createElement(_Icons.CollapseChevronRightSVG, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 103
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
            lineNumber: 120
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
            lineNumber: 135
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
              lineNumber: 151
            },
            __self: _this2
          });
        });
      }

      return _react2.default.createElement(
        'div',
        { style: STYLES.row, __source: {
            fileName: _jsxFileName,
            lineNumber: 168
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { onClick: this.handleCollapseToggle, __source: {
              fileName: _jsxFileName,
              lineNumber: 169
            },
            __self: this
          },
          this.renderChevy(),
          this.props.file ? _react2.default.createElement(
            'span',
            { key: 'file-header-' + file.fileName, style: STYLES.header, __source: {
                fileName: _jsxFileName,
                lineNumber: 172
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.handleSketchDoubleClick, style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 173
                },
                __self: this
              },
              _react2.default.createElement(_Icons.SketchIconSVG, { style: '', color: _radium2.default.getState(this.state, 'file-header-' + file.fileName, ':hover') ? _Palette2.default.ORANGE : _Palette2.default.DARKER_ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 174
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              'span',
              { onContextMenu: this.handleContextMenu.bind(this), onDoubleClick: this.handleSketchDoubleClick, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 176
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
                lineNumber: 178
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 178
                },
                __self: this
              },
              _react2.default.createElement(_Icons.FolderIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 178
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
              lineNumber: 182
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvQ29sbGFwc2VJdGVtLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJzaGVsbCIsIlNUWUxFUyIsInJvdyIsIm1hcmdpbkxlZnQiLCJ1c2VyU2VsZWN0IiwiY3Vyc29yIiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5Cb3R0b20iLCJmb250U2l6ZSIsImNoZXZ5IiwibWFyZ2luUmlnaHQiLCJpY29uIiwicG9zaXRpb24iLCJ0b3AiLCJoZWFkZXIiLCJDb2xsYXBzZUl0ZW0iLCJwcm9wcyIsInN0YXRlIiwiaXNPcGVuZWQiLCJoYW5kbGVDb2xsYXBzZVRvZ2dsZSIsImJpbmQiLCJoYW5kbGVTa2V0Y2hEb3VibGVDbGljayIsInNldFN0YXRlIiwiZXZlbnQiLCJmb2xkZXIiLCJmaWxlIiwibWVudSIsImxpYnJhcnkiLCJvbiIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsInNob3dJdGVtSW5Gb2xkZXIiLCJjb2xsZWN0aW9uIiwibGVuZ3RoIiwiYXJ0Ym9hcmRzIiwic2xpY2VzIiwiZG9lc0Fzc2V0SGF2ZUFueURlc2NlbmRhbnRzIiwiaW5zdGFudGlhdGUiLCJzdWJMZXZlbCIsInB1c2giLCJjaGFuZ2VQcmV2aWV3Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJ3ZWJzb2NrZXQiLCJtYXAiLCJwcmV2aWV3IiwidXBkYXRlVGltZSIsInJlbmRlckNoZXZ5IiwiaGFuZGxlQ29udGV4dE1lbnUiLCJnZXRTdGF0ZSIsIk9SQU5HRSIsIkRBUktFUl9ST0NLIiwibmFtZSIsInN0aWZmbmVzcyIsImRhbXBpbmciLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7ZUFDZ0JBLFFBQVEsVUFBUixDO0lBQVRDLEssWUFBQUEsSzs7QUFFUCxJQUFNQyxTQUFTO0FBQ2JDLE9BQUs7QUFDSEMsZ0JBQVksRUFEVDtBQUVIQyxnQkFBWSxNQUZUO0FBR0hDLFlBQVEsU0FITDtBQUlIQyxnQkFBWSxDQUpUO0FBS0hDLG1CQUFlLENBTFo7QUFNSEMsa0JBQWMsQ0FOWDtBQU9IQyxjQUFVO0FBUFAsR0FEUTtBQVViQyxTQUFPO0FBQ0xDLGlCQUFhO0FBRFIsR0FWTTtBQWFiQyxRQUFNO0FBQ0pDLGNBQVUsVUFETjtBQUVKQyxTQUFLLENBRkQ7QUFHSkgsaUJBQWE7QUFIVCxHQWJPO0FBa0JiSSxVQUFRO0FBQ04sY0FBVSxDQUFFO0FBQUY7QUFESjtBQWxCSyxDQUFmOztJQXdCTUMsWTs7O0FBQ0osd0JBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSw0SEFDWkEsS0FEWTs7QUFFbEIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGdCQUFVO0FBREMsS0FBYjs7QUFJQSxVQUFLQyxvQkFBTCxHQUE0QixNQUFLQSxvQkFBTCxDQUEwQkMsSUFBMUIsT0FBNUI7QUFDQSxVQUFLQyx1QkFBTCxHQUErQixNQUFLQSx1QkFBTCxDQUE2QkQsSUFBN0IsT0FBL0I7QUFQa0I7QUFRbkI7Ozs7MkNBRXVCO0FBQ3RCLFdBQUtFLFFBQUwsQ0FBYyxFQUFDSixVQUFVLENBQUMsS0FBS0QsS0FBTCxDQUFXQyxRQUF2QixFQUFkO0FBQ0Q7OztzQ0FFa0JLLEssRUFBTztBQUFBLG1CQUNELEtBQUtQLEtBREo7QUFBQSxVQUNqQlEsTUFEaUIsVUFDakJBLE1BRGlCO0FBQUEsVUFDVEMsSUFEUyxVQUNUQSxJQURTOztBQUV4QixVQUFJQyxPQUFPLDBCQUFnQixJQUFoQixFQUFzQjtBQUMvQkMsaUJBQVMsSUFEc0IsQ0FDakI7QUFEaUIsT0FBdEIsQ0FBWDs7QUFJQUQsV0FBS0UsRUFBTCxDQUFRLDZCQUFSLEVBQXVDLFlBQU07QUFDM0MsWUFBSUMsVUFBVSxlQUFLQyxJQUFMLENBQVVOLE1BQVYsRUFBa0IsU0FBbEIsRUFBNkJDLEtBQUtNLFFBQWxDLENBQWQ7QUFDQWhDLGNBQU1pQyxRQUFOLENBQWVILE9BQWY7QUFDRCxPQUhEOztBQUtBSCxXQUFLRSxFQUFMLENBQVEsNkJBQVIsRUFBdUMsWUFBTTtBQUMzQyxZQUFJQyxVQUFVLGVBQUtDLElBQUwsQ0FBVU4sTUFBVixFQUFrQixTQUFsQixFQUE2QkMsS0FBS00sUUFBbEMsQ0FBZDtBQUNBaEMsY0FBTWtDLGdCQUFOLENBQXVCSixPQUF2QjtBQUNELE9BSEQ7QUFJRDs7O2tEQUU4QjtBQUM3QixVQUFJLEtBQUtiLEtBQUwsQ0FBV2tCLFVBQVgsSUFBeUIsS0FBS2xCLEtBQUwsQ0FBV2tCLFVBQVgsQ0FBc0JDLE1BQXRCLEdBQStCLENBQTVELEVBQStEO0FBQzdELGVBQU8sSUFBUDtBQUNEO0FBQ0QsVUFBSSxLQUFLbkIsS0FBTCxDQUFXUyxJQUFmLEVBQXFCO0FBQ25CLFlBQUksS0FBS1QsS0FBTCxDQUFXUyxJQUFYLENBQWdCVyxTQUFwQixFQUErQjtBQUM3QixjQUFJLEtBQUtwQixLQUFMLENBQVdTLElBQVgsQ0FBZ0JXLFNBQWhCLENBQTBCRixVQUExQixDQUFxQ0MsTUFBckMsR0FBOEMsQ0FBbEQsRUFBcUQ7QUFDbkQsbUJBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxZQUFJLEtBQUtuQixLQUFMLENBQVdTLElBQVgsQ0FBZ0JZLE1BQXBCLEVBQTRCO0FBQzFCLGNBQUksS0FBS3JCLEtBQUwsQ0FBV1MsSUFBWCxDQUFnQlksTUFBaEIsQ0FBdUJILFVBQXZCLENBQWtDQyxNQUFsQyxHQUEyQyxDQUEvQyxFQUFrRDtBQUNoRCxtQkFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsYUFBTyxLQUFQO0FBQ0Q7OztrQ0FFYztBQUNiLFVBQUksQ0FBQyxLQUFLRywyQkFBTCxFQUFMLEVBQXlDO0FBQ3ZDLGVBQ0U7QUFBQTtBQUFBLFlBQU0sT0FBT3RDLE9BQU9TLEtBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLHlFQUF3QixPQUFNLGFBQTlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGLFNBREY7QUFLRDtBQUNELFVBQUksS0FBS1EsS0FBTCxDQUFXQyxRQUFmLEVBQXlCO0FBQ3ZCLGVBQ0U7QUFBQTtBQUFBLFlBQU0sT0FBT2xCLE9BQU9TLEtBQXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREYsU0FERjtBQUtELE9BTkQsTUFNTztBQUNMLGVBQ0U7QUFBQTtBQUFBLFlBQU0sT0FBT1QsT0FBT1MsS0FBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFERixTQURGO0FBS0Q7QUFDRjs7OzhDQUUwQjtBQUN6QixXQUFLTyxLQUFMLENBQVd1QixXQUFYO0FBQ0Q7Ozs2QkFFUztBQUFBOztBQUFBLFVBQ0RyQixRQURDLEdBQ1csS0FBS0QsS0FEaEIsQ0FDREMsUUFEQztBQUFBLFVBRURPLElBRkMsR0FFTyxLQUFLVCxLQUZaLENBRURTLElBRkM7O0FBR1IsVUFBSWUsV0FBVyxFQUFmOztBQUVBLFVBQUlmLFFBQVFBLEtBQUtXLFNBQUwsQ0FBZUYsVUFBZixDQUEwQkMsTUFBMUIsR0FBbUMsQ0FBL0MsRUFBa0Q7QUFDaERLLGlCQUFTQyxJQUFULENBQ0UsOEJBQUMsWUFBRDtBQUNFLDJCQUFlaEIsS0FBS00sUUFEdEI7QUFFRSxnQkFBSyxXQUZQO0FBR0Usc0JBQVlOLEtBQUtXLFNBQUwsQ0FBZUYsVUFIN0I7QUFJRSx5QkFBZSxLQUFLbEIsS0FBTCxDQUFXMEIsYUFKNUI7QUFLRSxxQkFBVyxLQUFLMUIsS0FBTCxDQUFXMkIsU0FMeEI7QUFNRSx1QkFBYSxLQUFLM0IsS0FBTCxDQUFXNEIsV0FOMUI7QUFPRSxxQkFBVyxLQUFLNUIsS0FBTCxDQUFXNkIsU0FQeEI7QUFRRSx1QkFBYSxLQUFLN0IsS0FBTCxDQUFXdUIsV0FSMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFERjtBQVlEOztBQUVELFVBQUlkLFFBQVFBLEtBQUtZLE1BQUwsQ0FBWUgsVUFBWixDQUF1QkMsTUFBdkIsR0FBZ0MsQ0FBNUMsRUFBK0M7QUFDN0NLLGlCQUFTQyxJQUFULENBQ0UsOEJBQUMsWUFBRDtBQUNFLDJCQUFlaEIsS0FBS00sUUFEdEI7QUFFRSxnQkFBSyxRQUZQO0FBR0Usc0JBQVlOLEtBQUtZLE1BQUwsQ0FBWUgsVUFIMUI7QUFJRSx5QkFBZSxLQUFLbEIsS0FBTCxDQUFXMEIsYUFKNUI7QUFLRSxxQkFBVyxLQUFLMUIsS0FBTCxDQUFXMkIsU0FMeEI7QUFNRSx1QkFBYSxLQUFLM0IsS0FBTCxDQUFXNEIsV0FOMUI7QUFPRSxxQkFBVyxLQUFLNUIsS0FBTCxDQUFXNkIsU0FQeEI7QUFRRSx1QkFBYSxLQUFLN0IsS0FBTCxDQUFXdUIsV0FSMUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFERjtBQVlEOztBQUVELFVBQUksS0FBS3ZCLEtBQUwsQ0FBV2tCLFVBQVgsSUFBeUIsS0FBS2xCLEtBQUwsQ0FBV2tCLFVBQVgsQ0FBc0JDLE1BQXRCLEdBQStCLENBQTVELEVBQStEO0FBQzdESyxtQkFBVyxLQUFLeEIsS0FBTCxDQUFXa0IsVUFBWCxDQUFzQlksR0FBdEIsQ0FBMEIsVUFBQ3JCLElBQUQsRUFBVTtBQUM3QyxpQkFDRTtBQUNFLHdCQURGO0FBRUUsNkJBQWVBLEtBQUtNLFFBRnRCO0FBR0UsdUJBQVcsT0FBS2YsS0FBTCxDQUFXMkIsU0FIeEI7QUFJRSx5QkFBYSxPQUFLM0IsS0FBTCxDQUFXNEIsV0FKMUI7QUFLRSxzQkFBVW5CLEtBQUtNLFFBTGpCO0FBTUUscUJBQVNOLEtBQUtzQixPQU5oQjtBQU9FLHdCQUFZdEIsS0FBS3VCLFVBUG5CO0FBUUUsdUJBQVcsT0FBS2hDLEtBQUwsQ0FBVzZCLFNBUnhCO0FBU0UsMkJBQWUsT0FBSzdCLEtBQUwsQ0FBVzBCLGFBVDVCO0FBVUUseUJBQWEsT0FBSzFCLEtBQUwsQ0FBV3VCLFdBVjFCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBREY7QUFjRCxTQWZVLENBQVg7QUFnQkQ7O0FBRUQsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPdkMsT0FBT0MsR0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssU0FBUyxLQUFLa0Isb0JBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGVBQUs4QixXQUFMLEVBREg7QUFFRyxlQUFLakMsS0FBTCxDQUFXUyxJQUFYLEdBQ0c7QUFBQTtBQUFBLGNBQU0sc0JBQW9CQSxLQUFLTSxRQUEvQixFQUEyQyxPQUFPL0IsT0FBT2MsTUFBekQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLGdCQUFNLGVBQWUsS0FBS29DLGlCQUFMLENBQXVCOUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBckIsRUFBd0QsZUFBZSxLQUFLQyx1QkFBNUUsRUFBcUcsT0FBT3JCLE9BQU9XLElBQW5IO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLG9FQUFlLE9BQU0sRUFBckIsRUFBd0IsT0FBTyxpQkFBT3dDLFFBQVAsQ0FBZ0IsS0FBS2xDLEtBQXJCLG1CQUEyQ1EsS0FBS00sUUFBaEQsRUFBNEQsUUFBNUQsSUFBd0Usa0JBQVFxQixNQUFoRixHQUF5RixrQkFBUUMsV0FBaEk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREYsYUFEQTtBQUlBO0FBQUE7QUFBQSxnQkFBTSxlQUFlLEtBQUtILGlCQUFMLENBQXVCOUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBckIsRUFBd0QsZUFBZSxLQUFLQyx1QkFBNUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXNHLG1CQUFLTCxLQUFMLENBQVdTLElBQVgsQ0FBZ0JNO0FBQXRIO0FBSkEsV0FESCxHQU9HO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFNO0FBQUE7QUFBQSxnQkFBTSxPQUFPL0IsT0FBT1csSUFBcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQTFCLGFBQU47QUFBeUQsaUJBQUtLLEtBQUwsQ0FBV3NDO0FBQXBFO0FBVE4sU0FERjtBQWNFO0FBQUE7QUFBQSxZQUFVLFVBQVVwQyxRQUFwQixFQUE4QixjQUFjLEVBQUNxQyxXQUFXLEdBQVosRUFBaUJDLFNBQVMsRUFBMUIsRUFBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0doQjtBQURIO0FBZEYsT0FERjtBQW9CRDs7OztFQXhKd0IsZ0JBQU1pQixTOztrQkEySmxCLHNCQUFPMUMsWUFBUCxDIiwiZmlsZSI6IkNvbGxhcHNlSXRlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4uL1BhbGV0dGUuanMnXG5pbXBvcnQgQ29sbGFwc2UgZnJvbSAncmVhY3QtY29sbGFwc2UnXG5pbXBvcnQgTGlicmFyeUl0ZW0gZnJvbSAnLi9MaWJyYXJ5SXRlbSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuLy4uLy4uL0NvbnRleHRNZW51J1xuaW1wb3J0IHsgQ29sbGFwc2VDaGV2cm9uUmlnaHRTVkcsIENvbGxhcHNlQ2hldnJvbkRvd25TVkcsIFNrZXRjaEljb25TVkcsIEZvbGRlckljb25TVkcgfSBmcm9tICcuLy4uL0ljb25zJ1xuY29uc3Qge3NoZWxsfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcblxuY29uc3QgU1RZTEVTID0ge1xuICByb3c6IHtcbiAgICBtYXJnaW5MZWZ0OiAxMyxcbiAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgcGFkZGluZ1RvcDogMixcbiAgICBwYWRkaW5nQm90dG9tOiAyLFxuICAgIG1hcmdpbkJvdHRvbTogNCxcbiAgICBmb250U2l6ZTogMTNcbiAgfSxcbiAgY2hldnk6IHtcbiAgICBtYXJnaW5SaWdodDogNlxuICB9LFxuICBpY29uOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgdG9wOiAzLFxuICAgIG1hcmdpblJpZ2h0OiA2XG4gIH0sXG4gIGhlYWRlcjoge1xuICAgICc6aG92ZXInOiB7IC8vIGhhcyB0byBiZSBoZXJlIGZvciB0aGUgUmFkaXVtLmdldFN0YXRlIHRvIHdvcmtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQ29sbGFwc2VJdGVtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzT3BlbmVkOiB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVDb2xsYXBzZVRvZ2dsZSA9IHRoaXMuaGFuZGxlQ29sbGFwc2VUb2dnbGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlU2tldGNoRG91YmxlQ2xpY2sgPSB0aGlzLmhhbmRsZVNrZXRjaERvdWJsZUNsaWNrLmJpbmQodGhpcylcbiAgfVxuXG4gIGhhbmRsZUNvbGxhcHNlVG9nZ2xlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc09wZW5lZDogIXRoaXMuc3RhdGUuaXNPcGVuZWR9KVxuICB9XG5cbiAgaGFuZGxlQ29udGV4dE1lbnUgKGV2ZW50KSB7XG4gICAgY29uc3Qge2ZvbGRlciwgZmlsZX0gPSB0aGlzLnByb3BzXG4gICAgbGV0IG1lbnUgPSBuZXcgQ29udGV4dE1lbnUodGhpcywge1xuICAgICAgbGlicmFyeTogdHJ1ZSAvLyBIYWNreTogVXNlZCB0byBjb25maWd1cmUgd2hhdCB0byBkaXNwbGF5IGluIHRoZSBjb250ZXh0IG1lbnU7IHNlZSBDb250ZXh0TWVudS5qc1xuICAgIH0pXG5cbiAgICBtZW51Lm9uKCdjb250ZXh0LW1lbnU6b3Blbi1pbi1za2V0Y2gnLCAoKSA9PiB7XG4gICAgICB2YXIgYWJzcGF0aCA9IHBhdGguam9pbihmb2xkZXIsICdkZXNpZ25zJywgZmlsZS5maWxlTmFtZSlcbiAgICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gICAgfSlcblxuICAgIG1lbnUub24oJ2NvbnRleHQtbWVudTpzaG93LWluLWZpbmRlcicsICgpID0+IHtcbiAgICAgIHZhciBhYnNwYXRoID0gcGF0aC5qb2luKGZvbGRlciwgJ2Rlc2lnbnMnLCBmaWxlLmZpbGVOYW1lKVxuICAgICAgc2hlbGwuc2hvd0l0ZW1JbkZvbGRlcihhYnNwYXRoKVxuICAgIH0pXG4gIH1cblxuICBkb2VzQXNzZXRIYXZlQW55RGVzY2VuZGFudHMgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNvbGxlY3Rpb24gJiYgdGhpcy5wcm9wcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGlmICh0aGlzLnByb3BzLmZpbGUpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuYXJ0Ym9hcmRzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuYXJ0Ym9hcmRzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuc2xpY2VzKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmZpbGUuc2xpY2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZW5kZXJDaGV2eSAoKSB7XG4gICAgaWYgKCF0aGlzLmRvZXNBc3NldEhhdmVBbnlEZXNjZW5kYW50cygpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBzdHlsZT17U1RZTEVTLmNoZXZ5fT5cbiAgICAgICAgICA8Q29sbGFwc2VDaGV2cm9uRG93blNWRyBjb2xvcj0ndHJhbnNwYXJlbnQnIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNPcGVuZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuY2hldnl9PlxuICAgICAgICAgIDxDb2xsYXBzZUNoZXZyb25Eb3duU1ZHIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5jaGV2eX0+XG4gICAgICAgICAgPENvbGxhcHNlQ2hldnJvblJpZ2h0U1ZHIC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTa2V0Y2hEb3VibGVDbGljayAoKSB7XG4gICAgdGhpcy5wcm9wcy5pbnN0YW50aWF0ZSgpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtpc09wZW5lZH0gPSB0aGlzLnN0YXRlXG4gICAgY29uc3Qge2ZpbGV9ID0gdGhpcy5wcm9wc1xuICAgIGxldCBzdWJMZXZlbCA9IFtdXG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2Bib2FyZHMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nQXJ0Ym9hcmRzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuYXJ0Ym9hcmRzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoZmlsZSAmJiBmaWxlLnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIHN1YkxldmVsLnB1c2goXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBrZXk9e2BzbGljZXMtJHtmaWxlLmZpbGVOYW1lfWB9XG4gICAgICAgICAgbmFtZT0nU2xpY2VzJ1xuICAgICAgICAgIGNvbGxlY3Rpb249e2ZpbGUuc2xpY2VzLmNvbGxlY3Rpb259XG4gICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5wcm9wcy5pbnN0YW50aWF0ZX1cbiAgICAgICAgLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jb2xsZWN0aW9uICYmIHRoaXMucHJvcHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBzdWJMZXZlbCA9IHRoaXMucHJvcHMuY29sbGVjdGlvbi5tYXAoKGZpbGUpID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAgICAgIGluVHJlZVxuICAgICAgICAgICAga2V5PXtgbXlJdGVtLSR7ZmlsZS5maWxlTmFtZX1gfVxuICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgICAgZmlsZU5hbWU9e2ZpbGUuZmlsZU5hbWV9XG4gICAgICAgICAgICBwcmV2aWV3PXtmaWxlLnByZXZpZXd9XG4gICAgICAgICAgICB1cGRhdGVUaW1lPXtmaWxlLnVwZGF0ZVRpbWV9XG4gICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgY2hhbmdlUHJldmlldz17dGhpcy5wcm9wcy5jaGFuZ2VQcmV2aWV3fVxuICAgICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMucHJvcHMuaW5zdGFudGlhdGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnJvd30+XG4gICAgICAgIDxkaXYgb25DbGljaz17dGhpcy5oYW5kbGVDb2xsYXBzZVRvZ2dsZX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ2hldnkoKX1cbiAgICAgICAgICB7dGhpcy5wcm9wcy5maWxlXG4gICAgICAgICAgICA/IDxzcGFuIGtleT17YGZpbGUtaGVhZGVyLSR7ZmlsZS5maWxlTmFtZX1gfSBzdHlsZT17U1RZTEVTLmhlYWRlcn0+XG4gICAgICAgICAgICAgIDxzcGFuIG9uQ29udGV4dE1lbnU9e3RoaXMuaGFuZGxlQ29udGV4dE1lbnUuYmluZCh0aGlzKX0gb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVTa2V0Y2hEb3VibGVDbGlja30gc3R5bGU9e1NUWUxFUy5pY29ufT5cbiAgICAgICAgICAgICAgICA8U2tldGNoSWNvblNWRyBzdHlsZT0nJyBjb2xvcj17UmFkaXVtLmdldFN0YXRlKHRoaXMuc3RhdGUsIGBmaWxlLWhlYWRlci0ke2ZpbGUuZmlsZU5hbWV9YCwgJzpob3ZlcicpID8gUGFsZXR0ZS5PUkFOR0UgOiBQYWxldHRlLkRBUktFUl9ST0NLfSAvPlxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIG9uQ29udGV4dE1lbnU9e3RoaXMuaGFuZGxlQ29udGV4dE1lbnUuYmluZCh0aGlzKX0gb25Eb3VibGVDbGljaz17dGhpcy5oYW5kbGVTa2V0Y2hEb3VibGVDbGlja30+e3RoaXMucHJvcHMuZmlsZS5maWxlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA6IDxzcGFuPjxzcGFuIHN0eWxlPXtTVFlMRVMuaWNvbn0+PEZvbGRlckljb25TVkcgLz48L3NwYW4+e3RoaXMucHJvcHMubmFtZX08L3NwYW4+XG4gICAgICAgICAgfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8Q29sbGFwc2UgaXNPcGVuZWQ9e2lzT3BlbmVkfSBzcHJpbmdDb25maWc9e3tzdGlmZm5lc3M6IDE3NywgZGFtcGluZzogMTd9fT5cbiAgICAgICAgICB7c3ViTGV2ZWx9XG4gICAgICAgIDwvQ29sbGFwc2U+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKENvbGxhcHNlSXRlbSlcbiJdfQ==