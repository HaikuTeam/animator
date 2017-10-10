"use strict";
exports.__esModule = true;
var Config_1 = require("./Config");
var HaikuTimeline_1 = require("./HaikuTimeline");
var addElementToHashTable_1 = require("./helpers/addElementToHashTable");
var applyPropertyToElement_1 = require("./helpers/applyPropertyToElement");
var cssQueryTree_1 = require("./helpers/cssQueryTree");
var scopifyElements_1 = require("./helpers/scopifyElements");
var SimpleEventEmitter_1 = require("./helpers/SimpleEventEmitter");
var upgradeBytecodeInPlace_1 = require("./helpers/upgradeBytecodeInPlace");
var Layout3D_1 = require("./Layout3D");
var ValueBuilder_1 = require("./ValueBuilder");
var assign_1 = require("./vendor/assign");
var pkg = require("./../package.json");
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
    this._alwaysFlush = false;
    this._lastTemplateExpansion = null;
    this._lastDeltaPatches = null;
    this._matchedElementCache = {};
    this._renderScopes = {};
    this._doesEmitEventsVerbosely = false;
    this._frameEventListeners = {};
    this._nestedComponentElements = {};
    this._hashTableOfIdsToElements = {};
    this._registeredElementEventListeners = {};
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
    this._sleeping = false;
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
HaikuComponent.prototype.set = function set(key, value) {
    this.state[key] = value;
    return this;
};
HaikuComponent.prototype.get = function get(key) {
    return this.state[key];
};
HaikuComponent.prototype.setState = function setState(states) {
    if (!states)
        return this;
    if (typeof states !== "object")
        return this;
    for (var key in states) {
        this.set(key, states[key]);
    }
    return this;
};
HaikuComponent.prototype._clearCaches = function _clearCaches(options) {
    this._states = {};
    _bindStates(this._states, this, this.config.states);
    if (options && options.clearPreviouslyRegisteredEventListeners) {
        for (var flexId in this._registeredElementEventListeners) {
            for (var eventName in this._registeredElementEventListeners[flexId]) {
                var _a = this._registeredElementEventListeners[flexId][eventName], target = _a.target, handler = _a.handler;
                if (target && handler && this._context._renderer.removeListener) {
                    this._context._renderer.removeListener(target, handler, eventName);
                }
                delete this._registeredElementEventListeners[flexId][eventName];
            }
        }
    }
    _bindEventHandlers(this, this.config.eventHandlers);
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
HaikuComponent.prototype._isDeactivated = function _isDeactivated() {
    return this._deactivated;
};
HaikuComponent.prototype._sleepOn = function _sleepOn() {
    this._sleeping = true;
    return this;
};
HaikuComponent.prototype._sleepOff = function _sleepOff() {
    this._sleeping = false;
    return this;
};
HaikuComponent.prototype._isAsleep = function _isAsleep() {
    return this._sleeping;
};
HaikuComponent.prototype._hasRegisteredListenerOnElement = function _hasRegisteredListenerOnElement(virtualElement, eventName, listenerFunction) {
    var flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
    if (!flexId)
        return false;
    return this._registeredElementEventListeners[flexId] && this._registeredElementEventListeners[flexId][eventName];
};
HaikuComponent.prototype._markDidRegisterListenerOnElement = function _markDidRegisterListenerOnElement(virtualElement, domElement, eventName, listenerFunction) {
    var flexId = virtualElement.attributes[HAIKU_ID_ATTRIBUTE] || virtualElement.attributes.id;
    if (!flexId)
        return this;
    if (!this._registeredElementEventListeners[flexId])
        this._registeredElementEventListeners[flexId] = {};
    this._registeredElementEventListeners[flexId][eventName] = {
        handler: listenerFunction,
        target: domElement
    };
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
            _bindEventHandler(component, eventHandlerDescriptor, selector, eventName);
        }
    }
}
function _bindEventHandler(component, eventHandlerDescriptor, selector, eventName) {
    if (eventHandlerDescriptor.original) {
        eventHandlerDescriptor.handler = eventHandlerDescriptor.original;
    }
    eventHandlerDescriptor.original = eventHandlerDescriptor.handler;
    eventHandlerDescriptor.handler = function _wrappedEventHandler(event, a, b, c, d, e, f, g, h, i, j, k) {
        if (component.config.options.interactionMode.type === "live") {
            component._anyEventChange = true;
            if (!component._eventsFired[selector]) {
                component._eventsFired[selector] = {};
            }
            component._eventsFired[selector][eventName] =
                event || true;
            eventHandlerDescriptor.original.call(component, event, a, b, c, d, e, f, g, h, i, j, k);
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
    return this._needsFullFlush || this._alwaysFlush;
};
HaikuComponent.prototype._alwaysFlushYes = function _alwaysFlushYes() {
    this._alwaysFlush = true;
    return this;
};
HaikuComponent.prototype._alwaysFlushNo = function _alwaysFlushNo() {
    this._alwaysFlush = false;
    return this;
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
//# sourceMappingURL=HaikuComponent.js.map