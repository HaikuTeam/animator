"use strict";
exports.__esModule = true;
var enhance_1 = require("./enhance");
function inject() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var fn = args.shift();
    if (typeof fn !== 'function') {
        console.warn('[haiku player] Inject expects a function as the first argument');
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
//# sourceMappingURL=inject.js.map