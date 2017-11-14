import lodash from 'lodash'
import { inkstone } from '@haiku/sdk-inkstone'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import * as Git from './Git'

// Configure inkstone, useful for testing off of dev (HAIKU_API=https://localhost:8080/)
if (process.env.HAIKU_API) {
  inkstone.setConfig({
    baseUrl: process.env.HAIKU_API
  })
}

export function getCurrentShareInfo (folder, cache, extras, timeout, done) {
  return Git.referenceNameToId(folder, 'HEAD', (err, id) => {
    if (err) return done(err)

    var sha = id.toString()

    logger.info('[inkstone] git HEAD resolved:', sha, 'getting snapshot info...')

    if (cache[sha]) {
      logger.info(`[inkstone] found cached share info for ${sha}`)
      return done(null, cache[sha])
    }

    return getSnapshotInfo(sha, timeout, (err, shareLink, snapshotAndProject) => {
      logger.info('[inkstone] snapshot info returned', err, shareLink)

      if (err) {
        if (err.timeout === true) {
          logger.info('[inkstone] timed out waiting for snapshot info')

          // HEY! This error message string is used by the frontend as part of some hacky conditional logic.
          // Make sure you understand what it's doing there before you change it here...
          return done(new Error('Timed out waiting for project share info'), lodash.assign({ sha }, extras))
        }

        logger.info('[inkstone] error getting snapshot info')
        return done(err)
      }

      var projectUid = snapshotAndProject.Project.UniqueId

      var shareInfo = lodash.assign({ sha, projectUid, shareLink }, extras)

      // Cache this during this session so we can avoid unnecessary handshakes with inkstone
      cache[sha] = shareInfo

      logger.sacred('[inkstone] share info', shareInfo)

      return done(null, shareInfo)
    })
  })
}

export function getSnapshotInfo (sha, timeout, done) {
  let alreadyReturned = false

  setTimeout(() => {
    if (!alreadyReturned) {
      alreadyReturned = true
      return done({ timeout: true })
    }
  }, timeout)

  function finish (err, shareLink, snapshotAndProject) {
    if (!alreadyReturned) {
      alreadyReturned = true
      return done(err, shareLink, snapshotAndProject)
    }
  }

  logger.info('[inkstone] awaiting snapshot share link')

  return inkstone.snapshot.awaitSnapshotLink(sha, (err, shareLink) => {
    if (err) return finish(err)

    logger.info('[inkstone] share link received:', shareLink)

    return inkstone.snapshot.getSnapshotAndProject(sha, (err, snapshotAndProject) => {
      if (err) return finish(err)

      logger.info('[inkstone] snapshot/project info:', snapshotAndProject)

      return finish(null, shareLink, snapshotAndProject)
    })
  })
}

export const project = {
  getByName: inkstone.project.getByName.bind(inkstone.project)
}
