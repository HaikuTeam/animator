/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import HaikuBase, {GLOBAL_LISTENER_KEY} from './../../HaikuBase';
import mixpanelInit from './mixpanelInit';
import createRightClickMenu from './createRightClickMenu';
import domToMana from './../../helpers/domToMana';
import getElementSize from './getElementSize';
import getLocalDomEventPosition from './getLocalDomEventPosition';
import patch from './patch';
import render from './render';

// tslint:disable:variable-name
export default class HaikuDOMRenderer extends HaikuBase {
  mount;
  config;
  user;
  shouldCreateContainer;

  constructor(mount, config) {
    super();

    this.mount = mount;

    this.user = {
      mouse: {
        x: 0,
        y: 0,
        down: 0,
        buttons: [0, 0, 0], // Assume most mouses have 3 buttons?
      },
      keys: {},
      touches: [], // [{ x: 'number', y: 'number' }]
      mouches: [], // [{ x: 'number', y: 'number' }] - Both touches and mouse cursor info
    };

    this.config = config;

    this.shouldCreateContainer = true;

    // Ensure we don't conflict with existing content in the mount
    this.clear();
  }

  clear() {
    if (this.mount) {
      while (this.mount.firstChild) {
        this.mount.removeChild(this.mount.firstChild);
      }
    }
  }

  render(virtualContainer, virtualTree, component) {
    return render(this.mount, virtualContainer, virtualTree, component);
  }

  patch(component, patches) {
    return patch(component, patches);
  }

  menuize(component) {
    return createRightClickMenu(this.mount, component);
  }

  mixpanel(mixpanelToken, component) {
    return mixpanelInit(mixpanelToken, component);
  }

  hasSizing() {
    return this.config && this.config.sizing && this.config.sizing !== 'normal';
  }

  getZoom() {
    return ((this.config && this.config.zoom) || 1.0);
  }

  getPan() {
    return {
      x: (this.config && this.config.pan && this.config.pan.x) || 0,
      y: (this.config && this.config.pan && this.config.pan.y) || 0,
    };
  }

  createContainer(out = {}) {
    let size;
    if (this.mount) {
      size = getElementSize(this.mount);
    } else {
      console.warn('[haiku dom renderer] mount empty; using fallback size');
      size = {x: 1, y: 1};
    }

    out['layout'] = {
      computed: {
        size,
      },
    };

    if (!this.hasSizing() || !this.config.alwaysComputeSizing) {
      this.shouldCreateContainer = false;
    }

    return out;
  }

