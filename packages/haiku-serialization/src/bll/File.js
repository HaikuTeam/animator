const async = require('async')
const fse = require('fs-extra')
const {debounce} = require('lodash')
const path = require('path')
const xmlToMana = require('@haiku/core/lib/helpers/xmlToMana').default
const objectToRO = require('@haiku/core/lib/reflection/objectToRO').default
const BaseModel = require('./BaseModel')
const logger = require('./../utils/LoggerInstance')
const walkFiles = require('./../utils/walkFiles')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const getSvgOptimizer = require('./../svg/getSvgOptimizer')
const Lock = require('./Lock')

// This file also depends on '@haiku/core/lib/HaikuComponent'
// in the sense that one of those instances is assigned as .hostInstance here.
// ^^ Leave this message in this file so we can grep for it if necessary

const DEFAULT_CONTEXT_SIZE = { width: 550, height: 400 }
const DISK_FLUSH_TIMEOUT = 500
const AWAIT_CONTENT_FLUSH_TIMEOUT = 0

const FILE_TYPES = {
  design: 'design',
  code: 'code'
}

/**
 * @class File
 * @description
 *.  Abstraction of Files that are contained in a project.
 *.  WARNING: Contains a lot of legacy code which extends its responsibilities
 *.  quite a bit further than what you would expect its purview to be.
 *.  Worth a refactor. Many methods here belong in ActiveComponent or elsewhere.
 */
class File extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this.mod = ModuleWrapper.upsert({
      uid: this.getAbspath(),
      file: this
    })

    this.ast = AST.upsert({
      uid: this.getAbspath(),
      file: this
    })

    this.debouncedFlushContent = debounce(() => {
      this.flushContent()
    }, DISK_FLUSH_TIMEOUT)

    // We don't reassign this on every initialize because that would make this
    // pointless to track given that ingestOne would reset this value
    this._pendingContentFlushes = []

    // Important: Please see afterInitialize for assigned properties
  }

  // Hook called automatically by BaseModel during construction or upsert
  afterInitialize () {
    // Track how many times we've updated our in-memory content.
    // This runs as an afterInitialize hook because when the user navigates from
    // the dashboard to the editor, this object will be reused, meaning that the
    // content and bytecode validity assertion will run, which depend on this
    // value reflecting the number of the times per session that updates occurred
    this._numBytecodeUpdates = 0
  }

  updateInMemoryHotModule (bytecode) {
    // In no circumstance do we want to write bad bytecode to in-memory pointer.
    // so instead of returning an error message, we crash the app in hope
    // that a full restart will resolve the condition leading to this.
    // Throwing here should also give insight into when/why this occurs.
    this.assertBytecode(bytecode)

    this.dtModified = Date.now()

    this.mod.update(bytecode)

    // Helps detect whether we need to assert that bytecode is present
    this._numBytecodeUpdates++
  }

  requestAsyncContentFlush (flushSpec) {
    this._pendingContentFlushes.push(flushSpec)
    this.debouncedFlushContent()
  }

  awaitNoFurtherContentFlushes (cb) {
    if (this._pendingContentFlushes.length > 0) {
      return setTimeout(
        () => this.awaitNoFurtherContentFlushes(cb),
        AWAIT_CONTENT_FLUSH_TIMEOUT
      )
    }

    return cb()
  }

  flushContent () {
    // We're about to flush content for all requests received up to this point
    // If more occur during async, that's fine; we'll just get called again,
    // but those who need to wait can read the list to know what's still pending
    this._pendingContentFlushes.splice(0)

    const bytecode = this.mod.fetchInMemoryExport()
    const incoming = this.ast.updateWithBytecodeAndReturnCode(bytecode)

    this.assertContents(incoming)

    this.previous = this.contents
    this.contents = incoming

    this.maybeLogDiff(this.previous, this.contents)

    return this.write((err) => {
      if (err) throw err
    })
  }

  assertBytecode (bytecode) {
    // If we have a blank bytecode object after the first couple of updates,
    // that usually means we're about to end up with a "Red Wall of Death"
    if (this._numBytecodeUpdates > 1) {
      if (Object.keys(bytecode).length < 2) {
        throw new Error(`Bytecode object was empty ${this.getAbspath()}`)
      }
    }
  }

  assertContents (contents) {
    if (typeof contents !== 'string') {
      throw new Error(`Code was invalid ${this.getAbspath()}`)
    }

    // Returns truthy for "", " ", "   \n ", etc.
    if (contents.match(/^\s*$/)) {
      throw new Error(`Code was blank ${this.getAbspath()}`)
    }
  }

  maybeLogDiff (previous, contents) {
    if (!this.options.skipDiffLogging) {
      if (this.isCode()) {
        // Diffs of 'snapshots' or bundled code are usually fairly useless to show and too long anyway.
        // These files are written as part of the save process
        if (!_looksLikeMassiveFile(this.relpath)) {
          logger.diff(previous, contents, { relpath: this.relpath })
        }
      }
    }
  }

  write (cb) {
    this.assertContents(this.contents)
    this.dtLastWriteStart = Date.now()
    logger.info(`[file] writing ${this.relpath} to disk`)
    return File.write(this.folder, this.relpath, this.contents, (err) => {
      this.dtLastWriteEnd = Date.now()
      if (err) {
        logger.info(`[file] error writing ${this.relpath} to disk`, err)
        return cb(err)
      }
      return cb()
    })
  }

  getAbspath () {
    return path.join(this.folder, this.relpath)
  }

  isCode () {
    return this.type === FILE_TYPES.code
  }

  isDesign () {
    return this.type === FILE_TYPES.design
  }

  /**
   * @method getReifiedBytecode
   * @description Return the reified form of the bytecode, that is, with actual functions, references,
   * and instances present as they would be if it were being executed in memory.
   */
  getReifiedBytecode () {
    // NOTE: Due to a legacy issue there used to be the assumption that the bytecode file could contain
    // multiple bytecodes, hence the [0]; that is no longer the case and this should be refactored! #FIXME
    return this.mod.fetchInMemoryExport()
  }

  /**
   * @method getReifiedDecycledBytecode
   * @description Similar to getReifiedBytecode but removes internal object pointers/annotations which either cause
   * serialization issues or which have the effect of adding too much metadata to the object. For example, the
   * reified bytecode by itself probably has a template that contains .__depth, .__parent, .layout properties, etc.
   */
  getReifiedDecycledBytecode () {
    const reified = this.getReifiedBytecode()
    return Bytecode.decycle(reified, { doCleanMana: true })
  }

  /**
   * @method getSerializedBytecode
   * @description Return the serialized form of the bytecode, that is, with all of its contents converted
   * into a form that can be safely transmitted over the wire. Functions get converted to function specifications,
   * identifiers are replaced with identifier descriptors, etc.
   * Note that this returns a new object; it doesn't serialize the bytecode in place. I.e., you can't
   * mutate the returned object and expect that to affect the live in-memory bytecode, nor the file system.
   */
  getSerializedBytecode () {
    const reified = this.getReifiedDecycledBytecode()
    Bytecode.cleanBytecode(reified)
    const serialized = objectToRO(reified) // This returns a *new* object
    return serialized
  }

  /**
   * @method read
   * @description Reads a file's filesystem contents into memory. Useful if you have a reference but need its content.
   */
  read (cb) {
    return File.ingestOne(this.folder, this.relpath, (err) => {
      if (err) return cb(err)
      return cb(null, this)
    })
  }
}

