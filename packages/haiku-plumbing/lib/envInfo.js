'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = envInfo;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function envInfo() {
  var args = (0, _lodash.clone)(_yargs.argv._);
  var subcommand = args.shift();
  var flags = (0, _lodash.clone)(_yargs.argv);
  delete flags._;
  delete flags.$0;

  var folder = flags.folder;
  if (folder && folder[0] !== _path2.default.sep) {
    if (_path2.default.resolve(folder) !== folder) {
      folder = _path2.default.join(process.cwd(), folder || '.');
    }
  }

  var socket = flags.socket || {};

  // Let the user specify --port=1234
  if (flags.port) {
    socket.port = flags.port;
  }

  // Let the user specify --host=0.0.0.0
  if (flags.host) {
    socket.host = flags.host;
  }

  var out = { args: args, subcommand: subcommand, flags: flags, folder: folder, socket: socket };

  return out;
}
//# sourceMappingURL=envInfo.js.map