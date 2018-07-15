const tape = require('tape');

tape('Exit', (t) => {
  t.end();
  global.process.exit();
});
