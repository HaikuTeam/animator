/* tslint:disable:no-shadowed-variable only-arrow-functions ter-prefer-arrow-callback max-line-length no-parameter-reassignment */
import {Repository, Reference, Signature, Reset, Remote, Clone, Commit, Merge, RevWalk, Checkout, Tag, Diff} from 'nodegit';
import * as path from 'path';
import * as fs from 'haiku-fs-extra';
import * as async from 'async';
import {Environment} from 'haiku-common/lib/environments';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

const DEFAULT_COMMITTER_EMAIL = 'contact@haiku.ai';
const DEFAULT_COMMITTER_NAME = 'Haiku Plumbing';
const FORCE_PUSH_REFSPEC_PREFIX = '+';
const DEFAULT_GIT_USERNAME = 'Haiku-Plumbing';
const DEFAULT_GIT_EMAIL = 'contact@haiku.ai';
const DEFAULT_GIT_COMMIT_MESSAGE = 'Edited project with Haiku Desktop';

function globalExceptionCatcher (exception) {
  logger.error(exception);
  throw exception;
}

export const globalCallbacks = {};
export const globalPushOpts = {
  callbacks: globalCallbacks,
};
export const globalFetchOpts = {
  downloadTags: 3,
  callbacks: globalCallbacks,
};
export const globalCloneOpts = {
  fetchOpts: globalFetchOpts,
};

if (global.process.env.NODE_ENV !== Environment.Production) {
  // Don't enforce strict SSL in dev mode.
  globalCallbacks.certificateCheck = () => 1;
}

// Multiton for caching already-opened repos
const LOCKED_INDEXES = {};
const INDEX_LOCK_INTERVAL = 0;

function _gimmeIndex (pwd, cb) {
  if (!LOCKED_INDEXES[pwd]) {
    LOCKED_INDEXES[pwd] = true;
    // eslint-disable-next-line
    return cb(() => {
      LOCKED_INDEXES[pwd] = false;
    });
  }
  return setTimeout(() => {
    return _gimmeIndex(pwd, cb);
  }, INDEX_LOCK_INTERVAL);
}

export function open (pwd, cb) {
  return forceOpen(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return cb(null, repository || undefined);
  });
}

export function forceOpen (pwd, cb) {
  return Repository.open(pwd).then((repository) => {
    return cb(null, repository);
  }, cb).catch(globalExceptionCatcher);
}

export function init (pwd, cb) {
  const isBare = 0; // false! We want to create the .git folder _in_ the folder
  return Repository.init(pwd, isBare).then((repository) => {
    return cb(null, repository);
  }, cb);
}

export function status (pwd, opts, cb) {
  return _gimmeIndex(pwd, (freeIndex) => {
    function done (err, out) {
      freeIndex();
      return cb(err, out);
    }

    return open(pwd, (err, repository) => {
      if (err) {
        return done(err);
      }
      // return repository.refreshIndex().then((index) => {}, done) // Might need this?
      const diffOptions = {
        flags: Diff.OPTION.SHOW_UNTRACKED_CONTENT | Diff.OPTION.RECURSE_UNTRACKED_DIRS,
      };
      return Diff.indexToWorkdir(repository, null, diffOptions).then((diff) => {
        const changes = {};
        for (let i = 0; i < diff.numDeltas(); i++) {
          const delta = diff.getDelta(i);
          const oldPath = delta.oldFile().path();
          const newPath = delta.newFile().path();
          const statusPath = oldPath || newPath;
          changes[statusPath] = {
            delta: i,
            prev: oldPath,
            path: statusPath,
            num: delta.status(),
          };
        }
        return done(null, changes);
      }, done);
    });
  });
}

export function hardReset (pwd, targetRef, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return referenceNameToId(pwd, targetRef, (err, id) => {
      if (err) {
        return cb(err);
      }
      return repository.getCommit(id.toString()).then((commit) => {
        return Reset.reset(repository, commit, Reset.TYPE.HARD).then(() => {
          return cb(null, repository, commit);
        }, cb);
      }, cb);
    });
  });
}

