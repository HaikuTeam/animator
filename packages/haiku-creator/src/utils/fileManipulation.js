const https = require('https')
const fs = require('fs')
const {exec} = require('child_process')

module.exports = {
  download (url, downloadPath, onProgress, shouldCancel) {
    const file = fs.createWriteStream(downloadPath)

    return new Promise((resolve, reject) => {
      const request = https.get(url, response => {
        const contentLenght = parseInt(response.headers['content-length'], 10)
        let progress = 0

        response.pipe(file)

        response.on('data', data => {
          if (typeof shouldCancel === 'function' && shouldCancel()) {
            request.abort()
            file.close()
            reject(Error('Download cancelled'))
          }

          progress += data.length
          onProgress(progress * 100 / contentLenght)
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

  unzipAndOpen (zipPath, destination, filename) {
    const unzipCommand = `unzip -o -qq ${zipPath} -d ${destination}`
    const openCommand = filename
      ? `open -a ${destination}/${filename}.app $1`
      : 'echo'

    return new Promise((resolve, reject) => {
      exec(`${unzipCommand} && ${openCommand}`, {}, err => {
        err ? reject(err) : resolve(true)
      })
    })
  }
}
