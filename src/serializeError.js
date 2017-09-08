export default function serializeError (err) {
  if (!err) return null
  return {
    name: err.name,
    message: err.message,
    stack: err.stack,
    code: err.code,
    status: err.status,
    type: err.type
  }
}
