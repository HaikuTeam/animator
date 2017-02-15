module.exports = function attachEventListener (domElement, lowercaseName, listener) {
  var eventName = lowercaseName.slice(2) // Assumes 'on*' prefix
  domElement.addEventListener(eventName, listener)
}
