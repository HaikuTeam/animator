import path from 'path'
import fse from 'haiku-fs-extra'
import async from 'async'
import pascalcase from 'pascalcase'
import dedent from 'dedent'
import semver from 'semver'
import moment from 'moment'
import Browserify from './Browserify'
import npm from './npm'
import logger from 'haiku-serialization/src/utils/LoggerInstance'
import normalizeBytecodeFile from 'haiku-serialization/src/ast/normalizeBytecodeFile'
import FileModel from 'haiku-serialization/src/model/File'
import * as HaikuHomeDir from 'haiku-serialization/src/utils/HaikuHomeDir'

const PLUMBING_DIR = path.join(__dirname, '..')
const PLUMBING_NODE_MODULES = path.join(PLUMBING_DIR, 'node_modules')
const PLUMBING_PLAYER_INSTALL_PATH = path.join(PLUMBING_NODE_MODULES, '@haiku', 'player')
// const PLUMBING_PKG = require('./../package.json')

var PLAYER_PACKAGE_JSON = fse.readJsonSync(path.join(PLUMBING_PLAYER_INSTALL_PATH, 'package.json'), { throws: false })
if (!PLAYER_PACKAGE_JSON) {
  throw new Error('Plumbing needs its dependencies to be installed')
}

const DEFAULT_PROJECT_TYPE = 'haiku'
const HAIKU_CONFIG_FILE = 'haiku.js'
const WHITESPACE_REGEX = /\s+/
const UNDERSCORE = '_'
const FALLBACK_ORG_NAME = 'Unknown'
const FALLBACK_AUTHOR_NAME = 'Haiku User'
const FALLBACK_SEMVER_VERSION = '0.0.0'

export function getSafeProjectName (maybeProjectPath, maybeProjectName) {
  if (maybeProjectName) return maybeProjectName.replace(WHITESPACE_REGEX, UNDERSCORE)
  if (maybeProjectPath) return pascalcase(maybeProjectPath.split(path.sep).join(UNDERSCORE))
  throw new Error('Unable to infer a project name!')
}

export function getSafeOrgName (maybeOrgName) {
  if (!maybeOrgName || typeof maybeOrgName !== 'string') maybeOrgName = FALLBACK_ORG_NAME
  return maybeOrgName.replace(WHITESPACE_REGEX, UNDERSCORE)
}

/**
 * @function ensureProject
 * @description Flexible way to ensure a project is ready. Use this if you aren't sure you have
 * all the params but want to get going, and/or if you want the system to infer where to put stuff.
 * NOTE: Any of the input object properties may be null/undefined!
 */
export function ensureProject (projectOptions, cb) {
  logger.info('[project folder] ensure project options:', JSON.stringify(projectOptions))

  let { projectsHome, projectPath, organizationName, projectName } = projectOptions

  // If no specified projects home folder, use the default Haiku projects home folder
  if (!projectsHome) {
    projectsHome = HaikuHomeDir.HOMEDIR_PROJECTS_PATH
  }

  // Always make sure that that project home dir exists before continuing
  logger.info('[project folder] ensuring projects home dir')
  return fse.mkdirp(projectsHome, (err) => {
    if (err) return cb(err)

    const safeProjectName = getSafeProjectName(projectsHome, projectName)
    const safeOrgName = getSafeOrgName(organizationName)

    if (!projectPath) {
      projectPath = path.join(projectsHome, safeOrgName, safeProjectName)
    }

    return ensureSpecificProject(projectPath, safeProjectName, 'haiku', projectOptions, cb)
  })
}

/**
 * @function ensureSpecificProject
 * @description Less flexible than its sibling, this method assumes you have a specific folder in which
 * you want to boot up the project.
 */
export function ensureSpecificProject (projectPath, projectName, projectType = DEFAULT_PROJECT_TYPE, projectOptions, cb) {
  logger.info('[project folder] ensuring specific project', projectPath)

  if (!projectOptions) projectOptions = {}

  return fse.mkdirp(projectPath, (err) => {
    if (err) return cb(err)

    // This check is needed since Creator may wish to specify that we do/don't automatically create content.
    // This is very important because if we create content then pull from the remote, we'll get a weird initial state.
    if (projectOptions.skipContentCreation) {
      logger.info('[project folder] skipping content creation (I)')
      return cb(null, projectPath)
    }

    return buildProjectContent(null, projectPath, projectName, projectType, projectOptions, (err) => {
      if (err) return cb(err)
      return cb(null, projectPath)
    })
  })
}

