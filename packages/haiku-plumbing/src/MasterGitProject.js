import async from 'async'
import fse from 'haiku-fs-extra'
import path from 'path'
import { EventEmitter } from 'events'
import semver from 'semver'
import tmp from 'tmp'
import lodash from 'lodash'
import { client as sdkClient } from '@haiku/sdk-client'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import * as Git from './Git'
import * as ProjectFolder from './ProjectFolder'
import * as Inkstone from './Inkstone'

const PLUMBING_PKG_PATH = path.join(__dirname, '..')
const PLUMBING_PKG_JSON_PATH = path.join(PLUMBING_PKG_PATH, 'package.json')
const MAX_SEMVER_TAG_ATTEMPTS = 100
const AWAIT_COMMIT_INTERVAL = 0
const MIN_WORKER_INTERVAL = 32
const MAX_WORKER_INTERVAL = 32 * 20
const MAX_CLONE_ATTEMPTS = 20
const CLONE_RETRY_DELAY = 5000
const DEFAULT_BRANCH_NAME = 'master' // "'master' process" has nothing to do with this :/
const BASELINE_SEMVER_TAG = '0.0.0'
const COMMIT_SUFFIX = '(via Haiku Desktop)'

function _isCommitTypeRequest ({ type }) {
  return type === 'commit'
}

export default class MasterGitProject extends EventEmitter {
  constructor (folder) {
    super()

    this.folder = folder

    if (!this.folder) {
      throw new Error('[master-git] MasterGitProject cannot launch without a folder defined')
    }

    // List of all actions that can be undone via git
    this._gitUndoables = []
    this._gitRedoables = []
    this._requestQueue = []
    this._requestWorkerStopped = false
    this._workerInterval = MIN_WORKER_INTERVAL
    this._requestsWorker = this._requestsWorker.bind(this) // Save object allocs
    this._requestsWorker()

    // Dictionary mapping SHA strings to share payloads, used for caching
    this._shareInfoPayloads = {}

    // Snapshot of the current folder state as of the last fetchFolderState run
    this._folderState = {}

    // Project info used extensively in the internal machinery, populated later
    this._projectInfo = {
      // projectName,
      // haikuUsername,
      // haikuPassword,
      // branchName,
    }
  }

  _upWorkerInterval () {
    if (this._workerInterval < MAX_WORKER_INTERVAL) {
      this._workerInterval += 16
    }
  }

  _downWorkerInterval () {
    if (this._workerInterval > MIN_WORKER_INTERVAL) {
      this._workerInterval -= 16
    }
  }

  _requestsWorker () {
    if (this._requestWorkerStopped) return void (0)
    const requestInfo = this._requestQueue.shift()
    if (requestInfo) {
      // If we have work, start going faster
      // this._downWorkerInterval()
      const { type, options, cb } = requestInfo
      const finish = (err, out) => {
        // Put at the bottom of the event loop
        setTimeout(this._requestsWorker)
        return cb(err, out)
      }
      if (type === 'undo') this.undoActual(options, finish)
      else if (type === 'redo') this.redoActual(options, finish)
      else if (type === 'commit') this.commitActual(options, finish)
    } else {
      // If we have nothing to do, start backing off
      // this._upWorkerInterval()
      setTimeout(this._requestsWorker, this._workerInterval)
    }
  }

  teardown (cb) {
    return this.waitUntilNoFurtherRequestsArePending(() => {
      this._requestWorkerStopped = true
      return cb()
    })
  }

  restart (projectInfo) {
    // In case a previous run left a lock file lying around, get rid of it otherwise
    // we won't be able to add paths to the index. This is just a hacky protection.
    Git.destroyIndexLockSync(this.folder)

    this._requestWorkerStopped = false

    this._gitUndoables.splice(0)
    this._gitRedoables.splice(0)

    if (projectInfo) {
      this._projectInfo.projectName = projectInfo.projectName
      this._projectInfo.haikuUsername = projectInfo.haikuUsername
      this._projectInfo.haikuPassword = projectInfo.haikuPassword
      this._projectInfo.branchName = projectInfo.branchName
    }
  }

  getGitUndoablesUptoBase () {
    const undoablesToReturn = []
    let didFindBaseUndoable = false
    this._gitUndoables.forEach((undoable) => {
      if (undoable.isBase) {
        didFindBaseUndoable = true
      }
      if (didFindBaseUndoable) {
        undoablesToReturn.push(undoable)
      }
    })
    return undoablesToReturn
  }

  getGitRedoablesUptoBase () {
    const redoablesToReturn = []
    this._gitRedoables.forEach((redoable) => {
      redoablesToReturn.push(redoable)
    })
    return redoablesToReturn
  }

  /**
   * internal machinery
   * ==================
   */

