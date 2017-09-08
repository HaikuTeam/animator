// timelines: {
//   t0: {
//     '#div': {
//       style: {
//         0: // etc
//       }
//     }
//   }
// }
function eachTimelineOutputCluster (bytecode, iteratee, binding) {
  if (!bytecode.timelines) return null
  for (var timelineName in bytecode.timelines) {
    var outputs = bytecode.timelines[timelineName]
    for (var selector in outputs) {
      var group = outputs[selector]
      for (var outputname in group) {
        var cluster = group[outputname]
        iteratee.call(binding, timelineName, cluster, selector, outputname)
      }
    }
  }
}

module.exports = eachTimelineOutputCluster
