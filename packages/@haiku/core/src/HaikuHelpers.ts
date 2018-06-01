/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const pkg = require('./../package.json');
const VERSION = pkg.version;

export interface HelpersRegistry {
  helpers: {
    [name: string]: Function;
  };

  register?: (name: string, method: Function) => HelpersRegistry;
}

export interface Helpers {
  HaikuHelpers?: {
    [version: string]: HelpersRegistry;
  };
}

// We need a global harness so we can attach helpers
const MAIN =
  ((typeof window !== 'undefined')
    ? window
    : (typeof global !== 'undefined')
    ? global
    : {}) as Helpers;

if (!MAIN.HaikuHelpers) {
  MAIN.HaikuHelpers = {};
}

// Different versions may have different helpers, so keep that in mind...
if (!MAIN.HaikuHelpers[VERSION]) {
  MAIN.HaikuHelpers[VERSION] = {
    helpers: {},
  };
}

const exp = MAIN.HaikuHelpers[VERSION];

exp.register = (name, method) => {
  exp.helpers[name] = method;
  return exp;
};

export default exp;
