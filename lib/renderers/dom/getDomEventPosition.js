"use strict";
exports.__esModule = true;
function getDomEventPosition(event, doc) {
    var x = -1;
    var y = -1;
    if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
    }
    else if (event.clientX || event.clientY) {
        x = event.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft;
        y = event.clientY + doc.body.scrollTop + doc.documentElement.scrollTop;
    }
    return {
        x: ~~x,
        y: ~~y
    };
}
exports["default"] = getDomEventPosition;
//# sourceMappingURL=getDomEventPosition.js.map