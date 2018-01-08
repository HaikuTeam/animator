var util = require('util')
var EventEmitter = require('events').EventEmitter
var serializeError = require('./../utils/serializeError')

var STATES = {
  CONNECTING: 0, // The connection is not yet open.
  OPEN: 1, // The connection is open and ready to communicate.
  CLOSING: 2, // The connection is in the process of closing.
  CLOSED: 3 // The connection is closed or couldn't be opened.
}

// Simple wrapper over an in-browser websocket client
function Websocket (url, folder, clientType, clientAlias, WebSocket, token) {
  EventEmitter.call(this)

  this.WebSocket = WebSocket
  if (!this.WebSocket && typeof window !== 'undefined') {
    this.WebSocket = window.WebSocket
  }

  if (!url) throw new Error('A url is required')
  if (!clientType) throw new Error('A client type is required')
  if (!clientType) throw new Error('A client type is required')

  if (!folder) {
    console.warn('[websocket] received no folder argument')
  }

  // NOTE: The plumbing uses these URL query params to manage comms between clients
  this.url = url + '?type=' + clientType + '&alias=' + clientAlias
  if (folder) this.url += ('&folder=' + folder)
  if (token) this.url += ('&token=' + token)

  this.folder = folder
  this.queue = []
  this.requests = {}

  this.workers = {
    queue: setInterval(function _queueWorker () {
      if (this._isPermanentlyDisconnected) return null
      this.flushQueue()
    }.bind(this), 32),

    connection: setInterval(function _connectionWorker () {
      if (this._isPermanentlyDisconnected) return null
      if (this.ws.readyState === STATES.CLOSING || this.ws.readyState === STATES.CLOSED) {
        this.connect()
      }
    }.bind(this), 1000)
  }

  this._isPermanentlyDisconnected = false

  this.connect()
}

util.inherits(Websocket, EventEmitter)

Websocket.prototype.disconnect = function disconnect () {
  // Stop the worker from attempting to reconnect until explicitly requested to do so
  this._isPermanentlyDisconnected = true

  // May as well clear the queue since there's not a safe way to deal with these requests
  this.queue.splice(0)
  this.requests = {}

  if (this.ws) {
    // To avoid any kind of infinite loop in eventing, only call close if we're
    // not already closing (see Master.js' constructor to understand why)
    if (this.ws.readyState === STATES.OPEN || this.ws.readyState === STATES.CONNECTING) {
      this.ws.close()
    }
  }
}

Websocket.prototype.connect = function connect (cb) {
  this._isPermanentlyDisconnected = false

  var WebSocket = this.WebSocket

  if (this.ws) {
    // If we have an instance but are closing or closed, create a new connection
    if (this.ws.readyState === STATES.CLOSING || this.ws.readyState === STATES.CLOSED) {
      this.ws = new WebSocket(this.url)
      this.setupSocket()
    }
  } else {
    // If we don't even have an instance yet, just create a new connection
    this.ws = new WebSocket(this.url)
    this.setupSocket()
  }

  if (cb) {
    return this.whenConnected(cb)
  }
}

