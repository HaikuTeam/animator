/**
 * Note: Only the source of
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/transformstylepreserve3d.js
 *
 * The MIT License
 * 
 * Copyright (c) 2016 Modernizr
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

function hasPreserve3d(window) {
  if (!window) {
    return false;
  }
  if (!window.document) {
    return false;
  }
  let outerAnchor;
  let innerAnchor;
  const CSS = window.CSS;
  let result = false;
  let tmp;
  if (CSS && CSS.supports && CSS.supports('(transform-style: preserve-3d)')) {
    return true;
  }
  outerAnchor = window.document.createElement('a');
  innerAnchor = window.document.createElement('a');
  outerAnchor.style.cssText =
    'display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);';
  innerAnchor.style.cssText =
    'display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);';
  outerAnchor.appendChild(innerAnchor);
  window.document.documentElement.appendChild(outerAnchor);
  tmp = innerAnchor.getBoundingClientRect();
  window.document.documentElement.removeChild(outerAnchor);
  result = tmp.width && tmp.width < 4;
  return result;
}

export default {
  hasPreserve3d,
};
