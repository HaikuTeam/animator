'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.project = undefined;
exports.getCurrentShareInfo = getCurrentShareInfo;
exports.getSnapshotInfo = getSnapshotInfo;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _haikuSdkInkstone = require('haiku-sdk-inkstone');

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

var _Git = require('./Git');

var Git = _interopRequireWildcard(_Git);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure inkstone, useful for testing off of dev (HAIKU_API=https://localhost:8080/)
if (process.env.HAIKU_API) {
  _haikuSdkInkstone.inkstone.setConfig({
    baseUrl: process.env.HAIKU_API
  });
}

function getCurrentShareInfo(folder, cache, extras, timeout, done) {
  return Git.referenceNameToId(folder, 'HEAD', function (err, id) {
    if (err) return done(err);

    var sha = id.toString();

    _LoggerInstance2.default.info('[inkstone] git HEAD resolved:', sha, 'getting snapshot info...');

    if (cache[sha]) {
      _LoggerInstance2.default.info('[inkstone] found cached share info for ' + sha);
      return done(null, cache[sha]);
    }

    return getSnapshotInfo(sha, timeout, function (err, shareLink, snapshotAndProject) {
      _LoggerInstance2.default.info('[inkstone] snapshot info returned', err, shareLink);

      if (err) {
        if (err.timeout === true) {
          _LoggerInstance2.default.info('[inkstone] timed out waiting for snapshot info');

          // HEY! This error message string is used by the frontend as part of some hacky conditional logic.
          // Make sure you understand what it's doing there before you change it here...
          return done(new Error('Timed out waiting for project share info'), _lodash2.default.assign({ sha: sha }, extras));
        }

        _LoggerInstance2.default.info('[inkstone] error getting snapshot info');
        return done(err);
      }

      var projectUid = snapshotAndProject.Project.UniqueId;

      var shareInfo = _lodash2.default.assign({ sha: sha, projectUid: projectUid, shareLink: shareLink }, extras);

      // Cache this during this session so we can avoid unnecessary handshakes with inkstone
      cache[sha] = shareInfo;

      _LoggerInstance2.default.sacred('[inkstone] share info', shareInfo);

      return done(null, shareInfo);
    });
  });
}

function getSnapshotInfo(sha, timeout, done) {
  var alreadyReturned = false;

  setTimeout(function () {
    if (!alreadyReturned) {
      alreadyReturned = true;
      return done({ timeout: true });
    }
  }, timeout);

  function finish(err, shareLink, snapshotAndProject) {
    if (!alreadyReturned) {
      alreadyReturned = true;
      return done(err, shareLink, snapshotAndProject);
    }
  }

  _LoggerInstance2.default.info('[inkstone] awaiting snapshot share link');

  return _haikuSdkInkstone.inkstone.snapshot.awaitSnapshotLink(sha, function (err, shareLink) {
    if (err) return finish(err);

    _LoggerInstance2.default.info('[inkstone] share link received:', shareLink);

    return _haikuSdkInkstone.inkstone.snapshot.getSnapshotAndProject(sha, function (err, snapshotAndProject) {
      if (err) return finish(err);

      _LoggerInstance2.default.info('[inkstone] snapshot/project info:', snapshotAndProject);

      return finish(null, shareLink, snapshotAndProject);
    });
  });
}

var project = exports.project = {
  getByName: _haikuSdkInkstone.inkstone.project.getByName.bind(_haikuSdkInkstone.inkstone.project)
};
//# sourceMappingURL=Inkstone.js.map