import lodash from 'lodash'
import { inkstone } from '@haiku/sdk-inkstone'
import { client } from '@haiku/sdk-client'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import * as Git from './Git'

// Configure inkstone, useful for testing off of dev (HAIKU_API=https://localhost:8080/)
if (process.env.HAIKU_API) {
  inkstone.setConfig({
    baseUrl: process.env.HAIKU_API
  })
}

if (process.env.SHARE_URL) {
  inkstone.setConfig({
    baseShareUrl: process.env.SHARE_URL
  })
}

export function createSnapshot (folder, name, done) {
  Git.referenceNameToId(folder, 'HEAD', (err, id) => {
    if (err) {
      done(err)
      return
    }

    const sha = id.toString()

    logger.info('[inkstone] git HEAD resolved:', sha, 'creating snapshot...')

    inkstone.project.createProjectSnapshotByNameAndSha(
      client.config.getAuthToken(),
      name,
      sha,
      (err) => {
        done(err)
      }
    )
  })
}

export function getCurrentShareInfo (folder, cache, extras, done) {
  Git.referenceNameToId(folder, 'HEAD', (err, id) => {
    if (err) {
      done(err)
      return
    }

    const sha = id.toString()

    logger.info('[inkstone] git HEAD resolved:', sha, 'getting snapshot...')

    return getSnapshotInfo(sha, (err, shareLink, snapshotAndProject) => {
      logger.info('[inkstone] snapshot info returned', err, shareLink)

      if (err) {
        logger.info('[inkstone] error getting snapshot info')
        return done(err)
      }

      const projectUid = snapshotAndProject.Project.UniqueId

      const shareInfo = lodash.assign({ sha, projectUid, shareLink }, extras)

      // Cache this during this session so we can avoid unnecessary handshakes with inkstone
      cache[sha] = shareInfo

      logger.sacred('[inkstone] share info', shareInfo)

      return done(null, shareInfo)
    })
  })
}

function getSnapshotInfo (sha, done) {
  return inkstone.snapshot.getSnapshotLink(sha, (err, snapshot) => {
    if (err) {
      done(err)
      return
    }

    const {link, snap} = snapshot

    logger.info('[inkstone] share link received:', link)
    return done(null, link, snap)
  })
}

export const project = {
  getByName: inkstone.project.getByName.bind(inkstone.project)
}
