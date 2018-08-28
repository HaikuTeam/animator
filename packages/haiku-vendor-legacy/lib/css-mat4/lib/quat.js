"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ZYX order
function fromEuler(quaternion, euler) {
    var x = euler[0];
    var y = euler[1];
    var z = euler[2];
    var sx = Math.sin(x / 2);
    var sy = Math.sin(y / 2);
    var sz = Math.sin(z / 2);
    var cx = Math.cos(x / 2);
    var cy = Math.cos(y / 2);
    var cz = Math.cos(z / 2);
    quaternion[3] = cx * cy * cz - sx * sy * sz;
    quaternion[0] = sx * cy * cz + cx * sy * sz;
    quaternion[1] = cx * sy * cz - sx * cy * sz;
    quaternion[2] = cx * cy * sz + sx * sy * cz;
    return quaternion;
}
function identity(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
}
exports.default = {
    fromEuler: fromEuler,
    identity: identity,
};
//# sourceMappingURL=quat.js.map