const {debounce} = require('lodash')

const REPORT_INTERVAL = 1800000 // 30mins

class ActivityMonitor {
  constructor (
    context = window,
    reportCallback
  ) {
    this.log = debounce(this.log.bind(this), 1000)
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
    this.send(this.activity)
    if (typeof this.reportCallback === 'function') {
      this.reportCallback(this.activity)
    }
    this.activity = false
  }

  send (activity) {
    // notify inkstone
  }
}

module.exports = ActivityMonitor
