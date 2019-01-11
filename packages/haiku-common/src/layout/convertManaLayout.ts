/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeNode, PrimitiveType} from '@haiku/core/lib/api';
import {visitManaTree} from '@haiku/core/lib/HaikuNode';
import {SVG_SIZEABLES} from '@haiku/core/lib/layout/applyCssLayout';
import Layout3D, {AUTO_SIZING_TOKEN} from '@haiku/core/lib/Layout3D';
import cssValue from 'haiku-vendor-legacy/lib/css-value';
import parseCssTransformString from './parseCssTransformString';

const ROOT_LOCATOR = '0';

const TRANSFORM_COMPONENT_WHITELIST = {
  'rotation.x': true,
  'rotation.y': true,
  'rotation.z': true,
  'scale.x': true,
  'scale.y': true,
  'scale.z': true,
  'translation.x': true,
  'translation.y': true,
  'translation.z': true,
  'shear.xy': true,
  'shear.xz': true,
  'shear.yz': true,
  'origin.x': true,
  'origin.y': true,
  'origin.z': true,
};

const isNumericDefined = (value: any): boolean => {
  return typeof value === 'number';
};

const determineSizingProp = (attributeValue: PrimitiveType) => {
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
    case '':
      return {
        name: 'sizeAbsolute',
        value: parsedValue.value,
        mode: 1,
      };
    default:
      return false;
  }
};

const DEFAULT_SIZE_ABSOLUTE = 100;
const DEFAULT_SIZE_PROPORTIONAL = 1.0; // 100%

const fallbackSizeAbsolute = (node: BytecodeNode, axis: string): number => {
  // This pathway assumes we've already tried attributes.width and attributes.style.width
  if (node && node.attributes) {
    const viewboxString = (node.attributes.viewBox || node.attributes.viewbox) + '';
    const viewboxPieces = viewboxString.split(/\s+/).map((str) => Number(str));

    if (axis === 'x') {
      return viewboxPieces[2] || DEFAULT_SIZE_ABSOLUTE;
    }

    if (axis === 'y') {
      return viewboxPieces[3] || DEFAULT_SIZE_ABSOLUTE;
    }
  }

  return DEFAULT_SIZE_ABSOLUTE;
};

export default (mana: BytecodeNode) => {
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
      return;
    }

    if (typeof name !== 'string' && name.states) {
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

    // Specifically avoid setting up layout size for SVG elements that can receive width and height as attributes.
    if (typeof name !== 'string' || !SVG_SIZEABLES[name]) {
      // Convert the width attribute to our layout-friendly size property
      if (attributes.width !== undefined && attributes.width !== null) {
        const widthProp = determineSizingProp(attributes.width);
        if (widthProp) {
          attributes[widthProp.name + '.x'] = widthProp.value;
          attributes['sizeMode.x'] = widthProp.mode;
          delete attributes.width; // Strip off the old value which is no longer needed
        }
      }

      // Convert the height attribute to our layout-friendly size property
      if (attributes.height !== undefined && attributes.height !== null) {
        const heightProp = determineSizingProp(attributes.height);
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
          const widthStyleProp = determineSizingProp(attributes.style.width);
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
          const heightStyleProp = determineSizingProp(attributes.style.height);
          if (heightStyleProp) {
            attributes[heightStyleProp.name + '.y'] = heightStyleProp.value;
            attributes['sizeMode.y'] = heightStyleProp.mode;
            delete attributes.style.height; // Strip off the old value which is no longer needed
          }
        }
      }

      // For instantiatee roots, we want to ensure some kind of sizing is defined
      if (!parent) {
        // Force absolute sizing if we haven't explicitly set any sizing mode by now
        if (!isNumericDefined(attributes['sizeMode.x'])) {
          attributes['sizeMode.x'] = Layout3D.SIZE_ABSOLUTE;
        }
        if (!isNumericDefined(attributes['sizeMode.y'])) {
          attributes['sizeMode.y'] = Layout3D.SIZE_ABSOLUTE;
        }

        // Assign an absolute size no matter what, since this is the most common case,
        // even if somehow the element still ends up in proportional size mode, these should be set
        if (!isNumericDefined(attributes['sizeAbsolute.x']) && attributes['sizeAbsolute.x'] !== AUTO_SIZING_TOKEN) {
          attributes['sizeAbsolute.x'] = fallbackSizeAbsolute(node, 'x');
        }
        if (!isNumericDefined(attributes['sizeAbsolute.y']) && attributes['sizeAbsolute.y'] !== AUTO_SIZING_TOKEN) {
          attributes['sizeAbsolute.y'] = fallbackSizeAbsolute(node, 'y');
        }

        // On the off chance we got a proportional size mode, but no proportional size, make it 100%
        if (
          attributes['sizeMode.x'] === Layout3D.SIZE_PROPORTIONAL &&
          (!isNumericDefined(attributes['sizeProportional.x']))
        ) {
          attributes['sizeProportional.x'] = DEFAULT_SIZE_PROPORTIONAL;
        }
        if (
          attributes['sizeMode.y'] === Layout3D.SIZE_PROPORTIONAL &&
          (!isNumericDefined(attributes['sizeProportional.y']))
        ) {
          attributes['sizeProportional.y'] = DEFAULT_SIZE_PROPORTIONAL;
        }
      }
    }

    // If we have a transform attribute, we're in for a fun ride; we have to conver this to our layout system
    if (attributes.transform !== undefined && attributes.transform !== null) {
      const transformAttributes = parseCssTransformString(attributes.transform, 1e6);

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
      // the case of <image> and <rect>. These SVG elements have the special behavior that x and y position the image
      // relative to the origin *before* any transformations are applied.
      if (node.elementName !== 'image' && node.elementName !== 'rect') {
        delete attributes.x;
        delete attributes.y;
      }
    }
  }, null, null);

  return mana;
};
