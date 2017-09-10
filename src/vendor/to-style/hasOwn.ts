let objectHasOwn = Object.prototype.hasOwnProperty

export default function hasOwn(object, propertyName) {
  return objectHasOwn.call(object, propertyName)
}
