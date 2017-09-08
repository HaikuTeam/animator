import each from 'lodash.foreach'
import { EventEmitter } from 'events'
import Websocket from 'ws'
import WebsocketClient from './WebsocketClient'

export default class WebsocketClientGroup extends EventEmitter {
  constructor (platform = 'nodejs') {
    super()
    this.platform = platform
    this.clients = {}
  }

  setup (mapping) {
    each(mapping, (url, name) => {
      const wsc = new Websocket(url)
      const client = new WebsocketClient(wsc, this.platform)
      client.on('open', () => {
        this.clients[name] = client
        // We're ready if we've successfully opened all connections in this group
        if (Object.keys(mapping).length === Object.keys(this.clients).length) {
          this.emit('ready', mapping, this.clients, this)
        }
      })
    })
  }
}

WebsocketClientGroup.fleetToClientMapping = function fleetToClientMapping (fleet) {
  const mapping = {}
  each(fleet, (ship) => {
    mapping[ship.alias] = ship.control.websocket
  })
  return mapping
}
