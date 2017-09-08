let index1 = require("./index")
let camelCaseRegex = /([a-z])[- ]([a-z])/gi
let cssFunctionRegex = /^([a-z-]+)\(([^)]+)\)$/i
let cssEasings = {
  ease: index1.ease,
  easeIn: index1.easeIn,
  easeOut: index1.easeOut,
  easeInOut: index1.easeInOut,
  stepStart: index1.stepStart,
  stepEnd: index1.stepEnd,
  linear: index1.linear,
}
let camelCaseMatcher = function(match, p1, p2) {
  return p1 + p2.toUpperCase()
}
let toCamelCase = function(value) {
  return typeof value === "string"
    ? value.replace(camelCaseRegex, camelCaseMatcher)
    : ""
}
let find = function(nameOrCssFunction) {
  // search for a compatible known easing
  let easingName = toCamelCase(nameOrCssFunction)
  let easing = cssEasings[easingName] || nameOrCssFunction
  let matches = cssFunctionRegex.exec(easing)
  if (!matches) {
    throw new Error("could not parse css function")
  }
  return [matches[1]].concat(matches[2].split(","))
}
exports.cssFunction = function(easingString) {
  let p = find(easingString)
  let fnName = p[0]
  if (fnName === "steps") {
    return index1.steps(+p[1], p[2])
  }
  if (fnName === "cubic-bezier") {
    return index1.cubicBezier(+p[1], +p[2], +p[3], +p[4])
  }
  if (fnName === "frames") {
    return index1.frames(+p[1])
  }
  throw new Error("unknown css function")
}
