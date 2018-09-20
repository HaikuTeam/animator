const fse = require('fs-extra')
const {debounce} = require('lodash')
const path = require('path')
const {xmlToMana} = require('haiku-common/lib/layout/xmlUtils')
const expressionToRO = require('@haiku/core/lib/reflection/expressionToRO').default
const BaseModel = require('./BaseModel')
const logger = require('./../utils/LoggerInstance')
const {Experiment, experimentIsEnabled} = require('haiku-common/lib/experiments')
const getSvgOptimizer = require('./../svg/getSvgOptimizer')
const Lock = require('./Lock')
const Cache = require('./Cache')
const {bootstrapSceneFilesSync} = require('@haiku/sdk-client/lib/bootstrapSceneFilesSync')

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

    const scenename = this.project.relpathToSceneName(this.relpath)
    const uid = ActiveComponent.buildPrimaryKey(this.project.getFolder(), scenename)

    // Timeline/Glass/Creator should not write to the file system
    if (this.project.getAlias() === 'master' || this.project.getAlias() === 'test') {
      bootstrapSceneFilesSync(this.project.getFolder(), scenename, this.project.userconfig)
    }

    this.component = ActiveComponent.upsert({
      uid,
      file: this,
      relpath: this.relpath,
      project: this.project,
      scenename // This string is important for fs lookups to work
    })

    this.mod = ModuleWrapper.upsert({
      component: this.component,
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

    // pendingRequestedFlush keeps tracks between requestAsyncContentFlush and when debouncedFlushContent is triggered
    this.pendingRequestedFlush = false
    // pendingWrite keeps tracks between flushContent and when async write is executed
    this.pendingWrite = false

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

  updateInMemoryHotModule (bytecode, cb) {
    // In no circumstance do we want to write bad bytecode to in-memory pointer.
    // so instead of returning an error message, we crash the app in hope
    // that a full restart will resolve the condition leading to this.
    // Throwing here should also give insight into when/why this occurs.
    this.assertBytecode(bytecode)

    this.dtModified = Date.now()

    return this.mod.update(bytecode, () => {
      // Helps detect whether we need to assert that bytecode is present
      this._numBytecodeUpdates++
      return cb()
    })
  }

  requestAsyncContentFlush () {
    this.pendingRequestedFlush = true
    // Note: We don't actually write to disk unless options.doWriteToDisk is truthy
    this.debouncedFlushContent()
  }

  awaitNoFurtherContentFlushes (cb) {
    // If there isn't pending flush request or write request, keep waiting (setTimeout allows going
    // back to nodejs event loop, so write debouncedFlushContent/async write can be executed)
    if (this.pendingRequestedFlush || this.pendingWrite) {
      return setTimeout(
        () => this.awaitNoFurtherContentFlushes(cb),
        AWAIT_CONTENT_FLUSH_TIMEOUT
      )
    }

    return cb()
  }

  updateContents (contents) {
    this.contents = contents
  }

  trackContentsAndGetCode () {
    this.updateContents(
      this.ast.updateWithBytecodeAndReturnCode(
        this.mod.fetchInMemoryExport(), // The current bytecode
        this.contents // The previous contents
      )
    )

    return this.contents // The updated contents
  }

  flushContent () {
    // When flushContent is executed, clear pending requested flush and set pendingWrite
    this.pendingRequestedFlush = false

    // We track this whether or not we actually write to disk so we can use it to determine
    // whether a module reload is required to retrieve the latest contents from disk.
    this.dtLastWriteStart = Date.now()

    if (!this.options.doWriteToDisk) {
      return
    }

    // The following method calls are all "heavy" and only pertain to situations where we
    // write to disk or need the full code string, so thye are skipped in the case
    // that the options.doWriteToDisk flag is falsy.
    this.trackContentsAndGetCode() // <~ Populates this.contents
    this.assertContents(this.contents)

    this.pendingWrite = true

    return this.write((err) => {
      if (err) throw err
      this.pendingWrite = false
    })
  }

  flushContentForceSync () {
    this.trackContentsAndGetCode() // <~ Populates this.contents
    this.writeSync()
  }

  maybeFlushContentForceSync () {
    if (this.options.doWriteToDisk) {
      this.flushContentForceSync()
    }
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

  write (cb) {
    if (!this.options.doWriteToDisk) {
      throw new Error('[file] illegal write requested')
    }
    this.assertContents(this.contents)
    logger.info(`[file] async writing ${this.relpath} to disk`)
    return File.write(this.folder, this.relpath, this.contents, (err) => {
      if (err) {
        logger.info(`[file] error writing ${this.relpath} to disk`, err)
        return cb(err)
      }
      return cb()
    })
  }

  writeSync () {
    if (!this.options.doWriteToDisk) {
      throw new Error('[file] illegal write requested')
    }
    this.assertContents(this.contents)
    logger.info(`[file] sync writing ${this.relpath} to disk`)
    const abspath = path.join(this.folder, this.relpath)
    fse.outputFileSync(abspath, this.contents)
  }

  getAbspath () {
    return path.join(this.folder, this.relpath)
  }

  getFolder () {
    return path.dirname(this.getAbspath())
  }

  isCode () {
    return this.type === FILE_TYPES.code
  }

  isDesign () {
    return this.type === FILE_TYPES.design
  }

  getImportPathTo (source) {
    // In case of builtin/installed components, we don't want to prefix with the dot :/
    // See also Asset#getLocalizedRelpath, Template#normalizePathOfPossiblyExternalModule
    // e.g. @haiku/core/components/controls/HTML
    // TODO: e.g. some-other-haiku-proj/moocow
    if (source[0] === '@') {
      return source
    }

    return Template.normalizePath(path.relative(path.dirname(this.relpath), source))
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
   * reified bytecode by itself probably has a template that contains .layout properties, etc.
   */
  getReifiedDecycledBytecode (cleanManaOptions = {}) {
    const reified = this.getReifiedBytecode()
    return Bytecode.decycle(reified, { cleanManaOptions, doCleanMana: true })
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
    const serialized = expressionToRO(reified) // This returns a *new* object
    return serialized
  }
}

BaseModel.extend(File)

File.TYPES = FILE_TYPES

File.DEFAULT_OPTIONS = {
  doWriteToDisk: false, // Write all actions/content updates to disk
  skipDiffLogging: true, // Log a colorized diff of every content update
  required: {
    relpath: true,
    folder: true,
    project: true
  }
}

File.DEFAULT_CONTEXT_SIZE = DEFAULT_CONTEXT_SIZE

File.cache = new Cache()

File.write = (folder, relpath, contents, cb) => {
  const abspath = path.join(folder, relpath)
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

File.expelOne = (folder, relpath, cb) => {
  // TODO
  const file = File.findById(path.join(folder, relpath))
  if (file) {
    file.destroy()
  }
  cb()
}

File.buildManaCacheKey = (folder, relpath) => {
  return `mana:${path.join(folder, relpath)}`
}

/**
 * @method readMana
 * @description Given the relative path to an SVG file, read the file into
 * memory, parse the contents, and return the respective 'mana' data object.
 * @param relpath {String} Relative path to SVG design asset within folder
 * @param cb {Function} Callback
 */
File.readMana = (folder, relpath, cb) => {
  return File.cache.async(File.buildManaCacheKey(folder, relpath), (done) => {
    return File.read(folder, relpath, (err, buffer) => {
      if (err) return done(err)

      const xml = buffer.toString()

      const returnUnoptimizedMana = () => {
        const manaFull = xmlToMana(xml)

        if (!manaFull) {
          return done(new Error(`We couldn't load the contents of ${relpath}`))
        }

        if (experimentIsEnabled(Experiment.NormalizeSvgContent)) {
          return done(null, Template.normalize(manaFull))
        }

        return done(null, manaFull)
      }

      return getSvgOptimizer().optimize(xml, { path: path.join(folder, relpath) }).then((contents) => {
        const manaOptimized = xmlToMana(contents.data)

        if (!manaOptimized) {
          throw new Error(`We couldn't load the contents of ${relpath}`)
        }

        if (experimentIsEnabled(Experiment.NormalizeSvgContent)) {
          return done(null, Template.normalize(manaOptimized))
        }

        return done(null, manaOptimized)
      })
        .catch((exception) => {
          // Log the exception too in case the error occurred as part of our pipeline
          logger.warn(`[file] svgo couldn't parse ${relpath}`, exception)

          return setTimeout(() => { // Escape promise chain so exceptions occur with more normal traces
            return returnUnoptimizedMana()
          })
        })
    })
  }, cb, (mana) => {
    // Must clone the template here since mutation will occur in-place
    return Template.clone({}, mana)
  })
}

const _isFileCode = (relpath) => {
  return path.extname(relpath) === '.js'
}

module.exports = File

// Down here to avoid Node circular dependency stub objects. #FIXME
const AST = require('./AST')
const Bytecode = require('./Bytecode')
const ActiveComponent = require('./ActiveComponent')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')
