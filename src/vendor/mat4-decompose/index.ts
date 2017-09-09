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

import normalize from "./normalize"
import create from "./../gl-mat4/create"
import clone from "./../gl-mat4/clone"
import determinant from "./../gl-mat4/determinant"
import invert from "./../gl-mat4/invert"
import transpose from "./../gl-mat4/transpose"
import glv3length from "./../gl-vec3/length"
import glv3normalize from "./../gl-vec3/normalize"
import glv3dot from "./../gl-vec3/dot"
import glv3cross from "./../gl-vec3/cross"

const vec3 = {
  length: glv3length,
  normalize: glv3normalize,
  dot: glv3dot,
  cross: glv3cross,
}

const tmp = create()
const perspectiveMatrix = create()
const tmpVec4 = [0, 0, 0, 0]
const row = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
const pdum3 = [0, 0, 0]

export default function decomposeMat4(
  matrix,
  translation,
  scale,
  skew,
  perspective,
  quaternion,
) {
  if (!translation) translation = [0, 0, 0]
  if (!scale) scale = [0, 0, 0]
  if (!skew) skew = [0, 0, 0]
  if (!perspective) perspective = [0, 0, 0, 1]
  if (!quaternion) quaternion = [0, 0, 0, 1]

  // normalize, if not possible then bail out early
  if (!normalize(tmp, matrix)) return false

  // perspectiveMatrix is used to solve for perspective, but it also provides
  // an easy way to test for singularity of the upper 3x3 component.
  clone(perspectiveMatrix)

  perspectiveMatrix[3] = 0
  perspectiveMatrix[7] = 0
  perspectiveMatrix[11] = 0
  perspectiveMatrix[15] = 1

  // If the perspectiveMatrix is not invertible, we are also unable to
  // decompose, so we'll bail early. Constant taken from SkMatrix44::invert.
  if (Math.abs(Number(determinant(perspectiveMatrix) < 1e-8))) return false

  let a03 = tmp[3]
  let a13 = tmp[7]
  let a23 = tmp[11]
  let a30 = tmp[12]
  let a31 = tmp[13]
  let a32 = tmp[14]
  let a33 = tmp[15]

  // First, isolate perspective.
  if (a03 !== 0 || a13 !== 0 || a23 !== 0) {
    tmpVec4[0] = a03
    tmpVec4[1] = a13
    tmpVec4[2] = a23
    tmpVec4[3] = a33

    // Solve the equation by inverting perspectiveMatrix and multiplying
    // rightHandSide by the inverse.
    // resuing the perspectiveMatrix here since it's no longer needed
    let ret = invert(perspectiveMatrix, perspectiveMatrix)
    if (!ret) return false
    transpose(perspectiveMatrix, perspectiveMatrix)

    // multiply by transposed inverse perspective matrix, into perspective vec4
    vec4multMat4(perspective, tmpVec4, perspectiveMatrix)
  } else {
    // no perspective
    perspective[0] = perspective[1] = perspective[2] = 0
    perspective[3] = 1
  }

  // Next take care of translation
  translation[0] = a30
  translation[1] = a31
  translation[2] = a32

  // Now get scale and shear. 'row' is a 3 element array of 3 component vectors
  mat3from4(row, tmp)

  // Compute X scale factor and normalize first row.
  scale[0] = vec3.length(row[0])
  vec3.normalize(row[0], row[0])

  // Compute XY shear factor and make 2nd row orthogonal to 1st.
  skew[0] = vec3.dot(row[0], row[1])
  combine(row[1], row[1], row[0], 1.0, -skew[0])

  // Now, compute Y scale and normalize 2nd row.
  scale[1] = vec3.length(row[1])
  vec3.normalize(row[1], row[1])
  skew[0] /= scale[1]

  // Compute XZ and YZ shears, orthogonalize 3rd row
  skew[1] = vec3.dot(row[0], row[2])
  combine(row[2], row[2], row[0], 1.0, -skew[1])
  skew[2] = vec3.dot(row[1], row[2])
  combine(row[2], row[2], row[1], 1.0, -skew[2])

  // Next, get Z scale and normalize 3rd row.
  scale[2] = vec3.length(row[2])
  vec3.normalize(row[2], row[2])
  skew[1] /= scale[2]
  skew[2] /= scale[2]

  // At this point, the matrix (in rows) is orthonormal.
  // Check for a coordinate system flip.  If the determinant
  // is -1, then negate the matrix and the scaling factors.
  vec3.cross(pdum3, row[1], row[2])
  if (vec3.dot(row[0], pdum3) < 0) {
    for (let i = 0; i < 3; i++) {
      scale[i] *= -1
      row[i][0] *= -1
      row[i][1] *= -1
      row[i][2] *= -1
    }
  }

  // Now, get the rotations out
  quaternion[0] =
    0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0))
  quaternion[1] =
    0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0))
  quaternion[2] =
    0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0))
  quaternion[3] =
    0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0))

  if (row[2][1] > row[1][2]) quaternion[0] = -quaternion[0]
  if (row[0][2] > row[2][0]) quaternion[1] = -quaternion[1]
  if (row[1][0] > row[0][1]) quaternion[2] = -quaternion[2]
  return true
}

// will be replaced by gl-vec4 eventually
function vec4multMat4(out, a, m) {
  let x = a[0]
  let y = a[1]
  let z = a[2]
  let w = a[3]
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w
  return out
}

// gets upper-left of a 4x4 matrix into a 3x3 of vectors
function mat3from4(out, mat4x4) {
  out[0][0] = mat4x4[0]
  out[0][1] = mat4x4[1]
  out[0][2] = mat4x4[2]

  out[1][0] = mat4x4[4]
  out[1][1] = mat4x4[5]
  out[1][2] = mat4x4[6]

  out[2][0] = mat4x4[8]
  out[2][1] = mat4x4[9]
  out[2][2] = mat4x4[10]
}

function combine(out, a, b, scale1, scale2) {
  out[0] = a[0] * scale1 + b[0] * scale2
  out[1] = a[1] * scale1 + b[1] * scale2
  out[2] = a[2] * scale1 + b[2] * scale2
}
