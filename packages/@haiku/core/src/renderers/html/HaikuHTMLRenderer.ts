/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import render from '../dom/render';
import manaToXml from '../../helpers/manaToXml';
import VirtualNode, {VirtualDoc} from './VirtualNode';

export default class HaikuHTMLRenderer {
  config;
  doc;

  constructor(config) {
    this.config = config;
    this.doc = new VirtualDoc({});

    if (!this.config.options) {
      throw new Error(`HaikuHTMLRenderer requires config.options`);
    }

    if (!this.config.options.size) {
      throw new Error(`HaikuHTMLRenderer requires config.options.size`);
    }

    if (!this.config.options.user) {
      throw new Error(`HaikuHTMLRenderer requires config.options.user`);
    }
  }

  render(mount, virtualContainer, virtualTree, component): string {
    const enhancedMana = render(
      mount || new VirtualNode('div', {}, [], this.doc),
      virtualContainer,
      virtualTree,
      component,
    );

    return manaToXml(
      '',
      enhancedMana,
      {}, // mapping
      {}, // options
    );
  }

  hasSizing() {
    return false;
  }

  createContainer() {
    return {
      isContainer: true,
      layout: {
        computed: {
          size: this.config.options.size,
        },
      },
    };
  }

  getLastContainer() {
    return this.createContainer();
  }

  initialize() {
    // no-op
  }

  removeListener() {
    // no-op
  }

  getUser() {
    return this.config.options.user;
  }
}
