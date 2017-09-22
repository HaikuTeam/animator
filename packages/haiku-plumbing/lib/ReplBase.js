'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _repl = require('repl');

var _repl2 = _interopRequireDefault(_repl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function cb(err, out) {
  if (err) console.log(err);
  if (out !== undefined) console.log(out);
  return out;
}

var Repl = function () {
  function Repl() {
    _classCallCheck(this, Repl);
  }

  _createClass(Repl, [{
    key: 'start',
    value: function start(prompt, scopes) {
      var r = _repl2.default.start({
        prompt: prompt + ' > '
      });

      if (!scopes.cb) scopes.cb = cb;

      for (var name in scopes) {
        Object.defineProperty(r.context, name, {
          configurable: false,
          enumerable: true,
          value: scopes[name]
        });
      }

      return this;
    }
  }]);

  return Repl;
}();

exports.default = Repl;
//# sourceMappingURL=ReplBase.js.map