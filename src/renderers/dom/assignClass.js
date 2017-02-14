function assignClass (domElement, className) {
  if (domElement.className !== className) {
    domElement.className = className
  }
  return domElement
}

module.exports = assignClass
