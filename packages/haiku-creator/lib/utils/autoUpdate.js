'use strict';

var _regenerator = require('/Users/matthew/Code/HaikuTeam/mono/packages/haiku-creator/node_modules/babel-preset-react-app/node_modules/babel-runtime/regenerator');

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
  environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
  branch: process.env.HAIKU_RELEASE_BRANCH,
  platform: process.env.HAIKU_RELEASE_PLATFORM,
  version: process.env.HAIKU_RELEASE_VERSION
};

module.exports = {
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
                            _context.next = 13;
                            break;
                          }

                          if (!(!options.server || !options.environment || !options.branch || !options.platform || !options.version)) {
                            _context.next = 3;
                            break;
                          }

                          throw new Error('Missing release/autoupdate environment variables');

                        case 3:
                          tempPath = os.tmpdir();
                          zipPath = tempPath + '/haiku.zip';
                          installationPath = '/Applications';
                          _context.next = 8;
                          return download(url, zipPath, progressCallback);

                        case 8:
                          _context.next = 10;
                          return unzip(zipPath, installationPath);

                        case 10:
                          resolve(true);
                          electron.remote.app.relaunch();
                          electron.remote.app.exit();

                        case 13:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hdXRvVXBkYXRlLmpzIl0sIm5hbWVzIjpbInFzIiwicmVxdWlyZSIsIm9zIiwiZWxlY3Ryb24iLCJmZXRjaCIsImRvd25sb2FkIiwidW56aXAiLCJvcHRzIiwic2VydmVyIiwicHJvY2VzcyIsImVudiIsIkhBSUtVX0FVVE9VUERBVEVfU0VSVkVSIiwiZW52aXJvbm1lbnQiLCJIQUlLVV9SRUxFQVNFX0VOVklST05NRU5UIiwiYnJhbmNoIiwiSEFJS1VfUkVMRUFTRV9CUkFOQ0giLCJwbGF0Zm9ybSIsIkhBSUtVX1JFTEVBU0VfUExBVEZPUk0iLCJ2ZXJzaW9uIiwiSEFJS1VfUkVMRUFTRV9WRVJTSU9OIiwibW9kdWxlIiwiZXhwb3J0cyIsInVwZGF0ZSIsInVybCIsInByb2dyZXNzQ2FsbGJhY2siLCJvcHRpb25zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJIQUlLVV9TS0lQX0FVVE9VUERBVEUiLCJFcnJvciIsInRlbXBQYXRoIiwidG1wZGlyIiwiemlwUGF0aCIsImluc3RhbGxhdGlvblBhdGgiLCJyZW1vdGUiLCJhcHAiLCJyZWxhdW5jaCIsImV4aXQiLCJjaGVja1VwZGF0ZXMiLCJjaGVja1NlcnZlciIsInN0YXR1cyIsInNob3VsZFVwZGF0ZSIsImdlbmVyYXRlVVJMIiwicmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsInF1ZXJ5IiwicXVlcnlTdHJpbmciLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU1BLEtBQUtDLFFBQVEsSUFBUixDQUFYO0FBQ0EsSUFBTUMsS0FBS0QsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNRSxXQUFXRixRQUFRLFVBQVIsQ0FBakI7QUFDQSxJQUFNRyxRQUFRSCxRQUFRLFlBQVIsQ0FBZDs7ZUFDMEJBLFFBQVEsb0JBQVIsQztJQUFuQkksUSxZQUFBQSxRO0lBQVVDLEssWUFBQUEsSzs7QUFFakIsSUFBTUMsT0FBTztBQUNYQyxVQUFRQyxRQUFR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QUFBLFFBQVJ1QyxLQUFROztBQUMvQixRQUFNQyxjQUFjaEQsR0FBR2lELFNBQUgsQ0FBYUYsS0FBYixDQUFwQjs7QUFFQSxXQUFVdkMsTUFBVix3QkFBbUN3QyxXQUFuQztBQUNEO0FBaERjLENBQWpCIiwiZmlsZSI6ImF1dG9VcGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBxcyA9IHJlcXVpcmUoJ3FzJylcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKVxuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmZXRjaCA9IHJlcXVpcmUoJ25vZGUtZmV0Y2gnKVxuY29uc3Qge2Rvd25sb2FkLCB1bnppcH0gPSByZXF1aXJlKCcuL2ZpbGVNYW5pcHVsYXRpb24nKVxuXG5jb25zdCBvcHRzID0ge1xuICBzZXJ2ZXI6IHByb2Nlc3MuZW52LkhBSUtVX0FVVE9VUERBVEVfU0VSVkVSLFxuICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCxcbiAgYnJhbmNoOiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX0JSQU5DSCxcbiAgcGxhdGZvcm06IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfUExBVEZPUk0sXG4gIHZlcnNpb246IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfVkVSU0lPTlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXN5bmMgdXBkYXRlICh1cmwsIHByb2dyZXNzQ2FsbGJhY2ssIG9wdGlvbnMgPSBvcHRzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5IQUlLVV9TS0lQX0FVVE9VUERBVEUgIT09ICcxJykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIW9wdGlvbnMuc2VydmVyIHx8XG4gICAgICAgICAgIW9wdGlvbnMuZW52aXJvbm1lbnQgfHxcbiAgICAgICAgICAhb3B0aW9ucy5icmFuY2ggfHxcbiAgICAgICAgICAhb3B0aW9ucy5wbGF0Zm9ybSB8fFxuICAgICAgICAgICFvcHRpb25zLnZlcnNpb25cbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlbGVhc2UvYXV0b3VwZGF0ZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGVtcFBhdGggPSBvcy50bXBkaXIoKVxuICAgICAgICBjb25zdCB6aXBQYXRoID0gYCR7dGVtcFBhdGh9L2hhaWt1LnppcGBcbiAgICAgICAgY29uc3QgaW5zdGFsbGF0aW9uUGF0aCA9ICcvQXBwbGljYXRpb25zJ1xuXG4gICAgICAgIGF3YWl0IGRvd25sb2FkKHVybCwgemlwUGF0aCwgcHJvZ3Jlc3NDYWxsYmFjaylcbiAgICAgICAgYXdhaXQgdW56aXAoemlwUGF0aCwgaW5zdGFsbGF0aW9uUGF0aClcbiAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICBlbGVjdHJvbi5yZW1vdGUuYXBwLnJlbGF1bmNoKClcbiAgICAgICAgZWxlY3Ryb24ucmVtb3RlLmFwcC5leGl0KClcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIGFzeW5jIGNoZWNrVXBkYXRlcyAoKSB7XG4gICAgY29uc3Qge3N0YXR1cywgdXJsfSA9IGF3YWl0IHRoaXMuY2hlY2tTZXJ2ZXIoKVxuXG4gICAgaWYgKHN0YXR1cyA9PT0gMjAwICYmIHVybCkge1xuICAgICAgcmV0dXJuIHtzaG91bGRVcGRhdGU6IHRydWUsIHVybH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3Nob3VsZFVwZGF0ZTogZmFsc2UsIHVybDogbnVsbH1cbiAgfSxcblxuICBhc3luYyBjaGVja1NlcnZlciAoKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0aGlzLmdlbmVyYXRlVVJMKG9wdHMpKVxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHJldHVybiB7c3RhdHVzOiByZXNwb25zZS5zdGF0dXMsIHVybDogZGF0YS51cmx9XG4gIH0sXG5cbiAgZ2VuZXJhdGVVUkwgKHtzZXJ2ZXIsIC4uLnF1ZXJ5fSkge1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gcXMuc3RyaW5naWZ5KHF1ZXJ5KVxuXG4gICAgcmV0dXJuIGAke3NlcnZlcn0vdXBkYXRlcy9sYXRlc3Q/JHtxdWVyeVN0cmluZ31gXG4gIH1cbn1cbiJdfQ==