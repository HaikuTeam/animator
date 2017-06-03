var clc = require('cli-color')

var SPACER = '\n=============================================\n'

module.exports = {
  log: function (msg) {
    console.log(clc.white(msg))
  },

  err: function (msg) {
    console.log(clc.red(msg))
  },

  hat: function (msg, color) {
    console.log(clc[color || 'cyan'](SPACER + msg + SPACER))
  }
}
