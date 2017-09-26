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
    color: _Palette2.default.COAL,
    fontSize: 25,
    padding: 24,
    textAlign: 'center',
    fontStyle: 'italic'
  }
};

var LibraryDrawer = function (_React$Component) {
  _inherits(LibraryDrawer, _React$Component);

  function LibraryDrawer(props) {
    _classCallCheck(this, LibraryDrawer);

    var _this = _possibleConstructorReturn(this, (LibraryDrawer.__proto__ || Object.getPrototypeOf(LibraryDrawer)).call(this, props));

    _this.assetsList = _this.assetsList.bind(_this);
    _this.handleFileDrop = _this.handleFileDrop.bind(_this);
    _this.reloadAssetList = _this.reloadAssetList.bind(_this);
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
      if (!this.state.assets.length < 1) return null;
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
      if (!this.state.assets.length < 1) return [];
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
      return _react2.default.createElement(
        'div',
        { style: STYLES.primaryAssetText, __source: {
            fileName: _jsxFileName,
            lineNumber: 199
          },
          __self: this
        },
        'Double click to open this file in Sketch. Every slice and artboard will be synced here when you save.'
      );
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
            lineNumber: 209
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
          lineNumber: 222
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
            lineNumber: 236
          },
          __self: this
        },
        _lodash2.default.map(assets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 239
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
              lineNumber: 254
            },
            __self: this
          },
          'Import a Sketch or SVG file to start'
        );
      }

      if (primaryAsset && otherAssets.length < 1) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 262
            },
            __self: this
          },
          this.renderPrimaryAsset(primaryAsset),
          this.renderPrimaryAssetHint(primaryAsset)
        );
      }

      if (!primaryAsset && otherAssets.length > 0) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 271
            },
            __self: this
          },
          this.renderOtherAssets(otherAssets)
        );
      }

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 278
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
            lineNumber: 291
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 292
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 294
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
              lineNumber: 295
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 302
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 303
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwicHJpbWFyeUFzc2V0VGV4dCIsIkxpYnJhcnlEcmF3ZXIiLCJwcm9wcyIsImFzc2V0c0xpc3QiLCJiaW5kIiwiaGFuZGxlRmlsZURyb3AiLCJyZWxvYWRBc3NldExpc3QiLCJwcmltaXRpdmVzIiwiUmVjdGFuZ2xlIiwid2Vic29ja2V0IiwiRWxsaXBzZSIsIlBvbHlnb24iLCJUZXh0Iiwic3RhdGUiLCJlcnJvciIsImFzc2V0cyIsInByZXZpZXdJbWFnZVRpbWUiLCJvdmVyRHJvcFRhcmdldCIsImlzTG9hZGluZyIsInNldFN0YXRlIiwib24iLCJuYW1lIiwicmVxdWVzdCIsIm1ldGhvZCIsInBhcmFtcyIsImZvbGRlciIsInNldFRpbWVvdXQiLCJmaWxlRGF0YSIsInByZXZpZXciLCJjcmVhdGVOb3RpY2UiLCJ0eXBlIiwidGl0bGUiLCJtZXNzYWdlIiwibWV0YWRhdGEiLCJlcnIiLCJhYnNwYXRoIiwiam9pbiIsImZpbGVOYW1lIiwib3Blbkl0ZW0iLCJoYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uIiwidG91ckNoYW5uZWwiLCJuZXh0IiwiaGFuZGxlRmlsZUluc3RhbnRpYXRpb24iLCJmaWxlcyIsImV2ZW50IiwiZWFjaFNlcmllcyIsImZpbGUiLCJwYXRoIiwibGVuZ3RoIiwicHJpbWFyeSIsImZvckVhY2giLCJhc3NldCIsImlzUHJpbWFyeURlc2lnbiIsIm90aGVycyIsInB1c2giLCJyZW5kZXJBc3NldEl0ZW0iLCJpc1ByaW1hcnlBc3NldCIsIm9uRHJhZ0VuZCIsIm9uRHJhZ1N0YXJ0IiwiaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uIiwidXBkYXRlVGltZSIsIm1hcCIsImluZGV4IiwicHJpbWFyeUFzc2V0IiwiZ2V0UHJpbWFyeUFzc2V0Iiwib3RoZXJBc3NldHMiLCJnZXRPdGhlckFzc2V0cyIsInJlbmRlclByaW1hcnlBc3NldCIsInJlbmRlclByaW1hcnlBc3NldEhpbnQiLCJyZW5kZXJPdGhlckFzc2V0cyIsImxhdW5jaEZpbGVwaWNrZXIiLCJlIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsInJlbmRlckFzc2V0c0xpc3QiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTO0FBQ2JDLGNBQVk7QUFDVkMsZUFBVyxNQUREO0FBRVZDLFlBQVE7QUFGRSxHQURDO0FBS2JDLGlCQUFlO0FBQ2JDLFlBQVEsU0FESztBQUViRixZQUFRLEVBRks7QUFHYkcsbUJBQWUsV0FIRjtBQUliQyxhQUFTLE1BSkk7QUFLYkMsZ0JBQVks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QUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFLLE9BQU9ILE9BQU9JLGFBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUU7QUFBQTtBQUFBLGNBQVEsT0FBT0osT0FBT3FCLE1BQXRCLEVBQThCLFNBQVMsS0FBS3NGLGdCQUE1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRkY7QUFHRTtBQUNFLGtCQUFLLE1BRFA7QUFFRSxpQkFBSSxZQUZOO0FBR0UsMEJBSEY7QUFJRSxzQkFBVSxrQkFBQ0MsQ0FBRDtBQUFBLHFCQUFPLE9BQUtsRSxjQUFMLENBQW9CLE9BQUttRSxJQUFMLENBQVVDLFVBQVYsQ0FBcUI5QixLQUF6QyxFQUFnRDRCLENBQWhELENBQVA7QUFBQSxhQUpaO0FBS0UsbUJBQU8sRUFBQ0csU0FBUyxDQUFWLEVBQWFoRyxVQUFVLFVBQXZCLEVBQW1DaUcsT0FBTyxDQUExQyxFQUE2Q0MsT0FBTyxFQUFwRCxFQUF3RDNGLFFBQVEsQ0FBaEUsRUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFIRixTQURGO0FBV0U7QUFBQTtBQUFBLFlBQUssT0FBT3RCLE9BQU9DLFVBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxjQUFLLE9BQU9ELE9BQU9pQixhQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxpQkFBS2lDLEtBQUwsQ0FBV0ssU0FBWCxHQUNHLEVBREgsR0FFRyxLQUFLMkQsZ0JBQUw7QUFITjtBQURGO0FBWEYsT0FERjtBQXFCRDs7OztFQXBPeUIsZ0JBQU1DLFM7O2tCQXVPbkIsc0JBQU83RSxhQUFQLEMiLCJmaWxlIjoiTGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29sbGFwc2VJdGVtIGZyb20gJy4vQ29sbGFwc2VJdGVtJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHNjcm9sbHdyYXA6IHtcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9LFxuICBwcmltaXRpdmVzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgYXNzZXRzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtaW5IZWlnaHQ6ICczMDBweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGZpbGVEcm9wV3JhcHBlcjoge1xuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBidXR0b246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB6SW5kZXg6IDIsXG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgc3RhcnRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBmb250U2l6ZTogMjUsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH0sXG4gIHByaW1hcnlBc3NldFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIGZvbnRTaXplOiAyNSxcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYydcbiAgfVxufVxuXG5jbGFzcyBMaWJyYXJ5RHJhd2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5hc3NldHNMaXN0ID0gdGhpcy5hc3NldHNMaXN0LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbGVEcm9wID0gdGhpcy5oYW5kbGVGaWxlRHJvcC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QgPSB0aGlzLnJlbG9hZEFzc2V0TGlzdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5wcmltaXRpdmVzID0ge1xuICAgICAgUmVjdGFuZ2xlOiBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgRWxsaXBzZTogRWxsaXBzZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBQb2x5Z29uOiBQb2x5Z29uUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFRleHQ6IFRleHRQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpXG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGFzc2V0czogW10sXG4gICAgICBwcmV2aWV3SW1hZ2VUaW1lOiBudWxsLFxuICAgICAgb3ZlckRyb3BUYXJnZXQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICB0aGlzLnJlbG9hZEFzc2V0TGlzdCgpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsICh7IG5hbWUsIGFzc2V0cyB9KSA9PiB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Fzc2V0cy1jaGFuZ2VkJykge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZEFzc2V0TGlzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0QXNzZXRzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZUluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgaWYgKCFmaWxlRGF0YS5wcmV2aWV3KSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnRmlsZSBwYXRoIHdhcyBibGFuazsgY2Fubm90IGluc3RhbnRpYXRlJyB9KVxuICAgIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGZpbGVEYXRhLnByZXZpZXcsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdkYW5nZXInLCB0aXRsZTogZXJyLm5hbWUsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgbGV0IGFic3BhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5mb2xkZXIsICdkZXNpZ25zJywgZmlsZURhdGEuZmlsZU5hbWUpXG4gICAgc2hlbGwub3Blbkl0ZW0oYWJzcGF0aClcbiAgfVxuXG4gIGhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NrZXRjaCc6XG4gICAgICAgIHRoaXMuaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnQ291bGRuXFwndCBoYW5kbGUgdGhhdCBmaWxlLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0LicgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaWxlRHJvcCAoZmlsZXMsIGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICByZXR1cm4gYXN5bmMuZWFjaFNlcmllcyhmaWxlcywgKGZpbGUsIG5leHQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlua0Fzc2V0JywgcGFyYW1zOiBbZmlsZS5wYXRoLCB0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gbmV4dChlcnJvcilcbiAgICAgICAgaWYgKGFzc2V0cykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dCgpXG4gICAgICB9KVxuICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiBmYWxzZX0pXG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICB9KVxuICB9XG5cbiAgZ2V0UHJpbWFyeUFzc2V0ICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gbnVsbFxuICAgIGlmICghdGhpcy5zdGF0ZS5hc3NldHMubGVuZ3RoIDwgMSkgcmV0dXJuIG51bGxcbiAgICBsZXQgcHJpbWFyeVxuICAgIHRoaXMuc3RhdGUuYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICBpZiAoYXNzZXQuaXNQcmltYXJ5RGVzaWduKSB7XG4gICAgICAgIHByaW1hcnkgPSBhc3NldFxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHByaW1hcnlcbiAgfVxuXG4gIGdldE90aGVyQXNzZXRzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzKSByZXR1cm4gW11cbiAgICBpZiAoIXRoaXMuc3RhdGUuYXNzZXRzLmxlbmd0aCA8IDEpIHJldHVybiBbXVxuICAgIGxldCBvdGhlcnMgPSBbXVxuICAgIHRoaXMuc3RhdGUuYXNzZXRzLmZvckVhY2goKGFzc2V0KSA9PiB7XG4gICAgICBpZiAoIWFzc2V0LmlzUHJpbWFyeURlc2lnbikge1xuICAgICAgICBvdGhlcnMucHVzaChhc3NldClcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBvdGhlcnNcbiAgfVxuXG4gIHJlbmRlclByaW1hcnlBc3NldCAoYXNzZXQpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJBc3NldEl0ZW0oYXNzZXQsIHRydWUpXG4gIH1cblxuICByZW5kZXJQcmltYXJ5QXNzZXRIaW50IChhc3NldCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMucHJpbWFyeUFzc2V0VGV4dH0+XG4gICAgICAgIERvdWJsZSBjbGljayB0byBvcGVuIHRoaXMgZmlsZSBpbiBTa2V0Y2guXG4gICAgICAgIEV2ZXJ5IHNsaWNlIGFuZCBhcnRib2FyZCB3aWxsIGJlIHN5bmNlZCBoZXJlIHdoZW4geW91IHNhdmUuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJBc3NldEl0ZW0gKGFzc2V0LCBpc1ByaW1hcnlBc3NldCkge1xuICAgIGlmIChhc3NldC50eXBlID09PSAnc2tldGNoJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbGxhcHNlSXRlbVxuICAgICAgICAgIGlzUHJpbWFyeUFzc2V0PXtpc1ByaW1hcnlBc3NldH1cbiAgICAgICAgICBrZXk9e2Fzc2V0LmZpbGVOYW1lfVxuICAgICAgICAgIGZpbGU9e2Fzc2V0fVxuICAgICAgICAgIGZvbGRlcj17dGhpcy5wcm9wcy5mb2xkZXJ9XG4gICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPExpYnJhcnlJdGVtXG4gICAgICAgIGtleT17YXNzZXQuZmlsZU5hbWV9XG4gICAgICAgIHByZXZpZXc9e2Fzc2V0LnByZXZpZXd9XG4gICAgICAgIGZpbGVOYW1lPXthc3NldC5maWxlTmFtZX1cbiAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgIHVwZGF0ZVRpbWU9e2Fzc2V0LnVwZGF0ZVRpbWV9XG4gICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGFzc2V0KX0gLz5cbiAgICApXG4gIH1cblxuICByZW5kZXJPdGhlckFzc2V0cyAoYXNzZXRzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHtsb2Rhc2gubWFwKGFzc2V0cywgKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYga2V5PXtgaXRlbS0ke2ZpbGUuZmlsZU5hbWV9LSR7aW5kZXh9YH0+XG4gICAgICAgICAgICAgIHt0aGlzLnJlbmRlckFzc2V0SXRlbShmaWxlKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJBc3NldHNMaXN0ICgpIHtcbiAgICBsZXQgcHJpbWFyeUFzc2V0ID0gdGhpcy5nZXRQcmltYXJ5QXNzZXQoKVxuICAgIGxldCBvdGhlckFzc2V0cyA9IHRoaXMuZ2V0T3RoZXJBc3NldHMoKVxuXG4gICAgaWYgKCFwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnN0YXJ0VGV4dH0+XG4gICAgICAgICAgSW1wb3J0IGEgU2tldGNoIG9yIFNWRyBmaWxlIHRvIHN0YXJ0XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmIChwcmltYXJ5QXNzZXQgJiYgb3RoZXJBc3NldHMubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXQocHJpbWFyeUFzc2V0KX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcmltYXJ5QXNzZXRIaW50KHByaW1hcnlBc3NldCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICghcHJpbWFyeUFzc2V0ICYmIG90aGVyQXNzZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMucmVuZGVyT3RoZXJBc3NldHMob3RoZXJBc3NldHMpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAge3RoaXMucmVuZGVyUHJpbWFyeUFzc2V0KHByaW1hcnlBc3NldCl9XG4gICAgICAgIHt0aGlzLnJlbmRlck90aGVyQXNzZXRzKG90aGVyQXNzZXRzKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHByb3BzRm9yUHJpbWl0aXZlIChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlc1tuYW1lXVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nbGlicmFyeS13cmFwcGVyJyBzdHlsZT17e2hlaWdodDogJzEwMCUnfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zZWN0aW9uSGVhZGVyfT5cbiAgICAgICAgICBMaWJyYXJ5XG4gICAgICAgICAgPGJ1dHRvbiBzdHlsZT17U1RZTEVTLmJ1dHRvbn0gb25DbGljaz17dGhpcy5sYXVuY2hGaWxlcGlja2VyfT4rPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPSdmaWxlJ1xuICAgICAgICAgICAgcmVmPSdmaWxlcGlja2VyJ1xuICAgICAgICAgICAgbXVsdGlwbGVcbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdGhpcy5oYW5kbGVGaWxlRHJvcCh0aGlzLnJlZnMuZmlsZXBpY2tlci5maWxlcywgZSl9XG4gICAgICAgICAgICBzdHlsZT17e29wYWNpdHk6IDAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogMCwgd2lkdGg6IDkwLCB6SW5kZXg6IDN9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNjcm9sbHdyYXB9PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5hc3NldHNXcmFwcGVyfT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLmlzTG9hZGluZ1xuICAgICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICAgIDogdGhpcy5yZW5kZXJBc3NldHNMaXN0KCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShMaWJyYXJ5RHJhd2VyKVxuIl19