var creation = require('@haiku/player/dom')
module.exports = creation(require('./code'), {
  options: {
    autoplay: false,
    sizing: 'contain'
  },
  onHaikuComponentDidMount: function (instance) {
    console.log(instance)
  }
})
