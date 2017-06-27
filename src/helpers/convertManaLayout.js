/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var parseCssValue = require('./parseCssValue');
var parseCssTransformString = require('./parseCssTransformString');
var visitManaTree = require('./visitManaTree');
var Layout3D = require('./../Layout3D');

var ROOT_LOCATOR = '0';

var TRANSFORM_COMPONENT_WHITELIST = {
  'rotation.x': true,
  'rotation.y': true,
  'rotation.z': true,
  'rotation.w': true,
  'scale.x': true,
  'scale.y': true,
  'scale.z': true,
  'translation.x': true,
  'translation.y': true,
  'translation.z': true,
  'mount.x': true,
  'mount.y': true,
  'mount.z': true,
  'origin.x': true,
  'origin.y': true,
  'origin.z': true,
  'align.x': true,
  'align.y': true,
  'align.z': true
};

function determineSizingProp(sizeAxis, attributeValue) {
  var parsedValues = parseCssValue(attributeValue);
  var parsedValue = parsedValues[0]; // Some CSS props have multi values, but our size ones shouldn't
  switch (parsedValue.unit) {
    case '%':
      return {
        name: 'sizeProportional',
        value: parsedValue.value / 100,
        mode: Layout3D.SIZE_PROPORTIONAL
      };
    case 'px':
      return {
        name: 'sizeAbsolute',
        value: parsedValue.value,
        mode: Layout3D.SIZE_ABSOLUTE
      };
    case '':
      return {
        name: 'sizeAbsolute',
        value: parsedValue.value,
        mode: Layout3D.SIZE_ABSOLUTE
      };
    default:
      return false;
  }
}

module.exports = function convertManaLayout(mana) {
  visitManaTree(
    ROOT_LOCATOR,
    mana,
    function _visitor(name, attributes, children, node, locator, parent, index) {
      // Note the order of operations here: first we process base attributes, but then if the style
      // object has sizing attributes, those end up overriding whatever was in the base attributes.
      if (!attributes) return void 0;

      // Convert the width attribute to our layout-friendly size property
      if (attributes.width !== undefined && attributes.width !== null) {
        var widthProp = determineSizingProp('x', attributes.width);
        if (widthProp) {
          attributes[widthProp.name + '.x'] = widthProp.value;
          attributes['sizeMode.x'] = widthProp.mode;
          delete attributes.width; // Strip off the old value which is no longer needed
        }
      }

      // Convert the height attribute to our layout-friendly size property
      if (attributes.height !== undefined && attributes.height !== null) {
        var heightProp = determineSizingProp('y', attributes.height);
        if (heightProp) {
          attributes[heightProp.name + '.y'] = heightProp.value;
          attributes['sizeMode.y'] = heightProp.mode;
          delete attributes.height; // Strip off the old value which is no longer needed
        }
      }

      // Now do the same for any sizing attributes that may be present on the style object
      if (attributes.style && typeof attributes.style === 'object') {
        // Convert the style.width attribute to a layout-friendly size property
        if (
          attributes.style.width !== undefined &&
          attributes.style.width !== null
        ) {
          var widthStyleProp = determineSizingProp('x', attributes.style.width);
          if (widthStyleProp) {
            attributes[widthStyleProp.name + '.x'] = widthStyleProp.value;
            attributes['sizeMode.x'] = widthStyleProp.mode;
            delete attributes.style.width; // Strip off the old value which is no longer needed
          }
        }

        // Convert the style.height attribute to a layout-friendly size property
        if (
          attributes.style.height !== undefined &&
          attributes.style.height !== null
        ) {
          var heightStyleProp = determineSizingProp(
            'y',
            attributes.style.height
          );
          if (heightStyleProp) {
            attributes[heightStyleProp.name + '.y'] = heightStyleProp.value;
            attributes['sizeMode.y'] = heightStyleProp.mode;
            delete attributes.style.height; // Strip off the old value which is no longer needed
          }
        }
      }

      // If we have a transform attribute, we're in for a fun ride; we have to conver this to our layout system
      if (attributes.transform !== undefined && attributes.transform !== null) {
        var transformAttributes = parseCssTransformString(attributes.transform);

        for (var transformAttributeName in transformAttributes) {
          var transformValue = transformAttributes[transformAttributeName];
          if (!TRANSFORM_COMPONENT_WHITELIST[transformAttributeName]) {
            console.warn(
              'Skipping transform attribute ' +
                transformAttributeName +
                ' because it is not yet supported'
            );
            continue;
          }
          attributes[transformAttributeName] = transformValue;
        }

        // Strip off the old value which is no longer needed
        delete attributes.transform;

        // If the x/y attributes are present, they can interfere with the transform, so we strip them off
        delete attributes.x;
        delete attributes.y;
      }
    }
  );

  return mana;
};
