import cssPrefixFn from "./cssPrefix"
import HYPHENATE from "./stringUtils/hyphenate"
import CAMELIZE from "./stringUtils/camelize"
import HAS_OWN from "./hasOwn"
import IS_OBJECT from "./isObject"
import IS_FUNCTION from "./isFunction"

function applyPrefix(target, property, value, normalizeFn) {
  cssPrefixFn(property, null).forEach(function(p) {
    target[normalizeFn ? normalizeFn(p) : p] = value
  })
}

function toObject(str) {
  str = (str || "").split(";")

  let result = {}

  str.forEach(function(item) {
    let split = item.split(":")

    if (split.length === 2) {
      result[split[0].trim()] = split[1].trim()
    }
  })

  return result
}

let CONFIG = {
  cssUnitless: require("./cssUnitless"),
}

function _notUndef(thing) {
  return thing !== null && thing !== undefined
}

/**
 * @ignore
 * @method toStyleObject
 * @param  {Object} styles The object to convert to a style object.
 * @param  {Object} [config]
 * @param  {Boolean} [config.addUnits=true] True if you want to add units when numerical values are encountered.
 * @param  {Object}  config.cssUnitless An object whose keys represent css numerical property names that will not be appended with units.
 * @param  {Object}  config.prefixProperties An object whose keys represent css property names that should be prefixed
 * @param  {String}  config.cssUnit='px' The css unit to append to numerical values. Defaults to 'px'
 * @param  {String}  config.normalizeName A function that normalizes a name to a valid css property name
 * @param  {String}  config.scope
 * @return {Object} The object, normalized with css style names
 */
export default function toStyleObject(styles, config, prepend, result) {
  if (typeof styles === "string") {
    styles = toObject(styles)
  }

  config = config || CONFIG

  config.cssUnitless = config.cssUnitless || CONFIG.cssUnitless

  result = result || {}

  let scope = config.scope || {}

  let addUnits = _notUndef(config.addUnits)
    ? config.addUnits
    : scope && _notUndef(scope.addUnits) ? scope.addUnits : true

  let cssUnitless =
    (_notUndef(config.cssUnitless)
      ? config.cssUnitless
      : scope ? scope.cssUnitless : null) || {}

  let cssUnit = (config.cssUnit || scope ? scope.cssUnit : null) || "px"

  let prefixProperties =
    config.prefixProperties || (scope ? scope.prefixProperties : null) || {}

  let camelize = config.camelize

  let normalizeFn = camelize ? CAMELIZE : HYPHENATE

  let processed,
    styleName,
    propName,
    propValue,
    propType,
    propIsNumber,
    fnPropValue,
    prefix

  for (propName in styles) {
    if (HAS_OWN(styles, propName)) {
      propValue = styles[propName]

      // the hyphenated style name (css property name)
      styleName = HYPHENATE(prepend ? prepend + propName : propName)

      processed = false
      prefix = false

      if (IS_FUNCTION(propValue)) {
        // a function can either return a css value
        // or an object with { value, prefix, name }
        fnPropValue = propValue.call(
          scope || styles,
          propValue,
          propName,
          styleName,
          styles,
        )

        if (IS_OBJECT(fnPropValue) && fnPropValue.value != null) {
          propValue = fnPropValue.value
          prefix = fnPropValue.prefix
          styleName = fnPropValue.name ? HYPHENATE(fnPropValue.name) : styleName
        } else {
          propValue = fnPropValue
        }
      }

      propType = typeof propValue
      propIsNumber =
        propType === "number" ||
        (propType === "string" &&
          propValue !== "" &&
          propValue * 1 === propValue)

      if (
        propValue === null ||
        propValue === undefined ||
        styleName === null ||
        styleName === undefined ||
        styleName === ""
      ) {
        continue
      }

      if (propIsNumber || propType === "string") {
        processed = true
      }

      if (!processed && _notUndef(propValue.value) && propValue.prefix) {
        processed = true
        prefix = propValue.prefix
        propValue = propValue.value
      }

      // hyphenStyleName = camelize? HYPHENATE(styleName): styleName

      if (processed) {
        prefix = prefix || !!prefixProperties[styleName]

        if (propIsNumber) {
          propValue = addUnits && !(styleName in cssUnitless)
            ? propValue + cssUnit
            : propValue + "" // change it to a string, so that jquery does not append px or other units
        }

        // special border treatment
        if (
          (styleName === "border" ||
            (!styleName.indexOf("border") &&
              !~styleName.indexOf("radius") &&
              !~styleName.indexOf("width"))) &&
          propIsNumber
        ) {
          styleName = styleName + "-width"
        }

        // special border radius treatment
        if (!styleName.indexOf("border-radius-")) {
          styleName.replace(/border(-radius)(-(.*))/, function(
            str,
            radius,
            theRest,
          ) {
            let positions = {
              "-top": ["-top-left", "-top-right"],
              "-left": ["-top-left", "-bottom-left"],
              "-right": ["-top-right", "-bottom-right"],
              "-bottom": ["-bottom-left", "-bottom-right"],
            }

            if (theRest in positions) {
              styleName = []

              positions[theRest].forEach(function(pos) {
                styleName.push("border" + pos + radius)
              })
            } else {
              styleName = "border" + theRest + radius
            }
          })

          if (Array.isArray(styleName)) {
            styleName.forEach(function(styleName) {
              if (prefix) {
                applyPrefix(result, styleName, propValue, normalizeFn)
              } else {
                result[normalizeFn(styleName)] = propValue
              }
            })

            continue
          }
        }

        if (prefix) {
          applyPrefix(result, styleName, propValue, normalizeFn)
        } else {
          result[normalizeFn(styleName)] = propValue
        }
      } else {
        // the propValue must be an object, so go down the hierarchy
        toStyleObject(propValue, config, styleName + "-", result)
      }
    }
  }

  return result
}
