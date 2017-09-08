import foreach from 'lodash.foreach'
import assign from 'lodash.assign'
import Peer from 'peerjs'
import { EventEmitter } from 'events'

const RETRY_INTERVAL_MILLISECONDS = 1000 * 5
const MAX_STARTUP_RETRIES = 5
const DEFAULT_OPTIONS = {
  host: '0.peerjs.com',
  port: 9000,
  path: '/',
  secure: false,
  debug: 1
}

function makeSlots (num) {
  const slots = []
  for (let i = 0; i < num; i++) slots.push(i)
  return slots
}

export default class Peerer extends EventEmitter {
  constructor (id, numSeats, options) {
    super()
    this.index = 0
    this.id = id // this is required! OHHHH YEAH
    this.slots = makeSlots(numSeats || 3)
    this.options = options || {}
    this.peers = {}
    this.owner = null
    this.open = {}
    this.ready = false
    this.retries = 0
  }

  eachPeer (iterator) {
    foreach(this.peers, (connection) => {
      if (!connection) return null
      if (connection === true) return null
      if (!connection.send) return null
      if (!this.open[connection.peer]) return null
      iterator(connection)
    })
  }

  broadcast (data) {
    this.eachPeer((connection) => {
      connection.send(data)
    })
  }

  identifier (id, key) {
    return `${id}-${key}`
  }

  peer () {
    const qid = this.identifier(this.id, this.slots[this.index])
    const opts = assign({}, DEFAULT_OPTIONS, this.options)

    // Establish a peer and cache the object
    this.owner = new Peer(qid, opts)
    this.peers[qid] = this.owner

    this.owner.on('open', (givenId) => {
      this.ready = true
      this.connect()
    })

    this.owner.on('error', this.handleSetupError.bind(this))

    this.owner.on('connection', (connection) => {
      this.peers[connection.peer] = connection
      this.open[connection.peer] = true
      connection.on('data', this.emit.bind(this, 'data'))
    })
  }

  connect () {
    for (let i = 0; i < this.slots.length; i++) {
      let qid = this.identifier(this.id, this.slots[i])

      // Don't try to connect with self
      if (qid === this.identifier(this.id, this.slots[this.index])) continue

      // Don't try to reconnect with an existing peer
      if (this.peers[qid]) continue

      // Establish a connection and cache the object
      let connection = this.owner.connect(qid)
      this.peers[qid] = connection

      connection.on('open', this.handleConnectionOpen.bind(this, qid))
      connection.on('data', this.handleConnectionData.bind(this, qid))
      connection.on('close', this.handleConnectionClose.bind(this, qid))
      connection.on('error', this.handleConnectionError.bind(this, qid))
    }
  }

  handleConnectionOpen (qid, data) {
    console.info(`Opened peer connection to '${qid}'`)
    return (this.open[qid] = true)
  }

  handleConnectionClose (qid, data) {
    return (this.peers[qid] = null)
  }

  handleConnectionData (qid, data) {
    return this.emit('data', data)
  }

  handleConnectionError (qid, error) {
    if (error.type === 'peer-unavailable') return this.inertPeer(qid)
    return this.emit('error', new Error(`Problem establishing peer connection`))
  }

  retryStartup (skipReindex) {
    if (++this.retries > MAX_STARTUP_RETRIES) {
      return this.emit('error', new Error(`Gave up trying to start after ${this.retries} attempts`))
    }

    this.destroyOwnPeer()

    this.closeAllConnections()

    // Don't bump the index if specified by the caller
    if (!skipReindex) {
      const newIndex = this.index + 1
      const indexMod = newIndex % (this.slots.length + 1)
      this.index = indexMod
    }

    // Give a grace period before attempting to reconnect
    return setTimeout(() => {
      return this.peer()
    }, RETRY_INTERVAL_MILLISECONDS)
  }

  destroyOwnPeer () {
    if (this.owner) this.owner.destroy()
    this.peers[this.identifier(this.id, this.slots[this.index])] = void (0)
    this.owner = null
  }

  closeAllConnections () {
    // Close any remaining open connections
    foreach(this.peers, (connection, key) => {
      if (!connection) return null
      if (connection === true) return null
      if (!connection.close) return null
      connection.close()
      this.peers[key] = void (0)
    })
  }

  handleSetupError (error) {
    if (error.type === 'invalid-id') return this.emit('error', error)
    if (error.type === 'browser-incompatible') return this.emit('error', error)
    if (error.type === 'peer-unavailable') return this.inertPeer(hackQidFromErr(error))
    if (error.type === 'unavailable-id') return this.retryStartup()
    if (error.type === 'network') return this.retryStartup(true)
    this.destroyOwnPeer()
    this.closeAllConnections()
    return this.emit('error', error)
  }

  inertPeer (qid) {
    // Inert peer means we tried to connect once and failed,
    // so we'll exclude this peer from now on, but will allow them
    // to connect to us if they connect later
    return (this.peers[qid] = true)
  }
}

function hackQidFromErr (err) {
  return err.message.split('Could not connect to peer ')[1].trim()
}
