var COLON = ':'
var DOT = '.'

var __registry__ = {} // Singleton
__registry__.contexts = []
__registry__.activeComponent = null
__registry__.selectedComponent = null

function insertContext (contextInstance) {
  return __registry__.contexts.push(contextInstance) - 1
}

function getContexts () {
  return __registry__.contexts
}

function createAddress (classIdentifier, instancePath) {
  return classIdentifier + COLON + instancePath
}

function getAddressParts (instanceAddress) {
  return instanceAddress.split(COLON)
}

function getAddressIdentifier (instanceAddress) {
  var parts = getAddressParts(instanceAddress)
  return parts[0]
}

function getAddressPath (instanceAddress) {
  var parts = getAddressParts(instanceAddress)
  return parts[1]
}

function getAddressIndices (instanceAddress) {
  var path = getAddressPath(instanceAddress)
  var pieces = path.split(DOT)
  return pieces.map(function _map (piece) {
    return parseInt(piece, 10)
  })
}

function getTopIndex (instanceAddress) {
  var indices = getAddressIndices(instanceAddress)
  return indices[0]
}

function getChildrenIndices (instanceAddress) {
  var indices = getAddressIndices(instanceAddress)
  return indices.slice(1)
}

function findContextByAddress (instanceAddress) {
  // var identifier = getAddressIdentifier(instanceAddress)
  var head = getTopIndex(instanceAddress)
  if (head === undefined || head === null) return null
  var context = __registry__.contexts[head]
  return context
}

function findNodeByAddress (instanceAddress) {
  var context = findContextByAddress(instanceAddress)
  if (!context) return null
  var identifier = getAddressIdentifier(instanceAddress)
  var rest = getChildrenIndices(instanceAddress)
  var tree = context.template.getTree()
  if (rest && rest.length > 0) {
    rest.shift()
    if (rest.length > 0) {
      while (tree && rest.length > 0) {
        var idx = rest.shift()
        tree = tree.children[idx]
      }
    }
  }
  if (tree && tree.elementName === identifier) return tree
  else return null
}

function setActiveComponent (context, node) {
  __registry__.activeComponent = {
    context: context,
    node: node
  }
  return __registry__.activeComponent
}

function setSelectedComponent (context, node) {
  __registry__.selectedComponent = {
    context: context,
    node: node
  }
  return __registry__.selectedComponent
}

function setActiveComponentByInstanceAddress (instanceAddress) {
  var context = findContextByAddress(instanceAddress)
  return setActiveComponent(context, null)
}

function setSelectedComponentByInstanceAddress (instanceAddress) {
  var context = findContextByAddress(instanceAddress)
  var node = findNodeByAddress(instanceAddress)
  return setSelectedComponent(context, node)
}

function getActiveComponent () {
  return __registry__.activeComponent
}

function getSelectedComponent () {
  return __registry__.selectedComponent
}

function getLatestInstancePath () {
  return (__registry__.contexts.length - 1) + ''
}

module.exports = {
  insertContext: insertContext,
  getContexts: getContexts,
  createAddress: createAddress,
  getAddressParts: getAddressParts,
  getAddressIdentifier: getAddressIdentifier,
  getAddressPath: getAddressPath,
  getAddressIndices: getAddressIndices,
  setActiveComponent: setActiveComponent,
  setSelectedComponent: setSelectedComponent,
  setActiveComponentByInstanceAddress: setActiveComponentByInstanceAddress,
  setSelectedComponentByInstanceAddress: setSelectedComponentByInstanceAddress,
  getActiveComponent: getActiveComponent,
  getSelectedComponent: getSelectedComponent,
  getLatestInstancePath: getLatestInstancePath,
  findContextByAddress: findContextByAddress,
  findNodeByAddress: findNodeByAddress
}
