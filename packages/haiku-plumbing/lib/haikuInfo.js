'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = haikuInfo;

var _lodash = require('lodash');

var _envInfo2 = require('./envInfo');

var _envInfo3 = _interopRequireDefault(_envInfo2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function haikuInfo() {
  var _envInfo = (0, _envInfo3.default)(),
      flags = _envInfo.flags,
      folder = _envInfo.folder,
      socket = _envInfo.socket;

  if (!process.env.HAIKU_ENV) {
    process.env.HAIKU_ENV = JSON.stringify((0, _lodash.merge)(flags, { folder: folder, socket: socket }));
  }

  var HAIKU = JSON.parse(process.env.HAIKU_ENV || '{}');

  return HAIKU;
}
//# sourceMappingURL=haikuInfo.js.map