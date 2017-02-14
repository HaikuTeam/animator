var Emitter = require('./emitter')

function Instance () {
  Emitter.create(this)
}

module.exports = Instance
