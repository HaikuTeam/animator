const request = require('request')
const {exec} = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const {inkstone} = require('haiku-sdk-inkstone')
const {client} = require('haiku-sdk-client')
const generateUUIDv4 = require('haiku-sdk-creator/lib/utils/generateUUIDv4')
const {
  Experiment,
  experimentIsEnabled
} = require('haiku-common/lib/experiments')
const {
  HOMEDIR_PATH,
  HOMEDIR_PROJECTS_PATH,
  HOMEDIR_LOGS_PATH,
  HOMEDIR_CRASH_REPORTS_PATH
} = require('./HaikuHomeDir')

function _generateScreenshot (path) {
  return new Promise((resolve, reject) => {
    resolve()

    // TODO: robertodip figure out why plumbing is giving errors
    // const {remote} = require('electron')
    //   remote.getCurrentWindow().capturePage(function(buf) {
    //     fs.writeFile(path, buf.toPng(), err => {
    //       err ? reject(err) : resolve()
    //     })
    //   })
  })
}

function _ensureFolderExist (folder) {
  return new Promise((resolve, reject) => {
    fs.mkdirp(folder, error => {
      error ? reject(error) : resolve()
    })
  })
}

function _getPreSignedURL (zipName) {
  const authToken = client.config.getAuthToken()

  return new Promise((resolve, reject) => {
    inkstone.support.getPresignedUrl(authToken, zipName, (err, url) => {
      err ? reject(err) : resolve(url)
    })
  })
}

function _upload (url, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err)
      request.put(
        url,
        {body: data, headers: {'x-amz-acl': 'public-read'}},
        (err, response) => {
          err ? reject(err) : resolve(response)
        }
      )
    })
  })
}

function _zipProjectFolders ({destination, sources}) {
  const parsedDestination = JSON.stringify(destination)
  const parsedSources = sources
    .map(source => JSON.stringify(path.relative(HOMEDIR_PATH, source)))
    .join(' ')

  return new Promise((resolve, reject) => {
    exec(
      `tar --exclude='node_modules' -rvf ${parsedDestination} -C ${HOMEDIR_PATH} ${parsedSources}`,
      {},
      err => {
        err ? reject(err) : resolve()
      }
    )
  })
}

function crashReport (orgName, projectName, projectPath) {
  if (!projectPath) return

  const timestamp = generateUUIDv4.default()
  const screenshotPath = path.join(HOMEDIR_PATH, `screenshot-${timestamp}.png`)
  const zipName = `${timestamp}.zip`
  const zipPath = path.join(HOMEDIR_CRASH_REPORTS_PATH, zipName)
  const AWS3Server = 'http://support.haiku.ai.s3-us-west-2.amazonaws.com'

  _ensureFolderExist(HOMEDIR_PROJECTS_PATH)
    .then(_ensureFolderExist(HOMEDIR_CRASH_REPORTS_PATH))
    .then(_generateScreenshot(screenshotPath))
    .then(() =>
      _zipProjectFolders({
        destination: zipPath,
        sources: [projectPath, HOMEDIR_LOGS_PATH]
      })
    )
    .then(() => _getPreSignedURL(zipName))
    .then(AWS3URL => _upload(AWS3URL, zipPath))
    .catch(error => console.log(error))

  return `${AWS3Server}/${orgName}/${zipName}`
}

function sentryCallback (data) {
  if (
    data &&
    data.extra &&
    data.extra.projectPath
  ) {
    const {organizationName, projectName, projectPath} = data.extra
    data.extra.carbonite = crashReport(organizationName, projectName, projectPath)
    data.extra.experiments = {}
    for (const [key, value] of Object.entries(Experiment)) {
      data.extra.experiments[key] = experimentIsEnabled(value)
    }
  }

  return data
}

module.exports = {
  crashReport,
  sentryCallback
}
