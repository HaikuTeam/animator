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
            lineNumber: 166
          },
          __self: this
        },
        'Import a Sketch or SVG file to start'
      ) : _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 167
        },
        __self: this
      }) : _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 168
          },
          __self: this
        },
        _lodash2.default.map(currentAssets, function (file, index) {
          return _react2.default.createElement(
            'div',
            { key: 'item-' + file.fileName + '-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 171
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
                lineNumber: 173
              },
              __self: _this6
            }) : _react2.default.createElement(_CollapseItem2.default, {
              key: file.fileName,
              file: file,
              folder: _this6.props.folder,
              onDragEnd: _this6.props.onDragEnd,
              onDragStart: _this6.props.onDragStart,
              websocket: _this6.props.websocket,
              instantiate: _this6.handleAssetInstantiation.bind(_this6, file), __source: {
                fileName: _jsxFileName,
                lineNumber: 182
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL2xpYnJhcnkvTGlicmFyeS5qcyJdLCJuYW1lcyI6WyJTVFlMRVMiLCJzY3JvbGx3cmFwIiwib3ZlcmZsb3dZIiwiaGVpZ2h0Iiwic2VjdGlvbkhlYWRlciIsImN1cnNvciIsInRleHRUcmFuc2Zvcm0iLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsInBhZGRpbmciLCJmb250U2l6ZSIsImp1c3RpZnlDb250ZW50IiwicHJpbWl0aXZlc1dyYXBwZXIiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJhc3NldHNXcmFwcGVyIiwibWluSGVpZ2h0IiwiZmlsZURyb3BXcmFwcGVyIiwicG9pbnRlckV2ZW50cyIsImJ1dHRvbiIsInpJbmRleCIsImJhY2tncm91bmRDb2xvciIsIkRBUktFUl9HUkFZIiwiY29sb3IiLCJST0NLIiwiZm9udFdlaWdodCIsIm1hcmdpblRvcCIsImJvcmRlclJhZGl1cyIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJkYXJrZW4iLCJzdGFydFRleHQiLCJDT0FMIiwidGV4dEFsaWduIiwiZm9udFN0eWxlIiwiTGlicmFyeURyYXdlciIsInByb3BzIiwiYXNzZXRzTGlzdCIsImJpbmQiLCJoYW5kbGVGaWxlRHJvcCIsInJlbG9hZEFzc2V0TGlzdCIsInByaW1pdGl2ZXMiLCJSZWN0YW5nbGUiLCJ3ZWJzb2NrZXQiLCJFbGxpcHNlIiwiUG9seWdvbiIsIlRleHQiLCJzdGF0ZSIsImVycm9yIiwiYXNzZXRzIiwicHJldmlld0ltYWdlVGltZSIsIm92ZXJEcm9wVGFyZ2V0IiwiaXNMb2FkaW5nIiwiZW1wdHkiLCJzZXRTdGF0ZSIsIm9uIiwibmFtZSIsImxlbmd0aCIsInJlcXVlc3QiLCJtZXRob2QiLCJwYXJhbXMiLCJmb2xkZXIiLCJzZXRUaW1lb3V0IiwiZmlsZURhdGEiLCJwcmV2aWV3IiwiY3JlYXRlTm90aWNlIiwidHlwZSIsInRpdGxlIiwibWVzc2FnZSIsIm1ldGFkYXRhIiwiZXJyIiwiYWJzcGF0aCIsImpvaW4iLCJmaWxlTmFtZSIsIm9wZW5JdGVtIiwiaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbiIsInRvdXJDaGFubmVsIiwibmV4dCIsImhhbmRsZUZpbGVJbnN0YW50aWF0aW9uIiwiZmlsZXMiLCJldmVudCIsImVhY2hTZXJpZXMiLCJmaWxlIiwicGF0aCIsImN1cnJlbnRBc3NldHMiLCJtYXAiLCJpbmRleCIsIm9uRHJhZ0VuZCIsIm9uRHJhZ1N0YXJ0IiwidXBkYXRlVGltZSIsImhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiIsImxhdW5jaEZpbGVwaWNrZXIiLCJlIiwicmVmcyIsImZpbGVwaWNrZXIiLCJvcGFjaXR5IiwicmlnaHQiLCJ3aWR0aCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFNBQVM7QUFDYkMsY0FBWTtBQUNWQyxlQUFXLE1BREQ7QUFFVkMsWUFBUTtBQUZFLEdBREM7QUFLYkMsaUJBQWU7QUFDYkMsWUFBUSxTQURLO0FBRWJGLFlBQVEsRUFGSztBQUdiRyxtQkFBZSxXQUhGO0FBSWJDLGFBQVMsTUFKSTtBQUtiQyxnQkFBWSxRQUxDO0FBTWJDLGFBQVMsZ0JBTkk7QUFPYkMsY0FBVSxFQVBHO0FBUWJDLG9CQUFnQjtBQVJILEdBTEY7QUFlYkMscUJBQW1CO0FBQ2pCQyxnQkFBWSxDQURLO0FBRWpCQyxtQkFBZSxDQUZFO0FBR2pCQyxjQUFVLFVBSE87QUFJakJDLGNBQVU7QUFKTyxHQWZOO0FBcUJiQyxpQkFBZTtBQUNiSixnQkFBWSxDQURDO0FBRWJDLG1CQUFlLENBRkY7QUFHYkMsY0FBVSxVQUhHO0FBSWJHLGVBQVcsT0FKRTtBQUtiRixjQUFVO0FB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QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxPQUFPSCxPQUFPSSxhQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVFO0FBQUE7QUFBQSxjQUFRLE9BQU9KLE9BQU9xQixNQUF0QixFQUE4QixTQUFTLEtBQUt3RSxnQkFBNUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUZGO0FBR0U7QUFDRSxrQkFBSyxNQURQO0FBRUUsaUJBQUksWUFGTjtBQUdFLDBCQUhGO0FBSUUsc0JBQVUsa0JBQUNDLENBQUQ7QUFBQSxxQkFBTyxPQUFLckQsY0FBTCxDQUFvQixPQUFLc0QsSUFBTCxDQUFVQyxVQUFWLENBQXFCZixLQUF6QyxFQUFnRGEsQ0FBaEQsQ0FBUDtBQUFBLGFBSlo7QUFLRSxtQkFBTyxFQUFDRyxTQUFTLENBQVYsRUFBYWxGLFVBQVUsVUFBdkIsRUFBbUNtRixPQUFPLENBQTFDLEVBQTZDQyxPQUFPLEVBQXBELEVBQXdEN0UsUUFBUSxDQUFoRSxFQUxUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLFNBREY7QUFXRTtBQUFBO0FBQUEsWUFBSyxPQUFPdEIsT0FBT0MsVUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGNBQUssT0FBT0QsT0FBT2lCLGFBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGlCQUFLZ0MsS0FBTCxDQUFXSyxTQUFYLEdBQ0csRUFESCxHQUVHLEtBQUtmLFVBQUwsQ0FBZ0IsS0FBS1UsS0FBTCxDQUFXRSxNQUEzQjtBQUhOO0FBREY7QUFYRixPQURGO0FBcUJEOzs7O0VBcEp5QixnQkFBTWlELFM7O2tCQXVKbkIsc0JBQU8vRCxhQUFQLEMiLCJmaWxlIjoiTGlicmFyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFzeW5jIGZyb20gJ2FzeW5jJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi8uLi9QYWxldHRlJ1xuaW1wb3J0IExpYnJhcnlJdGVtIGZyb20gJy4vTGlicmFyeUl0ZW0nXG5pbXBvcnQgQ29sbGFwc2VJdGVtIGZyb20gJy4vQ29sbGFwc2VJdGVtJ1xuaW1wb3J0IFJlY3RhbmdsZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9SZWN0YW5nbGUnXG5pbXBvcnQgRWxsaXBzZVByaW1pdGl2ZVByb3BzIGZyb20gJy4vLi4vLi4vcHJpbWl0aXZlcy9FbGxpcHNlJ1xuaW1wb3J0IFBvbHlnb25QcmltaXRpdmVQcm9wcyBmcm9tICcuLy4uLy4uL3ByaW1pdGl2ZXMvUG9seWdvbidcbmltcG9ydCBUZXh0UHJpbWl0aXZlUHJvcHMgZnJvbSAnLi8uLi8uLi9wcmltaXRpdmVzL1RleHQnXG5pbXBvcnQgeyBzaGVsbCB9IGZyb20gJ2VsZWN0cm9uJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIHNjcm9sbHdyYXA6IHtcbiAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBzZWN0aW9uSGVhZGVyOiB7XG4gICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgaGVpZ2h0OiAyNSxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgcGFkZGluZzogJzE4cHggMTRweCAxMHB4JyxcbiAgICBmb250U2l6ZTogMTUsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJ1xuICB9LFxuICBwcmltaXRpdmVzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgfSxcbiAgYXNzZXRzV3JhcHBlcjoge1xuICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgcGFkZGluZ0JvdHRvbTogNixcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBtaW5IZWlnaHQ6ICczMDBweCcsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gIH0sXG4gIGZpbGVEcm9wV3JhcHBlcjoge1xuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICB9LFxuICBidXR0b246IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICB6SW5kZXg6IDIsXG4gICAgcGFkZGluZzogJzNweCA5cHgnLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgbWFyZ2luVG9wOiAtNCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5EQVJLRVJfR1JBWSkuZGFya2VuKDAuMilcbiAgICB9LFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgc3RhcnRUZXh0OiB7XG4gICAgY29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBmb250U2l6ZTogMjUsXG4gICAgcGFkZGluZzogMjQsXG4gICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICBmb250U3R5bGU6ICdpdGFsaWMnXG4gIH1cbn1cblxuY2xhc3MgTGlicmFyeURyYXdlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuYXNzZXRzTGlzdCA9IHRoaXMuYXNzZXRzTGlzdC5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVGaWxlRHJvcCA9IHRoaXMuaGFuZGxlRmlsZURyb3AuYmluZCh0aGlzKVxuICAgIHRoaXMucmVsb2FkQXNzZXRMaXN0ID0gdGhpcy5yZWxvYWRBc3NldExpc3QuYmluZCh0aGlzKVxuICAgIHRoaXMucHJpbWl0aXZlcyA9IHtcbiAgICAgIFJlY3RhbmdsZTogUmVjdGFuZ2xlUHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KSxcbiAgICAgIEVsbGlwc2U6IEVsbGlwc2VQcmltaXRpdmVQcm9wcyhwcm9wcy53ZWJzb2NrZXQpLFxuICAgICAgUG9seWdvbjogUG9seWdvblByaW1pdGl2ZVByb3BzKHByb3BzLndlYnNvY2tldCksXG4gICAgICBUZXh0OiBUZXh0UHJpbWl0aXZlUHJvcHMocHJvcHMud2Vic29ja2V0KVxuICAgIH1cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBhc3NldHM6IFtdLFxuICAgICAgcHJldmlld0ltYWdlVGltZTogbnVsbCxcbiAgICAgIG92ZXJEcm9wVGFyZ2V0OiBmYWxzZSxcbiAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICBlbXB0eTogZmFsc2VcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2lzTG9hZGluZzogdHJ1ZX0pXG4gICAgdGhpcy5yZWxvYWRBc3NldExpc3QoKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAoeyBuYW1lLCBhc3NldHMgfSkgPT4ge1xuICAgICAgaWYgKG5hbWUgPT09ICdhc3NldHMtY2hhbmdlZCcpIHtcbiAgICAgICAgY29uc3QgZW1wdHkgPSBhc3NldHMubGVuZ3RoID09PSAwXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhc3NldHMsIGVtcHR5IH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJlbG9hZEFzc2V0TGlzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMud2Vic29ja2V0LnJlcXVlc3QoeyBtZXRob2Q6ICdsaXN0QXNzZXRzJywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXJdIH0sIChlcnJvciwgYXNzZXRzKSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHJldHVybiB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICAgIGNvbnN0IGVtcHR5ID0gYXNzZXRzLmxlbmd0aCA9PT0gMFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFzc2V0cywgZW1wdHkgfSlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNMb2FkaW5nOiBmYWxzZSB9KVxuICAgICAgfSwgMTAwMClcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlRmlsZUluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgaWYgKCFmaWxlRGF0YS5wcmV2aWV3KSByZXR1cm4gdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnRmlsZSBwYXRoIHdhcyBibGFuazsgY2Fubm90IGluc3RhbnRpYXRlJyB9KVxuICAgIGNvbnN0IG1ldGFkYXRhID0ge31cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgdHlwZTogJ2FjdGlvbicsIG1ldGhvZDogJ2luc3RhbnRpYXRlQ29tcG9uZW50JywgcGFyYW1zOiBbdGhpcy5wcm9wcy5mb2xkZXIsIGZpbGVEYXRhLnByZXZpZXcsIG1ldGFkYXRhXSB9LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNyZWF0ZU5vdGljZSh7IHR5cGU6ICdkYW5nZXInLCB0aXRsZTogZXJyLm5hbWUsIG1lc3NhZ2U6IGVyci5tZXNzYWdlIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVNrZXRjaEluc3RhbnRpYXRpb24gKGZpbGVEYXRhKSB7XG4gICAgbGV0IGFic3BhdGggPSBwYXRoLmpvaW4odGhpcy5wcm9wcy5mb2xkZXIsICdkZXNpZ25zJywgZmlsZURhdGEuZmlsZU5hbWUpXG4gICAgc2hlbGwub3Blbkl0ZW0oYWJzcGF0aClcbiAgfVxuXG4gIGhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbiAoZmlsZURhdGEpIHtcbiAgICBzd2l0Y2ggKGZpbGVEYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3NrZXRjaCc6XG4gICAgICAgIHRoaXMuaGFuZGxlU2tldGNoSW5zdGFudGlhdGlvbihmaWxlRGF0YSlcbiAgICAgICAgdGhpcy5wcm9wcy50b3VyQ2hhbm5lbC5uZXh0KClcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVJbnN0YW50aWF0aW9uKGZpbGVEYXRhKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5wcm9wcy5jcmVhdGVOb3RpY2UoeyB0eXBlOiAnd2FybmluZycsIHRpdGxlOiAnT29wcyEnLCBtZXNzYWdlOiAnQ291bGRuXFwndCBoYW5kbGUgdGhhdCBmaWxlLCBwbGVhc2UgY29udGFjdCBzdXBwb3J0LicgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVGaWxlRHJvcCAoZmlsZXMsIGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7aXNMb2FkaW5nOiB0cnVlfSlcbiAgICByZXR1cm4gYXN5bmMuZWFjaFNlcmllcyhmaWxlcywgKGZpbGUsIG5leHQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLndlYnNvY2tldC5yZXF1ZXN0KHsgbWV0aG9kOiAnbGlua0Fzc2V0JywgcGFyYW1zOiBbZmlsZS5wYXRoLCB0aGlzLnByb3BzLmZvbGRlcl0gfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikgcmV0dXJuIG5leHQoZXJyb3IpXG4gICAgICAgIHJldHVybiBuZXh0KClcbiAgICAgIH0pXG4gICAgfSwgKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc0xvYWRpbmc6IGZhbHNlfSlcbiAgICAgIGlmIChlcnJvcikgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyBlcnJvciB9KVxuICAgIH0pXG4gIH1cblxuICBhc3NldHNMaXN0IChjdXJyZW50QXNzZXRzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICghY3VycmVudEFzc2V0cyB8fCBjdXJyZW50QXNzZXRzLmxlbmd0aCA8IDEpXG4gICAgICA/ICh0aGlzLnN0YXRlLmVtcHR5XG4gICAgICAgID8gPGRpdiBzdHlsZT17U1RZTEVTLnN0YXJ0VGV4dH0+SW1wb3J0IGEgU2tldGNoIG9yIFNWRyBmaWxlIHRvIHN0YXJ0PC9kaXY+XG4gICAgICAgIDogPGRpdiAvPilcbiAgICAgIDogPGRpdj5cbiAgICAgICAge2xvZGFzaC5tYXAoY3VycmVudEFzc2V0cywgKGZpbGUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYga2V5PXtgaXRlbS0ke2ZpbGUuZmlsZU5hbWV9LSR7aW5kZXh9YH0+XG4gICAgICAgICAgICAgIHtmaWxlLnR5cGUgIT09ICdza2V0Y2gnXG4gICAgICAgICAgICAgICAgPyA8TGlicmFyeUl0ZW1cbiAgICAgICAgICAgICAgICAgIGtleT17ZmlsZS5maWxlTmFtZX1cbiAgICAgICAgICAgICAgICAgIHByZXZpZXc9e2ZpbGUucHJldmlld31cbiAgICAgICAgICAgICAgICAgIGZpbGVOYW1lPXtmaWxlLmZpbGVOYW1lfVxuICAgICAgICAgICAgICAgICAgb25EcmFnRW5kPXt0aGlzLnByb3BzLm9uRHJhZ0VuZH1cbiAgICAgICAgICAgICAgICAgIG9uRHJhZ1N0YXJ0PXt0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0fVxuICAgICAgICAgICAgICAgICAgdXBkYXRlVGltZT17ZmlsZS51cGRhdGVUaW1lfVxuICAgICAgICAgICAgICAgICAgd2Vic29ja2V0PXt0aGlzLnByb3BzLndlYnNvY2tldH1cbiAgICAgICAgICAgICAgICAgIGluc3RhbnRpYXRlPXt0aGlzLmhhbmRsZUFzc2V0SW5zdGFudGlhdGlvbi5iaW5kKHRoaXMsIGZpbGUpfSAvPlxuICAgICAgICAgICAgICAgIDogPENvbGxhcHNlSXRlbVxuICAgICAgICAgICAgICAgICAga2V5PXtmaWxlLmZpbGVOYW1lfVxuICAgICAgICAgICAgICAgICAgZmlsZT17ZmlsZX1cbiAgICAgICAgICAgICAgICAgIGZvbGRlcj17dGhpcy5wcm9wcy5mb2xkZXJ9XG4gICAgICAgICAgICAgICAgICBvbkRyYWdFbmQ9e3RoaXMucHJvcHMub25EcmFnRW5kfVxuICAgICAgICAgICAgICAgICAgb25EcmFnU3RhcnQ9e3RoaXMucHJvcHMub25EcmFnU3RhcnR9XG4gICAgICAgICAgICAgICAgICB3ZWJzb2NrZXQ9e3RoaXMucHJvcHMud2Vic29ja2V0fVxuICAgICAgICAgICAgICAgICAgaW5zdGFudGlhdGU9e3RoaXMuaGFuZGxlQXNzZXRJbnN0YW50aWF0aW9uLmJpbmQodGhpcywgZmlsZSl9IC8+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBwcm9wc0ZvclByaW1pdGl2ZSAobmFtZSkge1xuICAgIHJldHVybiB0aGlzLnByaW1pdGl2ZXNbbmFtZV1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2xpYnJhcnktd3JhcHBlcicgc3R5bGU9e3toZWlnaHQ6ICcxMDAlJ319PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuc2VjdGlvbkhlYWRlcn0+XG4gICAgICAgICAgTGlicmFyeVxuICAgICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idXR0b259IG9uQ2xpY2s9e3RoaXMubGF1bmNoRmlsZXBpY2tlcn0+KzwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT0nZmlsZSdcbiAgICAgICAgICAgIHJlZj0nZmlsZXBpY2tlcidcbiAgICAgICAgICAgIG11bHRpcGxlXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHRoaXMuaGFuZGxlRmlsZURyb3AodGhpcy5yZWZzLmZpbGVwaWNrZXIuZmlsZXMsIGUpfVxuICAgICAgICAgICAgc3R5bGU9e3tvcGFjaXR5OiAwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IDAsIHdpZHRoOiA5MCwgekluZGV4OiAzfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5zY3JvbGx3cmFwfT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuYXNzZXRzV3JhcHBlcn0+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS5pc0xvYWRpbmdcbiAgICAgICAgICAgICAgPyAnJ1xuICAgICAgICAgICAgICA6IHRoaXMuYXNzZXRzTGlzdCh0aGlzLnN0YXRlLmFzc2V0cyl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShMaWJyYXJ5RHJhd2VyKVxuIl19