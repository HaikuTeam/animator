import serializeError from './serializeError'
import { EventEmitter } from 'events'

export default class WebsocketServer extends EventEmitter {
  constructor (wss /* <- this wss should be a 'connection' socket */) {
    super()
    this.wss = wss
    this.wss.on('message', (data, flags) => {
      const message = JSON.parse(data)
      this.emit('message', message, data, flags)
    })
    this.on('message', (message) => {
      if (message.method) {
        return this.emit('request', message, (error, result) => {
          const reply = {
            error: (error) ? serializeError(error) : void (0),
            result: (result === undefined) ? null : result,
            id: message.id // Not necessarily present
          }
          return this.send(reply)
        })
      }
    })
  }

  send (message) {
    const data = JSON.stringify(message)
    return this.wss.send(data)
  }

  kill (cb) {
    this.wss.close(cb)
    return this
  }
}