export function upsertRemoteDirectly (pwd, name, url, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Remote.list(repository).then(function (remotes) {
      const found = findExistingRemote(remotes, name);
      if (found) {
        // In case we have a project folder that was initially set up with Code Commit, ensure the remote URLs are
        // correct.
        return Remote.lookup(repository, name).then((remote) => {
          if (remote.url() !== url) {
            Remote.setUrl(repository, name, url);
          }
          if (remote.pushurl() !== url) {
            Remote.setPushurl(repository, name, url);
          }
          return cb(null, found);
        });
      }
      return Remote.create(repository, name, url).then((remote) => {
        return cb(null, remote);
      }, cb);
    }, cb);
  });
}

function findExistingRemote (remotes, name) {
  if (remotes.length < 1) {
    return null;
  }
  let found = null;
  remotes.forEach((remote) => {
    if (typeof remote === 'string' && remote === name) {
      found = remote;
    } else if (remote.name && remote.name() === name) {
      found = remote;
    }
  });
  return found;
}

export function maybeInit (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err && /could not find repository/i.test(err.message)) {
      return init(pwd, cb);
    }
    if (err) {
      return cb(err);
    }
    return cb(null, repository, true); // <~ true == wasAlreadyInitialized
  });
}

export function getIndexLockAgnostic (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return repository.index().then((index) => {
      return cb(null, index);
    }, cb);
  });
}

export function writeIndexLockAgnostic (index, pwd, cb) {
  return index.write().then(() => {
    return index.writeTree().then((oid) => {
      return cb(null, oid);
    }, cb);
  }, cb);
}

// HACK: This assumes we are only running one thread against this repo
export function destroyIndexLockSync (pwd) {
  const lockPath = path.join(pwd, '.git', 'index.lock');
  delete LOCKED_INDEXES[pwd]; // Remove the in-memory mutex too in case one is hanging around
  try {
    if (fs.existsSync(lockPath)) {
      fs.removeSync(lockPath);
    }
  } catch (exception) {
    logger.info('[git]', exception);
  }
}

export function addPathsToIndex (pwd, relpaths = [], cb) {
  if (relpaths.length < 1) {
    return cb(new Error('Empty paths list given'));
  }
  return _gimmeIndex(pwd, (freeIndex) => {
    function done (err, out) {
      freeIndex();
      return cb(err, out);
    }

    return getIndexLockAgnostic(pwd, (err, index) => {
      if (err) {
        return done(err);
      }
      return async.eachSeries(relpaths, (relpath, next) => {
        return index.addByPath(relpath).then(() => {
          return next();
        }, next);
      }, (err) => {
        if (err) {
          return done(err);
        }
        return writeIndexLockAgnostic(index, pwd, done);
      });
    });
  });
}

export function addAllPathsToIndex (pwd, cb) {
  return _gimmeIndex(pwd, (freeIndex) => {
    function done (err, out) {
      freeIndex();
      return cb(err, out);
    }

    return getIndexLockAgnostic(pwd, (err, index) => {
      if (err) {
        return done(err);
      }
      return index.addAll('.').then(() => {
        return writeIndexLockAgnostic(index, pwd, done);
      }, done);
    });
  });
}

export function referenceNameToId (pwd, name, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Reference.nameToId(repository, name).then((id) => {
      return cb(null, id);
    }, (err) => {
      logger.info('[git]', err);
      return cb(err);
    });
  });
}

export function createSignature (name, email) {
  const time = ~~(Date.now() / 1000);
  const tzoffset = 0; // minutes
  return Signature.create(name, email, time, tzoffset);
}

export function buildCommit (pwd, username, email, message, oid, updateRef, parentRef, cb) {
  const author = createSignature(username || DEFAULT_COMMITTER_NAME, email || DEFAULT_COMMITTER_EMAIL);
  const committer = createSignature(DEFAULT_COMMITTER_NAME, DEFAULT_COMMITTER_EMAIL);

  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }

    // If no parent, assume first commit - the first commit should always use this pathway
    if (!parentRef) {
      return repository.createCommit(updateRef, author, committer, message, oid, []).then((commitId) => {
        return cb(null, commitId);
      }, cb);
    }

    return referenceNameToId(pwd, parentRef, (err, parentId) => {
      if (err) {
        return cb(err);
      }
      return repository.createCommit(updateRef, author, committer, message, oid, [parentId]).then((commitId) => {
        return cb(null, commitId);
      }, cb);
    });
  });
}

function getRepositoryHeadReference (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return repository.head().then((reference) => {
      return cb(null, reference, reference.type(), repository);
    }, cb);
  });
}

