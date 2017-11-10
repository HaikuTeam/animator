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

module.exports = globals
