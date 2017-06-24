function isComplexValue (value) {
  return value && Array.isArray(value) || value && typeof value === 'object'
}

module.exports = isComplexValue
