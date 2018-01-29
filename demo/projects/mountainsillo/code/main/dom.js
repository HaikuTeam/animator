var creation = require('@haiku/core/dom')
module.exports = creation(require('./code'), {
  options: {
    autoplay: false,
    sizing: 'contain'
  },
  onHaikuComponentDidMount: function (instance) {
    console.log(instance)
  }
})
