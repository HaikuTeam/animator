'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['\n        module.exports = {\n          type: \'', '\',\n          name: \'', '\'\n        }\n      '], ['\n        module.exports = {\n          type: \'', '\',\n          name: \'', '\'\n        }\n      ']),
    _templateObject2 = _taggedTemplateLiteral(['\n        {\n          "name": "', '",\n          "version": "', '",\n          "haiku": {\n            "organization": "', '",\n            "project": "', '"\n          },\n          "authors": [\n            "', '",\n            "Haiku <contact@haiku.ai>"\n          ],\n          "license": "LicenseRef-LICENSE",\n          "main": "index.js",\n          "dependencies": {\n            "@haiku/player": "', '"\n          }\n        }\n      '], ['\n        {\n          "name": "', '",\n          "version": "', '",\n          "haiku": {\n            "organization": "', '",\n            "project": "', '"\n          },\n          "authors": [\n            "', '",\n            "Haiku <contact@haiku.ai>"\n          ],\n          "license": "LicenseRef-LICENSE",\n          "main": "index.js",\n          "dependencies": {\n            "@haiku/player": "', '"\n          }\n        }\n      ']),
    _templateObject3 = _taggedTemplateLiteral(['\n          var Haiku = require(\'@haiku/player\')\n          module.exports = {\n            metadata: {},\n            options: {},\n            states: {},\n            eventHandlers: {},\n            timelines: {\n              Default: {}\n            },\n            template: {\n              elementName: \'div\',\n              attributes: {\n                \'haiku-title\': \'HaikuComponent\'\n              },\n              children: []\n            }\n          }\n        '], ['\n          var Haiku = require(\'@haiku/player\')\n          module.exports = {\n            metadata: {},\n            options: {},\n            states: {},\n            eventHandlers: {},\n            timelines: {\n              Default: {}\n            },\n            template: {\n              elementName: \'div\',\n              attributes: {\n                \'haiku-title\': \'HaikuComponent\'\n              },\n              children: []\n            }\n          }\n        ']),
    _templateObject4 = _taggedTemplateLiteral(['\n          []\n        '], ['\n          []\n        ']),
    _templateObject5 = _taggedTemplateLiteral(['\n        # ', '\n\n        This project was created with [Haiku](https://haiku.ai).\n\n        ## Install\n\n        ```\n        $ haiku install ', '\n        ```\n\n        ## Usage\n\n        ```\n        var ', ' = require(\'', '\')\n        ```\n\n        ## Copyright\n\n        ', '\n      '], ['\n        # ', '\n\n        This project was created with [Haiku](https://haiku.ai).\n\n        ## Install\n\n        \\`\\`\\`\n        $ haiku install ', '\n        \\`\\`\\`\n\n        ## Usage\n\n        \\`\\`\\`\n        var ', ' = require(\'', '\')\n        \\`\\`\\`\n\n        ## Copyright\n\n        ', '\n      ']),
    _templateObject6 = _taggedTemplateLiteral(['\n        ', '\n        ', '\n      '], ['\n        ', '\n        ', '\n      ']),
    _templateObject7 = _taggedTemplateLiteral(['\n        /** ', ' */\n        // By default, a DOM module is exported; see code/main/* for other options\n        module.exports = require(\'./code/main/dom\')\n      '], ['\n        /** ', ' */\n        // By default, a DOM module is exported; see code/main/* for other options\n        module.exports = require(\'./code/main/dom\')\n      ']),
    _templateObject8 = _taggedTemplateLiteral(['\n        /** ', ' */\n        // By default, a react-dom module is exported; see code/main/* for other options\n        module.exports = require(\'./code/main/react-dom\')\n      '], ['\n        /** ', ' */\n        // By default, a react-dom module is exported; see code/main/* for other options\n        module.exports = require(\'./code/main/react-dom\')\n      ']),
    _templateObject9 = _taggedTemplateLiteral(['\n        /** ', ' */\n        // This only exports a React module into which a Haiku Player must be passed\n        var React = require(\'react\') // Installed as a peer dependency of \'@haiku/player\'\n        var ReactDOM = require(\'react-dom\') // Installed as a peer dependency of \'@haiku/player\'\n        var HaikuReactAdapter = require(\'@haiku/player/dom/react\')\n        var ', '_Bare = HaikuReactAdapter(null, require(\'./code/main/code\'))\n        if (', '_Bare.default) ', '_Bare = ', '_Bare.default\n        module.exports = ', '_Bare\n      '], ['\n        /** ', ' */\n        // This only exports a React module into which a Haiku Player must be passed\n        var React = require(\'react\') // Installed as a peer dependency of \'@haiku/player\'\n        var ReactDOM = require(\'react-dom\') // Installed as a peer dependency of \'@haiku/player\'\n        var HaikuReactAdapter = require(\'@haiku/player/dom/react\')\n        var ', '_Bare = HaikuReactAdapter(null, require(\'./code/main/code\'))\n        if (', '_Bare.default) ', '_Bare = ', '_Bare.default\n        module.exports = ', '_Bare\n      ']),
    _templateObject10 = _taggedTemplateLiteral(['\n        /** ', ' */\n        var HaikuDOMAdapter = require(\'@haiku/player/dom\')\n        module.exports = HaikuDOMAdapter(require(\'./code\'))\n      '], ['\n        /** ', ' */\n        var HaikuDOMAdapter = require(\'@haiku/player/dom\')\n        module.exports = HaikuDOMAdapter(require(\'./code\'))\n      ']),
    _templateObject11 = _taggedTemplateLiteral(['\n        /** ', ' */\n        var code = require(\'./code\')\n        var adapter = window.HaikuPlayer && window.HaikuPlayer[\'', '\']\n        if (adapter) {\n          module.exports = adapter(code)\n        } else  {\n          function safety () {\n            console.error(\n              \'[haiku player] player version ', ' seems to be missing. \' +\n              \'index.embed.js expects it at window.HaikuPlayer["', '"], but we cannot find it. \' +\n              \'you may need to add a <script src="path/to/HaikuPlayer.js"></script> to fix this. \' +\n              \'if you really need to load the player after this script, you could try: \' +\n              \'myHaikuPlayer(', ')(document.getElementById("myMountElement"))\'\n            )\n            return code\n          }\n          for (var key in code) {\n            safety[key] = code[key]\n          }\n          module.exports = safety\n        }\n      '], ['\n        /** ', ' */\n        var code = require(\'./code\')\n        var adapter = window.HaikuPlayer && window.HaikuPlayer[\'', '\']\n        if (adapter) {\n          module.exports = adapter(code)\n        } else  {\n          function safety () {\n            console.error(\n              \'[haiku player] player version ', ' seems to be missing. \' +\n              \'index.embed.js expects it at window.HaikuPlayer["', '"], but we cannot find it. \' +\n              \'you may need to add a <script src="path/to/HaikuPlayer.js"></script> to fix this. \' +\n              \'if you really need to load the player after this script, you could try: \' +\n              \'myHaikuPlayer(', ')(document.getElementById("myMountElement"))\'\n            )\n            return code\n          }\n          for (var key in code) {\n            safety[key] = code[key]\n          }\n          module.exports = safety\n        }\n      ']),
    _templateObject12 = _taggedTemplateLiteral(['\n        /** ', ' */\n        module.exports = require(\'./dom\')\n      '], ['\n        /** ', ' */\n        module.exports = require(\'./dom\')\n      ']),
    _templateObject13 = _taggedTemplateLiteral(['\n        /** ', ' */\n        var React = require(\'react\') // Installed as a peer dependency of \'@haiku/player\'\n        var ReactDOM = require(\'react-dom\') // Installed as a peer dependency of \'@haiku/player\'\n        var HaikuReactAdapter = require(\'@haiku/player/dom/react\')\n        var ', ' = HaikuReactAdapter(require(\'./dom\'))\n        if (', '.default) ', ' = ', '.default\n        module.exports = ', '\n      '], ['\n        /** ', ' */\n        var React = require(\'react\') // Installed as a peer dependency of \'@haiku/player\'\n        var ReactDOM = require(\'react-dom\') // Installed as a peer dependency of \'@haiku/player\'\n        var HaikuReactAdapter = require(\'@haiku/player/dom/react\')\n        var ', ' = HaikuReactAdapter(require(\'./dom\'))\n        if (', '.default) ', ' = ', '.default\n        module.exports = ', '\n      ']),
    _templateObject14 = _taggedTemplateLiteral(['\n        <!DOCTYPE html>\n        <!-- ', ' -->\n        <html>\n        <head>\n          <meta charset="utf-8">\n          <meta name="viewport" content="width=device-width, initial-scale=1.0">\n          <title>', ' | Preview | Haiku</title>\n          <style>\n            .container { margin: 0 auto; width: 100%; }\n            #mount { width: 80%; margin: 0 auto; }\n          </style>\n        </head>\n        <body>\n          <div class="container">\n            <div id="mount"></div>\n          </div>\n          <script src="./index.standalone.js"></script>\n          <script>\n            ', '(document.getElementById(\'mount\'), {\n              sizing: \'contain\',\n              loop: true\n            })\n          </script>\n        </body>\n        </html>\n      '], ['\n        <!DOCTYPE html>\n        <!-- ', ' -->\n        <html>\n        <head>\n          <meta charset="utf-8">\n          <meta name="viewport" content="width=device-width, initial-scale=1.0">\n          <title>', ' | Preview | Haiku</title>\n          <style>\n            .container { margin: 0 auto; width: 100%; }\n            #mount { width: 80%; margin: 0 auto; }\n          </style>\n        </head>\n        <body>\n          <div class="container">\n            <div id="mount"></div>\n          </div>\n          <script src="./index.standalone.js"></script>\n          <script>\n            ', '(document.getElementById(\'mount\'), {\n              sizing: \'contain\',\n              loop: true\n            })\n          </script>\n        </body>\n        </html>\n      ']),
    _templateObject15 = _taggedTemplateLiteral(['\n        # ', '\n        .DS_Store\n        *.log\n        *.*.log\n        node_modules\n        bower_components\n        jspm_modules\n        coverage\n        build\n        dist\n        .env\n      '], ['\n        # ', '\n        .DS_Store\n        *.log\n        *.*.log\n        node_modules\n        bower_components\n        jspm_modules\n        coverage\n        build\n        dist\n        .env\n      ']),
    _templateObject16 = _taggedTemplateLiteral(['\n        # ', '\n        .DS_Store\n        .git\n        .svn\n        *.log\n        *.*.log\n        *.ai\n        *.sketch\n        *.svg\n        .env\n        .haiku\n      '], ['\n        # ', '\n        .DS_Store\n        .git\n        .svn\n        *.log\n        *.*.log\n        *.ai\n        *.sketch\n        *.svg\n        .env\n        .haiku\n      ']),
    _templateObject17 = _taggedTemplateLiteral(['\n        # ', '\n        registry=https://registry.npmjs.org/\n        @haiku:registry=https://reservoir.haiku.ai:8910/\n      '], ['\n        # ', '\n        registry=https://registry.npmjs.org/\n        @haiku:registry=https://reservoir.haiku.ai:8910/\n      ']),
    _templateObject18 = _taggedTemplateLiteral(['\n        # ', '\n        registry "https://registry.npmjs.org/"\n        "@haiku:registry" "https://reservoir.haiku.ai:8910/"\n      '], ['\n        # ', '\n        registry "https://registry.npmjs.org/"\n        "@haiku:registry" "https://reservoir.haiku.ai:8910/"\n      ']);

