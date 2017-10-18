const {debounce} = require('lodash')

const REPORT_INTERVAL = 1800000 // 30mins
const DEBOUNCE_RATIO = 1000

class ActivityMonitor {
  constructor (
    context = window,
    reportCallback,
    debounceRatio = DEBOUNCE_RATIO
  ) {
    this.log = debounce(this.log.bind(this), debounceRatio)
    this.activity = false
    this.reportCallback = reportCallback
    this.context = context

    this.events = [
      'mousemove',
      'mousedown',
      'keypress',
      'DOMMouseScroll',
      'mousewheel',
      'touchmove'
    ]
  }

  startWatchers (reportInterval = REPORT_INTERVAL) {
    this.events.forEach(event => {
      this.context.addEventListener(event, this.log, false)
    })

    this.interval = setInterval(this.report.bind(this), reportInterval)
  }

  stopWatchers () {
    this.events.forEach(event => {
      this.context.removeEventListener(event, this.log)
    })

    clearInterval(this.interval)
  }

  log () {
    this.activity = true
  }

  report () {
    if (typeof this.reportCallback === 'function') {
      this.reportCallback(this.activity)
    }

    this.activity = false
  }
}

module.exports = ActivityMonitor