  runActionSequence (seq, projectOptions, cb) {
    if (!seq || seq.length < 1) {
      return cb()
    }

    return async.eachSeries(seq, (method, next) => {
      return this.fetchFolderState(`action-sequence=${method}`, projectOptions, (err) => {
        if (err) return next(err)
        logger.info('[master-git] running action sequence entry', method)
        // Assume that any 'action sequence' method only receives a callback as an argument
        return this[method](next)
      })
    }, (err) => {
      if (err) return cb(err)
      // Recipients of this response also depend on the folderState being up to date
      return this.fetchFolderState('action-sequence=done', projectOptions, cb)
    })
  }

  getFolderState () {
    return this._folderState
  }

  fetchFolderState (who, projectOptions, cb) {
    logger.info(`[master-git] fetching folder state (${who})`)

    let previousState = lodash.clone(this._folderState)

    if (projectOptions) {
      this._folderState.projectOptions = projectOptions

      if (projectOptions.organizationName) {
        this._folderState.organizationName = projectOptions.organizationName
      }
    }

    return async.series([
      (cb) => {
        return this.safeHasAnyHeadCommitForCurrentBranch((hasHeadCommit) => {
          this._folderState.hasHeadCommit = hasHeadCommit
          return cb()
        })
      },

      (cb) => {
        return Git.referenceNameToId(this.folder, 'HEAD', (_err, headCommitId) => {
          this._folderState.headCommitId = headCommitId
          return cb()
        })
      },

      (cb) => {
        return this.safeListLocallyDeclaredRemotes((gitRemotesList) => {
          this._folderState.gitRemotesList = gitRemotesList
          return cb()
        })
      },

      (cb) => {
        return this.safeGitStatus({ log: false }, (gitStatuses) => {
          this._folderState.doesGitHaveChanges = !!(gitStatuses && Object.keys(gitStatuses).length > 0)
          this._folderState.isGitInitialized = fse.existsSync(path.join(this.folder, '.git'))
          return cb()
        })
      },

      (cb) => {
        this._folderState.folderEntries = fse.readdirSync(this.folder)
        this._folderState.folder = this.folder
        this._folderState.projectName = this._projectInfo.projectName
        this._folderState.branchName = this._projectInfo.branchName
        this._folderState.haikuUsername = this._projectInfo.haikuUsername
        this._folderState.haikuPassword = this._projectInfo.haikuPassword
        this._folderState.gitUndoables = this._gitUndoables
        this._folderState.gitRedoables = this._gitRedoables
        return cb()
      },

      (cb) => {
        const packageJsonExists = fse.existsSync(path.join(this.folder, 'package.json'))
        if (!packageJsonExists) return cb()
        const packageJsonObj = fse.readJsonSync(path.join(this.folder, 'package.json'), { throws: false })
        if (!packageJsonObj) return cb()
        this._folderState.semverVersion = packageJsonObj.version
        this._folderState.playerVersion = packageJsonObj.dependencies && packageJsonObj.dependencies['@haiku/player']
        return cb()
      }
    ], (err) => {
      if (err) return cb(err)
      logger.info(`[master-git] folder state fetch (${who}) done`)
      return cb(null, this._folderState, previousState)
    })
  }

  safeListLocallyDeclaredRemotes (cb) {
    return Git.listRemotes(this.folder, (err, remotes) => {
      // Note that in case of error we return the error object
      // This is a legacy implementation; I'm not sure why #TODO
      if (err) return cb(null, err)
      return cb(remotes)
    })
  }

  safeFetchProjectGitRemoteInfo (cb) {
    if (!this._projectInfo.projectName) {
      return cb(null)
    }

    const authToken = sdkClient.config.getAuthToken()

    return Inkstone.project.getByName(authToken, this._projectInfo.projectName, (err, projectAndCredentials, httpResp) => {
      // Note the inversion of the typical error-first continuation
      // This is a legacy implementation; I'm not sure why #TODO
      if (err) return cb(null, err)

      if (!httpResp) {
        return cb(null, new Error('No HTTP response'))
      }
      if (httpResp.statusCode === 404) {
        return cb(null, new Error('Got 404 status code'))
      }
      if (!projectAndCredentials.Project) {
        return cb(null, new Error('No project returned'))
      }

      return cb({ // eslint-disable-line
        projectName: this._projectInfo.projectName,
        GitRemoteUrl: projectAndCredentials.Project.GitRemoteUrl,
        CodeCommitHttpsUsername: projectAndCredentials.Credentials.CodeCommitHttpsUsername,
        CodeCommitHttpsPassword: projectAndCredentials.Credentials.CodeCommitHttpsPassword
      })
    })
  }

  safeHasAnyHeadCommitForCurrentBranch (cb) {
    if (!this._projectInfo.branchName) {
      // Note the inversion of the typical error-first continuation
      // This is a legacy implementation; I'm not sure why #TODO
      return cb(false) // eslint-disable-line
    }

    const refPath = path.join(this.folder, '.git', 'refs', 'heads', this._projectInfo.branchName)

    return fse.exists(refPath, (answer) => {
      return cb(!!answer) // eslint-disable-line
    })
  }

