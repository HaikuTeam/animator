/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let objectPath = require("./objectPath")

let STRING = "string"
let OBJECT = "object"
let FUNCTION = "function"

// Quick and dirty (not AST-based) way to get the name of a function at runtime
function _getFnName(fn) {
  if (fn.name) {
    return fn.name
  }

  let str = fn.toString()

  //                | | <-- this space is always here via toString()
  let reg = /function ([^(]*)/
  let ex = reg.exec(str)
  return ex && ex[1]
}

function matchByTagName(node, tagName, options) {
  let val = objectPath(node, options.name)
  if (val) {
    if (typeof val === STRING && val === tagName) {
      return true
    } else if (typeof val === FUNCTION) {
      // Allow function constructors to act as the tag name
      if (_getFnName(val) === tagName) {
        return true
      }
    } else if (typeof val === OBJECT) {
      // Allow for things like instances to act as the tag name
      if (val.name === tagName || val.tagName === tagName) {
        return true
      }
    }
  }
}

module.exports = matchByTagName
