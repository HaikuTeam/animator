var creation = require('./../../src/creation/dom')
var controller = require('./../../src/emitter').create({})
controller.on('componentDidMount', function (instance) {
  instance.events.listen('#heartstry2-main', 'mouseover', function (event) {
    instance.play()
  })
})
module.exports = creation(require('./HeartsTryBytecode'), {
  autoplay: false,
  controller: controller
})
