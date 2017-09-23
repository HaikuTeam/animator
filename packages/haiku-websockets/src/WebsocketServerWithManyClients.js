import clone from 'lodash.clone'
import filter from 'lodash.filter'
import Websocket from 'ws'
import { EventEmitter } from 'events'
import qs from 'qs'

const DEFAULT_URL = ''
const DEFAULT_QUERY = ''
const DEFAULT_TYPE = 'default'
var DEFAULT_HAIKU = {}

export default class WebsocketServerWithManyClients extends EventEmitter {
  constructor (config = {}) {
    super()
    this.wss = new Websocket.Server(config)
    this.wss.on('connection', (websocket, request) => {
      var url = request.url || DEFAULT_URL
      var query = url.split('?')[1] || DEFAULT_QUERY
      var params = qs.parse(query)
      if (!params.type) params.type = DEFAULT_TYPE
      if (!params.haiku) params.haiku = DEFAULT_HAIKU
      if (!websocket.params) websocket.params = params
      this.emit('connection', websocket)
      return websocket.on('message', (data) => {
        return this.handleClientMessage(data, websocket)
      })
    })
    this.requests = {}
  }

  handleClientMessage (data, websocket) {
    const message = jsonParse(data)
    const array = this.requests[message.id]
    // Assume this is an incoming standalone request, not one we are waiting a reply to
    if (!array) {
      return this.emit('message', message, websocket)
    }
    delete this.requests[message.id]
    return array.forEach((entry) => {
      const callback = entry.callback
      return callback(message.error, message.result, entry.message.index)
    })
  }

  requestToClients (clients, message, callback) {
    if (message.id === undefined) message.id = `request-${Math.random()}`
    if (!this.requests[message.id]) this.requests[message.id] = []
    return clients.forEach((websocket, index) => {
      const msg = clone(message)
      msg.index = this.requests[message.id].push({ message, callback }) - 1
      const string = JSON.stringify(message)
      return websocket.send(string)
    })
  }

  requestToAllConnectedClients (message, callback) {
    return this.requestToClients(this.wss.clients, message, callback)
  }

  requestToClientsWhere (query, message, callback) {
    var filtered = filter(this.wss.clients, query)
    return this.requestToClients(filtered, message, callback)
  }

  teardown (cb) {
    return this.wss.close(cb)
  }
}

function jsonParse(str) {
  try {
    return JSON.parse(str)
  } catch (exception) {
    return {}
  }
}
