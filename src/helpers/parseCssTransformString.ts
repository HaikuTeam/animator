/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Layout3D from './../Layout3D';
import cssMat4 from './../vendor/css-mat4';
import mat4Decompose, {DecomposedMat4} from './../vendor/mat4-decompose';
import math3d from './../vendor/math3d';
import MathUtils from './MathUtils';
import parseCssValueString from './parseCssValueString';

function separate(str) {
  const bits = str.split('(');
  const type = bits[0];
  return {
    type,
    values: bits[1].replace(')', '').split(/\s*,\s*/gi).map((str2) => parseCssValueString(str2, type)),
  };
}

export default function parseCssTransformString(inStr) {
  const out = {};

  if (!inStr) {
    return out;
  }

  const str: string = inStr.toLowerCase().replace(';', '').trim();
  if (str === 'none') {
    return out;
  }

  const parts = str.match(/([a-zA-Z0-9]+\(.+?\))/gi);
  if (!parts) {
    return out;
  }

  const specs = parts.map(separate);

  const matrices = specs.map((spec) => {
    const layout = {
      translate: [0, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1],
    };

    switch (spec.type) {
      // 1D
      case 'rotatex':
        layout.rotate[0] = spec.values[0].value;
        break;
      case 'rotatey':
        layout.rotate[1] = spec.values[0].value;
        break;
      case 'rotatez':
        layout.rotate[2] = spec.values[0].value;
        break;
      case 'translatex':
        layout.translate[0] = spec.values[0].value;
        break;
      case 'translatey':
        layout.translate[1] = spec.values[0].value;
        break;
      case 'translatez':
        layout.translate[2] = spec.values[0].value;
        break;
      case 'scalex':
        layout.scale[0] = spec.values[0].value;
        break;
      case 'scaley':
        layout.scale[1] = spec.values[0].value;
        break;
      case 'scalez':
        layout.scale[2] = spec.values[0].value;
        break;

      // 2D
      case 'rotate':
        layout.rotate[2] =
          spec.values[0].unit === 'deg' ? MathUtils.degreesToRadians(spec.values[0].value) : spec.values[0].value;
        break;
      case 'scale':
        layout.scale[0] = spec.values[0].value;
        layout.scale[1] = spec.values[1] ? spec.values[1].value : spec.values[0].value;
        break;
      case 'translate':
        layout.translate[0] = spec.values[0].value;
        layout.translate[1] = spec.values[1] ? spec.values[1].value : 0;
        break;
      case 'matrix':
        layout.scale[0] = spec.values[0].value;
        layout.scale[1] = spec.values[3].value;
        layout.translate[0] = spec.values[4].value;
        layout.translate[1] = spec.values[5].value;
        break;

      // 3D
      case 'rotate3d':
        if (spec.values.length !== 3) {
          break;
        }
        layout.rotate = spec.values.map((axisSpec) => {
          if (axisSpec.value === 0) {
            return 0;
          }

          if (axisSpec.unit === 'deg') {
            return MathUtils.degreesToRadians(axisSpec.value);
          }

          return axisSpec.value;
        });
        break;
      case 'scale3d':
        layout.scale[0] = spec.values[0].value;
        layout.scale[1] = spec.values[1].value;
        layout.scale[2] = spec.values[2].value;
        break;
      case 'translate3d':
        layout.translate[0] = spec.values[0].value;
        layout.translate[1] = spec.values[1].value;
        layout.translate[2] = spec.values[2].value;
        break;

      // Special case: If we get a matrix3d, we can just use that matrix itself instead of flowing through the layout
      // calculator
      case 'matrix3d':
        return Layout3D.copyMatrix(spec.values.map((val) => {
          return val.value;
        }));

      default:
        console.warn('No CSS transform parser available for ' + spec.type);
        break;
    }

    // Transfer the layout specification into a full matrix so we can multiply it later
    return cssMat4([], layout);
  });

  // Note the array reversal - to combine matrices we go in the opposite of the transform sequence
  // I.e. if we transform A->B->C, the multiplication order should be CxBxA
  const decomposed = mat4Decompose(Layout3D.multiplyArrayOfMatrices(matrices.reverse()));
  if (decomposed === false) {
    return out;
  }

  const {translation, scale, quaternion} = decomposed as DecomposedMat4;
  if (scale.indexOf(0) !== -1) {
    // In any dimension and axis of rotation, a single scale factor of 0 vanishes to the horizon. We can pick an
    // arbitrary axis to scale to 0 and use this to describe the layout without loss of effect.
    return {
      'scale.x': 0,
    };
  }

  const rotation = math3d.getEulerAngles.apply(undefined, quaternion)
    .map((degrees) => Number(MathUtils.degreesToRadians(degrees).toFixed(2)));

  // The reason for the conditional test is we don't want to bother assigning the attribute if it's the default/fallback
  // (keeps the bytecode less noisy if we only include what is really an override)
  if (translation[0] !== 0) {
    out['translation.x'] = translation[0];
  }
  if (translation[1] !== 0) {
    out['translation.y'] = translation[1];
  }
  if (translation[2] !== 0) {
    out['translation.z'] = translation[2];
  }
  if (rotation[0] !== 0) {
    out['rotation.x'] = rotation[0];
  }
  if (rotation[1] !== 0) {
    out['rotation.y'] = rotation[1];
  }
  if (rotation[2] !== 0) {
    out['rotation.z'] = rotation[2];
  }
  if (scale[0] !== 1) {
    out['scale.x'] = scale[0];
  }
  if (scale[1] !== 1) {
    out['scale.y'] = scale[1];
  }
  if (scale[2] !== 1) {
    out['scale.z'] = scale[2];
  }

  return out;
}
