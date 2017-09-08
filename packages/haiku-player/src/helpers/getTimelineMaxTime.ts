/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function getTimelineMaxTime(descriptor) {
  let max = 0
  for (let selector in descriptor) {
    let group = descriptor[selector]
    for (let output in group) {
      let keyframes = group[output]
      let keys = Object.keys(keyframes)
      for (let i = 0; i < keys.length; i++) {
        let key = parseInt(keys[i], 10)
        if (key > max) max = key
      }
    }
  }
  return max
}

module.exports = getTimelineMaxTime
