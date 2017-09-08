function cannotUse (object) {
  return object === false || object === null || object === undefined || typeof object === 'function'
}

module.exports = cannotUse
