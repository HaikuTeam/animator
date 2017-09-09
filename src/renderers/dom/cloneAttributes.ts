export default function _cloneAttributes(attributes) {
  if (!attributes) return {}
  let clone = {}
  for (let key in attributes) {
    clone[key] = attributes[key]
  }
  return clone
}
