let camelize = require("./stringUtils/camelize")
let hyphenate = require("./stringUtils/hyphenate")
let toLowerFirst = require("./stringUtils/toLowerFirst")
let toUpperFirst = require("./stringUtils/toUpperFirst")

let prefixInfo = require("./prefixInfo")
let prefixProperties = require("./prefixProperties")

let docStyle = typeof document === "undefined"
  ? {}
  : document.documentElement.style

module.exports = function(asStylePrefix) {
  return function(name, config) {
    config = config || {}

    let styleName = toLowerFirst(camelize(name))

    let cssName = hyphenate(name)

    let theName = asStylePrefix ? styleName : cssName

    let thePrefix = prefixInfo.style
      ? asStylePrefix ? prefixInfo.style : prefixInfo.css
      : ""

    if (styleName in docStyle) {
      return config.asString ? theName : [theName]
    }

    // not a valid style name, so we'll return the value with a prefix

    let upperCased = theName
    let prefixProperty = prefixProperties[cssName]
    let result = []

    if (asStylePrefix) {
      upperCased = toUpperFirst(theName)
    }

    if (typeof prefixProperty === "function") {
      let prefixedCss = prefixProperty(theName, thePrefix) || []
      if (prefixedCss && !Array.isArray(prefixedCss)) {
        prefixedCss = [prefixedCss]
      }

      if (prefixedCss.length) {
        prefixedCss = prefixedCss.map(function(property) {
          return asStylePrefix
            ? toLowerFirst(camelize(property))
            : hyphenate(property)
        })
      }

      result = result.concat(prefixedCss)
    }

    if (thePrefix) {
      result.push(thePrefix + upperCased)
    }

    result.push(theName)

    if (config.asString || result.length === 1) {
      return result[0]
    }

    return result
  }
}
