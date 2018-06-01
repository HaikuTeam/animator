/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import cloneAttributes from './cloneAttributes';

export default function cloneVirtualElement (virtualElement) {
  return {
    elementName: virtualElement.elementName,
    attributes: cloneAttributes(virtualElement.attributes),
    children: virtualElement.children,
  };
}
