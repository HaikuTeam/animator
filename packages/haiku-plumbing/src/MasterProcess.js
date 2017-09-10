import fse from 'haiku-fs-extra'
import path from 'path'
import assign from 'lodash.assign'
import lodash from 'lodash'
import async from 'async'
import tmp from 'tmp'
import checkIsOnline from 'is-online'
import semver from 'semver'
import { inkstone } from 'haiku-sdk-inkstone'
import { client as sdkClient } from 'haiku-sdk-client'
import ActiveComponent from 'haiku-serialization/src/model/ActiveComponent'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import ProcessBase from './ProcessBase'
import * as Git from './Git'
import ProjectConfiguration from './ProjectConfiguration'
import * as Asset from './Asset'
import Watcher from './Watcher'
import * as Sketch from './Sketch'
import PublicErrorCodes from './PublicErrorCodes'
import * as ProjectFolder from './ProjectFolder'

const DEFAULT_GIT_USERNAME = 'Haiku-Plumbing'
const DEFAULT_GIT_EMAIL = 'contact@haiku.ai'
const DEFAULT_GIT_COMMIT_MESSAGE = 'Edit project with Haiku Desktop'

var PLUMBING_PKG_PATH = path.join(__dirname, '..')
var PLUMBING_PKG_JSON_PATH = path.join(PLUMBING_PKG_PATH, 'package.json')

const folder = ProcessBase.HAIKU.folder

if (!folder) throw new Error('MasterProcess cannot launch without a folder defined')

// configure inkstone, useful for testing off of dev (HAIKU_API=https://localhost:8080/)
if (process.env.HAIKU_API) {
  inkstone.setConfig({
    baseUrl: process.env.HAIKU_API
  })
}

const proc = new ProcessBase('master')

proc.socket.on('close', () => {
  throw new Error('[master] Disconnected from host plumbing process')
})

const config = new ProjectConfiguration()

/**
 * === DESIGN MERGE ===
 */

function maybeSendDesignMergeRequest (file, cb) {
  if (proc.socket && proc.socket.isOpen()) {
    logger.info('[master] Merge design requested', file.get('relpath'))
    proc.socket.request({ type: 'action', method: 'mergeDesign', params: [folder, 'Default', 0, file.getAbspath()] }, cb)
  } else {
    return cb()
  }
}

/**
 * === COMPONENT RELOAD ===
 */

function maybeSendComponentReloadRequest (file) {
  if (proc.socket && proc.socket.isOpen()) {
    // If the last time we read from the file system
    // came after the last time we wrote to it,
    // that's a decent indication that the last known change
    // occurred directly on the file system
    // instead of through the in-memory instance
    if (file.get('dtLastReadStart') > (file.get('dtLastWriteStart') + 500 /* pad this difference to make more sure [#RC] */)) {
      logger.info('[master] ### module replacment triggering', file.get('relpath'), file.get('dtLastReadStart'), file.get('dtLastWriteEnd'))

      // This is currently only used to detect whether we are in the midst of reloading so our undo/redo queue
      // can be smarter about whether to activate or not
      PENDING_RELOADS.push(file.get('relpath'))

      proc.socket.send({
        type: 'broadcast',
        name: 'component:reload',
        relpath: file.get('relpath')
      })
    }
  }
}

// Module replacement queue: Since a lot of changes can happen at the same time, we want to avoid accidentally
// triggering a whole bunch of reloads, hence this queue, which has an opportunity to combine them or just
// handle sequential reloads a bit more gracefully.
var moduleModificationsQueue = []
setInterval(() => {
  var moduleMods = moduleModificationsQueue.splice(0)
  if (moduleMods.length < 1) return void (0)

  // Only fire the last one since if we are reloading the component, we will get its dependencies too
  var lastFile = moduleMods[moduleMods.length - 1]
  maybeSendComponentReloadRequest(lastFile)
}, 64)

/**
 * === METHOD HANDLING ===
 */

// LEGACY: I used this method before I understood how to use chokidar's API to exclude certain files.
// NOTE: We might still want chokidar to watch these, but exclude them from our in-memory collection. So maybe this should stay?
function shouldFileWatcherHandlerSubroutineBeSkipped (relpath) {
  if (relpath.match(/~\.sketch/)) return true // Sketch generates these ephemerally
  if (relpath.match(/\.git/)) return true // No git blobs
  if (relpath.match(/\.(standalone|bundle|embed)\./)) return true // Huge bundles are not to ingest
  if (relpath.match(/(index|haiku|react|react-dom|dom|interpreter)\.js$/)) return true // These meta files aren't needed for our purposes
  if (relpath.match(/(README\.md|package\.json)$/i)) return true // These meta files aren't needed for our purposes
  return false
}

function isRelpathSvg (relpath) {
  return path.extname(relpath) === '.svg'
}

// Master might receive methods before it's fully initialized, so we queue them up and call when ready
const methodQueue = []
setInterval(() => {
  if (__ready__) {
    let methods = methodQueue.splice(0)
    methods.forEach(({ message, callback }) => {
      callMethod(message, callback)
    })
  }
}, 64)

proc.socket.on('broadcast', (message) => {
  // If the glass (and only the glass) notifies us that it's done with a module replacement, clear off one such
  // replacement from the queue. We only listen to the glass because it's a good enough heuristic that the replacement
  // has completed in all of the views.
  if (message.name === 'component:reload:complete' && message.from === 'glass') {
    logger.info('[master] glass notified me of component:reload:complete')
    PENDING_RELOADS.shift()
  }
})

proc.on('request', (message, callback) => {
  // We only become '__ready___' after running startProject, so do this always
  if (message.method === 'startProject' || message.method === 'initializeFolder' || message.method === 'masterHeartbeat') {
    callMethod(message, callback)
  } else {
    methodQueue.push({ message, callback })
  }
})

function callMethod (message, callback) {
  if (methods[message.method]) {
    // masterHeartbeat happens often so don't log it
    if (message.method !== 'masterHeartbeat') {
      logger.info('[master]', 'calling', message.method, message.params)
    }
    return methods[message.method](message, callback)
  }
  // Note that some master methods are defined only _after_ startProject runs!
  return callback(new Error(`[master] No such method ${message.method}`))
}

let watcher
let File
let activeComponent
let __ready__ = false
let IS_SAVING = false
let IS_COMMITTING = false
let PENDING_RELOADS = []
const GIT_UNDOABLES = []
const GIT_REDOABLES = []
const GIT_UNDO_REQUESTS = []
const GIT_REDO_REQUESTS = []
const COMMITABLE_CHANGE_LIST = []
const payloadForFrontend = { project: {} }