exports.getSafeProjectName = getSafeProjectName;
exports.getSafeOrgName = getSafeOrgName;
exports.ensureProject = ensureProject;
exports.ensureSpecificProject = ensureSpecificProject;
exports.buildProjectContent = buildProjectContent;
exports.semverBumpPackageJson = semverBumpPackageJson;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _haikuFsExtra = require('haiku-fs-extra');

var _haikuFsExtra2 = _interopRequireDefault(_haikuFsExtra);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _pascalcase = require('pascalcase');

var _pascalcase2 = _interopRequireDefault(_pascalcase);

var _dedent = require('dedent');

var _dedent2 = _interopRequireDefault(_dedent);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _Browserify = require('./Browserify');

var _Browserify2 = _interopRequireDefault(_Browserify);

var _npm = require('./npm');

var _npm2 = _interopRequireDefault(_npm);

var _LoggerInstance = require('haiku-serialization/src/utils/LoggerInstance');

var _LoggerInstance2 = _interopRequireDefault(_LoggerInstance);

var _normalizeBytecodeFile = require('haiku-serialization/src/ast/normalizeBytecodeFile');

var _normalizeBytecodeFile2 = _interopRequireDefault(_normalizeBytecodeFile);

var _File = require('haiku-serialization/src/model/File');

