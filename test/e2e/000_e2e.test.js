const tape = require('tape')
const fse = require('fs-extra')
const path = require('path')
const async = require('async')
const TestHelpers = require('../TestHelpers')

TestHelpers.start(({ plumbing }, done) => {
  tape('e2e', (t) => {
    t.plan(1)

    return async.series([
      (cb) => {
        return cb()
      },
    ], (err) => {
      if (err) throw err

      return done(() => {
        t.ok(true)
      })
    })
  })
})
