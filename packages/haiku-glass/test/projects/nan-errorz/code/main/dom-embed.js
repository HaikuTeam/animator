var code = require('./code')
var adapter = window.HaikuResolve && window.HaikuResolve('3.5.2')
if (adapter) {
  module.exports = adapter(code)
} else  {
  function safety () {
    console.error(
      '[haiku core] core version 3.5.2 seems to be missing. ' +
      'index.embed.js expects it at window.HaikuCore["3.5.2"], but we cannot find it. ' +
      'you may need to add a <script src="path/to/HaikuCore.js"></script> to fix this.'
    )
    return code
  }
  for (var key in code) {
    safety[key] = code[key]
  }
  module.exports = safety
}