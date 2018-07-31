/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import seedrandom from '../vendor/seedrandom';

// tslint:disable-next-line:function-name
export default function PRNG (seed) {
  this._prng = seedrandom(seed, null, null);
}

PRNG.prototype.random = function random () {
  return this._prng();
};
