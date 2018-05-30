const async = require('async')
const path = require('path')

const {readdirSync, ensureSymlinkSync} = require('haiku-fs-extra')

const packages = require('./helpers/packages')

const haikuTestingPackageAbsPath = packages('haiku-testing').abspath
const binaries = readdirSync(path.join(haikuTestingPackageAbsPath, 'bin')).map(
  (binary) => path.resolve(haikuTestingPackageAbsPath, 'bin', binary)
)

async.each(packages(), function (pack, next) {
  if (!pack.deps.has('haiku-testing')) {
    return next()
  }

  binaries.forEach((fullBinaryPath) => {
    ensureSymlinkSync(fullBinaryPath, path.join(pack.abspath, 'node_modules', '.bin', path.basename(fullBinaryPath)))
  })
  next()
})
