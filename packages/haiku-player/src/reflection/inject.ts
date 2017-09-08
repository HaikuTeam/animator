let enhance = require("./enhance")

module.exports = function inject(/* fn, ...args */) {
  let args = []
  for (let i = 0; i < arguments.length; i++) args[i] = arguments[i]
  let fn = args.shift()
  if (typeof fn !== "function") {
    console.warn("[haiku player] Inject expects a function as the first argument")
    return fn
  }
  if (args.length > 0) {
    enhance(fn, args)
  } else {
    enhance(fn) // If no args here, let 'enhance' try to parse them out
  }
  // I'm adding this flag in case we did this in a random spot at
  // player runtime and need to detect later this when writing the AST
  fn.injectee = true
  return fn
}
