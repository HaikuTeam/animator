import * as tape from 'tape';
import IntegrationTest from './../IntegrationTest';

tape('e2e', async (t) => {
  t.ok(true);

  const it = new IntegrationTest();

  it.spectron.start();

  t.end();
})
