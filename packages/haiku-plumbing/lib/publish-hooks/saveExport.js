'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _exporters = require('haiku-formats/lib/exporters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (request, activeComponent, cb) {
  var bytecodeSnapshot = activeComponent.fetchActiveBytecodeFile().getReifiedBytecode();
  // Re-mount the active component so mutations to the bytecode snapshot don't trickle into the project.
  activeComponent.reloadBytecodeFromDisk(function (err) {
    if (err) {
      cb(err);
      return;
    }

    (0, _exporters.handleExporterSaveRequest)(request, bytecodeSnapshot).then(function (contents) {
      _haikuFsExtra2.default.writeFile(request.filename, contents, function (error) {
        return cb(error);
      });
    }).catch(function (error) {
      return cb(error);
    });
  });
};
//# sourceMappingURL=saveExport.js.map