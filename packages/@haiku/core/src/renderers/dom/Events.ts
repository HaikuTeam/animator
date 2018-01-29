/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

// Each of these would have an on* prefix normally
export default {
  mouse: {
    click: {
      menuable: true,
      human: 'Click',
    },
    dblclick: {
      menuable: true,
      human: 'Double Click',
    },
    mousedown: {
      menuable: true,
      human: 'Mouse Down',
    },
    mouseup: {
      menuable: true,
      human: 'Mouse Up',
    },
    mousemove: {
      menuable: true,
      human: 'Mouse Move',
    },
    mouseover: {
      menuable: true,
      human: 'Mouse Over',
    },
    mouseout: {
      menuable: true,
      human: 'Mouse Out',
    },
    mouseenter: {
      menuable: true,
      human: 'Mouse Enter',
    },
    mouseleave: {
      menuable: true,
      human: 'Mouse Leave',
    },
    wheel: {
      menuable: false,
    },
    scroll: {
      menuable: true,
      human: 'Scroll',
    },
  },
  touch: {
    touchstart: {
      menuable: true,
      human: 'Touch Start',
    },
    touchend: {
      menuable: true,
      human: 'Touch End',
    },
    touchmove: {
      menuable: true,
      human: 'Touch Move',
    },
    touchcancel: {
      menuable: true,
      human: 'Touch Cancel',
    },
  },
  keyboard: {
    keyup: {
      menuable: true,
      human: 'Key Up',
    },
    keydown: {
      menuable: true,
      human: 'Key Down',
    },
    keypress: {
      menuable: false,
    },
  },
  drag: {
    drag: {
      menuable: false,
    },
    dragend: {
      menuable: false,
    },
    dragenter: {
      menuable: false,
    },
    dragleave: {
      menuable: false,
    },
    dragover: {
      menuable: false,
    },
    dragstart: {
      menuable: false,
    },
    drop: {
      menuable: false,
    },
  },
  form: {
    focus: {
      menuable: true,
      human: 'Focus',
    },
    blur: {
      menuable: true,
      human: 'Blur',
    },
    change: {
      menuable: true,
      human: 'Change',
    },
    select: {
      menuable: true,
      human: 'Select',
    },
    submit: {
      menuable: true,
      human: 'Submit',
    },
    contextmenu: {
      menuable: false,
    },
    input: {
      menuable: false,
    },
    invalid: {
      menuable: false,
    },
    reset: {
      menuable: false,
    },
    search: {
      menuable: false,
    },
  },
  text: {
    cut: {
      menuable: false,
    },
    copy: {
      menuable: false,
    },
    paste: {
      menuable: false,
    },
  },
  window: {
    resize: {
      menuable: true,
      human: 'Window Resize',
    },
    popstate: {
      menuable: true,
      human: 'URL Change',
    },
    hashchange: {
      menuable: true,
      human: 'Anchor Change',
    },
    load: {
      menuable: false,
    },
    message: {
      menuable: false,
    },
    afterprint: {
      menuable: false,
    },
    beforeprint: {
      menuable: false,
    },
    beforeunload: {
      menuable: false,
    },
    error: {
      menuable: false,
    },
    offline: {
      menuable: false,
    },
    online: {
      menuable: false,
    },
    pagehide: {
      menuable: false,
    },
    pageshow: {
      menuable: false,
    },
    storage: {
      menuable: false,
    },
    unload: {
      menuable: false,
    },
  },
  media: {
    abort: {
      menuable: false,
    },
    canplay: {
      menuable: false,
    },
    canplaythrough: {
      menuable: false,
    },
    cuechange: {
      menuable: false,
    },
    durationchange: {
      menuable: false,
    },
    emptied: {
      menuable: false,
    },
    ended: {
      menuable: false,
    },
    error: {
      menuable: false,
    },
    loadeddata: {
      menuable: false,
    },
    loadedmetadata: {
      menuable: false,
    },
    loadstart: {
      menuable: false,
    },
    pause: {
      menuable: false,
    },
    play: {
      menuable: false,
    },
    playing: {
      menuable: false,
    },
    progress: {
      menuable: false,
    },
    ratechange: {
      menuable: false,
    },
    seeked: {
      menuable: false,
    },
    seeking: {
      menuable: false,
    },
    stalled: {
      menuable: false,
    },
    suspend: {
      menuable: false,
    },
    timeupdate: {
      menuable: false,
    },
    volumechange: {
      menuable: false,
    },
    waiting: {
      menuable: false,
    },
  },
  other: {
    show: {
      menuable: false,
    },
    toggle: {
      menuable: false,
    },
  },
};
