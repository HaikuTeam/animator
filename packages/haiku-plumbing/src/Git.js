import { Repository, Reference, Signature, Reset, Remote, Clone, Cred, Commit, Merge, RevWalk, Checkout, Tag } from 'nodegit'
import path from 'path'
import fs from 'haiku-fs-extra'
import async from 'async'
import logger from 'haiku-serialization/src/utils/LoggerInstance'

const DEFAULT_COMMITTER_EMAIL = 'contact@haiku.ai'
const DEFAULT_COMMITTER_NAME = 'Haiku Plumbing'
const FORCE_PUSH_REFSPEC_PREFIX = '+'
const DEFAULT_GIT_USERNAME = 'Haiku-Plumbing'
const DEFAULT_GIT_EMAIL = 'contact@haiku.ai'
const DEFAULT_GIT_COMMIT_MESSAGE = 'Edited project with Haiku Desktop'

function globalExceptionCatcher (exception) {
  logger.error(exception)
  throw exception
}

export function open (pwd, cb) {
  return Repository.open(pwd).then((repository) => {
    return cb(null, repository)
  }, cb).catch(globalExceptionCatcher)
}

export function init (pwd, cb) {
  const isBare = 0 // false! We want to create the .git folder _in_ the folder
  return Repository.init(pwd, isBare).then((repository) => {
    return cb(null, repository)
  }, cb)
}

export function status (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return repository.getStatus().then((statuses) => {
      return cb(null, statuses)
    }, cb)
  })
}

export function hardReset (pwd, targetRef, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return referenceNameToId(pwd, targetRef, (err, id) => {
      if (err) return cb(err)
      return repository.getCommit(id.toString()).then((commit) => {
        return Reset.reset(repository, commit, Reset.TYPE.HARD).then(() => {
          return cb(null, repository, commit)
        }, cb)
      }, cb)
    })
  })
}

export function removeUntrackedFiles (pwd, cb) {
  return status(pwd, (err, statuses) => {
    if (err) return cb(err)
    if (statuses.length < 1) return cb()
    return async.each(statuses, (status, next) => {
      const abspath = path.join(pwd, status.path())
      return fs.remove(abspath, (err) => {
        if (err) return next(err)
        return next()
      })
    }, (err) => {
      if (err) return cb(err)
      return cb()
    })
  })
}

export function upsertRemote (pwd, name, url, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Remote.list(repository).then(function (remotes) {
      const found = findExistingRemote(remotes, name)
      if (found) return cb(null, found)
      return Remote.create(repository, name, url).then((remote) => {
        return cb(null, remote)
      }, cb)
    }, cb)
  })
}

function findExistingRemote (remotes, name) {
  if (remotes.length < 1) return null
  let found = null
  remotes.forEach((remote) => {
    if (typeof remote === 'string' && remote === name) found = remote
    else if (remote.name && remote.name() === name) found = remote
  })
  return found
}

export function maybeInit (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err && err.message.match(/Could not find repository/)) return init(pwd, cb)
    if (err) return cb(err)
    return cb(null, repository, true) // <~ true == wasAlreadyInitialized
  })
}

export function getIndex (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return repository.index().then((index) => {
      return cb(null, index)
    }, cb)
  })
}

export function refreshIndex (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return repository.refreshIndex().then((index) => {
      return cb(null, index)
    }, cb)
  })
}

export function writeIndex (index, pwd, cb) {
  return index.write().then(() => {
    return index.writeTree().then((oid) => {
      return cb(null, oid)
    }, cb)
  }, cb)
}

export function addPathsToIndex (pwd, relpaths = [], cb) {
  if (relpaths.length < 1) return cb(new Error('Empty paths list given'))
  return getIndex(pwd, (err, index) => {
    if (err) return cb(err)
    return async.eachSeries(relpaths, (relpath, next) => {
      return index.addByPath(relpath).then(() => {
        return next()
      }, next)
    }, (err) => {
      if (err) return cb(err)
      return writeIndex(index, pwd, cb)
    })
  })
}

