import * as tape from 'tape';
import * as path from 'path';
import TestHelpers from '../TestHelpers';

tape('Timeline', (t) => {
  t.plan(1);
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'complex'), (glass, window, teardown) => {
    TestHelpers.awaitElementById(window, 'timeline', (err, mount) => {
      t.ok(mount);
    });
  });
});
