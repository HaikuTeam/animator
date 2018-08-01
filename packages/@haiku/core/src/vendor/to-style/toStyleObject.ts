/**
 * The MIT License
 *
 * Copyright (c) Radu Brehar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

import cssPrefixFn from './cssPrefix';
import HAS_OWN from './hasOwn';
import IS_FUNCTION from './isFunction';
import IS_OBJECT from './isObject';
import CAMELIZE from './stringUtils/camelize';
import HYPHENATE from './stringUtils/hyphenate';

function applyPrefix (target, property, value, normalizeFn) {
  cssPrefixFn(property, null).forEach(function (p) {
    target[normalizeFn ? normalizeFn(p) : p] = value;
  });
}

function toObject (str) {
  str = (str || '').split(';');

  const result = {};

  for (let i = 0; i < str.length; i++) {
    const item = str[i];

    const split = item.split(':');

    if (split.length === 2) {
      result[split[0].trim()] = split[1].trim();
    }
  }

  return result;
}

const CONFIG = {
  cssUnitless: require('./cssUnitless'),
};

function _notUndef (thing) {
  return thing !== null && thing !== undefined;
}

/**
 * @ignore
 * @method toStyleObject
 * @param  {Object} styles The object to convert to a style object.
 * @param  {Object} [config]
 * @param  {Boolean} [config.addUnits=true] True if you want to add units when numerical values are encountered.
 * @param  {Object}  config.cssUnitless An object whose keys represent css numerical property names that will not be
 *   appended with units.
 * @param  {Object}  config.prefixProperties An object whose keys represent css property names that should be prefixed
 * @param  {String}  config.cssUnit='px' The css unit to append to numerical values. Defaults to 'px'
 * @param  {String}  config.normalizeName A function that normalizes a name to a valid css property name
 * @param  {String}  config.scope
 * @return {Object} The object, normalized with css style names
 */
export default function toStyleObject (styles, config, prepend, result) {
  if (typeof styles === 'string') {
    styles = toObject(styles);
  }

  config = config || CONFIG;

  config.cssUnitless = config.cssUnitless || CONFIG.cssUnitless;

  result = result || {};

  const scope = config.scope || {};

  const addUnits = _notUndef(config.addUnits)
    ? config.addUnits
    : scope && _notUndef(scope.addUnits) ? scope.addUnits : true;

  const cssUnitless =
    (_notUndef(config.cssUnitless)
      ? config.cssUnitless
      : scope ? scope.cssUnitless : null) || {};

  const cssUnit = (config.cssUnit || scope ? scope.cssUnit : null) || 'px';

  const prefixProperties =
    config.prefixProperties || (scope ? scope.prefixProperties : null) || {};

  const camelize = config.camelize;

  const normalizeFn = camelize ? CAMELIZE : HYPHENATE;

  let processed,
    styleName,
    propName,
    propValue,
    propType,
    propIsNumber,
    fnPropValue,
    prefix;

  for (propName in styles) {
    if (HAS_OWN(styles, propName)) {
      propValue = styles[propName];

      // the hyphenated style name (css property name)
      styleName = HYPHENATE(prepend ? prepend + propName : propName);

      processed = false;
      prefix = false;

      if (IS_FUNCTION(propValue)) {
        // a function can either return a css value
        // or an object with { value, prefix, name }
        fnPropValue = propValue.call(
          scope || styles,
          propValue,
          propName,
          styleName,
          styles,
        );

        if (IS_OBJECT(fnPropValue) && fnPropValue.value != null) {
          propValue = fnPropValue.value;
          prefix = fnPropValue.prefix;
          styleName = fnPropValue.name ? HYPHENATE(fnPropValue.name) : styleName;
        } else {
          propValue = fnPropValue;
        }
      }

      // tslint:disable-next-line:triple-equals
      if (parseFloat(propValue) == propValue) {
        propValue = parseFloat(propValue);
      }

      propType = typeof propValue;
      propIsNumber =
        propType === 'number' ||
        (propType === 'string' &&
          propValue !== '' &&
          propValue * 1 === propValue);

      if (
        propValue === null ||
        propValue === undefined ||
        styleName === null ||
        styleName === undefined ||
        styleName === ''
      ) {
        continue;
      }

      if (propIsNumber || propType === 'string') {
        processed = true;
      }

      if (!processed && _notUndef(propValue.value) && propValue.prefix) {
        processed = true;
        prefix = propValue.prefix;
        propValue = propValue.value;
      }

      // hyphenStyleName = camelize? HYPHENATE(styleName): styleName

      if (processed) {
        prefix = prefix || !!prefixProperties[styleName];

        if (propIsNumber) {
          propValue = addUnits && !(styleName in cssUnitless)
            ? propValue + cssUnit
            : propValue + ''; // change it to a string, so that jquery does not append px or other units
        }

        // special border treatment
        if (
          (styleName === 'border' ||
            (!styleName.indexOf('border') &&
              !~styleName.indexOf('radius') &&
              !~styleName.indexOf('width'))) &&
          propIsNumber
        ) {
          styleName = styleName + '-width';
        }

        // special border radius treatment
        if (!styleName.indexOf('border-radius-')) {
          styleName.replace(/border(-radius)(-(.*))/, function (
            str,
            radius,
            theRest,
          ) {
            const positions = {
              '-top': ['-top-left', '-top-right'],
              '-left': ['-top-left', '-bottom-left'],
              '-right': ['-top-right', '-bottom-right'],
              '-bottom': ['-bottom-left', '-bottom-right'],
            };

            if (theRest in positions) {
              styleName = [];

              positions[theRest].forEach(function (pos) {
                styleName.push('border' + pos + radius);
              });
            } else {
              styleName = 'border' + theRest + radius;
            }
          });

          if (Array.isArray(styleName)) {
            styleName.forEach(function (styleName) {
              if (prefix) {
                applyPrefix(result, styleName, propValue, normalizeFn);
              } else {
                result[normalizeFn(styleName)] = propValue;
              }
            });

            continue;
          }
        }

        if (prefix) {
          applyPrefix(result, styleName, propValue, normalizeFn);
        } else {
          result[normalizeFn(styleName)] = propValue;
        }
      } else {
        // the propValue must be an object, so go down the hierarchy
        toStyleObject(propValue, config, styleName + '-', result);
      }
    }
  }

  return result;
}
