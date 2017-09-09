"use strict";
exports.__esModule = true;
var seedrandom_1 = require("./../vendor/seedrandom");
function PRNG(seed) {
    this._prng = seedrandom_1["default"](seed, null, null);
}
exports["default"] = PRNG;
PRNG.prototype.random = function random() {
    return this._prng();
};
//# sourceMappingURL=PRNG.js.map