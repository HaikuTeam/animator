/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import parseCssValueString from '@haiku/core/lib/helpers/parseCssValueString';
import Layout3D from '@haiku/core/lib/Layout3D';
import cssMat4 from 'haiku-vendor-legacy/lib/css-mat4';
import composedTransformsToTimelineProperties from './composedTransformsToTimelineProperties';

function degreesToRadians (d: number): number {
  return d * Math.PI / 180;
}

function separate (str: string) {
  const bits = str.split('(');
  const type = bits[0];
  return {
    type,
    // The transform component string may look like any of these:
    //    translate(0.12,3)
    //    translate(0.12 3.555)
    //    translate(1, 2)
    // Note the variations of comma, space, and decimals that are possible.
    // This parsing step individuates them, producing an array of objects that
    // describe the numeric value and the inferred unit.
    values: bits[1].replace(')', '').split(/\s*[, ]+\s*/gi).map((str2) => parseCssValueString(str2, type)),
  };
}

export default function parseCssTransformString (inStr: string) {
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
      skew: [0, 0],
    };

    switch (spec.type) {
      // 1D
      case 'rotatex':
        layout.rotate[0] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
        break;
      case 'rotatey':
        layout.rotate[1] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
        break;
      case 'rotatez':
        layout.rotate[2] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
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
      case 'skewx':
        layout.skew[0] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
        break;
      case 'skewy':
        layout.skew[1] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
        break;

      // 2D
      case 'rotate':
        layout.rotate[2] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
        break;
      case 'scale':
        layout.scale[0] = spec.values[0].value;
        layout.scale[1] = spec.values[1] ? spec.values[1].value : spec.values[0].value;
        break;
      case 'skew':
        layout.skew[0] =
          spec.values[0].unit === 'deg' ? degreesToRadians(spec.values[0].value) : spec.values[0].value;
        if (spec.values[1]) {
          layout.skew[1] =
            spec.values[1].unit === 'deg' ? degreesToRadians(spec.values[1].value) : spec.values[1].value;
        }
        break;
      case 'translate':
        layout.translate[0] = spec.values[0].value;
        layout.translate[1] = spec.values[1] ? spec.values[1].value : 0;
        break;
      case 'matrix':
        return [
          spec.values[0].value, spec.values[1].value, 0, 0,
          spec.values[2].value, spec.values[3].value, 0, 0,
          0, 0, 1, 0,
          spec.values[4].value, spec.values[5].value, 0, 1,
        ];

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
            return degreesToRadians(axisSpec.value);
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

  return composedTransformsToTimelineProperties(out, matrices);
}
