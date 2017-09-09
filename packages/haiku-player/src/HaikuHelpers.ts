const pkg = require("./../package.json")
const VERSION = pkg.version

// We need a global harness so we can attach helpers
const MAIN =
  (typeof window !== "undefined")
    ? window
    : (typeof global !== "undefined")
      ? global
      : {}

if (!MAIN['HaikuHelpers']) {
  MAIN['HaikuHelpers'] = {}
}

// Different versions may have different helpers, so keep that in mind...
if (!MAIN['HaikuHelpers'][VERSION]) {
  MAIN['HaikuHelpers'][VERSION] = {
    helpers: {},
    schema: {},
  }
}

const exp = MAIN['HaikuHelpers'][VERSION]

exp['register'] = function register(name, method) {
  exp.helpers[name] = method
  exp.schema[name] = "function"
  return exp
}

export default exp
