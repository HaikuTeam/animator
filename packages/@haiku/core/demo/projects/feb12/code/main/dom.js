var HaikuDOMAdapter = require('@haiku/core/dom')
module.exports = HaikuDOMAdapter(require('./code'), {
  sizing: 'cover',
  alwaysComputeSizing: false,
  loop: true,
  interactionMode: 0,
  autoplay: false,
  mixpanel: false,
  contextMenu: 'disabled',
  onHaikuComponentDidMount: (instance) => {
    setTimeout(() => {
      playAllTimelines(instance)
      setTimeout(() => {
        playAllTimelines(instance)
        setTimeout(() => {
          pauseAllTimelines(instance)
        }, 500)
      }, 500)
    }, 500)
  }
})

const playAllTimelines = (instance) => {
  instance.visitGuestHierarchy((component) => {
    Object.values(component.getTimelines()).forEach((timeline) => {
      console.log('unfreeze/play')
      timeline.unfreeze()
      timeline.play()
    })
  })
}

const pauseAllTimelines = (instance) => {
  instance.visitGuestHierarchy((component) => {
    Object.values(component.getTimelines()).forEach((timeline) => {
      console.log('freeze/pause')
      timeline.freeze()
      timeline.pause()
    })
  })
}
