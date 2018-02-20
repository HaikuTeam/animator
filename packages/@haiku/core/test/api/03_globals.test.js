var test = require('tape')
var TestHelpers = require('./../TestHelpers')

test('globals', function (t) {
  t.plan(2)

  t.ok(global.haiku, 'global.haiku present (various singleton storage)')
  t.ok(global.haiku.HaikuGlobalAnimationHarness, 'global.haiku.HaikuGlobalAnimationHarness present (singleton raf loop)')
})
