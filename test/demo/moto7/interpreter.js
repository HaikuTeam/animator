var creation = require('@haiku/player/dom');
module.exports = creation(require('./bytecode'), {
  contextMenu: 'disabled'
  // autoplay: false
});
