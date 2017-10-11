'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/library/Library.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Palette = require('./../Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _LibraryItem = require('./LibraryItem');

var _LibraryItem2 = _interopRequireDefault(_LibraryItem);

var _CollapseItem = require('./CollapseItem');

var _CollapseItem2 = _interopRequireDefault(_CollapseItem);

var _Rectangle = require('./../../primitives/Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _Ellipse = require('./../../primitives/Ellipse');

var _Ellipse2 = _interopRequireDefault(_Ellipse);

var _Polygon = require('./../../primitives/Polygon');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _Text = require('./../../primitives/Text');

var _Text2 = _interopRequireDefault(_Text);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  scrollwrap: {
    overflowY: 'auto',
    height: '100%'
  },
  sectionHeader: {
    cursor: 'default',
    height: 25,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    padding: '18px 14px 10px',
    fontSize: 15,
    justifyContent: 'space-between'
  },
  primitivesWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    overflow: 'hidden'
  },
  assetsWrapper: {
    paddingTop: 6,
    paddingBottom: 6,
    position: 'relative',
    minHeight: '300px',
    overflow: 'hidden'
  },
  fileDropWrapper: {
    pointerEvents: 'none'
  },
  button: {
    position: 'relative',
    zIndex: 2,
    padding: '3px 9px',
    backgroundColor: _Palette2.default.DARKER_GRAY,
    color: _Palette2.default.ROCK,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -4,
    borderRadius: 3,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease',
    ':hover': {
      backgroundColor: (0, _color2.default)(_Palette2.default.DARKER_GRAY).darken(0.2)
    },
    ':active': {
      transform: 'scale(.8)'
    }
  },
  startText: {
    color: _Palette2.default.COAL,
    fontSize: 25,
    padding: 24,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  primaryAssetText: {
    color: _Palette2.default.DARK_ROCK,
    fontSize: 16,
    padding: 24,
    textAlign: 'center'
  }
};