export function addAllPathsToIndex (pwd, cb) {
  return getIndex(pwd, (err, index) => {
    if (err) return cb(err)
    return index.addAll('.').then(() => {
      return writeIndex(index, pwd, cb)
    }, cb)
  })
}

export function referenceNameToId (pwd, name, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    logger.info('[git] getting id for reference name', name)
    return Reference.nameToId(repository, name).then((id) => {
      logger.info('[git] reference name', name, 'resolved to', id && id.toString())
      return cb(null, id)
    }, cb)
  })
}

export function createSignature (name, email) {
  const time = ~~(Date.now() / 1000)
  const tzoffset = 0 // minutes
  return Signature.create(name, email, time, tzoffset)
}

export function buildCommit (pwd, username, email, message, oid, updateRef, parentRef, cb) {
  const author = createSignature(username || DEFAULT_COMMITTER_NAME, email || DEFAULT_COMMITTER_EMAIL)
  const committer = createSignature(DEFAULT_COMMITTER_NAME, DEFAULT_COMMITTER_EMAIL)
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    // If no parent, assume first commit
    if (!parentRef) {
      return repository.createCommit(updateRef, author, committer, message, oid, []).then((commitId) => {
        return cb(null, commitId)
      }, cb)
    } else {
      // Otherwise grab the parent id and use it
      return referenceNameToId(pwd, parentRef, (err, parentId) => {
        if (err) return cb(err)
        return repository.createCommit(updateRef, author, committer, message, oid, [parentId]).then((commitId) => {
          return cb(null, commitId)
        }, cb)
      })
    }
  })
}

function getRepositoryHeadReference (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return repository.head().then((reference) => {
      return cb(null, reference, reference.type(), repository)
    }, cb)
  })
}

export function getCurrentBranchName (pwd, cb) {
  return getRepositoryHeadReference(pwd, (err, reference, type, repository) => {
    if (err) return cb(err)
    if (!reference.isBranch()) return cb(new Error('Head reference is not a branch'))
    const full = reference.name()
    const partial = full.replace('refs/heads/', '')
    return cb(null, partial, full, reference, repository)
  })
}

export function cloneRepo (gitRemoteUrl, gitRemoteUsername, gitRemotePassword, abspath, cb) {
  return Clone.clone(gitRemoteUrl, abspath, { fetchOpts: buildRemoteOptions(gitRemoteUsername, gitRemotePassword) }).then((repository) => {
    return cb(null, repository, abspath)
  }, cb)
}

export function pushToRemote (pwd, remoteName, fullBranchName, gitRemoteUsername, gitRemotePassword, doForcePush, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    const refSpecs = [`${(doForcePush) ? FORCE_PUSH_REFSPEC_PREFIX : ''}${fullBranchName}:${fullBranchName}`]
    return Remote.list(repository).then((remotes) => {
      const found = findExistingRemote(remotes, remoteName)
      if (!found) return cb(new Error(`Remote with name '${remoteName}' not found`))
      return Remote.lookup(repository, remoteName).then((remote) => {
        return fixRemoteHttpsUrl(repository, remote, gitRemoteUsername, gitRemotePassword, (err) => {
          if (err) return cb(err)
          return remote.push(refSpecs, buildRemoteOptions(gitRemoteUsername, gitRemotePassword)).then(() => {
            return cb()
          }, cb)
        })
      }, cb)
    }, cb)
  })
}

export function lookupRemote (pwd, remoteName, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Remote.lookup(repository, remoteName).then((remote) => {
      return cb(null, remote)
    }, cb)
  })
}

export function listRemotes (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Remote.list(repository).then((remotes) => {
      return cb(null, remotes)
    }, cb)
  })
}