BaseModel.extend(File)

File.TYPES = FILE_TYPES

File.DEFAULT_OPTIONS = {
  doWriteToDisk: true, // Write all actions/content updates to disk
  skipDiffLogging: false, // Log a colorized diff of every content update
  required: {
    relpath: true,
    folder: true
  }
}

File.DEFAULT_CONTEXT_SIZE = DEFAULT_CONTEXT_SIZE

File.write = (folder, relpath, contents, cb) => {
  let abspath = path.join(folder, relpath)
  return Lock.request(Lock.LOCKS.FileReadWrite(abspath), true, (release) => {
    return fse.outputFile(abspath, contents, (err) => {
      release()
      if (err) return cb(err)
      return cb()
    })
  })
}

File.read = (folder, relpath, cb) => {
  let abspath = path.join(folder, relpath)
  return Lock.request(Lock.LOCKS.FileReadWrite(abspath), false, (release) => {
    return fse.readFile(abspath, (err, buffer) => {
      release()
      if (err) return cb(err)
      return cb(null, buffer.toString())
    })
  })
}

File.isPathCode = (relpath) => {
  return _isFileCode(relpath)
}

File.ingestOne = (folder, relpath, cb) => {
  // This can be used to determine if an in-memory-only update occurred after or before a filesystem update.
  // Track it here so we get an accurate picture of when the ingestion routine actually began, including before
  // we actually talked to the real filesystem, which can take some time
  const dtLastReadStart = Date.now()

  return File.ingestContents(folder, relpath, { dtLastReadStart }, cb)
}

