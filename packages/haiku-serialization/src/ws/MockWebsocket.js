class MockWebsocket {
  constructor (eventEmitter = null) {
    this.eventEmitter = eventEmitter;
  }

  on (eventName, handler) {
    if (this.eventEmitter === null) {
      return;
    }

    // In mock mode, we can use whatever event emitter was provided to us.
    this.eventEmitter.on(eventName, (_, payload) => {
      handler(payload);
    });
  }

  connect () {}
  disconnect () {}
  send () {}
  method () {}
  request () {}
  action (method, params, cb) {
    return cb();
  }
}

module.exports = MockWebsocket;
