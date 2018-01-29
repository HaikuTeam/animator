var HaikuCreation = require('@haiku/core/dom')
var creation = HaikuCreation(require('./code.js'), {
  // sizing: 'cover'
  overflow: 'hidden',
  overflowX: 'scroll'
})
creation.mount = function (mount) {
  mount.style.border='1px solid red'
  mount.style.width='100px'
  mount.style.height='100px'
  creation(mount)
}
module.exports = creation