  getPendingCommitRequests () {
    return this._requestQueue.filter(_isCommitTypeRequest)
  }

  hasAnyPendingCommits () {
    return this.getPendingCommitRequests().length > 0
  }

  waitUntilNoFurtherChangesAreAwaitingCommit (cb) {
    if (!this.hasAnyPendingCommits()) {
      return cb()
    }

    return setTimeout(() => {
      return this.waitUntilNoFurtherChangesAreAwaitingCommit(cb)
    }, AWAIT_COMMIT_INTERVAL)
  }

  // In case we want to wait for any request, including commits...
  waitUntilNoFurtherRequestsArePending (cb) {
    if (this._requestQueue.length < 1) {
      return cb()
    }

    return setTimeout(() => {
      return this.waitUntilNoFurtherRequestsArePending(cb)
    }, AWAIT_COMMIT_INTERVAL)
  }

  /**
   * action sequence methods
   * =======================
   */

  bumpSemverAppropriately (cb) {
    logger.info('[master-git] trying to bump semver appropriately')

    return Git.listTags(this.folder, (err, tags) => {
      if (err) return cb(err)

      const cleanTags = tags.map((dirtyTag) => {
        // Clean v0.1.2 and refs/head/v0.1.2 to just 0.1.2
        return dirtyTag.split('/').pop().replace(/^v/, '')
      })

      logger.info('[master-git] tags found:', cleanTags.join(','))

      // 1. Figure out which is the largest semver tag among
      //    - git tags
      //    - the max version
      let maxTag = BASELINE_SEMVER_TAG

      cleanTags.forEach((cleanTag) => {
        if (semver.gt(cleanTag, maxTag)) {
          maxTag = cleanTag
        }
      })

      const pkgTag = fse.readJsonSync(path.join(this.folder, 'package.json')).version
      if (semver.gt(pkgTag, maxTag)) {
        maxTag = pkgTag
      }

      logger.info('[master-git] max git tag found is', maxTag)

      // 2. Bump this tag to the next version, higher than anything we have locally
      const nextTag = semver.inc(maxTag, 'patch')

      logger.info('[master-git] next tag to set is', nextTag)

      // 3. Set the package.json number to the new version
      return ProjectFolder.semverBumpPackageJson(this.folder, nextTag, (err) => {
        if (err) return cb(err)

        logger.info(`[master-git] bumped package.json semver to ${nextTag}`)

        // The main master process and component need to handle this too since the
        // bytecode contains the version which we use to render in the right-click menu
        this.emit('semver-bumped', nextTag, () => {
          return cb(null, nextTag)
        })
      })
    })
  }

  makeTag (cb) {
    logger.info(`[master-git] git tagging: ${this._folderState.semverVersion} (commit: ${this._folderState.commitId})`)

    if (!this._folderState.semverTagAttempts) {
      this._folderState.semverTagAttempts = 0
    }

    this._folderState.semverTagAttempts += 1

    if (this._folderState.semverTagAttempts > MAX_SEMVER_TAG_ATTEMPTS) {
      return cb(new Error('Failed to make semver tag even after many attempts'))
    }

    return Git.createTag(this.folder, this._folderState.semverVersion, this._folderState.commitId, this._folderState.semverVersion, (err) => {
      if (err) {
        // If the tag already exists, we can try to correct the situation by bumping the semver until we find a good tag.
        if (err.message && err.message.match(/Tag already exists/i)) {
          logger.info(`[master-git] git tag ${this._folderState.semverVersion} already exists; trying to bump it`)

          return this.bumpSemverAppropriately((err, incTag) => {
            if (err) return cb(err)

            this._folderState.semverVersion = incTag

            // Recursively go into this sequence again, hopefully eventually finding a good tag to use
            // If we try this too many times and fail (see above), we will quit the process
            return this.makeTag(cb)
          })
        }

        return cb(err)
      }

      logger.sacred(`[master-git] git tagged: ${this._folderState.semverVersion}`)

      return cb()
    })
  }

  retryCloudSaveSetup (cb) {
    logger.info(`[master-git] retrying remote ref setup to see if we can cloud save after all`)

    return this.ensureAllRemotes((err) => {
      if (err) {
        return this.cloudSaveDisabled(cb)
      }

      return this.fetchFolderState('cloud-setup', {}, (err) => {
        if (err) {
          return this.cloudSaveDisabled(cb)
        }

        if (!this._folderState.isGitInitialized) {
          return this.cloudSaveDisabled(cb)
        }

        return cb()
      })
    })
  }

