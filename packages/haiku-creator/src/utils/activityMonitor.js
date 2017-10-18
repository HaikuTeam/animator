import {debounce} from 'lodash'

const REPORT_INTERVAL = 1800000 // 30mins

class ActivityMonitor {
  constructor (
    context = window,
    reportInterval = REPORT_INTERVAL,
    reportCallback
  ) {
    this.log = debounce(this.log.bind(this), 1000)
    this.activity = false
    this.reportCallback = reportCallback
    this.reportInterval = reportInterval
    this.context = context

    this.events = [
      'mousemove',
      'mousedown',
      'keypress',
      'DOMMouseScroll',
      'mousewheel',
      'touchmove'
    ]

    setInterval(this.report.bind(this), REPORT_INTERVAL)
  }

  startWatchers () {
    this.events.forEach(event => {
      this.context.addEventListener(event, this.log, false)
    })
  }

  stopWachers () {
    this.events.forEach(event => {
      this.context.removeEventListener(event, this.log)
    })
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
    console.log('User activity sent to inkstone', activity)
  }
}

export default ActivityMonitor
