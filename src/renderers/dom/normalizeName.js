function normalizeName (tagName) {
  if (tagName[0] === tagName[0].toUpperCase()) tagName = tagName + '-component'
  return tagName
}

module.exports = normalizeName