  pushToRemote (cb) {
    if (this._folderState.saveOptions && this._folderState.saveOptions.dontPush) {
      logger.info('[master-git] skipping push to remote, per your saveOptions flag')
      return cb() // Hack: Allow consumer to skip push (e.g. for testing)
    }

    if (this._folderState.wasResetPerformed) return cb() // Kinda hacky to put this here...

    const {
      GitRemoteUrl,
      CodeCommitHttpsUsername,
      CodeCommitHttpsPassword
    } = this._folderState.remoteProjectDescriptor

    return Git.pushProject(this.folder, this._folderState.projectName, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, (err) => {
      if (err) return cb(err)
      return this.pushTag(GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb)
    })
  }

  initializeGit (cb) {
    return Git.maybeInit(this.folder, cb)
  }

  moveContentsToTemp (cb) {
    logger.info('[master-git] moving folder contents to temp dir (if any)')

    return tmp.dir({ unsafeCleanup: true }, (err, tmpDir, tmpDirCleanupFn) => {
      if (err) return cb(err)

      this._folderState.tmpDir = tmpDir

      logger.info('[master-git] temp dir is', this._folderState.tmpDir)

      this._folderState.tmpDirCleanupFn = tmpDirCleanupFn

      // Whether or not we had entries, we still need the temp folder created at this point otherwise
      // methods downstream will complain
      if (this._folderState.folderEntries.length < 1) {
        logger.info('[master-git] folder had no initial content; skipping temp folder step')

        return cb()
      }

      logger.info('[master-git] copying contents from', this.folder, 'to temp dir', this._folderState.tmpDir)

      return fse.copy(this.folder, this._folderState.tmpDir, (err) => {
        if (err) return cb(err)

        // Don't include the git database as part of the copy since we'll be copying back into
        // a directory that is going to contain all of the remote information, etc.
        try {
          fse.removeSync(path.join(this._folderState.tmpDir, '.git'))
        } catch (exception) {
          logger.info('[master-git] could not remove .git folder from temp dir', exception)
        }

        logger.info('[master-git] emptying original dir', this.folder)

        // Folder must be empty for a Git clone to take place
        return fse.emptyDir(this.folder, (err) => {
          if (err) return cb(err)
          return cb()
        })
      })
    })
  }

  cloneRemoteIntoFolder (cb) {
    if (!this._folderState.cloneAttempts) {
      this._folderState.cloneAttempts = 0
    }

    this._folderState.cloneAttempts++

    const {
      GitRemoteUrl,
      CodeCommitHttpsUsername,
      CodeCommitHttpsPassword
    } = this._folderState.remoteProjectDescriptor

    logger.sacred(`[master-git] cloning from remote ${GitRemoteUrl} (attempt ${this._folderState.cloneAttempts})`)

    return Git.cloneRepo(GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, this.folder, (err) => {
      if (err) {
        logger.info(`[master-git] clone error:`, err)

        if (this._folderState.cloneAttempts < MAX_CLONE_ATTEMPTS) {
          logger.info(`[master-git] retrying clone after a brief delay...`)

          return setTimeout(() => {
            return this.cloneRemoteIntoFolder(cb)
          }, CLONE_RETRY_DELAY)
        }

        return cb(err)
      }

      logger.info('[master-git] clone complete')

      return this.ensureAllRemotes((err) => {
        if (err) return cb(err)
        return cb()
      })
    })
  }

  ensureAllRemotes (cb) {
    return this.ensureLocalRemote((err) => {
      if (err) return cb(err)
      return this.ensureRemoteRefs((err) => {
        if (err) return cb(err)
        return cb()
      })
    })
  }

  ensureLocalRemote (cb) {
    // Object access to .GitRemoteUrl would throw an exception in some cases if we didn't check this
    if (!this._folderState.remoteProjectDescriptor) {
      return cb(new Error('Cannot find remote project descriptor'))
    }
    const { GitRemoteUrl } = this._folderState.remoteProjectDescriptor
    logger.info('[master-git] upserting remote', GitRemoteUrl)
    return Git.upsertRemote(this.folder, this._folderState.projectName, GitRemoteUrl, cb)
  }

  ensureBranch (cb) {
    return Git.open(this.folder, (err, repository) => {
      if (err) return cb(err)
      return this.safeSetupBranch(repository, this._folderState.headCommitId, cb)
    })
  }

  safeSetupBranch (repository, commitId, cb) {
    const branchName = DEFAULT_BRANCH_NAME
    const refSpec = `refs/heads/${branchName}`

    logger.info('[master-git] remote refs: creating branch', branchName)

    return repository.createBranch(branchName, commitId.toString()).then(() => {
      return cb()
    }, (branchErr) => {
      // The remote already exists; there was no need to create it. Go ahead and skip
      if (branchErr.message && branchErr.message.match(/reference with that name already exists/) && branchErr.message.split(refSpec).length > 1) {
        logger.info('[master-git] remote refs: branch already exists; proceeding')
        return cb(null, branchName)
      }
      return cb(branchErr)
    })
  }

