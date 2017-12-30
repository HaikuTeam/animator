const clc = require('cli-color');

const SPACER = '\n=============================================\n';

module.exports = {
  log(msg) {
    console.log(clc.white(msg));
  },

  err(msg) {
    console.log(clc.red(msg));
  },

  warn(msg) {
    console.log(clc.yellow(msg));
  },

  hat(msg, color) {
    console.log(clc[color || 'cyan'](SPACER + msg + SPACER));
  },
};
