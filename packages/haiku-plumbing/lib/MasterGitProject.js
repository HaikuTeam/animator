'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _events = require('events');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _isOnline = require('is-online');

var _isOnline2 = _interopRequireDefault(_isOnline);

var _haikuSdkClient = require('haiku-sdk-client');

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

var _Git = require('./Git');

var Git = _interopRequireWildcard(_Git);

var _ProjectFolder = require('./ProjectFolder');

var ProjectFolder = _interopRequireWildcard(_ProjectFolder);

var _Inkstone = require('./Inkstone');

var Inkstone = _interopRequireWildcard(_Inkstone);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PLUMBING_PKG_PATH = _path2.default.join(__dirname, '..');
var PLUMBING_PKG_JSON_PATH = _path2.default.join(PLUMBING_PKG_PATH, 'package.json');
var MAX_SEMVER_TAG_ATTEMPTS = 100;
var AWAIT_COMMIT_INTERVAL = 0;
var MIN_WORKER_INTERVAL = 32;
var MAX_WORKER_INTERVAL = 32 * 20;
var MAX_CLONE_ATTEMPTS = 5;
var CLONE_RETRY_DELAY = 5000;
var CLONE_INIT_DELAY = 5000;
var DEFAULT_BRANCH_NAME = 'master'; // "'master' process" has nothing to do with this :/
var BASELINE_SEMVER_TAG = '0.0.0';
var COMMIT_SUFFIX = '(via Haiku Desktop)';

function _checkIsOnline(cb) {
  return (0, _isOnline2.default)().then(function (answer) {
    return cb(answer);
  });
}

function _isCommitTypeRequest(_ref) {
  var type = _ref.type;

  return type === 'commit';
}

