const mime = require('mime-types');

const DEFAULT_MIME_TYPE = 'application/octet-stream';

function getMimeType(str) {
  return mime.lookup(str) || DEFAULT_MIME_TYPE;
}

module.exports = getMimeType;