export function getCurrentBranchName (pwd, cb) {
  return getRepositoryHeadReference(pwd, (err, reference, type, repository) => {
    if (err) {
      return cb(err);
    }
    if (!reference.isBranch()) {
      return cb(new Error('Head reference is not a branch'));
    }
    const full = reference.name();
    const partial = full.replace('refs/heads/', '');
    return cb(null, partial, full, reference, repository);
  });
}

export function cloneRepoDirectly (gitRemoteUrl, abspath, cb) {
  return Clone.clone(gitRemoteUrl, abspath, globalCloneOpts).then((repository) => {
    return cb(null, repository, abspath);
  }, cb);
}

export function pushToRemoteDirectly (pwd, remoteName, fullBranchName, doForcePush, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    const refSpecs = [`${(doForcePush) ? FORCE_PUSH_REFSPEC_PREFIX : ''}${fullBranchName}:${fullBranchName}`];
    return Remote.list(repository).then((remotes) => {
      const found = findExistingRemote(remotes, remoteName);
      if (!found) {
        return cb(new Error(`Remote with name '${remoteName}' not found`));
      }
      return Remote.lookup(repository, remoteName).then((remote) => {
        logger.info('[git] pushing content to remote', refSpecs);
        return remote.push(refSpecs, globalPushOpts).then(() => {
          return cb();
        }, (err) => {
          logger.info('[git] error pushing content to remote', err.stack);
          return cb(err);
        });
      }, cb);
    }, cb);
  });
}

export function lookupRemote (pwd, remoteName, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Remote.lookup(repository, remoteName).then((remote) => {
      return cb(null, remote);
    }, cb);
  });
}

export function listRemotes (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Remote.list(repository).then((remotes) => {
      return cb(null, remotes);
    }, cb);
  });
}

export function doesRemoteExist (pwd, remoteName, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Remote.list(repository).then((remotes) => {
      const found = findExistingRemote(remotes, remoteName);
      return cb(null, !!found);
    }, cb);
  });
}

export function fetchFromRemoteDirectly (pwd, remoteName, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Remote.lookup(repository, remoteName).then((remote) => {
      logger.info('[git] fetching remote', remoteName);
      logger.info('[git] remote info:', remote.name(), remote.url());
      return repository.fetch(remote, globalFetchOpts).then(() => {
        return cb();
      }, cb);
    }, cb);
  });
}

export function mergeBranches (pwd, branchNameOurs, branchNameTheirs, fileFavorName, doFindRenames, cb) {
  logger.info('[git] merging branches from', branchNameTheirs, 'to', branchNameOurs);

  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }

    fileFavorName = (fileFavorName && fileFavorName.toUpperCase()) || 'NORMAL';
    logger.info('[git] merge file favor:', fileFavorName);
    logger.info('[git] merge finding renames?:', doFindRenames);

    // See libgit2 for info: https://github.com/libgit2/libgit2/blob/master/include/git2/merge.h
    const mergeOptions = {
      fileFavor: Merge.FILE_FAVOR[fileFavorName],
      fileFlags: Merge.FILE_FLAG.FILE_DEFAULT,
      flags: (doFindRenames) ? Merge.FLAG.FIND_RENAMES : void (0),
    };

    logger.info('[git] merge using options:', mergeOptions);

    return repository.mergeBranches(branchNameOurs, branchNameTheirs, null, Merge.PREFERENCE.NONE, mergeOptions).then((result) => {
      // If result is an oid string, the commit was successful. (The oid is a commit id.)
      if (result && typeof result === 'string') {
        return cb(null, false, result.toString(), result);
      }

      // If result is an oid object, the commit was successful. (The oid is a commit id.)
      if (result && result.constructor && result.constructor.name === 'Oid') {
        return cb(null, false, result.toString(), result);
      }

      // If the result is an index, there were conflicts. (The index is the index of conflicts.)
      if (result && result.constructor && result.constructor.name === 'Index') {
        logger.info('[git] merge conflict index (as index)', result);
        return cb(null, true, result, result);
      }

      return cb(new Error('Branch merge got unexpected result'), result, result);
    }, (err) => {
      // Upon a merge conflict, nodegit might return the index _as_ an error object. :-(  (The index is the index of conflicts.)
      if (err && err.constructor && err.constructor.name === 'Index') {
        logger.info('[git] merge conflict index (as error)', err);
        return cb(null, true, err, err);
      }

      return cb(err);
    });
  });
}

