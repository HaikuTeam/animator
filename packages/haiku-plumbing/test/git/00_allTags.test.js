var tape = require('tape')
var cp = require('child_process')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Git = require('./../../lib/Git')
tape('Watcher', (t) => {
  t.plan(1)
  return TestHelpers.tmpdir((folder, teardown) => {
    cp.execSync('git init', { cwd: folder, stdio: 'inherit' })

    var nums = [0,1,2,3,4,5,6,7,8,9]
    nums.forEach((n) => {
      fse.writeFileSync(path.join(folder, `foobar-${n}`))
      cp.execSync('git add . && git commit -m "foobar"', { cwd: folder, stdio: 'inherit' })
      cp.execSync(`git tag -a v0.0.${n} -m "foobar"`, { cwd: folder, stdio: 'inherit' })
    })

    return Git.listTags(folder, (err, tags) => {
      if (err) throw err
      teardown()
      t.equal(tags[2], 'v0.0.2')
    })
  })
})
