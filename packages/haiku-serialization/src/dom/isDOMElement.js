/* global HTMLElement */

function isDOMElement (object) {
  if (typeof HTMLElement === 'undefined') return false
  if (object instanceof HTMLElement) return true
  return false
}

module.exports = isDOMElement
