const path = require('path')
const BaseModel = require('./BaseModel')
const overrideModulesLoaded = require('./../utils/overrideModulesLoaded')
const Lock = require('./Lock')
const logger = require('./../utils/LoggerInstance')

// When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
const CANONICAL_CORE_SOURCE_CODE_PATH = path.dirname(require.resolve('@haiku/core'))

const REPLACEMENT_MODULES = {
  // legacy name
  'haiku.ai/player/dom': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom'), // <~ Note how this points to @haiku/core
  'haiku.ai/player/dom/index': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom'), // <~ Note how this points to @haiku/core
  'haiku.ai/player/dom/react': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom', 'react'), // <~ Note how this points to @haiku/core

  // legacy name
  '@haiku/player': CANONICAL_CORE_SOURCE_CODE_PATH,
  '@haiku/player/dom': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom'), // <~ Note how this points to @haiku/core
  '@haiku/player/dom/index': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom'), // <~ Note how this points to @haiku/core
  '@haiku/player/dom/react': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom', 'react'), // <~ Note how this points to @haiku/core

  // current name
  '@haiku/core': CANONICAL_CORE_SOURCE_CODE_PATH,
  '@haiku/core/dom': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom'),
  '@haiku/core/dom/index': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom'),
  '@haiku/core/dom/react': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom', 'react')
}

const CORE_PACKAGE_JSON = require(path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'package.json'))
const CORE_VERSION = CORE_PACKAGE_JSON.version

// In race conditions where the project node_modules is changed while monkeypatch
// is occurring, this allows project dependencies to be loaded without crashing
const haikuCore = require('@haiku/core')
const Module = require('module')
const originalRequire = Module.prototype.require
Module.prototype.require = function (request) {
  if (request === '@haiku/core') return haikuCore
  return originalRequire.apply(this, arguments)
}

/**
 * @class Mod
 * @description
 *.  Abstraction over an in-memory JavaScript module which we may want to...
 *.    - Hot-reload at runtime and seamlessly replace
 *.    - Hot-update and then write back to disk, via File
 *.  Handles reloading the module using require(...) += a few useful config
 *.  settings through which you can specify the exact require behavior.

 *.  Also has static functions and other utilities for module pathing within
 *.  the host project folder, used extensively throughout the app.
 *
 *.  Also contains a variety of useful constants related to module pathing.
 */
class ModuleWrapper extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this.exp = null // Safest to set to null until we really load the content

    this._hasLoadedAtLeastOnce = false
    this._hasMonkeypatchedContent = false
    this._projectConfig = null
  }

  hasLoadedAtLeastOnce () {
    return this._hasLoadedAtLeastOnce
  }

  hasMonkeypatchedContent () {
    return this._hasMonkeypatchedContent
  }

  fetchInMemoryExport () {
    return this.exp
  }

  isolatedClearCache () {
    ModuleWrapper.clearRequireCache(path.dirname(this.getAbspath()))
    // Unset this since the content would have been removed by this,
    // and we use this to detect whether we want to reload from fs
    this._hasMonkeypatchedContent = false
  }

  reloadExtantModule (cb) {
    if (this.hasLoadedAtLeastOnce() || this.hasMonkeypatchedContent()) {
      return this.reload(cb)
    }
    // This may not work if the file doesn't seem to exist on disk yet, but will only warn
    return this.isolatedForceReload(cb)
  }

  globalForceReload (cb) {
    ModuleWrapper.clearRequireCache()
    return this.reload(cb)
  }

  isolatedForceReload (cb) {
    this.isolatedClearCache()
    return this.reload(cb)
  }

  configuredReload (config, cb) {
    if (!config) return this.isolatedForceReload(cb)
    if (!config.reloadMode) return this.isolatedForceReload(cb)
    switch (config.reloadMode) {
      case ModuleWrapper.RELOAD_MODES.GLOBAL: return this.globalForceReload(cb)
      case ModuleWrapper.RELOAD_MODES.ISOLATED: return this.isolatedForceReload(cb)
      case ModuleWrapper.RELOAD_MODES.CACHE: return this.reload(cb)
      case ModuleWrapper.RELOAD_MODES.MONKEYPATCHED_OR_ISOLATED:
        if (this._hasMonkeypatchedContent) {
          return this.reload(cb)
        } else {
          return this.isolatedForceReload(cb)
        }
      default: return this.isolatedForceReload(cb)
    }
  }

  getModpath () {
    return this.file.relpath
  }

  getAbspath () {
    if (this.isExternalModule) {
      return require.resolve(this.getModpath())
    }

    let abspath = path.normalize(this.file.getAbspath())

    // Handle Mac temporary folder discrepency so its key in require.cache is correct
    if (abspath.slice(0, 5) === '/var/') {
      abspath = `/private${abspath}`
    }

    return abspath
  }

  getProjectConfig () {
    if (this._projectConfig) {
      return this._projectConfig
    }
    try {
      this._projectConfig = require(path.join(this.file.folder, 'haiku.js'))
      return this._projectConfig
    } catch (exception) {
      logger.warn('[module wrapper] Cannot load haiku.js')
      this._projectConfig = {}
      return this._projectConfig
    }
  }

  load () {
    overrideModulesLoaded(
      (stop) => {
        this.exp = require(this.getAbspath())
        this._hasLoadedAtLeastOnce = true
        this.update(this.exp)

        // Tell the node hook to stop interfering with require(...)
        stop()
      },
      ModuleWrapper.getHaikuKnownImportMatch
    )
  }

  reload (cb) {
    return Lock.request(Lock.LOCKS.FileReadWrite(this.getAbspath()), false, (release) => {
      try {
        this.load()
      } catch (exception) {
        logger.warn('[module wrapper] ' + this.getAbspath() + ' could not be loaded (' + exception + ')')
        this.exp = null
        release()
        return cb()
      }

      release()
      return cb(null, this.exp)
    })
  }

  moduleAsMana (identifier, contextDirAbspath, cb) {
    return this.reload((err, exp) => {
      if (err) return cb(err)
      if (!exp) return cb(null, null)

      let source
      if (this.isExternalModule) {
        source = this.getModpath()
      } else {
        source = path.normalize(path.relative(contextDirAbspath, this.getAbspath()))
      }

      const safe = {} // Clone to avoid clobbering/polluting with these properties

      for (const key in exp) safe[key] = exp[key]
      safe.__module = source
      safe.__reference = identifier

      return cb(null, {
        // Nested components are represented thusly:
        // - The element name is the bytecode of the subcomponent
        // - When serialized the element name becomes just an identifier in the code
        // - Upon reification, it's loaded as bytecode with the appropriate __-references
        elementName: safe,
        attributes: {
          source, // This important and is used for lookups relative to the host component
          identifier, // This is important when reloading bytecode with instantiated components from disk
          'haiku-title': identifier // This is used for display in the Timeline, Stage, etc
        },
        children: []
      })
    })
  }

  update (bytecode) {
    const config = this.getProjectConfig()

    // Reassign in case our bytecode was empty and we created a new object
    this.exp = Bytecode.reinitialize(
      this.file.folder,
      path.normalize(this.file.relpath),
      bytecode,
      config
    )

    // Set whatever is in require.cache and make sure that everybody
    // else is using the same bytecode we have just updated in place
    this.monkeypatch(this.exp)
  }

  monkeypatch (exportsObject) {
    if (!require.cache[this.getAbspath()]) {
      // We ensure the full require.cache is populated with our entry;
      // since the cache entry is complex, we use require's own mechanism
      require(this.getAbspath())
    }

    this._hasMonkeypatchedContent = true
    require.cache[this.getAbspath()].exports = exportsObject

    return exportsObject
  }
}

