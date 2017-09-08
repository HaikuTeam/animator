var SELECTOR_ATTRIBUTES = require('./getSelectorAttributes').SELECTOR_ATTRIBUTES

var IGNORED_ATTRIBUTES = {
  version: true,
  encoding: true,
  standalone: true,
  xmlns: true,
  'xmlns:xlink': true,
  lang: true,
  charset: true,
  content: true,
  'http-equiv': true,
  scheme: true,
  source: true,
  'haiku-id': true,
  'haiku-title': true,
  'haiku-source': true
}

function getControlAttributes (attributes) {
  var out = {}
  for (var key in attributes) {
    if (SELECTOR_ATTRIBUTES[key]) continue
    if (IGNORED_ATTRIBUTES[key]) continue
    out[key] = attributes[key]
  }
  return out
}

module.exports = getControlAttributes
