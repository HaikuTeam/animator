// Removes any cache property that we set on the in-mem bytecode so that
// subsequent renders don't find themselves in a bad state
export default function clearInMemoryBytecodeCaches (bytecode) {
  if (!bytecode) {
    return null
  }

  if (bytecode.timelines) {
    for (var timelineName in bytecode.timelines) {
      delete bytecode.timelines[timelineName].__max
    }
  }

  return bytecode
}
