const BaseModel = require('./BaseModel')

// const HaikuPlayerBuiltinComponents = require('@haiku/player/components')
const HaikuPlayerBuiltinComponents = {}

/**
 * @class Primitive
 * @description
 *.  Collection of methods for "primitive" components (Line, Rectangle, etc).
 */
class Primitive extends BaseModel {
  getClassName () {
    return this.classname
  }

  getRequirePath () {
    return this.requirePath
  }

  getStates () {
    return this.bytecode.states
  }
}

Primitive.DEFAULT_OPTIONS = {
  required: {
    requirePath: true,
    bytecode: true,
    classname: true
  }
}

BaseModel.extend(Primitive)

/**
 * @method inferPrimitiveFromBytecode
 * @description Give an arbitrary bytecode object, determine whether it represents
 * a known 'primitive' component (Line, Rect, Path, etc)
 * @param bytecode {Object} The bytecode object
 * @returns {Object} The Primitive instance
 */
Primitive.inferPrimitiveFromBytecode = (theirBytecode) => {
  for (const classname in HaikuPlayerBuiltinComponents) {
    const {
      requirePath,
      bytecode
    } = HaikuPlayerBuiltinComponents[classname]

    const areIsomorphic = Bytecode.areBytecodesIsomorphic(theirBytecode, bytecode)

    if (areIsomorphic) {
      return Primitive.upsert({
        uid: requirePath,
        requirePath,
        classname,
        bytecode
      })
    }
  }
}

module.exports = Primitive

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
