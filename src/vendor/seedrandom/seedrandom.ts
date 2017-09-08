let width = 256        // each RC4 output is 0 <= x < 256
let chunks = 6         // at least six RC4 outputs for each double
let digits = 52        // there are 52 significant digits in a double
let startdenom = Math.pow(width, chunks)
let significance = Math.pow(2, digits)
let overflow = significance * 2
let mask = width - 1
let pool = []

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  let key = []

  // Use the seed to initialize an ARC4 generator.
  let arc4 = new ARC4(key)

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  function prng() {
    let n = arc4.g(chunks)             // Start with a numerator n < 2 ^ 48
    let d = startdenom                 //   and denominator d = 2 ^ 48.
    let x = 0                          //   and no 'extra last byte'.

    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width              //   shifting numerator and
      d *= width                       //   denominator and generating a
      x = arc4.g(1)                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2                           //   last byte, shift everything
      d /= 2                           //   right using integer math until
      x >>>= 1                         //   we have exactly the desired bits.
    }
    return (n + x) / d                 // Form the number within [0, 1).
  }

  prng.double = prng

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool)

  return prng
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
  let t
  let keylen = key.length
  let me = this
  let i = 0
  let j = me.i = me.j = 0
  let s = me.S = []

  // The empty key [] is treated as [0].
  if (!keylen) {
    key = [keylen++]
  }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++
  }

  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))]
    s[j] = t
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function g(count) {
    // Using instance members instead of closure state nearly doubles speed.
    let t
    let r = 0
    let i = me.i
    let j = me.j
    let s = me.S

    while (count--) {
      t = s[i = mask & (i + 1)]
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))]
    }

    me.i = i
    me.j = j

    return r

    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width)
}

// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
function mixkey(seed, key) {
  let stringseed = seed + ""
  let smear
  let j = 0

  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++))
  }

  return tostring(key)
}

// tostring()
// Converts an array of charcodes to a string
function tostring(a) {
  return String.fromCharCode.apply(0, a)
}

module.exports = seedrandom
