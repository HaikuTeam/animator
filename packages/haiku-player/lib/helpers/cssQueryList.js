"use strict";
exports.__esModule = true;
var cssMatchOne_1 = require("./cssMatchOne");
var PIECE_SEPARATOR = ',';
function queryList(matches, list, query, options) {
    var maxdepth = options.maxdepth !== undefined
        ? parseInt(options.maxdepth, 10)
        : Infinity;
    var pieces = query.split(PIECE_SEPARATOR);
    for (var i = 0; i < pieces.length; i++) {
        var piece = pieces[i].trim();
        for (var j = 0; j < list.length; j++) {
            var node = list[j];
            if (node.__depth <= maxdepth) {
                if (cssMatchOne_1["default"](node, piece, options)) {
                    matches.push(node);
                }
            }
        }
    }
}
exports["default"] = queryList;
//# sourceMappingURL=cssQueryList.js.map