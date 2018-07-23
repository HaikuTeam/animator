/* tslint:disable:no-shadowed-variable max-line-length */
import * as async from 'async';
import * as fse from 'haiku-fs-extra';
import * as path from 'path';
import {EventEmitter} from 'events';
import * as semver from 'semver';
import * as tmp from 'tmp';
import * as lodash from 'lodash';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';
import {inkstone} from '@haiku/sdk-inkstone';
import * as Git from './Git';
import * as Inkstone from './Inkstone';
import * as Lock from 'haiku-serialization/src/bll/Lock';
import {semverBumpPackageJson} from './project-folder/semverBumpPackageJson';

const PLUMBING_PKG_PATH = path.join(__dirname, '..');
const PLUMBING_PKG_JSON_PATH = path.join(PLUMBING_PKG_PATH, 'package.json');
const MAX_SEMVER_TAG_ATTEMPTS = 100;
const AWAIT_COMMIT_INTERVAL = 0;
const MIN_WORKER_INTERVAL = 32;
const MAX_WORKER_INTERVAL = 32 * 20;
const MAX_CLONE_ATTEMPTS = 20;
const CLONE_RETRY_DELAY = 5000;
const DEFAULT_BRANCH_NAME = 'master'; // "'master' process" has nothing to do with this :/
const BASELINE_SEMVER_TAG = '0.0.0';

function _isCommitTypeRequest ({type}) {
  return type === 'commit';
}

export default class MasterGitProject extends EventEmitter {
  constructor (folder) {
    super();

    this.folder = folder;

    if (!this.folder) {
      throw new Error('[master-git] MasterGitProject cannot launch without a folder defined');
    }

    this._requestQueue = [];
    this._requestWorkerStopped = false;
    this._workerInterval = MIN_WORKER_INTERVAL;
    this._requestsWorker = this._requestsWorker.bind(this); // Save object allocs
    this._requestsWorker();

    // Flag to prevent git status races where a prior commit request hasn't happened yet
    this._isCommittingLocked = false;

    // Dictionary mapping SHA strings to share payloads, used for caching
    this._shareInfoPayloads = {};

    // Snapshot of the current folder state as of the last gderState run
    this.folderState = {};

    // Project info used extensively in the internal machinery, populated later
    this._projectInfo = {};
  }

  _upWorkerInterval () {
    if (this._workerInterval < MAX_WORKER_INTERVAL) {
      this._workerInterval += 16;
    }
  }

  _downWorkerInterval () {
    if (this._workerInterval > MIN_WORKER_INTERVAL) {
      this._workerInterval -= 16;
    }
  }

  _requestsWorker () {
    if (this._requestWorkerStopped) {
      return void (0);
    }
    const requestInfo = this._requestQueue.shift();
    if (requestInfo) {
      // If we have work, start going faster
      // this._downWorkerInterval()
      const {type, options, cb} = requestInfo;
      const finish = (err, out) => {
        // Put at the bottom of the event loop
        setTimeout(this._requestsWorker);
        return cb(err, out);
      };

      // Seems weird to have this logic just to handle one kind of action...
      if (type === 'commit') {
        this.commitActual(options, finish);
      }
    } else {
      // If we have nothing to do, start backing off
      // this._upWorkerInterval()
      setTimeout(this._requestsWorker, this._workerInterval);
    }
  }

  teardown (cb) {
    return this.waitUntilNoFurtherRequestsArePending(() => {
      this._requestWorkerStopped = true;
      return cb();
    });
  }

  restart (projectInfo) {
    // In case a previous run left a lock file lying around, get rid of it otherwise
    // we won't be able to add paths to the index. This is just a hacky protection.
    Git.destroyIndexLockSync(this.folder);

    this._requestWorkerStopped = false;

    if (projectInfo) {
      this._projectInfo.projectName = projectInfo.projectName;
      this._projectInfo.authorName = projectInfo.authorName;
      this._projectInfo.branchName = projectInfo.branchName;
      this._projectInfo.repositoryUrl = projectInfo.repositoryUrl;
    }
  }

  /**
   * internal machinery
   * ==================
   */

