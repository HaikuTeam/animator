module.exports = function scopeIs (scopes, name) {
  return scopes && scopes.currentScopeElement && scopes.currentScopeElement.name === name
}
