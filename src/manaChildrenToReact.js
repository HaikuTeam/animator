var manaToReact = require('./manaToReact')

function manaChildrenToReact (children) {
  if (!children) return null
  if (children.length < 1) return null

  return children.map(function _map (child) {
    if (child === null || child === undefined) return null
    if (typeof child === 'string' || typeof child === 'number') return child
    return manaToReact(child)
  })
}

module.exports = manaChildrenToReact
