import * as tape from 'tape'
import * as cp from 'child_process'
import * as path from 'path'
const CWD = path.join(__dirname)
const CLI = path.join(__dirname, '..', 'lib', 'index.js')

tape('help', (t) => {
  t.plan(1)
  cp.execSync(`node ${JSON.stringify(CLI)} help`, { cwd: CWD, stdio: 'inherit' })
  t.ok(true)
})
