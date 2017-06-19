var mime = require('mime-types')

var DEFAULT_MIME_TYPE = 'application/octet-stream'

function getMimeType (str) {
  return mime.lookup(str) || DEFAULT_MIME_TYPE
}

module.exports = getMimeType
