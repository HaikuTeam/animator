function doublesEqual(d1, d2) {
  const preciseness = 1e-13;
  return Math.abs(d1 - d2) < preciseness;
}

function normalizeRad(rad) {
  let angle = rad * (180.0 / Math.PI);
  while (angle > 360) {
    angle -= 360;
  }
  while (angle < 0) {
    angle += 360;
  }
  return angle;
}

/**
 * Returns the euler angles for the given quaternion
 * The rotations for the euler angles are applied in the order: z then x then y
 * @param {Quternion} quaternion
 * @returns {Object} eulerAngles: [x,y,z]
 */
function getEulerAngles(x, y, z, w) {
  const poleSum = x * w - y * z;

  if (doublesEqual(poleSum, 0.5)) {
    return [90, 0, 0];
  } else if (doublesEqual(poleSum, -0.5)) {
    return [-90, 0, 0];
  }

  const _x = Math.asin(2 * x * w - 2 * y * z);
  const _y = Math.atan2(2 * x * z + 2 * y * w, 1 - 2 * (y * y) - 2 * (x * x));
  const _z =
    Math.PI - Math.atan2(2 * x * y + 2 * z * w, 1 - 2 * (y * y) - 2 * (w * w));

  return [normalizeRad(_x), normalizeRad(_y), normalizeRad(_z)];
}

export default {
  getEulerAngles,
};
