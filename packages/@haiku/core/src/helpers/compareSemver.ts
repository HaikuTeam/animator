/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

/**
 * Simple semver comparitor function for semvers.
 *
 * Used for determining if a semver a = x.y.z is less than, greater than, or equal to a semver b = x'.y'.z'. Returns 1
 * if a > b, -1 if a < b, or 0 if they are equal.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
const compareSemver = (a: string, b: string): number => {
  const semverA = a.split('.');
  const semverB = b.split('.');

  if (semverA.length !== 3 || semverB.length !== 3) {
    throw new Error(`Invalid semver comparison: ${a}, ${b}`);
  }

  for (let i = 0; i < 3; ++i) {
    if (semverA[i] < semverB[i]) {
      return -1;
    }
    if (semverA[i] > semverB[i]) {
      return 1;
    }
  }

  return 0;
};

export default compareSemver;