var _File2 = _interopRequireDefault(_File);

var _HaikuHomeDir = require('haiku-serialization/src/utils/HaikuHomeDir');

var HaikuHomeDir = _interopRequireWildcard(_HaikuHomeDir);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var PLUMBING_DIR = _path2.default.join(__dirname, '..');
var PLUMBING_NODE_MODULES = _path2.default.join(PLUMBING_DIR, 'node_modules');
var PLUMBING_PLAYER_INSTALL_PATH = _path2.default.join(PLUMBING_NODE_MODULES, '@haiku', 'player');
// const PLUMBING_PKG = require('./../package.json')

var PLAYER_PACKAGE_JSON = _haikuFsExtra2.default.readJsonSync(_path2.default.join(PLUMBING_PLAYER_INSTALL_PATH, 'package.json'), { throws: false });
if (!PLAYER_PACKAGE_JSON) {
  throw new Error('Plumbing needs its dependencies to be installed');
}

var DEFAULT_PROJECT_TYPE = 'haiku';
var HAIKU_CONFIG_FILE = 'haiku.js';
var WHITESPACE_REGEX = /\s+/;
var UNDERSCORE = '_';
var FALLBACK_ORG_NAME = 'Unknown';
var FALLBACK_AUTHOR_NAME = 'Haiku User';
var FALLBACK_SEMVER_VERSION = '0.0.0';

