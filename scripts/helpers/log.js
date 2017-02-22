var clc = require('cli-color')

module.exports = {
  log: function (msg) {
    console.log(clc.white(msg))
  },

  err: function (msg) {
    console.log(clc.red(msg))
  }
}
