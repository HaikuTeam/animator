'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exporter = require('haiku-sdk-creator/lib/exporter');

var _saveExport = require('../publish-hooks/saveExport');

var _saveExport2 = _interopRequireDefault(_saveExport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (exporterChannel, activeComponent) {
  exporterChannel.on(_exporter.EXPORTER_CHANNEL + ':save', function (request) {
    (0, _saveExport2.default)(request, activeComponent, function (err) {
      if (err) {
        throw err;
      }

      exporterChannel.saved(request);
    });
  });
};
//# sourceMappingURL=handleExporterChannel.js.map