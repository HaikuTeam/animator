const request = require('request')
const {exec, fork} = require('child_process')
const path = require('path')
const fs = require('fs-extra')
const {inkstone} = require('@haiku/sdk-inkstone')
const {client} = require('@haiku/sdk-client')
const generateUUIDv4 = require('haiku-sdk-creator/lib/utils/generateUUIDv4')
const {
  Experiment,
  experimentIsEnabled
} = require('haiku-common/lib/experiments')
const logger = require('haiku-serialization/src/utils/LoggerInstance')
const {
  HOMEDIR_PATH,
  HOMEDIR_PROJECTS_PATH,
  HOMEDIR_LOGS_PATH,
  HOMEDIR_CRASH_REPORTS_PATH
} = require('./HaikuHomeDir')

const UPLOAD_INTERVAL = 10 /* in minutes */
let lastUploadTime = null

const AWS_S3_HOST = 'http://support.haiku.ai.s3-us-west-2.amazonaws.com'

function _hasElapsedEnoughTime () {
  if (!lastUploadTime) return true
  return Date.now() - lastUploadTime >= UPLOAD_INTERVAL * 60000
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

      logger.info(`[carbonite] uploading ${filePath} to ${url.split('?')[0]}`)

      request.put(
        url,
        {body: data, headers: {'x-amz-acl': 'public-read'}},
        (err, response) => {
          logger.info(`[carbonite] upload complete`)

          if (err) {
            reject(err)
          } else {
            resolve(response)
          }
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

function crashReport (error, organizationName, projectName, projectPath) {
  if (!projectPath || !_hasElapsedEnoughTime()) {
    return
  }

  lastUploadTime = Date.now()

  const timestamp = generateUUIDv4.default()
  const zipName = `${projectName}-${timestamp}.zip`
  const zipPath = path.join(HOMEDIR_CRASH_REPORTS_PATH, zipName)

  const finalUrl = `${AWS_S3_HOST}/${organizationName}/${zipName}`

  crashReportFork(error, projectPath, zipName, zipPath, finalUrl)

  return finalUrl
}

function crashReportFork (error, projectPath, zipName, zipPath, finalUrl) {
  logger.info(`[carbonite] initiating crash report`, projectPath, zipName, zipPath, finalUrl.split('?')[0])
  // IPC send to Creator "crash is happening". Creator should show new fail whale screen with option to restart grayed out.
  // While grayed out, fail whale screen should say "sending crash data to Haiku"
  process.env.HAIKU_CRASH_REPORT_PROJECT_PATH = projectPath
  process.env.HAIKU_CRASH_REPORT_ZIP_PATH = zipPath
  process.env.HAIKU_CRASH_REPORT_ZIP_NAME = zipName
  process.env.HAIKU_CRASH_REPORT_URL = finalUrl
  process.env.HAIKU_CRASH_REPORT_STACKTRACE = error.stack
  const carboniteUpload = fork(path.join(__dirname, 'carbonite-proc.js'), [], {stdio: 'inherit'})
  carboniteUpload.on('exit', () => {
    this.carboniteComplete = true;
  })

  // await this.carboniteComplete && this.sentryComplete, then IPC send to creator "crash is done, enable restart button"
}

function crashReportCreate (cb) {
  logger.info(`[carbonite] preparing crash report for ${process.env.HAIKU_CRASH_REPORT_URL}`)
  logger.info(`[carbonite] error heard was`, process.env.HAIKU_CRASH_REPORT_STACKTRACE)

  _ensureFolderExist(HOMEDIR_PROJECTS_PATH)
    .then(_ensureFolderExist(HOMEDIR_CRASH_REPORTS_PATH))
    .then(() =>
      _zipProjectFolders({
        destination: process.env.HAIKU_CRASH_REPORT_ZIP_PATH,
        sources: [process.env.HAIKU_CRASH_REPORT_PROJECT_PATH, HOMEDIR_LOGS_PATH]
      })
    )
    .then(() => _getPreSignedURL(process.env.HAIKU_CRASH_REPORT_ZIP_NAME))
    .then(AWS3URL => _upload(AWS3URL, process.env.HAIKU_CRASH_REPORT_ZIP_PATH))
    .then(cb)
    .catch(error => {
      logger.error(error)
      cb()
    })
}

function createErrorFromSentryData (data) {
  const info = data && data.exception && data.exception.values && data.exception.values[0]
  const name = (info && info.value) || 'Unknown'
  return new Error(name) // TODO: Include info.stacktrace.frames as error.stack
}

/**
 * @function sentryCallback
 * @description This callback is used in places where we allow Raven itself to capture exceptions,
 * as opposed to us manually triggering a capture. This happens in the UIs: Creator, Timeline, Stage.
 */
function sentryCallback (data) {
  if (
    // #FIXME: this is duplicative of {shouldEmitErrors} in haiku-common/lib/environments.
    // Migrate this module to haiku-common.
    (process.env.NODE_ENV === 'production' || process.env.DEBUG_SENTRY === '1') &&
    data &&
    data.extra &&
    data.extra.projectPath
  ) {
    // Sentry doesn't provide the original error but its own exploded form of it.
    // We recreate it here so that the crash report function can log the error name.
    const error = createErrorFromSentryData(data)

    data.extra.carbonite = crashReport(
      error,
      data.extra.organizationName,
      data.extra.projectName,
      data.extra.projectPath
    )
    data.extra.experiments = require('haiku-common/config/experiments.json')
  }

  return data
}

module.exports = {
  crashReport,
  sentryCallback,
  crashReportCreate
}
