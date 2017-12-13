const Globals = {
  mouse: {x: 0, y: 0},
  // Control and shift keys are managed from Timeline.js
  isShiftKeyDown: false,
  isControlKeyDown: false,
};

window.addEventListener('mousemove', (mouseMoveEvent) => {
  Globals.mouse.x = mouseMoveEvent.clientX;
  Globals.mouse.y = mouseMoveEvent.clientY;
});

window.addEventListener('keyup', (keyupEvent) => {
  if (keyupEvent.which === 16) { Globals.isShiftKeyDown = false; }
  if (keyupEvent.which === 17) { Globals.isControlKeyDown = false; }
});

window.addEventListener('keydown', (keydownEvent) => {
  if (keydownEvent.which === 16) { Globals.isShiftKeyDown = true; }
  if (keydownEvent.which === 17) { Globals.isControlKeyDown = true; }
});

window.addEventListener('click', (clickEvent) => {
  if (Globals.isControlKeyDown) {
    Globals.isControlKeyDown = false;
    Globals.isShiftKeyDown = false;
  }
});

export default Globals;
