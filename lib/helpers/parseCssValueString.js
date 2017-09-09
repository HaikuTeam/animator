"use strict";
exports.__esModule = true;
function parseCssValueString(str, optionalPropertyHint) {
    if (typeof str === "number") {
        return {
            value: str,
            unit: null
        };
    }
    if (str === null || str === undefined) {
        return {
            value: null,
            unit: null
        };
    }
    var num;
    var nmatch = str.match(/([+-]?[\d|.]+)/);
    if (nmatch)
        num = Number(nmatch[0]);
    else
        num = 0;
    var unit;
    var smatch = str.match(/(em|px|%|turn|deg|in)/);
    if (smatch) {
        unit = smatch[0];
    }
    else {
        if (optionalPropertyHint && optionalPropertyHint.match(/rotate/)) {
            unit = "deg";
        }
        else {
            unit = null;
        }
    }
    return {
        value: num,
        unit: unit
    };
}
exports["default"] = parseCssValueString;
//# sourceMappingURL=parseCssValueString.js.map