  runActionSequence (seq, projectOptions, cb) {
    if (!seq || seq.length < 1) {
      return cb();
    }

    return async.eachSeries(seq, (method, next) => {
      return this.fetchFolderState(`action-sequence=${method}`, projectOptions, (err) => {
        if (err) {
          return next(err);
        }
        logger.info('[master-git] running action sequence entry', method);
        // Assume that any 'action sequence' method only receives a callback as an argument
        return this[method](next);
      });
    }, (err) => {
      if (err) {
        return cb(err);
      }
      // Recipients of this response also depend on the folderState being up to date
      return this.fetchFolderState('action-sequence=done', projectOptions, cb);
    });
  }

  getFolderState () {
    return this.folderState;
  }

  fetchFolderState (who, projectOptions, doneCb) {
    logger.info(`[master-git] fetching folder state (${who})`);

    const previousState = lodash.clone(this.folderState);

    if (projectOptions) {
      this.folderState.projectOptions = projectOptions;

      if (projectOptions.organizationName) {
        this.folderState.organizationName = projectOptions.organizationName;
      }
    }

    return async.parallel([
      (cb) => {
        return this.safeHasAnyHeadCommitForCurrentBranch((hasHeadCommit) => {
          this.folderState.hasHeadCommit = hasHeadCommit;
          return cb();
        });
      },
      (cb) => {
        return Git.referenceNameToId(this.folder, 'HEAD', (err, headCommitId) => {
          this.folderState.headCommitId = headCommitId;
          return cb();
        });
      },
      (cb) => {
        return this.safeListLocallyDeclaredRemotes((gitRemotesList) => {
          this.folderState.gitRemotesList = gitRemotesList;
          return cb();
        });
      },
      (cb) => {
        return this.safeGitStatus({log: false}, (gitStatuses) => {
          this.folderState.doesGitHaveChanges = !!(gitStatuses && Object.keys(gitStatuses).length > 0);
          this.folderState.isGitInitialized = fse.existsSync(path.join(this.folder, '.git'));
          return cb();
        });
      },
      (cb) => {
        this.folderState.folder = this.folder;
        this.folderState.projectName = this._projectInfo.projectName;
        this.folderState.branchName = this._projectInfo.branchName;
        this.folderState.authorName = this._projectInfo.authorName;
        fse.readdir(this.folder, (_, folderEntries) => {
          this.folderState.folderEntries = folderEntries;
          cb();
        });
      },
      (cb) => {
        fse.readJson(path.join(this.folder, 'package.json'), (err, packageJsonObj) => {
          if (err || !packageJsonObj) {
            return cb();
          }

          this.folderState.semverVersion = packageJsonObj.version;

          cb();
        });
      },
    ], () => {
      return doneCb(null, this.folderState, previousState);
    });
  }

  safeListLocallyDeclaredRemotes (cb) {
    return Git.listRemotes(this.folder, (err, remotes) => {
      // Note that in case of error we return the error object
      // This is a legacy implementation; I'm not sure why #TODO
      if (err) {
        return cb(null, err);
      }
      return cb(remotes);
    });
  }

  safeFetchProjectGitRemoteInfo (cb) {
    if (!this._projectInfo.projectName) {
      return cb(null);
    }

    return cb({
      projectName: this._projectInfo.projectName,
      repositoryUrl: this._projectInfo.repositoryUrl,
    });
  }

  safeHasAnyHeadCommitForCurrentBranch (cb) {
    if (!this._projectInfo.branchName) {
      // Note the inversion of the typical error-first continuation
      // This is a legacy implementation; I'm not sure why #TODO
      return cb(false); // eslint-disable-line
    }

    const refPath = path.join(this.folder, '.git', 'refs', 'heads', this._projectInfo.branchName);

    return fse.exists(refPath, (answer) => {
      return cb(!!answer); // eslint-disable-line
    });
  }

  getPendingCommitRequests () {
    return this._requestQueue.filter(_isCommitTypeRequest);
  }

  hasAnyPendingCommits () {
    return (
      this._isCommittingLocked ||
      this.getPendingCommitRequests().length > 0
    );
  }

