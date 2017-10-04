'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('/Users/roperzh/Projects/haiku/mono1/packages/haiku-creator/node_modules/babel-preset-react-app/node_modules/babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _jsxFileName = 'src/react/components/AutoUpdater.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _autoUpdate = require('../../utils/autoUpdate');

var _autoUpdate2 = _interopRequireDefault(_autoUpdate);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _dashShared = require('../styles/dashShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  container: {
    fontSize: 16,
    zIndex: 9999999,
    backgroundColor: _Palette2.default.COAL,
    borderRadius: 3,
    padding: 20,
    color: _Palette2.default.ROCK,
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    position: 'fixed',
    display: 'inline-block',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 270
  },
  btn: Object.assign({}, _dashShared.DASH_STYLES.btn, {
    padding: '10px 15px',
    fontSize: 16,
    float: 'right'
  }),
  overlay: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).fade(0.023),
    zIndex: 99999,
    pointerEvents: 'none'
  },
  progressNumber: {
    fontSize: 15,
    margin: '10px 0 0 0'
  },
  progressBar: {
    width: '100%'
  }
};

var statuses = {
  IDLE: 'Idle',
  CHECKING: 'Checking',
  DOWNLOADING: 'Downloading',
  NO_UPDATES: 'NoUpdates',
  DOWNLOAD_FINISHED: 'DownloadFinished',
  DOWNLOAD_FAILED: 'DownloadFailed'
};

var AutoUpdater = function (_React$Component) {
  _inherits(AutoUpdater, _React$Component);

  function AutoUpdater(props) {
    _classCallCheck(this, AutoUpdater);

    var _this = _possibleConstructorReturn(this, (AutoUpdater.__proto__ || Object.getPrototypeOf(AutoUpdater)).call(this, props));

    _this.hide = _this.hide.bind(_this);
    _this.updateProgress = _this.updateProgress.bind(_this);
    _this.isFirstRun = true;

    _this.state = {
      status: statuses.IDLE,
      progress: 0
    };
    return _this;
  }

  _createClass(AutoUpdater, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.shouldDisplay && this.state.status === statuses.IDLE) {
        this.checkForUpdates();
      }
    }
  }, {
    key: 'checkForUpdates',
    value: function () {
      var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee() {
        var _ref2, shouldUpdate, url;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.isFirstRun) {
                  this.setState({ status: statuses.CHECKING });
                }

                _context.prev = 1;
                _context.next = 4;
                return _autoUpdate2.default.checkUpdates();

              case 4:
                _ref2 = _context.sent;
                shouldUpdate = _ref2.shouldUpdate;
                url = _ref2.url;

                shouldUpdate ? this.update(url) : this.dismiss();
                _context.next = 13;
                break;

              case 10:
                _context.prev = 10;
                _context.t0 = _context['catch'](1);

                this.onFail();

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 10]]);
      }));

      function checkForUpdates() {
        return _ref.apply(this, arguments);
      }

      return checkForUpdates;
    }()
  }, {
    key: 'onFail',
    value: function onFail() {
      this.setState({ status: statuses.DOWNLOAD_FAILED });
    }
  }, {
    key: 'dismiss',
    value: function dismiss() {
      if (!this.isFirstRun) {
        this.setState({ status: statuses.NO_UPDATES });
      } else {
        this.hide();
        this.isFirstRun = false;
      }
    }
  }, {
    key: 'update',
    value: function () {
      var _ref3 = _asyncToGenerator(_regenerator2.default.mark(function _callee2(url) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                this.setState({ status: statuses.DOWNLOADING });
                _context2.next = 4;
                return _autoUpdate2.default.update(url, this.updateProgress);

              case 4:
                this.setState({ status: statuses.DOWNLOAD_FINISHED, progress: 0 });
                _context2.next = 10;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](0);

                this.onFail();

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function update(_x) {
        return _ref3.apply(this, arguments);
      }

      return update;
    }()
  }, {
    key: 'updateProgress',
    value: function updateProgress(progress) {
      this.setState({ progress: progress });
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.setState({ status: statuses.IDLE });
      this.props.onAutoUpdateCheckComplete();
    }
  }, {
    key: 'renderDownloading',
    value: function renderDownloading() {
      var progress = this.state.progress.toFixed(1);

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 126
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 127
            },
            __self: this
          },
          'An update is available. Downloading and installing...'
        ),
        _react2.default.createElement(
          'p',
          { style: STYLES.progressNumber, __source: {
              fileName: _jsxFileName,
              lineNumber: 130
            },
            __self: this
          },
          progress,
          ' %'
        ),
        _react2.default.createElement(
          'progress',
          { value: progress, max: '100', style: STYLES.progressBar, __source: {
              fileName: _jsxFileName,
              lineNumber: 131
            },
            __self: this
          },
          progress,
          ' %'
        )
      );
    }
  }, {
    key: 'renderDownloadFinished',
    value: function renderDownloadFinished() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 140
          },
          __self: this
        },
        'Update installed! Loading your Haiku!'
      );
    }
  }, {
    key: 'renderIdle',
    value: function renderIdle() {
      return _react2.default.createElement(
        'span',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 147
          },
          __self: this
        },
        'Checking for updates...'
      );
    }
  }, {
    key: 'renderNoUpdates',
    value: function renderNoUpdates() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 152
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 153
            },
            __self: this
          },
          'You are using the latest version'
        ),
        _react2.default.createElement(
          'button',
          { style: STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 154
            },
            __self: this
          },
          'Ok'
        )
      );
    }
  }, {
    key: 'renderDownloadFailed',
    value: function renderDownloadFailed() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 161
          },
          __self: this
        },
        _react2.default.createElement(
          'p',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 162
            },
            __self: this
          },
          'There was an error downloading the update, if the problem persists, please contact Haiku support.'
        ),
        _react2.default.createElement(
          'button',
          { style: STYLES.btn, onClick: this.hide, __source: {
              fileName: _jsxFileName,
              lineNumber: 164
            },
            __self: this
          },
          'Ok'
        )
      );
    }
  }, {
    key: 'renderChecking',
    value: function renderChecking() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 171
          },
          __self: this
        },
        'Checking for updates...'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var content = this['render' + this.state.status]();

      if (!this.props.shouldDisplay) {
        return null;
      }

      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 185
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          { style: STYLES.container, __source: {
              fileName: _jsxFileName,
              lineNumber: 186
            },
            __self: this
          },
          content
        ),
        _react2.default.createElement('div', { style: STYLES.overlay, __source: {
            fileName: _jsxFileName,
            lineNumber: 189
          },
          __self: this
        })
      );
    }
  }]);

  return AutoUpdater;
}(_react2.default.Component);

