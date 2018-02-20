const tape = require('tape')
const path = require('path')
const cp = require('child_process')
const TestHelpers = require('./../TestHelpers')

tape('git.pkill', (t) => {
  t.plan(1)
  TestHelpers.tmpdir((folder, teardown) => {
    process.env.GIT_PKILL_DIR = folder
    const PROC_FILE = path.join(__dirname, 'git1.js')
    const proc = cp.fork(PROC_FILE)
    proc.on('exit', (code) => console.log(`subproc exited with ${code}`))
    proc.on('error', (err) => console.log(`subproc errored with ${err}`))
    proc.on('message', (message) => {
      if (message === 'done') {
        t.ok(true)
        teardown()  
      }
    })
  })
})
