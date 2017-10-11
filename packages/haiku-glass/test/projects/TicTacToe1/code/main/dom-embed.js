var code = require('./code')
var adapter = window.HaikuPlayer && window.HaikuPlayer['2.3.9']
if (adapter) {
  module.exports = adapter(code)
} else  {
  function safety () {
    console.error(
      '[haiku player] player version 2.3.9 seems to be missing. ' +
      'index.embed.js expects it at window.HaikuPlayer["2.3.9"], but we cannot find it. ' +
      'you may need to add a <script src="path/to/HaikuPlayer.js"></script> to fix this. ' +
      'if you really need to load the player after this script, you could try: ' +
      'myHaikuPlayer(HaikuComponentEmbed_Matthew_TicTacToe1)(document.getElementById("myMountElement"))'
    )
    return code
  }
  for (var key in code) {
    safety[key] = code[key]
  }
  module.exports = safety
}