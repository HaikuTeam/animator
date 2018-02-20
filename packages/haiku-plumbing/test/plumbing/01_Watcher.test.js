const tape = require('tape')
const fse = require('haiku-fs-extra')
const path = require('path')
const Watcher = require('./../../lib/Watcher').default
const TestHelpers = require('./../TestHelpers')

tape('Watcher', (t) => {
  var FILES_TO_TEST = {
    '.git/foo': true,
    'baz~.sketch': true,
    'node_modules/foo/index.js': true,
    'node_modules/foo/node_modules/index.js': true,
    'bower_components/rara/foo.bar.js': true,
    'jspm_modules/blag/foo.bar.js': true,

    '.foobar': false,
    'haiku.js': false,
    'foo/haiku.js': false,
  }
  const NUM_TESTS = 3
  t.plan(NUM_TESTS)
  return TestHelpers.tmpdir((folder, teardown) => {
    const watcher = new Watcher()
    let count = 0
    watcher.watch(folder)
    watcher.on('add', (abspath) => {
      const relpath = path.relative(folder, abspath)
      t.ok(!FILES_TO_TEST[relpath], 'detected file not among ignored (' + relpath + ')')
      if (++count >= NUM_TESTS) {
        teardown()
        watcher.stop()
      }
    })

    watcher.on('ready', () => {
      for (const filename in FILES_TO_TEST) {
        console.log('[test] creating', filename)
        fse.outputFileSync(path.join(folder, filename), '')
      }
    })
  })
})
