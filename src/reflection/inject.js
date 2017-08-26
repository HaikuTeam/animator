var enhance = require('./enhance')

module.exports = function inject (/* fn, ...args */) {
  var args = []
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]
  var fn = args.shift()
  if (typeof fn !== 'function') {
    console.warn('[haiku player] Inject expects a function as the first argument')
    return fn
  }
  enhance(fn, args)
  // I'm adding this flag in case we did this in a random spot at
  // player runtime and need to detect later this when writing the AST
  fn.injectee = true
  return fn
}
