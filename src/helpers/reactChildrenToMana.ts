/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import reactToMana from "./reactToMana"

export default function reactChildrenToMana(children) {
  if (!children) return null
  if (children.length < 1) return null
  return children.map(function _map(child) {
    if (typeof child === "string") return child
    return reactToMana(child)
  })
}
