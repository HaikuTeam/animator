import get from 'lodash.get'
import set from 'lodash.set'
import { EventEmitter } from 'events'

export default class StateObject extends EventEmitter {
  constructor (state = {}) {
    super()
    this.reset(state)
    if (this.initialize) this.initialize(this.state)
  }

  reset (state = {}) {
    this.state = state
    return this
  }

  all () {
    return this.state
  }

  set (key, value) {
    this.emit('change', key, value)
    set(this.state, key, value)
    return this
  }

  get (key) {
    return get(this.state, key)
  }
}