function getSafeProjectName(maybeProjectPath, maybeProjectName) {
  if (maybeProjectName) return maybeProjectName.replace(WHITESPACE_REGEX, UNDERSCORE);
  if (maybeProjectPath) return (0, _pascalcase2.default)(maybeProjectPath.split(_path2.default.sep).join(UNDERSCORE));
  throw new Error('Unable to infer a project name!');
}

function getSafeOrgName(maybeOrgName) {
  if (!maybeOrgName || typeof maybeOrgName !== 'string') maybeOrgName = FALLBACK_ORG_NAME;
  return maybeOrgName.replace(WHITESPACE_REGEX, UNDERSCORE);
}

/**
 * @function ensureProject
 * @description Flexible way to ensure a project is ready. Use this if you aren't sure you have
 * all the params but want to get going, and/or if you want the system to infer where to put stuff.
 * NOTE: Any of the input object properties may be null/undefined!
 */
function ensureProject(projectOptions, cb) {
  _LoggerInstance2.default.info('[project folder] ensure project options:', JSON.stringify(projectOptions));

  var projectsHome = projectOptions.projectsHome,
      projectPath = projectOptions.projectPath,
      organizationName = projectOptions.organizationName,
      projectName = projectOptions.projectName;

  // If no specified projects home folder, use the default Haiku projects home folder

  if (!projectsHome) {
    projectsHome = HaikuHomeDir.HOMEDIR_PROJECTS_PATH;
  }

  // Always make sure that that project home dir exists before continuing
  _LoggerInstance2.default.info('[project folder] ensuring projects home dir');
  return _haikuFsExtra2.default.mkdirp(projectsHome, function (err) {
    if (err) return cb(err);

    var safeProjectName = getSafeProjectName(projectsHome, projectName);
    var safeOrgName = getSafeOrgName(organizationName);

    if (!projectPath) {
      projectPath = _path2.default.join(projectsHome, safeOrgName, safeProjectName);
    }

    return ensureSpecificProject(projectPath, safeProjectName, 'haiku', projectOptions, cb);
  });
}

