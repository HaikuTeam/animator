"use strict";
exports.__esModule = true;
var toStyleObject_1 = require("./toStyleObject");
var hasOwn_1 = require("./hasOwn");
function toStyleString(styles, config) {
    styles = toStyleObject_1["default"](styles, config, null, null);
    var result = [];
    var prop;
    for (prop in styles) {
        if (hasOwn_1["default"](styles, prop)) {
            result.push(prop + ": " + styles[prop]);
        }
    }
    return result.join("; ");
}
exports["default"] = toStyleString;
//# sourceMappingURL=toStyleString.js.map