const methods = {
  masterHeartbeat: ({ params }, done) => {
    return done(null, {
      isReady: __ready__,
      folder: folder,
      isSaving: IS_SAVING,
      isCommitting: IS_COMMITTING,
      websocketReadyState: proc.socket.wsc.readyState,
      gitUndoables: _getGitUndoablesUptoBase(),
      gitRedoables: GIT_REDOABLES
    })
  },

  startProject: (message, done) => {
    logger.info(`[master] start project: ${folder}`)

    // Remove anything pending we have in the queues to avoid any mistaken reloads that may still be pending
    // in case the project was reloaded during a single session.
    moduleModificationsQueue.splice(0)

    // Start up the undo/redo queues
    _gitUndoQueue()
    _gitRedoQueue()

    // On the off chance somebody refreshed in the midst of one of these, set them back to their original values, so we
    // don't end up with some kind of weird locking issue
    IS_COMMITTING = false
    IS_SAVING = false

    return async.series([
      // Load the user's configuration defined in haiku.js (sort of LEGACY)
      function (cb) {
        logger.info(`[master] start project: loading configuration for ${folder}`)
        return config.load(folder, (err) => {
          if (err) return done(err)

          // Gotta make this available after we load the config, but before anything else, since the
          // done callback happens immediately if we've already initialized this master process once.
          payloadForFrontend.projectName = config.get('config.name')

          return cb()
        })
      },
      // Initialize the ActiveComponent and file models
      function (cb) {
        if (File) return cb() // No need to reinitialize if already in memory

        logger.info(`[master] start project: creating active component`)

        activeComponent = new ActiveComponent({
          alias: 'master',
          folder: folder,
          userconfig: config.get('config'),
          websocket: {/* websocket */},
          platform: {/* window */},
          envoy: ProcessBase.HAIKU.envoy,
          file: {
            doShallowWorkOnly: false, // Must override the in-memory-only defaults
            skipDiffLogging: false // Must override the in-memory-only defaults
          }
        })

        // This is required so that a hostInstance is loaded which is required for certain value calculations
        activeComponent.mountApplication()
        activeComponent.on('component:mounted', () => {
          // The ActiveComponent instance bootstraps a file model that we want to use;
          // the ActiveComponent's internal initialization sets things up in the right way for updates,
          // even if we aren't necessarily going to use it together.
          File = activeComponent.FileModel
          // Since we aren't running in the DOM, we can cancel this request animation frame loop
          // which will cause handles to be leaked in a testing environment
          activeComponent._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
          return cb()
        })
      },
      function (cb) {
        return _safeGitStatus(folder, { log: true }, (gitStatuses) => {
          const doesGitHaveChanges = !!(gitStatuses && gitStatuses.length > 0)
          if (doesGitHaveChanges) { // Don't add garbage/empty commits if nothing changed
            return _safeHasAnyHeadCommitForRef(folder, 'master', (hasHeadCommit) => {
              return _commitProject(payloadForFrontend.projectName, null, hasHeadCommit, { commitMessage: 'Project setup (via Haiku Desktop)' }, '.', cb)
            })
          }
          return cb()
        })
      },
      // Load all relevant files into memory
      function (cb) {
        logger.info(`[master] start project: ingesting files in folder ${folder}`)
        return File.ingestFromFolder(ProcessBase.HAIKU.folder, {
          excludes: [
            /(index|haiku|react|react-dom|dom|interpreter|bundle)\.js$/,
            /(README\.md|package\.json)$/i
          ]
        }, cb)
      },
      // Create the methods that will be available to those who call us over a websocket
      function (cb) {
        logger.info(`[master] start project: initializing public methods ${folder}`)
        decorate(File)
        return cb()
      },
      // Start watching the file system for changes
      function (cb) {
        if (watcher) return cb() // No need to reinitialize if already in memory
        logger.info('[master] start project: initializing file watcher', folder)
        watcher = new Watcher()
        watcher.watch(folder)
        watcher.on('change', _createFileWatcherChangeHandler(File, activeComponent))
        watcher.on('add', _createFileWatcherAddHandler(File, activeComponent))
        watcher.on('remove', _createFileWatcherRemoveHandler(File, activeComponent))
        logger.info('[master] start project: file watcher is now watching', folder)
        return cb()
      },
      // Do any setup necessary on the in-memory bytecode object
      function (cb) {
        // The bytecode file might be missing necessary metadata at this point so we create it.
        // This is used to ensure that the org name, account name, etc. are properly set in time [#RC]
        var bytecodeFile = activeComponent.fetchActiveBytecodeFile()
        if (!bytecodeFile) return cb()

        logger.info(`[master] start project: initializing bytecode`)

        bytecodeFile.set('substructInitialized', bytecodeFile.reinitializeSubstruct(config.get('config'), 'Master.startProject'))

        return bytecodeFile.performComponentWork((bytecode, mana, finished) => finished(), cb)
      },
      // Finish up and signal that we are ready
      function (cb) {
        // This flag determines whether we are ready to accept websocket method calls or not
        __ready__ = true

        logger.info(`[master] start project: ready`)

        // Must return this payload to the frontend so it has necessary data about what's going on here
        return cb(null, payloadForFrontend)
      }
    ], (err, results) => { // async returns a result for each step
      if (err) return done(err)
      return done(null, results[results.length - 1])
    })
  },

  doesProjectHaveUnsavedChanges: (message, done) => {
    return Git.status(folder, (statusErr, statuses) => {
      if (statusErr) return done(statusErr)
      if (statuses.length < 1) return done(null, false)
      return done(null, true)
    })
  },

  discardProjectChanges: (message, done) => {
    return Git.hardReset(folder, 'HEAD', (err) => {
      if (err) return done(err)
      return Git.removeUntrackedFiles(folder, (err) => {
        if (err) return done(err)
        return done()
      })
    })
  },

  initializeFolder: ({ params: [projectName, haikuUsername, haikuPassword, projectOptions] }, done) => {
    // We need to clear off undos in the case that somebody made an fs-based commit between sessions; if we tried
    // to reset to a previous "known" undoable, we'd miss the missing intermediate one, or possibly leave things corrupt.
    // Note this has to happen inside initializeFolder because it's here that we set the 'isBase' undoable
    GIT_UNDOABLES.splice(0)
    GIT_REDOABLES.splice(0)
    COMMITABLE_CHANGE_LIST.splice(0)

    let folderState

    // NOTE that 'ensureProjectFolder' or 'buildProjectContent' should _already have been called_ by this point!

    return async.series([
      // First load the folder state so we can make decisions correctly below
      function (cb) {
        return _getFolderState('initialize-folder', {}, projectName, 'master', haikuUsername, haikuPassword, projectOptions, (err, _folderState) => {
          if (err) return cb(err)
          folderState = _folderState
          logger.info('[master] folder initialization status:', folderState)
          return cb()
        })
      },
      // Now do the actual setup git such-and-such
      function (cb) {
        const { isGitInitialized, doesGitHaveChanges, isCodeCommitReady } = folderState

        // Based on the above statuses, assemble a sequence of actions to take.
        let actionSequence = []
        if (!isGitInitialized && !isCodeCommitReady) actionSequence = [_initializeGit]
        else if (!isGitInitialized && isCodeCommitReady) actionSequence = [_moveContentsToTemp, _cloneRemoteIntoFolder, _copyContentsFromTemp]
        else if (isGitInitialized && !isCodeCommitReady) actionSequence = []
        else if (isGitInitialized && isCodeCommitReady) {
          if (doesGitHaveChanges) actionSequence = []
          else if (!doesGitHaveChanges) actionSequence = [_pullRemote]
        }

        logger.info('[master] action sequence:', actionSequence.map((fn) => fn.name))

        return _runActionSequenceWithState(folderState, actionSequence, projectName, 'master', haikuUsername, haikuPassword, projectOptions, (err, _folderState) => {
          if (err) return cb(err)
          folderState = _folderState
          return cb()
        })
      },
      // Now that we've (maybe) cloned content, we need to create any other necessary files that _might not_ yet
      // exist in the folder. You may note that we run this method _before_ this process, and ask yourself: why twice?
      // Well, don't be fooled. Both methods are necessary due to the way git pulling is handled: if a project has
      // never had remote content pulled, but has changes, we move those changes away them copy them back in on top of
      // the cloned content. Which means we have to be sparing with what we create on the first run, but also need
      // to create any missing remainders on the second run.
      function (cb) {
        // Despite what plumbing may tell us, we know we need to set these as follows:
        let fixedProjectOptions = {
          organizationName: projectOptions.organizationName, // Important: Must set this here or the package.name will be wrong
          skipContentCreation: false,
          skipCDNBundles: true
        }
        return ProjectFolder.buildProjectContent(null, folder, projectName, 'haiku', fixedProjectOptions, cb)
      },
      // Make sure we are starting with a good git history
      function (cb) {
        logger.info(`
${fse.readFileSync(path.join(folder, 'package.json'))}
`)
        // We need a base commit to act as the commit to return to if the user has done 'undo' to the limit of the stack
        if (folderState.headCommitId) {
          if (GIT_UNDOABLES.length < 1) {
            logger.info(`[master] base commit for session is ${folderState.headCommitId.toString()}`)
            GIT_UNDOABLES.push({ commitId: folderState.headCommitId, isBase: true })
          }
        }
        return cb()
      }
    ], (err, results) => { // async gives back _all_ results from each step
      if (err) return done(err)
      return done(null, results[results.length - 1])
    })
  },

  previewProject: ({ params: [projectName, previewOptions = {}] }, done) => {
    return async.series([
      function (cb) {
        // Despite what plumbing may tell us, we know we need to set these as follows:
        let fixedPreviewOptions = {
          organizationName: previewOptions.organizationName, // Important: Must set this here or the package.name will be wrong
          skipContentCreation: false,
          skipCDNBundles: false,
          createPreviewMode: true // Maybe not needed
        }
        return ProjectFolder.buildProjectContent(null, folder, projectName, 'haiku', fixedPreviewOptions, cb)
      }
    ], (err, results) => { // async gives back _all_ results from each step
      if (err) return done(err)
      return done(null, results[results.length - 1])
    })
  },

  saveProject: ({ params: [projectName, haikuUsername, haikuPassword, saveOptions = {}] }, done) => {
    if (IS_SAVING) {
      logger.info('[master] project save: already in progress! short circuiting')
      // TODO: If we are saving already, should we return an error?
      return done()
    }

    // Block multiple saves from coming through at the same time by keeping a global flag of whether we are saving or not [#RC]
    IS_SAVING = true

    function finish () {
      IS_SAVING = false
      if (arguments[0]) {
        logger.info(`[master] project save: error: ${arguments[0]}`)
      }
      return done.apply(null, arguments)
    }

    const projectOptions = {
      projectName: projectName,
      haikuUsername: haikuUsername,
      authorName: saveOptions.authorName,
      organizationName: saveOptions.organizationName
    }

    logger.info('[master] project save: options:', projectOptions)

    // Going to assign these as part of the sequence below
    let folderState
    let semverVersion

    return _getFolderState('save-project', {}, projectName, 'master', haikuUsername, haikuPassword, projectOptions, (err, _folderState) => {
      if (err) return finish(err)

      return _getExistingShareDataIfSaveIsUnnecessary(_folderState, (err, existingShareData) => {
        if (err) return finish(err)

        // If we got this payload back, it means we *don't* need to do the full save process - we are at same state as the remote
        if (existingShareData) {
          return finish(null, existingShareData)
        }

        return async.series([
          // First, load the folder state. We need this to make sure the bytecode has its necessary share metadata
          function (cb) {
            return _getFolderState('save-project', {}, projectName, 'master', haikuUsername, haikuPassword, projectOptions, (err, _folderState) => {
              if (err) return cb(err)
              folderState = _folderState
              return cb()
            })
          },
          // Populate the bytecode's metadata. This may be a no-op if the file has already been saved
          function (cb) {
            logger.info('[master] project save: assigning metadata')
            var bytecodeMetadata = {
              uuid: 'HAIKU_SHARE_UUID',
              player: _getHaikuPlayerLibVersion(),
              version: folderState.semverVersion,
              organization: folderState.organizationName,
              project: folderState.projectName,
              branch: folderState.branchName
            }
            var bytecodeFile = activeComponent.fetchActiveBytecodeFile()
            return bytecodeFile.writeMetadata(bytecodeMetadata, cb)
          },
          // Build the rest of the content of the folder, including any bundles that belong on the cdn
          function (cb) {
            logger.info('[master] project save: populating content')

            return ProjectFolder.buildProjectContent(null, folder, projectName, 'haiku', projectOptions, cb)
          },
          // Bump the semver in the package.json and perform a git tag
          function (cb) {
            logger.info('[master] project save: bumping semver')
            return _bumpSemverAppropriately(folderState, (err, _semverVersion) => {
              if (err) return cb(err)
              semverVersion = _semverVersion
              return cb()
            })
          },
          // Reload the folder state, since our previous changes could affect the actual save action
          function (cb) {
            logger.info(`
${fse.readFileSync(path.join(folder, 'package.json'))}
`)

            return _getFolderState('save-project', {}, projectName, 'master', haikuUsername, haikuPassword, projectOptions, (err, _folderState) => {
              if (err) return cb(err)
              folderState = _folderState
              folderState.semverVersion = semverVersion
              folderState.saveOptions = saveOptions
              logger.info('[master] pre-save status:', folderState)
              return cb()
            })
          },
          // Do the save, including all necessary git push/pull actions
          function (cb) {
            logger.info('[master] project save: preparing action sequence')

            const { isGitInitialized, doesGitHaveChanges, isCodeCommitReady } = folderState

            // Based on the above statuses, assemble a sequence of actions to take.
            // For example: If we don't have Git set up, set it up. Or: If we have no remote, don't attempt to pull.
            let actionSequence = []
            if (!isGitInitialized && !isCodeCommitReady) actionSequence = [_initializeGit, _makeCommit, _makeTag, _retryCloudSaveSetup]
            else if (!isGitInitialized && isCodeCommitReady) actionSequence = [_moveContentsToTemp, _cloneRemoteIntoFolder, _copyContentsFromTemp, _makeCommit, _makeTag, _pushToRemote]
            else if (isGitInitialized && !isCodeCommitReady) actionSequence = [_makeCommit, _makeTag, _retryCloudSaveSetup]
            else if (isGitInitialized && isCodeCommitReady) {
              if (doesGitHaveChanges) actionSequence = [_makeCommit, _pullRemote, _conflictResetOrContinue, _bumpSemverAppropriately, _makeCommit, _makeTag, _pushToRemote]
              else if (!doesGitHaveChanges) actionSequence = [_pullRemote]
            }

            logger.info('[master] project save: action sequence:', actionSequence.map((fn) => fn.name))

            return _runActionSequenceWithState(folderState, actionSequence, projectName, 'master', haikuUsername, haikuPassword, projectOptions, (err, _folderState) => {
              if (err) return cb(err)
              folderState = _folderState // Forward this to the share info retrieval method
              return cb()
            })
          },
          // Finish up the process - either require conflicts to be fixed, or load a share link
          function (cb) {
            logger.info('[master] project save: completed initial sequence')

            // If we have conflicts, we can't proceed to the share step, so return early.
            // Conflicts aren't returned as an error because the frontend expects them as part of the response payload.
            if (folderState.didHaveConflicts) return cb(null, { conflicts: [1] }) // A fake conflicts object for now - #TODO add real thing

            logger.info('[master] project save: fetching current share info')

            // TODO:  it may make sense to separate the "get the share link" flow from the "save" flow
            return _getCurrentShareInfo(folderState, 60000 * 2, cb)
          }
        ], (err, results) => { // async gives back _all_ results from each step
          if (err) return finish(err)
          return finish(null, results[results.length - 1])
        })
      })
    })
  },

  fetchProjectInfo: ({ params: [projectName, haikuUsername, haikuPassword, fetchOptions = {}] }, done) => {
    return _getFolderState('fetch-info', {}, projectName, 'master', haikuUsername, haikuPassword, fetchOptions, (err, folderState) => {
      if (err) return done(err)
      return _getCurrentShareInfo(folderState, 2000, done)
    })
  },

  gitUndo: ({ params: [undoOptions] }, done) => {
    // Handled in a queue in case we get a bunch of them rapidly and they need to be handled in sequence
    GIT_UNDO_REQUESTS.push({ undoOptions, done })
    logger.info('[master] pushed undo request onto queue (' + GIT_UNDO_REQUESTS.length + ')')
  },

  gitRedo: ({ params: [redoOptions] }, done) => {
    // Handled in a queue in case we get a bunch of them rapidly and they need to be handled in sequence
    GIT_REDO_REQUESTS.push({ redoOptions, done })
    logger.info('[master] pushed redo request onto queue (' + GIT_REDO_REQUESTS.length + ')')
  }
}

