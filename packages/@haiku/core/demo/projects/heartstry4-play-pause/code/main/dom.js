const factory = require('@haiku/core/dom')

module.exports = factory(require('./code.js'), {
  autoplay: true,
  loop: true,
  onHaikuComponentDidMount: function (instance) {
    const tl = instance.getDefaultTimeline()

    setTimeout(function () {
      tl.pause()
      setTimeout(() => {
        tl.play()
      }, 2000)
    }, 500)
  }
})
