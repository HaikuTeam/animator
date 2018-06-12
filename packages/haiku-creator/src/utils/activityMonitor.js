const {debounce} = require('lodash');

const REPORT_INTERVAL = 1800000; // 30mins
const DEBOUNCE_RATIO = 1000;

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
class ActivityMonitor {
  constructor (
    context = window,
    reportCallback,
    debounceRatio = DEBOUNCE_RATIO,
  ) {
    this._log = debounce(this._log.bind(this), debounceRatio);
    this.activity = false;
    this.reportCallback = reportCallback;
    this.context = context;

    this.events = [
      'mousemove',
      'mousedown',
      'keypress',
      'DOMMouseScroll',
      'mousewheel',
      'touchmove',
    ];
  }

  /*
   * Adds event listeners for most commonly used user interaction events
   * and starts the interval check.
   *
   * @param {number} reportInterval
   */
  startWatchers (reportInterval = REPORT_INTERVAL) {
    this.events.forEach((event) => {
      this.context.addEventListener(event, this._log, false);
    });

    this.interval = setInterval(this._report.bind(this), reportInterval);
  }

  /*
   * Removes event listeners for listener bind on #startWatchers
   * and stops the interval check.
   *
   * @param {number} reportInterval
   */
  stopWatchers () {
    this.events.forEach((event) => {
      this.context.removeEventListener(event, this._log);
    });

    clearInterval(this.interval);
  }

  _log () {
    this.activity = true;

    // if last known activity was prior to interval, immediately report
    // (reporting on the "rising edge" of user activity gets better results)
    const lastActivity = this.lastActivity;
    const newActivity = Date.now();
    this.lastActivity = newActivity;

    const lastPeriod = newActivity - lastActivity;

    if (lastPeriod > REPORT_INTERVAL) {
      this.reportCallback(true);
    }
  }

  _report () {
    if (typeof this.reportCallback === 'function') {
      this.reportCallback(this.activity);
    }

    this.activity = false;
  }
}

export default ActivityMonitor;
