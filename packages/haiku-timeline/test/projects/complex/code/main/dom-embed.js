var code = require('./code')
var adapter = window.HaikuCore && window.HaikuCore['3.0.36']
if (!adapter) {
  // See if we can find the legacy player module if HaikuCore isn't present
  adapter = window.HaikuPlayer && window.HaikuPlayer['3.0.36']
}
if (adapter) {
  module.exports = adapter(code)
} else  {
  function safety () {
    console.error(
      '[haiku core] core version 3.0.36 seems to be missing. ' +
      'index.embed.js expects it at window.HaikuCore["3.0.36"], but we cannot find it. ' +
      'you may need to add a <script src="path/to/HaikuCore.js"></script> to fix this.'
    )
    return code
  }
  for (var key in code) {
    safety[key] = code[key]
  }
  module.exports = safety
}