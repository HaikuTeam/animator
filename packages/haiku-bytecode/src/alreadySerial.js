function alreadySerial (object) {
  return typeof object === 'string' || typeof object === 'number'
}

module.exports = alreadySerial
