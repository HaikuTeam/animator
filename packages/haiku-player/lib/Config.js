var assign = require("./vendor/assign");
var Config = {};
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
function _seed() {
    return Math.random().toString(36).slice(2);
}
function _build() {
    var config = {};
    var args = [];
    for (var i = 0; i < arguments.length; i++)
        args[i] = arguments[i];
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
            config.options = assign({}, config.options, incoming.options);
        for (var key in incoming) {
            if (incoming[key] !== undefined && DEFAULTS.options.hasOwnProperty(key)) {
                config.options[key] = incoming[key];
            }
        }
        if (incoming.states)
            config.states = assign({}, config.states, incoming.states);
        if (incoming.initialStates && typeof incoming.initialStates === "object") {
            assign(config.states, incoming.initialStates);
        }
        if (incoming.eventHandlers)
            config.eventHandlers = assign({}, config.eventHandlers, incoming.eventHandlers);
        if (incoming.timelines)
            config.timelines = assign({}, config.timelines, incoming.timelines);
        if (incoming.vanities)
            config.vanities = assign({}, config.vanities, incoming.vanities);
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
Config.DEFAULTS = DEFAULTS;
Config.build = _build;
Config.seed = _seed;
module.exports = Config;
