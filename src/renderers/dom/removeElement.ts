/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function removeElement(domElement) {
  domElement.parentNode.removeChild(domElement);
  return domElement;
}
