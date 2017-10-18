/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function getTimelineMaxTime(descriptor) {
  let max = 0;
  for (const selector in descriptor) {
    const group = descriptor[selector];
    for (const output in group) {
      const keyframes = group[output];
      const keys = Object.keys(keyframes);
      for (let i = 0; i < keys.length; i++) {
        const key = parseInt(keys[i], 10);
        if (key > max) max = key;
      }
    }
  }
  return max;
}
