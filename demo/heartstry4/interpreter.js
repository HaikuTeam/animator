var HaikuCreation = require('./../../src/creation/dom')
module.exports = HaikuCreation(require('./bytecode.js'), {
  autoplay: false,
  onHaikuComponentDidMount: function (instance) {
    var tl = instance.getDefaultTimeline()
    console.log(tl.duration())
    setTimeout(function () {
      tl.gotoAndStop(500)
      setTimeout(function () {
        tl.play()
        setTimeout(function () {
          tl.pause()
          setTimeout(function () {
            tl.seek(100)
            setTimeout(function () {
              tl.play()
              setTimeout(function () {
                tl.gotoAndPlay(300)
                setTimeout(function () {
                  tl.gotoAndStop(1200)
                  setTimeout(function () {
                    tl.seek(1735)
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
