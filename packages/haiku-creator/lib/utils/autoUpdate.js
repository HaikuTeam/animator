'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var qs = require('qs');
var os = require('os');
var electron = require('electron');
var fetch = require('node-fetch');

var _require = require('./fileManipulation'),
    download = _require.download,
    unzip = _require.unzip;

// const opts = {
//   server: process.env.HAIKU_AUTOUPDATE_SERVER,
//   environment: process.env.HAIKU_RELEASE_ENVIRONMENT,
//   branch: process.env.HAIKU_RELEASE_BRANCH,
//   platform: process.env.HAIKU_RELEASE_PLATFORM,
//   version: process.env.HAIKU_RELEASE_VERSION
// }

var opts = {
  server: process.env.HAIKU_AUTOUPDATE_SERVER,
  environment: 'staging',
  branch: 'master',
  platform: 'mac',
  version: '2.3.6'
};

module.exports = {
  update: function update(url, progressCallback) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : opts;

    return new Promise(function (resolve, reject) {
      if (process.env.HAIKU_SKIP_AUTOUPDATE !== '1') {
        if (!options.server || !options.environment || !options.branch || !options.platform || !options.version) {
          throw new Error('Missing release/autoupdate environment variables');
        }

        var tempPath = os.tmpdir();
        var zipPath = tempPath + '/haiku.zip';
        var installationPath = '/Applications';

        download(url, zipPath, progressCallback).then(function () {
          unzip(zipPath, installationPath);
        }).then(function () {
          resolve(true);
          electron.remote.app.relaunch();
          electron.remote.app.exit();
        });
      }
    });
  },
  checkUpdates: function checkUpdates() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this.checkServer().then(function (_ref) {
        var status = _ref.status,
            url = _ref.url;

        if (status === 200 && url) {
          resolve({ shouldUpdate: true, url: url });
        }

        resolve({ shouldUpdate: false, url: null });
      }).catch(reject);
    });
  },
  checkServer: function checkServer() {
    var _this2 = this;

    var status = void 0;

    return new Promise(function (resolve, reject) {
      fetch(_this2.generateURL(opts)).then(function (response) {
        status = response.status;
        return response.json();
      }).then(function (data) {
        resolve({ status: status, url: data.url });
      }).catch(function (error) {
        reject(error);
      });
    });
  },
  generateURL: function generateURL(_ref2) {
    var server = _ref2.server,
        query = _objectWithoutProperties(_ref2, ['server']);

    var queryString = qs.stringify(query);

    return server + '/updates/latest?' + queryString;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hdXRvVXBkYXRlLmpzIl0sIm5hbWVzIjpbInFzIiwicmVxdWlyZSIsIm9zIiwiZWxlY3Ryb24iLCJmZXRjaCIsImRvd25sb2FkIiwidW56aXAiLCJvcHRzIiwic2VydmVyIiwicHJvY2VzcyIsImVudiIsIkhBSUtVX0FVVE9VUERBVEVfU0VSVkVSIiwiZW52aXJvbm1lbnQiLCJicmFuY2giLCJwbGF0Zm9ybSIsInZlcnNpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwidXBkYXRlIiwidXJsIiwicHJvZ3Jlc3NDYWxsYmFjayIsIm9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkhBSUtVX1NLSVBfQVVUT1VQREFURSIsIkVycm9yIiwidGVtcFBhdGgiLCJ0bXBkaXIiLCJ6aXBQYXRoIiwiaW5zdGFsbGF0aW9uUGF0aCIsInRoZW4iLCJyZW1vdGUiLCJhcHAiLCJyZWxhdW5jaCIsImV4aXQiLCJjaGVja1VwZGF0ZXMiLCJjaGVja1NlcnZlciIsInN0YXR1cyIsInNob3VsZFVwZGF0ZSIsImNhdGNoIiwiZ2VuZXJhdGVVUkwiLCJyZXNwb25zZSIsImpzb24iLCJkYXRhIiwiZXJyb3IiLCJxdWVyeSIsInF1ZXJ5U3RyaW5nIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBTUEsS0FBS0MsUUFBUSxJQUFSLENBQVg7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLFdBQVdGLFFBQVEsVUFBUixDQUFqQjtBQUNBLElBQU1HLFFBQVFILFFBQVEsWUFBUixDQUFkOztlQUMwQkEsUUFBUSxvQkFBUixDO0lBQW5CSSxRLFlBQUFBLFE7SUFBVUMsSyxZQUFBQSxLOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFNQyxPQUFPO0FBQ1hDLFVBQVFDLFFBQVFDLEdBQVIsQ0FBWUMsdUJBRFQ7QUFFWEMsZUFBYSxTQUZGO0FBR1hDLFVBQVEsUUFI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ZXNDb250ZW50IjpbImNvbnN0IHFzID0gcmVxdWlyZSgncXMnKVxuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpXG5jb25zdCBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IGZldGNoID0gcmVxdWlyZSgnbm9kZS1mZXRjaCcpXG5jb25zdCB7ZG93bmxvYWQsIHVuemlwfSA9IHJlcXVpcmUoJy4vZmlsZU1hbmlwdWxhdGlvbicpXG5cbi8vIGNvbnN0IG9wdHMgPSB7XG4vLyAgIHNlcnZlcjogcHJvY2Vzcy5lbnYuSEFJS1VfQVVUT1VQREFURV9TRVJWRVIsXG4vLyAgIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5IQUlLVV9SRUxFQVNFX0VOVklST05NRU5ULFxuLy8gICBicmFuY2g6IHByb2Nlc3MuZW52LkhBSUtVX1JFTEVBU0VfQlJBTkNILFxuLy8gICBwbGF0Zm9ybTogcHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9QTEFURk9STSxcbi8vICAgdmVyc2lvbjogcHJvY2Vzcy5lbnYuSEFJS1VfUkVMRUFTRV9WRVJTSU9OXG4vLyB9XG5cbmNvbnN0IG9wdHMgPSB7XG4gIHNlcnZlcjogcHJvY2Vzcy5lbnYuSEFJS1VfQVVUT1VQREFURV9TRVJWRVIsXG4gIGVudmlyb25tZW50OiAnc3RhZ2luZycsXG4gIGJyYW5jaDogJ21hc3RlcicsXG4gIHBsYXRmb3JtOiAnbWFjJyxcbiAgdmVyc2lvbjogJzIuMy42J1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB1cGRhdGUgKHVybCwgcHJvZ3Jlc3NDYWxsYmFjaywgb3B0aW9ucyA9IG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LkhBSUtVX1NLSVBfQVVUT1VQREFURSAhPT0gJzEnKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhb3B0aW9ucy5zZXJ2ZXIgfHxcbiAgICAgICAgICAhb3B0aW9ucy5lbnZpcm9ubWVudCB8fFxuICAgICAgICAgICFvcHRpb25zLmJyYW5jaCB8fFxuICAgICAgICAgICFvcHRpb25zLnBsYXRmb3JtIHx8XG4gICAgICAgICAgIW9wdGlvbnMudmVyc2lvblxuICAgICAgICApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcmVsZWFzZS9hdXRvdXBkYXRlIGVudmlyb25tZW50IHZhcmlhYmxlcycpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZW1wUGF0aCA9IG9zLnRtcGRpcigpXG4gICAgICAgIGNvbnN0IHppcFBhdGggPSBgJHt0ZW1wUGF0aH0vaGFpa3UuemlwYFxuICAgICAgICBjb25zdCBpbnN0YWxsYXRpb25QYXRoID0gJy9BcHBsaWNhdGlvbnMnXG5cbiAgICAgICAgZG93bmxvYWQodXJsLCB6aXBQYXRoLCBwcm9ncmVzc0NhbGxiYWNrKVxuICAgICAgICAgIC50aGVuKCgpID0+IHt1bnppcCh6aXBQYXRoLCBpbnN0YWxsYXRpb25QYXRoKX0pXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICAgICAgZWxlY3Ryb24ucmVtb3RlLmFwcC5yZWxhdW5jaCgpXG4gICAgICAgICAgICBlbGVjdHJvbi5yZW1vdGUuYXBwLmV4aXQoKVxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBjaGVja1VwZGF0ZXMgKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmNoZWNrU2VydmVyKClcbiAgICAgICAgLnRoZW4oKHtzdGF0dXMsIHVybH0pID0+IHtcbiAgICAgICAgICBpZiAoc3RhdHVzID09PSAyMDAgJiYgdXJsKSB7XG4gICAgICAgICAgICByZXNvbHZlKHtzaG91bGRVcGRhdGU6IHRydWUsIHVybH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSh7c2hvdWxkVXBkYXRlOiBmYWxzZSwgdXJsOiBudWxsfSlcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKHJlamVjdClcbiAgICB9KVxuICB9LFxuXG4gIGNoZWNrU2VydmVyICgpIHtcbiAgICBsZXQgc3RhdHVzXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZmV0Y2godGhpcy5nZW5lcmF0ZVVSTChvcHRzKSlcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzXG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoe3N0YXR1czogc3RhdHVzLCB1cmw6IGRhdGEudXJsfSlcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnJvcilcbiAgICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIGdlbmVyYXRlVVJMICh7c2VydmVyLCAuLi5xdWVyeX0pIHtcbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IHFzLnN0cmluZ2lmeShxdWVyeSlcblxuICAgIHJldHVybiBgJHtzZXJ2ZXJ9L3VwZGF0ZXMvbGF0ZXN0PyR7cXVlcnlTdHJpbmd9YFxuICB9XG59XG4iXX0=