function _waitUntilNoFurtherChangesAreAwaitingCommit (cb) {
  if (!IS_COMMITTING && COMMITABLE_CHANGE_LIST.length < 1) {
    return cb()
  }
  return setTimeout(() => {
    return _waitUntilNoFurtherChangesAreAwaitingCommit(cb)
  }, 64)
}

function _getGitUndoablesUptoBase () {
  var undoables = []
  var foundBase = false
  GIT_UNDOABLES.forEach((undoable) => {
    if (undoable.isBase) foundBase = true
    if (foundBase) undoables.push(undoable)
  })
  return undoables
}

function _gitUndo (undoOptions, done) {
  logger.info('[master] Undo beginning')

  // We can't undo if there isn't a target ref yet to go back to; skip if so
  if (GIT_UNDOABLES.length < 2) {
    logger.info('[master] Nothing to undo')
    return done()
  }

  // Doing an undo while we're saving probably puts us into a bad state
  if (IS_SAVING) {
    logger.info('[master] Cannot undo while saving')
    return done()
  }

  logger.info('[master] Undo is waiting for pending changes to drain')

  // If the user tries to undo an action before we've finished the commit, they'll end up undoing the previous one,
  // so we will wait until there are no pending changes and only then run the undo action
  _waitUntilNoFurtherChangesAreAwaitingCommit(() => {
    logger.info('[master] Undo proceeding')

    // The most recent item is the one we are going to undo...
    var validUndoables = _getGitUndoablesUptoBase()
    var undone = validUndoables.pop()
    logger.info(`[master] Git undo commit ${undone.commitId.toString()}`)

    // To undo, we go back to the commit _prior to_ the most recent one
    var target = validUndoables[validUndoables.length - 1]
    logger.info(`[master] Git undo resetting to commit ${target.commitId.toString()}`)

    return Git.hardResetFromSHA(folder, target.commitId.toString(), (err) => {
      if (err) {
        logger.info(`[master] Git undo failed`)
        return done(err)
      }

      logger.info('[master] Undo done')

      // The most recent undone thing becomes an action we can now undo.
      // Only do the actual stack-pop here once we know we have succeeded.
      GIT_REDOABLES.push(GIT_UNDOABLES.pop())
      return done()
    })
  })
}

function _gitUndoQueue () {
  return setTimeout(() => {
    // Nothing to do - skip this update and wait till some show up
    if (GIT_UNDO_REQUESTS.length < 1) return _gitUndoQueue()

    // If we're doing a hot reload anywhere, wait till it's finished
    if (PENDING_RELOADS.length > 0) return _gitUndoQueue()

    const { undoOptions, done } = GIT_UNDO_REQUESTS.shift()
    return _gitUndo(undoOptions, (err) => {
      done(err)
      return _gitUndoQueue()
    })
  }, 64)
}