  initialize() {
    const user = this.user;

    const setMouse = (mouseEvent) => {
      // Since the mount itself might be subject to sizing styles that we cannot
      // use to calculate appropriately, use the top element i.e. the 'artboard'
      const topElement = this.mount.childNodes[0];
      if (topElement) {
        const pos = getLocalDomEventPosition(mouseEvent, topElement);
        user.mouse.x = pos.x;
        user.mouse.y = pos.y;
      }
    };

    const setTouches = (touchEvent) => {
      user.touches.splice(0);
      // Since the mount itself might be subject to sizing styles that we cannot
      // use to calculate appropriately, use the top element i.e. the 'artboard'
      const topElement = this.mount.childNodes[0];
      if (topElement) {
        for (let i = 0; i < touchEvent.touches.length; i++) {
          const touch = touchEvent.touches[i];
          const pos = getLocalDomEventPosition(touch, topElement);
          user.touches.push(pos);
        }
      }
    };

    const setMouches = () => {
      user.mouches.splice(0);
      // Only treat a mouse like a touch if it is down.
      if (user.mouse.down) {
        user.mouches.push(user.mouse);
      }
      user.mouches.push.apply(user.mouches, user.touches);
    };

    const clearKey = () => {
      for (const which in user.keys) {
        user.keys[which] = 0;
      }
    };

    const clearMouse = () => {
      user.mouse.down = 0;
      user.touches.splice(0);
      for (let i = 0; i < user.mouse.buttons.length; i++) {
        user.mouse.buttons[i] = 0;
      }
    };

    const clearMouch = () => {
      user.mouches.splice(0);
    };

    const clearTouch = () => {
      user.touches.splice(0);
    };

    const doc = this.mount.ownerDocument;
    const win = doc.defaultView || doc.parentWindow;

    this.mount.addEventListener('mousedown', (mouseEvent) => {
      ++user.mouse.down;
      ++user.mouse.buttons[mouseEvent.button];
      setMouse(mouseEvent);
      setMouches();
    });

    this.mount.addEventListener('mouseup', (mouseEvent) => {
      clearMouse();
      clearMouch();
      setMouches();
    });

    // NOTE: if there are perf or interop issues that arise from
    //       attaching event listeners directly to host window,
    //       could expose a haikuOption for reverting to "attach to mount" behavior
    win.addEventListener('mousemove', (mouseEvent) => {
      setMouse(mouseEvent);
      setMouches();
    });

    win.addEventListener('mouseenter', (mouseEvent) => {
      clearMouse();
      clearMouch();
    });

    win.addEventListener('mouseleave', (mouseEvent) => {
      clearMouse();
      clearMouch();
    });

    this.mount.addEventListener(
      'wheel',
      (mouseEvent) => {
        setMouse(mouseEvent);
        setMouches();
      },
      {
        passive: true, // Avoid perf warnings. TODO: Make configurable
      },
    );

    doc.addEventListener('keydown', (keyEvent) => {
      if (user.keys[keyEvent.which] === undefined) {
        user.keys[keyEvent.which] = 0;
      }
      ++user.keys[keyEvent.which];
    });

    doc.addEventListener('keyup', (keyEvent) => {
      if (user.keys[keyEvent.which] === undefined) {
        user.keys[keyEvent.which] = 0;
      }

      // Known Mac "feature" where keyup never fires while meta key (91) is down
      // When right-click menu is toggled we don't get all mouseup events
      if (keyEvent.which === 91 || keyEvent.which === 17) {
        clearKey();
      }

      user.keys[keyEvent.which] = 0;
    });

    // If there's any sizing mode that requires computation of container size
    // and alwaysComputeSizing is *disabled*, make an "overriding" assumption
    // that we probably want to recompute the container when media queries change.
    if (this.hasSizing() && !this.config.alwaysComputeSizing) {
      win.addEventListener('resize', () => {
        this.shouldCreateContainer = true;
      });

      win.addEventListener('orientationchange', () => {
        this.shouldCreateContainer = true;
      });
    }

    win.addEventListener('blur', (blurEvent) => {
      clearKey();
      clearMouse();
      clearTouch();
      clearMouch();
    });

    win.addEventListener('focus', (blurEvent) => {
      clearKey();
      clearMouse();
      clearTouch();
      clearMouch();
    });

    win.addEventListener(
      'touchstart',
      (touchEvent) => {
        setTouches(touchEvent);
        setMouches();
      },
      {
        passive: true, // Avoid perf warnings. TODO: Make configurable
      },
    );

    win.addEventListener('touchend', (touchEvent) => {
      clearTouch();
      clearMouch();
    });

    win.addEventListener(
      'touchmove',
      (touchEvent) => {
        setTouches(touchEvent);
        setMouches();
      },
      {
        passive: true, // Avoid perf warnings. TODO: Make configurable
      },
    );

    win.addEventListener('touchenter', (touchEvent) => {
      clearTouch();
      clearMouch();
    });

    win.addEventListener('touchleave', (touchEvent) => {
      clearTouch();
      clearMouch();
    });
  }

  mountEventListener(selector: string, name: string, listener: Function) {
    this.mount.addEventListener(name, (domEvent) => {
      // If no explicit selector/target for the event, just fire the listener
      if (
        !selector || selector === GLOBAL_LISTENER_KEY ||
        !domEvent || !domEvent.target
      ) {
        listener(null, domEvent);
        return;
      }

      let query = selector;

      // Convert haiku:* selectors into proper attribute selectors
      if (selector.slice(0, 6) === 'haiku:') {
        query = `[haiku-id="${selector.slice(6)}"]`;
      }

      // If the event originated from the element or its descendants
      const match = this.mount.querySelector(query);

      if (match) {
        if (
          match === domEvent.target ||
          (match.contains && match.contains(domEvent.target))
        ) {
          listener(domEvent.target, domEvent);
          return;
        }
      }
    });
  }

  getUser() {
    const zoom = this.getZoom();
    const pan = this.getPan();
    return {
      zoom,
      pan,
      mouse: {
        x: (this.user.mouse.x) / zoom,
        y: (this.user.mouse.y) / zoom,
        down: this.user.mouse.down,
        buttons: [...this.user.mouse.buttons],
      },
      keys: {...this.user.keys},
      touches: [...this.user.touches],
      mouches: [...this.user.mouches],
    };
  }
}
