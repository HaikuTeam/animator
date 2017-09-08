var raf = require("./vendor/raf");
var assign = require("./vendor/assign");
var SimpleEventEmitter = require("./helpers/SimpleEventEmitter");
var HaikuGlobal = require("./HaikuGlobal");
var NUMBER = "number";
var DEFAULT_OPTIONS = {
    frameDuration: 16.666,
    frameDelay: 16.666,
    marginOfErrorForDelta: 1.0
};
if (!HaikuGlobal.HaikuGlobalAnimationHarness) {
    HaikuGlobal.HaikuGlobalAnimationHarness = {};
    HaikuGlobal.HaikuGlobalAnimationHarness.queue = [];
    HaikuGlobal.HaikuGlobalAnimationHarness.frame = function HaikuGlobalAnimationHarnessFrame() {
        var queue = HaikuGlobal.HaikuGlobalAnimationHarness.queue;
        var length = queue.length;
        for (var i = 0; i < length; i++) {
            queue[i]();
        }
        HaikuGlobal.HaikuGlobalAnimationHarness.raf = raf(HaikuGlobal.HaikuGlobalAnimationHarness.frame);
    };
    HaikuGlobal.HaikuGlobalAnimationHarness.cancel = function HaikuGlobalAnimationHarnessCancel() {
        if (HaikuGlobal.HaikuGlobalAnimationHarness.raf) {
            raf.cancel(HaikuGlobal.HaikuGlobalAnimationHarness.raf);
        }
    };
    HaikuGlobal.HaikuGlobalAnimationHarness.frame();
}
function HaikuClock(tickables, component, options) {
    if (!(this instanceof HaikuClock)) {
        return new HaikuClock(tickables, component, options);
    }
    SimpleEventEmitter.create(this);
    this._tickables = tickables;
    this._component = component;
    this.assignOptions(options);
    this._isRunning = false;
    this._reinitialize();
    HaikuGlobal.HaikuGlobalAnimationHarness.queue.push(this.run.bind(this));
    this.GLOBAL_ANIMATION_HARNESS = HaikuGlobal.HaikuGlobalAnimationHarness;
}
HaikuClock.prototype._reinitialize = function _reinitialize() {
    this._numLoopsRun = 0;
    this._localFramesElapsed = 0;
    this._localTimeElapsed = 0;
    this._deltaSinceLastTick = 0;
    this._localExplicitlySetTime = null;
    return this;
};
HaikuClock.prototype.addTickable = function addTickable(tickable) {
    this._tickables.push(tickable);
    return this;
};
HaikuClock.prototype.assignOptions = function assignOptions(options) {
    this.options = assign(this.options || {}, DEFAULT_OPTIONS, options || {});
    return this;
};
HaikuClock.prototype.run = function run() {
    if (this.isRunning()) {
        if (this._isTimeControlled()) {
            this.tick();
        }
        else {
            this._numLoopsRun++;
            var prevTime = this._localTimeElapsed;
            var nextTime = prevTime + this.options.frameDuration;
            var deltaSinceLastTick = nextTime - prevTime + this._deltaSinceLastTick;
            if (deltaSinceLastTick >=
                this.options.frameDelay - this.options.marginOfErrorForDelta) {
                this.tick();
                this._localFramesElapsed++;
                this._localTimeElapsed = nextTime;
                this._deltaSinceLastTick = 0;
            }
            else {
                this._deltaSinceLastTick = deltaSinceLastTick;
            }
        }
    }
    return this;
};
HaikuClock.prototype.tick = function tick() {
    for (var i = 0; i < this._tickables.length; i++) {
        this._tickables[i].performTick();
    }
    return this;
};
HaikuClock.prototype.getTime = function getTime() {
    return this.getExplicitTime();
};
HaikuClock.prototype.setTime = function setTime(time) {
    this._localExplicitlySetTime = parseInt(time || 0, 10);
    return this;
};
HaikuClock.prototype.getExplicitTime = function getExplicitTime() {
    if (this._isTimeControlled())
        return this.getControlledTime();
    return this.getRunningTime();
};
HaikuClock.prototype.getControlledTime = function getControlledTime() {
    return this._localExplicitlySetTime;
};
HaikuClock.prototype._isTimeControlled = function _isTimeControlled() {
    return typeof this._localExplicitlySetTime === NUMBER;
};
HaikuClock.prototype.getRunningTime = function getRunningTime() {
    return this._localTimeElapsed;
};
HaikuClock.prototype.isRunning = function isRunning() {
    return this._isRunning;
};
HaikuClock.prototype.start = function start() {
    this._isRunning = true;
    return this;
};
HaikuClock.prototype.stop = function stop() {
    this._isRunning = false;
    return this;
};
HaikuClock.prototype.getFrameDuration = function getFrameDuration() {
    return this.options.frameDuration;
};
module.exports = HaikuClock;
