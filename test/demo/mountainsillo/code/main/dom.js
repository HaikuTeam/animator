var creation = require('@haiku/player/dom')
module.exports = creation(require('./code'), {
  sizing: 'cover',
  autoplay: false,
  onHaikuComponentDidMount: function (instance) {
    console.log(instance)
  }
})
