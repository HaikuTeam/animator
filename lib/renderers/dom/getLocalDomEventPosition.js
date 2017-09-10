"use strict";
exports.__esModule = true;
var getDomEventPosition_1 = require("./getDomEventPosition");
function getLocalDomEventPosition(event, element) {
    var doc = element.ownerDocument;
    var viewPosition = getDomEventPosition_1["default"](event, doc);
    var elementRect = element.getBoundingClientRect();
    var x = viewPosition.x - elementRect.left;
    var y = viewPosition.y - elementRect.top;
    return {
        x: ~~x,
        y: ~~y,
        pageX: viewPosition.x,
        pageY: viewPosition.y
    };
}
exports["default"] = getLocalDomEventPosition;
//# sourceMappingURL=getLocalDomEventPosition.js.map