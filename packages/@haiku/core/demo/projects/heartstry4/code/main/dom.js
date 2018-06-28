var HaikuCreation = require('@haiku/core/dom')
module.exports = HaikuCreation(require('./code.js'), {
  options: {
    autoplay: false,
  },
  onHaikuComponentDidMount: function (instance) {
    var tl = instance.getDefaultTimeline()
    console.log(tl.duration())
    setTimeout(function () {
      tl.gotoAndStop(500, 'ms')
      setTimeout(function () {
        tl.play()
        setTimeout(function () {
          tl.pause()
          setTimeout(function () {
            tl.seek(100, 'ms')
            setTimeout(function () {
              tl.play()
              setTimeout(function () {
                tl.gotoAndPlay(300, 'ms')
                setTimeout(function () {
                  tl.gotoAndStop(1200, 'ms')
                  setTimeout(function () {
                    tl.seek(1735, 'ms')
                  }, 500)
                }, 500)
              }, 500)
            }, 500)
          }, 500)
        }, 500)
      }, 500)
    }, 500)
  }
})
