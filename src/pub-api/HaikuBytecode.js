var Emitter = require('./../emitter')

function HaikuBytecode (_player) {
  if (!(this instanceof HaikuBytecode)) return new HaikuBytecode(_player)
  Emitter.create(this)
  this._player = _player
}

module.exports = HaikuBytecode
