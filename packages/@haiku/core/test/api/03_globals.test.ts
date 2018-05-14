import * as tape from 'tape';
const TestHelpers = require('./../TestHelpers');

interface Global {
  window: any;
  document: any;
  haiku: any;
}

declare var global: Global;

tape('globals', (t) => {
  t.plan(2);

  t.ok(global.haiku, 'global.haiku present (various singleton storage)');
  t.ok(global.haiku.HaikuGlobalAnimationHarness, 'global.haiku.HaikuGlobalAnimationHarness present (singleton raf loop)');
});
