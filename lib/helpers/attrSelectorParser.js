"use strict";
exports.__esModule = true;
var ATTR_EXEC_RE = /\[([a-zA-Z0-9]+)([$|^~])?(=)?"?(.+?)?"?( i)?]/;
function attrSelectorParser(selector) {
    var matches = ATTR_EXEC_RE.exec(selector);
    if (!matches)
        return null;
    return {
        key: matches[1],
        operator: matches[3] && (matches[2] || "") + matches[3],
        value: matches[4],
        insensitive: !!matches[5]
    };
}
exports["default"] = attrSelectorParser;
//# sourceMappingURL=attrSelectorParser.js.map