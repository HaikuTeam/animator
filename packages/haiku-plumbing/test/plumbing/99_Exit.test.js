import * as tape from 'tape';

tape('Exit', (t) => {
  t.end();
  global.process.exit();
});
