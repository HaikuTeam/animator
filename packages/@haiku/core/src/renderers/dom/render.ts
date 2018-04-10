/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import renderTree from './renderTree';

export default function render(
  domElement,
  virtualContainer,
  virtualTree,
  component,
) {
  return renderTree(
    domElement,
    virtualContainer,
    [virtualTree],
    component,
    false, // isPatchOperation
    false, // doSkipChildren
  );
}
