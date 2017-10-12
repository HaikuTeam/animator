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

var _SketchDownloader = require('../SketchDownloader');

var _SketchDownloader2 = _interopRequireDefault(_SketchDownloader);

var _Rectangle = require('./../../primitives/Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _Ellipse = require('./../../primitives/Ellipse');

var _Ellipse2 = _interopRequireDefault(_Ellipse);

var _Polygon = require('./../../primitives/Polygon');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _Text = require('./../../primitives/Text');

var _Text2 = _interopRequireDefault(_Text);

var _sketchUtils = require('../../../utils/sketchUtils');

var _sketchUtils2 = _interopRequireDefault(_sketchUtils);

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
      isLoading: false,
      sketchDownloader: {
        isVisible: false,
        fileData: null
      }
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
      _sketchUtils2.default.checkIfInstalled().then(function (isInstalled) {
        _this2.isSketchInstalled = isInstalled;
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
    key: 'openSketchFile',
    value: function openSketchFile(fileData) {
      var abspath = _path2.default.join(this.props.folder, 'designs', fileData.fileName);
      _electron.shell.openItem(abspath);
    }
  }, {
    key: 'handleSketchInstantiation',
    value: function handleSketchInstantiation(fileData) {
      if (this.isSketchInstalled) {
        this.openSketchFile(fileData);
      } else {
        this.setState({ sketchDownloader: { isVisible: true, fileData: fileData } });
      }
    }
  }, {
    key: 'onSketchDownloadComplete',
    value: function onSketchDownloadComplete() {
      this.isSketchInstalled = true;
      this.openSketchFile(this.state.sketchDownloader.fileData);
      this.setState({ sketchDownloader: { isVisible: false, fileData: null } });
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
              lineNumber: 224
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
            lineNumber: 235
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
          lineNumber: 248
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
            lineNumber: 262
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 265
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
              lineNumber: 280
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
              lineNumber: 288
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
              lineNumber: 296
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
            lineNumber: 304
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
            lineNumber: 317
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 318
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 320
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
              lineNumber: 321
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 328
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 329
              },
              __self: this
            },
            this.state.isLoading ? '' : this.renderAssetsList()
          )
        ),
        this.state.sketchDownloader.isVisible && _react2.default.createElement(_SketchDownloader2.default, {
          onDownloadComplete: this.onSketchDownloadComplete.bind(this),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 335
          },
          __self: this
        })
      );
    }
  }]);

  return LibraryDrawer;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(LibraryDrawer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2tldGNoRG93bmxvYWRlciIsImlzVmlzaWJsZSIsImZpbGVEYXRhIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJjaGVja0lmSW5zdGFsbGVkIiwidGhlbiIsImlzU2tldGNoSW5zdGFsbGVkIiwiaXNJbnN0YWxsZWQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsInByZXZpZXciLCJjcmVhdGVOb3RpY2UiLCJ0eXBlIiwidGl0bGUiLCJtZXNzYWdlIiwibWV0YWRhdGEiLCJlcnIiLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJvcGVuU2tldGNoRmlsZSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImZpbGVzIiwiZXZlbnQiLCJmaWxlUGF0aHMiLCJtYXAiLCJmaWxlIiwicGF0aCIsImxlbmd0aCIsInByaW1hcnkiLCJmb3JFYWNoIiwiYXNzZXQiLCJpc1ByaW1hcnlEZXNpZ24iLCJvdGhlcnMiLCJwdXNoIiwicmVuZGVyQXNzZXRJdGVtIiwiaGFzU3ViQXNzZXRzIiwiYXJ0Ym9hcmRzIiwiY29sbGVjdGlvbiIsInBhZ2VzIiwic2xpY2VzIiwiaXNQcmltYXJ5QXNzZXQiLCJvbkRyYWdFbmQiLCJvbkRyYWdTdGFydCIsImhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiIsImJpbmQiLCJ1cGRhdGVUaW1lIiwiaW5kZXgiLCJwcmltYXJ5QXNzZXQiLCJnZXRQcmltYXJ5QXNzZXQiLCJvdGhlckFzc2V0cyIsImdldE90aGVyQXNzZXRzIiwicmVuZGVyT3RoZXJBc3NldHMiLCJyZW5kZXJQcmltYXJ5QXNzZXQiLCJyZW5kZXJQcmltYXJ5QXNzZXRIaW50IiwibGF1bmNoRmlsZXBpY2tlciIsImUiLCJoYW5kbGVGaWxlRHJvcCIsInJlZnMiLCJmaWxlcGlja2VyIiwib3BhY2l0eSIsInJpZ2h0Iiwid2lkdGgiLCJyZW5kZXJBc3NldHNMaXN0Iiwib25Ta2V0Y2hEb3dubG9hZENvbXBsZXRlIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztB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QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUZGO0FBR0U7QUFDRSxrQkFBSyxNQURQO0FBRUUsaUJBQUksWUFGTjtBQUdFLDBCQUhGO0FBSUUsc0JBQVUsa0JBQUNDLENBQUQ7QUFBQSxxQkFBTyxPQUFLQyxjQUFMLENBQW9CLE9BQUtDLElBQUwsQ0FBVUMsVUFBVixDQUFxQnJDLEtBQXpDLEVBQWdEa0MsQ0FBaEQsQ0FBUDtBQUFBLGFBSlo7QUFLRSxtQkFBTyxFQUFDSSxTQUFTLENBQVYsRUFBYTVHLFVBQVUsVUFBdkIsRUFBbUM2RyxPQUFPLENBQTFDLEVBQTZDQyxPQUFPLEVBQXBELEVBQXdEdkcsUUFBUSxDQUFoRSxFQUxUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLFNBREY7QUFXRTtBQUFBO0FBQUEsWUFBSyxPQUFPdEIsT0FBT0MsVUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGNBQUssT0FBT0QsT0FBT2lCLGFBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlCQUFLOEIsS0FBTCxDQUFXSyxTQUFYLEdBQXVCLEVBQXZCLEdBQTRCLEtBQUswRSxnQkFBTDtBQUQvQjtBQURGLFNBWEY7QUFpQkksYUFBSy9FLEtBQUwsQ0FBV00sZ0JBQVgsQ0FBNEJDLFNBQTVCLElBQ0U7QUFDRSw4QkFBb0IsS0FBS3lFLHdCQUFMLENBQThCbkIsSUFBOUIsQ0FBbUMsSUFBbkMsQ0FEdEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFsQk4sT0FERjtBQTBCRDs7OztFQW5ReUIsZ0JBQU1vQixTOztrQkFzUW5CLHNCQUFPekYsYUFBUCxDIiwiZmlsZSI6IkxpYnJhcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vLi4vUGFsZXR0ZSdcbmltcG9ydCBMaWJyYXJ5SXRlbSBmcm9tICcuL0xpYnJhcnlJdGVtJ1xuaW1wb3J0IENvbGxhcHNlSXRlbSBmcm9tICcuL0NvbGxhcHNlSXRlbSdcbmltcG9ydCBTa2V0Y2hEb3dubG9hZGVyIGZyb20gJy4uL1NrZXRjaERvd25sb2FkZXInXG5pbXBvcnQgUmVjdGFuZ2xlUHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1JlY3RhbmdsZSdcbmltcG9ydCBFbGxpcHNlUHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL0VsbGlwc2UnXG5pbXBvcnQgUG9seWdvblByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9Qb2x5Z29uJ1xuaW1wb3J0IFRleHRQcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvVGV4dCdcbmltcG9ydCBza2V0Y2hVdGlscyBmcm9tICcuLi8uLi8uLi91dGlscy9za2V0Y2hVdGlscydcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgc2Nyb2xsd3JhcDoge1xuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgIGhlaWdodDogJzEwMCUnXG4gIH0sXG4gIHNlY3Rpb25IZWFkZXI6IHtcbiAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICBoZWlnaHQ6IDI1LFxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOiAnMThweCAxNHB4IDEwcHgnLFxuICAgIGZvbnRTaXplOiAxNSxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nXG4gIH0sXG4gIHByaW1pdGl2ZXNXcmFwcGVyOiB7XG4gICAgcGFkZGluZ1RvcDogNixcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICB9LFxuICBhc3NldHNXcmFwcGVyOiB7XG4gICAgcGFkZGluZ1RvcDogNixcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG1pbkhlaWdodDogJzMwMHB4JyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgZmlsZURyb3BXcmFwcGVyOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGJ1dHRvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHpJbmRleDogMixcbiAgICBwYWRkaW5nOiAnM3B4IDlweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktFUl9HUkFZLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgZm9udFNpemU6IDEzLFxuICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICBtYXJnaW5Ub3A6IC00LFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAyMDBtcyBlYXNlJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktFUl9HUkFZKS5kYXJrZW4oMC4yKVxuICAgIH0sXG4gICAgJzphY3RpdmUnOiB7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSguOCknXG4gICAgfVxuICB9LFxuICBzdGFydFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIGZvbnRTaXplOiAyNSxcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYydcbiAgfSxcbiAgcHJpbWFyeUFzc2V0VGV4dDoge1xuICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DSyxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICB9XG59XG5cbmNsYXNzIExpYnJhcnlEcmF3ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnByaW1pdGl2ZXMgPSB7XG4gICAgICBSZWN0YW5nbGU6IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBFbGxpcHNlOiBFbGxpcHNlUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFBvbHlnb246IFBvbHlnb25QcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgVGV4dDogVGV4dFByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldClcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgYXNzZXRzOiBbXSxcbiAgICAgIHByZXZpZXdJbWFnZVRpbWU6IG51bGwsXG4gICAgICBvdmVyRHJvcFRhcmdldDogZmFsc2UsXG4gICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgc2tldGNoRG93bmxvYWRlcjoge1xuICAgICAgICBpc1Zpc2libGU6IGZhbHNlLFxuICAgICAgICBmaWxlRGF0YTogbnVsbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICB0aGlzLnJlbG9hZEFzc2V0TGlzdCgpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsICh7IG5hbWUsIGFzc2V0cyB9KSA9PiB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Fzc2V0cy1jaGFuZ2VkJykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICB9XG4gICAgfSlcbiAgICBza2V0Y2hVdGlscy5jaGVja0lmSW5zdGFsbGVkKCkudGhlbihpc0luc3RhbGxlZCA9PiB7XG4gICAgICB0aGlzLmlzU2tldGNoSW5zdGFsbGVkID0gaXNJbnN0YWxsZWRcbiAgICB9KVxuICB9XG5cbiAgcmVsb2FkQXNzZXRMaXN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpc3RBc3NldHMnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciB9KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cyB9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgICB9LCAxMDAwKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBpZiAoIWZpbGVEYXRhLnByZXZpZXcpIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICd3YXJuaW5nJywgdGl0bGU6ICdPb3BzIScsIG1lc3NhZ2U6ICdGaWxlIHBhdGggd2FzIGJsYW5rOyBjYW5ub3QgaW5zdGFudGlhdGUnIH0pXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7fVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAnaW5zdGFudGlhdGVDb21wb25lbnQnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgZmlsZURhdGEucHJldmlldywgbWV0YWRhdGFdIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ2RhbmdlcicsIHRpdGxlOiBlcnIubmFtZSwgbWVzc2FnZTogZXJyLm1lc3NhZ2UgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb3BlblNrZXRjaEZpbGUgKGZpbGVEYXRhKSB7XG4gICAgbGV0IGFic3BhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5mb2xkZXIsICdkZXNpZ25zJywgZmlsZURhdGEuZmlsZU5hbWUpXG4gICAgc2hlbGwub3Blbkl0ZW0oYWJzcGF0aClcbiAgfVxuXG4gIGhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24oZmlsZURhdGEpIHtcbiAgICBpZiAodGhpcy5pc1NrZXRjaEluc3RhbGxlZCkge1xuICAgICAgdGhpcy5vcGVuU2tldGNoRmlsZShmaWxlRGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2tldGNoRG93bmxvYWRlcjoge2lzVmlzaWJsZTogdHJ1ZSwgZmlsZURhdGF9fSlcbiAgICB9XG4gIH1cblxuICBvblNrZXRjaERvd25sb2FkQ29tcGxldGUgKCkge1xuICAgIHRoaXMuaXNTa2V0Y2hJbnN0YWxsZWQgPSB0cnVlXG4gICAgdGhpcy5vcGVuU2tldGNoRmlsZSh0aGlzLnN0YXRlLnNrZXRjaERvd25sb2FkZXIuZmlsZURhdGEpXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2tldGNoRG93bmxvYWRlcjoge2lzVmlzaWJsZTogZmFsc2UsIGZpbGVEYXRhOiBudWxsfX0pXG4gIH1cblxuICBoYW5kbGVBc3NldEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdza2V0Y2gnOlxuICAgICAgICB0aGlzLmhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24oZmlsZURhdGEpXG4gICAgICAgIHRoaXMucHJvcHMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0NvdWxkblxcJ3QgaGFuZGxlIHRoYXQgZmlsZSwgcGxlYXNlIGNvbnRhY3Qgc3VwcG9ydC4nIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRmlsZURyb3AgKGZpbGVzLCBldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG5cbiAgICBjb25zdCBmaWxlUGF0aHMgPSBsb2Rhc2gubWFwKGZpbGVzLCBmaWxlID0+IGZpbGUucGF0aClcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoXG4gICAgICB7bWV0aG9kOiAnYnVsa0xpbmtBc3NldHMnLCBwYXJhbXM6IFtmaWxlUGF0aHMsIHRoaXMucHJvcHMuZm9sZGVyXX0sXG4gICAgICAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IGZhbHNlfSlcbiAgICAgICAgaWYgKGVycm9yKSB0aGlzLnNldFN0YXRlKHtlcnJvcn0pXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Fzc2V0c30pXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgZ2V0UHJpbWFyeUFzc2V0ICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbFxuICAgIGxldCBwcmltYXJ5XG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmIChhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgcHJpbWFyeSA9IGFzc2V0XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gcHJpbWFyeVxuICB9XG5cbiAgZ2V0T3RoZXJBc3NldHMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hc3NldHMpIHJldHVybiBbXVxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gW11cbiAgICBsZXQgb3RoZXJzID0gW11cbiAgICB0aGlzLnN0YXRlLmFzc2V0cy5mb3JFYWNoKChhc3NldCkgPT4ge1xuICAgICAgaWYgKCFhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgb3RoZXJzLnB1c2goYXNzZXQpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gb3RoZXJzXG4gIH1cblxuICByZW5kZXJQcmltYXJ5QXNzZXQgKGFzc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQXNzZXRJdGVtKGFzc2V0LCB0cnVlKVxuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0SGludCAoYXNzZXQpIHtcbiAgICBsZXQgaGFzU3ViQXNzZXRzID0gZmFsc2VcbiAgICBpZiAoYXNzZXQuYXJ0Ym9hcmRzICYmIGFzc2V0LmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIGhhc1N1YkFzc2V0cyA9IHRydWVcbiAgICBpZiAoYXNzZXQucGFnZXMgJiYgYXNzZXQucGFnZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnNsaWNlcyAmJiBhc3NldC5zbGljZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG5cbiAgICBpZiAoaGFzU3ViQXNzZXRzKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnByaW1hcnlBc3NldFRleHR9PlxuICAgICAgICAgIOKHpyBEb3VibGUgY2xpY2sgdG8gb3BlbiB0aGlzIGZpbGUgaW4gU2tldGNoLlxuICAgICAgICAgIEV2ZXJ5IHNsaWNlIGFuZCBhcnRib2FyZCB3aWxsIGJlIHN5bmNlZCBoZXJlIHdoZW4geW91IHNhdmUuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFzc2V0SXRlbSAoYXNzZXQsIGlzUHJpbWFyeUFzc2V0KSB7XG4gICAgaWYgKGFzc2V0LnR5cGUgPT09ICdza2V0Y2gnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAgaXNQcmltYXJ5QXNzZXQ9e2lzUHJpbWFyeUFzc2V0fVxuICAgICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgICAgZmlsZT17YXNzZXR9XG4gICAgICAgICAgZm9sZGVyPXt0aGlzLnByb3BzLmZvbGRlcn1cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAga2V5PXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgcHJldmlldz17YXNzZXQucHJldmlld31cbiAgICAgICAgZmlsZU5hbWU9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgdXBkYXRlVGltZT17YXNzZXQudXBkYXRlVGltZX1cbiAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck90aGVyQXNzZXRzIChhc3NldHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2xvZGFzaC5tYXAoYXNzZXRzLCAoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2BpdGVtLSR7ZmlsZS5maWxlTmFtZX0tJHtpbmRleH1gfT5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXNzZXRJdGVtKGZpbGUpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckFzc2V0c0xpc3QgKCkge1xuICAgIGxldCBwcmltYXJ5QXNzZXQgPSB0aGlzLmdldFByaW1hcnlBc3NldCgpXG4gICAgbGV0IG90aGVyQXNzZXRzID0gdGhpcy5nZXRPdGhlckFzc2V0cygpXG5cbiAgICBpZiAoIXByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc3RhcnRUZXh0fT5cbiAgICAgICAgICBJbXBvcnQgYSBTa2V0Y2ggb3IgU1ZHIGZpbGUgdG8gc3RhcnRcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJPdGhlckFzc2V0cyhvdGhlckFzc2V0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXRIaW50KHByaW1hcnlBc3NldCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcHJvcHNGb3JQcmltaXRpdmUgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVzW25hbWVdXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsaWJyYXJ5LXdyYXBwZXInIHN0eWxlPXt7aGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNlY3Rpb25IZWFkZXJ9PlxuICAgICAgICAgIExpYnJhcnlcbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnV0dG9ufSBvbkNsaWNrPXt0aGlzLmxhdW5jaEZpbGVwaWNrZXJ9Pis8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9J2ZpbGUnXG4gICAgICAgICAgICByZWY9J2ZpbGVwaWNrZXInXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmhhbmRsZUZpbGVEcm9wKHRoaXMucmVmcy5maWxlcGlja2VyLmZpbGVzLCBlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7b3BhY2l0eTogMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB3aWR0aDogOTAsIHpJbmRleDogM319IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2Nyb2xsd3JhcH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmFzc2V0c1dyYXBwZXJ9PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNMb2FkaW5nID8gJycgOiB0aGlzLnJlbmRlckFzc2V0c0xpc3QoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaERvd25sb2FkZXIuaXNWaXNpYmxlICYmIChcbiAgICAgICAgICAgIDxTa2V0Y2hEb3dubG9hZGVyXG4gICAgICAgICAgICAgIG9uRG93bmxvYWRDb21wbGV0ZT17dGhpcy5vblNrZXRjaERvd25sb2FkQ29tcGxldGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKExpYnJhcnlEcmF3ZXIpXG4iXX0=