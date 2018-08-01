/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {IRenderer, MountLayout} from '../../api';
import HaikuBase from '../../HaikuBase';
import HaikuComponent from '../../HaikuComponent';
import {manaToXml} from '../../HaikuNode';
import HaikuDOMRenderer from '../dom/HaikuDOMRenderer';
import VirtualNode, {VirtualDoc} from './VirtualNode';

export default class HaikuHTMLRenderer extends HaikuBase implements IRenderer {
  mount;
  config;
  doc;

  constructor (mount, config) {
    super();

    this.mount = mount;
    this.config = config;
    this.doc = new VirtualDoc({});

    if (!this.config.size) {
      throw new Error(`HaikuHTMLRenderer requires config.size`);
    }

    if (!this.config.user) {
      throw new Error(`HaikuHTMLRenderer requires config.user`);
    }
  }

  render (virtualContainer, virtualTree, component): string {
    const enhancedMana = HaikuDOMRenderer.renderTree(
      this.mount || new VirtualNode('div', {}, [], this.doc),
      virtualContainer,
      [virtualTree],
      component,
      false, // isPatchOperation
      false, // doSkipChildren
    );

    return manaToXml(
      '',
      enhancedMana,
      {}, // mapping
      {}, // options
    );
  }

  hasSizing () {
    return false;
  }

  createContainer (out: MountLayout = {}): MountLayout {
    out.layout = {
      computed: {
        size: this.config.size,
      },
    };

    return out;
  }

  initialize () {
    // no-op
  }

  mountEventListener (component: HaikuComponent, selector: string, name: string, listener: Function) {
    // no-op
  }

  getUser () {
    return this.config.user;
  }
}
