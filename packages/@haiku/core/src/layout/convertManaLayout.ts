/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import parseCssTransformString from './../helpers/parseCssTransformString';
import visitManaTree from './../helpers/visitManaTree';
import cssValue from './../vendor/css-value';

const ROOT_LOCATOR = '0';

const TRANSFORM_COMPONENT_WHITELIST = {
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
  'align.z': true,
};

function determineSizingProp(sizeAxis, attributeValue) {
  const parsedValues = cssValue(attributeValue + ''); // Someone may have sent a number
  const parsedValue = parsedValues[0]; // Some CSS props have multi values, but our size ones shouldn't
  switch (parsedValue.unit) {
    case '%':
      return {
        name: 'sizeProportional',
        value: parsedValue.value / 100,
        mode: 0,
      };
    case 'px':
      return {
        name: 'sizeAbsolute',
        value: parsedValue.value,
        mode: 1,
      };
    case '':
      return {
        name: 'sizeAbsolute',
        value: parsedValue.value,
        mode: 1,
      };
    default:
      return false;
  }
}

/* tslint:disable */
export default function convertManaLayout(mana) {
  visitManaTree(ROOT_LOCATOR, mana, (
    name,
    attributes,
    children,
    node,
    locator,
    parent,
    index,
  ) => {
    // Note the order of operations here: first we process base attributes, but then if the style
    // object has sizing attributes, those end up overriding whatever was in the base attributes.
    if (!name || !attributes) {
      return void 0;
    }

    if (name.states) {
      const width = name.states.width;
      const height = name.states.height;
      // `elementName` is an object, so this is a recursive component: try to extract width/height from state
      if (width && width.type === 'number') {
        attributes['sizeAbsolute.x'] = width.value;
        attributes['sizeMode.x'] = 1;
      }

      if (height && height.type === 'number') {
        attributes['sizeAbsolute.y'] = height.value;
        attributes['sizeMode.y'] = 1;
      }
    }

    // Convert the width attribute to our layout-friendly size property
    if (attributes.width !== undefined && attributes.width !== null) {
      const widthProp = determineSizingProp('x', attributes.width);
      if (widthProp) {
        attributes[widthProp.name + '.x'] = widthProp.value;
        attributes['sizeMode.x'] = widthProp.mode;
        delete attributes.width; // Strip off the old value which is no longer needed
      }
    }

    // Convert the height attribute to our layout-friendly size property
    if (attributes.height !== undefined && attributes.height !== null) {
      const heightProp = determineSizingProp('y', attributes.height);
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
        const widthStyleProp = determineSizingProp('x', attributes.style.width);
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
        const heightStyleProp = determineSizingProp('y', attributes.style.height);
        if (heightStyleProp) {
          attributes[heightStyleProp.name + '.y'] = heightStyleProp.value;
          attributes['sizeMode.y'] = heightStyleProp.mode;
          delete attributes.style.height; // Strip off the old value which is no longer needed
        }
      }
    }

    // If we have a transform attribute, we're in for a fun ride; we have to conver this to our layout system
    if (attributes.transform !== undefined && attributes.transform !== null) {
      const transformAttributes = parseCssTransformString(attributes.transform);

      for (const transformAttributeName in transformAttributes) {
        const transformValue = transformAttributes[transformAttributeName];
        if (!TRANSFORM_COMPONENT_WHITELIST[transformAttributeName]) {
          console.warn(
            'Skipping transform attribute ' +
              transformAttributeName +
              ' because it is not yet supported',
          );
          continue;
        }
        attributes[transformAttributeName] = transformValue;
      }

      // Strip off the old value which is no longer needed
      delete attributes.transform;

      // If the x/y attributes are present, they can interfere with the transform, so we strip them off except in
      // the case of <image>. <image> has the special behavior that x and y position the image relative to the
      // origin *before* any transformations are applied.
      if (node.elementName !== 'image') {
        delete attributes.x;
        delete attributes.y;
      }
    }
  }, null, null);

  return mana;
}
/* tslint:enable */