export function rebaseBranches (folder, upstreamName, branchName, ontoStr, cb) {
  return open(folder, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return repository.rebaseBranches(branchName, upstreamName, ontoStr, null).then((oid) => {
      return cb(null, oid);
    }, cb);
  });
}

export function getCommitHistoryForFile (folder, filePath, maxEntries = 1000, cb) {
  return open(folder, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return repository.getHeadCommit().then((headCommit) => {
      const walker = repository.createRevWalk();
      walker.push(headCommit.id());
      walker.sorting(RevWalk.SORT.TIME);
      return walker.fileHistoryWalk(filePath, maxEntries).then((historyCommits) => {
        return cb(null, historyCommits);
      }, cb);
    }, cb);
  });
}

export function getMasterCommitHistory (folder, cb) {
  return open(folder, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return repository.getMasterCommit().then((firstCommit) => {
      const history = firstCommit.history(RevWalk.SORT.TIME);
      history.on('end', (commits) => cb(null, commits));
      history.on('error', (error) => cb(error));
      history.start();
      return history;
    }, cb);
  });
}

export function mergeBranchesWithoutBase (folder, toName, fromName, signature, mergePreference, fileFavorName, cb) {
  logger.info('[git] merging branches (without base) from', fromName, 'to', toName);

  return _gimmeIndex(folder, (freeIndex) => {
    function done (err, out) {
      freeIndex();
      return cb(err, out);
    }

    return open(folder, (err, repository) => {
      if (err) {
        return done(err);
      }
      if (!mergePreference) {
        mergePreference = Merge.PREFERENCE.NONE;
      }
      if (!signature) {
        signature = signature || repository.defaultSignature();
      }

      fileFavorName = (fileFavorName && fileFavorName.toUpperCase()) || 'NORMAL';
      logger.info('[git] merge (without base) file favor:', fileFavorName);

      // See libgit2 for info: https://github.com/libgit2/libgit2/blob/master/include/git2/merge.h
      const mergeOptions = {
        fileFavor: Merge.FILE_FAVOR[fileFavorName],
        fileFlags: Merge.FILE_FLAG.FILE_DEFAULT,
      };

      return repository.getBranch(toName).then((toBranch) => {
        return repository.getBranch(fromName).then((fromBranch) => {
          return repository.getBranchCommit(toBranch).then((toCommit) => {
            return repository.getBranchCommit(fromBranch).then((fromCommit) => {
              const toCommitOid = toCommit.toString();
              const fromCommitOid = fromCommit.toString();
              return Reference.lookup(repository, 'HEAD').then((headRef) => {
                return headRef.resolve().then((headRef) => {
                  const updateHead = !!headRef && headRef.name() === toBranch.name();

                  logger.info('[git] merge using options:', mergeOptions);

                  return Merge.commits(repository, toCommitOid, fromCommitOid, mergeOptions).then((index) => {
                    if (index.hasConflicts()) {
                      return done(null, true, index);
                    }
                    return index.writeTreeTo(repository).then((oid) => {
                      const commitMessage = `Merged ${fromBranch.shorthand()} into ${toBranch.shorthand()}`;
                      return repository.createCommit(toBranch.name(), signature, signature, commitMessage, oid, [toCommitOid, fromCommitOid]).then((mergeCommit) => {
                        if (!updateHead) {
                          return done(null, false, mergeCommit.toString());
                        }
                        // Make sure head is updated so index isn't messed up
                        return repository.getBranch(toName).then((toBranch) => {
                          return repository.getBranchCommit(toBranch).then((branchCommit) => {
                            return branchCommit.getTree().then((toBranchTree) => {
                              return Checkout.tree(repository, toBranchTree, {
                                checkoutStrategy: Checkout.STRATEGY.SAFE | Checkout.STRATEGY.RECREATE_MISSING,
                              }).then(() => {
                                return done(null, false, mergeCommit.toString());
                              }, done);
                            }, done);
                          }, done);
                        }, done);
                      }, done);
                    }, done);
                  }, done);
                }, done);
              }, done);
            }, done);
          }, done);
        }, done);
      }, done);
    });
  });
}

export function createTag (pwd, tagNameProbablySemver, commitId, tagMessage, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return repository.createTag(commitId.toString(), tagNameProbablySemver, tagMessage).then((tagOid) => {
      return cb(null, tagOid);
    }, cb);
  });
}

