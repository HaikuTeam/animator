const pointInPolygon = require('point-in-polygon');

const isCoordInsideRect = (px, py, rect) => {
  return rect.left <= px && px <= rect.right && rect.top <= py && py <= rect.bottom;
};

const rounded = (n, d = 3) => {
  const powerOfTen = Math.pow(10, d);
  return Math.round(n * powerOfTen) / powerOfTen;
};

const basicallyEquals = (n, m) => typeof n === 'number' && typeof m === 'number' && Math.abs(n - m) < 1e-3;

const isCoordInsideBoxPoints = (px, py, boxPoints) => pointInPolygon(
  [px, py], [
    [boxPoints[0].x, boxPoints[0].y],
    [boxPoints[2].x, boxPoints[2].y],
    [boxPoints[8].x, boxPoints[8].y],
    [boxPoints[6].x, boxPoints[6].y],
  ]);

const modOfIndex = (idx, max) => {
  return (idx % max + max) % max;
};

const roundUp = (numToRound, multiple) => {
  if (multiple === 0) {
    return numToRound;
  }
  const remainder = Math.abs(numToRound) % multiple;
  if (remainder === 0) {
    return numToRound;
  }
  if (numToRound < 0) {
    return -(Math.abs(numToRound) - remainder);
  }
  return numToRound + multiple - remainder;
};

const transformFourVectorByMatrix = (out, v, m) => {
  out[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3];
  out[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3];
  out[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
  out[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];
};

module.exports = {
  basicallyEquals,
  rounded,
  isCoordInsideRect,
  isCoordInsideBoxPoints,
  modOfIndex,
  roundUp,
  transformFourVectorByMatrix,
};
