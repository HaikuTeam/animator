'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = open;
exports.forceOpen = forceOpen;
exports.init = init;
exports.status = status;
exports.hardReset = hardReset;
exports.removeUntrackedFiles = removeUntrackedFiles;
exports.upsertRemote = upsertRemote;
exports.maybeInit = maybeInit;
exports.getIndexLockAgnostic = getIndexLockAgnostic;
exports.writeIndexLockAgnostic = writeIndexLockAgnostic;
exports.destroyIndexLockSync = destroyIndexLockSync;
exports.addPathsToIndex = addPathsToIndex;
exports.addAllPathsToIndex = addAllPathsToIndex;
exports.referenceNameToId = referenceNameToId;
exports.createSignature = createSignature;
exports.buildCommit = buildCommit;
exports.getCurrentBranchName = getCurrentBranchName;
exports.cloneRepo = cloneRepo;
exports.pushToRemote = pushToRemote;
exports.lookupRemote = lookupRemote;
exports.listRemotes = listRemotes;
exports.doesRemoteExist = doesRemoteExist;
exports.getCurrentCommit = getCurrentCommit;
exports.hardResetFromSHA = hardResetFromSHA;
exports.fetchFromRemote = fetchFromRemote;
exports.mergeBranches = mergeBranches;
exports.cleanAllChanges = cleanAllChanges;
exports.buildRemoteOptions = buildRemoteOptions;
exports.rebaseBranches = rebaseBranches;
exports.getCommitHistoryForFile = getCommitHistoryForFile;
exports.getMasterCommitHistory = getMasterCommitHistory;
exports.mergeBranchesWithoutBase = mergeBranchesWithoutBase;
exports.createTag = createTag;
exports.pushTagToRemote = pushTagToRemote;
exports.listTags = listTags;
exports.commitProject = commitProject;
exports.fetchProject = fetchProject;
exports.pushProject = pushProject;
exports.combineHistories = combineHistories;
exports.mergeProject = mergeProject;
exports.logStatuses = logStatuses;
exports.statusToText = statusToText;
exports.saveStrategyToFileFavorName = saveStrategyToFileFavorName;

var _nodegit = require('nodegit');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_COMMITTER_EMAIL = 'contact@haiku.ai';
var DEFAULT_COMMITTER_NAME = 'Haiku Plumbing';
var FORCE_PUSH_REFSPEC_PREFIX = '+';
var DEFAULT_GIT_USERNAME = 'Haiku-Plumbing';
var DEFAULT_GIT_EMAIL = 'contact@haiku.ai';
var DEFAULT_GIT_COMMIT_MESSAGE = 'Edited project with Haiku Desktop';

function globalExceptionCatcher(exception) {
  _LoggerInstance2.default.error(exception);
  throw exception;
}

// Multiton for caching already-opened repos
var REPOS = {};
var LOCKED_INDEXES = {};
var INDEX_LOCK_INTERVAL = 0;

function _gimmeIndex(pwd, cb) {
  if (!LOCKED_INDEXES[pwd]) {
    LOCKED_INDEXES[pwd] = true;
    return cb(function () {
      LOCKED_INDEXES[pwd] = false;
    });
  }
  return setTimeout(function () {
    return _gimmeIndex(pwd, cb);
  }, INDEX_LOCK_INTERVAL);
}

function open(pwd, cb) {
  if (REPOS[pwd]) {
    return cb(null, REPOS[pwd]);
  }
  return forceOpen(pwd, function (err, repository) {
    if (err) return cb(err);
    if (repository) {
      REPOS[pwd] = repository;
    }
    return cb(null, REPOS[pwd]);
  });
}

function forceOpen(pwd, cb) {
  return _nodegit.Repository.open(pwd).then(function (repository) {
    return cb(null, repository);
  }, cb).catch(globalExceptionCatcher);
}