/**
 * @function ensureSpecificProject
 * @description Less flexible than its sibling, this method assumes you have a specific folder in which
 * you want to boot up the project.
 */
function ensureSpecificProject(projectPath, projectName) {
  var projectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_PROJECT_TYPE;
  var projectOptions = arguments[3];
  var cb = arguments[4];

  _LoggerInstance2.default.info('[project folder] ensuring specific project', projectPath);

  if (!projectOptions) projectOptions = {};

  return _haikuFsExtra2.default.mkdirp(projectPath, function (err) {
    if (err) return cb(err);

    // This check is needed since Creator may wish to specify that we do/don't automatically create content.
    // This is very important because if we create content then pull from the remote, we'll get a weird initial state.
    if (projectOptions.skipContentCreation) {
      _LoggerInstance2.default.info('[project folder] skipping content creation (I)');
      return cb(null, projectPath);
    }

    return buildProjectContent(null, projectPath, projectName, projectType, projectOptions, function (err) {
      if (err) return cb(err);
      return cb(null, projectPath);
    });
  });
}

function npmActions(projectPath, projectDependencies, cb) {
  return _npm2.default.install(projectPath, projectDependencies, function (err) {
    if (err) return cb(err);
    // We npm link *the project* so that local create-react-app can hmr from it
    return _npm2.default.link(projectPath, [projectPath], cb);
  });
}

