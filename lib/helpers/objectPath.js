"use strict";
exports.__esModule = true;
var STRING = "string";
function objectPath(obj, key) {
    if (typeof key === STRING)
        return obj[key];
    var base = obj;
    for (var i = 0; i < key.length; i++) {
        var name_1 = key[i];
        base = base[name_1];
    }
    return base;
}
exports["default"] = objectPath;
//# sourceMappingURL=objectPath.js.map