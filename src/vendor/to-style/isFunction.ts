let objectToString = Object.prototype.toString

export default function isFunction(v) {
  return objectToString.apply(v) === "[object Function]"
}
