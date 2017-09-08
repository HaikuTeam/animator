var REF_MATCHER_RE = /^url\(#(.*)\)$/

function extractReferenceIdFromUrlReference (stringValue) {
  var matches = REF_MATCHER_RE.exec(stringValue)
  if (matches) return matches[1]
  return null
}

module.exports = extractReferenceIdFromUrlReference
