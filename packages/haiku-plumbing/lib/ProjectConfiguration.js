'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _safeRequire = require('./safeRequire');

var _safeRequire2 = _interopRequireDefault(_safeRequire);

var _haikuStateObject = require('haiku-state-object');

var _haikuStateObject2 = _interopRequireDefault(_haikuStateObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CONFIGURATION_PATH = 'haiku.js';
var DEFAULTS = {}; // ?

var ProjectConfiguration = function (_StateObject) {
  _inherits(ProjectConfiguration, _StateObject);

  function ProjectConfiguration() {
    _classCallCheck(this, ProjectConfiguration);

    return _possibleConstructorReturn(this, (ProjectConfiguration.__proto__ || Object.getPrototypeOf(ProjectConfiguration)).apply(this, arguments));
  }

  _createClass(ProjectConfiguration, [{
    key: 'load',
    value: function load(folder, cb) {
      var _this2 = this;

      var abspath = _path2.default.join(folder, CONFIGURATION_PATH);
      return (0, _safeRequire2.default)(abspath, function (err, loaded) {
        if (err) return cb(err);
        if (!loaded) return cb(new Error('Cannot find project configuration'));
        var config = (0, _lodash2.default)({}, DEFAULTS, loaded);

        // Object.defineProperty(this, 'config', { value: config })
        _this2.set('config', config);

        return cb(null, _this2);
      });
    }
  }]);

  return ProjectConfiguration;
}(_haikuStateObject2.default);

exports.default = ProjectConfiguration;
//# sourceMappingURL=ProjectConfiguration.js.map