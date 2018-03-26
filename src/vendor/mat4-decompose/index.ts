/* jshint unused:true */
/*
Input:  matrix      ; a 4x4 matrix
Output: translation ; a 3 component vector
        scale       ; a 3 component vector
        skew        ; skew factors XY,XZ,YZ represented as a 3 component vector
        perspective ; a 4 component vector
        quaternion  ; a 4 component vector
Returns false if the matrix cannot be decomposed, true if it can

References:
https://github.com/kamicane/matrix3d/blob/master/lib/Matrix3d.js
https://github.com/ChromiumWebApps/chromium/blob/master/ui/gfx/transform_util.cc
http://www.w3.org/TR/css3-transforms/#decomposing-a-3d-matrix
*/

import create from '../gl-mat4/create';
import glv3cross from '../gl-vec3/cross';
import glv3dot from '../gl-vec3/dot';
import glv3length from '../gl-vec3/length';
import glv3normalize from '../gl-vec3/normalize';
import normalize from './normalize';

const vec3 = {
  length: glv3length,
  normalize: glv3normalize,
  dot: glv3dot,
  cross: glv3cross,
};

const tmp = create();
const row = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
const pdum3 = [0, 0, 0];

export const roundVector = (vector: number[]): number[] => vector.map((value) => Number(value.toFixed(2)));
export type ThreeTuple = [number, number, number];
export type FourTuple = [number, number, number, number];
export interface DecomposedMat4 {
  translation: ThreeTuple;
  scale: ThreeTuple;
  quaternion: FourTuple;
}

export default function decomposeMat4(matrix): boolean|DecomposedMat4 {
  // normalize, if not possible then bail out early
  if (!normalize(tmp, matrix)) {
    return false;
  }

  const translation = roundVector([tmp[12], tmp[13], tmp[14]]) as ThreeTuple;

  // Now get scale. 'row' is a 3 element array of 3 component vectors
  mat3from4(row, tmp);

  // Compute scale factor and normalize rows.
  const scale = roundVector([
    vec3.length(row[0]),
    vec3.length(row[1]),
    vec3.length(row[2]),
  ]) as ThreeTuple;
  // Return early if we have any 0 scale factors.
  if (scale.indexOf(0) !== -1) {
    return {
      translation: [0, 0, 0],
      scale: [0, 0, 0],
      quaternion: [0, 0, 0, 0],
    };
  }

  vec3.normalize(row[0], row[0]);
  vec3.normalize(row[1], row[1]);
  vec3.normalize(row[2], row[2]);

  // At this point, the matrix (in rows) is orthonormal.
  // Check for a coordinate system flip.  If the determinant
  // is -1, then negate the matrix and the scaling factors.
  vec3.cross(pdum3, row[1], row[2]);
  if (vec3.dot(row[0], pdum3) < 0) {
    for (let i = 0; i < 3; i++) {
      scale[i] *= -1;
      row[i][0] *= -1;
      row[i][1] *= -1;
      row[i][2] *= -1;
    }
  }

  // Now, get the rotations out
  const quaternion: FourTuple = [
    0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0)),
    0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0)),
    0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0)),
    0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0)),
  ];

  if (row[2][1] > row[1][2]) {
    quaternion[0] = -quaternion[0];
  }
  if (row[0][2] > row[2][0]) {
    quaternion[1] = -quaternion[1];
  }
  if (row[1][0] > row[0][1]) {
    quaternion[2] = -quaternion[2];
  }

  return {translation, scale, quaternion};
}

// gets upper-left of a 4x4 matrix into a 3x3 of vectors
function mat3from4(out, mat4x4) {
  out[0][0] = mat4x4[0];
  out[0][1] = mat4x4[1];
  out[0][2] = mat4x4[2];

  out[1][0] = mat4x4[4];
  out[1][1] = mat4x4[5];
  out[1][2] = mat4x4[6];

  out[2][0] = mat4x4[8];
  out[2][1] = mat4x4[9];
  out[2][2] = mat4x4[10];
}
