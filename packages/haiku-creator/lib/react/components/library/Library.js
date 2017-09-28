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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkRBUktfUk9DSyIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwic2V0U3RhdGUiLCJyZWxvYWRBc3NldExpc3QiLCJvbiIsIm5hbWUiLCJyZXF1ZXN0IiwibWV0aG9kIiwicGFyYW1zIiwiZm9sZGVyIiwic2V0VGltZW91dCIsImZpbGVEYXRhIiwicHJldmlldyIsImNyZWF0ZU5vdGljZSIsInR5cGUiLCJ0aXRsZSIsIm1lc3NhZ2UiLCJtZXRhZGF0YSIsImVyciIsImFic3BhdGgiLCJqb2luIiwiZmlsZU5hbWUiLCJvcGVuSXRlbSIsImhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsIm5leHQiLCJoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiIsImZpbGVzIiwiZXZlbnQiLCJlYWNoU2VyaWVzIiwiZmlsZSIsInBhdGgiLCJsZW5ndGgiLCJwcmltYXJ5IiwiZm9yRWFjaCIsImFzc2V0IiwiaXNQcmltYXJ5RGVzaWduIiwib3RoZXJzIiwicHVzaCIsInJlbmRlckFzc2V0SXRlbSIsImhhc1N1YkFzc2V0cyIsImFydGJvYXJkcyIsImNvbGxlY3Rpb24iLCJwYWdlcyIsInNsaWNlcyIsImlzUHJpbWFyeUFzc2V0Iiwib25EcmFnRW5kIiwib25EcmFnU3RhcnQiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJiaW5kIiwidXBkYXRlVGltZSIsIm1hcCIsImluZGV4IiwicHJpbWFyeUFzc2V0IiwiZ2V0UHJpbWFyeUFzc2V0Iiwib3RoZXJBc3NldHMiLCJnZXRPdGhlckFzc2V0cyIsInJlbmRlck90aGVyQXNzZXRzIiwicmVuZGVyUHJpbWFyeUFzc2V0IiwicmVuZGVyUHJpbWFyeUFzc2V0SGludCIsImxhdW5jaEZpbGVwaWNrZXIiLCJlIiwiaGFuZGxlRmlsZURyb3AiLCJyZWZzIiwiZmlsZXBpY2tlciIsIm9wYWNpdHkiLCJyaWdodCIsIndpZHRoIiwicmVuZGVyQXNzZXRzTGlzdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsY0FBWTtBQUNWQyxlQUFXLE1BREQ7QUFFVkMsWUFBUTtBQUZFLEdBREM7QUFLYkMsaUJBQWU7QUFDYkMsWUFBUSxTQURLO0FBRWJG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QkFBTDtBQUQvQjtBQURGO0FBWEYsT0FERjtBQW1CRDs7OztFQXhPeUIsZ0JBQU1DLFM7O2tCQTJPbkIsc0JBQU9qRixhQUFQLEMiLCJmaWxlIjoiTGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29sbGFwc2VJdGVtIGZyb20gJy4vQ29sbGFwc2VJdGVtJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHNjcm9sbHdyYXA6IHtcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9LFxuICBwcmltaXRpdmVzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgYXNzZXRzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtaW5IZWlnaHQ6ICczMDBweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGZpbGVEcm9wV3JhcHBlcjoge1xuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBidXR0b246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB6SW5kZXg6IDIsXG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgc3RhcnRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBmb250U2l6ZTogMjUsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHByaW1hcnlBc3NldFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5EQVJLX1JPQ0ssXG4gICAgZm9udFNpemU6IDE2LFxuICAgIHBhZGRpbmc6IDI0LFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgfVxufVxuXG5jbGFzcyBMaWJyYXJ5RHJhd2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5wcmltaXRpdmVzID0ge1xuICAgICAgUmVjdGFuZ2xlOiBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgRWxsaXBzZTogRWxsaXBzZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBQb2x5Z29uOiBQb2x5Z29uUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFRleHQ6IFRleHRQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpXG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGFzc2V0czogW10sXG4gICAgICBwcmV2aWV3SW1hZ2VUaW1lOiBudWxsLFxuICAgICAgb3ZlckRyb3BUYXJnZXQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICB0aGlzLnJlbG9hZEFzc2V0TGlzdCgpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsICh7IG5hbWUsIGFzc2V0cyB9KSA9PiB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Fzc2V0cy1jaGFuZ2VkJykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZEFzc2V0TGlzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0QXNzZXRzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZUluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgaWYgKCFmaWxlRGF0YS5wcmV2aWV3KSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnRmlsZSBwYXRoIHdhcyBibGFuazsgY2Fubm90IGluc3RhbnRpYXRlJyB9KVxuICAgIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGZpbGVEYXRhLnByZXZpZXcsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdkYW5nZXInLCB0aXRsZTogZXJyLm5hbWUsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgbGV0IGFic3BhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5mb2xkZXIsICdkZXNpZ25zJywgZmlsZURhdGEuZmlsZU5hbWUpXG4gICAgc2hlbGwub3Blbkl0ZW0oYWJzcGF0aClcbiAgfVxuXG4gIGhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NrZXRjaCc6XG4gICAgICAgIHRoaXMuaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnQ291bGRuXFwndCBoYW5kbGUgdGhhdCBmaWxlLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0LicgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaWxlRHJvcCAoZmlsZXMsIGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICByZXR1cm4gYXN5bmMuZWFjaFNlcmllcyhmaWxlcywgKGZpbGUsIG5leHQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlua0Fzc2V0JywgcGFyYW1zOiBbZmlsZS5wYXRoLCB0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gbmV4dChlcnJvcilcbiAgICAgICAgaWYgKGFzc2V0cykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dCgpXG4gICAgICB9KVxuICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiBmYWxzZX0pXG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICB9KVxuICB9XG5cbiAgZ2V0UHJpbWFyeUFzc2V0ICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gbnVsbFxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gbnVsbFxuICAgIGxldCBwcmltYXJ5XG4gICAgdGhpcy5zdGF0ZS5hc3NldHMuZm9yRWFjaCgoYXNzZXQpID0+IHtcbiAgICAgIGlmIChhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgcHJpbWFyeSA9IGFzc2V0XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gcHJpbWFyeVxuICB9XG5cbiAgZ2V0T3RoZXJBc3NldHMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5hc3NldHMpIHJldHVybiBbXVxuICAgIGlmICh0aGlzLnN0YXRlLmFzc2V0cy5sZW5ndGggPCAxKSByZXR1cm4gW11cbiAgICBsZXQgb3RoZXJzID0gW11cbiAgICB0aGlzLnN0YXRlLmFzc2V0cy5mb3JFYWNoKChhc3NldCkgPT4ge1xuICAgICAgaWYgKCFhc3NldC5pc1ByaW1hcnlEZXNpZ24pIHtcbiAgICAgICAgb3RoZXJzLnB1c2goYXNzZXQpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gb3RoZXJzXG4gIH1cblxuICByZW5kZXJQcmltYXJ5QXNzZXQgKGFzc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyQXNzZXRJdGVtKGFzc2V0LCB0cnVlKVxuICB9XG5cbiAgcmVuZGVyUHJpbWFyeUFzc2V0SGludCAoYXNzZXQpIHtcbiAgICBsZXQgaGFzU3ViQXNzZXRzID0gZmFsc2VcbiAgICBpZiAoYXNzZXQuYXJ0Ym9hcmRzICYmIGFzc2V0LmFydGJvYXJkcy5jb2xsZWN0aW9uLmxlbmd0aCA+IDApIGhhc1N1YkFzc2V0cyA9IHRydWVcbiAgICBpZiAoYXNzZXQucGFnZXMgJiYgYXNzZXQucGFnZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG4gICAgaWYgKGFzc2V0LnNsaWNlcyAmJiBhc3NldC5zbGljZXMuY29sbGVjdGlvbi5sZW5ndGggPiAwKSBoYXNTdWJBc3NldHMgPSB0cnVlXG5cbiAgICBpZiAoaGFzU3ViQXNzZXRzKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnByaW1hcnlBc3NldFRleHR9PlxuICAgICAgICAgIOKHpyBEb3VibGUgY2xpY2sgdG8gb3BlbiB0aGlzIGZpbGUgaW4gU2tldGNoLlxuICAgICAgICAgIEV2ZXJ5IHNsaWNlIGFuZCBhcnRib2FyZCB3aWxsIGJlIHN5bmNlZCBoZXJlIHdoZW4geW91IHNhdmUuXG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckFzc2V0SXRlbSAoYXNzZXQsIGlzUHJpbWFyeUFzc2V0KSB7XG4gICAgaWYgKGFzc2V0LnR5cGUgPT09ICdza2V0Y2gnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAgaXNQcmltYXJ5QXNzZXQ9e2lzUHJpbWFyeUFzc2V0fVxuICAgICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgICAgZmlsZT17YXNzZXR9XG4gICAgICAgICAgZm9sZGVyPXt0aGlzLnByb3BzLmZvbGRlcn1cbiAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8TGlicmFyeUl0ZW1cbiAgICAgICAga2V5PXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgcHJldmlldz17YXNzZXQucHJldmlld31cbiAgICAgICAgZmlsZU5hbWU9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgdXBkYXRlVGltZT17YXNzZXQudXBkYXRlVGltZX1cbiAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgYXNzZXQpfSAvPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlck90aGVyQXNzZXRzIChhc3NldHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge2xvZGFzaC5tYXAoYXNzZXRzLCAoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2BpdGVtLSR7ZmlsZS5maWxlTmFtZX0tJHtpbmRleH1gfT5cbiAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXNzZXRJdGVtKGZpbGUpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckFzc2V0c0xpc3QgKCkge1xuICAgIGxldCBwcmltYXJ5QXNzZXQgPSB0aGlzLmdldFByaW1hcnlBc3NldCgpXG4gICAgbGV0IG90aGVyQXNzZXRzID0gdGhpcy5nZXRPdGhlckFzc2V0cygpXG5cbiAgICBpZiAoIXByaW1hcnlBc3NldCAmJiBvdGhlckFzc2V0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc3RhcnRUZXh0fT5cbiAgICAgICAgICBJbXBvcnQgYSBTa2V0Y2ggb3IgU1ZHIGZpbGUgdG8gc3RhcnRcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJPdGhlckFzc2V0cyhvdGhlckFzc2V0cyl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXRIaW50KHByaW1hcnlBc3NldCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcHJvcHNGb3JQcmltaXRpdmUgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVzW25hbWVdXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsaWJyYXJ5LXdyYXBwZXInIHN0eWxlPXt7aGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNlY3Rpb25IZWFkZXJ9PlxuICAgICAgICAgIExpYnJhcnlcbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnV0dG9ufSBvbkNsaWNrPXt0aGlzLmxhdW5jaEZpbGVwaWNrZXJ9Pis8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9J2ZpbGUnXG4gICAgICAgICAgICByZWY9J2ZpbGVwaWNrZXInXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmhhbmRsZUZpbGVEcm9wKHRoaXMucmVmcy5maWxlcGlja2VyLmZpbGVzLCBlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7b3BhY2l0eTogMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB3aWR0aDogOTAsIHpJbmRleDogM319IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2Nyb2xsd3JhcH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmFzc2V0c1dyYXBwZXJ9PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNMb2FkaW5nID8gJycgOiB0aGlzLnJlbmRlckFzc2V0c0xpc3QoKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKExpYnJhcnlEcmF3ZXIpXG4iXX0=