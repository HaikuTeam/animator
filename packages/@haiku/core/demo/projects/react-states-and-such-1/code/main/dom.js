var HaikuCreation = require('@haiku/core/dom')
module.exports = HaikuCreation(require('./code.js'), {
  loop: true,
  states: {
    bgcolor: {
      value: 'red'
    }
  }
})
