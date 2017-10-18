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
  unzipAndOpen: function unzipAndOpen(zipPath, destination, filename) {
    var saneZipPath = JSON.stringify(zipPath);
    var saneDestination = JSON.stringify(destination);
    var unzipCommand = 'unzip -o -qq ' + saneZipPath + ' -d ' + saneDestination;
    var openCommand = filename ? 'open -a ' + saneDestination + '/' + filename + '.app $1' : 'echo';

    return new Promise(function (resolve, reject) {
      exec(unzipCommand + ' && ' + openCommand, {}, function (err) {
        err ? reject(err) : resolve(true);
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWxlTWFuaXB1bGF0aW9uLmpzIl0sIm5hbWVzIjpbImh0dHBzIiwicmVxdWlyZSIsImZzIiwiZXhlYyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkb3dubG9hZCIsInVybCIsImRvd25sb2FkUGF0aCIsIm9uUHJvZ3Jlc3MiLCJzaG91bGRDYW5jZWwiLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJnZXQiLCJjb250ZW50TGVuZ2h0IiwicGFyc2VJbnQiLCJyZXNwb25zZSIsImhlYWRlcnMiLCJwcm9ncmVzcyIsInBpcGUiLCJvbiIsImFib3J0IiwiY2xvc2UiLCJFcnJvciIsImRhdGEiLCJsZW5ndGgiLCJ1bmxpbmsiLCJlcnJvciIsInVuemlwQW5kT3BlbiIsInppcFBhdGgiLCJkZXN0aW5hdGlvbiIsImZpbGVuYW1lIiwic2FuZVppcFBhdGgiLCJKU09OIiwic3RyaW5naWZ5Iiwic2FuZURlc3RpbmF0aW9uIiwidW56aXBDb21tYW5kIiwib3BlbkNvbW1hbmQiLCJlcnIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDs7ZUFDZUEsUUFBUSxlQUFSLEM7SUFBUkUsSSxZQUFBQSxJOztBQUVQQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFVBRGUsb0JBQ0xDLEdBREssRUFDQUMsWUFEQSxFQUNjQyxVQURkLEVBQzBCQyxZQUQxQixFQUN3QztBQUNyRCxRQUFNQyxPQUFPVCxHQUFHVSxpQkFBSCxDQUFxQkosWUFBckIsQ0FBYjs7QUFFQSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBTUMsVUFBVWhCLE1BQU1pQixHQUFOLENBQVVWLEdBQVYsRUFBZSxvQkFBWTtBQUN6QyxZQUFNVyxnQkFBZ0JDLFNBQVNDLFNBQVNDLE9BQVQsQ0FBaUIsZ0JBQWpCLENBQVQsRUFBNkMsRUFBN0MsQ0FBdEI7QUFDQSxZQUFJQyxXQUFXLENBQWY7O0FBRUFGLGlCQUFTRyxJQUFULENBQWNaLElBQWQ7O0FBRUFTLGlCQUFTSSxFQUFULENBQVksTUFBWixFQUFvQixnQkFBUTtBQUMxQixjQUFJLE9BQU9kLFlBQVAsS0FBd0IsVUFBeEIsSUFBc0NBLGNBQTFDLEVBQTBEO0FBQ3hETSxvQkFBUVMsS0FBUjtBQUNBZCxpQkFBS2UsS0FBTDtBQUNBWCxtQkFBT1ksTUFBTSxvQkFBTixDQUFQO0FBQ0Q7O0FBRURMLHNCQUFZTSxLQUFLQyxNQUFqQjtBQUNBcEIscUJBQVdhLFdBQVcsR0FBWCxHQUFpQkosYUFBNUI7QUFDRCxTQVREOztBQVdBRSxpQkFBU0ksRUFBVCxDQUFZLE9BQVosRUFBcUIsaUJBQVM7QUFDNUJ0QixhQUFHNEIsTUFBSCxDQUFVdEIsWUFBVjtBQUNBTyxpQkFBT2dCLEtBQVA7QUFDRCxTQUhEOztBQUtBcEIsYUFBS2EsRUFBTCxDQUFRLFFBQVIsRUFBa0IsWUFBTTtBQUN0QmIsZUFBS2UsS0FBTCxDQUFXWixPQUFYO0FBQ0QsU0FGRDtBQUdELE9BekJlLENBQWhCO0FBMEJELEtBM0JNLENBQVA7QUE0QkQsR0FoQ2M7QUFrQ2ZrQixjQWxDZSx3QkFrQ0RDLE9BbENDLEVBa0NRQyxXQWxDUixFQWtDcUJDLFFBbENyQixFQWtDK0I7QUFDNUMsUUFBTUMsY0FBY0MsS0FBS0MsU0FBTCxDQUFlTCxPQUFmLENBQXBCO0FBQ0EsUUFBTU0sa0JBQWtCRixLQUFLQyxTQUFMLENBQWVKLFdBQWYsQ0FBeEI7QUFDQSxRQUFNTSxpQ0FBK0JKLFdBQS9CLFlBQWlERyxlQUF2RDtBQUNBLFFBQU1FLGNBQWNOLHdCQUNMSSxlQURLLFNBQ2NKLFFBRGQsZUFFaEIsTUFGSjs7QUFJQSxXQUFPLElBQUl0QixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDWixXQUFRcUMsWUFBUixZQUEyQkMsV0FBM0IsRUFBMEMsRUFBMUMsRUFBOEMsZUFBTztBQUNuREMsY0FBTTNCLE9BQU8yQixHQUFQLENBQU4sR0FBb0I1QixRQUFRLElBQVIsQ0FBcEI7QUFDRCxPQUZEO0FBR0QsS0FKTSxDQUFQO0FBS0Q7QUEvQ2MsQ0FBakIiLCJmaWxlIjoiZmlsZU1hbmlwdWxhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCB7ZXhlY30gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRvd25sb2FkICh1cmwsIGRvd25sb2FkUGF0aCwgb25Qcm9ncmVzcywgc2hvdWxkQ2FuY2VsKSB7XG4gICAgY29uc3QgZmlsZSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGRvd25sb2FkUGF0aClcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCByZXF1ZXN0ID0gaHR0cHMuZ2V0KHVybCwgcmVzcG9uc2UgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50TGVuZ2h0ID0gcGFyc2VJbnQocmVzcG9uc2UuaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSwgMTApXG4gICAgICAgIGxldCBwcm9ncmVzcyA9IDBcblxuICAgICAgICByZXNwb25zZS5waXBlKGZpbGUpXG5cbiAgICAgICAgcmVzcG9uc2Uub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHNob3VsZENhbmNlbCA9PT0gJ2Z1bmN0aW9uJyAmJiBzaG91bGRDYW5jZWwoKSkge1xuICAgICAgICAgICAgcmVxdWVzdC5hYm9ydCgpXG4gICAgICAgICAgICBmaWxlLmNsb3NlKClcbiAgICAgICAgICAgIHJlamVjdChFcnJvcignRG93bmxvYWQgY2FuY2VsbGVkJykpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJvZ3Jlc3MgKz0gZGF0YS5sZW5ndGhcbiAgICAgICAgICBvblByb2dyZXNzKHByb2dyZXNzICogMTAwIC8gY29udGVudExlbmdodClcbiAgICAgICAgfSlcblxuICAgICAgICByZXNwb25zZS5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgZnMudW5saW5rKGRvd25sb2FkUGF0aClcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZmlsZS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgIGZpbGUuY2xvc2UocmVzb2x2ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICB1bnppcEFuZE9wZW4gKHppcFBhdGgsIGRlc3RpbmF0aW9uLCBmaWxlbmFtZSkge1xuICAgIGNvbnN0IHNhbmVaaXBQYXRoID0gSlNPTi5zdHJpbmdpZnkoemlwUGF0aClcbiAgICBjb25zdCBzYW5lRGVzdGluYXRpb24gPSBKU09OLnN0cmluZ2lmeShkZXN0aW5hdGlvbilcbiAgICBjb25zdCB1bnppcENvbW1hbmQgPSBgdW56aXAgLW8gLXFxICR7c2FuZVppcFBhdGh9IC1kICR7c2FuZURlc3RpbmF0aW9ufWBcbiAgICBjb25zdCBvcGVuQ29tbWFuZCA9IGZpbGVuYW1lXG4gICAgICA/IGBvcGVuIC1hICR7c2FuZURlc3RpbmF0aW9ufS8ke2ZpbGVuYW1lfS5hcHAgJDFgXG4gICAgICA6ICdlY2hvJ1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGV4ZWMoYCR7dW56aXBDb21tYW5kfSAmJiAke29wZW5Db21tYW5kfWAsIHt9LCBlcnIgPT4ge1xuICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuIl19