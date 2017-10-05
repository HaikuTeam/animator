'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ProcessBase = require('./ProcessBase');

var _ProcessBase2 = _interopRequireDefault(_ProcessBase);

var _Master = require('./Master');

var _Master2 = _interopRequireDefault(_Master);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Raven = require('./Raven');

Raven.context(function () {
  var master = new _Master2.default(_ProcessBase2.default.HAIKU.folder);

  master.on('host-disconnected', function () {
    throw new Error('[master] disconnected from host plumbing process');
  });
});

exports.default = master;
//# sourceMappingURL=MasterProcess.js.map