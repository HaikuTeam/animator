"use strict";
exports.__esModule = true;
function computeOrientationFlexibly(x, y, z, w, quat) {
    if (!quat ||
        (quat.x == null || quat.y == null || quat.z == null || quat.w == null)) {
        throw new Error("No w-component nor quaternion provided!");
    }
    if (x == null || y == null || z == null) {
        var sp = -2 * (quat.y * quat.z - quat.w * quat.x);
        if (Math.abs(sp) > 0.99999) {
            y = y == null ? Math.PI * 0.5 * sp : y;
            x = x == null
                ? Math.atan2(-quat.x * quat.z + quat.w * quat.y, 0.5 - quat.y * quat.y - quat.z * quat.z)
                : x;
            z = z == null ? 0 : z;
        }
        else {
            y = y == null ? Math.asin(sp) : y;
            x = x == null
                ? Math.atan2(quat.x * quat.z + quat.w * quat.y, 0.5 - quat.x * quat.x - quat.y * quat.y)
                : x;
            z = z == null
                ? Math.atan2(quat.x * quat.y + quat.w * quat.z, 0.5 - quat.x * quat.x - quat.z * quat.z)
                : z;
        }
    }
    var hx = x * 0.5;
    var hy = y * 0.5;
    var hz = z * 0.5;
    var sx = Math.sin(hx);
    var sy = Math.sin(hy);
    var sz = Math.sin(hz);
    var cx = Math.cos(hx);
    var cy = Math.cos(hy);
    var cz = Math.cos(hz);
    var sysz = sy * sz;
    var cysz = cy * sz;
    var sycz = sy * cz;
    var cycz = cy * cz;
    var qx = sx * cycz + cx * sysz;
    var qy = cx * sycz - sx * cysz;
    var qz = cx * cysz + sx * sycz;
    var qw = cx * cycz - sx * sysz;
    return { x: qx, y: qy, z: qz, w: qw };
}
exports["default"] = computeOrientationFlexibly;
//# sourceMappingURL=computeOrientationFlexibly.js.map