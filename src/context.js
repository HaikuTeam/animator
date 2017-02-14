var Bytecode = require('./bytecode')
var Clock = require('./clock')
var Emitter = require('./emitter')
var Store = require('./store')
var Template = require('./template')
var Timeline = require('./timeline')
var Instance = require('./instance')

function Context (bytecode) {
  this.store = new Store().allocate(Math.random() + '')
  this.bytecode = new Bytecode(bytecode)
  this.clock = new Clock([this])
  this.template = new Template(this.bytecode.getTemplate())
  this.instance = new Instance()
  this.inputs = this.store.set('inputs', {})
  this.bytecode.defineInputs(this.inputs, this.instance)
  Emitter.create(this)
  this.startTimeline(Timeline.DEFAULT_NAME)
}

Context.prototype.expandTree = function expandTree () {
  return this.template.applyContextChanges(this, this.instance, this.inputs)
}

Context.prototype.eachEventHandler = function eachEventHandler (iteratee) {
  this.bytecode.eachEventHandler(iteratee)
}

Context.prototype.eachActiveTimeline = function eachActiveTimeline (iteratee) {
  var timelines = this.store.get('timelines')
  this.bytecode.eachTimeline(function _eachTimeline (timelinename, cluster, selector, outputname) {
    var timeline = timelines[timelinename]
    if (timeline && timeline.isActive()) {
      iteratee(timeline, timelinename, cluster, timeline.local, selector, outputname)
    }
  })
}

Context.prototype.performTick = function performTick () {
  var time = this.clock.getTime()
  this.eachActiveTimeline(function _eachActiveTimeline (timeline) {
    timeline.performUpdate(time)
  })
  this.emit('update')
}

Context.prototype.stopAllTimelines = function stopAllTimelines () {
  this.eachActiveTimeline(function _eachActiveTimeline (timeline) {
    timeline.stop()
  })
}

Context.prototype.startTimeline = function startTimeline (timelineName) {
  var time = this.clock.getTime()
  var existing = this.store.get('timelines')[timelineName]
  if (existing) existing.start(time)
  else this.store.get('timelines')[timelineName] = new Timeline(time)
}

module.exports = Context
