/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function removeElement (domElement, compositeId, component) {
  component.subcacheClear(compositeId);

  domElement.parentNode.removeChild(domElement);

  return domElement;
}
