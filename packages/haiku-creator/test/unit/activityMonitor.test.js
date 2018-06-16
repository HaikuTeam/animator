import * as tape from 'tape';
import * as EventEmitter from 'events';
import ActivityMonitor from '@creator/utils/activityMonitor';

tape('ActivityMonitor detects activity on the correct events', t => {
  t.plan(1)

  const context = setContextAndAssert((userWasActive) => {
    t.ok(userWasActive, 'activity was detected')
  })

  context.emit('mousemove')
})


tape('ActivityMonitor does not detect activity on random events', t => {
  t.plan(1)

  let activityDetected = false

  const context = setContextAndAssert((userWasActive) => {
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

  const activityMonitor = new ActivityMonitor(emitter, (userWasActive) => {
    assertion(userWasActive)
    activityMonitor.stopWatchers()
  }, 1)

  activityMonitor.startWatchers(100)

  return emitter
}
