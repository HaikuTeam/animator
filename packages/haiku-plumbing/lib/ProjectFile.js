'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensure = ensure;
exports.read = read;
exports.write = write;
exports.update = update;

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ensure(folder, filepath, cb) {
  return _haikuFsExtra2.default.ensureFile(_path2.default.join(folder, filepath), function (ensureErr) {
    if (ensureErr) return cb(ensureErr);
    return cb();
  });
}

function read(folder, filepath, cb) {
  return _haikuFsExtra2.default.readFile(_path2.default.join(folder, filepath), function (readErr, buffer) {
    if (readErr) return cb(readErr);
    var contents = buffer.toString();
    return cb(null, contents);
  });
}

function write(folder, filepath, contents, cb) {
  return _haikuFsExtra2.default.writeFile(_path2.default.join(folder, filepath), contents, function (writeErr) {
    if (writeErr) return cb(writeErr);
    return cb(null, contents);
  });
}

function update(folder, filepath, modifierFunction, cb) {
  return ensure(folder, filepath, function (ensureErr) {
    if (ensureErr) return cb(ensureErr);
    return read(folder, filepath, function (readErr, contents) {
      if (readErr) return cb(readErr);
      var modified = modifierFunction(contents); // Expected to modify in-place
      return write(folder, filepath, modified, function (writeErr) {
        if (writeErr) return cb(writeErr);
        return cb(null, modified);
      });
    });
  });
}
//# sourceMappingURL=ProjectFile.js.map