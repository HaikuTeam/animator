'use strict';

var _regenerator = require('/Users/roperzh/Projects/haiku/mono1/packages/haiku-creator/node_modules/babel-preset-react-app/node_modules/babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var qs = require('qs');
var https = require('https');
var fs = require('fs');
var os = require('os');
var electron = require('electron');
var fetch = require('node-fetch');

var _require = require('child_process'),
    exec = _require.exec;

var opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
  branch: process.env.HAIKU_RELEASE_BRANCH,
  platform: process.env.HAIKU_RELEASE_PLATFORM,
  version: process.env.HAIKU_RELEASE_VERSION
};

function _download(url, downloadPath, onProgress) {
  var file = fs.createWriteStream(downloadPath);

  return new Promise(function (resolve, reject) {
    https.get(url, function (response) {
      var contentLenght = parseInt(response.headers['content-length'], 10);
      var progress = 0;

      response.pipe(file);

      response.on('data', function (data) {
        progress += data.length;
        onProgress({ progress: progress * 100 / contentLenght });
      });

      response.on('error', function (error) {
        fs.unlink(downloadPath);
        reject(error);
      });

      file.on('finish', function () {
        file.close(resolve);
      });
    });
  });
}

function _unzip(zipPath, destination) {
  return new Promise(function (resolve, reject) {
    exec('unzip -o -qq ' + zipPath + ' -d ' + destination, {}, function (err) {
      if (err) reject(err);
      resolve(true);
    });
  });
}