function fixRemoteHttpsUrl (repository, remote, username, password, cb) {
  // HACK? It might be necessary in some cases to fix the remote URL to include HTTPS creds?
  // const url = remote.url()
  // const name = remote.name()
  // const matches = url.match(/^(https?)/)
  // const scheme = matches && matches[1]
  // if (!scheme) return cb() // This is not https
  // // TODO: Replace the creds in the URL with new creds?
  // if (url.indexOf('@') !== -1) return cb() // Creds are already present
  // const fixed = url.replace(`${scheme}://`, `${scheme}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@`)
  // const result = Remote.setUrl(repository, name, fixed)
  // console.log(fixed, result)
  return cb()
}

export function doesRemoteExist (pwd, remoteName, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Remote.list(repository).then((remotes) => {
      const found = findExistingRemote(remotes, remoteName)
      return cb(null, !!found)
    }, cb)
  })
}

export function getCurrentCommit (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return repository.getHeadCommit().then((commit) => {
      return cb(null, commit.sha(), commit, repository)
    }, cb)
  })
}

export function hardResetFromSHA (pwd, sha, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Commit.lookup(repository, sha).then((commit) => {
      return Reset.reset(repository, commit, Reset.TYPE.HARD).then(() => {
        return cb()
      }, cb)
    }, cb)
  })
}

export function fetchFromRemote (pwd, remoteName, gitRemoteUsername, gitRemotePassword, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Remote.lookup(repository, remoteName).then((remote) => {
      let fetchOpts = buildRemoteOptions(gitRemoteUsername, gitRemotePassword)

      // Need to set this otherwise the fetch won't also download tags.
      // Without tags, we can't detect what the next tag to bump to is
      fetchOpts.downloadTags = 3

      logger.info('[git] fetching remote', fetchOpts.downloadTags)
      return repository.fetch(remote, fetchOpts).then(() => {
        return cb()
      }, cb)
    }, cb)
  })
}

export function mergeBranches (pwd, branchNameOurs, branchNameTheirs, fileFavorName, doFindRenames, cb) {
  logger.info('[git] merging branches from', branchNameTheirs, 'to', branchNameOurs)

  return open(pwd, (err, repository) => {
    if (err) return cb(err)

    fileFavorName = (fileFavorName && fileFavorName.toUpperCase()) || 'NORMAL'
    logger.info('[git] merge file favor:', fileFavorName)
    logger.info('[git] merge finding renames?:', doFindRenames)

    // See libgit2 for info: https://github.com/libgit2/libgit2/blob/master/include/git2/merge.h
    let mergeOptions = {
      fileFavor: Merge.FILE_FAVOR[fileFavorName],
      fileFlags: Merge.FILE_FLAG.FILE_DEFAULT,
      flags: (doFindRenames) ? Merge.FLAG.FIND_RENAMES : void (0)
    }

    logger.info('[git] merge using options:', mergeOptions)

    return repository.mergeBranches(branchNameOurs, branchNameTheirs, null, Merge.PREFERENCE.NONE, mergeOptions).then((result) => {
      // If result is an oid string, the commit was successful. (The oid is a commit id.)
      if (result && typeof result === 'string') {
        return cb(null, false, result.toString(), result)
      }

      // If result is an oid object, the commit was successful. (The oid is a commit id.)
      if (result && result.constructor && result.constructor.name === 'Oid') {
        return cb(null, false, result.toString(), result)
      }

      // If the result is an index, there were conflicts. (The index is the index of conflicts.)
      if (result && result.constructor && result.constructor.name === 'Index') {
        logger.info('[git] merge conflict index (as index)', result)
        return cb(null, true, result, result)
      }

      return cb(new Error('Branch merge got unexpected result'), result, result)
    }, (err) => {
      // Upon a merge conflict, nodegit might return the index _as_ an error object. :-(  (The index is the index of conflicts.)
      if (err && err.constructor && err.constructor.name === 'Index') {
        logger.info('[git] merge conflict index (as error)', err)
        return cb(null, true, err, err)
      }

      return cb(err)
    })
  })
}