  ensureRemoteRefs (cb) {
    logger.info('[master-git] remote refs: ensuring')

    return Git.open(this.folder, (err, repository) => {
      if (err) return cb(err)

      logger.info('[master-git] remote refs: setting up base content')

      return fse.outputFile(path.join(this.folder, 'README.md'), '', (err) => {
        if (err) return cb(err)

        logger.info('[master-git] remote refs: making base commit')

        return Git.addAllPathsToIndex(this.folder, (err, oid) => {
          if (err) {
            return cb(err)
          }

          return Git.buildCommit(this.folder, this._folderState.haikuUsername, null, `Base commit ${COMMIT_SUFFIX}`, oid, null, null, (err, commitId) => {
            if (err) return cb(err)

            return this.safeSetupBranch(repository, commitId, (err, branchName) => {
              if (err) return cb(err) // Should only be present if error is NOT about branch already existing

              const refSpecToPush = `refs/heads/${branchName}`

              return Git.lookupRemote(this.folder, this._folderState.projectName, (err, mainRemote) => {
                if (err) return cb(err)

                const remoteRefspecs = [refSpecToPush]
                const remoteCreds = Git.buildRemoteOptions(this._folderState.remoteProjectDescriptor.CodeCommitHttpsUsername, this._folderState.remoteProjectDescriptor.CodeCommitHttpsPassword)

                logger.info('[master-git] remote refs: pushing refspecs', remoteRefspecs, 'over https')

                return mainRemote.push(remoteRefspecs, remoteCreds).then(() => {
                  return cb()
                }, cb)
              })
            })
          })
        })
      })
    })
  }

  copyContentsFromTemp (cb) {
    logger.info('[master-git] returning original folder contents (if any)')

    if (this._folderState.folderEntries.length < 1) {
      logger.info('[master-git] no original folder entries present')
      return cb()
    }

    // TODO: Should this return an error or not?
    if (!this._folderState.tmpDir) {
      logger.info('[master-git] no temp dir seems to have been created at', this._folderState.tmpDir)
      return cb()
    }

    logger.info('[master-git] copying contents from', this._folderState.tmpDir, 'back to original folder', this.folder)

    return fse.copy(this._folderState.tmpDir, this.folder, (err) => {
      if (err) return cb(err)
      logger.info('[master-git] cleaning up temp dir', this._folderState.tmpDir)
      this._folderState.tmpDirCleanupFn()
      return cb()
    })
  }

  pullRemote (cb) {
    const {
      GitRemoteUrl,
      CodeCommitHttpsUsername,
      CodeCommitHttpsPassword
    } = this._folderState.remoteProjectDescriptor

    return Git.fetchProject(this.folder, this._folderState.projectName, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, (err) => {
      if (err) {
        // Ignore the error for now since the remote might not actually exist yet
        logger.info(`[master-git] unable to fetch because ${err}; ignoring this`)

        // Just for the sake of logging the current git status
        return this.safeGitStatus({ log: true }, () => {
          this._folderState.didHaveConflicts = false
          this._folderState.mergeCommitId = null
          return cb()
        })
      }

      return Git.getCurrentBranchName(this.folder, (err, partialBranchName) => {
        if (err) return cb(err)
        logger.info(`[master-git] current branch is '${partialBranchName}'`)

        const remoteBranchRefName = Git.getRemoteBranchRefName(this._folderState.projectName, partialBranchName)
        return Git.getReference(this.folder, remoteBranchRefName, (err, ref) => {
          if (err) return cb(err)

          // If no reference, we probably haven't pushed the remote yet, so skip the merge attempt
          if (!ref) {
            logger.info(`[master-git] skipping merge after pull since no ref ${remoteBranchRefName} exists`)
            // Just for the sake of logging the current git status
            return this.safeGitStatus({ log: true }, () => {
              this._folderState.didHaveConflicts = false
              this._folderState.mergeCommitId = null
              return cb()
            })
          }

          return Git.mergeProject(this.folder, this._folderState.projectName, partialBranchName, this._folderState.saveOptions, (err, didHaveConflicts, shaOrIndex) => {
            if (err) return cb(err)

            if (!didHaveConflicts) {
              logger.info(`[master-git] merge complete (${shaOrIndex})`)
            } else {
              logger.info(`[master-git] merge conflicts detected`)
            }

            // Just for the sake of logging the current git status
            return this.safeGitStatus({ log: true }, () => {
              this._folderState.didHaveConflicts = didHaveConflicts
              this._folderState.mergeCommitId = (didHaveConflicts) ? null : shaOrIndex.toString()
              return cb()
            })
          })
        })
      })
    })
  }

