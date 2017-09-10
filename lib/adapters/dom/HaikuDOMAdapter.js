"use strict";
exports.__esModule = true;
var HaikuContext_1 = require("./../../HaikuContext");
var dom_1 = require("./../../renderers/dom");
var pkg = require("./../../../package.json");
var PLAYER_VERSION = pkg.version;
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
    return HaikuContext_1["default"]["createComponentFactory"](dom_1["default"], bytecode, config, safeWindow);
}
exports["default"] = HaikuDOMAdapter;
if (IS_WINDOW_DEFINED) {
    if (!window["HaikuPlayer"]) {
        window["HaikuPlayer"] = {};
    }
    window["HaikuPlayer"][PLAYER_VERSION] = HaikuDOMAdapter;
}
//# sourceMappingURL=HaikuDOMAdapter.js.map