const globals = {
  mouse: { x: 0, y: 0 }
}

window.addEventListener('mousemove', (mouseMoveEvent) => {
  globals.mouse.x = mouseMoveEvent.clientX
  globals.mouse.y = mouseMoveEvent.clientY
})

module.exports = globals
