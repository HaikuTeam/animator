/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function isTextNode(virtualElement) {
  return typeof virtualElement === "string"
}
