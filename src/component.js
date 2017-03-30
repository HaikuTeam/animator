var Bytecode = require('./bytecode')
var Store = require('./store')
var Instance = require('./instance')

var OBJECT_TYPE = 'object'
var FUNCTION_TYPE = 'function'

function Component (bytecode) {
  this.store = new Store().allocate(Math.random() + '')
  this.bytecode = new Bytecode(bytecode)
  this.template = new Template(this.bytecode.getTemplate(), this)
  this.instance = new Instance(this)
  this.inputs = this.store.set('inputs', {})
  this.bytecode.defineInputs(this.inputs, this.instance)
  this.bytecode.bindEventHandlers(this.instance)
  this.context = void (0) // <~ Hack: This must get assigned by someone
  this._scopes = {}
  this._needsFullFlush = false
  this._lastTemplateExpansion = null
  this._lastDeltaPatches = null
  this._lastEventListenerPatches = null
}

Component.isBytecode = function isBytecode (something) {
  return something && typeof something === OBJECT_TYPE && something.template
}

Component.isComponent = function isComponent (something) {
  return something && typeof something.render === FUNCTION_TYPE
}

Component.prototype.shouldPerformFullFlush = function shouldPerformFullFlush () {
  return this._needsFullFlush
}

Component.prototype.patchEventListeners = function patchEventListeners (container) {
  this._lastEventListenerPatches = this.template.eventListenerDeltas(this.context, this, container, this.inputs, [], null, null)
  return this._lastEventListenerPatches
}

Component.prototype.patch = function patch (container) {
  var time = this.context.clock.getTime()
  var timelinesRunning = []
  var timelineInstances = this.store.get('timelines')
  for (var timelineName in timelineInstances) {
    var timeline = timelineInstances[timelineName]
    if (timeline.isActive()) {
      timeline.performUpdate(time)
      if (timelineName === 'Default' || !timeline.isFinished()) {
        timelinesRunning.push(timeline)
      }
    }
  }
  var eventsFired = this.bytecode.getEventsFired()
  var inputsChanged = this.bytecode.getInputsChanged()
  this._lastDeltaPatches = this.template.deltas(this.context, this, container, this.inputs, timelinesRunning, eventsFired, inputsChanged)
  this.bytecode.clearDetectedEventsFired()
  this.bytecode.clearDetectedInputChanges()
  return this._lastDeltaPatches
}

Component.prototype.render = function render (container) {
  var time = this.context.clock.getTime()
  var timelines = this.store.get('timelines')
  for (var timelineName in timelines) {
    var timeline = timelines[timelineName]
    if (timeline.isActive()) {
      timeline.performUpdate(time)
    }
  }
  this._lastTemplateExpansion = this.template.expand(this.context, this, container, this.inputs)
  this._needsFullFlush = false
  return this._lastTemplateExpansion
}

Component.prototype.stopAllTimelines = function stopAllTimelines () {
  var timelines = this.store.get('timelines')
  for (var timelineName in timelines) {
    var timeline = timelines[timelineName]
    timeline.stop()
  }
}

Component.prototype.startAllTimelines = function startAllTimelines () {
  var timelines = this.store.get('timelines') || {}
  for (var timelineName in timelines) this.startTimeline(timelineName)
}

Component.prototype.startTimeline = function startTimeline (timelineName) {
  var time = this.context.clock.getTime()
  var descriptor = this.bytecode.bytecode.timelines[timelineName]
  var existing = this.store.get('timelines')[timelineName]
  if (existing) existing.start(time, descriptor)
  else this.store.get('timelines')[timelineName] = new Timeline(time, descriptor, timelineName)
}

Component.prototype.stopTimeline = function startTimeline (timelineName) {
  var time = this.context.clock.getTime()
  var descriptor = this.bytecode.bytecode.timelines[timelineName]
  var existing = this.store.get('timelines')[timelineName]
  if (existing) existing.stop(time, descriptor)
}

module.exports = Component

var Template = require('./template')
var Timeline = require('./timeline')
