/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function isTextNode (virtualElement) {
  return (
    typeof virtualElement !== 'object'
  );
}
