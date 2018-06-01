/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import functionToRFO from './functionToRFO';

export default function enhance (fn, params) {
  // Only create a specification if we don't already have one
  if (!fn.specification) {
    const rfo = functionToRFO(fn);
    if (rfo && rfo.__function) {
      // Cache this so we don't expensively parse each time
      fn.specification = rfo.__function;
      // Allow an explicit list of params to override ours
      if (params) {
        fn.specification.params = params;
      }
    } else {
      // Signal that this function is of an unknown kind
      // so future runs don't try to parse this one again
      fn.specification = true;
    }
  }
}
