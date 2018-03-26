class MockWebsocket {
  connect () {}
  disconnect () {}
  on () {}
  send () {}
  method () {}
  request () {}
  action (method, params, cb) {
    return cb()
  }
}

module.exports = MockWebsocket
