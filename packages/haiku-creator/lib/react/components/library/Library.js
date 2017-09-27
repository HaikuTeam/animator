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

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

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
    color: _Palette2.default.ROCK,
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
      return _async2.default.eachSeries(files, function (file, next) {
        return _this5.props.websocket.request({ method: 'linkAsset', params: [file.path, _this5.props.folder] }, function (error, assets) {
          if (error) return next(error);
          if (assets) {
            _this5.setState({ assets: assets });
          }
          return next();
        });
      }, function (error) {
        _this5.setState({ isLoading: false });
        if (error) return _this5.setState({ error: error });
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
              lineNumber: 203
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
            lineNumber: 214
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
          lineNumber: 227
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
            lineNumber: 241
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 244
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
              lineNumber: 259
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
              lineNumber: 267
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
              lineNumber: 275
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
            lineNumber: 283
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
            lineNumber: 296
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 297
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 299
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
              lineNumber: 300
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 307
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 308
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsImZpbGVEYXRhIiwicHJldmlldyIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsImVyciIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImZpbGVzIiwiZXZlbnQiLCJlYWNoU2VyaWVzIiwiZmlsZSIsInBhdGgiLCJsZW5ndGgiLCJwcmltYXJ5IiwiZm9yRWFjaCIsImFzc2V0IiwiaXNQcmltYXJ5RGVzaWduIiwib3RoZXJzIiwicHVzaCIsInJlbmRlckFzc2V0SXRlbSIsImhhc1N1YkFzc2V0cyIsImFydGJvYXJkcyIsImNvbGxlY3Rpb24iLCJwYWdlcyIsInNsaWNlcyIsImlzUHJpbWFyeUFzc2V0Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJiaW5kIiwidXBkYXRlVGltZSIsIm1hcCIsImluZGV4IiwicHJpbWFyeUFzc2V0IiwiZ2V0UHJpbWFyeUFzc2V0Iiwib3RoZXJBc3NldHMiLCJnZXRPdGhlckFzc2V0cyIsInJlbmRlck90aGVyQXNzZXRzIiwicmVuZGVyUHJpbWFyeUFzc2V0IiwicmVuZGVyUHJpbWFyeUFzc2V0SGludCIsImxhdW5jaEZpbGVwaWNrZXIiLCJlIiwiaGFuZGxlRmlsZURyb3AiLCJyZWZzIiwiZmlsZXBpY2tlciIsIm9wYWNpdHkiLCJyaWdodCIsIndpZHRoIiwicmVuZGVyQXNzZXRzTGlzdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsY0FBWTtBQUNWQyxlQUFXLE1BREQ7QUFFVkMsWUFBUTtBQUZFLEdBREM7QUFLYkMsaUJBQWU7QUFDYkMsWUFBUSxTQURLO0FBRWJGLFlBQVEsRUFGSztB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QURGO0FBWEYsT0FERjtBQW1CRDs7OztFQXhPeUIsZ0JBQU1DLFM7O2tCQTJPbkIsc0JBQU9qRixhQUFQLEMiLCJmaWxlIjoiTGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29sbGFwc2VJdGVtIGZyb20gJy4vQ29sbGFwc2VJdGVtJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHNjcm9sbHdyYXA6IHtcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9LFxuICBwcmltaXRpdmVzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgYXNzZXRzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtaW5IZWlnaHQ6ICczMDBweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGZpbGVEcm9wV3JhcHBlcjoge1xuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBidXR0b246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB6SW5kZXg6IDIsXG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgc3RhcnRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBmb250U2l6ZTogMjUsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHByaW1hcnlBc3NldFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInXG4gIH1cbn1cblxuY2xhc3MgTGlicmFyeURyYXdlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMucHJpbWl0aXZlcyA9IHtcbiAgICAgIFJlY3RhbmdsZTogUmVjdGFuZ2xlUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIEVsbGlwc2U6IEVsbGlwc2VQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgUG9seWdvbjogUG9seWdvblByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBUZXh0OiBUZXh0UHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KVxuICAgIH1cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBhc3NldHM6IFtdLFxuICAgICAgcHJldmlld0ltYWdlVGltZTogbnVsbCxcbiAgICAgIG92ZXJEcm9wVGFyZ2V0OiBmYWxzZSxcbiAgICAgIGlzTG9hZGluZzogZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QoKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAoeyBuYW1lLCBhc3NldHMgfSkgPT4ge1xuICAgICAgaWYgKG5hbWUgPT09ICdhc3NldHMtY2hhbmdlZCcpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cyB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZWxvYWRBc3NldExpc3QgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlzdEFzc2V0cycsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyXSB9LCAoZXJyb3IsIGFzc2V0cykgPT4ge1xuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG4gICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzTG9hZGluZzogZmFsc2UgfSlcbiAgICAgIH0sIDEwMDApXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUZpbGVJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIGlmICghZmlsZURhdGEucHJldmlldykgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0ZpbGUgcGF0aCB3YXMgYmxhbms7IGNhbm5vdCBpbnN0YW50aWF0ZScgfSlcbiAgICBjb25zdCBtZXRhZGF0YSA9IHt9XG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IHR5cGU6ICdhY3Rpb24nLCBtZXRob2Q6ICdpbnN0YW50aWF0ZUNvbXBvbmVudCcsIHBhcmFtczogW3RoaXMucHJvcHMuZm9sZGVyLCBmaWxlRGF0YS5wcmV2aWV3LCBtZXRhZGF0YV0gfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnZGFuZ2VyJywgdGl0bGU6IGVyci5uYW1lLCBtZXNzYWdlOiBlcnIubWVzc2FnZSB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIGxldCBhYnNwYXRoID0gcGF0aC5qb2luKHRoaXMucHJvcHMuZm9sZGVyLCAnZGVzaWducycsIGZpbGVEYXRhLmZpbGVOYW1lKVxuICAgIHNoZWxsLm9wZW5JdGVtKGFic3BhdGgpXG4gIH1cblxuICBoYW5kbGVBc3NldEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgc3dpdGNoIChmaWxlRGF0YS50eXBlKSB7XG4gICAgICBjYXNlICdza2V0Y2gnOlxuICAgICAgICB0aGlzLmhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24oZmlsZURhdGEpXG4gICAgICAgIHRoaXMucHJvcHMudG91ckNoYW5uZWwubmV4dCgpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ3dhcm5pbmcnLCB0aXRsZTogJ09vcHMhJywgbWVzc2FnZTogJ0NvdWxkblxcJ3QgaGFuZGxlIHRoYXQgZmlsZSwgcGxlYXNlIGNvbnRhY3Qgc3VwcG9ydC4nIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRmlsZURyb3AgKGZpbGVzLCBldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgcmV0dXJuIGFzeW5jLmVhY2hTZXJpZXMoZmlsZXMsIChmaWxlLCBuZXh0KSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpbmtBc3NldCcsIHBhcmFtczogW2ZpbGUucGF0aCwgdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikgcmV0dXJuIG5leHQoZXJyb3IpXG4gICAgICAgIGlmIChhc3NldHMpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQoKVxuICAgICAgfSlcbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogZmFsc2V9KVxuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG4gICAgfSlcbiAgfVxuXG4gIGdldFByaW1hcnlBc3NldCAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmFzc2V0cykgcmV0dXJuIG51bGxcbiAgICBpZiAodGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGxcbiAgICBsZXQgcHJpbWFyeVxuICAgIHRoaXMuc3RhdGUuYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICBpZiAoYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIHByaW1hcnkgPSBhc3NldFxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHByaW1hcnlcbiAgfVxuXG4gIGdldE90aGVyQXNzZXRzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIFtdXG4gICAgbGV0IG90aGVycyA9IFtdXG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmICghYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIG90aGVycy5wdXNoKGFzc2V0KVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG90aGVyc1xuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0IChhc3NldCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlckFzc2V0SXRlbShhc3NldCwgdHJ1ZSlcbiAgfVxuXG4gIHJlbmRlclByaW1hcnlBc3NldEhpbnQgKGFzc2V0KSB7XG4gICAgbGV0IGhhc1N1YkFzc2V0cyA9IGZhbHNlXG4gICAgaWYgKGFzc2V0LmFydGJvYXJkcyAmJiBhc3NldC5hcnRib2FyZHMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnBhZ2VzICYmIGFzc2V0LnBhZ2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuICAgIGlmIChhc3NldC5zbGljZXMgJiYgYXNzZXQuc2xpY2VzLmNvbGxlY3Rpb24ubGVuZ3RoID4gMCkgaGFzU3ViQXNzZXRzID0gdHJ1ZVxuXG4gICAgaWYgKGhhc1N1YkFzc2V0cykge1xuICAgICAgcmV0dXJuICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5wcmltYXJ5QXNzZXRUZXh0fT5cbiAgICAgICAgICDih6cgRG91YmxlIGNsaWNrIHRvIG9wZW4gdGhpcyBmaWxlIGluIFNrZXRjaC5cbiAgICAgICAgICBFdmVyeSBzbGljZSBhbmQgYXJ0Ym9hcmQgd2lsbCBiZSBzeW5jZWQgaGVyZSB3aGVuIHlvdSBzYXZlLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gIH1cblxuICByZW5kZXJBc3NldEl0ZW0gKGFzc2V0LCBpc1ByaW1hcnlBc3NldCkge1xuICAgIGlmIChhc3NldC50eXBlID09PSAnc2tldGNoJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbGxhcHNlSXRlbVxuICAgICAgICAgIGlzUHJpbWFyeUFzc2V0PXtpc1ByaW1hcnlBc3NldH1cbiAgICAgICAgICBrZXk9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICAgIGZpbGU9e2Fzc2V0fVxuICAgICAgICAgIGZvbGRlcj17dGhpcy5wcm9wcy5mb2xkZXJ9XG4gICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPExpYnJhcnlJdGVtXG4gICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgIHByZXZpZXc9e2Fzc2V0LnByZXZpZXd9XG4gICAgICAgIGZpbGVOYW1lPXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgIHVwZGF0ZVRpbWU9e2Fzc2V0LnVwZGF0ZVRpbWV9XG4gICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJPdGhlckFzc2V0cyAoYXNzZXRzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHtsb2Rhc2gubWFwKGFzc2V0cywgKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYga2V5PXtgaXRlbS0ke2ZpbGUuZmlsZU5hbWV9LSR7aW5kZXh9YH0+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckFzc2V0SXRlbShmaWxlKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJBc3NldHNMaXN0ICgpIHtcbiAgICBsZXQgcHJpbWFyeUFzc2V0ID0gdGhpcy5nZXRQcmltYXJ5QXNzZXQoKVxuICAgIGxldCBvdGhlckFzc2V0cyA9IHRoaXMuZ2V0T3RoZXJBc3NldHMoKVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnN0YXJ0VGV4dH0+XG4gICAgICAgICAgSW1wb3J0IGEgU2tldGNoIG9yIFNWRyBmaWxlIHRvIHN0YXJ0XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghcHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICBpZiAocHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0KHByaW1hcnlBc3NldCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0SGludChwcmltYXJ5QXNzZXQpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0KHByaW1hcnlBc3NldCl9XG4gICAgICAgIHt0aGlzLnJlbmRlck90aGVyQXNzZXRzKG90aGVyQXNzZXRzKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHByb3BzRm9yUHJpbWl0aXZlIChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlc1tuYW1lXVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nbGlicmFyeS13cmFwcGVyJyBzdHlsZT17e2hlaWdodDogJzEwMCUnfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zZWN0aW9uSGVhZGVyfT5cbiAgICAgICAgICBMaWJyYXJ5XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ1dHRvbn0gb25DbGljaz17dGhpcy5sYXVuY2hGaWxlcGlja2VyfT4rPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPSdmaWxlJ1xuICAgICAgICAgICAgcmVmPSdmaWxlcGlja2VyJ1xuICAgICAgICAgICAgbXVsdGlwbGVcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5oYW5kbGVGaWxlRHJvcCh0aGlzLnJlZnMuZmlsZXBpY2tlci5maWxlcywgZSl9XG4gICAgICAgICAgICBzdHlsZT17e29wYWNpdHk6IDAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgd2lkdGg6IDkwLCB6SW5kZXg6IDN9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNjcm9sbHdyYXB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5hc3NldHNXcmFwcGVyfT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLmlzTG9hZGluZyA/ICcnIDogdGhpcy5yZW5kZXJBc3NldHNMaXN0KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShMaWJyYXJ5RHJhd2VyKVxuIl19