function npmActions (projectPath, projectDependencies, cb) {
  return npm.install(projectPath, projectDependencies, (err) => {
    if (err) return cb(err)
    // We npm link *the project* so that local create-react-app can hmr from it
    return npm.link(projectPath, [projectPath], cb)
  })
}

function dir () {
  var args = []
  for (var i = 0; i < arguments.length; i++) args[i] = arguments[i]
  var location = path.join.apply(path, args)
  return location
}

export function getProjectHaikuConfig (folder) {
  return require(dir(folder, HAIKU_CONFIG_FILE))
}

export function getProjectNameVariations (folder) {
  const projectHaikuConfig = getProjectHaikuConfig(folder)
  const projectNameSafe = getSafeProjectName(folder, projectHaikuConfig.name)
  const projectNameSafeShort = projectNameSafe.slice(0, 20)
  const projectNameLowerCase = projectNameSafe.toLowerCase()
  const reactProjectName = `React_${projectNameSafe}`
  const primaryAssetPath = `designs/${projectNameSafeShort}.sketch`
  return {
    projectNameSafe,
    projectNameSafeShort,
    projectNameLowerCase,
    reactProjectName,
    primaryAssetPath
  }
}

export function buildProjectContent (_ignoredLegacyArg, projectPath, projectName, projectType = DEFAULT_PROJECT_TYPE, projectOptions, finish) {
  let looksLikeBrandNewProject = false

  try {
    logger.info('[project folder] building project content', projectPath)

    if (!fse.existsSync(dir(projectPath, HAIKU_CONFIG_FILE))) {
      logger.info('[project folder] creating haiku config')

      looksLikeBrandNewProject = true

      fse.outputFileSync(dir(projectPath, HAIKU_CONFIG_FILE), dedent`
        module.exports = {
          type: '${projectType}',
          name: '${getSafeProjectName(projectPath, projectName)}'
        }
      `)
    }

    // Reload from the user's config in case they overrode ours
    const projectHaikuConfig = getProjectHaikuConfig(projectPath)

    const projectSemverVersion = projectHaikuConfig.version || FALLBACK_SEMVER_VERSION

    const {
      projectNameSafe,
      projectNameLowerCase,
      reactProjectName,
      primaryAssetPath
    } = getProjectNameVariations(projectPath)

    const organizationName = projectOptions.organizationName || FALLBACK_ORG_NAME
    const organizationNameLowerCase = organizationName.toLowerCase()

    const authorName = projectOptions.authorName || FALLBACK_AUTHOR_NAME

    // const nodeVersion = PLUMBING_PKG.engines.node
    // const npmVersion = PLUMBING_PKG.engines.npm
    // const electronVersion = PLUMBING_PKG.engines.electron
    const haikuPlayerVersion = PLAYER_PACKAGE_JSON.version // This json object should be loaded at the top
    const npmPackageName = `@haiku/${organizationNameLowerCase}-${projectNameLowerCase}`
    const humanTimestamp = moment().format('YYYYMMDDHHmmss')
    const autoGeneratedNotice = `This file was autogenerated by Haiku at ${humanTimestamp}.`
    const copyrightNotice = `Copyright (c) ${(new Date()).getFullYear()} ${organizationName}. All rights reserved.`
    // const embedPlayerJavascriptPath = `https://code.haiku.ai/scripts/player/HaikuPlayer.${haikuPlayerVersion}.js`
    // const embedPlayerJavascriptMinPath = `https://code.haiku.ai/scripts/player/HaikuPlayer.${haikuPlayerVersion}.min.js`

    if (!fse.existsSync(dir(projectPath, 'package.json'))) {
      fse.outputFileSync(dir(projectPath, 'package.json'), dedent`
        {
          "name": "${npmPackageName}",
          "version": "${projectSemverVersion}",
          "haiku": {
            "organization": "${organizationName}",
            "project": "${projectNameSafe}"
          },
          "authors": [
            "${authorName}",
            "Haiku <contact@haiku.ai>"
          ],
          "license": "LicenseRef-LICENSE",
          "main": "index.js",
          "dependencies": {
            "@haiku/player": "${haikuPlayerVersion}"
          }
        }
      `)
    }

    // Fix up the contents of the package.json if they happen to be wrong, e.g., organization name not set correctly
    let packageJson = fse.readJsonSync(dir(projectPath, 'package.json'), { throws: false })
    if (!packageJson) return finish(new Error('package.json was found to be empty/unreadable'))

    // Note that we _don't_  want to set back to 'unknown' if it's already set
    if (organizationName && organizationName !== FALLBACK_ORG_NAME) {
      if (packageJson.name !== npmPackageName) packageJson.name = npmPackageName
      if (packageJson.dependencies) packageJson.dependencies = {}
      if (!packageJson.dependencies['@haiku/player']) {
        packageJson.dependencies['@haiku/player'] = haikuPlayerVersion
      }

      logger.info('[project folder] @haiku/player version is', packageJson.dependencies['@haiku/player'])

      // If our player version is only a patch difference from theirs, go ahead and upgrade their player
      let upgradeDiff = semver.diff(packageJson.dependencies['@haiku/player'], haikuPlayerVersion)
      if (upgradeDiff === 'patch') {
        logger.info('[project folder] upgraded @haiku/player to', haikuPlayerVersion)
        packageJson.dependencies['@haiku/player'] = haikuPlayerVersion
      }
    }

    // Write the file assuming we may have made a change in any of the conditions above
    fse.writeJsonSync(dir(projectPath, 'package.json'), packageJson, { spaces: 2 })

    // Do npm stuff here since the following steps may require the installation to be complete first
    let projectDependencies = require(dir(projectPath, 'package.json')).dependencies
    return npmActions(projectPath, projectDependencies, (err) => {
      if (err) return finish(err)

      // This option is used when we initially set up a project before we've attempted to clone content that
      // may or may not exist on the remote. Since this case involves copying into a temp folder and then back
      // on top of the cloned content, we don't want to create anything that might inadvertently overwrite stuff.
      if (projectOptions.skipContentCreation) {
        logger.info('[project folder] skipping content creation (II)')
        return finish()
      }

      logger.info('[project folder] creating folders')

      fse.mkdirpSync(dir(projectPath, '.haiku'))
      fse.mkdirpSync(dir(projectPath, 'designs'))
      fse.mkdirpSync(dir(projectPath, 'code/main'))
      fse.mkdirpSync(dir(projectPath, 'public'))

      logger.info('[project folder] moving/updating legacy files')

      // Do a bunch of fix-ups that modify the folder content from legacy naming and folder structure.
      // We need to change this subroutine any time we make a change to the project content structure
      let filesToMove = {
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
      }
      for (let formerFilePath in filesToMove) {
        let nextFilePath = filesToMove[formerFilePath]
        if (fse.existsSync(dir(projectPath, formerFilePath))) {
          // I guess there is no 'moveSync', and 'copySync' acts weird, so here it is imperatively:
          let contentsToCopy = fse.readFileSync(dir(projectPath, formerFilePath)).toString()
          fse.outputFileSync(dir(projectPath, nextFilePath), contentsToCopy)
          fse.removeSync(dir(projectPath, formerFilePath))
        }
        // Now fix any legacy content that may be present inside of the updated file, e.g. references
        if (fse.existsSync(dir(projectPath, nextFilePath))) {
          let fileContents = fse.readFileSync(dir(projectPath, nextFilePath)).toString()
          fileContents.split('bytecode.js').join('code.js') // Respective to the code/main dir
          fileContents.split('interpreter.js').join('dom.js') // Respective to the code/main dir
          fse.outputFileSync(dir(projectPath, nextFilePath), fileContents)
        }
      }

      logger.info('[project folder] removing unneeded files')

      let filesToRemove = [
        'index.embed.html',
        'index.standalone.html'
      ]
      filesToRemove.forEach((fileToRemove) => {
        fse.removeSync(dir(projectPath, fileToRemove))
      })

      logger.info('[project folder] creating files')

      // Only write these files if they don't exist yet; don't overwrite the user's own content
      if (!fse.existsSync(dir(projectPath, 'code/main/code.js'))) {
        logger.info('[project folder] created main code file')

        fse.outputFileSync(dir(projectPath, 'code/main/code.js'), dedent`
          var Haiku = require('@haiku/player')
          module.exports = {
            metadata: {},
            options: {},
            states: {},
            eventHandlers: {},
            timelines: {
              Default: {}
            },
            template: {
              elementName: 'div',
              attributes: {
                'haiku-title': 'HaikuComponent'
              },
              children: []
            }
          }
        `)
      } else {
        // If the file already exists, we can run any migration steps we might want
        FileModel.astmod(dir(projectPath, 'code/main/code.js'), (ast) => {
          normalizeBytecodeFile(ast)
        })
      }

      // Other user data may have been written these, so don't overwrite if they're already present
      if (!fse.existsSync(dir(projectPath, '.haiku/comments.json'))) {
        fse.outputFileSync(dir(projectPath, '.haiku/comments.json'), dedent`
          []
        `)
      }

      // If it isn't already a part of the project, add the 'blank' sketch file to users' projects
      if (looksLikeBrandNewProject) {
        if (!fse.existsSync(dir(projectPath, primaryAssetPath))) {
          fse.copySync(path.join(PLUMBING_DIR, 'bins', 'sketch-42.sketch'), dir(projectPath, primaryAssetPath))
        }
      }

      fse.outputFileSync(dir(projectPath, 'README.md'), dedent`
        # ${projectNameSafe}

        This project was created with [Haiku](https://haiku.ai).

        ## Install

        \`\`\`
        $ haiku install ${projectNameSafe}
        \`\`\`

        ## Usage

        \`\`\`
        var ${projectNameSafe} = require('${npmPackageName}')
        \`\`\`

        ## Copyright

        ${copyrightNotice}
      `)

      fse.outputFileSync(dir(projectPath, 'LICENSE.txt'), dedent`
        ${autoGeneratedNotice}
        ${copyrightNotice}
      `)

      let embedName = `HaikuComponentEmbed_${organizationName}_${projectNameSafe}`
      let standaloneName = `HaikuComponent_${organizationName}_${projectNameSafe}`

      // But a bunch of ancillary files we take full control of and overwrite despite what the user did
      fse.outputFileSync(dir(projectPath, 'index.js'), dedent`
        /** ${autoGeneratedNotice} */
        // By default, a DOM module is exported; see code/main/* for other options
        module.exports = require('./code/main/dom')
      `)
      fse.outputFileSync(dir(projectPath, 'react.js'), dedent`
        /** ${autoGeneratedNotice} */
        // By default, a react-dom module is exported; see code/main/* for other options
        module.exports = require('./code/main/react-dom')
      `)
      fse.outputFileSync(dir(projectPath, 'react-bare.js'), dedent`
        /** ${autoGeneratedNotice} */
        // This only exports a React module into which a Haiku Player must be passed
        var React = require('react') // Installed as a peer dependency of '@haiku/player'
        var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
        var HaikuReactAdapter = require('@haiku/player/dom/react')
        var ${reactProjectName}_Bare = HaikuReactAdapter(null, require('./code/main/code'))
        if (${reactProjectName}_Bare.default) ${reactProjectName}_Bare = ${reactProjectName}_Bare.default
        module.exports = ${reactProjectName}_Bare
      `)

      fse.outputFileSync(dir(projectPath, 'code/main/dom.js'), dedent`
        /** ${autoGeneratedNotice} */
        var HaikuDOMAdapter = require('@haiku/player/dom')
        module.exports = HaikuDOMAdapter(require('./code'))
      `)
      fse.outputFileSync(dir(projectPath, 'code/main/dom-embed.js'), dedent`
        /** ${autoGeneratedNotice} */
        var code = require('./code')
        var adapter = window.HaikuPlayer && window.HaikuPlayer['${haikuPlayerVersion}']
        if (adapter) {
          module.exports = adapter(code)
        } else  {
          function safety () {
            console.error(
              '[haiku player] player version ${haikuPlayerVersion} seems to be missing. ' +
              'index.embed.js expects it at window.HaikuPlayer["${haikuPlayerVersion}"], but we cannot find it. ' +
              'you may need to add a <script src="path/to/HaikuPlayer.js"></script> to fix this. ' +
              'if you really need to load the player after this script, you could try: ' +
              'myHaikuPlayer(${embedName})(document.getElementById("myMountElement"))'
            )
            return code
          }
          for (var key in code) {
            safety[key] = code[key]
          }
          module.exports = safety
        }
      `)
      fse.outputFileSync(dir(projectPath, 'code/main/dom-standalone.js'), dedent`
        /** ${autoGeneratedNotice} */
        module.exports = require('./dom')
      `)
      fse.outputFileSync(dir(projectPath, 'code/main/react-dom.js'), dedent`
        /** ${autoGeneratedNotice} */
        var React = require('react') // Installed as a peer dependency of '@haiku/player'
        var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/player'
        var HaikuReactAdapter = require('@haiku/player/dom/react')
        var ${reactProjectName} = HaikuReactAdapter(require('./dom'))
        if (${reactProjectName}.default) ${reactProjectName} = ${reactProjectName}.default
        module.exports = ${reactProjectName}
      `)

      fse.outputFileSync(dir(projectPath, 'preview.html'), dedent`
        <!DOCTYPE html>
        <!-- ${autoGeneratedNotice} -->
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${projectNameSafe} | Preview | Haiku</title>
          <style>
            .container { margin: 0 auto; width: 100%; }
            #mount { width: 80%; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div id="mount"></div>
          </div>
          <script src="./index.standalone.js"></script>
          <script>
            ${standaloneName}(document.getElementById('mount'), {
              sizing: 'contain',
              loop: true
            })
          </script>
        </body>
        </html>
      `)

      // Should we try to merge these if the user made any changes?
      fse.outputFileSync(dir(projectPath, '.gitignore'), dedent`
        # ${autoGeneratedNotice}
        .DS_Store
        *.log
        *.*.log
        node_modules
        bower_components
        jspm_modules
        coverage
        build
        dist
        .env
      `)
      fse.outputFileSync(dir(projectPath, '.npmignore'), dedent`
        # ${autoGeneratedNotice}
        .DS_Store
        .git
        .svn
        *.log
        *.*.log
        *.ai
        *.sketch
        *.svg
        .env
        .haiku
      `)
      fse.outputFileSync(dir(projectPath, '.yarnignore'), dedent`
        # ${autoGeneratedNotice}
        .DS_Store
        .git
        .svn
        *.log
        *.*.log
        *.ai
        *.sketch
        *.svg
        .env
        .haiku
      `)
      fse.outputFileSync(dir(projectPath, '.npmrc'), dedent`
        # ${autoGeneratedNotice}
        registry=https://registry.npmjs.org/
        @haiku:registry=https://reservoir.haiku.ai:8910/
      `)
      fse.outputFileSync(dir(projectPath, '.yarnrc'), dedent`
        # ${autoGeneratedNotice}
        registry "https://registry.npmjs.org/"
        "@haiku:registry" "https://reservoir.haiku.ai:8910/"
      `)

      // Let the user skip this heavy step optionally, e.g. when just initializing the project the first time
      if (projectOptions.skipCDNBundles) {
        logger.info('[project folder] skipping cdn bundles')
        return finish()
      }

      logger.info('[project folder] creating cdn bundles')
      return async.series([
        function (cb) {
          let embedSource = fse.readFileSync(dir(projectPath, 'code/main/dom-embed.js')).toString()
          logger.info('[project folder] browserifying code/main/dom-embed.js')
          return Browserify.createBundle(dir(projectPath, 'code/main'), embedSource, embedName, {}, (err, browserifiedContents) => {
            if (err) return cb(err)
            logger.info('[project folder] browserify succeeded for', embedName)
            let finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${browserifiedContents}`
            fse.outputFileSync(dir(projectPath, 'index.embed.js'), finalContent)
            return cb()
          })
        },
        function (cb) {
          let standaloneSource = fse.readFileSync(dir(projectPath, 'code/main/dom-standalone.js')).toString()
          logger.info('[project folder] browserifying code/main/dom-standalone.js')
          return Browserify.createBundle(dir(projectPath, 'code/main'), standaloneSource, standaloneName, {}, (err, browserifiedContents) => {
            if (err) return cb(err)
            logger.info('[project folder] browserify succeeded for', standaloneName)
            let finalContent = `/** ${autoGeneratedNotice}\n${copyrightNotice}\n*/\n${browserifiedContents}`
            fse.outputFileSync(dir(projectPath, 'index.standalone.js'), finalContent)
            return cb()
          })
        }
      ], (err, results) => {
        if (err) return finish(err)
        return finish(null, results[results.length - 1])
      })
    })
  } catch (exception) {
    logger.error('[project folder] ' + exception)
    return finish(exception)
  }
}

export function semverBumpPackageJson (projectPath, maybeVersionToBumpTo, cb) {
  try {
    var jsonPath = path.join(projectPath, 'package.json')

    logger.info(`[project folder] semver bump: checking ${jsonPath}`)

    const pkg = fse.readJsonSync(jsonPath)

    let newVersion

    // Allow a version to be specified explicitly. This turns out to be useful in plumbing/master
    // where we might find a previously-used tag and need to explicitly bump from it, instead of using
    // what might be defined in the package.json.
    if (maybeVersionToBumpTo) {
      logger.info(`[project folder] semver bump: got explicit version ${maybeVersionToBumpTo}`)
      newVersion = maybeVersionToBumpTo
    } else {
      const prevVersion = pkg.version || FALLBACK_SEMVER_VERSION
      logger.info(`[project folder] semver bump: found previous version ${prevVersion}`)
      newVersion = semver.inc(prevVersion, 'patch')
    }

    logger.info(`[project folder] semver bump: assigning version ${newVersion}`)

    pkg.version = newVersion
    const newJson = JSON.stringify(pkg, null, 2) + '\n'
    fse.writeFileSync(jsonPath, newJson)

    return cb(null, newVersion)
  } catch (exception) {
    return cb(exception)
  }
}
