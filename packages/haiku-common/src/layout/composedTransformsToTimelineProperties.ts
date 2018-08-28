/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 *
 * Note: this and all related work should be moved out of @haiku/core in conjunction with xmlToMana and friends.
 */

import {LayoutSpec} from '@haiku/core/lib/api';
import Layout3D from '@haiku/core/lib/Layout3D';
import mat4Decompose, {DecomposedMat4} from 'haiku-vendor-legacy/lib/mat4-decompose';

export interface ComposedTransformSpec {
  'translation.x'?: number;
  'translation.y'?: number;
  'translation.z'?: number;
  'rotation.x'?: number;
  'rotation.y'?: number;
  'rotation.z'?: number;
  'scale.x'?: number;
  'scale.y'?: number;
  'scale.z'?: number;
  'shear.xy'?: number;
  'shear.xz'?: number;
  'shear.yz'?: number;
}

const cleanInvalidOrOverexplicitProps = (out: ComposedTransformSpec, explicit = false) => {
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

/**
 * Normalize rotations as close as possible to the quadrant of origin. Carefully.
 */
const normalizeRotationsInQuadrants = (out: ComposedTransformSpec, normalizer: LayoutSpec) => {
  if (normalizer === null) {
    return;
  }

  ['x', 'y', 'z'].forEach((axis) => {
    // We have to do this because the ComposedTransformSpec uses keys like "rotation.x" and the layout spec addresses
    // layout property groups in the expected way.
    const rotationProperty = `rotation.${axis}`;
    // out[rotationProperty] is falsey if the property is not set OR if it's 0 (which we might care about).
    if (!out.hasOwnProperty(rotationProperty)) {
      return;
    }

    const originalQuadrant = Math.floor(2 * normalizer.rotation[axis] / Math.PI);
    const quadrantOut = Math.floor(2 * out[rotationProperty] / Math.PI);
    if (Math.abs(originalQuadrant - quadrantOut) < 3) {
      // We're within a half "tick" of the original normalizer, so there isn't an obvious way to normalize, so let's
      // just accept what we have.
      return;
    }

    // Offset by the necessary rotations to land in a "less unexpected" quadrant…
    out[rotationProperty] += Math.PI * 2 * Math.round((originalQuadrant - quadrantOut) / 4);
    // …and round to avoid additional weirdness.
    out[rotationProperty] = Math.round(out[rotationProperty] * 1e3) / 1e3;
  });
};

export default (
  out: ComposedTransformSpec,
  matrices: number[][],
  explicit = false,
  normalizer: LayoutSpec = null,
) => {
  // Note the array reversal - to combine matrices we go in the opposite of the transform sequence
  // I.e. if we transform A->B->C, the multiplication order should be CxBxA
  const decomposed = mat4Decompose(Layout3D.multiplyArrayOfMatrices(matrices.reverse()));

  const {translation, scale, shear, rotation} = decomposed as DecomposedMat4;
  if (scale.indexOf(0) !== -1) {
    // In any dimension and axis of rotation, a single scale factor of 0 vanishes to the horizon. We can pick an
    // arbitrary axis to scale to 0 and use this to describe the layout without loss of effect.
    return {
      'scale.x': 0,
    };
  }

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

  cleanInvalidOrOverexplicitProps(out, explicit);
  normalizeRotationsInQuadrants(out, normalizer);

  return out;
};
