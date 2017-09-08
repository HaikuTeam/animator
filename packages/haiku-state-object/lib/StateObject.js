'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StateObject = function (_EventEmitter) {
  _inherits(StateObject, _EventEmitter);

  function StateObject() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, StateObject);

    var _this = _possibleConstructorReturn(this, (StateObject.__proto__ || Object.getPrototypeOf(StateObject)).call(this));

    _this.reset(state);
    if (_this.initialize) _this.initialize(_this.state);
    return _this;
  }

  _createClass(StateObject, [{
    key: 'reset',
    value: function reset() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.state = state;
      return this;
    }
  }, {
    key: 'all',
    value: function all() {
      return this.state;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.emit('change', key, value);
      (0, _lodash4.default)(this.state, key, value);
      return this;
    }
  }, {
    key: 'get',
    value: function get(key) {
      return (0, _lodash2.default)(this.state, key);
    }
  }]);

  return StateObject;
}(_events.EventEmitter);

exports.default = StateObject;