function _gitRedo (redoOptions, done) {
  // Doing an undo while we're saving probably puts us into a bad state
  if (IS_SAVING) return done()

  var redoable = GIT_REDOABLES.pop()
  // If nothing to redo, consider this a noop
  if (!redoable) return done()

  logger.info(`[master] Git redo commit ${redoable.commitId.toString()}`)

  return Git.hardResetFromSHA(folder, redoable.commitId.toString(), (err) => {
    if (err) {
      logger.info(`[master] Git redo failed`)
      GIT_REDOABLES.push(redoable) // If error, put the 'undone' thing back on the stack since we didn't succeed
      return done(err)
    }

    GIT_UNDOABLES.push(redoable)

    return done()
  })
}

function _gitRedoQueue () {
  return setTimeout(() => {
    // Nothing to do - skip this update and wait till some show up
    if (GIT_REDO_REQUESTS.length < 1) return _gitRedoQueue()

    // If we're doing a hot reload anywhere, wait till it's finished
    if (PENDING_RELOADS.length > 0) return _gitRedoQueue()

    const { redoOptions, done } = GIT_REDO_REQUESTS.shift()
    return _gitRedo(redoOptions, (err) => {
      done(err)
      return _gitRedoQueue()
    })
  }, 64)
}

/**
 * @function _getExistingShareDataIfSaveIsUnnecessary
 * @description Given the current folder state, determine if we need to save or if we can simply
 * retrieve a pre-existing share link.
 */
function _getExistingShareDataIfSaveIsUnnecessary (folderState, cb) {
  // TODO: We may need to look closely to see if this boolean is set properly.
  // Currently the _getFolderState method just checks to see if there are git statuses,
  // but that might not be correct (although it seemed to be when I initially checked).
  if (folderState.doesGitHaveChanges) {
    logger.info('[master] looks like git has changes; must do full save')
    return cb(null, false) // falsy == you gotta save
  }

  // Inkstone should return info pretty fast if it has share info, so only wait 2s
  return _getCurrentShareInfo(folderState, 2000, (err, shareInfo) => {
    // Rather than treat the error as an error, assume it indicates that we need
    // to do a full publish. For example, we don't want to "error" if this is just a network timeout.
    // #FIXME?
    if (err) {
      logger.info('[master] share info was error-ish; must do full save')
      return cb(null, false) // falsy == you gotta save
    }

    // Not sure why this would be null, but just in case...
    if (!shareInfo) {
      logger.info('[master] share info was blank; must do full save')
      return cb(null, false) // falsy == you gotta save
    }

    // If we go this far, we already have a save for our current SHA, and can skip the expensive stuff
    logger.info('[master] share info found! no need to save')
    return cb(null, shareInfo)
  })
}

// Dictionary mapping SHA strings to share payloads, used for caching
const SHARE_INFO_PAYLOADS = {}

function _getCurrentShareInfo (folderState, timeout, done) {
  return Git.referenceNameToId(folder, 'HEAD', (err, id) => {
    if (err) return done(err)

    var sha = id.toString()

    logger.info('[master] git HEAD resolved:', sha, 'getting snapshot info...')

    if (SHARE_INFO_PAYLOADS[sha]) {
      logger.info(`[master] found cached share info for ${sha}`)
      return done(null, SHARE_INFO_PAYLOADS[sha])
    }

    return _getSnapshotInfo(sha, timeout, (err, shareLink, snapshotAndProject) => {
      logger.info('[master] snapshot info returned', err, shareLink)

      if (err) {
        if (err.timeout === true) {
          logger.info('[master] timed out waiting for snapshot info')
          // HEY! This error message string is used by the frontend as part of some hacky conditional logic.
          // Make sure you understand what it's doing there before you change it here...
          return done(new Error('Timed out waiting for project share info'), lodash.assign({ sha }, folderState))
        }
        logger.info('[master] error getting snapshot info')
        return done(err)
      }

      var projectUid = snapshotAndProject.Project.UniqueId

      var shareInfo = lodash.assign({ sha, projectUid, shareLink }, folderState)

      // Cache this during this session so we can avoid unnecessary handshakes with inkstone
      SHARE_INFO_PAYLOADS[sha] = shareInfo

      logger.info('[master] share info', shareInfo)

      return done(null, shareInfo)
    })
  })
}

function _getSnapshotInfo (sha, timeout, done) {
  var alreadyReturned = false

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

  logger.info('[master] awaiting snapshot share link')
  return inkstone.snapshot.awaitSnapshotLink(sha, (err, shareLink) => {
    if (err) return finish(err)
    logger.info('[master] share link received:', shareLink)
    return inkstone.snapshot.getSnapshotAndProject(sha, (err, snapshotAndProject) => {
      if (err) return finish(err)
      logger.info('[master] snapshot/project info:', snapshotAndProject)
      return finish(null, shareLink, snapshotAndProject)
    })
  })
}

function saveStrategyToFileFavorName (saveStrategy) {
  if (!saveStrategy) return 'normal'
  if (!saveStrategy.strategy) return 'normal'
  if (saveStrategy.strategy === 'recursive') return 'normal'
  if (saveStrategy.strategy === 'ours') return 'ours'
  if (saveStrategy.strategy === 'theirs') return 'theirs'
  return 'normal'
}

function _runActionSequenceWithState (previousFolderState, actionSequence, projectName, branchName, haikuUsername, haikuPassword, projectOptions, cb) {
  if (!actionSequence && actionSequence.length < 1) return cb()
  return async.eachSeries(actionSequence, (fn, next) => {
    // We need to reload the folder state before ever action since changes could affect the git status, etc.,
    // and downstream actions may rely on those being perfectly up to date
    return _getFolderState(`action-sequence->${fn.name}`, previousFolderState, projectName, branchName, haikuUsername, haikuPassword, projectOptions, (err, updatedFolderState) => {
      if (err) return next(err)
      logger.info('[master] running action sequence entry ->', fn.name)
      return fn(updatedFolderState, next)
    })
  }, (err) => {
    if (err) return cb(err)
    // Recipients of this response also depend on the folderState being up to date, so gotta run it again...
    return _getFolderState('action-sequence->done', previousFolderState, projectName, branchName, haikuUsername, haikuPassword, projectOptions, (err, finalFolderState) => {
      if (err) return cb(err)
      return cb(null, finalFolderState)
    })
  })
}

function _getFolderState (who, previousFolderState, projectName, branchName, haikuUsername, haikuPassword, projectOptions, cb) {
  logger.info(`[master] folder state check (${who}): checking...`)

  return _safeHasAnyHeadCommitForRef(folder, branchName, (hasHeadCommit) => {
    return Git.referenceNameToId(folder, 'HEAD', (_err, headCommitId) => {
      return _safeFetchProjectGitRemoteInfo(projectName, (remoteProjectDescriptor) => {
        return _safeListLocallyDeclaredRemotes(folder, (gitRemotesList) => {
          return _checkIsOnline((isOnline) => {
            const isCodeCommitReady = !!(projectName && remoteProjectDescriptor)

            if (!projectName) logger.info(`[master] folder state check (${who}): project name missing`)
            if (!remoteProjectDescriptor) logger.info(`[master] folder state check (${who}): remote project descriptor missing`)

            return _safeGitStatus(folder, { log: false }, (gitStatuses) => {
              if (gitStatuses) {
                gitStatuses = gitStatuses.map((statusEntry) => statusEntry.status())
              }

              const doesGitHaveChanges = !!(gitStatuses && gitStatuses.length > 0)
              const isGitInitialized = fse.existsSync(path.join(folder, '.git'))
              const folderEntries = fse.readdirSync(folder)

              const folderState = lodash.merge(previousFolderState, {
                folder,
                isOnline,
                projectName,
                branchName,
                isGitInitialized,
                folderEntries,
                gitStatuses,
                hasHeadCommit,
                headCommitId,
                remoteProjectDescriptor: remoteProjectDescriptor,
                gitRemotesList,
                haikuUsername,
                haikuPassword,
                isCodeCommitReady,
                doesGitHaveChanges,
                projectOptions,
                organizationName: projectOptions.organizationName,
                gitUndoables: GIT_UNDOABLES,
                gitRedoables: GIT_REDOABLES
              })

              var packageJsonExists = fse.existsSync(path.join(folder, 'package.json'))
              if (packageJsonExists) {
                var packageJsonObj = fse.readJsonSync(path.join(folder, 'package.json'), { throws: false })
                if (packageJsonObj) {
                  folderState.semverVersion = packageJsonObj.version

                  // Used for forming embed snippets
                  folderState.playerVersion = packageJsonObj.dependencies && packageJsonObj.dependencies['@haiku/player']
                }
              }

              logger.info(`[master] folder state check (${who}): ...done!`)

              return cb(null, folderState)
            })
          })
        })
      })
    })
  })
}

function _makeCommit (state, cb) {
  return _commitProject(state.projectName, state.haikuUsername, state.hasHeadCommit, state.saveOptions, '.', (err, commitId) => {
    if (err) return cb(err)
    state.commitId = commitId
    return cb()
  })
}

