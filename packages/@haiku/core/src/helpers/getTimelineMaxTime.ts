/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function getTimelineMaxTime (descriptor) {
  let max = 0;
  for (const selector in descriptor) {
    const group = descriptor[selector];
    for (const output in group) {
      const keyframes = group[output];
      if (typeof keyframes !== 'object') {
        // In case this is run before migrations, continue (non-object keyframes means only 0-keyframe).
        continue;
      }
      const keys = Object.keys(keyframes);
      for (let i = 0; i < keys.length; i++) {
        const key = parseInt(keys[i], 10);
        if (key > max) {
          max = key;
        }
      }
    }
  }
  return max;
}
