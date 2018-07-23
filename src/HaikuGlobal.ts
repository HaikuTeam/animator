/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import enhance from './reflection/enhance';
import inject from './reflection/inject';

const VERSION = require('./../package.json').version;

export interface HaikuRoot {
  haiku?: {
    [version: string]: {
      cache?: {[key in string]: any};
      models?: {[key in string]: any[]};
      report?: () => void;
      enhance?: typeof enhance;
      inject?: typeof inject;
      idCounter?: number;
      HaikuGlobalAnimationHarness?: {
        queue: (() => void)[];
        frame: () => void;
        raf?: () => void;
        cancel: () => void;
      };
    };
  };
}

function buildRoot () {
  // We need a global harness so we can...
  // - have a single rAF loop even if we've got multiple Haiku Contexts on the same page
  // - expose some global APIs that we hope to make available for all components
  let ROOT: HaikuRoot = {};

  // Window gets highest precedence since most likely we're running in DOM
  if (typeof window !== 'undefined') {
    ROOT = window as HaikuRoot;
  } else if (typeof global !== 'undefined') {
    ROOT = global as HaikuRoot;
  } else {
    // On the off-chance there is no real global, just use the orig object
  }

  if (!ROOT.haiku) {
    ROOT.haiku = {};
  }

  // Avoid loading entities for incompatible versions.
  if (!ROOT.haiku[VERSION]) {
    ROOT.haiku[VERSION] = {};
  }

  if (!ROOT.haiku[VERSION].cache) {
    ROOT.haiku[VERSION].cache = {};
  }

  if (!ROOT.haiku[VERSION].models) {
    ROOT.haiku[VERSION].models = {};
  }

  if (!ROOT.haiku[VERSION].idCounter) {
    // Legacy: we start the ID counter at 1000 to avoid edge case ID collisions when there are copies of Haiku
    // sitting on the same page.
    ROOT.haiku[VERSION].idCounter = 1000;
  }

  if (!ROOT.haiku[VERSION].enhance) {
    /**
     * @function enhance
     * @description Given a function, decorate it with a .specification property that
     * contains a descriptor of the serialized form of the function, including its params.
     * This is used by the renderer as part of its automatic dependency injection mechanism.
     */
    ROOT.haiku[VERSION].enhance = enhance;
  }

  if (!ROOT.haiku[VERSION].inject) {
    /**
     * @function inject
     * @description Variadic function that takes a function as the first argument and
     * a collection of injection parameters as the remaining arguments, which are in turn
     * used to 'enhance' (see above) the function, specifying the parameters it wants injected.
     */
    ROOT.haiku[VERSION].inject = inject;
  }

  return ROOT.haiku[VERSION];
}

const haiku = buildRoot();

export default haiku;