function _bumpSemverAppropriately (state, cb) {
  logger.info('[master] trying to bump semver appropriately')

  return Git.listTags(state.folder, (err, tags) => {
    if (err) return cb(err)

    let cleanTags = tags.map((dirtyTag) => {
      // Clean v0.1.2 and refs/head/v0.1.2 to just 0.1.2
      return dirtyTag.split('/').pop().replace(/^v/, '')
    })

    logger.info('[master] tags found:', cleanTags.join(','))

    // 1. Figure out which is the largest semver tag among
    //    - git tags
    //    - the max version
    let maxTag = '0.0.0'
    cleanTags.forEach((cleanTag) => {
      if (semver.gt(cleanTag, maxTag)) {
        maxTag = cleanTag
      }
    })
    var pkgTag = fse.readJsonSync(path.join(state.folder, 'package.json')).version
    if (semver.gt(pkgTag, maxTag)) {
      maxTag = pkgTag
    }

    logger.info('[master] max git tag found is', maxTag)

    // 2. Bump this tag to the next version, higher than anything we have locally
    let nextTag = semver.inc(maxTag, 'patch')

    logger.info('[master] next tag to set is', nextTag)

    // 3. Set the package.json number to the new version
    return ProjectFolder.semverBumpPackageJson(state.folder, nextTag, (err) => {
      if (err) return cb(err)

      logger.info(`[master] bumped package.json semver to ${nextTag}`)

      if (!File) {
        logger.info(`[master] no file model loaded; skipping tag of bytecode`)
        return cb(null, nextTag)
      }

      var bytecodeFile = activeComponent.fetchActiveBytecodeFile()

      if (!bytecodeFile) {
        logger.info(`[master] no bytecode file; skipping tag of bytecode`)
        return cb(null, nextTag)
      }

      // 4. Set the bytecode metadata to the new version
      var bytecodeMetadata = { version: nextTag }

      // Commit the content directly to the file instead of waiting for debounce #RC
      bytecodeFile.set('commitImmediate', true)

      return bytecodeFile.writeMetadata(bytecodeMetadata, (err) => {
        // Go back to the original commit debounce disposition #RC
        bytecodeFile.set('commitImmediate', false)

        if (err) return cb(err)

        logger.info(`[master] bumped bytecode semver to ${nextTag}`)

        return cb(null, nextTag)
      })
    })
  })
}

var MAX_SEMVER_TAG_ATTEMPTS = 100

function _makeTag (state, cb) {
  logger.info(`[master] git tagging: ${state.semverVersion} (commit: ${state.commitId})`)

  if (!state.semverTagAttempts) state.semverTagAttempts = 0
  state.semverTagAttempts += 1
  if (state.semverTagAttempts > MAX_SEMVER_TAG_ATTEMPTS) {
    return cb(new Error('Failed to make semver tag even after many attempts'))
  }

  return Git.createTag(state.folder, state.semverVersion, state.commitId, state.semverVersion, (err) => {
    if (err) {
      // If the tag already exists, we can try to correct the situation by bumping the semver until we find a good tag.
      if (err.message && err.message.match(/Tag already exists/i)) {
        logger.info(`[master] git tag ${state.semverVersion} already exists; trying to bump it`)

        return _bumpSemverAppropriately(state, (err, incTag) => {
          if (err) return cb(err)

          state.semverVersion = incTag

          // Recursively go into this sequence again, hopefully eventually finding a good tag to use
          // If we try this too many times and fail (see above), we will quit the process
          return _makeTag(state, cb)
        })
      }

      logger.info(`[master] git tag error: ${err}`)
      return cb(err)
    }

    return cb()
  })
}

function _retryCloudSaveSetup (state, cb) {
  logger.info(`[master] retrying remote ref setup to see if we can cloud save after all`)

  return _ensureAllRemotes(state, (err) => {
    if (err) return _cloudSaveDisabled(state, cb)

    return _getFolderState('cloud-setup', {}, state.projectName, 'master', state.haikuUsername, state.haikuPassword, {}, (err, updatedFolderState) => {
      if (err) return _cloudSaveDisabled(updatedFolderState, cb)

      if (!updatedFolderState.isGitInitialized) return _cloudSaveDisabled(updatedFolderState, cb)

      return cb()
    })
  })
}

function _cloudSaveDisabled (state, cb) {
  const error = new Error('Project was saved locally, but could not sync to Haiku Cloud')
  error.code = PublicErrorCodes.CLOUD_SAVE_DISABLED
  return cb(error)
}

function _pushToRemote (state, cb) {
  if (state.saveOptions && state.saveOptions.dontPush) {
    logger.info('[master] skipping push to remote, per your saveOptions flag')
    return cb() // Hack: Allow consumer to skip push (e.g. for testing)
  }
  if (state.wasResetPerformed) return cb() // Kinda hacky to put this here...
  const { GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword } = state.remoteProjectDescriptor
  return _pushProject(state.projectName, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, (err) => {
    if (err) return cb(err)
    return _pushTag(state, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb)
  })
}

function _pushTag (state, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb) {
  logger.info(`[master] pushing tag ${state.semverVersion} to remote (${state.projectName}) ${GitRemoteUrl}`)
  Git.pushTagToRemote(state.folder, state.projectName, state.semverVersion, CodeCommitHttpsUsername, CodeCommitHttpsPassword, cb)
}

function _initializeGit (state, cb) {
  return Git.maybeInit(state.folder, cb)
}

function _moveContentsToTemp (state, cb) {
  logger.info('[master] moving folder contents to temp dir (if any)')

  return tmp.dir({ unsafeCleanup: true }, (err, tmpDir, tmpDirCleanupFn) => {
    if (err) return cb(err)

    state.tmpDir = tmpDir

    logger.info('[master] temp dir is', state.tmpDir)

    state.tmpDirCleanupFn = tmpDirCleanupFn

    // Whether or not we had entries, we still need the temp folder created at this point otherwise
    // methods downstream will complain
    if (state.folderEntries.length < 1) {
      logger.info('[master] folder had no initial content; skipping temp folder step')

      return cb()
    }

    logger.info('[master] copying contents from', state.folder, 'to temp dir', state.tmpDir)

    return fse.copy(state.folder, state.tmpDir, (err) => {
      if (err) return cb(err)

      logger.info('[master] emptying original dir', state.folder)

      // Folder must be empty for a Git clone to take place
      return fse.emptyDir(state.folder, (err) => {
        if (err) return cb(err)
        return cb()
      })
    })
  })
}

const MAX_CLONE_ATTEMPTS = 5
const CLONE_RETRY_DELAY = 10000

function _cloneRemoteIntoFolder (state, cb) {
  if (!state.cloneAttempts) state.cloneAttempts = 0
  state.cloneAttempts++
  const { GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword } = state.remoteProjectDescriptor
  logger.info(`[master] cloning from remote ${GitRemoteUrl} (attempt ${state.cloneAttempts}) ...`)
  return Git.cloneRepo(GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, state.folder, (err) => {
    if (err) {
      logger.info(`[master] clone error:`, err)
      if (state.cloneAttempts < MAX_CLONE_ATTEMPTS) {
        logger.info(`[master] retrying clone after a brief delay...`)
        return setTimeout(() => {
          return _cloneRemoteIntoFolder(state, cb)
        }, CLONE_RETRY_DELAY)
      }
      return cb(err)
    }
    logger.info('[master] clone complete!')
    return _ensureAllRemotes(state, (err) => {
      if (err) return cb(err)
      return cb()
    })
  })
}

function _ensureAllRemotes (state, cb) {
  return _ensureLocalRemote(state, (err) => {
    if (err) return cb(err)
    return _ensureRemoteRefs(state, (err) => {
      if (err) return cb(err)
      return cb()
    })
  })
}

function _ensureLocalRemote (state, cb) {
  // Object access to .GitRemoteUrl would throw an exception in some cases if we didn't check this
  if (!state || !state.remoteProjectDescriptor) {
    return cb(new Error('Cannot find remote project descriptor'))
  }

  const { GitRemoteUrl } = state.remoteProjectDescriptor

  logger.info('[master] upserting remote', GitRemoteUrl)

  return Git.upsertRemote(state.folder, state.projectName, GitRemoteUrl, (err, remote) => {
    if (err) return cb(err)
    return cb(null, remote)
  })
}

