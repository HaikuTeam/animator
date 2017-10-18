'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _exporter = require('haiku-sdk-creator/lib/exporter');

var _handleExporterChannel = require('./handleExporterChannel');

var _handleExporterChannel2 = _interopRequireDefault(_handleExporterChannel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (envoyClient, activeComponent) {
  envoyClient.get(_exporter.EXPORTER_CHANNEL).then(function (exporterChannel) {
    (0, _handleExporterChannel2.default)(exporterChannel, activeComponent);
  });
};
//# sourceMappingURL=attachListeners.js.map