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
    var unzipCommand = 'unzip -o -qq ' + zipPath + ' -d ' + destination;
    var openCommand = filename ? 'open -a ' + destination + '/' + filename + '.app $1' : 'echo';

    return new Promise(function (resolve, reject) {
      exec(unzipCommand + ' && ' + openCommand, {}, function (err) {
        err ? reject(err) : resolve(true);
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWxlTWFuaXB1bGF0aW9uLmpzIl0sIm5hbWVzIjpbImh0dHBzIiwicmVxdWlyZSIsImZzIiwiZXhlYyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkb3dubG9hZCIsInVybCIsImRvd25sb2FkUGF0aCIsIm9uUHJvZ3Jlc3MiLCJzaG91bGRDYW5jZWwiLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInJlcXVlc3QiLCJnZXQiLCJjb250ZW50TGVuZ2h0IiwicGFyc2VJbnQiLCJyZXNwb25zZSIsImhlYWRlcnMiLCJwcm9ncmVzcyIsInBpcGUiLCJvbiIsImFib3J0IiwiY2xvc2UiLCJFcnJvciIsImRhdGEiLCJsZW5ndGgiLCJ1bmxpbmsiLCJlcnJvciIsInVuemlwQW5kT3BlbiIsInppcFBhdGgiLCJkZXN0aW5hdGlvbiIsImZpbGVuYW1lIiwidW56aXBDb21tYW5kIiwib3BlbkNvbW1hbmQiLCJlcnIiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsUUFBUUMsUUFBUSxPQUFSLENBQWQ7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDs7ZUFDZUEsUUFBUSxlQUFSLEM7SUFBUkUsSSxZQUFBQSxJOztBQUVQQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFVBRGUsb0JBQ0xDLEdBREssRUFDQUMsWUFEQSxFQUNjQyxVQURkLEVBQzBCQyxZQUQxQixFQUN3QztBQUNyRCxRQUFNQyxPQUFPVCxHQUFHVSxpQkFBSCxDQUFxQkosWUFBckIsQ0FBYjs7QUFFQSxXQUFPLElBQUlLLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsVUFBTUMsVUFBVWhCLE1BQU1pQixHQUFOLENBQVVWLEdBQVYsRUFBZSxvQkFBWTtBQUN6QyxZQUFNVyxnQkFBZ0JDLFNBQVNDLFNBQVNDLE9BQVQsQ0FBaUIsZ0JBQWpCLENBQVQsRUFBNkMsRUFBN0MsQ0FBdEI7QUFDQSxZQUFJQyxXQUFXLENBQWY7O0FBRUFGLGlCQUFTRyxJQUFULENBQWNaLElBQWQ7O0FBRUFTLGlCQUFTSSxFQUFULENBQVksTUFBWixFQUFvQixnQkFBUTtBQUMxQixjQUFJLE9BQU9kLFlBQVAsS0FBd0IsVUFBeEIsSUFBc0NBLGNBQTFDLEVBQTBEO0FBQ3hETSxvQkFBUVMsS0FBUjtBQUNBZCxpQkFBS2UsS0FBTDtBQUNBWCxtQkFBT1ksTUFBTSxvQkFBTixDQUFQO0FBQ0Q7O0FBRURMLHNCQUFZTSxLQUFLQyxNQUFqQjtBQUNBcEIscUJBQVdhLFdBQVcsR0FBWCxHQUFpQkosYUFBNUI7QUFDRCxTQVREOztBQVdBRSxpQkFBU0ksRUFBVCxDQUFZLE9BQVosRUFBcUIsaUJBQVM7QUFDNUJ0QixhQUFHNEIsTUFBSCxDQUFVdEIsWUFBVjtBQUNBTyxpQkFBT2dCLEtBQVA7QUFDRCxTQUhEOztBQUtBcEIsYUFBS2EsRUFBTCxDQUFRLFFBQVIsRUFBa0IsWUFBTTtBQUN0QmIsZUFBS2UsS0FBTCxDQUFXWixPQUFYO0FBQ0QsU0FGRDtBQUdELE9BekJlLENBQWhCO0FBMEJELEtBM0JNLENBQVA7QUE0QkQsR0FoQ2M7QUFrQ2ZrQixjQWxDZSx3QkFrQ0RDLE9BbENDLEVBa0NRQyxXQWxDUixFQWtDcUJDLFFBbENyQixFQWtDK0I7QUFDNUMsUUFBTUMsaUNBQStCSCxPQUEvQixZQUE2Q0MsV0FBbkQ7QUFDQSxRQUFNRyxjQUFjRix3QkFDTEQsV0FESyxTQUNVQyxRQURWLGVBRWhCLE1BRko7O0FBSUEsV0FBTyxJQUFJdEIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0Q1osV0FBUWlDLFlBQVIsWUFBMkJDLFdBQTNCLEVBQTBDLEVBQTFDLEVBQThDLGVBQU87QUFDbkRDLGNBQU12QixPQUFPdUIsR0FBUCxDQUFOLEdBQW9CeEIsUUFBUSxJQUFSLENBQXBCO0FBQ0QsT0FGRDtBQUdELEtBSk0sQ0FBUDtBQUtEO0FBN0NjLENBQWpCIiwiZmlsZSI6ImZpbGVNYW5pcHVsYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3Qge2V4ZWN9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkb3dubG9hZCAodXJsLCBkb3dubG9hZFBhdGgsIG9uUHJvZ3Jlc3MsIHNob3VsZENhbmNlbCkge1xuICAgIGNvbnN0IGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShkb3dubG9hZFBhdGgpXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IGh0dHBzLmdldCh1cmwsIHJlc3BvbnNlID0+IHtcbiAgICAgICAgY29uc3QgY29udGVudExlbmdodCA9IHBhcnNlSW50KHJlc3BvbnNlLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10sIDEwKVxuICAgICAgICBsZXQgcHJvZ3Jlc3MgPSAwXG5cbiAgICAgICAgcmVzcG9uc2UucGlwZShmaWxlKVxuXG4gICAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBzaG91bGRDYW5jZWwgPT09ICdmdW5jdGlvbicgJiYgc2hvdWxkQ2FuY2VsKCkpIHtcbiAgICAgICAgICAgIHJlcXVlc3QuYWJvcnQoKVxuICAgICAgICAgICAgZmlsZS5jbG9zZSgpXG4gICAgICAgICAgICByZWplY3QoRXJyb3IoJ0Rvd25sb2FkIGNhbmNlbGxlZCcpKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHByb2dyZXNzICs9IGRhdGEubGVuZ3RoXG4gICAgICAgICAgb25Qcm9ncmVzcyhwcm9ncmVzcyAqIDEwMCAvIGNvbnRlbnRMZW5naHQpXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVzcG9uc2Uub24oJ2Vycm9yJywgZXJyb3IgPT4ge1xuICAgICAgICAgIGZzLnVubGluayhkb3dubG9hZFBhdGgpXG4gICAgICAgICAgcmVqZWN0KGVycm9yKVxuICAgICAgICB9KVxuXG4gICAgICAgIGZpbGUub24oJ2ZpbmlzaCcsICgpID0+IHtcbiAgICAgICAgICBmaWxlLmNsb3NlKHJlc29sdmUpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgdW56aXBBbmRPcGVuICh6aXBQYXRoLCBkZXN0aW5hdGlvbiwgZmlsZW5hbWUpIHtcbiAgICBjb25zdCB1bnppcENvbW1hbmQgPSBgdW56aXAgLW8gLXFxICR7emlwUGF0aH0gLWQgJHtkZXN0aW5hdGlvbn1gXG4gICAgY29uc3Qgb3BlbkNvbW1hbmQgPSBmaWxlbmFtZVxuICAgICAgPyBgb3BlbiAtYSAke2Rlc3RpbmF0aW9ufS8ke2ZpbGVuYW1lfS5hcHAgJDFgXG4gICAgICA6ICdlY2hvJ1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGV4ZWMoYCR7dW56aXBDb21tYW5kfSAmJiAke29wZW5Db21tYW5kfWAsIHt9LCBlcnIgPT4ge1xuICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxufVxuIl19