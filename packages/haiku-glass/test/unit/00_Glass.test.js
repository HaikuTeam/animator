import * as tape from 'tape';
import * as path from 'path';
import TestHelpers from '../TestHelpers';

tape('Glass', (t) => {
  t.plan(1);
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'simple'), (glass, window, teardown) => {
    TestHelpers.awaitElementById(window, 'haiku-mount-container', (err, mount) => {
      t.ok(mount);
    });
  });
});
