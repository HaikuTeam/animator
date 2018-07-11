/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import Layout3D from '../Layout3D';
import mat4Decompose, {DecomposedMat4, roundVector, ThreeTuple} from '../vendor/mat4-decompose';
import {doublesEqual, getEulerAngles} from '../vendor/math3d';

const cleanInvalidOrOverexplicitProps = (out, explicit = false) => {
  // The reason for the conditional test is we don't want to bother assigning the attribute if it's the default/fallback
  // (keeps the bytecode less noisy if we only include what is really an override)
  Object.keys(out).forEach((layoutPropertyName) => {
    switch (layoutPropertyName) {
      case 'scale.x':
      case 'scale.y':
      case 'scale.z':
        if (isNaN(out[layoutPropertyName]) || (!explicit && out[layoutPropertyName] === 1)) {
          delete out[layoutPropertyName];
        }
        break;
      case 'translation.x':
      case 'translation.y':
      case 'translation.z':
      case 'rotation.x':
      case 'rotation.y':
      case 'rotation.z':
      case 'shear.xy':
      case 'shear.xz':
      case 'shear.yz':
        if (isNaN(out[layoutPropertyName]) || (!explicit && out[layoutPropertyName] === 0)) {
          delete out[layoutPropertyName];
        }
        break;
      default:
        // Noop; we encountered non-layout properties during parsing.
        break;
    }
  });
};

export const simplify3dTransformations = (out, epislon = 1e-3) => {
  // When our six degrees of freedom might allow us to remove 3D rotation entirely, opt to do so. This might prevent
  // downstream rendering issues with layout engines that don't support 3D rotation mechanics (e.g. Lottie).
  if (doublesEqual(Math.abs(out['rotation.x']), Math.PI, epislon)) {
    out['rotation.x'] = 0;
    out['scale.y'] *= -1;
  }

  if (doublesEqual(Math.abs(out['rotation.y']), Math.PI, epislon)) {
    out['rotation.y'] = 0;
    out['scale.x'] *= -1;
  }
};

export default (out, matrices, explicit = false, epsilon = 1e-3) => {
  // Note the array reversal - to combine matrices we go in the opposite of the transform sequence
  // I.e. if we transform A->B->C, the multiplication order should be CxBxA
  const decomposed = mat4Decompose(Layout3D.multiplyArrayOfMatrices(matrices.reverse()));

  const {translation, scale, shear, quaternion} = decomposed as DecomposedMat4;
  if (scale.indexOf(0) !== -1) {
    // In any dimension and axis of rotation, a single scale factor of 0 vanishes to the horizon. We can pick an
    // arbitrary axis to scale to 0 and use this to describe the layout without loss of effect.
    return {
      'scale.x': 0,
    };
  }

  const rotation = roundVector<ThreeTuple>(getEulerAngles(quaternion[0], quaternion[1], quaternion[2], quaternion[3]));

  out['translation.x'] = translation[0];
  out['translation.y'] = translation[1];
  out['translation.z'] = translation[2];
  out['rotation.x'] = rotation[0];
  out['rotation.y'] = rotation[1];
  out['rotation.z'] = rotation[2];
  out['scale.x'] = scale[0];
  out['scale.y'] = scale[1];
  out['scale.z'] = scale[2];
  out['shear.xy'] = shear[0];
  out['shear.xz'] = shear[1];
  out['shear.yz'] = shear[2];
  simplify3dTransformations(out, epsilon);
  cleanInvalidOrOverexplicitProps(out, explicit);

  return out;
};
