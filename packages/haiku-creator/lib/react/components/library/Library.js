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
    key: 'onSketchDialogFileCreated',
    value: function onSketchDialogFileCreated() {
      this.setState({ sketchDownloader: Object.assign({}, this.state.sketchDownloader, { shouldAskForSketch: false }) });
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
          onSketchDialogFileCreated: this.onSketchDialogFileCreated.bind(this),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2tldGNoRG93bmxvYWRlciIsImlzVmlzaWJsZSIsImZpbGVEYXRhIiwic2hvdWxkQXNrRm9yU2tldGNoIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJjaGVja0lmSW5zdGFsbGVkIiwidGhlbiIsImlzU2tldGNoSW5zdGFsbGVkIiwiaXNJbnN0YWxsZWQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsInByZXZpZXciLCJjcmVhdGVOb3RpY2UiLCJ0eXBlIiwidGl0bGUiLCJtZXNzYWdlIiwibWV0YWRhdGEiLCJlcnIiLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJvcGVuU2tldGNoRmlsZSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImFzc2V0IiwicmVscGF0aCIsImZpbGVzIiwiZXZlbnQiLCJmaWxlUGF0aHMiLCJtYXAiLCJmaWxlIiwicGF0aCIsImxlbmd0aCIsInByaW1hcnkiLCJmb3JFYWNoIiwiaXNQcmltYXJ5RGVzaWduIiwib3RoZXJzIiwicHVzaCIsInJlbmRlckFzc2V0SXRlbSIsImhhc1N1YkFzc2V0cyIsImFydGJvYXJkcyIsImNvbGxlY3Rpb24iLCJwYWdlcyIsInNsaWNlcyIsImlzUHJpbWFyeUFzc2V0Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJiaW5kIiwiaGFuZGxlQXNzZXREZWxldGlvbiIsInVwZGF0ZVRpbWUiLCJpbmRleCIsInByaW1hcnlBc3NldCIsImdldFByaW1hcnlBc3NldCIsIm90aGVyQXNzZXRzIiwiZ2V0T3RoZXJBc3NldHMiLCJyZW5kZXJPdGhlckFzc2V0cyIsInJlbmRlclByaW1hcnlBc3NldCIsInJlbmRlclByaW1hcnlBc3NldEhpbnQiLCJsYXVuY2hGaWxlcGlja2VyIiwiZSIsImhhbmRsZUZpbGVEcm9wIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsInJlbmRlckFzc2V0c0xpc3QiLCJvblNrZXRjaERvd25sb2FkQ29tcGxldGUiLCJvblNrZXRjaERpYWxvZ0ZpbGVDcmVhdGVkIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7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LGtCQUFDQyxDQUFEO0FBQUEscUJBQU8sT0FBS0MsY0FBTCxDQUFvQixPQUFLQyxJQUFMLENBQVVDLFVBQVYsQ0FBcUJyQyxLQUF6QyxFQUFnRGtDLENBQWhELENBQVA7QUFBQSxhQUpaO0FBS0UsbUJBQU8sRUFBQ0ksU0FBUyxDQUFWLEVBQWEvRyxVQUFVLFVBQXZCLEVBQW1DZ0gsT0FBTyxDQUExQyxFQUE2Q0MsT0FBTyxFQUFwRCxFQUF3RDFHLFFBQVEsQ0FBaEUsRUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixTQURGO0FBV0U7QUFBQTtBQUFBLFlBQUssT0FBT3RCLE9BQU9DLFVBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU9ELE9BQU9pQixhQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxpQkFBSzhCLEtBQUwsQ0FBV0ssU0FBWCxHQUF1QixFQUF2QixHQUE0QixLQUFLNkUsZ0JBQUw7QUFEL0I7QUFERixTQVhGO0FBaUJJLGFBQUtsRixLQUFMLENBQVdNLGdCQUFYLENBQTRCQyxTQUE1QixJQUNBLEtBQUtQLEtBQUwsQ0FBV00sZ0JBQVgsQ0FBNEJHLGtCQUQ1QixJQUVFO0FBQ0UsOEJBQW9CLEtBQUswRSx3QkFBTCxDQUE4QnBCLElBQTlCLENBQW1DLElBQW5DLENBRHRCO0FBRUUscUNBQTJCLEtBQUtxQix5QkFBTCxDQUErQnJCLElBQS9CLENBQW9DLElBQXBDLENBRjdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbkJOLE9BREY7QUE0QkQ7Ozs7RUFyUnlCLGdCQUFNc0IsUzs7a0JBd1JuQixzQkFBTzdGLGFBQVAsQyIsImZpbGUiOiJMaWJyYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLy4uL1BhbGV0dGUnXG5pbXBvcnQgTGlicmFyeUl0ZW0gZnJvbSAnLi9MaWJyYXJ5SXRlbSdcbmltcG9ydCBDb2xsYXBzZUl0ZW0gZnJvbSAnLi9Db2xsYXBzZUl0ZW0nXG5pbXBvcnQgU2tldGNoRG93bmxvYWRlciBmcm9tICcuLi9Ta2V0Y2hEb3dubG9hZGVyJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgc2tldGNoVXRpbHMgZnJvbSAnLi4vLi4vLi4vdXRpbHMvc2tldGNoVXRpbHMnXG5pbXBvcnQgeyBkaWRBc2tlZEZvclNrZXRjaCB9IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL0hhaWt1SG9tZURpcidcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5cblxuY29uc3QgU1RZTEVTID0ge1xuICBzY3JvbGx3cmFwOiB7XG4gICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgaGVpZ2h0OiAnMTAwJSdcbiAgfSxcbiAgc2VjdGlvbkhlYWRlcjoge1xuICAgIGN1cnNvcjogJ2RlZmF1bHQnLFxuICAgIGhlaWdodDogMjUsXG4gICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIHBhZGRpbmc6ICcxOHB4IDE0cHggMTBweCcsXG4gICAgZm9udFNpemU6IDE1LFxuICAgIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbidcbiAgfSxcbiAgcHJpbWl0aXZlc1dyYXBwZXI6IHtcbiAgICBwYWRkaW5nVG9wOiA2LFxuICAgIHBhZGRpbmdCb3R0b206IDYsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGFzc2V0c1dyYXBwZXI6IHtcbiAgICBwYWRkaW5nVG9wOiA2LFxuICAgIHBhZGRpbmdCb3R0b206IDYsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgbWluSGVpZ2h0OiAnMzAwcHgnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICB9LFxuICBmaWxlRHJvcFdyYXBwZXI6IHtcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgYnV0dG9uOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgekluZGV4OiAyLFxuICAgIHBhZGRpbmc6ICczcHggOXB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBmb250U2l6ZTogMTMsXG4gICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgIG1hcmdpblRvcDogLTQsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIwMG1zIGVhc2UnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuREFSS0VSX0dSQVkpLmRhcmtlbigwLjIpXG4gICAgfSxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9XG4gIH0sXG4gIHN0YXJ0VGV4dDoge1xuICAgIGNvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgZm9udFNpemU6IDI1LFxuICAgIHBhZGRpbmc6IDI0LFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgZm9udFN0eWxlOiAnaXRhbGljJ1xuICB9LFxuICBwcmltYXJ5QXNzZXRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH1cbn1cblxuY2xhc3MgTGlicmFyeURyYXdlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMucHJpbWl0aXZlcyA9IHtcbiAgICAgIFJlY3RhbmdsZTogUmVjdGFuZ2xlUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIEVsbGlwc2U6IEVsbGlwc2VQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgUG9seWdvbjogUG9seWdvblByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBUZXh0OiBUZXh0UHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGFzc2V0czogW10sXG4gICAgICBwcmV2aWV3SW1hZ2VUaW1lOiBudWxsLFxuICAgICAgb3ZlckRyb3BUYXJnZXQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIHNrZXRjaERvd25sb2FkZXI6IHtcbiAgICAgICAgaXNWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgZmlsZURhdGE6IG51bGwsXG4gICAgICAgIHNob3VsZEFza0ZvclNrZXRjaDogIWRpZEFza2VkRm9yU2tldGNoKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QoKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAoeyBuYW1lLCBhc3NldHMgfSkgPT4ge1xuICAgICAgaWYgKG5hbWUgPT09ICdhc3NldHMtY2hhbmdlZCcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cyB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgc2tldGNoVXRpbHMuY2hlY2tJZkluc3RhbGxlZCgpLnRoZW4oaXNJbnN0YWxsZWQgPT4ge1xuICAgICAgdGhpcy5pc1NrZXRjaEluc3RhbGxlZCA9IGlzSW5zdGFsbGVkXG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZEFzc2V0TGlzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0QXNzZXRzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZUluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgaWYgKCFmaWxlRGF0YS5wcmV2aWV3KSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnRmlsZSBwYXRoIHdhcyBibGFuazsgY2Fubm90IGluc3RhbnRpYXRlJyB9KVxuICAgIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGZpbGVEYXRhLnByZXZpZXcsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdkYW5nZXInLCB0aXRsZTogZXJyLm5hbWUsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9wZW5Ta2V0Y2hGaWxlIChmaWxlRGF0YSkge1xuICAgIGxldCBhYnNwYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMuZm9sZGVyLCAnZGVzaWducycsIGZpbGVEYXRhLmZpbGVOYW1lKVxuICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gIH1cblxuICBoYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIGlmICh0aGlzLmlzU2tldGNoSW5zdGFsbGVkKSB7XG4gICAgICB0aGlzLm9wZW5Ta2V0Y2hGaWxlKGZpbGVEYXRhKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtza2V0Y2hEb3dubG9hZGVyOiB7Li4udGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLCBpc1Zpc2libGU6IHRydWUsIGZpbGVEYXRhfX0pXG4gICAgfVxuICB9XG5cbiAgb25Ta2V0Y2hEb3dubG9hZENvbXBsZXRlICgpIHtcbiAgICB0aGlzLmlzU2tldGNoSW5zdGFsbGVkID0gdHJ1ZVxuICAgIHRoaXMub3BlblNrZXRjaEZpbGUodGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLmZpbGVEYXRhKVxuICAgIHRoaXMuc2V0U3RhdGUoe3NrZXRjaERvd25sb2FkZXI6IHsuLi50aGlzLnN0YXRlLnNrZXRjaERvd25sb2FkZXIsIGlzVmlzaWJsZTogZmFsc2UsIGZpbGVEYXRhOiBudWxsfX0pXG4gIH1cblxuICBvblNrZXRjaERpYWxvZ0ZpbGVDcmVhdGVkICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtza2V0Y2hEb3dubG9hZGVyOiB7Li4udGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLCBzaG91bGRBc2tGb3JTa2V0Y2g6IGZhbHNlfX0pXG4gIH1cblxuICBoYW5kbGVBc3NldEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdza2V0Y2gnOlxuICAgICAgICB0aGlzLmhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24oZmlsZURhdGEpXG4gICAgICAgIHRoaXMucHJvcHMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0NvdWxkblxcJ3QgaGFuZGxlIHRoYXQgZmlsZSwgcGxlYXNlIGNvbnRhY3Qgc3VwcG9ydC4nIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlQXNzZXREZWxldGlvbiAoYXNzZXQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IHRydWV9KVxuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAndW5saW5rQXNzZXQnLCBwYXJhbXM6IFthc3NldC5yZWxwYXRoLCB0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgIGlmIChlcnJvcikgdGhpcy5zZXRTdGF0ZSh7ZXJyb3IsIGlzTG9hZGluZzogZmFsc2V9KVxuICAgICAgaWYgKGFzc2V0cykgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cywgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVGaWxlRHJvcCAoZmlsZXMsIGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcblxuICAgIGNvbnN0IGZpbGVQYXRocyA9IGxvZGFzaC5tYXAoZmlsZXMsIGZpbGUgPT4gZmlsZS5wYXRoKVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdChcbiAgICAgIHttZXRob2Q6ICdidWxrTGlua0Fzc2V0cycsIHBhcmFtczogW2ZpbGVQYXRocywgdGhpcy5wcm9wcy5mb2xkZXJdfSxcbiAgICAgIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogZmFsc2V9KVxuICAgICAgICBpZiAoZXJyb3IpIHRoaXMuc2V0U3RhdGUoe2Vycm9yfSlcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YXNzZXRzfSlcbiAgICAgIH1cbiAgICApXG4gIH1cblxuICBnZXRQcmltYXJ5QXNzZXQgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hc3NldHMpIHJldHVybiBudWxsXG4gICAgaWYgKHRoaXMuc3RhdGUuYXNzZXRzLmxlbmd0aCA8IDEpIHJldHVybiBudWxsXG4gICAgbGV0IHByaW1hcnlcbiAgICB0aGlzLnN0YXRlLmFzc2V0cy5mb3JFYWNoKChhc3NldCkgPT4ge1xuICAgICAgaWYgKGFzc2V0LmlzUHJpbWFyeURlc2lnbikge1xuICAgICAgICBwcmltYXJ5ID0gYXNzZXRcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBwcmltYXJ5XG4gIH1cblxuICBnZXRPdGhlckFzc2V0cyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFzc2V0cykgcmV0dXJuIFtdXG4gICAgaWYgKHRoaXMuc3RhdGUuYXNzZXRzLmxlbmd0aCA8IDEpIHJldHVybiBbXVxuICAgIGxldCBvdGhlcnMgPSBbXVxuICAgIHRoaXMuc3RhdGUuYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICBpZiAoIWFzc2V0LmlzUHJpbWFyeURlc2lnbikge1xuICAgICAgICBvdGhlcnMucHVzaChhc3NldClcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBvdGhlcnNcbiAgfVxuXG4gIHJlbmRlclByaW1hcnlBc3NldCAoYXNzZXQpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJBc3NldEl0ZW0oYXNzZXQsIHRydWUpXG4gIH1cblxuICByZW5kZXJQcmltYXJ5QXNzZXRIaW50IChhc3NldCkge1xuICAgIGxldCBoYXNTdWJBc3NldHMgPSBmYWxzZVxuICAgIGlmIChhc3NldC5hcnRib2FyZHMgJiYgYXNzZXQuYXJ0Ym9hcmRzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuICAgIGlmIChhc3NldC5wYWdlcyAmJiBhc3NldC5wYWdlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIGhhc1N1YkFzc2V0cyA9IHRydWVcbiAgICBpZiAoYXNzZXQuc2xpY2VzICYmIGFzc2V0LnNsaWNlcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIGhhc1N1YkFzc2V0cyA9IHRydWVcblxuICAgIGlmIChoYXNTdWJBc3NldHMpIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMucHJpbWFyeUFzc2V0VGV4dH0+XG4gICAgICAgICAg4oenIERvdWJsZSBjbGljayB0byBvcGVuIHRoaXMgZmlsZSBpbiBTa2V0Y2guXG4gICAgICAgICAgRXZlcnkgc2xpY2UgYW5kIGFydGJvYXJkIHdpbGwgYmUgc3luY2VkIGhlcmUgd2hlbiB5b3Ugc2F2ZS5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQXNzZXRJdGVtIChhc3NldCwgaXNQcmltYXJ5QXNzZXQpIHtcbiAgICBpZiAoYXNzZXQudHlwZSA9PT0gJ3NrZXRjaCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb2xsYXBzZUl0ZW1cbiAgICAgICAgICBpc1ByaW1hcnlBc3NldD17aXNQcmltYXJ5QXNzZXR9XG4gICAgICAgICAga2V5PXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgICBmaWxlPXthc3NldH1cbiAgICAgICAgICBmb2xkZXI9e3RoaXMucHJvcHMuZm9sZGVyfVxuICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5oYW5kbGVBc3NldEluc3RhbnRpYXRpb24uYmluZCh0aGlzLCBhc3NldCl9XG4gICAgICAgICAgZGVsZXRlPXt0aGlzLmhhbmRsZUFzc2V0RGVsZXRpb24uYmluZCh0aGlzLCBhc3NldCl9IC8+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxMaWJyYXJ5SXRlbVxuICAgICAgICBrZXk9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICBwcmV2aWV3PXthc3NldC5wcmV2aWV3fVxuICAgICAgICBmaWxlTmFtZT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICB1cGRhdGVUaW1lPXthc3NldC51cGRhdGVUaW1lfVxuICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5oYW5kbGVBc3NldEluc3RhbnRpYXRpb24uYmluZCh0aGlzLCBhc3NldCl9XG4gICAgICAgIGRlbGV0ZT17dGhpcy5oYW5kbGVBc3NldERlbGV0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck90aGVyQXNzZXRzIChhc3NldHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2xvZGFzaC5tYXAoYXNzZXRzLCAoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2BpdGVtLSR7ZmlsZS5maWxlTmFtZX0tJHtpbmRleH1gfT5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXNzZXRJdGVtKGZpbGUpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckFzc2V0c0xpc3QgKCkge1xuICAgIGxldCBwcmltYXJ5QXNzZXQgPSB0aGlzLmdldFByaW1hcnlBc3NldCgpXG4gICAgbGV0IG90aGVyQXNzZXRzID0gdGhpcy5nZXRPdGhlckFzc2V0cygpXG5cbiAgICBpZiAoIXByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc3RhcnRUZXh0fT5cbiAgICAgICAgICBJbXBvcnQgYSBTa2V0Y2ggb3IgU1ZHIGZpbGUgdG8gc3RhcnRcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJPdGhlckFzc2V0cyhvdGhlckFzc2V0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXRIaW50KHByaW1hcnlBc3NldCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcHJvcHNGb3JQcmltaXRpdmUgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVzW25hbWVdXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsaWJyYXJ5LXdyYXBwZXInIHN0eWxlPXt7aGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNlY3Rpb25IZWFkZXJ9PlxuICAgICAgICAgIExpYnJhcnlcbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnV0dG9ufSBvbkNsaWNrPXt0aGlzLmxhdW5jaEZpbGVwaWNrZXJ9Pis8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9J2ZpbGUnXG4gICAgICAgICAgICByZWY9J2ZpbGVwaWNrZXInXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmhhbmRsZUZpbGVEcm9wKHRoaXMucmVmcy5maWxlcGlja2VyLmZpbGVzLCBlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7b3BhY2l0eTogMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB3aWR0aDogOTAsIHpJbmRleDogM319IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2Nyb2xsd3JhcH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmFzc2V0c1dyYXBwZXJ9PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNMb2FkaW5nID8gJycgOiB0aGlzLnJlbmRlckFzc2V0c0xpc3QoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLnNrZXRjaERvd25sb2FkZXIuaXNWaXNpYmxlICYmXG4gICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLnNob3VsZEFza0ZvclNrZXRjaCAmJiAoXG4gICAgICAgICAgICA8U2tldGNoRG93bmxvYWRlclxuICAgICAgICAgICAgICBvbkRvd25sb2FkQ29tcGxldGU9e3RoaXMub25Ta2V0Y2hEb3dubG9hZENvbXBsZXRlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uU2tldGNoRGlhbG9nRmlsZUNyZWF0ZWQ9e3RoaXMub25Ta2V0Y2hEaWFsb2dGaWxlQ3JlYXRlZC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oTGlicmFyeURyYXdlcilcbiJdfQ==