ModuleWrapper.DEFAULT_OPTIONS = {
  required: {
    file: true
  }
}

BaseModel.extend(ModuleWrapper)

/**
 * @function modulePathToIdentifierName
 * @description Convert a module path into an identifier name for the module.
 */
ModuleWrapper.modulePathToIdentifierName = (modulepath) => {
  // @haiku/blah/foo.js -> @haiku/blah/foo
  const nicepath = path.dirname(modulepath) + path.sep + path.basename(modulepath, path.extname(modulepath))

  const parts = nicepath.split(path.sep)

  // Underscoreize the path, so @haiku/core/blah/blah -> haiku_core_blah_blah
  return parts.map((part) => {
    return part.replace(/\W+/g, '_')
  }).join('_').slice(1) // Remove leading `_`
}

ModuleWrapper.getScenenameFromRelpath = (relpath) => {
  return path.normalize(relpath).split(path.sep)[1]
}

/**
 * @function identifierToLocalModpath
 * @description Given an identifier, return the path to the code module
 */
ModuleWrapper.identifierToLocalModpath = (identifier) => {
  return path.join('code', identifier, 'code.js')
}

/**
 * @function getHaikuKnownImportMatch
 * @description Convert a known import path to an application local installation
 */
ModuleWrapper.getHaikuKnownImportMatch = (importPath) => {
  const normalizedPath = importPath.trim().toLowerCase()

  if (normalizedPath in REPLACEMENT_MODULES) {
    return REPLACEMENT_MODULES[normalizedPath]
  }

  // not a good general solution, but good enough for player components
  return importPath.replace(/^@haiku\/player/, REPLACEMENT_MODULES['@haiku/player'])
                   .replace(/^@haiku\/core/, REPLACEMENT_MODULES['@haiku/core'])
}

ModuleWrapper.clearRequireCache = (dirname) => {
  for (const key in require.cache) {
    if (dirname) {
      if (key.indexOf(dirname) !== -1) {
        delete require.cache[key]
      }
    } else if (!key.match(/node_modules/)) {
      delete require.cache[key]
    }
  }
}

ModuleWrapper.doesRelpathLookLikeLocalComponent = (relpath) => {
  const parts = path.normalize(relpath).split(path.sep)
  return (
    path.basename(relpath) === 'code.js' &&
    parts[0] === 'code' &&
    parts.length === 3 // e.g. code/foo/code.js
  )
}

ModuleWrapper.doesRelpathLookLikeSVGDesign = (relpath) => {
  return path.extname(relpath) === '.svg'
}

ModuleWrapper.doesRelpathLookLikeInstalledComponent = (relpath) => {
  const parts = path.normalize(relpath).split(path.sep)
  return parts[0] === '@haiku'
}

ModuleWrapper.CORE_VERSION = CORE_VERSION

ModuleWrapper.RELOAD_MODES = {
  GLOBAL: 1, // Completely clear the require cache
  ISOLATED: 2, // Only clear the require cache for the module folder in question
  CACHE: 3, // Just load the module using whatever may be cached,
  MONKEYPATCHED_OR_ISOLATED: 4 // If monkeypatched, use that, otherwise load from disk
}

module.exports = ModuleWrapper

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