function init(pwd, cb) {
  var isBare = 0; // false! We want to create the .git folder _in_ the folder
  return _nodegit.Repository.init(pwd, isBare).then(function (repository) {
    return cb(null, repository);
  }, cb);
}

function status(pwd, opts, cb) {
  return _gimmeIndex(pwd, function (freeIndex) {
    function done(err, out) {
      freeIndex();
      return cb(err, out);
    }

    return open(pwd, function (err, repository) {
      if (err) return done(err);
      // return repository.refreshIndex().then((index) => {}, done) // Might need this?
      var diffOptions = {
        flags: _nodegit.Diff.OPTION.SHOW_UNTRACKED_CONTENT | _nodegit.Diff.OPTION.RECURSE_UNTRACKED_DIRS
      };
      return _nodegit.Diff.indexToWorkdir(repository, null, diffOptions).then(function (diff) {
        var changes = {};
        for (var i = 0; i < diff.numDeltas(); i++) {
          var delta = diff.getDelta(i);
          var oldPath = delta.oldFile().path();
          var newPath = delta.newFile().path();
          var statusPath = oldPath || newPath;
          changes[statusPath] = {
            delta: i,
            prev: oldPath,
            path: statusPath,
            num: delta.status()
          };
        }
        return done(null, changes);
      }, done);
    });
  });
}

// The repository.getStatus call would hang when called too many times in parallel,
// regardless of attempting to cache the repository object, so we swapped this for
// the algorithm above.
// export function status (pwd, opts, cb) {
//   return open(pwd, (err, repository) => {
//     if (err) return cb(err)
//     return repository.getStatus().then((statuses) => {
//       return cb(null, statuses)
//     })
//   })
// }

function hardReset(pwd, targetRef, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return referenceNameToId(pwd, targetRef, function (err, id) {
      if (err) return cb(err);
      return repository.getCommit(id.toString()).then(function (commit) {
        return _nodegit.Reset.reset(repository, commit, _nodegit.Reset.TYPE.HARD).then(function () {
          return cb(null, repository, commit);
        }, cb);
      }, cb);
    });
  });
}

function removeUntrackedFiles(pwd, cb) {
  return status(pwd, function (err, statusesDict) {
    if (err) return cb(err);
    if (Object.keys(statusesDict).length < 1) return cb();
    return _async2.default.each(statusesDict, function (statusItem, next) {
      var abspath = _path2.default.join(pwd, statusItem.path);
      return _haikuFsExtra2.default.remove(abspath, function (err) {
        if (err) return next(err);
        return next();
      });
    }, function (err) {
      if (err) return cb(err);
      return cb();
    });
  });
}

function upsertRemote(pwd, name, url, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Remote.list(repository).then(function (remotes) {
      var found = findExistingRemote(remotes, name);
      if (found) return cb(null, found);
      return _nodegit.Remote.create(repository, name, url).then(function (remote) {
        return cb(null, remote);
      }, cb);
    }, cb);
  });
}

function findExistingRemote(remotes, name) {
  if (remotes.length < 1) return null;
  var found = null;
  remotes.forEach(function (remote) {
    if (typeof remote === 'string' && remote === name) found = remote;else if (remote.name && remote.name() === name) found = remote;
  });
  return found;
}

function maybeInit(pwd, cb) {
  return open(pwd, function (err, repository) {
    if (err && err.message.match(/Could not find repository/)) return init(pwd, cb);
    if (err) return cb(err);
    return cb(null, repository, true); // <~ true == wasAlreadyInitialized
  });
}

function getIndexLockAgnostic(pwd, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return repository.index().then(function (index) {
      return cb(null, index);
    }, cb);
  });
}

function writeIndexLockAgnostic(index, pwd, cb) {
  return index.write().then(function () {
    return index.writeTree().then(function (oid) {
      return cb(null, oid);
    }, cb);
  }, cb);
}

