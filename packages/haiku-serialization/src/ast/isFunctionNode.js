let FUNCTION_NODE_TYPES = {
  FunctionExpression: true,
  ClassMethod: true,
  ArrowFunctionExpression: true,
  ObjectMethod: true,
};

function isFunctionNode (node) {
  return (node.type in FUNCTION_NODE_TYPES);
}

module.exports = isFunctionNode;
