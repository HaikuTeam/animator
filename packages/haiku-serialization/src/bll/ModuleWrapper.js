const path = require('path');
const fs = require('fs');
const BaseModel = require('./BaseModel');
const overrideModulesLoaded = require('./../utils/overrideModulesLoaded');
const Lock = require('./Lock');
const logger = require('./../utils/LoggerInstance');

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';
const HAIKU_VAR_ATTRIBUTE = 'haiku-var';

// When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
const CANONICAL_CORE_SOURCE_CODE_PATH = path.dirname(require.resolve('@haiku/core'));

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
  '@haiku/core/dom/react': path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'dom', 'react'),
};

const CORE_PACKAGE_JSON = require(path.join(CANONICAL_CORE_SOURCE_CODE_PATH, 'package.json'));
const CORE_VERSION = CORE_PACKAGE_JSON.version;

const MODULE_CACHE_HOT = {}; // May be cleared during runtime
const MODULE_CACHE_COLD = {}; // Never changes once populated

// In race conditions where the project node_modules is changed while monkeypatch
// is occurring, this allows project dependencies to be loaded without crashing
const haikuCore = require('@haiku/core');
const Module = require('module');
const originalRequire = Module.prototype.require;
MODULE_CACHE_COLD['@haiku/core'] = haikuCore;

Module.prototype.require = function (request) {
  if (MODULE_CACHE_COLD[request]) {
    return MODULE_CACHE_COLD[request];
  }
  if (MODULE_CACHE_HOT[request]) {
    return MODULE_CACHE_HOT[request];
  }
  return originalRequire.apply(this, arguments);
};

/**
 * @class Mod
 * @description
 *  Abstraction over an in-memory JavaScript module which we may want to...
 *    - Hot-reload at runtime and seamlessly replace
 *    - Hot-update and then write back to disk, via File
 *  Handles reloading the module using require(...) += a few useful config
 *  settings through which you can specify the exact require behavior.
 *
 *  Also has static functions and other utilities for module pathing within
 *  the host project folder, used extensively throughout the app.
 *
 *  Also contains a variety of useful constants related to module pathing.
 */
class ModuleWrapper extends BaseModel {
  constructor (props, opts) {
    super(props, opts);

    this.exp = null; // Safest to set to null until we really load the content

    this._hasLoadedAtLeastOnce = false;
    this._projectConfig = null;
  }

  hasLoadedAtLeastOnce () {
    return this._hasLoadedAtLeastOnce;
  }

  clearInMemoryExport () {
    this.exp = null;
  }

  fetchInMemoryExport () {
    return this.exp;
  }

  isolatedClearCache () {
    ModuleWrapper.clearRequireCache(path.dirname(this.getAbspath()));
    ModuleWrapper.clearHotCache();
  }

  basicReload (cb) {
    if (this.exp) {
      return cb(null, this.exp);
    }
    return this.reload(cb);
  }

  getFolder () {
    return this.file.folder;
  }

  getModpath () {
    return this.file.relpath;
  }

  getAbspath () {
    if (this.isExternalModule) {
      return require.resolve(this.getModpath());
    }

    let abspath = path.normalize(this.file.getAbspath());

    // Handle Mac temporary folder discrepency so its key in require.cache is correct
    if (abspath.slice(0, 5) === '/var/') {
      abspath = `/private${abspath}`;
    }

    return abspath;
  }

  load () {
    overrideModulesLoaded(
      (stop) => {
        this.isolatedClearCache();
        this.exp = require(this.getAbspath());
        this._hasLoadedAtLeastOnce = true;
        this.update(this.exp, () => {
          // Tell the node hook to stop interfering with require(...)
          stop();
        });
      },
      ModuleWrapper.getHaikuKnownImportMatch,
    );
  }

