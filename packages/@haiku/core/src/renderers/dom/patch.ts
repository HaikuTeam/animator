/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import updateElement from './updateElement';
import HaikuComponent from '../../HaikuComponent';

export default function patch(
  component: HaikuComponent,
  patches: any,
) {
  // The component upstream may use an empty value to indicate a no-op
  if (!patches || Object.keys(patches).length < 1) {
    return;
  }

  for (const flexId in patches) {
    const virtualElement = patches[flexId];

    if (virtualElement.__targets) {
      for (let i = 0; i < virtualElement.__targets.length; i++) {
        const target = virtualElement.__targets[i];

        updateElement(
          target,
          virtualElement,
          target.parentNode,
          virtualElement.__parent,
          component,
          true,
        );
      }
    }
  }
}
