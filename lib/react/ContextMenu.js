'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var _require2 = require('electron'),
    remote = _require2.remote;

var Menu = remote.Menu,
    MenuItem = remote.MenuItem;

var ContextMenu = function (_EventEmitter) {
  _inherits(ContextMenu, _EventEmitter);

  function ContextMenu(react, options) {
    _classCallCheck(this, ContextMenu);

    var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this));

    _this.show(react, options);
    return _this;
  }

  _createClass(ContextMenu, [{
    key: 'show',
    value: function show(react, options) {
      var _this2 = this;

      this._menu = new Menu();

      if (options.library) {
        this._menu.append(new MenuItem({
          label: 'Open in Sketch',
          click: function click(event) {
            _this2.emit('context-menu:open-in-sketch');
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Show in Finder',
          click: function click(event) {
            _this2.emit('context-menu:show-in-finder');
          }
        }));
      }

      this._menu.popup(remote.getCurrentWindow());
    }
  }]);

  return ContextMenu;
}(EventEmitter);

exports.default = ContextMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9Db250ZXh0TWVudS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiRXZlbnRFbWl0dGVyIiwicmVtb3RlIiwiTWVudSIsIk1lbnVJdGVtIiwiQ29udGV4dE1lbnUiLCJyZWFjdCIsIm9wdGlvbnMiLCJzaG93IiwiX21lbnUiLCJsaWJyYXJ5IiwiYXBwZW5kIiwibGFiZWwiLCJjbGljayIsImV2ZW50IiwiZW1pdCIsInBvcHVwIiwiZ2V0Q3VycmVudFdpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7ZUFBeUJBLFFBQVEsUUFBUixDO0lBQWpCQyxZLFlBQUFBLFk7O2dCQUNXRCxRQUFRLFVBQVIsQztJQUFYRSxNLGFBQUFBLE07O0lBQ0FDLEksR0FBbUJELE0sQ0FBbkJDLEk7SUFBTUMsUSxHQUFhRixNLENBQWJFLFE7O0lBRU9DLFc7OztBQUNuQix1QkFBYUMsS0FBYixFQUFvQkMsT0FBcEIsRUFBNkI7QUFBQTs7QUFBQTs7QUFFM0IsVUFBS0MsSUFBTCxDQUFVRixLQUFWLEVBQWlCQyxPQUFqQjtBQUYyQjtBQUc1Qjs7Ozt5QkFFS0QsSyxFQUFPQyxPLEVBQVM7QUFBQTs7QUFDcEIsV0FBS0UsS0FBTCxHQUFhLElBQUlOLElBQUosRUFBYjs7QUFFQSxVQUFJSSxRQUFRRyxPQUFaLEVBQXFCO0FBQ25CLGFBQUtELEtBQUwsQ0FBV0UsTUFBWCxDQUFrQixJQUFJUCxRQUFKLENBQWE7QUFDN0JRLGlCQUFPLGdCQURzQjtBQUU3QkMsaUJBQU8sZUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLG1CQUFLQyxJQUFMLENBQVUsNkJBQVY7QUFDRDtBQUo0QixTQUFiLENBQWxCOztBQU9BLGFBQUtOLEtBQUwsQ0FBV0UsTUFBWCxDQUFrQixJQUFJUCxRQUFKLENBQWE7QUFDN0JRLGlCQUFPLGdCQURzQjtBQUU3QkMsaUJBQU8sZUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLG1CQUFLQyxJQUFMLENBQVUsNkJBQVY7QUFDRDtBQUo0QixTQUFiLENBQWxCO0FBTUQ7O0FBRUQsV0FBS04sS0FBTCxDQUFXTyxLQUFYLENBQWlCZCxPQUFPZSxnQkFBUCxFQUFqQjtBQUNEOzs7O0VBMUJzQ2hCLFk7O2tCQUFwQkksVyIsImZpbGUiOiJDb250ZXh0TWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgeyByZW1vdGUgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmNvbnN0IHsgTWVudSwgTWVudUl0ZW0gfSA9IHJlbW90ZVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0TWVudSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yIChyZWFjdCwgb3B0aW9ucykge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNob3cocmVhY3QsIG9wdGlvbnMpXG4gIH1cblxuICBzaG93IChyZWFjdCwgb3B0aW9ucykge1xuICAgIHRoaXMuX21lbnUgPSBuZXcgTWVudSgpXG5cbiAgICBpZiAob3B0aW9ucy5saWJyYXJ5KSB7XG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ09wZW4gaW4gU2tldGNoJyxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnY29udGV4dC1tZW51Om9wZW4taW4tc2tldGNoJylcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnU2hvdyBpbiBGaW5kZXInLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdjb250ZXh0LW1lbnU6c2hvdy1pbi1maW5kZXInKVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9XG5cbiAgICB0aGlzLl9tZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpXG4gIH1cbn1cbiJdfQ==