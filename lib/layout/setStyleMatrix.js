"use strict";
exports.__esModule = true;
var formatTransform_1 = require("./formatTransform");
var isEqualTransformString_1 = require("./isEqualTransformString");
function setStyleMatrix(styleObject, format, matrix, usePrefix, devicePixelRatio) {
    var matrixString = formatTransform_1["default"](matrix, format, devicePixelRatio);
    if (usePrefix) {
        if (!isEqualTransformString_1["default"](styleObject.webkitTransform, matrixString)) {
            styleObject.webkitTransform = matrixString;
        }
    }
    else {
        if (!isEqualTransformString_1["default"](styleObject.transform, matrixString)) {
            styleObject.transform = matrixString;
        }
    }
    return styleObject;
}
exports["default"] = setStyleMatrix;
//# sourceMappingURL=setStyleMatrix.js.map