// HACK: This assumes we are only running one thread against this repo
function destroyIndexLockSync(pwd) {
  var lockPath = _path2.default.join(pwd, '.git', 'index.lock');
  delete LOCKED_INDEXES[pwd]; // Remove the in-memory mutex too in case one is hanging around
  try {
    if (_haikuFsExtra2.default.existsSync(lockPath)) {
      _haikuFsExtra2.default.removeSync(lockPath);
    }
  } catch (exception) {
    _LoggerInstance2.default.info('[git]', exception);
  }
}

function addPathsToIndex(pwd) {
  var relpaths = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var cb = arguments[2];

  if (relpaths.length < 1) return cb(new Error('Empty paths list given'));
  return _gimmeIndex(pwd, function (freeIndex) {
    function done(err, out) {
      freeIndex();
      return cb(err, out);
    }

    return getIndexLockAgnostic(pwd, function (err, index) {
      if (err) return done(err);
      return _async2.default.eachSeries(relpaths, function (relpath, next) {
        return index.addByPath(relpath).then(function () {
          return next();
        }, next);
      }, function (err) {
        if (err) return done(err);
        return writeIndexLockAgnostic(index, pwd, done);
      });
    });
  });
}

function addAllPathsToIndex(pwd, cb) {
  return _gimmeIndex(pwd, function (freeIndex) {
    function done(err, out) {
      freeIndex();
      return cb(err, out);
    }

    return getIndexLockAgnostic(pwd, function (err, index) {
      if (err) return done(err);
      return index.addAll('.').then(function () {
        return writeIndexLockAgnostic(index, pwd, done);
      }, done);
    });
  });
}

function referenceNameToId(pwd, name, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    _LoggerInstance2.default.info('[git] getting id for reference name', name);
    return _nodegit.Reference.nameToId(repository, name).then(function (id) {
      _LoggerInstance2.default.info('[git] reference name', name, 'resolved to', id && id.toString());
      return cb(null, id);
    }, function (err) {
      _LoggerInstance2.default.info('[git]', err);
      return cb(err);
    });
  });
}

function createSignature(name, email) {
  var time = ~~(Date.now() / 1000);
  var tzoffset = 0; // minutes
  return _nodegit.Signature.create(name, email, time, tzoffset);
}

function buildCommit(pwd, username, email, message, oid, updateRef, parentRef, cb) {
  var author = createSignature(username || DEFAULT_COMMITTER_NAME, email || DEFAULT_COMMITTER_EMAIL);
  var committer = createSignature(DEFAULT_COMMITTER_NAME, DEFAULT_COMMITTER_EMAIL);
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    // If no parent, assume first commit
    if (!parentRef) {
      return repository.createCommit(updateRef, author, committer, message, oid, []).then(function (commitId) {
        return cb(null, commitId);
      }, cb);
    } else {
      // Otherwise grab the parent id and use it
      return referenceNameToId(pwd, parentRef, function (err, parentId) {
        if (err) return cb(err);
        return repository.createCommit(updateRef, author, committer, message, oid, [parentId]).then(function (commitId) {
          return cb(null, commitId);
        }, cb);
      });
    }
  });
}

function getRepositoryHeadReference(pwd, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return repository.head().then(function (reference) {
      return cb(null, reference, reference.type(), repository);
    }, cb);
  });
}

function getCurrentBranchName(pwd, cb) {
  return getRepositoryHeadReference(pwd, function (err, reference, type, repository) {
    if (err) return cb(err);
    if (!reference.isBranch()) return cb(new Error('Head reference is not a branch'));
    var full = reference.name();
    var partial = full.replace('refs/heads/', '');
    return cb(null, partial, full, reference, repository);
  });
}

function cloneRepo(gitRemoteUrl, gitRemoteUsername, gitRemotePassword, abspath, cb) {
  return _nodegit.Clone.clone(gitRemoteUrl, abspath, { fetchOpts: buildRemoteOptions(gitRemoteUsername, gitRemotePassword) }).then(function (repository) {
    return cb(null, repository, abspath);
  }, cb);
}