  waitUntilNoFurtherChangesAreAwaitingCommit (cb) {
    if (!this.hasAnyPendingCommits()) {
      return cb();
    }

    return setTimeout(() => {
      return this.waitUntilNoFurtherChangesAreAwaitingCommit(cb);
    }, AWAIT_COMMIT_INTERVAL);
  }

  // In case we want to wait for any request, including commits...
  waitUntilNoFurtherRequestsArePending (cb) {
    if (this._requestQueue.length < 1) {
      return cb();
    }

    return setTimeout(() => {
      return this.waitUntilNoFurtherRequestsArePending(cb);
    }, AWAIT_COMMIT_INTERVAL);
  }

  /**
   * action sequence methods
   * =======================
   */

  bumpSemverAppropriately (cb) {
    logger.info('[master-git] trying to bump semver appropriately');

    return Git.listTags(this.folder, (err, tags) => {
      if (err) {
        return cb(err);
      }

      const cleanTags = tags.map((dirtyTag) => {
        // Clean v0.1.2 and refs/head/v0.1.2 to just 0.1.2
        return dirtyTag.split('/').pop().replace(/^v/, '');
      });

      logger.info('[master-git] tags found:', cleanTags.join(','));

      // 1. Figure out which is the largest semver tag among
      //    - git tags
      //    - the max version
      let maxTag = BASELINE_SEMVER_TAG;

      cleanTags.forEach((cleanTag) => {
        if (semver.gt(cleanTag, maxTag)) {
          maxTag = cleanTag;
        }
      });

      const pkgTag = fse.readJsonSync(path.join(this.folder, 'package.json')).version;
      if (semver.gt(pkgTag, maxTag)) {
        maxTag = pkgTag;
      }

      logger.info('[master-git] max git tag found is', maxTag);

      // 2. Bump this tag to the next version, higher than anything we have locally
      const nextTag = semver.inc(maxTag, 'patch');

      logger.info('[master-git] next tag to set is', nextTag);

      // 3. Set the package.json number to the new version
      return semverBumpPackageJson(this.folder, nextTag, (err) => {
        if (err) {
          return cb(err);
        }

        logger.info(`[master-git] bumped package.json semver to ${nextTag}`);

        // The main master process and component need to handle this too since the
        // bytecode contains the version which we use to render in the right-click menu
        this.emit('semver-bumped', nextTag, () => {
          return this.fetchFolderState('semver-bumped', {}, (err) => {
            if (err) {
              return cb(err);
            }
            return cb(null, nextTag);
          });
        });
      });
    });
  }

  makeTag (cb) {
    logger.info(`[master-git] git tagging: ${this.folderState.semverVersion} (commit: ${this.folderState.commitId})`);

    if (!this.folderState.semverTagAttempts) {
      this.folderState.semverTagAttempts = 0;
    }

    this.folderState.semverTagAttempts += 1;

    if (this.folderState.semverTagAttempts > MAX_SEMVER_TAG_ATTEMPTS) {
      return cb(new Error('Failed to make semver tag even after many attempts'));
    }

    return Git.createTag(this.folder, this.folderState.semverVersion, this.folderState.commitId, this.folderState.semverVersion, (err) => {
      if (err) {
        // If the tag already exists, we can try to correct the situation by bumping the semver until we find a good tag.
        if (err.message && err.message.match(/Tag already exists/i)) {
          logger.info(`[master-git] git tag ${this.folderState.semverVersion} already exists; trying to bump it`);

          return this.bumpSemverAppropriately((err, incTag) => {
            if (err) {
              return cb(err);
            }

            this.folderState.semverVersion = incTag;

            // Recursively go into this sequence again, hopefully eventually finding a good tag to use
            // If we try this too many times and fail (see above), we will quit the process
            return this.makeTag(cb);
          });
        }

        return cb(err);
      }

      logger.info(`[master-git] git tagged: ${this.folderState.semverVersion}`);

      return cb();
    });
  }

