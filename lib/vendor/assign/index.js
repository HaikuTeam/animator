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
//# sourceMappingURL=index.js.map