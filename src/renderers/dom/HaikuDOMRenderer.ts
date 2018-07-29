/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {IHaikuComponent, IRenderer, MountLayout} from '../../api';
import HaikuBase, {GLOBAL_LISTENER_KEY} from './../../HaikuBase';
import {getNodeCompositeId} from './../../HaikuComponent';
import assign from './../../vendor/assign';
import applyLayout from './applyLayout';
import assignAttributes from './assignAttributes';
import createRightClickMenu from './createRightClickMenu';
import createSvgElement from './createSvgElement';
import createTextNode from './createTextNode';
import getElementSize from './getElementSize';
import getLocalDomEventPosition from './getLocalDomEventPosition';
import getTypeAsString from './getTypeAsString';
import isBlankString from './isBlankString';
import isTextNode from './isTextNode';
import normalizeName from './normalizeName';
import removeElement from './removeElement';
import replaceElementWithText from './replaceElementWithText';

const isNil = (v) => {
  return v === undefined || v === null;
};

const connectTarget = (virtualNode, domElement) => {
  if (virtualNode && typeof virtualNode === 'object') {
    // This normally happens in HaikuComponent.hydrateNode, but we might be operating
    // as a thin-renderer where no hydration has occurred; so do the bootstrapping here.
    if (!virtualNode.__memory) {
      virtualNode.__memory = {};
    }

    // A virtual node can have multiple targets in the DOM due to an implementation
    // detail in the Haiku editing environment; FIXME
    if (!virtualNode.__memory.targets) {
      virtualNode.__memory.targets = [];
    }

    if (virtualNode.__memory.targets.indexOf(domElement) === -1) {
      virtualNode.__memory.targets.push(domElement);
    }
  }
};

// tslint:disable:variable-name
export default class HaikuDOMRenderer extends HaikuBase implements IRenderer {
  mount;
  config;
  user;
  shouldCreateContainer;