function pushToRemote(pwd, remoteName, fullBranchName, gitRemoteUsername, gitRemotePassword, doForcePush, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    var refSpecs = ['' + (doForcePush ? FORCE_PUSH_REFSPEC_PREFIX : '') + fullBranchName + ':' + fullBranchName];
    return _nodegit.Remote.list(repository).then(function (remotes) {
      var found = findExistingRemote(remotes, remoteName);
      if (!found) return cb(new Error('Remote with name \'' + remoteName + '\' not found'));
      return _nodegit.Remote.lookup(repository, remoteName).then(function (remote) {
        return fixRemoteHttpsUrl(repository, remote, gitRemoteUsername, gitRemotePassword, function (err) {
          if (err) return cb(err);
          var remoteOptions = buildRemoteOptions(gitRemoteUsername, gitRemotePassword);
          _LoggerInstance2.default.info('[git] pushing content to remote', refSpecs, remoteOptions);
          return remote.push(refSpecs, remoteOptions).then(function () {
            return cb();
          }, function (err) {
            _LoggerInstance2.default.info('[git] error pushing content to remote', err.stack);
            return cb(err);
          });
        });
      }, cb);
    }, cb);
  });
}

function lookupRemote(pwd, remoteName, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Remote.lookup(repository, remoteName).then(function (remote) {
      return cb(null, remote);
    }, cb);
  });
}

function listRemotes(pwd, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Remote.list(repository).then(function (remotes) {
      return cb(null, remotes);
    }, cb);
  });
}

function fixRemoteHttpsUrl(repository, remote, username, password, cb) {
  var url = remote.url();
  var name = remote.name();
  var matches = url.match(/^(https?)/);
  var scheme = matches && matches[1];
  _LoggerInstance2.default.info('[git] remote info:', url, name, scheme);
  //
  // HACK? It might be necessary in some cases to fix the remote URL to include HTTPS creds?
  // We haven't needed this because we are using the certificateCheck credentials function
  // to provide the credentials, but I'm leaving the code here, just in case it comes up somehow.
  //
  // if (!scheme) return cb() // This is not https
  // // TODO: Replace the creds in the URL with new creds?
  // if (url.indexOf('@') !== -1) return cb() // Creds are already present
  // const fixed = url.replace(`${scheme}://`, `${scheme}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@`)
  // const result = Remote.setUrl(repository, name, fixed)
  //
  return cb();
}

function doesRemoteExist(pwd, remoteName, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Remote.list(repository).then(function (remotes) {
      var found = findExistingRemote(remotes, remoteName);
      return cb(null, !!found);
    }, cb);
  });
}

function getCurrentCommit(pwd, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return repository.getHeadCommit().then(function (commit) {
      return cb(null, commit.sha(), commit, repository);
    }, cb);
  });
}

function hardResetFromSHA(pwd, sha, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Commit.lookup(repository, sha).then(function (commit) {
      return _nodegit.Reset.reset(repository, commit, _nodegit.Reset.TYPE.HARD).then(function () {
        return cb();
      }, cb);
    }, cb);
  });
}

function fetchFromRemote(pwd, remoteName, gitRemoteUsername, gitRemotePassword, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Remote.lookup(repository, remoteName).then(function (remote) {
      var fetchOpts = buildRemoteOptions(gitRemoteUsername, gitRemotePassword);

      // Need to set this otherwise the fetch won't also download tags.
      // Without tags, we can't detect what the next tag to bump to is
      fetchOpts.downloadTags = 3;

      _LoggerInstance2.default.info('[git] fetching remote', remoteName, fetchOpts);
      _LoggerInstance2.default.info('[git] remote info:', remote.name(), remote.url());

      return repository.fetch(remote, fetchOpts).then(function () {
        return cb();
      }, cb);
    }, cb);
  });
}

