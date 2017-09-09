"use strict";
exports.__esModule = true;
var color_string_1 = require("./../vendor/color-string");
var STRING = "string";
var OBJECT = "object";
function parseString(str) {
    if (!str)
        return null;
    if (typeof str === OBJECT)
        return str;
    if (str.trim().slice(0, 3) === "url")
        return str;
    var desc = color_string_1["default"]["get"](str);
    return desc;
}
function generateString(desc) {
    if (typeof desc === STRING)
        return desc;
    if (!desc)
        return "none";
    var str = color_string_1["default"]["to"][desc.model](desc.value);
    return str;
}
exports["default"] = {
    parseString: parseString,
    generateString: generateString
};
//# sourceMappingURL=ColorUtils.js.map