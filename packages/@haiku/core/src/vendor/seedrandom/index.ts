/**
 * The MIT License
 * 
 * Copyright (c) 2015 David Bau
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

const width = 256;        // each RC4 output is 0 <= x < 256
const chunks = 6;         // at least six RC4 outputs for each double
const digits = 52;        // there are 52 significant digits in a double
const startdenom = Math.pow(width, chunks);
const significance = Math.pow(2, digits);
const overflow = significance * 2;
const mask = width - 1;
const pool = [];

//
// seedrandom()
// This is the seedrandom function described above.
//
export default function seedrandom(seed, options, callback) {
  const key = [];

  // Use the seed to initialize an ARC4 generator.
  const arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  function prng() {
    let n = arc4.g(chunks);             // Start with a numerator n < 2 ^ 48
    let d = startdenom;                 //   and denominator d = 2 ^ 48.
    let x = 0;                          //   and no 'extra last byte'.

    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  }

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  return prng;
}

// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
function ARC4(key) {
  let t;
  let keylen = key.length;
  const me = this;
  let i = 0;
  let j = me.i = me.j = 0;
  const s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) {
    key = [keylen++];
  }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }

  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function g(count) {
    // Using instance members instead of closure state nearly doubles speed.
    let t;
    let r = 0;
    let i = me.i;
    let j = me.j;
    const s = me.S;

    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }

    me.i = i;
    me.j = j;

    return r;

    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
function mixkey(seed, key) {
  const stringseed = seed + '';
  let smear;
  let j = 0;

  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }

  return tostring(key);
}

// tostring()
// Converts an array of charcodes to a string
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}
