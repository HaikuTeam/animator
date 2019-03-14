const https = require('https');
const fs = require('fs');
const {exec} = require('child_process');

const RESERVED_CHAR_REPLACEMENT = '-';
const FILENAME_RESERVED_REGEX = /[<>:"\/\\|?*\x00-\x1F]/g;
const WINDOWS_NAMES_RESERVED_REGEX = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;

module.exports = {
  download (url, downloadPath, onProgress, shouldCancel) {
    const file = fs.createWriteStream(downloadPath);

    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        const contentLenght = parseInt(response.headers['content-length'], 10);
        let progress = 0;

        response.pipe(file);

        response.on('data', (data) => {
          if (typeof shouldCancel === 'function' && shouldCancel()) {
            request.abort();
            file.close();
            reject(Error('Download cancelled'));
          }

          progress += data.length;
          onProgress(progress * 100 / contentLenght);
        });

        response.on('error', (error) => {
          fs.unlink(downloadPath);
          reject(error);
        });

        file.on('finish', () => {
          file.close(resolve);
        });
      });
    });
  },

  unzip (zipPath, destination) {
    const saneZipPath = JSON.stringify(zipPath);
    const saneDestination = JSON.stringify(destination);
    const unzipCommand = `unzip -o -qq ${saneZipPath} -d ${saneDestination}`;

    return new Promise((resolve, reject) => {
      exec(unzipCommand, {}, (err) => {
        err ? reject(err) : resolve(true);
      });
    });
  },

  ditto (src, dest) {
    const saneSrc = JSON.stringify(src);
    const saneDest = JSON.stringify(dest);
    const dittoComand = `ditto ${saneSrc} ${saneDest}`;

    return new Promise((resolve, reject) => {
      exec(dittoComand, {}, (err) => {
        err ? reject(err) : resolve(true);
      });
    });
  },

  sanitize (name) {
    if (typeof name !== 'string') {
      return '';
    }

    return name
      .replace(FILENAME_RESERVED_REGEX, RESERVED_CHAR_REPLACEMENT)
      .replace(WINDOWS_NAMES_RESERVED_REGEX, RESERVED_CHAR_REPLACEMENT);
  },
};
