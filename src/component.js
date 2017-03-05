var Bytecode = require('./bytecode')
var Emitter = require('./emitter')
var Store = require('./store')
var Instance = require('./instance')

var OBJECT_TYPE = 'object'
var FUNCTION_TYPE = 'function'

function Component (bytecode) {
  this.store = new Store().allocate(Math.random() + '')
  this.bytecode = new Bytecode(bytecode)
  this.template = new Template(this.bytecode.getTemplate())
  this.instance = new Instance(this)
  this.inputs = this.store.set('inputs', {})
  this.bytecode.defineInputs(this.inputs, this.instance)
  this.bytecode.bindEventHandlers(this.instance)
  Emitter.create(this)
  this.context = void (0) // <~ Hack: This must get assigned by someone
}

Component.isBytecode = function isBytecode (something) {
  return something && typeof something === OBJECT_TYPE && something.template
}

Component.isComponent = function isComponent (something) {
  return something && typeof something.render === FUNCTION_TYPE
}

Component.prototype.render = function render () {
  var time = this.context.clock.getTime()
  var timelines = this.store.get('timelines')
  for (var timelineName in timelines) {
    var timeline = timelines[timelineName]
    if (timeline.isActive()) {
      timeline.performUpdate(time)
    }
  }
  return this.template.expand(this.context, this, this.inputs)
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
  else this.store.get('timelines')[timelineName] = new Timeline(time, descriptor)
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
