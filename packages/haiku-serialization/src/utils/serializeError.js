module.exports = function serializeError (err) {
  if (!err) {
    return null;
  }
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code,
    type: err.type,
  };
};