  conflictResetOrContinue (cb) {
    // If no conficts, this save is good; ok to push and return
    if (!this._folderState.didHaveConflicts) return cb()

    // If conflicts, do a reset so a second save attempt can go through
    // TODO: Don't clean but leave things as-is for manual intervention
    logger.info('[master-git] cleaning merge conflicts for re-attempt')

    // Only calling this to log whatever the current statuses are
    return this.safeGitStatus({ log: true }, () => {
      return Git.cleanAllChanges(this.folder, (err) => {
        if (err) return cb(err)
        return Git.hardResetFromSHA(this.folder, this._folderState.commitId.toString(), (err) => {
          if (err) return cb(err)
          this._folderState.wasResetPerformed = true
          return cb()
        })
      })
    })
  }

  /**
   * @method getExistingShareDataIfSaveIsUnnecessary
   * @description Given the current folder state, determine if we need to save or if we can simply
   * retrieve a pre-existing share link.
   */
  getExistingShareDataIfSaveIsUnnecessary (cb) {
    return this.fetchFolderState('get-existing-share-data', {}, () => {
      // TODO: We may need to look closely to see if this boolean is set properly.
      // Currently the _getFolderState method just checks to see if there are git statuses,
      // but that might not be correct (although it seemed to be when I initially checked).
      if (this._folderState.doesGitHaveChanges) {
        logger.info('[master-git] looks like git has changes; must do full save')
        return cb(null, false) // falsy == you gotta save
      }

      // Inkstone should return info pretty fast if it has share info, so only wait 2s
      return this.getCurrentShareInfo(2000, (err, shareInfo) => {
        // Rather than treat the error as an error, assume it indicates that we need
        // to do a full publish. For example, we don't want to "error" if this is just a network timeout.
        // #FIXME?
        if (err) {
          logger.info('[master-git] share info was error-ish; must do full save')
          return cb(null, false) // falsy == you gotta save
        }

        // Not sure why this would be null, but just in case...
        if (!shareInfo) {
          logger.info('[master-git] share info was blank; must do full save')
          return cb(null, false) // falsy == you gotta save
        }

        // If we go this far, we already have a save for our current SHA, and can skip the expensive stuff
        logger.info('[master-git] share info found! no need to save')
        return cb(null, shareInfo)
      })
    })
  }

  cloudSaveDisabled (cb) {
    const error = new Error('Project was saved locally, but could not sync to Haiku Cloud')
    error.code = 1
    return cb(error)
  }

  /**
   * methods
   * =======
   */

  getHaikuPlayerLibVersion () {
    if (!fse.existsSync(PLUMBING_PKG_JSON_PATH)) return null
    var obj = fse.readJsonSync(PLUMBING_PKG_JSON_PATH, { throws: false })
    return obj && obj.version
  }

  getCurrentShareInfo (timeout, cb) {
    return Inkstone.getCurrentShareInfo(this.folder, this._shareInfoPayloads, this._folderState, timeout, cb)
  }

  pushTag (GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb) {
    logger.info(`[master-git] pushing tag ${this._folderState.semverVersion} to remote (${this._folderState.projectName}) ${GitRemoteUrl}`)
    return Git.pushTagToRemote(this.folder, this._folderState.projectName, this._folderState.semverVersion, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb)
  }

  undo (undoOptions, cb) {
    this._requestQueue.push({
      type: 'undo',
      options: undoOptions,
      cb
    })
  }

  redo (redoOptions, cb) {
    this._requestQueue.push({
      type: 'redo',
      options: redoOptions,
      cb
    })
  }

  undoActual (undoOptions, done) {
    logger.info('[master-git] undo beginning')

    // We can't undo if there isn't a target ref yet to go back to; skip if so
    if (this._gitUndoables.length < 2) {
      logger.info('[master-git] nothing to undo')
      return done()
    }

    logger.info('[master-git] undo proceeding')

    // The most recent item is the one we are going to undo...
    const validUndoables = this.getGitUndoablesUptoBase()
    const undone = validUndoables.pop()

    logger.info(`[master-git] git undo commit ${undone.commitId.toString()}`)

    // To undo, we go back to the commit _prior to_ the most recent one
    const target = validUndoables[validUndoables.length - 1]

    logger.info(`[master-git] git undo resetting to commit ${target.commitId.toString()}`)

    return Git.hardResetFromSHA(this.folder, target.commitId.toString(), (err) => {
      if (err) {
        logger.info(`[master-git] git undo failed`, err)
        return done(err)
      }

      logger.info('[master-git] undo done')

      // The most recent undone thing becomes an action we can now undo.
      // Only do the actual stack-pop here once we know we have succeeded.
      this._gitRedoables.push(this._gitUndoables.pop())

      return done()
    })
  }

