'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _exporter = require('haiku-sdk-creator/lib/exporter');

var _exporters = require('haiku-formats/lib/exporters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (exporterChannel, activeComponent) {
  exporterChannel.on(_exporter.EXPORTER_CHANNEL + ':save', function (request) {
    var contents = (0, _exporters.handleExporterSaveRequest)(request, activeComponent.fetchActiveBytecodeFile().getReifiedBytecode());
    _fs2.default.writeFile(request.filename, contents, function (err) {
      if (err) {
        throw err;
      }

      exporterChannel.saved(request);
    });
  });
};
//# sourceMappingURL=handleExporterChannel.js.map