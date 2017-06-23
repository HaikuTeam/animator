var HaikuCreation = require('./../../src/adapters/dom')
module.exports = HaikuCreation(require('./bytecode.js'), {
  sizing: 'contain'
})