  redoActual (redoOptions, done) {
    const redoable = this._gitRedoables.pop()

    // If nothing to redo, consider this a noop
    if (!redoable) return done()

    logger.info(`[master-git] git redo commit ${redoable.commitId.toString()}`)

    return Git.hardResetFromSHA(this.folder, redoable.commitId.toString(), (err) => {
      if (err) {
        logger.info(`[master-git] git redo failed`)
        this._gitRedoables.push(redoable) // If error, put the 'undone' thing back on the stack since we didn't succeed
        return done(err)
      }

      this._gitUndoables.push(redoable)

      return done()
    })
  }

  setUndoBaselineIfHeadCommitExists (cb) {
    return this.fetchFolderState('undo-baseline', {}, () => {
      // We need a base commit to act as the commit to return to if the user has done 'undo' to the limit of the stack
      if (this._folderState.headCommitId) {
        if (this._gitUndoables.length < 1) {
          logger.info(`[master-git] base commit for session is ${this._folderState.headCommitId.toString()}`)
          this._gitUndoables.push({
            commitId: this._folderState.headCommitId,
            message: 'Base commit for session',
            isBase: true
          })
        }
      }
      return cb()
    })
  }

  safeGitStatus (options, cb) {
    return Git.status(this.folder, options || {}, (err, statuses) => {
      if (options && options.log) {
        if (statuses) {
          Git.logStatuses(statuses)
        } else if (err) {
          logger.info('[master-git] git status error:', err)
        }
      }
      // Note the inversion of the error-first style
      // This is a legacy implementation; I'm not sure why #TODO
      if (err) {
        return cb(null, err)
      }
      return cb(statuses)
    })
  }

  statusForFile (relpath, cb) {
    return this.safeGitStatus({ log: false, relpath }, (gitStatuses) => {
      let foundStatus

      if (gitStatuses) {
        for (let key in gitStatuses) {
          if (foundStatus) {
            continue
          }

          let gitStatus = gitStatuses[key]

          if (path.normalize(gitStatus.path) === path.normalize(relpath)) {
            foundStatus = gitStatus
          }
        }
      }

      return cb(null, foundStatus)
    })
  }

  commitFileIfChanged (relpath, message, cb) {
    // The call to status is sync, so we add this hook in case pending commits may alter the status
    return this.waitUntilNoFurtherChangesAreAwaitingCommit(() => {
      return this.statusForFile(relpath, (err, status) => {
        if (err) return cb(err)
        if (!status) return cb() // No status means no changes
        // 0 is UNMODIFIED, everything else is a change
        // See http://www.nodegit.org/api/diff/#getDelta
        if (status.num && status.num > 0) {
          return this.commit(relpath, message, cb)
        } else {
          return cb()
        }
      })
    })
  }

  commitProjectIfChanged (message, cb) {
    // The call to status is sync, so we add this hook in case pending commits may alter the status
    return this.waitUntilNoFurtherChangesAreAwaitingCommit(() => {
      return this.safeGitStatus({ log: true }, (gitStatuses) => {
        const doesGitHaveChanges = gitStatuses && Object.keys(gitStatuses).length > 0
        if (doesGitHaveChanges) { // Don't add garbage/empty commits if nothing changed
          return this.commit('.', message, cb)
        }
        return cb()
      })
    })
  }

  // Note: This is an action sequence method, only takes a cb as an arg.
  commitEverything (cb) {
    return this.commit('.', 'Project changes', cb)
  }

  commit (addable, message, cb) {
    this._requestQueue.push({
      type: 'commit',
      options: { addable, message },
      cb
    })
  }

  commitActual (commitOptions, cb) {
    const { message, addable } = commitOptions

    const finalOptions = {}
    finalOptions.commitMessage = `${message} ${COMMIT_SUFFIX}`

    return this.fetchFolderState('commit-project', {}, () => {
      return Git.commitProject(this.folder, this._folderState.haikuUsername, this._folderState.hasHeadCommit, finalOptions, addable, (err, commitId) => {
        if (err) {
          return cb(err)
        }

        this._folderState.commitId = commitId

        // HACK: If for some reason we never got a 'base' undoable before this point, set this cmomit as
        // the new base so that there are always commits from a base commit going forward
        let isBase = false

        const baseUndoable = this._gitUndoables.filter((undoable) => {
          return undoable && undoable.isBase
        })[0]

        if (!baseUndoable) {
          isBase = true
        }

        logger.sacred(`[master-git] commit ${commitId.toString()} (base: ${isBase})`)

        // For now, pretty much any commit we capture in this session is considered an undoable. We may want to
        // circle back and restrict it to only certain types of commits, but that does end up making the undo/redo
        // stack logic a bit more complicated.
        this._gitUndoables.push({ commitId, isBase, message })

        return cb(null, commitId)
      })
    })
  }

