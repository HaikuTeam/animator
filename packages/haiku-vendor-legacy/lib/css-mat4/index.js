"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var quat_1 = require("./lib/quat");
var identity_1 = require("../gl-mat4/identity");
var fromRotationTranslation_1 = require("../gl-mat4/fromRotationTranslation");
var scale_1 = require("../gl-mat4/scale");
var multiply_1 = require("../gl-mat4/multiply");
var mat4 = {
    identity: identity_1.default,
    fromRotationTranslation: fromRotationTranslation_1.default,
    scale: scale_1.default,
    multiply: multiply_1.default,
};
var ZERO3 = [0, 0, 0];
var ZERO2 = [0, 0];
var ONES = [1, 1, 1];
var tmpQuat = [0, 0, 0, 1];
var tmpMat4 = mat4.identity([]);
var translation = [0, 0, 0];
var euler = [0, 0, 0];
var scale = [1, 1, 1];
var skew = [0, 0];
function compose(out, opt) {
    if (!opt) {
        return mat4.identity(out);
    }
    copyVec3(translation, opt.translate || ZERO3);
    copyVec2(skew, opt.skew || ZERO2);
    copyScale3(scale, opt.scale || ONES);
    var quaternion = opt.quaternion;
    if (!quaternion) {
        // build a XYZ euler angle from 3D rotation
        quaternion = quat_1.default.identity(tmpQuat);
        copyVec3(euler, opt.rotate || ZERO3);
        quat_1.default.fromEuler(quaternion, euler);
    }
    // apply translation & rotation
    mat4.fromRotationTranslation(out, quaternion, translation);
    // apply a combined 2D skew() operation
    if (skew[0] !== 0 || skew[1] !== 0) {
        tmpMat4[4] = Math.tan(skew[0]);
        tmpMat4[1] = Math.tan(skew[1]);
        mat4.multiply(out, out, tmpMat4);
    }
    // apply scale() operation
    mat4.scale(out, out, scale);
    return out;
}
exports.default = compose;
// safely copy vec2/vec3 to a vec3
function copyVec3(out, a) {
    out[0] = a[0] || 0;
    out[1] = a[1] || 0;
    out[2] = a[2] || 0;
    return out;
}
function copyVec2(out, a) {
    out[0] = a[0] || 0;
    out[1] = a[1] || 0;
    return out;
}
function copyScale3(out, a) {
    out[0] = typeof a[0] === 'number' ? a[0] : 1;
    out[1] = typeof a[1] === 'number' ? a[1] : 1;
    out[2] = typeof a[2] === 'number' ? a[2] : 1;
    return out;
}
//# sourceMappingURL=index.js.map