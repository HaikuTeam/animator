var creation = require('./../../src/adapters/dom')
module.exports = creation(require('./bytecode'), {
  autoplay: false,
  sizing: 'cover',
  onHaikuComponentDidMount: function (instance) {
    var el = document.querySelector('#Heart')
    el.addEventListener('click', function (event) {
      instance.getDefaultTimeline().gotoAndPlay(0)
    })
  }
})
