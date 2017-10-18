/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// Just a utility function for populating these objects
export default function has(...args) {
  const obj = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    for (const name in arg) {
      const fn = arg[name];
      obj[name] = fn;
    }
  }
  return obj;
}
