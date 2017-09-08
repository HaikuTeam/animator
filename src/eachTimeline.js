// timelines: {
//   t0: {
//     ...
//   }
// }
function eachTimeline (bytecode, iteratee, binding) {
  if (!bytecode.timelines) return null
  for (var timelineName in bytecode.timelines) {
    iteratee.call(binding, timelineName, bytecode.timelines[timelineName])
  }
}

module.exports = eachTimeline
