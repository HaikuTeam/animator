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
    key: 'handleAssetDeletion',
    value: function handleAssetDeletion(asset) {
      var _this5 = this;

      this.setState({ isLoading: true });
      return this.props.websocket.request({ method: 'unlinkAsset', params: [asset.relpath, this.props.folder] }, function (error, assets) {
        if (error) _this5.setState({ error: error, isLoading: false });
        if (assets) _this5.setState({ assets: assets, isLoading: false });
      });
    }
  }, {
    key: 'handleFileDrop',
    value: function handleFileDrop(files, event) {
      var _this6 = this;

      this.setState({ isLoading: true });

      var filePaths = _lodash2.default.map(files, function (file) {
        return file.path;
      });

      this.props.websocket.request({ method: 'bulkLinkAssets', params: [filePaths, this.props.folder] }, function (error, assets) {
        _this6.setState({ isLoading: false });
        if (error) _this6.setState({ error: error });
        _this6.setState({ assets: assets });
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
              lineNumber: 209
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
          instantiate: this.handleAssetInstantiation.bind(this, asset),
          'delete': this.handleAssetDeletion.bind(this, asset), __source: {
            fileName: _jsxFileName,
            lineNumber: 220
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
        instantiate: this.handleAssetInstantiation.bind(this, asset),
        'delete': this.handleAssetDeletion.bind(this, asset), __source: {
          fileName: _jsxFileName,
          lineNumber: 234
        },
        __self: this
      });
    }
  }, {
    key: 'renderOtherAssets',
    value: function renderOtherAssets(assets) {
      var _this7 = this;

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 249
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 252
              },
              __self: _this7
            },
            _this7.renderAssetItem(file)
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
              lineNumber: 267
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
              lineNumber: 275
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
              lineNumber: 283
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
            lineNumber: 291
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
      var _this8 = this;

      return _react2.default.createElement(
        'div',
        { id: 'library-wrapper', style: { height: '100%' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 304
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 305
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 307
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
              return _this8.handleFileDrop(_this8.refs.filepicker.files, e);
            },
            style: { opacity: 0, position: 'absolute', right: 0, width: 90, zIndex: 3 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 308
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 315
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 316
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsImZpbGVEYXRhIiwicHJldmlldyIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsImVyciIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImFzc2V0IiwicmVscGF0aCIsImZpbGVzIiwiZXZlbnQiLCJmaWxlUGF0aHMiLCJtYXAiLCJmaWxlIiwicGF0aCIsImxlbmd0aCIsInByaW1hcnkiLCJmb3JFYWNoIiwiaXNQcmltYXJ5RGVzaWduIiwib3RoZXJzIiwicHVzaCIsInJlbmRlckFzc2V0SXRlbSIsImhhc1N1YkFzc2V0cyIsImFydGJvYXJkcyIsImNvbGxlY3Rpb24iLCJwYWdlcyIsInNsaWNlcyIsImlzUHJpbWFyeUFzc2V0Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJiaW5kIiwiaGFuZGxlQXNzZXREZWxldGlvbiIsInVwZGF0ZVRpbWUiLCJpbmRleCIsInByaW1hcnlBc3NldCIsImdldFByaW1hcnlBc3NldCIsIm90aGVyQXNzZXRzIiwiZ2V0T3RoZXJBc3NldHMiLCJyZW5kZXJPdGhlckFzc2V0cyIsInJlbmRlclByaW1hcnlBc3NldCIsInJlbmRlclByaW1hcnlBc3NldEhpbnQiLCJsYXVuY2hGaWxlcGlja2VyIiwiZSIsImhhbmRsZUZpbGVEcm9wIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsInJlbmRlckFzc2V0c0xpc3QiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxjQUFZO0FBQ1ZDLGVBQVcsTUFERDtBQUVWQyxZQUFRO0FBRkUsR0FEQztBQUtiQyxpQkFB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QUNDLENBQUQ7QUFBQSxxQkFBTyxPQUFLQyxjQUFMLENBQW9CLE9BQUtDLElBQUwsQ0FBVUMsVUFBVixDQUFxQnJDLEtBQXpDLEVBQWdEa0MsQ0FBaEQsQ0FBUDtBQUFBLGFBSlo7QUFLRSxtQkFBTyxFQUFDSSxTQUFTLENBQVYsRUFBYXZHLFVBQVUsVUFBdkIsRUFBbUN3RyxPQUFPLENBQTFDLEVBQTZDQyxPQUFPLEVBQXBELEVBQXdEbEcsUUFBUSxDQUFoRSxFQUxUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLFNBREY7QUFXRTtBQUFBO0FBQUEsWUFBSyxPQUFPdEIsT0FBT0MsVUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGNBQUssT0FBT0QsT0FBT2lCLGFBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlCQUFLOEIsS0FBTCxDQUFXSyxTQUFYLEdBQXVCLEVBQXZCLEdBQTRCLEtBQUtxRSxnQkFBTDtBQUQvQjtBQURGO0FBWEYsT0FERjtBQW1CRDs7OztFQWpQeUIsZ0JBQU1DLFM7O2tCQW9QbkIsc0JBQU9uRixhQUFQLEMiLCJmaWxlIjoiTGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29sbGFwc2VJdGVtIGZyb20gJy4vQ29sbGFwc2VJdGVtJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHNjcm9sbHdyYXA6IHtcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9LFxuICBwcmltaXRpdmVzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgYXNzZXRzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtaW5IZWlnaHQ6ICczMDBweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGZpbGVEcm9wV3JhcHBlcjoge1xuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBidXR0b246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB6SW5kZXg6IDIsXG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgc3RhcnRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBmb250U2l6ZTogMjUsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHByaW1hcnlBc3NldFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5EQVJLX1JPQ0ssXG4gICAgZm9udFNpemU6IDE2LFxuICAgIHBhZGRpbmc6IDI0LFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgfVxufVxuXG5jbGFzcyBMaWJyYXJ5RHJhd2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5wcmltaXRpdmVzID0ge1xuICAgICAgUmVjdGFuZ2xlOiBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgRWxsaXBzZTogRWxsaXBzZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBQb2x5Z29uOiBQb2x5Z29uUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFRleHQ6IFRleHRQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpXG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGFzc2V0czogW10sXG4gICAgICBwcmV2aWV3SW1hZ2VUaW1lOiBudWxsLFxuICAgICAgb3ZlckRyb3BUYXJnZXQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICB0aGlzLnJlbG9hZEFzc2V0TGlzdCgpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsICh7IG5hbWUsIGFzc2V0cyB9KSA9PiB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Fzc2V0cy1jaGFuZ2VkJykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZEFzc2V0TGlzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0QXNzZXRzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZUluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgaWYgKCFmaWxlRGF0YS5wcmV2aWV3KSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnRmlsZSBwYXRoIHdhcyBibGFuazsgY2Fubm90IGluc3RhbnRpYXRlJyB9KVxuICAgIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGZpbGVEYXRhLnByZXZpZXcsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdkYW5nZXInLCB0aXRsZTogZXJyLm5hbWUsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgbGV0IGFic3BhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5mb2xkZXIsICdkZXNpZ25zJywgZmlsZURhdGEuZmlsZU5hbWUpXG4gICAgc2hlbGwub3Blbkl0ZW0oYWJzcGF0aClcbiAgfVxuXG4gIGhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NrZXRjaCc6XG4gICAgICAgIHRoaXMuaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnQ291bGRuXFwndCBoYW5kbGUgdGhhdCBmaWxlLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0LicgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVBc3NldERlbGV0aW9uIChhc3NldCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICd1bmxpbmtBc3NldCcsIHBhcmFtczogW2Fzc2V0LnJlbHBhdGgsIHRoaXMucHJvcHMuZm9sZGVyXSB9LCAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSB0aGlzLnNldFN0YXRlKHtlcnJvciwgaXNMb2FkaW5nOiBmYWxzZX0pXG4gICAgICBpZiAoYXNzZXRzKSB0aGlzLnNldFN0YXRlKHsgYXNzZXRzLCBpc0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUZpbGVEcm9wIChmaWxlcywgZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IHRydWV9KVxuXG4gICAgY29uc3QgZmlsZVBhdGhzID0gbG9kYXNoLm1hcChmaWxlcywgZmlsZSA9PiBmaWxlLnBhdGgpXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KFxuICAgICAge21ldGhvZDogJ2J1bGtMaW5rQXNzZXRzJywgcGFyYW1zOiBbZmlsZVBhdGhzLCB0aGlzLnByb3BzLmZvbGRlcl19LFxuICAgICAgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiBmYWxzZX0pXG4gICAgICAgIGlmIChlcnJvcikgdGhpcy5zZXRTdGF0ZSh7ZXJyb3J9KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHthc3NldHN9KVxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIGdldFByaW1hcnlBc3NldCAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFzc2V0cykgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGxcbiAgICBsZXQgcHJpbWFyeVxuICAgIHRoaXMuc3RhdGUuYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICBpZiAoYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIHByaW1hcnkgPSBhc3NldFxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHByaW1hcnlcbiAgfVxuXG4gIGdldE90aGVyQXNzZXRzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIFtdXG4gICAgbGV0IG90aGVycyA9IFtdXG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmICghYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIG90aGVycy5wdXNoKGFzc2V0KVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG90aGVyc1xuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0IChhc3NldCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlckFzc2V0SXRlbShhc3NldCwgdHJ1ZSlcbiAgfVxuXG4gIHJlbmRlclByaW1hcnlBc3NldEhpbnQgKGFzc2V0KSB7XG4gICAgbGV0IGhhc1N1YkFzc2V0cyA9IGZhbHNlXG4gICAgaWYgKGFzc2V0LmFydGJvYXJkcyAmJiBhc3NldC5hcnRib2FyZHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnBhZ2VzICYmIGFzc2V0LnBhZ2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuICAgIGlmIChhc3NldC5zbGljZXMgJiYgYXNzZXQuc2xpY2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuXG4gICAgaWYgKGhhc1N1YkFzc2V0cykge1xuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5wcmltYXJ5QXNzZXRUZXh0fT5cbiAgICAgICAgICDih6cgRG91YmxlIGNsaWNrIHRvIG9wZW4gdGhpcyBmaWxlIGluIFNrZXRjaC5cbiAgICAgICAgICBFdmVyeSBzbGljZSBhbmQgYXJ0Ym9hcmQgd2lsbCBiZSBzeW5jZWQgaGVyZSB3aGVuIHlvdSBzYXZlLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJBc3NldEl0ZW0gKGFzc2V0LCBpc1ByaW1hcnlBc3NldCkge1xuICAgIGlmIChhc3NldC50eXBlID09PSAnc2tldGNoJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbGxhcHNlSXRlbVxuICAgICAgICAgIGlzUHJpbWFyeUFzc2V0PXtpc1ByaW1hcnlBc3NldH1cbiAgICAgICAgICBrZXk9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICAgIGZpbGU9e2Fzc2V0fVxuICAgICAgICAgIGZvbGRlcj17dGhpcy5wcm9wcy5mb2xkZXJ9XG4gICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX1cbiAgICAgICAgICBkZWxldGU9e3RoaXMuaGFuZGxlQXNzZXREZWxldGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPExpYnJhcnlJdGVtXG4gICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgIHByZXZpZXc9e2Fzc2V0LnByZXZpZXd9XG4gICAgICAgIGZpbGVOYW1lPXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgIHVwZGF0ZVRpbWU9e2Fzc2V0LnVwZGF0ZVRpbWV9XG4gICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX1cbiAgICAgICAgZGVsZXRlPXt0aGlzLmhhbmRsZUFzc2V0RGVsZXRpb24uYmluZCh0aGlzLCBhc3NldCl9IC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyT3RoZXJBc3NldHMgKGFzc2V0cykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7bG9kYXNoLm1hcChhc3NldHMsIChmaWxlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17YGl0ZW0tJHtmaWxlLmZpbGVOYW1lfS0ke2luZGV4fWB9PlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBc3NldEl0ZW0oZmlsZSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQXNzZXRzTGlzdCAoKSB7XG4gICAgbGV0IHByaW1hcnlBc3NldCA9IHRoaXMuZ2V0UHJpbWFyeUFzc2V0KClcbiAgICBsZXQgb3RoZXJBc3NldHMgPSB0aGlzLmdldE90aGVyQXNzZXRzKClcblxuICAgIGlmICghcHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zdGFydFRleHR9PlxuICAgICAgICAgIEltcG9ydCBhIFNrZXRjaCBvciBTVkcgZmlsZSB0byBzdGFydFxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlck90aGVyQXNzZXRzKG90aGVyQXNzZXRzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKHByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByaW1hcnlBc3NldChwcmltYXJ5QXNzZXQpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclByaW1hcnlBc3NldEhpbnQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlclByaW1hcnlBc3NldChwcmltYXJ5QXNzZXQpfVxuICAgICAgICB7dGhpcy5yZW5kZXJPdGhlckFzc2V0cyhvdGhlckFzc2V0cyl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBwcm9wc0ZvclByaW1pdGl2ZSAobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnByaW1pdGl2ZXNbbmFtZV1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2xpYnJhcnktd3JhcHBlcicgc3R5bGU9e3toZWlnaHQ6ICcxMDAlJ319PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2VjdGlvbkhlYWRlcn0+XG4gICAgICAgICAgTGlicmFyeVxuICAgICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idXR0b259IG9uQ2xpY2s9e3RoaXMubGF1bmNoRmlsZXBpY2tlcn0+KzwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT0nZmlsZSdcbiAgICAgICAgICAgIHJlZj0nZmlsZXBpY2tlcidcbiAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHRoaXMuaGFuZGxlRmlsZURyb3AodGhpcy5yZWZzLmZpbGVwaWNrZXIuZmlsZXMsIGUpfVxuICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OiAwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHdpZHRoOiA5MCwgekluZGV4OiAzfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zY3JvbGx3cmFwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuYXNzZXRzV3JhcHBlcn0+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS5pc0xvYWRpbmcgPyAnJyA6IHRoaXMucmVuZGVyQXNzZXRzTGlzdCgpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oTGlicmFyeURyYXdlcilcbiJdfQ==