function _ensureRemoteRefs (state, cb) {
  logger.info('[master] remote refs: ensuring')

  return Git.open(state.folder, (err, repository) => {
    if (err) return cb(err)

    logger.info('[master] remote refs: setting up base content')

    return fse.outputFile(path.join(state.folder, 'README.md'), '', (err) => {
      if (err) return cb(err)

      logger.info('[master] remote refs: making base commit')

      return Git.addAllPathsToIndex(state.folder, (err, oid) => {
        if (err) return cb(err)
        return Git.buildCommit(state.folder, state.haikuUsername, DEFAULT_GIT_EMAIL, 'Base commit', oid, null, null, (err, commitId) => {
          if (err) return cb(err)
          const branchName = 'master'
          const refSpecToPush = `refs/heads/${branchName}`

          logger.info('[master] remote refs: creating branch', branchName)

          return repository.createBranch(branchName, commitId.toString()).then(() => {
            return Git.lookupRemote(state.folder, state.projectName, (err, mainRemote) => {
              if (err) return cb(err)
              const remoteRefspecs = [refSpecToPush]
              const remoteCreds = Git.buildRemoteOptions(state.remoteProjectDescriptor.CodeCommitHttpsUsername, state.remoteProjectDescriptor.CodeCommitHttpsPassword)

              logger.info('[master] remote refs: pushing refspecs', remoteRefspecs, 'over https')

              return mainRemote.push(remoteRefspecs, remoteCreds).then(() => {
                return cb()
              }, cb)
            })
          }, (branchErr) => {
            // The remote already exists; there was no need to create it. Go ahead and skip
            if (branchErr.message && branchErr.message.match(/reference with that name already exists/) && branchErr.message.split(refSpecToPush).length > 1) {
              logger.info('[master] remote refs: branch already exists; proceeding')
              return cb()
            }
            return cb(branchErr)
          })
        })
      })
    })
  })
}

function _copyContentsFromTemp (state, cb) {
  logger.info('[master] returning original folder contents (if any)')

  if (state.folderEntries.length < 1) {
    logger.info('[master] no original folder entries present')

    return cb()
  }

  // Should this return an error or not?
  if (!state.tmpDir) {
    logger.info('[master] no temp dir seems to have been created at', state.tmpDir)

    return cb()
  }

  logger.info('[master] copying contents from', state.tmpDir, 'back to original folder', state.folder)

  return fse.copy(state.tmpDir, state.folder, (err) => {
    if (err) return cb(err)

    logger.info('[master] cleaning up temp dir', state.tmpDir)

    state.tmpDirCleanupFn()

    return cb()
  })
}

function _pullRemote (state, cb) {
  const { GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword } = state.remoteProjectDescriptor
  return _fetchProject(state.projectName, GitRemoteUrl, CodeCommitHttpsUsername, CodeCommitHttpsPassword, (err) => {
    if (err) return cb(err)

    return Git.getCurrentBranchName(state.folder, (err, partialBranchName) => {
      if (err) return cb(err)
      logger.info(`[master] current branch is '${partialBranchName}'`)

      return _mergeProject(state.projectName, partialBranchName, state.saveOptions, (err, didHaveConflicts, shaOrIndex) => {
        if (err) return cb(err)

        if (!didHaveConflicts) {
          logger.info(`[master] merge complete (${shaOrIndex})`)
        } else {
          logger.info(`[master] merge conflicts detected`)
        }

        // Just for the sake of logging the current git status
        return _safeGitStatus(state.folder, { log: true }, () => {
          state.didHaveConflicts = didHaveConflicts
          state.mergeCommitId = (didHaveConflicts) ? null : shaOrIndex.toString()

          return cb()
        })
      })
    })
  })
}

function _conflictResetOrContinue (state, cb) {
  // If no conficts, this save is good; ok to push and return
  if (!state.didHaveConflicts) return cb()

  // If conflicts, do a reset so a second save attempt can go through
  // TODO: Don't clean but leave things as-is for manual intervention
  logger.info('[master] cleaning merge conflicts for re-attempt')

  return _safeGitStatus(state.folder, { log: true }, () => {
    // ^^ Just calling this to log whatever the current statuses are

    return Git.cleanAllChanges(state.folder, (err) => {
      if (err) return cb(err)
      return Git.hardResetFromSHA(state.folder, state.commitId.toString(), (err) => {
        if (err) return cb(err)
        state.wasResetPerformed = true
        return cb()
      })
    })
  })
}

function logStatuses (statuses) {
  statuses.forEach((status) => {
    logger.info('[master] git status:' + status.path() + ' ' + statusToText(status))
  })
}

function statusToText (status) {
  var words = []
  if (status.isNew()) words.push('NEW')
  if (status.isModified()) words.push('MODIFIED')
  if (status.isTypechange()) words.push('TYPECHANGE')
  if (status.isRenamed()) words.push('RENAMED')
  if (status.isIgnored()) words.push('IGNORED')
  return words.join(' ')
}

function _safeListLocallyDeclaredRemotes (folder, cb) {
  return Git.listRemotes(folder, (err, remotes) => {
    if (err) return cb(null, err)
    return cb(remotes)
  })
}

function _safeFetchProjectGitRemoteInfo (projectName, cb) {
  if (!projectName) return cb(null)
  var authToken = sdkClient.config.getAuthToken()
  return inkstone.project.getByName(authToken, projectName, (err, projectAndCredentials, httpResp) => {
    // Note the inversion of the typical error-first continuation. Just for convenience downstream
    if (err) return cb(null, err)
    if (!httpResp) return cb(null, new Error('No HTTP response'))
    if (httpResp.statusCode === 404) return cb(null, new Error('Got 404 status code'))
    if (!projectAndCredentials.Project) return cb(null, new Error('No project returned'))
    return cb({ // eslint-disable-line
      projectName: projectName,
      GitRemoteUrl: projectAndCredentials.Project.GitRemoteUrl,
      CodeCommitHttpsUsername: projectAndCredentials.Credentials.CodeCommitHttpsUsername,
      CodeCommitHttpsPassword: projectAndCredentials.Credentials.CodeCommitHttpsPassword
    })
  })
}

function _safeHasAnyHeadCommitForRef (folder, ref, cb) {
  return fse.exists(path.join(folder, '.git', 'refs', 'heads', ref), (answer) => {
    return cb(!!answer) // eslint-disable-line
  })
}

function _safeGitStatus (folder, options, cb) {
  return Git.status(folder, (err, statuses) => {
    if (options && options.log) {
      if (statuses) {
        logStatuses(statuses)
      } else if (err) {
        logger.info('[master] git status error:', err)
      }
    }

    if (err) return cb(null, err)
    return cb(statuses)
  })
}

function _fetchProject (projectName, projectGitRemoteUrl, gitRemoteUsername, gitRemotePassword, cb) {
  return Git.upsertRemote(folder, projectName, projectGitRemoteUrl, (err, remote) => {
    if (err) return cb(err)
    logger.info(`[master] fetching ${projectName} from remote ${projectGitRemoteUrl}`)
    return Git.fetchFromRemote(folder, projectName, gitRemoteUsername, gitRemotePassword, (err) => {
      if (err) return cb(err)
      logger.info('[master] fetch done')
      return cb()
    })
  })
}

function _pushProject (projectName, projectGitRemoteUrl, gitRemoteUsername, gitRemotePassword, cb) {
  return Git.getCurrentBranchName(folder, (err, partialBranchName, fullBranchName) => {
    if (err) return cb(err)
    logger.info(`[master] pushing ${fullBranchName} to remote (${projectName}) ${projectGitRemoteUrl}`)
    const doForcePush = true
    return Git.pushToRemote(folder, projectName, fullBranchName, gitRemoteUsername, gitRemotePassword, doForcePush, (err) => {
      if (err) return cb(err)
      logger.info('[master] push done')
      return cb()
    })
  })
}

/**
 * @function _commitProject
 * @param projectName {String}
 * @param username {String|Null}
 * @param useHeadAsParent {Beolean}
 * @param saveOptions {Object}
 * @param pathsToAdd {String|Array} - '.' to add all paths, [path, path] to add individual paths
 **/
function _commitProject (projectName, username, useHeadAsParent, saveOptions = {}, pathsToAdd, cb) {
  logger.info(`[master] => adding paths to index (${folder})`)

  // Depending on the 'pathsToAdd' given, either add specific paths to the index, or commit them all
  function pathAdder (done) {
    if (pathsToAdd === '.') return Git.addAllPathsToIndex(folder, done)
    else if (Array.isArray(pathsToAdd) && pathsToAdd.length > 0) return Git.addPathsToIndex(folder, pathsToAdd, done)
    else return done()
  }

  return pathAdder((err, oid) => {
    if (err) return cb(err)
    const user = username || DEFAULT_GIT_USERNAME
    const email = username || DEFAULT_GIT_EMAIL
    const message = (saveOptions && saveOptions.commitMessage) || DEFAULT_GIT_COMMIT_MESSAGE
    const parentRef = (useHeadAsParent) ? 'HEAD' : null // Initial commit might not want us to specify a nonexistent ref...
    const updateRef = 'HEAD'

    logger.info(`[master] committing ${JSON.stringify(message)} in ${folder} [${updateRef} onto ${parentRef}] ...`)
    return Git.buildCommit(folder, user, email, message, oid, updateRef, parentRef, (err, commitId) => {
      if (err) return cb(err)

      logger.info(`[master] <= commit done! (${commitId.toString()})`)

      return cb(null, commitId)
    })
  })
}

