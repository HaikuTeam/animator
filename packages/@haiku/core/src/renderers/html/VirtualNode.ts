export class VirtualDoc {
  defaultView: any;
  parentWindow: any;

  constructor(win: any) {
    this.defaultView = win;
    this.parentWindow = win;
  }

  createElementNS(namespace: string, name: string): VirtualNode {
    return new VirtualNode(
      name,
      {},
      [],
      this,
    );
  }

  createElement(name: string): VirtualNode {
    return new VirtualNode(
      name,
      {},
      [],
      this,
    );
  }

  createTextNode (text: string): string {
    return text + '';
  }
}

export class VirtualStyle {
  hostNode: VirtualNode;
  properties: any;

  constructor(hostNode: VirtualNode, properties: any) {
    this.hostNode = hostNode;
    this.properties = properties || {};
  }

  removeProperty(name: string) {
    delete this.properties[name];
  }
}

export default class VirtualNode {
  elementName: any;
  attributes: any;
  children: any;
  listeners: any;
  ownerDocument: VirtualDoc;

  haiku: any;

  constructor (elementName: any, attributes: any, children: any, ownerDocument: VirtualDoc) {
    this.elementName = elementName;

    this.attributes = attributes || {};

    if (!this.attributes.style) {
      this.attributes.style = {};
    }
    this.attributes.style = new VirtualStyle(this, this.attributes.style);

    this.children = children || [];

    this.ownerDocument = ownerDocument;

    this.listeners = {};
  }

  get style(): VirtualStyle {
    return this.attributes.style;
  }

  get childNodes() {
    return this.children;
  }

  get tagName() {
    return this.elementName.toUpperCase();
  }

  appendChild(child: VirtualNode|string) {
    this.children.push(child);
  }

  replaceChild(incoming: any, existing: any) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i] === existing) {
        this.children.splice(i, 1, incoming);
      }
    }
  }

  removeChild(existing: any) {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i] === existing) {
        this.children.splice(i, 1); 
      }
    }
  }

  removeAttribute(name: string) {
    delete this.attributes[name];
  }

  setAttribute(name: string, value: any) {
    this.attributes[name] = value;
  }

  getAttribute(name: string) {
    return this.attributes[name];
  }

  getAttributeNS(ns: string, name: string) {
    return this.attributes[name];
  }

  setAttributeNS(ns: string, name: string, value: any) {
    this.attributes[name] = value;
  }

  addEventListener(name: string, fn: Function) {
    if (!this.listeners[name]) {
      this.listeners[name] = [];
    }

    this.listeners[name].push(fn);
  }

  getBoundingClientRect() {
    return {
      top: 1,
      right: 1,
      bottom: 1,
      left: 1,
      width: 1,
      height: 1,
    };
  }
}
