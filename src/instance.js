var Emitter = require('./Emitter')

function Instance () {
  Emitter.create(this)
}

module.exports = Instance