function _mergeProject (projectName, partialBranchName, saveOptions = {}, cb) {
  const remoteBranchRefName = `remotes/${projectName}/${partialBranchName}`
  const fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy)

  // #IDUNNO: For some reason when this is set to `true` (in turn resulting in mergeOptions.flags getting set to 1),
  // merging with a merge strategy of OURS/THEIRS ends up with conflicts (which should never happen with OURS/THEIRS).
  // Since I don't initially see any problem with just setting it to `false` for all cases, I'll hardcode it as such.
  // It's possible this is a flaw in Nodegit?
  // If you find a case where this var needs to be `true`, please document why below this comment.
  const doFindRenames = false

  logger.info(`[master] merging '${remoteBranchRefName}' into '${partialBranchName}' via '${fileFavorName}' (${folder})`)

  return Git.mergeBranches(folder, partialBranchName, remoteBranchRefName, fileFavorName, doFindRenames, (err, didHaveConflicts, shaOrIndex) => {
    if (!err) {
      return cb(null, didHaveConflicts, shaOrIndex)
    }

    if (err.message && err.message.match(/No merge base found/i)) {
      logger.info(`[master] histories lack common ancestor; trying to combine`)
      // This should return the same payload as Git.mergeBranches returns
      return _combineHistories(projectName, partialBranchName, remoteBranchRefName, saveOptions, cb)
    }

    return cb(err)
  })
}

function _combineHistories (projectName, ourBranchName, theirBranchName, saveOptions = {}, cb) {
  const fileFavorName = saveStrategyToFileFavorName(saveOptions && saveOptions.saveStrategy)
  return Git.mergeBranchesWithoutBase(folder, ourBranchName, theirBranchName, null, null, fileFavorName, (err, didHaveConflicts, shaOrIndex) => {
    if (err) return cb(err)
    return cb(null, didHaveConflicts, shaOrIndex)
  })
}

function _checkIsOnline (cb) {
  return checkIsOnline().then((answer) => {
    return cb(answer)
  })
}

function _createFileWatcherChangeHandler (File, activeComponent) {
  return function (abspath) {
    const relpath = path.relative(folder, abspath)

    logger.info('[master] file change detected:', relpath)

    if (shouldFileWatcherHandlerSubroutineBeSkipped(relpath)) {
      logger.info('[master] skipping change routine for', relpath, 'because we exclude this type')
      return void (0)
    }

    logger.info('[master] sketchtool pipeline running; please wait')

    Sketch.sketchtoolPipeline(abspath)

    logger.info('[master] sketchtool done')

    return File.ingestOne(folder, relpath, (err, file) => {
      if (err) return logger.info(err)
      logger.info('[master] file ingested into memory:', abspath)

      if (proc.socket && proc.socket.isOpen()) {
        // A file:change broadcast mainly just notifies the library asset listing that assets may need to be refreshed
        proc.socket.send({ type: 'broadcast', name: 'file:change', folder, relpath, abspath })
      }

      function doOtherStuff () {
        // For now we can assume that we only need to do a reload in the case that a .js file has changed.
        // But it might make sense to move this logic to a single place since there are other heuristics used
        // to decide whether to force a component reload.
        if (path.extname(relpath).match(/^\.(js)$/)) {
          if (file.get('previous') !== file.get('contents')) {
            moduleModificationsQueue.push(file)
          }
        }

        if (relpath === activeComponent.fetchActiveBytecodeFile().get('relpath')) {
          file.set('substructInitialized', file.reinitializeSubstruct(config.get('config'), 'Master._createFileWatcherChangeHandler'))
        }

        // Files other than the bytecode that change we can assume to be done outside of creator for now. See comment above.
        COMMITABLE_CHANGE_LIST.push({ message: `Changed ${relpath}`, relpath, id: _createChangeId() })
      }

      // If the change is an SVG, tell people that we want to do a design merge.
      // No need to request a merge if the contents are identical - this can happen
      // frequently when sketchtool writes files but doesn't change anything
      if (isRelpathSvg(relpath) && file.get('previous') !== file.get('contents')) {
        maybeSendDesignMergeRequest(file, () => {
          doOtherStuff()
        })
      } else {
        doOtherStuff()
      }
    })
  }
}

function _createFileWatcherAddHandler (File, activeComponent) {
  return function (abspath) {
    const relpath = path.relative(folder, abspath)

    logger.info('[master] file addition detected:', relpath)

    if (shouldFileWatcherHandlerSubroutineBeSkipped(relpath)) {
      logger.info('[master] skipping create routine for', relpath, 'because we exclude this type')
      return void (0)
    }

    logger.info('[master] sketchtool pipeline running; please wait')

    Sketch.sketchtoolPipeline(abspath)

    logger.info('[master] sketchtool done')

    return File.ingestOne(folder, relpath, (err, file) => {
      if (err) return logger.info(err)
      logger.info('[master] file ingested:', abspath)

      COMMITABLE_CHANGE_LIST.push({ message: `Added ${relpath}`, relpath, id: _createChangeId() })

      if (proc.socket && proc.socket.isOpen()) {
        proc.socket.send({ type: 'broadcast', name: 'file:add', folder, relpath, abspath })
      }

      if (relpath === activeComponent.fetchActiveBytecodeFile().get('relpath')) {
        file.set('substructInitialized', file.reinitializeSubstruct(config.get('config'), 'Master._createFileWatcherAddHandler'))
      }
    })
  }
}

function _createFileWatcherRemoveHandler (File, activeComponent) {
  return function (abspath) {
    const relpath = path.relative(folder, abspath)

    logger.info('[master] file removal detected:', relpath)

    if (shouldFileWatcherHandlerSubroutineBeSkipped(relpath)) {
      logger.info('[master] skipping delete routine for', relpath, 'because we exclude this type')
      return void (0)
    }

    return File.expelOne(relpath, (err) => {
      if (err) return logger.info(err)
      logger.info('[master] file expelled:', abspath)

      COMMITABLE_CHANGE_LIST.push({ message: `Added ${relpath}`, relpath, id: _createChangeId() })

      if (proc.socket && proc.socket.isOpen()) {
        proc.socket.send({ type: 'broadcast', name: 'file:remove', folder, relpath, abspath })
      }
    })
  }
}

function _getHaikuPlayerLibVersion () {
  if (!fse.existsSync(PLUMBING_PKG_JSON_PATH)) return null
  var obj = fse.readJsonSync(PLUMBING_PKG_JSON_PATH, { throws: false })
  return obj && obj.version
}

var _changeId = 0
function _createChangeId () {
  _changeId += 1
  return _changeId
}