function mergeBranches(pwd, branchNameOurs, branchNameTheirs, fileFavorName, doFindRenames, cb) {
  _LoggerInstance2.default.info('[git] merging branches from', branchNameTheirs, 'to', branchNameOurs);

  return open(pwd, function (err, repository) {
    if (err) return cb(err);

    fileFavorName = fileFavorName && fileFavorName.toUpperCase() || 'NORMAL';
    _LoggerInstance2.default.info('[git] merge file favor:', fileFavorName);
    _LoggerInstance2.default.info('[git] merge finding renames?:', doFindRenames);

    // See libgit2 for info: https://github.com/libgit2/libgit2/blob/master/include/git2/merge.h
    var mergeOptions = {
      fileFavor: _nodegit.Merge.FILE_FAVOR[fileFavorName],
      fileFlags: _nodegit.Merge.FILE_FLAG.FILE_DEFAULT,
      flags: doFindRenames ? _nodegit.Merge.FLAG.FIND_RENAMES : void 0
    };

    _LoggerInstance2.default.info('[git] merge using options:', mergeOptions);

    return repository.mergeBranches(branchNameOurs, branchNameTheirs, null, _nodegit.Merge.PREFERENCE.NONE, mergeOptions).then(function (result) {
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
        _LoggerInstance2.default.info('[git] merge conflict index (as index)', result);
        return cb(null, true, result, result);
      }

      return cb(new Error('Branch merge got unexpected result'), result, result);
    }, function (err) {
      // Upon a merge conflict, nodegit might return the index _as_ an error object. :-(  (The index is the index of conflicts.)
      if (err && err.constructor && err.constructor.name === 'Index') {
        _LoggerInstance2.default.info('[git] merge conflict index (as error)', err);
        return cb(null, true, err, err);
      }

      return cb(err);
    });
  });
}

function cleanAllChanges(pwd, cb) {
  return hardReset(pwd, 'HEAD', function (err, repository, commit) {
    if (err) return cb(err);
    return removeUntrackedFiles(pwd, cb);
  });
}

function buildRemoteOptions(gitRemoteUsername, gitRemotePassword) {
  if (!gitRemoteUsername) throw new Error('Remote username required for credentials');
  if (!gitRemotePassword) throw new Error('Remote password required for credentials');
  return {
    callbacks: {
      certificateCheck: function certificateCheck() {
        return 1;
      },
      credentials: function credentials(url) {
        // return NodeGit.Cred.sshKeyFromAgent(username)
        return _nodegit.Cred.userpassPlaintextNew(gitRemoteUsername, gitRemotePassword);
      }
    }
  };
}

function rebaseBranches(folder, upstreamName, branchName, ontoStr, cb) {
  return open(folder, function (err, repository) {
    if (err) return cb(err);
    return repository.rebaseBranches(branchName, upstreamName, ontoStr, null).then(function (oid) {
      return cb(null, oid);
    }, cb);
  });
}

function getCommitHistoryForFile(folder, filePath) {
  var maxEntries = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var cb = arguments[3];

  return open(folder, function (err, repository) {
    if (err) return cb(err);
    return repository.getHeadCommit().then(function (headCommit) {
      var walker = repository.createRevWalk();
      walker.push(headCommit.id());
      walker.sorting(_nodegit.RevWalk.SORT.TIME);
      return walker.fileHistoryWalk(filePath, maxEntries).then(function (historyCommits) {
        return cb(null, historyCommits);
      }, cb);
    }, cb);
  });
}

function getMasterCommitHistory(folder, cb) {
  return open(folder, function (err, repository) {
    if (err) return cb(err);
    return repository.getMasterCommit().then(function (firstCommit) {
      var history = firstCommit.history(_nodegit.RevWalk.SORT.TIME);
      history.on('end', function (commits) {
        return cb(null, commits);
      });
      history.on('error', function (error) {
        return cb(error);
      });
      history.start();
      return history;
    }, cb);
  });
}

