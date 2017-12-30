var stream = require('stream')
var browserify = require('browserify')
var assign = require('lodash.assign')
var logger = require('haiku-serialization/src/utils/LoggerInstance')

function createBundle (folder, contents, standalone, options, cb) {
  logger.info('[browserify] beginning in basedir', folder)

  var entry = stream.Readable()
  entry.push(contents)
  entry.push(null)
  var opts = assign({}, {
    basedir: folder,
    standalone: standalone,
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
