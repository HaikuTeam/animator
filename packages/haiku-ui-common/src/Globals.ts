import {isMac} from 'haiku-common/lib/environments/os';

/* tslint:disable:variable-name */
const Globals = {
  mouse: {x: 0, y: 0},
  // Control and shift keys are managed from Timeline.js
  isShiftKeyDown: false,
  isControlKeyDown: false,
  isAltKeyDown: false,
  isCommandKeyDown: false,
  isSpaceKeyDown: false,

  allKeysUp: () => {
    Globals.isShiftKeyDown = false;
    Globals.isControlKeyDown = false;
    Globals.isCommandKeyDown = false;
    Globals.isAltKeyDown = false;
    Globals.isSpaceKeyDown = false;
  },

  // Special key is resposible for initiating rotate and reset zoom
  isSpecialKeyDown: () => {
    if (isMac()) {
      return Globals.isCommandKeyDown;
    }
    return Globals.isControlKeyDown;
  },
};

window.addEventListener('mousemove', (mouseMoveEvent) => {
  Globals.mouse.x = mouseMoveEvent.clientX;
  Globals.mouse.y = mouseMoveEvent.clientY;
});

window.addEventListener('keyup', (keyupEvent) => {
  if (keyupEvent.which === 16) {
    Globals.isShiftKeyDown = false;
  }
  if (keyupEvent.which === 17) {
    Globals.isControlKeyDown = false;
  }
  if (keyupEvent.which === 18) {
    Globals.isAltKeyDown = false;
  }
  if (keyupEvent.which === 224) {
    Globals.isCommandKeyDown = false;
  }
  if (keyupEvent.which === 91) {
    Globals.isCommandKeyDown = false;
  }
  if (keyupEvent.which === 93) {
    Globals.isCommandKeyDown = false;
  }
  if (keyupEvent.which === 32) {
    Globals.isSpaceKeyDown = false;
  }
});

window.addEventListener('keydown', (keydownEvent) => {
  if (keydownEvent.which === 16) {
    Globals.isShiftKeyDown = true;
  }
  if (keydownEvent.which === 17) {
    Globals.isControlKeyDown = true;
  }
  if (keydownEvent.which === 18) {
    Globals.isAltKeyDown = true;
  }
  if (keydownEvent.which === 224) {
    Globals.isCommandKeyDown = true;
  }
  if (keydownEvent.which === 91) {
    Globals.isCommandKeyDown = true;
  }
  if (keydownEvent.which === 93) {
    Globals.isCommandKeyDown = true;
  }
  if (keydownEvent.which === 32) {
    Globals.isSpaceKeyDown = true;
  }
});

window.addEventListener('click', (clickEvent) => {
  // When entering the context menu via control-click, unset all key states to off
  if (Globals.isControlKeyDown) {
    Globals.allKeysUp();
  }
});

window.addEventListener('contextmenu', (clickEvent) => {
  // When entering the context menu via control-click, unset all key states to off
  Globals.allKeysUp();
});

export default Globals;
