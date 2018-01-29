var creation = require('@haiku/core/dom')
module.exports = creation(require('./code'), {
  options: {
    autoplay: false,
    sizing: 'cover'
  },
  onHaikuComponentDidMount: function (instance) {
    console.info('ok if both hearts beat on click since i registered it intentionally in a weird way')
    var el = document.querySelector('#Heart')
    el.addEventListener('click', function (event) {
      instance.getDefaultTimeline().gotoAndPlay(0)
    })
  }
})
