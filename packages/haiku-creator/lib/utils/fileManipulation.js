'use strict';

var https = require('https');
var fs = require('fs');

var _require = require('child_process'),
    exec = _require.exec;

module.exports = {
  download: function download(url, downloadPath, onProgress, shouldCancel) {
    var file = fs.createWriteStream(downloadPath);

    return new Promise(function (resolve, reject) {
      var request = https.get(url, function (response) {
        var contentLenght = parseInt(response.headers['content-length'], 10);
        var progress = 0;

        response.pipe(file);

        response.on('data', function (data) {
          if (typeof shouldCancel === 'function' && shouldCancel()) {
            request.abort();
            file.close();
            reject(Error('Download cancelled'));
          }

          progress += data.length;
          onProgress(progress * 100 / contentLenght);
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
  },
  unzip: function unzip(zipPath, destination, filename) {
    return new Promise(function (resolve, reject) {
      exec('unzip -o -qq ' + zipPath + ' -d ' + destination + ' && open -a ' + destination + '/' + filename + '.app $1', {}, function (err) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWxlTWFuaXB1bGF0aW9uLmpzIl0sIm5hbWVzIjpbImh0dHBzIiwicmVxdWlyZSIsImZzIiwiZXhlYyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkb3dubG9hZCIsInVybCIsImRvd25sb2FkUGF0aCIsIm9uUHJvZ3Jlc3MiLCJzaG91bGRDYW5jZWwiLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJnZXQiLCJjb250ZW50TGVuZ2h0IiwicGFyc2VJbnQiLCJyZXNwb25zZSIsImhlYWRlcnMiLCJwcm9ncmVzcyIsInBpcGUiLCJvbiIsImFib3J0IiwiY2xvc2UiLCJFcnJvciIsImRhdGEiLCJsZW5ndGgiLCJ1bmxpbmsiLCJlcnJvciIsInVuemlwIiwiemlwUGF0aCIsImRlc3RpbmF0aW9uIiwiZmlsZW5hbWUiLCJlcnIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDs7ZUFDZUEsUUFBUSxlQUFSLEM7SUFBUkUsSSxZQUFBQSxJOztBQUVQQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFVBRGUsb0JBQ0xDLEdBREssRUFDQUMsWUFEQSxFQUNjQyxVQURkLEVBQzBCQyxZQUQxQixFQUN3QztBQUNyRCxRQUFNQyxPQUFPVCxHQUFHVSxpQkFBSCxDQUFxQkosWUFBckIsQ0FBYjs7QUFFQSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBTUMsVUFBVWhCLE1BQU1pQixHQUFOLENBQVVWLEdBQVYsRUFBZSxvQkFBWTtBQUN6QyxZQUFNVyxnQkFBZ0JDLFNBQVNDLFNBQVNDLE9BQVQsQ0FBaUIsZ0JBQWpCLENBQVQsRUFBNkMsRUFBN0MsQ0FBdEI7QUFDQSxZQUFJQyxXQUFXLENBQWY7O0FBRUFGLGlCQUFTRyxJQUFULENBQWNaLElBQWQ7O0FBRUFTLGlCQUFTSSxFQUFULENBQVksTUFBWixFQUFvQixnQkFBUTtBQUMxQixjQUFJLE9BQU9kLFlBQVAsS0FBd0IsVUFBeEIsSUFBc0NBLGNBQTFDLEVBQTBEO0FBQ3hETSxvQkFBUVMsS0FBUjtBQUNBZCxpQkFBS2UsS0FBTDtBQUNBWCxtQkFBT1ksTUFBTSxvQkFBTixDQUFQO0FBQ0Q7O0FBRURMLHNCQUFZTSxLQUFLQyxNQUFqQjtBQUNBcEIscUJBQVdhLFdBQVcsR0FBWCxHQUFpQkosYUFBNUI7QUFDRCxTQVREOztBQVdBRSxpQkFBU0ksRUFBVCxDQUFZLE9BQVosRUFBcUIsaUJBQVM7QUFDNUJ0QixhQUFHNEIsTUFBSCxDQUFVdEIsWUFBVjtBQUNBTyxpQkFBT2dCLEtBQVA7QUFDRCxTQUhEOztBQUtBcEIsYUFBS2EsRUFBTCxDQUFRLFFBQVIsRUFBa0IsWUFBTTtBQUN0QmIsZUFBS2UsS0FBTCxDQUFXWixPQUFYO0FBQ0QsU0FGRDtBQUdELE9BekJlLENBQWhCO0FBMEJELEtBM0JNLENBQVA7QUE0QkQsR0FoQ2M7QUFrQ2ZrQixPQWxDZSxpQkFrQ1JDLE9BbENRLEVBa0NDQyxXQWxDRCxFQWtDY0MsUUFsQ2QsRUFrQ3dCO0FBQ3JDLFdBQU8sSUFBSXRCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdENaLDZCQUNrQjhCLE9BRGxCLFlBQ2dDQyxXQURoQyxvQkFDMERBLFdBRDFELFNBQ3lFQyxRQUR6RSxjQUVFLEVBRkYsRUFHRSxlQUFPO0FBQ0wsWUFBSUMsR0FBSixFQUFTckIsT0FBT3FCLEdBQVA7QUFDVHRCLGdCQUFRLElBQVI7QUFDRCxPQU5IO0FBUUQsS0FUTSxDQUFQO0FBVUQ7QUE3Q2MsQ0FBakIiLCJmaWxlIjoiZmlsZU1hbmlwdWxhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCB7ZXhlY30gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRvd25sb2FkICh1cmwsIGRvd25sb2FkUGF0aCwgb25Qcm9ncmVzcywgc2hvdWxkQ2FuY2VsKSB7XG4gICAgY29uc3QgZmlsZSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGRvd25sb2FkUGF0aClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMuZ2V0KHVybCwgcmVzcG9uc2UgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50TGVuZ2h0ID0gcGFyc2VJbnQocmVzcG9uc2UuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSwgMTApXG4gICAgICAgIGxldCBwcm9ncmVzcyA9IDBcblxuICAgICAgICByZXNwb25zZS5waXBlKGZpbGUpXG5cbiAgICAgICAgcmVzcG9uc2Uub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHNob3VsZENhbmNlbCA9PT0gJ2Z1bmN0aW9uJyAmJiBzaG91bGRDYW5jZWwoKSkge1xuICAgICAgICAgICAgcmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgICBmaWxlLmNsb3NlKClcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignRG93bmxvYWQgY2FuY2VsbGVkJykpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJvZ3Jlc3MgKz0gZGF0YS5sZW5ndGhcbiAgICAgICAgICBvblByb2dyZXNzKHByb2dyZXNzICogMTAwIC8gY29udGVudExlbmdodClcbiAgICAgICAgfSlcblxuICAgICAgICByZXNwb25zZS5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgZnMudW5saW5rKGRvd25sb2FkUGF0aClcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZmlsZS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgIGZpbGUuY2xvc2UocmVzb2x2ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICB1bnppcCAoemlwUGF0aCwgZGVzdGluYXRpb24sIGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGV4ZWMoXG4gICAgICAgIGB1bnppcCAtbyAtcXEgJHt6aXBQYXRofSAtZCAke2Rlc3RpbmF0aW9ufSAmJiBvcGVuIC1hICR7ZGVzdGluYXRpb259LyR7ZmlsZW5hbWV9LmFwcCAkMWAsXG4gICAgICAgIHt9LFxuICAgICAgICBlcnIgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpXG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKVxuICAgICAgICB9XG4gICAgICApXG4gICAgfSlcbiAgfVxufVxuIl19