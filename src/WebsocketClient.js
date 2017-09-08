import serializeError from './serializeError'
import { EventEmitter } from 'events'
import Websocket from 'ws'

export default class WebsocketClient extends EventEmitter {
  constructor (wsc, platform = 'nodejs') {
    super()
    this.wsc = wsc
    this.wsc.on('open', this.emit.bind(this, 'open'))
    this.wsc.on('close', this.emit.bind(this, 'close'))
    this.wsc.on('error', this.emit.bind(this, 'error'))
    this.wsc.on('message', (data, flags) => {
      const message = JSON.parse(data)
      this.emit('message', message, data, flags)
    })
    this.requests = {}
    this.on('message', (message) => {
      // Don't treat signals as part of the normal req/res cycle
      if (message.signal) {
        return this.emit('signal', message.signal)
      }

      // Don't treat broadcasts as part of the normal req/res cycle
      if (message.type === 'broadcast') {
        return this.emit('broadcast', message)
      }

      const entry = this.requests[message.id]
      if (!entry) {
        return this.emit('request', message, (error, result) => {
          const reply = {
            error: (error) ? serializeError(error) : void (0),
            result: (result === undefined) ? null : result,
            id: message.id // Not necessarily present
          }
          return this.send(reply)
        })
      }
      delete this.requests[message.id]
      const callback = entry.callback
      const error = (message.error) ? serializeError(message.error) : null
      const result = message.result
      return callback(error, result)
    })
  }

  isOpen () {
    return this.wsc.readyState === Websocket.OPEN
  }

  request (message, callback) {
    if (message.id === undefined) message.id = `request-${Math.random()}`
    this.requests[message.id] = { callback }
    return this.send(message)
  }

  send (message) {
    const string = JSON.stringify(message)
    return this.wsc.send(string)
  }
}
