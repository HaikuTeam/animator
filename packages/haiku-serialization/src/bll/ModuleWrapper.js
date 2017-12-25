const path = require('path')
const BaseModel = require('./BaseModel')
const overrideModulesLoaded = require('./../utils/overrideModulesLoaded')

// When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
const NODE_MODULES_PATH = path.join(__dirname, '..', '..', '..', '..', 'node_modules')

const REPLACEMENT_MODULES = {
  // legacy name (global npm)
  'haiku.ai/player/dom': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  'haiku.ai/player/dom/index': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  'haiku.ai/player/dom/react': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom', 'react'),

  // new name (haiku org npm)
  '@haiku/player': path.join(NODE_MODULES_PATH, '@haiku', 'player'),
  '@haiku/player/dom': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  '@haiku/player/dom/index': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  '@haiku/player/dom/react': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom', 'react')
}

const CANONICAL_PLAYER_SOURCE_CODE_PATH = path.join(NODE_MODULES_PATH, '@haiku', 'player')
const PLAYER_PACKAGE_JSON = require(path.join(CANONICAL_PLAYER_SOURCE_CODE_PATH, 'package.json'))
const PLAYER_VERSION = PLAYER_PACKAGE_JSON.version

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
    this._loadError = null
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

  globalForceReload () {
    ModuleWrapper.clearRequireCache()
    return this.reload()
  }

  isolatedForceReload () {
    this.isolatedClearCache()

    return this.reload()
  }

  configuredReload (config) {
    if (!config) return this.isolatedForceReload()
    if (!config.reloadMode) return this.isolatedForceReload()
    switch (config.reloadMode) {
      case ModuleWrapper.RELOAD_MODES.GLOBAL: return this.globalForceReload()
      case ModuleWrapper.RELOAD_MODES.ISOLATED: return this.isolatedForceReload()
      case ModuleWrapper.RELOAD_MODES.CACHE: return this.reload()
      case ModuleWrapper.RELOAD_MODES.MONKEYPATCHED_OR_ISOLATED:
        if (this._hasMonkeypatchedContent) {
          return this.reload()
        } else {
          return this.isolatedForceReload()
        }
      default: return this.isolatedForceReload()
    }
  }

  getAbspath () {
    let abspath = path.normalize(this.file.getAbspath())
    // Handle Mac temporary folder discrepency so its key in require.cache is correct
    if (abspath.slice(0, 5) === '/var/') {
      abspath = `/private${abspath}`
    }
    return abspath
  }

  reload () {
    this._loadError = null

    return overrideModulesLoaded((stop) => {
      try {
        this.exp = require(this.getAbspath())

        // Avoid race conditions with downstream asking for the monkeypatched one
        // which we may as well set here since we just loaded it
        this.monkeypatch(this.exp, true)

        this._hasLoadedAtLeastOnce = true
      } catch (exception) {
        console.warn('[mod] ' + this.getAbspath() + ' could not be loaded (' + exception + ')')
        this._loadError = exception
        this.exp = null
      }

      stop() // Tell the node hook to stop interfering

      return this.exp
    }, ModuleWrapper.getHaikuKnownImportMatch)
  }

  moduleAsMana (identifierName, contextDirAbspath) {
    const exp = this.reload()
    if (!exp) return null
    const relpath = path.normalize(path.relative(contextDirAbspath, this.getAbspath()))
    const safe = {} // Clone to avoid clobbering/polluting with these properties
    for (const key in exp) safe[key] = exp[key]
    safe.__module = relpath
    safe.__reference = identifierName
    return {
      // Nested components are represented thusly:
      // - The element name is the bytecode of the subcomponent
      // - When serialized the element name becomes just an identifier in the code
      // - Upon reification, it's loaded as bytecode with the appropriate __-references
      elementName: safe,
      attributes: {
        source: relpath,
        'haiku-title': identifierName
      },
      children: []
    }
  }

  monkeypatch (exportsObject, noReloadToAvoidInfiniteLoop) {
    if (!require.cache[this.getAbspath()]) {
      require(this.getAbspath()) // Ensure it's populated if not already; kind of weird :/
    }
    this._hasMonkeypatchedContent = true
    require.cache[this.getAbspath()].exports = exportsObject
    if (noReloadToAvoidInfiniteLoop) return exportsObject
    return this.reload()
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
  const parts = modulepath.split(path.sep)

  // We can assume we have a *normalized* module path name at this point, e.g...
  // Haiku builtin format: @haiku/player/components/Path/code/main/code
  if (parts[0] === '@haiku' && parts[1] === 'player') {
    return 'Haiku' + parts[3] // e.g. HaikuPath, HaikuLine, etc.
  }

  // Installed Haiku format: @haiku/MyTeam/MyComponent/code/main/code
  // MyTeam_MyComponent
  return parts[1] + '_' + parts[2]
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

ModuleWrapper.CANONICAL_PLAYER_SOURCE_CODE_PATH = CANONICAL_PLAYER_SOURCE_CODE_PATH
ModuleWrapper.PLAYER_VERSION = PLAYER_VERSION

ModuleWrapper.RELOAD_MODES = {
  GLOBAL: 1, // Completely clear the require cache
  ISOLATED: 2, // Only clear the require cache for the module folder in question
  CACHE: 3, // Just load the module using whatever may be cached,
  MONKEYPATCHED_OR_ISOLATED: 4 // If monkeypatched, use that, otherwise load from disk
}

module.exports = ModuleWrapper
