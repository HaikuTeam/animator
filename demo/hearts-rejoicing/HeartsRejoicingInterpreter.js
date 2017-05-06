var creation = require('./../../src/creation/dom')
module.exports = creation(require('./HeartsRejoicingBytecode'), {
  autoplay: false,
  sizing: 'cover',
  onHaikuComponentDidMount: function (instance) {
    var el = document.querySelector('#Heart')
    el.addEventListener('click', function (event) {
      instance.getDefaultTimeline().play()
    })
  }
})
