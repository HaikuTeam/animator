var formatTransform = require("./formatTransform");
var isEqualTransformString = require("./isEqualTransformString");
function setStyleMatrix(styleObject, format, matrix, usePrefix, devicePixelRatio) {
    var matrixString = formatTransform(matrix, format, devicePixelRatio);
    if (usePrefix) {
        if (!isEqualTransformString(styleObject.webkitTransform, matrixString)) {
            styleObject.webkitTransform = matrixString;
        }
    }
    else {
        if (!isEqualTransformString(styleObject.transform, matrixString)) {
            styleObject.transform = matrixString;
        }
    }
    return styleObject;
}
module.exports = setStyleMatrix;
