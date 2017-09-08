let baddies = 0

function arrayParamToString(param) {
  let pieces = []

  for (let i = 0; i < param.length; i++) {
    pieces.push(stringifyParam(param[i]))
  }

  return "[ " + pieces.join(", ") + " ]"
}

function objectParamToString(param) {
  let pieces = []

  // Special case, an object that describes a rest parameter
  if (param.__rest) {
    return "..." + param.__rest
  }

  for (let key in param) {
    pieces.push(stringifyParam(param[key], key))
  }

  return "{ " + pieces.join(", ") + " }"
}

function stringifyParam(param, key) {
  if (param && typeof param === "string") {
    return param
  }

  if (param && Array.isArray(param)) {
    // Let `a: []` be a signal that we only want to access 'a'
    if (param.length < 1) {
      return key
    }

    if (key) {
      // e.g.: a, a: [...] <~ To allow reference to the destructure root
      return key + ", " + key + ": " + arrayParamToString(param)
    }

    return arrayParamToString(param)
  }

  if (param && typeof param === "object") {
    // Let `a: {}` be a signal that we only want to access 'a'
    if (Object.keys(param).length < 1) {
      return key
    }

    if (key) {
      // e.g. a, a: { ... } <~ To allow reference to the destructure root
      return key + ", " + key + ": " + objectParamToString(param)
    }

    return objectParamToString(param)
  }

  return "__" + baddies++ + "__" // In case we get something we just can't handle, create something unique and noticeably ugly
}

function marshalParams(params) {
  return params
    .map(function _mapper(param) {
      // Need wrap function to avoid passing the index (key) to stringifyParam, which uses that to detect something
      return stringifyParam(param)
    })
    .join(", ")
}

module.exports = marshalParams