export function pushTagToRemoteDirectly (pwd, remoteName, tagName, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Remote.list(repository).then((remotes) => {
      const found = findExistingRemote(remotes, remoteName);
      if (!found) {
        return cb(new Error(`Remote with name '${remoteName}' not found`));
      }
      return Remote.lookup(repository, remoteName).then((remote) => {
        const refSpecs = [`refs/tags/${tagName}`];
        logger.info('[git] pushing tags to remote', refSpecs);
        return remote.push(refSpecs, globalPushOpts).then(() => {
          return cb();
        }, (err) => {
          logger.info('[git] error pushing tags to remote', err.stack);
          return cb(err);
        });
      }, cb);
    }, cb);
  });
}

export function listTags (pwd, cb) {
  return open(pwd, (err, repository) => {
    if (err) {
      return cb(err);
    }
    return Tag.list(repository).then((tags) => {
      return repository.getReferences(Reference.TYPE.OID).then((refs) => {
        refs.forEach(function (ref) {
          if (ref.isTag()) {
            tags.push(ref.name());
          }
        });
        return cb(null, tags);
      }, cb);
    }, cb);
  });
}

/**
 * @function commitProject
 * @param folder {String}
 * @param username {String|Null}
 * @param useHeadAsParent {Beolean}
 * @param saveOptions {Object}
 * @param pathsToAdd {String|Array} - '.' to add all paths, [path, path] to add individual paths
 */
export function commitProject (folder, username, useHeadAsParent, saveOptions = {}, pathsToAdd, cb) {
  // Depending on the 'pathsToAdd' given, either add specific paths to the index, or commit them all
  // Supported paths:
  // '.'
  // 'foo/bar'
  // ['foo/bar', 'baz/qux', ...]
  function pathAdder (done) {
    if (pathsToAdd === '.') {
      logger.info(`[git] adding all paths to index`);
      return addAllPathsToIndex(folder, done);
    }

    if (typeof pathsToAdd === 'string') {
      logger.info(`[git] adding path ${pathsToAdd} to index`);
      return addPathsToIndex(folder, [pathsToAdd], done);
    }

    if (Array.isArray(pathsToAdd) && pathsToAdd.length > 0) {
      logger.info(`[git] adding paths ${pathsToAdd.join(', ')} to index`);
      return addPathsToIndex(folder, pathsToAdd, done);
    }

    logger.info(`[git] no path given`);
    return done();
  }

  return pathAdder((err, oid) => {
    if (err) {
      return cb(err);
    }

    if (!oid) {
      logger.info(`[git] blank oid so cannot commit`);
      // return cb()
    }

    const user = username || DEFAULT_GIT_USERNAME;
    const email = username || DEFAULT_GIT_EMAIL;
    const message = (saveOptions && saveOptions.commitMessage) || DEFAULT_GIT_COMMIT_MESSAGE;

    const parentRef = (useHeadAsParent) ? 'HEAD' : null; // Initial commit might not want us to specify a nonexistent ref
    const updateRef = 'HEAD';

    logger.info(`[git] committing ${JSON.stringify(message)} in ${folder} [${updateRef} onto ${parentRef}] ...`);

    return buildCommit(folder, user, email, message, oid, updateRef, parentRef, (err, commitId) => {
      if (err) {
        return cb(err);
      }

      logger.info(`[git] commit done (${commitId.toString()})`);

      return cb(null, commitId);
    });
  });
}

export function fetchProjectDirectly (folder, projectName, repositoryUrl, cb) {
  return upsertRemoteDirectly(folder, projectName, repositoryUrl, (err) => {
    if (err) {
      return cb(err);
    }

    logger.info(`[git] fetching ${projectName} from remote ${repositoryUrl}`);

    return fetchFromRemoteDirectly(folder, projectName, (err) => {
      if (err) {
        return cb(err);
      }
      logger.info('[git] fetch done');
      return cb();
    });
  });
}

export function pushProjectDirectly (folder, projectName, cb) {
  return getCurrentBranchName(folder, (err, partialBranchName, fullBranchName) => {
    if (err) {
      return cb(err);
    }

    logger.info(`[git] pushing ${fullBranchName} to remote (${projectName})`);

    const doForcePush = true;

    return pushToRemoteDirectly(folder, projectName, fullBranchName, doForcePush, (err) => {
      if (err) {
        return cb(err);
      }
      logger.info('[git] push done');
      return cb();
    });
  });
}