function decorate (File) {
  function reloadAssetsDirectory () {
    const designFilesArray = File.allDesigns()
    const assets = Asset.assetsToDirectoryStructure(designFilesArray)
    return assets
  }

  function _bytecodeActionCreator (actionName) {
    return function _bytecodeAction ({ params }, done) {
      const bytecodeFile = activeComponent.fetchActiveBytecodeFile()
      if (!bytecodeFile) return done(new Error('Cannot find bytecode file'))

      return bytecodeFile[actionName].apply(bytecodeFile, params.concat((err) => {
        if (err) return done(err)

        if (COMMIT_MESSAGE_MAPPING[actionName]) {
          var committableChange = COMMIT_MESSAGE_MAPPING[actionName](params)
          if (!committableChange.id) committableChange.id = _createChangeId()
          COMMITABLE_CHANGE_LIST.push(committableChange)
        }

        return done()
      }))
    }
  }

  return assign(methods, {
    fetchAssets: (message, done) => {
      return done(null, reloadAssetsDirectory())
    },

    linkAsset: ({ params: [abspath] }, done) => {
      const basename = path.basename(abspath)
      const relpath = path.join('designs', basename)
      const destination = path.join(folder, relpath)
      return fse.copy(abspath, destination, (copyErr) => {
        if (copyErr) return done(copyErr)
        return File.ingestOne(folder, relpath, (ingestErr) => {
          if (ingestErr) return done(ingestErr)
          return done(null, reloadAssetsDirectory())
        })
      })
    },

    unlinkAsset: ({ params: [relpath] }, done) => {
      if (!relpath || relpath.length < 2) return done(new Error('Relative path too short'))
      const abspath = path.join(folder, relpath)
      return fse.remove(abspath, (removeErr) => {
        if (removeErr) return done(removeErr)
        return File.expelOne(relpath, (expelErr) => {
          if (expelErr) return done(expelErr)
          return done(null, reloadAssetsDirectory())
        })
      })
    },

    selectElement: ({ params }, done) => {
      return done()
    },
    unselectElement: ({ params }, done) => {
      return done()
    },
    setTimelineName: ({ params }, done) => {
      activeComponent.setTimelineName.apply(activeComponent, params) // We may need this here to correctly assign properties if we end up using AC for all these actions
      return done()
    },
    setTimelineTime: ({ params }, done) => {
      activeComponent.setTimelineTime.apply(activeComponent, params) // We may need this here to correctly assign properties if we end up using AC for all these actions
      return done()
    },
    readMetadata: ({ params }, done) => {
      activeComponent.readMetadata.apply(activeComponent, params.concat(done))
    },
    readAllStateValues: ({ params }, done) => {
      activeComponent.readAllStateValues.apply(activeComponent, params.concat((err, states) => {
        return done(err, states)
      }))
    },
    readAllEventHandlers: ({ params }, done) => {
      activeComponent.readAllEventHandlers.apply(activeComponent, params.concat(done))
    },
    setInteractionMode: ({ params }, done) => {
      // I don't think MasterProcess needs to worry about our interaction mode?
      return done()
    },
    instantiateComponent: _bytecodeActionCreator('instantiateComponent'),
    deleteComponent: _bytecodeActionCreator('deleteComponent'),
    mergeDesign: _bytecodeActionCreator('mergeDesign'),
    applyPropertyValue: _bytecodeActionCreator('applyPropertyValue'),
    applyPropertyDelta: _bytecodeActionCreator('applyPropertyDelta'),
    applyPropertyGroupValue: _bytecodeActionCreator('applyPropertyGroupValue'),
    applyPropertyGroupDelta: _bytecodeActionCreator('applyPropertyGroupDelta'),
    resizeContext: _bytecodeActionCreator('resizeContext'),
    changeKeyframeValue: _bytecodeActionCreator('changeKeyframeValue'),
    changePlaybackSpeed: _bytecodeActionCreator('changePlaybackSpeed'),
    changeSegmentCurve: _bytecodeActionCreator('changeSegmentCurve'),
    changeSegmentEndpoints: _bytecodeActionCreator('changeSegmentEndpoints'),
    createKeyframe: _bytecodeActionCreator('createKeyframe'),
    createTimeline: _bytecodeActionCreator('createTimeline'),
    deleteKeyframe: _bytecodeActionCreator('deleteKeyframe'),
    deleteTimeline: _bytecodeActionCreator('deleteTimeline'),
    duplicateTimeline: _bytecodeActionCreator('duplicateTimeline'),
    joinKeyframes: _bytecodeActionCreator('joinKeyframes'),
    moveSegmentEndpoints: _bytecodeActionCreator('moveSegmentEndpoints'),
    moveKeyframes: _bytecodeActionCreator('moveKeyframes'),
    renameTimeline: _bytecodeActionCreator('renameTimeline'),
    sliceSegment: _bytecodeActionCreator('sliceSegment'),
    splitSegment: _bytecodeActionCreator('splitSegment'),
    zMoveToFront: _bytecodeActionCreator('zMoveToFront'),
    zMoveForward: _bytecodeActionCreator('zMoveForward'),
    zMoveBackward: _bytecodeActionCreator('zMoveBackward'),
    zMoveToBack: _bytecodeActionCreator('zMoveToBack'),
    reorderElement: _bytecodeActionCreator('reorderElement'),
    groupElements: _bytecodeActionCreator('groupElements'),
    ungroupElements: _bytecodeActionCreator('ungroupElements'),
    hideElements: _bytecodeActionCreator('hideElements'),
    pasteThing: _bytecodeActionCreator('pasteThing'),
    deleteThing: _bytecodeActionCreator('deleteThing'),
    upsertStateValue: _bytecodeActionCreator('upsertStateValue'),
    deleteStateValue: _bytecodeActionCreator('deleteStateValue'),
    upsertEventHandler: _bytecodeActionCreator('upsertEventHandler'),
    deleteEventHandler: _bytecodeActionCreator('deleteEventHandler'),
    writeMetadata: _bytecodeActionCreator('writeMetadata')
  })
}

var COMMIT_MESSAGE_MAPPING = {
  instantiateComponent: (params) => { return { message: `Instantiate element`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  deleteComponent: (params) => { return { message: `Delete element`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  mergeDesign: (params) => { return { message: `Merge design source`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  applyPropertyValue: (params) => { return { message: `Change property`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  applyPropertyDelta: (params) => { return { message: `Change property`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  applyPropertyGroupValue: (params) => { return { message: `Change properties`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  applyPropertyGroupDelta: (params) => { return { message: `Change properties`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  resizeContext: (params) => { return { message: `Resize artboard`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  changeKeyframeValue: (params) => { return { message: `Change keyframe value`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  changeSegmentCurve: (params) => { return { message: `Change transition curve`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  changeSegmentEndpoints: (params) => { return { message: `Change transition timing`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  createKeyframe: (params) => { return { message: `Create keyframe`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  createTimeline: (params) => { return { message: `Create timeline`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  deleteKeyframe: (params) => { return { message: `Delete keyframe`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  deleteTimeline: (params) => { return { message: `Remove timeline`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  duplicateTimeline: (params) => { return { message: `Copy timeline`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  joinKeyframes: (params) => { return { message: `Create transition curve`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  moveSegmentEndpoints: (params) => { return { message: `Move transition`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  moveKeyframes: (params) => { return { message: `Move keyframes`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  renameTimeline: (params) => { return { message: `Rename timeline`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  sliceSegment: (params) => { return { message: `Create keyframe inside transition`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  splitSegment: (params) => { return { message: `Remove transition curve`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  zMoveToFront: (params) => { return { message: `Move element to front`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  zMoveForward: (params) => { return { message: `Move element forward`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  zMoveBackward: (params) => { return { message: `Move element backward`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  zMoveToBack: (params) => { return { message: `Move element to back`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  reorderElement: (params) => { return { message: `Reorder elements`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  groupElements: (params) => { return { message: `Group elements`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  ungroupElements: (params) => { return { message: `Ungroup elements`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  pasteThing: (params) => { return { message: `Paste content`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  deleteThing: (params) => { return { message: `Delete content`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  upsertStateValue: (params) => { return { message: `Upsert state`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  deleteStateValue: (params) => { return { message: `Delete state`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  upsertEventHandler: (params) => { return { message: `Upsert event handler`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } },
  deleteEventHandler: (params) => { return { message: `Delete event handler`, relpath: activeComponent.fetchActiveBytecodeFile().get('relpath') } }
}

setInterval(function _atomicCommitWorker () {
  if (IS_COMMITTING) return void (0) // Only do one commit at a time

  if (IS_SAVING) return void (0) // The save process itself will create commits - don't let this worker interfere with that

  // Track when we're finished so we can avoid running two commit processes at the same time
  IS_COMMITTING = true
  function _done () {
    IS_COMMITTING = false
  }

  var listOfChanges = COMMITABLE_CHANGE_LIST.splice(0)
  if (listOfChanges.length < 1) return _done() // No changes to log

  var groupedItems = lodash.keyBy(listOfChanges, 'relpath') // lodash.keyBy overwrites duplicate enttries by key

  logger.info('[master] changes:', groupedItems)

  return async.eachOfSeries(groupedItems, (changeInfo, changedRelpath, nextItem) => {
    return setTimeout(() => { // doesGitHaveChanges ends up false if we don't wait in some cases [#RC]
      return _getFolderState('commit-worker', {}, null, 'master', null, null, {}, (folderStateErr, folderState) => {
        if (folderStateErr) {
          return nextItem(folderStateErr)
        }

        if (!folderState.doesGitHaveChanges) {
          logger.info(`[master] no changes detected; skipping`)

          // If git hasn't yet registered that this change exists, put it back in the stack since it still
          // needs to be run at some point in the future. But if we some how end with one or more of these in the
          // stack and never get to commit it, just remove it from the list since it's likely we already captured
          // it with someone else's commit. [#RC]
          if (!changeInfo.commitAttempts) changeInfo.commitAttempts = 0
          changeInfo.commitAttempts += 1
          if (changeInfo.commitAttempts < 3) {
            COMMITABLE_CHANGE_LIST.push(changeInfo)
          }

          return nextItem()
        }

        var commitOptions = {}
        commitOptions.commitMessage = `${changeInfo.message} (via Haiku Desktop)`

        return _commitProject(null, folderState.haikuUsername, folderState.hasHeadCommit, commitOptions, [changedRelpath], (err, commitId) => {
          if (err) return nextItem()

          folderState.commitId = commitId

          // HACK: If for some reason we never got a 'base' undoable before this point, set this cmomit as
          // the new base so that there are always commits from a base commit going forward
          let isBase = false
          let baseUndoable = GIT_UNDOABLES.filter((undoable) => {
            return undoable && undoable.isBase
          })[0]
          if (!baseUndoable) {
            isBase = true
          }

          logger.info(`[master] making commit ${commitId.toString()} undoable (as base: ${isBase})`)

          // For now, pretty much any commit we capture in this session is considered an undoable. We may want to
          // circle back and restrict it to only certain types of commits, but that does end up making the undo/redo
          // stack logic a bit more complicated.
          GIT_UNDOABLES.push({ commitId, changeId: changeInfo.id, isBase })

          return nextItem()
        })
      })
    }, 64)
  }, _done)
}, 64 * 8)

export default proc
