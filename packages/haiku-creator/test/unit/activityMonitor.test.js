const test = require('tape')
const EventEmitter = require('events')
const ActivityMonitor = require('../../src/utils/activityMonitor')

test('ActivityMonitor detects activity on the correct events', t => {
  t.plan(1)

  context = setContextAndAssert((userWasActive) => {
    t.ok(userWasActive, 'activity was detected')
  })

  context.emit('mousemove')
})


test('ActivityMonitor does not detect activity on random events', t => {
  t.plan(1)

  let activityDetected = false

  context = setContextAndAssert((userWasActive) => {
    activityDetected = userWasActive
  })

  context.emit('random')
  context.emit('random:2')

  setTimeout(() => t.notOk(activityDetected, 'no activity detected'))
})

function setContextAndAssert(assertion) {
  const emitter = new EventEmitter()
  emitter.addEventListener = emitter.addListener
  emitter.removeEventListener = emitter.removeListener

  const activityMonitor = new ActivityMonitor(emitter, 1, (userWasActive) => {
    assertion(userWasActive)
    activityMonitor.stopWatchers()
  })

  activityMonitor.startWatchers(100)

  return emitter
}
