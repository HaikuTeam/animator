/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import functionSpecificationToFunction from './functionSpecificationToFunction';
import inject from './inject';

export default function reifyRFO (rfo) {
  const fn = functionSpecificationToFunction(
    rfo.name || '',
    rfo.params,
    rfo.body,
    rfo.type,
  );

  // Upstream can signal that this function needs to become 'injected'
  // in order to function properly using this flag
  if (rfo.injectee) {
    inject.apply(null, [fn].concat(rfo.params));
  }

  return fn;
}
