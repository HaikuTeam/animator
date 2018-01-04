var test = require('tape')
var Websocket = require('ws')
var WebsocketServerWithManyClients = require('./../lib/WebsocketServerWithManyClients').default
test('WebsocketServerWithManyClients.test', function(t) {
  t.plan(2)
  var wswmc = new WebsocketServerWithManyClients({ port: 3002 })
  var wsfoo = new Websocket('http://localhost:3002?type=foo')
  var wsbar = new Websocket('http://localhost:3002?type=bar')
  wsfoo.on('open', function() {
    wsfoo.send(JSON.stringify({ from: 'foo' }))
  })
  wsbar.on('open', function() {
    wsbar.send(JSON.stringify({ from: 'bar' }))
  })
  var count = 0
  wsbar.on('message', function(data) {
    count++
    var message = JSON.parse(data)
    t.equal(message.reply, 'bar!', 'client got message')
    if (count >= 2) {
      wswmc.teardown(function() {
        t.ok(true, 'ws tore down')
      })
    }
  })
  wsfoo.on('message', function(message) {
    throw new Error('foo client should not get a message')
  })
  wswmc.on('message', function(message, websocket) {
    if (message.from === 'foo') t.equal(websocket.params.type, 'foo', 'server got message')
    if (message.from === 'bar') t.equal(websocket.params.type, 'bar', 'server got message')
    // This should send twice since we got two messages
    wswmc.requestToClientsWhere({ params: { type: 'bar' }}, { reply: 'bar!' }, function() {

    })
  })
})