  initializeProject (initOptions, done) {
    // Empty folder state since we are going to reload it in here
    this._folderState = {}

    return async.series([
      (cb) => {
        return this.fetchFolderState('initialize-folder', initOptions, (err) => {
          if (err) return cb(err)
          logger.info('[master-git] folder initialization status:', this._folderState)
          return cb()
        })
      },

      (cb) => {
        const {
          isGitInitialized,
          projectName
        } = this._folderState

        // Based on the above statuses, assemble a sequence of actions to take.
        let actionSequence = []

        if (!isGitInitialized) {
          actionSequence = ['initializeGit']

          // HACK: If the user is opening CheckTutorialfor the first time, assume they are taking
          // the tour, and clone down the content which has been set up for them on the cloud
          if (projectName === 'CheckTutorial') {
            actionSequence = [
              'fetchGitRemoteInfoState',
              'moveContentsToTemp',
              'cloneRemoteIntoFolder',
              'copyContentsFromTemp'
            ]
          }
        } else {
          actionSequence = []
        }

        logger.info('[master-git] action sequence:', actionSequence.map((name) => name))

        return this.runActionSequence(actionSequence, initOptions, (err) => {
          if (err) return cb(err)
          return cb()
        })
      }
    ], (err, results) => {
      if (err) return done(err)
      return done(null, results[results.length - 1])
    })
  }

  fetchGitRemoteInfoState (cb) {
    return this.safeFetchProjectGitRemoteInfo((remoteProjectDescriptor) => {
      this._folderState.remoteProjectDescriptor = remoteProjectDescriptor
      return cb()
    })
  }

  saveProject (saveOptions, done) {
    // Empty folder state since we are going to reload it in here
    this._folderState = {}

    let saveAccumulator = {
      semverVersion: null
    }

    return async.series([
      (cb) => {
        return this.waitUntilNoFurtherChangesAreAwaitingCommit(cb)
      },

      (cb) => {
        return this.fetchFolderState('save-project', saveOptions, (err) => {
          if (err) return cb(err)
          this._folderState.semverVersion = saveAccumulator.semverVersion
          this._folderState.saveOptions = saveOptions
          logger.info('[master-git] pre-save status:', this._folderState)
          return cb()
        })
      },

      (cb) => {
        return this.safeFetchProjectGitRemoteInfo((remoteProjectDescriptor) => {
          this._folderState.remoteProjectDescriptor = remoteProjectDescriptor
          return cb()
        })
      },

      (cb) => {
        logger.info('[master-git] project save: preparing action sequence')

        const isCodeCommitReady = !!(this._projectInfo.projectName && this._folderState.remoteProjectDescriptor)

        const {
          isGitInitialized,
          doesGitHaveChanges
        } = this._folderState

        // Based on the above statuses, assemble a sequence of actions to take.
        let actionSequence = []

        if (!isGitInitialized && !isCodeCommitReady) {
          actionSequence = [
            'initializeGit',
            'commitEverything',
            'makeTag',
            'retryCloudSaveSetup'
          ]
        } else if (!isGitInitialized && isCodeCommitReady) {
          actionSequence = [
            // 'initializeGit', Don't need this since clone does it?
            'moveContentsToTemp',
            'cloneRemoteIntoFolder',
            'copyContentsFromTemp',
            'commitEverything',
            'makeTag',
            'ensureRemoteRefs',
            'pushToRemote'
          ]
        } else if (isGitInitialized && !isCodeCommitReady) {
          actionSequence = [
            'commitEverything',
            'makeTag',
            'retryCloudSaveSetup'
          ]
        } else if (isGitInitialized && isCodeCommitReady) {
          if (doesGitHaveChanges) {
            actionSequence = [
              'commitEverything',
              'ensureBranch',
              'ensureLocalRemote',
              'pullRemote', // Turn on when collab is back
              'conflictResetOrContinue', // Turn on when collab is back
              'bumpSemverAppropriately',
              'commitEverything',
              'makeTag',
              'pushToRemote'
            ]
          } else if (!doesGitHaveChanges) {
            actionSequence = [
              'ensureBranch',
              'ensureLocalRemote',
              'pullRemote', // Turn on when collab is back
              'bumpSemverAppropriately',
              'commitEverything',
              'makeTag',
              'pushToRemote'
            ]
          }
        }

        logger.info('[master-git] project save: action sequence:', actionSequence.map((name) => name))

        return this.runActionSequence(actionSequence, saveOptions, cb)
      },

      (cb) => {
        logger.info('[master-git] project save: completed initial sequence')

        // If we have conflicts, we can't proceed to the share step, so return early.
        // Conflicts aren't returned as an error because the frontend expects them as part of the response payload.
        if (this._folderState.didHaveConflicts) {
          // A fake conflicts object for now
          // #TODO add real thing
          return cb(null, { conflicts: [1] })
        }

        logger.info('[master-git] project save: fetching current share info')

        // TODO: it may make sense to separate the "get the share link"
        // flow from the "save" flow
        return this.getCurrentShareInfo(60000 * 2, cb)
      }
    ], (err, results) => {
      if (err) return done(err)
      return done(null, results[results.length - 1])
    })
  }
}
