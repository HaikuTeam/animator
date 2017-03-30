var creation = require('./../../src/creation/dom')
var controller = require('./../../src/emitter').create({})
controller.on('componentDidMount', function (instance) {
  instance.events.listen('#Heart', 'click', function (event) {
    instance.play()
  })
})
module.exports = creation(require('./HeartsRejoicingBytecode'), {
  autoplay: false,
  controller: controller
})
