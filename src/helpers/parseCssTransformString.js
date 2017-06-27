/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var mat4decompose = require('mat4-decompose');
var mat4compose = require('css-mat4');
var MathUtils = require('./MathUtils');
var roundToPrecision = require('./roundToPrecision');
var parseCssValueString = require('./parseCssValueString');
var _getEulerAngles = require('./getEulerAngles');
var Layout3D = require('./../Layout3D');

function separate(str) {
  var bits = str.split('(');
  var type = bits[0];
  var vals = bits[1].replace(')', '').split(/,\s*?/gi).map(function(str) {
    return parseCssValueString(str, type);
  });
  return {
    type: type,
    values: vals
  };
}

function parseCssTransformString(str) {
  var out = {};

  if (!str) return out;
  if (str === '') return out;

  str = str.toLowerCase().replace(';', '').trim();
  if (str === 'none') return out;

  var parts = str.match(/([a-zA-Z0-9]+\(.+?\))/gi);
  if (!parts) return out;

  var specs = parts.map(separate);

  var matrices = specs.map(function _map(spec) {
    var layout = {
      translate: [0, 0, 0],
      rotate: [0, 0, 0],
      scale: [1, 1, 1]
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
        if (spec.values[0].unit === 'deg') {
          var converted = MathUtils.degreesToRadians(spec.values[0].value);
          layout.rotate[2] = converted;
        } else {
          layout.rotate[2] = spec.values[0].value;
        }
        break;
      case 'scale':
        layout.scale[0] = spec.values[0].value;
        layout.scale[1] = spec.values[1].value;
        break;
      case 'translate':
        layout.translate[0] = spec.values[0].value;
        layout.translate[1] = spec.values[1].value;
        break;
      case 'matrix':
        layout.scale[0] = spec.values[0].value;
        layout.scale[1] = spec.values[3].value;
        layout.translate[0] = spec.values[4].value;
        layout.translate[1] = spec.values[5].value;
        break;

      // 3D
      case 'rotate3d':
        layout.rotate[0] = spec.values[0].value;
        layout.rotate[1] = spec.values[1].value;
        layout.rotate[2] = spec.values[2].value;
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

      // Special case: If we get a matrix3d, we can just use that matrix itself instead of flowing through the layout calculator
      case 'matrix3d':
        return Layout3D.copyMatrix([], spec.values.map(val => val.value));

      default:
        console.warn('No CSS transform parser available for ' + spec.type);
        break;
    }

    // Transfer the layout specification into a full matrix so we can multiply it later
    var matrix = mat4compose([], layout);

    return matrix;
  });

  // Note the array reversal - to combine matrices we go in the opposite of the transform sequence
  // I.e. if we transform A->B->C, the multiplication order should be CxBxA
  var product = Layout3D.multiplyArrayOfMatrices(matrices.reverse());

  // We'll decompose the matrix and make the changes in-place to the vectors in this object
  var components = {
    translation: [0, 0, 0],
    scale: [0, 0, 0],
    skew: [0, 0, 0],
    perspective: [0, 0, 0, 1],
    quaternion: [0, 0, 0, 1]
  };
  mat4decompose(
    product,
    components.translation,
    components.scale,
    components.skew,
    components.perspective,
    components.quaternion
  );

  components.rotation = _getEulerAngles(
    components.quaternion[0],
    components.quaternion[1],
    components.quaternion[2],
    components.quaternion[3]
  );
  components.rotation[0] = MathUtils.degreesToRadians(components.rotation[0]);
  components.rotation[1] = MathUtils.degreesToRadians(components.rotation[1]);
  components.rotation[2] = MathUtils.degreesToRadians(components.rotation[2]);

  for (var subkey in components) {
    for (var idx in components[subkey]) {
      components[subkey][idx] = roundToPrecision(components[subkey][idx]);
    }
  }

  // The reason for the conditional test is we don't want to bother assigning the attribute if it's the default/fallback
  // (keeps the bytecode less noisy if we only include what is really an override)
  if (components.translation[0] !== 0)
    out['translation.x'] = components.translation[0];
  if (components.translation[1] !== 0)
    out['translation.y'] = components.translation[1];
  if (components.translation[2] !== 0)
    out['translation.z'] = components.translation[2];
  if (components.rotation[0] !== 0) out['rotation.x'] = components.rotation[0];
  if (components.rotation[1] !== 0) out['rotation.y'] = components.rotation[1];
  if (components.rotation[2] !== 0) out['rotation.z'] = components.rotation[2];
  if (components.scale[0] !== 1) out['scale.x'] = components.scale[0];
  if (components.scale[1] !== 1) out['scale.y'] = components.scale[1];
  if (components.scale[2] !== 1) out['scale.z'] = components.scale[2];

  return out;
}

module.exports = parseCssTransformString;
