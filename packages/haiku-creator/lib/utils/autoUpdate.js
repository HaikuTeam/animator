'use strict';

var _regenerator = require('/Users/roperzh/Projects/haiku/mono1/packages/haiku-creator/node_modules/babel-preset-react-app/node_modules/babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var qs = require('qs');
var os = require('os');
var electron = require('electron');
var fetch = require('node-fetch');

var _require = require('./fileManipulation'),
    download = _require.download,
    unzip = _require.unzip;

var opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: 'staging',
  branch: 'master',
  platform: 'mac',
  version: '2.3.6'

  // const opts = {
  //   server: process.env.HAIKU_AUTOUPDATE_SERVER,
  //   environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
  //   branch: process.env.HAIKU_RELEASE_BRANCH,
  //   platform: process.env.HAIKU_RELEASE_PLATFORM,
  //   version: process.env.HAIKU_RELEASE_VERSION
  // }

};module.exports = {
  update: function () {
    var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee2(url, progressCallback) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : opts;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', new Promise(function () {
                var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee(resolve, reject) {
                  var tempPath, zipPath, installationPath;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!(process.env.HAIKU_SKIP_AUTOUPDATE !== '1')) {
                            _context.next = 14;
                            break;
                          }

                          if (!(!options.server || !options.environment || !options.branch || !options.platform || !options.version)) {
                            _context.next = 4;
                            break;
                          }

                          throw new Error('Missing release/autoupdate environment variables');

                        case 4:
                          tempPath = os.tmpdir();
                          zipPath = tempPath + '/haiku.zip';
                          installationPath = '/Applications';
                          _context.next = 9;
                          return download(url, zipPath, progressCallback);

                        case 9:
                          _context.next = 11;
                          return unzip(zipPath, installationPath);

                        case 11:
                          resolve(true);
                          electron.remote.app.relaunch();
                          electron.remote.app.exit();

                        case 14:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x4, _x5) {
                  return _ref2.apply(this, arguments);
                };
              }()));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function update(_x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return update;
  }(),
  checkUpdates: function () {
    var _ref3 = _asyncToGenerator(_regenerator2.default.mark(function _callee3() {
      var _ref4, status, url;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.checkServer();

            case 2:
              _ref4 = _context3.sent;
              status = _ref4.status;
              url = _ref4.url;

              if (!(status === 200 && url)) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt('return', { shouldUpdate: true, url: url });

            case 7:
              return _context3.abrupt('return', { shouldUpdate: false, url: null });

            case 8:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function checkUpdates() {
      return _ref3.apply(this, arguments);
    }

    return checkUpdates;
  }(),
  checkServer: function () {
    var _ref5 = _asyncToGenerator(_regenerator2.default.mark(function _callee4() {
      var response, data;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return fetch(this.generateURL(opts));

            case 2:
              response = _context4.sent;
              _context4.next = 5;
              return response.json();

            case 5:
              data = _context4.sent;
              return _context4.abrupt('return', { status: response.status, url: data.url });

            case 7:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function checkServer() {
      return _ref5.apply(this, arguments);
    }

    return checkServer;
  }(),
  generateURL: function generateURL(_ref6) {
    var server = _ref6.server,
        query = _objectWithoutProperties(_ref6, ['server']);

    var queryString = qs.stringify(query);

    return server + '/updates/latest?' + queryString;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hdXRvVXBkYXRlLmpzIl0sIm5hbWVzIjpbInFzIiwicmVxdWlyZSIsIm9zIiwiZWxlY3Ryb24iLCJmZXRjaCIsImRvd25sb2FkIiwidW56aXAiLCJvcHRzIiwic2VydmVyIiwicHJvY2VzcyIsImVudiIsIkhBSUtVX0FVVE9VUERBVEVfU0VSVkVSIiwiZW52aXJvbm1lbnQiLCJicmFuY2giLCJwbGF0Zm9ybSIsInZlcnNpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwidXBkYXRlIiwidXJsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkhBSUtVX1NLSVBfQVVUT1VQREFURSIsIkVycm9yIiwidGVtcFBhdGgiLCJ0bXBkaXIiLCJ6aXBQYXRoIiwiaW5zdGFsbGF0aW9uUGF0aCIsInJlbW90ZSIsImFwcCIsInJlbGF1bmNoIiwiZXhpdCIsImNoZWNrVXBkYXRlcyIsImNoZWNrU2VydmVyIiwic3RhdHVzIiwic2hvdWxkVXBkYXRlIiwiZ2VuZXJhdGVVUkwiLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwicXVlcnkiLCJxdWVyeVN0cmluZyIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLFdBQVdGLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU1HLFFBQVFILFFBQVEsWUFBUixDQUFkOztlQUMwQkEsUUFBUSxvQkFBUixDO0lBQW5CSSxRLFlBQUFBLFE7SUFBVUMsSyxZQUFBQSxLOztBQUVqQixJQUFNQyxPQUFPO0FBQ1hDLFVBQVFDLFFBQVFDLEdBQVIsQ0FBWUMsdUJBRFQ7QUFFWEMsZUFBYSxTQUZGO0FBR1hDLFVBQVEsUUFIRztBQUlYQyxZQUFVLEtBSkM7QUFLWEMsV0FBUzs7QUFJWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFmYSxDQUFiLENBaUJBQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ1RDLFFBRFM7QUFBQSw4RUFDREMsR0FEQyxFQUNJQyxnQkFESjtBQUFBOztBQUFBLFVBQ3NCQyxPQUR0Qix1RUFDZ0NkLElBRGhDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxnREFFTixJQUFJZSxPQUFKO0FBQUEseUVBQVksaUJBQU9DLE9BQVAsRUFBZ0JDLE1BQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdDQUNiZixRQUFRQyxHQUFSLENBQVllLHFCQUFaLEtBQXNDLEdBRHpCO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdDQUdiLENBQUNKLFFBQVFiLE1BQVQsSUFDQSxDQUFDYSxRQUFRVCxXQURULElBRUEsQ0FBQ1MsUUFBUVIsTUFGVCxJQUdBLENBQUNRLFFBQVFQLFFBSFQsSUFJQSxDQUFDTyxRQUFRTixPQVBJO0FBQUE7QUFBQTtBQUFBOztBQUFBLGdDQVNQLElBQUlXLEtBQUosQ0FBVSxrREFBVixDQVRPOztBQUFBO0FBYVRDLGtDQWJTLEdBYUV6QixHQUFHMEIsTUFBSCxFQWJGO0FBY1RDLGlDQWRTLEdBY0lGLFFBZEo7QUFlVEcsMENBZlMsR0FlVSxlQWZWO0FBQUE7QUFBQSxpQ0FpQlR6QixTQUFTYyxHQUFULEVBQWNVLE9BQWQsRUFBdUJULGdCQUF2QixDQWpCUzs7QUFBQTtBQUFBO0FBQUEsaUNBa0JUZCxNQUFNdUIsT0FBTixFQUFlQyxnQkFBZixDQWxCUzs7QUFBQTtBQW1CZlAsa0NBQVEsSUFBUjtBQUNBcEIsbUNBQVM0QixNQUFULENBQWdCQyxHQUFoQixDQUFvQkMsUUFBcEI7QUFDQTlCLG1DQUFTNEIsTUFBVCxDQUFnQkMsR0FBaEIsQ0FBb0JFLElBQXBCOztBQXJCZTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBWjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxrQkFGTTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQTRCVEMsY0E1QlM7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkE2QmUsS0FBS0MsV0FBTCxFQTdCZjs7QUFBQTtBQUFBO0FBNkJOQyxvQkE3Qk0sU0E2Qk5BLE1BN0JNO0FBNkJFbEIsaUJBN0JGLFNBNkJFQSxHQTdCRjs7QUFBQSxvQkErQlRrQixXQUFXLEdBQVgsSUFBa0JsQixHQS9CVDtBQUFBO0FBQUE7QUFBQTs7QUFBQSxnREFnQ0osRUFBQ21CLGNBQWMsSUFBZixFQUFxQm5CLFFBQXJCLEVBaENJOztBQUFBO0FBQUEsZ0RBbUNOLEVBQUNtQixjQUFjLEtBQWYsRUFBc0JuQixLQUFLLElBQTNCLEVBbkNNOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBc0NUaUIsYUF0Q1M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQXVDVWhDLE1BQU0sS0FBS21DLFdBQUwsQ0FBaUJoQyxJQUFqQixDQUFOLENBdkNWOztBQUFBO0FBdUNQaUMsc0JBdkNPO0FBQUE7QUFBQSxxQkF3Q01BLFNBQVNDLElBQVQsRUF4Q047O0FBQUE7QUF3Q1BDLGtCQXhDTztBQUFBLGdEQTBDTixFQUFDTCxRQUFRRyxTQUFTSCxNQUFsQixFQUEwQmxCLEtBQUt1QixLQUFLdkIsR0FBcEMsRUExQ007O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUE2Q2ZvQixhQTdDZSw4QkE2Q2tCO0FBQUEsUUFBbkIvQixNQUFtQixTQUFuQkEsTUFBbUI7QUFBQSxRQUFSbUMsS0FBUTs7QUFDL0IsUUFBTUMsY0FBYzVDLEdBQUc2QyxTQUFILENBQWFGLEtBQWIsQ0FBcEI7O0FBRUEsV0FBVW5DLE1BQVYsd0JBQW1Db0MsV0FBbkM7QUFDRDtBQWpEYyxDQUFqQiIsImZpbGUiOiJhdXRvVXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcXMgPSByZXF1aXJlKCdxcycpXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdub2RlLWZldGNoJylcbmNvbnN0IHtkb3dubG9hZCwgdW56aXB9ID0gcmVxdWlyZSgnLi9maWxlTWFuaXB1bGF0aW9uJylcblxuY29uc3Qgb3B0cyA9IHtcbiAgc2VydmVyOiBwcm9jZXNzLmVudi5IQUlLVV9BVVRPVVBEQVRFX1NFUlZFUixcbiAgZW52aXJvbm1lbnQ6ICdzdGFnaW5nJyxcbiAgYnJhbmNoOiAnbWFzdGVyJyxcbiAgcGxhdGZvcm06ICdtYWMnLFxuICB2ZXJzaW9uOiAnMi4zLjYnXG59XG5cblxuLy8gY29uc3Qgb3B0cyA9IHtcbi8vICAgc2VydmVyOiBwcm9jZXNzLmVudi5IQUlLVV9BVVRPVVBEQVRFX1NFUlZFUixcbi8vICAgZW52aXJvbm1lbnQ6IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfRU5WSVJPTk1FTlQsXG4vLyAgIGJyYW5jaDogcHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9CUkFOQ0gsXG4vLyAgIHBsYXRmb3JtOiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX1BMQVRGT1JNLFxuLy8gICB2ZXJzaW9uOiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX1ZFUlNJT05cbi8vIH1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jIHVwZGF0ZSAodXJsLCBwcm9ncmVzc0NhbGxiYWNrLCBvcHRpb25zID0gb3B0cykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuSEFJS1VfU0tJUF9BVVRPVVBEQVRFICE9PSAnMScpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFvcHRpb25zLnNlcnZlciB8fFxuICAgICAgICAgICFvcHRpb25zLmVudmlyb25tZW50IHx8XG4gICAgICAgICAgIW9wdGlvbnMuYnJhbmNoIHx8XG4gICAgICAgICAgIW9wdGlvbnMucGxhdGZvcm0gfHxcbiAgICAgICAgICAhb3B0aW9ucy52ZXJzaW9uXG4gICAgICAgICkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyByZWxlYXNlL2F1dG91cGRhdGUgZW52aXJvbm1lbnQgdmFyaWFibGVzJylcbiAgICAgICAgICByZWplY3QoZmFsc2UpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZW1wUGF0aCA9IG9zLnRtcGRpcigpXG4gICAgICAgIGNvbnN0IHppcFBhdGggPSBgJHt0ZW1wUGF0aH0vaGFpa3UuemlwYFxuICAgICAgICBjb25zdCBpbnN0YWxsYXRpb25QYXRoID0gJy9BcHBsaWNhdGlvbnMnXG5cbiAgICAgICAgYXdhaXQgZG93bmxvYWQodXJsLCB6aXBQYXRoLCBwcm9ncmVzc0NhbGxiYWNrKVxuICAgICAgICBhd2FpdCB1bnppcCh6aXBQYXRoLCBpbnN0YWxsYXRpb25QYXRoKVxuICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgIGVsZWN0cm9uLnJlbW90ZS5hcHAucmVsYXVuY2goKVxuICAgICAgICBlbGVjdHJvbi5yZW1vdGUuYXBwLmV4aXQoKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgYXN5bmMgY2hlY2tVcGRhdGVzICgpIHtcbiAgICBjb25zdCB7c3RhdHVzLCB1cmx9ID0gYXdhaXQgdGhpcy5jaGVja1NlcnZlcigpXG5cbiAgICBpZiAoc3RhdHVzID09PSAyMDAgJiYgdXJsKSB7XG4gICAgICByZXR1cm4ge3Nob3VsZFVwZGF0ZTogdHJ1ZSwgdXJsfVxuICAgIH1cblxuICAgIHJldHVybiB7c2hvdWxkVXBkYXRlOiBmYWxzZSwgdXJsOiBudWxsfVxuICB9LFxuXG4gIGFzeW5jIGNoZWNrU2VydmVyICgpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHRoaXMuZ2VuZXJhdGVVUkwob3B0cykpXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxuXG4gICAgcmV0dXJuIHtzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cywgdXJsOiBkYXRhLnVybH1cbiAgfSxcblxuICBnZW5lcmF0ZVVSTCAoe3NlcnZlciwgLi4ucXVlcnl9KSB7XG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBxcy5zdHJpbmdpZnkocXVlcnkpXG5cbiAgICByZXR1cm4gYCR7c2VydmVyfS91cGRhdGVzL2xhdGVzdD8ke3F1ZXJ5U3RyaW5nfWBcbiAgfVxufVxuIl19