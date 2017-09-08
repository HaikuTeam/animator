var merge = require('lodash.merge')
var assign = require('lodash.assign')
var defaults = require('lodash.defaults')

function mergeTimelineStructure (bytecodeObject, timelineStructure, mergeStrategy) {
  for (var timelineName in timelineStructure) {
    if (!bytecodeObject.timelines[timelineName]) {
      bytecodeObject.timelines[timelineName] = timelineStructure[timelineName]
    } else {
      switch (mergeStrategy) {
        case 'merge': merge(bytecodeObject.timelines[timelineName], timelineStructure[timelineName]); break
        case 'assign': assign(bytecodeObject.timelines[timelineName], timelineStructure[timelineName]); break
        case 'defaults': defaults(bytecodeObject.timelines[timelineName], timelineStructure[timelineName]); break
        default: throw new Error('Unknown merge strategy `' + mergeStrategy + '`')
      }
    }
  }
}

module.exports = mergeTimelineStructure
