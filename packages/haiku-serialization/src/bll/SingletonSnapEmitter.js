
// hack for data flow, since there's no elegant way to
// get data from ElementSelectionProxy.js to Glass.js
const EventEmitter = require('event-emitter')
let _instance = new EventEmitter()

class SingletonSnapEmitter {
  static getInstance () { return _instance }
}

module.exports = SingletonSnapEmitter
