var SCOPE_SWITCHES = {
  'div': true,
  'svg': true
  // 'canvas': 'canvas'
}

module.exports = function scopeAdjust (virtualElement, domElement, options, scopes) {
  if (SCOPE_SWITCHES[virtualElement.elementName]) {
    scopes.currentScopeElement = {
      name: virtualElement.elementName,
      root: domElement
    }
  }
}
