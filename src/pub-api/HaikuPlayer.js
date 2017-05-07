var Emitter = require('./../emitter')
var Constants = require('./../constants')
var HaikuTimeline = require('./HaikuTimeline')
var HaikuClock = require('./HaikuClock')

function HaikuPlayer (_component) {
  if (!(this instanceof HaikuPlayer)) return new HaikuPlayer(_component)
  Emitter.create(this)
  this._component = _component
  this.VERSION = require('./../../package.json').version
}

HaikuPlayer.prototype.getClock = function getClock () {
  return new HaikuClock(this)
}

HaikuPlayer.prototype.getTimelines = function getTimelines () {
  var timelines = {}
  var timelineStores = this._component.fetchAllTimelineStores()
  for (var timelineName in timelineStores) {
    var timelineStore = timelineStores[timelineName]
    timelines[timelineName] = new HaikuTimeline(timelineName, this, timelineStore)
  }
  return timelines
}

HaikuPlayer.prototype.getDefaultTimeline = function getDefaultTimeline () {
  var timelines = this.getTimelines()
  return timelines[Constants.DEFAULT_TIMELINE_NAME]
}

HaikuPlayer.prototype.getActiveTimelines = function getActiveTimelines () {
  var activeTimelines = {}
  var timelines = this.getTimelines()
  for (var timelineName in timelines) {
    var timelineInstance = timelines[timelineName]
    if (timelineInstance.isActive()) {
      activeTimelines[timelineName] = timelineInstance
    }
  }
  return activeTimelines
}

// HaikuPlayer.prototype.getFps = function getFps () {
//   var clock = this.getClock()
//   return clock.getFps()
// }

// HaikuPlayer.prototype.setFps = function setFps (fps) {
//   var clock = this.getClock()
//   clock.setFps(fps)
//   return this
// }

// HaikuPlayer.prototype.getTimeUnits = function getTimeUnits () {
// }

// HaikuPlayer.prototype.setTimeUnits = function setTimeUnits () {
// }

module.exports = HaikuPlayer
