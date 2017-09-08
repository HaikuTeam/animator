function jsonStringifyReplacer (key, value) {
  if (typeof value === 'function') return value.toString()
  return value
}

function jsonToStr (obj, spacing) {
  return safeJsonStringify(obj, jsonStringifyReplacer, spacing)
}

function safeJsonParse (str) {
  try {
    return JSON.parse(str)
  } catch (exception) {
    console.error(exception)
    return null
  }
}

function safeJsonStringify (objToStringify, maybeReplacer, maybeSpacing) {
  try {
    return JSON.stringify(objToStringify, maybeReplacer, maybeSpacing)
  } catch (exception) {
    return null
  }
}

module.exports = {
  jsonStringifyReplacer: jsonStringifyReplacer,
  jsonToStr: jsonToStr,
  safeJsonParse: safeJsonParse,
  safeJsonStringify: safeJsonStringify
}
