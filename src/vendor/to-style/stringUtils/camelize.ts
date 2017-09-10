const hyphenRe = /[-\s]+(.)?/g

function toCamelFn(str, letter) {
  return letter ? letter.toUpperCase() : ""
}

export default function camelize(str) {
  return str ? str.replace(hyphenRe, toCamelFn) : ""
}
