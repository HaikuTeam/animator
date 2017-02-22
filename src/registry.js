var __registry__ = {} // Singleton
reset()

function reset () {
  __registry__ = {}
  __registry__.contexts = []
  __registry__.activeComponent = null
  __registry__.selectedComponent = null
}

function insertContext (contextInstance) {
  return __registry__.contexts.push(contextInstance) - 1
}

function getContexts () {
  return __registry__.contexts
}

function setActiveComponent (component, node) {
  __registry__.activeComponent = {
    component: component,
    node: node
  }
  return __registry__.activeComponent
}

function getActiveComponent () {
  if (!__registry__.activeComponent) return null
  return __registry__.activeComponent.component
}

function getSelectedNode () {
  if (!__registry__.selectedComponent) return null
  return __registry__.selectedComponent.node
}

function setSelectedNode (node) {
  __registry__.selectedComponent = {
    component: null,
    node: node
  }
  return __registry__.selectedComponent
}

module.exports = {
  reset: reset,
  insertContext: insertContext,
  getContexts: getContexts,
  setActiveComponent: setActiveComponent,
  getActiveComponent: getActiveComponent,
  getSelectedNode: getSelectedNode,
  setSelectedNode: setSelectedNode
}
