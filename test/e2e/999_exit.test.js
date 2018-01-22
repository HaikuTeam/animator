const tape = require('tape')

tape('exit', (t) => {
  t.end()
  global.process.exit()
})
