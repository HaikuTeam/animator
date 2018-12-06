const {
  toText,
} = require('@haiku/core/lib/reflection/JavaScriptIdentifier');

module.exports = function wrapInHaikuInject (node) {
  return {
    type: 'CallExpression',
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'Haiku',
      },
      property: {
        type: 'Identifier',
        name: 'inject',
      },
    },
    // The first argument is the function, and remainders are the injectables
    arguments: [node].concat(node.params.map((param) => {
      const value = toText(param.name);
      return {
        type: 'StringLiteral',
        // If the parameter was a referenced state value like 'foo.bar.baz',
        // we should have converted it to the identifier foo_$dot$_bar_$dot$_baz;
        // but we still want to refer to its original name in the injectees list
        value,
        extra: {
          raw: JSON.stringify(value),
        },
      };
    })),
  };
};