export function combineHistories (folder, projectName, ourBranchName, theirBranchName, saveOptions = {}, cb) {
  const fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy);

  return mergeBranchesWithoutBase(folder, ourBranchName, theirBranchName, null, null, fileFavorName, (err, didHaveConflicts, shaOrIndex) => {
    if (err) {
      return cb(err);
    }
    return cb(null, didHaveConflicts, shaOrIndex);
  });
}

export function getReference (folder, name, cb) {
  return open(folder, (err, repo) => {
    if (err) {
      return cb(err);
    }
    return Reference.nameToId(repo, name).then((oid) => {
      return Reference.lookup(repo, oid).then((ref) => {
        return cb(null, ref);
      }, (err) => {
        if (err) {
          logger.info('[git]', err);
        }
        return cb(null, false);
      });
    }, (err) => {
      if (err) {
        logger.info('[git]', err);
      }
      return cb(null, false);
    });
  });
}

export function getRemoteBranchRefName (projectName, partialBranchName) {
  return `remotes/${projectName}/${partialBranchName}`;
}

export function mergeProject (folder, projectName, partialBranchName, saveOptions = {}, cb) {
  const remoteBranchRefName = getRemoteBranchRefName(projectName, partialBranchName);
  const fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy);

  // #IDUNNO: For some reason when this is set to `true` (in turn resulting in mergeOptions.flags getting set to 1),
  // merging with a merge strategy of OURS/THEIRS ends up with conflicts (which should never happen with OURS/THEIRS).
  // Since I don't initially see any problem with just setting it to `false` for all cases, I'll hardcode it as such.
  // It's possible this is a flaw in Nodegit?
  // If you find a case where this needs to be `true`, please document why below this comment.
  const doFindRenames = false;

  logger.info(`[git] merging '${remoteBranchRefName}' into '${partialBranchName}' via '${fileFavorName}' (${folder})`);

  return mergeBranches(folder, partialBranchName, remoteBranchRefName, fileFavorName, doFindRenames, (err, didHaveConflicts, shaOrIndex) => {
    if (!err) {
      return cb(null, didHaveConflicts, shaOrIndex);
    }

    if (err.message && err.message.match(/No merge base found/i)) {
      logger.info(`[git] histories lack common ancestor; trying to combine`);

      // This should return the same payload as Git.mergeBranches returns
      return combineHistories(folder, projectName, partialBranchName, remoteBranchRefName, saveOptions, cb);
    }

    return cb(err);
  });
}

export function logStatuses (statuses) {
  for (const key in statuses) {
    const status = statuses[key];
    logger.info('[git] git status:' + status.path + ' ' + statusToText(status));
  }
}

export function statusToText (status) {
  const words = [];
  if (status.num === Diff.DELTA.UNMODIFIED) {
    words.push('UNMODIFIED');
  }
  if (status.num === Diff.DELTA.ADDED) {
    words.push('ADDED');
  }
  if (status.num === Diff.DELTA.DELETED) {
    words.push('DELETED');
  }
  if (status.num === Diff.DELTA.MODIFIED) {
    words.push('MODIFIED');
  }
  if (status.num === Diff.DELTA.RENAMED) {
    words.push('RENAMED');
  }
  if (status.num === Diff.DELTA.COPIED) {
    words.push('COPIED');
  }
  if (status.num === Diff.DELTA.IGNORED) {
    words.push('IGNORED');
  }
  if (status.num === Diff.DELTA.UNTRACKED) {
    words.push('UNTRACKED');
  }
  if (status.num === Diff.DELTA.TYPECHANGE) {
    words.push('TYPECHANGE');
  }
  if (status.num === Diff.DELTA.UNREADABLE) {
    words.push('UNREADABLE');
  }
  if (status.num === Diff.DELTA.CONFLICTED) {
    words.push('CONFLICTED');
  }
  return words.join(' ');
}

export function saveStrategyToFileFavorName (saveStrategy) {
  if (!saveStrategy) {
    return 'normal';
  }
  if (!saveStrategy.strategy) {
    return 'normal';
  }
  if (saveStrategy.strategy === 'recursive') {
    return 'normal';
  }
  if (saveStrategy.strategy === 'ours') {
    return 'ours';
  }
  if (saveStrategy.strategy === 'theirs') {
    return 'theirs';
  }
  return 'normal';
}
