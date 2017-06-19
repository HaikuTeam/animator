var Bytecode = require('./bytecode')
var Store = require('./store')
var Instance = require('./instance')
var assign = require('./utils/assign')

var OBJECT_TYPE = 'object'
var FUNCTION_TYPE = 'function'
var DEFAULTS = {}
var METAS = {}

function Component (bytecode, options, metas) {
  this.metas = assign({}, METAS, metas)
  this.store = new Store().allocate(Math.random() + '')

  // The store must be initialized before we do this
  this.assignOptions(options)

  this.bytecode = new Bytecode(bytecode)
  this.template = new Template(this.bytecode.getTemplate(), this)

  this.instance = new Instance(this) // ::HaikuPlayer
  this.inputs = this.store.set('inputs', {}) // This is just an object, but we create setters for it on the HaikuPlayer instance
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

Component.prototype.assignOptions = function assignOptions (options) {
  this.options = assign({}, DEFAULTS, options)
  var timelines = this.store.get('timelines')
  for (var timelineName in timelines) {
    var timeline = timelines[timelineName]
    timeline.assignOptions(this.options)
  }
  return this
}

Component.prototype.shouldPerformFullFlush = function shouldPerformFullFlush () {
  return this._needsFullFlush
}

Component.prototype.patchEventListeners = function patchEventListeners (container) {
  this._lastEventListenerPatches = this.template.eventListenerDeltas(this.context, this, container, this.inputs, [], null, null)
  return this._lastEventListenerPatches
}

Component.prototype.patch = function patch (container, options) {
  var time = this.context.clock.getExplicitTime()
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
  this._lastDeltaPatches = this.template.deltas(this.context, this, container, this.inputs, timelinesRunning, eventsFired, inputsChanged, options)
  this.bytecode.clearDetectedEventsFired()
  this.bytecode.clearDetectedInputChanges()
  return this._lastDeltaPatches
}

Component.prototype.render = function render (container, options) {
  var time = this.context.clock.getExplicitTime()
  var timelines = this.store.get('timelines')
  for (var timelineName in timelines) {
    var timeline = timelines[timelineName]
    if (timeline.isActive()) {
      timeline.performUpdate(time)
    }
  }
  this._lastTemplateExpansion = this.template.expand(this.context, this, container, this.inputs, options)
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

Component.prototype.fetchAllTimelineStores = function fetchAllTimelineStores () {
  var time = this.context.clock.getExplicitTime()
  var names = Object.keys(this.bytecode.bytecode.timelines)
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (name) {
      var descriptor = this.bytecode.bytecode.timelines[name]
      var existing = this.store.get('timelines')[name]
      if (!existing) {
        this.store.get('timelines')[name] = new Timeline(time, descriptor, name, this.options)
      }
    }
  }
  return this.store.get('timelines')
}

Component.prototype.startTimeline = function startTimeline (timelineName) {
  var time = this.context.clock.getExplicitTime()
  var descriptor = this.bytecode.bytecode.timelines[timelineName]
  var existing = this.store.get('timelines')[timelineName]
  if (existing) {
    existing.start(time, descriptor)
  }
  else {
    var fresh = new Timeline(time, descriptor, timelineName, this.options)
    fresh.start(time, descriptor) // Initialization alone doesn't start the timeline, so we start it explicitly
    this.store.get('timelines')[timelineName] = fresh
  }
}

Component.prototype.stopTimeline = function startTimeline (timelineName) {
  var time = this.context.clock.getExplicitTime()
  var descriptor = this.bytecode.bytecode.timelines[timelineName]
  var existing = this.store.get('timelines')[timelineName]
  if (existing) existing.stop(time, descriptor)
}

module.exports = Component

var Template = require('./template')
var Timeline = require('./timeline')
