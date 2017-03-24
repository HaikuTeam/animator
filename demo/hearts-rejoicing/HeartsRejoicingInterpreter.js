var creation = require('./../../src/creation/dom')
var controller = require('./../../src/emitter').create({})
module.exports = creation(require('./HeartsRejoicingBytecode'), {
  autostart: false,
  controller: controller
})