  constructor (mount, config) {
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

  clear () {
    if (this.mount) {
      while (this.mount.firstChild) {
        this.mount.removeChild(this.mount.firstChild);
      }
    }
  }

  getMountForComponent (component: IHaikuComponent) {
    // The component without a host is the root component, and uses this node.
    if (!component.host) {
      return this.mount;
    }
    return component.target && component.target.parentNode;
  }

  render (virtualContainer, virtualTree, component) {
    return HaikuDOMRenderer.renderTree(
      // The injected mount is for the case that the caller wants to render into a node
      // other than the root node of the context, for example calling render on a subcomponent
      this.getMountForComponent(component),
      virtualContainer,
      [virtualTree],
      component,
      false, // isPatchOperation
      false, // doSkipChildren
    );
  }

  patch (component, deltas) {
    // The component upstream may use an empty value to indicate a no-op
    if (!deltas || Object.keys(deltas).length < 1) {
      return;
    }

    for (const compositeId in deltas) {
      const virtualElement = deltas[compositeId];

      const parentVirtualElement = virtualElement.__memory && virtualElement.__memory.parent;

      const domTargets = virtualElement.__memory && virtualElement.__memory.targets;

      if (!domTargets) {
        continue;
      }

      for (let i = 0; i < domTargets.length; i++) {
        const domTarget = domTargets[i];

        if (domTarget.parentNode) {
          HaikuDOMRenderer.updateElement(
            domTarget, // DOM node
            virtualElement, // mana node
            domTarget.parentNode, // DOM node
            parentVirtualElement, // mana node
            component,
            true, // isPatchOperation
          );
        }
      }
    }
  }

  menuize (component) {
    return createRightClickMenu(this.mount, component);
  }

  mixpanel (mixpanelToken, component) {
    return mixpanelInit(mixpanelToken, component);
  }

  hasSizing () {
    return this.config && this.config.sizing && this.config.sizing !== 'normal';
  }

  getZoom () {
    return ((this.config && this.config.zoom) || 1.0);
  }

  getPan () {
    return {
      x: (this.config && this.config.pan && this.config.pan.x) || 0,
      y: (this.config && this.config.pan && this.config.pan.y) || 0,
    };
  }

  createContainer (out: MountLayout = {}): MountLayout {
    let size;
    if (this.mount) {
      size = getElementSize(this.mount);
    } else {
      console.warn('[haiku dom renderer] mount empty; using fallback size');
      size = {x: 1, y: 1};
    }

    out.layout = {
      computed: {
        size,
      },
    };

    if (!this.hasSizing() || !this.config.alwaysComputeSizing) {
      this.shouldCreateContainer = false;
    }

    return out;
  }

  getDocument () {
    return this.mount.ownerDocument;
  }

  getWindow () {
    const doc = this.getDocument();
    return doc.defaultView || doc.parentWindow;
  }

  initialize () {
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

    const doc = this.getDocument();
    const win = this.getWindow();

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

  decideMountElement (component: IHaikuComponent, selector: string, name: string) {
    // For keyboard events, if subscribed to the component, and if the component is the runtime root,
    // we automatically attach its handler to window, as this is the 98%-case desired behavior

    if (name === 'keyup' || name === 'keydown' || name === 'keypress') {
      if (!component.host && `haiku:${component.getComponentId()}` === selector) {
        const win = this.getWindow();
        return win;
      }
    }

    // Otherwise, fallthrough and assume we want to listen to our own mount element
    return this.mount;
  }

  mountEventListener (component: IHaikuComponent, selector: string, name: string, listener: Function) {
    let rewritten = name;

    if (name === 'mouseenter') {
      rewritten = 'mouseover';
    }

    if (name === 'mouseleave') {
      rewritten = 'mouseout';
    }

    const mount = this.decideMountElement(component, selector, name);

    mount.addEventListener(rewritten, (domEvent) => {
      // If no explicit selector/target for the event, just fire the listener
      if (
        !selector || selector === GLOBAL_LISTENER_KEY ||
        !domEvent || !domEvent.target
      ) {
        listener(null, this.wrapEvent(name, domEvent, null, component));
        return;
      }

      // If no queryable node has been rendered, we can't perform a match
      if (!component.target || !component.target.parentNode) {
        return;
      }

      let query = selector;

      // Convert haiku:* selectors into proper attribute selectors
      if (selector.slice(0, 6) === 'haiku:') {
        query = `[haiku-id="${selector.slice(6)}"]`;
      }

      // If the event originated from the element or its descendants
      const match = (component.target.parentNode as Element).querySelector(query);

      if (match) {
        if (this.shouldListenerReceiveEvent(name, domEvent, match, mount)) {
          listener(domEvent.target, this.wrapEvent(name, domEvent, match, component));
          return;
        }
      }
    });
  }

  shouldListenerReceiveEvent = (name: string, event, match: Element, mount): boolean => {
    if (name === 'keyup' || name === 'keydown' || name === 'keypress') {
      // See not about keyboard handling in HaikuDOMRenderer#decideMountElement
      if (mount === this.getWindow()) {
        return true;
      }
    }

    // Since we subscribe to events from the root element, we rewrite these as 'mouseover' and 'mouseout'
    // so we can adequately capture "bubbled" enters/leaves to meet the 99% expectation of users. Then
    // we mimic the bubbling logic here so the semantics align with normal DOM semantics
    if (name === 'mouseenter' || name === 'mouseleave') {
      return (
        match === event.target &&
        ( // Don't fire if the user's mouse went from inside the child into the target
          !match.contains ||
          !match.contains(event.relatedTarget)
        )
      );
    }

    return (
      match === event.target ||
      (match.contains && match.contains(event.target))
    );
  };

  /**
   * @description An opportunity to return an event aligned with our own API semantics.
   * Keep in mind that the three elements involved here may be different:
   *   this.mount - the host node for the component, the node we actually attach listeners to.
   *   event.target - the element on which the event actually originated
   *   elementListenedTo - the element that the user is listening to the event on
   */
  wrapEvent (eventName: string, nativeEvent, elementListenedTo, hostComponent: IHaikuComponent) {
    return nativeEvent;
  }

  getUser () {
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

  static createTagNode (
    domElement,
    virtualElement,
    parentVirtualElement,
    component,
  ) {
    const tagName = normalizeName(getTypeAsString(virtualElement));
    const compositeId = getNodeCompositeId(virtualElement);

    let newDomElement;
    if (SVG_ELEMENT_NAMES[tagName]) {
      // SVG
      newDomElement = createSvgElement(domElement, tagName);
    } else {
      // Normal DOM
      newDomElement = domElement.ownerDocument.createElement(tagName);
    }

    // This didn't happen in renderTree because the element didn't exist yet.
    if (!newDomElement.haiku) {
      newDomElement.haiku = {
        // This is used to detect whether the element's host component has changed.
        // Don't remove this without understanding the effect on Haiku.app.
        component,
      };
    }

    component.subcacheEnsure(compositeId);

    const incomingKey =
      virtualElement.key ||
      (virtualElement.attributes && virtualElement.attributes.key);

    if (incomingKey !== undefined && incomingKey !== null) {
      newDomElement.haiku.key = incomingKey;
    }

    // updateElement recurses down into setAttributes, etc.
    HaikuDOMRenderer.updateElement(newDomElement, virtualElement, domElement, parentVirtualElement, component, null);

    return newDomElement;
  }

  static appendChild (
    alreadyChildElement,
    virtualElement,
    parentDomElement,
    parentVirtualElement,
    component,
  ) {
    const domElementToInsert = isTextNode(virtualElement)
      ? createTextNode(parentDomElement, virtualElement)
      : HaikuDOMRenderer.createTagNode(parentDomElement, virtualElement, parentVirtualElement, component);

    applyLayout(domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, component, null);

    parentDomElement.appendChild(domElementToInsert);
    return domElementToInsert;
  }

  static replaceElement (
    domElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    component,
  ) {
    const compositeId = getNodeCompositeId(virtualElement);

    component.subcacheClear(compositeId);

    const newElement = isTextNode(virtualElement)
      ? createTextNode(domElement, virtualElement)
      : HaikuDOMRenderer.createTagNode(domElement, virtualElement, parentVirtualElement, component);

    applyLayout(newElement, virtualElement, parentDomNode, parentVirtualElement, component, null);

    parentDomNode.replaceChild(newElement, domElement);

    return newElement;
  }

  static updateElement (
    domElement,
    virtualElement,
    parentNode,
    parentVirtualElement,
    component,
    isPatchOperation,
  ) {
    const compositeId = getNodeCompositeId(virtualElement);

    // If a text node, go straight to 'replace' since we don't know the tag name
    if (isTextNode(virtualElement)) {
      replaceElementWithText(domElement, virtualElement, component);
      return virtualElement;
    }

    if (!domElement.haiku) {
      domElement.haiku = {
        // This is used to detect whether the element's host component has changed.
        // Don't remove this without understanding the effect on Haiku.app.
        component,
      };
    }

    component.subcacheEnsure(compositeId);

    if (!domElement.haiku.element) {
      // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute
      // removals
      domElement.haiku.element = HaikuDOMRenderer.cloneVirtualElement(virtualElement);
    }

    const domTagName = domElement.tagName.toLowerCase().trim();
    const elName = normalizeName(getTypeAsString(virtualElement));
    const virtualElementTagName = elName.toLowerCase().trim();
    const incomingKey = virtualElement.key || (virtualElement.attributes && virtualElement.attributes.key);
    const existingKey = domElement.haiku && domElement.haiku.key;
    const isKeyDifferent = incomingKey !== null && incomingKey !== undefined && incomingKey !== existingKey;

    // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
    // so the most we want to do is update the attributes and layout properties, but leave the rest alone
    if (!component.isHorizonElement(virtualElement)) {
      if (domTagName !== virtualElementTagName) {
        return HaikuDOMRenderer.replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, component);
      }

      if (isKeyDifferent) {
        return HaikuDOMRenderer.replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, component);
      }
    }

    if (virtualElement.attributes && typeof virtualElement.attributes === 'object') {
      assignAttributes(domElement, virtualElement, component, isPatchOperation);
    }

    applyLayout(
      domElement,
      virtualElement,
      parentNode,
      parentVirtualElement,
      component,
      isPatchOperation,
    );

    if (incomingKey !== undefined && incomingKey !== null) {
      domElement.haiku.key = incomingKey;
    }

    const instance = (
      virtualElement &&
      virtualElement.__memory &&
      virtualElement.__memory.instance
    ) || component;

    if (Array.isArray(virtualElement.children)) {
      // For performance, we don't render children during a patch operation, except in the case
      // that we have some text content, which we (hack) need to always assume needs an update.
      // TODO: Fix this hack and make smarter
      const doSkipChildren = (
        isPatchOperation &&
        (typeof virtualElement.children[0] !== 'string')
      );

      HaikuDOMRenderer.renderTree(
        domElement,
        virtualElement,
        virtualElement.children,
        instance,
        isPatchOperation,
        doSkipChildren,
      );
    } else if (!virtualElement.children) {
      // In case of falsy virtual children, we still need to remove elements that were already there
      HaikuDOMRenderer.renderTree(
        domElement,
        virtualElement,
        [],
        instance,
        isPatchOperation,
        null,
      );
    }

    return domElement;
  }

  static renderTree (
    domElement,
    virtualElement,
    virtualChildren,
    component,
    isPatchOperation,
    doSkipChildren,
  ) {
    // E.g. I might want to inspect the dom node, grab the haiku source data, etc.
    connectTarget(virtualElement, domElement);

    const compositeId = getNodeCompositeId(virtualElement);

    if (!domElement.haiku) {
      domElement.haiku = {
        // This is used to detect whether the element's host component has changed.
        // Don't remove this without understanding the effect on Haiku.app.
        component,
      };
    }

    domElement.haiku.virtual = virtualElement;

    // Must clone so we get a correct picture of differences in attributes
    // between runs, e.g. for detecting attribute removals
    domElement.haiku.element = HaikuDOMRenderer.cloneVirtualElement(virtualElement);

    component.subcacheEnsure(compositeId);

    if (!Array.isArray(virtualChildren)) {
      return domElement;
    }

    // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
    // so the most we want to do is update the attributes and layout properties, but leave the rest alone
    if (component.isHorizonElement(virtualElement)) {
      return domElement;
    }

    // During patch renders we don't want to drill down and update children as
    // we're just going to end up doing a lot of unnecessary DOM writes
    if (doSkipChildren) {
      return domElement;
    }

    while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
      virtualChildren.shift();
    }

    // Store a copy of the array here, otherwise we can hit a race where as we remove
    // elements from the DOM, the childNodes array gets shifted and the indices get offset, leading
    // to removals not occurring properly
    const domChildNodes = [];
    for (let k = 0; k < domElement.childNodes.length; k++) {
      domChildNodes[k] = domElement.childNodes[k];
    }

    let max = virtualChildren.length;
    if (max < domChildNodes.length) {
      max = domChildNodes.length;
    }

    for (let i = 0; i < max; i++) {
      const virtualChild = virtualChildren[i];
      const domChild = domChildNodes[i];

      if (isNil(virtualChild) && !domChild) {
        // empty
      } else if (isNil(virtualChild) && domChild) {
        removeElement(domChild, compositeId, component);
      } else {
        if (!domChild) {
          const insertedElement = HaikuDOMRenderer.appendChild(
            null,
            virtualChild,
            domElement,
            virtualElement,
            component,
          );
          connectTarget(virtualChild, insertedElement);
        } else {
          // Circumstances in which we want to completely *replace* the element:
          // - We see that our cached target element is not the one at this location
          // - We see that the DOM id doesn't match the incoming one
          // - we see that the haiku-id doesn't match the incoming one.
          // If we now have an element that is different, we need to trigger a full re-render
          // of itself and all of its children, because e.g. url(#...) references will retain pointers to
          // old elements and this is the only way to clear the DOM to get a correct render.
          const shouldReplace = HaikuDOMRenderer.shouldElementBeReplaced(domChild, virtualChild, component);

          if (shouldReplace) {
            const newElement = HaikuDOMRenderer.replaceElement(
              domChild,
              virtualChild,
              domElement,
              virtualElement,
              component,
            );
            connectTarget(virtualChild, newElement);
          } else {
            HaikuDOMRenderer.updateElement(
              domChild,
              virtualChild,
              domElement,
              virtualElement,
              component,
              isPatchOperation,
            );
            connectTarget(virtualChild, domChild);
          }
        }
      }
    }

    return domElement;
  }