var LibraryDrawer = function (_React$Component) {
  _inherits(LibraryDrawer, _React$Component);

  function LibraryDrawer(props) {
    _classCallCheck(this, LibraryDrawer);

    var _this = _possibleConstructorReturn(this, (LibraryDrawer.__proto__ || Object.getPrototypeOf(LibraryDrawer)).call(this, props));

    _this.primitives = {
      Rectangle: (0, _Rectangle2.default)(props.websocket),
      Ellipse: (0, _Ellipse2.default)(props.websocket),
      Polygon: (0, _Polygon2.default)(props.websocket),
      Text: (0, _Text2.default)(props.websocket)
    };
    _this.state = {
      error: null,
      assets: [],
      previewImageTime: null,
      overDropTarget: false,
      isLoading: false
    };
    return _this;
  }

  _createClass(LibraryDrawer, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.setState({ isLoading: true });
      this.reloadAssetList();
      this.props.websocket.on('broadcast', function (_ref) {
        var name = _ref.name,
            assets = _ref.assets;

        if (name === 'assets-changed') {
          _this2.setState({ assets: assets });
        }
      });
    }
  }, {
    key: 'reloadAssetList',
    value: function reloadAssetList() {
      var _this3 = this;

      return this.props.websocket.request({ method: 'listAssets', params: [this.props.folder] }, function (error, assets) {
        if (error) return _this3.setState({ error: error });
        _this3.setState({ assets: assets });
        setTimeout(function () {
          _this3.setState({ isLoading: false });
        }, 1000);
      });
    }
  }, {
    key: 'handleFileInstantiation',
    value: function handleFileInstantiation(fileData) {
      var _this4 = this;

      if (!fileData.preview) return this.props.createNotice({ type: 'warning', title: 'Oops!', message: 'File path was blank; cannot instantiate' });
      var metadata = {};
      this.props.websocket.request({ type: 'action', method: 'instantiateComponent', params: [this.props.folder, fileData.preview, metadata] }, function (err) {
        if (err) {
          return _this4.props.createNotice({ type: 'danger', title: err.name, message: err.message });
        }
      });
    }
  }, {
    key: 'handleSketchInstantiation',
    value: function handleSketchInstantiation(fileData) {
      var abspath = _path2.default.join(this.props.folder, 'designs', fileData.fileName);
      _electron.shell.openItem(abspath);
    }
  }, {
    key: 'handleAssetInstantiation',
    value: function handleAssetInstantiation(fileData) {
      switch (fileData.type) {
        case 'sketch':
          this.handleSketchInstantiation(fileData);
          this.props.tourChannel.next();
          break;
        case 'file':
          this.handleFileInstantiation(fileData);
          break;
        default:
          this.props.createNotice({ type: 'warning', title: 'Oops!', message: 'Couldn\'t handle that file, please contact support.' });
      }
    }
  }, {
    key: 'handleFileDrop',
    value: function handleFileDrop(files, event) {
      var _this5 = this;

      this.setState({ isLoading: true });

      var filePaths = _lodash2.default.map(files, function (file) {
        return file.path;
      });

      this.props.websocket.request({ method: 'bulkLinkAssets', params: [filePaths, this.props.folder] }, function (error, assets) {
        _this5.setState({ isLoading: false });
        if (error) _this5.setState({ error: error });
        _this5.setState({ assets: assets });
      });
    }
  }, {
    key: 'getPrimaryAsset',
    value: function getPrimaryAsset() {
      if (!this.state.assets) return null;
      if (this.state.assets.length < 1) return null;
      var primary = void 0;
      this.state.assets.forEach(function (asset) {
        if (asset.isPrimaryDesign) {
          primary = asset;
        }
      });
      return primary;
    }
  }, {
    key: 'getOtherAssets',
    value: function getOtherAssets() {
      if (!this.state.assets) return [];
      if (this.state.assets.length < 1) return [];
      var others = [];
      this.state.assets.forEach(function (asset) {
        if (!asset.isPrimaryDesign) {
          others.push(asset);
        }
      });
      return others;
    }
  }, {
    key: 'renderPrimaryAsset',
    value: function renderPrimaryAsset(asset) {
      return this.renderAssetItem(asset, true);
    }
  }, {
    key: 'renderPrimaryAssetHint',
    value: function renderPrimaryAssetHint(asset) {
      var hasSubAssets = false;
      if (asset.artboards && asset.artboards.collection.length > 0) hasSubAssets = true;
      if (asset.pages && asset.pages.collection.length > 0) hasSubAssets = true;
      if (asset.slices && asset.slices.collection.length > 0) hasSubAssets = true;

      if (hasSubAssets) {
        return '';
      } else {
        return _react2.default.createElement(
          'div',
          { style: STYLES.primaryAssetText, __source: {
              fileName: _jsxFileName,
              lineNumber: 201
            },
            __self: this
          },
          '\u21E7 Double click to open this file in Sketch. Every slice and artboard will be synced here when you save.'
        );
      }
    }
  }, {
    key: 'renderAssetItem',
    value: function renderAssetItem(asset, isPrimaryAsset) {
      if (asset.type === 'sketch') {
        return _react2.default.createElement(_CollapseItem2.default, {
          isPrimaryAsset: isPrimaryAsset,
          key: asset.fileName,
          file: asset,
          folder: this.props.folder,
          onDragEnd: this.props.onDragEnd,
          onDragStart: this.props.onDragStart,
          websocket: this.props.websocket,
          instantiate: this.handleAssetInstantiation.bind(this, asset), __source: {
            fileName: _jsxFileName,
            lineNumber: 212
          },
          __self: this
        });
      }

      return _react2.default.createElement(_LibraryItem2.default, {
        key: asset.fileName,
        preview: asset.preview,
        fileName: asset.fileName,
        onDragEnd: this.props.onDragEnd,
        onDragStart: this.props.onDragStart,
        updateTime: asset.updateTime,
        websocket: this.props.websocket,
        instantiate: this.handleAssetInstantiation.bind(this, asset), __source: {
          fileName: _jsxFileName,
          lineNumber: 225
        },
        __self: this
      });
    }
  }, {
    key: 'renderOtherAssets',
    value: function renderOtherAssets(assets) {
      var _this6 = this;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 239
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 242
              },
              __self: _this6
            },
            _this6.renderAssetItem(file)
          );
        })
      );
    }
  }, {
    key: 'renderAssetsList',
    value: function renderAssetsList() {
      var primaryAsset = this.getPrimaryAsset();
      var otherAssets = this.getOtherAssets();

      if (!primaryAsset && otherAssets.length < 1) {
        return _react2.default.createElement(
          'div',
          { style: STYLES.startText, __source: {
              fileName: _jsxFileName,
              lineNumber: 257
            },
            __self: this
          },
          'Import a Sketch or SVG file to start'
        );
      }

      if (!primaryAsset && otherAssets.length > 0) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 265
            },
            __self: this
          },
          this.renderOtherAssets(otherAssets)
        );
      }

      if (primaryAsset && otherAssets.length < 1) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 273
            },
            __self: this
          },
          this.renderPrimaryAsset(primaryAsset),
          this.renderPrimaryAssetHint(primaryAsset)
        );
      }

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 281
          },
          __self: this
        },
        this.renderPrimaryAsset(primaryAsset),
        this.renderOtherAssets(otherAssets)
      );
    }
  }, {
    key: 'propsForPrimitive',
    value: function propsForPrimitive(name) {
      return this.primitives[name];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      return _react2.default.createElement(
        'div',
        { id: 'library-wrapper', style: { height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 294
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 295
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 297
              },
              __self: this
            },
            '+'
          ),
          _react2.default.createElement('input', {
            type: 'file',
            ref: 'filepicker',
            multiple: true,
            onChange: function onChange(e) {
              return _this7.handleFileDrop(_this7.refs.filepicker.files, e);
            },
            style: { opacity: 0, position: 'absolute', right: 0, width: 90, zIndex: 3 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 298
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 305
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 306
              },
              __self: this
            },
            this.state.isLoading ? '' : this.renderAssetsList()
          )
        )
      );
    }
  }]);

  return LibraryDrawer;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(LibraryDrawer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsImZpbGVEYXRhIiwicHJldmlldyIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsImVyciIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImZpbGVzIiwiZXZlbnQiLCJmaWxlUGF0aHMiLCJtYXAiLCJmaWxlIiwicGF0aCIsImxlbmd0aCIsInByaW1hcnkiLCJmb3JFYWNoIiwiYXNzZXQiLCJpc1ByaW1hcnlEZXNpZ24iLCJvdGhlcnMiLCJwdXNoIiwicmVuZGVyQXNzZXRJdGVtIiwiaGFzU3ViQXNzZXRzIiwiYXJ0Ym9hcmRzIiwiY29sbGVjdGlvbiIsInBhZ2VzIiwic2xpY2VzIiwiaXNQcmltYXJ5QXNzZXQiLCJvbkRyYWdFbmQiLCJvbkRyYWdTdGFydCIsImhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiIsImJpbmQiLCJ1cGRhdGVUaW1lIiwiaW5kZXgiLCJwcmltYXJ5QXNzZXQiLCJnZXRQcmltYXJ5QXNzZXQiLCJvdGhlckFzc2V0cyIsImdldE90aGVyQXNzZXRzIiwicmVuZGVyT3RoZXJBc3NldHMiLCJyZW5kZXJQcmltYXJ5QXNzZXQiLCJyZW5kZXJQcmltYXJ5QXNzZXRIaW50IiwibGF1bmNoRmlsZXBpY2tlciIsImUiLCJoYW5kbGVGaWxlRHJvcCIsInJlZnMiLCJmaWxlcGlja2VyIiwib3BhY2l0eSIsInJpZ2h0Iiwid2lkdGgiLCJyZW5kZXJBc3NldHNMaXN0IiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsY0FBWTtBQUNWQyxlQUFXLE1BREQ7QUFFVkMsWUFBUTtBQUZFLEdBREM7QUFLYkMsaUJBQWU7QUFDYkMsWUFBUSxTQURLO0FBRWJGLFlBQVEsRUFGSztBQUdiRyxtQkFBZSxXQUhGO0FBSWJDLGFBQVMsTUFKSTtBQUtiQyxnQkFBWSxRQUxDO0FBTWJDLGFBQVMsZ0JBTkk7QUFPYkMsY0FBVSxFQVBHO0FBUWJDLG9CQUFnQjtBQVJILEdBTEY7QUFlYkMscUJBQW1CO0FBQ2pCQyxnQkFBWSxDQURLO0FBRWpCQyxtQkFBZSxDQUZFO0FBR2pCQyxjQUFVLFVBSE87QUFJakJDLGNBQVU7QUFKTyxHQWZOO0FBcUJiQyxpQkFBZTtBQUNiSixnQkFBWSxDQURDO0FBRWJDLG1CQUFlLENBRkY7QUFHYkMsY0FBVSxVQUhHO0FBSWJHLGVBQVcsT0FKRTtBQUtiRixjQUFVO0FBTEcsR0FyQkY7QUE0QmJHLG1CQUFpQjtBQUNmQyxtQkFBZTtBQURBLEdBNUJKO0FBK0JiQyxVQUFRO0FBQ05OLGNBQVUsVUFESjtBQUVOTyxZQUFRLENBRkY7QUFHTmIsYUFBUyxTQUhIO0FBSU5jLHFCQUFpQixrQkFBUUMsV0FKbkI7QUFLTkMsV0FBTyxrQkFBUUMsSUFMVDtBQU1OaEIsY0FBVSxFQU5KO0FBT05pQixnQkFBWSxNQVBOO0FBUU5DLGVBQVcsQ0FBQyxDQVJOO0FBU05DLGtCQUFjLENBVFI7QUFVTnhCLFlBQVEsU0FWRjtBQVdOeUIsZUFBVyxVQVhMO0FBWU5DLGdCQUFZLHNCQVpOO0FBYU4sY0FBVTtBQUNSUix1QkFBaUIscUJBQU0sa0JBQVFDLFdBQWQsRUFBMkJRLE1BQTNCLENBQWtDLEdBQWxDO0FBRFQsS0FiSjtBQWdCTixlQUFXO0FBQ1RGLGlCQUFXO0FBREY7QUFoQkwsR0EvQks7QUFtRGJHLGFBQVc7QUFDVFIsV0FBTyxrQkFBUVMsSUFETjtBQUVUeEIsY0FBVSxFQUZEO0FBR1RELGFBQVMsRUFIQTtBQUlUMEIsZUFBVyxRQUpGO0FBS1RDLGVBQVc7QUFMRixHQW5ERTtBQTBEYkMsb0JBQWtCO0FBQ2hCWixXQUFPLGtCQUFRYSxTQURDO0FBRWhCNUIsY0FBVSxFQUZNO0FBR2hCRCxhQUFTLEVBSE87QUFJaEIwQixlQUFXO0FBSks7QUExREwsQ0FBZjs7SUFrRU1JLGE7OztBQUNKLHlCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsOEhBQ1pBLEtBRFk7O0FBRWxCLFVBQUtDLFVBQUwsR0FBa0I7QUFDaEJDLGlCQUFXLHlCQUF3QkYsTUFBTUcsU0FBOUIsQ0FESztBQUVoQkMsZUFBUyx1QkFBc0JKLE1BQU1HLFNBQTVCLENBRk87QUFHaEJFLGVBQVMsdUJBQXNCTCxNQUFNRyxTQUE1QixDQUhPO0FBSWhCRyxZQUFNLG9CQUFtQk4sTUFBTUcsU0FBekI7QUFKVSxLQUFsQjtBQU1BLFVBQUtJLEtBQUwsR0FBYTtBQUNYQyxhQUFPLElBREk7QUFFWEMsY0FBUSxFQUZHO0FBR1hDLHdCQUFrQixJQUhQO0FBSVhDLHNCQUFnQixLQUpMO0FBS1hDLGlCQUFXO0FBTEEsS0FBYjtBQVJrQjtBQWVuQjs7Ozt5Q0FFcUI7QUFBQTs7QUFDcEIsV0FBS0MsUUFBTCxDQUFjLEVBQUNELFdBQVcsSUFBWixFQUFkO0FBQ0EsV0FBS0UsZUFBTDtBQUNBLFdBQUtkLEtBQUwsQ0FBV0csU0FBWCxDQUFxQlksRUFBckIsQ0FBd0IsV0FBeEIsRUFBcUMsZ0JBQXNCO0FBQUEsWUFBbkJDLElBQW1CLFFBQW5CQSxJQUFtQjtBQUFBLFlBQWJQLE1BQWEsUUFBYkEsTUFBYTs7QUFDekQsWUFBSU8sU0FBUyxnQkFBYixFQUErQjtBQUM3QixpQkFBS0gsUUFBTCxDQUFjLEVBQUVKLGNBQUYsRUFBZDtBQUNEO0FBQ0YsT0FKRDtBQUtEOzs7c0NBRWtCO0FBQUE7O0FBQ2pCLGFBQU8sS0FBS1QsS0FBTCxDQUFXRyxTQUFYLENBQXFCYyxPQUFyQixDQUE2QixFQUFFQyxRQUFRLFlBQVYsRUFBd0JDLFFBQVEsQ0FBQyxLQUFLbkIsS0FBTCxDQUFXb0IsTUFBWixDQUFoQyxFQUE3QixFQUFvRixVQUFDWixLQUFELEVBQVFDLE1BQVIsRUFBbUI7QUFDNUcsWUFBSUQsS0FBSixFQUFXLE9BQU8sT0FBS0ssUUFBTCxDQUFjLEVBQUVMLFlBQUYsRUFBZCxDQUFQO0FBQ1gsZUFBS0ssUUFBTCxDQUFjLEVBQUVKLGNBQUYsRUFBZDtBQUNBWSxtQkFBVyxZQUFNO0FBQ2YsaUJBQUtSLFFBQUwsQ0FBYyxFQUFFRCxXQUFXLEtBQWIsRUFBZDtBQUNELFNBRkQsRUFFRyxJQUZIO0FBR0QsT0FOTSxDQUFQO0FBT0Q7Ozs0Q0FFd0JVLFEsRUFBVTtBQUFBOztBQUNqQyxVQUFJLENBQUNBLFNBQVNDLE9BQWQsRUFBdUIsT0FBTyxLQUFLdkIsS0FBTCxDQUFXd0IsWUFBWCxDQUF3QixFQUFFQyxNQUFNLFNBQVIsRUFBbUJDLE9BQU8sT0FBMUIsRUFBbUNDLFNBQVMseUNBQTVDLEVBQXhCLENBQVA7QUFDdkIsVUFBTUMsV0FBVyxFQUFqQjtBQUNBLFdBQUs1QixLQUFMLENBQVdHLFNBQVgsQ0FBcUJjLE9BQXJCLENBQTZCLEVBQUVRLE1BQU0sUUFBUixFQUFrQlAsUUFBUSxzQkFBMUIsRUFBa0RDLFFBQVEsQ0FBQyxLQUFLbkIsS0FBTCxDQUFXb0IsTUFBWixFQUFvQkUsU0FBU0MsT0FBN0IsRUFBc0NLLFFBQXRDLENBQTFELEVBQTdCLEVBQTBJLFVBQUNDLEdBQUQsRUFBUztBQUNqSixZQUFJQSxHQUFKLEVBQVM7QUFDUCxpQkFBTyxPQUFLN0IsS0FBTCxDQUFXd0IsWUFBWCxDQUF3QixFQUFFQyxNQUFNLFFBQVIsRUFBa0JDLE9BQU9HLElBQUliLElBQTdCLEVBQW1DVyxTQUFTRSxJQUFJRixPQUFoRCxFQUF4QixDQUFQO0FBQ0Q7QUFDRixPQUpEO0FBS0Q7Ozs4Q0FFMEJMLFEsRUFBVTtBQUNuQyxVQUFJUSxVQUFVLGVBQUtDLElBQUwsQ0FBVSxLQUFLL0IsS0FBTCxDQUFXb0IsTUFBckIsRUFBNkIsU0FBN0IsRUFBd0NFLFNBQVNVLFFBQWpELENBQWQ7QUFDQSxzQkFBTUMsUUFBTixDQUFlSCxPQUFmO0FBQ0Q7Ozs2Q0FFeUJSLFEsRUFBVTtBQUNsQyxjQUFRQSxTQUFTRyxJQUFqQjtBQUNFLGFBQUssUUFBTDtBQUNFLGVBQUtTLHlCQUFMLENBQStCWixRQUEvQjtBQUNBLGVBQUt0QixLQUFMLENBQVdtQyxXQUFYLENBQXVCQyxJQUF2QjtBQUNBO0FBQ0YsYUFBSyxNQUFMO0FBQ0UsZUFBS0MsdUJBQUwsQ0FBNkJmLFFBQTdCO0FBQ0E7QUFDRjtBQUNFLGVBQUt0QixLQUFMLENBQVd3QixZQUFYLENBQXdCLEVBQUVDLE1BQU0sU0FBUixFQUFtQkMsT0FBTyxPQUExQixFQUFtQ0MsU0FBUyxxREFBNUMsRUFBeEI7QUFUSjtBQVdEOzs7bUNBRWVXLEssRUFBT0MsSyxFQUFPO0FBQUE7O0FBQzVCLFdBQUsxQixRQUFMLENBQWMsRUFBQ0QsV0FBVyxJQUFaLEVBQWQ7O0FBRUEsVUFBTTRCLFlBQVksaUJBQU9DLEdBQVAsQ0FBV0gsS0FBWCxFQUFrQjtBQUFBLGVBQVFJLEtBQUtDLElBQWI7QUFBQSxPQUFsQixDQUFsQjs7QUFFQSxXQUFLM0MsS0FBTCxDQUFXRyxTQUFYLENBQXFCYyxPQUFyQixDQUNFLEVBQUNDLFFBQVEsZ0JBQVQsRUFBMkJDLFFBQVEsQ0FBQ3FCLFNBQUQsRUFBWSxLQUFLeEMsS0FBTCxDQUFXb0IsTUFBdkIsQ0FBbkMsRUFERixFQUVFLFVBQUNaLEtBQUQsRUFBUUMsTUFBUixFQUFtQjtBQUNqQixlQUFLSSxRQUFMLENBQWMsRUFBQ0QsV0FBVyxLQUFaLEVBQWQ7QUFDQSxZQUFJSixLQUFKLEVBQVcsT0FBS0ssUUFBTCxDQUFjLEVBQUNMLFlBQUQsRUFBZDtBQUNYLGVBQUtLLFFBQUwsQ0FBYyxFQUFDSixjQUFELEVBQWQ7QUFDRCxPQU5IO0FBUUQ7OztzQ0FFa0I7QUFDakIsVUFBSSxDQUFDLEtBQUtGLEtBQUwsQ0FBV0UsTUFBaEIsRUFBd0IsT0FBTyxJQUFQO0FBQ3hCLFVBQUksS0FBS0YsS0FBTCxDQUFXRSxNQUFYLENBQWtCbUMsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0MsT0FBTyxJQUFQO0FBQ2xDLFVBQUlDLGdCQUFKO0FBQ0EsV0FBS3RDLEtBQUwsQ0FBV0UsTUFBWCxDQUFrQnFDLE9BQWxCLENBQTBCLFVBQUNDLEtBQUQsRUFBVztBQUNuQyxZQUFJQSxNQUFNQyxlQUFWLEVBQTJCO0FBQ3pCSCxvQkFBVUUsS0FBVjtBQUNEO0FBQ0YsT0FKRDtBQUtBLGFBQU9GLE9BQVA7QUFDRDs7O3FDQUVpQjtBQUNoQixVQUFJLENBQUMsS0FBS3RDLEtBQUwsQ0FBV0UsTUFBaEIsRUFBd0IsT0FBTyxFQUFQO0FBQ3hCLFVBQUksS0FBS0YsS0FBTCxDQUFXRSxNQUFYLENBQWtCbUMsTUFBbEIsR0FBMkIsQ0FBL0IsRUFBa0MsT0FBTyxFQUFQO0FBQ2xDLFVBQUlLLFNBQVMsRUFBYjtBQUNBLFdBQUsxQyxLQUFMLENBQVdFLE1BQVgsQ0FBa0JxQyxPQUFsQixDQUEwQixVQUFDQyxLQUFELEVBQVc7QUFDbkMsWUFBSSxDQUFDQSxNQUFNQyxlQUFYLEVBQTRCO0FBQzFCQyxpQkFBT0MsSUFBUCxDQUFZSCxLQUFaO0FBQ0Q7QUFDRixPQUpEO0FBS0EsYUFBT0UsTUFBUDtBQUNEOzs7dUNBRW1CRixLLEVBQU87QUFDekIsYUFBTyxLQUFLSSxlQUFMLENBQXFCSixLQUFyQixFQUE0QixJQUE1QixDQUFQO0FBQ0Q7OzsyQ0FFdUJBLEssRUFBTztBQUM3QixVQUFJSyxlQUFlLEtBQW5CO0FBQ0EsVUFBSUwsTUFBTU0sU0FBTixJQUFtQk4sTUFBTU0sU0FBTixDQUFnQkMsVUFBaEIsQ0FBMkJWLE1BQTNCLEdBQW9DLENBQTNELEVBQThEUSxlQUFlLElBQWY7QUFDOUQsVUFBSUwsTUFBTVEsS0FBTixJQUFlUixNQUFNUSxLQUFOLENBQVlELFVBQVosQ0FBdUJWLE1BQXZCLEdBQWdDLENBQW5ELEVBQXNEUSxlQUFlLElBQWY7QUFDdEQsVUFBSUwsTUFBTVMsTUFBTixJQUFnQlQsTUFBTVMsTUFBTixDQUFhRixVQUFiLENBQXdCVixNQUF4QixHQUFpQyxDQUFyRCxFQUF3RFEsZUFBZSxJQUFmOztBQUV4RCxVQUFJQSxZQUFKLEVBQWtCO0FBQ2hCLGVBQU8sRUFBUDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQ0U7QUFBQTtBQUFBLFlBQUssT0FBTzVGLE9BQU9xQyxnQkFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQURGO0FBTUQ7QUFDRjs7O29DQUVnQmtELEssRUFBT1UsYyxFQUFnQjtBQUN0QyxVQUFJVixNQUFNdEIsSUFBTixLQUFlLFFBQW5CLEVBQTZCO0FBQzNCLGVBQ0U7QUFDRSwwQkFBZ0JnQyxjQURsQjtBQUVFLGVBQUtWLE1BQU1mLFFBRmI7QUFHRSxnQkFBTWUsS0FIUjtBQUlFLGtCQUFRLEtBQUsvQyxLQUFMLENBQVdvQixNQUpyQjtBQUtFLHFCQUFXLEtBQUtwQixLQUFMLENBQVcwRCxTQUx4QjtBQU1FLHVCQUFhLEtBQUsxRCxLQUFMLENBQVcyRCxXQU4xQjtBQU9FLHFCQUFXLEtBQUszRCxLQUFMLENBQVdHLFNBUHhCO0FBUUUsdUJBQWEsS0FBS3lELHdCQUFMLENBQThCQyxJQUE5QixDQUFtQyxJQUFuQyxFQUF5Q2QsS0FBekMsQ0FSZjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFERjtBQVdEOztBQUVELGFBQ0U7QUFDRSxhQUFLQSxNQUFNZixRQURiO0FBRUUsaUJBQVNlLE1BQU14QixPQUZqQjtBQUdFLGtCQUFVd0IsTUFBTWYsUUFIbEI7QUFJRSxtQkFBVyxLQUFLaEMsS0FBTCxDQUFXMEQsU0FKeEI7QUFLRSxxQkFBYSxLQUFLMUQsS0FBTCxDQUFXMkQsV0FMMUI7QUFNRSxvQkFBWVosTUFBTWUsVUFOcEI7QUFPRSxtQkFBVyxLQUFLOUQsS0FBTCxDQUFXRyxTQVB4QjtBQVFFLHFCQUFhLEtBQUt5RCx3QkFBTCxDQUE4QkMsSUFBOUIsQ0FBbUMsSUFBbkMsRUFBeUNkLEtBQXpDLENBUmY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBREY7QUFXRDs7O3NDQUVrQnRDLE0sRUFBUTtBQUFBOztBQUN6QixhQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLHlCQUFPZ0MsR0FBUCxDQUFXaEMsTUFBWCxFQUFtQixVQUFDaUMsSUFBRCxFQUFPcUIsS0FBUCxFQUFpQjtBQUNuQyxpQkFDRTtBQUFBO0FBQUEsY0FBSyxlQUFhckIsS0FBS1YsUUFBbEIsU0FBOEIrQixLQUFuQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxtQkFBS1osZUFBTCxDQUFxQlQsSUFBckI7QUFESCxXQURGO0FBS0QsU0FOQTtBQURILE9BREY7QUFXRDs7O3VDQUVtQjtBQUNsQixVQUFJc0IsZUFBZSxLQUFLQyxlQUFMLEVBQW5CO0FBQ0EsVUFBSUMsY0FBYyxLQUFLQyxjQUFMLEVBQWxCOztBQUVBLFVBQUksQ0FBQ0gsWUFBRCxJQUFpQkUsWUFBWXRCLE1BQVosR0FBcUIsQ0FBMUMsRUFBNkM7QUFDM0MsZUFDRTtBQUFBO0FBQUEsWUFBSyxPQUFPcEYsT0FBT2lDLFNBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUtEOztBQUVELFVBQUksQ0FBQ3VFLFlBQUQsSUFBaUJFLFlBQVl0QixNQUFaLEdBQXFCLENBQTFDLEVBQTZDO0FBQzNDLGVBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csZUFBS3dCLGlCQUFMLENBQXVCRixXQUF2QjtBQURILFNBREY7QUFLRDs7QUFFRCxVQUFJRixnQkFBZ0JFLFlBQVl0QixNQUFaLEdBQXFCLENBQXpDLEVBQTRDO0FBQzFDLGVBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csZUFBS3lCLGtCQUFMLENBQXdCTCxZQUF4QixDQURIO0FBRUcsZUFBS00sc0JBQUwsQ0FBNEJOLFlBQTVCO0FBRkgsU0FERjtBQU1EOztBQUVELGFBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csYUFBS0ssa0JBQUwsQ0FBd0JMLFlBQXhCLENBREg7QUFFRyxhQUFLSSxpQkFBTCxDQUF1QkYsV0FBdkI7QUFGSCxPQURGO0FBTUQ7OztzQ0FFa0JsRCxJLEVBQU07QUFDdkIsYUFBTyxLQUFLZixVQUFMLENBQWdCZSxJQUFoQixDQUFQO0FBQ0Q7Ozs2QkFFUztBQUFBOztBQUNSLGFBQ0U7QUFBQTtBQUFBLFVBQUssSUFBRyxpQkFBUixFQUEwQixPQUFPLEVBQUNyRCxRQUFRLE1BQVQsRUFBakM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssT0FBT0gsT0FBT0ksYUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFRTtBQUFBO0FBQUEsY0FBUSxPQUFPSixPQUFPcUIsTUFBdEIsRUFBOEIsU0FBUyxLQUFLMEYsZ0JBQTVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FGRjtBQUdFO0FBQ0Usa0JBQUssTUFEUDtBQUVFLGlCQUFJLFlBRk47QUFHRSwwQkFIRjtBQUlFLHNCQUFVLGtCQUFDQyxDQUFEO0FBQUEscUJBQU8sT0FBS0MsY0FBTCxDQUFvQixPQUFLQyxJQUFMLENBQVVDLFVBQVYsQ0FBcUJyQyxLQUF6QyxFQUFnRGtDLENBQWhELENBQVA7QUFBQSxhQUpaO0FBS0UsbUJBQU8sRUFBQ0ksU0FBUyxDQUFWLEVBQWFyRyxVQUFVLFVBQXZCLEVBQW1Dc0csT0FBTyxDQUExQyxFQUE2Q0MsT0FBTyxFQUFwRCxFQUF3RGhHLFFBQVEsQ0FBaEUsRUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixTQURGO0FBV0U7QUFBQTtBQUFBLFlBQUssT0FBT3RCLE9BQU9DLFVBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU9ELE9BQU9pQixhQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxpQkFBSzhCLEtBQUwsQ0FBV0ssU0FBWCxHQUF1QixFQUF2QixHQUE0QixLQUFLbUUsZ0JBQUw7QUFEL0I7QUFERjtBQVhGLE9BREY7QUFtQkQ7Ozs7RUF2T3lCLGdCQUFNQyxTOztrQkEwT25CLHNCQUFPakYsYUFBUCxDIiwiZmlsZSI6IkxpYnJhcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vLi4vUGFsZXR0ZSdcbmltcG9ydCBMaWJyYXJ5SXRlbSBmcm9tICcuL0xpYnJhcnlJdGVtJ1xuaW1wb3J0IENvbGxhcHNlSXRlbSBmcm9tICcuL0NvbGxhcHNlSXRlbSdcbmltcG9ydCBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUmVjdGFuZ2xlJ1xuaW1wb3J0IEVsbGlwc2VQcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvRWxsaXBzZSdcbmltcG9ydCBQb2x5Z29uUHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1BvbHlnb24nXG5pbXBvcnQgVGV4dFByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9UZXh0J1xuaW1wb3J0IHsgc2hlbGwgfSBmcm9tICdlbGVjdHJvbidcblxuY29uc3QgU1RZTEVTID0ge1xuICBzY3JvbGx3cmFwOiB7XG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgaGVpZ2h0OiAnMTAwJSdcbiAgfSxcbiAgc2VjdGlvbkhlYWRlcjoge1xuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIGhlaWdodDogMjUsXG4gICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIHBhZGRpbmc6ICcxOHB4IDE0cHggMTBweCcsXG4gICAgZm9udFNpemU6IDE1LFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbidcbiAgfSxcbiAgcHJpbWl0aXZlc1dyYXBwZXI6IHtcbiAgICBwYWRkaW5nVG9wOiA2LFxuICAgIHBhZGRpbmdCb3R0b206IDYsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGFzc2V0c1dyYXBwZXI6IHtcbiAgICBwYWRkaW5nVG9wOiA2LFxuICAgIHBhZGRpbmdCb3R0b206IDYsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgbWluSGVpZ2h0OiAnMzAwcHgnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICB9LFxuICBmaWxlRHJvcFdyYXBwZXI6IHtcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgYnV0dG9uOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgekluZGV4OiAyLFxuICAgIHBhZGRpbmc6ICczcHggOXB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBmb250U2l6ZTogMTMsXG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIG1hcmdpblRvcDogLTQsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIwMG1zIGVhc2UnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS0VSX0dSQVkpLmRhcmtlbigwLjIpXG4gICAgfSxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9XG4gIH0sXG4gIHN0YXJ0VGV4dDoge1xuICAgIGNvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgZm9udFNpemU6IDI1LFxuICAgIHBhZGRpbmc6IDI0LFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgZm9udFN0eWxlOiAnaXRhbGljJ1xuICB9LFxuICBwcmltYXJ5QXNzZXRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH1cbn1cblxuY2xhc3MgTGlicmFyeURyYXdlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMucHJpbWl0aXZlcyA9IHtcbiAgICAgIFJlY3RhbmdsZTogUmVjdGFuZ2xlUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIEVsbGlwc2U6IEVsbGlwc2VQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgUG9seWdvbjogUG9seWdvblByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBUZXh0OiBUZXh0UHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KVxuICAgIH1cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBhc3NldHM6IFtdLFxuICAgICAgcHJldmlld0ltYWdlVGltZTogbnVsbCxcbiAgICAgIG92ZXJEcm9wVGFyZ2V0OiBmYWxzZSxcbiAgICAgIGlzTG9hZGluZzogZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QoKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAoeyBuYW1lLCBhc3NldHMgfSkgPT4ge1xuICAgICAgaWYgKG5hbWUgPT09ICdhc3NldHMtY2hhbmdlZCcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cyB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZWxvYWRBc3NldExpc3QgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdEFzc2V0cycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyXSB9LCAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UgfSlcbiAgICAgIH0sIDEwMDApXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUZpbGVJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIGlmICghZmlsZURhdGEucHJldmlldykgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0ZpbGUgcGF0aCB3YXMgYmxhbms7IGNhbm5vdCBpbnN0YW50aWF0ZScgfSlcbiAgICBjb25zdCBtZXRhZGF0YSA9IHt9XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdpbnN0YW50aWF0ZUNvbXBvbmVudCcsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCBmaWxlRGF0YS5wcmV2aWV3LCBtZXRhZGF0YV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnZGFuZ2VyJywgdGl0bGU6IGVyci5uYW1lLCBtZXNzYWdlOiBlcnIubWVzc2FnZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIGxldCBhYnNwYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMuZm9sZGVyLCAnZGVzaWducycsIGZpbGVEYXRhLmZpbGVOYW1lKVxuICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gIH1cblxuICBoYW5kbGVBc3NldEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdza2V0Y2gnOlxuICAgICAgICB0aGlzLmhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24oZmlsZURhdGEpXG4gICAgICAgIHRoaXMucHJvcHMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0NvdWxkblxcJ3QgaGFuZGxlIHRoYXQgZmlsZSwgcGxlYXNlIGNvbnRhY3Qgc3VwcG9ydC4nIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRmlsZURyb3AgKGZpbGVzLCBldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG5cbiAgICBjb25zdCBmaWxlUGF0aHMgPSBsb2Rhc2gubWFwKGZpbGVzLCBmaWxlID0+IGZpbGUucGF0aClcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoXG4gICAgICB7bWV0aG9kOiAnYnVsa0xpbmtBc3NldHMnLCBwYXJhbXM6IFtmaWxlUGF0aHMsIHRoaXMucHJvcHMuZm9sZGVyXX0sXG4gICAgICAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IGZhbHNlfSlcbiAgICAgICAgaWYgKGVycm9yKSB0aGlzLnNldFN0YXRlKHtlcnJvcn0pXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Fzc2V0c30pXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgZ2V0UHJpbWFyeUFzc2V0ICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbFxuICAgIGxldCBwcmltYXJ5XG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmIChhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgcHJpbWFyeSA9IGFzc2V0XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gcHJpbWFyeVxuICB9XG5cbiAgZ2V0T3RoZXJBc3NldHMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hc3NldHMpIHJldHVybiBbXVxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gW11cbiAgICBsZXQgb3RoZXJzID0gW11cbiAgICB0aGlzLnN0YXRlLmFzc2V0cy5mb3JFYWNoKChhc3NldCkgPT4ge1xuICAgICAgaWYgKCFhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgb3RoZXJzLnB1c2goYXNzZXQpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gb3RoZXJzXG4gIH1cblxuICByZW5kZXJQcmltYXJ5QXNzZXQgKGFzc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQXNzZXRJdGVtKGFzc2V0LCB0cnVlKVxuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0SGludCAoYXNzZXQpIHtcbiAgICBsZXQgaGFzU3ViQXNzZXRzID0gZmFsc2VcbiAgICBpZiAoYXNzZXQuYXJ0Ym9hcmRzICYmIGFzc2V0LmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIGhhc1N1YkFzc2V0cyA9IHRydWVcbiAgICBpZiAoYXNzZXQucGFnZXMgJiYgYXNzZXQucGFnZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnNsaWNlcyAmJiBhc3NldC5zbGljZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG5cbiAgICBpZiAoaGFzU3ViQXNzZXRzKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnByaW1hcnlBc3NldFRleHR9PlxuICAgICAgICAgIOKHpyBEb3VibGUgY2xpY2sgdG8gb3BlbiB0aGlzIGZpbGUgaW4gU2tldGNoLlxuICAgICAgICAgIEV2ZXJ5IHNsaWNlIGFuZCBhcnRib2FyZCB3aWxsIGJlIHN5bmNlZCBoZXJlIHdoZW4geW91IHNhdmUuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFzc2V0SXRlbSAoYXNzZXQsIGlzUHJpbWFyeUFzc2V0KSB7XG4gICAgaWYgKGFzc2V0LnR5cGUgPT09ICdza2V0Y2gnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAgaXNQcmltYXJ5QXNzZXQ9e2lzUHJpbWFyeUFzc2V0fVxuICAgICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgICAgZmlsZT17YXNzZXR9XG4gICAgICAgICAgZm9sZGVyPXt0aGlzLnByb3BzLmZvbGRlcn1cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAga2V5PXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgcHJldmlldz17YXNzZXQucHJldmlld31cbiAgICAgICAgZmlsZU5hbWU9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgdXBkYXRlVGltZT17YXNzZXQudXBkYXRlVGltZX1cbiAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck90aGVyQXNzZXRzIChhc3NldHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2xvZGFzaC5tYXAoYXNzZXRzLCAoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2BpdGVtLSR7ZmlsZS5maWxlTmFtZX0tJHtpbmRleH1gfT5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXNzZXRJdGVtKGZpbGUpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckFzc2V0c0xpc3QgKCkge1xuICAgIGxldCBwcmltYXJ5QXNzZXQgPSB0aGlzLmdldFByaW1hcnlBc3NldCgpXG4gICAgbGV0IG90aGVyQXNzZXRzID0gdGhpcy5nZXRPdGhlckFzc2V0cygpXG5cbiAgICBpZiAoIXByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc3RhcnRUZXh0fT5cbiAgICAgICAgICBJbXBvcnQgYSBTa2V0Y2ggb3IgU1ZHIGZpbGUgdG8gc3RhcnRcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJPdGhlckFzc2V0cyhvdGhlckFzc2V0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXRIaW50KHByaW1hcnlBc3NldCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcHJvcHNGb3JQcmltaXRpdmUgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVzW25hbWVdXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsaWJyYXJ5LXdyYXBwZXInIHN0eWxlPXt7aGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNlY3Rpb25IZWFkZXJ9PlxuICAgICAgICAgIExpYnJhcnlcbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnV0dG9ufSBvbkNsaWNrPXt0aGlzLmxhdW5jaEZpbGVwaWNrZXJ9Pis8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9J2ZpbGUnXG4gICAgICAgICAgICByZWY9J2ZpbGVwaWNrZXInXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmhhbmRsZUZpbGVEcm9wKHRoaXMucmVmcy5maWxlcGlja2VyLmZpbGVzLCBlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7b3BhY2l0eTogMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB3aWR0aDogOTAsIHpJbmRleDogM319IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2Nyb2xsd3JhcH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmFzc2V0c1dyYXBwZXJ9PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNMb2FkaW5nID8gJycgOiB0aGlzLnJlbmRlckFzc2V0c0xpc3QoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKExpYnJhcnlEcmF3ZXIpXG4iXX0=