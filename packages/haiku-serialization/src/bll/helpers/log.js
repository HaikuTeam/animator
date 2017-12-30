module.exports = {
  info: function info () {
    console.log.apply(console, arguments)
  },

  toast: function toast (msg) {
    console.info('[notice] ' + msg)
  },

  warn: function warn (msg) {
    console.warn(msg)
  },

  error: function error (err) {
    console.error(err)
  }
}
