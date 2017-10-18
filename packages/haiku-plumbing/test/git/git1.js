const path = require('path')
const fse = require('haiku-fs-extra')
const Git = require('./../../lib/Git')
const FOLDER = process.env.GIT_PKILL_DIR

function bigBuffer () {
  let large = new Buffer('')
  let other = new Buffer('a')
  for (var i = 0; i <= (500 * 1000); i++) {
    largeBuffer = Buffer.concat([large, other])
  }
  return large
}

function handleError (err) {
  console.error(err)
  throw err
}

Git.init(FOLDER, (err) => {
  if (err) return handleError(err)
  fse.outputFileSync(path.join(FOLDER, 'README.md'), '# README')
  Git.commitProject(FOLDER, null, false, {}, '.', (err, cid1) => {
    if (err) return handleError(err)
    fse.outputFileSync(path.join(FOLDER, 'big'), bigBuffer())
    console.warn(5, Date.now())
    Git.commitProject(FOLDER, null, true, {}, ['big'], (err, cid2) => {
      if (err) return handleError(err)
      console.warn(6, Date.now())
      process.send('done')
    })
  })
})
