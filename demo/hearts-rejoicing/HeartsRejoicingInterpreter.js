var creation = require('./../../src/creation/dom')
var controller = require('./../../src/emitter').create({})
// 1. Wait for the component instance to be initialized in memory
controller.on('componentDidInitialize', function (instance) {
  // 2. Start the clock so we get the first render at time 0
  instance.start()
  // 3. Listen for a click event on the heart element
  // (Have to do this here because events are attached on render)
  instance.events.listen('#Heart', 'click', function (event) {
    // 6. We've gotten a click -- run the default animation
    instance.start()
  })
})
// 4. Wait for the first render to display content at the 0th frame
controller.on('componentDidMount', function (instance) {
  // 5. Stop the clock here so the default timeline doesn't proceed
  instance.stop()
})
module.exports = creation(require('./HeartsRejoicingBytecode'), {
  autostart: false,
  controller: controller
})
