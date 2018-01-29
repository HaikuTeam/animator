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

import camelize from './stringUtils/camelize';
import hyphenate from './stringUtils/hyphenate';
import toLowerFirst from './stringUtils/toLowerFirst';
import toUpperFirst from './stringUtils/toUpperFirst';
import prefixInfo from './prefixInfo';
import prefixProperties from './prefixProperties';

const docStyle = typeof document === 'undefined'
  ? {}
  : document.documentElement.style;

export default function prefixer(asStylePrefix) {
  return function (name, config) {
    config = config || {};

    const styleName = toLowerFirst(camelize(name));

    const cssName = hyphenate(name);

    const theName = asStylePrefix ? styleName : cssName;

    const thePrefix = prefixInfo.style
      ? asStylePrefix ? prefixInfo.style : prefixInfo.css
      : '';

    if (styleName in docStyle) {
      return config.asString ? theName : [theName];
    }

    // not a valid style name, so we'll return the value with a prefix

    let upperCased = theName;
    const prefixProperty = prefixProperties[cssName];
    let result = [];

    if (asStylePrefix) {
      upperCased = toUpperFirst(theName);
    }

    if (typeof prefixProperty === 'function') {
      let prefixedCss = prefixProperty(theName, thePrefix) || [];
      if (prefixedCss && !Array.isArray(prefixedCss)) {
        prefixedCss = [prefixedCss];
      }

      if (prefixedCss.length) {
        prefixedCss = prefixedCss.map(function (property) {
          return asStylePrefix
            ? toLowerFirst(camelize(property))
            : hyphenate(property);
        });
      }

      result = result.concat(prefixedCss);
    }

    if (thePrefix) {
      result.push(thePrefix + upperCased);
    }

    result.push(theName);

    if (config.asString || result.length === 1) {
      return result[0];
    }

    return result;
  };
}
