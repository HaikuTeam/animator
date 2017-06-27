// Code in toStyleObject.js is vendored code from https://github.com/radubrehar/toStyle, which is MIT licensed.
// The repo did not contain a license text, but was labeled as MIT license in its package.json file.
// The MIT License (MIT)
// Copyright (c) Radu Brehar (?)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var prefixInfo = require('./prefixInfo');
var cssPrefixFn = require('./cssPrefix');

var HYPHENATE = require('./stringUtils/hyphenate');
var CAMELIZE = require('./stringUtils/camelize');
var HAS_OWN = require('./hasOwn');
var IS_OBJECT = require('./isObject');
var IS_FUNCTION = require('./isFunction');

var applyPrefix = function(target, property, value, normalizeFn) {
  cssPrefixFn(property).forEach(function(p) {
    target[normalizeFn ? normalizeFn(p) : p] = value;
  });
};

var toObject = function(str) {
  str = (str || '').split(';');

  var result = {};

  str.forEach(function(item) {
    var split = item.split(':');

    if (split.length == 2) {
      result[split[0].trim()] = split[1].trim();
    }
  });

  return result;
};

var CONFIG = {
  cssUnitless: require('./cssUnitless')
};

/**
 * @ignore
 * @method toStyleObject
 *
 * @param  {Object} styles The object to convert to a style object.
 * @param  {Object} [config]
 * @param  {Boolean} [config.addUnits=true] True if you want to add units when numerical values are encountered.
 * @param  {Object}  config.cssUnitless An object whose keys represent css numerical property names that will not be appended with units.
 * @param  {Object}  config.prefixProperties An object whose keys represent css property names that should be prefixed
 * @param  {String}  config.cssUnit='px' The css unit to append to numerical values. Defaults to 'px'
 * @param  {String}  config.normalizeName A function that normalizes a name to a valid css property name
 * @param  {String}  config.scope
 *
 * @return {Object} The object, normalized with css style names
 */
var TO_STYLE_OBJECT = function(styles, config, prepend, result) {
  if (typeof styles == 'string') {
    styles = toObject(styles);
  }

  config = config || CONFIG;

  config.cssUnitless = config.cssUnitless || CONFIG.cssUnitless;

  result = result || {};

  var scope = config.scope || {},
    //configs
    addUnits = config.addUnits != null
      ? config.addUnits
      : scope && scope.addUnits != null ? scope.addUnits : true,
    cssUnitless = (config.cssUnitless != null
      ? config.cssUnitless
      : scope ? scope.cssUnitless : null) || {},
    cssUnit = (config.cssUnit || scope ? scope.cssUnit : null) || 'px',
    prefixProperties = config.prefixProperties ||
    (scope ? scope.prefixProperties : null) || {},
    camelize = config.camelize,
    normalizeFn = camelize ? CAMELIZE : HYPHENATE;

  // Object.keys(cssUnitless).forEach(function(key){
  //     cssUnitless[normalizeFn(key)] = 1
  // })

  var processed,
    styleName,
    propName,
    propValue,
    propCssUnit,
    propType,
    propIsNumber,
    fnPropValue,
    prefix;

  for (propName in styles)
    if (HAS_OWN(styles, propName)) {
      propValue = styles[propName];

      //the hyphenated style name (css property name)
      styleName = HYPHENATE(prepend ? prepend + propName : propName);

      processed = false;
      prefix = false;

      if (IS_FUNCTION(propValue)) {
        //a function can either return a css value
        //or an object with { value, prefix, name }
        fnPropValue = propValue.call(
          scope || styles,
          propValue,
          propName,
          styleName,
          styles
        );

        if (IS_OBJECT(fnPropValue) && fnPropValue.value != null) {
          propValue = fnPropValue.value;
          prefix = fnPropValue.prefix;
          styleName = fnPropValue.name
            ? HYPHENATE(fnPropValue.name)
            : styleName;
        } else {
          propValue = fnPropValue;
        }
      }

      propType = typeof propValue;
      propIsNumber = propType == 'number' ||
        (propType == 'string' && propValue != '' && propValue * 1 == propValue);

      if (propValue == null || styleName == null || styleName === '') {
        continue;
      }

      if (propIsNumber || propType == 'string') {
        processed = true;
      }

      if (!processed && propValue.value != null && propValue.prefix) {
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
            : propValue + ''; //change it to a string, so that jquery does not append px or other units
        }

        //special border treatment
        if (
          (styleName == 'border' ||
            (!styleName.indexOf('border') &&
              !~styleName.indexOf('radius') &&
              !~styleName.indexOf('width'))) &&
          propIsNumber
        ) {
          styleName = styleName + '-width';
        }

        //special border radius treatment
        if (!styleName.indexOf('border-radius-')) {
          styleName.replace(
            /border(-radius)(-(.*))/,
            function(str, radius, theRest) {
              var positions = {
                '-top': ['-top-left', '-top-right'],
                '-left': ['-top-left', '-bottom-left'],
                '-right': ['-top-right', '-bottom-right'],
                '-bottom': ['-bottom-left', '-bottom-right']
              };

              if (theRest in positions) {
                styleName = [];

                positions[theRest].forEach(function(pos) {
                  styleName.push('border' + pos + radius);
                });
              } else {
                styleName = 'border' + theRest + radius;
              }
            }
          );

          if (Array.isArray(styleName)) {
            styleName.forEach(function(styleName) {
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
        //the propValue must be an object, so go down the hierarchy
        TO_STYLE_OBJECT(propValue, config, styleName + '-', result);
      }
    }

  return result;
};

module.exports = TO_STYLE_OBJECT;
