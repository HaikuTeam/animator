let VERSION = require("./../package.json").version

// We need a global harness so we can attach helpers
let MAIN
if (typeof window !== "undefined") { // Window gets highest precedence since most likely we're running in DOM
  MAIN = window
} else if (typeof global !== "undefined") {
  MAIN = global
} else {
  // Forget it; don't bother trying to share between Haiku threads
  MAIN = {}
}

if (!MAIN.HaikuHelpers) {
  MAIN.HaikuHelpers = {}
}

// Different versions may have different helpers, so keep that in mind...
if (!MAIN.HaikuHelpers[VERSION]) {
  MAIN.HaikuHelpers[VERSION] = {
    helpers: {},
    schema: {},
  }
}

let exp = MAIN.HaikuHelpers[VERSION]

exp.register = function register(name, method) {
  exp.helpers[name] = method
  exp.schema[name] = "function"
  return exp
}

module.exports = exp
