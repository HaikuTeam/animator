let getFlexId = require("./getFlexId")

module.exports = function shouldElementBeReplaced(domElement, virtualElement) {
  let oldFlexId = getFlexId(domElement)
  let newFlexId = getFlexId(virtualElement)

  if (oldFlexId && newFlexId) {
    if (oldFlexId !== newFlexId) {
      return true
    }
  }

  return false
}
