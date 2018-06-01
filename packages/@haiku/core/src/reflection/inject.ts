/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import enhance from './enhance';

export default function inject (...args) {
  const fn = args.shift();
  if (typeof fn !== 'function') {
    console.warn('[haiku core] Inject expects a function as the first argument');
    return fn;
  }

  if (args.length > 0) {
    enhance(fn, args);
  } else {
    enhance(fn, null); // If no args here, let 'enhance' try to parse them out
  }

  // Used by Haiku.app
  fn.injectee = true;

  return fn;
}
