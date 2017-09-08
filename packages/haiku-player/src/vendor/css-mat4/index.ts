let quat = require("./lib/quat")
let mat4 = {
  identity: require("./../gl-mat4/identity"),
  fromRotationTranslation: require("./../gl-mat4/fromRotationTranslation"),
  scale: require("./../gl-mat4/scale"),
  multiply: require("./../gl-mat4/multiply"),
}

let ZERO3 = [0, 0, 0]
let ZERO2 = [0, 0]
let ONES = [1, 1, 1]
let tmpQuat = [0, 0, 0, 1]

let tmpMat4 = mat4.identity([])
let translation = [0, 0, 0]
let euler = [0, 0, 0]
let scale = [1, 1, 1]
let skew = [0, 0]

module.exports = function compose(out, opt) {
  if (!opt) return mat4.identity(out)

  copyVec3(translation, opt.translate || ZERO3)
  copyVec2(skew, opt.skew || ZERO2)
  copyScale3(scale, opt.scale || ONES)
  let quaternion = opt.quaternion

  if (!quaternion) {
    // build a XYZ euler angle from 3D rotation
    quaternion = quat.identity(tmpQuat)
    copyVec3(euler, opt.rotate || ZERO3)
    quat.fromEuler(quaternion, euler)
  }

  // apply translation & rotation
  mat4.fromRotationTranslation(out, quaternion, translation)

  // apply a combined 2D skew() operation
  if (skew[0] !== 0 || skew[1] !== 0) {
    tmpMat4[4] = Math.tan(skew[0])
    tmpMat4[1] = Math.tan(skew[1])
    mat4.multiply(out, out, tmpMat4)
  }

  // apply the independent skewX() and skewY() operations
  if (typeof opt.skewX === "number") {
    tmpMat4[4] = Math.tan(opt.skewX)
    tmpMat4[1] = 0
    mat4.multiply(out, out, tmpMat4)
  }

  if (typeof opt.skewY === "number") {
    tmpMat4[4] = 0
    tmpMat4[1] = Math.tan(opt.skewY)
    mat4.multiply(out, out, tmpMat4)
  }

  // apply scale() operation
  mat4.scale(out, out, scale)

  return out
}

// safely copy vec2/vec3 to a vec3
function copyVec3(out, a) {
  out[0] = a[0] || 0
  out[1] = a[1] || 0
  out[2] = a[2] || 0
  return out
}

function copyVec2(out, a) {
  out[0] = a[0] || 0
  out[1] = a[1] || 0
  return out
}

function copyScale3(out, a) {
  out[0] = typeof a[0] === "number" ? a[0] : 1
  out[1] = typeof a[1] === "number" ? a[1] : 1
  out[2] = typeof a[2] === "number" ? a[2] : 1
  return out
}
