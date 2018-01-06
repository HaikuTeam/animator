var code = require('./code')
var adapter = window.HaikuPlayer && window.HaikuPlayer['2.3.70']
if (adapter) {
  module.exports = adapter(code)
} else  {
  function safety () {
    console.error(
      '[haiku player] player version 2.3.70 seems to be missing. ' +
      'index.embed.js expects it at window.HaikuPlayer["2.3.70"], but we cannot find it. ' +
      'you may need to add a <script src="path/to/HaikuPlayer.js"></script> to fix this.'
    )
    return code
  }
  for (var key in code) {
    safety[key] = code[key]
  }
  module.exports = safety
}