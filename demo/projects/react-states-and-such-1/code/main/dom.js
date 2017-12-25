var HaikuCreation = require('@haiku/player/dom')
module.exports = HaikuCreation(require('./code.js'), {
  options: {
    loop: true
  },
  states: {
    bgcolor: {
      value: 'red'
    }
  }
})
