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
//# sourceMappingURL=has.js.map