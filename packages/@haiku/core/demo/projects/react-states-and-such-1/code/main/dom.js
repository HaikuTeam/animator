var HaikuCreation = require('@haiku/core/dom')
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