module.exports = {
  update: function () {
    var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(url, progressCallback) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : opts;
      var tempPath, zipPath, installationPath;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (process.env.HAIKU_SKIP_AUTOUPDATE) {
                _context.next = 3;
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
              return _download(url, zipPath, progressCallback);

            case 8:
              _context.next = 10;
              return _unzip(zipPath, installationPath);

            case 10:
              electron.remote.app.relaunch();
              electron.remote.app.exit();

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function update(_x2, _x3) {
      return _ref.apply(this, arguments);
    }

    return update;
  }(),
  checkUpdates: function () {
    var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee2() {
      var _ref3, status, url;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.checkServer();

            case 2:
              _ref3 = _context2.sent;
              status = _ref3.status;
              url = _ref3.url;

              if (!(status === 200 && url)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt('return', { shouldUpdate: true, url: url });

            case 7:
              return _context2.abrupt('return', { shouldUpdate: false, url: null });

            case 8:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function checkUpdates() {
      return _ref2.apply(this, arguments);
    }

    return checkUpdates;
  }(),
  checkServer: function () {
    var _ref4 = _asyncToGenerator(_regenerator2.default.mark(function _callee3() {
      var response, data;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return fetch(this.generateURL(opts));

            case 2:
              response = _context3.sent;
              _context3.next = 5;
              return response.json();

            case 5:
              data = _context3.sent;
              return _context3.abrupt('return', { status: response.status, url: data.url });

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function checkServer() {
      return _ref4.apply(this, arguments);
    }

    return checkServer;
  }(),
  generateURL: function generateURL(_ref5) {
    var server = _ref5.server,
        query = _objectWithoutProperties(_ref5, ['server']);

    var queryString = qs.stringify(query);

    return server + '/updates/latest?' + queryString;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hdXRvVXBkYXRlLmpzIl0sIm5hbWVzIjpbInFzIiwicmVxdWlyZSIsImh0dHBzIiwiZnMiLCJvcyIsImVsZWN0cm9uIiwiZmV0Y2giLCJleGVjIiwib3B0cyIsInNlcnZlciIsInByb2Nlc3MiLCJlbnYiLCJIQUlLVV9BVVRPVVBEQVRFX1NFUlZFUiIsImVudmlyb25tZW50IiwiSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCIsImJyYW5jaCIsIkhBSUtVX1JFTEVBU0VfQlJBTkNIIiwicGxhdGZvcm0iLCJIQUlLVV9SRUxFQVNFX1BMQVRGT1JNIiwidmVyc2lvbiIsIkhBSUtVX1JFTEVBU0VfVkVSU0lPTiIsIl9kb3dubG9hZCIsInVybCIsImRvd25sb2FkUGF0aCIsIm9uUHJvZ3Jlc3MiLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldCIsImNvbnRlbnRMZW5naHQiLCJwYXJzZUludCIsInJlc3BvbnNlIiwiaGVhZGVycyIsInByb2dyZXNzIiwicGlwZSIsIm9uIiwiZGF0YSIsImxlbmd0aCIsInVubGluayIsImVycm9yIiwiY2xvc2UiLCJfdW56aXAiLCJ6aXBQYXRoIiwiZGVzdGluYXRpb24iLCJlcnIiLCJtb2R1bGUiLCJleHBvcnRzIiwidXBkYXRlIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm9wdGlvbnMiLCJIQUlLVV9TS0lQX0FVVE9VUERBVEUiLCJFcnJvciIsInRlbXBQYXRoIiwidG1wZGlyIiwiaW5zdGFsbGF0aW9uUGF0aCIsInJlbW90ZSIsImFwcCIsInJlbGF1bmNoIiwiZXhpdCIsImNoZWNrVXBkYXRlcyIsImNoZWNrU2VydmVyIiwic3RhdHVzIiwic2hvdWxkVXBkYXRlIiwiZ2VuZXJhdGVVUkwiLCJqc29uIiwicXVlcnkiLCJxdWVyeVN0cmluZyIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsS0FBS0MsUUFB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O0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQXlDZjJDLGFBekNlLDhCQXlDa0I7QUFBQSxRQUFuQnhELE1BQW1CLFNBQW5CQSxNQUFtQjtBQUFBLFFBQVIwRCxLQUFROztBQUMvQixRQUFNQyxjQUFjcEUsR0FBR3FFLFNBQUgsQ0FBYUYsS0FBYixDQUFwQjs7QUFFQSxXQUFVMUQsTUFBVix3QkFBbUMyRCxXQUFuQztBQUNEO0FBN0NjLENBQWpCIiwiZmlsZSI6ImF1dG9VcGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBxcyA9IHJlcXVpcmUoJ3FzJylcbmNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJylcbmNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgZmV0Y2ggPSByZXF1aXJlKCdub2RlLWZldGNoJylcbmNvbnN0IHtleGVjfSA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKVxuXG5jb25zdCBvcHRzID0ge1xuICBzZXJ2ZXI6IHByb2Nlc3MuZW52LkhBSUtVX0FVVE9VUERBVEVfU0VSVkVSLFxuICBlbnZpcm9ubWVudDogcHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9FTlZJUk9OTUVOVCxcbiAgYnJhbmNoOiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX0JSQU5DSCxcbiAgcGxhdGZvcm06IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfUExBVEZPUk0sXG4gIHZlcnNpb246IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfVkVSU0lPTlxufVxuXG5mdW5jdGlvbiBfZG93bmxvYWQgKHVybCwgZG93bmxvYWRQYXRoLCBvblByb2dyZXNzKSB7XG4gIGNvbnN0IGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkb3dubG9hZFBhdGgpXG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBodHRwcy5nZXQodXJsLCByZXNwb25zZSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50TGVuZ2h0ID0gcGFyc2VJbnQocmVzcG9uc2UuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSwgMTApXG4gICAgICBsZXQgcHJvZ3Jlc3MgPSAwXG5cbiAgICAgIHJlc3BvbnNlLnBpcGUoZmlsZSlcblxuICAgICAgcmVzcG9uc2Uub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgcHJvZ3Jlc3MgKz0gZGF0YS5sZW5ndGhcbiAgICAgICAgb25Qcm9ncmVzcyh7IHByb2dyZXNzOiBwcm9ncmVzcyAqIDEwMCAvIGNvbnRlbnRMZW5naHQgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJlc3BvbnNlLm9uKCdlcnJvcicsIGVycm9yID0+IHtcbiAgICAgICAgZnMudW5saW5rKGRvd25sb2FkUGF0aClcbiAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgfSlcblxuICAgICAgZmlsZS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICBmaWxlLmNsb3NlKHJlc29sdmUpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59XG5cbmZ1bmN0aW9uIF91bnppcCAoemlwUGF0aCwgZGVzdGluYXRpb24pIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBleGVjKFxuICAgICAgYHVuemlwIC1vIC1xcSAke3ppcFBhdGh9IC1kICR7ZGVzdGluYXRpb259YCxcbiAgICAgIHt9LFxuICAgICAgZXJyID0+IHtcbiAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgfVxuICAgIClcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFzeW5jIHVwZGF0ZSAodXJsLCBwcm9ncmVzc0NhbGxiYWNrLCBvcHRpb25zID0gb3B0cykge1xuICAgIGlmICghcHJvY2Vzcy5lbnYuSEFJS1VfU0tJUF9BVVRPVVBEQVRFKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFvcHRpb25zLnNlcnZlciB8fFxuICAgICAgICAhb3B0aW9ucy5lbnZpcm9ubWVudCB8fFxuICAgICAgICAhb3B0aW9ucy5icmFuY2ggfHxcbiAgICAgICAgIW9wdGlvbnMucGxhdGZvcm0gfHxcbiAgICAgICAgIW9wdGlvbnMudmVyc2lvblxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyByZWxlYXNlL2F1dG91cGRhdGUgZW52aXJvbm1lbnQgdmFyaWFibGVzJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wUGF0aCA9IG9zLnRtcGRpcigpXG4gICAgY29uc3QgemlwUGF0aCA9IGAke3RlbXBQYXRofS9oYWlrdS56aXBgXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uUGF0aCA9ICcvQXBwbGljYXRpb25zJ1xuXG4gICAgYXdhaXQgX2Rvd25sb2FkKHVybCwgemlwUGF0aCwgcHJvZ3Jlc3NDYWxsYmFjaylcbiAgICBhd2FpdCBfdW56aXAoemlwUGF0aCwgaW5zdGFsbGF0aW9uUGF0aClcbiAgICBlbGVjdHJvbi5yZW1vdGUuYXBwLnJlbGF1bmNoKClcbiAgICBlbGVjdHJvbi5yZW1vdGUuYXBwLmV4aXQoKVxuICB9LFxuXG4gIGFzeW5jIGNoZWNrVXBkYXRlcyAoKSB7XG4gICAgY29uc3Qge3N0YXR1cywgdXJsfSA9IGF3YWl0IHRoaXMuY2hlY2tTZXJ2ZXIoKVxuXG4gICAgaWYgKHN0YXR1cyA9PT0gMjAwICYmIHVybCkge1xuICAgICAgcmV0dXJuIHtzaG91bGRVcGRhdGU6IHRydWUsIHVybH1cbiAgICB9XG5cbiAgICByZXR1cm4ge3Nob3VsZFVwZGF0ZTogZmFsc2UsIHVybDogbnVsbH1cbiAgfSxcblxuICBhc3luYyBjaGVja1NlcnZlciAoKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh0aGlzLmdlbmVyYXRlVVJMKG9wdHMpKVxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKClcblxuICAgIHJldHVybiB7c3RhdHVzOiByZXNwb25zZS5zdGF0dXMsIHVybDogZGF0YS51cmx9XG4gIH0sXG5cbiAgZ2VuZXJhdGVVUkwgKHtzZXJ2ZXIsIC4uLnF1ZXJ5fSkge1xuICAgIGNvbnN0IHF1ZXJ5U3RyaW5nID0gcXMuc3RyaW5naWZ5KHF1ZXJ5KVxuXG4gICAgcmV0dXJuIGAke3NlcnZlcn0vdXBkYXRlcy9sYXRlc3Q/JHtxdWVyeVN0cmluZ31gXG4gIH1cbn1cbiJdfQ==