var test = require('tape')
var Websocket = require('ws')
var WebsocketClient = require('./../lib/WebsocketClient').default
var WebsocketServerWithManyClients = require('./../lib/WebsocketServerWithManyClients').default
test('WebsocketClient.test', function(t) {
  t.plan(2)
  var wss = new WebsocketServerWithManyClients({ port: 3002 })
  var wsc = new WebsocketClient(new Websocket('http://localhost:3002?type=foo'))
  wsc.on('request', (message, done) => {
    t.equal(message.something, 'hooray', 'got request from server')
    return done(null, 'lalala')
  })
  wss.on('connection', (websocket) => {
    websocket.send(JSON.stringify({
      something: 'hooray'
    }))
  })
  wss.on('message', (message) => {
    t.equal(message.result, 'lalala', 'got reply from client')
    wss.teardown()
  })
})
