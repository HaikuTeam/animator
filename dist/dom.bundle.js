(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.HaikuDOMPlayer = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var assign_1 = _dereq_("./vendor/assign");
var DEFAULTS = {
    onHaikuComponentWillInitialize: null,
    onHaikuComponentDidMount: null,
    onHaikuComponentWillMount: null,
    onHaikuComponentDidInitialize: null,
    onHaikuComponentWillUnmount: null,
    options: {
        seed: null,
        automount: true,
        autoplay: true,
        forceFlush: false,
        freeze: false,
        loop: false,
        frame: null,
        clock: {},
        sizing: null,
        preserve3d: "auto",
        contextMenu: "enabled",
        position: "relative",
        overflowX: null,
        overflowY: null,
        overflow: null,
        mixpanel: "6f31d4f99cf71024ce27c3e404a79a61",
        useWebkitPrefix: void (0),
        cache: {},
        interactionMode: { type: "live" }
    },
    states: null,
    eventHandlers: null,
    timelines: null,
    vanities: null,
    children: null
};
function seed() {
    return Math.random().toString(36).slice(2);
}
function build() {
    var argums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        argums[_i] = arguments[_i];
    }
    var config = {
        onHaikuComponentWillInitialize: null,
        onHaikuComponentDidMount: null,
        onHaikuComponentDidInitialize: null,
        onHaikuComponentWillUnmount: null,
        options: null,
        states: null,
        eventHandlers: null,
        timelines: null,
        template: null,
        vanities: null,
        children: null
    };
    var args = [];
    for (var i = 0; i < argums.length; i++)
        args[i] = argums[i];
    args.unshift(DEFAULTS);
    for (var j = 0; j < args.length; j++) {
        var incoming = args[j];
        if (!incoming)
            continue;
        if (typeof incoming !== "object")
            continue;
        if (incoming.onHaikuComponentWillInitialize)
            config.onHaikuComponentWillInitialize = incoming.onHaikuComponentWillInitialize;
        if (incoming.onHaikuComponentDidMount)
            config.onHaikuComponentDidMount = incoming.onHaikuComponentDidMount;
        if (incoming.onHaikuComponentDidInitialize)
            config.onHaikuComponentDidInitialize = incoming.onHaikuComponentDidInitialize;
        if (incoming.onHaikuComponentWillUnmount)
            config.onHaikuComponentWillUnmount = incoming.onHaikuComponentWillUnmount;
        if (incoming.options)
            config.options = assign_1["default"]({}, config.options, incoming.options);
        for (var key in incoming) {
            if (incoming[key] !== undefined && DEFAULTS.options.hasOwnProperty(key)) {
                config.options[key] = incoming[key];
            }
        }
        if (incoming.states)
            config.states = assign_1["default"]({}, config.states, incoming.states);
        if (incoming.initialStates && typeof incoming.initialStates === "object") {
            assign_1["default"](config.states, incoming.initialStates);
        }
        if (incoming.eventHandlers)
            config.eventHandlers = assign_1["default"]({}, config.eventHandlers, incoming.eventHandlers);
        if (incoming.timelines)
            config.timelines = assign_1["default"]({}, config.timelines, incoming.timelines);
        if (incoming.vanities)
            config.vanities = assign_1["default"]({}, config.vanities, incoming.vanities);
        if (incoming.children)
            config.children = incoming.children;
    }
    if (config.options.overflow && (config.options.overflowX || config.options.overflowY)) {
        console.warn("[haiku player] `overflow` overrides `overflowY`/`overflowX`");
        config.options.overflowX = null;
        config.options.overflowY = null;
    }
    return config;
}
exports["default"] = {
    build: build,
    seed: seed,
    DEFAULTS: DEFAULTS
};

},{"./vendor/assign":92}],3:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var HaikuGlobal_1 = _dereq_("./HaikuGlobal");
var SimpleEventEmitter_1 = _dereq_("./helpers/SimpleEventEmitter");
var assign_1 = _dereq_("./vendor/assign");
var raf_1 = _dereq_("./vendor/raf");
var NUMBER = "number";
var DEFAULT_OPTIONS = {
    frameDuration: 16.666,
    frameDelay: 16.666,
    marginOfErrorForDelta: 1.0
};
if (!HaikuGlobal_1["default"].HaikuGlobalAnimationHarness) {
    HaikuGlobal_1["default"].HaikuGlobalAnimationHarness = {};
    HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.queue = [];
    HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.frame = function HaikuGlobalAnimationHarnessFrame() {
        var queue = HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.queue;
        var length = queue.length;
        for (var i = 0; i < length; i++) {
            queue[i]();
        }
        HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.raf = raf_1["default"].request(HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.frame);
    };
    HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.cancel = function HaikuGlobalAnimationHarnessCancel() {
        if (HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.raf) {
            raf_1["default"].cancel(HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.raf);
        }
    };
    HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.frame();
}
function HaikuClock(tickables, component, options) {
    SimpleEventEmitter_1["default"].create(this);
    this._tickables = tickables;
    this._component = component;
    this.assignOptions(options);
    this._isRunning = false;
    this._reinitialize();
    HaikuGlobal_1["default"].HaikuGlobalAnimationHarness.queue.push(this.run.bind(this));
    this.GLOBAL_ANIMATION_HARNESS = HaikuGlobal_1["default"].HaikuGlobalAnimationHarness;
}
exports["default"] = HaikuClock;
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
    this.options = assign_1["default"](this.options || {}, DEFAULT_OPTIONS, options || {});
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

},{"./HaikuGlobal":6,"./helpers/SimpleEventEmitter":18,"./vendor/assign":92,"./vendor/raf":145}],4:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var Config_1 = _dereq_("./Config");
var HaikuTimeline_1 = _dereq_("./HaikuTimeline");
var addElementToHashTable_1 = _dereq_("./helpers/addElementToHashTable");
var applyPropertyToElement_1 = _dereq_("./helpers/applyPropertyToElement");
var cssQueryTree_1 = _dereq_("./helpers/cssQueryTree");
var scopifyElements_1 = _dereq_("./helpers/scopifyElements");
var SimpleEventEmitter_1 = _dereq_("./helpers/SimpleEventEmitter");
var upgradeBytecodeInPlace_1 = _dereq_("./helpers/upgradeBytecodeInPlace");
var Layout3D_1 = _dereq_("./Layout3D");
var ValueBuilder_1 = _dereq_("./ValueBuilder");
var assign_1 = _dereq_("./vendor/assign");
var pkg = _dereq_("./../package.json");
var PLAYER_VERSION = pkg.version;
var STRING_TYPE = "string";
var OBJECT_TYPE = "object";
var IDENTITY_MATRIX = Layout3D_1["default"].createMatrix();
var HAIKU_ID_ATTRIBUTE = "haiku-id";
var DEFAULT_TIMELINE_NAME = "Default";
function HaikuComponent(bytecode, context, config, metadata) {
    if (!bytecode) {
        throw new Error("Empty bytecode not allowed");
    }
    if (!bytecode.timelines) {
        throw new Error("Bytecode must define timelines");
    }
    if (!bytecode.template) {
        throw new Error("Bytecode must define template");
    }
    if (!context) {
        throw new Error("Component requires a context");
    }
    if (!config.options) {
        throw new Error("Config options required");
    }
    if (!config.options.seed) {
        throw new Error("Seed value must be provided");
    }
    SimpleEventEmitter_1["default"].create(this);
    this.PLAYER_VERSION = PLAYER_VERSION;
    this.emit("haikuComponentWillInitialize", this);
    if (config.onHaikuComponentWillInitialize) {
        config.onHaikuComponentWillInitialize(this);
    }
    this._bytecode = _clone(bytecode);
    upgradeBytecodeInPlace_1["default"](this._bytecode, {
        referenceUniqueness: Math.random().toString(36).slice(2)
    });
    this._context = context;
    this._builder = new ValueBuilder_1["default"](this);
    this._states = {};
    this.state = {};
    this._stateChanges = {};
    this._anyStateChange = false;
    this._eventsFired = {};
    this._anyEventChange = false;
    this.assignConfig(config);
    this._metadata = metadata || {};
    this._timelineInstances = {};
    this._template = _fetchAndCloneTemplate(this._bytecode.template);
    this._needsFullFlush = false;
    this._lastTemplateExpansion = null;
    this._lastDeltaPatches = null;
    this._matchedElementCache = {};
    this._renderScopes = {};
    this._doesEmitEventsVerbosely = false;
    this._frameEventListeners = {};
    this._nestedComponentElements = {};
    this._hashTableOfIdsToElements = {};
    this._horizonElements = {};
    this._controlFlowData = {};
    this.on("timeline:tick", function _anyTimelineTick(timelineName, timelineFrame, timelineTime) {
        if (this._frameEventListeners[timelineName]) {
            if (this._frameEventListeners[timelineName][timelineFrame]) {
                for (var i = 0; i < this._frameEventListeners[timelineName][timelineFrame].length; i++) {
                    this._frameEventListeners[timelineName][timelineFrame][i](timelineFrame, timelineTime);
                }
            }
        }
    }.bind(this));
    this.emit("haikuComponentDidInitialize", this);
    if (config.onHaikuComponentDidInitialize) {
        config.onHaikuComponentDidInitialize(this);
    }
    this._deactivated = false;
}
exports["default"] = HaikuComponent;
HaikuComponent["PLAYER_VERSION"] = PLAYER_VERSION;
function _clone(thing) {
    if (Array.isArray(thing)) {
        var arr = [];
        for (var i = 0; i < thing.length; i++) {
            arr[i] = _clone(thing[i]);
        }
        return arr;
    }
    else if (thing && typeof thing === "object") {
        var obj = {};
        for (var key in thing) {
            obj[key] = _clone(thing[key]);
        }
        return obj;
    }
    else {
        return thing;
    }
}
HaikuComponent.prototype._markHorizonElement = function _markHorizonElement(virtualElement) {
    if (virtualElement && virtualElement.attributes) {
        var flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
        if (flexId) {
            this._horizonElements[flexId] = virtualElement;
        }
    }
};
HaikuComponent.prototype._isHorizonElement = function _isHorizonElement(virtualElement) {
    if (virtualElement && virtualElement.attributes) {
        var flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
        return !!this._horizonElements[flexId];
    }
    return false;
};
HaikuComponent.prototype._getRealElementsAtId = function _getRealElementsAtId(flexId) {
    if (!this._hashTableOfIdsToElements[flexId])
        return [];
    return this._hashTableOfIdsToElements[flexId];
};
HaikuComponent.prototype._addElementToHashTable = function _addElementToHashTable(realElement, virtualElement) {
    addElementToHashTable_1["default"](this._hashTableOfIdsToElements, realElement, virtualElement);
    return this;
};
HaikuComponent.prototype._didElementRenderSurrogate = function _didElementRenderSurrogate(virtualElement, surrogatePlacementKey, surrogateObject) {
    if (!virtualElement)
        return false;
    if (!virtualElement.attributes)
        return false;
    var flexId = virtualElement.attributes["haiku-id"] || virtualElement.attributes.id;
    if (!flexId)
        return false;
    if (!this._controlFlowData[flexId])
        return false;
    if (!this._controlFlowData[flexId].renderedSurrogates)
        return false;
    return this._controlFlowData[flexId].renderedSurrogates[surrogatePlacementKey] === surrogateObject;
};
HaikuComponent.prototype._markElementAnticipatedSurrogates = function _markElementAnticipatedSurrogates(virtualElement, surrogatesArray) {
    var flexId = virtualElement && virtualElement.attributes && (virtualElement.attributes["haiku-id"] || virtualElement.attributes.id);
    if (flexId) {
        if (!this._controlFlowData[flexId])
            this._controlFlowData[flexId] = {};
        this._controlFlowData[flexId].anticipatedSurrogates = surrogatesArray;
    }
};
HaikuComponent.prototype._markElementSurrogateAsRendered = function _markElementSurrogateAsRendered(virtualElement, surrogatePlacementKey, surrogateObject) {
    var flexId = virtualElement && virtualElement.attributes && (virtualElement.attributes["haiku-id"] || virtualElement.attributes.id);
    if (flexId) {
        if (!this._controlFlowData[flexId])
            this._controlFlowData[flexId] = {};
        if (!this._controlFlowData[flexId].renderedSurrogates)
            this._controlFlowData[flexId].renderedSurrogates = {};
        this._controlFlowData[flexId].renderedSurrogates[surrogatePlacementKey] = surrogateObject;
    }
};
HaikuComponent.prototype.callRemount = function _callRemount(incomingConfig, skipMarkForFullFlush) {
    this.emit("haikuComponentWillMount", this);
    if (this.config.onHaikuComponentWillMount) {
        this.config.onHaikuComponentWillMount(this);
    }
    if (incomingConfig) {
        this.assignConfig(incomingConfig);
    }
    if (!skipMarkForFullFlush) {
        this._markForFullFlush(true);
    }
    this._clearCaches();
    var timelineInstances = this.getTimelines();
    for (var timelineName in timelineInstances) {
        var timelineInstance = timelineInstances[timelineName];
        if (this.config.options.autoplay) {
            if (timelineName === DEFAULT_TIMELINE_NAME) {
                timelineInstance.play({ skipMarkForFullFlush: skipMarkForFullFlush });
            }
        }
        else {
            timelineInstance.pause();
        }
    }
    this._context.contextMount();
    this.emit("haikuComponentDidMount", this);
    if (this.config.onHaikuComponentDidMount) {
        this.config.onHaikuComponentDidMount(this);
    }
};
HaikuComponent.prototype.callUnmount = function _callUnmount(incomingConfig) {
    if (incomingConfig) {
        this.assignConfig(incomingConfig);
    }
    var timelineInstances = this.getTimelines();
    for (var timelineName in timelineInstances) {
        var timelineInstance = timelineInstances[timelineName];
        timelineInstance.pause();
    }
    this._context.contextUnmount();
    this.emit("haikuComponentWillUnmount", this);
    if (this.config.onHaikuComponentWillUnmount) {
        this.config.onHaikuComponentWillUnmount(this);
    }
};
HaikuComponent.prototype.assignConfig = function _assignConfig(incomingConfig) {
    this.config = Config_1["default"].build(this.config || {}, incomingConfig || {});
    this._context.assignConfig(this.config, { skipComponentAssign: true });
    for (var timelineName in this._timelineInstances) {
        var timelineInstance = this._timelineInstances[timelineName];
        timelineInstance.assignOptions(this.config.options);
    }
    _bindStates(this._states, this, this.config.states);
    _bindEventHandlers(this, this.config.eventHandlers);
    assign_1["default"](this._bytecode.timelines, this.config.timelines);
    return this;
};
HaikuComponent.prototype._clearCaches = function _clearCaches() {
    this._states = {};
    _bindStates(this._states, this, this.config.states);
    this._stateChanges = {};
    this._anyStateChange = false;
    this._eventsFired = {};
    this._anyEventChange = false;
    this._needsFullFlush = false;
    this._lastTemplateExpansion = null;
    this._lastDeltaPatches = null;
    this._matchedElementCache = {};
    this._renderScopes = {};
    this._controlFlowData = {};
    this._clearDetectedEventsFired();
    this._clearDetectedInputChanges();
    this._builder._clearCaches();
    this._context.config.options.cache = {};
    this.config.options.cache = {};
    return this;
};
HaikuComponent.prototype.getClock = function getClock() {
    return this._context.getClock();
};
HaikuComponent.prototype.getTimelines = function getTimelines() {
    return this._fetchTimelines();
};
HaikuComponent.prototype._fetchTimelines = function _fetchTimelines() {
    var names = Object.keys(this._bytecode.timelines);
    for (var i = 0; i < names.length; i++) {
        var name_1 = names[i];
        if (!name_1)
            continue;
        var descriptor = this._getTimelineDescriptor(name_1);
        var existing = this._timelineInstances[name_1];
        if (!existing) {
            this._timelineInstances[name_1] = new HaikuTimeline_1["default"](this, name_1, descriptor, this.config.options);
        }
    }
    return this._timelineInstances;
};
HaikuComponent.prototype.getTimeline = function getTimeline(name) {
    return this.getTimelines()[name];
};
HaikuComponent.prototype.getDefaultTimeline = function getDefaultTimeline() {
    var timelines = this.getTimelines();
    return timelines[DEFAULT_TIMELINE_NAME];
};
HaikuComponent.prototype.getActiveTimelines = function getActiveTimelines() {
    var activeTimelines = {};
    var timelines = this.getTimelines();
    for (var timelineName in timelines) {
        var timelineInstance = timelines[timelineName];
        if (timelineInstance.isActive()) {
            activeTimelines[timelineName] = timelineInstance;
        }
    }
    return activeTimelines;
};
HaikuComponent.prototype.stopAllTimelines = function stopAllTimelines() {
    for (var timelineName in this._timelineInstances) {
        this.stopTimeline(timelineName);
    }
};
HaikuComponent.prototype.startAllTimelines = function startAllTimelines() {
    for (var timelineName in this._timelineInstances) {
        this.startTimeline(timelineName);
    }
};
HaikuComponent.prototype.startTimeline = function startTimeline(timelineName) {
    var time = this._context.clock.getExplicitTime();
    var descriptor = this._getTimelineDescriptor(timelineName);
    var existing = this._timelineInstances[timelineName];
    if (existing) {
        existing.start(time, descriptor);
    }
    else {
        var fresh = new HaikuTimeline_1["default"](this, timelineName, descriptor, this.config.options);
        fresh.start(time, descriptor);
        this._timelineInstances[timelineName] = fresh;
    }
};
HaikuComponent.prototype.stopTimeline = function startTimeline(timelineName) {
    var time = this._context.clock.getExplicitTime();
    var descriptor = this._getTimelineDescriptor(timelineName);
    var existing = this._timelineInstances[timelineName];
    if (existing) {
        existing.stop(time, descriptor);
    }
};
HaikuComponent.prototype._getTimelineDescriptor = function _getTimelineDescriptor(timelineName) {
    return this._bytecode.timelines[timelineName];
};
HaikuComponent.prototype.getBytecode = function getBytecode() {
    return this._bytecode;
};
HaikuComponent.prototype._getRenderScopes = function _getRenderScopes() {
    return this._renderScopes;
};
HaikuComponent.prototype._getInjectables = function _getInjectables(element) {
    var injectables = {};
    assign_1["default"](injectables, this._builder._getSummonablesSchema(element));
    for (var key in this._states) {
        var type = this._states[key].type;
        if (!type)
            type = typeof this._states[key];
        injectables[key] = type;
    }
    return injectables;
};
HaikuComponent.prototype._getTopLevelElement = function _getTopLevelElement() {
    return this._template;
};
HaikuComponent.prototype.getAddressableProperties = function getAddressableProperties() {
    return this._bytecode.states || {};
};
HaikuComponent.prototype.getParser = function getParser(outputName, virtualElement) {
    return this._bytecode.parsers && this._bytecode.parsers[outputName];
};
HaikuComponent.prototype._deactivate = function _deactivate() {
    this._deactivated = true;
    return this;
};
function _cloneTemplate(mana) {
    if (!mana) {
        return mana;
    }
    if (typeof mana === STRING_TYPE) {
        return mana;
    }
    var out = {
        elementName: mana.elementName,
        attributes: null,
        children: null
    };
    if (mana.attributes) {
        out.attributes = {};
        for (var key in mana.attributes) {
            out.attributes[key] = mana.attributes[key];
        }
    }
    if (mana.children) {
        out.children = [];
        for (var i = 0; i < mana.children.length; i++) {
            out.children[i] = _cloneTemplate(mana.children[i]);
        }
    }
    return out;
}
function _fetchAndCloneTemplate(template) {
    if (!template) {
        throw new Error("Empty template not allowed");
    }
    if (typeof template === OBJECT_TYPE) {
        if (!template.elementName) {
            console.warn("[haiku player] warning: saw unexpected bytecode template format");
        }
        return _cloneTemplate(template);
    }
    throw new Error("Unknown bytecode template format");
}
function _bindEventHandlers(component, extraEventHandlers) {
    var allEventHandlers = assign_1["default"]({}, component._bytecode.eventHandlers, extraEventHandlers);
    for (var selector in allEventHandlers) {
        var handlerGroup = allEventHandlers[selector];
        for (var eventName in handlerGroup) {
            var eventHandlerDescriptor = handlerGroup[eventName];
            var originalHandlerFn = eventHandlerDescriptor.handler;
            _bindEventHandler(component, eventHandlerDescriptor, selector, eventName, originalHandlerFn);
        }
    }
}
function _bindEventHandler(component, eventHandlerDescriptor, selector, eventName, originalHandlerFn) {
    eventHandlerDescriptor.original = originalHandlerFn;
    eventHandlerDescriptor.handler = function _wrappedEventHandler(event, a, b, c, d, e, f, g, h, i, j, k) {
        if (component.config.options.interactionMode.type === "live") {
            component._anyEventChange = true;
            if (!component._eventsFired[selector]) {
                component._eventsFired[selector] = {};
            }
            component._eventsFired[selector][eventName] =
                event || true;
            originalHandlerFn.call(component, event, a, b, c, d, e, f, g, h, i, j, k);
        }
    };
}
function _typecheckStateSpec(stateSpec, stateSpecName) {
    if (stateSpec.type === "any" ||
        stateSpec.type === "*" ||
        stateSpec.type === undefined ||
        stateSpec.type === null) {
        return void 0;
    }
    if (stateSpec.type === "event" || stateSpec.type === "listener") {
        if (typeof stateSpec.value !== "function" &&
            stateSpec.value !== null &&
            stateSpec.value !== undefined) {
            throw new Error("Property value `" +
                stateSpecName +
                "` must be an event listener function");
        }
        return void 0;
    }
    if (stateSpec.type === "array") {
        if (!Array.isArray(stateSpec.value)) {
            throw new Error("Property value `" + stateSpecName + "` must be an array");
        }
    }
    else if (stateSpec.type === "object") {
        if (stateSpec.value && typeof stateSpec.value !== "object") {
            throw new Error("Property value `" + stateSpecName + "` must be an object");
        }
    }
    else {
        if (typeof stateSpec.value !== stateSpec.type) {
            throw new Error("Property value `" + stateSpecName + "` must be a `" + stateSpec.type + "`");
        }
    }
}
function _bindStates(statesTargetObject, component, extraStates) {
    var allStates = assign_1["default"]({}, component._bytecode.states, extraStates);
    for (var stateSpecName in allStates) {
        var stateSpec = allStates[stateSpecName];
        if (stateSpec.value === undefined) {
            throw new Error("Property `" +
                stateSpecName +
                "` cannot be undefined; use null for empty states");
        }
        _typecheckStateSpec(stateSpec, stateSpecName);
        statesTargetObject[stateSpecName] = stateSpec.value;
        _defineSettableState(component, component.state, statesTargetObject, stateSpec, stateSpecName);
    }
}
function _defineSettableState(component, statesHostObject, statesTargetObject, stateSpec, stateSpecName) {
    Object.defineProperty(statesHostObject, stateSpecName, {
        configurable: true,
        get: function get() {
            return statesTargetObject[stateSpecName];
        },
        set: function set(inputValue) {
            component._stateChanges[stateSpecName] = inputValue;
            component._anyStateChange = true;
            if (stateSpec.setter) {
                statesTargetObject[stateSpecName] = stateSpec.setter.call(component, inputValue);
            }
            else {
                statesTargetObject[stateSpecName] = inputValue;
            }
            if (component._doesEmitEventsVerbosely) {
                component.emit("state:set", stateSpecName, statesTargetObject[stateSpecName], statesTargetObject);
            }
            return statesTargetObject[stateSpecName];
        }
    });
}
HaikuComponent.prototype._markForFullFlush = function _markForFullFlush(doMark) {
    this._needsFullFlush = true;
    return this;
};
HaikuComponent.prototype._unmarkForFullFlush = function _unmarkForFullFlush() {
    this._needsFullFlush = false;
    return this;
};
HaikuComponent.prototype._shouldPerformFullFlush = function _shouldPerformFullFlush() {
    return this._needsFullFlush;
};
HaikuComponent.prototype._getEventsFired = function _getEventsFired() {
    return this._anyEventChange && this._eventsFired;
};
HaikuComponent.prototype._getInputsChanged = function _getInputsChanged() {
    return this._anyStateChange && this._stateChanges;
};
HaikuComponent.prototype._clearDetectedEventsFired = function _clearDetectedEventsFired() {
    this._anyEventChange = false;
    this._eventsFired = {};
    return this;
};
HaikuComponent.prototype._clearDetectedInputChanges = function _clearDetectedInputChanges() {
    this._anyStateChange = false;
    this._stateChanges = {};
    return this;
};
HaikuComponent.prototype.patch = function patch(container, patchOptions) {
    if (this._deactivated) {
        return {};
    }
    var time = this._context.clock.getExplicitTime();
    var timelinesRunning = [];
    for (var timelineName in this._timelineInstances) {
        var timeline = this._timelineInstances[timelineName];
        if (timeline.isActive()) {
            timeline._doUpdateWithGlobalClockTime(time);
            if (timelineName === "Default" || !timeline.isFinished()) {
                timelinesRunning.push(timeline);
            }
        }
    }
    var eventsFired = this._getEventsFired();
    var inputsChanged = this._getInputsChanged();
    this._lastDeltaPatches = _gatherDeltaPatches(this, this._template, container, this._context, this._states, timelinesRunning, eventsFired, inputsChanged, patchOptions);
    for (var flexId in this._nestedComponentElements) {
        var compElement = this._nestedComponentElements[flexId];
        this._lastDeltaPatches[flexId] = compElement;
        compElement.__instance.patch(compElement, {});
    }
    this._clearDetectedEventsFired();
    this._clearDetectedInputChanges();
    return this._lastDeltaPatches;
};
HaikuComponent.prototype._getPrecalcedPatches = function _getPrecalcedPatches() {
    if (this._deactivated) {
        return {};
    }
    return this._lastDeltaPatches || {};
};
HaikuComponent.prototype.render = function render(container, renderOptions, surrogates) {
    if (this._deactivated) {
        return void 0;
    }
    var time = this._context.clock.getExplicitTime();
    for (var timelineName in this._timelineInstances) {
        var timeline = this._timelineInstances[timelineName];
        if (timeline.isActive()) {
            timeline._doUpdateWithGlobalClockTime(time);
        }
    }
    _applyContextChanges(this, this._states, this._template, container, this._context, renderOptions || {});
    this._lastTemplateExpansion = _expandTreeElement(this._template, this, this._context);
    this._needsFullFlush = false;
    return this._lastTemplateExpansion;
};
HaikuComponent.prototype._findElementsByHaikuId = function _findElementsByHaikuId(componentId) {
    return _findMatchingElementsByCssSelector("haiku:" + componentId, this._template, this._matchedElementCache);
};
function _applyBehaviors(timelinesRunning, deltas, component, template, context, isPatchOperation) {
    if (!isPatchOperation) {
        if (component._bytecode.eventHandlers) {
            for (var eventSelector in component._bytecode.eventHandlers) {
                var eventHandlerGroup = component._bytecode.eventHandlers[eventSelector];
                for (var eventName1 in eventHandlerGroup) {
                    var eventHandlerSpec1 = eventHandlerGroup[eventName1];
                    if (!eventHandlerSpec1.handler.__subscribed && !eventHandlerSpec1.handler.__external) {
                        if (eventName1 === "component:will-mount") {
                            component.on("haikuComponentWillMount", eventHandlerSpec1.handler);
                            eventHandlerSpec1.handler.__subscribed = true;
                            continue;
                        }
                        if (eventName1 === "component:did-mount") {
                            component.on("haikuComponentDidMount", eventHandlerSpec1.handler);
                            eventHandlerSpec1.handler.__subscribed = true;
                            continue;
                        }
                        if (eventName1 === "component:will-unmount") {
                            component.on("haikuComponentWillUnmount", eventHandlerSpec1.handler);
                            eventHandlerSpec1.handler.__subscribed = true;
                            continue;
                        }
                        var namePieces = eventName1.split(":");
                        if (namePieces.length > 1) {
                            if (namePieces[0] === "timeline") {
                                var timelineNamePiece = namePieces[1];
                                var frameValuePiece = parseInt(namePieces[2], 10);
                                if (!component._frameEventListeners[timelineNamePiece])
                                    component._frameEventListeners[timelineNamePiece] = {};
                                if (!component._frameEventListeners[timelineNamePiece][frameValuePiece])
                                    component._frameEventListeners[timelineNamePiece][frameValuePiece] = [];
                                component._frameEventListeners[timelineNamePiece][frameValuePiece].push(eventHandlerSpec1.handler);
                                eventHandlerSpec1.handler.__subscribed = true;
                                continue;
                            }
                        }
                        eventHandlerSpec1.handler.__external = true;
                    }
                }
                var matchingElementsForEvents = _findMatchingElementsByCssSelector(eventSelector, template, component._matchedElementCache);
                if (!matchingElementsForEvents || matchingElementsForEvents.length < 1) {
                    continue;
                }
                for (var k = 0; k < matchingElementsForEvents.length; k++) {
                    for (var eventName in eventHandlerGroup) {
                        var eventHandlerSpec = eventHandlerGroup[eventName];
                        if (!eventHandlerSpec.__subscribed) {
                            _applyHandlerToElement(matchingElementsForEvents[k], eventName, eventHandlerSpec.handler, context, component);
                        }
                    }
                }
            }
        }
    }
    for (var i = 0; i < timelinesRunning.length; i++) {
        var timelineInstance = timelinesRunning[i];
        var timelineName = timelineInstance.getName();
        var timelineTime = timelineInstance.getBoundedTime();
        var timelineDescriptor = component._bytecode.timelines[timelineName];
        for (var behaviorSelector in timelineDescriptor) {
            var propertiesGroup = timelineDescriptor[behaviorSelector];
            if (!propertiesGroup) {
                continue;
            }
            var matchingElementsForBehavior = _findMatchingElementsByCssSelector(behaviorSelector, template, component._matchedElementCache);
            if (!matchingElementsForBehavior || matchingElementsForBehavior.length < 1) {
                continue;
            }
            for (var j = 0; j < matchingElementsForBehavior.length; j++) {
                var matchingElement = matchingElementsForBehavior[j];
                var domId = matchingElement && matchingElement.attributes && matchingElement.attributes.id;
                var haikuId = matchingElement && matchingElement.attributes && matchingElement.attributes[HAIKU_ID_ATTRIBUTE];
                var flexId = haikuId || domId;
                var assembledOutputs = component._builder.build({}, timelineName, timelineTime, flexId, matchingElement, propertiesGroup, isPatchOperation, component);
                if (assembledOutputs && assembledOutputs.transform) {
                    matchingElement.__transformed = true;
                }
                if (assembledOutputs && deltas && flexId) {
                    deltas[flexId] = matchingElement;
                }
                if (assembledOutputs) {
                    for (var behaviorKey in assembledOutputs) {
                        var behaviorValue = assembledOutputs[behaviorKey];
                        applyPropertyToElement_1["default"](matchingElement, behaviorKey, behaviorValue, context, component);
                    }
                }
            }
        }
    }
}
function _gatherDeltaPatches(component, template, container, context, states, timelinesRunning, eventsFired, inputsChanged, patchOptions) {
    Layout3D_1["default"].initializeTreeAttributes(template, container);
    _initializeComponentTree(template, component, context);
    var deltas = {};
    _applyBehaviors(timelinesRunning, deltas, component, template, context, true);
    if (patchOptions.sizing) {
        _computeAndApplyPresetSizing(template, container, patchOptions.sizing, deltas);
    }
    for (var flexId in deltas) {
        var changedNode = deltas[flexId];
        _computeAndApplyTreeLayouts(changedNode, changedNode.__parent, patchOptions, context);
    }
    return deltas;
}
function _applyContextChanges(component, inputs, template, container, context, renderOptions) {
    var timelinesRunning = [];
    if (component._bytecode.timelines) {
        for (var timelineName in component._bytecode.timelines) {
            var timeline = component.getTimeline(timelineName);
            if (!timeline) {
                continue;
            }
            if (!timeline.isActive()) {
                continue;
            }
            if (timeline.isFinished()) {
                if (timelineName !== DEFAULT_TIMELINE_NAME) {
                    continue;
                }
            }
            timelinesRunning.push(timeline);
        }
    }
    Layout3D_1["default"].initializeTreeAttributes(template, container);
    _initializeComponentTree(template, component, context);
    scopifyElements_1["default"](template, null, null);
    _applyBehaviors(timelinesRunning, null, component, template, context, false);
    if (renderOptions.sizing) {
        _computeAndApplyPresetSizing(template, container, renderOptions.sizing, null);
    }
    _computeAndApplyTreeLayouts(template, container, renderOptions, context);
    return template;
}
function _initializeComponentTree(element, component, context) {
    if (_isBytecode(element.elementName) && !element.__instance) {
        var flexId = element.attributes && (element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes.id);
        element.__instance = new HaikuComponent(element.elementName, context, {
            options: context.config.options
        }, {
            nested: true
        });
        element.__instance.startTimeline(DEFAULT_TIMELINE_NAME);
        component._nestedComponentElements[flexId] = element;
    }
    if (element.children && element.children.length > 0) {
        for (var i = 0; i < element.children.length; i++) {
            _initializeComponentTree(element.children[i], component, context);
        }
    }
}
function _expandTreeElement(element, component, context) {
    if (element.__handlers) {
        for (var key in element.__handlers) {
            var handler = element.__handlers[key];
            if (!handler.__subscribed) {
                if (element.__instance) {
                    if (element.__instance.instance) {
                        element.__instance.instance.on(key, handler);
                        handler.__subscribed = true;
                    }
                }
            }
        }
    }
    if (element.__instance) {
        var wrapper = _shallowCloneComponentTreeElement(element);
        var surrogates = wrapper.children;
        var subtree = element.__instance.render(element, element.__instance.config.options, surrogates);
        var expansion = _expandTreeElement(subtree, element.__instance, context);
        wrapper.children = [expansion];
        return wrapper;
    }
    if (typeof element.elementName === STRING_TYPE) {
        var copy = _shallowCloneComponentTreeElement(element);
        if (element.children && element.children.length > 0) {
            for (var i = 0; i < element.children.length; i++) {
                var child = element.children[i];
                copy.children[i] = _expandTreeElement(child, component, context);
            }
        }
        return copy;
    }
    return element;
}
function _shallowCloneComponentTreeElement(element) {
    var clone = {
        __instance: null,
        __handlers: null,
        __transformed: null,
        __parent: null,
        __scope: null,
        __target: null,
        layout: null,
        elementName: null,
        attributes: null,
        children: null
    };
    clone.__instance = element.__instance;
    clone.__handlers = element.__handlers;
    clone.__transformed = element.__transformed;
    clone.__parent = element.__parent;
    clone.__scope = element.__scope;
    clone.__target = element.__target;
    clone.layout = element.layout;
    clone.elementName = element.elementName;
    clone.attributes = {};
    for (var key in element.attributes) {
        clone.attributes[key] = element.attributes[key];
    }
    clone.children = [];
    return clone;
}
var CSS_QUERY_MAPPING = {
    name: "elementName",
    attributes: "attributes",
    children: "children"
};
function _findMatchingElementsByCssSelector(selector, template, cache) {
    if (cache[selector])
        return cache[selector];
    var matches = cssQueryTree_1["default"]([], template, selector, CSS_QUERY_MAPPING);
    cache[selector] = matches;
    return matches;
}
function _computeAndApplyTreeLayouts(tree, container, options, context) {
    if (!tree || typeof tree === "string")
        return void 0;
    _computeAndApplyNodeLayout(tree, container, options, context);
    if (!tree.children)
        return void 0;
    if (tree.children.length < 1)
        return void 0;
    for (var i = 0; i < tree.children.length; i++) {
        _computeAndApplyTreeLayouts(tree.children[i], tree, options, context);
    }
}
function _computeAndApplyNodeLayout(element, parent, options, context) {
    if (parent) {
        var parentSize = parent.layout.computed.size;
        var computedLayout = Layout3D_1["default"].computeLayout({}, element.layout, element.layout.matrix, IDENTITY_MATRIX, parentSize);
        if (computedLayout === false) {
            element.layout.computed = {
                invisible: true,
                size: parentSize || { x: 0, y: 0, z: 0 }
            };
        }
        else {
            element.layout.computed = computedLayout || { size: parentSize };
        }
    }
}
function _applyHandlerToElement(match, name, fn, context, component) {
    if (!match.__handlers)
        match.__handlers = {};
    match.__handlers[name] = fn;
    return match;
}
function _computeAndApplyPresetSizing(element, container, mode, deltas) {
    if (mode === true) {
        mode = "contain";
    }
    var elementWidth = element.layout.sizeAbsolute.x;
    var elementHeight = element.layout.sizeAbsolute.y;
    var containerWidth = container.layout.computed.size.x;
    var containerHeight = container.layout.computed.size.y;
    var scaleDiffX = containerWidth / elementWidth;
    var scaleDiffY = containerHeight / elementHeight;
    if (!element.attributes.style["transform-origin"]) {
        element.attributes.style["transform-origin"] = "top left";
    }
    var changed = false;
    switch (mode) {
        case "normal":
            if (element.layout.scale.x !== 1.0) {
                changed = true;
                element.layout.scale.x = 1.0;
            }
            if (element.layout.scale.y !== 1.0) {
                changed = true;
                element.layout.scale.y = 1.0;
            }
            break;
        case "stretch":
            if (scaleDiffX !== element.layout.scale.x) {
                changed = true;
                element.layout.scale.x = scaleDiffX;
            }
            if (scaleDiffY !== element.layout.scale.y) {
                changed = true;
                element.layout.scale.y = scaleDiffY;
            }
            break;
        case "contain":
            var containScaleToUse = null;
            if (~~(scaleDiffX * elementWidth) <= containerWidth &&
                ~~(scaleDiffX * elementHeight) <= containerHeight) {
                containScaleToUse = scaleDiffX;
            }
            if (~~(scaleDiffY * elementWidth) <= containerWidth &&
                ~~(scaleDiffY * elementHeight) <= containerHeight) {
                if (containScaleToUse === null) {
                    containScaleToUse = scaleDiffY;
                }
                else {
                    if (scaleDiffY >= containScaleToUse) {
                        containScaleToUse = scaleDiffY;
                    }
                }
            }
            if (element.layout.scale.x !== containScaleToUse) {
                changed = true;
                element.layout.scale.x = containScaleToUse;
            }
            if (element.layout.scale.y !== containScaleToUse) {
                changed = true;
                element.layout.scale.y = containScaleToUse;
            }
            var containTranslationOffsetX = -(containScaleToUse * elementWidth - containerWidth) / 2;
            var containTranslationOffsetY = -(containScaleToUse * elementHeight - containerHeight) / 2;
            if (element.layout.translation.x !== containTranslationOffsetX) {
                changed = true;
                element.layout.translation.x = containTranslationOffsetX;
            }
            if (element.layout.translation.y !== containTranslationOffsetY) {
                changed = true;
                element.layout.translation.y = containTranslationOffsetY;
            }
            break;
        case "cover":
            var coverScaleToUse = null;
            if (~~(scaleDiffX * elementWidth) >= containerWidth &&
                ~~(scaleDiffX * elementHeight) >= containerHeight) {
                coverScaleToUse = scaleDiffX;
            }
            if (~~(scaleDiffY * elementWidth) >= containerWidth &&
                ~~(scaleDiffY * elementHeight) >= containerHeight) {
                if (coverScaleToUse === null) {
                    coverScaleToUse = scaleDiffY;
                }
                else {
                    if (scaleDiffY <= coverScaleToUse) {
                        coverScaleToUse = scaleDiffY;
                    }
                }
            }
            if (element.layout.scale.x !== coverScaleToUse) {
                changed = true;
                element.layout.scale.x = coverScaleToUse;
            }
            if (element.layout.scale.y !== coverScaleToUse) {
                changed = true;
                element.layout.scale.y = coverScaleToUse;
            }
            var coverTranslationOffsetX = -(coverScaleToUse * elementWidth - containerWidth) / 2;
            var coverTranslationOffsetY = -(coverScaleToUse * elementHeight - containerHeight) / 2;
            if (element.layout.translation.x !== coverTranslationOffsetX) {
                changed = true;
                element.layout.translation.x = coverTranslationOffsetX;
            }
            if (element.layout.translation.y !== coverTranslationOffsetY) {
                changed = true;
                element.layout.translation.y = coverTranslationOffsetY;
            }
            break;
    }
    if (changed && deltas) {
        deltas[element.attributes[HAIKU_ID_ATTRIBUTE]] = element;
    }
}
function _isBytecode(thing) {
    return thing && typeof thing === OBJECT_TYPE && thing.template && thing.timelines;
}

},{"./../package.json":167,"./Config":2,"./HaikuTimeline":8,"./Layout3D":9,"./ValueBuilder":11,"./helpers/SimpleEventEmitter":18,"./helpers/addElementToHashTable":19,"./helpers/applyPropertyToElement":21,"./helpers/cssQueryTree":30,"./helpers/scopifyElements":35,"./helpers/upgradeBytecodeInPlace":36,"./vendor/assign":92}],5:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var Config_1 = _dereq_("./Config");
var HaikuClock_1 = _dereq_("./HaikuClock");
var HaikuComponent_1 = _dereq_("./HaikuComponent");
var PRNG_1 = _dereq_("./helpers/PRNG");
var assign_1 = _dereq_("./vendor/assign");
var pkg = _dereq_("./../package.json");
var PLAYER_VERSION = pkg.version;
var DEFAULT_TIMELINE_NAME = "Default";
function HaikuContext(mount, renderer, platform, bytecode, config) {
    if (!renderer) {
        throw new Error("Context requires a renderer");
    }
    if (!bytecode) {
        throw new Error("Context requires bytecode");
    }
    this.PLAYER_VERSION = PLAYER_VERSION;
    this._prng = null;
    this.assignConfig(config || {});
    this._mount = mount;
    if (!this._mount) {
        console.info("[haiku player] mount not provided so running in headless mode");
    }
    if (this._mount && !this._mount.haiku) {
        this._mount.haiku = {
            context: this
        };
    }
    this._renderer = renderer;
    if (this._mount && this._renderer.initialize) {
        this._renderer.initialize(this._mount);
    }
    this._platform = platform;
    if (!this._platform) {
        console.warn("[haiku player] no platform (e.g. window) provided; some features may be unavailable");
    }
    HaikuContext["contexts"].push(this);
    this._tickables = [];
    this._tickables.push({ performTick: this.tick.bind(this) });
    if (this.config.options.frame) {
        this._tickables.push({ performTick: this.config.options.frame });
    }
    this.component = new HaikuComponent_1["default"](bytecode, this, this.config, null);
    this.clock = new HaikuClock_1["default"](this._tickables, this.component, this.config.options.clock || {});
    this.clock.run();
    this.component.startTimeline(DEFAULT_TIMELINE_NAME);
    if (this._mount && this._renderer.menuize && this.config.options.contextMenu !== "disabled") {
        this._renderer.menuize(this._mount, this.component);
    }
    if (this._mount &&
        this._platform &&
        this._platform.location &&
        this._platform.location.hostname !== "localhost" &&
        this._platform.location.hostname !== "0.0.0.0") {
        if (this._renderer.mixpanel && this.config.options.mixpanel) {
            this._renderer.mixpanel(this._mount, this.config.options.mixpanel, this.component);
        }
    }
    this._ticks = 0;
    if (this.config.options.automount) {
        this.component.getClock().start();
    }
}
exports["default"] = HaikuContext;
HaikuContext["contexts"] = [];
HaikuContext["PLAYER_VERSION"] = PLAYER_VERSION;
HaikuContext.prototype.getRootComponent = function getRootComponent() {
    return this.component;
};
HaikuContext.prototype.getClock = function getClock() {
    return this.clock;
};
HaikuContext.prototype.contextMount = function _contextMount() {
    if (this._unmountedTickables) {
        var unmounted = this._unmountedTickables.splice(0);
        for (var i = 0; i < unmounted.length; i++) {
            this.addTickable(unmounted[i]);
        }
    }
    return this;
};
HaikuContext.prototype.contextUnmount = function _contextUnmount() {
    this._unmountedTickables = this._tickables.splice(0);
    return this;
};
HaikuContext.prototype.addTickable = function addTickable(tickable) {
    var alreadyAdded = false;
    for (var i = 0; i < this._tickables.length; i++) {
        if (tickable === this._tickables[i]) {
            alreadyAdded = true;
            break;
        }
    }
    if (!alreadyAdded) {
        this._tickables.push(tickable);
    }
    return this;
};
HaikuContext.prototype.removeTickable = function removeTickable(tickable) {
    for (var i = (this._tickables.length - 1); i >= 0; i--) {
        if (tickable === this._tickables[i]) {
            this._tickables.splice(i, 1);
        }
    }
    return this;
};
HaikuContext.prototype.assignConfig = function assignConfig(config, options) {
    this.config = assign_1["default"]({}, config);
    if (this.clock) {
        this.clock.assignOptions(this.config.options.clock);
    }
    if (this.component) {
        if (!options || !options.skipComponentAssign) {
            this.component.assignConfig(this.config);
        }
    }
    this._prng = new PRNG_1["default"](this.config.options.seed);
    return this;
};
HaikuContext.prototype.performFullFlushRender = function performFullFlushRender() {
    if (!this._mount) {
        return void (0);
    }
    var container = this._renderer.createContainer(this._mount);
    var tree = this.component.render(container, this.config.options);
    if (tree !== undefined) {
        this._renderer.render(this._mount, container, tree, this.component);
    }
    return this;
};
HaikuContext.prototype.performPatchRender = function performPatchRender() {
    if (!this._mount) {
        return void (0);
    }
    var container = this._renderer.createContainer(this._mount);
    var patches = this.component.patch(container, this.config.options);
    this._renderer.patch(this._mount, container, patches, this.component);
    return this;
};
HaikuContext.prototype.updateMountRootStyles = function updateMountRootStyles() {
    if (!this._mount) {
        return void (0);
    }
    var root = this._mount && this._mount.children[0];
    if (root) {
        if (this.config.options.position && root.style.position !== this.config.options.position) {
            root.style.position = this.config.options.position;
        }
        if (this.config.options.overflow) {
            root.style.overflow = this.config.options.overflow;
        }
        else {
            if (this.config.options.overflowX &&
                root.style.overflowX !== this.config.options.overflowX) {
                root.style.overflowX = this.config.options.overflowX;
            }
            if (this.config.options.overflowY &&
                root.style.overflowY !== this.config.options.overflowY) {
                root.style.overflowY = this.config.options.overflowY;
            }
        }
    }
    return this;
};
HaikuContext.prototype.tick = function tick() {
    var flushed = false;
    if (!this.component._deactivated) {
        if (this.component._shouldPerformFullFlush() || this.config.options.forceFlush || this._ticks < 1) {
            this.performFullFlushRender();
            flushed = true;
        }
        else {
            this.performPatchRender();
        }
        this.updateMountRootStyles();
        if (this._ticks < 1) {
            this.component.callRemount(null, flushed);
        }
        this._ticks++;
    }
    return this;
};
HaikuContext.prototype.getDeterministicRand = function getDeterministicRand() {
    return this._prng.random();
};
HaikuContext.prototype.getDeterministicTime = function getDeterministicTime() {
    var runningTime = this.getClock().getRunningTime();
    var seededTime = this.config.options.timestamp;
    return seededTime + runningTime;
};
HaikuContext.prototype._getGlobalUserState = function _getGlobalUserState() {
    return this._renderer && this._renderer.getUser && this._renderer.getUser();
};
HaikuContext["createComponentFactory"] = function createComponentFactory(RendererClass, bytecode, haikuConfigFromFactoryCreator, platform) {
    if (!RendererClass) {
        throw new Error("A runtime renderer class object is required");
    }
    if (!bytecode) {
        throw new Error("A runtime `bytecode` object is required");
    }
    if (!platform) {
        console.warn("[haiku player] no runtime `platform` object was provided");
    }
    var haikuConfigFromTop = Config_1["default"].build({
        options: {
            seed: Config_1["default"].seed(),
            timestamp: Date.now()
        }
    }, {
        options: bytecode && bytecode.options
    }, haikuConfigFromFactoryCreator);
    function HaikuComponentFactory(mount, haikuConfigFromFactory) {
        var haikuConfigMerged = Config_1["default"].build(haikuConfigFromTop, haikuConfigFromFactory);
        var renderer = new RendererClass();
        var context = new HaikuContext(mount, renderer, platform, bytecode, haikuConfigMerged);
        var component = context.getRootComponent();
        HaikuComponentFactory["bytecode"] = bytecode;
        HaikuComponentFactory["renderer"] = renderer;
        HaikuComponentFactory["mount"] = mount;
        HaikuComponentFactory["context"] = context;
        HaikuComponentFactory["component"] = component;
        return component;
    }
    HaikuComponentFactory["PLAYER_VERSION"] = PLAYER_VERSION;
    return HaikuComponentFactory;
};

},{"./../package.json":167,"./Config":2,"./HaikuClock":3,"./HaikuComponent":4,"./helpers/PRNG":16,"./vendor/assign":92}],6:[function(_dereq_,module,exports){
(function (global){
"use strict";
exports.__esModule = true;
var enhance_1 = _dereq_("./reflection/enhance");
var inject_1 = _dereq_("./reflection/inject");
function buildRoot() {
    var ROOT = {};
    if (typeof window !== "undefined") {
        ROOT = window;
    }
    else if (typeof global !== "undefined") {
        ROOT = global;
    }
    else {
    }
    if (!ROOT["haiku"]) {
        ROOT["haiku"] = {};
    }
    if (!ROOT["haiku"]["enhance"]) {
        ROOT["haiku"]["enhance"] = enhance_1["default"];
    }
    if (!ROOT["haiku"]["inject"]) {
        ROOT["haiku"]["inject"] = inject_1["default"];
    }
    return ROOT["haiku"];
}
var haiku = buildRoot();
exports["default"] = haiku;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./reflection/enhance":51,"./reflection/inject":53}],7:[function(_dereq_,module,exports){
(function (global){
"use strict";
exports.__esModule = true;
var pkg = _dereq_("./../package.json");
var VERSION = pkg.version;
var MAIN = (typeof window !== "undefined")
    ? window
    : (typeof global !== "undefined")
        ? global
        : {};
if (!MAIN["HaikuHelpers"]) {
    MAIN["HaikuHelpers"] = {};
}
if (!MAIN["HaikuHelpers"][VERSION]) {
    MAIN["HaikuHelpers"][VERSION] = {
        helpers: {},
        schema: {}
    };
}
var exp = MAIN["HaikuHelpers"][VERSION];
exp["register"] = function register(name, method) {
    exp.helpers[name] = method;
    exp.schema[name] = "function";
    return exp;
};
exports["default"] = exp;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../package.json":167}],8:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var getTimelineMaxTime_1 = _dereq_("./helpers/getTimelineMaxTime");
var SimpleEventEmitter_1 = _dereq_("./helpers/SimpleEventEmitter");
var assign_1 = _dereq_("./vendor/assign");
var NUMBER = "number";
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
    if (!clock.isRunning())
        clock.start();
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
        this._shout("tick");
    }
    this._shout("update");
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
    if (elapsed > max)
        return max;
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
    if (this.options.loop)
        return false;
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
    this._component.emit("timeline:" + key, name, frame, time);
    return this;
};
HaikuTimeline.prototype.start = function start(maybeGlobalClockTime, descriptor) {
    this._localElapsedTime = 0;
    this._isActive = true;
    this._isPlaying = true;
    this._globalClockTime = maybeGlobalClockTime || 0;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime_1["default"](descriptor);
    this._shout("start");
    return this;
};
HaikuTimeline.prototype.stop = function stop(maybeGlobalClockTime, descriptor) {
    this._isActive = false;
    this._isPlaying = false;
    this._maxExplicitlyDefinedTime = getTimelineMaxTime_1["default"](descriptor);
    this._shout("stop");
    return this;
};
HaikuTimeline.prototype.pause = function pause() {
    var time = this._component.getClock().getTime();
    var descriptor = this._component._getTimelineDescriptor(this._name);
    this.stop(time, descriptor);
    this._shout("pause");
    return this;
};
HaikuTimeline.prototype.play = function play(options) {
    if (!options)
        options = {};
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
    this._shout("play");
    return this;
};
HaikuTimeline.prototype.seek = function seek(ms) {
    this._ensureClockIsRunning();
    var clockTime = this._component.getClock().getTime();
    this._controlTime(ms, clockTime);
    var descriptor = this._component._getTimelineDescriptor(this._name);
    this.start(clockTime, descriptor);
    this._component._markForFullFlush(true);
    this._shout("seek");
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

},{"./helpers/SimpleEventEmitter":18,"./helpers/getTimelineMaxTime":31,"./vendor/assign":92}],9:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var computeMatrix_1 = _dereq_("./layout/computeMatrix");
var computeOrientationFlexibly_1 = _dereq_("./layout/computeOrientationFlexibly");
var computeSize_1 = _dereq_("./layout/computeSize");
var ELEMENTS_2D = {
    circle: true,
    ellipse: true,
    foreignObject: true,
    g: true,
    image: true,
    line: true,
    mesh: true,
    path: true,
    polygon: true,
    polyline: true,
    rect: true,
    "switch": true,
    symbol: true,
    text: true,
    textPath: true,
    tspan: true,
    unknown: true,
    use: true
};
var SIZE_PROPORTIONAL = 0;
var SIZE_ABSOLUTE = 1;
var DEFAULT_DEPTH = 0;
var IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var FORMATS = {
    THREE: 3,
    TWO: 2
};
function initializeNodeAttributes(element, parent) {
    if (!element.attributes)
        element.attributes = {};
    if (!element.attributes.style)
        element.attributes.style = {};
    if (!element.layout) {
        element.layout = createLayoutSpec(null, null, null);
        element.layout.matrix = createMatrix();
        element.layout.format = ELEMENTS_2D[element.elementName]
            ? FORMATS.TWO
            : FORMATS.THREE;
    }
    return element;
}
function initializeTreeAttributes(tree, container) {
    if (!tree || typeof tree === "string")
        return;
    initializeNodeAttributes(tree, container);
    tree.__parent = container;
    if (!tree.children)
        return;
    if (tree.children.length < 1)
        return;
    for (var i = 0; i < tree.children.length; i++) {
        initializeTreeAttributes(tree.children[i], tree);
    }
}
function createLayoutSpec(ax, ay, az) {
    return {
        shown: true,
        opacity: 1.0,
        mount: { x: ax || 0, y: ay || 0, z: az || 0 },
        align: { x: ax || 0, y: ay || 0, z: az || 0 },
        origin: { x: ax || 0, y: ay || 0, z: az || 0 },
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 0 },
        orientation: { x: 0, y: 0, z: 0, w: 0 },
        scale: { x: 1, y: 1, z: 1 },
        sizeMode: {
            x: SIZE_PROPORTIONAL,
            y: SIZE_PROPORTIONAL,
            z: SIZE_PROPORTIONAL
        },
        sizeProportional: { x: 1, y: 1, z: 1 },
        sizeDifferential: { x: 0, y: 0, z: 0 },
        sizeAbsolute: { x: 0, y: 0, z: 0 }
    };
}
function createMatrix() {
    return copyMatrix([], IDENTITY);
}
function copyMatrix(out, m) {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];
    out[9] = m[9];
    out[10] = m[10];
    out[11] = m[11];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
    return out;
}
function multiplyMatrices(out, a, b) {
    out[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
    out[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
    out[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
    out[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
    out[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
    out[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
    out[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
    out[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
    out[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
    out[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
    out[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
    out[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
    out[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
    out[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
    out[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
    out[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
    return out;
}
function transposeMatrix(out, a) {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
    return out;
}
function multiplyArrayOfMatrices(arrayOfMatrices) {
    var product = createMatrix();
    for (var i = 0; i < arrayOfMatrices.length; i++) {
        product = multiplyMatrices([], product, arrayOfMatrices[i]);
    }
    return product;
}
function isZero(num) {
    return num > -0.000001 && num < 0.000001;
}
function createBaseComputedLayout(x, y, z) {
    if (!x)
        x = 0;
    if (!y)
        y = 0;
    if (!z)
        z = 0;
    return {
        size: { x: x, y: y, z: z },
        matrix: createMatrix(),
        shown: true,
        opacity: 1.0
    };
}
function computeLayout(out, layoutSpec, currentMatrix, parentMatrix, parentsizeAbsolute) {
    if (!parentsizeAbsolute)
        parentsizeAbsolute = { x: 0, y: 0, z: 0 };
    if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
        parentsizeAbsolute.z = DEFAULT_DEPTH;
    }
    var size = computeSize_1["default"]({}, layoutSpec, layoutSpec.sizeMode, parentsizeAbsolute);
    var matrix = computeMatrix_1["default"]([], out, layoutSpec, currentMatrix, size, parentMatrix, parentsizeAbsolute);
    out.size = size;
    out.matrix = matrix;
    out.shown = layoutSpec.shown;
    out.opacity = layoutSpec.opacity;
    return out;
}
exports["default"] = {
    computeMatrix: computeMatrix_1["default"],
    multiplyArrayOfMatrices: multiplyArrayOfMatrices,
    computeLayout: computeLayout,
    createLayoutSpec: createLayoutSpec,
    createBaseComputedLayout: createBaseComputedLayout,
    computeOrientationFlexibly: computeOrientationFlexibly_1["default"],
    createMatrix: createMatrix,
    FORMATS: FORMATS,
    SIZE_ABSOLUTE: SIZE_ABSOLUTE,
    SIZE_PROPORTIONAL: SIZE_PROPORTIONAL,
    ATTRIBUTES: createLayoutSpec(null, null, null),
    multiplyMatrices: multiplyMatrices,
    transposeMatrix: transposeMatrix,
    copyMatrix: copyMatrix,
    initializeTreeAttributes: initializeTreeAttributes,
    initializeNodeAttributes: initializeNodeAttributes,
    isZero: isZero
};

},{"./layout/computeMatrix":40,"./layout/computeOrientationFlexibly":41,"./layout/computeSize":42}],10:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var just_curves_1 = _dereq_("./vendor/just-curves");
var CENT = 1.0;
var OBJECT = "object";
var NUMBER = "number";
var KEYFRAME_ZERO = 0;
var KEYFRAME_MARGIN = 16.666;
var STRING = "string";
function percentOfTime(t0, t1, tnow) {
    var span = t1 - t0;
    if (span === 0)
        return CENT;
    var remaining = t1 - tnow;
    var percent = CENT - remaining / span;
    return percent;
}
function valueAtPercent(v0, v1, pc) {
    var span = v1 - v0;
    var gain = span * pc;
    var value = v0 + gain;
    return value;
}
function valueAtTime(v0, v1, t0, t1, tnow) {
    var pc = percentOfTime(t0, t1, tnow);
    var value = valueAtPercent(v0, v1, pc);
    return value;
}
function interpolateValue(v0, v1, t0, t1, tnow, curve) {
    var pc = percentOfTime(t0, t1, tnow);
    if (pc > CENT)
        pc = CENT;
    if (curve)
        pc = curve(pc);
    var value = valueAtPercent(v0, v1, pc);
    return value;
}
function interpolate(now, curve, started, ends, origin, destination) {
    if (Array.isArray(origin)) {
        var arrayOutput = [];
        for (var i = 0; i < origin.length; i++) {
            arrayOutput[i] = interpolate(now, curve, started, ends, origin[i], destination[i]);
        }
        return arrayOutput;
    }
    else if (typeof origin === OBJECT) {
        var objectOutput = {};
        for (var key in origin) {
            objectOutput[key] = interpolate(now, curve, started, ends, origin[key], destination[key]);
        }
        return objectOutput;
    }
    else if (typeof origin === NUMBER) {
        return interpolateValue(origin, destination, started, ends, now, curve);
    }
    else {
        return origin;
    }
}
function ascendingSort(a, b) {
    return a - b;
}
function numberize(n) {
    return parseInt(n, 10);
}
function sortedKeyframes(keyframeGroup) {
    if (keyframeGroup.__sorted) {
        return keyframeGroup.__sorted;
    }
    var keys = Object.keys(keyframeGroup);
    var sorted = keys.sort(ascendingSort).map(numberize);
    keyframeGroup.__sorted = sorted;
    return keyframeGroup.__sorted;
}
function getKeyframesList(keyframeGroup, nowValue) {
    var sorted = sortedKeyframes(keyframeGroup);
    for (var i = 0; i < sorted.length; i++) {
        var j = i + 1;
        var current = sorted[i];
        var next = sorted[j];
        if (current <= nowValue) {
            if (next > nowValue)
                return [current, next];
            if (j >= sorted.length)
                return [current];
        }
    }
}
function calculateValue(keyframeGroup, nowValue) {
    if (!keyframeGroup[KEYFRAME_ZERO]) {
        keyframeGroup[KEYFRAME_ZERO] = {};
    }
    var keyframesList = getKeyframesList(keyframeGroup, nowValue);
    if (!keyframesList || keyframesList.length < 1)
        return;
    var currentKeyframe = keyframesList[0];
    var currentTransition = keyframeGroup[currentKeyframe];
    var nextKeyframe = keyframesList[1];
    var nextTransition = keyframeGroup[nextKeyframe];
    var finalValue = getTransitionValue(currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue);
    return finalValue;
}
function calculateValueAndReturnUndefinedIfNotWorthwhile(keyframeGroup, nowValue) {
    if (!keyframeGroup[KEYFRAME_ZERO])
        keyframeGroup[KEYFRAME_ZERO] = {};
    var keyframesList = getKeyframesList(keyframeGroup, nowValue);
    if (!keyframesList || keyframesList.length < 1)
        return void 0;
    var currentKeyframe = keyframesList[0];
    var nextKeyframe = keyframesList[1];
    var currentTransition = keyframeGroup[currentKeyframe];
    var nextTransition = keyframeGroup[nextKeyframe];
    if ((currentTransition && currentTransition.machine) ||
        (nextTransition && nextTransition.machine)) {
        return getTransitionValue(currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue);
    }
    if (nextKeyframe === undefined) {
        if (nowValue <= currentKeyframe + KEYFRAME_MARGIN) {
            return getTransitionValue(currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue);
        }
        return void 0;
    }
    if (nowValue <= nextKeyframe + KEYFRAME_MARGIN) {
        return getTransitionValue(currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue);
    }
    return void 0;
}
function getTransitionValue(currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue) {
    var currentValue = currentTransition.value;
    if (!currentTransition.curve)
        return currentValue;
    if (!nextTransition)
        return currentValue;
    var currentCurve = currentTransition.curve;
    if (typeof currentCurve === STRING)
        currentCurve = just_curves_1["default"][currentCurve];
    var nextValue = nextTransition.value;
    var finalValue = interpolate(nowValue, currentCurve, currentKeyframe, nextKeyframe, currentValue, nextValue);
    return finalValue;
}
exports["default"] = {
    percentOfTime: percentOfTime,
    valueAtPercent: valueAtPercent,
    valueAtTime: valueAtTime,
    interpolateValue: interpolateValue,
    interpolate: interpolate,
    calculateValue: calculateValue,
    sortedKeyframes: sortedKeyframes,
    calculateValueAndReturnUndefinedIfNotWorthwhile: calculateValueAndReturnUndefinedIfNotWorthwhile
};

},{"./vendor/just-curves":133}],11:[function(_dereq_,module,exports){
(function (process,global){
"use strict";
exports.__esModule = true;
var HaikuHelpers_1 = _dereq_("./HaikuHelpers");
var BasicUtils_1 = _dereq_("./helpers/BasicUtils");
var parsers_1 = _dereq_("./properties/dom/parsers");
var schema_1 = _dereq_("./properties/dom/schema");
var enhance_1 = _dereq_("./reflection/enhance");
var Transitions_1 = _dereq_("./Transitions");
var assign_1 = _dereq_("./vendor/assign");
var FUNCTION = "function";
var OBJECT = "object";
function isFunction(value) {
    return typeof value === FUNCTION;
}
var INJECTABLES = {};
if (typeof window !== "undefined") {
    INJECTABLES["$window"] = {
        schema: {
            width: "number",
            height: "number",
            screen: {
                availHeight: "number",
                availLeft: "number",
                availWidth: "number",
                colorDepth: "number",
                height: "number",
                pixelDepth: "number",
                width: "number",
                orientation: {
                    angle: "number",
                    type: "string"
                }
            },
            navigator: {
                userAgent: "string",
                appCodeName: "string",
                appName: "string",
                appVersion: "string",
                cookieEnabled: "boolean",
                doNotTrack: "boolean",
                language: "string",
                maxTouchPoints: "number",
                onLine: "boolean",
                platform: "string",
                product: "string",
                vendor: "string"
            },
            document: {
                charset: "string",
                compatMode: "string",
                contentType: "string",
                cookie: "string",
                documentURI: "string",
                fullscreen: "boolean",
                readyState: "number",
                referrer: "string",
                title: "string"
            },
            location: {
                hash: "string",
                host: "string",
                hostname: "string",
                href: "string",
                pathname: "string",
                protocol: "string",
                search: "string"
            }
        },
        summon: function (injectees, summonSpec) {
            if (!injectees.$window)
                injectees.$window = {};
            var out = injectees.$window;
            out.width = window.innerWidth;
            out.height = window.innerHeight;
            if (window.screen) {
                if (!out.screen)
                    out.screen = {};
                out.screen.availHeight = window.screen["availHeight"];
                out.screen.availLeft = window.screen["availLeft"];
                out.screen.availWidth = window.screen["availWidth"];
                out.screen.colorDepth = window.screen["colorDepth"];
                out.screen.height = window.screen["height"];
                out.screen.pixelDepth = window.screen["pixelDepth"];
                out.screen.width = window.screen["width"];
                if (window.screen["orientation"]) {
                    if (!out.screen.orientation)
                        out.screen.orientation = {};
                    out.screen.orientation.angle = window.screen["orientation"].angle;
                    out.screen.orientation.type = window.screen["orientation"].type;
                }
            }
            if (typeof navigator !== "undefined") {
                if (!out.navigator)
                    out.navigator = {};
                out.navigator.userAgent = navigator.userAgent;
                out.navigator.appCodeName = navigator.appCodeName;
                out.navigator.appName = navigator.appName;
                out.navigator.appVersion = navigator.appVersion;
                out.navigator.cookieEnabled = navigator.cookieEnabled;
                out.navigator.doNotTrack = navigator["doNotTrack"];
                out.navigator.language = navigator.language;
                out.navigator.maxTouchPoints = navigator.maxTouchPoints;
                out.navigator.onLine = navigator.onLine;
                out.navigator.platform = navigator.platform;
                out.navigator.product = navigator.product;
                out.navigator.userAgent = navigator.userAgent;
                out.navigator.vendor = navigator.vendor;
            }
            if (window.document) {
                if (!out.document)
                    out.document = {};
                out.document.charset = window.document.charset;
                out.document.compatMode = window.document.compatMode;
                out.document.contenttype = window.document["contentType"];
                out.document.cookie = window.document.cookie;
                out.document.documentURI = window.document["documentURI"];
                out.document.fullscreen = window.document["fullscreen"];
                out.document.readyState = window.document.readyState;
                out.document.referrer = window.document.referrer;
                out.document.title = window.document.title;
            }
            if (window.location) {
                if (!out.location)
                    out.location = {};
                out.location.hash = window.location.hash;
                out.location.host = window.location.host;
                out.location.hostname = window.location.hostname;
                out.location.href = window.location.href;
                out.location.pathname = window.location.pathname;
                out.location.protocol = window.location.protocol;
                out.location.search = window.location.search;
            }
        }
    };
}
if (typeof global !== "undefined") {
    INJECTABLES["$global"] = {
        schema: {
            process: {
                pid: "number",
                arch: "string",
                platform: "string",
                argv: ["string"],
                title: "string",
                version: "string",
                env: {}
            }
        },
        summon: function (injectees, summonSpec) {
            if (!injectees.$global)
                injectees.$global = {};
            var out = injectees.$global;
            if (typeof process !== "undefined") {
                if (!out.process)
                    out.process = {};
                out.process.pid = process.pid;
                out.process.arch = process.arch;
                out.process.platform = process.platform;
                out.process.argv = process.argv;
                out.process.title = process.title;
                out.process.version = process.version;
                out.process.env = process.env;
            }
        }
    };
}
INJECTABLES["$player"] = {
    schema: {
        version: "string",
        options: {
            seed: "string",
            loop: "boolean",
            sizing: "string",
            preserve3d: "boolean",
            position: "string",
            overflowX: "string",
            overflowY: "string"
        },
        timeline: {
            name: "string",
            duration: "number",
            repeat: "boolean",
            time: {
                apparent: "number",
                elapsed: "number",
                max: "number"
            },
            frame: {
                apparent: "number",
                elapsed: "number"
            }
        },
        clock: {
            frameDuration: "number",
            frameDelay: "number",
            time: {
                apparent: "number",
                elapsed: "number"
            }
        }
    },
    summon: function (injectees, summonSpec, hostInstance, matchingElement, timelineName) {
        if (!injectees.$player)
            injectees.$player = {};
        var out = injectees.$player;
        out.version = hostInstance._context.PLAYER_VERSION;
        var options = hostInstance._context.config.options;
        if (options) {
            if (!out.options)
                out.options = {};
            out.options.seed = options.seed;
            out.options.loop = options.loop;
            out.options.sizing = options.sizing;
            out.options.preserve3d = options.preserve3d;
            out.options.position = options.position;
            out.options.overflowX = options.overflowX;
            out.options.overflowY = options.overflowY;
        }
        var timelineInstance = hostInstance.getTimeline(timelineName);
        if (timelineInstance) {
            if (!out.timeline)
                out.timeline = {};
            out.timeline.name = timelineName;
            out.timeline.duration = timelineInstance.getDuration();
            out.timeline.repeat = timelineInstance.getRepeat();
            if (!out.timeline.time)
                out.timeline.time = {};
            out.timeline.time.apparent = timelineInstance.getTime();
            out.timeline.time.elapsed = timelineInstance.getElapsedTime();
            out.timeline.time.max = timelineInstance.getMaxTime();
            if (!out.timeline.frame)
                out.timeline.frame = {};
            out.timeline.frame.apparent = timelineInstance.getFrame();
            out.timeline.frame.elapsed = timelineInstance.getUnboundedFrame();
        }
        var clockInstance = hostInstance.getClock();
        if (clockInstance) {
            if (!out.clock)
                out.clock = {};
            out.clock.frameDuration = clockInstance.options.frameDuration;
            out.clock.frameDelay = clockInstance.options.frameDelay;
            if (!out.clock.time)
                out.clock.time = {};
            out.clock.time.apparent = clockInstance.getExplicitTime();
            out.clock.time.elapsed = clockInstance.getRunningTime();
        }
    }
};
var EVENT_SCHEMA = {
    mouse: {
        x: "number",
        y: "number",
        isDown: "boolean"
    },
    touches: [{
            x: "number",
            y: "number"
        }],
    mouches: [{
            x: "number",
            y: "number"
        }],
    keys: [{
            which: "number",
            code: "number"
        }]
};
var ELEMENT_SCHEMA = {
    properties: function (element) {
        var defined = schema_1["default"][element.elementName];
        if (!defined) {
            console.warn("[haiku player] element " + element.elementName + " has no schema defined");
            return {};
        }
        return defined;
    }
};
function assignElementInjectables(obj, key, summonSpec, hostInstance, element) {
    if (!element) {
        return {};
    }
    if (typeof element === "string") {
        return {};
    }
    obj[key] = {};
    var out = obj[key];
    out.properties = {
        name: null,
        attributes: null
    };
    out.properties.name = element.elementName;
    out.properties.attributes = element.attributes;
    if (element.layout.computed) {
        out.properties.matrix = element.layout.computed.matrix;
        out.properties.size = element.layout.computed.size;
    }
    out.properties.align = element.layout.align;
    out.properties.mount = element.layout.mount;
    out.properties.opacity = element.layout.opacity;
    out.properties.origin = element.layout.origin;
    out.properties.rotation = element.layout.rotation;
    out.properties.orientation = element.layout.orientation;
    out.properties.scale = element.layout.scale;
    out.properties.shown = element.layout.shown;
    out.properties.sizeAbsolute = element.layout.sizeAbsolute;
    out.properties.sizeDifferential = element.layout.sizeDifferential;
    out.properties.sizeMode = element.layout.sizeMode;
    out.properties.sizeProportional = element.layout.sizeProportional;
    out.properties.translation = element.layout.translation;
}
INJECTABLES["$tree"] = {
    schema: {
        parent: ELEMENT_SCHEMA,
        children: [ELEMENT_SCHEMA],
        siblings: [ELEMENT_SCHEMA],
        component: ELEMENT_SCHEMA,
        root: ELEMENT_SCHEMA,
        element: ELEMENT_SCHEMA
    },
    summon: function (injectees, summonSpec, hostInstance, matchingElement) {
        if (!injectees.$tree)
            injectees.$tree = {};
        injectees.$tree.siblings = [];
        injectees.$tree.parent = null;
        if (matchingElement.__parent) {
            var subspec0 = (typeof summonSpec === "string") ? summonSpec : (summonSpec.$tree && summonSpec.$tree.parent);
            assignElementInjectables(injectees.$tree, "parent", subspec0, hostInstance, matchingElement.__parent);
            for (var i = 0; i < matchingElement.__parent.children.length; i++) {
                var sibling = matchingElement.__parent.children[i];
                var subspec1 = (typeof summonSpec === "string")
                    ? summonSpec
                    : summonSpec.$tree && summonSpec.$tree.siblings && summonSpec.$tree.siblings[i];
                assignElementInjectables(injectees.$tree.siblings, i, subspec1, hostInstance, sibling);
            }
        }
        injectees.$tree.children = [];
        if (matchingElement.children) {
            for (var j = 0; j < matchingElement.children.length; j++) {
                var child = matchingElement.children[j];
                var subspec2 = (typeof summonSpec === "string")
                    ? summonSpec
                    : summonSpec.$tree && summonSpec.$tree.children && summonSpec.$tree.children[j];
                assignElementInjectables(injectees.$tree.children, j, subspec2, hostInstance, child);
            }
        }
        if (!injectees.$component) {
            INJECTABLES["$component"].summon(injectees, summonSpec, hostInstance, matchingElement);
        }
        injectees.$tree.component = injectees.$component;
        if (!injectees.$root) {
            INJECTABLES["$root"].summon(injectees, summonSpec, hostInstance, matchingElement);
        }
        injectees.$tree.root = injectees.$root;
        if (!injectees.$element) {
            INJECTABLES["$element"].summon(injectees, summonSpec, hostInstance, matchingElement);
        }
        injectees.$tree.element = injectees.$element;
    }
};
INJECTABLES["$component"] = {
    schema: ELEMENT_SCHEMA,
    summon: function (injectees, summonSpec, hostInstance) {
        if (injectees.$tree && injectees.$tree.component) {
            injectees.$component = injectees.$tree.component;
        }
        else {
            var subspec = (typeof summonSpec === "string") ? summonSpec : summonSpec.$component;
            assignElementInjectables(injectees, "$component", subspec, hostInstance, hostInstance._getTopLevelElement());
        }
    }
};
INJECTABLES["$root"] = {
    schema: ELEMENT_SCHEMA,
    summon: function (injectees, summonSpec, hostInstance, matchingElement) {
        if (injectees.$tree && injectees.$tree.root) {
            injectees.$root = injectees.$tree.root;
        }
        else {
            var subspec = (typeof summonSpec === "string") ? summonSpec : summonSpec.$root;
            assignElementInjectables(injectees, "$root", subspec, hostInstance, hostInstance._getTopLevelElement());
        }
    }
};
INJECTABLES["$element"] = {
    schema: ELEMENT_SCHEMA,
    summon: function (injectees, summonSpec, hostInstance, matchingElement) {
        if (injectees.$tree && injectees.$tree.element) {
            injectees.$element = injectees.$tree.element;
        }
        else {
            var subspec = (typeof summonSpec === "string") ? summonSpec : summonSpec.$element;
            assignElementInjectables(injectees, "$element", subspec, hostInstance, matchingElement);
        }
    }
};
INJECTABLES["$user"] = {
    schema: assign_1["default"]({}, EVENT_SCHEMA),
    summon: function (injectees, summonSpec, hostInstance, matchingElement) {
        injectees.$user = hostInstance._context._getGlobalUserState();
    }
};
INJECTABLES["$flow"] = {
    schema: {
        repeat: {
            list: ["any"],
            index: "number",
            value: "any",
            data: "any",
            payload: "any"
        },
        "if": {
            value: "any",
            data: "any",
            payload: "any"
        },
        yield: {
            value: "any",
            data: "any",
            payload: "any"
        },
        placeholder: {
            node: "any"
        }
    },
    summon: function (injectees, summonSpec, hostInstance, matchingElement) {
    }
};
INJECTABLES["$helpers"] = {
    schema: HaikuHelpers_1["default"].schema,
    summon: function (injectees) {
        injectees.$helpers = HaikuHelpers_1["default"].helpers;
    }
};
var BUILTIN_INJECTABLES = {
    Infinity: Infinity,
    NaN: NaN,
    undefined: void (0),
    Object: Object,
    Boolean: Boolean,
    Math: Math,
    Date: Date,
    JSON: JSON,
    Number: Number,
    String: String,
    RegExp: RegExp,
    Array: Array,
    isFinite: isFinite,
    isNaN: isNaN,
    parseFloat: parseFloat,
    parseInt: parseInt,
    decodeURI: decodeURI,
    decodeURIComponent: decodeURIComponent,
    encodeURI: encodeURI,
    encodeURIComponent: encodeURIComponent,
    Error: Error,
    ReferenceError: ReferenceError,
    SyntaxError: SyntaxError,
    TypeError: TypeError
};
for (var builtinInjectableKey in BUILTIN_INJECTABLES) {
    (function (key, value) {
        INJECTABLES[key] = {
            builtin: true,
            schema: "*",
            summon: function (injectees) {
                injectees[key] = value;
            }
        };
    }(builtinInjectableKey, BUILTIN_INJECTABLES[builtinInjectableKey]));
}
var FORBIDDEN_EXPRESSION_TOKENS = {
    "new": true,
    "this": true,
    "with": true,
    "delete": true,
    "export": true,
    "extends": true,
    "super": true,
    "class": true,
    abstract: true,
    interface: true,
    static: true,
    label: true,
    goto: true,
    private: true,
    "import": true,
    public: true,
    "do": true,
    native: true,
    package: true,
    transient: true,
    implements: true,
    protected: true,
    throws: true,
    synchronized: true,
    final: true,
    window: true,
    document: true,
    global: true,
    eval: true,
    uneval: true,
    Function: true,
    EvalError: true,
    require: true,
    module: true,
    exports: true,
    Module: true,
    arguments: true,
    callee: true,
    prototpye: true,
    __proto__: true,
    freeze: true,
    setPrototypeOf: true,
    constructor: true,
    defineProperties: true,
    defineProperty: true
};
function ValueBuilder(component) {
    this._component = component;
    this._parsees = {};
    this._changes = {};
    this._summonees = {};
    this._evaluations = {};
    HaikuHelpers_1["default"].register("now", function _helperNow() {
        return this._component._context.getDeterministicTime();
    }.bind(this));
    HaikuHelpers_1["default"].register("rand", function _helperRand() {
        return this._component._context.getDeterministicRand();
    }.bind(this));
}
exports["default"] = ValueBuilder;
ValueBuilder.prototype._clearCaches = function _clearCaches() {
    this._parsees = {};
    this._changes = {};
    this._summonees = {};
    this._evaluations = {};
    return this;
};
ValueBuilder.prototype._clearCachedClusters = function _clearCachedClusters(timelineName, componentId) {
    if (this._parsees[timelineName])
        this._parsees[timelineName][componentId] = {};
    return this;
};
ValueBuilder.prototype.evaluate = function _evaluate(fn, timelineName, flexId, matchingElement, propertyName, keyframeMs, keyframeCluster, hostInstance) {
    enhance_1["default"](fn, null);
    var evaluation = void 0;
    if (fn.specification === true) {
        evaluation = fn.call(hostInstance, hostInstance._states);
    }
    else if (!Array.isArray(fn.specification.params)) {
        evaluation = fn.call(hostInstance, hostInstance._states);
    }
    else if (fn.specification.params.length < 1) {
        evaluation = fn.call(hostInstance, hostInstance._states);
    }
    else {
        if (fn.specification.params.length < 1) {
            evaluation = fn.call(hostInstance, hostInstance._states);
        }
        else {
            var summoneesArray = this.summonSummonables(fn.specification.params, timelineName, flexId, matchingElement, propertyName, keyframeMs, keyframeCluster, hostInstance);
            var previousSummoneesArray = this._getPreviousSummonees(timelineName, flexId, propertyName, keyframeMs);
            if (_areSummoneesDifferent(previousSummoneesArray, summoneesArray)) {
                this._cacheSummonees(timelineName, flexId, propertyName, keyframeMs, summoneesArray);
                evaluation = fn.apply(hostInstance, summoneesArray);
            }
            else {
                evaluation = this._getPreviousEvaluation(timelineName, flexId, propertyName, keyframeMs);
            }
        }
    }
    if (fn.specification && fn.specification !== true) {
        this._cacheEvaluation(timelineName, flexId, propertyName, keyframeMs, evaluation);
    }
    return evaluation;
};
ValueBuilder.prototype._getPreviousSummonees = function _getPreviousSummonees(timelineName, flexId, propertyName, keyframeMs) {
    if (!this._summonees[timelineName])
        return void (0);
    if (!this._summonees[timelineName][flexId])
        return void (0);
    if (!this._summonees[timelineName][flexId][propertyName])
        return void (0);
    return this._summonees[timelineName][flexId][propertyName][keyframeMs];
};
ValueBuilder.prototype._cacheSummonees = function _cacheSummonees(timelineName, flexId, propertyName, keyframeMs, summonees) {
    if (!this._summonees[timelineName])
        this._summonees[timelineName] = {};
    if (!this._summonees[timelineName][flexId])
        this._summonees[timelineName][flexId] = {};
    if (!this._summonees[timelineName][flexId][propertyName])
        this._summonees[timelineName][flexId][propertyName] = {};
    this._summonees[timelineName][flexId][propertyName][keyframeMs] = summonees;
    return summonees;
};
ValueBuilder.prototype._getPreviousEvaluation = function _getPreviousEvaluation(timelineName, flexId, propertyName, keyframeMs) {
    if (!this._evaluations[timelineName])
        return void (0);
    if (!this._evaluations[timelineName][flexId])
        return void (0);
    if (!this._evaluations[timelineName][flexId][propertyName])
        return void (0);
    return this._evaluations[timelineName][flexId][propertyName][keyframeMs];
};
ValueBuilder.prototype._cacheEvaluation = function _cacheEvaluation(timelineName, flexId, propertyName, keyframeMs, evaluation) {
    if (!this._evaluations[timelineName])
        this._evaluations[timelineName] = {};
    if (!this._evaluations[timelineName][flexId])
        this._evaluations[timelineName][flexId] = {};
    if (!this._evaluations[timelineName][flexId][propertyName])
        this._evaluations[timelineName][flexId][propertyName] = {};
    this._evaluations[timelineName][flexId][propertyName][keyframeMs] = evaluation;
    return evaluation;
};
ValueBuilder.prototype.summonSummonables = function _summonSummonables(paramsArray, timelineName, flexId, matchingElement, propertyName, keyframeMs, keyframeCluster, hostInstance) {
    var summonablesArray = [];
    var summonStorage = {};
    for (var i = 0; i < paramsArray.length; i++) {
        var summonsEntry = paramsArray[i];
        var summonsOutput = void 0;
        if (typeof summonsEntry === "string") {
            if (INJECTABLES[summonsEntry]) {
                summonStorage[summonsEntry] = undefined;
                INJECTABLES[summonsEntry].summon(summonStorage, summonsEntry, hostInstance, matchingElement, timelineName);
                summonsOutput = summonStorage[summonsEntry];
            }
            else {
                summonsOutput = hostInstance.state[summonsEntry];
            }
        }
        else if (summonsEntry && typeof summonsEntry === "object") {
            summonsOutput = {};
            for (var summonsKey in summonsEntry) {
                if (!summonsEntry[summonsKey])
                    continue;
                if (INJECTABLES[summonsKey]) {
                    INJECTABLES[summonsKey].summon(summonsOutput, summonsEntry[summonsKey], hostInstance, matchingElement, timelineName);
                    continue;
                }
                summonsOutput[summonsKey] = hostInstance.state[summonsKey];
            }
        }
        if (summonsOutput !== undefined) {
            summonablesArray[i] = summonsOutput;
        }
    }
    return summonablesArray;
};
ValueBuilder.prototype._getSummonablesSchema = function _getSummonablesSchema() {
    var schema = {};
    for (var key in INJECTABLES) {
        schema[key] = INJECTABLES[key].schema;
    }
    return schema;
};
function _areSummoneesDifferent(previous, incoming) {
    if (Array.isArray(previous) && Array.isArray(incoming)) {
        if (previous.length !== incoming.length) {
            return true;
        }
        else {
            for (var i = 0; i < incoming.length; i++) {
                if (_areSummoneesDifferent(previous[i], incoming[i])) {
                    return true;
                }
            }
            return false;
        }
    }
    else if (typeof previous === OBJECT && typeof incoming === OBJECT) {
        if (previous !== null && incoming !== null) {
            for (var key in incoming) {
                if (_areSummoneesDifferent(previous[key], incoming[key])) {
                    return true;
                }
            }
            return false;
        }
        else if (previous === null) {
            return true;
        }
        else if (incoming === null) {
            return true;
        }
        return false;
    }
    return previous !== incoming;
}
ValueBuilder.prototype.fetchParsedValueCluster = function _fetchParsedValueCluster(timelineName, flexId, matchingElement, outputName, cluster, hostInstance, isPatchOperation, skipCache) {
    if (!this._parsees[timelineName])
        this._parsees[timelineName] = {};
    if (!this._parsees[timelineName][flexId]) {
        this._parsees[timelineName][flexId] = {};
    }
    if (!this._parsees[timelineName][flexId][outputName]) {
        this._parsees[timelineName][flexId][outputName] = {};
    }
    var parsee = this._parsees[timelineName][flexId][outputName];
    for (var ms in cluster) {
        var descriptor = cluster[ms];
        if (skipCache) {
            parsee[ms] = null;
        }
        if (isFunction(descriptor.value)) {
            parsee[ms] = {};
            if (descriptor.curve) {
                parsee[ms].curve = descriptor.curve;
            }
            parsee[ms].machine = true;
            var functionReturnValue = this.evaluate(descriptor.value, timelineName, flexId, matchingElement, outputName, ms, cluster, hostInstance);
            var parser1 = this.getParser(outputName, matchingElement);
            if (parser1) {
                parsee[ms].value = parser1(functionReturnValue);
            }
            else {
                parsee[ms].value = functionReturnValue;
            }
        }
        else {
            if (parsee[ms]) {
                continue;
            }
            parsee[ms] = {};
            if (descriptor.curve) {
                parsee[ms].curve = descriptor.curve;
            }
            var parser2 = this.getParser(outputName, matchingElement);
            if (parser2) {
                parsee[ms].value = parser2(descriptor.value);
            }
            else {
                parsee[ms].value = descriptor.value;
            }
        }
    }
    return parsee;
};
ValueBuilder.prototype.getParser = function getParser(outputName, virtualElement) {
    if (!virtualElement)
        return undefined;
    var foundParser = virtualElement.__instance && virtualElement.__instance.getParser(outputName, virtualElement);
    if (!foundParser)
        foundParser = parsers_1["default"][virtualElement.elementName] && parsers_1["default"][virtualElement.elementName][outputName];
    return foundParser && foundParser.parse;
};
ValueBuilder.prototype.getGenerator = function getGenerator(outputName, virtualElement) {
    if (!virtualElement)
        return undefined;
    var foundGenerator = virtualElement.__instance && virtualElement.__instance.getParser(outputName, virtualElement);
    if (!foundGenerator)
        foundGenerator = parsers_1["default"][virtualElement.elementName] && parsers_1["default"][virtualElement.elementName][outputName];
    return foundGenerator && foundGenerator.generate;
};
ValueBuilder.prototype.generateFinalValueFromParsedValue = function _generateFinalValueFromParsedValue(timelineName, flexId, matchingElement, outputName, computedValue) {
    var generator = this.getGenerator(outputName, matchingElement);
    if (generator) {
        return generator(computedValue);
    }
    else {
        return computedValue;
    }
};
ValueBuilder.prototype.didChangeValue = function _didChangeValue(timelineName, flexId, matchingElement, outputName, outputValue) {
    var answer = false;
    if (!this._changes[timelineName]) {
        this._changes[timelineName] = {};
        answer = true;
    }
    if (!this._changes[timelineName][flexId]) {
        this._changes[timelineName][flexId] = {};
        answer = true;
    }
    if (this._changes[timelineName][flexId][outputName] === undefined ||
        this._changes[timelineName][flexId][outputName] !== outputValue) {
        this._changes[timelineName][flexId][outputName] = outputValue;
        answer = true;
    }
    return answer;
};
ValueBuilder.prototype.build = function _build(out, timelineName, timelineTime, flexId, matchingElement, propertiesGroup, isPatchOperation, haikuComponent) {
    var isAnythingWorthUpdating = false;
    for (var propertyName in propertiesGroup) {
        var finalValue = this.grabValue(timelineName, flexId, matchingElement, propertyName, propertiesGroup, timelineTime, haikuComponent, isPatchOperation);
        if (finalValue === undefined) {
            continue;
        }
        if (!isPatchOperation ||
            this.didChangeValue(timelineName, flexId, matchingElement, propertyName, finalValue)) {
            if (out[propertyName] === undefined) {
                out[propertyName] = finalValue;
            }
            else {
                out[propertyName] = BasicUtils_1["default"].mergeValue(out[propertyName], finalValue);
            }
            isAnythingWorthUpdating = true;
        }
    }
    if (isAnythingWorthUpdating) {
        return out;
    }
    else {
        return undefined;
    }
};
ValueBuilder.prototype.grabValue = function _grabValue(timelineName, flexId, matchingElement, propertyName, propertiesGroup, timelineTime, haikuComponent, isPatchOperation, skipCache, clearSortedKeyframesCache) {
    var parsedValueCluster = this.fetchParsedValueCluster(timelineName, flexId, matchingElement, propertyName, propertiesGroup[propertyName], haikuComponent, isPatchOperation, skipCache);
    if (!parsedValueCluster) {
        return undefined;
    }
    if (clearSortedKeyframesCache) {
        delete parsedValueCluster.__sorted;
    }
    var computedValueForTime;
    if (isPatchOperation && !skipCache) {
        computedValueForTime = Transitions_1["default"].calculateValueAndReturnUndefinedIfNotWorthwhile(parsedValueCluster, timelineTime);
    }
    else {
        computedValueForTime = Transitions_1["default"].calculateValue(parsedValueCluster, timelineTime);
    }
    if (computedValueForTime === undefined) {
        return undefined;
    }
    var finalValue = this.generateFinalValueFromParsedValue(timelineName, flexId, matchingElement, propertyName, computedValueForTime);
    return finalValue;
};
ValueBuilder["INJECTABLES"] = INJECTABLES;
ValueBuilder["FORBIDDEN_EXPRESSION_TOKENS"] = FORBIDDEN_EXPRESSION_TOKENS;

}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./HaikuHelpers":7,"./Transitions":10,"./helpers/BasicUtils":14,"./properties/dom/parsers":48,"./properties/dom/schema":49,"./reflection/enhance":51,"./vendor/assign":92,"_process":1}],12:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var HaikuContext_1 = _dereq_("./../../HaikuContext");
var dom_1 = _dereq_("./../../renderers/dom");
var pkg = _dereq_("./../../../package.json");
var PLAYER_VERSION = pkg.version;
function HaikuDOMAdapter(bytecode, config, safeWindow) {
    if (!config)
        config = {};
    if (!config.options)
        config.options = {};
    if (!safeWindow) {
        if (typeof window !== "undefined") {
            safeWindow = window;
        }
    }
    if (config.options.useWebkitPrefix === undefined) {
        if (safeWindow && safeWindow.document) {
            var isWebKit = "WebkitAppearance" in safeWindow.document.documentElement.style;
            config.options.useWebkitPrefix = !!isWebKit;
        }
    }
    return HaikuContext_1["default"]["createComponentFactory"](dom_1["default"], bytecode, config, safeWindow);
}
exports["default"] = HaikuDOMAdapter;
HaikuDOMAdapter["defineOnWindow"] = function () {
    if (typeof window !== "undefined") {
        if (!window["HaikuPlayer"]) {
            window["HaikuPlayer"] = {};
        }
        window["HaikuPlayer"][PLAYER_VERSION] = HaikuDOMAdapter;
    }
};
HaikuDOMAdapter["defineOnWindow"]();

},{"./../../../package.json":167,"./../../HaikuContext":5,"./../../renderers/dom":76}],13:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var HaikuDOMAdapter_1 = _dereq_("./HaikuDOMAdapter");
exports["default"] = HaikuDOMAdapter_1["default"];

},{"./HaikuDOMAdapter":12}],14:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var array_unique_1 = _dereq_("./../vendor/array-unique");
var uniq = array_unique_1["default"].immutable;
var OBJECT = "object";
var FUNCTION = "function";
function isObject(value) {
    return value !== null && typeof value === OBJECT && !Array.isArray(value);
}
function isFunction(value) {
    return typeof value === FUNCTION;
}
function isEmpty(value) {
    return value === undefined;
}
function mergeIncoming(previous, incoming) {
    for (var key in incoming) {
        if (isEmpty(incoming[key]))
            continue;
        if (isObject(previous[key]) && isObject(incoming[key])) {
            previous[key] = mergeIncoming(previous[key], incoming[key]);
            continue;
        }
        previous[key] = incoming[key];
    }
    return previous;
}
function mergeValue(previous, incoming) {
    if (isFunction(previous) || isFunction(incoming)) {
        return incoming;
    }
    if (isObject(previous) && isObject(incoming)) {
        return mergeIncoming(previous, incoming);
    }
    return incoming;
}
exports["default"] = {
    isObject: isObject,
    isFunction: isFunction,
    isEmpty: isEmpty,
    mergeIncoming: mergeIncoming,
    mergeValue: mergeValue,
    uniq: uniq
};

},{"./../vendor/array-unique":91}],15:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var color_string_1 = _dereq_("./../vendor/color-string");
var STRING = "string";
var OBJECT = "object";
function parseString(str) {
    if (!str)
        return null;
    if (typeof str === OBJECT)
        return str;
    if (str.trim().slice(0, 3) === "url")
        return str;
    var desc = color_string_1["default"]["get"](str);
    return desc;
}
function generateString(desc) {
    if (typeof desc === STRING)
        return desc;
    if (!desc)
        return "none";
    var str = color_string_1["default"]["to"][desc.model](desc.value);
    return str;
}
exports["default"] = {
    parseString: parseString,
    generateString: generateString
};

},{"./../vendor/color-string":94}],16:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var seedrandom_1 = _dereq_("./../vendor/seedrandom");
function PRNG(seed) {
    this._prng = seedrandom_1["default"](seed, null, null);
}
exports["default"] = PRNG;
PRNG.prototype.random = function random() {
    return this._prng();
};

},{"./../vendor/seedrandom":146}],17:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var svg_points_1 = _dereq_("./../vendor/svg-points");
var parseCssValueString_1 = _dereq_("./parseCssValueString");
var SVG_TYPES = {
    g: true,
    rect: true,
    polyline: true,
    polygon: true,
    path: true,
    line: true,
    ellipse: true,
    circle: true
};
var SVG_POINT_NUMERIC_FIELDS = {
    cx: true,
    cy: true,
    r: true,
    rx: true,
    ry: true,
    x1: true,
    x2: true,
    x: true,
    y: true
};
var SVG_POINT_COMMAND_FIELDS = {
    d: true,
    points: true
};
var SVG_COMMAND_TYPES = {
    path: true,
    polyline: true,
    polygon: true
};
function polyPointsStringToPoints(pointsString) {
    if (!pointsString)
        return [];
    if (Array.isArray(pointsString))
        return pointsString;
    var points = [];
    var couples = pointsString.split(/\s+/);
    for (var i = 0; i < couples.length; i++) {
        var pair = couples[i];
        var segs = pair.split(/,\s*/);
        var coord = [];
        if (segs[0])
            coord[0] = Number(segs[0]);
        if (segs[1])
            coord[1] = Number(segs[1]);
        points.push(coord);
    }
    return points;
}
function pointsToPolyString(points) {
    if (!points)
        return "";
    if (typeof points === "string")
        return points;
    var arr = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var seg = point.join(",");
        arr.push(seg);
    }
    return arr.join(" ");
}
function pathToPoints(pathString) {
    var shape = { type: "path", d: pathString };
    return svg_points_1["default"].toPoints(shape);
}
function pointsToPath(pointsArray) {
    return svg_points_1["default"].toPath(pointsArray);
}
function manaToPoints(mana) {
    if (SVG_TYPES[mana.elementName] &&
        mana.elementName !== "rect" &&
        mana.elementName !== "g") {
        var shape = { type: mana.elementName };
        if (SVG_COMMAND_TYPES[shape.type]) {
            for (var f2 in SVG_POINT_COMMAND_FIELDS) {
                if (mana.attributes[f2]) {
                    shape[f2] = mana.attributes[f2];
                }
            }
        }
        else {
            for (var f1 in SVG_POINT_NUMERIC_FIELDS) {
                if (mana.attributes[f1]) {
                    shape[f1] = Number(mana.attributes[f1]);
                }
            }
        }
        return svg_points_1["default"].toPoints(shape);
    }
    else {
        var width = parseCssValueString_1["default"]((mana.layout &&
            mana.layout.computed &&
            mana.layout.computed.size &&
            mana.layout.computed.size.x) ||
            (mana.rect && mana.rect.width) ||
            (mana.attributes &&
                mana.attributes.style &&
                mana.attributes.style.width) ||
            (mana.attributes && mana.attributes.width) ||
            (mana.attributes && mana.attributes.x) ||
            0, null).value;
        var height = parseCssValueString_1["default"]((mana.layout &&
            mana.layout.computed &&
            mana.layout.computed.size &&
            mana.layout.computed.size.y) ||
            (mana.rect && mana.rect.height) ||
            (mana.attributes &&
                mana.attributes.style &&
                mana.attributes.style.height) ||
            (mana.attributes && mana.attributes.height) ||
            (mana.attributes && mana.attributes.y) ||
            0, null).value;
        var left = parseCssValueString_1["default"]((mana.rect && mana.rect.left) ||
            (mana.attributes.style && mana.attributes.style.left) ||
            mana.attributes.x ||
            0, null).value;
        var top_1 = parseCssValueString_1["default"]((mana.rect && mana.rect.top) ||
            (mana.attributes.style && mana.attributes.style.top) ||
            mana.attributes.y ||
            0, null).value;
        return svg_points_1["default"].toPoints({
            type: "rect",
            width: width,
            height: height,
            x: left,
            y: top_1
        });
    }
}
exports["default"] = {
    pathToPoints: pathToPoints,
    pointsToPath: pointsToPath,
    polyPointsStringToPoints: polyPointsStringToPoints,
    pointsToPolyString: pointsToPolyString,
    manaToPoints: manaToPoints
};

},{"./../vendor/svg-points":147,"./parseCssValueString":34}],18:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function create(instance) {
    var registry = {};
    var eavesdroppers = [];
    instance.on = function on(key, fn) {
        if (!registry[key])
            registry[key] = [];
        for (var i = 0; i < registry[key].length; i++) {
            if (registry[key][i] === fn)
                return this;
        }
        registry[key].push(fn);
        return this;
    };
    instance.off = function off(key, fn) {
        var listeners = registry[key];
        if (!listeners || listeners.length < 1)
            return this;
        for (var i = 0; i < listeners.length; i++) {
            if (fn && listeners[i] === fn)
                listeners.splice(i, 1);
            else
                listeners.splice(i, 1);
        }
        return this;
    };
    instance.emit = function emit(key, msg, a, b, c, d, e, f, g, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) {
        var listeners = registry[key];
        if (listeners && listeners.length > 0) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](msg, a, b, c, d, e, f, g, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z);
            }
        }
        if (eavesdroppers.length > 0) {
            for (var j = 0; j < eavesdroppers.length; j++) {
                eavesdroppers[j](key, msg, a, b, c, d, e, f, g, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z);
            }
        }
        return this;
    };
    instance.hear = function hear(fn) {
        eavesdroppers.push(fn);
    };
    instance._registry = registry;
    instance._eavesdroppers = eavesdroppers;
    return instance;
}
exports["default"] = {
    create: create
};

},{}],19:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function addElementToHashTable(hash, realElement, virtualElement) {
    if (virtualElement && virtualElement.attributes) {
        var flexId = virtualElement.attributes["haiku-id"] || virtualElement.attributes.id;
        if (!hash[flexId])
            hash[flexId] = [];
        var alreadyInList = false;
        for (var i = 0; i < hash[flexId].length; i++) {
            var elInList = hash[flexId][i];
            if (elInList === realElement) {
                alreadyInList = true;
            }
        }
        if (!alreadyInList) {
            hash[flexId].push(realElement);
        }
    }
}
exports["default"] = addElementToHashTable;

},{}],20:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports["default"] = {
    "a": true,
    "altGlyph": true,
    "altGlyphDef": true,
    "altGlyphItem": true,
    "animate": true,
    "animateColor": true,
    "animateMotion": true,
    "animateTransform": true,
    "circle": true,
    "clipPath": true,
    "color-profile": true,
    "cursor": true,
    "defs": true,
    "desc": true,
    "discard": true,
    "ellipse": true,
    "feBlend": true,
    "feColorMatrix": true,
    "feComponentTransfer": true,
    "feComposite": true,
    "feConvolveMatrix": true,
    "feDiffuseLighting": true,
    "feDisplacementMap": true,
    "feDistantLight": true,
    "feFlood": true,
    "feFuncA": true,
    "feFuncB": true,
    "feFuncG": true,
    "feFuncR": true,
    "feGaussianBlur": true,
    "feImage": true,
    "feMerge": true,
    "feMergeNode": true,
    "feMorphology": true,
    "feOffset": true,
    "fePointLight": true,
    "feSpecularLighting": true,
    "feSpotLight": true,
    "feTile": true,
    "feTurbulence": true,
    "filter": true,
    "font": true,
    "font-face": true,
    "font-face-format": true,
    "font-face-name": true,
    "font-face-src": true,
    "font-face-uri": true,
    "foreignObject": true,
    "g": true,
    "glyph": true,
    "glyphRef": true,
    "hkern": true,
    "image": true,
    "line": true,
    "linearGradient": true,
    "marker": true,
    "mask": true,
    "metadata": true,
    "missing-glyph": true,
    "mpath": true,
    "path": true,
    "pattern": true,
    "polygon": true,
    "polyline": true,
    "radialGradient": true,
    "rect": true,
    "script": true,
    "set": true,
    "stop": true,
    "style": true,
    "svg": true,
    "switch": true,
    "symbol": true,
    "text": true,
    "textPath": true,
    "title": true,
    "tref": true,
    "tspan": true,
    "use": true,
    "view": true,
    "vkern": true
};

},{}],21:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var vanities_1 = _dereq_("./../properties/dom/vanities");
function applyPropertyToElement(element, name, value, context, component) {
    var type = element.elementName;
    if (element.__instance) {
        var addressables = element.__instance.getAddressableProperties();
        if (addressables[name] !== undefined) {
            element.__instance.state[name] = value;
            return;
        }
        type = "div";
    }
    if (vanities_1["default"][type] &&
        vanities_1["default"][type][name]) {
        vanities_1["default"][type][name](name, element, value, context, component);
    }
    else {
        element.attributes[name] = value;
    }
}
exports["default"] = applyPropertyToElement;

},{"./../properties/dom/vanities":50}],22:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var ATTR_EXEC_RE = /\[([a-zA-Z0-9]+)([$|^~])?(=)?"?(.+?)?"?( i)?]/;
function attrSelectorParser(selector) {
    var matches = ATTR_EXEC_RE.exec(selector);
    if (!matches)
        return null;
    return {
        key: matches[1],
        operator: matches[3] && (matches[2] || "") + matches[3],
        value: matches[4],
        insensitive: !!matches[5]
    };
}
exports["default"] = attrSelectorParser;

},{}],23:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectPath_1 = _dereq_("./objectPath");
function matchByAttribute(node, attrKeyToMatch, attrOperator, attrValueToMatch, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (attributes) {
        var attrValue = attributes[attrKeyToMatch];
        if (!attrOperator)
            return !!attrValue;
        switch (attrOperator) {
            case "=":
                return attrValueToMatch === attrValue;
            default:
                console.warn("Operator `" + attrOperator + "` not supported yet");
                return false;
        }
    }
}
exports["default"] = matchByAttribute;

},{"./objectPath":33}],24:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectPath_1 = _dereq_("./objectPath");
var CLASS_NAME_ATTR = "class";
var ALT_CLASS_NAME_ATTR = "className";
var SPACE = " ";
function matchByClass(node, className, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (attributes) {
        var foundClassName = attributes[CLASS_NAME_ATTR];
        if (!foundClassName)
            foundClassName = attributes[ALT_CLASS_NAME_ATTR];
        if (foundClassName) {
            var classPieces = foundClassName.split(SPACE);
            if (classPieces.indexOf(className) !== -1) {
                return true;
            }
        }
    }
}
exports["default"] = matchByClass;

},{"./objectPath":33}],25:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectPath_1 = _dereq_("./objectPath");
var HAIKU_ID_ATTRIBUTE = "haiku-id";
function matchByHaiku(node, haikuString, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (!attributes)
        return false;
    if (!attributes[HAIKU_ID_ATTRIBUTE])
        return false;
    return attributes[HAIKU_ID_ATTRIBUTE] === haikuString;
}
exports["default"] = matchByHaiku;

},{"./objectPath":33}],26:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectPath_1 = _dereq_("./objectPath");
function matchById(node, id, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (attributes) {
        if (attributes.id === id) {
            return true;
        }
    }
}
exports["default"] = matchById;

},{"./objectPath":33}],27:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectPath_1 = _dereq_("./objectPath");
var STRING = "string";
var OBJECT = "object";
var FUNCTION = "function";
function _getFnName(fn) {
    if (fn.name) {
        return fn.name;
    }
    var str = fn.toString();
    var reg = /function ([^(]*)/;
    var ex = reg.exec(str);
    return ex && ex[1];
}
function matchByTagName(node, tagName, options) {
    var val = objectPath_1["default"](node, options.name);
    if (val) {
        if (typeof val === STRING && val === tagName) {
            return true;
        }
        else if (typeof val === FUNCTION) {
            if (_getFnName(val) === tagName) {
                return true;
            }
        }
        else if (typeof val === OBJECT) {
            if (val.name === tagName || val.tagName === tagName) {
                return true;
            }
        }
    }
}
exports["default"] = matchByTagName;

},{"./objectPath":33}],28:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var attrSelectorParser_1 = _dereq_("./attrSelectorParser");
var cssMatchByAttribute_1 = _dereq_("./cssMatchByAttribute");
var cssMatchByClass_1 = _dereq_("./cssMatchByClass");
var cssMatchByHaiku_1 = _dereq_("./cssMatchByHaiku");
var cssMatchById_1 = _dereq_("./cssMatchById");
var cssMatchByTagName_1 = _dereq_("./cssMatchByTagName");
var ID_PREFIX = "#";
var CLASS_PREFIX = ".";
var ATTR_PREFIX = "[";
var HAIKU_PREFIX = "haiku:";
function matchOne(node, piece, options) {
    if (piece.slice(0, 6) === HAIKU_PREFIX) {
        return cssMatchByHaiku_1["default"](node, piece.slice(6), options);
    }
    if (piece[0] === ID_PREFIX) {
        return cssMatchById_1["default"](node, piece.slice(1, piece.length), options);
    }
    if (piece[0] === CLASS_PREFIX) {
        return cssMatchByClass_1["default"](node, piece.slice(1, piece.length), options);
    }
    if (piece[0] === ATTR_PREFIX) {
        var parsedAttr = attrSelectorParser_1["default"](piece);
        if (!parsedAttr)
            return false;
        return cssMatchByAttribute_1["default"](node, parsedAttr.key, parsedAttr.operator, parsedAttr.value, options);
    }
    return cssMatchByTagName_1["default"](node, piece, options);
}
exports["default"] = matchOne;

},{"./attrSelectorParser":22,"./cssMatchByAttribute":23,"./cssMatchByClass":24,"./cssMatchByHaiku":25,"./cssMatchById":26,"./cssMatchByTagName":27}],29:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var cssMatchOne_1 = _dereq_("./cssMatchOne");
var PIECE_SEPARATOR = ",";
function queryList(matches, list, query, options) {
    var maxdepth = options.maxdepth !== undefined
        ? parseInt(options.maxdepth, 10)
        : Infinity;
    var pieces = query.split(PIECE_SEPARATOR);
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i].trim();
        for (var j = 0; j < list.length; j++) {
            var node = list[j];
            if (node.__depth <= maxdepth) {
                if (cssMatchOne_1["default"](node, piece, options)) {
                    matches.push(node);
                }
            }
        }
    }
}
exports["default"] = queryList;

},{"./cssMatchOne":28}],30:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var BasicUtils_1 = _dereq_("./BasicUtils");
var cssQueryList_1 = _dereq_("./cssQueryList");
var manaFlattenTree_1 = _dereq_("./manaFlattenTree");
var OBJECT = "object";
function queryTree(matches, node, query, options) {
    if (!node || typeof node !== OBJECT)
        return matches;
    var list = BasicUtils_1["default"].uniq(manaFlattenTree_1["default"]([], node, options, 0, 0));
    cssQueryList_1["default"](matches, list, query, options);
    return matches;
}
exports["default"] = queryTree;

},{"./BasicUtils":14,"./cssQueryList":29,"./manaFlattenTree":32}],31:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function getTimelineMaxTime(descriptor) {
    var max = 0;
    for (var selector in descriptor) {
        var group = descriptor[selector];
        for (var output in group) {
            var keyframes = group[output];
            var keys = Object.keys(keyframes);
            for (var i = 0; i < keys.length; i++) {
                var key = parseInt(keys[i], 10);
                if (key > max)
                    max = key;
            }
        }
    }
    return max;
}
exports["default"] = getTimelineMaxTime;

},{}],32:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectPath_1 = _dereq_("./objectPath");
function flattenTree(list, node, options, depth, index) {
    if (!depth)
        depth = 0;
    if (!index)
        index = 0;
    list.push(node);
    if (typeof node !== "string") {
        node.__depth = depth;
        node.__index = index;
    }
    var children = objectPath_1["default"](node, options.children);
    if (!children || children.length < 1)
        return list;
    if (typeof children === "string")
        return list;
    if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            flattenTree(list, children[i], options, depth + 1, i);
        }
    }
    else if (typeof children === "object") {
        children.__depth = depth + 1;
        children.__index = 0;
        list.push(children);
        return list;
    }
    return list;
}
exports["default"] = flattenTree;

},{"./objectPath":33}],33:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var STRING = "string";
function objectPath(obj, key) {
    if (typeof key === STRING)
        return obj[key];
    var base = obj;
    for (var i = 0; i < key.length; i++) {
        var name_1 = key[i];
        base = base[name_1];
    }
    return base;
}
exports["default"] = objectPath;

},{}],34:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function parseCssValueString(str, optionalPropertyHint) {
    if (typeof str === "number") {
        return {
            value: str,
            unit: null
        };
    }
    if (str === null || str === undefined) {
        return {
            value: null,
            unit: null
        };
    }
    var num;
    var nmatch = str.match(/([+-]?[\d|.]+)/);
    if (nmatch)
        num = Number(nmatch[0]);
    else
        num = 0;
    var unit;
    var smatch = str.match(/(em|px|%|turn|deg|in)/);
    if (smatch) {
        unit = smatch[0];
    }
    else {
        if (optionalPropertyHint && optionalPropertyHint.match(/rotate/)) {
            unit = "deg";
        }
        else {
            unit = null;
        }
    }
    return {
        value: num,
        unit: unit
    };
}
exports["default"] = parseCssValueString;

},{}],35:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var DEFAULT_SCOPE = "div";
var SCOPE_STRATA = {
    div: "div",
    svg: "svg"
};
var STRING = "string";
function scopifyElements(mana, parent, scope) {
    if (!mana)
        return mana;
    if (typeof mana === STRING)
        return mana;
    if (parent && !mana.__parent) {
        mana.__parent = parent;
    }
    mana.__scope = scope || DEFAULT_SCOPE;
    if (SCOPE_STRATA[mana.elementName]) {
        scope = SCOPE_STRATA[mana.elementName];
    }
    if (mana.children) {
        for (var i = 0; i < mana.children.length; i++) {
            var child = mana.children[i];
            scopifyElements(child, mana, scope);
        }
    }
}
exports["default"] = scopifyElements;

},{}],36:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var visitManaTree_1 = _dereq_("./visitManaTree");
var xmlToMana_1 = _dereq_("./xmlToMana");
var STRING_TYPE = "string";
function upgradeBytecodeInPlace(bytecode, options) {
    if (!bytecode.states) {
        bytecode.states = {};
    }
    if (bytecode.properties) {
        var properties = bytecode.properties;
        delete bytecode.properties;
        for (var i = 0; i < properties.length; i++) {
            var propertySpec = properties[i];
            var updatedSpec = {};
            if (propertySpec.value !== undefined)
                updatedSpec["value"] = propertySpec.value;
            if (propertySpec.type !== undefined)
                updatedSpec["type"] = propertySpec.type;
            if (propertySpec.setter !== undefined)
                updatedSpec["set"] = propertySpec.setter;
            if (propertySpec.getter !== undefined)
                updatedSpec["get"] = propertySpec.getter;
            if (propertySpec.set !== undefined)
                updatedSpec["set"] = propertySpec.set;
            if (propertySpec.get !== undefined)
                updatedSpec["get"] = propertySpec.get;
            bytecode.states[propertySpec.name] = updatedSpec;
        }
    }
    if (Array.isArray(bytecode.eventHandlers)) {
        var eventHandlers = bytecode.eventHandlers;
        delete bytecode.eventHandlers;
        bytecode.eventHandlers = {};
        for (var j = 0; j < eventHandlers.length; j++) {
            var eventHandlerSpec = eventHandlers[j];
            if (!bytecode.eventHandlers[eventHandlerSpec.selector])
                bytecode.eventHandlers[eventHandlerSpec.selector] = {};
            bytecode.eventHandlers[eventHandlerSpec.selector][eventHandlerSpec.name] = {
                handler: eventHandlerSpec.handler
            };
        }
    }
    if (typeof bytecode.template === STRING_TYPE) {
        bytecode.template = xmlToMana_1["default"](bytecode.template);
    }
    if (options && options.referenceUniqueness) {
        var referencesToUpdate_1 = {};
        var alreadyUpdatedReferences_1 = {};
        if (bytecode.template) {
            visitManaTree_1["default"]("0", bytecode.template, function _visitor(elementName, attributes, children, node) {
                if (elementName === "filter") {
                    if (attributes.id && !alreadyUpdatedReferences_1[attributes.id]) {
                        var prev = attributes.id;
                        var next = prev + "-" + options.referenceUniqueness;
                        attributes.id = next;
                        referencesToUpdate_1["url(#" + prev + ")"] = "url(#" + next + ")";
                        alreadyUpdatedReferences_1[attributes.id] = true;
                    }
                }
            }, null, 0);
        }
        if (bytecode.timelines) {
            for (var timelineName in bytecode.timelines) {
                for (var selector in bytecode.timelines[timelineName]) {
                    for (var propertyName in bytecode.timelines[timelineName][selector]) {
                        if (propertyName !== "filter") {
                            continue;
                        }
                        for (var keyframeMs in bytecode.timelines[timelineName][selector][propertyName]) {
                            var keyframeDesc = bytecode.timelines[timelineName][selector][propertyName][keyframeMs];
                            if (keyframeDesc && referencesToUpdate_1[keyframeDesc.value]) {
                                keyframeDesc.value = referencesToUpdate_1[keyframeDesc.value];
                            }
                        }
                    }
                }
            }
        }
    }
}
exports["default"] = upgradeBytecodeInPlace;

},{"./visitManaTree":37,"./xmlToMana":38}],37:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function visitManaTree(locator, mana, visitor, parent, index) {
    if (!mana)
        return null;
    visitor(mana.elementName, mana.attributes, mana.children, mana, locator, parent, index);
    if (!mana.children)
        return null;
    for (var i = 0; i < mana.children.length; i++) {
        var child = mana.children[i];
        visitManaTree(locator + "." + i, child, visitor, mana, i);
    }
}
exports["default"] = visitManaTree;

},{}],38:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var to_style_1 = _dereq_("./../vendor/to-style");
var xml_parser_1 = _dereq_("./../vendor/xml-parser");
var styleStringToObject = to_style_1["default"].object;
function fixChildren(kids) {
    if (Array.isArray(kids))
        return kids.map(fixNode);
    return fixNode(kids);
}
function fixAttributes(attributes) {
    if (attributes.style) {
        if (typeof attributes.style === "string") {
            attributes.style = styleStringToObject(attributes.style, null, null, null);
        }
    }
    return attributes;
}
function fixNode(obj) {
    if (!obj)
        return obj;
    if (typeof obj === "string")
        return obj;
    var children = obj.children;
    if (obj.content)
        children = [obj.content];
    return {
        elementName: obj.name,
        attributes: fixAttributes(obj.attributes || {}),
        children: fixChildren(children)
    };
}
function xmlToMana(xml) {
    var obj = xml_parser_1["default"](xml).root;
    return fixNode(obj);
}
exports["default"] = xmlToMana;

},{"./../vendor/to-style":154,"./../vendor/xml-parser":166}],39:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var formatTransform_1 = _dereq_("./formatTransform");
var isEqualTransformString_1 = _dereq_("./isEqualTransformString");
var scopeOfElement_1 = _dereq_("./scopeOfElement");
var setStyleMatrix_1 = _dereq_("./setStyleMatrix");
var SVG = "svg";
function hasExplicitStyle(domElement, key) {
    if (!domElement.__haikuExplicitStyles)
        return false;
    return !!domElement.__haikuExplicitStyles[key];
}
function applyCssLayout(domElement, virtualElement, nodeLayout, computedLayout, pixelRatio, context) {
    if (computedLayout.opacity === undefined &&
        !computedLayout.size &&
        !computedLayout.matrix) {
        return;
    }
    var elementScope = scopeOfElement_1["default"](virtualElement);
    if (nodeLayout.shown === false) {
        if (domElement.style.visibility !== "hidden") {
            domElement.style.visibility = "hidden";
        }
    }
    else if (nodeLayout.shown === true) {
        if (domElement.style.visibility !== "visible") {
            domElement.style.visibility = "visible";
        }
    }
    if (!hasExplicitStyle(domElement, "opacity")) {
        if (computedLayout.opacity === undefined) {
        }
        else {
            var finalOpacity = void 0;
            if (computedLayout.opacity >= 0.999) {
                finalOpacity = 1;
            }
            else if (computedLayout.opacity <= 0.0001) {
                finalOpacity = 0;
            }
            else {
                finalOpacity = computedLayout.opacity;
            }
            var opacityString = "" + finalOpacity;
            if (domElement.style.opacity !== opacityString) {
                domElement.style.opacity = opacityString;
            }
        }
    }
    if (!hasExplicitStyle(domElement, "width")) {
        if (computedLayout.size.x !== undefined) {
            var sizeXString = parseFloat(computedLayout.size.x.toFixed(2)) + "px";
            if (domElement.style.width !== sizeXString) {
                domElement.style.width = sizeXString;
            }
            if (elementScope === SVG) {
                if (domElement.getAttribute("width") !== sizeXString) {
                    domElement.setAttribute("width", sizeXString);
                }
            }
        }
    }
    if (!hasExplicitStyle(domElement, "height")) {
        if (computedLayout.size.y !== undefined) {
            var sizeYString = parseFloat(computedLayout.size.y.toFixed(2)) + "px";
            if (domElement.style.height !== sizeYString) {
                domElement.style.height = sizeYString;
            }
            if (elementScope === SVG) {
                if (domElement.getAttribute("height") !== sizeYString) {
                    domElement.setAttribute("height", sizeYString);
                }
            }
        }
    }
    if (computedLayout.matrix) {
        var attributeTransform = domElement.getAttribute("transform");
        if (context.config.options.platform.isIE || context.config.options.platform.isEdge) {
            if (elementScope === SVG) {
                var matrixString = formatTransform_1["default"](computedLayout.matrix, nodeLayout.format, pixelRatio);
                if (!isEqualTransformString_1["default"](attributeTransform, matrixString)) {
                    domElement.setAttribute("transform", matrixString);
                }
            }
            else {
                setStyleMatrix_1["default"](domElement.style, nodeLayout.format, computedLayout.matrix, context.config.options.useWebkitPrefix, pixelRatio);
            }
        }
        else {
            if (!hasExplicitStyle(domElement, "transform")) {
                if (!attributeTransform ||
                    attributeTransform === "" ||
                    virtualElement.__transformed) {
                    setStyleMatrix_1["default"](domElement.style, nodeLayout.format, computedLayout.matrix, context.config.options.useWebkitPrefix, pixelRatio);
                }
            }
        }
    }
    return domElement.style;
}
exports["default"] = applyCssLayout;

},{"./formatTransform":43,"./isEqualTransformString":44,"./scopeOfElement":45,"./setStyleMatrix":46}],40:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function computeMatrix(outputMatrix, outputNodepad, layoutSpec, currentMatrix, currentsizeAbsolute, parentMatrix, parentsizeAbsolute) {
    var translationX = layoutSpec.translation.x;
    var translationY = layoutSpec.translation.y;
    var translationZ = layoutSpec.translation.z;
    var orientationX = layoutSpec.orientation.x;
    var orientationY = layoutSpec.orientation.y;
    var orientationZ = layoutSpec.orientation.z;
    var orientationW = layoutSpec.orientation.w;
    var scaleX = layoutSpec.scale.x;
    var scaleY = layoutSpec.scale.y;
    var scaleZ = layoutSpec.scale.z;
    var alignX = layoutSpec.align.x * parentsizeAbsolute.x;
    var alignY = layoutSpec.align.y * parentsizeAbsolute.y;
    var alignZ = layoutSpec.align.z * parentsizeAbsolute.z;
    var mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x;
    var mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y;
    var mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z;
    var originX = layoutSpec.origin.x * currentsizeAbsolute.x;
    var originY = layoutSpec.origin.y * currentsizeAbsolute.y;
    var originZ = layoutSpec.origin.z * currentsizeAbsolute.z;
    var wx = orientationW * orientationX;
    var wy = orientationW * orientationY;
    var wz = orientationW * orientationZ;
    var xx = orientationX * orientationX;
    var yy = orientationY * orientationY;
    var zz = orientationZ * orientationZ;
    var xy = orientationX * orientationY;
    var xz = orientationX * orientationZ;
    var yz = orientationY * orientationZ;
    var rs0 = (1 - 2 * (yy + zz)) * scaleX;
    var rs1 = 2 * (xy + wz) * scaleX;
    var rs2 = 2 * (xz - wy) * scaleX;
    var rs3 = 2 * (xy - wz) * scaleY;
    var rs4 = (1 - 2 * (xx + zz)) * scaleY;
    var rs5 = 2 * (yz + wx) * scaleY;
    var rs6 = 2 * (xz + wy) * scaleZ;
    var rs7 = 2 * (yz - wx) * scaleZ;
    var rs8 = (1 - 2 * (xx + yy)) * scaleZ;
    var tx = alignX +
        translationX -
        mountPointX +
        originX -
        (rs0 * originX + rs3 * originY + rs6 * originZ);
    var ty = alignY +
        translationY -
        mountPointY +
        originY -
        (rs1 * originX + rs4 * originY + rs7 * originZ);
    var tz = alignZ +
        translationZ -
        mountPointZ +
        originZ -
        (rs2 * originX + rs5 * originY + rs8 * originZ);
    outputNodepad.align = { x: alignX, y: alignY, z: alignZ };
    outputNodepad.mount = { x: mountPointX, y: mountPointY, z: mountPointZ };
    outputNodepad.origin = { x: originX, y: originY, z: originZ };
    outputNodepad.offset = { x: tx, y: ty, z: tz };
    outputMatrix[0] =
        parentMatrix[0] * rs0 + parentMatrix[4] * rs1 + parentMatrix[8] * rs2;
    outputMatrix[1] =
        parentMatrix[1] * rs0 + parentMatrix[5] * rs1 + parentMatrix[9] * rs2;
    outputMatrix[2] =
        parentMatrix[2] * rs0 + parentMatrix[6] * rs1 + parentMatrix[10] * rs2;
    outputMatrix[3] = 0;
    outputMatrix[4] =
        parentMatrix[0] * rs3 + parentMatrix[4] * rs4 + parentMatrix[8] * rs5;
    outputMatrix[5] =
        parentMatrix[1] * rs3 + parentMatrix[5] * rs4 + parentMatrix[9] * rs5;
    outputMatrix[6] =
        parentMatrix[2] * rs3 + parentMatrix[6] * rs4 + parentMatrix[10] * rs5;
    outputMatrix[7] = 0;
    outputMatrix[8] =
        parentMatrix[0] * rs6 + parentMatrix[4] * rs7 + parentMatrix[8] * rs8;
    outputMatrix[9] =
        parentMatrix[1] * rs6 + parentMatrix[5] * rs7 + parentMatrix[9] * rs8;
    outputMatrix[10] =
        parentMatrix[2] * rs6 + parentMatrix[6] * rs7 + parentMatrix[10] * rs8;
    outputMatrix[11] = 0;
    outputMatrix[12] =
        parentMatrix[0] * tx + parentMatrix[4] * ty + parentMatrix[8] * tz;
    outputMatrix[13] =
        parentMatrix[1] * tx + parentMatrix[5] * ty + parentMatrix[9] * tz;
    outputMatrix[14] =
        parentMatrix[2] * tx + parentMatrix[6] * ty + parentMatrix[10] * tz;
    outputMatrix[15] = 1;
    return outputMatrix;
}
exports["default"] = computeMatrix;

},{}],41:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function computeOrientationFlexibly(x, y, z, w, quat) {
    if (!quat ||
        (quat.x == null || quat.y == null || quat.z == null || quat.w == null)) {
        throw new Error("No w-component nor quaternion provided!");
    }
    if (x == null || y == null || z == null) {
        var sp = -2 * (quat.y * quat.z - quat.w * quat.x);
        if (Math.abs(sp) > 0.99999) {
            y = y == null ? Math.PI * 0.5 * sp : y;
            x = x == null
                ? Math.atan2(-quat.x * quat.z + quat.w * quat.y, 0.5 - quat.y * quat.y - quat.z * quat.z)
                : x;
            z = z == null ? 0 : z;
        }
        else {
            y = y == null ? Math.asin(sp) : y;
            x = x == null
                ? Math.atan2(quat.x * quat.z + quat.w * quat.y, 0.5 - quat.x * quat.x - quat.y * quat.y)
                : x;
            z = z == null
                ? Math.atan2(quat.x * quat.y + quat.w * quat.z, 0.5 - quat.x * quat.x - quat.z * quat.z)
                : z;
        }
    }
    var hx = x * 0.5;
    var hy = y * 0.5;
    var hz = z * 0.5;
    var sx = Math.sin(hx);
    var sy = Math.sin(hy);
    var sz = Math.sin(hz);
    var cx = Math.cos(hx);
    var cy = Math.cos(hy);
    var cz = Math.cos(hz);
    var sysz = sy * sz;
    var cysz = cy * sz;
    var sycz = sy * cz;
    var cycz = cy * cz;
    var qx = sx * cycz + cx * sysz;
    var qy = cx * sycz - sx * cysz;
    var qz = cx * cysz + sx * sycz;
    var qw = cx * cycz - sx * sysz;
    return { x: qx, y: qy, z: qz, w: qw };
}
exports["default"] = computeOrientationFlexibly;

},{}],42:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var SIZE_PROPORTIONAL = 0;
var SIZE_ABSOLUTE = 1;
var SIZING_COMPONENTS = ["x", "y", "z"];
function computeSize(outputSize, layoutSpec, sizeModeArray, parentsizeAbsolute) {
    for (var i = 0; i < SIZING_COMPONENTS.length; i++) {
        var component = SIZING_COMPONENTS[i];
        switch (sizeModeArray[component]) {
            case SIZE_PROPORTIONAL:
                var sizeProportional = layoutSpec.sizeProportional[component];
                var sizeDifferential = layoutSpec.sizeDifferential[component];
                outputSize[component] =
                    parentsizeAbsolute[component] * sizeProportional + sizeDifferential;
                break;
            case SIZE_ABSOLUTE:
                outputSize[component] = layoutSpec.sizeAbsolute[component];
                break;
        }
    }
    return outputSize;
}
exports["default"] = computeSize;

},{}],43:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var TRANSFORM_SUFFIX = ")";
var TRANSFORM_ZERO = "0";
var TRANSFORM_COMMA = ",";
var TRANSFORM_ZILCH = TRANSFORM_ZERO + TRANSFORM_COMMA;
var TWO = 2;
var THREE = 3;
function formatTransform(transform, format, devicePixelRatio) {
    transform[12] =
        Math.round(transform[12] * devicePixelRatio) / devicePixelRatio;
    transform[13] =
        Math.round(transform[13] * devicePixelRatio) / devicePixelRatio;
    var prefix;
    var last;
    if (format === TWO) {
        var two = [
            transform[0],
            transform[1],
            transform[4],
            transform[5],
            transform[12],
            transform[13],
        ];
        transform = two;
        prefix = "matrix(";
        last = 5;
    }
    else if (format === THREE) {
        prefix = "matrix3d(";
        last = 15;
    }
    prefix += (transform[0] < 0.000001 && transform[0] > -0.000001) ? TRANSFORM_ZILCH : transform[0] + TRANSFORM_COMMA;
    prefix += (transform[1] < 0.000001 && transform[1] > -0.000001) ? TRANSFORM_ZILCH : transform[1] + TRANSFORM_COMMA;
    prefix += (transform[2] < 0.000001 && transform[2] > -0.000001) ? TRANSFORM_ZILCH : transform[2] + TRANSFORM_COMMA;
    prefix += (transform[3] < 0.000001 && transform[3] > -0.000001) ? TRANSFORM_ZILCH : transform[3] + TRANSFORM_COMMA;
    prefix += (transform[4] < 0.000001 && transform[4] > -0.000001) ? TRANSFORM_ZILCH : transform[4] + TRANSFORM_COMMA;
    if (last > 5) {
        prefix += (transform[5] < 0.000001 && transform[5] > -0.000001) ? TRANSFORM_ZILCH : transform[5] + TRANSFORM_COMMA;
        prefix += (transform[6] < 0.000001 && transform[6] > -0.000001) ? TRANSFORM_ZILCH : transform[6] + TRANSFORM_COMMA;
        prefix += (transform[7] < 0.000001 && transform[7] > -0.000001) ? TRANSFORM_ZILCH : transform[7] + TRANSFORM_COMMA;
        prefix += (transform[8] < 0.000001 && transform[8] > -0.000001) ? TRANSFORM_ZILCH : transform[8] + TRANSFORM_COMMA;
        prefix += (transform[9] < 0.000001 && transform[9] > -0.000001) ? TRANSFORM_ZILCH : transform[9] + TRANSFORM_COMMA;
        prefix += (transform[10] < 0.000001 && transform[10] > -0.000001) ? TRANSFORM_ZILCH : transform[10] + TRANSFORM_COMMA;
        prefix += (transform[11] < 0.000001 && transform[11] > -0.000001) ? TRANSFORM_ZILCH : transform[11] + TRANSFORM_COMMA;
        prefix += (transform[12] < 0.000001 && transform[12] > -0.000001) ? TRANSFORM_ZILCH : transform[12] + TRANSFORM_COMMA;
        prefix += (transform[13] < 0.000001 && transform[13] > -0.000001) ? TRANSFORM_ZILCH : transform[13] + TRANSFORM_COMMA;
        prefix += (transform[14] < 0.000001 && transform[14] > -0.000001) ? TRANSFORM_ZILCH : transform[14] + TRANSFORM_COMMA;
    }
    prefix += transform[last] + TRANSFORM_SUFFIX;
    return prefix;
}
exports["default"] = formatTransform;

},{}],44:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var C1 = ", ";
function isEqualTransformString(t1, t2) {
    if (t1 === t2)
        return true;
    if (!t1)
        return false;
    var cs1 = t1.split(C1);
    var cs2 = t2.split(C1);
    if (cs1[0] !== cs2[0])
        return false;
    if (cs1[1] !== cs2[1])
        return false;
    if (cs1[2] !== cs2[2])
        return false;
    if (cs1[3] !== cs2[3])
        return false;
    if (cs1[4] !== cs2[4])
        return false;
    if (cs1[5] !== cs2[5])
        return false;
    if (cs1[6] !== cs2[6])
        return false;
    if (cs1[7] !== cs2[7])
        return false;
    if (cs1[8] !== cs2[8])
        return false;
    if (cs1[9] !== cs2[9])
        return false;
    if (cs1[10] !== cs2[10])
        return false;
    if (cs1[11] !== cs2[11])
        return false;
    if (cs1[12] !== cs2[12])
        return false;
    if (cs1[13] !== cs2[13])
        return false;
    if (cs1[14] !== cs2[14])
        return false;
    if (cs1[15] !== cs2[15])
        return false;
    return true;
}
exports["default"] = isEqualTransformString;

},{}],45:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function scopeOfElement(mana) {
    if (mana.__scope)
        return mana.__scope;
    if (mana.__parent) {
        return scopeOfElement(mana.__parent);
    }
    return null;
}
exports["default"] = scopeOfElement;

},{}],46:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var formatTransform_1 = _dereq_("./formatTransform");
var isEqualTransformString_1 = _dereq_("./isEqualTransformString");
function setStyleMatrix(styleObject, format, matrix, usePrefix, devicePixelRatio) {
    var matrixString = formatTransform_1["default"](matrix, format, devicePixelRatio);
    if (usePrefix) {
        if (!isEqualTransformString_1["default"](styleObject.webkitTransform, matrixString)) {
            styleObject.webkitTransform = matrixString;
        }
    }
    else {
        if (!isEqualTransformString_1["default"](styleObject.transform, matrixString)) {
            styleObject.transform = matrixString;
        }
    }
    return styleObject;
}
exports["default"] = setStyleMatrix;

},{"./formatTransform":43,"./isEqualTransformString":44}],47:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function has() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var obj = {};
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        for (var name_1 in arg) {
            var fn = arg[name_1];
            obj[name_1] = fn;
        }
    }
    return obj;
}
exports["default"] = has;

},{}],48:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var ColorUtils_1 = _dereq_("./../../helpers/ColorUtils");
var SVGPoints_1 = _dereq_("./../../helpers/SVGPoints");
var has_1 = _dereq_("./has");
function parseD(value) {
    if (!value)
        return [];
    if (Array.isArray(value)) {
        return value;
    }
    return SVGPoints_1["default"].pathToPoints(value);
}
function generateD(value) {
    if (typeof value === "string")
        return value;
    return SVGPoints_1["default"].pointsToPath(value);
}
function parseColor(value) {
    return ColorUtils_1["default"].parseString(value);
}
function generateColor(value) {
    return ColorUtils_1["default"].generateString(value);
}
function parsePoints(value) {
    if (Array.isArray(value))
        return value;
    return SVGPoints_1["default"].polyPointsStringToPoints(value);
}
function generatePoints(value) {
    if (typeof value === "string")
        return value;
    return SVGPoints_1["default"].pointsToPolyString(value);
}
var STYLE_COLOR_PARSERS = {
    "style.stroke": { parse: parseColor, generate: generateColor },
    "style.fill": { parse: parseColor, generate: generateColor },
    "style.backgroundColor": { parse: parseColor, generate: generateColor },
    "style.borderBottomColor": { parse: parseColor, generate: generateColor },
    "style.borderColor": { parse: parseColor, generate: generateColor },
    "style.borderLeftColor": { parse: parseColor, generate: generateColor },
    "style.borderRightColor": { parse: parseColor, generate: generateColor },
    "style.borderTopColor": { parse: parseColor, generate: generateColor },
    "style.floodColor": { parse: parseColor, generate: generateColor },
    "style.lightingColor": { parse: parseColor, generate: generateColor },
    "style.stopColor": { parse: parseColor, generate: generateColor }
};
var SVG_COLOR_PARSERS = {
    "stroke": { parse: parseColor, generate: generateColor },
    "fill": { parse: parseColor, generate: generateColor },
    "floodColor": { parse: parseColor, generate: generateColor },
    "lightingColor": { parse: parseColor, generate: generateColor },
    "stopColor": { parse: parseColor, generate: generateColor },
    "backgroundColor": { parse: parseColor, generate: generateColor },
    "animateColor": { parse: parseColor, generate: generateColor },
    "feColor": { parse: parseColor, generate: generateColor },
    "flood-color": { parse: parseColor, generate: generateColor },
    "lighting-color": { parse: parseColor, generate: generateColor },
    "stop-color": { parse: parseColor, generate: generateColor },
    "background-color": { parse: parseColor, generate: generateColor },
    "animate-color": { parse: parseColor, generate: generateColor },
    "fe-color": { parse: parseColor, generate: generateColor }
};
var SVG_PATH_PARSERS = {
    d: { parse: parseD, generate: generateD }
};
var SVG_POINT_PARSERS = {
    points: { parse: parsePoints, generate: generatePoints }
};
exports["default"] = {
    "missing-glyph": has_1["default"](STYLE_COLOR_PARSERS),
    "a": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "abbr": has_1["default"](STYLE_COLOR_PARSERS),
    "acronym": has_1["default"](STYLE_COLOR_PARSERS),
    "address": has_1["default"](STYLE_COLOR_PARSERS),
    "altGlyph": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "altGlyphDef": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "altGlyphItem": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "animate": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "animateColor": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "animateMotion": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "animateTransform": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "applet": has_1["default"](STYLE_COLOR_PARSERS),
    "area": has_1["default"](STYLE_COLOR_PARSERS),
    "article": has_1["default"](STYLE_COLOR_PARSERS),
    "aside": has_1["default"](STYLE_COLOR_PARSERS),
    "audio": has_1["default"](STYLE_COLOR_PARSERS),
    "b": has_1["default"](STYLE_COLOR_PARSERS),
    "base": has_1["default"](STYLE_COLOR_PARSERS),
    "basefont": has_1["default"](STYLE_COLOR_PARSERS),
    "bdi": has_1["default"](STYLE_COLOR_PARSERS),
    "bdo": has_1["default"](STYLE_COLOR_PARSERS),
    "big": has_1["default"](STYLE_COLOR_PARSERS),
    "blockquote": has_1["default"](STYLE_COLOR_PARSERS),
    "body": has_1["default"](STYLE_COLOR_PARSERS),
    "br": has_1["default"](STYLE_COLOR_PARSERS),
    "button": has_1["default"](STYLE_COLOR_PARSERS),
    "canvas": has_1["default"](STYLE_COLOR_PARSERS),
    "caption": has_1["default"](STYLE_COLOR_PARSERS),
    "center": has_1["default"](STYLE_COLOR_PARSERS),
    "circle": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "cite": has_1["default"](STYLE_COLOR_PARSERS),
    "clipPath": has_1["default"](STYLE_COLOR_PARSERS),
    "code": has_1["default"](STYLE_COLOR_PARSERS),
    "col": has_1["default"](STYLE_COLOR_PARSERS),
    "colgroup": has_1["default"](STYLE_COLOR_PARSERS),
    "color-profile": has_1["default"](STYLE_COLOR_PARSERS),
    "command": has_1["default"](STYLE_COLOR_PARSERS),
    "cursor": has_1["default"](STYLE_COLOR_PARSERS),
    "datalist": has_1["default"](STYLE_COLOR_PARSERS),
    "dd": has_1["default"](STYLE_COLOR_PARSERS),
    "defs": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "del": has_1["default"](STYLE_COLOR_PARSERS),
    "desc": has_1["default"](STYLE_COLOR_PARSERS),
    "details": has_1["default"](STYLE_COLOR_PARSERS),
    "dfn": has_1["default"](STYLE_COLOR_PARSERS),
    "dir": has_1["default"](STYLE_COLOR_PARSERS),
    "discard": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "div": has_1["default"](STYLE_COLOR_PARSERS),
    "dl": has_1["default"](STYLE_COLOR_PARSERS),
    "dt": has_1["default"](STYLE_COLOR_PARSERS),
    "ellipse": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "em": has_1["default"](STYLE_COLOR_PARSERS),
    "embed": has_1["default"](STYLE_COLOR_PARSERS),
    "feBlend": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feColorMatrix": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feComponentTransfer": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feComposite": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feConvolveMatrix": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feDiffuseLighting": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feDisplacementMap": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feDistantLight": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feDropShadow": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feFlood": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feFuncA": has_1["default"](STYLE_COLOR_PARSERS),
    "feFuncB": has_1["default"](STYLE_COLOR_PARSERS),
    "feFuncG": has_1["default"](STYLE_COLOR_PARSERS),
    "feFuncR": has_1["default"](STYLE_COLOR_PARSERS),
    "feGaussianBlur": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feImage": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feMerge": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feMergeNode": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feMorphology": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feOffset": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "fePointLight": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feSpecularLighting": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feTile": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "feTurbulence": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "fieldset": has_1["default"](STYLE_COLOR_PARSERS),
    "figcaption": has_1["default"](STYLE_COLOR_PARSERS),
    "figure": has_1["default"](STYLE_COLOR_PARSERS),
    "filter": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "font-face": has_1["default"](STYLE_COLOR_PARSERS),
    "font-face-format": has_1["default"](STYLE_COLOR_PARSERS),
    "font-face-name": has_1["default"](STYLE_COLOR_PARSERS),
    "font-face-src": has_1["default"](STYLE_COLOR_PARSERS),
    "font-face-uri": has_1["default"](STYLE_COLOR_PARSERS),
    "font": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "footer": has_1["default"](STYLE_COLOR_PARSERS),
    "foreignObject": has_1["default"](STYLE_COLOR_PARSERS),
    "form": has_1["default"](STYLE_COLOR_PARSERS),
    "frame": has_1["default"](STYLE_COLOR_PARSERS),
    "frameset": has_1["default"](STYLE_COLOR_PARSERS),
    "g": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "glyph": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "glyphRef": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "h1": has_1["default"](STYLE_COLOR_PARSERS),
    "h2": has_1["default"](STYLE_COLOR_PARSERS),
    "h3": has_1["default"](STYLE_COLOR_PARSERS),
    "h4": has_1["default"](STYLE_COLOR_PARSERS),
    "h5": has_1["default"](STYLE_COLOR_PARSERS),
    "h6": has_1["default"](STYLE_COLOR_PARSERS),
    "hatch": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "hatchpath": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "head": has_1["default"](STYLE_COLOR_PARSERS),
    "header": has_1["default"](STYLE_COLOR_PARSERS),
    "hgroup": has_1["default"](STYLE_COLOR_PARSERS),
    "hkern": has_1["default"](STYLE_COLOR_PARSERS),
    "hr": has_1["default"](STYLE_COLOR_PARSERS),
    "html": has_1["default"](STYLE_COLOR_PARSERS),
    "i": has_1["default"](STYLE_COLOR_PARSERS),
    "iframe": has_1["default"](STYLE_COLOR_PARSERS),
    "image": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "img": has_1["default"](STYLE_COLOR_PARSERS),
    "input": has_1["default"](STYLE_COLOR_PARSERS),
    "ins": has_1["default"](STYLE_COLOR_PARSERS),
    "kbd": has_1["default"](STYLE_COLOR_PARSERS),
    "keygen": has_1["default"](STYLE_COLOR_PARSERS),
    "label": has_1["default"](STYLE_COLOR_PARSERS),
    "legend": has_1["default"](STYLE_COLOR_PARSERS),
    "li": has_1["default"](STYLE_COLOR_PARSERS),
    "line": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "linearGradient": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "link": has_1["default"](STYLE_COLOR_PARSERS),
    "map": has_1["default"](STYLE_COLOR_PARSERS),
    "mark": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "marker": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "mask": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "menu": has_1["default"](STYLE_COLOR_PARSERS),
    "mesh": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "meshgradient": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "meshpatch": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "meshrow": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "meta": has_1["default"](STYLE_COLOR_PARSERS),
    "metadata": has_1["default"](STYLE_COLOR_PARSERS),
    "meter": has_1["default"](STYLE_COLOR_PARSERS),
    "mpath": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "nav": has_1["default"](STYLE_COLOR_PARSERS),
    "noframes": has_1["default"](STYLE_COLOR_PARSERS),
    "noscript": has_1["default"](STYLE_COLOR_PARSERS),
    "object": has_1["default"](STYLE_COLOR_PARSERS),
    "ol": has_1["default"](STYLE_COLOR_PARSERS),
    "optgroup": has_1["default"](STYLE_COLOR_PARSERS),
    "option": has_1["default"](STYLE_COLOR_PARSERS),
    "output": has_1["default"](STYLE_COLOR_PARSERS),
    "p": has_1["default"](STYLE_COLOR_PARSERS),
    "param": has_1["default"](STYLE_COLOR_PARSERS),
    "path": has_1["default"](SVG_PATH_PARSERS, SVG_COLOR_PARSERS, STYLE_COLOR_PARSERS),
    "pattern": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "polygon": has_1["default"](SVG_POINT_PARSERS, SVG_COLOR_PARSERS, STYLE_COLOR_PARSERS),
    "polyline": has_1["default"](SVG_POINT_PARSERS, SVG_COLOR_PARSERS, STYLE_COLOR_PARSERS),
    "pre": has_1["default"](STYLE_COLOR_PARSERS),
    "progress": has_1["default"](STYLE_COLOR_PARSERS),
    "q": has_1["default"](STYLE_COLOR_PARSERS),
    "radialGradient": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "rect": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "rp": has_1["default"](STYLE_COLOR_PARSERS),
    "rt": has_1["default"](STYLE_COLOR_PARSERS),
    "ruby": has_1["default"](STYLE_COLOR_PARSERS),
    "s": has_1["default"](STYLE_COLOR_PARSERS),
    "samp": has_1["default"](STYLE_COLOR_PARSERS),
    "script": has_1["default"](STYLE_COLOR_PARSERS),
    "section": has_1["default"](STYLE_COLOR_PARSERS),
    "select": has_1["default"](STYLE_COLOR_PARSERS),
    "set": has_1["default"](STYLE_COLOR_PARSERS),
    "small": has_1["default"](STYLE_COLOR_PARSERS),
    "solidcolor": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "source": has_1["default"](STYLE_COLOR_PARSERS),
    "span": has_1["default"](STYLE_COLOR_PARSERS),
    "stop": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "strike": has_1["default"](STYLE_COLOR_PARSERS),
    "strong": has_1["default"](STYLE_COLOR_PARSERS),
    "style": has_1["default"](STYLE_COLOR_PARSERS),
    "sub": has_1["default"](STYLE_COLOR_PARSERS),
    "summary": has_1["default"](STYLE_COLOR_PARSERS),
    "sup": has_1["default"](STYLE_COLOR_PARSERS),
    "svg": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "switch": has_1["default"](STYLE_COLOR_PARSERS),
    "symbol": has_1["default"](STYLE_COLOR_PARSERS),
    "table": has_1["default"](STYLE_COLOR_PARSERS),
    "tbody": has_1["default"](STYLE_COLOR_PARSERS),
    "td": has_1["default"](STYLE_COLOR_PARSERS),
    "text": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "textarea": has_1["default"](STYLE_COLOR_PARSERS),
    "textPath": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "tfoot": has_1["default"](STYLE_COLOR_PARSERS),
    "th": has_1["default"](STYLE_COLOR_PARSERS),
    "thead": has_1["default"](STYLE_COLOR_PARSERS),
    "time": has_1["default"](STYLE_COLOR_PARSERS),
    "title": has_1["default"](STYLE_COLOR_PARSERS),
    "tr": has_1["default"](STYLE_COLOR_PARSERS),
    "track": has_1["default"](STYLE_COLOR_PARSERS),
    "tref": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "tspan": has_1["default"](STYLE_COLOR_PARSERS, SVG_COLOR_PARSERS),
    "tt": has_1["default"](STYLE_COLOR_PARSERS),
    "u": has_1["default"](STYLE_COLOR_PARSERS),
    "ul": has_1["default"](STYLE_COLOR_PARSERS),
    "unknown": has_1["default"](STYLE_COLOR_PARSERS),
    "us": has_1["default"](STYLE_COLOR_PARSERS),
    "use": has_1["default"](STYLE_COLOR_PARSERS),
    "var": has_1["default"](STYLE_COLOR_PARSERS),
    "video": has_1["default"](STYLE_COLOR_PARSERS),
    "view": has_1["default"](STYLE_COLOR_PARSERS),
    "vkern": has_1["default"](STYLE_COLOR_PARSERS),
    "wb": has_1["default"](STYLE_COLOR_PARSERS)
};

},{"./../../helpers/ColorUtils":15,"./../../helpers/SVGPoints":17,"./has":47}],49:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var has_1 = _dereq_("./has");
var TEXT_CONTENT_SCHEMA = {
    content: "string"
};
var LAYOUT_3D_SCHEMA = {
    "shown": "boolean",
    "opacity": "number",
    "mount.x": "number",
    "mount.y": "number",
    "mount.z": "number",
    "align.x": "number",
    "align.y": "number",
    "align.z": "number",
    "origin.x": "number",
    "origin.y": "number",
    "origin.z": "number",
    "translation.x": "number",
    "translation.y": "number",
    "translation.z": "number",
    "rotation.x": "number",
    "rotation.y": "number",
    "rotation.z": "number",
    "rotation.w": "number",
    "scale.x": "number",
    "scale.y": "number",
    "scale.z": "number",
    "sizeAbsolute.x": "number",
    "sizeAbsolute.y": "number",
    "sizeAbsolute.z": "number",
    "sizeProportional.x": "number",
    "sizeProportional.y": "number",
    "sizeProportional.z": "number",
    "sizeDifferential.x": "number",
    "sizeDifferential.y": "number",
    "sizeDifferential.z": "number",
    "sizeMode.x": "number",
    "sizeMode.y": "number",
    "sizeMode.z": "number"
};
var LAYOUT_2D_SCHEMA = {
    "shown": "boolean",
    "opacity": "number",
    "mount.x": "number",
    "mount.y": "number",
    "align.x": "number",
    "align.y": "number",
    "origin.x": "number",
    "origin.y": "number",
    "translation.x": "number",
    "translation.y": "number",
    "translation.z": "number",
    "rotation.x": "number",
    "rotation.y": "number",
    "rotation.z": "number",
    "scale.x": "number",
    "scale.y": "number",
    "sizeAbsolute.x": "number",
    "sizeAbsolute.y": "number",
    "sizeProportional.x": "number",
    "sizeProportional.y": "number",
    "sizeDifferential.x": "number",
    "sizeDifferential.y": "number",
    "sizeMode.x": "number",
    "sizeMode.y": "number"
};
var PRESENTATION_SCHEMA = {
    alignmentBaseline: "string",
    baselineShift: "string",
    clipPath: "string",
    clipRule: "string",
    clip: "string",
    colorInterpolationFilters: "string",
    colorInterpolation: "string",
    colorProfile: "string",
    colorRendering: "string",
    color: "string",
    cursor: "string",
    direction: "string",
    display: "string",
    dominantBaseline: "string",
    enableBackground: "string",
    fillOpacity: "string",
    fillRule: "string",
    fill: "string",
    filter: "string",
    floodColor: "string",
    floodOpacity: "string",
    fontFamily: "string",
    fontSizeAdjust: "string",
    fontSize: "string",
    fontStretch: "string",
    fontStyle: "string",
    fontVariant: "string",
    fontWeight: "string",
    glyphOrientationHorizontal: "string",
    glyphOrientationVertical: "string",
    imageRendering: "string",
    kerning: "string",
    letterSpacing: "string",
    lightingColor: "string",
    markerEnd: "string",
    markerMid: "string",
    markerStart: "string",
    mask: "string",
    overflow: "string",
    overflowX: "string",
    overflowY: "string",
    pointerEvents: "string",
    shapeRendering: "string",
    stopColor: "string",
    stopOpacity: "string",
    strokeDasharray: "string",
    strokeDashoffset: "string",
    strokeLinecap: "string",
    strokeLinejoin: "string",
    strokeMiterlimit: "string",
    strokeOpacity: "string",
    strokeWidth: "string",
    stroke: "string",
    textAnchor: "string",
    textDecoration: "string",
    textRendering: "string",
    unicodeBidi: "string",
    visibility: "string",
    wordSpacing: "string",
    writingMode: "string"
};
var FILTER_SCHEMA = {
    x: "string",
    y: "string",
    width: "string",
    height: "string",
    filterRes: "string",
    filterUnits: "string",
    primitiveUnits: "string"
};
var STYLE_SCHEMA = {
    "style.alignmentBaseline": "string",
    "style.background": "string",
    "style.backgroundAttachment": "string",
    "style.backgroundColor": "string",
    "style.backgroundImage": "string",
    "style.backgroundPosition": "string",
    "style.backgroundRepeat": "string",
    "style.baselineShift": "string",
    "style.border": "string",
    "style.borderBottom": "string",
    "style.borderBottomColor": "string",
    "style.borderBottomStyle": "string",
    "style.borderBottomWidth": "string",
    "style.borderColor": "string",
    "style.borderLeft": "string",
    "style.borderLeftColor": "string",
    "style.borderLeftStyle": "string",
    "style.borderLeftWidth": "string",
    "style.borderRight": "string",
    "style.borderRightColor": "string",
    "style.borderRightStyle": "string",
    "style.borderRightWidth": "string",
    "style.borderStyle": "string",
    "style.borderTop": "string",
    "style.borderTopColor": "string",
    "style.borderTopStyle": "string",
    "style.borderTopWidth": "string",
    "style.borderWidth": "string",
    "style.clear": "string",
    "style.clip": "string",
    "style.clipPath": "string",
    "style.clipRule": "string",
    "style.color": "string",
    "style.colorInterpolation": "string",
    "style.colorInterpolationFilters": "string",
    "style.colorProfile": "string",
    "style.colorRendering": "string",
    "style.cssFloat": "string",
    "style.cursor": "string",
    "style.direction": "string",
    "style.display": "string",
    "style.dominantBaseline": "string",
    "style.enableBackground": "string",
    "style.fill": "string",
    "style.fillOpacity": "string",
    "style.fillRule": "string",
    "style.filter": "string",
    "style.floodColor": "string",
    "style.floodOpacity": "string",
    "style.font": "string",
    "style.fontFamily": "string",
    "style.fontSize": "string",
    "style.fontSizeAdjust": "string",
    "style.fontStretch": "string",
    "style.fontStyle": "string",
    "style.fontVariant": "string",
    "style.fontWeight": "string",
    "style.glyphOrientationHorizontal": "string",
    "style.glyphOrientationVertical": "string",
    "style.height": "string",
    "style.imageRendering": "string",
    "style.kerning": "string",
    "style.left": "string",
    "style.letterSpacing": "string",
    "style.lightingColor": "string",
    "style.lineHeight": "string",
    "style.listStyle": "string",
    "style.listStyleImage": "string",
    "style.listStylePosition": "string",
    "style.listStyleType": "string",
    "style.margin": "string",
    "style.marginBottom": "string",
    "style.marginLeft": "string",
    "style.marginRight": "string",
    "style.marginTop": "string",
    "style.markerEnd": "string",
    "style.markerMid": "string",
    "style.markerStart": "string",
    "style.mask": "string",
    "style.opacity": "string",
    "style.overflow": "string",
    "style.overflowX": "string",
    "style.overflowY": "string",
    "style.padding": "string",
    "style.paddingBottom": "string",
    "style.paddingLeft": "string",
    "style.paddingRight": "string",
    "style.paddingTop": "string",
    "style.pageBreakAfter": "string",
    "style.pageBreakBefore": "string",
    "style.pointerEvents": "string",
    "style.position": "string",
    "style.shapeRendering": "string",
    "style.stopColor": "string",
    "style.stopOpacity": "string",
    "style.stroke": "string",
    "style.strokeDasharray": "string",
    "style.strokeDashoffset": "string",
    "style.strokeLinecap": "string",
    "style.strokeLinejoin": "string",
    "style.strokeMiterlimit": "string",
    "style.strokeOpacity": "string",
    "style.strokeWidth": "string",
    "style.textAlign": "string",
    "style.textAnchor": "string",
    "style.textDecoration": "string",
    "style.textDecorationBlink": "string",
    "style.textDecorationLineThrough": "string",
    "style.textDecorationNone": "string",
    "style.textDecorationOverline": "string",
    "style.textDecorationUnderline": "string",
    "style.textIndent": "string",
    "style.textRendering": "string",
    "style.textTransform": "string",
    "style.top": "string",
    "style.unicodeBidi": "string",
    "style.verticalAlign": "string",
    "style.visibility": "string",
    "style.width": "string",
    "style.wordSpacing": "string",
    "style.writingMode": "string",
    "style.zIndex": "number",
    "style.WebkitTapHighlightColor": "string"
};
var HTML_STYLE_SHORTHAND_SCHEMA = {
    backgroundColor: "string"
};
var CONTROL_FLOW_SCHEMA = {
    "controlFlow.repeat": "any",
    "controlFlow.placeholder": "any"
};
exports["default"] = {
    "missing-glyph": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "a": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA, STYLE_SCHEMA),
    "abbr": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "acronym": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "address": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "altGlyph": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "altGlyphDef": has_1["default"](),
    "altGlyphItem": has_1["default"](),
    "animate": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "animateColor": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "animateMotion": has_1["default"](),
    "animateTransform": has_1["default"](),
    "applet": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "area": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "article": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "aside": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "audio": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "b": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "base": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "basefont": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "bdi": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "bdo": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "big": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "blockquote": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "body": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "br": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "button": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "canvas": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "caption": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "center": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "circle": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "cite": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "clipPath": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "code": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "col": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "colgroup": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "color-profile": has_1["default"](),
    "command": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "cursor": has_1["default"](),
    "datalist": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "dd": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "defs": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "del": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "desc": has_1["default"](),
    "details": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "dfn": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "dir": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "discard": has_1["default"](),
    "div": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "dl": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "dt": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "ellipse": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "em": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "embed": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "feBlend": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feColorMatrix": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feComponentTransfer": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feComposite": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feConvolveMatrix": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feDiffuseLighting": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feDisplacementMap": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feDistantLight": has_1["default"](),
    "feDropShadow": has_1["default"](),
    "feFlood": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feFuncA": has_1["default"](),
    "feFuncB": has_1["default"](),
    "feFuncG": has_1["default"](),
    "feFuncR": has_1["default"](),
    "feGaussianBlur": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feImage": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feMerge": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feMergeNode": has_1["default"](),
    "feMorphology": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feOffset": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "fePointLight": has_1["default"](),
    "feSpecularLighting": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feTile": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "feTurbulence": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "fieldset": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "figcaption": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "figure": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "filter": has_1["default"](LAYOUT_3D_SCHEMA, FILTER_SCHEMA),
    "font-face": has_1["default"](),
    "font-face-format": has_1["default"](),
    "font-face-name": has_1["default"](),
    "font-face-src": has_1["default"](),
    "font-face-uri": has_1["default"](),
    "font": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA, STYLE_SCHEMA),
    "footer": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "foreignObject": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "form": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "frame": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "frameset": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "g": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "glyph": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "glyphRef": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "h1": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "h2": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "h3": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "h4": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "h5": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "h6": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "hatch": has_1["default"](),
    "hatchpath": has_1["default"](),
    "head": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "header": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "hgroup": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "hkern": has_1["default"](),
    "hr": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "html": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "i": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "iframe": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "image": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "img": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "input": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "ins": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "kbd": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "keygen": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "label": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "legend": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "li": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "line": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "linearGradient": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "link": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "map": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "mark": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "marker": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "mask": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "menu": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "mesh": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
    "meshgradient": has_1["default"](),
    "meshpatch": has_1["default"](),
    "meshrow": has_1["default"](),
    "meta": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "metadata": has_1["default"](),
    "meter": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "mpath": has_1["default"](),
    "nav": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "noframes": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "noscript": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "object": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "ol": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "optgroup": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "option": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "output": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "p": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "param": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "path": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "pattern": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "polygon": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "polyline": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "pre": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "progress": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "q": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "radialGradient": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "rect": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "rp": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "rt": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "ruby": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "s": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "samp": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "script": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "section": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "select": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "set": has_1["default"](),
    "small": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "solidcolor": has_1["default"](),
    "source": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "span": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "stop": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "strike": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "strong": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "style": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "sub": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "summary": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "sup": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "svg": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA, STYLE_SCHEMA),
    "switch": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "symbol": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "table": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "tbody": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "td": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "text": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "textarea": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "textPath": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "tfoot": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "th": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "thead": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "time": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "title": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "tr": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "track": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "tref": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "tspan": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA, PRESENTATION_SCHEMA),
    "tt": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "u": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, TEXT_CONTENT_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "ul": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "unknown": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
    "us": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, PRESENTATION_SCHEMA),
    "use": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_2D_SCHEMA),
    "var": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "video": has_1["default"](HTML_STYLE_SHORTHAND_SCHEMA, CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA),
    "view": has_1["default"](),
    "vkern": has_1["default"](),
    "wb": has_1["default"](CONTROL_FLOW_SCHEMA, LAYOUT_3D_SCHEMA, STYLE_SCHEMA)
};

},{"./has":47}],50:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var Layout3D_1 = _dereq_("./../../Layout3D");
var has_1 = _dereq_("./has");
var LAYOUT_3D_VANITIES = {
    "shown": function (name, element, value) {
        element.layout.shown = value;
    },
    "opacity": function (name, element, value) {
        element.layout.opacity = value;
    },
    "rotation.x": function (name, element, value) {
        element.layout.rotation.x = value;
        element.layout.orientation = Layout3D_1["default"].computeOrientationFlexibly(element.layout.rotation.x, element.layout.rotation.y, element.layout.rotation.z, element.layout.rotation.w, element.layout.rotation);
    },
    "rotation.y": function (name, element, value) {
        element.layout.rotation.y = value;
        element.layout.orientation = Layout3D_1["default"].computeOrientationFlexibly(element.layout.rotation.x, element.layout.rotation.y, element.layout.rotation.z, element.layout.rotation.w, element.layout.orientation);
    },
    "rotation.z": function (name, element, value) {
        element.layout.rotation.z = value;
        element.layout.orientation = Layout3D_1["default"].computeOrientationFlexibly(element.layout.rotation.x, element.layout.rotation.y, element.layout.rotation.z, element.layout.rotation.w, element.layout.orientation);
    },
    "rotation.w": function (name, element, value) {
        element.layout.rotation.w = value;
        element.layout.orientation = Layout3D_1["default"].computeOrientationFlexibly(element.layout.rotation.x, element.layout.rotation.y, element.layout.rotation.z, element.layout.rotation.w, element.layout.orientation);
    },
    "position.x": function (name, element, value) {
        element.attributes.x = value;
    },
    "position.y": function (name, element, value) {
        element.attributes.y = value;
    },
    "align.x": function (name, element, value) {
        element.layout.align.x = value;
    },
    "align.y": function (name, element, value) {
        element.layout.align.y = value;
    },
    "align.z": function (name, element, value) {
        element.layout.align.z = value;
    },
    "mount.x": function (name, element, value) {
        element.layout.mount.x = value;
    },
    "mount.y": function (name, element, value) {
        element.layout.mount.y = value;
    },
    "mount.z": function (name, element, value) {
        element.layout.mount.z = value;
    },
    "origin.x": function (name, element, value) {
        element.layout.origin.x = value;
    },
    "origin.y": function (name, element, value) {
        element.layout.origin.y = value;
    },
    "origin.z": function (name, element, value) {
        element.layout.origin.z = value;
    },
    "scale.x": function (name, element, value) {
        element.layout.scale.x = value;
    },
    "scale.y": function (name, element, value) {
        element.layout.scale.y = value;
    },
    "scale.z": function (name, element, value) {
        element.layout.scale.z = value;
    },
    "sizeAbsolute.x": function (name, element, value) {
        element.layout.sizeAbsolute.x = value;
    },
    "sizeAbsolute.y": function (name, element, value) {
        element.layout.sizeAbsolute.y = value;
    },
    "sizeAbsolute.z": function (name, element, value) {
        element.layout.sizeAbsolute.z = value;
    },
    "sizeDifferential.x": function (name, element, value) {
        element.layout.sizeDifferential.x = value;
    },
    "sizeDifferential.y": function (name, element, value) {
        element.layout.sizeDifferential.y = value;
    },
    "sizeDifferential.z": function (name, element, value) {
        element.layout.sizeDifferential.z = value;
    },
    "sizeMode.x": function (name, element, value) {
        element.layout.sizeMode.x = value;
    },
    "sizeMode.y": function (name, element, value) {
        element.layout.sizeMode.y = value;
    },
    "sizeMode.z": function (name, element, value) {
        element.layout.sizeMode.z = value;
    },
    "sizeProportional.x": function (name, element, value) {
        element.layout.sizeProportional.x = value;
    },
    "sizeProportional.y": function (name, element, value) {
        element.layout.sizeProportional.y = value;
    },
    "sizeProportional.z": function (name, element, value) {
        element.layout.sizeProportional.z = value;
    },
    "translation.x": function (name, element, value) {
        element.layout.translation.x = value;
    },
    "translation.y": function (name, element, value) {
        element.layout.translation.y = value;
    },
    "translation.z": function (name, element, value) {
        element.layout.translation.z = value;
    }
};
function _clone(obj) {
    var out = {};
    for (var key in obj) {
        out[key] = obj[key];
    }
    return out;
}
var LAYOUT_2D_VANITIES = _clone(LAYOUT_3D_VANITIES);
function styleSetter(prop) {
    return function (name, element, value) {
        element.attributes.style[prop] = value;
    };
}
var STYLE_VANITIES = {
    "style.alignContent": styleSetter("alignContent"),
    "style.alignItems": styleSetter("alignItems"),
    "style.alignmentBaseline": styleSetter("alignmentBaseline"),
    "style.alignSelf": styleSetter("alignSelf"),
    "style.all": styleSetter("all"),
    "style.animation": styleSetter("animation"),
    "style.animationDelay": styleSetter("animationDelay"),
    "style.animationDirection": styleSetter("animationDirection"),
    "style.animationDuration": styleSetter("animationDuration"),
    "style.animationFillMode": styleSetter("animationFillMode"),
    "style.animationIterationCount": styleSetter("animationIterationCount"),
    "style.animationName": styleSetter("animationName"),
    "style.animationPlayState": styleSetter("animationPlayState"),
    "style.animationTimingFunction": styleSetter("animationTimingFunction"),
    "style.appearance": styleSetter("appearance"),
    "style.azimuth": styleSetter("azimuth"),
    "style.backfaceVisibility": styleSetter("backfaceVisibility"),
    "style.background": styleSetter("background"),
    "style.backgroundAttachment": styleSetter("backgroundAttachment"),
    "style.backgroundBlendMode": styleSetter("backgroundBlendMode"),
    "style.backgroundClip": styleSetter("backgroundClip"),
    "style.backgroundColor": styleSetter("backgroundColor"),
    "style.backgroundimage": styleSetter("backgroundimage"),
    "style.backgroundorigin": styleSetter("backgroundorigin"),
    "style.backgroundposition": styleSetter("backgroundposition"),
    "style.backgroundRepeat": styleSetter("backgroundRepeat"),
    "style.backgroundSize": styleSetter("backgroundSize"),
    "style.baselineShift": styleSetter("baselineShift"),
    "style.bookmarkLabel": styleSetter("bookmarkLabel"),
    "style.bookmarkLevel": styleSetter("bookmarkLevel"),
    "style.bookmarkState": styleSetter("bookmarkState"),
    "style.border": styleSetter("border"),
    "style.borderBottom": styleSetter("borderBottom"),
    "style.borderBottomColor": styleSetter("borderBottomColor"),
    "style.borderBottomLeftRadius": styleSetter("borderBottomLeftRadius"),
    "style.borderBottomRightRadius": styleSetter("borderBottomRightRadius"),
    "style.borderBottomStyle": styleSetter("borderBottomStyle"),
    "style.borderBottomWidth": styleSetter("borderBottomWidth"),
    "style.borderBoundary": styleSetter("borderBoundary"),
    "style.borderCollapse": styleSetter("borderCollapse"),
    "style.borderColor": styleSetter("borderColor"),
    "style.borderImage": styleSetter("borderImage"),
    "style.borderImageOutset": styleSetter("borderImageOutset"),
    "style.borderImageRepeat": styleSetter("borderImageRepeat"),
    "style.borderImageSlice": styleSetter("borderImageSlice"),
    "style.borderImageSource": styleSetter("borderImageSource"),
    "style.borderImageWidth": styleSetter("borderImageWidth"),
    "style.borderLeft": styleSetter("borderLeft"),
    "style.borderLeftColor": styleSetter("borderLeftColor"),
    "style.borderLeftStyle": styleSetter("borderLeftStyle"),
    "style.borderLeftWidth": styleSetter("borderLeftWidth"),
    "style.borderRadius": styleSetter("borderRadius"),
    "style.borderRight": styleSetter("borderRight"),
    "style.borderRightColor": styleSetter("borderRightColor"),
    "style.borderRightStyle": styleSetter("borderRightStyle"),
    "style.borderRightWidth": styleSetter("borderRightWidth"),
    "style.borderSpacing": styleSetter("borderSpacing"),
    "style.borderStyle": styleSetter("borderStyle"),
    "style.borderTop": styleSetter("borderTop"),
    "style.borderTopColor": styleSetter("borderTopColor"),
    "style.borderTopLeftRadius": styleSetter("borderTopLeftRadius"),
    "style.borderTopRightRadius": styleSetter("borderTopRightRadius"),
    "style.borderTopStyle": styleSetter("borderTopStyle"),
    "style.borderTopWidth": styleSetter("borderTopWidth"),
    "style.borderWidth": styleSetter("borderWidth"),
    "style.bottom": styleSetter("bottom"),
    "style.boxDecorationBreak": styleSetter("boxDecorationBreak"),
    "style.boxShadow": styleSetter("boxShadow"),
    "style.boxSizing": styleSetter("boxSizing"),
    "style.boxSnap": styleSetter("boxSnap"),
    "style.boxSuppress": styleSetter("boxSuppress"),
    "style.breakAfter": styleSetter("breakAfter"),
    "style.breakBefore": styleSetter("breakBefore"),
    "style.breakInside": styleSetter("breakInside"),
    "style.captionSide": styleSetter("captionSide"),
    "style.caret": styleSetter("caret"),
    "style.caretAnimation": styleSetter("caretAnimation"),
    "style.caretColor": styleSetter("caretColor"),
    "style.caretShape": styleSetter("caretShape"),
    "style.chains": styleSetter("chains"),
    "style.clear": styleSetter("clear"),
    "style.clip": styleSetter("clip"),
    "style.clipPath": styleSetter("clipPath"),
    "style.clipRule": styleSetter("clipRule"),
    "style.color": styleSetter("color"),
    "style.colorAdjust": styleSetter("colorAdjust"),
    "style.colorInterpolation": styleSetter("colorInterpolation"),
    "style.colorInterpolationFilters": styleSetter("colorInterpolationFilters"),
    "style.colorProfile": styleSetter("colorProfile"),
    "style.colorRendering": styleSetter("colorRendering"),
    "style.columnCount": styleSetter("columnCount"),
    "style.columnFill": styleSetter("columnFill"),
    "style.columnGap": styleSetter("columnGap"),
    "style.columnRule": styleSetter("columnRule"),
    "style.columnRuleColor": styleSetter("columnRuleColor"),
    "style.columnRuleStyle": styleSetter("columnRuleStyle"),
    "style.columnRuleWidth": styleSetter("columnRuleWidth"),
    "style.columns": styleSetter("columns"),
    "style.columnSpan": styleSetter("columnSpan"),
    "style.columnWidth": styleSetter("columnWidth"),
    "style.content": styleSetter("content"),
    "style.continue": styleSetter("continue"),
    "style.counterIncrement": styleSetter("counterIncrement"),
    "style.counterReset": styleSetter("counterReset"),
    "style.counterSet": styleSetter("counterSet"),
    "style.cue": styleSetter("cue"),
    "style.cueAfter": styleSetter("cueAfter"),
    "style.cueBefore": styleSetter("cueBefore"),
    "style.cursor": styleSetter("cursor"),
    "style.direction": styleSetter("direction"),
    "style.display": styleSetter("display"),
    "style.dominantBaseline": styleSetter("dominantBaseline"),
    "style.elevation": styleSetter("elevation"),
    "style.emptyCells": styleSetter("emptyCells"),
    "style.enableBackground": styleSetter("enableBackground"),
    "style.fill": styleSetter("fill"),
    "style.fillOpacity": styleSetter("fillOpacity"),
    "style.fillRule": styleSetter("fillRule"),
    "style.filter": styleSetter("filter"),
    "style.flex": styleSetter("flex"),
    "style.flexBasis": styleSetter("flexBasis"),
    "style.flexDirection": styleSetter("flexDirection"),
    "style.flexFlow": styleSetter("flexFlow"),
    "style.flexGrow": styleSetter("flexGrow"),
    "style.flexShrink": styleSetter("flexShrink"),
    "style.flexWrap": styleSetter("flexWrap"),
    "style.float": styleSetter("float"),
    "style.floatDefer": styleSetter("floatDefer"),
    "style.floatOffset": styleSetter("floatOffset"),
    "style.floatReference": styleSetter("floatReference"),
    "style.floodColor": styleSetter("floodColor"),
    "style.floodOpacity": styleSetter("floodOpacity"),
    "style.flow": styleSetter("flow"),
    "style.flowFrom": styleSetter("flowFrom"),
    "style.flowInto": styleSetter("flowInto"),
    "style.font": styleSetter("font"),
    "style.fontFamily": styleSetter("fontFamily"),
    "style.fontFeatureSettings": styleSetter("fontFeatureSettings"),
    "style.fontKerning": styleSetter("fontKerning"),
    "style.fontLanguageOverride": styleSetter("fontLanguageOverride"),
    "style.fontSize": styleSetter("fontSize"),
    "style.fontSizeAdjust": styleSetter("fontSizeAdjust"),
    "style.fontStretch": styleSetter("fontStretch"),
    "style.fontStyle": styleSetter("fontStyle"),
    "style.fontSynthesis": styleSetter("fontSynthesis"),
    "style.fontVariant": styleSetter("fontVariant"),
    "style.fontVariantAlternates": styleSetter("fontVariantAlternates"),
    "style.fontVariantCaps": styleSetter("fontVariantCaps"),
    "style.fontVariantEastAsian": styleSetter("fontVariantEastAsian"),
    "style.fontVariantLigatures": styleSetter("fontVariantLigatures"),
    "style.fontVariantNumeric": styleSetter("fontVariantNumeric"),
    "style.fontVariantPosition": styleSetter("fontVariantPosition"),
    "style.fontWeight": styleSetter("fontWeight"),
    "style.footnoteDisplay": styleSetter("footnoteDisplay"),
    "style.footnotePolicy": styleSetter("footnotePolicy"),
    "style.glyphOrientationHorizontal": styleSetter("glyphOrientationHorizontal"),
    "style.glyphOrientationVertical": styleSetter("glyphOrientationVertical"),
    "style.grid": styleSetter("grid"),
    "style.gridArea": styleSetter("gridArea"),
    "style.gridAutoColumns": styleSetter("gridAutoColumns"),
    "style.gridAutoFlow": styleSetter("gridAutoFlow"),
    "style.gridAutoRows": styleSetter("gridAutoRows"),
    "style.gridColumn": styleSetter("gridColumn"),
    "style.gridColumnEnd": styleSetter("gridColumnEnd"),
    "style.gridColumnGap": styleSetter("gridColumnGap"),
    "style.gridColumnStart": styleSetter("gridColumnStart"),
    "style.gridGap": styleSetter("gridGap"),
    "style.gridRow": styleSetter("gridRow"),
    "style.gridRowEnd": styleSetter("gridRowEnd"),
    "style.gridRowGap": styleSetter("gridRowGap"),
    "style.gridRowStart": styleSetter("gridRowStart"),
    "style.gridTemplate": styleSetter("gridTemplate"),
    "style.gridTemplateAreas": styleSetter("gridTemplateAreas"),
    "style.gridTemplateColumns": styleSetter("gridTemplateColumns"),
    "style.gridTemplateRows": styleSetter("gridTemplateRows"),
    "style.hangingPunctuation": styleSetter("hangingPunctuation"),
    "style.height": styleSetter("height"),
    "style.hyphenateCharacter": styleSetter("hyphenateCharacter"),
    "style.hyphenateLimitChars": styleSetter("hyphenateLimitChars"),
    "style.hyphenateLimitLast": styleSetter("hyphenateLimitLast"),
    "style.hyphenateLimitLines": styleSetter("hyphenateLimitLines"),
    "style.hyphenateLimitZone": styleSetter("hyphenateLimitZone"),
    "style.hyphens": styleSetter("hyphens"),
    "style.imageOrientation": styleSetter("imageOrientation"),
    "style.imageRendering": styleSetter("imageRendering"),
    "style.imageResolution": styleSetter("imageResolution"),
    "style.initialLetter": styleSetter("initialLetter"),
    "style.initialLetterAlign": styleSetter("initialLetterAlign"),
    "style.initialLetterWrap": styleSetter("initialLetterWrap"),
    "style.isolation": styleSetter("isolation"),
    "style.justifyContent": styleSetter("justifyContent"),
    "style.justifyItems": styleSetter("justifyItems"),
    "style.justifySelf": styleSetter("justifySelf"),
    "style.kerning": styleSetter("kerning"),
    "style.left": styleSetter("left"),
    "style.letterSpacing": styleSetter("letterSpacing"),
    "style.lightingColor": styleSetter("lightingColor"),
    "style.lineBreak": styleSetter("lineBreak"),
    "style.lineGrid": styleSetter("lineGrid"),
    "style.lineHeight": styleSetter("lineHeight"),
    "style.lineSnap": styleSetter("lineSnap"),
    "style.listStyle": styleSetter("listStyle"),
    "style.listStyleImage": styleSetter("listStyleImage"),
    "style.listStylePosition": styleSetter("listStylePosition"),
    "style.listStyleType": styleSetter("listStyleType"),
    "style.margin": styleSetter("margin"),
    "style.marginBottom": styleSetter("marginBottom"),
    "style.marginLeft": styleSetter("marginLeft"),
    "style.marginRight": styleSetter("marginRight"),
    "style.marginTop": styleSetter("marginTop"),
    "style.marker": styleSetter("marker"),
    "style.markerEnd": styleSetter("markerEnd"),
    "style.markerKnockoutLeft": styleSetter("markerKnockoutLeft"),
    "style.markerKnockoutRight": styleSetter("markerKnockoutRight"),
    "style.markerMid": styleSetter("markerMid"),
    "style.markerPattern": styleSetter("markerPattern"),
    "style.markerSegment": styleSetter("markerSegment"),
    "style.markerSide": styleSetter("markerSide"),
    "style.markerStart": styleSetter("markerStart"),
    "style.marqueeDirection": styleSetter("marqueeDirection"),
    "style.marqueeLoop": styleSetter("marqueeLoop"),
    "style.marqueeSpeed": styleSetter("marqueeSpeed"),
    "style.marqueeStyle": styleSetter("marqueeStyle"),
    "style.mask": styleSetter("mask"),
    "style.maskBorder": styleSetter("maskBorder"),
    "style.maskBorderMode": styleSetter("maskBorderMode"),
    "style.maskBorderOutset": styleSetter("maskBorderOutset"),
    "style.maskBorderRepeat": styleSetter("maskBorderRepeat"),
    "style.maskBorderSlice": styleSetter("maskBorderSlice"),
    "style.maskBorderSource": styleSetter("maskBorderSource"),
    "style.maskBorderWidth": styleSetter("maskBorderWidth"),
    "style.maskClip": styleSetter("maskClip"),
    "style.maskComposite": styleSetter("maskComposite"),
    "style.maskImage": styleSetter("maskImage"),
    "style.maskMode": styleSetter("maskMode"),
    "style.maskOrigin": styleSetter("maskOrigin"),
    "style.maskPosition": styleSetter("maskPosition"),
    "style.maskRepeat": styleSetter("maskRepeat"),
    "style.maskSize": styleSetter("maskSize"),
    "style.maskType": styleSetter("maskType"),
    "style.maxHeight": styleSetter("maxHeight"),
    "style.maxLines": styleSetter("maxLines"),
    "style.maxWidth": styleSetter("maxWidth"),
    "style.minHeight": styleSetter("minHeight"),
    "style.minWidth": styleSetter("minWidth"),
    "style.mixBlendMode": styleSetter("mixBlendMode"),
    "style.motion": styleSetter("motion"),
    "style.motionOffset": styleSetter("motionOffset"),
    "style.motionPath": styleSetter("motionPath"),
    "style.motionRotation": styleSetter("motionRotation"),
    "style.navDown": styleSetter("navDown"),
    "style.navLeft": styleSetter("navLeft"),
    "style.navRight": styleSetter("navRight"),
    "style.navUp": styleSetter("navUp"),
    "style.objectFit": styleSetter("objectFit"),
    "style.objectPosition": styleSetter("objectPosition"),
    "style.offset": styleSetter("offset"),
    "style.offsetAfter": styleSetter("offsetAfter"),
    "style.offsetAnchor": styleSetter("offsetAnchor"),
    "style.offsetBefore": styleSetter("offsetBefore"),
    "style.offsetDistance": styleSetter("offsetDistance"),
    "style.offsetEnd": styleSetter("offsetEnd"),
    "style.offsetPath": styleSetter("offsetPath"),
    "style.offsetPosition": styleSetter("offsetPosition"),
    "style.offsetRotate": styleSetter("offsetRotate"),
    "style.offsetStart": styleSetter("offsetStart"),
    "style.opacity": styleSetter("opacity"),
    "style.order": styleSetter("order"),
    "style.orphans": styleSetter("orphans"),
    "style.outline": styleSetter("outline"),
    "style.outlineColor": styleSetter("outlineColor"),
    "style.outlineOffset": styleSetter("outlineOffset"),
    "style.outlineStyle": styleSetter("outlineStyle"),
    "style.outlineWidth": styleSetter("outlineWidth"),
    "style.overflow": styleSetter("overflow"),
    "style.overflowStyle": styleSetter("overflowStyle"),
    "style.overflowWrap": styleSetter("overflowWrap"),
    "style.overflowX": styleSetter("overflowX"),
    "style.overflowY": styleSetter("overflowY"),
    "style.padding": styleSetter("padding"),
    "style.paddingBottom": styleSetter("paddingBottom"),
    "style.paddingLeft": styleSetter("paddingLeft"),
    "style.paddingRight": styleSetter("paddingRight"),
    "style.paddingTop": styleSetter("paddingTop"),
    "style.page": styleSetter("page"),
    "style.pageBreakAfter": styleSetter("pageBreakAfter"),
    "style.pageBreakBefore": styleSetter("pageBreakBefore"),
    "style.pageBreakInside": styleSetter("pageBreakInside"),
    "style.pause": styleSetter("pause"),
    "style.pauseAfter": styleSetter("pauseAfter"),
    "style.pauseBefore": styleSetter("pauseBefore"),
    "style.perspective": styleSetter("perspective"),
    "style.perspectiveOrigin": styleSetter("perspectiveOrigin"),
    "style.pitch": styleSetter("pitch"),
    "style.pitchRange": styleSetter("pitchRange"),
    "style.placeContent": styleSetter("placeContent"),
    "style.placeItems": styleSetter("placeItems"),
    "style.placeSelf": styleSetter("placeSelf"),
    "style.playDuring": styleSetter("playDuring"),
    "style.pointerEvents": styleSetter("pointerEvents"),
    "style.polarAnchor": styleSetter("polarAnchor"),
    "style.polarAngle": styleSetter("polarAngle"),
    "style.polarDistance": styleSetter("polarDistance"),
    "style.polarOrigin": styleSetter("polarOrigin"),
    "style.position": styleSetter("position"),
    "style.presentationLevel": styleSetter("presentationLevel"),
    "style.quotes": styleSetter("quotes"),
    "style.regionFragment": styleSetter("regionFragment"),
    "style.resize": styleSetter("resize"),
    "style.rest": styleSetter("rest"),
    "style.restAfter": styleSetter("restAfter"),
    "style.restBefore": styleSetter("restBefore"),
    "style.richness": styleSetter("richness"),
    "style.right": styleSetter("right"),
    "style.rotation": styleSetter("rotation"),
    "style.rotationPoint": styleSetter("rotationPoint"),
    "style.rubyAlign": styleSetter("rubyAlign"),
    "style.rubyMerge": styleSetter("rubyMerge"),
    "style.rubyPosition": styleSetter("rubyPosition"),
    "style.running": styleSetter("running"),
    "style.scrollBehavior": styleSetter("scrollBehavior"),
    "style.scrollPadding": styleSetter("scrollPadding"),
    "style.scrollPaddingBlock": styleSetter("scrollPaddingBlock"),
    "style.scrollPaddingBlockEnd": styleSetter("scrollPaddingBlockEnd"),
    "style.scrollPaddingBlockStart": styleSetter("scrollPaddingBlockStart"),
    "style.scrollPaddingBottom": styleSetter("scrollPaddingBottom"),
    "style.scrollPaddingInline": styleSetter("scrollPaddingInline"),
    "style.scrollPaddingInlineEnd": styleSetter("scrollPaddingInlineEnd"),
    "style.scrollPaddingInlineStart": styleSetter("scrollPaddingInlineStart"),
    "style.scrollPaddingLeft": styleSetter("scrollPaddingLeft"),
    "style.scrollPaddingRight": styleSetter("scrollPaddingRight"),
    "style.scrollPaddingTop": styleSetter("scrollPaddingTop"),
    "style.scrollSnapAlign": styleSetter("scrollSnapAlign"),
    "style.scrollSnapMargin": styleSetter("scrollSnapMargin"),
    "style.scrollSnapMarginBlock": styleSetter("scrollSnapMarginBlock"),
    "style.scrollSnapMarginBlockEnd": styleSetter("scrollSnapMarginBlockEnd"),
    "style.scrollSnapMarginBlockStart": styleSetter("scrollSnapMarginBlockStart"),
    "style.scrollSnapMarginBottom": styleSetter("scrollSnapMarginBottom"),
    "style.scrollSnapMarginInline": styleSetter("scrollSnapMarginInline"),
    "style.scrollSnapMarginInlineEnd": styleSetter("scrollSnapMarginInlineEnd"),
    "style.scrollSnapMarginInlineStart": styleSetter("scrollSnapMarginInlineStart"),
    "style.scrollSnapMarginLeft": styleSetter("scrollSnapMarginLeft"),
    "style.scrollSnapMarginRight": styleSetter("scrollSnapMarginRight"),
    "style.scrollSnapMarginTop": styleSetter("scrollSnapMarginTop"),
    "style.scrollSnapStop": styleSetter("scrollSnapStop"),
    "style.scrollSnapType": styleSetter("scrollSnapType"),
    "style.shapeImageThreshold": styleSetter("shapeImageThreshold"),
    "style.shapeInside": styleSetter("shapeInside"),
    "style.shapeMargin": styleSetter("shapeMargin"),
    "style.shapeOutside": styleSetter("shapeOutside"),
    "style.shapeRendering": styleSetter("shapeRendering"),
    "style.size": styleSetter("size"),
    "style.speak": styleSetter("speak"),
    "style.speakAs": styleSetter("speakAs"),
    "style.speakHeader": styleSetter("speakHeader"),
    "style.speakNumeral": styleSetter("speakNumeral"),
    "style.speakPunctuation": styleSetter("speakPunctuation"),
    "style.speechRate": styleSetter("speechRate"),
    "style.stopColor": styleSetter("stopColor"),
    "style.stopOpacity": styleSetter("stopOpacity"),
    "style.stress": styleSetter("stress"),
    "style.stringSet": styleSetter("stringSet"),
    "style.stroke": styleSetter("stroke"),
    "style.strokeAlignment": styleSetter("strokeAlignment"),
    "style.strokeDashadjust": styleSetter("strokeDashadjust"),
    "style.strokeDasharray": styleSetter("strokeDasharray"),
    "style.strokeDashcorner": styleSetter("strokeDashcorner"),
    "style.strokeDashoffset": styleSetter("strokeDashoffset"),
    "style.strokeLinecap": styleSetter("strokeLinecap"),
    "style.strokeLinejoin": styleSetter("strokeLinejoin"),
    "style.strokeMiterlimit": styleSetter("strokeMiterlimit"),
    "style.strokeOpacity": styleSetter("strokeOpacity"),
    "style.strokeWidth": styleSetter("strokeWidth"),
    "style.tableLayout": styleSetter("tableLayout"),
    "style.tabSize": styleSetter("tabSize"),
    "style.textAlign": styleSetter("textAlign"),
    "style.textAlignAll": styleSetter("textAlignAll"),
    "style.textAlignLast": styleSetter("textAlignLast"),
    "style.textAnchor": styleSetter("textAnchor"),
    "style.textCombineUpright": styleSetter("textCombineUpright"),
    "style.textDecoration": styleSetter("textDecoration"),
    "style.textDecorationColor": styleSetter("textDecorationColor"),
    "style.textDecorationLine": styleSetter("textDecorationLine"),
    "style.textDecorationSkip": styleSetter("textDecorationSkip"),
    "style.textDecorationStyle": styleSetter("textDecorationStyle"),
    "style.textEmphasis": styleSetter("textEmphasis"),
    "style.textEmphasisColor": styleSetter("textEmphasisColor"),
    "style.textEmphasisPosition": styleSetter("textEmphasisPosition"),
    "style.textEmphasisStyle": styleSetter("textEmphasisStyle"),
    "style.textIndent": styleSetter("textIndent"),
    "style.textJustify": styleSetter("textJustify"),
    "style.textOrientation": styleSetter("textOrientation"),
    "style.textOverflow": styleSetter("textOverflow"),
    "style.textRendering": styleSetter("textRendering"),
    "style.textShadow": styleSetter("textShadow"),
    "style.textSpaceCollapse": styleSetter("textSpaceCollapse"),
    "style.textSpaceTrim": styleSetter("textSpaceTrim"),
    "style.textSpacing": styleSetter("textSpacing"),
    "style.textTransform": styleSetter("textTransform"),
    "style.textUnderlinePosition": styleSetter("textUnderlinePosition"),
    "style.textWrap": styleSetter("textWrap"),
    "style.top": styleSetter("top"),
    "style.transform": styleSetter("transform"),
    "style.transformBox": styleSetter("transformBox"),
    "style.transformOrigin": styleSetter("transformOrigin"),
    "style.transformStyle": styleSetter("transformStyle"),
    "style.transition": styleSetter("transition"),
    "style.transitionDelay": styleSetter("transitionDelay"),
    "style.transitionDuration": styleSetter("transitionDuration"),
    "style.transitionProperty": styleSetter("transitionProperty"),
    "style.transitionTimingFunction": styleSetter("transitionTimingFunction"),
    "style.unicodeBidi": styleSetter("unicodeBidi"),
    "style.userSelect": styleSetter("userSelect"),
    "style.verticalAlign": styleSetter("verticalAlign"),
    "style.visibility": styleSetter("visibility"),
    "style.voiceBalance": styleSetter("voiceBalance"),
    "style.voiceDuration": styleSetter("voiceDuration"),
    "style.voiceFamily": styleSetter("voiceFamily"),
    "style.voicePitch": styleSetter("voicePitch"),
    "style.voiceRange": styleSetter("voiceRange"),
    "style.voiceRate": styleSetter("voiceRate"),
    "style.voiceStress": styleSetter("voiceStress"),
    "style.voiceVolume": styleSetter("voiceVolume"),
    "style.volume": styleSetter("volume"),
    "style.whiteSpace": styleSetter("whiteSpace"),
    "style.widows": styleSetter("widows"),
    "style.width": styleSetter("width"),
    "style.willChange": styleSetter("willChange"),
    "style.wordBreak": styleSetter("wordBreak"),
    "style.wordSpacing": styleSetter("wordSpacing"),
    "style.wordWrap": styleSetter("wordWrap"),
    "style.wrapAfter": styleSetter("wrapAfter"),
    "style.wrapBefore": styleSetter("wrapBefore"),
    "style.wrapFlow": styleSetter("wrapFlow"),
    "style.wrapInside": styleSetter("wrapInside"),
    "style.wrapThrough": styleSetter("wrapThrough"),
    "style.writingMode": styleSetter("writingMode"),
    "style.zIndex": styleSetter("zIndex"),
    "style.WebkitTapHighlightColor": function (name, element, value) {
        element.attributes.style.webkitTapHighlightColor = value;
    }
};
var TEXT_CONTENT_VANITIES = {
    content: function (name, element, value) {
        element.children = [value + ""];
    }
};
function attributeSetter(prop) {
    return function (name, element, value) {
        element.attributes[prop] = value;
    };
}
var PRESENTATION_VANITIES = {
    alignmentBaseline: attributeSetter("alignmentBaseline"),
    baselineShift: attributeSetter("baselineShift"),
    clipPath: attributeSetter("clipPath"),
    clipRule: attributeSetter("clipRule"),
    clip: attributeSetter("clip"),
    colorInterpolationFilters: attributeSetter("colorInterpolationFilters"),
    colorInterpolation: attributeSetter("colorInterpolation"),
    colorProfile: attributeSetter("colorProfile"),
    colorRendering: attributeSetter("colorRendering"),
    color: attributeSetter("color"),
    cursor: attributeSetter("cursor"),
    direction: attributeSetter("direction"),
    display: attributeSetter("display"),
    dominantBaseline: attributeSetter("dominantBaseline"),
    enableBackground: attributeSetter("enableBackground"),
    fillOpacity: attributeSetter("fillOpacity"),
    fillRule: attributeSetter("fillRule"),
    fill: attributeSetter("fill"),
    filter: attributeSetter("filter"),
    floodColor: attributeSetter("floodColor"),
    floodOpacity: attributeSetter("floodOpacity"),
    fontFamily: attributeSetter("fontFamily"),
    fontSizeAdjust: attributeSetter("fontSizeAdjust"),
    fontSize: attributeSetter("fontSize"),
    fontStretch: attributeSetter("fontStretch"),
    fontStyle: attributeSetter("fontStyle"),
    fontVariant: attributeSetter("fontVariant"),
    fontWeight: attributeSetter("fontWeight"),
    glyphOrientationHorizontal: attributeSetter("glyphOrientationHorizontal"),
    glyphOrientationVertical: attributeSetter("glyphOrientationVertical"),
    imageRendering: attributeSetter("imageRendering"),
    kerning: attributeSetter("kerning"),
    letterSpacing: attributeSetter("letterSpacing"),
    lightingColor: attributeSetter("lightingColor"),
    markerEnd: attributeSetter("markerEnd"),
    markerMid: attributeSetter("markerMid"),
    markerStart: attributeSetter("markerStart"),
    mask: attributeSetter("mask"),
    opacity: function (name, element, value) {
        element.layout.opacity = value;
    },
    overflow: attributeSetter("overflow"),
    pointerEvents: attributeSetter("pointerEvents"),
    shapeRendering: attributeSetter("shapeRendering"),
    stopColor: attributeSetter("stopColor"),
    stopOpacity: attributeSetter("stopOpacity"),
    strokeDasharray: attributeSetter("strokeDasharray"),
    strokeDashoffset: attributeSetter("strokeDashoffset"),
    strokeLinecap: attributeSetter("strokeLinecap"),
    strokeLinejoin: attributeSetter("strokeLinejoin"),
    strokeMiterlimit: attributeSetter("strokeMiterlimit"),
    strokeOpacity: attributeSetter("strokeOpacity"),
    strokeWidth: attributeSetter("strokeWidth"),
    stroke: attributeSetter("stroke"),
    textAnchor: attributeSetter("textAnchor"),
    textDecoration: attributeSetter("textDecoration"),
    textRendering: attributeSetter("textRendering"),
    unicodeBidi: attributeSetter("unicodeBidi"),
    visibility: attributeSetter("visibility"),
    wordSpacing: attributeSetter("wordSpacing"),
    writingMode: attributeSetter("writingMode")
};
var FILTER_VANITIES = {
    x: attributeSetter("x"),
    y: attributeSetter("y"),
    width: attributeSetter("width"),
    height: attributeSetter("height"),
    filterRes: attributeSetter("filterRes"),
    filterUnits: attributeSetter("filterUnits"),
    primitiveUnits: attributeSetter("primitiveUnits")
};
var HTML_STYLE_SHORTHAND_VANITIES = {
    backgroundColor: function (name, element, value) {
        element.attributes.style.backgroundColor = value;
    },
    zIndex: function (name, element, value) {
        element.attributes.style.zIndex = value;
    }
};
var CONTROL_FLOW_VANITIES = {
    "controlFlow.placeholder": function (name, element, value, context, component) {
        if (value === null || value === undefined)
            return void 0;
        if (typeof value !== "number") {
            throw new Error("controlFlow.placeholder expects null or number");
        }
        if (!context.config.children)
            return void 0;
        var children = Array.isArray(context.config.children)
            ? context.config.children
            : [context.config.children];
        component._markElementAnticipatedSurrogates(element, children);
        var surrogate = children[value];
        if (surrogate === null || surrogate === undefined)
            return void 0;
        element.children = [];
        if (context.config.vanities["controlFlow.placeholder"]) {
            context.config.vanities["controlFlow.placeholder"](element, surrogate, value, context, component);
        }
        else {
            controlFlowPlaceholderImpl(element, surrogate, value, context, component);
        }
    }
};
function controlFlowPlaceholderImpl(element, surrogate, value, context, component) {
    if (!component._didElementRenderSurrogate(element, surrogate)) {
        element.elementName = surrogate.elementName;
        element.children = surrogate.children || [];
        if (surrogate.attributes) {
            if (!element.attributes)
                element.attributes = {};
            for (var key in surrogate.attributes) {
                if (key === "haiku-id")
                    continue;
                element.attributes[key] = surrogate.attributes[key];
            }
        }
        component._markElementSurrogateAsRendered(element, surrogate);
    }
}
exports["default"] = {
    "missing-glyph": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "a": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES, STYLE_VANITIES),
    "abbr": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "acronym": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "address": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "altGlyph": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "altGlyphDef": has_1["default"](),
    "altGlyphItem": has_1["default"](),
    "animate": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "animateColor": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "animateMotion": has_1["default"](),
    "animateTransform": has_1["default"](),
    "applet": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "area": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "article": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "aside": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "audio": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "b": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "base": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "basefont": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "bdi": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "bdo": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "big": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "blockquote": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "body": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "br": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "button": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "canvas": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "caption": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "center": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "circle": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "cite": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "clipPath": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "code": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "col": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "colgroup": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "color-profile": has_1["default"](),
    "command": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "cursor": has_1["default"](),
    "datalist": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "dd": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "defs": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "del": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "desc": has_1["default"](),
    "details": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "dfn": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "dir": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "discard": has_1["default"](),
    "div": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "dl": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "dt": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "ellipse": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "em": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "embed": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "feBlend": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feColorMatrix": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feComponentTransfer": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feComposite": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feConvolveMatrix": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feDiffuseLighting": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feDisplacementMap": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feDistantLight": has_1["default"](),
    "feDropShadow": has_1["default"](),
    "feFlood": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feFuncA": has_1["default"](),
    "feFuncB": has_1["default"](),
    "feFuncG": has_1["default"](),
    "feFuncR": has_1["default"](),
    "feGaussianBlur": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feImage": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feMerge": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feMergeNode": has_1["default"](),
    "feMorphology": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feOffset": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "fePointLight": has_1["default"](),
    "feSpecularLighting": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feTile": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "feTurbulence": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "fieldset": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "figcaption": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "figure": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "filter": has_1["default"](LAYOUT_3D_VANITIES, FILTER_VANITIES),
    "font-face": has_1["default"](),
    "font-face-format": has_1["default"](),
    "font-face-name": has_1["default"](),
    "font-face-src": has_1["default"](),
    "font-face-uri": has_1["default"](),
    "font": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES, STYLE_VANITIES),
    "footer": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "foreignObject": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "form": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "frame": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "frameset": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "g": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "glyph": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "glyphRef": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "h1": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "h2": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "h3": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "h4": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "h5": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "h6": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "hatch": has_1["default"](),
    "hatchpath": has_1["default"](),
    "head": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "header": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "hgroup": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "hkern": has_1["default"](),
    "hr": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "html": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "i": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "iframe": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "image": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "img": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "input": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "ins": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "kbd": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "keygen": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "label": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "legend": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "li": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "line": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "linearGradient": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "link": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "map": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "mark": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "marker": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "mask": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "menu": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "mesh": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
    "meshgradient": has_1["default"](),
    "meshpatch": has_1["default"](),
    "meshrow": has_1["default"](),
    "meta": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "metadata": has_1["default"](),
    "meter": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "mpath": has_1["default"](),
    "nav": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "noframes": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "noscript": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "object": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "ol": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "optgroup": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "option": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "output": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "p": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "param": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "path": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "pattern": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "polygon": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "polyline": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "pre": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "progress": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "q": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "radialGradient": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "rect": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "rp": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "rt": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "ruby": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "s": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "samp": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "script": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "section": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "select": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "set": has_1["default"](),
    "small": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "solidcolor": has_1["default"](),
    "source": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "span": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "stop": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "strike": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "strong": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "style": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "sub": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "summary": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "sup": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "svg": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES, STYLE_VANITIES, HTML_STYLE_SHORTHAND_VANITIES),
    "switch": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "symbol": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "table": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "tbody": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "td": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "text": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "textarea": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "textPath": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "tfoot": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "th": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "thead": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "time": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "title": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "tr": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "track": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "tref": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "tspan": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES, PRESENTATION_VANITIES),
    "tt": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "u": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, TEXT_CONTENT_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "ul": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "unknown": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
    "us": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, PRESENTATION_VANITIES),
    "use": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_2D_VANITIES),
    "var": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "video": has_1["default"](HTML_STYLE_SHORTHAND_VANITIES, CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES),
    "view": has_1["default"](),
    "vkern": has_1["default"](),
    "wb": has_1["default"](CONTROL_FLOW_VANITIES, LAYOUT_3D_VANITIES, STYLE_VANITIES)
};

},{"./../../Layout3D":9,"./has":47}],51:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var functionToRFO_1 = _dereq_("./functionToRFO");
function enhance(fn, params) {
    if (!fn.specification) {
        var rfo = functionToRFO_1["default"](fn);
        if (rfo && rfo.__function) {
            fn.specification = rfo.__function;
            if (params) {
                fn.specification.params = params;
            }
        }
        else {
            fn.specification = true;
        }
    }
}
exports["default"] = enhance;

},{"./functionToRFO":52}],52:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var REGEXPS = [
    { type: "whitespace", re: /^[\s]+/ },
    { type: "paren_open", re: /^\(/ },
    { type: "paren_close", re: /^\)/ },
    { type: "square_open", re: /^\[/ },
    { type: "square_close", re: /^]/ },
    { type: "curly_open", re: /^\{/ },
    { type: "curly_close", re: /^\}/ },
    { type: "rest", re: /^\.\.\./ },
    { type: "colon", re: /^:/ },
    { type: "comma", re: /^,/ },
    { type: "identifier", re: /^[a-zA-Z0-9_$]+/ },
];
function nth(n, type, arr) {
    var none = { value: null, type: "void" };
    if (arr.length < 1)
        return none;
    if (n > arr.length)
        return none;
    var f = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === type) {
            f += 1;
        }
        if (f === n) {
            return arr[i];
        }
    }
    return none;
}
function tokenize(source) {
    var tokens = [];
    var chunk = source;
    var total = chunk.length;
    var iterations = 0;
    while (chunk.length > 0) {
        for (var i = 0; i < REGEXPS.length; i++) {
            var regexp = REGEXPS[i];
            var match = regexp.re.exec(chunk);
            if (match) {
                var value = match[0];
                tokens.push({ type: regexp.type, value: value });
                chunk = chunk.slice(match[0].length, chunk.length);
                break;
            }
        }
        if (iterations++ > total) {
            throw new Error("Unable to tokenize expression");
        }
    }
    return tokens;
}
function tokensToParams(tokens) {
    if (tokens.length < 1)
        return [];
    var json = "";
    var frag = "";
    var next;
    var token = tokens.shift();
    var scopes = [];
    while (token) {
        switch (token.type) {
            case "whitespace":
                frag = " ";
                break;
            case "comma":
                frag = ",";
                break;
            case "colon":
                frag = ":";
                break;
            case "paren_open":
                frag = "[";
                scopes.push("square");
                break;
            case "paren_close":
                frag = "]";
                scopes.pop();
                break;
            case "square_open":
                frag = "[";
                scopes.push("square");
                break;
            case "square_close":
                frag = "]";
                scopes.pop();
                break;
            case "curly_open":
                frag = "{";
                scopes.push("curly");
                break;
            case "curly_close":
                frag = "}";
                scopes.pop();
                break;
            case "rest":
                next = tokens.shift();
                frag = JSON.stringify({ __rest: next.value });
                break;
            case "identifier":
                frag = '"' + token.value + '"';
                if (tokens[0] &&
                    (tokens[0].type === "comma" ||
                        tokens[0].type === "square_close" ||
                        tokens[0].type === "curly_close")) {
                    var scope = scopes[scopes.length - 1];
                    if (scope === "square") {
                        frag += "";
                    }
                    else {
                        frag += ':"' + token.value + '"';
                    }
                }
                break;
            default:
                frag = "";
        }
        json += frag;
        token = tokens.shift();
    }
    return JSON.parse(json);
}
function signatureToParams(signature) {
    var tokens = tokenize(signature);
    var clean = [];
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== "whitespace") {
            clean.push(tokens[i]);
        }
    }
    return tokensToParams(clean);
}
function functionToRFO(fn) {
    var str = fn.toString();
    if (str[str.length - 1] === ")") {
        if (str[0] === "(") {
            str = str.slice(1);
        }
    }
    var pidx1 = str.indexOf("(");
    var pidx2 = str.indexOf(")");
    var prefix = str.slice(0, pidx1);
    var signature = str.slice(pidx1, pidx2 + 1);
    var suffix = str.slice(pidx2 + 1, str.length);
    var body = suffix.slice(suffix.indexOf("{") + 1, suffix.length - 1).trim();
    var type = suffix.match(/^\s*=>\s*{/)
        ? "ArrowFunctionExpression"
        : "FunctionExpression";
    var name = nth(2, "identifier", tokenize(prefix)).value;
    var params = signatureToParams(signature);
    var spec = {
        type: type,
        name: name,
        params: params,
        body: body
    };
    return {
        __function: spec
    };
}
exports["default"] = functionToRFO;

},{}],53:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var enhance_1 = _dereq_("./enhance");
function inject() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var fn = args.shift();
    if (typeof fn !== "function") {
        console.warn("[haiku player] Inject expects a function as the first argument");
        return fn;
    }
    if (args.length > 0) {
        enhance_1["default"](fn, args);
    }
    else {
        enhance_1["default"](fn, null);
    }
    fn.injectee = true;
    return fn;
}
exports["default"] = inject;

},{"./enhance":51}],54:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports["default"] = {
    mouse: {
        click: {
            menuable: true,
            human: "Click"
        },
        dblclick: {
            menuable: true,
            human: "Double Click"
        },
        mousedown: {
            menuable: true,
            human: "Mouse Down"
        },
        mouseup: {
            menuable: true,
            human: "Mouse Up"
        },
        mousemove: {
            menuable: true,
            human: "Mouse Move"
        },
        mouseover: {
            menuable: true,
            human: "Mouse Over"
        },
        mouseout: {
            menuable: true,
            human: "Mouse Out"
        },
        wheel: {
            menuable: false
        },
        scroll: {
            menuable: true,
            human: "Scroll"
        }
    },
    keyboard: {
        keyup: {
            menuable: true,
            human: "Key Up"
        },
        keydown: {
            menuable: true,
            human: "Key Down"
        },
        keypress: {
            menuable: false
        }
    },
    drag: {
        drag: {
            menuable: false
        },
        dragend: {
            menuable: false
        },
        dragenter: {
            menuable: false
        },
        dragleave: {
            menuable: false
        },
        dragover: {
            menuable: false
        },
        dragstart: {
            menuable: false
        },
        drop: {
            menuable: false
        }
    },
    form: {
        focus: {
            menuable: true,
            human: "Focus"
        },
        blur: {
            menuable: true,
            human: "Blur"
        },
        change: {
            menuable: true,
            human: "Change"
        },
        select: {
            menuable: true,
            human: "Select"
        },
        submit: {
            menuable: true,
            human: "Submit"
        },
        contextmenu: {
            menuable: false
        },
        input: {
            menuable: false
        },
        invalid: {
            menuable: false
        },
        reset: {
            menuable: false
        },
        search: {
            menuable: false
        }
    },
    text: {
        cut: {
            menuable: false
        },
        copy: {
            menuable: false
        },
        paste: {
            menuable: false
        }
    },
    window: {
        resize: {
            menuable: true,
            human: "Window Resize"
        },
        popstate: {
            menuable: true,
            human: "URL Change"
        },
        hashchange: {
            menuable: true,
            human: "Anchor Change"
        },
        load: {
            menuable: false
        },
        message: {
            menuable: false
        },
        afterprint: {
            menuable: false
        },
        beforeprint: {
            menuable: false
        },
        beforeunload: {
            menuable: false
        },
        error: {
            menuable: false
        },
        offline: {
            menuable: false
        },
        online: {
            menuable: false
        },
        pagehide: {
            menuable: false
        },
        pageshow: {
            menuable: false
        },
        storage: {
            menuable: false
        },
        unload: {
            menuable: false
        }
    },
    media: {
        abort: {
            menuable: false
        },
        canplay: {
            menuable: false
        },
        canplaythrough: {
            menuable: false
        },
        cuechange: {
            menuable: false
        },
        durationchange: {
            menuable: false
        },
        emptied: {
            menuable: false
        },
        ended: {
            menuable: false
        },
        error: {
            menuable: false
        },
        loadeddata: {
            menuable: false
        },
        loadedmetadata: {
            menuable: false
        },
        loadstart: {
            menuable: false
        },
        pause: {
            menuable: false
        },
        play: {
            menuable: false
        },
        playing: {
            menuable: false
        },
        progress: {
            menuable: false
        },
        ratechange: {
            menuable: false
        },
        seeked: {
            menuable: false
        },
        seeking: {
            menuable: false
        },
        stalled: {
            menuable: false
        },
        suspend: {
            menuable: false
        },
        timeupdate: {
            menuable: false
        },
        volumechange: {
            menuable: false
        },
        waiting: {
            menuable: false
        }
    },
    other: {
        show: {
            menuable: false
        },
        toggle: {
            menuable: false
        }
    }
};

},{}],55:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var createMixpanel_1 = _dereq_("./createMixpanel");
var createRightClickMenu_1 = _dereq_("./createRightClickMenu");
var getElementSize_1 = _dereq_("./getElementSize");
var getLocalDomEventPosition_1 = _dereq_("./getLocalDomEventPosition");
var patch_1 = _dereq_("./patch");
var render_1 = _dereq_("./render");
function HaikuDOMRenderer() {
    this._user = {
        mouse: {
            x: 0,
            y: 0,
            down: 0,
            buttons: [0, 0, 0]
        },
        keys: {},
        touches: [],
        mouches: []
    };
}
exports["default"] = HaikuDOMRenderer;
HaikuDOMRenderer.prototype.render = function renderWrap(domElement, virtualContainer, virtualTree, component) {
    return render_1["default"](domElement, virtualContainer, virtualTree, component);
};
HaikuDOMRenderer.prototype.patch = function patchWrap(domElement, virtualContainer, patchesDict, component) {
    return patch_1["default"](domElement, virtualContainer, patchesDict, component);
};
HaikuDOMRenderer.prototype.menuize = function menuize(domElement, component) {
    return createRightClickMenu_1["default"](domElement, component);
};
HaikuDOMRenderer.prototype.mixpanel = function mixpanel(domElement, mixpanelToken, component) {
    return createMixpanel_1["default"](domElement, mixpanelToken, component);
};
HaikuDOMRenderer.prototype.createContainer = function createContainer(domElement) {
    return {
        isContainer: true,
        layout: {
            computed: {
                size: getElementSize_1["default"](domElement)
            }
        }
    };
};
HaikuDOMRenderer.prototype.initialize = function initialize(domElement) {
    var user = this._user;
    function setMouse(mouseEvent) {
        var pos = getLocalDomEventPosition_1["default"](mouseEvent, domElement);
        user.mouse.x = pos.x;
        user.mouse.y = pos.y;
    }
    function setTouches(touchEvent) {
        user.touches.splice(0);
        for (var i = 0; i < touchEvent.touches.length; i++) {
            var touch = touchEvent.touches[i];
            var pos = getLocalDomEventPosition_1["default"](touch, domElement);
            user.touches.push(pos);
        }
    }
    function setMouches() {
        user.mouches.splice(0);
        if (user.mouse.down) {
            user.mouches.push(user.mouse);
        }
        user.mouches.push.apply(user.mouches, user.touches);
    }
    function clearKey() {
        for (var which in user.keys)
            user.keys[which] = 0;
    }
    function clearMouse() {
        user.mouse.down = 0;
        user.touches.splice(0);
        for (var i = 0; i < user.mouse.buttons.length; i++) {
            user.mouse.buttons[i] = 0;
        }
    }
    function clearMouch() {
        user.mouches.splice(0);
    }
    function clearTouch() {
        user.touches.splice(0);
    }
    domElement.addEventListener("mousedown", function _mousedownandler(mouseEvent) {
        ++user.mouse.down;
        ++user.mouse.buttons[mouseEvent.button];
        setMouse(mouseEvent);
        setMouches();
    });
    domElement.addEventListener("mouseup", function _mouseupHandler(mouseEvent) {
        clearMouse();
        clearMouch();
        setMouches();
    });
    domElement.addEventListener("mousemove", function _mousemoveHandler(mouseEvent) {
        setMouse(mouseEvent);
        setMouches();
    });
    domElement.addEventListener("mouseenter", function _mouseenterHandler(mouseEvent) {
        clearMouse();
        clearMouch();
    });
    domElement.addEventListener("mouseleave", function _mouseenterHandler(mouseEvent) {
        clearMouse();
        clearMouch();
    });
    domElement.addEventListener("wheel", function _wheelHandler(mouseEvent) {
        setMouse(mouseEvent);
        setMouches();
    });
    var doc = domElement.ownerDocument;
    var win = doc.defaultView || doc.parentWindow;
    doc.addEventListener("keydown", function _keydownHandler(keyEvent) {
        if (user.keys[keyEvent.which] === undefined)
            user.keys[keyEvent.which] = 0;
        ++user.keys[keyEvent.which];
    });
    doc.addEventListener("keyup", function _keyupHandler(keyEvent) {
        if (user.keys[keyEvent.which] === undefined)
            user.keys[keyEvent.which] = 0;
        if (keyEvent.which === 91 || keyEvent.which === 17) {
            clearKey();
        }
        user.keys[keyEvent.which] = 0;
    });
    win.addEventListener("blur", function _blurHandlers(blurEvent) {
        clearKey();
        clearMouse();
        clearTouch();
        clearMouch();
    });
    win.addEventListener("focus", function _blurHandlers(blurEvent) {
        clearKey();
        clearMouse();
        clearTouch();
        clearMouch();
    });
    domElement.addEventListener("touchstart", function _touchstartHandler(touchEvent) {
        setTouches(touchEvent);
        setMouches();
    });
    domElement.addEventListener("touchend", function _touchsendHandler(touchEvent) {
        clearTouch();
        clearMouch();
    });
    domElement.addEventListener("touchmove", function _touchmoveHandler(touchEvent) {
        setTouches(touchEvent);
        setMouches();
    });
    domElement.addEventListener("touchenter", function _touchenterHandler(touchEvent) {
        clearTouch();
        clearMouch();
    });
    domElement.addEventListener("touchleave", function _touchleaveHandler(touchEvent) {
        clearTouch();
        clearMouch();
    });
};
function _copy(a) {
    var b = [];
    for (var i = 0; i < a.length; i++)
        b[i] = a[i];
    return b;
}
function _clone(a) {
    var b = {};
    for (var key in a)
        b[key] = a[key];
    return b;
}
HaikuDOMRenderer.prototype.getUser = function getUser() {
    return {
        mouse: {
            x: this._user.mouse.x,
            y: this._user.mouse.y,
            down: this._user.mouse.down,
            buttons: _copy(this._user.mouse.buttons)
        },
        keys: _clone(this._user.keys),
        touches: _copy(this._user.touches),
        mouches: _copy(this._user.mouches)
    };
};

},{"./createMixpanel":65,"./createRightClickMenu":66,"./getElementSize":71,"./getLocalDomEventPosition":73,"./patch":83,"./render":85}],56:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var applyLayout_1 = _dereq_("./applyLayout");
var createTagNode_1 = _dereq_("./createTagNode");
var createTextNode_1 = _dereq_("./createTextNode");
var isTextNode_1 = _dereq_("./isTextNode");
function appendChild(alreadyChildElement, virtualElement, parentDomElement, parentVirtualElement, component) {
    var domElementToInsert;
    if (isTextNode_1["default"](virtualElement)) {
        domElementToInsert = createTextNode_1["default"](parentDomElement, virtualElement);
    }
    else {
        domElementToInsert = createTagNode_1["default"](parentDomElement, virtualElement, parentVirtualElement, component);
    }
    applyLayout_1["default"](domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, component, null, null);
    parentDomElement.appendChild(domElementToInsert);
    return domElementToInsert;
}
exports["default"] = appendChild;

},{"./applyLayout":57,"./createTagNode":68,"./createTextNode":69,"./isTextNode":81}],57:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var applyCssLayout_1 = _dereq_("./../../layout/applyCssLayout");
var scopeOfElement_1 = _dereq_("./../../layout/scopeOfElement");
var modernizr_1 = _dereq_("./../../vendor/modernizr");
var getWindowsBrowserVersion_1 = _dereq_("./getWindowsBrowserVersion");
var isEdge_1 = _dereq_("./isEdge");
var isIE_1 = _dereq_("./isIE");
var isMobile_1 = _dereq_("./isMobile");
var isTextNode_1 = _dereq_("./isTextNode");
var DEFAULT_PIXEL_RATIO = 1.0;
var SVG = "svg";
var safeWindow = typeof window !== "undefined" && window;
var PLATFORM_INFO = {
    hasWindow: !!safeWindow,
    isMobile: isMobile_1["default"](safeWindow),
    isIE: isIE_1["default"](safeWindow),
    isEdge: isEdge_1["default"](safeWindow),
    windowsBrowserVersion: getWindowsBrowserVersion_1["default"](safeWindow),
    hasPreserve3d: modernizr_1["default"].hasPreserve3d(safeWindow),
    devicePixelRatio: DEFAULT_PIXEL_RATIO
};
var SVG_RENDERABLES = {
    a: true,
    audio: true,
    canvas: true,
    circle: true,
    ellipse: true,
    filter: true,
    foreignObject: true,
    g: true,
    iframe: true,
    image: true,
    line: true,
    mesh: true,
    path: true,
    polygon: true,
    polyline: true,
    rect: true,
    svg: true,
    "switch": true,
    symbol: true,
    text: true,
    textPath: true,
    tspan: true,
    unknown: true,
    use: true,
    video: true
};
function applyLayout(domElement, virtualElement, parentDomNode, parentVirtualElement, component, isPatchOperation, isKeyDifferent) {
    if (isTextNode_1["default"](virtualElement))
        return domElement;
    if (virtualElement.layout) {
        if (scopeOfElement_1["default"](virtualElement) === SVG &&
            !SVG_RENDERABLES[virtualElement.elementName]) {
            return domElement;
        }
        if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
            _warnOnce("Cannot compute layout without parent computed size (child: <" +
                virtualElement.elementName +
                ">; parent: <" +
                parentVirtualElement.elementName +
                ">)");
            return domElement;
        }
        var devicePixelRatio_1 = (component.config.options && component.config.options.devicePixelRatio) || DEFAULT_PIXEL_RATIO;
        var computedLayout = virtualElement.layout.computed;
        if (!computedLayout || computedLayout.invisible) {
            if (domElement.style.display !== "none") {
                domElement.style.display = "none";
            }
        }
        else {
            if (domElement.style.display !== "block") {
                domElement.style.display = "block";
            }
            component.config.options.platform = PLATFORM_INFO;
            applyCssLayout_1["default"](domElement, virtualElement, virtualElement.layout, computedLayout, devicePixelRatio_1, component);
        }
    }
    return domElement;
}
exports["default"] = applyLayout;
var warnings = {};
function _warnOnce(warning) {
    if (warnings[warning])
        return void 0;
    warnings[warning] = true;
    console.warn("[haiku player] warning:", warning);
}

},{"./../../layout/applyCssLayout":39,"./../../layout/scopeOfElement":45,"./../../vendor/modernizr":143,"./getWindowsBrowserVersion":75,"./isEdge":78,"./isIE":79,"./isMobile":80,"./isTextNode":81}],58:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var assignClass_1 = _dereq_("./assignClass");
var assignEvent_1 = _dereq_("./assignEvent");
var assignStyle_1 = _dereq_("./assignStyle");
var getFlexId_1 = _dereq_("./getFlexId");
var STYLE = "style";
var OBJECT = "object";
var FUNCTION = "function";
var CLASS = "class";
var CLASS_NAME = "className";
var XLINK_XMLNS = "http://www.w3.org/1999/xlink";
var X = "x";
var L = "l";
var I = "i";
var N = "n";
var K = "k";
var D = "d";
var A = "a";
var T = "t";
var COLON = ":";
var M = "m";
var G = "g";
var E = "e";
var FSLASH = "/";
function setAttribute(el, key, val, component, cache) {
    if (key[0] === X && key[1] === L && key[2] === I && key[3] === N && key[4] === K) {
        var ns = XLINK_XMLNS;
        if (val[0] === D &&
            val[1] === A &&
            val[2] === T &&
            val[3] === A &&
            val[4] === COLON &&
            val[5] === I &&
            val[6] === M &&
            val[7] === A &&
            val[8] === G &&
            val[9] === E &&
            val[10] === FSLASH) {
            if (!cache.base64image) {
                el.setAttributeNS(ns, key, val);
                cache.base64image = true;
            }
        }
        else {
            var p0 = el.getAttributeNS(ns, key);
            if (p0 !== val) {
                el.setAttributeNS(ns, key, val);
            }
        }
    }
    else {
        if (key === "d") {
            if (val !== cache.d) {
                el.setAttribute(key, val);
                cache.d = val;
            }
        }
        else if (key === "points") {
            if (val !== cache.points) {
                el.setAttribute(key, val);
                cache.points = val;
            }
        }
        else {
            var p1 = el.getAttribute(key);
            if (p1 !== val) {
                el.setAttribute(key, val);
            }
        }
    }
}
function assignAttributes(domElement, virtualElement, component, isPatchOperation, isKeyDifferent) {
    if (!isPatchOperation) {
        if (domElement.haiku && domElement.haiku.element) {
            for (var oldKey in domElement.haiku.element.attributes) {
                var oldValue = domElement.haiku.element.attributes[oldKey];
                var newValue = virtualElement.attributes[oldKey];
                if (oldKey !== STYLE) {
                    if (newValue === null ||
                        newValue === undefined ||
                        oldValue !== newValue) {
                        domElement.removeAttribute(oldKey);
                    }
                }
            }
        }
    }
    for (var key in virtualElement.attributes) {
        var anotherNewValue = virtualElement.attributes[key];
        if (key === STYLE && anotherNewValue && typeof anotherNewValue === OBJECT) {
            assignStyle_1["default"](domElement, virtualElement, anotherNewValue, component, isPatchOperation);
            continue;
        }
        if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
            assignClass_1["default"](domElement, anotherNewValue);
            continue;
        }
        if (key[0] === "o" &&
            key[1] === "n" &&
            typeof anotherNewValue === FUNCTION) {
            assignEvent_1["default"](domElement, key.slice(2).toLowerCase(), anotherNewValue, component);
            continue;
        }
        setAttribute(domElement, key, anotherNewValue, component, component.config.options.cache[getFlexId_1["default"](virtualElement)]);
    }
    if (virtualElement.__handlers) {
        for (var eventName in virtualElement.__handlers) {
            var handler = virtualElement.__handlers[eventName];
            if (!handler.__subscribed) {
                assignEvent_1["default"](domElement, eventName, handler, component);
                handler.__subscribed = true;
            }
        }
    }
    return domElement;
}
exports["default"] = assignAttributes;

},{"./assignClass":59,"./assignEvent":60,"./assignStyle":61,"./getFlexId":72}],59:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function assignClass(domElement, className) {
    if (domElement.className !== className) {
        domElement.className = className;
    }
    return domElement;
}
exports["default"] = assignClass;

},{}],60:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var attachEventListener_1 = _dereq_("./attachEventListener");
function assignEvent(domElement, eventName, listenerFunction, component) {
    if (!domElement.haiku) {
        domElement.haiku = {};
    }
    if (!domElement.haiku.listeners) {
        domElement.haiku.listeners = {};
    }
    if (!domElement.haiku.listeners[eventName]) {
        domElement.haiku.listeners[eventName] = [];
    }
    var already = false;
    for (var i = 0; i < domElement.haiku.listeners[eventName].length; i++) {
        var existing = domElement.haiku.listeners[eventName][i];
        if (existing._haikuListenerId === listenerFunction._haikuListenerId) {
            already = true;
            break;
        }
    }
    if (!already) {
        listenerFunction._haikuListenerId = Math.random() + "";
        domElement.haiku.listeners[eventName].push(listenerFunction);
        attachEventListener_1["default"](domElement, eventName, listenerFunction, component);
    }
}
exports["default"] = assignEvent;

},{"./attachEventListener":62}],61:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function assignStyle(domElement, virtualElement, style, component, isPatchOperation) {
    if (!domElement.__haikuExplicitStyles)
        domElement.__haikuExplicitStyles = {};
    if (!isPatchOperation) {
        if (domElement.haiku &&
            domElement.haiku.element &&
            domElement.haiku.element.attributes &&
            domElement.haiku.element.attributes.style) {
            for (var oldStyleKey in domElement.haiku.element.attributes.style) {
                var newStyleValue = style[oldStyleKey];
                if (newStyleValue === null || newStyleValue === undefined) {
                    domElement.style[oldStyleKey] = null;
                }
            }
        }
    }
    for (var key in style) {
        var newProp = style[key];
        var previousProp = domElement.style[key];
        if (previousProp !== newProp) {
            domElement.__haikuExplicitStyles[key] = true;
            domElement.style[key] = style[key];
        }
    }
    return domElement;
}
exports["default"] = assignStyle;

},{}],62:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var Events_1 = _dereq_("./Events");
function attachEventListener(domElement, eventName, listener, component) {
    if (typeof listener === "function") {
        if (Events_1["default"].window[eventName]) {
            var win = domElement.ownerDocument.defaultView || domElement.ownerDocument.parentWindow;
            if (win) {
                win.addEventListener(eventName, listener);
            }
        }
        else {
            domElement.addEventListener(eventName, listener);
        }
    }
}
exports["default"] = attachEventListener;

},{"./Events":54}],63:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function _cloneAttributes(attributes) {
    if (!attributes)
        return {};
    var clone = {};
    for (var key in attributes) {
        clone[key] = attributes[key];
    }
    return clone;
}
exports["default"] = _cloneAttributes;

},{}],64:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var cloneAttributes_1 = _dereq_("./cloneAttributes");
function cloneVirtualElement(virtualElement) {
    return {
        elementName: virtualElement.elementName,
        attributes: cloneAttributes_1["default"](virtualElement.attributes),
        children: virtualElement.children
    };
}
exports["default"] = cloneVirtualElement;

},{"./cloneAttributes":63}],65:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var assign_1 = _dereq_("./../../vendor/assign");
var tiny_1 = _dereq_("./../../vendor/mixpanel-browser/tiny");
function createMixpanel(domElement, mixpanelToken, component) {
    var mixpanel = tiny_1["default"]();
    if (!mixpanel) {
        console.warn("[haiku player] mixpanel could not be initialized");
    }
    mixpanel.init(mixpanelToken, domElement);
    component.mixpanel = {
        track: function track(eventName, eventProperties) {
            var metadata = (component._bytecode && component._bytecode.metadata) || {};
            mixpanel.track(eventName, assign_1["default"]({
                platform: "dom"
            }, metadata, eventProperties));
        }
    };
    component.on("haikuComponentDidInitialize", function () {
        component.mixpanel.track("component:initialize");
    });
}
exports["default"] = createMixpanel;

},{"./../../vendor/assign":92,"./../../vendor/mixpanel-browser/tiny":142}],66:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var MENU_GLOBAL_ID = "haiku-right-click-menu";
var WIDTH = 167;
var HEIGHT = 44;
var haikuIcon = "" +
    '<svg style="transform:translateY(3px);margin-right:3px;" width="13px" height="13px" viewBox="0 0 9 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
    '    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
    '        <g id="menu" transform="translate(-9.000000, -50.000000)" fill-rule="nonzero" fill="#899497">' +
    '            <g id="favicon" transform="translate(9.000000, 50.000000)">' +
    '                <path d="M5.74649098,4.70558699 L5.74649098,5.7788098 C5.74649098,5.91256161 5.63820821,6.02098888 5.50463465,6.02098888 C5.46594093,6.02098888 5.42936949,6.0118902 5.39693775,5.99571295 C5.39186133,5.99396865 5.38680829,5.99204493 5.38178599,5.98993877 L2.13374851,4.62783436 C2.06585827,4.62681598 2.00074372,4.59703732 1.95556434,4.54557114 C1.89645814,4.50141795 1.85818531,4.43085101 1.85818531,4.35133305 L1.85818531,1.57454768 C1.85079926,1.56515108 1.8440022,1.55516354 1.83787126,1.54461783 L1.68370002,1.48221012 L0.983781643,1.19888682 L0.983781643,7.82711613 L1.85818531,8.18107016 L1.85818531,5.95344076 C1.85818531,5.94997543 1.858258,5.94652709 1.85840193,5.9430972 C1.85672094,5.90820764 1.86258618,5.87240498 1.87695925,5.83803981 C1.92855792,5.7146704 2.07026431,5.65654454 2.19346932,5.70821207 L5.45803735,7.07733924 L5.52116709,7.10578612 C5.64702981,7.11429403 5.74649098,7.21922045 5.74649098,7.34740828 L5.74649098,7.82711613 L6.61247795,8.17766313 L6.62089465,8.18107016 L6.62089465,4.31849373 L5.74649098,4.70558699 Z M5.26277832,4.81941585 L3.49887951,4.07970322 L2.78717926,4.37673832 L5.26277832,5.41491119 L5.26277832,4.81941585 Z M2.34189798,6.29557771 L2.34189798,8.21792436 L3.21630165,7.86397033 L3.21630165,6.66226962 L2.34189798,6.29557771 Z M2.10489107,8.84091277 C2.10327842,8.84094453 2.10166189,8.84096049 2.10004164,8.84096049 C2.03531005,8.84096049 1.97651801,8.81549628 1.93311099,8.77402594 L1.68370002,8.67306569 L0.701593132,8.27551396 C0.587217854,8.25628853 0.500068976,8.15667879 0.500068976,8.03668718 L0.500068976,8.02395302 C0.499977217,8.01997372 0.499976799,8.01598483 0.500068976,8.01198924 L0.500068976,0.83309739 C0.499984517,0.829434725 0.499977444,0.825763881 0.500048734,0.822087163 C0.499977444,0.818410445 0.499984517,0.814739601 0.500068976,0.811076936 L0.500068976,0.808477267 C0.500068976,0.734695385 0.533019284,0.66861973 0.584988773,0.624200019 C0.607223642,0.603893466 0.633376716,0.587129584 0.662911804,0.575173935 L2.00126808,0.0334143141 C2.06884262,-0.00448997495 2.15253254,-0.011953956 2.22949057,0.0203769852 L3.48533098,0.547969766 C3.4886593,0.547833737 3.49200497,0.54776506 3.49536665,0.54776506 C3.62894021,0.54776506 3.73722298,0.656192325 3.73722298,0.789944134 L3.73722298,0.821385651 C3.73731302,0.82532856 3.73731342,0.829280598 3.73722298,0.833238872 L3.73722298,2.40767185 L5.26277832,1.79239207 L5.26277832,0.83309739 C5.26269386,0.829434725 5.26268678,0.825763881 5.26275807,0.822087163 C5.26268678,0.818410445 5.26269386,0.814739601 5.26277832,0.811076936 L5.26277832,0.789944134 C5.26277832,0.660231597 5.36461961,0.55433711 5.49260447,0.548059437 L6.76397742,0.0334143141 C6.83155196,-0.00448997495 6.91524188,-0.011953956 6.99219991,0.0203769852 L8.30051205,0.570013732 C8.41385044,0.590099999 8.49993232,0.689222468 8.49993232,0.808477267 L8.49993232,0.821385589 C8.50002236,0.825328562 8.50002276,0.829280602 8.49993232,0.833238878 L8.49993232,8.03668718 C8.49993232,8.12601922 8.45162927,8.20405443 8.37974945,8.24603352 C8.3570412,8.26726508 8.33012837,8.28475773 8.2996029,8.29711428 L6.99757749,8.82416735 C6.91291064,8.85844005 6.82080599,8.84496071 6.75103698,8.79637735 L6.41724228,8.661259 L5.42562114,8.25985596 C5.34756383,8.22825877 5.29312904,8.1630773 5.27221467,8.08767347 C5.26662904,8.06827265 5.26340051,8.04787145 5.26285962,8.02680084 C5.26269203,8.02187767 5.26266414,8.01693859 5.26277832,8.01198924 L5.26277832,7.52049562 L5.25953529,7.51903428 L5.26277832,7.51181809 L5.26277832,7.52048475 L3.70001431,6.86512047 L3.70001431,8.03470119 C3.70001431,8.04191065 3.69969971,8.04904653 3.6990835,8.05609582 C3.69873979,8.1589341 3.63726868,8.25619133 3.53617314,8.29711428 L2.23486815,8.82387573 C2.19216118,8.84116329 2.14756179,8.84630123 2.10489107,8.84091277 Z M7.10460732,8.21821598 L8.01621965,7.84920008 L8.01621965,1.21243815 L7.10460732,1.58145405 L7.10460732,2.39098426 C7.10460732,2.46741667 7.06924708,2.53557924 7.0140137,2.5799642 C6.98940081,2.61105066 6.95679973,2.63650623 6.91764171,2.65284921 L4.12647169,3.81777145 L5.37396115,4.34092148 L6.74176427,3.73540324 C6.86393122,3.68132067 7.00675126,3.73664611 7.06076176,3.85897608 C7.06205348,3.86190175 7.06328271,3.86483924 7.06445002,3.86778706 C7.08982637,3.90609857 7.10460732,3.95205809 7.10460732,4.00147448 L7.10460732,8.21821598 Z M6.62089465,1.57454768 C6.6135086,1.56515108 6.60671153,1.55516354 6.6005806,1.54461783 L6.44640936,1.48221012 L5.74649098,1.19888682 L5.74649098,1.76114471 L6.62089465,2.11509874 L6.62089465,1.57454768 Z M2.34189798,4.03783399 L3.25351031,3.65736362 L3.25351031,1.21243815 L2.34189798,1.58145405 L2.34189798,4.03783399 Z M3.73722298,2.92984272 L3.73722298,3.45548138 L6.10302085,2.46809239 L5.50003848,2.22400828 C5.49794123,2.22315933 5.49586104,2.22228613 5.49379809,2.22138914 L3.73722298,2.92984272 Z M6.20555471,0.822087163 L6.64164504,0.998614246 L6.89809383,1.10242338 L7.57200867,0.829626174 L6.89232837,0.544084781 L6.20555471,0.822087163 Z M1.44284537,0.822087163 L1.8789357,0.998614246 L2.13538449,1.10242338 L2.80929933,0.829626174 L2.12961903,0.544084781 L1.44284537,0.822087163 Z" id="Combined-Shape"></path>' +
    "            </g>" +
    "        </g>" +
    "    </g>" +
    "</svg>";
var sharePageIcon = "" +
    '<svg style="transform:translate(-1px, 3px);margin-right:3px;" width="14px" height="14px" viewBox="0 0 11 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
    '  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
    '      <g id="menu" transform="translate(-8.000000, -32.000000)">' +
    '          <g id="0884-focus" transform="translate(8.500000, 32.000000)">' +
    '              <rect id="Rectangle-3" fill="#899497" x="4.72222222" y="0" width="1" height="1.66666667" rx="0.5"></rect>' +
    '              <rect id="Rectangle-3-Copy" fill="#899497" x="4.72222222" y="8.33333333" width="1" height="1.66666667" rx="0.5"></rect>' +
    '              <g id="Group" transform="translate(5.000000, 5.555556) rotate(90.000000) translate(-5.000000, -5.555556) translate(3.888889, 0.555556)" fill="#899497">' +
    '                  <rect id="Rectangle-3-Copy-3" x="0.277777778" y="0" width="1" height="1.66666667" rx="0.5"></rect>' +
    '                  <rect id="Rectangle-3-Copy-2" x="0.277777778" y="8.33333333" width="1" height="1.66666667" rx="0.5"></rect>' +
    "              </g>" +
    '              <circle id="Oval" stroke="#899497" stroke-width="0.66" cx="5" cy="5" r="3.33333333"></circle>' +
    '              <circle id="Oval-2" fill="#899497" cx="5" cy="5" r="1.11111111"></circle>' +
    "          </g>" +
    "      </g>" +
    "  </g>" +
    "</svg>";
var SUBSTITUTION_STRING = "HAIKU" + "_" + "SHARE" + "_" + "UUID";
function setBoxShadow(el, color) {
    el.style["-webkit-box-shadow"] = "0 1px 4px 0 " + color;
    el.style["-moz-box-shadow"] = "0 1px 4px 0 " + color;
    el.style["box-shadow"] = "0 1px 4px 0 " + color;
}
function px(num) {
    return num + "px";
}
function findOrCreateMenuElement(doc) {
    var menu = doc.getElementById(MENU_GLOBAL_ID);
    if (menu)
        return menu;
    menu = doc.createElement("div");
    menu.setAttribute("id", MENU_GLOBAL_ID);
    menu.style.position = "absolute";
    menu.style.zIndex = 2147483647;
    setBoxShadow(menu, "rgba(10,2,21,0.25)");
    menu.style.borderRadius = px(3);
    menu.style.display = "none";
    menu.style.backgroundColor = "rgba(255,255,255,0.95)";
    menu.style.overflow = "hidden";
    menu.style.cursor = "default";
    menu.style.fontFamily = "Helvetica, Arial, sans-serif";
    menu.style.fontWeight = "Bold";
    menu.style.fontSize = px(10);
    menu.style.padding = "0 0 7px";
    menu.style.color = "black";
    menu.style.margin = "0";
    menu.style.boxSizing = "content-box";
    menu.style.textDecoration = "none";
    menu.style.fontStyle = "none";
    doc.body.appendChild(menu);
    return menu;
}
function truncate(str, len) {
    if (str.length > len) {
        return str.slice(0, len - 3) + "...";
    }
    return str;
}
function createRightClickMenu(domElement, component) {
    var doc = domElement.ownerDocument;
    var menu = findOrCreateMenuElement(doc);
    var escaper = doc.createElement("textarea");
    function escapeHTML(html) {
        escaper.textContent = html;
        return escaper.innerHTML.replace(/[><,{}[\]"']/gi, "");
    }
    function revealMenu(mx, my) {
        var height = HEIGHT;
        var lines = [];
        var titleLine = null;
        var metadata = component._bytecode && component._bytecode.metadata;
        if (metadata && metadata.project) {
            var who = truncate(escapeHTML(metadata.project), 25);
            var org = "";
            if (metadata.organization) {
                org = truncate(escapeHTML(metadata.organization), 11);
                who = '"' + who + '" <span style="font-weight:normal;">by</span> ' + org;
            }
            var byline = who;
            titleLine =
                '<p style="margin:0;margin-bottom:4px;padding:12px 0 7px;line-height:12px;text-align:center;border-bottom:1px solid rgba(140,140,140,.14);">' +
                    byline +
                    "</p>";
        }
        if (metadata && metadata.uuid && metadata.uuid !== SUBSTITUTION_STRING) {
            lines.push('<a onMouseOver="this.style.backgroundColor=\'rgba(140,140,140,.07)\'" onMouseOut="this.style.backgroundColor=\'transparent\'" style="display:block;color:black;text-decoration:none;padding: 5px 13px;line-height:12px;" href="https://share.haiku.ai/' +
                escapeHTML(metadata.uuid) +
                '" target="_blank">' +
                sharePageIcon +
                "  View Component</a>");
        }
        lines.push('<a onMouseOver="this.style.backgroundColor=\'rgba(140,140,140,.07)\'" onMouseOut="this.style.backgroundColor=\'transparent\'" style="display:block;color:black;text-decoration:none;padding: 5px 13px;line-height:12px;" href="https://www.haiku.ai" target="_blank">' +
            haikuIcon +
            "  Crafted in Haiku</a>");
        if (lines.length < 1)
            return undefined;
        height = lines.length > 1 ? 88 : 61;
        height = titleLine ? height : 22;
        menu.style.width = px(WIDTH);
        menu.style.height = px(height);
        menu.style.top = px(my);
        menu.style.left = px(mx);
        menu.style.pointerEvents = "auto";
        menu.style.display = "block";
        menu.innerHTML = titleLine ? titleLine + lines.join("\n") : lines.join("\n");
    }
    function hideMenu() {
        menu.style.width = px(0);
        menu.style.height = px(0);
        menu.style.top = px(0);
        menu.style.left = px(0);
        menu.style.pointerEvents = "none";
        menu.style.display = "none";
    }
    domElement.addEventListener("contextmenu", function (contextmenuEvent) {
        contextmenuEvent.preventDefault();
        var mx = contextmenuEvent.pageX;
        var my = contextmenuEvent.pageY;
        if (component.mixpanel) {
            component.mixpanel.track("component:contextmenu");
        }
        revealMenu(mx, my);
    });
    doc.addEventListener("click", hideMenu);
}
exports["default"] = createRightClickMenu;

},{}],67:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
function createSvgElement(domElement, tagName) {
    return domElement.ownerDocument.createElementNS(SVG_NAMESPACE, tagName);
}
exports["default"] = createSvgElement;

},{}],68:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var allSvgElementNames_1 = _dereq_("./../../helpers/allSvgElementNames");
var createSvgElement_1 = _dereq_("./createSvgElement");
var getFlexId_1 = _dereq_("./getFlexId");
var getTypeAsString_1 = _dereq_("./getTypeAsString");
var normalizeName_1 = _dereq_("./normalizeName");
var updateElement_1 = _dereq_("./updateElement");
function createTagNode(domElement, virtualElement, parentVirtualElement, component) {
    var tagName = normalizeName_1["default"](getTypeAsString_1["default"](virtualElement));
    var newDomElement;
    if (allSvgElementNames_1["default"][tagName]) {
        newDomElement = createSvgElement_1["default"](domElement, tagName);
    }
    else {
        newDomElement = domElement.ownerDocument.createElement(tagName);
    }
    if (!newDomElement.haiku)
        newDomElement.haiku = {};
    if (!component.config.options.cache[getFlexId_1["default"](virtualElement)]) {
        component.config.options.cache[getFlexId_1["default"](virtualElement)] = {};
    }
    var incomingKey = virtualElement.key ||
        (virtualElement.attributes && virtualElement.attributes.key);
    if (incomingKey !== undefined && incomingKey !== null) {
        newDomElement.haiku.key = incomingKey;
    }
    updateElement_1["default"](newDomElement, virtualElement, domElement, parentVirtualElement, component, null);
    return newDomElement;
}
exports["default"] = createTagNode;

},{"./../../helpers/allSvgElementNames":20,"./createSvgElement":67,"./getFlexId":72,"./getTypeAsString":74,"./normalizeName":82,"./updateElement":90}],69:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function createTextNode(domElement, textContent) {
    return domElement.ownerDocument.createTextNode(textContent);
}
exports["default"] = createTextNode;

},{}],70:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function getDomEventPosition(event, doc) {
    var x = -1;
    var y = -1;
    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    }
    else if (event.clientX || event.clientY) {
        x = event.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft;
        y = event.clientY + doc.body.scrollTop + doc.documentElement.scrollTop;
    }
    return {
        x: ~~x,
        y: ~~y
    };
}
exports["default"] = getDomEventPosition;

},{}],71:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function getElementSize(domElement) {
    var x;
    var y;
    if (domElement.offsetWidth === undefined) {
        var rect = domElement.getBoundingClientRect();
        x = rect.width;
        y = rect.height;
    }
    else {
        x = domElement.offsetWidth;
        y = domElement.offsetHeight;
    }
    return {
        x: x,
        y: y
    };
}
exports["default"] = getElementSize;

},{}],72:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var HAIKU_ID_ATTRIBUTE = "haiku-id";
var ID_ATTRIBUTE = "id";
function getFlexId(element) {
    if (element) {
        if (element.getAttribute) {
            return element.getAttribute(HAIKU_ID_ATTRIBUTE) || element.getAttribute(ID_ATTRIBUTE);
        }
        else if (element.attributes) {
            return element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes[ID_ATTRIBUTE];
        }
    }
}
exports["default"] = getFlexId;

},{}],73:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var getDomEventPosition_1 = _dereq_("./getDomEventPosition");
function getLocalDomEventPosition(event, element) {
    var doc = element.ownerDocument;
    var viewPosition = getDomEventPosition_1["default"](event, doc);
    var elementRect = element.getBoundingClientRect();
    var x = viewPosition.x - elementRect.left;
    var y = viewPosition.y - elementRect.top;
    return {
        x: ~~x,
        y: ~~y,
        pageX: viewPosition.x,
        pageY: viewPosition.y
    };
}
exports["default"] = getLocalDomEventPosition;

},{"./getDomEventPosition":70}],74:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var STRING = "string";
var FUNCTION = "function";
var OBJECT = "object";
function getType(virtualElement) {
    var typeValue = virtualElement.elementName;
    if (typeValue && typeValue["default"])
        return typeValue["default"];
    return typeValue;
}
function thingToTagName(thing) {
    if (typeof thing === STRING && thing.length > 0)
        return thing;
    if (typeof thing === FUNCTION)
        return fnToTagName(thing);
    if (thing && typeof thing === OBJECT)
        return objToTagName(thing);
    _warnOnce("Got blank/malformed virtual element object; falling back to <div>");
    return "div";
}
function objToTagName(obj) {
    return "div";
}
function fnToTagName(fn) {
    if (fn.name)
        return fn.name;
    if (fn.displayName)
        return fn.displayName;
    if (fn.constructor) {
        if (fn.constructor.name !== "Function") {
            return fn.constructor.name;
        }
    }
}
function getTypeAsString(virtualElement) {
    var typeValue = getType(virtualElement);
    typeValue = thingToTagName(typeValue);
    if (!typeValue)
        throw new Error("Node has no discernable name");
    return typeValue;
}
exports["default"] = getTypeAsString;
var warnings = {};
function _warnOnce(warning) {
    if (warnings[warning])
        return void 0;
    warnings[warning] = true;
    console.warn("[haiku player] warning:", warning);
}

},{}],75:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function getWindowsBrowser(window) {
    var rv = -1;
    if (!window)
        return rv;
    if (!window.navigator)
        return rv;
    if (!window.navigator.userAgent)
        return rv;
    if (!window.navigator.appName)
        return rv;
    if (window.navigator.appName === "Microsoft Internet Explorer") {
        var ua = window.navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        if (re.exec(ua) !== null) {
            rv = parseFloat(RegExp.$1);
        }
    }
    else if (window.navigator.appName === "Netscape") {
        rv = (window.navigator.appVersion.indexOf("Trident") === -1) ? 12 : 11;
    }
    return rv;
}
exports["default"] = getWindowsBrowser;

},{}],76:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var HaikuDOMRenderer_1 = _dereq_("./HaikuDOMRenderer");
exports["default"] = HaikuDOMRenderer_1["default"];

},{"./HaikuDOMRenderer":55}],77:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function isBlankString(thing) {
    return thing === "";
}
exports["default"] = isBlankString;

},{}],78:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function isEdge(window) {
    if (!window)
        return false;
    if (!window.navigator)
        return false;
    if (!window.navigator.userAgent)
        return false;
    return /Edge\/\d./i.test(window.navigator.userAgent);
}
exports["default"] = isEdge;

},{}],79:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function isIE(window) {
    if (!window)
        return false;
    if (!window.navigator)
        return false;
    if (!window.navigator.userAgent)
        return false;
    return (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
        navigator.appVersion.indexOf("Trident") > 0);
}
exports["default"] = isIE;

},{}],80:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function isMobile(window) {
    if (!window)
        return false;
    if (!window.navigator)
        return false;
    if (!window.navigator.userAgent)
        return false;
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
}
exports["default"] = isMobile;

},{}],81:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function isTextNode(virtualElement) {
    return typeof virtualElement === "string";
}
exports["default"] = isTextNode;

},{}],82:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function normalizeName(tagName) {
    if (tagName[0] === tagName[0].toUpperCase())
        tagName = tagName + "-component";
    return tagName;
}
exports["default"] = normalizeName;

},{}],83:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var updateElement_1 = _dereq_("./updateElement");
function patch(topLevelDomElement, virtualContainer, patchesDict, component) {
    if (!patchesDict) {
        return topLevelDomElement;
    }
    var keysToUpdate = Object.keys(patchesDict);
    if (keysToUpdate.length < 1) {
        return topLevelDomElement;
    }
    for (var flexId in patchesDict) {
        var virtualElement = patchesDict[flexId];
        var domElements = component._getRealElementsAtId(flexId);
        var nestedModuleElement = component._nestedComponentElements[flexId];
        for (var i = 0; i < domElements.length; i++) {
            var domElement = domElements[i];
            updateElement_1["default"](domElement, virtualElement, domElement.parentNode, virtualElement.__parent, component, true);
            if (nestedModuleElement && nestedModuleElement.__instance) {
                patch(domElement, nestedModuleElement, nestedModuleElement.__instance._getPrecalcedPatches(), nestedModuleElement.__instance);
            }
        }
    }
}
exports["default"] = patch;

},{"./updateElement":90}],84:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function removeElement(domElement) {
    domElement.parentNode.removeChild(domElement);
    return domElement;
}
exports["default"] = removeElement;

},{}],85:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var renderTree_1 = _dereq_("./renderTree");
function render(domElement, virtualContainer, virtualTree, component) {
    return renderTree_1["default"](domElement, virtualContainer, [virtualTree], component, null, null);
}
exports["default"] = render;

},{"./renderTree":86}],86:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var appendChild_1 = _dereq_("./appendChild");
var cloneVirtualElement_1 = _dereq_("./cloneVirtualElement");
var getFlexId_1 = _dereq_("./getFlexId");
var isBlankString_1 = _dereq_("./isBlankString");
var removeElement_1 = _dereq_("./removeElement");
var replaceElement_1 = _dereq_("./replaceElement");
var shouldElementBeReplaced_1 = _dereq_("./shouldElementBeReplaced");
var updateElement_1 = _dereq_("./updateElement");
function renderTree(domElement, virtualElement, virtualChildren, component, isPatchOperation, doSkipChildren) {
    component._addElementToHashTable(domElement, virtualElement);
    if (!domElement.haiku)
        domElement.haiku = {};
    virtualElement.__target = domElement;
    domElement.haiku.virtual = virtualElement;
    domElement.haiku.element = cloneVirtualElement_1["default"](virtualElement);
    if (!component.config.options.cache[getFlexId_1["default"](virtualElement)]) {
        component.config.options.cache[getFlexId_1["default"](virtualElement)] = {};
    }
    if (!Array.isArray(virtualChildren)) {
        return domElement;
    }
    if (component._isHorizonElement(virtualElement)) {
        return domElement;
    }
    if (doSkipChildren) {
        return domElement;
    }
    while (virtualChildren.length > 0 && isBlankString_1["default"](virtualChildren[0])) {
        virtualChildren.shift();
    }
    var domChildNodes = [];
    for (var k = 0; k < domElement.childNodes.length; k++) {
        domChildNodes[k] = domElement.childNodes[k];
    }
    var max = virtualChildren.length;
    if (max < domChildNodes.length) {
        max = domChildNodes.length;
    }
    for (var i = 0; i < max; i++) {
        var virtualChild = virtualChildren[i];
        var domChild = domChildNodes[i];
        if (!virtualChild && !domChild) {
        }
        else if (!virtualChild && domChild) {
            removeElement_1["default"](domChild);
        }
        else if (virtualChild) {
            if (!domChild) {
                var insertedElement = appendChild_1["default"](null, virtualChild, domElement, virtualElement, component);
                component._addElementToHashTable(insertedElement, virtualChild);
            }
            else {
                if (shouldElementBeReplaced_1["default"](domChild, virtualChild)) {
                    replaceElement_1["default"](domChild, virtualChild, domElement, virtualElement, component);
                }
                else {
                    updateElement_1["default"](domChild, virtualChild, domElement, virtualElement, component, isPatchOperation);
                }
            }
        }
    }
    return domElement;
}
exports["default"] = renderTree;

},{"./appendChild":56,"./cloneVirtualElement":64,"./getFlexId":72,"./isBlankString":77,"./removeElement":84,"./replaceElement":87,"./shouldElementBeReplaced":89,"./updateElement":90}],87:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var applyLayout_1 = _dereq_("./applyLayout");
var createTagNode_1 = _dereq_("./createTagNode");
var createTextNode_1 = _dereq_("./createTextNode");
var isTextNode_1 = _dereq_("./isTextNode");
function replaceElement(domElement, virtualElement, parentDomNode, parentVirtualElement, component) {
    var newElement;
    if (isTextNode_1["default"](virtualElement)) {
        newElement = createTextNode_1["default"](domElement, virtualElement);
    }
    else {
        newElement = createTagNode_1["default"](domElement, virtualElement, parentVirtualElement, component);
    }
    applyLayout_1["default"](newElement, virtualElement, parentDomNode, parentVirtualElement, component, null, null);
    parentDomNode.replaceChild(newElement, domElement);
    return newElement;
}
exports["default"] = replaceElement;

},{"./applyLayout":57,"./createTagNode":68,"./createTextNode":69,"./isTextNode":81}],88:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var createTextNode_1 = _dereq_("./createTextNode");
function replaceElementWithText(domElement, textContent, component) {
    if (domElement) {
        if (domElement.textContent !== textContent) {
            var parentNode = domElement.parentNode;
            var textNode = createTextNode_1["default"](domElement, textContent);
            parentNode.replaceChild(textNode, domElement);
        }
    }
    return domElement;
}
exports["default"] = replaceElementWithText;

},{"./createTextNode":69}],89:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var getFlexId_1 = _dereq_("./getFlexId");
function shouldElementBeReplaced(domElement, virtualElement) {
    var oldFlexId = getFlexId_1["default"](domElement);
    var newFlexId = getFlexId_1["default"](virtualElement);
    if (oldFlexId && newFlexId) {
        if (oldFlexId !== newFlexId) {
            return true;
        }
    }
    return false;
}
exports["default"] = shouldElementBeReplaced;

},{"./getFlexId":72}],90:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var applyLayout_1 = _dereq_("./applyLayout");
var assignAttributes_1 = _dereq_("./assignAttributes");
var cloneVirtualElement_1 = _dereq_("./cloneVirtualElement");
var getFlexId_1 = _dereq_("./getFlexId");
var getTypeAsString_1 = _dereq_("./getTypeAsString");
var isTextNode_1 = _dereq_("./isTextNode");
var normalizeName_1 = _dereq_("./normalizeName");
var renderTree_1 = _dereq_("./renderTree");
var replaceElement_1 = _dereq_("./replaceElement");
var replaceElementWithText_1 = _dereq_("./replaceElementWithText");
var OBJECT = "object";
var STRING = "string";
function updateElement(domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation) {
    if (isTextNode_1["default"](virtualElement)) {
        replaceElementWithText_1["default"](domElement, virtualElement, component);
        return virtualElement;
    }
    if (!domElement.haiku)
        domElement.haiku = {};
    if (!component.config.options.cache[getFlexId_1["default"](virtualElement)]) {
        component.config.options.cache[getFlexId_1["default"](virtualElement)] = {};
    }
    if (!domElement.haiku.element) {
        domElement.haiku.element = cloneVirtualElement_1["default"](virtualElement);
    }
    var domTagName = domElement.tagName.toLowerCase().trim();
    var elName = normalizeName_1["default"](getTypeAsString_1["default"](virtualElement));
    var virtualElementTagName = elName.toLowerCase().trim();
    var incomingKey = virtualElement.key ||
        (virtualElement.attributes && virtualElement.attributes.key);
    var existingKey = domElement.haiku && domElement.haiku.key;
    var isKeyDifferent = incomingKey !== null &&
        incomingKey !== undefined &&
        incomingKey !== existingKey;
    if (!component._isHorizonElement(virtualElement)) {
        if (domTagName !== virtualElementTagName) {
            return replaceElement_1["default"](domElement, virtualElement, parentNode, parentVirtualElement, component);
        }
        if (isKeyDifferent) {
            return replaceElement_1["default"](domElement, virtualElement, parentNode, parentVirtualElement, component);
        }
    }
    if (virtualElement.attributes &&
        typeof virtualElement.attributes === OBJECT) {
        assignAttributes_1["default"](domElement, virtualElement, component, isPatchOperation, isKeyDifferent);
    }
    applyLayout_1["default"](domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation, isKeyDifferent);
    if (incomingKey !== undefined && incomingKey !== null) {
        domElement.haiku.key = incomingKey;
    }
    var subcomponent = (virtualElement && virtualElement.__instance) || component;
    if (Array.isArray(virtualElement.children)) {
        var doSkipChildren = isPatchOperation && (typeof virtualElement.children[0] !== STRING);
        renderTree_1["default"](domElement, virtualElement, virtualElement.children, subcomponent, isPatchOperation, doSkipChildren);
    }
    else if (!virtualElement.children) {
        renderTree_1["default"](domElement, virtualElement, [], subcomponent, isPatchOperation, null);
    }
    return domElement;
}
exports["default"] = updateElement;

},{"./applyLayout":57,"./assignAttributes":58,"./cloneVirtualElement":64,"./getFlexId":72,"./getTypeAsString":74,"./isTextNode":81,"./normalizeName":82,"./renderTree":86,"./replaceElement":87,"./replaceElementWithText":88}],91:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function uniq(arr) {
    var len = arr.length;
    var i = -1;
    while (i++ < len) {
        var j = i + 1;
        for (; j < arr.length; ++j) {
            if (arr[i] === arr[j]) {
                arr.splice(j--, 1);
            }
        }
    }
    return arr;
}
function immutable(arr) {
    var arrayLength = arr.length;
    var newArray = new Array(arrayLength);
    for (var i = 0; i < arrayLength; i++) {
        newArray[i] = arr[i];
    }
    return uniq(newArray);
}
exports["default"] = {
    uniq: uniq,
    immutable: immutable
};

},{}],92:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function assign() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var t = args[0];
    for (var s = void 0, i = 1, n = args.length; i < n; i++) {
        s = args[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) {
                t[p] = s[p];
            }
        }
    }
    return t;
}
exports["default"] = assign;

},{}],93:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports["default"] = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50]
};

},{}],94:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var color_names_1 = _dereq_("./../color-names");
var reverseNames = {};
for (var name_1 in color_names_1["default"]) {
    if (color_names_1["default"].hasOwnProperty(name_1)) {
        reverseNames[color_names_1["default"][name_1]] = name_1;
    }
}
var cs = {};
cs['get'] = function (string) {
    var prefix = string.substring(0, 3).toLowerCase();
    var val;
    var model;
    switch (prefix) {
        case "hsl":
            val = cs['get']['hsl'](string);
            model = "hsl";
            break;
        case "hwb":
            val = cs['get']['hwb'](string);
            model = "hwb";
            break;
        default:
            val = cs['get']['rgb'](string);
            model = "rgb";
            break;
    }
    if (!val) {
        return null;
    }
    return { model: model, value: val };
};
cs['get']['rgb'] = function (string) {
    if (!string) {
        return null;
    }
    var abbr = /^#([a-f0-9]{3,4})$/i;
    var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
    var per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
    var keyword = /(\D+)/;
    var rgb = [0, 0, 0, 1];
    var match;
    var i;
    var hexAlpha;
    var hexMatch = string.match(hex);
    var abbrMatch = string.match(abbr);
    var rgbaMatch = string.match(rgba);
    var perMatch = string.match(per);
    var keywordMatch = string.match(keyword);
    if (hexMatch) {
        match = hexMatch;
        hexAlpha = match[2];
        match = match[1];
        for (i = 0; i < 3; i++) {
            var i2 = i * 2;
            rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
        }
        if (hexAlpha) {
            rgb[3] = Math.round(parseInt(hexAlpha, 16) / 255 * 100) / 100;
        }
    }
    else if (abbrMatch) {
        match = abbrMatch;
        match = match[1];
        hexAlpha = match[3];
        for (i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i] + match[i], 16);
        }
        if (hexAlpha) {
            rgb[3] = Math.round(parseInt(hexAlpha + hexAlpha, 16) / 255 * 100) / 100;
        }
    }
    else if (rgbaMatch) {
        match = rgbaMatch;
        for (i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i + 1], 0);
        }
        if (match[4]) {
            rgb[3] = parseFloat(match[4]);
        }
    }
    else if (perMatch) {
        match = perMatch;
        for (i = 0; i < 3; i++) {
            rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
        }
        if (match[4]) {
            rgb[3] = parseFloat(match[4]);
        }
    }
    else if (keywordMatch) {
        match = keywordMatch;
        if (match[1] === "transparent") {
            return [0, 0, 0, 0];
        }
        rgb = color_names_1["default"][match[1]];
        if (!rgb) {
            return null;
        }
        rgb[3] = 1;
        return rgb;
    }
    else {
        return null;
    }
    for (i = 0; i < 3; i++) {
        rgb[i] = clamp(rgb[i], 0, 255);
    }
    rgb[3] = clamp(rgb[3], 0, 1);
    return rgb;
};
cs['get']['hsl'] = function (string) {
    if (!string) {
        return null;
    }
    var hsl = /^hsla?\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
    var match = string.match(hsl);
    if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) % 360 + 360) % 360;
        var s = clamp(parseFloat(match[2]), 0, 100);
        var l = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, s, l, a];
    }
    return null;
};
cs['get']['hwb'] = function (string) {
    if (!string) {
        return null;
    }
    var hwb = /^hwb\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
    var match = string.match(hwb);
    if (match) {
        var alpha = parseFloat(match[4]);
        var h = (parseFloat(match[1]) % 360 + 360) % 360;
        var w = clamp(parseFloat(match[2]), 0, 100);
        var b = clamp(parseFloat(match[3]), 0, 100);
        var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h, w, b, a];
    }
    return null;
};
cs['to'] = {};
cs['to']['hex'] = function (rgba) {
    return ("#" +
        hexDouble(rgba[0]) +
        hexDouble(rgba[1]) +
        hexDouble(rgba[2]) +
        (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : ""));
};
cs['to']['rgb'] = function (rgba) {
    return rgba.length < 4 || rgba[3] === 1
        ? "rgb(" +
            Math.round(rgba[0]) +
            ", " +
            Math.round(rgba[1]) +
            ", " +
            Math.round(rgba[2]) +
            ")"
        : "rgba(" +
            Math.round(rgba[0]) +
            ", " +
            Math.round(rgba[1]) +
            ", " +
            Math.round(rgba[2]) +
            ", " +
            rgba[3] +
            ")";
};
cs['to']['rgb']['percent'] = function (rgba) {
    var r = Math.round(rgba[0] / 255 * 100);
    var g = Math.round(rgba[1] / 255 * 100);
    var b = Math.round(rgba[2] / 255 * 100);
    return rgba.length < 4 || rgba[3] === 1
        ? "rgb(" + r + "%, " + g + "%, " + b + "%)"
        : "rgba(" + r + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
};
cs['to']['hsl'] = function (hsla) {
    return hsla.length < 4 || hsla[3] === 1
        ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)"
        : "hsla(" +
            hsla[0] +
            ", " +
            hsla[1] +
            "%, " +
            hsla[2] +
            "%, " +
            hsla[3] +
            ")";
};
cs['to']['hwb'] = function (hwba) {
    var a = "";
    if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ", " + hwba[3];
    }
    return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
};
cs['to']['keyword'] = function (rgb) {
    return reverseNames[rgb.slice(0, 3)];
};
function clamp(num, min, max) {
    return Math.min(Math.max(min, num), max);
}
function hexDouble(num) {
    var str = num.toString(16).toUpperCase();
    return str.length < 2 ? "0" + str : str;
}
exports["default"] = cs;

},{"./../color-names":93}],95:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.ease = internal_1.cubicBezier(.25, .1, .25, .1);

},{"../internal":139}],96:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeIn = internal_1.cubicBezier(.42, 0, 1, 1);

},{"../internal":139}],97:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInBack = function (x) { return internal_1.c3 * x * x * x - internal_1.c1 * x * x; };

},{"../internal":139}],98:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var index_1 = _dereq_("./index");
exports.easeInBounce = function (x) { return 1 - index_1.easeOutBounce(1 - x); };

},{"./index":129}],99:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInCirc = function (x) { return 1 - internal_1.sqrt(1 - (x * x)); };

},{"../internal":139}],100:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.easeInCubic = function (x) { return x * x * x; };

},{}],101:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInElastic = function (n) {
    return !n || n === 1 ? n : -1 * internal_1.sin((n - 1.1) * internal_1.tau * 2.5) * internal_1.pow(2, 10 * (n - 1));
};

},{"../internal":139}],102:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInExpo = function (x) { return x === 0 ? 0 : internal_1.pow(2, 10 * x - 10); };

},{"../internal":139}],103:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOut = internal_1.cubicBezier(.42, 0, .58, 1);

},{"../internal":139}],104:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutBack = function (x) { return x < 0.5
    ? (internal_1.pow(2 * x, 2) * ((internal_1.c2 + 1) * 2 * x - internal_1.c2)) / 2
    : (internal_1.pow(2 * x - 2, 2) * ((internal_1.c2 + 1) * (x * 2 - 2) + internal_1.c2) + 2) / 2; };

},{"../internal":139}],105:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var index_1 = _dereq_("./index");
exports.easeInOutBounce = function (x) { return x < 0.5
    ? (1 - index_1.easeOutBounce(1 - 2 * x)) / 2
    : (1 + index_1.easeOutBounce(2 * x - 1)) / 2; };

},{"./index":129}],106:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutCirc = function (x) { return x < 0.5
    ? (1 - internal_1.sqrt(1 - internal_1.pow(2 * x, 2))) / 2
    : (internal_1.sqrt(1 - internal_1.pow(-2 * x + 2, 2)) + 1) / 2; };

},{"../internal":139}],107:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutCubic = function (x) { return x < 0.5
    ? 4 * x * x * x
    : 1 - internal_1.pow(-2 * x + 2, 3) / 2; };

},{"../internal":139}],108:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutElastic = function (n) {
    if (!n || n === 1)
        return n;
    n *= 2;
    if (n < 1) {
        return -0.5 * (internal_1.pow(2, 10 * (n - 1)) * internal_1.sin((n - 1.1) * internal_1.tau / .4));
    }
    return internal_1.pow(2, -10 * (n - 1)) * internal_1.sin((n - 1.1) * internal_1.tau / .4) * .5 + 1;
};

},{"../internal":139}],109:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutExpo = function (x) { return x === 0
    ? 0 : x === 1
    ? 1 : x < 0.5
    ? internal_1.pow(2, 20 * x - 10) / 2
    : (2 - internal_1.pow(2, -20 * x + 10)) / 2; };

},{"../internal":139}],110:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutQuad = function (x) { return x < 0.5 ?
    2 * x * x :
    1 - internal_1.pow(-2 * x + 2, 2) / 2; };

},{"../internal":139}],111:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutQuart = function (x) { return x < 0.5
    ? 8 * x * x * x * x
    : 1 - internal_1.pow(-2 * x + 2, 4) / 2; };

},{"../internal":139}],112:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutQuint = function (x) { return x < 0.5
    ? 16 * x * x * x * x * x
    : 1 - internal_1.pow(-2 * x + 2, 5) / 2; };

},{"../internal":139}],113:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInOutSine = function (x) { return -(internal_1.cos(internal_1.pi * x) - 1) / 2; };

},{"../internal":139}],114:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.easeInQuad = function (x) { return x * x; };

},{}],115:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.easeInQuart = function (x) { return x * x * x * x; };

},{}],116:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.easeInQuint = function (x) { return x * x * x * x * x; };

},{}],117:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeInSine = function (x) { return 1 - internal_1.cos(x * internal_1.pi / 2); };

},{"../internal":139}],118:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOut = internal_1.cubicBezier(0, 0, .58, 1);

},{"../internal":139}],119:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutBack = function (x) { return 1 + internal_1.c3 * internal_1.pow(x - 1, 3) + internal_1.c1 * internal_1.pow(x - 1, 2); };

},{"../internal":139}],120:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.easeOutBounce = function (x) {
    var n1 = 7.5625;
    var d1 = 2.75;
    return x < 1 / d1
        ? n1 * x * x
        : x < 2 / d1
            ? n1 * (x -= (1.5 / d1)) * x + .75
            : x < 2.5 / d1
                ? n1 * (x -= (2.25 / d1)) * x + .9375
                : n1 * (x -= (2.625 / d1)) * x + .984375;
};

},{}],121:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutCirc = function (x) { return internal_1.sqrt(1 - ((x - 1) * (x - 1))); };

},{"../internal":139}],122:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutCubic = function (x) { return 1 - internal_1.pow(1 - x, 3); };

},{"../internal":139}],123:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutElastic = function (n) {
    if (!n || n === 1)
        return n;
    var s, a = 0.1, p = 0.4;
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    }
    else
        s = p * Math.asin(1 / a) / internal_1.tau;
    return (a * internal_1.pow(2, -10 * n) * internal_1.sin((n - s) * (internal_1.tau) / p) + 1);
};

},{"../internal":139}],124:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutExpo = function (x) { return x === 1 ? 1 : 1 - internal_1.pow(2, -10 * x); };

},{"../internal":139}],125:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.easeOutQuad = function (x) { return 1 - (1 - x) * (1 - x); };

},{}],126:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutQuart = function (x) { return 1 - internal_1.pow(1 - x, 4); };

},{"../internal":139}],127:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutQuint = function (x) { return 1 - internal_1.pow(1 - x, 5); };

},{"../internal":139}],128:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.easeOutSine = function (x) { return internal_1.sin(x * internal_1.pi / 2); };

},{"../internal":139}],129:[function(_dereq_,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(_dereq_("./ease"));
__export(_dereq_("./easeIn"));
__export(_dereq_("./easeInBack"));
__export(_dereq_("./easeInBounce"));
__export(_dereq_("./easeInCirc"));
__export(_dereq_("./easeInCubic"));
__export(_dereq_("./easeInElastic"));
__export(_dereq_("./easeInExpo"));
__export(_dereq_("./easeInOut"));
__export(_dereq_("./easeInOutBack"));
__export(_dereq_("./easeInOutBounce"));
__export(_dereq_("./easeInOutCirc"));
__export(_dereq_("./easeInOutCubic"));
__export(_dereq_("./easeInOutElastic"));
__export(_dereq_("./easeInOutExpo"));
__export(_dereq_("./easeInOutQuad"));
__export(_dereq_("./easeInOutQuart"));
__export(_dereq_("./easeInOutQuint"));
__export(_dereq_("./easeInOutSine"));
__export(_dereq_("./easeInQuad"));
__export(_dereq_("./easeInQuart"));
__export(_dereq_("./easeInQuint"));
__export(_dereq_("./easeInSine"));
__export(_dereq_("./easeOut"));
__export(_dereq_("./easeOutBack"));
__export(_dereq_("./easeOutBounce"));
__export(_dereq_("./easeOutCirc"));
__export(_dereq_("./easeOutCubic"));
__export(_dereq_("./easeOutElastic"));
__export(_dereq_("./easeOutExpo"));
__export(_dereq_("./easeOutQuad"));
__export(_dereq_("./easeOutQuart"));
__export(_dereq_("./easeOutQuint"));
__export(_dereq_("./easeOutSine"));
__export(_dereq_("./linear"));
__export(_dereq_("./stepEnd"));
__export(_dereq_("./stepStart"));

},{"./ease":95,"./easeIn":96,"./easeInBack":97,"./easeInBounce":98,"./easeInCirc":99,"./easeInCubic":100,"./easeInElastic":101,"./easeInExpo":102,"./easeInOut":103,"./easeInOutBack":104,"./easeInOutBounce":105,"./easeInOutCirc":106,"./easeInOutCubic":107,"./easeInOutElastic":108,"./easeInOutExpo":109,"./easeInOutQuad":110,"./easeInOutQuart":111,"./easeInOutQuint":112,"./easeInOutSine":113,"./easeInQuad":114,"./easeInQuart":115,"./easeInQuint":116,"./easeInSine":117,"./easeOut":118,"./easeOutBack":119,"./easeOutBounce":120,"./easeOutCirc":121,"./easeOutCubic":122,"./easeOutElastic":123,"./easeOutExpo":124,"./easeOutQuad":125,"./easeOutQuart":126,"./easeOutQuint":127,"./easeOutSine":128,"./linear":130,"./stepEnd":131,"./stepStart":132}],130:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.linear = function (x) { return x; };

},{}],131:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.stepEnd = internal_1.steps(1, 0);

},{"../internal":139}],132:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.stepStart = internal_1.steps(1, 1);

},{"../internal":139}],133:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var css = _dereq_("./internal/cssEasings");
exports.css = css;
var curves = _dereq_("./curves");
var internal_1 = _dereq_("./internal");
exports.cssFunction = internal_1.cssFunction;
exports.cubicBezier = internal_1.cubicBezier;
exports.frames = internal_1.frames;
exports.steps = internal_1.steps;
exports["default"] = curves;

},{"./curves":129,"./internal":139,"./internal/cssEasings":135}],134:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.pi = Math.PI;
exports.tau = 2 * exports.pi;
exports.epsilon = 0.0001;
exports.c1 = 1.70158;
exports.c2 = exports.c1 * 1.525;
exports.c3 = exports.c1 + 1;
exports.c4 = exports.tau / 3;
exports.c5 = exports.tau / 4.5;

},{}],135:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var c = "cubic-bezier";
var s = "steps";
exports.ease = c + "(.25,.1,.25,1)";
exports.easeIn = c + "(.42,0,1,1)";
exports.easeInBack = c + "(.6,-.28,.735,.045)";
exports.easeInCirc = c + "(.6,.04,.98,.335)";
exports.easeInCubic = c + "(.55,.055,.675,.19)";
exports.easeInExpo = c + "(.95,.05,.795,.035)";
exports.easeInOut = c + "(.42,0,.58,1)";
exports.easeInOutBack = c + "(.68,-.55,.265,1.55)";
exports.easeInOutCirc = c + "(.785,.135,.15,.86)";
exports.easeInOutCubic = c + "(.645,.045,.355,1)";
exports.easeInOutExpo = c + "(1,0,0,1)";
exports.easeInOutQuad = c + "(.455,.03,.515,.955)";
exports.easeInOutQuart = c + "(.77,0,.175,1)";
exports.easeInOutQuint = c + "(.86,0,.07,1)";
exports.easeInOutSine = c + "(.445,.05,.55,.95)";
exports.easeInQuad = c + "(.55,.085,.68,.53)";
exports.easeInQuart = c + "(.895,.03,.685,.22)";
exports.easeInQuint = c + "(.755,.05,.855,.06)";
exports.easeInSine = c + "(.47,0,.745,.715)";
exports.easeOut = c + "(0,0,.58,1)";
exports.easeOutBack = c + "(.175,.885,.32,1.275)";
exports.easeOutCirc = c + "(.075,.82,.165,1)";
exports.easeOutCubic = c + "(.215,.61,.355,1)";
exports.easeOutExpo = c + "(.19,1,.22,1)";
exports.easeOutQuad = c + "(.25,.46,.45,.94)";
exports.easeOutQuart = c + "(.165,.84,.44,1)";
exports.easeOutQuint = c + "(.23,1,.32,1)";
exports.easeOutSine = c + "(.39,.575,.565,1)";
exports.elegantSlowStartEnd = c + "(.175,.885,.32,1.275)";
exports.linear = c + "(0,0,1,1)";
exports.stepEnd = s + "(1,0)";
exports.stepStart = s + "(1,1)";

},{}],136:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var index_1 = _dereq_("./index");
var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
var cssFunctionRegex = /^([a-z-]+)\(([^\)]+)\)$/i;
var cssEasings = { ease: index_1.ease, easeIn: index_1.easeIn, easeOut: index_1.easeOut, easeInOut: index_1.easeInOut, stepStart: index_1.stepStart, stepEnd: index_1.stepEnd, linear: index_1.linear };
var camelCaseMatcher = function (match, p1, p2) { return p1 + p2.toUpperCase(); };
var toCamelCase = function (value) { return typeof value === 'string'
    ? value.replace(camelCaseRegex, camelCaseMatcher) : ''; };
var find = function (nameOrCssFunction) {
    var easingName = toCamelCase(nameOrCssFunction);
    var easing = cssEasings[easingName] || nameOrCssFunction;
    var matches = cssFunctionRegex.exec(easing);
    if (!matches) {
        throw new Error('could not parse css function');
    }
    return [matches[1]].concat(matches[2].split(','));
};
exports.cssFunction = function (easingString) {
    var p = find(easingString);
    var fnName = p[0];
    if (fnName === 'steps') {
        return index_1.steps(+p[1], p[2]);
    }
    if (fnName === 'cubic-bezier') {
        return index_1.cubicBezier(+p[1], +p[2], +p[3], +p[4]);
    }
    if (fnName === 'frames') {
        return index_1.frames(+p[1]);
    }
    throw new Error('unknown css function');
};

},{"./index":139}],137:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var index_1 = _dereq_("./index");
var bezier = function (n1, n2, t) {
    return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t;
};
exports.cubicBezier = function (p0, p1, p2, p3) {
    if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
        return function (x) { return x; };
    }
    return function (x) {
        if (x === 0 || x === 1) {
            return x;
        }
        var start = 0;
        var end = 1;
        var limit = 19;
        do {
            var mid = (start + end) * .5;
            var xEst = bezier(p0, p2, mid);
            if (index_1.abs(x - xEst) < index_1.epsilon) {
                return bezier(p1, p3, mid);
            }
            if (xEst < x) {
                start = mid;
            }
            else {
                end = mid;
            }
        } while (--limit);
        return x;
    };
};

},{"./index":139}],138:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var internal_1 = _dereq_("../internal");
exports.frames = function (n) {
    var q = 1 / (n - 1);
    return function (x) {
        var o = internal_1.floor(x * n) * q;
        return x >= 0 && o < 0 ? 0 : x <= 1 && o > 1 ? 1 : o;
    };
};

},{"../internal":139}],139:[function(_dereq_,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(_dereq_("./constants"));
__export(_dereq_("./cssEasings"));
__export(_dereq_("./cssFunction"));
__export(_dereq_("./cubicBezier"));
__export(_dereq_("./frames"));
__export(_dereq_("./math"));
__export(_dereq_("./steps"));

},{"./constants":134,"./cssEasings":135,"./cssFunction":136,"./cubicBezier":137,"./frames":138,"./math":140,"./steps":141}],140:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.abs = Math.abs;
exports.asin = Math.asin;
exports.floor = Math.floor;
exports.cos = Math.cos;
exports.pow = Math.pow;
exports.sin = Math.sin;
exports.sqrt = Math.sqrt;

},{}],141:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports.steps = function (count, pos) {
    var q = count / 1;
    var p = pos === 'end'
        ? 0 : pos === 'start'
        ? 1 : pos || 0;
    return function (x) { return x >= 1 ? 1 : (p * q + x) - (p * q + x) % q; };
};

},{}],142:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function tiny() {
    if (typeof window === 'undefined') {
        return null;
    }
    if (typeof document === 'undefined') {
        return null;
    }
    function setup(doc, a) {
        if (!a.__SV) {
            var b = window;
            try {
                var c;
                var l;
                var i;
                var j = b.location;
                var g = j.hash;
                var cFunc = function cFunc(cFuncA, cFuncB) {
                    return (l = cFuncA.match(RegExp(cFuncB + '=([^&]*)'))) ? l[1] : null;
                };
                g &&
                    cFunc(g, 'state') &&
                    ((i = JSON.parse(decodeURIComponent(cFunc(g, 'state')))),
                        'mpeditor' === i.action &&
                            (b.sessionStorage.setItem('_mpcehash', g),
                                history.replaceState(i.desiredHash || '', doc.title, j.pathname + j.search)));
            }
            catch (exception) {
            }
            var arrayOfWords = [];
            window['mixpanel'] = a;
            a._i = [];
            a.init = function init(initB, initC, initF) {
                function splitterPusher(spArray, spString) {
                    var strParts = spString.split('.');
                    2 == strParts.length && ((spArray = spArray[strParts[0]]), (spString = strParts[1]));
                    spArray[spString] = function () {
                        spArray.push([spString].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                }
                var d = a;
                if ('undefined' !== typeof initF) {
                    d = a[initF] = [];
                }
                else {
                    initF = 'mixpanel';
                }
                d.people = d.people || [];
                d.toString = function toString1(toStringArg) {
                    var mpString = 'mixpanel';
                    'mixpanel' !== initF && (mpString += '.' + initF);
                    toStringArg || (mpString += ' (stub)');
                    return mpString;
                };
                d.people.toString = function toString2() {
                    return d.toString(1) + '.people (stub)';
                };
                arrayOfWords = 'disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user'.split(' ');
                for (var h = 0; h < arrayOfWords.length; h++) {
                    splitterPusher(d, arrayOfWords[h]);
                }
                a._i.push([initB, initC, initF]);
            };
            a.__SV = 1.2;
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.async = !0;
            script.src = ('file:' === doc.location.protocol && '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//))
                ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
                : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
            if (c && c.parentNode) {
                c.parentNode.insertBefore(b, c);
            }
        }
        return a;
    }
    return setup(document, window['mixpanel'] || []);
}
exports["default"] = tiny;

},{}],143:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function hasPreserve3d(window) {
    if (!window)
        return false;
    if (!window.document)
        return false;
    var outerAnchor;
    var innerAnchor;
    var CSS = window.CSS;
    var result = false;
    var tmp;
    if (CSS && CSS.supports && CSS.supports("(transform-style: preserve-3d)")) {
        return true;
    }
    outerAnchor = window.document.createElement("a");
    innerAnchor = window.document.createElement("a");
    outerAnchor.style.cssText =
        "display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);";
    innerAnchor.style.cssText =
        "display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);";
    outerAnchor.appendChild(innerAnchor);
    window.document.documentElement.appendChild(outerAnchor);
    tmp = innerAnchor.getBoundingClientRect();
    window.document.documentElement.removeChild(outerAnchor);
    result = tmp.width && tmp.width < 4;
    return result;
}
exports["default"] = {
    hasPreserve3d: hasPreserve3d
};

},{}],144:[function(_dereq_,module,exports){
(function (process){
"use strict";
exports.__esModule = true;
var getNanoSeconds, hrtime, loadTime;
var invoke;
if (typeof performance !== "undefined" &&
    performance !== null &&
    performance.now) {
    invoke = function () {
        return performance.now();
    };
}
else if (typeof process !== "undefined" &&
    process !== null &&
    process.hrtime) {
    invoke = function () {
        return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function () {
        var hr;
        hr = hrtime();
        return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
}
else if (Date.now) {
    invoke = function () {
        return Date.now() - loadTime;
    };
    loadTime = Date.now();
}
else {
    invoke = function () {
        return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
}
function now() {
    return invoke();
}
exports["default"] = now;

}).call(this,_dereq_('_process'))
},{"_process":1}],145:[function(_dereq_,module,exports){
(function (global){
"use strict";
exports.__esModule = true;
var performance_now_1 = _dereq_("./../performance-now");
var root = typeof window === "undefined" ? global : window;
var vendors = ["moz", "webkit"];
var suffix = "AnimationFrame";
var raf = root["request" + suffix];
var caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
for (var i = 0; !raf && i < vendors.length; i++) {
    raf = root[vendors[i] + "Request" + suffix];
    caf =
        root[vendors[i] + "Cancel" + suffix] ||
            root[vendors[i] + "CancelRequest" + suffix];
}
if (!raf || !caf) {
    var last_1 = 0, id_1 = 0, queue_1 = [], frameDuration_1 = 1000 / 60;
    raf = function (callback) {
        if (queue_1.length === 0) {
            var _now = performance_now_1["default"](), next = Math.max(0, frameDuration_1 - (_now - last_1));
            last_1 = next + _now;
            setTimeout(function () {
                var cp = queue_1.slice(0);
                queue_1.length = 0;
                for (var i = 0; i < cp.length; i++) {
                    if (!cp[i].cancelled) {
                        try {
                            cp[i].callback(last_1);
                        }
                        catch (e) {
                            setTimeout(function () {
                                throw e;
                            }, 0);
                        }
                    }
                }
            }, Math.round(next));
        }
        queue_1.push({
            handle: ++id_1,
            callback: callback,
            cancelled: false
        });
        return id_1;
    };
    caf = function (handle) {
        for (var i = 0; i < queue_1.length; i++) {
            if (queue_1[i].handle === handle) {
                queue_1[i].cancelled = true;
            }
        }
    };
}
function rafCall(fn) {
    return raf.call(root, fn);
}
function cafCall() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return caf.apply(root, args);
}
exports["default"] = {
    request: rafCall,
    cancel: cafCall
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../performance-now":144}],146:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var width = 256;
var chunks = 6;
var digits = 52;
var startdenom = Math.pow(width, chunks);
var significance = Math.pow(2, digits);
var overflow = significance * 2;
var mask = width - 1;
var pool = [];
function seedrandom(seed, options, callback) {
    var key = [];
    var arc4 = new ARC4(key);
    function prng() {
        var n = arc4.g(chunks);
        var d = startdenom;
        var x = 0;
        while (n < significance) {
            n = (n + x) * width;
            d *= width;
            x = arc4.g(1);
        }
        while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
        }
        return (n + x) / d;
    }
    mixkey(tostring(arc4.S), pool);
    return prng;
}
exports["default"] = seedrandom;
function ARC4(key) {
    var t;
    var keylen = key.length;
    var me = this;
    var i = 0;
    var j = me.i = me.j = 0;
    var s = me.S = [];
    if (!keylen) {
        key = [keylen++];
    }
    while (i < width) {
        s[i] = i++;
    }
    for (i = 0; i < width; i++) {
        s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
        s[j] = t;
    }
    (me.g = function g(count) {
        var t;
        var r = 0;
        var i = me.i;
        var j = me.j;
        var s = me.S;
        while (count--) {
            t = s[i = mask & (i + 1)];
            r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }
        me.i = i;
        me.j = j;
        return r;
    })(width);
}
function mixkey(seed, key) {
    var stringseed = seed + "";
    var smear;
    var j = 0;
    while (j < stringseed.length) {
        key[mask & j] =
            mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
    }
    return tostring(key);
}
function tostring(a) {
    return String.fromCharCode.apply(0, a);
}

},{}],147:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var toPath_1 = _dereq_("./toPath");
var toPoints_1 = _dereq_("./toPoints");
var valid_1 = _dereq_("./valid");
exports["default"] = { toPath: toPath_1["default"], toPoints: toPoints_1["default"], valid: valid_1["default"] };

},{"./toPath":148,"./toPoints":149,"./valid":150}],148:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var toPoints_1 = _dereq_("./toPoints");
function pointsToD(p) {
    var d = '';
    var i = 0;
    var firstPoint;
    for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
        var point = p_1[_i];
        var curve = point.curve, moveTo_1 = point.moveTo, x = point.x, y = point.y;
        var isFirstPoint = i === 0 || moveTo_1;
        var isLastPoint = i === p.length - 1 || p[i + 1].moveTo;
        var prevPoint = i === 0 ? null : p[i - 1];
        if (isFirstPoint) {
            firstPoint = point;
            if (!isLastPoint) {
                d += "M" + x + "," + y;
            }
        }
        else if (curve) {
            switch (curve.type) {
                case 'arc':
                    var _a = point.curve, _b = _a.largeArcFlag, largeArcFlag = _b === void 0 ? 0 : _b, rx = _a.rx, ry = _a.ry, _c = _a.sweepFlag, sweepFlag = _c === void 0 ? 0 : _c, _d = _a.xAxisRotation, xAxisRotation = _d === void 0 ? 0 : _d;
                    d += "A" + rx + "," + ry + "," + xAxisRotation + "," + largeArcFlag + "," + sweepFlag + "," + x + "," + y;
                    break;
                case 'cubic':
                    var _e = point.curve, cx1 = _e.x1, cy1 = _e.y1, cx2 = _e.x2, cy2 = _e.y2;
                    d += "C" + cx1 + "," + cy1 + "," + cx2 + "," + cy2 + "," + x + "," + y;
                    break;
                case 'quadratic':
                    var _f = point.curve, qx1 = _f.x1, qy1 = _f.y1;
                    d += "Q" + qx1 + "," + qy1 + "," + x + "," + y;
                    break;
            }
            if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
                d += 'Z';
            }
        }
        else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
            d += 'Z';
        }
        else if (x !== prevPoint.x && y !== prevPoint.y) {
            d += "L" + x + "," + y;
        }
        else if (x !== prevPoint.x) {
            d += "H" + x;
        }
        else if (y !== prevPoint.y) {
            d += "V" + y;
        }
        i++;
    }
    return d;
}
function toPath(s) {
    var isPoints = Array.isArray(s);
    var isGroup = isPoints ? (Array.isArray(s[0])) : (s.type === 'g');
    var points = isPoints ? s : (isGroup ? s.shapes.map(function (shp) { return toPoints_1["default"](shp); }) : toPoints_1["default"](s));
    if (isGroup) {
        return points.map(function (p) { return pointsToD(p); });
    }
    return pointsToD(points);
}
exports["default"] = toPath;

},{"./toPoints":149}],149:[function(_dereq_,module,exports){
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var toPoints = function (spec) {
    switch (spec.type) {
        case 'circle':
            return getPointsFromCircle(spec);
        case 'ellipse':
            return getPointsFromEllipse(spec);
        case 'line':
            return getPointsFromLine(spec);
        case 'path':
            return getPointsFromPath(spec);
        case 'polygon':
            return getPointsFromPolygon(spec);
        case 'polyline':
            return getPointsFromPolyline(spec);
        case 'rect':
            return getPointsFromRect(spec);
        case 'g':
            return getPointsFromG(spec);
        default:
            throw new Error('Not a valid shape type');
    }
};
var getPointsFromCircle = function (_a) {
    var cx = _a.cx, cy = _a.cy, r = _a.r;
    return [
        { x: cx, y: cy - r, moveTo: true },
        { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } },
        { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }
    ];
};
var getPointsFromEllipse = function (_a) {
    var cx = _a.cx, cy = _a.cy, rx = _a.rx, ry = _a.ry;
    return [
        { x: cx, y: cy - ry, moveTo: true },
        { x: cx, y: cy + ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } },
        { x: cx, y: cy - ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }
    ];
};
var getPointsFromLine = function (_a) {
    var x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
    return [
        { x: x1, y: y1, moveTo: true },
        { x: x2, y: y2 }
    ];
};
var validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g;
var commandLengths = {
    A: 7,
    C: 6,
    H: 1,
    L: 2,
    M: 2,
    Q: 4,
    S: 4,
    T: 2,
    V: 1,
    Z: 0
};
var relativeCommands = [
    'a',
    'c',
    'h',
    'l',
    'm',
    'q',
    's',
    't',
    'v'
];
var isRelative = function (command) { return relativeCommands.indexOf(command) !== -1; };
var optionalArcKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag'];
var getCommands = function (d) { return d.match(validCommands); };
var getParams = function (d) { return d.split(validCommands)
    .map(function (v) { return v.replace(/[0-9]+-/g, function (m) { return m.slice(0, -1) + " -"; }); })
    .map(function (v) { return v.replace(/\.[0-9]+/g, function (m) { return m + " "; }); })
    .map(function (v) { return v.trim(); })
    .filter(function (v) { return v.length > 0; })
    .map(function (v) { return v.split(/[ ,]+/)
    .map(parseFloat)
    .filter(function (n) { return !isNaN(n); }); }); };
var getPointsFromPath = function (_a) {
    var d = _a.d;
    var commands = getCommands(d);
    var params = getParams(d);
    var points = [];
    var moveTo;
    for (var i = 0, l = commands.length; i < l; i++) {
        var command = commands[i];
        var upperCaseCommand = command.toUpperCase();
        var commandLength = commandLengths[upperCaseCommand];
        var relative = isRelative(command);
        var prevPoint = i === 0 ? null : points[points.length - 1];
        if (commandLength > 0) {
            var commandParams = params.shift();
            var iterations = commandParams.length / commandLength;
            for (var j = 0; j < iterations; j++) {
                switch (upperCaseCommand) {
                    case 'M':
                        var x = (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift();
                        var y = (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift();
                        moveTo = { x: x, y: y };
                        points.push({ x: x, y: y, moveTo: true });
                        break;
                    case 'L':
                        points.push({
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'H':
                        points.push({
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: prevPoint.y
                        });
                        break;
                    case 'V':
                        points.push({
                            x: prevPoint.x,
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'A':
                        points.push({
                            curve: {
                                type: 'arc',
                                rx: commandParams.shift(),
                                ry: commandParams.shift(),
                                xAxisRotation: commandParams.shift(),
                                largeArcFlag: commandParams.shift(),
                                sweepFlag: commandParams.shift()
                            },
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        for (var _i = 0, optionalArcKeys_1 = optionalArcKeys; _i < optionalArcKeys_1.length; _i++) {
                            var k = optionalArcKeys_1[_i];
                            if (points[points.length - 1]['curve'][k] === 0) {
                                delete points[points.length - 1]['curve'][k];
                            }
                        }
                        break;
                    case 'C':
                        points.push({
                            curve: {
                                type: 'cubic',
                                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                                y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                                x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                                y2: (relative ? prevPoint.y : 0) + commandParams.shift()
                            },
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'S':
                        var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift();
                        var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift();
                        var sx = (relative ? prevPoint.x : 0) + commandParams.shift();
                        var sy = (relative ? prevPoint.y : 0) + commandParams.shift();
                        var diff = { x: null, y: null };
                        var sx1 = void 0;
                        var sy1 = void 0;
                        if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
                            diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2);
                            diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2);
                            sx1 = prevPoint.x < prevPoint.curve.x2 ? prevPoint.x - diff.x : prevPoint.x + diff.x;
                            sy1 = prevPoint.y < prevPoint.curve.y2 ? prevPoint.y - diff.y : prevPoint.y + diff.y;
                        }
                        else {
                            diff.x = Math.abs(sx - sx2);
                            diff.y = Math.abs(sy - sy2);
                            sx1 = prevPoint.x;
                            sy1 = prevPoint.y;
                        }
                        points.push({ curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 }, x: sx, y: sy });
                        break;
                    case 'Q':
                        points.push({
                            curve: {
                                type: 'quadratic',
                                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                                y1: (relative ? prevPoint.y : 0) + commandParams.shift()
                            },
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'T':
                        var tx = (relative ? prevPoint.x : 0) + commandParams.shift();
                        var ty = (relative ? prevPoint.y : 0) + commandParams.shift();
                        var tx1 = void 0;
                        var ty1 = void 0;
                        if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
                            var diff_1 = {
                                x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                                y: Math.abs(prevPoint.y - prevPoint.curve.y1)
                            };
                            tx1 = prevPoint.x < prevPoint.curve.x1 ? prevPoint.x - diff_1.x : prevPoint.x + diff_1.x;
                            ty1 = prevPoint.y < prevPoint.curve.y1 ? prevPoint.y - diff_1.y : prevPoint.y + diff_1.y;
                        }
                        else {
                            tx1 = prevPoint.x;
                            ty1 = prevPoint.y;
                        }
                        points.push({ curve: { type: 'quadratic', x1: tx1, y1: ty1 }, x: tx, y: ty });
                        break;
                }
            }
        }
        else {
            if (prevPoint.x !== moveTo.x || prevPoint.y !== moveTo.y) {
                points.push({ x: moveTo.x, y: moveTo.y });
            }
        }
    }
    return points;
};
var getPointsFromPolygon = function (_a) {
    var points = _a.points;
    return getPointsFromPoints({ closed: true, points: points });
};
var getPointsFromPolyline = function (_a) {
    var points = _a.points;
    return getPointsFromPoints({ closed: false, points: points });
};
var getPointsFromPoints = function (_a) {
    var closed = _a.closed, points = _a.points;
    var numbers = points.split(/[\s,]+/).map(function (n) { return parseFloat(n); });
    var p = numbers.reduce(function (arr, point, i) {
        if (i % 2 === 0) {
            arr.push({ x: point });
        }
        else {
            arr[(i - 1) / 2].y = point;
        }
        return arr;
    }, []);
    if (closed) {
        p.push(__assign({}, p[0]));
    }
    p[0].moveTo = true;
    return p;
};
var getPointsFromRect = function (_a) {
    var height = _a.height, rx = _a.rx, ry = _a.ry, width = _a.width, x = _a.x, y = _a.y;
    if (rx || ry) {
        return getPointsFromRectWithCornerRadius({
            height: height,
            rx: rx || ry,
            ry: ry || rx,
            width: width,
            x: x,
            y: y
        });
    }
    return getPointsFromBasicRect({ height: height, width: width, x: x, y: y });
};
var getPointsFromBasicRect = function (_a) {
    var height = _a.height, width = _a.width, x = _a.x, y = _a.y;
    return [
        { x: x, y: y, moveTo: true },
        { x: x + width, y: y },
        { x: x + width, y: y + height },
        { x: x, y: y + height },
        { x: x, y: y }
    ];
};
var getPointsFromRectWithCornerRadius = function (_a) {
    var height = _a.height, rx = _a.rx, ry = _a.ry, width = _a.width, x = _a.x, y = _a.y;
    var curve = { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 };
    return [
        { x: x + rx, y: y, moveTo: true },
        { x: x + width - rx, y: y },
        { x: x + width, y: y + ry, curve: curve },
        { x: x + width, y: y + height - ry },
        { x: x + width - rx, y: y + height, curve: curve },
        { x: x + rx, y: y + height },
        { x: x, y: y + height - ry, curve: curve },
        { x: x, y: y + ry },
        { x: x + rx, y: y, curve: curve }
    ];
};
var getPointsFromG = function (_a) {
    var shapes = _a.shapes;
    return shapes.map(function (s) { return toPoints(s); });
};
exports["default"] = toPoints;

},{}],150:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var getErrors = function (shape) {
    var rules = getRules(shape);
    var errors = [];
    rules.map(function (_a) {
        var match = _a.match, prop = _a.prop, required = _a.required, type = _a.type;
        if (typeof shape[prop] === 'undefined') {
            if (required) {
                errors.push(prop + " prop is required" + (prop === 'type' ? '' : " on a " + shape.type));
            }
        }
        else {
            if (typeof type !== 'undefined') {
                if (type === 'array') {
                    if (!Array.isArray(shape[prop])) {
                        errors.push(prop + " prop must be of type array");
                    }
                }
                else if (typeof shape[prop] !== type) {
                    errors.push(prop + " prop must be of type " + type);
                }
            }
            if (Array.isArray(match)) {
                if (match.indexOf(shape[prop]) === -1) {
                    errors.push(prop + " prop must be one of " + match.join(', '));
                }
            }
        }
    });
    if (shape.type === 'g' && Array.isArray(shape.shapes)) {
        var childErrors = shape.shapes.map(function (s) { return getErrors(s); });
        return [].concat.apply(errors, childErrors);
    }
    return errors;
};
var getRules = function (shape) {
    var rules = [{
            match: [
                'circle',
                'ellipse',
                'line',
                'path',
                'polygon',
                'polyline',
                'rect',
                'g'
            ],
            prop: 'type',
            required: true,
            type: 'string'
        }];
    switch (shape.type) {
        case 'circle':
            rules.push({ match: null, prop: 'cx', required: true, type: 'number' });
            rules.push({ match: null, prop: 'cy', required: true, type: 'number' });
            rules.push({ match: null, prop: 'r', required: true, type: 'number' });
            break;
        case 'ellipse':
            rules.push({ match: null, prop: 'cx', required: true, type: 'number' });
            rules.push({ match: null, prop: 'cy', required: true, type: 'number' });
            rules.push({ match: null, prop: 'rx', required: true, type: 'number' });
            rules.push({ match: null, prop: 'ry', required: true, type: 'number' });
            break;
        case 'line':
            rules.push({ match: null, prop: 'x1', required: true, type: 'number' });
            rules.push({ match: null, prop: 'x2', required: true, type: 'number' });
            rules.push({ match: null, prop: 'y1', required: true, type: 'number' });
            rules.push({ match: null, prop: 'y2', required: true, type: 'number' });
            break;
        case 'path':
            rules.push({ match: null, prop: 'd', required: true, type: 'string' });
            break;
        case 'polygon':
        case 'polyline':
            rules.push({ match: null, prop: 'points', required: true, type: 'string' });
            break;
        case 'rect':
            rules.push({ match: null, prop: 'height', required: true, type: 'number' });
            rules.push({ match: null, prop: 'rx', type: 'number', required: false });
            rules.push({ match: null, prop: 'ry', type: 'number', required: false });
            rules.push({ match: null, prop: 'width', required: true, type: 'number' });
            rules.push({ match: null, prop: 'x', required: true, type: 'number' });
            rules.push({ match: null, prop: 'y', required: true, type: 'number' });
            break;
        case 'g':
            rules.push({ match: null, prop: 'shapes', required: true, type: 'array' });
            break;
    }
    return rules;
};
var valid = function (shape) {
    var errors = getErrors(shape);
    return {
        errors: errors,
        valid: errors.length === 0
    };
};
exports["default"] = valid;

},{}],151:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var prefixer_1 = _dereq_("./prefixer");
var cssPrefix = prefixer_1["default"](null);
exports["default"] = cssPrefix;

},{"./prefixer":159}],152:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports["default"] = {
    "animation": 1,
    "column-count": 1,
    "columns": 1,
    "font-weight": 1,
    "opacity": 1,
    "order": 1,
    "z-index": 1,
    "zoom": 1,
    "flex": 1,
    "box-flex": 1,
    "transform": 1,
    "perspective": 1,
    "box-pack": 1,
    "box-align": 1,
    "colspan": 1,
    "rowspan": 1
};

},{}],153:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectHasOwn = Object.prototype.hasOwnProperty;
function hasOwn(object, propertyName) {
    return objectHasOwn.call(object, propertyName);
}
exports["default"] = hasOwn;

},{}],154:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var toStyleObject_1 = _dereq_("./toStyleObject");
exports["default"] = {
    object: toStyleObject_1["default"]
};

},{"./toStyleObject":165}],155:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectToString = Object.prototype.toString;
function isFunction(v) {
    return objectToString.apply(v) === "[object Function]";
}
exports["default"] = isFunction;

},{}],156:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var objectToString = Object.prototype.toString;
function isObject(v) {
    return !!v && objectToString.call(v) === "[object Object]";
}
exports["default"] = isObject;

},{}],157:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var toUpperFirst_1 = _dereq_("./stringUtils/toUpperFirst");
var re = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
var docStyle = typeof document === "undefined"
    ? {}
    : document.documentElement.style;
function prefixInfoFn() {
    var prefix = (function () {
        for (var prop in docStyle) {
            if (re.test(prop)) {
                return prop.match(re)[0];
            }
        }
        if ("WebkitOpacity" in docStyle) {
            return "Webkit";
        }
        if ("KhtmlOpacity" in docStyle) {
            return "Khtml";
        }
        return "";
    })();
    var lower = prefix.toLowerCase();
    return {
        style: prefix,
        css: "-" + lower + "-",
        dom: {
            Webkit: "WebKit",
            ms: "MS",
            o: "WebKit"
        }[prefix] || toUpperFirst_1["default"](prefix)
    };
}
var prefixInfo = prefixInfoFn();
exports["default"] = prefixInfo;

},{"./stringUtils/toUpperFirst":164}],158:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
exports["default"] = {
    "border-radius": 1,
    "border-top-left-radius": 1,
    "border-top-right-radius": 1,
    "border-bottom-left-radius": 1,
    "border-bottom-right-radius": 1,
    "box-shadow": 1,
    "order": 1,
    "flex": function flex(name, prefix) {
        return [prefix + "box-flex"];
    },
    "box-flex": 1,
    "box-align": 1,
    "animation": 1,
    "animation-duration": 1,
    "animation-name": 1,
    "transition": 1,
    "transition-duration": 1,
    "transform": 1,
    "transform-style": 1,
    "transform-origin": 1,
    "backface-visibility": 1,
    "perspective": 1,
    "box-pack": 1
};

},{}],159:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var camelize_1 = _dereq_("./stringUtils/camelize");
var hyphenate_1 = _dereq_("./stringUtils/hyphenate");
var toLowerFirst_1 = _dereq_("./stringUtils/toLowerFirst");
var toUpperFirst_1 = _dereq_("./stringUtils/toUpperFirst");
var prefixInfo_1 = _dereq_("./prefixInfo");
var prefixProperties_1 = _dereq_("./prefixProperties");
var docStyle = typeof document === "undefined"
    ? {}
    : document.documentElement.style;
function prefixer(asStylePrefix) {
    return function (name, config) {
        config = config || {};
        var styleName = toLowerFirst_1["default"](camelize_1["default"](name));
        var cssName = hyphenate_1["default"](name);
        var theName = asStylePrefix ? styleName : cssName;
        var thePrefix = prefixInfo_1["default"].style
            ? asStylePrefix ? prefixInfo_1["default"].style : prefixInfo_1["default"].css
            : "";
        if (styleName in docStyle) {
            return config.asString ? theName : [theName];
        }
        var upperCased = theName;
        var prefixProperty = prefixProperties_1["default"][cssName];
        var result = [];
        if (asStylePrefix) {
            upperCased = toUpperFirst_1["default"](theName);
        }
        if (typeof prefixProperty === "function") {
            var prefixedCss = prefixProperty(theName, thePrefix) || [];
            if (prefixedCss && !Array.isArray(prefixedCss)) {
                prefixedCss = [prefixedCss];
            }
            if (prefixedCss.length) {
                prefixedCss = prefixedCss.map(function (property) {
                    return asStylePrefix
                        ? toLowerFirst_1["default"](camelize_1["default"](property))
                        : hyphenate_1["default"](property);
                });
            }
            result = result.concat(prefixedCss);
        }
        if (thePrefix) {
            result.push(thePrefix + upperCased);
        }
        result.push(theName);
        if (config.asString || result.length === 1) {
            return result[0];
        }
        return result;
    };
}
exports["default"] = prefixer;

},{"./prefixInfo":157,"./prefixProperties":158,"./stringUtils/camelize":160,"./stringUtils/hyphenate":161,"./stringUtils/toLowerFirst":163,"./stringUtils/toUpperFirst":164}],160:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var hyphenRe = /[-\s]+(.)?/g;
function toCamelFn(str, letter) {
    return letter ? letter.toUpperCase() : "";
}
function camelize(str) {
    return str ? str.replace(hyphenRe, toCamelFn) : "";
}
exports["default"] = camelize;

},{}],161:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var separate_1 = _dereq_("./separate");
function hyphenate(name) {
    return separate_1["default"](name, null).toLowerCase();
}
exports["default"] = hyphenate;

},{"./separate":162}],162:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var doubleColonRe = /::/g;
var upperToLowerRe = /([A-Z]+)([A-Z][a-z])/g;
var lowerToUpperRe = /([a-z\d])([A-Z])/g;
var underscoreToDashRe = /_/g;
function separate(name, separator) {
    return name
        ? name
            .replace(doubleColonRe, "/")
            .replace(upperToLowerRe, "$1_$2")
            .replace(lowerToUpperRe, "$1_$2")
            .replace(underscoreToDashRe, separator || "-")
        : "";
}
exports["default"] = separate;

},{}],163:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function toLowerFirst(value) {
    return value.length
        ? value.charAt(0).toLowerCase() + value.substring(1)
        : value;
}
exports["default"] = toLowerFirst;

},{}],164:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function toUpperFirst(value) {
    return value.length
        ? value.charAt(0).toUpperCase() + value.substring(1)
        : value;
}
exports["default"] = toUpperFirst;

},{}],165:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
var cssPrefix_1 = _dereq_("./cssPrefix");
var hyphenate_1 = _dereq_("./stringUtils/hyphenate");
var camelize_1 = _dereq_("./stringUtils/camelize");
var hasOwn_1 = _dereq_("./hasOwn");
var isObject_1 = _dereq_("./isObject");
var isFunction_1 = _dereq_("./isFunction");
function applyPrefix(target, property, value, normalizeFn) {
    cssPrefix_1["default"](property, null).forEach(function (p) {
        target[normalizeFn ? normalizeFn(p) : p] = value;
    });
}
function toObject(str) {
    str = (str || "").split(";");
    var result = {};
    str.forEach(function (item) {
        var split = item.split(":");
        if (split.length === 2) {
            result[split[0].trim()] = split[1].trim();
        }
    });
    return result;
}
var CONFIG = {
    cssUnitless: _dereq_("./cssUnitless")
};
function _notUndef(thing) {
    return thing !== null && thing !== undefined;
}
function toStyleObject(styles, config, prepend, result) {
    if (typeof styles === "string") {
        styles = toObject(styles);
    }
    config = config || CONFIG;
    config.cssUnitless = config.cssUnitless || CONFIG.cssUnitless;
    result = result || {};
    var scope = config.scope || {};
    var addUnits = _notUndef(config.addUnits)
        ? config.addUnits
        : scope && _notUndef(scope.addUnits) ? scope.addUnits : true;
    var cssUnitless = (_notUndef(config.cssUnitless)
        ? config.cssUnitless
        : scope ? scope.cssUnitless : null) || {};
    var cssUnit = (config.cssUnit || scope ? scope.cssUnit : null) || "px";
    var prefixProperties = config.prefixProperties || (scope ? scope.prefixProperties : null) || {};
    var camelize = config.camelize;
    var normalizeFn = camelize ? camelize_1["default"] : hyphenate_1["default"];
    var processed, styleName, propName, propValue, propType, propIsNumber, fnPropValue, prefix;
    for (propName in styles) {
        if (hasOwn_1["default"](styles, propName)) {
            propValue = styles[propName];
            styleName = hyphenate_1["default"](prepend ? prepend + propName : propName);
            processed = false;
            prefix = false;
            if (isFunction_1["default"](propValue)) {
                fnPropValue = propValue.call(scope || styles, propValue, propName, styleName, styles);
                if (isObject_1["default"](fnPropValue) && fnPropValue.value != null) {
                    propValue = fnPropValue.value;
                    prefix = fnPropValue.prefix;
                    styleName = fnPropValue.name ? hyphenate_1["default"](fnPropValue.name) : styleName;
                }
                else {
                    propValue = fnPropValue;
                }
            }
            propType = typeof propValue;
            propIsNumber =
                propType === "number" ||
                    (propType === "string" &&
                        propValue !== "" &&
                        propValue * 1 === propValue);
            if (propValue === null ||
                propValue === undefined ||
                styleName === null ||
                styleName === undefined ||
                styleName === "") {
                continue;
            }
            if (propIsNumber || propType === "string") {
                processed = true;
            }
            if (!processed && _notUndef(propValue.value) && propValue.prefix) {
                processed = true;
                prefix = propValue.prefix;
                propValue = propValue.value;
            }
            if (processed) {
                prefix = prefix || !!prefixProperties[styleName];
                if (propIsNumber) {
                    propValue = addUnits && !(styleName in cssUnitless)
                        ? propValue + cssUnit
                        : propValue + "";
                }
                if ((styleName === "border" ||
                    (!styleName.indexOf("border") &&
                        !~styleName.indexOf("radius") &&
                        !~styleName.indexOf("width"))) &&
                    propIsNumber) {
                    styleName = styleName + "-width";
                }
                if (!styleName.indexOf("border-radius-")) {
                    styleName.replace(/border(-radius)(-(.*))/, function (str, radius, theRest) {
                        var positions = {
                            "-top": ["-top-left", "-top-right"],
                            "-left": ["-top-left", "-bottom-left"],
                            "-right": ["-top-right", "-bottom-right"],
                            "-bottom": ["-bottom-left", "-bottom-right"]
                        };
                        if (theRest in positions) {
                            styleName = [];
                            positions[theRest].forEach(function (pos) {
                                styleName.push("border" + pos + radius);
                            });
                        }
                        else {
                            styleName = "border" + theRest + radius;
                        }
                    });
                    if (Array.isArray(styleName)) {
                        styleName.forEach(function (styleName) {
                            if (prefix) {
                                applyPrefix(result, styleName, propValue, normalizeFn);
                            }
                            else {
                                result[normalizeFn(styleName)] = propValue;
                            }
                        });
                        continue;
                    }
                }
                if (prefix) {
                    applyPrefix(result, styleName, propValue, normalizeFn);
                }
                else {
                    result[normalizeFn(styleName)] = propValue;
                }
            }
            else {
                toStyleObject(propValue, config, styleName + "-", result);
            }
        }
    }
    return result;
}
exports["default"] = toStyleObject;

},{"./cssPrefix":151,"./cssUnitless":152,"./hasOwn":153,"./isFunction":155,"./isObject":156,"./stringUtils/camelize":160,"./stringUtils/hyphenate":161}],166:[function(_dereq_,module,exports){
"use strict";
exports.__esModule = true;
function parse(xml) {
    xml = xml.trim();
    xml = xml.replace(/<!--[\s\S]*?-->/g, "");
    return document();
    function document() {
        return {
            declaration: declaration(),
            root: tag()
        };
    }
    function declaration() {
        var m = match(/^<\?xml\s*/);
        if (!m)
            return;
        var node = {
            attributes: {}
        };
        while (!(eos() || is("?>"))) {
            var attr = attribute();
            if (!attr)
                return node;
            node.attributes[attr.name] = attr.value;
        }
        match(/\?>\s*/);
        return node;
    }
    function tag() {
        var m = match(/^<([\w-:.]+)\s*/);
        if (!m)
            return;
        var node = {
            name: m[1],
            attributes: {},
            children: [],
            content: null
        };
        while (!(eos() || is(">") || is("?>") || is("/>"))) {
            var attr = attribute();
            if (!attr)
                return node;
            node.attributes[attr.name] = attr.value;
        }
        if (match(/^\s*\/>\s*/)) {
            return node;
        }
        match(/\??>\s*/);
        node.content = content();
        var child = tag();
        while (child) {
            node.children.push(child);
            child = tag();
        }
        match(/^<\/[\w-:.]+>\s*/);
        return node;
    }
    function content() {
        var m = match(/^([^<]*)/);
        if (m)
            return m[1];
        return "";
    }
    function attribute() {
        var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m)
            return;
        return { name: m[1], value: strip(m[2]) };
    }
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, "");
    }
    function match(re) {
        var m = xml.match(re);
        if (!m)
            return;
        xml = xml.slice(m[0].length);
        return m;
    }
    function eos() {
        return xml.length === 0;
    }
    function is(prefix) {
        return xml.indexOf(prefix) === 0;
    }
}
exports["default"] = parse;

},{}],167:[function(_dereq_,module,exports){
module.exports={
  "name": "@haiku/player",
  "version": "2.3.5",
  "description": "Haiku Player is a JavaScript library for building user interfaces",
  "homepage": "https://haiku.ai",
  "directories": {
    "lib": "lib",
    "dom": "dom",
    "components": "components",
    "dist": "dist"
  },
  "keywords": [
    "animation",
    "motion",
    "component",
    "web",
    "browser",
    "svg",
    "rendering",
    "engine"
  ],
  "engines": {
    "node": "8.4.0",
    "npm": "5.3.0",
    "yarn": "1.0.2",
    "electron": "1.7.0"
  },
  "repository": "https://github.com/HaikuTeam/player",
  "main": "index.js",
  "scripts": {
    "develop": "node ./develop.js",
    "compile": "tsc",
    "lint": "tslint -c tslint.json 'src/**/*.ts' --exclude 'src/vendor/**' --format stylish --fix",
    "test": "yarn run test:unit && yarn run test:api && yarn run test:perf",
    "test:perf": "yarn run compile && tape \"test/perf/**/*.test.js\" | tap-spec || true",
    "test:api": "yarn run compile && tape \"test/api/**/*.test.js\" | tap-spec || true",
    "test:render": "yarn run compile && tape \"test/render/**/*.test.js\" | tap-spec || true",
    "test:unit": "yarn run compile && tape \"test/unit/**/*.test.js\" | tap-spec || true",
    "depcheck": "depcheck ."
  },
  "authors": [
    "Matthew Trost <matthew@haiku.ai>",
    "Zack Brown <zack@haiku.ai>",
    "Taylor Poe <taylor@haiku.ai>"
  ],
  "license": "UNLICENSED",
  "devDependencies": {
    "@types/node": "^8.0.27",
    "async": "^2.5.0",
    "browserify": "^14.1.0",
    "chokidar": "^1.7.0",
    "depcheck": "^0.6.7",
    "express": "4.14.1",
    "filesize": "3.5.10",
    "fs-extra": "2.0.0",
    "handlebars": "4.0.6",
    "jsdom": "9.11.0",
    "leaked-handles": "^5.2.0",
    "nodemon": "1.11.0",
    "opn": "^5.1.0",
    "react-dom": "15.4.2",
    "react-router-dom": "^4.1.1",
    "snazzy": "6.0.0",
    "standard": "8.6.0",
    "tap-spec": "^4.1.1",
    "tape": "^4.7.0",
    "tslint": "^5.7.0",
    "typescript": "^2.5.2",
    "uglify-js": "^2.7.5"
  },
  "dependencies": {
    "lodash": "^4.17.4",
    "react": "15.4.2"
  },
  "peerDependencies": {
    "react": "15.4.2",
    "react-dom": "15.4.2"
  }
}

},{}]},{},[13])(13)
});