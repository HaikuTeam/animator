const {exec} = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')
const {inkstone} = require('haiku-sdk-inkstone')
const {client} = require('haiku-sdk-client')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const {
  HOMEDIR_PATH,
  HOMEDIR_PROJECTS_PATH,
  HOMEDIR_LOGS_PATH,
  HOMEDIR_CRASH_REPORTS_PATH
} = require('./HaikuHomeDir')

function _generateScreenshot(path) {
  return new Promise((resolve, reject) => {
  if(true) resolve()

  const {remote} = require('electron')
    remote.getCurrentWindow().capturePage(function(buf) {
      fs.writeFile(path, buf.toPng(), err => {
        err ? reject(err) : resolve()
      })
    })
  })
}

function _getPreSignedURL(projectName) {
  const authToken = client.config.getAuthToken()

  return new Promise((resolve, reject) => {
    inkstone.support.getPresignedUrl(authToken, projectName, (err, url) => {
      err ? reject(err) : resolve(url)
    })
  })
}

function _upload(url, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err)
      fetch(url, {method: 'PUT', body: data}).then(resolve, reject)
    })
  })
}

function _zipProjectFolders({destination, sources}) {
  const parsedSources = sources
    .map(source => path.relative(HOMEDIR_PATH, source))
    .join(' ')

  return new Promise((resolve, reject) => {
    exec(
      `tar --exclude='node_modules' -rvf ${destination} -C ${HOMEDIR_PATH} ${parsedSources}`,
      {},
      err => {
        err ? reject(err) : resolve()
      }
    )
  })
}

function _cleanup(files) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        files.forEach(fs.unlinkSync)
        resolve()
      } catch (error) {
        reject(error)
      }
    }, 1000)
  })
}

function crashReport(orgName, projectName) {
  if (!orgName || !projectName) return
  const timestamp = new Date().getTime()
  const projectPath = path.join(HOMEDIR_PROJECTS_PATH, orgName, projectName)
  const screenshotPath = path.join(HOMEDIR_PATH, `screenshot-${timestamp}.png`)
  const zipName = `${projectName}-${timestamp}.zip`
  const zipPath = path.join(HOMEDIR_CRASH_REPORTS_PATH, zipName)
  const userId = client.config.getUserId()
  const AWS3Server = "http://support.haiku.ai.s3-us-west-2.amazonaws.com"

  _generateScreenshot(screenshotPath)
    .then(() =>
      _zipProjectFolders({
        destination: zipPath,
        sources: [projectPath, HOMEDIR_LOGS_PATH]
      })
    )
    .then(() => _getPreSignedURL(zipName))
    .then(AWS3URL => _upload(AWS3URL, zipPath))
    .then(_cleanup([screenshotPath]))
    .catch((error) => console.log(error))

  return `${AWS3Server}/${orgName}/${userId}/${zipName}`
}

function sentryCallback(data) {
  if (data && data.extra && data.extra.organizationName && data.extra.projectName) {
    const {organizationName, projectName} = data.extra
    data.extra.carbonite = crashReport(organizationName, projectName)
    data.extra.experiments = {}
    for (const [key, value] of Object.entries(Experiment)) {
      data.extra.experiments[key] = experimentIsEnabled(value)
    }
    return data
  } else {
    return data;
  }
}

module.exports = {
  crashReport,
  sentryCallback
}
