"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reverseEach;
// Convenient when you need to slice the array in place and have iteration continue
function reverseEach(arr, iterator) {
  for (var i = arr.length - 1; i >= 0; i--) {
    iterator(arr[i], i, arr);
  }
}
//# sourceMappingURL=reverseEach.js.map