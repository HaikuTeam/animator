'use strict';

var https = require('https');
var fs = require('fs');

var _require = require('child_process'),
    exec = _require.exec;

module.exports = {
  download: function download(url, downloadPath, onProgress) {
    var file = fs.createWriteStream(downloadPath);

    return new Promise(function (resolve, reject) {
      https.get(url, function (response) {
        var contentLenght = parseInt(response.headers['content-length'], 10);
        var progress = 0;

        response.pipe(file);

        response.on('data', function (data) {
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
  unzip: function unzip(zipPath, destination) {
    return new Promise(function (resolve, reject) {
      exec('unzip -o -qq ' + zipPath + ' -d ' + destination, {}, function (err) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWxlTWFuaXB1bGF0aW9uLmpzIl0sIm5hbWVzIjpbImh0dHBzIiwicmVxdWlyZSIsImZzIiwiZXhlYyIsIm1vZHVsZSIsImV4cG9ydHMiLCJkb3dubG9hZCIsInVybCIsImRvd25sb2FkUGF0aCIsIm9uUHJvZ3Jlc3MiLCJmaWxlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldCIsImNvbnRlbnRMZW5naHQiLCJwYXJzZUludCIsInJlc3BvbnNlIiwiaGVhZGVycyIsInByb2dyZXNzIiwicGlwZSIsIm9uIiwiZGF0YSIsImxlbmd0aCIsInVubGluayIsImVycm9yIiwiY2xvc2UiLCJ1bnppcCIsInppcFBhdGgiLCJkZXN0aW5hdGlvbiIsImVyciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxRQUFRQyxRQUFRLE9BQVIsQ0FBZDtBQUNBLElBQU1DLEtBQUtELFFBQVEsSUFBUixDQUFYOztlQUNlQSxRQUFRLGVBQVIsQztJQUFSRSxJLFlBQUFBLEk7O0FBRVBDLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsVUFEZSxvQkFDTEMsR0FESyxFQUNBQyxZQURBLEVBQ2NDLFVBRGQsRUFDMEI7QUFDdkMsUUFBTUMsT0FBT1IsR0FBR1MsaUJBQUgsQ0FBcUJILFlBQXJCLENBQWI7O0FBRUEsV0FBTyxJQUFJSSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDZCxZQUFNZSxHQUFOLENBQVVSLEdBQVYsRUFBZSxvQkFBWTtBQUN6QixZQUFNUyxnQkFBZ0JDLFNBQVNDLFNBQVNDLE9BQVQsQ0FBaUIsZ0JBQWpCLENBQVQsRUFBNkMsRUFBN0MsQ0FBdEI7QUFDQSxZQUFJQyxXQUFXLENBQWY7O0FBRUFGLGlCQUFTRyxJQUFULENBQWNYLElBQWQ7O0FBRUFRLGlCQUFTSSxFQUFULENBQVksTUFBWixFQUFvQixnQkFBUTtBQUMxQkYsc0JBQVlHLEtBQUtDLE1BQWpCO0FBQ0FmLHFCQUFXVyxXQUFXLEdBQVgsR0FBaUJKLGFBQTVCO0FBQ0QsU0FIRDs7QUFLQUUsaUJBQVNJLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLGlCQUFTO0FBQzVCcEIsYUFBR3VCLE1BQUgsQ0FBVWpCLFlBQVY7QUFDQU0saUJBQU9ZLEtBQVA7QUFDRCxTQUhEOztBQUtBaEIsYUFBS1ksRUFBTCxDQUFRLFFBQVIsRUFBa0IsWUFBTTtBQUN0QlosZUFBS2lCLEtBQUwsQ0FBV2QsT0FBWDtBQUNELFNBRkQ7QUFHRCxPQW5CRDtBQW9CRCxLQXJCTSxDQUFQO0FBc0JELEdBMUJjO0FBNEJmZSxPQTVCZSxpQkE0QlJDLE9BNUJRLEVBNEJDQyxXQTVCRCxFQTRCYztBQUMzQixXQUFPLElBQUlsQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDWCw2QkFDa0IwQixPQURsQixZQUNnQ0MsV0FEaEMsRUFFRSxFQUZGLEVBR0UsZUFBTztBQUNMLFlBQUlDLEdBQUosRUFBU2pCLE9BQU9pQixHQUFQO0FBQ1RsQixnQkFBUSxJQUFSO0FBQ0QsT0FOSDtBQVFELEtBVE0sQ0FBUDtBQVVEO0FBdkNjLENBQWpCIiwiZmlsZSI6ImZpbGVNYW5pcHVsYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJylcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxuY29uc3Qge2V4ZWN9ID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkb3dubG9hZCAodXJsLCBkb3dubG9hZFBhdGgsIG9uUHJvZ3Jlc3MpIHtcbiAgICBjb25zdCBmaWxlID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oZG93bmxvYWRQYXRoKVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGh0dHBzLmdldCh1cmwsIHJlc3BvbnNlID0+IHtcbiAgICAgICAgY29uc3QgY29udGVudExlbmdodCA9IHBhcnNlSW50KHJlc3BvbnNlLmhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10sIDEwKVxuICAgICAgICBsZXQgcHJvZ3Jlc3MgPSAwXG5cbiAgICAgICAgcmVzcG9uc2UucGlwZShmaWxlKVxuXG4gICAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgZGF0YSA9PiB7XG4gICAgICAgICAgcHJvZ3Jlc3MgKz0gZGF0YS5sZW5ndGhcbiAgICAgICAgICBvblByb2dyZXNzKHByb2dyZXNzICogMTAwIC8gY29udGVudExlbmdodClcbiAgICAgICAgfSlcblxuICAgICAgICByZXNwb25zZS5vbignZXJyb3InLCBlcnJvciA9PiB7XG4gICAgICAgICAgZnMudW5saW5rKGRvd25sb2FkUGF0aClcbiAgICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgICAgIH0pXG5cbiAgICAgICAgZmlsZS5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgICAgIGZpbGUuY2xvc2UocmVzb2x2ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICB1bnppcCAoemlwUGF0aCwgZGVzdGluYXRpb24pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZXhlYyhcbiAgICAgICAgYHVuemlwIC1vIC1xcSAke3ppcFBhdGh9IC1kICR7ZGVzdGluYXRpb259YCxcbiAgICAgICAge30sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgaWYgKGVycikgcmVqZWN0KGVycilcbiAgICAgICAgICByZXNvbHZlKHRydWUpXG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9KVxuICB9XG59XG4iXX0=