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
      isLoading: false,
      empty: false
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
          var empty = assets.length === 0;
          _this2.setState({ assets: assets, empty: empty });
        }
      });
    }
  }, {
    key: 'reloadAssetList',
    value: function reloadAssetList() {
      var _this3 = this;

      return this.props.websocket.request({ method: 'listAssets', params: [this.props.folder] }, function (error, assets) {
        if (error) return _this3.setState({ error: error });
        var empty = assets.length === 0;
        _this3.setState({ assets: assets, empty: empty });
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
        return _this5.props.websocket.request({ method: 'linkAsset', params: [file.path, _this5.props.folder] }, function (error) {
          if (error) return next(error);
          return next();
        });
      }, function (error) {
        _this5.setState({ isLoading: false });
        if (error) return _this5.setState({ error: error });
      });
    }
  }, {
    key: 'assetsList',
    value: function assetsList(currentAssets) {
      var _this6 = this;

      return !currentAssets || currentAssets.length < 1 ? this.state.empty ? _react2.default.createElement(
        'div',
        { style: STYLES.startText, __source: {
            fileName: _jsxFileName,
            lineNumber: 165
          },
          __self: this
        },
        'Import a Sketch or SVG file to start'
      ) : _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 166
        },
        __self: this
      }) : _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 167
          },
          __self: this
        },
        _lodash2.default.map(currentAssets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 170
              },
              __self: _this6
            },
            file.type !== 'sketch' ? _react2.default.createElement(_LibraryItem2.default, {
              key: file.fileName,
              preview: file.preview,
              fileName: file.fileName,
              onDragEnd: _this6.props.onDragEnd,
              onDragStart: _this6.props.onDragStart,
              updateTime: file.updateTime,
              websocket: _this6.props.websocket,
              instantiate: _this6.handleAssetInstantiation.bind(_this6, file), __source: {
                fileName: _jsxFileName,
                lineNumber: 172
              },
              __self: _this6
            }) : _react2.default.createElement(_CollapseItem2.default, {
              key: file.fileName,
              file: file,
              folder: _this6.props.folder,
              onDragEnd: _this6.props.onDragEnd,
              onDragStart: _this6.props.onDragStart,
              websocket: _this6.props.websocket,
              instantiate: _this6.handleAssetInstantiation.bind(_this6, file),
              tourChannel: _this6.props.tourChannel, __source: {
                fileName: _jsxFileName,
                lineNumber: 181
              },
              __self: _this6
            })
          );
        })
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
            lineNumber: 204
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.sectionHeader, __source: {
              fileName: _jsxFileName,
              lineNumber: 205
            },
            __self: this
          },
          'Library',
          _react2.default.createElement(
            'button',
            { style: STYLES.button, onClick: this.launchFilepicker, __source: {
                fileName: _jsxFileName,
                lineNumber: 207
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
              lineNumber: 208
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          { style: STYLES.scrollwrap, __source: {
              fileName: _jsxFileName,
              lineNumber: 215
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: STYLES.assetsWrapper, __source: {
                fileName: _jsxFileName,
                lineNumber: 216
              },
              __self: this
            },
            this.state.isLoading ? '' : this.assetsList(this.state.assets)
          )
        )
      );
    }
  }]);

  return LibraryDrawer;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(LibraryDrawer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwiTGlicmFyeURyYXdlciIsInByb3BzIiwiYXNzZXRzTGlzdCIsImJpbmQiLCJoYW5kbGVGaWxlRHJvcCIsInJlbG9hZEFzc2V0TGlzdCIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwiZW1wdHkiLCJzZXRTdGF0ZSIsIm9uIiwibmFtZSIsImxlbmd0aCIsInJlcXVlc3QiLCJtZXRob2QiLCJwYXJhbXMiLCJmb2xkZXIiLCJzZXRUaW1lb3V0IiwiZmlsZURhdGEiLCJwcmV2aWV3IiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsIm1ldGFkYXRhIiwiZXJyIiwiYWJzcGF0aCIsImpvaW4iLCJmaWxlTmFtZSIsIm9wZW5JdGVtIiwiaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbiIsImhhbmRsZUZpbGVJbnN0YW50aWF0aW9uIiwiZmlsZXMiLCJldmVudCIsImVhY2hTZXJpZXMiLCJmaWxlIiwibmV4dCIsInBhdGgiLCJjdXJyZW50QXNzZXRzIiwibWFwIiwiaW5kZXgiLCJvbkRyYWdFbmQiLCJvbkRyYWdTdGFydCIsInVwZGF0ZVRpbWUiLCJoYW5kbGVBc3NldEluc3RhbnRpYXRpb24iLCJ0b3VyQ2hhbm5lbCIsImxhdW5jaEZpbGVwaWNrZXIiLCJlIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsY0FBWTtBQUNWQyxlQUFXLE1BREQ7QUFFVkMsWUFBUTtBQUZFLEdBREM7QUFLYkMsaUJBQWU7QUFDYkMsWUFBUSxTQURLO0FBRWJGLFlBQVEsRUFGSztBQUdiRyxtQkFBZSxXQUhGO0FBSWJDLGFBQVMsTUFKSTtBQUtiQyxnQkFBWSxRQUxDO0FBTWJDLGFBQVMsZ0JBTkk7QUFPYkMsY0FBVSxFQVBHO0FBUWJDLG9CQUFnQjtBQVJILEdBTEY7QUFlYkMscUJBQW1CO0FBQ2pCQyxnQkFBWSxDQURLO0FBRWpCQyxtQkFBZSxDQUZFO0FBR2pCQyxjQUFVLFVBSE87QUFJakJDLGNBQVU7QUFKTyxHQWZOO0FBcUJiQyxpQkFBZTtBQUNiSixnQkFBWSxDQURDO0FBRWJDLG1CQUFlLENBRkY7QUFHYkMsY0FBVSxVQUhHO0FBSWJHLGVBQVcsT0FKRTtBQUtiRixjQUFVO0FB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QUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssT0FBT0gsT0FBT0ksYUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFRTtBQUFBO0FBQUEsY0FBUSxPQUFPSixPQUFPcUIsTUFBdEIsRUFBOEIsU0FBUyxLQUFLd0UsZ0JBQTVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FGRjtBQUdFO0FBQ0Usa0JBQUssTUFEUDtBQUVFLGlCQUFJLFlBRk47QUFHRSwwQkFIRjtBQUlFLHNCQUFVLGtCQUFDQyxDQUFEO0FBQUEscUJBQU8sT0FBS3JELGNBQUwsQ0FBb0IsT0FBS3NELElBQUwsQ0FBVUMsVUFBVixDQUFxQmpCLEtBQXpDLEVBQWdEZSxDQUFoRCxDQUFQO0FBQUEsYUFKWjtBQUtFLG1CQUFPLEVBQUNHLFNBQVMsQ0FBVixFQUFhbEYsVUFBVSxVQUF2QixFQUFtQ21GLE9BQU8sQ0FBMUMsRUFBNkNDLE9BQU8sRUFBcEQsRUFBd0Q3RSxRQUFRLENBQWhFLEVBTFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSEYsU0FERjtBQVdFO0FBQUE7QUFBQSxZQUFLLE9BQU90QixPQUFPQyxVQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsY0FBSyxPQUFPRCxPQUFPaUIsYUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0csaUJBQUtnQyxLQUFMLENBQVdLLFNBQVgsR0FDRyxFQURILEdBRUcsS0FBS2YsVUFBTCxDQUFnQixLQUFLVSxLQUFMLENBQVdFLE1BQTNCO0FBSE47QUFERjtBQVhGLE9BREY7QUFxQkQ7Ozs7RUFwSnlCLGdCQUFNaUQsUzs7a0JBdUpuQixzQkFBTy9ELGFBQVAsQyIsImZpbGUiOiJMaWJyYXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgYXN5bmMgZnJvbSAnYXN5bmMnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuLy4uL1BhbGV0dGUnXG5pbXBvcnQgTGlicmFyeUl0ZW0gZnJvbSAnLi9MaWJyYXJ5SXRlbSdcbmltcG9ydCBDb2xsYXBzZUl0ZW0gZnJvbSAnLi9Db2xsYXBzZUl0ZW0nXG5pbXBvcnQgUmVjdGFuZ2xlUHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1JlY3RhbmdsZSdcbmltcG9ydCBFbGxpcHNlUHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL0VsbGlwc2UnXG5pbXBvcnQgUG9seWdvblByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9Qb2x5Z29uJ1xuaW1wb3J0IFRleHRQcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvVGV4dCdcbmltcG9ydCB7IHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgc2Nyb2xsd3JhcDoge1xuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgIGhlaWdodDogJzEwMCUnXG4gIH0sXG4gIHNlY3Rpb25IZWFkZXI6IHtcbiAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICBoZWlnaHQ6IDI1LFxuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOiAnMThweCAxNHB4IDEwcHgnLFxuICAgIGZvbnRTaXplOiAxNSxcbiAgICBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nXG4gIH0sXG4gIHByaW1pdGl2ZXNXcmFwcGVyOiB7XG4gICAgcGFkZGluZ1RvcDogNixcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICB9LFxuICBhc3NldHNXcmFwcGVyOiB7XG4gICAgcGFkZGluZ1RvcDogNixcbiAgICBwYWRkaW5nQm90dG9tOiA2LFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIG1pbkhlaWdodDogJzMwMHB4JyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgZmlsZURyb3BXcmFwcGVyOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH0sXG4gIGJ1dHRvbjoge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHpJbmRleDogMixcbiAgICBwYWRkaW5nOiAnM3B4IDlweCcsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktFUl9HUkFZLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgZm9udFNpemU6IDEzLFxuICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICBtYXJnaW5Ub3A6IC00LFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAyMDBtcyBlYXNlJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkRBUktFUl9HUkFZKS5kYXJrZW4oMC4yKVxuICAgIH0sXG4gICAgJzphY3RpdmUnOiB7XG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSguOCknXG4gICAgfVxuICB9LFxuICBzdGFydFRleHQ6IHtcbiAgICBjb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIGZvbnRTaXplOiAyNSxcbiAgICBwYWRkaW5nOiAyNCxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGZvbnRTdHlsZTogJ2l0YWxpYydcbiAgfVxufVxuXG5jbGFzcyBMaWJyYXJ5RHJhd2VyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5hc3NldHNMaXN0ID0gdGhpcy5hc3NldHNMaXN0LmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZUZpbGVEcm9wID0gdGhpcy5oYW5kbGVGaWxlRHJvcC5iaW5kKHRoaXMpXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QgPSB0aGlzLnJlbG9hZEFzc2V0TGlzdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5wcmltaXRpdmVzID0ge1xuICAgICAgUmVjdGFuZ2xlOiBSZWN0YW5nbGVQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgRWxsaXBzZTogRWxsaXBzZVByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBQb2x5Z29uOiBQb2x5Z29uUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIFRleHQ6IFRleHRQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpXG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIGFzc2V0czogW10sXG4gICAgICBwcmV2aWV3SW1hZ2VUaW1lOiBudWxsLFxuICAgICAgb3ZlckRyb3BUYXJnZXQ6IGZhbHNlLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIGVtcHR5OiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICB0aGlzLnJlbG9hZEFzc2V0TGlzdCgpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsICh7IG5hbWUsIGFzc2V0cyB9KSA9PiB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2Fzc2V0cy1jaGFuZ2VkJykge1xuICAgICAgICBjb25zdCBlbXB0eSA9IGFzc2V0cy5sZW5ndGggPT09IDBcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cywgZW1wdHkgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmVsb2FkQXNzZXRMaXN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy53ZWJzb2NrZXQucmVxdWVzdCh7IG1ldGhvZDogJ2xpc3RBc3NldHMnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGVycm9yLCBhc3NldHMpID0+IHtcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciB9KVxuICAgICAgY29uc3QgZW1wdHkgPSBhc3NldHMubGVuZ3RoID09PSAwXG4gICAgICB0aGlzLnNldFN0YXRlKHsgYXNzZXRzLCBlbXB0eSB9KVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc0xvYWRpbmc6IGZhbHNlIH0pXG4gICAgICB9LCAxMDAwKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVGaWxlSW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBpZiAoIWZpbGVEYXRhLnByZXZpZXcpIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICd3YXJuaW5nJywgdGl0bGU6ICdPb3BzIScsIG1lc3NhZ2U6ICdGaWxlIHBhdGggd2FzIGJsYW5rOyBjYW5ub3QgaW5zdGFudGlhdGUnIH0pXG4gICAgY29uc3QgbWV0YWRhdGEgPSB7fVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyB0eXBlOiAnYWN0aW9uJywgbWV0aG9kOiAnaW5zdGFudGlhdGVDb21wb25lbnQnLCBwYXJhbXM6IFt0aGlzLnByb3BzLmZvbGRlciwgZmlsZURhdGEucHJldmlldywgbWV0YWRhdGFdIH0sIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY3JlYXRlTm90aWNlKHsgdHlwZTogJ2RhbmdlcicsIHRpdGxlOiBlcnIubmFtZSwgbWVzc2FnZTogZXJyLm1lc3NhZ2UgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBsZXQgYWJzcGF0aCA9IHBhdGguam9pbih0aGlzLnByb3BzLmZvbGRlciwgJ2Rlc2lnbnMnLCBmaWxlRGF0YS5maWxlTmFtZSlcbiAgICBzaGVsbC5vcGVuSXRlbShhYnNwYXRoKVxuICB9XG5cbiAgaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uIChmaWxlRGF0YSkge1xuICAgIHN3aXRjaCAoZmlsZURhdGEudHlwZSkge1xuICAgICAgY2FzZSAnc2tldGNoJzpcbiAgICAgICAgdGhpcy5oYW5kbGVTa2V0Y2hJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAnZmlsZSc6XG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZUluc3RhbnRpYXRpb24oZmlsZURhdGEpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICd3YXJuaW5nJywgdGl0bGU6ICdPb3BzIScsIG1lc3NhZ2U6ICdDb3VsZG5cXCd0IGhhbmRsZSB0aGF0IGZpbGUsIHBsZWFzZSBjb250YWN0IHN1cHBvcnQuJyB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUZpbGVEcm9wIChmaWxlcywgZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IHRydWV9KVxuICAgIHJldHVybiBhc3luYy5lYWNoU2VyaWVzKGZpbGVzLCAoZmlsZSwgbmV4dCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaW5rQXNzZXQnLCBwYXJhbXM6IFtmaWxlLnBhdGgsIHRoaXMucHJvcHMuZm9sZGVyXSB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gbmV4dChlcnJvcilcbiAgICAgICAgcmV0dXJuIG5leHQoKVxuICAgICAgfSlcbiAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogZmFsc2V9KVxuICAgICAgaWYgKGVycm9yKSByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG4gICAgfSlcbiAgfVxuXG4gIGFzc2V0c0xpc3QgKGN1cnJlbnRBc3NldHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgKCFjdXJyZW50QXNzZXRzIHx8IGN1cnJlbnRBc3NldHMubGVuZ3RoIDwgMSlcbiAgICAgID8gKHRoaXMuc3RhdGUuZW1wdHlcbiAgICAgICAgPyA8ZGl2IHN0eWxlPXtTVFlMRVMuc3RhcnRUZXh0fT5JbXBvcnQgYSBTa2V0Y2ggb3IgU1ZHIGZpbGUgdG8gc3RhcnQ8L2Rpdj5cbiAgICAgICAgOiA8ZGl2IC8+KVxuICAgICAgOiA8ZGl2PlxuICAgICAgICB7bG9kYXNoLm1hcChjdXJyZW50QXNzZXRzLCAoZmlsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2BpdGVtLSR7ZmlsZS5maWxlTmFtZX0tJHtpbmRleH1gfT5cbiAgICAgICAgICAgICAge2ZpbGUudHlwZSAhPT0gJ3NrZXRjaCdcbiAgICAgICAgICAgICAgICA/IDxMaWJyYXJ5SXRlbVxuICAgICAgICAgICAgICAgICAga2V5PXtmaWxlLmZpbGVOYW1lfVxuICAgICAgICAgICAgICAgICAgcHJldmlldz17ZmlsZS5wcmV2aWV3fVxuICAgICAgICAgICAgICAgICAgZmlsZU5hbWU9e2ZpbGUuZmlsZU5hbWV9XG4gICAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgICAgICAgICB1cGRhdGVUaW1lPXtmaWxlLnVwZGF0ZVRpbWV9XG4gICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgZmlsZSl9IC8+XG4gICAgICAgICAgICAgICAgOiA8Q29sbGFwc2VJdGVtXG4gICAgICAgICAgICAgICAgICBrZXk9e2ZpbGUuZmlsZU5hbWV9XG4gICAgICAgICAgICAgICAgICBmaWxlPXtmaWxlfVxuICAgICAgICAgICAgICAgICAgZm9sZGVyPXt0aGlzLnByb3BzLmZvbGRlcn1cbiAgICAgICAgICAgICAgICAgIG9uRHJhZ0VuZD17dGhpcy5wcm9wcy5vbkRyYWdFbmR9XG4gICAgICAgICAgICAgICAgICBvbkRyYWdTdGFydD17dGhpcy5wcm9wcy5vbkRyYWdTdGFydH1cbiAgICAgICAgICAgICAgICAgIHdlYnNvY2tldD17dGhpcy5wcm9wcy53ZWJzb2NrZXR9XG4gICAgICAgICAgICAgICAgICBpbnN0YW50aWF0ZT17dGhpcy5oYW5kbGVBc3NldEluc3RhbnRpYXRpb24uYmluZCh0aGlzLCBmaWxlKX1cbiAgICAgICAgICAgICAgICAgIHRvdXJDaGFubmVsPXt0aGlzLnByb3BzLnRvdXJDaGFubmVsfSAvPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcHJvcHNGb3JQcmltaXRpdmUgKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVzW25hbWVdXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdsaWJyYXJ5LXdyYXBwZXInIHN0eWxlPXt7aGVpZ2h0OiAnMTAwJSd9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLnNlY3Rpb25IZWFkZXJ9PlxuICAgICAgICAgIExpYnJhcnlcbiAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnV0dG9ufSBvbkNsaWNrPXt0aGlzLmxhdW5jaEZpbGVwaWNrZXJ9Pis8L2J1dHRvbj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9J2ZpbGUnXG4gICAgICAgICAgICByZWY9J2ZpbGVwaWNrZXInXG4gICAgICAgICAgICBtdWx0aXBsZVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB0aGlzLmhhbmRsZUZpbGVEcm9wKHRoaXMucmVmcy5maWxlcGlja2VyLmZpbGVzLCBlKX1cbiAgICAgICAgICAgIHN0eWxlPXt7b3BhY2l0eTogMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCB3aWR0aDogOTAsIHpJbmRleDogM319IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2Nyb2xsd3JhcH0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmFzc2V0c1dyYXBwZXJ9PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUuaXNMb2FkaW5nXG4gICAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgICAgOiB0aGlzLmFzc2V0c0xpc3QodGhpcy5zdGF0ZS5hc3NldHMpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oTGlicmFyeURyYXdlcilcbiJdfQ==