/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function removeElement(domElement, flexId, component) {
  component.subcacheClear(flexId);

  domElement.parentNode.removeChild(domElement);

  return domElement;
}