  retryCloudSaveSetup (cb) {
    logger.info(`[master-git] retrying remote ref setup to see if we can cloud save after all`);

    return this.ensureAllRemotes((err) => {
      if (err) {
        return this.cloudSaveDisabled(cb);
      }

      return this.fetchFolderState('cloud-setup', {}, (err) => {
        if (err) {
          return this.cloudSaveDisabled(cb);
        }

        if (!this.folderState.isGitInitialized) {
          return this.cloudSaveDisabled(cb);
        }

        return cb();
      });
    });
  }

  saveSnapshot (cb) {
    Git.referenceNameToId(this.folder, 'HEAD', (gitErr, id) => {
      if (gitErr) {
        cb(gitErr);
        return;
      }

      logger.info('[inkstone] git HEAD resolved:', id.toString(), 'creating snapshot...');
      inkstone.project.createSnapshot({
        Name: this.folderState.projectName,
        Sha: id.toString(),
      }, cb);
    });
  }

  pushToRemote (cb) {
    if (this.folderState.saveOptions && this.folderState.saveOptions.dontPush) {
      logger.info('[master-git] skipping push to remote, per your saveOptions flag');
      return cb(); // Hack: Allow consumer to skip push (e.g. for testing)
    }

    if (this.folderState.wasResetPerformed) {
      return cb(); // Kinda hacky to put this here...
    }

    const {repositoryUrl} = this.folderState.remoteProjectDescriptor;
    return Git.pushProjectDirectly(
      this.folder,
      this.folderState.projectName,
      (err) => {
        if (err) {
          cb(err);
          return;
        }

        this.pushTagDirectly(cb);
      },
    );
  }

  initializeGit (cb) {
    return Git.maybeInit(this.folder, cb);
  }

  moveContentsToTemp (cb) {
    logger.info('[master-git] moving folder contents to temp dir (if any)');

    return tmp.dir({unsafeCleanup: true}, (err, tmpDir, tmpDirCleanupFn) => {
      if (err) {
        return cb(err);
      }

      this.folderState.tmpDir = tmpDir;

      logger.info('[master-git] temp dir is', this.folderState.tmpDir);

      this.folderState.tmpDirCleanupFn = tmpDirCleanupFn;

      // Whether or not we had entries, we still need the temp folder created at this point otherwise
      // methods downstream will complain
      if (this.folderState.folderEntries.length < 1) {
        logger.info('[master-git] folder had no initial content; skipping temp folder step');

        return cb();
      }

      logger.info('[master-git] copying contents from', this.folder, 'to temp dir', this.folderState.tmpDir);

      return fse.copy(this.folder, this.folderState.tmpDir, (err) => {
        if (err) {
          return cb(err);
        }

        // Don't include the git database as part of the copy since we'll be copying back into
        // a directory that is going to contain all of the remote information, etc.
        try {
          fse.removeSync(path.join(this.folderState.tmpDir, '.git'));
        } catch (exception) {
          logger.info('[master-git] could not remove .git folder from temp dir', exception);
        }

        logger.info('[master-git] emptying original dir', this.folder);

        // Folder must be empty for a Git clone to take place
        return fse.emptyDir(this.folder, (err) => {
          if (err) {
            return cb(err);
          }
          return cb();
        });
      });
    });
  }

  cloneRemoteIntoFolder (cb) {
    if (!this.folderState.cloneAttempts) {
      this.folderState.cloneAttempts = 0;
    }
    this.folderState.cloneAttempts++;

    const {repositoryUrl} = this.folderState.remoteProjectDescriptor;
    logger.info(`[master-git] directly cloning from remote ${repositoryUrl}`);
    return Git.cloneRepoDirectly(repositoryUrl, this.folder, (err) => {
      if (err) {
        logger.info(`[master-git] clone error:`, err);

        if (this.folderState.cloneAttempts < MAX_CLONE_ATTEMPTS) {
          logger.info(`[master-git] retrying clone after a brief delay...`);

          return setTimeout(() => {
            return this.cloneRemoteIntoFolder(cb);
          }, CLONE_RETRY_DELAY);
        }

        return cb(err);
      }

      logger.info('[master-git] clone complete');
      return cb();
    });
  }