export function cleanAllChanges (pwd, cb) {
  return hardReset(pwd, 'HEAD', (err, repository, commit) => {
    if (err) return cb(err)
    return removeUntrackedFiles(pwd, cb)
  })
}

export function buildRemoteOptions (gitRemoteUsername, gitRemotePassword) {
  if (!gitRemoteUsername) throw new Error('Remote username required for credentials')
  if (!gitRemotePassword) throw new Error('Remote password required for credentials')
  return {
    callbacks: {
      certificateCheck: () => 1,
      credentials: function (url) {
        // return NodeGit.Cred.sshKeyFromAgent(username)
        return Cred.userpassPlaintextNew(gitRemoteUsername, gitRemotePassword)
      }
    }
  }
}

export function rebaseBranches (folder, upstreamName, branchName, ontoStr, cb) {
  return open(folder, (err, repository) => {
    if (err) return cb(err)
    return repository.rebaseBranches(branchName, upstreamName, ontoStr, null).then((oid) => {
      return cb(null, oid)
    }, cb)
  })
}

export function getCommitHistoryForFile (folder, filePath, maxEntries = 1000, cb) {
  return open(folder, (err, repository) => {
    if (err) return cb(err)
    return repository.getHeadCommit().then((headCommit) => {
      const walker = repository.createRevWalk()
      walker.push(headCommit.id())
      walker.sorting(RevWalk.SORT.TIME)
      return walker.fileHistoryWalk(filePath, maxEntries).then((historyCommits) => {
        return cb(null, historyCommits)
      }, cb)
    }, cb)
  })
}

export function getMasterCommitHistory (folder, cb) {
  return open(folder, (err, repository) => {
    if (err) return cb(err)
    return repository.getMasterCommit().then((firstCommit) => {
      const history = firstCommit.history(RevWalk.SORT.TIME)
      history.on('end', (commits) => { return cb(null, commits) })
      history.on('error', (error) => { return cb(error) })
      history.start()
      return history
    }, cb)
  })
}

export function mergeBranchesWithoutBase (folder, toName, fromName, signature, mergePreference, fileFavorName, cb) {
  logger.info('[git] merging branches (without base) from', fromName, 'to', toName)

  return open(folder, (err, repository) => {
    if (err) return cb(err)
    if (!mergePreference) mergePreference = Merge.PREFERENCE.NONE
    if (!signature) signature = signature || repository.defaultSignature()

    fileFavorName = (fileFavorName && fileFavorName.toUpperCase()) || 'NORMAL'
    logger.info('[git] merge (without base) file favor:', fileFavorName)

    // See libgit2 for info: https://github.com/libgit2/libgit2/blob/master/include/git2/merge.h
    let mergeOptions = {
      fileFavor: Merge.FILE_FAVOR[fileFavorName],
      fileFlags: Merge.FILE_FLAG.FILE_DEFAULT
    }

    return repository.getBranch(toName).then((toBranch) => {
      return repository.getBranch(fromName).then((fromBranch) => {
        return repository.getBranchCommit(toBranch).then((toCommit) => {
          return repository.getBranchCommit(fromBranch).then((fromCommit) => {
            const toCommitOid = toCommit.toString()
            const fromCommitOid = fromCommit.toString()
            return Reference.lookup(repository, 'HEAD').then((headRef) => {
              return headRef.resolve().then((headRef) => {
                const updateHead = !!headRef && headRef.name() === toBranch.name()

                logger.info('[git] merge using options:', mergeOptions)

                return Merge.commits(repository, toCommitOid, fromCommitOid, mergeOptions).then((index) => {
                  if (index.hasConflicts()) return cb(null, true, index)
                  return index.writeTreeTo(repository).then((oid) => {
                    const commitMessage = `Merged ${fromBranch.shorthand()} into ${toBranch.shorthand()}`
                    return repository.createCommit(toBranch.name(), signature, signature, commitMessage, oid, [toCommitOid, fromCommitOid]).then((mergeCommit) => {
                      if (!updateHead) return cb(null, false, mergeCommit.toString())
                      // Make sure head is updated so index isn't messed up
                      return repository.getBranch(toName).then((toBranch) => {
                        return repository.getBranchCommit(toBranch).then((branchCommit) => {
                          return branchCommit.getTree().then((toBranchTree) => {
                            return Checkout.tree(repository, toBranchTree, {
                              checkoutStrategy: Checkout.STRATEGY.SAFE | Checkout.STRATEGY.RECREATE_MISSING
                            }).then(() => {
                              return cb(null, false, mergeCommit.toString())
                            }, cb)
                          }, cb)
                        }, cb)
                      }, cb)
                    }, cb)
                  }, cb)
                }, cb)
              }, cb)
            }, cb)
          }, cb)
        }, cb)
      }, cb)
    }, cb)
  })
}

