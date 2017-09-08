var HaikuContext = require("./../../HaikuContext");
var HaikuDOMRendererClass = require("./../../renderers/dom");
var PLAYER_VERSION = require("./../../../package.json").version;
var IS_WINDOW_DEFINED = typeof window !== "undefined";
function HaikuDOMAdapter(bytecode, config, safeWindow) {
    if (!config)
        config = {};
    if (!config.options)
        config.options = {};
    if (!safeWindow) {
        if (IS_WINDOW_DEFINED) {
            safeWindow = window;
        }
    }
    if (config.options.useWebkitPrefix === undefined) {
        if (safeWindow && safeWindow.document) {
            var isWebKit = "WebkitAppearance" in safeWindow.document.documentElement.style;
            config.options.useWebkitPrefix = !!isWebKit;
        }
    }
    return HaikuContext.createComponentFactory(HaikuDOMRendererClass, bytecode, config, safeWindow);
}
if (IS_WINDOW_DEFINED) {
    if (!window.HaikuPlayer) {
        window.HaikuPlayer = {};
    }
    window.HaikuPlayer[PLAYER_VERSION] = HaikuDOMAdapter;
}
module.exports = HaikuDOMAdapter;
