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

var _HaikuHomeDir = require('haiku-serialization/src/utils/HaikuHomeDir');

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
        fileData: null,
        shouldAskForSketch: !(0, _HaikuHomeDir.didAskedForSketch)()
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
        this.setState({ sketchDownloader: Object.assign({}, this.state.sketchDownloader, { isVisible: true, fileData: fileData }) });
      }
    }
  }, {
    key: 'onSketchDownloadComplete',
    value: function onSketchDownloadComplete() {
      this.isSketchInstalled = true;
      this.openSketchFile(this.state.sketchDownloader.fileData);
      this.setState({ sketchDownloader: Object.assign({}, this.state.sketchDownloader, { isVisible: false, fileData: null }) });
    }
  }, {
    key: 'onSketchDialogDismiss',
    value: function onSketchDialogDismiss(shouldAskForSketch) {
      this.setState({ sketchDownloader: Object.assign({}, this.state.sketchDownloader, { isVisible: false, shouldAskForSketch: shouldAskForSketch }) });
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
              lineNumber: 240
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
            lineNumber: 251
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
          lineNumber: 265
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
            lineNumber: 280
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 283
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
              lineNumber: 298
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
              lineNumber: 306
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
              lineNumber: 314
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
            lineNumber: 322
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
            lineNumber: 335
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 336
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 338
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
              lineNumber: 339
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 346
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 347
              },
              __self: this
            },
            this.state.isLoading ? '' : this.renderAssetsList()
          )
        ),
        this.state.sketchDownloader.isVisible && this.state.sketchDownloader.shouldAskForSketch && _react2.default.createElement(_SketchDownloader2.default, {
          onDownloadComplete: this.onSketchDownloadComplete.bind(this),
          onDismiss: this.onSketchDialogDismiss.bind(this),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 354
          },
          __self: this
        })
      );
    }
  }]);

  return LibraryDrawer;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(LibraryDrawer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2tldGNoRG93bmxvYWRlciIsImlzVmlzaWJsZSIsImZpbGVEYXRhIiwic2hvdWxkQXNrRm9yU2tldGNoIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJjaGVja0lmSW5zdGFsbGVkIiwidGhlbiIsImlzU2tldGNoSW5zdGFsbGVkIiwiaXNJbnN0YWxsZWQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsInByZXZpZXciLCJjcmVhdGVOb3RpY2UiLCJ0eXBlIiwidGl0bGUiLCJtZXNzYWdlIiwibWV0YWRhdGEiLCJlcnIiLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJvcGVuU2tldGNoRmlsZSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImFzc2V0IiwicmVscGF0aCIsImZpbGVzIiwiZXZlbnQiLCJmaWxlUGF0aHMiLCJtYXAiLCJmaWxlIiwicGF0aCIsImxlbmd0aCIsInByaW1hcnkiLCJmb3JFYWNoIiwiaXNQcmltYXJ5RGVzaWduIiwib3RoZXJzIiwicHVzaCIsInJlbmRlckFzc2V0SXRlbSIsImhhc1N1YkFzc2V0cyIsImFydGJvYXJkcyIsImNvbGxlY3Rpb24iLCJwYWdlcyIsInNsaWNlcyIsImlzUHJpbWFyeUFzc2V0Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJiaW5kIiwiaGFuZGxlQXNzZXREZWxldGlvbiIsInVwZGF0ZVRpbWUiLCJpbmRleCIsInByaW1hcnlBc3NldCIsImdldFByaW1hcnlBc3NldCIsIm90aGVyQXNzZXRzIiwiZ2V0T3RoZXJBc3NldHMiLCJyZW5kZXJPdGhlckFzc2V0cyIsInJlbmRlclByaW1hcnlBc3NldCIsInJlbmRlclByaW1hcnlBc3NldEhpbnQiLCJsYXVuY2hGaWxlcGlja2VyIiwiZSIsImhhbmRsZUZpbGVEcm9wIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsInJlbmRlckFzc2V0c0xpc3QiLCJvblNrZXRjaERvd25sb2FkQ29tcGxldGUiLCJvblNrZXRjaERpYWxvZ0Rpc21pc3MiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFB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RSwwQkFIRjtBQUlFLHNCQUFVLGtCQUFDQyxDQUFEO0FBQUEscUJBQU8sT0FBS0MsY0FBTCxDQUFvQixPQUFLQyxJQUFMLENBQVVDLFVBQVYsQ0FBcUJyQyxLQUF6QyxFQUFnRGtDLENBQWhELENBQVA7QUFBQSxhQUpaO0FBS0UsbUJBQU8sRUFBQ0ksU0FBUyxDQUFWLEVBQWEvRyxVQUFVLFVBQXZCLEVBQW1DZ0gsT0FBTyxDQUExQyxFQUE2Q0MsT0FBTyxFQUFwRCxFQUF3RDFHLFFBQVEsQ0FBaEUsRUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixTQURGO0FBV0U7QUFBQTtBQUFBLFlBQUssT0FBT3RCLE9BQU9DLFVBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU9ELE9BQU9pQixhQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxpQkFBSzhCLEtBQUwsQ0FBV0ssU0FBWCxHQUF1QixFQUF2QixHQUE0QixLQUFLNkUsZ0JBQUw7QUFEL0I7QUFERixTQVhGO0FBaUJJLGFBQUtsRixLQUFMLENBQVdNLGdCQUFYLENBQTRCQyxTQUE1QixJQUNBLEtBQUtQLEtBQUwsQ0FBV00sZ0JBQVgsQ0FBNEJHLGtCQUQ1QixJQUVFO0FBQ0UsOEJBQW9CLEtBQUswRSx3QkFBTCxDQUE4QnBCLElBQTlCLENBQW1DLElBQW5DLENBRHRCO0FBRUUscUJBQVcsS0FBS3FCLHFCQUFMLENBQTJCckIsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FGYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW5CTixPQURGO0FBNEJEOzs7O0VBclJ5QixnQkFBTXNCLFM7O2tCQXdSbkIsc0JBQU83RixhQUFQLEMiLCJmaWxlIjoiTGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29sbGFwc2VJdGVtIGZyb20gJy4vQ29sbGFwc2VJdGVtJ1xuaW1wb3J0IFNrZXRjaERvd25sb2FkZXIgZnJvbSAnLi4vU2tldGNoRG93bmxvYWRlcidcbmltcG9ydCBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUmVjdGFuZ2xlJ1xuaW1wb3J0IEVsbGlwc2VQcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvRWxsaXBzZSdcbmltcG9ydCBQb2x5Z29uUHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1BvbHlnb24nXG5pbXBvcnQgVGV4dFByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9UZXh0J1xuaW1wb3J0IHNrZXRjaFV0aWxzIGZyb20gJy4uLy4uLy4uL3V0aWxzL3NrZXRjaFV0aWxzJ1xuaW1wb3J0IHsgZGlkQXNrZWRGb3JTa2V0Y2ggfSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9IYWlrdUhvbWVEaXInXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgc2Nyb2xsd3JhcDoge1xuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgIGhlaWdodDogJzEwMCUnXG4gIH0sXG4gIHNlY3Rpb25IZWFkZXI6IHtcbiAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICBoZWlnaHQ6IDI1LFxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOiAnMThweCAxNHB4IDEwcHgnLFxuICAgIGZvbnRTaXplOiAxNSxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nXG4gIH0sXG4gIHByaW1pdGl2ZXNXcmFwcGVyOiB7XG4gICAgcGFkZGluZ1RvcDogNixcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICB9LFxuICBhc3NldHNXcmFwcGVyOiB7XG4gICAgcGFkZGluZ1RvcDogNixcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG1pbkhlaWdodDogJzMwMHB4JyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgZmlsZURyb3BXcmFwcGVyOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGJ1dHRvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHpJbmRleDogMixcbiAgICBwYWRkaW5nOiAnM3B4IDlweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktFUl9HUkFZLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgZm9udFNpemU6IDEzLFxuICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICBtYXJnaW5Ub3A6IC00LFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAyMDBtcyBlYXNlJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktFUl9HUkFZKS5kYXJrZW4oMC4yKVxuICAgIH0sXG4gICAgJzphY3RpdmUnOiB7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSguOCknXG4gICAgfVxuICB9LFxuICBzdGFydFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIGZvbnRTaXplOiAyNSxcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYydcbiAgfSxcbiAgcHJpbWFyeUFzc2V0VGV4dDoge1xuICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DSyxcbiAgICBmb250U2l6ZTogMTYsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJ1xuICB9XG59XG5cbmNsYXNzIExpYnJhcnlEcmF3ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnByaW1pdGl2ZXMgPSB7XG4gICAgICBSZWN0YW5nbGU6IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBFbGxpcHNlOiBFbGxpcHNlUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFBvbHlnb246IFBvbHlnb25QcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgVGV4dDogVGV4dFByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldClcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBhc3NldHM6IFtdLFxuICAgICAgcHJldmlld0ltYWdlVGltZTogbnVsbCxcbiAgICAgIG92ZXJEcm9wVGFyZ2V0OiBmYWxzZSxcbiAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICBza2V0Y2hEb3dubG9hZGVyOiB7XG4gICAgICAgIGlzVmlzaWJsZTogZmFsc2UsXG4gICAgICAgIGZpbGVEYXRhOiBudWxsLFxuICAgICAgICBzaG91bGRBc2tGb3JTa2V0Y2g6ICFkaWRBc2tlZEZvclNrZXRjaCgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IHRydWV9KVxuICAgIHRoaXMucmVsb2FkQXNzZXRMaXN0KClcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKHsgbmFtZSwgYXNzZXRzIH0pID0+IHtcbiAgICAgIGlmIChuYW1lID09PSAnYXNzZXRzLWNoYW5nZWQnKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHNrZXRjaFV0aWxzLmNoZWNrSWZJbnN0YWxsZWQoKS50aGVuKGlzSW5zdGFsbGVkID0+IHtcbiAgICAgIHRoaXMuaXNTa2V0Y2hJbnN0YWxsZWQgPSBpc0luc3RhbGxlZFxuICAgIH0pXG4gIH1cblxuICByZWxvYWRBc3NldExpc3QgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdEFzc2V0cycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyXSB9LCAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UgfSlcbiAgICAgIH0sIDEwMDApXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUZpbGVJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIGlmICghZmlsZURhdGEucHJldmlldykgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0ZpbGUgcGF0aCB3YXMgYmxhbms7IGNhbm5vdCBpbnN0YW50aWF0ZScgfSlcbiAgICBjb25zdCBtZXRhZGF0YSA9IHt9XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdpbnN0YW50aWF0ZUNvbXBvbmVudCcsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCBmaWxlRGF0YS5wcmV2aWV3LCBtZXRhZGF0YV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnZGFuZ2VyJywgdGl0bGU6IGVyci5uYW1lLCBtZXNzYWdlOiBlcnIubWVzc2FnZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBvcGVuU2tldGNoRmlsZSAoZmlsZURhdGEpIHtcbiAgICBsZXQgYWJzcGF0aCA9IHBhdGguam9pbih0aGlzLnByb3BzLmZvbGRlciwgJ2Rlc2lnbnMnLCBmaWxlRGF0YS5maWxlTmFtZSlcbiAgICBzaGVsbC5vcGVuSXRlbShhYnNwYXRoKVxuICB9XG5cbiAgaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBpZiAodGhpcy5pc1NrZXRjaEluc3RhbGxlZCkge1xuICAgICAgdGhpcy5vcGVuU2tldGNoRmlsZShmaWxlRGF0YSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2tldGNoRG93bmxvYWRlcjogey4uLnRoaXMuc3RhdGUuc2tldGNoRG93bmxvYWRlciwgaXNWaXNpYmxlOiB0cnVlLCBmaWxlRGF0YX19KVxuICAgIH1cbiAgfVxuXG4gIG9uU2tldGNoRG93bmxvYWRDb21wbGV0ZSAoKSB7XG4gICAgdGhpcy5pc1NrZXRjaEluc3RhbGxlZCA9IHRydWVcbiAgICB0aGlzLm9wZW5Ta2V0Y2hGaWxlKHRoaXMuc3RhdGUuc2tldGNoRG93bmxvYWRlci5maWxlRGF0YSlcbiAgICB0aGlzLnNldFN0YXRlKHtza2V0Y2hEb3dubG9hZGVyOiB7Li4udGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLCBpc1Zpc2libGU6IGZhbHNlLCBmaWxlRGF0YTogbnVsbH19KVxuICB9XG5cbiAgb25Ta2V0Y2hEaWFsb2dEaXNtaXNzIChzaG91bGRBc2tGb3JTa2V0Y2gpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtza2V0Y2hEb3dubG9hZGVyOiB7Li4udGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLCBpc1Zpc2libGU6IGZhbHNlLCBzaG91bGRBc2tGb3JTa2V0Y2h9fSlcbiAgfVxuXG4gIGhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NrZXRjaCc6XG4gICAgICAgIHRoaXMuaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnQ291bGRuXFwndCBoYW5kbGUgdGhhdCBmaWxlLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0LicgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVBc3NldERlbGV0aW9uIChhc3NldCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICd1bmxpbmtBc3NldCcsIHBhcmFtczogW2Fzc2V0LnJlbHBhdGgsIHRoaXMucHJvcHMuZm9sZGVyXSB9LCAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSB0aGlzLnNldFN0YXRlKHtlcnJvciwgaXNMb2FkaW5nOiBmYWxzZX0pXG4gICAgICBpZiAoYXNzZXRzKSB0aGlzLnNldFN0YXRlKHsgYXNzZXRzLCBpc0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUZpbGVEcm9wIChmaWxlcywgZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IHRydWV9KVxuXG4gICAgY29uc3QgZmlsZVBhdGhzID0gbG9kYXNoLm1hcChmaWxlcywgZmlsZSA9PiBmaWxlLnBhdGgpXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KFxuICAgICAge21ldGhvZDogJ2J1bGtMaW5rQXNzZXRzJywgcGFyYW1zOiBbZmlsZVBhdGhzLCB0aGlzLnByb3BzLmZvbGRlcl19LFxuICAgICAgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiBmYWxzZX0pXG4gICAgICAgIGlmIChlcnJvcikgdGhpcy5zZXRTdGF0ZSh7ZXJyb3J9KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHthc3NldHN9KVxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIGdldFByaW1hcnlBc3NldCAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFzc2V0cykgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGxcbiAgICBsZXQgcHJpbWFyeVxuICAgIHRoaXMuc3RhdGUuYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICBpZiAoYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIHByaW1hcnkgPSBhc3NldFxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHByaW1hcnlcbiAgfVxuXG4gIGdldE90aGVyQXNzZXRzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIFtdXG4gICAgbGV0IG90aGVycyA9IFtdXG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmICghYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIG90aGVycy5wdXNoKGFzc2V0KVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG90aGVyc1xuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0IChhc3NldCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlckFzc2V0SXRlbShhc3NldCwgdHJ1ZSlcbiAgfVxuXG4gIHJlbmRlclByaW1hcnlBc3NldEhpbnQgKGFzc2V0KSB7XG4gICAgbGV0IGhhc1N1YkFzc2V0cyA9IGZhbHNlXG4gICAgaWYgKGFzc2V0LmFydGJvYXJkcyAmJiBhc3NldC5hcnRib2FyZHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnBhZ2VzICYmIGFzc2V0LnBhZ2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuICAgIGlmIChhc3NldC5zbGljZXMgJiYgYXNzZXQuc2xpY2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuXG4gICAgaWYgKGhhc1N1YkFzc2V0cykge1xuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5wcmltYXJ5QXNzZXRUZXh0fT5cbiAgICAgICAgICDih6cgRG91YmxlIGNsaWNrIHRvIG9wZW4gdGhpcyBmaWxlIGluIFNrZXRjaC5cbiAgICAgICAgICBFdmVyeSBzbGljZSBhbmQgYXJ0Ym9hcmQgd2lsbCBiZSBzeW5jZWQgaGVyZSB3aGVuIHlvdSBzYXZlLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJBc3NldEl0ZW0gKGFzc2V0LCBpc1ByaW1hcnlBc3NldCkge1xuICAgIGlmIChhc3NldC50eXBlID09PSAnc2tldGNoJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbGxhcHNlSXRlbVxuICAgICAgICAgIGlzUHJpbWFyeUFzc2V0PXtpc1ByaW1hcnlBc3NldH1cbiAgICAgICAgICBrZXk9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICAgIGZpbGU9e2Fzc2V0fVxuICAgICAgICAgIGZvbGRlcj17dGhpcy5wcm9wcy5mb2xkZXJ9XG4gICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX1cbiAgICAgICAgICBkZWxldGU9e3RoaXMuaGFuZGxlQXNzZXREZWxldGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPExpYnJhcnlJdGVtXG4gICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgIHByZXZpZXc9e2Fzc2V0LnByZXZpZXd9XG4gICAgICAgIGZpbGVOYW1lPXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgIHVwZGF0ZVRpbWU9e2Fzc2V0LnVwZGF0ZVRpbWV9XG4gICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX1cbiAgICAgICAgZGVsZXRlPXt0aGlzLmhhbmRsZUFzc2V0RGVsZXRpb24uYmluZCh0aGlzLCBhc3NldCl9IC8+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyT3RoZXJBc3NldHMgKGFzc2V0cykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7bG9kYXNoLm1hcChhc3NldHMsIChmaWxlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGtleT17YGl0ZW0tJHtmaWxlLmZpbGVOYW1lfS0ke2luZGV4fWB9PlxuICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBc3NldEl0ZW0oZmlsZSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQXNzZXRzTGlzdCAoKSB7XG4gICAgbGV0IHByaW1hcnlBc3NldCA9IHRoaXMuZ2V0UHJpbWFyeUFzc2V0KClcbiAgICBsZXQgb3RoZXJBc3NldHMgPSB0aGlzLmdldE90aGVyQXNzZXRzKClcblxuICAgIGlmICghcHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zdGFydFRleHR9PlxuICAgICAgICAgIEltcG9ydCBhIFNrZXRjaCBvciBTVkcgZmlsZSB0byBzdGFydFxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAoIXByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlck90aGVyQXNzZXRzKG90aGVyQXNzZXRzKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKHByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByaW1hcnlBc3NldChwcmltYXJ5QXNzZXQpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclByaW1hcnlBc3NldEhpbnQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlclByaW1hcnlBc3NldChwcmltYXJ5QXNzZXQpfVxuICAgICAgICB7dGhpcy5yZW5kZXJPdGhlckFzc2V0cyhvdGhlckFzc2V0cyl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBwcm9wc0ZvclByaW1pdGl2ZSAobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnByaW1pdGl2ZXNbbmFtZV1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2xpYnJhcnktd3JhcHBlcicgc3R5bGU9e3toZWlnaHQ6ICcxMDAlJ319PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2VjdGlvbkhlYWRlcn0+XG4gICAgICAgICAgTGlicmFyeVxuICAgICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idXR0b259IG9uQ2xpY2s9e3RoaXMubGF1bmNoRmlsZXBpY2tlcn0+KzwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT0nZmlsZSdcbiAgICAgICAgICAgIHJlZj0nZmlsZXBpY2tlcidcbiAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHRoaXMuaGFuZGxlRmlsZURyb3AodGhpcy5yZWZzLmZpbGVwaWNrZXIuZmlsZXMsIGUpfVxuICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OiAwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHdpZHRoOiA5MCwgekluZGV4OiAzfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zY3JvbGx3cmFwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuYXNzZXRzV3JhcHBlcn0+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS5pc0xvYWRpbmcgPyAnJyA6IHRoaXMucmVuZGVyQXNzZXRzTGlzdCgpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge1xuICAgICAgICAgIHRoaXMuc3RhdGUuc2tldGNoRG93bmxvYWRlci5pc1Zpc2libGUgJiZcbiAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaERvd25sb2FkZXIuc2hvdWxkQXNrRm9yU2tldGNoICYmIChcbiAgICAgICAgICAgIDxTa2V0Y2hEb3dubG9hZGVyXG4gICAgICAgICAgICAgIG9uRG93bmxvYWRDb21wbGV0ZT17dGhpcy5vblNrZXRjaERvd25sb2FkQ29tcGxldGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25EaXNtaXNzPXt0aGlzLm9uU2tldGNoRGlhbG9nRGlzbWlzcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oTGlicmFyeURyYXdlcilcbiJdfQ==