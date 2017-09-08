var getRelativeElementFromPoint = require('./getRelativeElementFromPoint')

var NO_POINTER_EVENTS = 'none'

function getAllElementsAtPoint (stack, x, y, doc, context, shield) {
  var pointerEventsSetting = (shield) ? shield.style.pointerEvents : null
  if (shield) shield.style.pointerEvents = NO_POINTER_EVENTS
  var el = getRelativeElementFromPoint(x, y, doc, context)
  if (shield) shield.style.pointerEvents = pointerEventsSetting
  stack.push(el)
  if (el) getRelativeElementFromPoint(x, y, doc, el)
  return stack
}

module.exports = getAllElementsAtPoint