  static shouldElementBeReplaced (domElement, virtualElement, component) {
    if (domElement.haiku) {
      const compositeIdNew = getNodeCompositeId(virtualElement);
      const compositeIdOld = getNodeCompositeId(domElement.haiku.element);

      if (compositeIdNew !== compositeIdOld) {
        return true;
      }

      if (domElement.haiku.component) {
        // If the element carried at this node has a different host component,
        // we should do a full replacement, since the cache of the two instances
        // are different and may result in different (cached) rendering output
        if (domElement.haiku.component !== component) {
          return true;
        }
      }
    }

    return false;
  }

  static cloneAttributes (attributes) {
    if (!attributes) {
      return {};
    }
    const clone = {};
    for (const key in attributes) {
      clone[key] = attributes[key];
    }
    return clone;
  }

  static cloneVirtualElement (virtualElement) {
    return {
      elementName: virtualElement.elementName,
      attributes: HaikuDOMRenderer.cloneAttributes(virtualElement.attributes),
      children: virtualElement.children,
      __memory: virtualElement.__memory,
    };
  }

  static __name__ = 'HaikuDOMRenderer';
}

const SVG_ELEMENT_NAMES = {
  a: true,
  altGlyph: true,
  altGlyphDef: true,
  altGlyphItem: true,
  animate: true,
  animateColor: true,
  animateMotion: true,
  animateTransform: true,
  circle: true,
  clipPath: true,
  'color-profile': true,
  cursor: true,
  defs: true,
  desc: true,
  discard: true,
  ellipse: true,
  feBlend: true,
  feColorMatrix: true,
  feComponentTransfer: true,
  feComposite: true,
  feConvolveMatrix: true,
  feDiffuseLighting: true,
  feDisplacementMap: true,
  feDistantLight: true,
  feFlood: true,
  feFuncA: true,
  feFuncB: true,
  feFuncG: true,
  feFuncR: true,
  feGaussianBlur: true,
  feImage: true,
  feMerge: true,
  feMergeNode: true,
  feMorphology: true,
  feOffset: true,
  fePointLight: true,
  feSpecularLighting: true,
  feSpotLight: true,
  feTile: true,
  feTurbulence: true,
  filter: true,
  font: true,
  'font-face': true,
  'font-face-format': true,
  'font-face-name': true,
  'font-face-src': true,
  'font-face-uri': true,
  foreignObject: true,
  g: true,
  glyph: true,
  glyphRef: true,
  hkern: true,
  image: true,
  line: true,
  linearGradient: true,
  marker: true,
  mask: true,
  metadata: true,
  'missing-glyph': true,
  mpath: true,
  path: true,
  pattern: true,
  polygon: true,
  polyline: true,
  radialGradient: true,
  rect: true,
  script: true,
  set: true,
  stop: true,
  style: true,
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  title: true,
  tref: true,
  tspan: true,
  use: true,
  view: true,
  vkern: true,
};

/* tslint:disable */
const mixpanelSnippetInjector = new Function(`
  (function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window['mixpanel']=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
  0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
  for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;}})(document,window.mixpanel||[]);
`);
/* tslint:enable */

declare var window: any;

const mixpanelInit = (mixpanelToken, component) => {
  // Only initialize Mixpanel if we're running in the browser
  if (typeof window !== 'undefined') {
    // Don't initialize multiple times if multiple components are on the page
    if (!window.mixpanel) {
      mixpanelSnippetInjector();

      const head = document.getElementsByTagName('head')[0];

      const script = document.createElement('script');
      script.async = true;
      script.type = 'text/javascript';
      script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
      head.appendChild(script);

      window.mixpanel.init(mixpanelToken, {ip: false});
    }

    const metadata = (component.bytecode && component.bytecode.metadata) || {};

    window.mixpanel.track(
      'component:initialize',
      assign(
        {
          platform: 'dom',
        },
        metadata,
      ),
    );
  }
};
