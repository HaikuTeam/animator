var EventEmitter = require('events').EventEmitter
var util = require('util')
// var Promise = require('bluebird').Promise

function TimelineModel (component, window) {
  function Timeline (attrs) {
    EventEmitter.call(this)

    this.folder = null // assigned via attrs
    this.name = null // assigned via attrs

    this.playing = false
    this.stopwatch = Date.now()
    this.currentFrame = 0
    this.playing = false
    this.fps = 60
    this._lastSeek = null

    this.initialize(attrs)

    this.raf = null // Store raf so it can be cancelled
    this.update = this.update.bind(this)
    this.update()
  }

  util.inherits(Timeline, EventEmitter)

  // An event emitter on behalf of the class, so folks can subscribe to events from 'any' timeline.
  // Useful if you want to get notified of a change or action on any element within this collection.
  var emitter = new EventEmitter()
  Timeline.on = emitter.on.bind(emitter)
  Timeline.emit = emitter.emit.bind(emitter)

  Timeline.dict = {}

  Timeline.objToId = function objToId (attrs) {
    return attrs.folder + '::' + attrs.name
  }

  Timeline.upsert = function upsert (attrs) {
    var instance
    if (Timeline.dict[Timeline.objToId(attrs)]) {
      instance = Timeline.dict[Timeline.objToId(attrs)]
      instance.initialize(attrs)
    } else {
      instance = new Timeline(attrs)
      Timeline.dict[Timeline.objToId(attrs)] = instance
      instance.on('timeline:tick', (frame) => {
        Timeline.emit('timeline:tick', frame)
      })
    }
    return instance
  }

  Timeline.prototype.initialize = function initialize (attrs) {
    for (var key in attrs) {
      this[key] = attrs[key]
    }
  }

  Timeline.prototype.getId = function getId () {
    return Timeline.objToId(this)
  }

  Timeline.prototype.setAuthoritativeFrame = function setAuthoritativeFrame (authoritativeFrame) {
    var lastFrame = this.lastAuthoritativeFrame
    this.lastAuthoritativeFrame = authoritativeFrame
    this.stopwatch = Date.now()
    this.emit('timeline:tick', authoritativeFrame)
  }

  Timeline.prototype.getExtrapolatedCurrentFrame = function getExtrapolatedCurrentFrame () {
    var lap = Date.now()
    var spanMs = lap - this.stopwatch
    var spanS = spanMs / 1000
    var spanFrames = spanS * this.fps
    // var max // TODO: handle?
    return this.lastAuthoritativeFrame + spanFrames
  }

  Timeline.prototype.play = function play () {
    this.playing = true
    this.stopwatch = Date.now()
    if (!this.getEnvoyClient().isInMockMode()) {
      // TODO: need to setTimelineTime
      this.getEnvoyChannel().play(this.getId())
      this.getEnvoyChannel().play(this.getId()).then(() => {
        this.update()
      })
    }
  }

  Timeline.prototype.pause = function pause () {
    this.playing = false
    if (!this.getEnvoyClient().isInMockMode()) {
      this.getEnvoyChannel().pause(this.getId()).then((finalFrame) => {
        this.currentFrame = finalFrame
        this.setAuthoritativeFrame(finalFrame)
      })
    }
  }

  Timeline.prototype.seek = function seek (newFrame) {
    this.currentFrame = newFrame
    var id = this.getId()
    var tuple = id + '|' + newFrame
    var last = this._lastSeek
    if (last !== tuple) {
      this._lastSeek = tuple
      this.setAuthoritativeFrame(newFrame)
      if (!this.getEnvoyClient().isInMockMode()) {
        this.getEnvoyChannel().seekToFrame(id, newFrame)
      }
    }
  }

  Timeline.prototype.seekAndPause = function seekAndPause (newFrame) {
    this.currentFrame = newFrame
    this.playing = false
    if (!this.getEnvoyClient().isInMockMode()) {
      this.getEnvoyChannel().seekToFrameAndPause(this.getId(), newFrame).then((finalFrame) => {
        this.currentFrame = finalFrame
        this.setAuthoritativeFrame(finalFrame)
      })
    }
  }

  Timeline.prototype.update = function update () {
    if (this.playing) {
      if (!this.requestingFrame) {
        this.requestingFrame = true
        if (!this.getEnvoyClient().isInMockMode()) {
          this.getEnvoyChannel().getCurrentFrame(this.getId()).then((currentFrame) => {
            this.requestingFrame = false
            this.currentFrame = currentFrame
            this.setAuthoritativeFrame(currentFrame)
          })
        }
      }
      this.currentFrame = this.getExtrapolatedCurrentFrame()
      this.emit('timeline:tick', this.currentFrame)
      this.raf = window.requestAnimationFrame(this.update)
    }
  }

  Timeline.prototype.getEnvoyChannel = function getEnvoyChannel () {
    return component._envoyTimelineChannel
  }

  Timeline.prototype.getEnvoyClient = function getEnvoyClient () {
    return component._envoyClient
  }

  return Timeline
}

module.exports = TimelineModel
