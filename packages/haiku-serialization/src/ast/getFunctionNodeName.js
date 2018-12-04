function getFunctionNodeName (node) {
  return (
    (node.id && node.id.name) ||
    (node.key && node.key.name) ||
    (node.name && node.name.value)
  );
}

module.exports = getFunctionNodeName;
