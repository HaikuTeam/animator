var Emitter = require('./../emitter')
var Constants = require('./../constants')
var HaikuTimeline = require('./HaikuTimeline')
var HaikuClock = require('./HaikuClock')
var HaikuBytecode = require('./HaikuBytecode')

function HaikuPlayer (_component) {
  if (!(this instanceof HaikuPlayer)) return new HaikuPlayer(_component)
  Emitter.create(this)
  this._component = _component
  this._bytecode = _component.bytecode.bytecode
  this.VERSION = require('./../../package.json').version
  this.inputs = this._component.bytecode
}

HaikuPlayer.prototype.getProperty = function get (key) {
  return this._component.inputs[key]
}

HaikuPlayer.prototype.setProperty = function get (key, value) {
  this._component.inputs[key] = value
  return this
}

HaikuPlayer.prototype.setOption = function setOption (key, value) {
  this.getOptions()[key] = value
  return this
}

HaikuPlayer.prototype.getOption = function getOption (key) {
  return this.getOptions()[key]
}

HaikuPlayer.prototype.getOptions = function getOptions () {
  return this._component.options
}

HaikuPlayer.prototype.setOptions = function setOptions (incoming) {
  var options = this.getOptions()
  for (var key in incoming) options[key] = incoming[key]
  return this
}

HaikuPlayer.prototype.getClock = function getClock () {
  if (!this._clockInstance) this._clockInstance = new HaikuClock(this)
  return this._clockInstance
}

HaikuPlayer.prototype.getBytecode = function getBytecode () {
  if (!this._bytecodeInstance) this._bytecodeInstance = new HaikuBytecode(this)
  return this._bytecodeInstance
}

HaikuPlayer.prototype.getTimelines = function getTimelines () {
  if (!this._timelineInstances) this._timelineInstances = {}
  var timelineStores = this._component.fetchAllTimelineStores()
  for (var timelineName in timelineStores) {
    if (!this._timelineInstances[timelineName]) {
      this._timelineInstances[timelineName] = new HaikuTimeline(timelineName, this, timelineStores[timelineName])
    }
  }
  return this._timelineInstances
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
