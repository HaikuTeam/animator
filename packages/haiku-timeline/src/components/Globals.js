import { experimentIsEnabled, Experiment } from 'haiku-common/lib/experiments';

const globals = {
  mouse: { x: 0, y: 0 },
  // Control and shift keys are managed from Timeline.js
  isShiftKeyDown: false,
  isControlKeyDown: false
}

window.addEventListener('mousemove', (mouseMoveEvent) => {
  globals.mouse.x = mouseMoveEvent.clientX
  globals.mouse.y = mouseMoveEvent.clientY
})

window.addEventListener('keyup', (keyupEvent) => {
  if (keyupEvent.which === 16) globals.isShiftKeyDown = false
  if (keyupEvent.which === 17) globals.isControlKeyDown = false
})

window.addEventListener('keydown', (keydownEvent) => {
  if (keydownEvent.which === 16 && experimentIsEnabled(Experiment.TimelineShiftKeyBehaviors)) {
    globals.isShiftKeyDown = true
  }
  if (keydownEvent.which === 17) globals.isControlKeyDown = true
})

window.addEventListener('click', (clickEvent) => {
  if (globals.isControlKeyDown) {
    globals.isControlKeyDown = false
    globals.isShiftKeyDown = false
  }
})

module.exports = globals