var MasterGitProject = function (_EventEmitter) {
  _inherits(MasterGitProject, _EventEmitter);

  function MasterGitProject(folder) {
    _classCallCheck(this, MasterGitProject);

    var _this = _possibleConstructorReturn(this, (MasterGitProject.__proto__ || Object.getPrototypeOf(MasterGitProject)).call(this));

    _this.folder = folder;

    if (!_this.folder) {
      throw new Error('[master-git] MasterGitProject cannot launch without a folder defined');
    }

    // Is a git commit currently in the midst of taking place
    _this._isCommitting = false;

    // List of all actions that can be undone via git
    _this._gitUndoables = [];
    _this._gitRedoables = [];
    _this._requestQueue = [];
    _this._requestWorkerStopped = false;
    _this._workerInterval = MIN_WORKER_INTERVAL;
    _this._requestsWorker = _this._requestsWorker.bind(_this); // Save object allocs
    _this._requestsWorker();

    // Dictionary mapping SHA strings to share payloads, used for caching
    _this._shareInfoPayloads = {};

    // Snapshot of the current folder state as of the last fetchFolderState run
    _this._folderState = {};

    // Project info used extensively in the internal machinery, populated later
    _this._projectInfo = {
      // projectName,
      // haikuUsername,
      // haikuPassword,
      // branchName,
    };
    return _this;
  }

  _createClass(MasterGitProject, [{
    key: '_upWorkerInterval',
    value: function _upWorkerInterval() {
      if (this._workerInterval < MAX_WORKER_INTERVAL) {
        this._workerInterval += 16;
      }
    }
  }, {
    key: '_downWorkerInterval',
    value: function _downWorkerInterval() {
      if (this._workerInterval > MIN_WORKER_INTERVAL) {
        this._workerInterval -= 16;
      }
    }
  }, {
    key: '_requestsWorker',
    value: function _requestsWorker() {
      var _this2 = this;

      if (this._requestWorkerStopped) return void 0;
      var requestInfo = this._requestQueue.shift();
      if (requestInfo) {
        // If we have work, start going faster
        // this._downWorkerInterval()
        var type = requestInfo.type,
            options = requestInfo.options,
            cb = requestInfo.cb;

        var finish = function finish(err, out) {
          // Put at the bottom of the event loop
          setTimeout(_this2._requestsWorker);
          return cb(err, out);
        };
        if (type === 'undo') this.undoActual(options, finish);else if (type === 'redo') this.redoActual(options, finish);else if (type === 'commit') this.commitActual(options, finish);
      } else {
        // If we have nothing to do, start backing off
        // this._upWorkerInterval()
        setTimeout(this._requestsWorker, this._workerInterval);
      }
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      this._requestWorkerStopped = true;
    }
  }, {
    key: 'restart',
    value: function restart(projectInfo) {
      this._isCommitting = false;
      this._gitUndoables.splice(0);
      this._gitRedoables.splice(0);

      if (projectInfo) {
        this._projectInfo.projectName = projectInfo.projectName;
        this._projectInfo.haikuUsername = projectInfo.haikuUsername;
        this._projectInfo.haikuPassword = projectInfo.haikuPassword;
        this._projectInfo.branchName = projectInfo.branchName;
      }
    }
  }, {
    key: 'getGitUndoablesUptoBase',
    value: function getGitUndoablesUptoBase() {
      var undoablesToReturn = [];
      var didFindBaseUndoable = false;
      this._gitUndoables.forEach(function (undoable) {
        if (undoable.isBase) {
          didFindBaseUndoable = true;
        }
        if (didFindBaseUndoable) {
          undoablesToReturn.push(undoable);
        }
      });
      return undoablesToReturn;
    }
  }, {
    key: 'getGitRedoablesUptoBase',
    value: function getGitRedoablesUptoBase() {
      var redoablesToReturn = [];
      this._gitRedoables.forEach(function (redoable) {
        redoablesToReturn.push(redoable);
      });
      return redoablesToReturn;
    }

    /**
     * internal machinery
     * ==================
     */

  }, {
    key: 'runActionSequence',
    value: function runActionSequence(seq, projectOptions, cb) {
      var _this3 = this;

      if (!seq || seq.length < 1) {
        return cb();
      }

      return _async2.default.eachSeries(seq, function (method, next) {
        return _this3.fetchFolderState('action-sequence=' + method, projectOptions, function (err) {
          if (err) return next(err);
          _LoggerInstance2.default.info('[master-git] running action sequence entry', method);
          // Assume that any 'action sequence' method only receives a callback as an argument
          return _this3[method](next);
        });
      }, function (err) {
        if (err) return cb(err);
        // Recipients of this response also depend on the folderState being up to date
        return _this3.fetchFolderState('action-sequence=done', projectOptions, cb);
      });
    }
  }, {
    key: 'isCommittingProject',
    value: function isCommittingProject() {
      return this._isCommitting;
    }
  }, {
    key: 'getFolderState',
    value: function getFolderState() {
      return this._folderState;
    }
  }, {
    key: 'fetchFolderState',
    value: function fetchFolderState(who, projectOptions, cb) {
      var _this4 = this;

      _LoggerInstance2.default.info('[master-git] fetching folder state (' + who + ')');

      var previousState = _lodash2.default.clone(this._folderState);

      if (projectOptions) {
        this._folderState.projectOptions = projectOptions;

        if (projectOptions.organizationName) {
          this._folderState.organizationName = projectOptions.organizationName;
        }
      }

      return _async2.default.series([function (cb) {
        return _this4.safeHasAnyHeadCommitForCurrentBranch(function (hasHeadCommit) {
          _this4._folderState.hasHeadCommit = hasHeadCommit;
          return cb();
        });
      }, function (cb) {
        return Git.referenceNameToId(_this4.folder, 'HEAD', function (_err, headCommitId) {
          _this4._folderState.headCommitId = headCommitId;
          return cb();
        });
      }, function (cb) {
        return _this4.safeFetchProjectGitRemoteInfo(function (remoteProjectDescriptor) {
          _this4._folderState.remoteProjectDescriptor = remoteProjectDescriptor;
          _this4._folderState.isCodeCommitReady = !!(_this4._projectInfo.projectName && remoteProjectDescriptor);
          return cb();
        });
      }, function (cb) {
        return _this4.safeListLocallyDeclaredRemotes(function (gitRemotesList) {
          _this4._folderState.gitRemotesList = gitRemotesList;
          return cb();
        });
      }, function (cb) {
        return _checkIsOnline(function (isOnline) {
          _this4._folderState.isOnline = isOnline;
          return cb();
        });
      }, function (cb) {
        return _this4.safeGitStatus({ log: false }, function (gitStatuses) {
          _this4._folderState.doesGitHaveChanges = !!(gitStatuses && Object.keys(gitStatuses).length > 0);
          _this4._folderState.isGitInitialized = _haikuFsExtra2.default.existsSync(_path2.default.join(_this4.folder, '.git'));
          return cb();
        });
      }, function (cb) {
        _this4._folderState.folderEntries = _haikuFsExtra2.default.readdirSync(_this4.folder);
        _this4._folderState.folder = _this4.folder;
        _this4._folderState.projectName = _this4._projectInfo.projectName;
        _this4._folderState.branchName = _this4._projectInfo.branchName;
        _this4._folderState.haikuUsername = _this4._projectInfo.haikuUsername;
        _this4._folderState.haikuPassword = _this4._projectInfo.haikuPassword;
        _this4._folderState.gitUndoables = _this4._gitUndoables;
        _this4._folderState.gitRedoables = _this4._gitRedoables;
        return cb();
      }, function (cb) {
        var packageJsonExists = _haikuFsExtra2.default.existsSync(_path2.default.join(_this4.folder, 'package.json'));
        if (!packageJsonExists) return cb();
        var packageJsonObj = _haikuFsExtra2.default.readJsonSync(_path2.default.join(_this4.folder, 'package.json'), { throws: false });
        if (!packageJsonObj) return cb();
        _this4._folderState.semverVersion = packageJsonObj.version;
        _this4._folderState.playerVersion = packageJsonObj.dependencies && packageJsonObj.dependencies['@haiku/player'];
        return cb();
      }], function (err) {
        if (err) return cb(err);
        _LoggerInstance2.default.info('[master-git] folder state fetch (' + who + ') done');
        return cb(null, _this4._folderState, previousState);
      });
    }
  }, {
    key: 'safeListLocallyDeclaredRemotes',
    value: function safeListLocallyDeclaredRemotes(cb) {
      return Git.listRemotes(this.folder, function (err, remotes) {
        // Note that in case of error we return the error object
        // This is a legacy implementation; I'm not sure why #TODO
        if (err) return cb(null, err);
        return cb(remotes);
      });
    }
  }, {
    key: 'safeFetchProjectGitRemoteInfo',
    value: function safeFetchProjectGitRemoteInfo(cb) {
      var _this5 = this;

      if (!this._projectInfo.projectName) {
        return cb(null);
      }

      var authToken = _haikuSdkClient.client.config.getAuthToken();

      return Inkstone.project.getByName(authToken, this._projectInfo.projectName, function (err, projectAndCredentials, httpResp) {
        // Note the inversion of the typical error-first continuation
        // This is a legacy implementation; I'm not sure why #TODO
        if (err) return cb(null, err);

        if (!httpResp) {
          return cb(null, new Error('No HTTP response'));
        }
        if (httpResp.statusCode === 404) {
          return cb(null, new Error('Got 404 status code'));
        }
        if (!projectAndCredentials.Project) {
          return cb(null, new Error('No project returned'));
        }

        return cb({ // eslint-disable-line
          projectName: _this5._projectInfo.projectName,
          GitRemoteUrl: projectAndCredentials.Project.GitRemoteUrl,
          CodeCommitHttpsUsername: projectAndCredentials.Credentials.CodeCommitHttpsUsername,
          CodeCommitHttpsPassword: projectAndCredentials.Credentials.CodeCommitHttpsPassword
        });
      });
    }
  }, {
    key: 'safeHasAnyHeadCommitForCurrentBranch',
    value: function safeHasAnyHeadCommitForCurrentBranch(cb) {
      if (!this._projectInfo.branchName) {
        // Note the inversion of the typical error-first continuation
        // This is a legacy implementation; I'm not sure why #TODO
        return cb(false); // eslint-disable-line
      }

      var refPath = _path2.default.join(this.folder, '.git', 'refs', 'heads', this._projectInfo.branchName);

      return _haikuFsExtra2.default.exists(refPath, function (answer) {
        return cb(!!answer); // eslint-disable-line
      });
    }
  }, {
    key: 'getPendingCommitRequests',
    value: function getPendingCommitRequests() {
      return this._requestQueue.filter(_isCommitTypeRequest);
    }
  }, {
    key: 'hasAnyPendingCommits',
    value: function hasAnyPendingCommits() {
      return this.getPendingCommitRequests().length > 0;
    }
  }, {
    key: 'waitUntilNoFurtherChangesAreAwaitingCommit',
    value: function waitUntilNoFurtherChangesAreAwaitingCommit(cb) {
      var _this6 = this;

      if (!this.hasAnyPendingCommits()) {
        return cb();
      }

      return setTimeout(function () {
        return _this6.waitUntilNoFurtherChangesAreAwaitingCommit(cb);
      }, AWAIT_COMMIT_INTERVAL);
    }

    /**
     * action sequence methods
     * =======================
     */

  }, {
    key: 'bumpSemverAppropriately',
    value: function bumpSemverAppropriately(cb) {
      var _this7 = this;

      _LoggerInstance2.default.info('[master-git] trying to bump semver appropriately');

      return Git.listTags(this.folder, function (err, tags) {
        if (err) return cb(err);

        var cleanTags = tags.map(function (dirtyTag) {
          // Clean v0.1.2 and refs/head/v0.1.2 to just 0.1.2
          return dirtyTag.split('/').pop().replace(/^v/, '');
        });

        _LoggerInstance2.default.info('[master-git] tags found:', cleanTags.join(','));

        // 1. Figure out which is the largest semver tag among
        //    - git tags
        //    - the max version
        var maxTag = BASELINE_SEMVER_TAG;

        cleanTags.forEach(function (cleanTag) {
          if (_semver2.default.gt(cleanTag, maxTag)) {
            maxTag = cleanTag;
          }
        });

        var pkgTag = _haikuFsExtra2.default.readJsonSync(_path2.default.join(_this7.folder, 'package.json')).version;
        if (_semver2.default.gt(pkgTag, maxTag)) {
          maxTag = pkgTag;
        }

        _LoggerInstance2.default.info('[master-git] max git tag found is', maxTag);

        // 2. Bump this tag to the next version, higher than anything we have locally
        var nextTag = _semver2.default.inc(maxTag, 'patch');

        _LoggerInstance2.default.info('[master-git] next tag to set is', nextTag);

        // 3. Set the package.json number to the new version
        return ProjectFolder.semverBumpPackageJson(_this7.folder, nextTag, function (err) {
          if (err) return cb(err);

          _LoggerInstance2.default.info('[master-git] bumped package.json semver to ' + nextTag);

          // The main master process and component need to handle this too since the
          // bytecode contains the version which we use to render in the right-click menu
          _this7.emit('semver-bumped', nextTag, function () {
            return cb(null, nextTag);
          });
        });
      });
    }
  }, {
    key: 'makeTag',
    value: function makeTag(cb) {
      var _this8 = this;

      _LoggerInstance2.default.info('[master-git] git tagging: ' + this._folderState.semverVersion + ' (commit: ' + this._folderState.commitId + ')');

      if (!this._folderState.semverTagAttempts) {
        this._folderState.semverTagAttempts = 0;
      }

      this._folderState.semverTagAttempts += 1;

      if (this._folderState.semverTagAttempts > MAX_SEMVER_TAG_ATTEMPTS) {
        return cb(new Error('Failed to make semver tag even after many attempts'));
      }

      return Git.createTag(this.folder, this._folderState.semverVersion, this._folderState.commitId, this._folderState.semverVersion, function (err) {
        if (err) {
          // If the tag already exists, we can try to correct the situation by bumping the semver until we find a good tag.
          if (err.message && err.message.match(/Tag already exists/i)) {
            _LoggerInstance2.default.info('[master-git] git tag ' + _this8._folderState.semverVersion + ' already exists; trying to bump it');

            return _this8.bumpSemverAppropriately(function (err, incTag) {
              if (err) return cb(err);

              _this8._folderState.semverVersion = incTag;

              // Recursively go into this sequence again, hopefully eventually finding a good tag to use
              // If we try this too many times and fail (see above), we will quit the process
              return _this8.makeTag(cb);
            });
          }

          return cb(err);
        }

        return cb();
      });
    }
  }, {
    key: 'retryCloudSaveSetup',
    value: function retryCloudSaveSetup(cb) {
      var _this9 = this;

      _LoggerInstance2.default.info('[master-git] retrying remote ref setup to see if we can cloud save after all');

      return this.ensureAllRemotes(function (err) {
        if (err) {
          return _this9.cloudSaveDisabled(cb);
        }

        return _this9.fetchFolderState('cloud-setup', {}, function (err) {
          if (err) {
            return _this9.cloudSaveDisabled(cb);
          }

          if (!_this9._folderState.isGitInitialized) {
            return _this9.cloudSaveDisabled(cb);
          }

          return cb();
        });
      });
    }
  }, {
    key: 'pushToRemote',
    value: function pushToRemote(cb) {
      var _this10 = this;

      if (this._folderState.saveOptions && this._folderState.saveOptions.dontPush) {
        _LoggerInstance2.default.info('[master-git] skipping push to remote, per your saveOptions flag');
        return cb(); // Hack: Allow consumer to skip push (e.g. for testing)
      }

      if (this._folderState.wasResetPerformed) return cb(); // Kinda hacky to put this here...

      var _folderState$remotePr = this._folderState.remoteProjectDescriptor,
          GitRemoteUrl = _folderState$remotePr.GitRemoteUrl,
          CodeCommitHttpsUsername = _folderState$remotePr.CodeCommitHttpsUsername,
          CodeCommitHttpsPassword = _folderState$remotePr.CodeCommitHttpsPassword;


      return Git.pushProject(this.folder, this._folderState.projectName, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, function (err) {
        if (err) return cb(err);
        return _this10.pushTag(GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb);
      });
    }
  }, {
    key: 'initializeGit',
    value: function initializeGit(cb) {
      return Git.maybeInit(this.folder, cb);
    }
  }, {
    key: 'moveContentsToTemp',
    value: function moveContentsToTemp(cb) {
      var _this11 = this;

      _LoggerInstance2.default.info('[master-git] moving folder contents to temp dir (if any)');

      return _tmp2.default.dir({ unsafeCleanup: true }, function (err, tmpDir, tmpDirCleanupFn) {
        if (err) return cb(err);

        _this11._folderState.tmpDir = tmpDir;

        _LoggerInstance2.default.info('[master-git] temp dir is', _this11._folderState.tmpDir);

        _this11._folderState.tmpDirCleanupFn = tmpDirCleanupFn;

        // Whether or not we had entries, we still need the temp folder created at this point otherwise
        // methods downstream will complain
        if (_this11._folderState.folderEntries.length < 1) {
          _LoggerInstance2.default.info('[master-git] folder had no initial content; skipping temp folder step');

          return cb();
        }

        _LoggerInstance2.default.info('[master-git] copying contents from', _this11.folder, 'to temp dir', _this11._folderState.tmpDir);

        return _haikuFsExtra2.default.copy(_this11.folder, _this11._folderState.tmpDir, function (err) {
          if (err) return cb(err);

          _LoggerInstance2.default.info('[master-git] emptying original dir', _this11.folder);

          // Folder must be empty for a Git clone to take place
          return _haikuFsExtra2.default.emptyDir(_this11.folder, function (err) {
            if (err) return cb(err);
            return cb();
          });
        });
      });
    }

    // Before the first time we clone, add an artificial timer that waits a couple
    // of seconds before attempting. Basically, give the cloud a chance to set things
    // up *before* we immediately call clone, that way we don't call it prematurely
    // and then have to wait an additional 10 seconds before trying again

  }, {
    key: 'hackyInitialDelayBeforeFirstCloneAttempt',
    value: function hackyInitialDelayBeforeFirstCloneAttempt(cb) {
      _LoggerInstance2.default.info('[master-git] waiting before first clone attempt');
      return setTimeout(cb, CLONE_INIT_DELAY);
    }
  }, {
    key: 'cloneRemoteIntoFolder',
    value: function cloneRemoteIntoFolder(cb) {
      var _this12 = this;

      if (!this._folderState.cloneAttempts) {
        this._folderState.cloneAttempts = 0;
      }

      this._folderState.cloneAttempts++;

      var _folderState$remotePr2 = this._folderState.remoteProjectDescriptor,
          GitRemoteUrl = _folderState$remotePr2.GitRemoteUrl,
          CodeCommitHttpsUsername = _folderState$remotePr2.CodeCommitHttpsUsername,
          CodeCommitHttpsPassword = _folderState$remotePr2.CodeCommitHttpsPassword;


      _LoggerInstance2.default.info('[master-git] cloning from remote ' + GitRemoteUrl + ' (attempt ' + this._folderState.cloneAttempts + ')');

      return Git.cloneRepo(GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, this.folder, function (err) {
        if (err) {
          _LoggerInstance2.default.info('[master-git] clone error:', err);

          if (_this12._folderState.cloneAttempts < MAX_CLONE_ATTEMPTS) {
            _LoggerInstance2.default.info('[master-git] retrying clone after a brief delay...');

            return setTimeout(function () {
              return _this12.cloneRemoteIntoFolder(cb);
            }, CLONE_RETRY_DELAY);
          }

          return cb(err);
        }

        _LoggerInstance2.default.info('[master-git] clone complete');

        return _this12.ensureAllRemotes(function (err) {
          if (err) return cb(err);
          return cb();
        });
      });
    }
  }, {
    key: 'ensureAllRemotes',
    value: function ensureAllRemotes(cb) {
      var _this13 = this;

      return this.ensureLocalRemote(function (err) {
        if (err) return cb(err);
        return _this13.ensureRemoteRefs(function (err) {
          if (err) return cb(err);
          return cb();
        });
      });
    }
  }, {
    key: 'ensureLocalRemote',
    value: function ensureLocalRemote(cb) {
      // Object access to .GitRemoteUrl would throw an exception in some cases if we didn't check this
      if (!this._folderState.remoteProjectDescriptor) {
        return cb(new Error('Cannot find remote project descriptor'));
      }
      var GitRemoteUrl = this._folderState.remoteProjectDescriptor.GitRemoteUrl;

      _LoggerInstance2.default.info('[master-git] upserting remote', GitRemoteUrl);
      return Git.upsertRemote(this.folder, this._folderState.projectName, GitRemoteUrl, cb);
    }
  }, {
    key: 'ensureRemoteRefs',
    value: function ensureRemoteRefs(cb) {
      var _this14 = this;

      _LoggerInstance2.default.info('[master-git] remote refs: ensuring');

      return Git.open(this.folder, function (err, repository) {
        if (err) return cb(err);

        _LoggerInstance2.default.info('[master-git] remote refs: setting up base content');

        return _haikuFsExtra2.default.outputFile(_path2.default.join(_this14.folder, 'README.md'), '', function (err) {
          if (err) return cb(err);

          _LoggerInstance2.default.info('[master-git] remote refs: making base commit');

          return Git.addAllPathsToIndex(_this14.folder, function (err, oid) {
            if (err) return cb(err);

            return Git.buildCommit(_this14.folder, _this14._folderState.haikuUsername, null, 'Base commit ' + COMMIT_SUFFIX, oid, null, null, function (err, commitId) {
              if (err) return cb(err);
              var branchName = DEFAULT_BRANCH_NAME;
              var refSpecToPush = 'refs/heads/' + branchName;

              _LoggerInstance2.default.info('[master-git] remote refs: creating branch', branchName);

              return repository.createBranch(branchName, commitId.toString()).then(function () {
                return Git.lookupRemote(_this14.folder, _this14._folderState.projectName, function (err, mainRemote) {
                  if (err) return cb(err);

                  var remoteRefspecs = [refSpecToPush];
                  var remoteCreds = Git.buildRemoteOptions(_this14._folderState.remoteProjectDescriptor.CodeCommitHttpsUsername, _this14._folderState.remoteProjectDescriptor.CodeCommitHttpsPassword);

                  _LoggerInstance2.default.info('[master-git] remote refs: pushing refspecs', remoteRefspecs, 'over https');

                  return mainRemote.push(remoteRefspecs, remoteCreds).then(function () {
                    return cb();
                  }, cb);
                });
              }, function (branchErr) {
                // The remote already exists; there was no need to create it. Go ahead and skip
                if (branchErr.message && branchErr.message.match(/reference with that name already exists/) && branchErr.message.split(refSpecToPush).length > 1) {
                  _LoggerInstance2.default.info('[master-git] remote refs: branch already exists; proceeding');
                  return cb();
                }
                return cb(branchErr);
              });
            });
          });
        });
      });
    }
  }, {
    key: 'copyContentsFromTemp',
    value: function copyContentsFromTemp(cb) {
      var _this15 = this;

      _LoggerInstance2.default.info('[master-git] returning original folder contents (if any)');

      if (this._folderState.folderEntries.length < 1) {
        _LoggerInstance2.default.info('[master-git] no original folder entries present');
        return cb();
      }

      // TODO: Should this return an error or not?
      if (!this._folderState.tmpDir) {
        _LoggerInstance2.default.info('[master-git] no temp dir seems to have been created at', this._folderState.tmpDir);
        return cb();
      }

      _LoggerInstance2.default.info('[master-git] copying contents from', this._folderState.tmpDir, 'back to original folder', this.folder);

      return _haikuFsExtra2.default.copy(this._folderState.tmpDir, this.folder, function (err) {
        if (err) return cb(err);
        _LoggerInstance2.default.info('[master-git] cleaning up temp dir', _this15._folderState.tmpDir);
        _this15._folderState.tmpDirCleanupFn();
        return cb();
      });
    }
  }, {
    key: 'pullRemote',
    value: function pullRemote(cb) {
      var _this16 = this;

      var _folderState$remotePr3 = this._folderState.remoteProjectDescriptor,
          GitRemoteUrl = _folderState$remotePr3.GitRemoteUrl,
          CodeCommitHttpsUsername = _folderState$remotePr3.CodeCommitHttpsUsername,
          CodeCommitHttpsPassword = _folderState$remotePr3.CodeCommitHttpsPassword;


      return Git.fetchProject(this.folder, this._folderState.projectName, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, function (err) {
        if (err) return cb(err);

        return Git.getCurrentBranchName(_this16.folder, function (err, partialBranchName) {
          if (err) return cb(err);
          _LoggerInstance2.default.info('[master-git] current branch is \'' + partialBranchName + '\'');

          return Git.mergeProject(_this16.folder, _this16._folderState.projectName, partialBranchName, _this16._folderState.saveOptions, function (err, didHaveConflicts, shaOrIndex) {
            if (err) return cb(err);

            if (!didHaveConflicts) {
              _LoggerInstance2.default.info('[master-git] merge complete (' + shaOrIndex + ')');
            } else {
              _LoggerInstance2.default.info('[master-git] merge conflicts detected');
            }

            // Just for the sake of logging the current git status
            return _this16.safeGitStatus({ log: true }, function () {
              _this16._folderState.didHaveConflicts = didHaveConflicts;
              _this16._folderState.mergeCommitId = didHaveConflicts ? null : shaOrIndex.toString();
              return cb();
            });
          });
        });
      });
    }
  }, {
    key: 'conflictResetOrContinue',
    value: function conflictResetOrContinue(cb) {
      var _this17 = this;

      // If no conficts, this save is good; ok to push and return
      if (!this._folderState.didHaveConflicts) return cb();

      // If conflicts, do a reset so a second save attempt can go through
      // TODO: Don't clean but leave things as-is for manual intervention
      _LoggerInstance2.default.info('[master-git] cleaning merge conflicts for re-attempt');

      // Only calling this to log whatever the current statuses are
      return this.safeGitStatus({ log: true }, function () {
        return Git.cleanAllChanges(_this17.folder, function (err) {
          if (err) return cb(err);
          return Git.hardResetFromSHA(_this17.folder, _this17._folderState.commitId.toString(), function (err) {
            if (err) return cb(err);
            _this17._folderState.wasResetPerformed = true;
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

  }, {
    key: 'getExistingShareDataIfSaveIsUnnecessary',
    value: function getExistingShareDataIfSaveIsUnnecessary(cb) {
      var _this18 = this;

      return this.fetchFolderState('get-existing-share-data', {}, function () {
        // TODO: We may need to look closely to see if this boolean is set properly.
        // Currently the _getFolderState method just checks to see if there are git statuses,
        // but that might not be correct (although it seemed to be when I initially checked).
        if (_this18._folderState.doesGitHaveChanges) {
          _LoggerInstance2.default.info('[master-git] looks like git has changes; must do full save');
          return cb(null, false); // falsy == you gotta save
        }

        // Inkstone should return info pretty fast if it has share info, so only wait 2s
        return _this18.getCurrentShareInfo(2000, function (err, shareInfo) {
          // Rather than treat the error as an error, assume it indicates that we need
          // to do a full publish. For example, we don't want to "error" if this is just a network timeout.
          // #FIXME?
          if (err) {
            _LoggerInstance2.default.info('[master-git] share info was error-ish; must do full save');
            return cb(null, false); // falsy == you gotta save
          }

          // Not sure why this would be null, but just in case...
          if (!shareInfo) {
            _LoggerInstance2.default.info('[master-git] share info was blank; must do full save');
            return cb(null, false); // falsy == you gotta save
          }

          // If we go this far, we already have a save for our current SHA, and can skip the expensive stuff
          _LoggerInstance2.default.info('[master-git] share info found! no need to save');
          return cb(null, shareInfo);
        });
      });
    }
  }, {
    key: 'cloudSaveDisabled',
    value: function cloudSaveDisabled(cb) {
      var error = new Error('Project was saved locally, but could not sync to Haiku Cloud');
      error.code = 1;
      return cb(error);
    }

    /**
     * methods
     * =======
     */

  }, {
    key: 'getHaikuPlayerLibVersion',
    value: function getHaikuPlayerLibVersion() {
      if (!_haikuFsExtra2.default.existsSync(PLUMBING_PKG_JSON_PATH)) return null;
      var obj = _haikuFsExtra2.default.readJsonSync(PLUMBING_PKG_JSON_PATH, { throws: false });
      return obj && obj.version;
    }
  }, {
    key: 'getCurrentShareInfo',
    value: function getCurrentShareInfo(timeout, cb) {
      return Inkstone.getCurrentShareInfo(this.folder, this._shareInfoPayloads, this._folderState, timeout, cb);
    }
  }, {
    key: 'pushTag',
    value: function pushTag(GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb) {
      _LoggerInstance2.default.info('[master-git] pushing tag ' + this._folderState.semverVersion + ' to remote (' + this._folderState.projectName + ') ' + GitRemoteUrl);
      return Git.pushTagToRemote(this.folder, this._folderState.projectName, this._folderState.semverVersion, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb);
    }
  }, {
    key: 'undo',
    value: function undo(undoOptions, cb) {
      this._requestQueue.push({
        type: 'undo',
        options: undoOptions,
        cb: cb
      });
    }
  }, {
    key: 'redo',
    value: function redo(redoOptions, cb) {
      this._requestQueue.push({
        type: 'redo',
        options: redoOptions,
        cb: cb
      });
    }
  }, {
    key: 'undoActual',
    value: function undoActual(undoOptions, done) {
      var _this19 = this;

      _LoggerInstance2.default.info('[master-git] undo beginning');

      // We can't undo if there isn't a target ref yet to go back to; skip if so
      if (this._gitUndoables.length < 2) {
        _LoggerInstance2.default.info('[master-git] nothing to undo');
        return done();
      }

      _LoggerInstance2.default.info('[master-git] undo proceeding');

      // The most recent item is the one we are going to undo...
      var validUndoables = this.getGitUndoablesUptoBase();
      var undone = validUndoables.pop();

      _LoggerInstance2.default.info('[master-git] git undo commit ' + undone.commitId.toString());

      // To undo, we go back to the commit _prior to_ the most recent one
      var target = validUndoables[validUndoables.length - 1];

      _LoggerInstance2.default.info('[master-git] git undo resetting to commit ' + target.commitId.toString());

      return Git.hardResetFromSHA(this.folder, target.commitId.toString(), function (err) {
        if (err) {
          _LoggerInstance2.default.info('[master-git] git undo failed', err);
          return done(err);
        }

        _LoggerInstance2.default.info('[master-git] undo done');

        // The most recent undone thing becomes an action we can now undo.
        // Only do the actual stack-pop here once we know we have succeeded.
        _this19._gitRedoables.push(_this19._gitUndoables.pop());

        return done();
      });
    }
  }, {
    key: 'redoActual',
    value: function redoActual(redoOptions, done) {
      var _this20 = this;

      var redoable = this._gitRedoables.pop();

      // If nothing to redo, consider this a noop
      if (!redoable) return done();

      _LoggerInstance2.default.info('[master-git] git redo commit ' + redoable.commitId.toString());

      return Git.hardResetFromSHA(this.folder, redoable.commitId.toString(), function (err) {
        if (err) {
          _LoggerInstance2.default.info('[master-git] git redo failed');
          _this20._gitRedoables.push(redoable); // If error, put the 'undone' thing back on the stack since we didn't succeed
          return done(err);
        }

        _this20._gitUndoables.push(redoable);

        return done();
      });
    }
  }, {
    key: 'setUndoBaselineIfHeadCommitExists',
    value: function setUndoBaselineIfHeadCommitExists(cb) {
      var _this21 = this;

      return this.fetchFolderState('undo-baseline', {}, function () {
        // We need a base commit to act as the commit to return to if the user has done 'undo' to the limit of the stack
        if (_this21._folderState.headCommitId) {
          if (_this21._gitUndoables.length < 1) {
            _LoggerInstance2.default.info('[master-git] base commit for session is ' + _this21._folderState.headCommitId.toString());
            _this21._gitUndoables.push({
              commitId: _this21._folderState.headCommitId,
              message: 'Base commit for session',
              isBase: true
            });
          }
        }
        return cb();
      });
    }
  }, {
    key: 'safeGitStatus',
    value: function safeGitStatus(options, cb) {
      return Git.status(this.folder, options || {}, function (err, statuses) {
        if (options && options.log) {
          if (statuses) {
            Git.logStatuses(statuses);
          } else if (err) {
            _LoggerInstance2.default.info('[master-git] git status error:', err);
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
  }, {
    key: 'statusForFile',
    value: function statusForFile(relpath, cb) {
      return this.safeGitStatus({ log: false, relpath: relpath }, function (gitStatuses) {
        var foundStatus = void 0;

        if (gitStatuses) {
          for (var key in gitStatuses) {
            if (foundStatus) {
              continue;
            }

            var gitStatus = gitStatuses[key];

            if (_path2.default.normalize(gitStatus.path) === _path2.default.normalize(relpath)) {
              foundStatus = gitStatus;
            }
          }
        }

        return cb(null, foundStatus);
      });
    }
  }, {
    key: 'commitFileIfChanged',
    value: function commitFileIfChanged(relpath, message, cb) {
      var _this22 = this;

      // The call to status is sync, so we add this hook in case pending commits may alter the status
      return this.waitUntilNoFurtherChangesAreAwaitingCommit(function () {
        return _this22.statusForFile(relpath, function (err, status) {
          if (err) return cb(err);
          if (!status) return cb(); // No status means no changes
          // 0 is UNMODIFIED, everything else is a change
          // See http://www.nodegit.org/api/diff/#getDelta
          if (status.num && status.num > 0) {
            return _this22.commit(relpath, message, cb);
          } else {
            return cb();
          }
        });
      });
    }
  }, {
    key: 'commitProjectIfChanged',
    value: function commitProjectIfChanged(message, cb) {
      var _this23 = this;

      // The call to status is sync, so we add this hook in case pending commits may alter the status
      return this.waitUntilNoFurtherChangesAreAwaitingCommit(function () {
        return _this23.safeGitStatus({ log: true }, function (gitStatuses) {
          var doesGitHaveChanges = gitStatuses && Object.keys(gitStatuses).length > 0;
          if (doesGitHaveChanges) {
            // Don't add garbage/empty commits if nothing changed
            return _this23.commit('.', message, cb);
          }
          return cb();
        });
      });
    }

    // Note: This is an action sequence method, only takes a cb as an arg.

  }, {
    key: 'commitEverything',
    value: function commitEverything(cb) {
      return this.commit('.', 'Project changes', cb);
    }
  }, {
    key: 'commit',
    value: function commit(addable, message, cb) {
      this._requestQueue.push({
        type: 'commit',
        options: { addable: addable, message: message },
        cb: cb
      });
    }
  }, {
    key: 'commitActual',
    value: function commitActual(commitOptions, cb) {
      var _this24 = this;

      var message = commitOptions.message,
          addable = commitOptions.addable;


      var finalOptions = {};
      finalOptions.commitMessage = message + ' ' + COMMIT_SUFFIX;

      return this.fetchFolderState('commit-project', {}, function () {
        return Git.commitProject(_this24.folder, _this24._folderState.haikuUsername, _this24._folderState.hasHeadCommit, finalOptions, addable, function (err, commitId) {
          if (err) {
            return cb(err);
          }

          _this24._folderState.commitId = commitId;

          // HACK: If for some reason we never got a 'base' undoable before this point, set this cmomit as
          // the new base so that there are always commits from a base commit going forward
          var isBase = false;

          var baseUndoable = _this24._gitUndoables.filter(function (undoable) {
            return undoable && undoable.isBase;
          })[0];

          if (!baseUndoable) {
            isBase = true;
          }

          _LoggerInstance2.default.info('[master-git] commit ' + commitId.toString() + ' is undoable (as base: ' + isBase + ')');

          // For now, pretty much any commit we capture in this session is considered an undoable. We may want to
          // circle back and restrict it to only certain types of commits, but that does end up making the undo/redo
          // stack logic a bit more complicated.
          _this24._gitUndoables.push({ commitId: commitId, isBase: isBase, message: message });

          return cb(null, commitId);
        });
      });
    }
  }, {
    key: 'initializeProject',
    value: function initializeProject(initOptions, done) {
      var _this25 = this;

      // Empty folder state since we are going to reload it in here
      this._folderState = {};

      return _async2.default.series([function (cb) {
        return _this25.fetchFolderState('initialize-folder', initOptions, function (err) {
          if (err) return cb(err);
          _LoggerInstance2.default.info('[master-git] folder initialization status:', _this25._folderState);
          return cb();
        });
      }, function (cb) {
        var _folderState = _this25._folderState,
            isGitInitialized = _folderState.isGitInitialized,
            doesGitHaveChanges = _folderState.doesGitHaveChanges,
            isCodeCommitReady = _folderState.isCodeCommitReady;

        // Based on the above statuses, assemble a sequence of actions to take.

        var actionSequence = [];

        if (!isGitInitialized && !isCodeCommitReady) {
          actionSequence = ['initializeGit'];
        } else if (!isGitInitialized && isCodeCommitReady) {
          actionSequence = ['moveContentsToTemp', 'hackyInitialDelayBeforeFirstCloneAttempt', 'cloneRemoteIntoFolder', 'copyContentsFromTemp'];
        } else if (isGitInitialized && !isCodeCommitReady) {
          actionSequence = [];
        } else if (isGitInitialized && isCodeCommitReady) {
          if (doesGitHaveChanges) {
            actionSequence = [];
          } else if (!doesGitHaveChanges) {
            actionSequence = ['pullRemote'];
          }
        }

        _LoggerInstance2.default.info('[master-git] action sequence:', actionSequence.map(function (name) {
          return name;
        }));

        return _this25.runActionSequence(actionSequence, initOptions, function (err) {
          if (err) return cb(err);
          return cb();
        });
      }], function (err, results) {
        if (err) return done(err);
        return done(null, results[results.length - 1]);
      });
    }
  }, {
    key: 'saveProject',
    value: function saveProject(saveOptions, done) {
      var _this26 = this;

      // Empty folder state since we are going to reload it in here
      this._folderState = {};

      var saveAccumulator = {
        semverVersion: null
      };

      return _async2.default.series([function (cb) {
        return _this26.waitUntilNoFurtherChangesAreAwaitingCommit(cb);
      }, function (cb) {
        return _this26.fetchFolderState('save-project', saveOptions, function (err) {
          if (err) return cb(err);
          _this26._folderState.semverVersion = saveAccumulator.semverVersion;
          _this26._folderState.saveOptions = saveOptions;
          _LoggerInstance2.default.info('[master-git] pre-save status:', _this26._folderState);
          return cb();
        });
      }, function (cb) {
        _LoggerInstance2.default.info('[master-git] project save: preparing action sequence');

        var _folderState2 = _this26._folderState,
            isGitInitialized = _folderState2.isGitInitialized,
            doesGitHaveChanges = _folderState2.doesGitHaveChanges,
            isCodeCommitReady = _folderState2.isCodeCommitReady;

        // Based on the above statuses, assemble a sequence of actions to take.

        var actionSequence = [];

        if (!isGitInitialized && !isCodeCommitReady) {
          actionSequence = ['initializeGit', 'commitEverything', 'makeTag', 'retryCloudSaveSetup'];
        } else if (!isGitInitialized && isCodeCommitReady) {
          actionSequence = ['moveContentsToTemp', 'cloneRemoteIntoFolder', 'copyContentsFromTemp', 'commitEverything', 'makeTag', 'pushToRemote'];
        } else if (isGitInitialized && !isCodeCommitReady) {
          actionSequence = ['commitEverything', 'makeTag', 'retryCloudSaveSetup'];
        } else if (isGitInitialized && isCodeCommitReady) {
          if (doesGitHaveChanges) {
            actionSequence = ['commitEverything', 'pullRemote', 'conflictResetOrContinue', 'bumpSemverAppropriately', 'commitEverything', 'makeTag', 'pushToRemote'];
          } else if (!doesGitHaveChanges) {
            actionSequence = ['pullRemote', 'bumpSemverAppropriately', 'commitEverything', 'makeTag', 'pushToRemote'];
          }
        }

        _LoggerInstance2.default.info('[master-git] project save: action sequence:', actionSequence.map(function (name) {
          return name;
        }));

        return _this26.runActionSequence(actionSequence, saveOptions, cb);
      }, function (cb) {
        _LoggerInstance2.default.info('[master-git] project save: completed initial sequence');

        // If we have conflicts, we can't proceed to the share step, so return early.
        // Conflicts aren't returned as an error because the frontend expects them as part of the response payload.
        if (_this26._folderState.didHaveConflicts) {
          // A fake conflicts object for now
          // #TODO add real thing
          return cb(null, { conflicts: [1] });
        }

        _LoggerInstance2.default.info('[master-git] project save: fetching current share info');

        // TODO: it may make sense to separate the "get the share link"
        // flow from the "save" flow
        return _this26.getCurrentShareInfo(60000 * 2, cb);
      }], function (err, results) {
        if (err) return done(err);
        return done(null, results[results.length - 1]);
      });
    }
  }]);

  return MasterGitProject;
}(_events.EventEmitter);

exports.default = MasterGitProject;
//# sourceMappingURL=MasterGitProject.js.map