export function createTag (pwd, tagNameProbablySemver, commitId, tagMessage, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return repository.createTag(commitId.toString(), tagNameProbablySemver, tagMessage).then((tagOid) => {
      return cb(null, tagOid)
    }, cb)
  })
}

// Git.pushTagToRemote(state.folder, state.projectName, state.semverVersion, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb)
export function pushTagToRemote (pwd, remoteName, tagName, gitRemoteUsername, gitRemotePassword, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Remote.list(repository).then((remotes) => {
      const found = findExistingRemote(remotes, remoteName)
      if (!found) return cb(new Error(`Remote with name '${remoteName}' not found`))
      return Remote.lookup(repository, remoteName).then((remote) => {
        return fixRemoteHttpsUrl(repository, remote, gitRemoteUsername, gitRemotePassword, (err) => {
          if (err) return cb(err)
          const refSpecs = [`refs/tags/${tagName}`]
          return remote.push(refSpecs, buildRemoteOptions(gitRemoteUsername, gitRemotePassword)).then(() => {
            return cb()
          }, cb)
        })
      }, cb)
    }, cb)
  })
}

export function listTags (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) return cb(err)
    return Tag.list(repository).then((tags) => {
      return repository.getReferences(Reference.TYPE.OID).then((refs) => {
        refs.forEach(function (ref) {
          if (ref.isTag()) tags.push(ref.name())
        })
        return cb(null, tags)
      }, cb)
    }, cb)
  })
}

/**
 * @function commitProject
 * @param folder {String}
 * @param username {String|Null}
 * @param useHeadAsParent {Beolean}
 * @param saveOptions {Object}
 * @param pathsToAdd {String|Array} - '.' to add all paths, [path, path] to add individual paths
 **/
export function commitProject (folder, username, useHeadAsParent, saveOptions = {}, pathsToAdd, cb) {
  logger.info(`[git] adding paths to index in folder ${folder}`)

  // Depending on the 'pathsToAdd' given, either add specific paths to the index, or commit them all
  function pathAdder (done) {
    if (pathsToAdd === '.') {
      return addAllPathsToIndex(folder, done)
    } else if (Array.isArray(pathsToAdd) && pathsToAdd.length > 0) {
      return addPathsToIndex(folder, pathsToAdd, done)
    } else {
      return done()
    }
  }

  return pathAdder((err, oid) => {
    if (err) return cb(err)

    const user = username || DEFAULT_GIT_USERNAME
    const email = username || DEFAULT_GIT_EMAIL
    const message = (saveOptions && saveOptions.commitMessage) || DEFAULT_GIT_COMMIT_MESSAGE

    const parentRef = (useHeadAsParent) ? 'HEAD' : null // Initial commit might not want us to specify a nonexistent ref
    const updateRef = 'HEAD'

    logger.info(`[git] committing ${JSON.stringify(message)} in ${folder} [${updateRef} onto ${parentRef}] ...`)

    return buildCommit(folder, user, email, message, oid, updateRef, parentRef, (err, commitId) => {
      if (err) return cb(err)

      logger.info(`[git] commit done (${commitId.toString()})`)

      return cb(null, commitId)
    })
  })
}

