/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// Just a utility function for populating these objects
export default function has(...args) {
  let obj = {}
  for (let i = 0; i < args.length; i++) {
    let arg = args[i]
    for (let name in arg) {
      let fn = arg[name]
      obj[name] = fn
    }
  }
  return obj
}