Websocket.prototype.setupSocket = function setupSocket () {
  console.info('[websocket] connecting to ' + this.url + ' (' + (this.folder || '?') + ')')

  this.ws.onopen = function _onopen () {
    console.info('[websocket] connection opened (' + this.url + ')')
    this.emit('open')
  }.bind(this)

  this.ws.onclose = function _onclose () {
    console.info('[websocket] connection closed (' + this.url + ')')
    // Sometimes it seems this change happens on a delay so we set it right away
    this.ws.readyState = this.WebSocket.CLOSED
    this.emit('close')
  }.bind(this)

  this.ws.onerror = function _onerror (error) {
    if (error && error.message) console.error('[websocket] error: ' + error && error.message)
    else console.error('[websocket] error: ', error || 'Unknown')
    this.emit('error', error)
  }.bind(this)

  this.ws.onmessage = function _onmessage (event) {
    var message = JSON.parse(event.data)

    if (message.type === 'broadcast') {
      return this.emit('broadcast', message)
    } else if (message.type === 'signal') {
      return this.emit('signal', message)
    }

    // Assume the message is a reply if the incoming has an id that matches one of our outgoing
    if (this.requests[message.id]) {
      var entry = this.requests[message.id]
      delete this.requests[message.id] // Remove from incoming requests

      var callback = entry.callback
      var error = (message.error) ? serializeError(message.error) : null
      var result = message.result

      return callback(error, result)
    }

    if (typeof message.method === 'string') {
      return this.emit('method', message.method, message.params || [], message, function _cb (error, result) {
        return this.sendWhenConnected({
          id: message.id,
          folder: message.folder || this.folder,
          result: (result !== undefined) ? result : void (0),
          error: (error) ? serializeError(error) : void (0)
        })
      }.bind(this))
    }

    return this.emit('message', message)
  }.bind(this)

  return this.ws
}

// Fire the callback as soon as we detect the connection is open
Websocket.prototype.whenConnected = function whenConnected (cb) {
  if (this.ws.readyState === STATES.OPEN) return cb()
  return setTimeout(function _timer () {
    return this.whenConnected(cb)
  }.bind(this), 100)
}

// Send the given message once the connection is open
Websocket.prototype.sendWhenConnected = function sendWhenConnected (message) {
  if (this.ws.readyState === STATES.OPEN) return this.sendImmediate(message)
  return this.whenConnected(function _when () {
    return this.sendImmediate(message)
  })
}

// Send the give message if the connection is open, but don't wait (don't send later) if it's not
Websocket.prototype.sendIfConnected = function sendWhenConnected (message) {
  if (this.ws.readyState === STATES.OPEN) return this.sendImmediate(message)
  return void (0)
}

// Pull all messages out of the queue and send them once we are connected
Websocket.prototype.flushQueue = function flushQueue () {
  var messages = this.queue.splice(0)
  if (messages.length < 1) return void (0)
  this.whenConnected(function _when () {
    for (var i = 0; i < messages.length; i++) {
      this.sendWhenConnected(messages[i])
    }
  }.bind(this))
  return messages
}

// Attempt to send the given message immediately, without checking if we are connected
Websocket.prototype.sendImmediate = function sendImmediate (message) {
  if (this.ws.readyState === STATES.OPEN) return this.sendPayload(message)
  else console.warn('[websocket] connection not open (state: ' + this.ws.readyState + ')!')
}

// Flexibly send the given message, serializing it if necessary
Websocket.prototype.sendPayload = function sendPayload (message) {
  if (typeof message !== 'string') {
    if (!message.folder) {
      message.folder = this.folder
    }
    message = JSON.stringify(message)
  }
  return this.ws.send(message)
}

// Doesn't actually 'send' the message, but puts it in the outbox queue
Websocket.prototype.send = function send (message) {
  if (!message.folder) message.folder = this.folder // The plumbing uses the folder property to route messages to clients
  if (!message.alias) message.alias = this.alias // The plumbing uses this alias property to route messages
  return this.queue.push(message)
}

// Request-like wrapper for sending a message that expects a response with a callback
Websocket.prototype.request = function request (message, callback) {
  if (message.id === undefined) message.id = ('request-' + Math.random()) // This id associates responses (if any) to our messages
  this.requests[message.id] = { callback: callback }
  return this.send(message)
}

// Wrapper for invoking an RPC-like call over this socket with a method name, its params, and a callback
Websocket.prototype.method = function method (method, params, cb) {
  return this.request({ method: method, params: params || [] }, cb)
}

Websocket.prototype.action = function action (method, params, cb, folder) {
  return this.request({ type: 'action', method: method, params: params || [], folder: folder }, cb)
}

module.exports = Websocket
