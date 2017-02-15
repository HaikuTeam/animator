var jsdom = require('jsdom')

function createDOM(cb) {
  var html = '<!doctype html><html><body><div id="mount"></div></body></html>'
  var doc = jsdom.jsdom(html)
  var win = doc.defaultView
  global.document = doc
  global.window = win
  for (let key in win) {
    if (!win.hasOwnProperty(key)) continue
    if (key in global) continue
    global[key] = window[key]
  }
  return cb(null, win)
}

function simulateEvent(element, name) {
  var document = element.ownerDocument
  var event = document.createEvent('HTMLEvents')
  event.initEvent(name, false, true)
  element.dispatchEvent(event)
  return event
}

module.exports = {
  createDOM: createDOM,
  simulateEvent: simulateEvent
}
