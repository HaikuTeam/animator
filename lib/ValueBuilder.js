"use strict";
exports.__esModule = true;
var HaikuHelpers_1 = require("./HaikuHelpers");
var BasicUtils_1 = require("./helpers/BasicUtils");
var parsers_1 = require("./properties/dom/parsers");
var schema_1 = require("./properties/dom/schema");
var enhance_1 = require("./reflection/enhance");
var Transitions_1 = require("./Transitions");
var assign_1 = require("./vendor/assign");
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
//# sourceMappingURL=ValueBuilder.js.map