var test = require('tape')
var TestHelpers = require('./../TestHelpers')

test('globals', function (t) {
  t.plan(2)

  t.ok(global.haiku, 'global.haiku present (various singleton storage)')
  t.ok(global.haiku.HaikuGlobalAnimationHarness, 'global.haiku.HaikuGlobalAnimationHarness present (singleton raf loop)')

  // for (var key in require.cache) delete require.cache[key]
  // require('./../../lib/adapters/dom')
  // global.haiku.HaikuGlobalAnimationHarness.cancel()

  // TestHelpers.createDOM((a,b,c,HaikuGlobal) => {
  //   HaikuGlobal.HaikuGlobalAnimationHarness.cancel()
  //   for (var key in require.cache) delete require.cache[key]
  //   require('./../../lib/adapters/dom')
  //   t.ok(window.HaikuPlayer, 'window.HaikuPlayer present (harness for separate embed script still allowing for multiple player versions)')  
  //   t.ok(window.haiku, 'window.haiku present (various singleton storage)')
  //   t.ok(window.haiku.HaikuGlobalAnimationHarness, 'window.haiku.HaikuGlobalAnimationHarness present (singleton raf loop)')
  //   window.haiku.HaikuGlobalAnimationHarness.cancel()
  // })
})