function mergeBranchesWithoutBase(folder, toName, fromName, signature, mergePreference, fileFavorName, cb) {
  _LoggerInstance2.default.info('[git] merging branches (without base) from', fromName, 'to', toName);

  return _gimmeIndex(folder, function (freeIndex) {
    function done(err, out) {
      freeIndex();
      return cb(err, out);
    }

    return open(folder, function (err, repository) {
      if (err) return done(err);
      if (!mergePreference) mergePreference = _nodegit.Merge.PREFERENCE.NONE;
      if (!signature) signature = signature || repository.defaultSignature();

      fileFavorName = fileFavorName && fileFavorName.toUpperCase() || 'NORMAL';
      _LoggerInstance2.default.info('[git] merge (without base) file favor:', fileFavorName);

      // See libgit2 for info: https://github.com/libgit2/libgit2/blob/master/include/git2/merge.h
      var mergeOptions = {
        fileFavor: _nodegit.Merge.FILE_FAVOR[fileFavorName],
        fileFlags: _nodegit.Merge.FILE_FLAG.FILE_DEFAULT
      };

      return repository.getBranch(toName).then(function (toBranch) {
        return repository.getBranch(fromName).then(function (fromBranch) {
          return repository.getBranchCommit(toBranch).then(function (toCommit) {
            return repository.getBranchCommit(fromBranch).then(function (fromCommit) {
              var toCommitOid = toCommit.toString();
              var fromCommitOid = fromCommit.toString();
              return _nodegit.Reference.lookup(repository, 'HEAD').then(function (headRef) {
                return headRef.resolve().then(function (headRef) {
                  var updateHead = !!headRef && headRef.name() === toBranch.name();

                  _LoggerInstance2.default.info('[git] merge using options:', mergeOptions);

                  return _nodegit.Merge.commits(repository, toCommitOid, fromCommitOid, mergeOptions).then(function (index) {
                    if (index.hasConflicts()) return done(null, true, index);
                    return index.writeTreeTo(repository).then(function (oid) {
                      var commitMessage = 'Merged ' + fromBranch.shorthand() + ' into ' + toBranch.shorthand();
                      return repository.createCommit(toBranch.name(), signature, signature, commitMessage, oid, [toCommitOid, fromCommitOid]).then(function (mergeCommit) {
                        if (!updateHead) return done(null, false, mergeCommit.toString());
                        // Make sure head is updated so index isn't messed up
                        return repository.getBranch(toName).then(function (toBranch) {
                          return repository.getBranchCommit(toBranch).then(function (branchCommit) {
                            return branchCommit.getTree().then(function (toBranchTree) {
                              return _nodegit.Checkout.tree(repository, toBranchTree, {
                                checkoutStrategy: _nodegit.Checkout.STRATEGY.SAFE | _nodegit.Checkout.STRATEGY.RECREATE_MISSING
                              }).then(function () {
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

function createTag(pwd, tagNameProbablySemver, commitId, tagMessage, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return repository.createTag(commitId.toString(), tagNameProbablySemver, tagMessage).then(function (tagOid) {
      return cb(null, tagOid);
    }, cb);
  });
}

// Git.pushTagToRemote(state.folder, state.projectName, state.semverVersion, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb)
function pushTagToRemote(pwd, remoteName, tagName, gitRemoteUsername, gitRemotePassword, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Remote.list(repository).then(function (remotes) {
      var found = findExistingRemote(remotes, remoteName);
      if (!found) return cb(new Error('Remote with name \'' + remoteName + '\' not found'));
      return _nodegit.Remote.lookup(repository, remoteName).then(function (remote) {
        return fixRemoteHttpsUrl(repository, remote, gitRemoteUsername, gitRemotePassword, function (err) {
          if (err) return cb(err);
          var refSpecs = ['refs/tags/' + tagName];
          var remoteOptions = buildRemoteOptions(gitRemoteUsername, gitRemotePassword);
          _LoggerInstance2.default.info('[git] pushing tags to remote', refSpecs, remoteOptions);
          return remote.push(refSpecs, remoteOptions).then(function () {
            return cb();
          }, function (err) {
            _LoggerInstance2.default.info('[git] error pushing tags to remote', err.stack);
            return cb(err);
          });
        });
      }, cb);
    }, cb);
  });
}

function listTags(pwd, cb) {
  return open(pwd, function (err, repository) {
    if (err) return cb(err);
    return _nodegit.Tag.list(repository).then(function (tags) {
      return repository.getReferences(_nodegit.Reference.TYPE.OID).then(function (refs) {
        refs.forEach(function (ref) {
          if (ref.isTag()) tags.push(ref.name());
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
 **/
function commitProject(folder, username, useHeadAsParent) {
  var saveOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var pathsToAdd = arguments[4];
  var cb = arguments[5];

  // Depending on the 'pathsToAdd' given, either add specific paths to the index, or commit them all
  // Supported paths:
  // '.'
  // 'foo/bar'
  // ['foo/bar', 'baz/qux', ...]
  function pathAdder(done) {
    if (pathsToAdd === '.') {
      _LoggerInstance2.default.info('[git] adding all paths to index');
      return addAllPathsToIndex(folder, done);
    } else if (typeof pathsToAdd === 'string') {
      _LoggerInstance2.default.info('[git] adding path ' + pathsToAdd + ' to index');
      return addPathsToIndex(folder, [pathsToAdd], done);
    } else if (Array.isArray(pathsToAdd) && pathsToAdd.length > 0) {
      _LoggerInstance2.default.info('[git] adding paths ' + pathsToAdd.join(', ') + ' to index');
      return addPathsToIndex(folder, pathsToAdd, done);
    } else {
      _LoggerInstance2.default.info('[git] no path given');
      return done();
    }
  }

  return pathAdder(function (err, oid) {
    if (err) return cb(err);

    if (!oid) {
      _LoggerInstance2.default.info('[git] blank oid so cannot commit');
      // return cb()
    }

    var user = username || DEFAULT_GIT_USERNAME;
    var email = username || DEFAULT_GIT_EMAIL;
    var message = saveOptions && saveOptions.commitMessage || DEFAULT_GIT_COMMIT_MESSAGE;

    var parentRef = useHeadAsParent ? 'HEAD' : null; // Initial commit might not want us to specify a nonexistent ref
    var updateRef = 'HEAD';

    _LoggerInstance2.default.info('[git] committing ' + JSON.stringify(message) + ' in ' + folder + ' [' + updateRef + ' onto ' + parentRef + '] ...');

    return buildCommit(folder, user, email, message, oid, updateRef, parentRef, function (err, commitId) {
      if (err) return cb(err);

      _LoggerInstance2.default.info('[git] commit done (' + commitId.toString() + ')');

      return cb(null, commitId);
    });
  });
}

function fetchProject(folder, projectName, projectGitRemoteUrl, gitRemoteUsername, gitRemotePassword, cb) {
  return upsertRemote(folder, projectName, projectGitRemoteUrl, function (err, remote) {
    if (err) return cb(err);

    _LoggerInstance2.default.info('[git] fetching ' + projectName + ' from remote ' + projectGitRemoteUrl);

    return fetchFromRemote(folder, projectName, gitRemoteUsername, gitRemotePassword, function (err) {
      if (err) return cb(err);
      _LoggerInstance2.default.info('[git] fetch done');
      return cb();
    });
  });
}

function pushProject(folder, projectName, projectGitRemoteUrl, gitRemoteUsername, gitRemotePassword, cb) {
  return getCurrentBranchName(folder, function (err, partialBranchName, fullBranchName) {
    if (err) return cb(err);

    _LoggerInstance2.default.info('[git] pushing ' + fullBranchName + ' to remote (' + projectName + ') ' + projectGitRemoteUrl);

    var doForcePush = true;

    return pushToRemote(folder, projectName, fullBranchName, gitRemoteUsername, gitRemotePassword, doForcePush, function (err) {
      if (err) return cb(err);
      _LoggerInstance2.default.info('[git] push done');
      return cb();
    });
  });
}

function combineHistories(folder, projectName, ourBranchName, theirBranchName) {
  var saveOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var cb = arguments[5];

  var fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy);

  return mergeBranchesWithoutBase(folder, ourBranchName, theirBranchName, null, null, fileFavorName, function (err, didHaveConflicts, shaOrIndex) {
    if (err) return cb(err);
    return cb(null, didHaveConflicts, shaOrIndex);
  });
}

function mergeProject(folder, projectName, partialBranchName) {
  var saveOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var cb = arguments[4];

  var remoteBranchRefName = 'remotes/' + projectName + '/' + partialBranchName;
  var fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy);

  // #IDUNNO: For some reason when this is set to `true` (in turn resulting in mergeOptions.flags getting set to 1),
  // merging with a merge strategy of OURS/THEIRS ends up with conflicts (which should never happen with OURS/THEIRS).
  // Since I don't initially see any problem with just setting it to `false` for all cases, I'll hardcode it as such.
  // It's possible this is a flaw in Nodegit?
  // If you find a case where this needs to be `true`, please document why below this comment.
  var doFindRenames = false;

  _LoggerInstance2.default.info('[git] merging \'' + remoteBranchRefName + '\' into \'' + partialBranchName + '\' via \'' + fileFavorName + '\' (' + folder + ')');

  return mergeBranches(folder, partialBranchName, remoteBranchRefName, fileFavorName, doFindRenames, function (err, didHaveConflicts, shaOrIndex) {
    if (!err) {
      return cb(null, didHaveConflicts, shaOrIndex);
    }

    if (err.message && err.message.match(/No merge base found/i)) {
      _LoggerInstance2.default.info('[git] histories lack common ancestor; trying to combine');

      // This should return the same payload as Git.mergeBranches returns
      return combineHistories(folder, projectName, partialBranchName, remoteBranchRefName, saveOptions, cb);
    }

    return cb(err);
  });
}

function logStatuses(statuses) {
  for (var key in statuses) {
    var _status = statuses[key];
    _LoggerInstance2.default.info('[git] git status:' + _status.path + ' ' + statusToText(_status));
  }
}

function statusToText(status) {
  var words = [];
  if (status.num === _nodegit.Diff.DELTA.UNMODIFIED) words.push('UNMODIFIED');
  if (status.num === _nodegit.Diff.DELTA.ADDED) words.push('ADDED');
  if (status.num === _nodegit.Diff.DELTA.DELETED) words.push('DELETED');
  if (status.num === _nodegit.Diff.DELTA.MODIFIED) words.push('MODIFIED');
  if (status.num === _nodegit.Diff.DELTA.RENAMED) words.push('RENAMED');
  if (status.num === _nodegit.Diff.DELTA.COPIED) words.push('COPIED');
  if (status.num === _nodegit.Diff.DELTA.IGNORED) words.push('IGNORED');
  if (status.num === _nodegit.Diff.DELTA.UNTRACKED) words.push('UNTRACKED');
  if (status.num === _nodegit.Diff.DELTA.TYPECHANGE) words.push('TYPECHANGE');
  if (status.num === _nodegit.Diff.DELTA.UNREADABLE) words.push('UNREADABLE');
  if (status.num === _nodegit.Diff.DELTA.CONFLICTED) words.push('CONFLICTED');
  return words.join(' ');
}

function saveStrategyToFileFavorName(saveStrategy) {
  if (!saveStrategy) return 'normal';
  if (!saveStrategy.strategy) return 'normal';
  if (saveStrategy.strategy === 'recursive') return 'normal';
  if (saveStrategy.strategy === 'ours') return 'ours';
  if (saveStrategy.strategy === 'theirs') return 'theirs';
  return 'normal';
}
//# sourceMappingURL=Git.js.map