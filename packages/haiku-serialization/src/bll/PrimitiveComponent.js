const BaseModel = require('./BaseModel')

/**
 * @class PrimitiveComponent
 */
class PrimitiveComponent extends BaseModel {
  getTitle () {
    throw new Error('not yet implemented')
  }

  getReifiedBytecode () {
    throw new Error('not yet implemented')
  }

  doesMatchOrHostComponent (other, seen = {}, cb) {
    throw new Error('not yet implemented')
  }
}

PrimitiveComponent.DEFAULT_OPTIONS = {
  required: {
    modpath: true
  }
}

BaseModel.extend(PrimitiveComponent)

module.exports = PrimitiveComponent
