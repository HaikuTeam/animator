var functionToRFO = require('./reflection/functionToRFO')

// We need a global harness so we can...
// - have a single rAF loop even if we've got multiple Haiku Contexts on the same page
// - expose some global APIs that we hope to make available for all components
var ROOT

// Window gets highest precedence since most likely we're running in DOM
if (typeof window !== 'undefined') {
  ROOT = window
} else if (typeof global !== 'undefined') {
  ROOT = global
} else {
  // On the off-chance there is no real global, just use this singleton
  ROOT = {}
}

if (!ROOT.haiku) {
  ROOT.haiku = {}
}

if (!ROOT.haiku.enhance) {
  ROOT.haiku['enhance!'] = function enhance (fn, params) {
    // Only create a specification if we don't already have one
    if (!fn.specification) {
      var rfo = functionToRFO(fn)
      if (rfo && rfo.__function) {
        // Cache this so we don't expensively parse each time
        fn.specification = rfo.__function
        // Allow an explicit list of params to override ours
        if (params) {
          fn.specification.params = params
        }
      } else {
        // Signal that this function is of an unknown kind
        // so future runs don't try to parse this one again
        fn.specification = true
      }
    }
  }
}

// Function.prototype.inject = function inject () { // eslint-disable-line
//   ROOT.haiku.enhance(this, arguments)
//   return this
// }

module.exports = ROOT.haiku
