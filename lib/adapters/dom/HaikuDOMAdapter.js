"use strict";
exports.__esModule = true;
var HaikuContext_1 = require("./../../HaikuContext");
var dom_1 = require("./../../renderers/dom");
var pkg = require("./../../../package.json");
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
//# sourceMappingURL=HaikuDOMAdapter.js.map