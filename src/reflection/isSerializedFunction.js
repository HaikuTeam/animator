function isSerializedFunction (object) {
  return object && !!object.__function
}

module.exports = isSerializedFunction
