import quat from './lib/quat';
import glm4identity from '../gl-mat4/identity';
import glm4fromRotationTranslation from '../gl-mat4/fromRotationTranslation';
import glm4scale from '../gl-mat4/scale';
import glm4multiply from '../gl-mat4/multiply';

const mat4 = {
  identity: glm4identity,
  fromRotationTranslation: glm4fromRotationTranslation,
  scale: glm4scale,
  multiply: glm4multiply,
};

const ZERO3 = [0, 0, 0];
const ZERO2 = [0, 0];
const ONES = [1, 1, 1];
const tmpQuat = [0, 0, 0, 1];

const tmpMat4 = mat4.identity([]);
const translation = [0, 0, 0];
const euler = [0, 0, 0];
const scale = [1, 1, 1];
const skew = [0, 0];

export default function compose(out, opt) {
  if (!opt) {
    return mat4.identity(out);
  }

  copyVec3(translation, opt.translate || ZERO3);
  copyVec2(skew, opt.skew || ZERO2);
  copyScale3(scale, opt.scale || ONES);
  let quaternion = opt.quaternion;

  if (!quaternion) {
    // build a XYZ euler angle from 3D rotation
    quaternion = quat.identity(tmpQuat);
    copyVec3(euler, opt.rotate || ZERO3);
    quat.fromEuler(quaternion, euler);
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
