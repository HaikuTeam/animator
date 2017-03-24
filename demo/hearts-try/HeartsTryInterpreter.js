var creation = require('./../../src/creation/dom')
var controller = require('./../../src/emitter').create({})
controller.on('componentDidInitialize', function (instance) {
  instance.start()
  instance.events.listen('#heartstry2-main', 'mouseover', function (event) {
    instance.start()
  })
})
controller.on('componentDidMount', function (instance) {
  instance.stop()
})
module.exports = creation(require('./HeartsTryBytecode'), {
  autostart: false,
  controller: controller
})
