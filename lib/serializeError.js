"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serializeError;
function serializeError(err) {
  if (!err) return null;
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code,
    status: err.status,
    type: err.type
  };
}