export function fetchProject (folder, projectName, projectGitRemoteUrl, gitRemoteUsername, gitRemotePassword, cb) {
  return upsertRemote(folder, projectName, projectGitRemoteUrl, (err, remote) => {
    if (err) return cb(err)

    logger.info(`[git] fetching ${projectName} from remote ${projectGitRemoteUrl}`)

    return fetchFromRemote(folder, projectName, gitRemoteUsername, gitRemotePassword, (err) => {
      if (err) return cb(err)
      logger.info('[git] fetch done')
      return cb()
    })
  })
}

export function pushProject (folder, projectName, projectGitRemoteUrl, gitRemoteUsername, gitRemotePassword, cb) {
  return getCurrentBranchName(folder, (err, partialBranchName, fullBranchName) => {
    if (err) return cb(err)

    logger.info(`[git] pushing ${fullBranchName} to remote (${projectName}) ${projectGitRemoteUrl}`)

    const doForcePush = true

    return pushToRemote(folder, projectName, fullBranchName, gitRemoteUsername, gitRemotePassword, doForcePush, (err) => {
      if (err) return cb(err)
      logger.info('[git] push done')
      return cb()
    })
  })
}

export function combineHistories (folder, projectName, ourBranchName, theirBranchName, saveOptions = {}, cb) {
  const fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy)

  return mergeBranchesWithoutBase(folder, ourBranchName, theirBranchName, null, null, fileFavorName, (err, didHaveConflicts, shaOrIndex) => {
    if (err) return cb(err)
    return cb(null, didHaveConflicts, shaOrIndex)
  })
}

export function mergeProject (folder, projectName, partialBranchName, saveOptions = {}, cb) {
  const remoteBranchRefName = `remotes/${projectName}/${partialBranchName}`
  const fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy)

  // #IDUNNO: For some reason when this is set to `true` (in turn resulting in mergeOptions.flags getting set to 1),
  // merging with a merge strategy of OURS/THEIRS ends up with conflicts (which should never happen with OURS/THEIRS).
  // Since I don't initially see any problem with just setting it to `false` for all cases, I'll hardcode it as such.
  // It's possible this is a flaw in Nodegit?
  // If you find a case where this needs to be `true`, please document why below this comment.
  const doFindRenames = false

  logger.info(`[git] merging '${remoteBranchRefName}' into '${partialBranchName}' via '${fileFavorName}' (${folder})`)

  return mergeBranches(folder, partialBranchName, remoteBranchRefName, fileFavorName, doFindRenames, (err, didHaveConflicts, shaOrIndex) => {
    if (!err) {
      return cb(null, didHaveConflicts, shaOrIndex)
    }

    if (err.message && err.message.match(/No merge base found/i)) {
      logger.info(`[git] histories lack common ancestor; trying to combine`)

      // This should return the same payload as Git.mergeBranches returns
      return combineHistories(folder, projectName, partialBranchName, remoteBranchRefName, saveOptions, cb)
    }

    return cb(err)
  })
}

export function logStatuses (statuses) {
  statuses.forEach((status) => {
    logger.info('[git] git status:' + status.path() + ' ' + statusToText(status))
  })
}

export function statusToText (status) {
  const words = []
  if (status.isNew()) words.push('NEW')
  if (status.isModified()) words.push('MODIFIED')
  if (status.isTypechange()) words.push('TYPECHANGE')
  if (status.isRenamed()) words.push('RENAMED')
  if (status.isIgnored()) words.push('IGNORED')
  return words.join(' ')
}

export function saveStrategyToFileFavorName (saveStrategy) {
  if (!saveStrategy) return 'normal'
  if (!saveStrategy.strategy) return 'normal'
  if (saveStrategy.strategy === 'recursive') return 'normal'
  if (saveStrategy.strategy === 'ours') return 'ours'
  if (saveStrategy.strategy === 'theirs') return 'theirs'
  return 'normal'
}
