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
  return this.template.expand(this.context, this, this.inputs)
}

Component.prototype.eachEventHandler = function eachEventHandler (iteratee) {
  this.bytecode.eachEventHandler(iteratee)
}

Component.prototype.eachActiveTimeline = function eachActiveTimeline (iteratee) {
  var timelines = this.store.get('timelines')
  this.bytecode.eachTimeline(function _eachTimeline (timelinename, timelineobj) {
    var timeline = timelines[timelinename]
    if (timeline && timeline.isActive()) {
      iteratee(timeline, timelinename, timeline.local)
    }
  })
}

Component.prototype.eachActiveTimelineOutputCluster = function eachTimelineOutputCluster (iteratee) {
  var timelines = this.store.get('timelines')
  this.bytecode.eachTimelineOutputCluster(function _eachTimeline (timelinename, cluster, selector, outputname) {
    var timeline = timelines[timelinename]
    if (timeline && timeline.isActive()) {
      iteratee(timeline, timelinename, cluster, timeline.local, selector, outputname)
    }
  })
}

Component.prototype.stopAllTimelines = function stopAllTimelines () {
  this.eachActiveTimeline(function _eachActiveTimeline (timeline) {
    timeline.stop()
  })
}

Component.prototype.startAllTimelines = function startAllTimelines () {
  var timelines = this.store.get('timelines') || {}
  for (var timelineName in timelines) this.startTimeline(timelineName)
}

Component.prototype.startTimeline = function startTimeline (timelineName) {
  var time = this.context.clock.getTime()
  var existing = this.store.get('timelines')[timelineName]
  if (existing) existing.start(time)
  else this.store.get('timelines')[timelineName] = new Timeline(time)
}

Component.prototype.stopTimeline = function startTimeline (timelineName) {
  var time = this.context.clock.getTime()
  var existing = this.store.get('timelines')[timelineName]
  if (existing) existing.stop(time)
}

module.exports = Component

var Template = require('./template')
var Timeline = require('./timeline')
