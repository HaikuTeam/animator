module.exports = function attachEventListener (domElement, lowercaseName, listener, options, scopes) {
  var eventName = lowercaseName.slice(2) // Assumes 'on*' prefix
  domElement.addEventListener(eventName, listener)
}
