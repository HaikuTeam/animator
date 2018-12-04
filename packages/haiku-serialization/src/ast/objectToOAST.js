const {LAYOUT_3D_SCHEMA} = require('@haiku/core/lib/HaikuComponent');

/**
 * We can emit a "shorthand" for bytecode timeline properties at serialization time like so:
 *   {"sizeAbsolute.x": {"0": {"value": 550}}} ->
 *   {"sizeAbsolute.x": 550}
 *
 * The inputs are carefully checked to evaluate if we're in a safe context to perform this shortening, essentially
 * confirming that we are looking at an object exactly like this (and in the expected place).
 */
const canUseShorthand = (obj, keyChain) => {
  // keyChain provides the list of keys we have traversed in our recursive serialization.
  // In bytecode, we encounter timeline value clusters at depth 4, as in:
  // {
  //   "timelines": {
  //     "Default": {
  //       "haiku:<selector>": {
  //         "<property>": {...}
  //       }
  //     }
  //   }
  // }
  // On the off chance that we encounter some other thing somewhere else which:
  //  - is an object
  //  - has exactly one key which is "0"
  //  - has that key point to an object which a scalar "value" property
  // …inspecting the key chain assures us we are actually in the correct spot.
  if (keyChain.length !== 4 || keyChain[0] !== 'timelines') {
    return false;
  }

  const keys = Object.keys(obj);
  return (
    // Check we have exactly one key, and it is "0":
    keys.length === 1 && keys[0] === '0' &&
    // Check that we have a {value: <scalar>} sort of key value:
    //   * IMPORTANT: we should never shorthand object-type properties. because HaikuComponent shorthand expansion
    //     uses object-ness to exclude from shorthand expansion!
    typeof obj[0] === 'object' && typeof obj[0].value !== 'object' &&
    // Check that we are either looking at a layout property (Haiku only updates these at the root level) or a non-edited property:
    (LAYOUT_3D_SCHEMA[keyChain[3]] || !obj[0].edited)
  );
};

const objectToOAST = (obj, keyChain = []) => {
  if (canUseShorthand(obj, keyChain)) {
    return expressionToOASTComponent(obj['0'].value);
  }

  const oast = {
    type: 'ObjectExpression',
    properties: [],
  };

  for (const key in obj) {
    if (key === undefined) {
      continue;
    }
    const keyexp = expressionToOASTComponent(key);
    keyChain.push(key);
    const valueexp = expressionToOASTComponent(obj[key], key, keyChain);
    keyChain.pop();
    oast.properties.push({
      type: 'ObjectProperty',
      key: keyexp,
      value: valueexp,
    });
  }

  return oast;
};

module.exports = objectToOAST;

// Down here to avoid circular dependency blank object
const expressionToOASTComponent = require('./expressionToOASTComponent');
