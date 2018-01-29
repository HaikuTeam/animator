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

import toUpperFirst from './stringUtils/toUpperFirst';

const re = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;

const docStyle = typeof document === 'undefined'
  ? {}
  : document.documentElement.style;

function prefixInfoFn() {
  const prefix = (function () {
    for (const prop in docStyle) {
      if (re.test(prop)) {
        // test is faster than match, so it's better to perform
        // that on the lot and match only when necessary
        return prop.match(re)[0];
      }
    }

    // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
    // However (prop in style) returns the correct value, so we'll have to test for
    // the precence of a specific property
    if ('WebkitOpacity' in docStyle) {
      return 'Webkit';
    }

    if ('KhtmlOpacity' in docStyle) {
      return 'Khtml';
    }

    return '';
  })();

  const lower = prefix.toLowerCase();

  return {
    style: prefix,
    css: '-' + lower + '-',
    dom:
        {
          Webkit: 'WebKit',
          ms: 'MS',
          o: 'WebKit',
        }[prefix] || toUpperFirst(prefix),
  };
}

const prefixInfo = prefixInfoFn();

export default prefixInfo;