function buildProjectContent(_ignoredLegacyArg, projectPath, projectName) {
  var projectType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_PROJECT_TYPE;
  var projectOptions = arguments[4];
  var finish = arguments[5];

  function dir() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }var pieces = [projectPath].concat(args);
    var location = _path2.default.join.apply(_path2.default, pieces);
    return location;
  }

  try {
    _LoggerInstance2.default.info('[project folder] building project content', projectPath);

    if (!_haikuFsExtra2.default.existsSync(dir(HAIKU_CONFIG_FILE))) {
      _LoggerInstance2.default.info('[project folder] creating haiku config');

      _haikuFsExtra2.default.outputFileSync(dir(HAIKU_CONFIG_FILE), (0, _dedent2.default)(_templateObject, projectType, getSafeProjectName(projectPath, projectName)));
    }

    // Reload from the user's config in case they overrode ours
    var projectHaikuConfig = require(dir(HAIKU_CONFIG_FILE));

    var projectSemverVersion = projectHaikuConfig.version || FALLBACK_SEMVER_VERSION;
    var projectNameSafe = getSafeProjectName(projectPath, projectHaikuConfig.name);
    var projectNameLowerCase = projectNameSafe.toLowerCase();
    var reactProjectName = 'React_' + projectNameSafe;
    var organizationName = projectOptions.organizationName || FALLBACK_ORG_NAME;
    var organizationNameLowerCase = organizationName.toLowerCase();
    var authorName = projectOptions.authorName || FALLBACK_AUTHOR_NAME;

    // const nodeVersion = PLUMBING_PKG.engines.node
    // const npmVersion = PLUMBING_PKG.engines.npm
    // const electronVersion = PLUMBING_PKG.engines.electron
    var haikuPlayerVersion = PLAYER_PACKAGE_JSON.version; // This json object should be loaded at the top
    var npmPackageName = '@haiku/' + organizationNameLowerCase + '-' + projectNameLowerCase;
    var humanTimestamp = (0, _moment2.default)().format('YYYYMMDDHHmmss');
    var autoGeneratedNotice = 'This file was autogenerated by Haiku at ' + humanTimestamp + '.';
    var copyrightNotice = 'Copyright (c) ' + new Date().getFullYear() + ' ' + organizationName + '. All rights reserved.';
    // const embedPlayerJavascriptPath = `https://code.haiku.ai/scripts/player/HaikuPlayer.${haikuPlayerVersion}.js`
    // const embedPlayerJavascriptMinPath = `https://code.haiku.ai/scripts/player/HaikuPlayer.${haikuPlayerVersion}.min.js`

    if (!_haikuFsExtra2.default.existsSync(dir('package.json'))) {
      _haikuFsExtra2.default.outputFileSync(dir('package.json'), (0, _dedent2.default)(_templateObject2, npmPackageName, projectSemverVersion, organizationName, projectNameSafe, authorName, haikuPlayerVersion));
    }

    // Fix up the contents of the package.json if they happen to be wrong, e.g., organization name not set correctly
    var packageJson = _haikuFsExtra2.default.readJsonSync(dir('package.json'), { throws: false });
    if (!packageJson) return finish(new Error('package.json was found to be empty/unreadable'));

    // Note that we _don't_  want to set back to 'unknown' if it's already set
    if (organizationName && organizationName !== FALLBACK_ORG_NAME) {
      if (packageJson.name !== npmPackageName) packageJson.name = npmPackageName;
      if (packageJson.dependencies) packageJson.dependencies = {};
      if (!packageJson.dependencies['@haiku/player']) {
        packageJson.dependencies['@haiku/player'] = haikuPlayerVersion;
      }

      _LoggerInstance2.default.info('[project folder] @haiku/player version is', packageJson.dependencies['@haiku/player']);

      // If our player version is only a patch difference from theirs, go ahead and upgrade their player
      var upgradeDiff = _semver2.default.diff(packageJson.dependencies['@haiku/player'], haikuPlayerVersion);
      if (upgradeDiff === 'patch') {
        _LoggerInstance2.default.info('[project folder] upgraded @haiku/player to', haikuPlayerVersion);
        packageJson.dependencies['@haiku/player'] = haikuPlayerVersion;
      }
    }

    // Write the file assuming we may have made a change in any of the conditions above
    _haikuFsExtra2.default.writeJsonSync(dir('package.json'), packageJson, { spaces: 2 });

    // Do npm stuff here since the following steps may require the installation to be complete first
    var projectDependencies = require(dir('package.json')).dependencies;
    return npmActions(projectPath, projectDependencies, function (err) {
      if (err) return finish(err);

      // This option is used when we initially set up a project before we've attempted to clone content that
      // may or may not exist on the remote. Since this case involves copying into a temp folder and then back
      // on top of the cloned content, we don't want to create anything that might inadvertently overwrite stuff.
      if (projectOptions.skipContentCreation) {
        _LoggerInstance2.default.info('[project folder] skipping content creation (II)');
        return finish();
      }

      _LoggerInstance2.default.info('[project folder] creating folders');

      _haikuFsExtra2.default.mkdirpSync(dir('.haiku'));
      _haikuFsExtra2.default.mkdirpSync(dir('designs'));
      _haikuFsExtra2.default.mkdirpSync(dir('code/main'));
      _haikuFsExtra2.default.mkdirpSync(dir('public'));

      _LoggerInstance2.default.info('[project folder] moving/updating legacy files');

      // Do a bunch of fix-ups that modify the folder content from legacy naming and folder structure.
      // We need to change this subroutine any time we make a change to the project content structure
      var filesToMove = {
        // Meta files
        'readme.md': 'README.md', // LEGACY: I think we used to name it lowercase, but we want upper
        'license.txt': 'LICENSE.txt', // LEGACY: I think we used to name it lowercase, but we want upper
        // Core code files
        'bytecode.js': 'code/main/code.js',
        'interpreter.js': 'code/main/dom.js',
        'embed.js': 'code/main/dom-embed.js',
        'react-dom.js': 'code/main/react-dom.js'

        // --
        // TODO: Switch the bundle code files to these paths, once we're ready to make the equivalent
        // switch inside sumi-e, inkstone, share-page, and wherever else.
        // ALSO SEE BELOW, where paths need to be changed as well
        // 'index.embed.js': 'public/dom-embed.bundle.js',
        // 'index.standalone.js': 'public/dom-standalone.bundle.js'
        // --
      };
      for (var formerFilePath in filesToMove) {
        var nextFilePath = filesToMove[formerFilePath];
        if (_haikuFsExtra2.default.existsSync(dir(formerFilePath))) {
          // I guess there is no 'moveSync', and 'copySync' acts weird, so here it is imperatively:
          var contentsToCopy = _haikuFsExtra2.default.readFileSync(dir(formerFilePath)).toString();
          _haikuFsExtra2.default.outputFileSync(dir(nextFilePath), contentsToCopy);
          _haikuFsExtra2.default.removeSync(dir(formerFilePath));
        }
        // Now fix any legacy content that may be present inside of the updated file, e.g. references
        if (_haikuFsExtra2.default.existsSync(dir(nextFilePath))) {
          var fileContents = _haikuFsExtra2.default.readFileSync(dir(nextFilePath)).toString();
          fileContents.split('bytecode.js').join('code.js'); // Respective to the code/main dir
          fileContents.split('interpreter.js').join('dom.js'); // Respective to the code/main dir
          _haikuFsExtra2.default.outputFileSync(dir(nextFilePath), fileContents);
        }
      }

      _LoggerInstance2.default.info('[project folder] removing unneeded files');

      var filesToRemove = ['index.embed.html', 'index.standalone.html'];
      filesToRemove.forEach(function (fileToRemove) {
        _haikuFsExtra2.default.removeSync(dir(fileToRemove));
      });

      _LoggerInstance2.default.info('[project folder] creating files');

      // Only write these files if they don't exist yet; don't overwrite the user's own content
      if (!_haikuFsExtra2.default.existsSync(dir('code/main/code.js'))) {
        _LoggerInstance2.default.info('[project folder] created main code file');

        _haikuFsExtra2.default.outputFileSync(dir('code/main/code.js'), (0, _dedent2.default)(_templateObject3));
      } else {
        // If the file already exists, we can run any migration steps we might want
        _File2.default.astmod(dir('code/main/code.js'), function (ast) {
          (0, _normalizeBytecodeFile2.default)(ast);
        });
      }

      // Other user data may have been written these, so don't overwrite if they're already present
      if (!_haikuFsExtra2.default.existsSync(dir('.haiku/comments.json'))) {
        _haikuFsExtra2.default.outputFileSync(dir('.haiku/comments.json'), (0, _dedent2.default)(_templateObject4));
      }

      _haikuFsExtra2.default.outputFileSync(dir('README.md'), (0, _dedent2.default)(_templateObject5, projectNameSafe, projectNameSafe, projectNameSafe, npmPackageName, copyrightNotice));

      _haikuFsExtra2.default.outputFileSync(dir('LICENSE.txt'), (0, _dedent2.default)(_templateObject6, autoGeneratedNotice, copyrightNotice));

      var embedName = 'HaikuComponentEmbed_' + organizationName + '_' + projectNameSafe;
      var standaloneName = 'HaikuComponent_' + organizationName + '_' + projectNameSafe;

      // But a bunch of ancillary files we take full control of and overwrite despite what the user did
      _haikuFsExtra2.default.outputFileSync(dir('index.js'), (0, _dedent2.default)(_templateObject7, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('react.js'), (0, _dedent2.default)(_templateObject8, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('react-bare.js'), (0, _dedent2.default)(_templateObject9, autoGeneratedNotice, reactProjectName, reactProjectName, reactProjectName, reactProjectName, reactProjectName));

      _haikuFsExtra2.default.outputFileSync(dir('code/main/dom.js'), (0, _dedent2.default)(_templateObject10, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('code/main/dom-embed.js'), (0, _dedent2.default)(_templateObject11, autoGeneratedNotice, haikuPlayerVersion, haikuPlayerVersion, haikuPlayerVersion, embedName));
      _haikuFsExtra2.default.outputFileSync(dir('code/main/dom-standalone.js'), (0, _dedent2.default)(_templateObject12, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('code/main/react-dom.js'), (0, _dedent2.default)(_templateObject13, autoGeneratedNotice, reactProjectName, reactProjectName, reactProjectName, reactProjectName, reactProjectName));

      _haikuFsExtra2.default.outputFileSync(dir('preview.html'), (0, _dedent2.default)(_templateObject14, autoGeneratedNotice, projectNameSafe, standaloneName));

      // Should we try to merge these if the user made any changes?
      _haikuFsExtra2.default.outputFileSync(dir('.gitignore'), (0, _dedent2.default)(_templateObject15, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('.npmignore'), (0, _dedent2.default)(_templateObject16, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('.yarnignore'), (0, _dedent2.default)(_templateObject16, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('.npmrc'), (0, _dedent2.default)(_templateObject17, autoGeneratedNotice));
      _haikuFsExtra2.default.outputFileSync(dir('.yarnrc'), (0, _dedent2.default)(_templateObject18, autoGeneratedNotice));

      // Let the user skip this heavy step optionally, e.g. when just initializing the project the first time
      if (projectOptions.skipCDNBundles) {
        _LoggerInstance2.default.info('[project folder] skipping cdn bundles');
        return finish();
      }

      _LoggerInstance2.default.info('[project folder] creating cdn bundles');
      return _async2.default.series([function (cb) {
        var embedSource = _haikuFsExtra2.default.readFileSync(dir('code/main/dom-embed.js')).toString();
        _LoggerInstance2.default.info('[project folder] browserifying code/main/dom-embed.js');
        return _Browserify2.default.createBundle(dir('code/main'), embedSource, embedName, {}, function (err, browserifiedContents) {
          if (err) return cb(err);
          _LoggerInstance2.default.info('[project folder] browserify succeeded for', embedName);
          var finalContent = '/** ' + autoGeneratedNotice + '\n' + copyrightNotice + '\n*/\n' + browserifiedContents;
          _haikuFsExtra2.default.outputFileSync(dir('index.embed.js'), finalContent);
          return cb();
        });
      }, function (cb) {
        var standaloneSource = _haikuFsExtra2.default.readFileSync(dir('code/main/dom-standalone.js')).toString();
        _LoggerInstance2.default.info('[project folder] browserifying code/main/dom-standalone.js');
        return _Browserify2.default.createBundle(dir('code/main'), standaloneSource, standaloneName, {}, function (err, browserifiedContents) {
          if (err) return cb(err);
          _LoggerInstance2.default.info('[project folder] browserify succeeded for', standaloneName);
          var finalContent = '/** ' + autoGeneratedNotice + '\n' + copyrightNotice + '\n*/\n' + browserifiedContents;
          _haikuFsExtra2.default.outputFileSync(dir('index.standalone.js'), finalContent);
          return cb();
        });
      }], function (err, results) {
        if (err) return finish(err);
        return finish(null, results[results.length - 1]);
      });
    });
  } catch (exception) {
    _LoggerInstance2.default.error('[project folder] ' + exception);
    return finish(exception);
  }
}

function semverBumpPackageJson(projectPath, maybeVersionToBumpTo, cb) {
  try {
    var jsonPath = _path2.default.join(projectPath, 'package.json');

    _LoggerInstance2.default.info('[project folder] semver bump: checking ' + jsonPath);

    var pkg = _haikuFsExtra2.default.readJsonSync(jsonPath);

    var newVersion = void 0;

    // Allow a version to be specified explicitly. This turns out to be useful in plumbing/master
    // where we might find a previously-used tag and need to explicitly bump from it, instead of using
    // what might be defined in the package.json.
    if (maybeVersionToBumpTo) {
      _LoggerInstance2.default.info('[project folder] semver bump: got explicit version ' + maybeVersionToBumpTo);
      newVersion = maybeVersionToBumpTo;
    } else {
      var prevVersion = pkg.version || FALLBACK_SEMVER_VERSION;
      _LoggerInstance2.default.info('[project folder] semver bump: found previous version ' + prevVersion);
      newVersion = _semver2.default.inc(prevVersion, 'patch');
    }

    _LoggerInstance2.default.info('[project folder] semver bump: assigning version ' + newVersion);

    pkg.version = newVersion;
    var newJson = JSON.stringify(pkg, null, 2) + '\n';
    _haikuFsExtra2.default.writeFileSync(jsonPath, newJson);

    return cb(null, newVersion);
  } catch (exception) {
    return cb(exception);
  }
}
//# sourceMappingURL=ProjectFolder.js.map