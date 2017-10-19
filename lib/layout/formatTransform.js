"use strict";
exports.__esModule = true;
var TRANSFORM_SUFFIX = ')';
var TRANSFORM_ZERO = '0';
var TRANSFORM_COMMA = ',';
var TRANSFORM_ZILCH = TRANSFORM_ZERO + TRANSFORM_COMMA;
var TWO = 2;
var THREE = 3;
function formatTransform(transform, format, devicePixelRatio) {
    transform[12] =
        Math.round(transform[12] * devicePixelRatio) / devicePixelRatio;
    transform[13] =
        Math.round(transform[13] * devicePixelRatio) / devicePixelRatio;
    var prefix;
    var last;
    if (format === TWO) {
        var two = [
            transform[0],
            transform[1],
            transform[4],
            transform[5],
            transform[12],
            transform[13],
        ];
        transform = two;
        prefix = 'matrix(';
        last = 5;
    }
    else if (format === THREE) {
        prefix = 'matrix3d(';
        last = 15;
    }
    prefix += (transform[0] < 0.000001 && transform[0] > -0.000001) ? TRANSFORM_ZILCH : transform[0] + TRANSFORM_COMMA;
    prefix += (transform[1] < 0.000001 && transform[1] > -0.000001) ? TRANSFORM_ZILCH : transform[1] + TRANSFORM_COMMA;
    prefix += (transform[2] < 0.000001 && transform[2] > -0.000001) ? TRANSFORM_ZILCH : transform[2] + TRANSFORM_COMMA;
    prefix += (transform[3] < 0.000001 && transform[3] > -0.000001) ? TRANSFORM_ZILCH : transform[3] + TRANSFORM_COMMA;
    prefix += (transform[4] < 0.000001 && transform[4] > -0.000001) ? TRANSFORM_ZILCH : transform[4] + TRANSFORM_COMMA;
    if (last > 5) {
        prefix += (transform[5] < 0.000001 && transform[5] > -0.000001)
            ? TRANSFORM_ZILCH : transform[5] + TRANSFORM_COMMA;
        prefix += (transform[6] < 0.000001 && transform[6] > -0.000001)
            ? TRANSFORM_ZILCH : transform[6] + TRANSFORM_COMMA;
        prefix += (transform[7] < 0.000001 && transform[7] > -0.000001)
            ? TRANSFORM_ZILCH : transform[7] + TRANSFORM_COMMA;
        prefix += (transform[8] < 0.000001 && transform[8] > -0.000001)
            ? TRANSFORM_ZILCH : transform[8] + TRANSFORM_COMMA;
        prefix += (transform[9] < 0.000001 && transform[9] > -0.000001)
            ? TRANSFORM_ZILCH : transform[9] + TRANSFORM_COMMA;
        prefix += (transform[10] < 0.000001 && transform[10] > -0.000001)
            ? TRANSFORM_ZILCH : transform[10] + TRANSFORM_COMMA;
        prefix += (transform[11] < 0.000001 && transform[11] > -0.000001)
            ? TRANSFORM_ZILCH : transform[11] + TRANSFORM_COMMA;
        prefix += (transform[12] < 0.000001 && transform[12] > -0.000001)
            ? TRANSFORM_ZILCH : transform[12] + TRANSFORM_COMMA;
        prefix += (transform[13] < 0.000001 && transform[13] > -0.000001)
            ? TRANSFORM_ZILCH : transform[13] + TRANSFORM_COMMA;
        prefix += (transform[14] < 0.000001 && transform[14] > -0.000001)
            ? TRANSFORM_ZILCH : transform[14] + TRANSFORM_COMMA;
    }
    prefix += transform[last] + TRANSFORM_SUFFIX;
    return prefix;
}
exports["default"] = formatTransform;
//# sourceMappingURL=formatTransform.js.map