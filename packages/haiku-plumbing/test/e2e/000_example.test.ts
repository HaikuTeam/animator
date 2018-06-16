import {Application} from 'spectron';
import * as tape from 'tape';
import IntegrationTest, {INTEGRATION_TESTS_ENABLED} from '../IntegrationTest';

if (!INTEGRATION_TESTS_ENABLED) {
  global.process.exit(0);
}

tape(
  'e2e',
  (t: tape.Test) => {

    const it = new IntegrationTest();

    it.start().then((application: Application) => {
      t.ok(true);
      it.teardown().then(() => {
        t.end();
      });
    });
  },
);
