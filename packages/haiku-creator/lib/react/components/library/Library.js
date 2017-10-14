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
              lineNumber: 232
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
            lineNumber: 243
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
          lineNumber: 257
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
            lineNumber: 272
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 275
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
              lineNumber: 290
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
              lineNumber: 298
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
              lineNumber: 306
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
            lineNumber: 314
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
            lineNumber: 327
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 328
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 330
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
              lineNumber: 331
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 338
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 339
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
            lineNumber: 345
          },
          __self: this
        })
      );
    }
  }]);

  return LibraryDrawer;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(LibraryDrawer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2tldGNoRG93bmxvYWRlciIsImlzVmlzaWJsZSIsImZpbGVEYXRhIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJjaGVja0lmSW5zdGFsbGVkIiwidGhlbiIsImlzU2tldGNoSW5zdGFsbGVkIiwiaXNJbnN0YWxsZWQiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsInByZXZpZXciLCJjcmVhdGVOb3RpY2UiLCJ0eXBlIiwidGl0bGUiLCJtZXNzYWdlIiwibWV0YWRhdGEiLCJlcnIiLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJvcGVuU2tldGNoRmlsZSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImFzc2V0IiwicmVscGF0aCIsImZpbGVzIiwiZXZlbnQiLCJmaWxlUGF0aHMiLCJtYXAiLCJmaWxlIiwicGF0aCIsImxlbmd0aCIsInByaW1hcnkiLCJmb3JFYWNoIiwiaXNQcmltYXJ5RGVzaWduIiwib3RoZXJzIiwicHVzaCIsInJlbmRlckFzc2V0SXRlbSIsImhhc1N1YkFzc2V0cyIsImFydGJvYXJkcyIsImNvbGxlY3Rpb24iLCJwYWdlcyIsInNsaWNlcyIsImlzUHJpbWFyeUFzc2V0Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJiaW5kIiwiaGFuZGxlQXNzZXREZWxldGlvbiIsInVwZGF0ZVRpbWUiLCJpbmRleCIsInByaW1hcnlBc3NldCIsImdldFByaW1hcnlBc3NldCIsIm90aGVyQXNzZXRzIiwiZ2V0T3RoZXJBc3NldHMiLCJyZW5kZXJPdGhlckFzc2V0cyIsInJlbmRlclByaW1hcnlBc3NldCIsInJlbmRlclByaW1hcnlBc3NldEhpbnQiLCJsYXVuY2hGaWxlcGlja2VyIiwiZSIsImhhbmRsZUZpbGVEcm9wIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsInJlbmRlckFzc2V0c0xpc3QiLCJvblNrZXRjaERvd25sb2FkQ29tcGxldGUiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztB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QUE7QUFIRixTQURGO0FBV0U7QUFBQTtBQUFBLFlBQUssT0FBT3RCLE9BQU9DLFVBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU9ELE9BQU9pQixhQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxpQkFBSzhCLEtBQUwsQ0FBV0ssU0FBWCxHQUF1QixFQUF2QixHQUE0QixLQUFLNEUsZ0JBQUw7QUFEL0I7QUFERixTQVhGO0FBaUJJLGFBQUtqRixLQUFMLENBQVdNLGdCQUFYLENBQTRCQyxTQUE1QixJQUNFO0FBQ0UsOEJBQW9CLEtBQUsyRSx3QkFBTCxDQUE4QnBCLElBQTlCLENBQW1DLElBQW5DLENBRHRCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbEJOLE9BREY7QUEwQkQ7Ozs7RUE3UXlCLGdCQUFNcUIsUzs7a0JBZ1JuQixzQkFBTzNGLGFBQVAsQyIsImZpbGUiOiJMaWJyYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLy4uL1BhbGV0dGUnXG5pbXBvcnQgTGlicmFyeUl0ZW0gZnJvbSAnLi9MaWJyYXJ5SXRlbSdcbmltcG9ydCBDb2xsYXBzZUl0ZW0gZnJvbSAnLi9Db2xsYXBzZUl0ZW0nXG5pbXBvcnQgU2tldGNoRG93bmxvYWRlciBmcm9tICcuLi9Ta2V0Y2hEb3dubG9hZGVyJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgc2tldGNoVXRpbHMgZnJvbSAnLi4vLi4vLi4vdXRpbHMvc2tldGNoVXRpbHMnXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHNjcm9sbHdyYXA6IHtcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9LFxuICBwcmltaXRpdmVzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgYXNzZXRzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtaW5IZWlnaHQ6ICczMDBweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGZpbGVEcm9wV3JhcHBlcjoge1xuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBidXR0b246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB6SW5kZXg6IDIsXG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgc3RhcnRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBmb250U2l6ZTogMjUsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHByaW1hcnlBc3NldFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5EQVJLX1JPQ0ssXG4gICAgZm9udFNpemU6IDE2LFxuICAgIHBhZGRpbmc6IDI0LFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgfVxufVxuXG5jbGFzcyBMaWJyYXJ5RHJhd2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5wcmltaXRpdmVzID0ge1xuICAgICAgUmVjdGFuZ2xlOiBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgRWxsaXBzZTogRWxsaXBzZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBQb2x5Z29uOiBQb2x5Z29uUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFRleHQ6IFRleHRQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpXG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGFzc2V0czogW10sXG4gICAgICBwcmV2aWV3SW1hZ2VUaW1lOiBudWxsLFxuICAgICAgb3ZlckRyb3BUYXJnZXQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIHNrZXRjaERvd25sb2FkZXI6IHtcbiAgICAgICAgaXNWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgZmlsZURhdGE6IG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QoKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAoeyBuYW1lLCBhc3NldHMgfSkgPT4ge1xuICAgICAgaWYgKG5hbWUgPT09ICdhc3NldHMtY2hhbmdlZCcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cyB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgc2tldGNoVXRpbHMuY2hlY2tJZkluc3RhbGxlZCgpLnRoZW4oaXNJbnN0YWxsZWQgPT4ge1xuICAgICAgdGhpcy5pc1NrZXRjaEluc3RhbGxlZCA9IGlzSW5zdGFsbGVkXG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZEFzc2V0TGlzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0QXNzZXRzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZUluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgaWYgKCFmaWxlRGF0YS5wcmV2aWV3KSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnRmlsZSBwYXRoIHdhcyBibGFuazsgY2Fubm90IGluc3RhbnRpYXRlJyB9KVxuICAgIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGZpbGVEYXRhLnByZXZpZXcsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdkYW5nZXInLCB0aXRsZTogZXJyLm5hbWUsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIG9wZW5Ta2V0Y2hGaWxlIChmaWxlRGF0YSkge1xuICAgIGxldCBhYnNwYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMuZm9sZGVyLCAnZGVzaWducycsIGZpbGVEYXRhLmZpbGVOYW1lKVxuICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gIH1cblxuICBoYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uKGZpbGVEYXRhKSB7XG4gICAgaWYgKHRoaXMuaXNTa2V0Y2hJbnN0YWxsZWQpIHtcbiAgICAgIHRoaXMub3BlblNrZXRjaEZpbGUoZmlsZURhdGEpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3NrZXRjaERvd25sb2FkZXI6IHtpc1Zpc2libGU6IHRydWUsIGZpbGVEYXRhfX0pXG4gICAgfVxuICB9XG5cbiAgb25Ta2V0Y2hEb3dubG9hZENvbXBsZXRlICgpIHtcbiAgICB0aGlzLmlzU2tldGNoSW5zdGFsbGVkID0gdHJ1ZVxuICAgIHRoaXMub3BlblNrZXRjaEZpbGUodGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLmZpbGVEYXRhKVxuICAgIHRoaXMuc2V0U3RhdGUoe3NrZXRjaERvd25sb2FkZXI6IHtpc1Zpc2libGU6IGZhbHNlLCBmaWxlRGF0YTogbnVsbH19KVxuICB9XG5cbiAgaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuICAgICAgY2FzZSAnc2tldGNoJzpcbiAgICAgICAgdGhpcy5oYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICB0aGlzLnByb3BzLnRvdXJDaGFubmVsLm5leHQoKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUluc3RhbnRpYXRpb24oZmlsZURhdGEpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICd3YXJuaW5nJywgdGl0bGU6ICdPb3BzIScsIG1lc3NhZ2U6ICdDb3VsZG5cXCd0IGhhbmRsZSB0aGF0IGZpbGUsIHBsZWFzZSBjb250YWN0IHN1cHBvcnQuJyB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUFzc2V0RGVsZXRpb24gKGFzc2V0KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ3VubGlua0Fzc2V0JywgcGFyYW1zOiBbYXNzZXQucmVscGF0aCwgdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHRoaXMuc2V0U3RhdGUoe2Vycm9yLCBpc0xvYWRpbmc6IGZhbHNlfSlcbiAgICAgIGlmIChhc3NldHMpIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMsIGlzTG9hZGluZzogZmFsc2UgfSlcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZURyb3AgKGZpbGVzLCBldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG5cbiAgICBjb25zdCBmaWxlUGF0aHMgPSBsb2Rhc2gubWFwKGZpbGVzLCBmaWxlID0+IGZpbGUucGF0aClcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoXG4gICAgICB7bWV0aG9kOiAnYnVsa0xpbmtBc3NldHMnLCBwYXJhbXM6IFtmaWxlUGF0aHMsIHRoaXMucHJvcHMuZm9sZGVyXX0sXG4gICAgICAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IGZhbHNlfSlcbiAgICAgICAgaWYgKGVycm9yKSB0aGlzLnNldFN0YXRlKHtlcnJvcn0pXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2Fzc2V0c30pXG4gICAgICB9XG4gICAgKVxuICB9XG5cbiAgZ2V0UHJpbWFyeUFzc2V0ICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbFxuICAgIGxldCBwcmltYXJ5XG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmIChhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgcHJpbWFyeSA9IGFzc2V0XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gcHJpbWFyeVxuICB9XG5cbiAgZ2V0T3RoZXJBc3NldHMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hc3NldHMpIHJldHVybiBbXVxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gW11cbiAgICBsZXQgb3RoZXJzID0gW11cbiAgICB0aGlzLnN0YXRlLmFzc2V0cy5mb3JFYWNoKChhc3NldCkgPT4ge1xuICAgICAgaWYgKCFhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgb3RoZXJzLnB1c2goYXNzZXQpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gb3RoZXJzXG4gIH1cblxuICByZW5kZXJQcmltYXJ5QXNzZXQgKGFzc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQXNzZXRJdGVtKGFzc2V0LCB0cnVlKVxuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0SGludCAoYXNzZXQpIHtcbiAgICBsZXQgaGFzU3ViQXNzZXRzID0gZmFsc2VcbiAgICBpZiAoYXNzZXQuYXJ0Ym9hcmRzICYmIGFzc2V0LmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIGhhc1N1YkFzc2V0cyA9IHRydWVcbiAgICBpZiAoYXNzZXQucGFnZXMgJiYgYXNzZXQucGFnZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnNsaWNlcyAmJiBhc3NldC5zbGljZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG5cbiAgICBpZiAoaGFzU3ViQXNzZXRzKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnByaW1hcnlBc3NldFRleHR9PlxuICAgICAgICAgIOKHpyBEb3VibGUgY2xpY2sgdG8gb3BlbiB0aGlzIGZpbGUgaW4gU2tldGNoLlxuICAgICAgICAgIEV2ZXJ5IHNsaWNlIGFuZCBhcnRib2FyZCB3aWxsIGJlIHN5bmNlZCBoZXJlIHdoZW4geW91IHNhdmUuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFzc2V0SXRlbSAoYXNzZXQsIGlzUHJpbWFyeUFzc2V0KSB7XG4gICAgaWYgKGFzc2V0LnR5cGUgPT09ICdza2V0Y2gnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAgaXNQcmltYXJ5QXNzZXQ9e2lzUHJpbWFyeUFzc2V0fVxuICAgICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgICAgZmlsZT17YXNzZXR9XG4gICAgICAgICAgZm9sZGVyPXt0aGlzLnByb3BzLmZvbGRlcn1cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfVxuICAgICAgICAgIGRlbGV0ZT17dGhpcy5oYW5kbGVBc3NldERlbGV0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAga2V5PXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgcHJldmlldz17YXNzZXQucHJldmlld31cbiAgICAgICAgZmlsZU5hbWU9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgdXBkYXRlVGltZT17YXNzZXQudXBkYXRlVGltZX1cbiAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfVxuICAgICAgICBkZWxldGU9e3RoaXMuaGFuZGxlQXNzZXREZWxldGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJPdGhlckFzc2V0cyAoYXNzZXRzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHtsb2Rhc2gubWFwKGFzc2V0cywgKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYga2V5PXtgaXRlbS0ke2ZpbGUuZmlsZU5hbWV9LSR7aW5kZXh9YH0+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckFzc2V0SXRlbShmaWxlKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJBc3NldHNMaXN0ICgpIHtcbiAgICBsZXQgcHJpbWFyeUFzc2V0ID0gdGhpcy5nZXRQcmltYXJ5QXNzZXQoKVxuICAgIGxldCBvdGhlckFzc2V0cyA9IHRoaXMuZ2V0T3RoZXJBc3NldHMoKVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnN0YXJ0VGV4dH0+XG4gICAgICAgICAgSW1wb3J0IGEgU2tldGNoIG9yIFNWRyBmaWxlIHRvIHN0YXJ0XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghcHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAocHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0KHByaW1hcnlBc3NldCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0SGludChwcmltYXJ5QXNzZXQpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0KHByaW1hcnlBc3NldCl9XG4gICAgICAgIHt0aGlzLnJlbmRlck90aGVyQXNzZXRzKG90aGVyQXNzZXRzKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHByb3BzRm9yUHJpbWl0aXZlIChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlc1tuYW1lXVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nbGlicmFyeS13cmFwcGVyJyBzdHlsZT17e2hlaWdodDogJzEwMCUnfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zZWN0aW9uSGVhZGVyfT5cbiAgICAgICAgICBMaWJyYXJ5XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ1dHRvbn0gb25DbGljaz17dGhpcy5sYXVuY2hGaWxlcGlja2VyfT4rPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPSdmaWxlJ1xuICAgICAgICAgICAgcmVmPSdmaWxlcGlja2VyJ1xuICAgICAgICAgICAgbXVsdGlwbGVcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5oYW5kbGVGaWxlRHJvcCh0aGlzLnJlZnMuZmlsZXBpY2tlci5maWxlcywgZSl9XG4gICAgICAgICAgICBzdHlsZT17e29wYWNpdHk6IDAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgd2lkdGg6IDkwLCB6SW5kZXg6IDN9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNjcm9sbHdyYXB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5hc3NldHNXcmFwcGVyfT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLmlzTG9hZGluZyA/ICcnIDogdGhpcy5yZW5kZXJBc3NldHNMaXN0KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5za2V0Y2hEb3dubG9hZGVyLmlzVmlzaWJsZSAmJiAoXG4gICAgICAgICAgICA8U2tldGNoRG93bmxvYWRlclxuICAgICAgICAgICAgICBvbkRvd25sb2FkQ29tcGxldGU9e3RoaXMub25Ta2V0Y2hEb3dubG9hZENvbXBsZXRlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShMaWJyYXJ5RHJhd2VyKVxuIl19