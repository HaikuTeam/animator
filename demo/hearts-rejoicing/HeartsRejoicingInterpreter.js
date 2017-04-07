var creation = require('./../../src/creation/dom')
module.exports = creation(require('./HeartsRejoicingBytecode'), {
  autoplay: false,
  sizing: 'cover',
  onHaikuComponentDidMount: function (instance) {
    instance.events.listen('#Heart', 'click', function (event) {
      instance.play()
    })
  }
})