  ensureAllRemotes (cb) {
    return this.ensureLocalRemote((err) => {
      if (err) {
        return cb(err);
      }
      return this.ensureRemoteRefs((err) => {
        if (err) {
          return cb(err);
        }
        return cb();
      });
    });
  }

  ensureLocalRemote (cb) {
    // Object access to .repositoryUrl would throw an exception in some cases if we didn't check this
    if (!this.folderState.remoteProjectDescriptor) {
      return cb(new Error('Cannot find remote project descriptor'));
    }
    const {repositoryUrl} = this.folderState.remoteProjectDescriptor;
    logger.info('[master-git] upserting remote', repositoryUrl);
    return Git.upsertRemoteDirectly(this.folder, this.folderState.projectName, repositoryUrl, cb);
  }

  ensureBranch (cb) {
    return Git.open(this.folder, (err, repository) => {
      if (err) {
        return cb(err);
      }
      return this.safeSetupBranch(repository, this.folderState.branchName, this.folderState.headCommitId, cb);
    });
  }

  safeSetupBranch (repository, branchName = DEFAULT_BRANCH_NAME, commitId, cb) {
    const refSpec = `refs/heads/${branchName}`;

    logger.info('[master-git] remote refs: creating branch', branchName);

    return repository.createBranch(branchName, commitId.toString()).then(() => {
      return cb();
    }, (branchErr) => {
      // The remote already exists; there was no need to create it. Go ahead and skip
      if (branchErr.message && branchErr.message.match(/reference with that name already exists/) && branchErr.message.split(refSpec).length > 1) {
        logger.info('[master-git] remote refs: branch already exists; proceeding');
        return cb(null, branchName);
      }
      return cb(branchErr);
    });
  }

  ensureRemoteRefs (cb) {
    logger.info('[master-git] remote refs: ensuring');

    return Git.open(this.folder, (err, repository) => {
      if (err) {
        return cb(err);
      }

      logger.info('[master-git] remote refs: setting up base content');

      return fse.outputFile(path.join(this.folder, 'README.md'), '', (err) => {
        if (err) {
          return cb(err);
        }

        logger.info('[master-git] remote refs: making base commit');

        return Git.addAllPathsToIndex(this.folder, (err, oid) => {
          if (err) {
            return cb(err);
          }

          return Git.buildCommit(this.folder, this.folderState.authorName, null, `Base commit (via Haiku)`, oid, null, null, (err, commitId) => {
            if (err) {
              return cb(err);
            }

            return this.safeSetupBranch(repository, this.folderState.branchName, commitId, (err, branchName) => {
              if (err) {
                return cb(err);
              } // Should only be present if error is NOT about branch already existing

              const refSpecToPush = `refs/heads/${branchName}`;

              return Git.lookupRemote(this.folder, this.folderState.projectName, (err, mainRemote) => {
                if (err) {
                  return cb(err);
                }

                const remoteRefspecs = [refSpecToPush];

                logger.info('[master-git] remote refs: pushing refspecs', remoteRefspecs, 'over https');

                return mainRemote.push(remoteRefspecs, Git.globalPushOpts).then(() => {
                  return cb();
                }, cb);
              });
            });
          });
        });
      });
    });
  }

  copyContentsFromTemp (cb) {
    logger.info('[master-git] returning original folder contents (if any)');

    if (this.folderState.folderEntries.length < 1) {
      logger.info('[master-git] no original folder entries present');
      return cb();
    }

    // TODO: Should this return an error or not?
    if (!this.folderState.tmpDir) {
      logger.info('[master-git] no temp dir seems to have been created at', this.folderState.tmpDir);
      return cb();
    }

    logger.info('[master-git] copying contents from', this.folderState.tmpDir, 'back to original folder', this.folder);

    return fse.copy(this.folderState.tmpDir, this.folder, (err) => {
      if (err) {
        return cb(err);
      }
      logger.info('[master-git] cleaning up temp dir', this.folderState.tmpDir);
      this.folderState.tmpDirCleanupFn();
      return cb();
    });
  }