  reload (cb) {
    return Lock.request(Lock.LOCKS.FileReadWrite(this.getAbspath()), false, (release) => {
      try {
        this.load();
      } catch (exception) {
        logger.warn(`[module wrapper] cannot load ${this.getAbspath()}`);
        logger.warn(exception);

        // Assume the file hasn't been created and we should create it
        this.exp = {};
        this._hasLoadedAtLeastOnce = true;

        return this.update(this.exp, () => {
          if (!this.isExternalModule) {
            logger.warn(`[module wrapper] ***forcing flush content of ${this.getAbspath()}***`);
            this.file.maybeFlushContentForceSync();
          }
          release();
          return cb(null, this.exp);
        });
      }

      release();
      return cb(null, this.exp);
    });
  }

  moduleAsMana (hostComponentRelpath, identifier, title, cb) {
    return this.basicReload((err, exp) => {
      if (err) {
        return cb(err);
      }
      if (!exp) {
        return cb(null, null);
      }

      let source;
      if (this.isExternalModule) {
        source = Template.normalizePath(this.getModpath());
      } else {
        const relpath = path.relative(this.getFolder(), this.getAbspath());
        source = Template.normalizePath(`./${relpath}`);
      }

      exp.__reference = ModuleWrapper.buildReference(
        ModuleWrapper.REF_TYPES.COMPONENT, // type
        Template.normalizePath(`./${hostComponentRelpath}`), // host
        Template.normalizePathOfPossiblyExternalModule(source),
        identifier,
      );

      return cb(null, {
        // Nested components are represented thusly:
        // - The element name is the bytecode of the subcomponent
        // - When serialized the element name becomes just an identifier in the code
        // - Upon reification, it's loaded as bytecode with the appropriate __-properties
        elementName: exp,
        attributes: {
          [HAIKU_SOURCE_ATTRIBUTE]: source, // This important and is used for lookups relative to the host component
          [HAIKU_VAR_ATTRIBUTE]: identifier, // This is important when reloading bytecode with instantiated components from disk
          'haiku-title': title, // This is used for display in the Timeline, Stage, etc
        },
        children: [],
      });
    });
  }

  update (bytecode, cb) {
    if (this.isExternalModule) {
      return cb();
    }

    // Reassign in case our bytecode was empty and we created a new object
    this.exp = Bytecode.reinitialize(
      this.file.folder,
      path.normalize(this.file.relpath),
      bytecode,
      {title: this.component && this.component.getTitle()},
    );

    MODULE_CACHE_HOT[this.getAbspath()] = this.exp;
    MODULE_CACHE_HOT[this.getModpath()] = this.exp;
    MODULE_CACHE_HOT[this.file.getAbspath()] = this.exp;

    return cb();
  }
}

ModuleWrapper.DEFAULT_OPTIONS = {
  required: {
    file: true,
    component: true,
  },
};

BaseModel.extend(ModuleWrapper);

ModuleWrapper.buildReference = (type, host, source, identifier) => {
  return JSON.stringify({type, host, source, identifier});
};

ModuleWrapper.isValidReference = (__reference) => {
  if (!__reference) {
    return false;
  }

  if (typeof __reference !== 'string') {
    return false;
  }

  const ref = ModuleWrapper.parseReference(__reference);

  if (!ref) {
    return false;
  }

  return (
    ref.type &&
    ref.host &&
    ref.source &&
    ref.identifier
  );
};

ModuleWrapper.parseReference = (__reference) => {
  if (typeof __reference !== 'string') {
    return null;
  }

  try {
    return JSON.parse(__reference);
  } catch (exception) {
    logger.warn('[module wrapper]', exception);
    return null;
  }
};

/**
 * @function modulePathToIdentifierName
 * @description Convert a module path into an identifier name for the module.
 */
ModuleWrapper.modulePathToIdentifierName = (modulepath) => {
  // @haiku/blah/foo.js -> @haiku/blah/foo
  const nicepath = path.dirname(modulepath) + path.sep + path.basename(modulepath, path.extname(modulepath));

  const parts = nicepath.split(path.sep);

  // Underscoreize the path, so @haiku/core/blah/blah -> haiku_core_blah_blah
  return parts.map((part) => {
    return part.replace(/\W+/g, '_');
  }).join('_').slice(1); // Remove leading `_`
};

