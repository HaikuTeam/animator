function computeUnaryExpression (node) {
  return Number(node.operator + node.argument.value);
}

module.exports = computeUnaryExpression;
