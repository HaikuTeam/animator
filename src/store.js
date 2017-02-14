function isUndef (thing) {
  return thing === undefined
}

function chooseOne (thing, alt) {
  if (isUndef(thing)) return alt
  return thing
}

function Store () {
  this.data = {}
}

Store.prototype.partition = function partition (address) {
  if (!this.data[address]) this.data[address] = {}
  return address
}

Store.prototype.init = function init (address, key, type) {
  this.partition(address)
  if (isUndef(this.data[address][key])) this.data[address][key] = chooseOne(type, {})
  return type
}

Store.prototype.get = function get (address, key) {
  this.init(address, key)
  return this.data[address][key]
}

Store.prototype.set = function set (address, key, payload) {
  this.init(address, key)
  this.data[address][key] = payload
  return payload
}

Store.prototype.push = function push (address, key, payload) {
  this.init(address, key, [])
  return this.data[address][key].push(payload)
}

Store.prototype.pull = function pull (address, key) {
  this.init(address, key, [])
  return this.data[address][key].splice(0)
}

Store.prototype.deallocate = function deallocate (address) {
  for (var key in this.data[address]) delete this.data[address][key]
  this.data[address] = null
  return null
}

Store.prototype.allocate = function allocate (address) {
  var api = {}
  this.partition(address)
  api._data = this.data[address]
  api.get = this.get.bind(this, address)
  api.set = this.set.bind(this, address)
  api.push = this.push.bind(this, address)
  api.pull = this.pull.bind(this, address)
  api.deallocate = this.deallocate.bind(this, address)
  return api
}

module.exports = Store
