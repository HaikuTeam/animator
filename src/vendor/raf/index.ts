/* tslint:disable */

/**
 * The MIT License
 *
 * Copyright (c) 2017 Chris Dickinson
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

import performanceNow from '../performance-now';

const root = typeof window === 'undefined' ? global : window;
const vendors = ['moz', 'webkit'];
const suffix = 'AnimationFrame';

let raf: Function;
let caf: Function;

if (typeof window !== 'undefined') {
  raf = window['request' + suffix];
  caf = window['cancel' + suffix] || window['cancelRequest' + suffix];

  for (let i = 0; !raf && i < vendors.length; i++) {
    raf = window[vendors[i] + 'Request' + suffix];
    caf =
      window[vendors[i] + 'Cancel' + suffix] ||
      window[vendors[i] + 'CancelRequest' + suffix];
  }

  // Some versions of FF have rAF but not cAF
  if (!raf || !caf) {
    let last = 0,
      id = 0,
      queue = [],
      frameDuration = 1000 / 60;

    raf = function (callback) {
      if (queue.length === 0) {
        const _now = performanceNow(),
          next = Math.max(0, frameDuration - (_now - last));
        last = next + _now;
        setTimeout(function () {
          const cp = queue.slice(0);
          // Clear queue here to prevent
          // callbacks from appending listeners
          // to the current frame's queue
          queue.length = 0;
          for (let i = 0; i < cp.length; i++) {
            if (!cp[i].cancelled) {
              try {
                cp[i].callback(last);
              } catch (e) {
                setTimeout(function () {
                  throw e;
                }, 0);
              }
            }
          }
        }, Math.round(next));
      }
      queue.push({
        handle: ++id,
        callback,
        cancelled: false,
      });
      return id;
    };

    caf = function (handle) {
      for (let i = 0; i < queue.length; i++) {
        if (queue[i].handle === handle) {
          queue[i].cancelled = true;
        }
      }
    };
  }
} else {
  // Turn raf and caf into noops outside of the web.
  // This should help with leaked handles/isomorphic rendering.
  raf = caf = () => {};
}

function rafCall (fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn);
}

function cafCall (...args) {
  return caf.apply(root, args);
}

export default {
  request: rafCall,
  cancel: cafCall,
};
