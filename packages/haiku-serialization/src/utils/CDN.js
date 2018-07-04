const path = require('path')
const fs = require('fs-extra')
const request = require('request')
const {client} = require('@haiku/sdk-client')
const {inkstone} = require('@haiku/sdk-inkstone')
const {sha256} = require('./CryptoUtils')

const uploadAsset = (folder, relpath, cb) => {
  const token = client.config.getAuthToken()

  const abspath = path.join(folder, relpath)

  return fs.readFile(abspath, (err, buffer) => {
    if (err) {
      return cb(err)
    }

    const sha = sha256(buffer.toString())

    const extname = path.extname(relpath)

    // ./foo/bar/baz.png -> foo/bar/baz-abc123.png
    const key = path.normalize(relpath.split(extname).join(`-${sha}${extname}`))

    return inkstone.support.getPresignedUrl(token, key, (err, url) => {
      if (err) {
        return cb(err)
      }

      return request.put(
        url,
        {
          body: buffer,
          headers: {
            'x-amz-acl': 'public-read'
          }
        },
        (err, response) => {
          if (err) {
            return cb(err)
          }

          if (!response) {
            return cb(new Error('CDN gave no response'))
          }

          if (response.statusCode > 399) {
            return cb(new Error(`CDN gave response code ${response.statusCode}`))
          }

          return cb(null, {
            url
          })
        }
      )
    })
  })
}

module.exports = {
  uploadAsset
}
