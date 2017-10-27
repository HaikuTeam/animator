'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('lodash'),
    debounce = _require.debounce;

var REPORT_INTERVAL = 1800000; // 30mins
var DEBOUNCE_RATIO = 1000;

/*
 * Utility that keeps track if the user was active over a defined
 * period of time, and executes a callback with an argument that
 * indicates whether the user was active over that period of time
 * or not.
 *
 * @param {object} context to listen for events, defaults to Window
 * @param {function} callback to be executed after a period
 * of time defined when calling #startWatchers
 * @param {number} ratio to debounce event listeners, in miliseconds
 */

var ActivityMonitor = function () {
  function ActivityMonitor() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
    var reportCallback = arguments[1];
    var debounceRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEBOUNCE_RATIO;

    _classCallCheck(this, ActivityMonitor);

    this._log = debounce(this._log.bind(this), debounceRatio);
    this.activity = false;
    this.reportCallback = reportCallback;
    this.context = context;

    this.events = ['mousemove', 'mousedown', 'keypress', 'DOMMouseScroll', 'mousewheel', 'touchmove'];
  }

  /*
   * Adds event listeners for most commonly used user interaction events
   * and starts the interval check.
   *
   * @param {number} reportInterval
   */


  _createClass(ActivityMonitor, [{
    key: 'startWatchers',
    value: function startWatchers() {
      var _this = this;

      var reportInterval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : REPORT_INTERVAL;

      this.events.forEach(function (event) {
        _this.context.addEventListener(event, _this._log, false);
      });

      this.interval = setInterval(this._report.bind(this), reportInterval);
    }

    /*
     * Removes event listeners for listener bind on #startWatchers
     * and stops the interval check.
     *
     * @param {number} reportInterval
     */

  }, {
    key: 'stopWatchers',
    value: function stopWatchers() {
      var _this2 = this;

      this.events.forEach(function (event) {
        _this2.context.removeEventListener(event, _this2._log);
      });

      clearInterval(this.interval);
    }
  }, {
    key: '_log',
    value: function _log() {
      this.activity = true;
    }
  }, {
    key: '_report',
    value: function _report() {
      if (typeof this.reportCallback === 'function') {
        this.reportCallback(this.activity);
      }

      this.activity = false;
    }
  }]);

  return ActivityMonitor;
}();

