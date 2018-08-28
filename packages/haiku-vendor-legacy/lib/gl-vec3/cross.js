"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var bx = b[0];
    var by = b[1];
    var bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
}
exports.default = cross;
//# sourceMappingURL=cross.js.map