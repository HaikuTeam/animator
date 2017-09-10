/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function parseCssValueString(str, optionalPropertyHint) {
  if (typeof str === "number") {
    return {
      value: str,
      unit: null,
    }
  }

  if (str === null || str === undefined) {
    return {
      value: null,
      unit: null,
    }
  }

  let num
  let nmatch = str.match(/([+-]?[\d|.]+)/)

  if (nmatch) num = Number(nmatch[0])
  else num = 0

  let unit
  let smatch = str.match(/(em|px|%|turn|deg|in)/)
  if (smatch) {
    unit = smatch[0]
  } else {
    if (optionalPropertyHint && optionalPropertyHint.match(/rotate/)) {
      unit = "deg"
    } else {
      unit = null
    }
  }
  return {
    value: num,
    unit,
  }
}