File.ingestContents = (folder, relpath, { dtLastReadStart }, cb) => {
  // Note: The only properties that should be in the object at this point should be relpath and folder,
  // otherwise the upsert won't work correctly since it uses these props as a comparison
  const fileAttrs = {
    uid: path.normalize(path.join(folder, relpath)),
    relpath,
    folder
  }

  const file = File.upsert(fileAttrs)

  // Let what's happening in-memory have higher precedence than on-disk changes
  // since it's more likely that we'll be loading in stale content during fast updates,
  // which leads to races such as with copy/paste, undo/redo, etc
  return file.awaitNoFurtherContentFlushes(() => {
    // See the note under ingestOne to understand why this gets set here
    file.dtLastReadStart = dtLastReadStart || Date.now()

    if (File.isPathCode(relpath)) {
      file.type = FILE_TYPES.code
    } else {
      file.type = 'other'
    }

    return file.mod.isolatedForceReload((err, bytecode) => {
      if (err) return cb(err)

      file.updateInMemoryHotModule(bytecode)

      // This can be used to determine if an in-memory-only update occurred
      // after or before a filesystem update. Use to decid whether to code reload
      file.dtLastReadEnd = Date.now()

      return cb(null, file)
    })
  })
}

File.expelOne = (folder, relpath, cb) => {
  // TODO
  const file = File.findById(path.join(folder, relpath))
  if (file) {
    file.destroy()
  }
  cb()
}

File.ingestFromFolder = (folder, options, cb) => {
  const isExcluded = (relpath) => {
    if (!options) return false
    if (!options.exclude) return false
    return options.exclude(relpath)
  }

  return walkFiles(folder, (err, entries) => {
    if (err) return cb(err)
    const picks = []
    entries.forEach((entry) => {
      const relpath = path.relative(folder, entry.path)
      // Don't ingest massive bundle files that have no business being in memory
      // Also skip any files that match any exclude patterns passed in with the options
      if (!_looksLikeMassiveFile(relpath) && !isExcluded(relpath)) {
        return picks.push(entry)
      }
    })
    // Load the code first, then designs. This is so we can merge design changes!
    return async.mapSeries(picks, (entry, next) => {
      const relpath = path.relative(folder, entry.path)
      return File.ingestOne(folder, relpath, next)
    }, (err, files) => {
      if (err) return cb(err)
      return cb(null, files)
    })
  })
}

/**
 * @method readMana
 * @description Given the relative path to an SVG file, read the file into
 * memory, parse the contents, and return the respective 'mana' data object.
 * @param relpath {String} Relative path to SVG design asset within folder
 * @param cb {Function} Callback
 */
File.readMana = (folder, relpath, cb) => {
  return File.read(folder, relpath, (err, buffer) => {
    if (err) return cb(err)

    const xml = buffer.toString()

    const returnUnoptimizedMana = () => {
      const manaFull = xmlToMana(xml)

      if (!manaFull) {
        return cb(new Error(`We couldn't load the contents of ${relpath}`))
      }

      if (experimentIsEnabled(Experiment.NormalizeSvgContent)) {
        return cb(null, Template.normalize(manaFull))
      }

      return cb(null, manaFull)
    }

    if (experimentIsEnabled(Experiment.SvgOptimizer)) {
      return getSvgOptimizer().optimize(xml, { path: path.join(folder, relpath) }).then((contents) => {
        const manaOptimized = xmlToMana(contents.data)

        if (!manaOptimized) {
          return cb(new Error(`We couldn't load the contents of ${relpath}`))
        }

        if (experimentIsEnabled(Experiment.NormalizeSvgContent)) {
          return cb(null, Template.normalize(manaOptimized))
        }

        return cb(null, manaOptimized)
      })
      .catch((exception) => {
        // Log the exception too in case the error occurred as part of our pipeline
        logger.warn(`[file] svgo couldn't parse ${relpath}`, exception)

        return setTimeout(() => { // Escape promise chain so exceptions occur with more normal traces
          return returnUnoptimizedMana()
        })
      })
    } else {
      return returnUnoptimizedMana()
    }
  })
}

const _isFileCode = (relpath) => {
  return path.extname(relpath) === '.js'
}

const _looksLikeMassiveFile = (relpath) => {
  return relpath.match(/\.(standalone|bundle|embed)\.(js|html)$/)
}

module.exports = File

// Down here to avoid Node circular dependency stub objects. #FIXME
const AST = require('./AST')
const Bytecode = require('./Bytecode')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')