exports.default = AutoUpdater;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL0F1dG9VcGRhdGVyLmpzIl0sIm5hbWVzIjpbIlNUWUxFUyIsImNvbnRhaW5lciIsImZvbnRTaXplIiwiekluZGV4IiwiYmFja2dyb3VuZENvbG9yIiwiQ09BTCIsImJvcmRlclJhZGl1cyIsInBhZGRpbmciLCJjb2xvciIsIlJPQ0siLCJib3hTaGFkb3ciLCJwb3NpdGlvbiIsImRpc3BsYXkiLCJ0b3AiLCJsZWZ0IiwidHJhbnNmb3JtIiwibWF4V2lkdGgiLCJidG4iLCJmbG9hdCIsIm92ZXJsYXkiLCJ3aWR0aCIsImhlaWdodCIsIkdSQVkiLCJmYWRlIiwicG9pbnRlckV2ZW50cyIsInByb2dyZXNzTnVtYmVyIiwibWFyZ2luIiwicHJvZ3Jlc3NCYXIiLCJzdGF0dXNlcyIsIklETEUiLCJDSEVDS0lORyIsIkRPV05MT0FESU5HIiwiTk9fVVBEQVRFUyIsIkRPV05MT0FEX0ZJTklTSEVEIiwiRE9XTkxPQURfRkFJTEVEIiwiQXV0b1VwZGF0ZXIiLCJwcm9wcyIsImhpZGUiLCJiaW5kIiwidXBkYXRlUHJvZ3Jlc3MiLCJpc0ZpcnN0UnVuIiwic3RhdGUiLCJzdGF0dXMiLCJwcm9ncmVzcyIsIm5leHRQcm9wcyIsInNob3VsZERpc3BsYXkiLCJjaGVja0ZvclVwZGF0ZXMiLCJzZXRTdGF0ZSIsImNoZWNrVXBkYXRlcyIsInNob3VsZFVwZGF0ZSIsInVybCIsInVwZGF0ZSIsImRpc21pc3MiLCJvbkZhaWwiLCJvbkF1dG9VcGRhdGVDaGVja0NvbXBsZXRlIiwidG9GaXhlZCIsImNvbnRlbnQiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsU0FBUztBQUNiQyxhQUFXO0FBQ1RDLGNBQVUsRUFERDtBQUVUQyxZQUFRLE9BRkM7QUFHVEMscUJBQWlCLGtCQUFRQyxJQUhoQjtBQUlU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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUZGLE9BREY7QUFNRDs7OzJDQUV1QjtBQUN0QixhQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FERjtBQUdFO0FBQUE7QUFBQSxZQUFRLE9BQU9yQyxPQUFPaUIsR0FBdEIsRUFBMkIsU0FBUyxLQUFLb0IsSUFBekM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUhGLE9BREY7QUFPRDs7O3FDQUVpQjtBQUNoQixhQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FERjtBQUtEOzs7NkJBRVM7QUFDUixVQUFJbUIsVUFBVSxnQkFBYyxLQUFLZixLQUFMLENBQVdDLE1BQXpCLEdBQWQ7O0FBRUEsVUFBSSxDQUFDLEtBQUtOLEtBQUwsQ0FBV1MsYUFBaEIsRUFBK0I7QUFDN0IsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxPQUFPN0MsT0FBT0MsU0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0d1RDtBQURILFNBREY7QUFJRSwrQ0FBSyxPQUFPeEQsT0FBT21CLE9BQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpGLE9BREY7QUFRRDs7OztFQXZJdUIsZ0JBQU1zQyxTOztrQkEwSWpCdEIsVyIsImZpbGUiOiJBdXRvVXBkYXRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBhdXRvVXBkYXRlIGZyb20gJy4uLy4uL3V0aWxzL2F1dG9VcGRhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgeyBEQVNIX1NUWUxFUyB9IGZyb20gJy4uL3N0eWxlcy9kYXNoU2hhcmVkJ1xuXG5jb25zdCBTVFlMRVMgPSB7XG4gIGNvbnRhaW5lcjoge1xuICAgIGZvbnRTaXplOiAxNixcbiAgICB6SW5kZXg6IDk5OTk5OTksXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIHBhZGRpbmc6IDIwLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYm94U2hhZG93OiAnMCA0cHggMThweCAwIHJnYmEoMSwyOCwzMywwLjM4KScsXG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgdG9wOiAnNTAlJyxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknLFxuICAgIG1heFdpZHRoOiAyNzBcbiAgfSxcbiAgYnRuOiB7XG4gICAgLi4uREFTSF9TVFlMRVMuYnRuLFxuICAgIHBhZGRpbmc6ICcxMHB4IDE1cHgnLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICBmbG9hdDogJ3JpZ2h0J1xuICB9LFxuICBvdmVybGF5OiB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjAyMyksXG4gICAgekluZGV4OiA5OTk5OSxcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgfSxcbiAgcHJvZ3Jlc3NOdW1iZXI6IHtcbiAgICBmb250U2l6ZTogMTUsXG4gICAgbWFyZ2luOiAnMTBweCAwIDAgMCdcbiAgfSxcbiAgcHJvZ3Jlc3NCYXI6IHtcbiAgICB3aWR0aDogJzEwMCUnXG4gIH1cbn1cblxubGV0IHN0YXR1c2VzID0ge1xuICBJRExFOiAnSWRsZScsXG4gIENIRUNLSU5HOiAnQ2hlY2tpbmcnLFxuICBET1dOTE9BRElORzogJ0Rvd25sb2FkaW5nJyxcbiAgTk9fVVBEQVRFUzogJ05vVXBkYXRlcycsXG4gIERPV05MT0FEX0ZJTklTSEVEOiAnRG93bmxvYWRGaW5pc2hlZCcsXG4gIERPV05MT0FEX0ZBSUxFRDogJ0Rvd25sb2FkRmFpbGVkJ1xufVxuXG5jbGFzcyBBdXRvVXBkYXRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcylcbiAgICB0aGlzLnVwZGF0ZVByb2dyZXNzID0gdGhpcy51cGRhdGVQcm9ncmVzcy5iaW5kKHRoaXMpXG4gICAgdGhpcy5pc0ZpcnN0UnVuID0gdHJ1ZVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHN0YXR1czogc3RhdHVzZXMuSURMRSxcbiAgICAgIHByb2dyZXNzOiAwXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyAobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5zaG91bGREaXNwbGF5ICYmIHRoaXMuc3RhdGUuc3RhdHVzID09PSBzdGF0dXNlcy5JRExFKSB7XG4gICAgICB0aGlzLmNoZWNrRm9yVXBkYXRlcygpXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY2hlY2tGb3JVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuaXNGaXJzdFJ1bikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5DSEVDS0lOR30pXG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHtzaG91bGRVcGRhdGUsIHVybH0gPSBhd2FpdCBhdXRvVXBkYXRlLmNoZWNrVXBkYXRlcygpXG4gICAgICBzaG91bGRVcGRhdGUgPyB0aGlzLnVwZGF0ZSh1cmwpIDogdGhpcy5kaXNtaXNzKClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLm9uRmFpbCgpXG4gICAgfVxuICB9XG5cbiAgb25GYWlsICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FEX0ZBSUxFRH0pXG4gIH1cblxuICBkaXNtaXNzICgpIHtcbiAgICBpZiAoIXRoaXMuaXNGaXJzdFJ1bikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5OT19VUERBVEVTfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICAgIHRoaXMuaXNGaXJzdFJ1biA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdXBkYXRlICh1cmwpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7c3RhdHVzOiBzdGF0dXNlcy5ET1dOTE9BRElOR30pXG4gICAgICBhd2FpdCBhdXRvVXBkYXRlLnVwZGF0ZSh1cmwsIHRoaXMudXBkYXRlUHJvZ3Jlc3MpXG4gICAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLkRPV05MT0FEX0ZJTklTSEVELCBwcm9ncmVzczogMH0pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLm9uRmFpbCgpXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlUHJvZ3Jlc3MgKHByb2dyZXNzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHByb2dyZXNzIH0pXG4gIH1cblxuICBoaWRlICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzdGF0dXM6IHN0YXR1c2VzLklETEV9KVxuICAgIHRoaXMucHJvcHMub25BdXRvVXBkYXRlQ2hlY2tDb21wbGV0ZSgpXG4gIH1cblxuICByZW5kZXJEb3dubG9hZGluZyAoKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3MgPSB0aGlzLnN0YXRlLnByb2dyZXNzLnRvRml4ZWQoMSlcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICBBbiB1cGRhdGUgaXMgYXZhaWxhYmxlLiBEb3dubG9hZGluZyBhbmQgaW5zdGFsbGluZy4uLlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxwIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NOdW1iZXJ9Pntwcm9ncmVzc30gJTwvcD5cbiAgICAgICAgPHByb2dyZXNzIHZhbHVlPXtwcm9ncmVzc30gbWF4PScxMDAnIHN0eWxlPXtTVFlMRVMucHJvZ3Jlc3NCYXJ9PlxuICAgICAgICAgIHtwcm9ncmVzc30gJVxuICAgICAgICA8L3Byb2dyZXNzPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRG93bmxvYWRGaW5pc2hlZCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIFVwZGF0ZSBpbnN0YWxsZWQhIExvYWRpbmcgeW91ciBIYWlrdSFcbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlcklkbGUgKCkge1xuICAgIHJldHVybiA8c3Bhbj5DaGVja2luZyBmb3IgdXBkYXRlcy4uLjwvc3Bhbj5cbiAgfVxuXG4gIHJlbmRlck5vVXBkYXRlcyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPllvdSBhcmUgdXNpbmcgdGhlIGxhdGVzdCB2ZXJzaW9uPC9wPlxuICAgICAgICA8YnV0dG9uIHN0eWxlPXtTVFlMRVMuYnRufSBvbkNsaWNrPXt0aGlzLmhpZGV9Pk9rPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJEb3dubG9hZEZhaWxlZCAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxwPlRoZXJlIHdhcyBhbiBlcnJvciBkb3dubG9hZGluZyB0aGUgdXBkYXRlLCBpZiB0aGUgcHJvYmxlbSBwZXJzaXN0cyxcbiAgICAgICAgcGxlYXNlIGNvbnRhY3QgSGFpa3Ugc3VwcG9ydC48L3A+XG4gICAgICAgIDxidXR0b24gc3R5bGU9e1NUWUxFUy5idG59IG9uQ2xpY2s9e3RoaXMuaGlkZX0+T2s8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNoZWNraW5nICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgQ2hlY2tpbmcgZm9yIHVwZGF0ZXMuLi5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzW2ByZW5kZXIke3RoaXMuc3RhdGUuc3RhdHVzfWBdKClcblxuICAgIGlmICghdGhpcy5wcm9wcy5zaG91bGREaXNwbGF5KSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuY29udGFpbmVyfT5cbiAgICAgICAgICB7Y29udGVudH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5vdmVybGF5fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEF1dG9VcGRhdGVyXG4iXX0=