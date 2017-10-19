"use strict";
exports.__esModule = true;
var getTimelineMaxTime_1 = require("./helpers/getTimelineMaxTime");
var SimpleEventEmitter_1 = require("./helpers/SimpleEventEmitter");
var assign_1 = require("./vendor/assign");
var NUMBER = 'number';
var DEFAULT_OPTIONS = {
    loop: true
};
function HaikuTimeline(component, name, descriptor, options) {
    SimpleEventEmitter_1["default"].create(this);
    this._component = component;
    this._name = name;
    this._descriptor = descriptor;
    this.assignOptions(options || {});
    this._globalClockTime = 0;
    this._localElapsedTime = 0;
    this._localExplicitlySetTime = null;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime_1["default"](descriptor);
    this._isActive = false;
    this._isPlaying = false;
}
exports["default"] = HaikuTimeline;
HaikuTimeline.prototype.assignOptions = function assignOptions(options) {
    this.options = assign_1["default"](this.options || {}, DEFAULT_OPTIONS, options || {});
    return this;
};
HaikuTimeline.prototype._ensureClockIsRunning = function _ensureClockIsRunning() {
    var clock = this._component.getClock();
    if (!clock.isRunning()) {
        clock.start();
    }
    return this;
};
HaikuTimeline.prototype._setComponent = function _setComponent(component) {
    this._component = component;
    return this;
};
HaikuTimeline.prototype._updateInternalProperties = function _updateInternalProperties(updatedGlobalClockTime) {
    var previousGlobalClockTime = this._globalClockTime;
    var deltaGlobalClockTime = updatedGlobalClockTime - previousGlobalClockTime;
    this._globalClockTime = updatedGlobalClockTime;
    if (this._isTimeControlled()) {
        this._localElapsedTime = this._localExplicitlySetTime;
    }
    else {
        if (this.options.loop &&
            this._localElapsedTime > this._maxExplicitlyDefinedTime) {
            this._localElapsedTime =
                0 + this._maxExplicitlyDefinedTime - this._localElapsedTime;
        }
        this._localElapsedTime += deltaGlobalClockTime;
    }
    if (this.isFinished()) {
        this._isPlaying = false;
    }
};
HaikuTimeline.prototype._doUpdateWithGlobalClockTime = function _doUpdateWithGlobalClockTime(globalClockTime) {
    if (this.isFrozen()) {
        this._updateInternalProperties(this._globalClockTime);
    }
    else {
        this._updateInternalProperties(globalClockTime);
    }
    if (this.isActive() && this.isPlaying()) {
        this._shout('tick');
    }
    this._shout('update');
    return this;
};
HaikuTimeline.prototype._resetMaxDefinedTimeFromDescriptor = function _resetMaxDefinedTimeFromDescriptor(descriptor) {
    this._maxExplicitlyDefinedTime = getTimelineMaxTime_1["default"](descriptor);
    return this;
};
HaikuTimeline.prototype._isTimeControlled = function _isTimeControlled() {
    return typeof this.getControlledTime() === NUMBER;
};
HaikuTimeline.prototype._controlTime = function _controlTime(controlledTimeToSet, updatedGlobalClockTime) {
    this._localExplicitlySetTime = parseInt(controlledTimeToSet || 0, 10);
    this._updateInternalProperties(updatedGlobalClockTime);
    return this;
};
HaikuTimeline.prototype.getName = function getName() {
    return this._name;
};
HaikuTimeline.prototype.getMaxTime = function getMaxTime() {
    return this._maxExplicitlyDefinedTime;
};
HaikuTimeline.prototype.getClockTime = function getClockTime() {
    return this._globalClockTime;
};
HaikuTimeline.prototype.getElapsedTime = function getElapsedTime() {
    return this._localElapsedTime;
};
HaikuTimeline.prototype.getControlledTime = function getControlledTime() {
    return this._localExplicitlySetTime;
};
HaikuTimeline.prototype.getBoundedTime = function getBoundedTime() {
    var max = this.getMaxTime();
    var elapsed = this.getElapsedTime();
    if (elapsed > max) {
        return max;
    }
    return elapsed;
};
HaikuTimeline.prototype.getTime = function getTime() {
    return this.getBoundedTime();
};
HaikuTimeline.prototype.getBoundedFrame = function getBoundedFrame() {
    var time = this.getBoundedTime();
    var timeStep = this._component.getClock().getFrameDuration();
    return Math.round(time / timeStep);
};
HaikuTimeline.prototype.getUnboundedFrame = function getUnboundedFrame() {
    var time = this.getElapsedTime();
    var timeStep = this._component.getClock().getFrameDuration();
    return Math.round(time / timeStep);
};
HaikuTimeline.prototype.getFrame = function getFrame() {
    return this.getBoundedFrame();
};
HaikuTimeline.prototype.isPlaying = function isPlaying() {
    return !!this._isPlaying;
};
HaikuTimeline.prototype.isActive = function isActive() {
    return !!this._isActive;
};
HaikuTimeline.prototype.isFrozen = function isFrozen() {
    return !!this.options.freeze;
};
HaikuTimeline.prototype.isFinished = function () {
    if (this.options.loop) {
        return false;
    }
    return ~~this.getElapsedTime() > this.getMaxTime();
};
HaikuTimeline.prototype.duration = function duration() {
    return this.getMaxTime() || 0;
};
HaikuTimeline.prototype.getDuration = function getDuration() {
    return this.duration();
};
HaikuTimeline.prototype.setRepeat = function setRepeat(bool) {
    this.options.loop = bool;
    return this;
};
HaikuTimeline.prototype.getRepeat = function getRepeat() {
    return !!this.options.loop;
};
HaikuTimeline.prototype.freeze = function freeze() {
    this.options.freeze = true;
    return this;
};
HaikuTimeline.prototype.unfreeze = function freeze() {
    this.options.freeze = false;
    return this;
};
HaikuTimeline.prototype._shout = function _shout(key) {
    var frame = this.getFrame();
    var time = Math.round(this.getTime());
    var name = this.getName();
    this.emit(key, frame, time);
    this._component.emit('timeline:' + key, name, frame, time);
    return this;
};
HaikuTimeline.prototype.start = function start(maybeGlobalClockTime, descriptor) {
    this._localElapsedTime = 0;
    this._isActive = true;
    this._isPlaying = true;
    this._globalClockTime = maybeGlobalClockTime || 0;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime_1["default"](descriptor);
    this._shout('start');
    return this;
};
HaikuTimeline.prototype.stop = function stop(maybeGlobalClockTime, descriptor) {
    this._isActive = false;
    this._isPlaying = false;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime_1["default"](descriptor);
    this._shout('stop');
    return this;
};
HaikuTimeline.prototype.pause = function pause() {
    var time = this._component.getClock().getTime();
    var descriptor = this._component._getTimelineDescriptor(this._name);
    this.stop(time, descriptor);
    this._shout('pause');
    return this;
};
HaikuTimeline.prototype.play = function play(requestedOptions) {
    var options = requestedOptions || {};
    this._ensureClockIsRunning();
    var time = this._component.getClock().getTime();
    var descriptor = this._component._getTimelineDescriptor(this._name);
    var local = this._localElapsedTime;
    this.start(time, descriptor);
    if (this._localExplicitlySetTime !== null) {
        this._localElapsedTime = this._localExplicitlySetTime;
        this._localExplicitlySetTime = null;
    }
    else {
        this._localElapsedTime = local;
    }
    if (!options.skipMarkForFullFlush) {
        this._component._markForFullFlush(true);
    }
    this._shout('play');
    return this;
};
HaikuTimeline.prototype.seek = function seek(ms) {
    this._ensureClockIsRunning();
    var clockTime = this._component.getClock().getTime();
    this._controlTime(ms, clockTime);
    var descriptor = this._component._getTimelineDescriptor(this._name);
    this.start(clockTime, descriptor);
    this._component._markForFullFlush(true);
    this._shout('seek');
    return this;
};
HaikuTimeline.prototype.gotoAndPlay = function gotoAndPlay(ms) {
    this._ensureClockIsRunning();
    this.seek(ms);
    this.play();
    return this;
};
HaikuTimeline.prototype.gotoAndStop = function gotoAndStop(ms) {
    this._ensureClockIsRunning();
    this.seek(ms);
    return this;
};
//# sourceMappingURL=HaikuTimeline.js.map