ModuleWrapper.getScenenameFromRelpath = (relpath) => {
  return path.normalize(relpath).split(path.sep)[1];
};

/**
 * @function getHaikuKnownImportMatch
 * @description Convert a known import path to an application local installation
 */
ModuleWrapper.getHaikuKnownImportMatch = (importPath) => {
  const normalizedPath = importPath.trim().toLowerCase();

  if (normalizedPath in REPLACEMENT_MODULES) {
    return REPLACEMENT_MODULES[normalizedPath];
  }

  // not a good general solution, but good enough for player components
  return importPath.replace(/^@haiku\/player/, REPLACEMENT_MODULES['@haiku/player'])
                   .replace(/^@haiku\/core/, REPLACEMENT_MODULES['@haiku/core']);
};

ModuleWrapper.clearHotCache = () => {
  const cleared = {};

  for (const key in MODULE_CACHE_HOT) {
    cleared[key] = true;
    MODULE_CACHE_HOT[key] = null;
  }

  logger.info(`[module wrapper] cleared hot cache`, cleared);
};

ModuleWrapper.clearRequireCache = (dirname) => {
  const cleared = {};

  for (const key in require.cache) {
    if (dirname) {
      if (key.indexOf(dirname) !== -1) {
        cleared[key] = true;
        delete require.cache[key];
      }
    } else if (!key.match(/node_modules/)) {
      cleared[key] = true;
      delete require.cache[key];
    }
  }

  logger.info(`[module wrapper] cleared require cache`, cleared);
};

ModuleWrapper.doesRelpathLookLikeLocalComponent = (relpath) => {
  const parts = path.normalize(relpath).split(path.sep);
  return (
    path.basename(relpath) === 'code.js' &&
    parts[0] === 'code' &&
    parts.length === 3 // e.g. code/foo/code.js
  );
};

ModuleWrapper.doesRelpathLookLikeSVGDesign = (relpath) => {
  return path.extname(relpath) === '.svg';
};

ModuleWrapper.doesRelpathLookLikeInstalledComponent = (relpath) => {
  const parts = path.normalize(relpath).split(path.sep);
  return parts[0] === '@haiku';
};

/**
 * Enable loading module from string.
 * Heavily based on https://github.com/floatdrop/require-from-string
 */
ModuleWrapper.requireFromString = (code, filename, opts) => {
  if (typeof filename === 'object') {
    opts = filename;
    filename = undefined;
  }

  opts = opts || {};
  filename = filename || '';

  if (typeof code !== 'string') {
    throw new Error('code must be a string, not ' + typeof code);
  }

  const m = new Module(filename, module.parent);

  m.paths = [].concat(
    path.dirname(filename),
    Module._nodeModulePaths(__dirname),
  );

  m.filename = filename;
  m.id = filename;

  m._compile(code, filename);

  return m.exports;
};

/**
 * Enable loading module from file.
 */
ModuleWrapper.requireFromFile = (filename) => {
  const contents = fs.readFileSync(filename).toString();
  return ModuleWrapper.requireFromString(contents, filename);
};

/**
 * Test load bytecode by requiring it. Used to check if currently editing file can be required.
 */
ModuleWrapper.testLoadBytecode = (contents, absPath) => {
  let loadedBytecode = null;
  overrideModulesLoaded(
    (stop) => {
      loadedBytecode = ModuleWrapper.requireFromString(contents, absPath);
      stop();
    },
    ModuleWrapper.getHaikuKnownImportMatch,
  );
  return loadedBytecode;
};

ModuleWrapper.REF_TYPES = {
  COMPONENT: 'component',
};

ModuleWrapper.CORE_VERSION = CORE_VERSION;

module.exports = ModuleWrapper;

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode');
const Template = require('./Template');
