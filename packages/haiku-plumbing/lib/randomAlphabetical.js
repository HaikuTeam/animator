'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = randomAlphabetical;
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomAlphabetical(len) {
  var text = '';
  for (var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }return text;
}
//# sourceMappingURL=randomAlphabetical.js.map