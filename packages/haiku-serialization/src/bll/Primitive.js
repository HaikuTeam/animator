const BaseModel = require('./BaseModel')

const PRIMITIVES = {
  circle: require('@haiku/player/components/Circle/code/main/code'),
  ellipse: require('@haiku/player/components/Ellipse/code/main/code'),
  line: require('@haiku/player/components/Line/code/main/code'),
  path: require('@haiku/player/components/Path/code/main/code'),
  polygon: require('@haiku/player/components/Polygon/code/main/code'),
  polyline: require('@haiku/player/components/Polyline/code/main/code'),
  rect: require('@haiku/player/components/Rect/code/main/code')
}

/**
 * @class Primitive
 * @description
 *.  Collection of static class methods for "primitive" components (Line, Rect, etc).
 */
class Primitive extends BaseModel {}

Primitive.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Primitive)

/**
 * @method inferPrimitiveFromBytecode
 * @description Give an arbitrary bytecode object, determine whether it represents
 * a known 'primitive' component (Line, Rect, Path, etc)
 * @param bytecode {Object} The bytecode object
 * @returns {Object} The bytecode of the respective primitive component
 */
Primitive.inferPrimitiveFromBytecode = (bytecode) => {
  for (const elementName in PRIMITIVES) {
    const primitive = PRIMITIVES[elementName]
    const areIsomorphic = Bytecode.areBytecodesIsomorphic(bytecode, primitive)
    if (areIsomorphic) return primitive
  }
}

Primitive.inferPrimitiveFromMana = (mana) => {
  for (const elementName in PRIMITIVES) {
    const primitive = PRIMITIVES[elementName]
    const areEquivalent = Template.areTemplatesEquivalent(mana, primitive.template)
    if (areEquivalent) return primitive
  }
}

module.exports = Primitive

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
const Template = require('./Template')
