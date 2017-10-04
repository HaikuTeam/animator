const https = require('https')
const fs = require('fs')
const {exec} = require('child_process')

module.exports = {
  download (url, downloadPath, onProgress) {
    const file = fs.createWriteStream(downloadPath)

    return new Promise((resolve, reject) => {
      https.get(url, response => {
        const contentLenght = parseInt(response.headers['content-length'], 10)
        let progress = 0

        response.pipe(file)

        response.on('data', data => {
          progress += data.length
          onProgress({ progress: progress * 100 / contentLenght })
        })

        response.on('error', error => {
          fs.unlink(downloadPath)
          reject(error)
        })

        file.on('finish', () => {
          file.close(resolve)
        })
      })
    })
  },

  unzip (zipPath, destination) {
    return new Promise((resolve, reject) => {
      exec(
        `unzip -o -qq ${zipPath} -d ${destination}`,
        {},
        err => {
          if (err) reject(err)
          resolve(true)
        }
      )
    })
  }
}