module.exports = ActivityMonitor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9hY3Rpdml0eU1vbml0b3IuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImRlYm91bmNlIiwiUkVQT1JUX0lOVEVSVkFMIiwiREVCT1VOQ0VfUkFUSU8iLCJBY3Rpdml0eU1vbml0b3IiLCJjb250ZXh0Iiwid2luZG93IiwicmVwb3J0Q2FsbGJhY2siLCJkZWJvdW5jZVJhdGlvIiwiX2xvZyIsImJpbmQiLCJhY3Rpdml0eSIsImV2ZW50cyIsInJlcG9ydEludGVydmFsIiwiZm9yRWFjaCIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJfcmVwb3J0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNsZWFySW50ZXJ2YWwiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7ZUFBbUJBLFFBQVEsUUFBUixDO0lBQVpDLFEsWUFBQUEsUTs7QUFFUCxJQUFNQyxrQkFBa0IsT0FBeEIsQyxDQUFnQztBQUNoQyxJQUFNQyxpQkFBaUIsSUFBdkI7O0FBRUE7Ozs7Ozs7Ozs7OztJQVdNQyxlO0FBQ0osNkJBSUU7QUFBQSxRQUhBQyxPQUdBLHVFQUhVQyxNQUdWO0FBQUEsUUFGQUMsY0FFQTtBQUFBLFFBREFDLGFBQ0EsdUVBRGdCTCxjQUNoQjs7QUFBQTs7QUFDQSxTQUFLTSxJQUFMLEdBQVlSLFNBQVMsS0FBS1EsSUFBTCxDQUFVQyxJQUFWLENBQWUsSUFBZixDQUFULEVBQStCRixhQUEvQixDQUFaO0FBQ0EsU0FBS0csUUFBTCxHQUFnQixLQUFoQjtBQUNBLFNBQUtKLGNBQUwsR0FBc0JBLGNBQXRCO0FBQ0EsU0FBS0YsT0FBTCxHQUFlQSxPQUFmOztBQUVBLFNBQUtPLE1BQUwsR0FBYyxDQUNaLFdBRFksRUFFWixXQUZZLEVBR1osVUFIWSxFQUlaLGdCQUpZLEVBS1osWUFMWSxFQU1aLFdBTlksQ0FBZDtBQVFEOztBQUVEOzs7Ozs7Ozs7O29DQU1pRDtBQUFBOztBQUFBLFVBQWxDQyxjQUFrQyx1RUFBakJYLGVBQWlCOztBQUMvQyxXQUFLVSxNQUFMLENBQVlFLE9BQVosQ0FBb0IsaUJBQVM7QUFDM0IsY0FBS1QsT0FBTCxDQUFhVSxnQkFBYixDQUE4QkMsS0FBOUIsRUFBcUMsTUFBS1AsSUFBMUMsRUFBZ0QsS0FBaEQ7QUFDRCxPQUZEOztBQUlBLFdBQUtRLFFBQUwsR0FBZ0JDLFlBQVksS0FBS0MsT0FBTCxDQUFhVCxJQUFiLENBQWtCLElBQWxCLENBQVosRUFBcUNHLGNBQXJDLENBQWhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzttQ0FNZ0I7QUFBQTs7QUFDZCxXQUFLRCxNQUFMLENBQVlFLE9BQVosQ0FBb0IsaUJBQVM7QUFDM0IsZUFBS1QsT0FBTCxDQUFhZSxtQkFBYixDQUFpQ0osS0FBakMsRUFBd0MsT0FBS1AsSUFBN0M7QUFDRCxPQUZEOztBQUlBWSxvQkFBYyxLQUFLSixRQUFuQjtBQUNEOzs7MkJBRU87QUFDTixXQUFLTixRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7Ozs4QkFFVTtBQUNULFVBQUksT0FBTyxLQUFLSixjQUFaLEtBQStCLFVBQW5DLEVBQStDO0FBQzdDLGFBQUtBLGNBQUwsQ0FBb0IsS0FBS0ksUUFBekI7QUFDRDs7QUFFRCxXQUFLQSxRQUFMLEdBQWdCLEtBQWhCO0FBQ0Q7Ozs7OztBQUdIVyxPQUFPQyxPQUFQLEdBQWlCbkIsZUFBakIiLCJmaWxlIjoiYWN0aXZpdHlNb25pdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qge2RlYm91bmNlfSA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbmNvbnN0IFJFUE9SVF9JTlRFUlZBTCA9IDE4MDAwMDAgLy8gMzBtaW5zXG5jb25zdCBERUJPVU5DRV9SQVRJTyA9IDEwMDBcblxuLypcbiAqIFV0aWxpdHkgdGhhdCBrZWVwcyB0cmFjayBpZiB0aGUgdXNlciB3YXMgYWN0aXZlIG92ZXIgYSBkZWZpbmVkXG4gKiBwZXJpb2Qgb2YgdGltZSwgYW5kIGV4ZWN1dGVzIGEgY2FsbGJhY2sgd2l0aCBhbiBhcmd1bWVudCB0aGF0XG4gKiBpbmRpY2F0ZXMgd2hldGhlciB0aGUgdXNlciB3YXMgYWN0aXZlIG92ZXIgdGhhdCBwZXJpb2Qgb2YgdGltZVxuICogb3Igbm90LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IHRvIGxpc3RlbiBmb3IgZXZlbnRzLCBkZWZhdWx0cyB0byBXaW5kb3dcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIGFmdGVyIGEgcGVyaW9kXG4gKiBvZiB0aW1lIGRlZmluZWQgd2hlbiBjYWxsaW5nICNzdGFydFdhdGNoZXJzXG4gKiBAcGFyYW0ge251bWJlcn0gcmF0aW8gdG8gZGVib3VuY2UgZXZlbnQgbGlzdGVuZXJzLCBpbiBtaWxpc2Vjb25kc1xuICovXG5jbGFzcyBBY3Rpdml0eU1vbml0b3Ige1xuICBjb25zdHJ1Y3RvciAoXG4gICAgY29udGV4dCA9IHdpbmRvdyxcbiAgICByZXBvcnRDYWxsYmFjayxcbiAgICBkZWJvdW5jZVJhdGlvID0gREVCT1VOQ0VfUkFUSU9cbiAgKSB7XG4gICAgdGhpcy5fbG9nID0gZGVib3VuY2UodGhpcy5fbG9nLmJpbmQodGhpcyksIGRlYm91bmNlUmF0aW8pXG4gICAgdGhpcy5hY3Rpdml0eSA9IGZhbHNlXG4gICAgdGhpcy5yZXBvcnRDYWxsYmFjayA9IHJlcG9ydENhbGxiYWNrXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dFxuXG4gICAgdGhpcy5ldmVudHMgPSBbXG4gICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICdtb3VzZWRvd24nLFxuICAgICAgJ2tleXByZXNzJyxcbiAgICAgICdET01Nb3VzZVNjcm9sbCcsXG4gICAgICAnbW91c2V3aGVlbCcsXG4gICAgICAndG91Y2htb3ZlJ1xuICAgIF1cbiAgfVxuXG4gIC8qXG4gICAqIEFkZHMgZXZlbnQgbGlzdGVuZXJzIGZvciBtb3N0IGNvbW1vbmx5IHVzZWQgdXNlciBpbnRlcmFjdGlvbiBldmVudHNcbiAgICogYW5kIHN0YXJ0cyB0aGUgaW50ZXJ2YWwgY2hlY2suXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSByZXBvcnRJbnRlcnZhbFxuICAgKi9cbiAgc3RhcnRXYXRjaGVycyAocmVwb3J0SW50ZXJ2YWwgPSBSRVBPUlRfSU5URVJWQUwpIHtcbiAgICB0aGlzLmV2ZW50cy5mb3JFYWNoKGV2ZW50ID0+IHtcbiAgICAgIHRoaXMuY29udGV4dC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCB0aGlzLl9sb2csIGZhbHNlKVxuICAgIH0pXG5cbiAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwodGhpcy5fcmVwb3J0LmJpbmQodGhpcyksIHJlcG9ydEludGVydmFsKVxuICB9XG5cbiAgLypcbiAgICogUmVtb3ZlcyBldmVudCBsaXN0ZW5lcnMgZm9yIGxpc3RlbmVyIGJpbmQgb24gI3N0YXJ0V2F0Y2hlcnNcbiAgICogYW5kIHN0b3BzIHRoZSBpbnRlcnZhbCBjaGVjay5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHJlcG9ydEludGVydmFsXG4gICAqL1xuICBzdG9wV2F0Y2hlcnMgKCkge1xuICAgIHRoaXMuZXZlbnRzLmZvckVhY2goZXZlbnQgPT4ge1xuICAgICAgdGhpcy5jb250ZXh0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIHRoaXMuX2xvZylcbiAgICB9KVxuXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKVxuICB9XG5cbiAgX2xvZyAoKSB7XG4gICAgdGhpcy5hY3Rpdml0eSA9IHRydWVcbiAgfVxuXG4gIF9yZXBvcnQgKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5yZXBvcnRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5yZXBvcnRDYWxsYmFjayh0aGlzLmFjdGl2aXR5KVxuICAgIH1cblxuICAgIHRoaXMuYWN0aXZpdHkgPSBmYWxzZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQWN0aXZpdHlNb25pdG9yXG4iXX0=