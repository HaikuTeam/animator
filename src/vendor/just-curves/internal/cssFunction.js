var index1 = require('./index')
var camelCaseRegex = /([a-z])[- ]([a-z])/gi
var cssFunctionRegex = /^([a-z-]+)\(([^)]+)\)$/i
var cssEasings = {
  ease: index1.ease,
  easeIn: index1.easeIn,
  easeOut: index1.easeOut,
  easeInOut: index1.easeInOut,
  stepStart: index1.stepStart,
  stepEnd: index1.stepEnd,
  linear: index1.linear
}
var camelCaseMatcher = function (match, p1, p2) {
  return p1 + p2.toUpperCase()
}
var toCamelCase = function (value) {
  return typeof value === 'string'
    ? value.replace(camelCaseRegex, camelCaseMatcher)
    : ''
}
var find = function (nameOrCssFunction) {
  // search for a compatible known easing
  var easingName = toCamelCase(nameOrCssFunction)
  var easing = cssEasings[easingName] || nameOrCssFunction
  var matches = cssFunctionRegex.exec(easing)
  if (!matches) {
    throw new Error('could not parse css function')
  }
  return [matches[1]].concat(matches[2].split(','))
}
exports.cssFunction = function (easingString) {
  var p = find(easingString)
  var fnName = p[0]
  if (fnName === 'steps') {
    return index1.steps(+p[1], p[2])
  }
  if (fnName === 'cubic-bezier') {
    return index1.cubicBezier(+p[1], +p[2], +p[3], +p[4])
  }
  if (fnName === 'frames') {
    return index1.frames(+p[1])
  }
  throw new Error('unknown css function')
}
