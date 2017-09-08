let seedrandom = require("./../vendor/seedrandom")

function PRNG(seed) {
  this._prng = seedrandom(seed)
}

PRNG.prototype.random = function random() {
  return this._prng()
}

module.exports = PRNG