  pullRemotePostFetch (cb) {
    return Git.getCurrentBranchName(this.folder, (err, partialBranchName) => {
      if (err) {
        return cb(err);
      }
      logger.info(`[master-git] current branch is '${partialBranchName}'`);

      const remoteBranchRefName = Git.getRemoteBranchRefName(this.folderState.projectName, partialBranchName);
      return Git.getReference(this.folder, remoteBranchRefName, (err, ref) => {
        if (err) {
          return cb(err);
        }

        // If no reference, we probably haven't pushed the remote yet, so skip the merge attempt
        if (!ref) {
          logger.info(`[master-git] skipping merge after pull since no ref ${remoteBranchRefName} exists`);
          // Just for the sake of logging the current git status
          return this.safeGitStatus({log: true}, () => {
            this.folderState.didHaveConflicts = false;
            this.folderState.mergeCommitId = null;
            return cb();
          });
        }

        return Git.mergeProject(this.folder, this.folderState.projectName, partialBranchName, this.folderState.saveOptions, (err, didHaveConflicts, shaOrIndex) => {
          if (err) {
            return cb(err);
          }

          if (!didHaveConflicts) {
            logger.info(`[master-git] merge complete (${shaOrIndex})`);
          } else {
            logger.info(`[master-git] merge conflicts detected`);
          }

          // Just for the sake of logging the current git status
          return this.safeGitStatus({log: true}, () => {
            this.folderState.didHaveConflicts = didHaveConflicts;
            this.folderState.mergeCommitId = (didHaveConflicts) ? null : shaOrIndex.toString();
            return cb();
          });
        });
      });
    });
  }

  pullRemote (cb) {
    // We can't pull the remote if we don't have any remote info;
    // this can happen if there's a connection problem;
    // instead of crashing, we just silently skip this step
    if (!this.folderState.remoteProjectDescriptor) {
      return cb();
    }

    const {repositoryUrl} = this.folderState.remoteProjectDescriptor;

    return Git.fetchProjectDirectly(this.folder, this.folderState.projectName, repositoryUrl, (err) => {
      if (err) {
        // Ignore the error for now since the remote might not actually exist yet
        logger.info(`[master-git] unable to fetch because ${err}; ignoring this`);

        // Just for the sake of logging the current git status
        return this.safeGitStatus({log: true}, () => {
          this.folderState.didHaveConflicts = false;
          this.folderState.mergeCommitId = null;
          return cb();
        });
      }

      return this.pullRemotePostFetch(cb);
    });
  }

