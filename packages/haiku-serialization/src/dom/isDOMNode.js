/* global Node */

function isDOMNode (object) {
  if (typeof Node === 'undefined') return false
  if (object instanceof Node) return true
  return false
}

module.exports = isDOMNode
