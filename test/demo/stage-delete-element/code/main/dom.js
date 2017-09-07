var HaikuCreation = require('@haiku/player/dom')
module.exports = HaikuCreation(require('./code.js'), {
  onHaikuComponentDidMount: function (instance) {
    setTimeout(function () {
      instance._template.children.splice(2, 1)
      instance._clearCaches()
      instance._markForFullFlush(true)
      instance._context.tick()
    }, 1000)
  }
})