  conflictResetOrContinue (cb) {
    // If no conficts, this save is good; ok to push and return
    if (!this.folderState.didHaveConflicts) {
      return cb();
    }

    // If conflicts, do a reset so a second save attempt can go through
    // TODO: Don't clean but leave things as-is for manual intervention
    logger.info('[master-git] cleaning merge conflicts for re-attempt');

    // Only calling this to log whatever the current statuses are
    return this.safeGitStatus({log: true}, () => {
      return Git.cleanAllChanges(this.folder, (err) => {
        if (err) {
          return cb(err);
        }
        return Git.hardResetFromSHA(this.folder, this.folderState.commitId.toString(), (err) => {
          if (err) {
            return cb(err);
          }
          this.folderState.wasResetPerformed = true;
          return cb();
        });
      });
    });
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
      if (this.folderState.doesGitHaveChanges) {
        logger.info('[master-git] looks like git has changes; must do full save');
        return cb(null, false); // falsy == you gotta save
      }

      // Inkstone should return info pretty fast if it has share info, so only wait 2s
      return this.getCurrentShareInfo((err, shareInfo) => {
        // Rather than treat the error as an error, assume it indicates that we need
        // to do a full publish. For example, we don't want to "error" if this is just a network timeout.
        // #FIXME?
        if (err) {
          logger.info('[master-git] share info was error-ish; must do full save');
          return cb(null, false); // falsy == you gotta save
        }

        // Not sure why this would be null, but just in case...
        if (!shareInfo) {
          logger.info('[master-git] share info was blank; must do full save');
          return cb(null, false); // falsy == you gotta save
        }

        // If we go this far, we already have a save for our current SHA, and can skip the expensive stuff
        logger.info('[master-git] share info found! no need to save');
        return cb(null, shareInfo);
      });
    });
  }

  cloudSaveDisabled (cb) {
    const error = new Error('Project was saved locally, but could not sync to Haiku Cloud');
    error.code = 1;
    return cb(error);
  }

  /**
   * methods
   * =======
   */

  getHaikuCoreLibVersion () {
    if (!fse.existsSync(PLUMBING_PKG_JSON_PATH)) {
      return null;
    }
    const obj = fse.readJsonSync(PLUMBING_PKG_JSON_PATH, {throws: false});
    return obj && obj.version;
  }

  getCurrentShareInfo (cb) {
    return Inkstone.getCurrentShareInfo(this.folder, this._shareInfoPayloads, this.folderState, cb);
  }

  pushTagDirectly (cb) {
    logger.info(`[master-git] pushing tag ${this.folderState.semverVersion} to remote (${this.folderState.projectName})`);
    return Git.pushTagToRemoteDirectly(this.folder, this.folderState.projectName, this.folderState.semverVersion, cb);
  }

  safeGitStatus (options, cb) {
    return Git.status(this.folder, options || {}, (err, statuses) => {
      if (options && options.log) {
        if (statuses) {
          Git.logStatuses(statuses);
        } else if (err) {
          logger.info('[master-git] git status error:', err);
        }
      }
      // Note the inversion of the error-first style
      // This is a legacy implementation; I'm not sure why #TODO
      if (err) {
        return cb(null, err);
      }
      return cb(statuses);
    });
  }

  statusForFile (relpath, cb) {
    return this.safeGitStatus({relpath, log: false}, (gitStatuses) => {
      let foundStatus;

      if (gitStatuses) {
        for (const key in gitStatuses) {
          if (foundStatus) {
            continue;
          }

          const gitStatus = gitStatuses[key];

          if (path.normalize(gitStatus.path) === path.normalize(relpath)) {
            foundStatus = gitStatus;
          }
        }
      }

      return cb(null, foundStatus);
    });
  }

  commitFileIfChanged (relpath, message, cb) {
    // The call to status is sync, so we add this hook in case pending commits may alter the status
    return this.waitUntilNoFurtherChangesAreAwaitingCommit(() => {
      // git status is async so we lock queued commit requests until we finish
      this._isCommittingLocked = true;

      const abspath = path.join(this.folder, relpath);
      return Lock.request(Lock.LOCKS.FileReadWrite(abspath), false, (release) => {
        return this.statusForFile(relpath, (err, status) => {
          // Everything until we commit is now sync so it's safe to turn this off
          this._isCommittingLocked = false;

          const finish = (err) => {
            release();
            return cb(err);
          };

          // No status means no changes.
          // 0 is UNMODIFIED, everything else is a change
          // See http://www.nodegit.org/api/diff/#getDelta
          if (err || !status || !status.num || status.num < 1) {
            return finish(err);
          }

          return this.commit(relpath, message, finish);
        });
      });
    });
  }

  commitProjectIfChanged (message, cb) {
    // The call to status is sync, so we add this hook in case pending commits may alter the status
    return this.waitUntilNoFurtherChangesAreAwaitingCommit(() => {
      // git status is async so we lock queued commit requests until we finish
      this._isCommittingLocked = true;

      return this.safeGitStatus({log: true}, (gitStatuses) => {
        // Everything until we commit is now sync so it's safe to turn this off
        this._isCommittingLocked = false;

        const doesGitHaveChanges = gitStatuses && Object.keys(gitStatuses).length > 0;

        if (doesGitHaveChanges) { // Don't add garbage/empty commits if nothing changed
          return this.commit('.', message, cb);
        }

        return cb();
      });
    });
  }

  // Note: This is an action sequence method, only takes a cb as an arg.
  commitEverything (cb) {
    return this.commit('.', 'Project changes', cb);
  }

  commit (addable, message, cb) {
    this._requestQueue.push({
      cb,
      type: 'commit',
      options: {addable, message},
    });
  }

  commitActual (commitOptions, cb) {
    const {message, addable} = commitOptions;

    const finalOptions = {};

    finalOptions.commitMessage = message;

    return this.fetchFolderState('commit-project', {}, () => {
      return Git.commitProject(this.folder, this.folderState.authorName, this.folderState.hasHeadCommit, finalOptions, addable, (err, commitId) => {
        if (err) {
          return cb(err);
        }
        this.folderState.commitId = commitId;
        return cb(null, commitId);
      });
    });
  }

  initializeFolder (initOptions, done) {
    // Empty folder state since we are going to reload it in here
    this.folderState = {};

    return async.series([
      (cb) => {
        return this.fetchFolderState('initialize-folder', initOptions, (err) => {
          if (err) {
            return cb(err);
          }
          logger.info('[master-git] folder initialization status:', this.folderState);
          return cb();
        });
      },

      (cb) => {
        const {isGitInitialized} = this.folderState;
        const actionSequence = [];

        if (isGitInitialized) {
          actionSequence.push('fetchGitRemoteInfoState', 'pullRemote');
        } else if (this._projectInfo.repositoryUrl) {
          actionSequence.push(
            'fetchGitRemoteInfoState',
            'moveContentsToTemp',
            'cloneRemoteIntoFolder',
            'copyContentsFromTemp',
          );

        } else {
          actionSequence.push('initializeGit');
        }

        logger.info('[master-git] action sequence:', actionSequence);

        return this.runActionSequence(actionSequence, initOptions, (err) => {
          if (err) {
            return cb(err);
          }
          return cb();
        });
      },
    ], (err, results) => {
      if (err) {
        return done(err);
      }
      return done(null, results[results.length - 1]);
    });
  }

  fetchGitRemoteInfoState (cb) {
    return this.safeFetchProjectGitRemoteInfo((remoteProjectDescriptor) => {
      this.folderState.remoteProjectDescriptor = remoteProjectDescriptor;
      return cb();
    });
  }

  saveProject (saveOptions, done) {
    // Empty folder state since we are going to reload it in here
    this.folderState = {};

    const saveAccumulator = {
      semverVersion: null,
    };

    return async.series([
      (cb) => {
        return this.waitUntilNoFurtherChangesAreAwaitingCommit(cb);
      },

      (cb) => {
        return this.fetchFolderState('save-project', saveOptions, (err) => {
          if (err) {
            return cb(err);
          }
          this.folderState.semverVersion = saveAccumulator.semverVersion;
          this.folderState.saveOptions = saveOptions;
          logger.info('[master-git] pre-save status:', this.folderState);
          return cb();
        });
      },

      (cb) => {
        return this.safeFetchProjectGitRemoteInfo((remoteProjectDescriptor) => {
          this.folderState.remoteProjectDescriptor = remoteProjectDescriptor;
          return cb();
        });
      },

      (cb) => {
        logger.info('[master-git] project save: preparing action sequence');

        if (!(this._projectInfo.projectName && this.folderState.remoteProjectDescriptor)) {
          return cb(new Error('[master-git] unable to save project'));
        }

        const setupSteps = [
          'ensureBranch',
          'ensureLocalRemote',
          'pullRemote',
        ];

        const teardownSteps = [
          'commitEverything',
          'makeTag',
          'saveSnapshot',
        ];

        const actionSequence = [];
        if (this.folderState.doesGitHaveChanges) {
          actionSequence.push('commitEverything', ...setupSteps, 'conflictResetOrContinue', ...teardownSteps);
        } else {
          actionSequence.push(...setupSteps, ...teardownSteps);
        }

        logger.info('[master-git] project save: action sequence:', actionSequence);
        return this.runActionSequence(actionSequence, saveOptions, cb);
      },
    ], (err) => {
      if (err) {
        logger.info('[master-git] project save: completed initial sequence');
        done(err);
        return;
      }

      // If we have conflicts, we can't proceed to the share step, so return early.
      // Conflicts aren't returned as an error because the frontend expects them as part of the response payload.
      if (this.folderState.didHaveConflicts) {
        // A fake conflicts object for now
        // #TODO add real thing
        done(null, {conflicts: [1]});
        return;
      }

      // TODO: We really shouldn't need to make the extra API call since the last result returned is the whole snapshot.
      this.getCurrentShareInfo(done);
    });
  }
}
