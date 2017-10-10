"use strict";
exports.__esModule = true;
var Config_1 = require("./Config");
var HaikuClock_1 = require("./HaikuClock");
var HaikuComponent_1 = require("./HaikuComponent");
var PRNG_1 = require("./helpers/PRNG");
var assign_1 = require("./vendor/assign");
var pkg = require("./../package.json");
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
    if (!this.component._isDeactivated() && !this.component._isAsleep()) {
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
//# sourceMappingURL=HaikuContext.js.map