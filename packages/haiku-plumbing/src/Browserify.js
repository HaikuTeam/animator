var stream = require('stream')
var browserify = require('browserify')
var assign = require('lodash.assign')
var tools = require('browserify-transform-tools')
var remapSource = require('haiku-serialization/src/ast/remapSource')
var logger = require('haiku-serialization/src/utils/LoggerInstance')
var ModuleWrapper = require('haiku-serialization/src/bll/ModuleWrapper')

var haikuify = tools.makeStringTransform('haikuify', {}, function (content, options, done) {
  // TODO: Cache? Only run for some files?
  var updated = remapSource(content, ModuleWrapper.getHaikuKnownImportMatch)
  return done(null, updated)
})

function createBundle (folder, contents, standalone, options, cb) {
  logger.info('[browserify] beginning in basedir', folder)

  var entry = stream.Readable()
  entry.push(contents)
  entry.push(null)
  var opts = assign({}, {
    basedir: folder,
    standalone: standalone,
    transform: [haikuify]
  }, options)

  var br = browserify(entry, opts)
  return runBundle(br, cb)
}

function runBundle (br, cb) {
  var stream = br.bundle()
  var data = ''
  var error = null
  stream.on('data', function (chunk) {
    data += chunk.toString()
  })
  stream.on('error', function (err) {
    // Don't call callback twice
    // TODO: How are streams supposed to handle this? (i.e. bail on first error)
    if (!error) {
      error = err
      return cb(err)
    }
  })
  stream.on('end', function () {
    // Don't call callback twice, we should have returned already
    if (!error) {
      return cb(null, data)
    }
  })
  return br
}

module.exports = {
  createBundle: createBundle
}
